/*
* name;
*/
var H52D_Framework;
(function (H52D_Framework) {
    var LadderManager = /** @class */ (function () {
        function LadderManager() {
            this._Is_matching = false;
            this._oppn_grad = 0;
            this._isOpenLadder = false;
            this._win_alawys = 0;
            this._ladderreward_arr = [];
        }
        Object.defineProperty(LadderManager, "Instance", {
            get: function () {
                if (this._instance == null) {
                    this._instance = new LadderManager();
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LadderManager.prototype, "OPpn_name", {
            /**匹配玩家的名字 */
            get: function () {
                return this._oppn_name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LadderManager.prototype, "Oppn_grad", {
            /**匹配玩家的段位ID */
            get: function () {
                return this._oppn_grad;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LadderManager.prototype, "Oppncaptain", {
            /**匹配玩家队长ID */
            get: function () {
                return this._oppncaptain;
            },
            set: function (value) {
                this._oppncaptain = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LadderManager.prototype, "IsCanBuy", {
            /**是否能购买 挑战次数 */
            get: function () {
                return this._isCanBuy;
            },
            set: function (value) {
                this._isCanBuy = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LadderManager.prototype, "Fight_Scene", {
            /**天梯战斗场景ID */
            get: function () {
                return this.fight_scene;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LadderManager.prototype, "IsMatching", {
            /**匹配 取消匹配 */
            get: function () {
                return this._Is_matching;
            },
            set: function (value) {
                this._Is_matching = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LadderManager.prototype, "OppnWinTimes", {
            /**匹配玩家胜利次数 */
            get: function () {
                return this._oppnwintimes;
            },
            set: function (value) {
                this._oppnwintimes = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LadderManager.prototype, "Ladderreward_arr", {
            get: function () {
                return this._ladderreward_arr;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LadderManager.prototype, "PlayId", {
            get: function () {
                return this._play_Id;
            },
            set: function (value) {
                this._play_Id = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LadderManager.prototype, "Last_Ladderlv", {
            /**玩家之前的天梯分数 */
            get: function () {
                return this._last_duanId;
            },
            enumerable: true,
            configurable: true
        });
        LadderManager.prototype.LadderLvMax = function () {
            var maxlv = 0;
            for (var key in H52D_Framework.LadderConfig) {
                var maxlv_1 = Number(key);
            }
            return maxlv;
        };
        LadderManager.prototype.Initialize = function () {
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqLadderMatching", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqLadderCombatEnd", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqBuyLadderTimes", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqLadderActivityInfo", this);
        };
        LadderManager.prototype.getLadderLv = function () {
            this._ladderreward_arr = [];
            for (var key in H52D_Framework.LadderConfig) {
                this._ladderreward_arr.push(Number(key));
            }
            return this._ladderreward_arr;
        };
        LadderManager.prototype.Sort_ladderlist = function (arr, ID) {
            function tsort(left, right) {
                if (left != ID && right != ID) {
                    return left - right;
                }
                else {
                    if (left == ID) {
                        return left - right ? -1 : -1;
                    }
                    if (right == ID) {
                        return left - right ? 1 : 1;
                    }
                }
            }
            arr.sort(tsort);
        };
        /**获取玩家的段位信息 */
        LadderManager.prototype.GetDuanInfo = function (fraction) {
            for (var key in H52D_Framework.LadderConfig) {
                var Info = H52D_Framework.LadderConfig[key];
                if (!Info.DuanMax) {
                    return Number(key);
                }
                if (fraction >= Info.DuanMin && fraction <= Info.DuanMax) {
                    return Number(key);
                }
            }
            return null;
        };
        /**获取玩家的队长英雄Id */
        LadderManager.prototype.GetCaptainId = function () {
            var heroId;
            for (var key in H52D_Framework.KickingLogic.Instance.war) {
                if (Number(key) == 4) {
                    heroId = H52D_Framework.KickingLogic.Instance.war[key];
                    return heroId;
                }
            }
            return 101;
        };
        /**玩家的天梯阶位提升 */
        LadderManager.prototype.LadderLvUp_player = function () {
            var play_ladder_s = H52D_Framework.MasterPlayer.Instance.player.Fraction;
            if (this.IsUP_ladder(this._last_duanId, play_ladder_s)) {
                var rew = H52D_Framework.GameParamConfig.LadderParagraphPromotionIntegral;
                H52D_Framework.UIManager.Instance.CreateUI("LadderLvUpView", [H52D_Framework.ViewUpRoot, 5027, 6037, play_ladder_s, rew]);
            }
        };
        /**玩家连胜 */
        LadderManager.prototype.Win_alawys = function () {
            if (this._win_alawys == 5 || this._win_alawys == 10 || this._win_alawys == 15) {
                var rew = H52D_Framework.GameParamConfig.LadderSuccessiveVictoryDiamond;
                var d_num = 0;
                for (var key in rew) {
                    var ncfg = rew[key];
                    if (ncfg[1] == this._win_alawys) {
                        d_num = ncfg[2];
                    }
                }
                H52D_Framework.UIManager.Instance.CreateUI("StreakWinView", [H52D_Framework.ViewToppestRoot, 5027, 6036, this._win_alawys, d_num]);
            }
        };
        /**获取对手玩家信息 */
        LadderManager.prototype.GetOppenCaptainId = function (Info) {
            var hero_war = Info.Hero;
            for (var key in hero_war) {
                var hero_pos = hero_war[key];
                if (hero_pos.location == 4) {
                    return hero_pos.id;
                }
            }
        };
        /**玩家天梯阶位是否升级 */
        LadderManager.prototype.IsUP_ladder = function (last_id, now_id) {
            var bool = this.GetDuanInfo(now_id) > this.GetDuanInfo(last_id);
            return bool;
        };
        LadderManager.prototype.Close_quitView = function () {
            if (H52D_Framework.UIManager.Instance.IsHave("QuitLadderView", H52D_Framework.ViewDownRoot)) {
                H52D_Framework.UIManager.Instance.DestroyUI("QuitLadderView", [H52D_Framework.ViewDownRoot]);
            }
        };
        /**请求结束天梯战斗 */
        LadderManager.prototype.K_ReqLadderCombatEnd = function (star_num, IsWin) {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqLadderCombatEnd", star_num, IsWin);
        };
        /*请求匹配天梯 */
        LadderManager.prototype.K_ReqLadderMatching = function () {
            var play_Info = H52D_Framework.DataManager.Instance.PackData_c();
            H52D_Framework.RemoteCall.Instance.Send("K_ReqLadderMatching", play_Info);
        };
        /**请求购买挑战次数 */
        LadderManager.prototype.BuyTimes = function (num) {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqBuyLadderTimes", num);
        };
        /**请求活动数据 */
        LadderManager.prototype.GetPlayData = function () {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqLadderActivityInfo");
        };
        /*********************************************** */
        LadderManager.prototype.View_Control = function () {
            if (H52D_Framework.CustomsManager.Instance.CustomsVo.customsType == Customs_Type.Ladder) {
                return false;
            }
            else if (H52D_Framework.CustomsManager.Instance.CustomsVo.customsType == Customs_Type.Customs) {
                return true;
            }
        };
        /**匹配回调 */
        LadderManager.prototype.C_ReqLadderMatching = function (buf) {
            var _this = this;
            var nresult = buf[0];
            var Info = buf[1];
            var tOtherInfo = buf[3];
            this._Is_matching;
            if (buf[0] == 3) { //grad 段位  score  分数  wintime  胜利次数
                this._Is_matching = false;
                H52D_Framework.Event.DispatchEvent("matching_ladder");
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("匹配失败！");
                return;
            }
            else {
                if (this._Is_matching) {
                    this._oppncaptain = this.GetOppenCaptainId(Info);
                    this._oppn_grad = buf[2].grad;
                    this._oppnwintimes = buf[2].winTime;
                    this._oppn_name = buf[4];
                    if (buf[4] == "robot") {
                        this._oppn_name = H52D_Framework.GetRandName(1);
                    }
                    this.fight_scene = H52D_Framework.LadderConfig[this._oppn_grad].AttackScene;
                    H52D_Framework.Event.DispatchEvent("ReshView_ladder");
                    H52D_Framework.OneTimer(3500, function () {
                        H52D_Framework.CustomsManager.Instance.EnterCustoms(_this.fight_scene); // 进入天梯系统
                        H52D_Framework.DataManager.Instance.ReciveData(Info);
                        H52D_Framework.BattleManager.Instance.StopBattle();
                        H52D_Framework.DropManager.Instance.Destroy();
                        H52D_Framework.UIManager.Instance.DestroyUI("LadderView", [H52D_Framework.ViewDownRoot]);
                        H52D_Framework.Event.DispatchEvent("ShowDeputy");
                        _this._oppn_grad = 0;
                        _this._oppn_name = null;
                    });
                }
                else {
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips("匹配已取消！");
                }
            }
        };
        /**结束天梯战斗回调 */
        LadderManager.prototype.C_ReqLadderCombatEnd = function (buf) {
            var data = buf;
            var star = buf[0];
            var result = buf[1];
            var reward = buf[2];
            this._last_duanId = H52D_Framework.MasterPlayer.Instance.player.Fraction;
            var last_ladderlv = this.GetDuanInfo(this._last_duanId);
            //播放结束音效
            if (result == 1) {
                //胜利
                H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/succese.mp3");
            }
            else if (result = 2) {
                //失败音效
                H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/fail.mp3");
            }
            H52D_Framework.UIManager.Instance.CreateUI("LadderResultView", [H52D_Framework.ViewUpRoot, star, result, reward]);
            H52D_Framework.MasterPlayer.Instance.player.Fraction = buf[3];
            this._Is_matching = false;
            this.Close_quitView();
            H52D_Framework.Event.DispatchEvent("UpdateBtnList");
            H52D_Framework.MasterPlayer.Instance.player.LadderWinnNum = buf[4];
            this._win_alawys = buf[5];
        };
        /**购买回调 */
        LadderManager.prototype.C_ReqBuyLadderTimes = function (buf) {
            H52D_Framework.Event.DispatchEvent("ReshView_ladder");
            H52D_Framework.TipsLogic.Instance.OpenSystemTips("购买成功！");
            H52D_Framework.UIManager.Instance.DestroyUI("BuyTimesView", [H52D_Framework.ViewToppestRoot]);
        };
        /**接受 活动数据 */
        LadderManager.prototype.C_ReqLadderActivityInfo = function (buf) {
            var tData = buf[0];
            var tInfo = tData[1];
            var bSave = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.common, CacheTypeCommon.pvpSaveCombat);
            if (H52D_Framework.ObjIsEmpty(tInfo) || (!bSave)) {
                H52D_Framework.DataManager.Instance.MainPackData(true);
                tInfo = H52D_Framework.DataManager.Instance.packdata.Info;
            }
            H52D_Framework.KickingLogic.Instance.fireData = tInfo;
            if (H52D_Framework.GetTabLength(tInfo.Pet) != 0) {
                H52D_Framework.KickingLogic.Instance.petId = tInfo.Pet[0].id;
            }
            else {
                H52D_Framework.KickingLogic.Instance.petId = 0;
            }
            H52D_Framework.KickingLogic.Instance.PositionWar = tInfo.Hero;
            this.ChangeWar();
            H52D_Framework.UIManager.Instance.CreateUI("LadderView", [H52D_Framework.ViewDownRoot]);
        };
        LadderManager.prototype.ChangeWar = function () {
            for (var key in H52D_Framework.KickingLogic.Instance.PositionWar) {
                var nhero = H52D_Framework.KickingLogic.Instance.PositionWar[key];
                H52D_Framework.KickingLogic.Instance.war[nhero["location"]] = nhero["id"];
            }
        };
        return LadderManager;
    }());
    H52D_Framework.LadderManager = LadderManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=LadderManager.js.map