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
    var QuitLadderView = /** @class */ (function (_super) {
        __extends(QuitLadderView, _super);
        function QuitLadderView() {
            var _this = _super.call(this) || this;
            _this.ViewInit();
            return _this;
        }
        QuitLadderView.prototype.ViewInit = function () {
            this.ViewEvent();
        };
        QuitLadderView.prototype.ViewEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.Btn_close.on(Laya.Event.CLICK, this, this.Btnclick_close);
            this.Btn_canle.on(Laya.Event.CLICK, this, this.Btnclick_close);
            this.Btn_sure.on(Laya.Event.CLICK, this, this.Btnclick_sure);
        };
        QuitLadderView.prototype.ViewInfo = function () {
            this.Say.text = H52D_Framework.SysPromptConfig[30056].strPromptInfo;
        };
        QuitLadderView.prototype.Btnclick_close = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("QuitLadderView", [H52D_Framework.ViewDownRoot]);
        };
        QuitLadderView.prototype.Btnclick_sure = function () {
            H52D_Framework.CustomsManager.Instance.LeaveCustomsManager();
            H52D_Framework.BattlefieldManager.Instance.Destroy();
            H52D_Framework.UIManager.Instance.CreateUI("LadderView", [H52D_Framework.ViewDownRoot]);
            H52D_Framework.Event.DispatchEvent("DeputyClose");
            H52D_Framework.LadderManager.Instance.IsMatching = false;
            // this.Btnclick_close();
        };
        QuitLadderView.prototype.Destroy = function () {
            this.offAll();
        };
        return QuitLadderView;
    }(ui.action.Ladder.QuitLadderViewUI));
    H52D_Framework.QuitLadderView = QuitLadderView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=QuitLadderView.js.map