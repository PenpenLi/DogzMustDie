var H52D_Framework;
(function (H52D_Framework) {
    /**
     * @class 活动列表模块
     * @author zhangyusong
     */
    var ActionModel = /** @class */ (function () {
        function ActionModel() {
            this.PromptId = 30029;
            /** 红点 */
            this.redPoint = false;
            /** 记录列表索引 */
            this.ItemName = null;
            /** 可查看 */
            this.chack = true;
            this.bGuidanceButton = true;
            this.chack = true;
        }
        Object.defineProperty(ActionModel.prototype, "item", {
            set: function (view) {
                this.bgImg = view.getChildByName("bgImg");
                this.bgReward = view.getChildByName("img_reward");
                this.actionName = view.getChildByName("txt_action_name");
                this.actionContent = view.getChildByName("txt_action_content");
                this.quality = view.getChildByName("item_quality");
                this.btn_tips = view.getChildByName("btn_tips");
                this.btn_share = view.getChildByName("btn_share");
                this.btn_attend = view.getChildByName("btn_attend");
                this.btn_time = this.btn_attend.getChildByName("attend_time");
                this.btn_remaning = this.btn_time.getChildByName("txt_remaning");
                this.btn_condition = this.btn_attend.getChildByName("txt_condition");
                this.red_point = this.btn_attend.getChildByName("red_point");
                for (var i = 0; i < 4; i++) {
                    var model = view.getChildByName("RewardView" + i);
                    if (model != null) {
                        model.visible = false;
                    }
                }
                if (this.bgImg != null) {
                    this.actionName.text = this.vo.name;
                    this.btn_tips.x = this.actionName.textWidth + 30;
                    this.actionContent.text = "活动时间:" + this.vo.actionTimeShow;
                    this.bgReward.removeChildren(0, this.bgReward.numChildren);
                    for (var i = 0; i < this.vo.reward.length; i++) {
                        var item = this.vo.reward[i];
                        var model = view.getChildByName("RewardView" + i);
                        if (model == null) {
                            model = new H52D_Framework.RewardView(item.itemId);
                            model.name = "RewardView" + i;
                        }
                        model.visible = true;
                        model.itemNum = item.itemNumber;
                        model.x = 30 + 100 * i;
                        this.bgReward.addChild(model);
                    }
                }
                if (this.actionName.text == H52D_Framework.GetInfoAttr.Instance.GetText(5020) && this.bGuidanceButton) {
                    H52D_Framework.Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_12, this.btn_attend);
                    this.bGuidanceButton = false;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionModel.prototype, "vo", {
            get: function () {
                return this._vo;
            },
            set: function (value) {
                this._vo = value;
                this.type = this._vo.type;
                this.id = this._vo.id;
                this.remaningNum = this._vo.remaning;
            },
            enumerable: true,
            configurable: true
        });
        /** 初始化，判定开启条件 */
        ActionModel.prototype.Init = function () {
            var openGrade;
            this.chack = true;
            switch (this.type) {
                case H52D_Framework.ActionType.topic:
                    openGrade = E_OpenGrade.TOPIC;
                    this.content = H52D_Framework.GetInfoAttr.Instance.GetSystemText(this.vo.detailsId, this.vo.actionTimeShow);
                    //分享按钮
                    this.btn_share.offAll();
                    this.btn_share.on(Laya.Event.CLICK, this, this.ShowShare);
                    break;
                case H52D_Framework.ActionType.kicking:
                    openGrade = E_OpenGrade.KICKING;
                    this.content = H52D_Framework.GetInfoAttr.Instance.GetText(this.vo.detailsId);
                    break;
                case H52D_Framework.ActionType.boss:
                    openGrade = E_OpenGrade.BOSS;
                    this.content = H52D_Framework.GetInfoAttr.Instance.GetText(this.vo.detailsId);
                    break;
                case H52D_Framework.ActionType.ladder:
                    openGrade = E_OpenGrade.LADDER;
                    this.content = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(this.vo.detailsId), H52D_Framework.GameParamConfig["LadderFreeNum"], H52D_Framework.GameParamConfig["DailyAvailableAwardNum"]);
                    break;
                case H52D_Framework.ActionType.memory:
                    openGrade = E_OpenGrade.MEMORY;
                    this.content = H52D_Framework.GetInfoAttr.Instance.GetSystemText(this.vo.detailsId, H52D_Framework.OpenGradeConfig[E_OpenGrade.MEMORY].Checkpoint);
                    break;
                case H52D_Framework.ActionType.match:
                    openGrade = E_OpenGrade.PKMATCH;
                    this.content = H52D_Framework.GetInfoAttr.Instance.GetSystemText(this.vo.detailsId, H52D_Framework.OpenGradeConfig[E_OpenGrade.PKMATCH].Checkpoint);
                    break;
            }
            if (!H52D_Framework.OpenCondition(openGrade, false)) {
                if (openGrade == E_OpenGrade.TOPIC) {
                    this.OpenBtn(false, "等级不足");
                }
                else {
                    this.OpenBtn(false, H52D_Framework.OpenGradeConfig[openGrade].Checkpoint + "关开启");
                }
                this.btnWord = "参加";
            }
            else {
                this.UpDate();
            }
            this.btn_share.visible = false;
            this.ShowRedPoint();
            this.btn_attend.offAll();
            this.btn_attend.on(Laya.Event.CLICK, this, this.AttendHander);
            this.btn_tips.offAll();
            this.btn_tips.on(Laya.Event.CLICK, this, this.ShowTips);
        };
        /** 更新 */
        ActionModel.prototype.UpDate = function () {
            //PK联赛需要特殊处理，变换时间段
            var matchTime = null;
            if (this.type == H52D_Framework.ActionType.match) {
                matchTime = H52D_Framework.MainActionLogic.Instance.MatchCurrentTime();
                this.vo.timePoint = matchTime.point;
                this.vo.timeStart = matchTime.start;
                this.vo.timeEnd = matchTime.end;
            }
            if (H52D_Framework.MainActionLogic.Instance.Period(this.vo)) {
                this.btnWord = "参加";
                var useOpenBtn = true;
                //话题先锋
                if (this.type == H52D_Framework.ActionType.topic) {
                    this.btnWord = this.vo.viewPoint == H52D_Framework.ViewPoint.empty ? "参加" : "查看";
                    this.chack = true;
                    this.btn_share.visible = true;
                }
                //PK联赛
                else if (this.type == H52D_Framework.ActionType.match) {
                    //PK联赛在报名时间内已经报名则取消倒计时
                    if (matchTime) {
                        if (matchTime.point == H52D_Framework.MacthType.eApply) {
                            if (H52D_Framework.MainActionLogic.Instance.hasMatch) {
                                useOpenBtn = false;
                                this.OpenBtn(true, "星期六" + H52D_Framework.MainActionLogic.Instance.MatchTimeList[2].getHours()
                                    + ":" + H52D_Framework.MainActionLogic.Instance.MatchTimeList[2].getMinutes());
                                this.actionContent.text = "活动时间:" + H52D_Framework.MainActionLogic.Instance.MatchTimeShow(H52D_Framework.MacthType.eApply);
                            }
                            else {
                                this.btnWord = "报名";
                            }
                        }
                        else if (matchTime.point == H52D_Framework.MacthType.eUnopened) {
                            this.btnWord = "报名";
                            useOpenBtn = false;
                            this.OpenBtn(false, "休息中");
                            this.actionContent.text = "活动时间:" + H52D_Framework.MainActionLogic.Instance.MatchTimeShow(H52D_Framework.MacthType.eApply);
                        }
                        else {
                            this.actionContent.text = "活动时间:" + H52D_Framework.MainActionLogic.Instance.MatchTimeShow(matchTime.point);
                        }
                    }
                }
                this.remaningNum = Math.round((this.vo.timeEnd.getTime() - H52D_Framework.Time.serverTime.getTime()) * 0.001);
                if (useOpenBtn) {
                    this.OpenBtn(true, H52D_Framework.GetFormatNumTime(this.remaningNum));
                }
            }
            else {
                var btnshow = "休息中";
                if (this.type == H52D_Framework.ActionType.topic) {
                    if (this.vo.viewPoint != H52D_Framework.ViewPoint.empty) {
                        btnshow = "已结算";
                    }
                    this.chack = this.vo.viewPoint != H52D_Framework.ViewPoint.empty;
                    this.btn_share.visible = false;
                }
                this.btnWord = "查看";
                this.OpenBtn(true, btnshow);
            }
            this.ShowRedPoint();
        };
        ActionModel.prototype.Destroy = function () {
            if (this.btn_attend == null) {
                return;
            }
            if (this.btn_attend.hasListener(Laya.Event.CLICK)) {
                this.btn_attend.off(Laya.Event.CLICK, this, this.AttendHander);
            }
            if (this.btn_tips.hasListener(Laya.Event.CLICK)) {
                this.btn_tips.off(Laya.Event.CLICK, this, this.ShowTips);
            }
            if (this.btn_share.hasListener(Laya.Event.CLICK)) {
                this.btn_share.off(Laya.Event.CLICK, this, this.ShowShare);
            }
        };
        Object.defineProperty(ActionModel.prototype, "btnWord", {
            /** 设置字：
             * w:1参加，2查看
             **/
            set: function (word) {
                if (this.ItemName == null) {
                    return;
                }
                this.btn_attend.label = word;
            },
            enumerable: true,
            configurable: true
        });
        /** 心跳函数，展示倒计时 */
        ActionModel.prototype.FrameAction = function () {
            if (this.ItemName == null) {
                return;
            }
            if (--this.remaningNum > 0) {
                this.UpDate();
            }
            else {
                // this.Destroy();
                this.Init();
            }
        };
        ActionModel.prototype.OpenBtn = function (b, txt) {
            if (!this.btn_attend) {
                return;
            }
            this.btn_attend.gray = !b;
            this.btn_time.visible = b;
            this.btn_condition.visible = !b;
            if (b) {
                this.btn_remaning.text = txt;
            }
            else {
                this.btn_condition.text = txt;
            }
        };
        ActionModel.prototype.ShowRedPoint = function () {
            if (this.red_point) {
                this.red_point.visible = H52D_Framework.MainActionLogic.Instance.redPointList[this.type];
            }
        };
        ActionModel.prototype.AttendHander = function () {
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            if (this.chack) {
                // 请求参加活动
                H52D_Framework.Event.DispatchEvent("ActionOpen", [this.type, this.id]);
            }
            else {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips(H52D_Framework.Format(H52D_Framework.SysPromptConfig[this.PromptId]["strPromptInfo"]));
            }
        };
        /** 显示玩法说明 */
        ActionModel.prototype.ShowTips = function () {
            H52D_Framework.UIManager.Instance.CreateUI("TipsActionView", [H52D_Framework.ViewToppestRoot, this.vo.name, this.content]);
        };
        ActionModel.prototype.ShowShare = function () {
            H52D_Framework.CallShare(H52D_Framework.ShareType.base);
        };
        /** 布阵事件 */
        ActionModel.prototype.ShowCamp = function () {
            H52D_Framework.UIManager.Instance.CreateUI("KickingWarView", [H52D_Framework.ViewToppestRoot, H52D_Framework.ActionType.match]);
        };
        return ActionModel;
    }());
    H52D_Framework.ActionModel = ActionModel;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ActionModel.js.map