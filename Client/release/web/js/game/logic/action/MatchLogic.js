var H52D_Framework;
(function (H52D_Framework) {
    /**阶段状态枚举 */
    var MacthType;
    (function (MacthType) {
        /**未开启阶段 */
        MacthType[MacthType["eUnopened"] = 0] = "eUnopened";
        /**海选阶段（报名阶段） */
        MacthType[MacthType["eApply"] = 1] = "eApply";
        /**16强押注 */
        MacthType[MacthType["eLeagueBet16"] = 2] = "eLeagueBet16";
        /**16强开战 */
        MacthType[MacthType["eLeagueWar16"] = 3] = "eLeagueWar16";
        /**8强押注 */
        MacthType[MacthType["eLeagueBet8"] = 4] = "eLeagueBet8";
        /**8强开战 */
        MacthType[MacthType["eLeagueWar8"] = 5] = "eLeagueWar8";
        /**4强押注 */
        MacthType[MacthType["eLeagueBet4"] = 6] = "eLeagueBet4";
        /**4强开战 */
        MacthType[MacthType["eLeagueWar4"] = 7] = "eLeagueWar4";
        /**2强押注 */
        MacthType[MacthType["eLeagueBet2"] = 8] = "eLeagueBet2";
        /**2强开战 */
        MacthType[MacthType["eLeagueWar2"] = 9] = "eLeagueWar2";
        /**决赛押注 */
        MacthType[MacthType["eLeagueBet1"] = 10] = "eLeagueBet1";
        /**决赛开战 */
        MacthType[MacthType["eLeagueWar1"] = 11] = "eLeagueWar1";
        /**结算阶段 */
        MacthType[MacthType["eLeagueOver"] = 12] = "eLeagueOver";
        /**报名玩家不足不能进行比赛 */
        MacthType[MacthType["eNotPass"] = 13] = "eNotPass";
    })(MacthType = H52D_Framework.MacthType || (H52D_Framework.MacthType = {}));
    /**     * 配对位置     */
    var StanceType;
    (function (StanceType) {
        StanceType[StanceType["eLeft"] = 1] = "eLeft";
        StanceType[StanceType["eRight"] = 2] = "eRight";
    })(StanceType = H52D_Framework.StanceType || (H52D_Framework.StanceType = {}));
    /**
     * @class：PK联赛管理类
     * @author：fengxu
     */
    var MatchLogic = /** @class */ (function () {
        function MatchLogic() {
            //一个防止反复发送打开页面的判断
            this.isAllredaySendOpen = false;
            //排行榜数据
            this._rankAllArray = {};
            //自身排行数据 0排名（-1未上榜） 1伤害
            this._OwnRank = [];
            //进入总决赛玩家数据
            this._playerInfoArrayLeft = {};
            this._playerInfoArrayRight = {};
            this._championPlayerInfoAll = {};
            /**FB通用的布阵信息 */
            this._matchwar = {};
            this._HeroWar = {};
            this._PositionWar = {};
            this._bChange = false;
            /**FB通用神兽信息 */
            this._cutPetID = {};
            //当前阶段押注信息
            this._curPraiseInfo = {};
            //当前对战列表
            this._curFightPlayerList = {};
            /** 自身的战斗数据 */
            this.fireData = null;
            /**当前战斗哪方获胜 返回StanceType 1  2 */
            this.winnerIndexInGroup = 0;
            /**是否观看完成决赛战斗 默认为true在观战阶段直接显示胜负，默认false观战比赛之后显示胜负*/
            this._isWatchMatch = true;
        }
        Object.defineProperty(MatchLogic, "Instance", {
            get: function () {
                if (this.instance == null) {
                    this.instance = new MatchLogic();
                }
                return this.instance;
            },
            enumerable: true,
            configurable: true
        });
        //获取排行榜数据
        MatchLogic.prototype.GetRankData = function () {
            return this._rankAllArray;
        };
        Object.defineProperty(MatchLogic.prototype, "isWatchMatch", {
            get: function () {
                return this._isWatchMatch;
            },
            set: function (value) {
                this._isWatchMatch = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatchLogic.prototype, "ownRank", {
            get: function () {
                return this._OwnRank;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatchLogic.prototype, "war", {
            get: function () {
                return this._matchwar;
            },
            set: function (value) {
                this._matchwar = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatchLogic.prototype, "bChange", {
            get: function () {
                return this._bChange;
            },
            set: function (value) {
                this._bChange = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatchLogic.prototype, "curMatchStage", {
            get: function () {
                return this._curMatchStage;
            },
            set: function (value) {
                this._curMatchStage = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatchLogic.prototype, "curTimestamp", {
            get: function () {
                return this._curTimestamp;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatchLogic.prototype, "cruTimestamp", {
            set: function (value) {
                this._curTimestamp = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatchLogic.prototype, "totalPraiseTimes", {
            get: function () {
                return this._totalPraiseTimes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatchLogic.prototype, "curPraiseCost", {
            get: function () {
                return this._curPraiseCost;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatchLogic.prototype, "isSeeStage", {
            get: function () {
                return this._isSeeStage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatchLogic.prototype, "currentTypeNum", {
            get: function () {
                return this._currentTypeNum;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatchLogic.prototype, "praiseTimes", {
            get: function () {
                return this._praiseTimes;
            },
            set: function (value) {
                this._praiseTimes = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatchLogic.prototype, "curPraiseInfo", {
            get: function () {
                return this._curPraiseInfo;
            },
            set: function (value) {
                this._curPraiseInfo = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatchLogic.prototype, "curFightPlayerList", {
            get: function () {
                return this._curFightPlayerList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatchLogic.prototype, "Player1Name", {
            get: function () {
                return this._player1Name;
            },
            set: function (value) {
                this._player1Name = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatchLogic.prototype, "Player2Name", {
            get: function () {
                return this._player2Name;
            },
            set: function (value) {
                this._player2Name = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatchLogic.prototype, "ChampionPlayerInfoAll", {
            get: function () {
                return this._championPlayerInfoAll;
            },
            enumerable: true,
            configurable: true
        });
        MatchLogic.prototype.Initialize = function () {
            //RemoteCall.Instance.RegistJXS2CProtocol('C_ReqLeagueHitRank', this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_ReqLeagueHit', this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_ReqPKLeagueState', this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_ReqWatchLeague', this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_ReqLeagueBetInfo', this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_ReqInformWatch', this);
        };
        /** 用于显示红点 */
        MatchLogic.prototype.hasTime = function () {
            var dayOfTheWeek = H52D_Framework.Time.serverTime.getDay();
            var dayAllSeconds = 86400;
            var todaySeconds = (H52D_Framework.Time.serverSecodes + 8 * 3600) % dayAllSeconds; //加上8小时时区差
            var surplusSecond = (6 - dayOfTheWeek) * dayAllSeconds + (19.5 * 60 * 60) - todaySeconds;
            //活动结束时间 转为秒
            var endTime = H52D_Framework.GameParamConfig["ELeagueTime"][10];
            var hour = Number(endTime.split(":")[0]);
            var sec = Number(endTime.split(":")[1]);
            var endSec = (hour * 60 + sec) * 60;
            //周天
            if (dayOfTheWeek == 0)
                return false;
            //海选
            if (surplusSecond > 0 && H52D_Framework.MainActionLogic.Instance.hasMatch)
                return false;
            else if (surplusSecond < 0 && todaySeconds >= endSec)
                return false;
            else
                return true;
        };
        /**获取每个阶段倒计时(秒)*/
        MatchLogic.prototype.GetCountDown = function () {
            //一天总秒数
            var dayAllSeconds = 86400;
            //活动时间
            var hour = Number(this._curTimestamp.split(":")[0]);
            var sec = Number(this._curTimestamp.split(":")[1]);
            //今天已过秒数
            var todaySeconds = (H52D_Framework.Time.serverSecodes + 8 * 3600) % dayAllSeconds;
            //剩余时间s
            this._surplusTime = ((hour * 60 + sec) * 60) - todaySeconds;
            return this._surplusTime;
        };
        //从活动列表打开PK界面的方法
        MatchLogic.prototype.OpenMatchUI = function () {
            this.K_ReqPKLeagueState();
        };
        //开始打boss
        MatchLogic.prototype.BossFight = function () {
            //先判定有没有宠物，没有提醒
            // if (!KickingLogic.Instance.petId) {
            //     TipsLogic.Instance.OpenSystemTips("请先选择宠物上阵");
            //     return;
            // }
            H52D_Framework.CustomsManager.Instance.EnterCustoms(60001);
            H52D_Framework.BattleManager.Instance.StopBattle();
            H52D_Framework.DropManager.Instance.Destroy();
            H52D_Framework.BattleManager.Instance.DestroyMonster();
            //是否允许点击
            H52D_Framework.Event.DispatchEvent("StopClick", [false]);
            H52D_Framework.Event.DispatchEvent("ShowDeputy");
            H52D_Framework.UIManager.Instance.DestroyUI("MatchElectionView", [H52D_Framework.ViewUpRoot]);
            if (H52D_Framework.UIManager.Instance.IsHave("GuidanceView", H52D_Framework.NewGuidRoot)) {
                H52D_Framework.UIManager.Instance.DestroyUI("GuidanceView", [H52D_Framework.NewGuidRoot]);
            }
            if (H52D_Framework.UIManager.Instance.IsHave("StrongerView", H52D_Framework.ViewDownRoot)) {
                H52D_Framework.UIManager.Instance.DestroyUI("StrongerView", [H52D_Framework.ViewDownRoot]);
            }
        };
        /**发送 海选Boss战斗伤害 */
        MatchLogic.prototype.SendHurt = function () {
            var nDamage = H52D_Framework.BattleManager.Instance.TheWordBossDamage;
            H52D_Framework.RemoteCall.Instance.Send('K_ReqLeagueHit', nDamage);
        };
        /**给服务器发送 保存战斗的阵容信息 */
        MatchLogic.prototype.MatchWarInfo = function (kickwar) {
            this.war = kickwar;
            H52D_Framework.TipsLogic.Instance.OpenSystemTips("保存成功！");
            H52D_Framework.DataManager.Instance.PackData_m(); //数据包发给服务器
            //上传阵容dps伤害和血量
            H52D_Framework.DataManager.Instance.SendCapacityData();
        };
        /**小写数字转大写 e.g. 1变为一*/
        MatchLogic.prototype.NumToWord = function (num) {
            var str = "";
            switch (num) {
                case 0:
                    str = "零";
                    break;
                case 1:
                    str = "一";
                    break;
                case 2:
                    str = "二";
                    break;
                case 3:
                    str = "三";
                    break;
                case 4:
                    str = "四";
                    break;
                case 5:
                    str = "五";
                    break;
                case 6:
                    str = "六";
                    break;
                case 7:
                    str = "七";
                    break;
                case 8:
                    str = "八";
                    break;
                case 9:
                    str = "九";
                    break;
                case 10:
                    str = "十";
                    break;
                case 11:
                    str = "十一";
                    break;
                case 12:
                    str = "十二";
                    break;
                case 13:
                    str = "十三";
                    break;
                case 14:
                    str = "十四";
                    break;
                case 15:
                    str = "十五";
                    break;
                case 16:
                    str = "十六";
                    break;
            }
            return str;
        };
        /**根据类型取对应阶段的花费和总点赞次数 判断是否是观战阶段 */
        MatchLogic.prototype.GetInfo = function (type) {
            var i;
            switch (type) {
                case 2:
                case 3:
                    i = 1;
                    this._currentTypeNum = 16;
                    break; //16强
                case 4:
                case 5:
                    i = 2;
                    this._currentTypeNum = 8;
                    break;
                case 6:
                case 7:
                    i = 3;
                    this._currentTypeNum = 4;
                    break;
                case 8:
                case 9:
                    i = 4;
                    this._currentTypeNum = 2;
                    break;
                case 10:
                case 11:
                    i = 5;
                    this._currentTypeNum = 1;
                    break; //1强
            }
            this._curPraiseCost = H52D_Framework.GameParamConfig["Praise"][i];
            this._totalPraiseTimes = H52D_Framework.GameParamConfig["PraiseNum"][i];
            if (type % 2 != 0) {
                //是观战阶段
                this._isSeeStage = true;
            }
            else {
                this._isSeeStage = false;
            }
        };
        /**玩家是否在本次观战中 方法 */
        MatchLogic.prototype.IsPlayerInPk = function () {
            if (MatchLogic.Instance.Player1Name == H52D_Framework.MasterPlayer.Instance.player.Name || MatchLogic.Instance.Player2Name == H52D_Framework.MasterPlayer.Instance.player.Name) {
                return true;
            }
            else
                return false;
        };
        //**关闭已开启的页面 */
        MatchLogic.prototype.CloseMatchUI = function () {
            if (H52D_Framework.UIManager.Instance.IsHave("MatchElectionView", H52D_Framework.ViewUpRoot)) {
                H52D_Framework.UIManager.Instance.DestroyUI("MatchElectionView", [H52D_Framework.ViewUpRoot]);
            }
            else if (H52D_Framework.UIManager.Instance.IsHave("ChampionPraiseView", H52D_Framework.ViewUpRoot)) {
                H52D_Framework.UIManager.Instance.DestroyUI("ChampionPraiseView", [H52D_Framework.ViewUpRoot]);
            }
            else if (H52D_Framework.UIManager.Instance.IsHave("MatchPraiseView", H52D_Framework.ViewUpRoot)) {
                H52D_Framework.UIManager.Instance.DestroyUI("MatchPraiseView", [H52D_Framework.ViewUpRoot]);
            }
            if (H52D_Framework.UIManager.Instance.IsHave("MatchRankView", H52D_Framework.ViewUpRoot)) {
                H52D_Framework.UIManager.Instance.DestroyUI("MatchRankView", [H52D_Framework.ViewUpRoot]);
            }
        };
        //-------------服务器相关回调-----------------------
        /**发送押注信息 */
        MatchLogic.prototype.K_ReqLeagueBetInfo = function (nState, nIndex, nStance) {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqLeagueBetInfo", nState, nIndex, nStance);
        };
        /**请求打开UI的总方法，返回几个页面的所有的东西 */
        MatchLogic.prototype.K_ReqPKLeagueState = function () {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqPKLeagueState");
        };
        // /**请求打开排行榜UI(返回排行榜数据） */
        // public K_ReqLeagueHitRank() {
        //     RemoteCall.Instance.Send("K_ReqLeagueHitRank");
        // }
        /**请求观看联赛比赛 */
        MatchLogic.prototype.K_ReqWatchLeague = function (type, index, playerName_1, playerName_2) {
            MatchLogic.Instance.Player1Name = playerName_1;
            MatchLogic.Instance.Player2Name = playerName_2;
            H52D_Framework.RemoteCall.Instance.Send("K_ReqWatchLeague", type, index);
        };
        /**接受押注信息回调 */
        MatchLogic.prototype.C_ReqLeagueBetInfo = function (buf) {
            this._curPraiseInfo[buf[0] - 1] = buf[1];
            this.praiseTimes += 1;
            this._curFightPlayerList = buf[2];
            if (this._curMatchStage == MacthType.eLeagueBet1) {
                H52D_Framework.Event.DispatchEvent("MatchChampionUpdateView");
            }
            else {
                H52D_Framework.Event.DispatchEvent("MatchPraiseUpdateView");
            }
        };
        /**接受服务器广播弹出参加提示框（进入各种决赛的玩家会出现提示） */
        MatchLogic.prototype.C_ReqInformWatch = function (buf) {
            this.GetInfo(buf[0]);
            H52D_Framework.UIManager.Instance.CreateUI("JoinMatchTipView", [H52D_Framework.ViewToppestRoot, buf[0], buf[1], buf[2], buf[3]]);
        };
        /**接受观战信息 */
        MatchLogic.prototype.C_ReqWatchLeague = function (buf) {
            var player1Info = buf[0];
            var player2Info = buf[1];
            //哪边获胜
            this.winnerIndexInGroup = buf[2];
            console.log(this.winnerIndexInGroup + "方获胜");
            this.CloseMatchUI();
            H52D_Framework.DataManager.Instance.ReciveLookPack(player1Info, player2Info);
            H52D_Framework.CustomsManager.Instance.EnterCustoms(60002);
            H52D_Framework.DropManager.Instance.Destroy();
            H52D_Framework.Event.DispatchEvent("ShowDeputy");
            //关闭主界面挑战失败弹出变强界面
            if (H52D_Framework.UIManager.Instance.IsHave("StrongerView", H52D_Framework.ViewDownRoot)) {
                H52D_Framework.UIManager.Instance.DestroyUI("StrongerView", [H52D_Framework.ViewDownRoot]);
            }
        };
        /**接受海选伤害的回调 */
        MatchLogic.prototype.C_ReqLeagueHit = function (buf) {
            this._OwnRank["hit"] = buf[0];
            this._OwnRank["rank"] = buf[1];
            //记录是否参与海选
            H52D_Framework.MainActionLogic.Instance.hasMatch = true;
            //进入海选大赛界面
            H52D_Framework.UIManager.Instance.CreateUI("MatchElectionView", [H52D_Framework.ViewUpRoot]);
        };
        MatchLogic.prototype.ChangeWar = function () {
            for (var key in this._PositionWar) {
                var nhero = this._PositionWar[key];
                this._matchwar[nhero["location"]] = nhero["id"];
            }
        };
        /**接受数据判断类型打开UI */
        MatchLogic.prototype.C_ReqPKLeagueState = function (buf) {
            this._curMatchStage = buf[0]; //当前阶段
            console.log("当前阶段：" + Number(this._curMatchStage));
            this.isAllredaySendOpen = false;
            //海选阶段
            if (this._curMatchStage == MacthType.eApply) {
                this._OwnRank = buf[1]; //自己的傷害和排行
                var tData = buf[2]; //戰鬥包
                var tInfo = tData[1];
                var bSave = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.common, CacheTypeCommon.pvpSaveCombat);
                if (H52D_Framework.ObjIsEmpty(tInfo) || (!bSave)) {
                    H52D_Framework.DataManager.Instance.MainPackData(true);
                    tInfo = H52D_Framework.DataManager.Instance.packdata.Info;
                }
                this.fireData = tInfo;
                this._PositionWar = this.fireData.Hero;
                //这里用kicking的页面pvp数据
                H52D_Framework.KickingLogic.Instance.fireData = this.fireData;
                if (H52D_Framework.GetTabLength(tInfo.Pet) != 0) {
                    H52D_Framework.KickingLogic.Instance.petId = tInfo.Pet[0].id;
                }
                else {
                    H52D_Framework.KickingLogic.Instance.petId = 0;
                }
                this.ChangeWar();
                //把三大界面关上重新开启 刷新界面
                this.CloseMatchUI();
                H52D_Framework.UIManager.Instance.CreateUI("MatchElectionView", [H52D_Framework.ViewUpRoot]);
            }
            //总决赛阶段
            else if (this._curMatchStage == MacthType.eLeagueBet1 || this._curMatchStage == MacthType.eLeagueWar1) {
                this.GetInfo(this._curMatchStage);
                //点赞次数
                this._praiseTimes = buf[1]; //本阶段已点赞次数
                var praiseInfo = buf[2]; //点赞信息
                this._curFightPlayerList = buf[3]; //所有小组玩家信息
                if (this._curFightPlayerList[1][1][5] == 1)
                    this.winnerIndexInGroup = 1;
                else
                    this.winnerIndexInGroup = 2;
                //时间e.g.  19:33
                this._curTimestamp = buf[4];
                if (this._curTimestamp == null) {
                    this.CloseMatchUI();
                    return;
                }
                //把点赞数据存入一个数组
                var length_1 = H52D_Framework.GetTabLength(this._curFightPlayerList);
                for (var i = 0; i < length_1; i++) {
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
                var leftWar = buf[5];
                var rightWar = buf[6];
                for (var key in leftWar) {
                    var nhero = leftWar[key];
                    this._playerInfoArrayLeft[nhero["location"]] = nhero["id"];
                }
                for (var key in rightWar) {
                    var nhero = rightWar[key];
                    this._playerInfoArrayRight[nhero["location"]] = nhero["id"];
                }
                this._championPlayerInfoAll[0] = this._playerInfoArrayLeft;
                this._championPlayerInfoAll[1] = this._playerInfoArrayRight;
                //把三大界面关上重新开启 刷新界面
                this.CloseMatchUI();
                H52D_Framework.UIManager.Instance.CreateUI("ChampionPraiseView", [H52D_Framework.ViewUpRoot]);
            }
            //活动未能正常进行阶段
            else if (this._curMatchStage == MacthType.eNotPass) {
                this.CloseMatchUI();
                var str = H52D_Framework.SysPromptConfig[30074].strPromptInfo;
                H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
            }
            //活动结束阶段
            else if (this._curMatchStage == MacthType.eUnopened) {
                this.CloseMatchUI();
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("本周活动已结束");
            }
            //其他决赛阶段
            else {
                this.GetInfo(this._curMatchStage);
                //点赞次数
                this._praiseTimes = buf[1]; //本阶段已点赞次数
                var praiseInfo = buf[2]; //已点赞列表
                this._curFightPlayerList = buf[3]; //组信息列表
                this._curTimestamp = buf[4]; //时间戳
                if (this._curTimestamp == null) {
                    this.CloseMatchUI();
                    return;
                }
                //把点赞数据存入一个数组
                var length_2 = H52D_Framework.GetTabLength(this._curFightPlayerList);
                for (var i = 0; i < length_2; i++) {
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
                if (H52D_Framework.UIManager.Instance.IsHave("MatchPraiseView", H52D_Framework.ViewUpRoot)) {
                    H52D_Framework.Event.DispatchEvent("MatchPraiseUpdateView");
                }
                else {
                    this.CloseMatchUI();
                    H52D_Framework.UIManager.Instance.CreateUI("MatchPraiseView", [H52D_Framework.ViewUpRoot]);
                }
            }
        };
        Object.defineProperty(MatchLogic.prototype, "HeroWar", {
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
            get: function () {
                return this._HeroWar;
            },
            enumerable: true,
            configurable: true
        });
        /** 放置英雄 */
        MatchLogic.prototype.PutHero = function (nPos, nHeroID) {
            // 目标位置当前英雄ID
            var nLastHeroID = this._matchwar[nPos];
            // 目标英雄上一个位置
            var nLastPos = this._HeroWar[nHeroID];
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
        };
        /** 判断是否在阵容上 */
        MatchLogic.prototype.IsInWar = function (nHeroID) {
            return this._HeroWar[nHeroID] != null;
        };
        MatchLogic.prototype.getwar = function () {
            for (var key in this._matchwar) {
                var nId = this._matchwar[key];
                if (!nId) {
                    delete this._matchwar[key];
                }
            }
            return this._matchwar;
        };
        /**判断是否在保存的阵容上 */
        MatchLogic.prototype.IsInSaveWar = function (pos, nHeroID) {
            var war = H52D_Framework.MasterPlayer.Instance.player.HeroWarList;
            for (var nIdx in war) {
                if (war[nIdx] == nHeroID) {
                    return true;
                }
            }
            return false;
        };
        /** 初始化阵容信息 */
        MatchLogic.prototype.InitPosInfo = function () {
            this._PositionWar = {};
            this._HeroWar = {};
            var HeroWarList = this._matchwar;
            for (var pos in HeroWarList) {
                var nHeroID = HeroWarList[pos];
                this.PutHero(pos, nHeroID);
            }
            this._bChange = false;
        };
        return MatchLogic;
    }());
    H52D_Framework.MatchLogic = MatchLogic;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MatchLogic.js.map