module H52D_Framework {
    export enum MemoryType {
        equip = 1
    }
    /**
     * @class：时段记忆管理类
     * @author：zhangyusong
     */
    export class MemoryLogic {

        private static instance: MemoryLogic;
        public static get Instance(): MemoryLogic {
            if (this.instance == null) {
                this.instance = new MemoryLogic();
            }
            return this.instance;
        }

        /** 副本挑战次数 */
        public copyBattleArray: Object[];

        public challengeData: any = null;

        private fireData: any = null;
        /** 记录当前到达哪关 */
        private tCurDungeonIdx = {}
        /** 副本的星星 */
        private tDungeonStar = {}
        /** 通关次数 */
        private tDungeonClearedTimes = {}
        /** 已购买挑战次数 */
        private tBuyDungeonTimes = {}
        /** 附加次數(不清除的) */
        private tAdditionDungeonTimes = {}
        /** 体力 */
        private nPower = 0;
        /** 剩余时间 */
        private nSurplusTime = 0;
        /** 体力刷新时间戳 */
        private nRecoverTime = 0
        /** 购买体力次数 */
        private nBuyPowerTimes = 0;
        /** 记录上一场战斗之前的星星 */
        private tLastDungeonStar = {}

        /**FB通用的布阵信息 */
        private _memorywar: { [pos: number]: number } = {};

        private _HeroWar: { [HeroID: number]: number } = {};

        private _PositionWar: { [pos: number]: number } = {};

        private _bChange: boolean = false;

        /**FB通用神兽信息 */
        private _cutPetID: { [type: number]: number } = {};

        /** 体力 */
        public set Power(nPower) {
            this.nPower = nPower;
            Event.DispatchEvent("PowerFrush");
        }

        /** 体力 */
        public get Power() {
            return this.nPower;
        }

        /** 体力恢复 */
        public PowerUpdate() {
            if (this.Power >= GameParamConfig["PowerMax"]) {
                this.RecoverTime = Time.serverSecodes;
                return;
            }
            let hasTimes = Time.serverSecodes - this.RecoverTime;
            let powerSpeed: number = Number(GameParamConfig["PowerSpeed"]);
            if (hasTimes >= powerSpeed) {
                let nTimes = Math.floor(hasTimes / powerSpeed)
                this.RecoverTime = Time.serverSecodes;
                // 恢复体力1点
                this.Power += nTimes;
                if (this.Power > GameParamConfig.PowerMax) {
                    this.Power = GameParamConfig.PowerMax;
                }
            }
            this.surplusTime = powerSpeed - (hasTimes % powerSpeed);
        }

        public get bChange() {
            return this._bChange;
        }

        public set bChange(value) {
            this._bChange = value;
        }

        /** 刷新time */
        public set RecoverTime(nRecoverTime) {
            this.nRecoverTime = nRecoverTime
        }

        /** 刷新time */
        public get RecoverTime() {
            if (this.nRecoverTime == 0) {
                this.nRecoverTime = Time.serverSecodes;
            }
            return this.nRecoverTime;
        }

        /** 购买体力次数 */
        public set BuyPowerTimes(nBuyPowerTimes) {
            this.nBuyPowerTimes = nBuyPowerTimes;
        }

        /** 购买体力次数 */
        public get BuyPowerTimes() {
            return this.nBuyPowerTimes;
        }

        public get war() {
            return this._memorywar;
        }
        public set war(value) {
            this._memorywar = value;
        }

        /**获取神兽ID */
        public GetPetID(type: number) {
            return this._cutPetID[type] || 0
        }

        /** 剩余时间 */
        public set surplusTime(value: number) {
            this.nSurplusTime = value;
        }

        public get surplusTime() {
            return this.nSurplusTime;
        }

        /** 是否拥有下一关 */
        public hasNextCustoms() {
            //当前关卡ID
            let currentId: number = MemoryLogic.Instance.GetCurDungeonIdx(MemoryType.equip);
            //解锁最后关卡ID
            let lastId = 0;
            let dataList = CopyConfig[MemoryType.equip];
            for (let i in dataList) {
                let vo = CustomsManager.Instance.CustomsVo;
                if (vo != null &&
                    dataList[i].CustomsNum <= CustomsManager.Instance.CustomsVo.customsOrder &&
                    lastId < dataList[i].CopyId) {
                    lastId = dataList[i].CopyId;
                }
            }
            //当前关之后还有解锁关卡
            return currentId < lastId;
        }

