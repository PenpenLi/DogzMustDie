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
 * 通用MessageBox
 */
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("MessageBoxView", [
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_sign.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS }
    ]);
    var MessageBoxView = /** @class */ (function (_super) {
        __extends(MessageBoxView, _super);
        function MessageBoxView(params) {
            var _this = _super.call(this) || this;
            _this._okCallBack = null;
            _this._cancelCallBack = null;
            _this._closeTime = 0;
            var msg = params[1];
            _this._okCallBack = params[2];
            _this._cancelCallBack = params[3];
            _this._closeTime = params[4] != null ? params[4] : 0;
            var hight = _this.msg.height;
            var h;
            H52D_Framework.SetHtmlStyle(_this.msg, 35, "#ffffff", "center", true);
            _this.OKBtn.on(Laya.Event.CLICK, _this, _this.OnOKBtnClick);
            _this.OKCenterBtn.on(Laya.Event.CLICK, _this, _this.OnOKBtnClick);
            _this.CancelBtn.on(Laya.Event.CLICK, _this, _this.OnCancelBtnClick);
            //this.close1.on(Laya.Event.CLICK, this, this.OnCancelBtnClick);
            _this.closeBtn.on(Laya.Event.CLICK, _this, _this.OnCancelBtnClick);
            _this.on(Laya.Event.REMOVED, _this, _this.Destroy);
            if (typeof (msg) == "string") {
                _this.msg.innerHTML = msg;
            }
            else if (typeof (msg) == "number") {
                _this.msg.innerHTML = H52D_Framework.SysPromptConfig[msg].strPromptInfo;
            }
            h = _this.msg.height - hight;
            _this.bg.height += h;
            _this.CancelBtn.y += h;
            _this.OKBtn.y += h;
            _this.OKCenterBtn.y += h;
            if (!_this._cancelCallBack) {
                _this.OKBtn.visible = false;
                _this.CancelBtn.visible = false;
                _this.OKCenterBtn.visible = true;
            }
            else {
                _this.OKBtn.visible = true;
                _this.CancelBtn.visible = true;
                _this.OKCenterBtn.visible = false;
            }
            if (_this._closeTime > 0) {
                _this.UpdateTime();
                H52D_Framework.Tick.Loop(1000, _this, _this.UpdateTime);
            }
            else {
                _this.OKCenterBtn.label = "确 定";
            }
            return _this;
        }
        MessageBoxView.prototype.UpdateTime = function () {
            this.OKCenterBtn.label = "确 定" + this._closeTime + "秒";
            this._closeTime--;
            if (this._closeTime < 0) {
                this.OnOKBtnClick();
                return;
            }
        };
        MessageBoxView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Tick.ClearAll(this);
        };
        MessageBoxView.prototype.OnOKBtnClick = function () {
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            if (this._okCallBack) {
                this._okCallBack.run();
                this._okCallBack = null;
            }
            H52D_Framework.UIManager.Instance.DestroyUI("MessageBoxView", [H52D_Framework.ViewToppestRoot]);
        };
        MessageBoxView.prototype.OnCancelBtnClick = function () {
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            if (this._cancelCallBack) {
                this._cancelCallBack.run();
                this._cancelCallBack = null;
            }
            H52D_Framework.UIManager.Instance.DestroyUI("MessageBoxView", [H52D_Framework.ViewToppestRoot]);
        };
        return MessageBoxView;
    }(ui.tips.MessageBoxViewUI));
    H52D_Framework.MessageBoxView = MessageBoxView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MessageBoxView.js.map