/*
* name;
*/
module H52D_Framework {
    export class LadderManager {
        constructor() {

        }
        private _oppn_name: string;   //匹配玩家名字
        private _Is_matching: boolean = false;
        private fight_scene; //战斗场景ID
        private _oppn_grad: number = 0;
        private _isCanBuy: boolean;
        private _oppncaptain: number;//匹配玩家队长ID
        private _oppnwintimes: number;//匹配玩家胜利次数
        public _isOpenLadder: boolean = false;

        private _win_alawys: number = 0;
        private _last_duanId: number;

        private _play_Id;
        private _ladderreward_arr: Array<number> = [];
        private static _instance: LadderManager;
        public static get Instance(): LadderManager {
            if (this._instance == null) {
                this._instance = new LadderManager();
            }
            return this._instance
        }
        /**匹配玩家的名字 */
        public get OPpn_name() {
            return this._oppn_name;
        }

        /**匹配玩家的段位ID */
        public get Oppn_grad() {
            return this._oppn_grad;
        }

        /**匹配玩家队长ID */
        public get Oppncaptain() {
            return this._oppncaptain;
        }

        public set Oppncaptain(value) {
            this._oppncaptain = value
        }

        /**是否能购买 挑战次数 */
        public get IsCanBuy() {
            return this._isCanBuy
        }

        public set IsCanBuy(value) {
            this._isCanBuy = value;
        }

        /**天梯战斗场景ID */
        public get Fight_Scene() {
            return this.fight_scene;
        }

        /**匹配 取消匹配 */
        public get IsMatching() {
            return this._Is_matching;
        }

        public set IsMatching(value) {
            this._Is_matching = value;
        }

        /**匹配玩家胜利次数 */
        public get OppnWinTimes() {
            return this._oppnwintimes;
        }

        public set OppnWinTimes(value) {
            this._oppnwintimes = value;
        }

        public get Ladderreward_arr() {
            return this._ladderreward_arr;
        }

        public get PlayId() {
            return this._play_Id;
        }

        public set PlayId(value) {
            this._play_Id = value;
        }

        /**玩家之前的天梯分数 */
        public get Last_Ladderlv() {
            return this._last_duanId;
        }

        public LadderLvMax() {
            let maxlv = 0;
            for (let key in LadderConfig) {
                let maxlv = Number(key);
            }
            return maxlv
        }

        public Initialize(): void {
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqLadderMatching", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqLadderCombatEnd", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqBuyLadderTimes", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqLadderActivityInfo", this);

        }

        public getLadderLv() {
            this._ladderreward_arr = [];
            for (let key in LadderConfig) {
                this._ladderreward_arr.push(Number(key));
            }
            return this._ladderreward_arr;
        }



        public Sort_ladderlist(arr, ID: number) {
            function tsort(left, right): number {
                if (left != ID && right != ID) {
                    return left - right;
                } else {
                    if (left == ID) {
                        return left - right ? -1 : -1
                    }
                    if (right == ID) {
                        return left - right ? 1 : 1
                    }
                }
            }
            arr.sort(tsort);
        }

        /**获取玩家的段位信息 */
        public GetDuanInfo(fraction: number) {
            for (let key in LadderConfig) {
                let Info = LadderConfig[key];
                if (!Info.DuanMax) {
                    return Number(key)
                }
                if (fraction >= Info.DuanMin && fraction <= Info.DuanMax) {
                    return Number(key);
                }
            }
            return null;
        }

        /**获取玩家的队长英雄Id */
        public GetCaptainId() {
            let heroId;
            for (let key in KickingLogic.Instance.war) {
                if (Number(key) == 4) {
                    heroId = KickingLogic.Instance.war[key];
                    return heroId;
                }
            }
            return 101;
        }

        /**玩家的天梯阶位提升 */
        public LadderLvUp_player() {
            let play_ladder_s = MasterPlayer.Instance.player.Fraction
            if (this.IsUP_ladder(this._last_duanId, play_ladder_s)) {
                let rew = GameParamConfig.LadderParagraphPromotionIntegral
                UIManager.Instance.CreateUI("LadderLvUpView", [ViewUpRoot, 5027, 6037, play_ladder_s, rew]);
            }
        }

        /**玩家连胜 */
        public Win_alawys() {
            if (this._win_alawys == 5 || this._win_alawys == 10 || this._win_alawys == 15) {
                let rew = GameParamConfig.LadderSuccessiveVictoryDiamond;
                let d_num = 0;
                for (let key in rew) {
                    let ncfg = rew[key];
                    if (ncfg[1] == this._win_alawys) {
                        d_num = ncfg[2];
                    }
                }
                UIManager.Instance.CreateUI("StreakWinView", [ViewToppestRoot, 5027, 6036, this._win_alawys, d_num]);
            }
        }

        /**获取对手玩家信息 */
        public GetOppenCaptainId(Info: any) {
            let hero_war = Info.Hero;
            for (let key in hero_war) {
                let hero_pos = hero_war[key];
                if (hero_pos.location == 4) {
                    return hero_pos.id;
                }
            }
        }

        /**玩家天梯阶位是否升级 */
        private IsUP_ladder(last_id, now_id) {
            let bool = this.GetDuanInfo(now_id) > this.GetDuanInfo(last_id);
            return bool;

        }