        /** 初始化 */
        public Initialize() {
            RemoteCall.Instance.RegistJXS2CProtocol("C_SendMaterialsDungeonInfo", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqPassDungeon", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqBuyDungeonTimes", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_SaveCopyBattleArray", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_RepGetBattleArray", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqCopyUsePet", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqGetCopyUsePet", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqBuyPower", this);
        }

        /** 每日更新 */
        public OnDay() {
            this.tDungeonClearedTimes = {}
            this.tBuyDungeonTimes = {}
            Event.DispatchEvent("ChallengeFrush");
        }

        public OpenChallenge() {
            if (this.challengeData) {
                UIManager.Instance.CreateUI("MemoryChallengeView", [ViewDownRoot]);
            }
        }

        /** 购买体力回调 */
        public C_ReqBuyPower(value) {
            this.BuyPowerTimes = value[0];
            this.Power = value[1];
            Event.DispatchEvent("MemoryFrush");
            Event.DispatchEvent("ReqBuyPower");
        }

        /**保存阵容 回掉 */
        private C_SaveCopyBattleArray(buf) {
            let data = buf[0];
            TipsLogic.Instance.OpenSystemTips("保存成功！");
        }

        /** 上线同步 */
        private C_SendMaterialsDungeonInfo(buf) {
            this.tCurDungeonIdx = buf[0]
            this.tDungeonStar = buf[1]
            this.tDungeonClearedTimes = buf[2]
            this.tBuyDungeonTimes = buf[3]
            this.tAdditionDungeonTimes = buf[4]
        }

        /** 战斗 */
        public Fighting() {
            if (UIManager.Instance.IsHave("StrongerView", ViewDownRoot)) {
                UIManager.Instance.DestroyUI("StrongerView", [ViewDownRoot])
            }
            UIManager.Instance.DestroyUI("MemoryView", [ViewDownRoot]);
            UIManager.Instance.DestroyUI("MemoryChallengeView", [ViewDownRoot]);
            BattleManager.Instance.copyid = this.challengeData.CopyId;
            CustomsManager.Instance.EnterCustoms(this.challengeData.CustomsId);
            DropManager.Instance.Destroy();
            Event.DispatchEvent("ShowDeputy");
        }

        /** 通过副本回调 */
        private C_ReqPassDungeon(buf) {
            let nType = buf[0]
            let nCopyId = buf[1]
            let nWin = buf[2]
            let tStar = buf[3]
            let tAllAward = buf[4]
            // 胜利
            if (nWin == 1) {
                // 更新体力
                this.Power -= this.challengeData.NeedPower;
                //先扣除附加次数，
                if (this.GetAdditionDungeonTimes(nType, nCopyId) > 0) {
                    // 附加次数-1
                    if (this.tAdditionDungeonTimes[nType] == null) {
                        this.tAdditionDungeonTimes[nType] = {}
                    }
                    this.tAdditionDungeonTimes[nType][nCopyId] = this.GetAdditionDungeonTimes(nType, nCopyId) - 1

                } else {
                    // 更新通关次数
                    if (this.tDungeonClearedTimes[nType] == null) {
                        this.tDungeonClearedTimes[nType] = {}
                    }
                    if (this.tDungeonClearedTimes[nType][nCopyId] == null) {
                        this.tDungeonClearedTimes[nType][nCopyId] = 1
                    } else {
                        this.tDungeonClearedTimes[nType][nCopyId] += 1
                    }
                }


                if (CustomsManager.Instance.CustomsVo.customsType == Customs_Type.Customs) {
                    TipsLogic.Instance.OpenGoodsProTips(tAllAward);
                    Event.DispatchEvent("ChallengeFrush");
                }
                else if (CustomsManager.Instance.CustomsVo.customsType == Customs_Type.Memory) {
                    // 更新当前关卡
                    if (this.tCurDungeonIdx[nType] == null) {
                        this.tCurDungeonIdx[nType] = nCopyId
                    } else {
                        if (nCopyId > this.tCurDungeonIdx[nType]) {
                            this.tCurDungeonIdx[nType] = nCopyId
                        }
                    }
                    this.tLastDungeonStar = {}
                    // 更新当前星星
                    if (this.tDungeonStar[nType] == null) {
                        this.tDungeonStar[nType] = {}
                    }
                    if (this.tDungeonStar[nType][nCopyId] == null) {
                        this.tDungeonStar[nType][nCopyId] = tStar
                    } else {
                        for (let idx in tStar) {
                            let nOldStar = 0;
                            if (!!this.tDungeonStar[nType][nCopyId][idx]) {
                                nOldStar = this.tDungeonStar[nType][nCopyId][idx]
                            }
                            this.tLastDungeonStar[idx] = nOldStar;
                            this.tDungeonStar[nType][nCopyId][idx] = tStar[idx];
                        }
                    }
                    UIManager.Instance.CreateUI("MemoryResultView", [ViewUpRoot, nType, nCopyId, nWin, tAllAward]);
                }
            }
            else {
                UIManager.Instance.CreateUI("MemoryResultView", [ViewUpRoot, nType, nCopyId, nWin, tAllAward]);
            }
        }

        /** 购买挑战次数回调 */
        private C_ReqBuyDungeonTimes(buf) {
            let nType = buf[0]
            let nCopyId = buf[1]
            let nTimes = buf[2]
            if (this.tBuyDungeonTimes[nType] == null) {
                this.tBuyDungeonTimes[nType] = {}
            }
            if (this.tAdditionDungeonTimes[nType] == null) {
                this.tAdditionDungeonTimes[nType] = {}
            }
            this.tBuyDungeonTimes[nType][nCopyId] = this.GetBuyDungeonTimes(nType, nCopyId) + nTimes;
            this.tAdditionDungeonTimes[nType][nCopyId] = this.GetAdditionDungeonTimes(nType, nCopyId) + nTimes;
            Event.DispatchEvent("ChallengeFrush");
        }

        /**回掉 获取布阵的类型信息 */
        private C_RepGetBattleArray(buf) {
            let ntype = buf[0];
            this._memorywar = buf[1];
            if (buf[1] == null) {
                this._memorywar = {};
            }
        }

        /**请求副本上阵神兽 */
        private C_ReqCopyUsePet(buf) {
            let ntype = buf[0];
            this._cutPetID[ntype] = buf[1];
            Event.DispatchEvent("UpdatePetView");
        }
        /**请求获取副本上阵神兽 */
        private C_ReqGetCopyUsePet(buf) {
            let ntype = buf[0];
            this._cutPetID[ntype] = buf[1];
        }

        /** 请求通关副本 */
        public ReqPassDungeon(nType, nCopyId, nWin, tStar) {
            RemoteCall.Instance.Send('K_ReqPassDungeon', nType, nCopyId, nWin, tStar);
        }

        /** 请求购买挑战次数 */
        public K_ReqBuyDungeonTimes(nType, nCopyId, nBuyTimes) {
            RemoteCall.Instance.Send('K_ReqBuyDungeonTimes', nType, nCopyId, nBuyTimes)
        }

        /**请求保存阵容  FB */
        public K_SaveCopyBattleArray(Type: number, savewar: { [pos: number]: number }) {
            RemoteCall.Instance.Send("K_SaveCopyBattleArray", Type, savewar);
        }

        /**请求FB 布阵信息 */
        public K_RepGetBattleArray(Type: number) {
            RemoteCall.Instance.Send("K_RepGetBattleArray", Type)
        }

        /**请求FB 上阵副本神兽 */
        public K_ReqCopyUsePet(Type: number, nPetID) {
            RemoteCall.Instance.Send("K_ReqCopyUsePet", Type, nPetID)
        }

        /**请求FB 获取上阵副本神兽 */
        public K_ReqGetCopyUsePet(Type: number) {
            RemoteCall.Instance.Send("K_ReqGetCopyUsePet", Type)
        }

        /** 打开时段记忆UI */
        public ActivityInfo() {
            this.K_RepGetBattleArray(ActionType.memory);
            this.K_ReqGetCopyUsePet(ActionType.memory);
            UIManager.Instance.CreateUI("MemoryView", [ViewDownRoot]);
        }

        /** 进入挑战战场 */
        public EnterChallenge() {
            if (GetTabLength(this.war) == 0) {
                //请先进行英雄布阵
                TipsLogic.Instance.OpenMessageBox(30063, Laya.Handler.create(this, () => {
                    Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_14);
                }));
            }
            else {
                if (this.ChallengeCondition()) {
                    UIManager.Instance.DestroyUI("MemoryChallengeView", [ViewDownRoot]);
                    this.Fighting();
                }
            }
        }

