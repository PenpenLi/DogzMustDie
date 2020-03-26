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
/**
* 微信获取用户授权界面
*/
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("GetScopeView", [
        { url: "res/ui/ui_login.atlas", type: Laya.Loader.ATLAS }
    ]);
    var GetScopeView = /** @class */ (function (_super) {
        __extends(GetScopeView, _super);
        function GetScopeView() {
            var _this = _super.call(this) || this;
            _this.AddEvent();
            _this.backGround.skin = "res/ui/ui_noPack/login_background.png";
            if (H52D_Framework.IsNotBaiDuSdk()) {
                _this.logoicon.skin = "ui_login/login_name_fei.png";
            }
            else {
                _this.logoicon.skin = "ui_login/login_name.png";
            }
            var nScale = 0.5;
            _this._heromod = new H52D_Framework.Avatar(_this.heromod);
            _this._heromod.Load("res/player/login_juese/juese.sk", 1, nScale, 0, 0, Laya.Handler.create(_this, function () {
                _this._heromod.Play("idle", true);
            }));
            _this._stareffect = new H52D_Framework.Avatar(_this.stareffect);
            _this._stareffect.Load("res/player/login_huoxing/huoxing.sk", 1, nScale, 0, 0, Laya.Handler.create(_this, function () {
                _this._stareffect.Play("idle", true);
            }));
            _this._suipianeffect = new H52D_Framework.Avatar(_this.suipianeffect);
            _this._suipianeffect.Load("res/player/login_suipian/suipian.sk", 1, 0.36, 0, 0, Laya.Handler.create(_this, function () {
                _this._suipianeffect.Play("idle", true);
            }));
            _this._xingxingmod = new H52D_Framework.Avatar(_this.xingxingmod);
            _this._xingxingmod.Load("res/player/login_gly/login_gly.sk", 1, 0.7, 0, 0, Laya.Handler.create(_this, function () {
                _this._xingxingmod.Play("idle", true);
            }));
            return _this;
        }
        GetScopeView.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
        };
        GetScopeView.prototype.Destroy = function () {
            this.offAll();
            if (this._heromod != null) {
                this._heromod.Destroy();
            }
            if (this._stareffect != null) {
                this._stareffect.Destroy();
            }
            if (this._suipianeffect != null) {
                this._suipianeffect.Destroy();
            }
            if (this._xingxingmod != null) {
                this._xingxingmod.Destroy();
            }
        };
        return GetScopeView;
    }(ui.login.GetScopeViewUI));
    H52D_Framework.GetScopeView = GetScopeView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=GetScopeView.js.map