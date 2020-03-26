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
    H52D_Framework.AddViewResource("MoerGameView", [
        { url: "res/ui/ui_wroldboss.atlas", type: Laya.Loader.ATLAS },
    ]);
    var MoerGameView = /** @class */ (function (_super) {
        __extends(MoerGameView, _super);
        function MoerGameView() {
            var _this = _super.call(this) || this;
            _this.ViewInit();
            return _this;
        }
        MoerGameView.prototype.ViewInit = function () {
            this.ViewEvent();
            this.ViewInfo();
        };
        MoerGameView.prototype.ViewInfo = function () {
            this.pet_name.text = "天天欢乐萌宠";
            this.tank_name.text = "坦克大战";
        };
        MoerGameView.prototype.ViewEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.other.on(Laya.Event.CLICK, this, this.btnclick_close);
            this.btn_close.on(Laya.Event.CLICK, this, this.btnclick_close);
            this.game_pet.on(Laya.Event.CLICK, this, this.MoreGame, ["wx2b026a0fb135e79a"]);
            this.game_tank.on(Laya.Event.CLICK, this, this.MoreGame, ["wxfb63ea5b79b63292"]);
        };
        MoerGameView.prototype.btnclick_close = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("MoerGameView", [H52D_Framework.ViewUpRoot]);
        };
        MoerGameView.prototype.MoreGame = function (str) {
            H52D_Framework.wxSDKMgr.Inst.Jump(str);
        };
        MoerGameView.prototype.Destroy = function () {
            this.offAll();
        };
        return MoerGameView;
    }(ui.consumer.MoerGameViewUI));
    H52D_Framework.MoerGameView = MoerGameView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MoerGameView.js.map