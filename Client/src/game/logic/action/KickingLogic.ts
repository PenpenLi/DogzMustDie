module H52D_Framework {
    /**
     * @class：王者约战管理类
     * @author：zhangyusong
     */
    export class KickingLogic {
        public surplusGold: number;
        public surplusDiamonds: number;
        /** 玩家的战斗数据 */
        public fireData: any = null;
        /** pvp神兽ID */
        public petId: number = 0;
        /** 房间类型 */
        public roomType: number = BaseDefine.ItemIdGold;
        /***pk阵容信息 */
        private _kickingwar: { [pos: number]: number } = {};
        private _kickingherolist: Array<number> = [];
        private currentVo: PvpRoomVo;

        private _win_alawys = 0;
        private _PositionWar: { [pos: number]: number } = {};
        private _HeroWar: { [HeroID: number]: number } = {};
        private _bChange: boolean = false;
        private static instance: KickingLogic;
        public static get Instance(): KickingLogic {
            if (this.instance == null) {
                this.instance = new KickingLogic();
            }
            return this.instance;
        }

        public get war() {
            return this._kickingwar;
        }
        public set war(value) {
            this._kickingwar = value;
        }

        public get bChange() {
            return this._bChange;
        }
        public set bChange(value) {
            this._bChange = value;
        }

        public set ChallengeNum(challengeNum: any) {
            this.surplusGold = GameParamConfig["ParticipationMaxNum"][1] -
                (challengeNum[BaseDefine.ItemIdGold] || 0);
            this.surplusDiamonds = GameParamConfig["ParticipationMaxNum"][2] -
                (challengeNum[BaseDefine.ItemIdDiamonds] || 0);
        }

        /** 增加金币挑战次数 */
        public AddSurplus(num: number) {
            if (this.roomType == BaseDefine.ItemIdGold) {
                this.surplusGold += num;
            }
            else if (this.roomType == BaseDefine.ItemIdDiamonds) {
                this.surplusDiamonds += num;
            }
            TipsLogic.Instance.OpenSystemTips(30072);
            Event.DispatchEvent("KickingChooseUpdate");
        }

        /**英雄的id数组 */
        public get herolist() {
            return this._kickingherolist;
        }
        public set herolist(value) {
            this._kickingherolist = value;
        }

        /** 当前布阵英雄位置信息 */
        public get HeroWar() {
            return this._HeroWar;
        }

        public get sceneId(): number {
            let sceneId: number = this.currentVo ? this.currentVo.customsId : 0;
            return sceneId;
        }

        public Initialize() {
            // this.petId = PetManager.Instance.CurrentpetID;
            this.InitEvent();
        }

        public GetwarInfo() {
            this._kickingherolist = [];
            for (let key in this._kickingwar) {
                let nId = this._kickingwar[key];
                if (nId) {
                    this._kickingherolist.push(nId);
                }
            }
            return this._kickingherolist;
        }

        public getwar() {
            for (let key in this._kickingwar) {
                let nId = this._kickingwar[key];
                if (!nId) {
                    delete this._kickingwar[key];
                }
            }
            return this._kickingwar;
        }

        /** 初始化阵容信息 */
        public InitPosInfo() {
            this._PositionWar = {};
            this._HeroWar = {};
            let HeroWarList = this._kickingwar;
            for (let pos in HeroWarList) {
                let nHeroID = HeroWarList[pos];
                this.PutHero(pos, nHeroID)
            }
            this._bChange = false;
        }
        /** 当前布阵信息 */
        public get PositionWar() {
            return this._PositionWar
        }

        public set PositionWar(value) {
            this._PositionWar = value;
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

        /** 判断是否在阵容上 */
        public IsInWar(nHeroID) {
            return this._HeroWar[nHeroID] != null;
        }

        /** 放置英雄 */
        public PutHero(nPos, nHeroID) {
            // 目标位置当前英雄ID
            let nLastHeroID = this._kickingwar[nPos];
            // 目标英雄上一个位置
            let nLastPos = this._HeroWar[nHeroID];

            if (nLastHeroID != null) {
                this._HeroWar[nLastHeroID] = nLastPos;
                this._bChange = true;
            }
            if (nLastPos != null) {
                this._kickingwar[nLastPos] = nLastHeroID;
                this._bChange = true;
            }
            this._kickingwar[nPos] = nHeroID;
            this._HeroWar[nHeroID] = nPos;
        }

        /**请求更新玩家战斗数据*/
        public UpdateCombatInfo() {
            if (GetTabLength(this.fireData["Hero"]) == 0) {
                return
            }
            RemoteCall.Instance.Send("K_ReqUpdateCombatInfo", this.fireData);
        }

        /***Pvp 连胜 */
        public Win_alawys() {
            if (this._win_alawys == 5 || this._win_alawys == 10) {
                let rew = GameParamConfig.KingsSuccessiveVictoryDiamond;
                let d_num = 0;
                for (let key in rew) {
                    let ncfg = rew[key];
                    if (ncfg[1] == this._win_alawys) {
                        d_num = ncfg[2];
                    }
                }
                UIManager.Instance.CreateUI("StreakWinView", [ViewToppestRoot, 5028, 6038, this._win_alawys, d_num]);
            }
        }

        /**
         * 请求匹配
         * nRoomType -- 房间类型
         * nRoomID -- 房间ID
         * tInfo -- 玩家战斗数据
         */
        public PvpMatching(nRoomType, nRoomID, currentVo) {
            this.roomType = nRoomType;
            this.currentVo = currentVo;
            RemoteCall.Instance.Send("K_ReqPvpMatching", nRoomType, nRoomID, this.fireData);
        }

        private InitEvent() {
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqPvpMatching", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqPvpCombatEnd", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqPvpActivityInfo", this);
        }

        /**
         * 匹配返回数据
         * code -- 错误码
         * nRoomType -- 房间类型
         * nRoomID -- 房间ID
         * tInfo -- 玩家战斗数据
         * tOtherInfo -- 对手数据
         */
        private C_ReqPvpMatching(buf) {
            let code = buf[0];
            let roomType = buf[1];
            let roomID = buf[2];
            let otherInfo = buf[3];//对手的数据
            if (code == 1) {//成功
                UIManager.Instance.DestroyUI("KickingChooseView", [ViewUpRoot]);
                DataManager.Instance.ReciveData(otherInfo);
                CustomsManager.Instance.EnterCustoms(this.currentVo.customsId);
                DropManager.Instance.Destroy();
                Event.DispatchEvent("ShowDeputy");
            }
            else if (code == 2) {//已经在战斗中
                TipsLogic.Instance.OpenSystemTips("已经在战斗中");
            }
            else {//没有匹配到玩家
                TipsLogic.Instance.OpenSystemTips("没有匹配到玩家");
            }
        }
        private showReward: boolean = true;
        /**
         * 请求结束战斗
         * nStar -- 结算评星级
         * nWin -- 1 胜利 2 失败 0 平局
         */
        public PvpCombatEnd(nStar, nWin, showReward: boolean = true) {
            this.showReward = showReward;
            RemoteCall.Instance.Send("K_ReqPvpCombatEnd", nStar, nWin);
        }
        /**
         * 结束战斗返回
         * nStar -- 结算评星级
         * nWin -- 1 胜利 2 失败 0 平局
         * tAllAward -- 奖励
         */
        private C_ReqPvpCombatEnd(buf) {
            let nStar = buf[0];
            let nWin = buf[1];
            let roomType = buf[2];
            let money = buf[3];
            if (roomType == BaseDefine.ItemIdGold) {
                this.surplusGold--;
                Event.DispatchEvent(EventDefine.ADD_GOLD);
            }
            else if (roomType == BaseDefine.ItemIdDiamonds) {
                this.surplusDiamonds--;
                Event.DispatchEvent(EventDefine.ADD_DIAMONDS);
            }
            //播放结束音效
            if (nWin == 1) {
                SoundManager.Instance.OnPlaySound("res/sound/succese.mp3");
            }
            else if (nWin == 2) {
                SoundManager.Instance.OnPlaySound("res/sound/fail.mp3");
            }
            if (this.showReward) {
                UIManager.Instance.CreateUI("KickingResultView", [ViewToppestRoot, nStar, nWin, roomType, money]);
            }
            this._win_alawys = buf[4];
        }

        /** 请求活动数据 */
        public ActivityInfo() {
            if (this.fireData == null) {
                RemoteCall.Instance.Send("K_ReqPvpActivityInfo");
            }
            else {
                UIManager.Instance.CreateUI("KickingChooseView", [ViewUpRoot]);
            }
        }

        /**活动数据返回*/
        private C_ReqPvpActivityInfo(buf: any) {
            let tData = buf[0];
            let tInfo = tData[1]
            let bSave = CacheManager.Instance.getDerailByType(CacheTypeEnum.common, CacheTypeCommon.pvpSaveCombat)
            if (ObjIsEmpty(tInfo) || (!bSave)) {
                DataManager.Instance.MainPackData(true);
                tInfo = DataManager.Instance.packdata.Info
            }
            this.fireData = tInfo;
            if (GetTabLength(tInfo.Pet) != 0) {
                this.petId = tInfo.Pet[0].id;
            } else {
                this.petId = 0;
            }
            this._PositionWar = this.fireData.Hero;
            this.ChangeWar();
            UIManager.Instance.CreateUI("KickingChooseView", [ViewUpRoot]);
        }

        private ChangeWar() {
            for (let key in this._PositionWar) {
                let nhero = this._PositionWar[key];
                this._kickingwar[nhero["location"]] = nhero["id"];
            }
        }

        /**给服务器发送 保存战斗的阵容信息 */
        public KickingWarInfo(kickwar: { [pos: number]: number }) {
            this._kickingwar = kickwar;
            TipsLogic.Instance.OpenSystemTips("保存成功！");
            DataManager.Instance.PackData();

            Event.DispatchEvent("ReshView_ladder");
        }

        public ShowRedPrint(): boolean {
            let join: boolean = false;

            return join;
        }
    }
}