        /** 挑战条件判断 */
        public ChallengeCondition(): boolean {
            //判断体力值是否足够
            if (this.Power >= this.challengeData.NeedPower) {
                //判断当前关卡剩余挑战次数是否足够
                if (this.challengeNum > 0) {
                    return true;
                }
                else {
                    TipsLogic.Instance.OpenSystemTips(30065);

                    let my_num: number = GameParamConfig.CopyBuyMaxNum - MemoryLogic.Instance.GetBuyDungeonTimes(MemoryType.equip, this.challengeData.CopyId);
                    if (my_num > 0) {
                        UIManager.Instance.CreateUI("BuyMemoryTimesView", [ViewDownRoot]);
                    }
                }
            }
            else {
                //判断是否有剩余购买次数
                if (this.BuyPowerTimes > 0) {
                    UIManager.Instance.CreateUI("BuyMemoryPowerView", [ViewDownRoot]);
                }
                else {
                    TipsLogic.Instance.OpenSystemTips(30064);
                }
            }
            return false;
        }

        /** 获取当前打到哪关 */
        public GetCurDungeonIdx(nType) {
            if (!this.tCurDungeonIdx || !this.tCurDungeonIdx[nType]) {
                return 0
            }
            return this.tCurDungeonIdx[nType];
        }

