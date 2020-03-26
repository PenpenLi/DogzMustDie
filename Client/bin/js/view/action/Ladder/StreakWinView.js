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
    H52D_Framework.AddViewResource("StreakWinView", [
        { url: "res/ui/ui_ladder.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_icon.atlas", type: Laya.Loader.ATLAS },
    ]);
    var StreakWinView = /** @class */ (function (_super) {
        __extends(StreakWinView, _super);
        function StreakWinView(buf) {
            var _this = _super.call(this) || this;
            _this._tatilnum = 0;
            _this._saynum = 0;
            _this._winnum = 0;
            _this._sharetype = 0;
            _this._dnum = 0;
            _this._tatilnum = buf[1];
            _this._saynum = buf[2];
            _this._winnum = buf[3];
            _this._dnum = buf[4];
            _this.ViewInit();
            return _this;
        }
        StreakWinView.prototype.ViewInit = function () {
            this.ViewInfo();
            this.ViewEvent();
        };
        StreakWinView.prototype.ViewEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.Btn_close.on(Laya.Event.CLICK, this, this.btnclick_close);
            this.Btn_share.on(Laya.Event.CLICK, this, this.btnclick_share);
        };
        StreakWinView.prototype.ViewInfo = function () {
            this.tx_tatil.text = H52D_Framework.GetInfoAttr.Instance.GetText(this._tatilnum);
            this.say.text = H52D_Framework.GetInfoAttr.Instance.GetText(this._saynum);
            this.action_type.text = this._tatilnum == 5027 ? "恭喜天梯达成" : "恭喜约战达成";
            this._sharetype = this._tatilnum == 5027 ? H52D_Framework.ShareType.ladder_win : H52D_Framework.ShareType.pvp;
            H52D_Framework.SetHtmlStyle(this.share_rew, 20, "#4f7c23", "center");
            var path = "<img src= 'ui_icon/icon_prop_013.png' width='24px' height='24px'></img>";
            this.share_rew.innerHTML = path + this._dnum;
            this.one.index = this._winnum;
            if (this._winnum > 5) {
                this.two.visible = true;
                this.one.index = 1;
                this.two.index = this._winnum % 10;
                this.one.x = 287;
            }
        };
        StreakWinView.prototype.btnclick_close = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("StreakWinView", [H52D_Framework.ViewToppestRoot]);
        };
        StreakWinView.prototype.btnclick_share = function () {
            H52D_Framework.CallShare(this._sharetype);
            this.btnclick_close();
        };
        StreakWinView.prototype.Destroy = function () {
            this.offAll();
        };
        return StreakWinView;
    }(ui.action.Ladder.StreakWinViewUI));
    H52D_Framework.StreakWinView = StreakWinView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=StreakWinView.js.map