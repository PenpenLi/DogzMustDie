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
    /**
     * @class：踢馆提示
     * @author：zhangyusong
     */
    var KickingPromptView = /** @class */ (function (_super) {
        __extends(KickingPromptView, _super);
        function KickingPromptView(buf) {
            var _this = _super.call(this) || this;
            _this.type = buf[1];
            _this.method = buf[2];
            _this.args = buf[3];
            _this.ViewInit();
            _this.EventInit();
            return _this;
        }
        KickingPromptView.prototype.ViewInit = function () {
            if (this.type == Customs_Type.Kicking) {
                this.tx_content.text = H52D_Framework.SysPromptConfig[30056].strPromptInfo;
            }
            else if (this.type == Customs_Type.Ladder) {
                this.tx_content.text = H52D_Framework.SysPromptConfig[30056].strPromptInfo;
            }
            else if (this.type == Customs_Type.Memory) {
                this.tx_content.text = "确定放弃本次挑战？";
            }
        };
        KickingPromptView.prototype.EventInit = function () {
            this.btn_close.on(Laya.Event.CLICK, this, this.onCloseHander);
            this.btn_back.on(Laya.Event.CLICK, this, this.onCloseHander);
            this.btn_confirm.on(Laya.Event.CLICK, this, this.onConfirmHander);
        };
        KickingPromptView.prototype.Destroy = function () {
        };
        KickingPromptView.prototype.onCloseHander = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("KickingPromptView", [H52D_Framework.ViewUpRoot]);
        };
        /** 确定事件 */
        KickingPromptView.prototype.onConfirmHander = function () {
            this.method.apply(this, this.args);
            H52D_Framework.UIManager.Instance.DestroyUI("KickingPromptView", [H52D_Framework.ViewUpRoot]);
        };
        return KickingPromptView;
    }(ui.action.kicking.KickingPromptViewUI));
    H52D_Framework.KickingPromptView = KickingPromptView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=KickingPromptView.js.map