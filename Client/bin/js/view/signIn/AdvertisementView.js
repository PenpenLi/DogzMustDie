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
/** 宝箱掉落 */
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("AdvertisementView", [
        { url: "res/ui/ui_angle.atlas", type: Laya.Loader.ATLAS },
    ]);
    var AdvertisementView = /** @class */ (function (_super) {
        __extends(AdvertisementView, _super);
        function AdvertisementView(buf) {
            var _this = _super.call(this) || this;
            /** 广告倒计时 */
            _this.adTime = 0;
            _this._weekDay_num = 0;
            _this.type = buf[1];
            _this._item_id = buf[2];
            _this.ViewInit();
            _this.EventInit();
            return _this;
        }
        AdvertisementView.prototype.ViewInit = function () {
            switch (this.type) {
                case AdvertisementType.diamond:
                    this.DiamondAD();
                    break;
                case AdvertisementType.signIn:
                    this.SignAD();
                    break;
                case AdvertisementType.pvp:
                    this.KickingAd();
                    break;
                case AdvertisementType.mpRecover:
                    this.MpvalueAd();
                    break;
                case AdvertisementType.heroPeck:
                    this.HeroPeckAD();
                    break;
                case AdvertisementType.wroldBoss:
                    this.WroldBossAD();
                    break;
                case AdvertisementType.ladder:
                    this.LadderAD();
                    break;
                case AdvertisementType.weekLogin:
                    this.WeekLogin();
                    break;
                case AdvertisementType.Achievement:
                    this.AchievementView();
                    break;
            }
        };
        /** 成就广告 */
        AdvertisementView.prototype.AchievementView = function () {
            this.adid = H52D_Framework.AdvertisingId.achevement;
            this.tx_content.text = H52D_Framework.GetInfoAttr.Instance.GetText(7160);
            this.btn_rec_direct.label = "直接领取";
            this.tx_num.visible = false;
            this.tx_reward_ad.text = "10倍奖励";
            this.icon_ad.visible = false;
        };
        /**七日登录广告版 */
        AdvertisementView.prototype.WeekLogin = function () {
            this.adid = H52D_Framework.AdvertisingId.weeklogin;
            this.btn_rec_direct.visible = false;
            this.tx_num.visible = false;
            this.tx_reward_ad.visible = false;
            this.icon_ad.visible = false;
            this.btn_ad.x = 294;
            this.tx_content.text = H52D_Framework.GetInfoAttr.Instance.GetSystemText(7157, this._item_id);
        };
        /**天梯 */
        AdvertisementView.prototype.LadderAD = function () {
            this.adid = H52D_Framework.AdvertisingId.ladder;
            this.tx_title.text = H52D_Framework.GetInfoAttr.Instance.GetText(7138);
            this.tx_content.text = H52D_Framework.GetInfoAttr.Instance.GetText(7149);
            this.btn_rec_direct.label = "购买次数";
            this.tx_num.visible = false;
            this.tx_reward_ad.text = "挑战次数+1";
            this.icon_ad.visible = false;
        };
        AdvertisementView.prototype.DisLadderAD = function () {
            this.btn_ad.gray = true;
        };
        /**世界Boss */
        AdvertisementView.prototype.WroldBossAD = function () {
            this.adid = H52D_Framework.AdvertisingId.boss;
            this.tx_title.text = H52D_Framework.GetInfoAttr.Instance.GetText(7138);
            this.tx_content.text = H52D_Framework.GetInfoAttr.Instance.GetText(7153);
            this.btn_ad.x = 286;
            this.btn_rec_direct.visible = false;
            this.tx_num.visible = false;
            this.tx_reward_ad.text = "Buff获得";
            this.icon_ad.visible = false;
        };
        /**限购礼包 广告 */
        AdvertisementView.prototype.HeroPeckAD = function () {
            this.adid = H52D_Framework.AdvertisingId.gift;
            this.tx_title.text = H52D_Framework.GetInfoAttr.Instance.GetText(7138);
            this.tx_content.text = H52D_Framework.GetInfoAttr.Instance.GetText(7152);
            this.btn_rec_direct.visible = false;
            this.btn_ad.x = 294;
            this.tx_num.visible = false;
            this.tx_reward_ad.text = "刷新购买次数";
            this.icon_ad.visible = false;
        };
        AdvertisementView.prototype.DiamondAD = function () {
            this.adid = H52D_Framework.AdvertisingId.diamonds;
            this.btn_rec_direct.visible = false;
            this.btn_ad.x = 294;
            this.tx_title.text = H52D_Framework.GetInfoAttr.Instance.GetTitle(E_OpenGrade.FREE);
            this.tx_content.text = H52D_Framework.GetInfoAttr.Instance.GetText(7139);
            this.tx_num.text = "剩余次数:" + (H52D_Framework.GameParamConfig["advertisementDailyNum"] - H52D_Framework.AdvertisingManager.Instance.GetAdvertisingTimes(AdvertisementType.diamond))
                + "/" + H52D_Framework.GameParamConfig["advertisementDailyNum"];
            if (H52D_Framework.ViewUILogic.Instance.adState == 1) {
                //倒计时
                this.adTime = H52D_Framework.GameParamConfig["advertisementCD"] - (H52D_Framework.Time.serverSecodes - H52D_Framework.ViewUILogic.Instance.adTimeStamp);
                if (this.adTime > 0) {
                    H52D_Framework.Tick.Clear(this, this.OnFrameHander);
                    this.tx_reward_ad.text = H52D_Framework.GetFormatNumTime(this.adTime) + "后可观看";
                    this.icon_ad.visible = false;
                    H52D_Framework.Tick.Loop(1000, this, this.OnFrameHander);
                }
                else {
                    H52D_Framework.ViewUILogic.Instance.adState = 2;
                }
            }
            this.AdState();
        };
        /**签到 广告  */
        AdvertisementView.prototype.SignAD = function () {
            this.adid = H52D_Framework.AdvertisingId.sign;
            this.tx_title.text = H52D_Framework.GetInfoAttr.Instance.GetText(7138);
            this.tx_content.text = H52D_Framework.GetInfoAttr.Instance.GetText(7148);
            this.tx_reward_ad.text = "三倍奖励";
            this.tx_reward_ad.x = 0;
            this.tx_reward_ad.align = "center";
            this.btn_ad.x = 419;
            this.btn_rec_direct.visible = true;
            this.icon_ad.visible = false;
            this.tx_num.visible = false;
        };
        AdvertisementView.prototype.KickingAd = function () {
            this.adid = H52D_Framework.AdvertisingId.kicking;
            this.tx_title.text = H52D_Framework.GetInfoAttr.Instance.GetText(7138);
            this.tx_content.text = H52D_Framework.GetInfoAttr.Instance.GetSystemText(7150);
            this.btn_rec_direct.visible = false;
            this.btn_ad.x = 294;
            this.tx_reward_ad.text = "挑战次数+1";
            this.icon_ad.visible = false;
            this.tx_num.visible = false;
        };
        AdvertisementView.prototype.MpvalueAd = function () {
            this.adid = H52D_Framework.AdvertisingId.skill;
            this.tx_title.text = H52D_Framework.GetInfoAttr.Instance.GetText(7138);
            this.tx_content.text = H52D_Framework.GetInfoAttr.Instance.GetSystemText(7146);
            this.btn_rec_direct.visible = false;
            this.btn_ad.x = 294;
            this.btn_ad.label = "观看";
            this.tx_reward_ad.text = "满值恢复";
            this.icon_ad.skin = "ui_icon/icon_prop_014.png";
            this.icon_ad.x = 25;
            this.tx_num.visible = false;
        };
        AdvertisementView.prototype.EventInit = function () {
            this.on(Laya.Event.REMOVED, this, this.OnDestroy);
            this.btn_close.on(Laya.Event.CLICK, this, this.OnCloseHander);
            this.btn_ad.on(Laya.Event.CLICK, this, this.OnAdHander);
            this.btn_rec_direct.on(Laya.Event.CLICK, this, this.Btn_rec);
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.WATCH_ADVERTISMENT, Laya.Handler.create(this, this.WatchAdBack));
        };
        AdvertisementView.prototype.OnDestroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.WATCH_ADVERTISMENT, Laya.Handler.create(this, this.WatchAdBack));
        };
        AdvertisementView.prototype.OnCloseHander = function () {
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [this.parent]);
        };
        AdvertisementView.prototype.AdState = function () {
            this.btn_ad.gray = H52D_Framework.ViewUILogic.Instance.adState == 1;
            this.btn_ad.mouseEnabled = H52D_Framework.ViewUILogic.Instance.adState != 1;
            //倒计时
            if (H52D_Framework.ViewUILogic.Instance.adState == 1) {
                this.btn_ad.label = "观看";
                this.tx_reward_ad.x = 0;
                this.tx_reward_ad.align = "center";
            }
            //观看
            else if (H52D_Framework.ViewUILogic.Instance.adState == 2) {
                this.btn_ad.label = "观看";
                this.tx_reward_ad.x = this.icon_ad.x + 20;
                this.tx_reward_ad.align = "left";
                this.tx_reward_ad.text = "+" + H52D_Framework.GameParamConfig["advertisementDaiamod"];
            }
            //领奖
            else if (H52D_Framework.ViewUILogic.Instance.adState == 3) {
                this.btn_ad.label = "领奖";
                this.tx_reward_ad.x = this.icon_ad.x + 20;
                this.tx_reward_ad.align = "left";
                this.tx_reward_ad.text = H52D_Framework.GameParamConfig["advertisementDaiamod"];
                H52D_Framework.Event.DispatchEvent("ShowControlRedPoint", E_OpenGrade.FREE);
            }
            H52D_Framework.Event.DispatchEvent("AdUpdate");
        };
        AdvertisementView.prototype.OnFrameHander = function () {
            if (--this.adTime > 0) {
                this.tx_reward_ad.text = H52D_Framework.GetFormatNumTime(this.adTime) + "后可观看";
            }
            else {
                H52D_Framework.Tick.Clear(this, this.OnFrameHander);
                H52D_Framework.ViewUILogic.Instance.adState = 2;
                this.icon_ad.visible = true;
                this.AdState();
            }
        };
        /** 看广告 */
        AdvertisementView.prototype.OnAdHander = function () {
            var times = (H52D_Framework.AdvertisingManager.Instance.GetAllAdvertisingTimes() < H52D_Framework.AdvertisingManager.Instance.nWXAdertisingTimes);
            if (!times) {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips(H52D_Framework.SysPromptConfig[30071].strPromptInfo);
                this.btn_ad.disabled = true;
                return;
            }
            //观看
            if (this.type == AdvertisementType.diamond) {
                if (H52D_Framework.ViewUILogic.Instance.adState == 2) {
                    if (H52D_Framework.SDKManager.Instance.isWx) {
                        H52D_Framework.WatchAD(H52D_Framework.AdvertisingId.diamonds);
                    }
                    else {
                        this.WatchAdBack();
                        H52D_Framework.UIManager.Instance.CreateUI("AdFreeView", [H52D_Framework.ViewUpRoot]);
                        this.OnCloseHander();
                    }
                }
                //领奖
                else if (H52D_Framework.ViewUILogic.Instance.adState == 3) {
                    //请求领奖
                    this.Btn_rec();
                }
            }
            else if (this.type == AdvertisementType.signIn) {
                if (!times) {
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips(H52D_Framework.SysPromptConfig[30071].strPromptInfo);
                    this.btn_ad.disabled = true;
                }
                else {
                    H52D_Framework.WatchAD(H52D_Framework.AdvertisingId.sign);
                }
            }
            else if (this.type == AdvertisementType.weekLogin) {
                if (H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes) {
                    H52D_Framework.WatchAD(H52D_Framework.AdvertisingId.weeklogin); //七日登录 未添加
                    // this.WatchAdBack()
                }
                else {
                    H52D_Framework.UIManager.Instance.DestroyUI("AdvertisementView", [H52D_Framework.ViewUpRoot]);
                    H52D_Framework.SignInLogic.Instance.WeekText = true;
                    H52D_Framework.Event.DispatchEvent("changelabelText");
                }
            }
            else if (this.type == AdvertisementType.Achievement) {
                H52D_Framework.WatchAD(H52D_Framework.AdvertisingId.achevement); // 成就广告 未添加
                //this.WatchAdBack()
            }
            else {
                H52D_Framework.WatchAD(this.adid);
            }
        };
        /**直接领取奖励 */
        AdvertisementView.prototype.Btn_rec = function () {
            if (this.type == AdvertisementType.signIn) {
                H52D_Framework.SignInLogic.Instance.SendReqSignIn();
            }
            else if (this.type == AdvertisementType.ladder) {
                H52D_Framework.UIManager.Instance.CreateUI("BuyTimesView", [H52D_Framework.ViewToppestRoot, 16]);
            }
            else if (this.type == AdvertisementType.diamond) {
                H52D_Framework.AdvertisingManager.Instance.K_ReqAdvertising(AdvertisementType.diamond);
                this.OnCloseHander();
            }
            else if (this.type == AdvertisementType.Achievement) { //成就奖励
                if (H52D_Framework.AchievenManger.Instance.achievenType == E_AchievenType.eDay) {
                    H52D_Framework.AchievenManger.Instance.K_ReqDayAchievementAward(this._item_id);
                }
                if (H52D_Framework.AchievenManger.Instance.achievenType == E_AchievenType.eAchieven) {
                    H52D_Framework.AchievenManger.Instance.K_ReqAchievementAward(this._item_id);
                }
            }
            else {
                H52D_Framework.AdvertisingManager.Instance.K_ReqAdvertising(AdvertisementType.signIn);
            }
            this.OnCloseHander();
        };
        /** 看广告回调 */
        AdvertisementView.prototype.WatchAdBack = function () {
            if (H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes) {
                if (this.type == AdvertisementType.diamond) {
                    H52D_Framework.ViewUILogic.Instance.adState = 3;
                    this.AdState();
                }
                else if (this.type == AdvertisementType.weekLogin) { ////QQ广告次数
                    H52D_Framework.SignInLogic.Instance.SendReqSevenSignIn(H52D_Framework.SignInLogic.Instance.WeekIndx);
                }
                else if (this.type == AdvertisementType.Achievement) {
                    H52D_Framework.AdvertisingManager.Instance.K_ReqAdvertising(this.type, H52D_Framework.AchievenManger.Instance.achievenType, this._item_id);
                }
                else {
                    H52D_Framework.AdvertisingManager.Instance.K_ReqAdvertising(this.type, this._item_id);
                }
                this.OnCloseHander();
            }
            else {
                //没有广告次数
                H52D_Framework.TipsLogic.Instance.OpenSystemTips(30071);
                this.btn_ad.disabled = true;
            }
        };
        return AdvertisementView;
    }(ui.signIn.AdvertisementViewUI));
    H52D_Framework.AdvertisementView = AdvertisementView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=AdvertisementView.js.map