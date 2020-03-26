module H52D_Framework {
    /**阶段状态枚举 */
    export enum MacthType {
        /**未开启阶段 */
        eUnopened = 0,
        /**海选阶段（报名阶段） */
        eApply = 1,
        /**16强押注 */
        eLeagueBet16 = 2,
        /**16强开战 */
        eLeagueWar16 = 3,
        /**8强押注 */
        eLeagueBet8 = 4,
        /**8强开战 */
        eLeagueWar8 = 5,
        /**4强押注 */
        eLeagueBet4 = 6,
        /**4强开战 */
        eLeagueWar4 = 7,
        /**2强押注 */
        eLeagueBet2 = 8,
        /**2强开战 */
        eLeagueWar2 = 9,
        /**决赛押注 */
        eLeagueBet1 = 10,
        /**决赛开战 */
        eLeagueWar1 = 11,
        /**结算阶段 */
        eLeagueOver = 12,
        /**报名玩家不足不能进行比赛 */
        eNotPass = 13
    }
    /**     * 配对位置     */
    export enum StanceType {
        eLeft = 1, // 左边
        eRight = 2, // 右边
    }

    /**
     * @class：PK联赛管理类
     * @author：fengxu
     */
    export class MatchLogic {
        private static instance: MatchLogic;
        public static get Instance(): MatchLogic {
            if (this.instance == null) {
                this.instance = new MatchLogic();
            }
            return this.instance;
        }
        //一个防止反复发送打开页面的判断
        public isAllredaySendOpen: boolean = false;

        //排行榜数据
        private _rankAllArray: { [index: number]: Object[] } = {};
        //自身排行数据 0排名（-1未上榜） 1伤害
        private _OwnRank = [];

        //进入总决赛玩家数据
        private _playerInfoArrayLeft: { [index: number]: Object[] } = {};
        private _playerInfoArrayRight: { [index: number]: Object[] } = {};
        private _championPlayerInfoAll: { [index: number]: Object } = {};

        //当前是多少强决赛
        private _currentTypeNum: number;

        /**FB通用的布阵信息 */
        private _matchwar: { [pos: number]: number } = {};

        private _HeroWar: { [HeroID: number]: number } = {};

        private _PositionWar: { [pos: number]: number } = {};

        private _bChange: boolean = false;

        /**FB通用神兽信息 */
        private _cutPetID: { [type: number]: number } = {};

        //当前阶段总点赞次数
        private _totalPraiseTimes: number;
        //当前阶段已点赞次数
        private _praiseTimes: number;

        //当前是哪一阶段
        private _curMatchStage: MacthType;

        //当前阶段点赞花费
        private _curPraiseCost: number;

        //当前阶段押注信息
        private _curPraiseInfo: { [pos: number]: number } = {};

        //当前对战列表
        private _curFightPlayerList: { [index: number]: Object[] } = {};

        //获取排行榜数据
        public GetRankData() {
            return this._rankAllArray;
        }

        //当前阶段结束时间时间  19:30
        private _curTimestamp: any;
        //当前阶段结束剩余时间（s）
        private _surplusTime: number;

        //是否是观战阶段
        private _isSeeStage: boolean;

        /** 自身的战斗数据 */
        public fireData: any = null;

        /**当前战斗哪方获胜 返回StanceType 1  2 */
        public winnerIndexInGroup: number = 0;

        /**对战双方姓名 */
        private _player1Name: string;
        private _player2Name: string;

        /**是否观看完成决赛战斗 默认为true在观战阶段直接显示胜负，默认false观战比赛之后显示胜负*/
        private _isWatchMatch: boolean = true;

        public get isWatchMatch() {
            return this._isWatchMatch;
        }
        public set isWatchMatch(value: boolean) {
            this._isWatchMatch = value;
        }

        public get ownRank() {
            return this._OwnRank;
        }

        public get war() {
            return this._matchwar;
        }
        public set war(value) {
            this._matchwar = value;
        }

        public get bChange() {
            return this._bChange;
        }

        public set bChange(value) {
            this._bChange = value;
        }

        public get curMatchStage() {
            return this._curMatchStage;
        }

        public set curMatchStage(value) {
            this._curMatchStage = value;
        }

        public get curTimestamp() {
            return this._curTimestamp;
        }

        public set cruTimestamp(value) {
            this._curTimestamp = value;
        }

        public get totalPraiseTimes() {
            return this._totalPraiseTimes;
        }

        public get curPraiseCost() {
            return this._curPraiseCost;
        }

        public get isSeeStage() {
            return this._isSeeStage;
        }

        public get currentTypeNum() {
            return this._currentTypeNum;
        }

        public get praiseTimes() {
            return this._praiseTimes;
        }
        public set praiseTimes(value) {
            this._praiseTimes = value;
        }

        public get curPraiseInfo() {
            return this._curPraiseInfo;
        }
        public set curPraiseInfo(value) {
            this._curPraiseInfo = value;
        }

        public get curFightPlayerList() {
            return this._curFightPlayerList;
        }

        public get Player1Name(): string {
            return this._player1Name;
        }
        public set Player1Name(value: string) {
            this._player1Name = value;
        }
        public get Player2Name(): string {
            return this._player2Name;
        }
        public set Player2Name(value: string) {
            this._player2Name = value;
        }

        public get ChampionPlayerInfoAll() {
            return this._championPlayerInfoAll;
        }

        public Initialize() {
            //RemoteCall.Instance.RegistJXS2CProtocol('C_ReqLeagueHitRank', this);
            RemoteCall.Instance.RegistJXS2CProtocol('C_ReqLeagueHit', this);
            RemoteCall.Instance.RegistJXS2CProtocol('C_ReqPKLeagueState', this);
            RemoteCall.Instance.RegistJXS2CProtocol('C_ReqWatchLeague', this);
            RemoteCall.Instance.RegistJXS2CProtocol('C_ReqLeagueBetInfo', this);
            RemoteCall.Instance.RegistJXS2CProtocol('C_ReqInformWatch', this);
        }

        /** 用于显示红点 */
        public hasTime() {
            let dayOfTheWeek = Time.serverTime.getDay();
            let dayAllSeconds: number = 86400;
            let todaySeconds: number = (Time.serverSecodes + 8 * 3600) % dayAllSeconds;//加上8小时时区差
            let surplusSecond = (6 - dayOfTheWeek) * dayAllSeconds + (19.5 * 60 * 60) - todaySeconds;
            //活动结束时间 转为秒
            let endTime = GameParamConfig["ELeagueTime"][10];
            let hour = Number(endTime.split(":")[0]);
            let sec = Number(endTime.split(":")[1]);
            let endSec = (hour * 60 + sec) * 60;
            //周天
            if (dayOfTheWeek == 0) return false;
            //海选
            if (surplusSecond > 0 && MainActionLogic.Instance.hasMatch) return false;
            else if (surplusSecond < 0 && todaySeconds >= endSec) return false;
            else return true;
        }

        /**获取每个阶段倒计时(秒)*/
        public GetCountDown(): number {
            //一天总秒数
            let dayAllSeconds: number = 86400;
            //活动时间
            let hour = Number(this._curTimestamp.split(":")[0]);
            let sec = Number(this._curTimestamp.split(":")[1]);
            //今天已过秒数
            let todaySeconds: number = (Time.serverSecodes + 8 * 3600) % dayAllSeconds;
            //剩余时间s
            this._surplusTime = ((hour * 60 + sec) * 60) - todaySeconds;
            return this._surplusTime;
        }

        //从活动列表打开PK界面的方法
        public OpenMatchUI() {
            this.K_ReqPKLeagueState();
        }

        //开始打boss
        public BossFight() {
            //先判定有没有宠物，没有提醒
            // if (!KickingLogic.Instance.petId) {
            //     TipsLogic.Instance.OpenSystemTips("请先选择宠物上阵");
            //     return;
            // }
            CustomsManager.Instance.EnterCustoms(60001);
            BattleManager.Instance.StopBattle();
            DropManager.Instance.Destroy();
            BattleManager.Instance.DestroyMonster();
            //是否允许点击
            Event.DispatchEvent("StopClick", [false]);
            Event.DispatchEvent("ShowDeputy");
            UIManager.Instance.DestroyUI("MatchElectionView", [ViewUpRoot]);
            if (UIManager.Instance.IsHave("GuidanceView", NewGuidRoot)) {
                UIManager.Instance.DestroyUI("GuidanceView", [NewGuidRoot])
            }
            if (UIManager.Instance.IsHave("StrongerView", ViewDownRoot)) {
                UIManager.Instance.DestroyUI("StrongerView", [ViewDownRoot])
            }
        }

        /**发送 海选Boss战斗伤害 */
        public SendHurt() {
            let nDamage = BattleManager.Instance.TheWordBossDamage;
            RemoteCall.Instance.Send('K_ReqLeagueHit', nDamage);
        }

        /**给服务器发送 保存战斗的阵容信息 */
        public MatchWarInfo(kickwar: { [pos: number]: number }) {
            this.war = kickwar;
            TipsLogic.Instance.OpenSystemTips("保存成功！");
            DataManager.Instance.PackData_m();  //数据包发给服务器
            //上传阵容dps伤害和血量
            DataManager.Instance.SendCapacityData();
        }

        /**小写数字转大写 e.g. 1变为一*/
        public NumToWord(num: number): string {
            let str: string = "";
            switch (num) {
                case 0: str = "零"; break;
                case 1: str = "一"; break;
                case 2: str = "二"; break;
                case 3: str = "三"; break;
                case 4: str = "四"; break;
                case 5: str = "五"; break;
                case 6: str = "六"; break;
                case 7: str = "七"; break;
                case 8: str = "八"; break;
                case 9: str = "九"; break;
                case 10: str = "十"; break;
                case 11: str = "十一"; break;
                case 12: str = "十二"; break;
                case 13: str = "十三"; break;
                case 14: str = "十四"; break;
                case 15: str = "十五"; break;
                case 16: str = "十六"; break;
            }
            return str;
        }

        /**根据类型取对应阶段的花费和总点赞次数 判断是否是观战阶段 */
        private GetInfo(type: MacthType) {
            let i: number;
            switch (type) {
                case 2: case 3: i = 1; this._currentTypeNum = 16; break;//16强
                case 4: case 5: i = 2; this._currentTypeNum = 8; break;
                case 6: case 7: i = 3; this._currentTypeNum = 4; break;
                case 8: case 9: i = 4; this._currentTypeNum = 2; break;
                case 10: case 11: i = 5; this._currentTypeNum = 1; break;//1强
            }
            this._curPraiseCost = GameParamConfig["Praise"][i];
            this._totalPraiseTimes = GameParamConfig["PraiseNum"][i];

            if (type % 2 != 0) {
                //是观战阶段
                this._isSeeStage = true;
            }
            else {
                this._isSeeStage = false;
            }
        }
        /**玩家是否在本次观战中 方法 */
        public IsPlayerInPk(): boolean {
            if (MatchLogic.Instance.Player1Name == MasterPlayer.Instance.player.Name || MatchLogic.Instance.Player2Name == MasterPlayer.Instance.player.Name) {
                return true;
            }
            else return false;
        }

        //**关闭已开启的页面 */
        private CloseMatchUI() {
            if (UIManager.Instance.IsHave("MatchElectionView", ViewUpRoot)) {
                UIManager.Instance.DestroyUI("MatchElectionView", [ViewUpRoot]);
            }
            else if (UIManager.Instance.IsHave("ChampionPraiseView", ViewUpRoot)) {
                UIManager.Instance.DestroyUI("ChampionPraiseView", [ViewUpRoot])
            }
            else if (UIManager.Instance.IsHave("MatchPraiseView", ViewUpRoot)) {
                UIManager.Instance.DestroyUI("MatchPraiseView", [ViewUpRoot])
            }
            if (UIManager.Instance.IsHave("MatchRankView", ViewUpRoot)) {
                UIManager.Instance.DestroyUI("MatchRankView", [ViewUpRoot]);
            }
        }

        //-------------服务器相关回调-----------------------

        /**发送押注信息 */
        public K_ReqLeagueBetInfo(nState, nIndex, nStance) {
            RemoteCall.Instance.Send("K_ReqLeagueBetInfo", nState, nIndex, nStance);
        }

        /**请求打开UI的总方法，返回几个页面的所有的东西 */
        public K_ReqPKLeagueState() {
            RemoteCall.Instance.Send("K_ReqPKLeagueState");
        }

        // /**请求打开排行榜UI(返回排行榜数据） */
        // public K_ReqLeagueHitRank() {
        //     RemoteCall.Instance.Send("K_ReqLeagueHitRank");
        // }

        /**请求观看联赛比赛 */
        public K_ReqWatchLeague(type, index, playerName_1, playerName_2) {
            MatchLogic.Instance.Player1Name = playerName_1;
            MatchLogic.Instance.Player2Name = playerName_2;
            RemoteCall.Instance.Send("K_ReqWatchLeague", type, index);
        }

        /**接受押注信息回调 */
        private C_ReqLeagueBetInfo(buf: any) {
            this._curPraiseInfo[buf[0] - 1] = buf[1];
            this.praiseTimes += 1;
            this._curFightPlayerList = buf[2];
            if (this._curMatchStage == MacthType.eLeagueBet1) {
                Event.DispatchEvent("MatchChampionUpdateView");
            }
            else {
                Event.DispatchEvent("MatchPraiseUpdateView");
            }
        }

        /**接受服务器广播弹出参加提示框（进入各种决赛的玩家会出现提示） */
        private C_ReqInformWatch(buf: any) {
            this.GetInfo(buf[0]);
            UIManager.Instance.CreateUI("JoinMatchTipView", [ViewToppestRoot, buf[0], buf[1], buf[2], buf[3]]);
        }

        /**接受观战信息 */
        private C_ReqWatchLeague(buf: any) {
            let player1Info = buf[0];
            let player2Info = buf[1];
            //哪边获胜
            this.winnerIndexInGroup = buf[2];
            console.log(this.winnerIndexInGroup + "方获胜");

            this.CloseMatchUI();
            DataManager.Instance.ReciveLookPack(player1Info, player2Info);
            CustomsManager.Instance.EnterCustoms(60002);
            DropManager.Instance.Destroy();
            Event.DispatchEvent("ShowDeputy");
            //关闭主界面挑战失败弹出变强界面
            if (UIManager.Instance.IsHave("StrongerView", ViewDownRoot)) {
                UIManager.Instance.DestroyUI("StrongerView", [ViewDownRoot]);
            }
        }

        /**接受海选伤害的回调 */
        private C_ReqLeagueHit(buf: any) {
            this._OwnRank["hit"] = buf[0];
            this._OwnRank["rank"] = buf[1];

            //记录是否参与海选
            MainActionLogic.Instance.hasMatch = true;
            //进入海选大赛界面
            UIManager.Instance.CreateUI("MatchElectionView", [ViewUpRoot]);
        }

        private ChangeWar() {
            for (let key in this._PositionWar) {
                let nhero = this._PositionWar[key];
                this._matchwar[nhero["location"]] = nhero["id"];
            }
        }

        /**接受数据判断类型打开UI */
        private C_ReqPKLeagueState(buf: any) {
            this._curMatchStage = buf[0];        //当前阶段
            console.log("当前阶段：" + Number(this._curMatchStage))
            this.isAllredaySendOpen = false;
            //海选阶段
            if (this._curMatchStage == MacthType.eApply) {
                this._OwnRank = buf[1];//自己的傷害和排行

                let tData = buf[2];    //戰鬥包
                let tInfo = tData[1];
                let bSave = CacheManager.Instance.getDerailByType(CacheTypeEnum.common, CacheTypeCommon.pvpSaveCombat)
                if (ObjIsEmpty(tInfo) || (!bSave)) {
                    DataManager.Instance.MainPackData(true);
                    tInfo = DataManager.Instance.packdata.Info
                }
                this.fireData = tInfo;
                this._PositionWar = this.fireData.Hero;
                //这里用kicking的页面pvp数据
                KickingLogic.Instance.fireData = this.fireData;
                if (GetTabLength(tInfo.Pet) != 0) {
                    KickingLogic.Instance.petId = tInfo.Pet[0].id;
                } else {
                    KickingLogic.Instance.petId = 0;
                }
                this.ChangeWar();

                //把三大界面关上重新开启 刷新界面
                this.CloseMatchUI();
                UIManager.Instance.CreateUI("MatchElectionView", [ViewUpRoot]);
            }
            //总决赛阶段
            else if (this._curMatchStage == MacthType.eLeagueBet1 || this._curMatchStage == MacthType.eLeagueWar1) {
                this.GetInfo(this._curMatchStage);
                //点赞次数
                this._praiseTimes = buf[1];//本阶段已点赞次数
                let praiseInfo = buf[2];//点赞信息
                this._curFightPlayerList = buf[3];//所有小组玩家信息
                if (this._curFightPlayerList[1][1][5] == 1) this.winnerIndexInGroup = 1;
                else this.winnerIndexInGroup = 2;

                //时间e.g.  19:33
                this._curTimestamp = buf[4];
                if (this._curTimestamp == null) {
                    this.CloseMatchUI();
                    return;
                }

                //把点赞数据存入一个数组
                let length = GetTabLength(this._curFightPlayerList);
                for (let i = 0; i < length; i++) {
                    if (praiseInfo == null) {
                        this._curPraiseInfo[i] = 0;
                    }
                    else {
                        if (praiseInfo[(i + 1).toString()]) {
                            this._curPraiseInfo[i] = praiseInfo[(i + 1).toString()];
                        }
                        else {
                            this._curPraiseInfo[i] = 0;
                        }
                    }
                }
                //读取布阵信息并存入数组
                let leftWar = buf[5];
                let rightWar = buf[6];
                for (let key in leftWar) {
                    let nhero = leftWar[key];
                    this._playerInfoArrayLeft[nhero["location"]] = nhero["id"];
                }
                for (let key in rightWar) {
                    let nhero = rightWar[key];
                    this._playerInfoArrayRight[nhero["location"]] = nhero["id"];
                }
                this._championPlayerInfoAll[0] = this._playerInfoArrayLeft;
                this._championPlayerInfoAll[1] = this._playerInfoArrayRight;
                //把三大界面关上重新开启 刷新界面
                this.CloseMatchUI();
                UIManager.Instance.CreateUI("ChampionPraiseView", [ViewUpRoot]);
            }
            //活动未能正常进行阶段
            else if (this._curMatchStage == MacthType.eNotPass) {
                this.CloseMatchUI();
                let str = SysPromptConfig[30074].strPromptInfo;
                TipsLogic.Instance.OpenSystemTips(str);
            }
            //活动结束阶段
            else if (this._curMatchStage == MacthType.eUnopened) {
                this.CloseMatchUI();
                TipsLogic.Instance.OpenSystemTips("本周活动已结束");
            }
            //其他决赛阶段
            else {
                this.GetInfo(this._curMatchStage);
                //点赞次数
                this._praiseTimes = buf[1];       //本阶段已点赞次数
                let praiseInfo = buf[2];          //已点赞列表
                this._curFightPlayerList = buf[3];//组信息列表
                this._curTimestamp = buf[4];      //时间戳
                if (this._curTimestamp == null) {
                    this.CloseMatchUI();
                    return;
                }

                //把点赞数据存入一个数组
                let length = GetTabLength(this._curFightPlayerList);
                for (let i = 0; i < length; i++) {
                    if (praiseInfo == null) {
                        this._curPraiseInfo[i] = 0;
                    }
                    else {
                        if (praiseInfo[(i + 1).toString()]) {
                            this._curPraiseInfo[i] = praiseInfo[(i + 1).toString()];
                        }
                        else {
                            this._curPraiseInfo[i] = 0;
                        }
                    }
                }
                //把三大界面关上重新开启 刷新界面
                if (UIManager.Instance.IsHave("MatchPraiseView", ViewUpRoot)) {
                    Event.DispatchEvent("MatchPraiseUpdateView");
                }
                else {
                    this.CloseMatchUI();
                    UIManager.Instance.CreateUI("MatchPraiseView", [ViewUpRoot]);
                }
            }
        }

        // /**接收排行榜数据 打开UI */
        // private C_ReqLeagueHitRank(buf: any) {
        //     console.log("接收到排行榜数据");
        //     let tData = buf[0];//排行榜数据 
        //     //let nRanking = buf[1];          //自身排名数据 排名 伤害

        //     //初始化
        //     this._rankAllArray = [];
        //     //0号位置是自己的排名
        //     this._rankAllArray[0] = this._OwnRank;
        //     //1-100是上榜玩家的排名
        //     for (let rank in tData) {
        //         let cls = tData[rank];
        //         this._rankAllArray[Number(rank)] = cls;
        //     }
        //     //打开海选界面
        //     UIManager.Instance.CreateUI("MatchRankView", [ViewUpRoot]);
        // }


        //-------------布阵-----------------------

        /** 当前布阵英雄位置信息 */
        public get HeroWar() {
            return this._HeroWar;
        }

        /** 放置英雄 */
        public PutHero(nPos, nHeroID) {
            // 目标位置当前英雄ID
            let nLastHeroID = this._matchwar[nPos];
            // 目标英雄上一个位置
            let nLastPos = this._HeroWar[nHeroID];
            if (nLastHeroID != null) {
                this._HeroWar[nLastHeroID] = nLastPos;
                this._bChange = true;
            }
            if (nLastPos != null) {
                this._matchwar[nLastPos] = nLastHeroID;
                this._bChange = true;
            }
            this._matchwar[nPos] = nHeroID;
            this._HeroWar[nHeroID] = nPos;
        }

        /** 判断是否在阵容上 */
        public IsInWar(nHeroID) {
            return this._HeroWar[nHeroID] != null;
        }

        public getwar() {
            for (let key in this._matchwar) {
                let nId = this._matchwar[key];
                if (!nId) {
                    delete this._matchwar[key];
                }
            }
            return this._matchwar;
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
            let HeroWarList = this._matchwar;
            for (let pos in HeroWarList) {
                let nHeroID = HeroWarList[pos];
                this.PutHero(pos, nHeroID)
            }
            this._bChange = false;
        }
    }
}