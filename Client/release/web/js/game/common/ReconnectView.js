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
/*
* 断线重连;
*/
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("ReConnectView", [
        { url: "res/ui/ui_reconnect.atlas", type: Laya.Loader.ATLAS }
    ]);
    var ReConnectView = /** @class */ (function (_super) {
        __extends(ReConnectView, _super);
        function ReConnectView() {
            var _this = _super.call(this) || this;
            _this.ReConnectStart();
            _this.on(Laya.Event.REMOVED, _this, _this.Destroy);
            H52D_Framework.Event.RegistEvent("Event_ReConnectEnd", Laya.Handler.create(_this, _this.Event_ReConnectEnd));
            return _this;
        }
        /**
         * 重连显示
         * @param num 重连次数
         */
        ReConnectView.prototype.ReConnectStart = function () {
            var _this = this;
            H52D_Framework.Tick.Loop(1000, this, function () {
                if (_this.desc.text.indexOf("...") != -1) {
                    _this.desc.text = "断线重连中.";
                }
                else if (_this.desc.text.indexOf("..") != -1) {
                    _this.desc.text = "断线重连中...";
                }
                else if (_this.desc.text.indexOf(".") != -1) {
                    _this.desc.text = "断线重连中..";
                }
            });
        };
        ReConnectView.prototype.Event_ReConnectEnd = function (bSuccess) {
            H52D_Framework.Tick.ClearAll(this);
            H52D_Framework.Event.RemoveEvent("Event_ReConnectEnd", Laya.Handler.create(this, this.Event_ReConnectEnd));
            H52D_Framework.UIManager.Instance.DestroyUI("ReConnectView", [H52D_Framework.ViewUpRoot]);
            if (!bSuccess) {
                H52D_Framework.TipsLogic.Instance.OpenMessageBox("重连失败，请重新登陆！", Laya.Handler.create(this, function () {
                    location.reload();
                }));
            }
        };
        ReConnectView.prototype.Destroy = function () {
            H52D_Framework.Event.RemoveEvent("Event_ReConnectEnd", Laya.Handler.create(this, this.Event_ReConnectEnd));
        };
        return ReConnectView;
    }(ui.common.ReConnectViewUI));
    H52D_Framework.ReConnectView = ReConnectView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ReconnectView.js.map