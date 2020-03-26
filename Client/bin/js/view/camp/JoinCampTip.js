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
/**Created by the LayaAirIDE*/
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("JoinCampTip", [
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
    ]);
    var JoinCampTip = /** @class */ (function (_super) {
        __extends(JoinCampTip, _super);
        function JoinCampTip() {
            var _this = _super.call(this) || this;
            _this.Init();
            return _this;
        }
        JoinCampTip.prototype.Init = function () {
            this.AddEvent();
            this.camp_text.text = H52D_Framework.GetInfoAttr.Instance.GetText(6011);
        };
        JoinCampTip.prototype.AddEvent = function () {
            this.btn_jioncamp.on(Laya.Event.CLICK, this, this.OpenView);
            this.btn_cancel.on(Laya.Event.CLICK, this, this.Btn_click);
            this.btn_close.on(Laya.Event.CLICK, this, this.Btn_click);
            this.on(Laya.Event.REMOVED, this, this.Destroy);
        };
        JoinCampTip.prototype.OpenView = function () {
            //UIManager.Instance.CreateUI("CampView",[ViewUpRoot]);
            H52D_Framework.UIManager.Instance.DestroyUI("JoinCampTip", [H52D_Framework.ViewUpRoot]);
        };
        JoinCampTip.prototype.Btn_click = function () {
            H52D_Framework.CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.camp, true);
            H52D_Framework.UIManager.Instance.DestroyUI("JoinCampTip", [H52D_Framework.ViewUpRoot]);
        };
        JoinCampTip.prototype.Destroy = function () {
            this.offAll();
        };
        return JoinCampTip;
    }(ui.camp.JoinCampTipUI));
    H52D_Framework.JoinCampTip = JoinCampTip;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=JoinCampTip.js.map