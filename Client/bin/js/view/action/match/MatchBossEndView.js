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
    var MatchBossEndView = /** @class */ (function (_super) {
        __extends(MatchBossEndView, _super);
        function MatchBossEndView() {
            var _this = _super.call(this) || this;
            _this._time = 5;
            _this.ViewInit();
            return _this;
        }
        MatchBossEndView.prototype.ViewInit = function () {
            this.AddEvent();
            this.ViewInfo();
        };
        MatchBossEndView.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.Btn_sure.on(Laya.Event.CLICK, this, this.Btn_closeclick);
        };
        MatchBossEndView.prototype.ViewInfo = function () {
            this.My_hurt.text = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(7118), H52D_Framework.BattleManager.Instance.TheMatchBossDamage);
            H52D_Framework.Tick.Loop(100, this, this.TimeFrame);
        };
        MatchBossEndView.prototype.TimeFrame = function (time) {
            this._time -= 0.1;
            this.Quit_time.text = "自动退出倒计时(" + Math.floor(this._time) + ")";
            if (this._time <= 0) {
                this.Btn_closeclick();
            }
        };
        MatchBossEndView.prototype.Btn_closeclick = function () {
            H52D_Framework.Tick.Clear(this, this.TimeFrame);
            H52D_Framework.UIManager.Instance.DestroyUI("MatchBossEndView", [H52D_Framework.ViewUpRoot]);
            //上传伤害数据等  需要添加
            H52D_Framework.Event.DispatchEvent("CUSTOMS_RESULT", [false]);
            //一些东西显示的	需要添加
            H52D_Framework.Event.DispatchEvent("DeputyClose");
            H52D_Framework.BattleManager.Instance.OpenBattle();
        };
        MatchBossEndView.prototype.Destroy = function () {
            this.offAll();
        };
        return MatchBossEndView;
    }(ui.action.match.MatchBossEndViewUI));
    H52D_Framework.MatchBossEndView = MatchBossEndView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MatchBossEndView.js.map