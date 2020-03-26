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
    // AddViewResource("MemoryChallengeView", [
    // 	{ url: "res/ui/ui_memory.atlas", type: Laya.Loader.ATLAS },
    // 	{ url: "res/ui/ui_kicking.atlas", type: Laya.Loader.ATLAS },
    // ]);
    var MemoryTargetView = /** @class */ (function (_super) {
        __extends(MemoryTargetView, _super);
        function MemoryTargetView() {
            var _this = _super.call(this) || this;
            _this.ViewInit();
            _this.EventInit();
            return _this;
        }
        MemoryTargetView.prototype.ViewInit = function () {
            this.data = H52D_Framework.MemoryLogic.Instance.challengeData;
            this.tx_hero_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(this.data.CopyName);
            var winid = this.data.PassType == 1 ? 14007 : 14008;
            this.tx_win.text = "胜利条件：" + H52D_Framework.GetInfoAttr.Instance.GetSystemText(winid, this.data.PassValue);
            var condition = this.data.StarConditon;
            var star = H52D_Framework.MemoryLogic.Instance.GetDungeonStar(H52D_Framework.MemoryType.equip, this.data.CopyId);
            for (var i = 1; i <= 3; i++) {
                this["target_" + i].getChildByName("tx_through").text = this.GetCondition(condition[i], this.data.StarValue[i]);
                this["target_" + i].getChildByName("img_star").gray = star[i] == 0;
                this["target_" + i].getChildByName("img_diamonds").visible = star[i] == 0;
                this["target_" + i].getChildByName("tx_diamonds").visible = star[i] == 0;
                this["target_" + i].getChildByName("tx_diamonds").text = "+" + this.data.FirstGetDiamond[i];
                this["target_" + i].getChildByName("tx_cannot_complete").visible = star[i] == 1;
            }
        };
        MemoryTargetView.prototype.GetCondition = function (value, fill) {
            var id = 14006 + Number(value);
            var sys = H52D_Framework.GetInfoAttr.Instance.GetText(id);
            return H52D_Framework.Format(sys, fill[1], fill[2]);
        };
        MemoryTargetView.prototype.EventInit = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_close.on(Laya.Event.CLICK, this, this.OnCloseHander);
        };
        MemoryTargetView.prototype.OnCloseHander = function () {
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [this.parent]);
        };
        MemoryTargetView.prototype.Destroy = function () {
            this.offAll();
        };
        return MemoryTargetView;
    }(ui.action.memory.MemoryTargetViewUI));
    H52D_Framework.MemoryTargetView = MemoryTargetView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MemoryTargetView.js.map