        public Close_quitView() {
            if (UIManager.Instance.IsHave("QuitLadderView", ViewDownRoot)) {
                UIManager.Instance.DestroyUI("QuitLadderView", [ViewDownRoot])
            }
        }

        /**请求结束天梯战斗 */
        public K_ReqLadderCombatEnd(star_num: number, IsWin: number) {
            RemoteCall.Instance.Send("K_ReqLadderCombatEnd", star_num, IsWin);
        }

        /*请求匹配天梯 */
        public K_ReqLadderMatching() {
            let play_Info = DataManager.Instance.PackData_c();
            RemoteCall.Instance.Send("K_ReqLadderMatching", play_Info);
        }

        /**请求购买挑战次数 */
        public BuyTimes(num: number) {

            RemoteCall.Instance.Send("K_ReqBuyLadderTimes", num);
        }

        /**请求活动数据 */
        public GetPlayData() {
            RemoteCall.Instance.Send("K_ReqLadderActivityInfo");
        }

        /*********************************************** */
        public View_Control() {
            if (CustomsManager.Instance.CustomsVo.customsType == Customs_Type.Ladder) {
                return false
            }
            else if (CustomsManager.Instance.CustomsVo.customsType == Customs_Type.Customs) {
                return true;
            }
        }

        /**匹配回调 */
        private C_ReqLadderMatching(buf) {
            let nresult = buf[0];
            let Info = buf[1];
            let tOtherInfo = buf[3];
            this._Is_matching
            if (buf[0] == 3) {   //grad 段位  score  分数  wintime  胜利次数
                this._Is_matching = false;
                Event.DispatchEvent("matching_ladder");
                TipsLogic.Instance.OpenSystemTips("匹配失败！");
                return
            } else {
                if (this._Is_matching) {
                    this._oppncaptain = this.GetOppenCaptainId(Info);
                    this._oppn_grad = buf[2].grad;
                    this._oppnwintimes = buf[2].winTime
                    this._oppn_name = buf[4];
                    if (buf[4] == "robot") {
                        this._oppn_name = GetRandName(1);
                    }
                    this.fight_scene = LadderConfig[this._oppn_grad].AttackScene;
                    Event.DispatchEvent("ReshView_ladder");

                    OneTimer(3500, () => {
                        CustomsManager.Instance.EnterCustoms(this.fight_scene);// 进入天梯系统
                        DataManager.Instance.ReciveData(Info);
                        BattleManager.Instance.StopBattle();
                        DropManager.Instance.Destroy();
                        UIManager.Instance.DestroyUI("LadderView", [ViewDownRoot]);
                        Event.DispatchEvent("ShowDeputy");
                        this._oppn_grad = 0;
                        this._oppn_name = null;
                    });
                } else {
                    TipsLogic.Instance.OpenSystemTips("匹配已取消！");
                }
            }
        }

        /**结束天梯战斗回调 */
        private C_ReqLadderCombatEnd(buf) {
            let data = buf;
            let star = buf[0];
            let result = buf[1];
            let reward = buf[2];
            this._last_duanId = MasterPlayer.Instance.player.Fraction;
            let last_ladderlv = this.GetDuanInfo(this._last_duanId);
            //播放结束音效
            if (result == 1) {
                //胜利
                SoundManager.Instance.OnPlaySound("res/sound/succese.mp3");
            }
            else if (result = 2) {
                //失败音效
                SoundManager.Instance.OnPlaySound("res/sound/fail.mp3");
            }
            UIManager.Instance.CreateUI("LadderResultView", [ViewUpRoot, star, result, reward]);
            MasterPlayer.Instance.player.Fraction = buf[3];
            this._Is_matching = false;
            this.Close_quitView();
            Event.DispatchEvent("UpdateBtnList");
            MasterPlayer.Instance.player.LadderWinnNum = buf[4];
            this._win_alawys = buf[5];
        }

        /**购买回调 */
        private C_ReqBuyLadderTimes(buf) {
            Event.DispatchEvent("ReshView_ladder");
            TipsLogic.Instance.OpenSystemTips("购买成功！");
            UIManager.Instance.DestroyUI("BuyTimesView", [ViewToppestRoot]);
        }

        /**接受 活动数据 */
        private C_ReqLadderActivityInfo(buf) {
            let tData = buf[0];
            let tInfo = tData[1]

            let bSave = CacheManager.Instance.getDerailByType(CacheTypeEnum.common, CacheTypeCommon.pvpSaveCombat)
            if (ObjIsEmpty(tInfo) || (!bSave)) {
                DataManager.Instance.MainPackData(true);
                tInfo = DataManager.Instance.packdata.Info
            }
            KickingLogic.Instance.fireData = tInfo;
            if (GetTabLength(tInfo.Pet) != 0) {
                KickingLogic.Instance.petId = tInfo.Pet[0].id;
            } else {
                KickingLogic.Instance.petId = 0;
            }

            KickingLogic.Instance.PositionWar = tInfo.Hero;
            this.ChangeWar();
            UIManager.Instance.CreateUI("LadderView", [ViewDownRoot]);
        }

        private ChangeWar() {
            for (let key in KickingLogic.Instance.PositionWar) {
                let nhero = KickingLogic.Instance.PositionWar[key];
                KickingLogic.Instance.war[nhero["location"]] = nhero["id"];
            }
        }
    }
}