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
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("LoadingView", [
        { url: "res/ui/ui_login.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_noPack/login_background.png", type: Laya.Loader.IMAGE }
    ]);
    var LoadingView = /** @class */ (function (_super) {
        __extends(LoadingView, _super);
        function LoadingView() {
            var _this = _super.call(this) || this;
            //进度条长度
            _this._progressLen = 596;
            _this.backGround.skin = "res/ui/ui_noPack/login_background.png";
            if (H52D_Framework.IsNotBaiDuSdk()) {
                _this.logoicon.skin = "ui_login/login_name_fei.png";
            }
            else {
                _this.logoicon.skin = "ui_login/login_name.png";
            }
            _this.on(Laya.Event.REMOVED, _this, _this.Destroy);
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.UPDATE_LOADING_SLIDER_VALUE, Laya.Handler.create(_this, _this.UpdateLoadingSliderValue));
            return _this;
        }
        LoadingView.prototype.Destroy = function () {
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.UPDATE_LOADING_SLIDER_VALUE, Laya.Handler.create(this, this.UpdateLoadingSliderValue));
        };
        LoadingView.prototype.UpdateLoadingSliderValue = function (value, strInfo) {
            if (strInfo) {
                this.loadingtxt.text = strInfo;
            }
            this.sliderValue.width = value * this._progressLen;
        };
        return LoadingView;
    }(ui.loading.LoadingViewUI));
    H52D_Framework.LoadingView = LoadingView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=LoadingView.js.map