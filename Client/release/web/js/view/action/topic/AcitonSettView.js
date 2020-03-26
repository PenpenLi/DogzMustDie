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
    var AcitonSettView = /** @class */ (function (_super) {
        __extends(AcitonSettView, _super);
        function AcitonSettView(buf) {
            var _this = _super.call(this) || this;
            _this._hurt = 0;
            _this._time = 5;
            _this._hurt = buf[1];
            _this.ViewInit();
            return _this;
        }
        AcitonSettView.prototype.ViewInit = function () {
            this.AddEvent();
            H52D_Framework.Tick.Loop(100, this, this.ShowTime);
            this.my_hurt.text = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(7117), this._hurt);
        };
        AcitonSettView.prototype.ShowTime = function () {
            this._time -= 0.1;
            this.quit_time.text = "自动退出倒计时(" + Math.floor(this._time) + ")";
            if (this._time <= 0) {
                this.Btn_quitclick();
            }
        };
        AcitonSettView.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.Btn_quit.on(Laya.Event.CLICK, this, this.Btn_quitclick);
        };
        AcitonSettView.prototype.Btn_quitclick = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("AcitonSettView", [H52D_Framework.ViewTipRoot]);
            H52D_Framework.UIManager.Instance.DestroyUI("TopicView", [H52D_Framework.ViewToppestRoot]);
            H52D_Framework.Event.DispatchEvent("Action_sett");
        };
        AcitonSettView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Tick.ClearAll(this);
        };
        return AcitonSettView;
    }(ui.action.topic.AcitonSettViewUI));
    H52D_Framework.AcitonSettView = AcitonSettView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=AcitonSettView.js.map