        /** 获取副本星星 */
        public GetDungeonStar(nType, nCopyId) {
            let tStar = { [1]: 0, [2]: 0, [3]: 0 };
            if (this.tDungeonStar[nType] != null && this.tDungeonStar[nType][nCopyId] != null) {
                let dungeonStar = this.tDungeonStar[nType][nCopyId];
                for (let i: number = 1; i <= 3; i++) {
                    if (dungeonStar[i]) {
                        tStar[i] = dungeonStar[i]
                    }
                }
            }
            return tStar;
        }

        /** 获取上一场战斗之前的星星 */
        public GetLastDungeonStar() {
            let tStar = {}
            for (let i: number = 1; i <= 3; i++) {
                if (!this.tLastDungeonStar[i]) {
                    tStar[i] = 0
                } else {
                    tStar[i] = this.tLastDungeonStar[i]
                }
            }
            return tStar
        }

        public get challengeNum(): number {
            let cnum: number = this.challengeData.DailyFreeNum +
                this.GetAdditionDungeonTimes(MemoryType.equip, this.challengeData.CopyId) -
                this.GetDungeonClearedTimes(MemoryType.equip, this.challengeData.CopyId);
            if (cnum < 0) {
                cnum = 0;
            }
            return cnum;
        }

        /** 获取今天通关次数 */
        public GetDungeonClearedTimes(nType, nCopyId) {
            if (this.tDungeonClearedTimes == null) {
                return 0
            }
            if (this.tDungeonClearedTimes[nType] == null) {
                return 0
            }
            if (this.tDungeonClearedTimes[nType][nCopyId] == null) {
                return 0
            }
            return this.tDungeonClearedTimes[nType][nCopyId]
        }

        /** 获取今天购买挑战次数 */
        public GetBuyDungeonTimes(nType, nCopyId) {
            if (!this.tBuyDungeonTimes || this.tBuyDungeonTimes[nType] == null || this.tBuyDungeonTimes[nType][nCopyId] == null) {
                return 0
            }
            return this.tBuyDungeonTimes[nType][nCopyId];
        }
        /** 获取附加挑战次数 */
        public GetAdditionDungeonTimes(nType, nCopyId) {
            if (!this.tAdditionDungeonTimes[nType]) {
                return 0
            }
            return this.tAdditionDungeonTimes[nType][nCopyId] || 0;
        }
        /** 当前布阵英雄位置信息 */
        public get HeroWar() {
            return this._HeroWar;
        }

        /** 放置英雄 */
        public PutHero(nPos, nHeroID) {
            // 目标位置当前英雄ID
            let nLastHeroID = this._memorywar[nPos];
            // 目标英雄上一个位置
            let nLastPos = this._HeroWar[nHeroID];
            if (nLastHeroID != null) {
                this._HeroWar[nLastHeroID] = nLastPos;
                this._bChange = true;
            }
            if (nLastPos != null) {
                this._memorywar[nLastPos] = nLastHeroID;
                this._bChange = true;
            }
            this._memorywar[nPos] = nHeroID;
            this._HeroWar[nHeroID] = nPos;
        }

        /** 判断是否在阵容上 */
        public IsInWar(nHeroID) {
            return this._HeroWar[nHeroID] != null;
        }

        public getwar() {
            for (let key in this._memorywar) {
                let nId = this._memorywar[key];
                if (!nId) {
                    delete this._memorywar[key];
                }
            }
            return this._memorywar;
        }

        /**判断是否在保存的阵容上 */
        public IsInSaveWar(pos, nHeroID) {
            let war = MasterPlayer.Instance.player.HeroWarList;
            for (let nIdx in war) {
                if (war[nIdx] == nHeroID) {
                    return true;
                }
            }
            return false;
        }

        /** 初始化阵容信息 */
        public InitPosInfo() {
            this._PositionWar = {};
            this._HeroWar = {};
            let HeroWarList = this._memorywar;
            for (let pos in HeroWarList) {
                let nHeroID = HeroWarList[pos];
                this.PutHero(pos, nHeroID)
            }
            this._bChange = false;
        }
    }
}