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
    H52D_Framework.AddViewResource("JoinMatchTipView", [
        { url: "res/ui/ui_common.atlas", type: Laya.Loader.ATLAS },
    ]);
    var JoinMatchTipView = /** @class */ (function (_super) {
        __extends(JoinMatchTipView, _super);
        function JoinMatchTipView(buf) {
            var _this = _super.call(this) || this;
            _this._time = 10;
            _this.ViewInfo();
            _this.AddEvent();
            _this._stage = buf[1];
            _this._group = buf[2];
            _this._playerName1 = buf[3];
            _this._playerName2 = buf[4];
            return _this;
        }
        JoinMatchTipView.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.Btn_close.on(Laya.Event.CLICK, this, this.Btn_clickclose);
            this.Btn_cancel.on(Laya.Event.CLICK, this, this.Btn_clickclose);
            this.Btn_sure.on(Laya.Event.CLICK, this, this.WatchMatch);
        };
        JoinMatchTipView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Tick.Clear(this, this.TimeFrame);
        };
        JoinMatchTipView.prototype.ViewInfo = function () {
            this.say.text = "是否参加" + H52D_Framework.MatchLogic.Instance.currentTypeNum + "强决赛";
            H52D_Framework.Tick.Loop(100, this, this.TimeFrame);
        };
        JoinMatchTipView.prototype.TimeFrame = function (time) {
            this._time -= 0.1;
            this.Quit_time.text = "自动退出倒计时(" + Math.floor(this._time) + ")";
            if (this._time <= 0) {
                this.Btn_clickclose();
            }
        };
        JoinMatchTipView.prototype.WatchMatch = function () {
            H52D_Framework.MatchLogic.Instance.K_ReqWatchLeague(this._stage, this._group, this._playerName1, this._playerName2);
            this.Btn_clickclose();
        };
        JoinMatchTipView.prototype.Btn_clickclose = function () {
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [this.parent]);
        };
        return JoinMatchTipView;
    }(ui.action.match.JoinMatchTipViewUI));
    H52D_Framework.JoinMatchTipView = JoinMatchTipView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=JoinMatchTipView.js.map