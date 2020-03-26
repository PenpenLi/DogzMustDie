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
    var WroldBossEndView = /** @class */ (function (_super) {
        __extends(WroldBossEndView, _super);
        function WroldBossEndView() {
            var _this = _super.call(this) || this;
            _this._time = 5;
            _this.ViewInit();
            return _this;
        }
        WroldBossEndView.prototype.ViewInit = function () {
            H52D_Framework.WroldBossLogic.Instance.Show = false;
            this.AddEvent();
            this.ViewInfo();
        };
        WroldBossEndView.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            //this.Other.on(Laya.Event.CLICK, this, this.Btn_closeclick);
            this.Btn_sure.on(Laya.Event.CLICK, this, this.Btn_closeclick);
        };
        WroldBossEndView.prototype.ViewInfo = function () {
            this.My_hurt.text = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(7118), H52D_Framework.BattleManager.Instance.TheWordBossDamage);
            H52D_Framework.Tick.Loop(100, this, this.TimeFrame);
        };
        WroldBossEndView.prototype.TimeFrame = function (time) {
            this._time -= 0.1;
            this.Quit_time.text = "自动退出倒计时(" + Math.floor(this._time) + ")";
            if (this._time <= 0) {
                this.Btn_closeclick();
            }
        };
        WroldBossEndView.prototype.Btn_closeclick = function () {
            H52D_Framework.Tick.Clear(this, this.TimeFrame);
            H52D_Framework.UIManager.Instance.DestroyUI("WroldBossEndView", [H52D_Framework.ViewUpRoot]);
            H52D_Framework.Event.DispatchEvent("CUSTOMS_RESULT", [false]);
            H52D_Framework.WroldBossLogic.Instance.Show = true;
            H52D_Framework.Event.DispatchEvent("DeputyClose");
            H52D_Framework.BattleManager.Instance.OpenBattle();
        };
        WroldBossEndView.prototype.Destroy = function () {
            this.offAll();
        };
        return WroldBossEndView;
    }(ui.action.boss.WroldBossEndViewUI));
    H52D_Framework.WroldBossEndView = WroldBossEndView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=WroldBossEndView.js.map