var H52D_Framework;
(function (H52D_Framework) {
    var ActionType;
    (function (ActionType) {
        ActionType[ActionType["topic"] = 1] = "topic";
        ActionType[ActionType["kicking"] = 2] = "kicking";
        ActionType[ActionType["boss"] = 3] = "boss";
        ActionType[ActionType["ladder"] = 4] = "ladder";
        ActionType[ActionType["memory"] = 5] = "memory";
        ActionType[ActionType["match"] = 6] = "match";
    })(ActionType = H52D_Framework.ActionType || (H52D_Framework.ActionType = {}));
    ;
    /**
     * @ 活动管理类
     * @author zhangyusong
     */
    var MainActionLogic = /** @class */ (function () {
        function MainActionLogic() {
            /** PK联赛，是否已经参赛 */
            this.hasMatch = false;
            this.voList = {};
            this.GetMatchTimeList();
            for (var id in H52D_Framework.ActivityConfig) {
                var activity = H52D_Framework.ActivityConfig[id];
                //临时屏蔽材料副本
                // if (activity["activiType"] == 6) continue;
                if (Number(activity["IsOneLine"]) == 0) {
                    continue;
                }
                //活动条信息
                var vo = new H52D_Framework.ActionVo();
                vo.id = Number(id);
                vo.type = activity["activiType"];
                vo.name = H52D_Framework.GetInfoAttr.Instance.GetText(activity["activiName"]);
                vo.detailsId = activity["Details"];
                vo.actionTime = activity["time"];
                //PK联赛，时间段特殊处理
                if (activity["activiType"] == 6) {
                    vo.actionTime = this.MatchTimeShow(this.MatchCurrentTime()["point"]);
                }
                // vo.ledTime = activity["LedTime"];
                //奖励列表
                vo.reward = new Array();
                var reward = activity["awardShow"];
                for (var r in reward) {
                    var rid = Number(reward[r][2]);
                    var rnum = Number(reward[r][3]);
                    var item = new H52D_Framework.ItemModel(rid);
                    item.itemNumber = rnum;
                    vo.reward.push(item);
                }
                if (this.voList[vo.type] == null) {
                    this.voList[vo.type] = new Array();
                }
                this.voList[vo.type].push(vo);
            }
            this.FrushTime();
            var _loop_1 = function (type) {
                var actionTimeShow = "";
                this_1.voList[type].forEach(function (vo) {
                    actionTimeShow += (vo.actionTime + ",");
                });
                actionTimeShow = actionTimeShow.substring(0, actionTimeShow.lastIndexOf(","));
                this_1.voList[type].forEach(function (vo) {
                    vo.actionTimeShow = actionTimeShow;
                });
            };
            var this_1 = this;
            for (var type in this.voList) {
                _loop_1(type);
            }
            this.redPointList = {};
            for (var i in ActionType) {
                if (!!Number(i)) {
                    this.redPointList[i] = false;
                }
            }
            this.redPointList;
        }
        Object.defineProperty(MainActionLogic, "Instance", {
            get: function () {
                if (MainActionLogic._inst == null) {
                    MainActionLogic._inst = new MainActionLogic();
                }
                return MainActionLogic._inst;
            },
            enumerable: true,
            configurable: true
        });
        MainActionLogic.prototype.Initialize = function () {
            H52D_Framework.TopicLogic.Instance.Initialize();
            H52D_Framework.KickingLogic.Instance.Initialize();
            H52D_Framework.MemoryLogic.Instance.Initialize();
            this.InitEvent();
        };
        MainActionLogic.prototype.InitEvent = function () {
            H52D_Framework.Event.RegistEvent("ActionOpen", Laya.Handler.create(this, this.ActionOpen));
        };
        /** PK联赛获取当前时间点所处的时间段 */
        MainActionLogic.prototype.MatchCurrentTime = function () {
            var currentDate = new Date(H52D_Framework.Time.serverTime.getTime() + 500);
            //不在活动时间
            var timePoint = H52D_Framework.MacthType.eUnopened;
            var timeStart;
            var timeEnd;
            //当前时间超出本次活动范围时，跳转到下一个时间段
            if (!this.Period(this.matchVo)) {
                this.GetMatchTimeList();
            }
            for (var i = 0; i <= this.MatchTimeList.length - 2; i++) {
                if (currentDate >= this.MatchTimeList[i] && currentDate < this.MatchTimeList[i + 1]) {
                    //报名海选阶段
                    if (i == 0) {
                        timePoint = H52D_Framework.MacthType.eApply;
                    }
                    //海选到32强押注间歇，此时间断目前为0
                    else if (i == 1) {
                    }
                    //活动押注阶段，一直到冠军赛
                    else if (i == this.MatchTimeList.length - 2) {
                        timePoint = H52D_Framework.MacthType.eUnopened;
                    }
                    //活动押注阶段，一直到冠军赛
                    else {
                        timePoint = i;
                    }
                    timeStart = this.MatchTimeList[i];
                    timeEnd = this.MatchTimeList[i + 1];
                    break;
                }
            }
            return { "start": timeStart, "end": timeEnd, "point": timePoint };
        };
        /** PK联赛指定时间点显示 */
        MainActionLogic.prototype.MatchTimeShow = function (timePoint) {
            var matchTime = "";
            var timeStart = null;
            var timeEnd = null;
            if (timePoint == H52D_Framework.MacthType.eUnopened) {
                timeStart = this.MatchTimeList[this.MatchTimeList.length - 2];
                timeEnd = this.MatchTimeList[this.MatchTimeList.length - 1];
            }
            else if (timePoint == H52D_Framework.MacthType.eApply) {
                timeStart = this.MatchTimeList[0];
                timeEnd = this.MatchTimeList[1];
            }
            else {
                timeStart = this.MatchTimeList[timePoint];
                timeEnd = this.MatchTimeList[timePoint + 1];
            }
            if (timePoint == H52D_Framework.MacthType.eApply || timePoint == H52D_Framework.MacthType.eUnopened) {
                matchTime = this.Week(timeStart.getDay()) +
                    (timeStart.getHours() < 10 ? "0" + timeStart.getHours() : timeStart.getHours()) + ":" +
                    (timeStart.getMinutes() < 10 ? "0" + timeStart.getMinutes() : timeStart.getMinutes()) + "-" +
                    this.Week(timeEnd.getDay()) +
                    (timeEnd.getHours() < 10 ? "0" + timeEnd.getHours() : timeEnd.getHours()) + ":" +
                    (timeEnd.getMinutes() < 10 ? "0" + timeEnd.getMinutes() : timeEnd.getMinutes());
            }
            else {
                matchTime = (timeStart.getHours() < 10 ? "0" + timeStart.getHours() : timeStart.getHours()) + ":" +
                    (timeStart.getMinutes() < 10 ? "0" + timeStart.getMinutes() : timeStart.getMinutes()) + "-" +
                    (timeEnd.getHours() < 10 ? "0" + timeEnd.getHours() : timeEnd.getHours()) + ":" +
                    (timeEnd.getMinutes() < 10 ? "0" + timeEnd.getMinutes() : timeEnd.getMinutes());
            }
            return matchTime;
        };
        MainActionLogic.prototype.Week = function (w) {
            switch (Number(w)) {
                case 1: return "星期一";
                case 2: return "星期二";
                case 3: return "星期三";
                case 4: return "星期四";
                case 5: return "星期五";
                case 6: return "星期六";
                case 7: return "星期日";
            }
        };
        /** 给定时间字符串，获取日期 */
        MainActionLogic.prototype.GetDate = function (time, week) {
            if (week === void 0) { week = 0; }
            if (!time) {
                return null;
            }
            var today = H52D_Framework.Time.serverTime.getDay();
            if (today == 0) {
                today = 7;
            }
            var days = week > 0 ? today - week : 0;
            var date = new Date(H52D_Framework.Time.serverTime.getTime() - days * 24 * 60 * 60 * 1000);
            date.setHours(Number(time.split(":")[0]));
            date.setMinutes(Number(time.split(":")[1]));
            date.setSeconds(0);
            return date;
        };
        /** 获取PK联赛时间段列表 */
        MainActionLogic.prototype.GetMatchTimeList = function () {
            //PK联赛时间段初始化
            var eLeagueArray = H52D_Framework.GameParamConfig["ELeagueTotalTime"].split("-");
            var sday = eLeagueArray[0].split("$");
            var eday = eLeagueArray[1].split("$");
            this.MatchTimeList = [this.GetDate(sday[1], sday[0]), this.GetDate(eday[1], eday[0])];
            var timeTab = H52D_Framework.GameParamConfig["ELeagueTime"];
            //最后一个
            var tail = 0;
            for (var i in timeTab) {
                if (tail < Number(i)) {
                    tail = Number(i);
                }
            }
            this.MatchTimeList.push(this.GetDate(timeTab[1], 6));
            this.MatchTimeList.push(this.GetDate(timeTab[tail], 6));
            //结束到下周开始的时间（下周一0点）
            this.MatchTimeList.push(this.GetDate(sday[1], Number(sday[0]) + 7));
            if (this.matchVo == null) {
                this.matchVo = new H52D_Framework.ActionVo();
            }
            this.matchVo.timeStart = this.GetDate(sday[1], Number(sday[0]));
            this.matchVo.timeEnd = this.GetDate(sday[1], Number(sday[0]) + 7);
        };
        /** 刷新 */
        MainActionLogic.prototype.FrushTime = function () {
            var _this = this;
            for (var type in this.voList) {
                this.voList[type].forEach(function (vo) {
                    var cfg = H52D_Framework.ActivityConfig;
                    for (var id in H52D_Framework.ActivityConfig) {
                        if (vo.id == Number(id)) {
                            if (vo.type == 6) {
                                var matchTime = _this.MatchCurrentTime();
                                vo.timeStart = matchTime.start;
                                vo.timeEnd = matchTime.end;
                            }
                            else {
                                var timeArr = String(H52D_Framework.ActivityConfig[id]["time"]).split("-");
                                if (timeArr[0] == "") {
                                    continue;
                                }
                                vo.timeStart = _this.GetDate(timeArr[0]);
                                vo.timeEnd = _this.GetDate(timeArr[1]);
                            }
                        }
                    }
                });
            }
        };
        /** 活动列表显示红点 */
        MainActionLogic.prototype.GetRedPoint = function (type, vo) {
            var redPoint = false;
            //判断开放等级够不够
            var grade;
            switch (type) {
                case ActionType.topic:
                    grade = E_OpenGrade.TOPIC;
                    break;
                case ActionType.kicking:
                    grade = E_OpenGrade.KICKING;
                    break;
                case ActionType.boss:
                    grade = E_OpenGrade.BOSS;
                    break;
                case ActionType.ladder:
                    grade = E_OpenGrade.LADDER;
                    break;
                case ActionType.memory:
                    grade = E_OpenGrade.MEMORY;
                    break;
                case ActionType.match:
                    grade = E_OpenGrade.PKMATCH;
                    break;
            }
            redPoint = H52D_Framework.OpenCondition(grade, false);
            //判断在活动时间内
            if (redPoint) {
                redPoint = MainActionLogic.Instance.Period(vo);
            }
            if (redPoint) {
                switch (type) {
                    case ActionType.topic:
                        redPoint = vo.stamp == 0;
                        break;
                    case ActionType.kicking:
                        redPoint = H52D_Framework.KickingLogic.Instance.surplusGold > 0;
                        break;
                    case ActionType.boss:
                        redPoint = H52D_Framework.WroldBossLogic.Instance.ShowPrint();
                        break;
                    case ActionType.ladder:
                        var c_num = H52D_Framework.MasterPlayer.Instance.GetEventDayProByType(EventProEnum.LadderTimes);
                        var b_num = H52D_Framework.MasterPlayer.Instance.GetEventDayProByType(EventProEnum.BuyLadderTimes);
                        var times = H52D_Framework.MasterPlayer.Instance.player.Laddertimes - c_num + b_num;
                        redPoint = times > 0;
                        break;
                    case ActionType.memory:
                        redPoint = H52D_Framework.MemoryLogic.Instance.hasNextCustoms();
                        break;
                    case ActionType.match:
                        redPoint = H52D_Framework.MatchLogic.Instance.hasTime();
                        break;
                    default:
                        redPoint = false;
                        break;
                }
            }
            return redPoint;
        };
        /** 活动列表同意显示红点 */
        MainActionLogic.prototype.ShowRedPoint = function () {
            this.RedPointFrush();
        };
        MainActionLogic.prototype.RedPointFrush = function () {
            var _this = this;
            var redPoint = false;
            var _loop_2 = function (i) {
                var list = this_2.voList[i];
                MainActionLogic.Instance.redPointList[i] = false;
                list.forEach(function (vo) {
                    redPoint = _this.GetRedPoint(Number(i), vo);
                    if (redPoint) {
                        MainActionLogic.Instance.redPointList[i] = redPoint;
                    }
                });
            };
            var this_2 = this;
            for (var i in this.voList) {
                _loop_2(i);
            }
            redPoint = false;
            for (var i in MainActionLogic.Instance.redPointList) {
                if (MainActionLogic.Instance.redPointList[i]) {
                    redPoint = true;
                    break;
                }
            }
            if (MainActionLogic.Instance.redPoint != redPoint) {
                MainActionLogic.Instance.redPoint = redPoint;
                H52D_Framework.Event.DispatchEvent("ShowRedPoint", [E_OpenGrade.ACTION, redPoint]);
            }
        };
        /** 当前时间在时间范围内 */
        MainActionLogic.prototype.Period = function (vo) {
            if (vo.type != ActionType.match && H52D_Framework.Time.serverTime.getDay() != vo.timeStart.getDay()) {
                vo.actionTime;
            }
            //增加500毫秒误差
            var currTime = H52D_Framework.Time.serverTime.getTime() + 500;
            var into = currTime >= vo.timeStart.getTime() && currTime < vo.timeEnd.getTime();
            return into;
        };
        /**
         * 活动开启
         * @param type活动类型
         * @param id活动ID
         **/
        MainActionLogic.prototype.ActionOpen = function (type, id) {
            switch (type) {
                //话题先锋
                case ActionType.topic:
                    if (H52D_Framework.OpenCondition(E_OpenGrade.TOPIC)) {
                        H52D_Framework.TopicLogic.Instance.ActivityInfo(id);
                    }
                    break;
                //pvp战斗
                case ActionType.kicking:
                    if (H52D_Framework.OpenCondition(E_OpenGrade.KICKING)) {
                        H52D_Framework.KickingLogic.Instance.ActivityInfo();
                    }
                    break;
                case ActionType.boss:
                    if (H52D_Framework.OpenCondition(E_OpenGrade.BOSS)) {
                        H52D_Framework.WroldBossLogic.Instance.OpenView();
                    }
                    break;
                case ActionType.ladder:
                    if (H52D_Framework.OpenCondition(E_OpenGrade.LADDER)) {
                        H52D_Framework.LadderManager.Instance.GetPlayData();
                    }
                    break;
                case ActionType.memory:
                    if (H52D_Framework.OpenCondition(E_OpenGrade.MEMORY)) {
                        H52D_Framework.MemoryLogic.Instance.ActivityInfo();
                    }
                    break;
                case ActionType.match:
                    if (H52D_Framework.OpenCondition(E_OpenGrade.PKMATCH)) {
                        H52D_Framework.MatchLogic.Instance.OpenMatchUI();
                    }
                    break;
            }
        };
        return MainActionLogic;
    }());
    H52D_Framework.MainActionLogic = MainActionLogic;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MainActionLogic.js.map