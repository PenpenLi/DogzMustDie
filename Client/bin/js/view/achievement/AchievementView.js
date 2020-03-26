var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/** 成就界面 */
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("AchievementView", [
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_sign.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_mail.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
    ]);
    var AchievementView = /** @class */ (function (_super) {
        __extends(AchievementView, _super);
        function AchievementView() {
            var _this = _super.call(this) || this;
            _this._bSort = true;
            _this.achievenIdArr = [];
            _this._SendBtnFlag1 = true;
            _this._SendBtnFlag2 = true;
            if (window["wx"]) {
                _this.bj.y = wxsclae + 70;
            }
            else {
                _this.bj.centerY = 0;
            }
            _this.AddEvent();
            _this.Init();
            return _this;
        }
        AchievementView.prototype.Init = function () {
            this.red1.visible = false;
            this.red2.visible = false;
            this.txt1.color = "#bebbf8";
            this.txt2.color = "#eff8bb";
            this.bg3.skin = "ui_rank/img-zi-xuan.png";
            this.btn1.skin = "ui_rank/img-zi-weixuan.png";
            this.btn2.skin = "ui_rank/img-lan-weixuan.png";
            H52D_Framework.AchievenManger.Instance.achievenType = E_AchievenType.eDay;
            this.tipName.text = "成就";
            this.achieven_List.vScrollBarSkin = "";
            this.SetListData(H52D_Framework.AchievenManger.Instance.dayMission);
            this.UpdateDate(H52D_Framework.AchievenManger.Instance.achievenType);
        };
        AchievementView.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.OnDestroy);
            this.close.on(Laya.Event.CLICK, this, this.CloseUI);
            this.btn1.on(Laya.Event.CLICK, this, this.UpdateDate, [E_AchievenType.eDay]);
            this.btn2.on(Laya.Event.CLICK, this, this.UpdateDate, [E_AchievenType.eAchieven]);
            H52D_Framework.Event.RegistEvent('UpdateAchievenDate', Laya.Handler.create(this, this.UpdateDate));
        };
        AchievementView.prototype.OnDestroy = function () {
            this.offAll();
            H52D_Framework.Tick.ClearAll(this);
            H52D_Framework.Event.RemoveEvent('UpdateAchievenDate', Laya.Handler.create(this, this.UpdateDate));
        };
        /**刷新页面数据 */
        AchievementView.prototype.UpdateDate = function (type) {
            if (type === void 0) { type = H52D_Framework.AchievenManger.Instance.achievenType; }
            if (H52D_Framework.AchievenManger.Instance.achievenType != type) {
                this._bSort = true;
            }
            H52D_Framework.AchievenManger.Instance.achievenType = type;
            if (H52D_Framework.AchievenManger.Instance.achievenType == E_AchievenType.eDay) {
                this.SetListData(H52D_Framework.AchievenManger.Instance.dayMission);
                this.txt1.color = "#bebbf8";
                this.txt2.color = "#eff8bb";
                this.bg3.skin = "ui_rank/img-zi-xuan.png";
                this.btn1.skin = "ui_rank/img-zi-weixuan.png";
                this.btn2.skin = "ui_rank/img-lan-weixuan.png";
            }
            if (H52D_Framework.AchievenManger.Instance.achievenType == E_AchievenType.eAchieven) {
                this.SetListData(H52D_Framework.AchievenManger.Instance.achievenMission);
                this.txt1.color = "#eff8bb";
                this.txt2.color = "#bebbf8";
                this.bg3.skin = "ui_rank/img-lan-xuan.png";
                this.btn1.skin = "ui_rank/img-lan-weixuan.png";
                this.btn2.skin = "ui_rank/img-zi-weixuan.png";
            }
            this.red1.visible = H52D_Framework.AchievenManger.Instance.showPointDay();
            this.red2.visible = H52D_Framework.AchievenManger.Instance.showPointAchieven();
        };
        AchievementView.prototype.SetListData = function (achievenList) {
            //排序
            if (this._bSort) {
                this.achievenIdArr = [];
                var achieven = achievenList;
                for (var id in achieven) {
                    this.achievenIdArr.push(Number(id));
                }
                var len = this.achievenIdArr.length;
                for (var i = 0; i < len - 1; i++) {
                    for (var j = i + 1; j < len; j++) {
                        var tempValue = void 0;
                        var value_i = achieven[this.achievenIdArr[i]].order;
                        var value_j = achieven[this.achievenIdArr[j]].order;
                        if (value_i < value_j) {
                            tempValue = this.achievenIdArr[i];
                            this.achievenIdArr[i] = this.achievenIdArr[j];
                            this.achievenIdArr[j] = tempValue;
                        }
                    }
                }
                var idArr = [];
                for (var vl = 0; vl < len; vl++) {
                    var tempKey = null;
                    for (var i in this.achievenIdArr) {
                        var id = this.achievenIdArr[i];
                        var starValue = achieven[id].star;
                        if (starValue > achieven[id].maxStar) {
                            var bBreak = false;
                            for (var key in idArr) {
                                if (idArr[key] == id) {
                                    bBreak = true;
                                    break;
                                }
                            }
                            if (bBreak) {
                                break;
                            }
                            else {
                                tempKey = i;
                                idArr.push(id);
                                break;
                            }
                        }
                    }
                    if (tempKey != null) {
                        var id = this.achievenIdArr[tempKey];
                        this.achievenIdArr.splice(tempKey, 1);
                        this.achievenIdArr.push(id);
                    }
                }
                this._bSort = false;
            }
            this.achieven_List.array = this.achievenIdArr;
            this.achieven_List.renderHandler = new Laya.Handler(this, this.SetListRender);
        };
        AchievementView.prototype.SetListRender = function (item, index) {
            var achieven_icon = item.getChildByName("achieven_icon");
            var achievent_btn = item.getChildByName("achievent_btn");
            var achieven_stage = item.getChildByName("achieven_stage");
            var achieven_content = item.getChildByName("achieven_content");
            var achieven_progress = item.getChildByName("achieven_progress");
            var achieven_awart = Laya.Label = item.getChildByName("achieven_awart");
            var achieven_bar = achieven_progress.getChildByName("achieven_bar");
            var achieven_barValue = achieven_progress.getChildByName("achieven_barValue");
            var achievent_btnText = achievent_btn.getChildByName("achievent_btnText");
            var eventId = this.achieven_List.array[index];
            var achieven;
            if (H52D_Framework.AchievenManger.Instance.achievenType == E_AchievenType.eDay) {
                H52D_Framework.AchievenManger.Instance.dayMission[eventId].Init();
                achieven = H52D_Framework.AchievenManger.Instance.dayMission[eventId];
            }
            if (H52D_Framework.AchievenManger.Instance.achievenType == E_AchievenType.eAchieven) {
                H52D_Framework.AchievenManger.Instance.achievenMission[eventId].Init();
                achieven = H52D_Framework.AchievenManger.Instance.achievenMission[eventId];
            }
            var barLength = achieven_progress.width - 4;
            var len = (1 - achieven.yetvalue / achieven.aimvalue) * barLength;
            var setLength = len < 0 ? 0 : len;
            achieven_icon.skin = "ui_icon/" + achieven.strPic;
            achieven_content.text = "任务描述：" + achieven.info;
            achieven_barValue.text = achieven.yetvalue + "/" + achieven.aimvalue;
            achieven_bar.width = setLength;
            H52D_Framework.SetHtmlStyle(achieven_awart, 18, "#fafa85", "center");
            achieven_awart.innerHTML = achieven.rewardType == H52D_Framework.BaseDefine.ItemIdGold ?
                ("<img src= 'ui_icon/icon_prop_012.png' width='20px' height='20px'></img>" + achieven.reward) :
                ("<img src= 'ui_icon/icon_prop_013.png' width='20px' height='15px'></img>" + achieven.reward);
            achieven_stage.destroyChildren();
            for (var i = 1; i <= achieven.maxStar; i++) {
                var stage = new Laya.Image();
                achieven_stage.addChild(stage);
                stage.x = (i - 1) * 30;
                achieven.star >= i + 1 ? stage.skin = "ui_hero/icon-xing-chengjiu.png" : stage.skin = "ui_icon/icon-weijihuo-jinjie-yingxiong.png";
            }
            achievent_btn.gray = false;
            achieven_awart.visible = true;
            achievent_btnText.text = "领奖";
            achievent_btn.offAll(Laya.Event.CLICK);
            if (H52D_Framework.AchievenManger.Instance.achievenType == E_AchievenType.eDay) {
                achievent_btn.on(Laya.Event.CLICK, this, this.ClickDaytBtn, [eventId]);
            }
            else if (H52D_Framework.AchievenManger.Instance.achievenType == E_AchievenType.eAchieven) {
                achievent_btn.on(Laya.Event.CLICK, this, this.ClickAchieventBtn, [eventId]);
            }
            if (achieven.star > achieven.maxStar) {
                achievent_btn.gray = true;
                achieven_awart.visible = false;
                achievent_btnText.text = "已完成";
                achievent_btn.offAll(Laya.Event.CLICK);
            }
            else if (achieven.yetvalue < achieven.aimvalue) {
                achievent_btnText.text = "未达成";
                achievent_btn.gray = true;
                achievent_btn.offAll(Laya.Event.CLICK);
            }
        };
        AchievementView.prototype.ClickAchieventBtn = function (eventId) {
            var _this = this;
            if (window["wx"] && H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes) {
                H52D_Framework.UIManager.Instance.CreateUI("AdvertisementView", [H52D_Framework.ViewUpRoot, AdvertisementType.Achievement, eventId]);
            }
            else {
                if (this._SendBtnFlag1 == false)
                    return;
                this._SendBtnFlag1 = false;
                var canShare = H52D_Framework.AchieveConfig[eventId][1].isCanShare;
                if (canShare) {
                    H52D_Framework.ShareLogic.Instance.ShareAchieven(H52D_Framework.AchievenManger.Instance.achievenType, eventId);
                }
                else {
                    H52D_Framework.AchievenManger.Instance.K_ReqAchievementAward(eventId);
                }
                H52D_Framework.OneTimer(1000, function () {
                    _this._SendBtnFlag1 = true;
                }, "ClickAchieventBtn");
            }
            //播放按钮音效
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
        };
        AchievementView.prototype.ClickDaytBtn = function (id) {
            var _this = this;
            if (window["wx"] && H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes) {
                H52D_Framework.UIManager.Instance.CreateUI("AdvertisementView", [H52D_Framework.ViewUpRoot, AdvertisementType.Achievement, id]);
            }
            else {
                if (this._SendBtnFlag2 == false)
                    return;
                this._SendBtnFlag2 = false;
                H52D_Framework.AchievenManger.Instance.K_ReqDayAchievementAward(id);
                H52D_Framework.OneTimer(1000, function () {
                    _this._SendBtnFlag2 = true;
                }, "ClickDaytBtn");
            }
            //播放按钮音效
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
        };
        AchievementView.prototype.CloseUI = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("AchievementView", [H52D_Framework.ViewUpRoot]);
        };
        return AchievementView;
    }(ui.achievement.AchievementViewUI));
    H52D_Framework.AchievementView = AchievementView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=AchievementView.js.map