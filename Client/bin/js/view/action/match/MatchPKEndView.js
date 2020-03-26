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
    var MatchPKEndView = /** @class */ (function (_super) {
        __extends(MatchPKEndView, _super);
        function MatchPKEndView() {
            var _this = _super.call(this) || this;
            _this._time = 5;
            _this.ViewInit();
            return _this;
        }
        MatchPKEndView.prototype.ViewInit = function () {
            this.AddEvent();
            this.ViewInfo();
        };
        MatchPKEndView.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.Btn_sure.on(Laya.Event.CLICK, this, this.Btn_closeclick);
        };
        MatchPKEndView.prototype.ViewInfo = function () {
            this.ShowTitleText();
            H52D_Framework.Tick.Loop(100, this, this.TimeFrame);
        };
        MatchPKEndView.prototype.TimeFrame = function (time) {
            this._time -= 0.1;
            this.Quit_time.text = "自动退出倒计时(" + Math.floor(this._time) + ")";
            if (this._time <= 0) {
                this.Btn_closeclick();
            }
        };
        MatchPKEndView.prototype.ShowTitleText = function () {
            //判断有没有自己
            this.title.text = "PK胜利";
            if (H52D_Framework.MatchLogic.Instance.winnerIndexInGroup == H52D_Framework.StanceType.eLeft) {
                if (H52D_Framework.MatchLogic.Instance.Player2Name == H52D_Framework.MasterPlayer.Instance.player.Name) {
                    this.title.text = "PK失败";
                }
            }
            else {
                if (H52D_Framework.MatchLogic.Instance.Player1Name == H52D_Framework.MasterPlayer.Instance.player.Name) {
                    this.title.text = "PK失败";
                }
            }
        };
        MatchPKEndView.prototype.Btn_closeclick = function () {
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [this.parent]);
            H52D_Framework.Event.DispatchEvent("DeputyClose");
            H52D_Framework.BattleManager.Instance.OpenBattle();
        };
        MatchPKEndView.prototype.Destroy = function () {
            H52D_Framework.Tick.Clear(this, this.TimeFrame);
            this.offAll();
        };
        return MatchPKEndView;
    }(ui.action.match.MatchPKEndViewUI));
    H52D_Framework.MatchPKEndView = MatchPKEndView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MatchPKEndView.js.map