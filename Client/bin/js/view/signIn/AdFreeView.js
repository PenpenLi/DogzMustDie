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
    H52D_Framework.AddViewResource("AdFreeView", [
        { url: "res/ui/ui_angle.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_main.atlas", type: Laya.Loader.ATLAS },
    ]);
    var AdFreeView = /** @class */ (function (_super) {
        __extends(AdFreeView, _super);
        function AdFreeView() {
            var _this = _super.call(this) || this;
            _this.anglePath = "res/player/xiaoxiannv/xxn.sk";
            _this.angleScale = 0.4;
            _this.boxPath = "res/player/box/box.sk";
            _this.boxScale = 0.3;
            _this.ViewInit();
            _this.EventInit();
            return _this;
        }
        AdFreeView.prototype.ViewInit = function () {
            var _this = this;
            H52D_Framework.SetHtmlStyle(this.tx_ad, 18, "#020202", "left");
            this.tx_ad.innerHTML = H52D_Framework.GetInfoAttr.Instance.GetText(7140);
            this.box = new H52D_Framework.Avatar(this.box_angle);
            this.box.Load(this.boxPath, AvatarDirection.right, this.boxScale, 90, 200, Laya.Handler.create(this, function () {
                _this.box.Play(H52D_Framework.AnimationName.idle, true, true, null, true);
            }));
            this.angle = new H52D_Framework.Avatar(this.box_angle);
            this.angle.Load(this.anglePath, AvatarDirection.right, this.angleScale, 90, 200, Laya.Handler.create(this, function () {
                _this.angle.Play(H52D_Framework.AnimationName.idle, true, true, null, true);
                _this.angle.rotation = 20;
            }));
            this.tx_reward_ad.text = H52D_Framework.GameParamConfig["advertisementDaiamod"];
        };
        AdFreeView.prototype.EventInit = function () {
            this.on(Laya.Event.REMOVED, this, this.OnDestroy);
            this.btn_close.on(Laya.Event.CLICK, this, this.OnCloseHander);
            this.btn_ad.on(Laya.Event.CLICK, this, this.OnAdHander);
        };
        AdFreeView.prototype.OnDestroy = function () {
            this.offAll();
        };
        AdFreeView.prototype.OnCloseHander = function () {
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [this.parent]);
        };
        AdFreeView.prototype.OnAdHander = function () {
            //请求领奖
            H52D_Framework.AdvertisingManager.Instance.K_ReqAdvertising(AdvertisementType.diamond);
            this.OnCloseHander();
        };
        return AdFreeView;
    }(ui.signIn.AdFreeViewUI));
    H52D_Framework.AdFreeView = AdFreeView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=AdFreeView.js.map