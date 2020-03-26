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
/** 小仙女 */
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("AngleView", [
        { url: "res/ui/ui_angle.atlas", type: Laya.Loader.ATLAS },
    ]);
    var AdStage;
    (function (AdStage) {
        /** 1需要看广告获得翻倍奖励的，弹出看广告二级界面 */
        AdStage[AdStage["NeedWatch"] = 1] = "NeedWatch";
        /** 2不需要看广告的奖励，点击小仙女后宝箱落到地上直接弹出获得道具通用展示界面 */
        AdStage[AdStage["NotWatch"] = 2] = "NotWatch";
        /** 3必须看广告才能领取奖励，看完广告后再回到这个界面，界面显示一个领取按钮，点击领取奖励，界面底部文本描述国际化ID */
        AdStage[AdStage["MustWatch"] = 3] = "MustWatch";
    })(AdStage = H52D_Framework.AdStage || (H52D_Framework.AdStage = {}));
    var AngleView = /** @class */ (function (_super) {
        __extends(AngleView, _super);
        function AngleView(buf) {
            var _this = _super.call(this) || this;
            _this.angleId = 0;
            _this.fairyType = 0;
            //是否看过广告
            _this.readAd = false;
            /** 倍数 */
            _this.beishu = 5;
            _this.angleId = buf[1];
            _this.ViewInit();
            _this.EventInit();
            return _this;
        }
        AngleView.prototype.ViewInit = function () {
            this.tx_title.text = H52D_Framework.GetInfoAttr.Instance.GetTitle(E_OpenGrade.ANGLE);
            this.readAd = false;
            this.fairyType = H52D_Framework.FairyConfig[H52D_Framework.ViewUILogic.Instance.angleType][this.angleId]["fairyType"];
            var rewardId = H52D_Framework.FairyConfig[H52D_Framework.ViewUILogic.Instance.angleType][this.angleId]["rewardId"];
            var reward = H52D_Framework.RewardConfig[rewardId]["reWrad"][1];
            var type = reward[1];
            var rid = reward[2];
            var number_r = Number(reward[3]);
            this.icon_ad.visible = true;
            this.icon_ad.skin = "ui_icon/icon_prop_013.png";
            this.icon_ad.scaleX = 1;
            this.icon_ad.scaleY = 1;
            this.tx_reward_ad.x = 80;
            this.tx_reward_ad.align = "left";
            if (this.fairyType == AdStage.NeedWatch) {
                this.btn_direct.visible = true;
                this.tx_content.text = H52D_Framework.GetInfoAttr.Instance.GetSystemText(7132);
                if (H52D_Framework.AdvertisingManager.Instance.hasAngleTimes) {
                    this.btn_direct.x = 168;
                    this.btn_ad.x = 420;
                    if (type == H52D_Framework.RewardType.Item) {
                        if (rid == H52D_Framework.BaseDefine.ItemIdDiamonds) {
                            this.tx_reward.text = String(number_r);
                            this.tx_reward_ad.text = String(number_r * this.beishu);
                        }
                    }
                }
                else {
                    this.btn_ad.visible = false;
                    this.btn_direct.x = 294;
                    if (type == H52D_Framework.RewardType.Item) {
                        if (rid == H52D_Framework.BaseDefine.ItemIdDiamonds) {
                            this.tx_reward.text = String(number_r);
                        }
                    }
                }
            }
            else if (this.fairyType == AdStage.MustWatch) {
                this.btn_direct.visible = false;
                this.btn_ad.x = 294;
                this.tx_content.text = H52D_Framework.GetInfoAttr.Instance.GetSystemText(7133);
                if (type == H52D_Framework.RewardType.Item) {
                    var dwItemTypes = H52D_Framework.ItemConfig[rid]["dwItemTypes"];
                    if (dwItemTypes == 33) {
                        this.icon_ad.skin = "ui_icon/icon_prop_014.png";
                        this.icon_ad.scaleX = 1.2;
                        this.icon_ad.scaleY = 1.2;
                        this.tx_reward_ad.text = H52D_Framework.ItemConfig[rid]["dwUseEffect"][1];
                    }
                    else if (dwItemTypes == 35) {
                        this.icon_ad.visible = false;
                        this.tx_reward_ad.x = 0;
                        this.tx_reward_ad.align = "center";
                        this.tx_reward_ad.text = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.ItemConfig[rid]["dwItemName"]);
                    }
                }
            }
        };
        AngleView.prototype.EventInit = function () {
            this.on(Laya.Event.REMOVED, this, this.OnDestroy);
            this.btn_close.on(Laya.Event.CLICK, this, this.OnCloseHander);
            this.btn_direct.on(Laya.Event.CLICK, this, this.OnDirectHander);
            this.btn_ad.on(Laya.Event.CLICK, this, this.OnAdHander);
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.WATCH_ADVERTISMENT, Laya.Handler.create(this, this.WatchAdBack));
        };
        AngleView.prototype.OnDestroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.WATCH_ADVERTISMENT, Laya.Handler.create(this, this.WatchAdBack));
        };
        AngleView.prototype.OnCloseHander = function () {
            H52D_Framework.ViewUILogic.Instance.AngleTimeInit();
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [this.parent]);
        };
        /** 直接领奖 */
        AngleView.prototype.OnDirectHander = function () {
            H52D_Framework.ViewUILogic.Instance.isWatch = false;
            H52D_Framework.ViewUILogic.Instance.K_ReqAngelBeats(this.angleId, this.readAd);
            this.OnCloseHander();
        };
        /** 看广告 */
        AngleView.prototype.OnAdHander = function () {
            if (H52D_Framework.SDKManager.Instance.isWx) {
                H52D_Framework.WatchAD(H52D_Framework.AdvertisingId.angle);
            }
            else {
                this.WatchAdBack();
            }
        };
        /** 看广告领奖 */
        AngleView.prototype.WatchAdBack = function () {
            H52D_Framework.ViewUILogic.Instance.AngleTimeInit();
            if (H52D_Framework.AdvertisingManager.Instance.hasAngleTimes) {
                H52D_Framework.AdvertisingManager.Instance.AddAdvertisingTimes(AdvertisementType.angelBeats);
                H52D_Framework.ViewUILogic.Instance.isWatch = true;
                H52D_Framework.AdvertisingManager.Instance.K_ReqAdvertising(AdvertisementType.angelBeats, 2, this.angleId);
            }
            else {
                H52D_Framework.ViewUILogic.Instance.isWatch = false;
                this.btn_ad.disabled = true;
            }
            this.OnCloseHander();
        };
        return AngleView;
    }(ui.signIn.AngleViewUI));
    H52D_Framework.AngleView = AngleView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=AngleView.js.map