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
    H52D_Framework.AddViewResource("MemoryView", [
        { url: "res/ui/ui_memory.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_noPack/ui-daguo-bgziyuanfuben.png", type: Laya.Loader.IMAGE },
    ]);
    var MemoryView = /** @class */ (function (_super) {
        __extends(MemoryView, _super);
        function MemoryView() {
            var _this = _super.call(this) || this;
            _this.ViewInit();
            _this.EventInit();
            return _this;
        }
        MemoryView.prototype.ViewInit = function () {
            this.view_bg.skin = "res/ui/ui_noPack/ui-daguo-bgziyuanfuben.png";
            this.tx_power.text = H52D_Framework.MemoryLogic.Instance.Power + "/" + H52D_Framework.GameParamConfig["PowerMax"];
            this.tx_diamonds.text = String(H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdDiamonds));
            var dataList = H52D_Framework.CopyConfig[H52D_Framework.MemoryType.equip];
            var _lastId = 0;
            for (var i in dataList) {
                if (Number(i) > _lastId) {
                    _lastId = Number(i);
                }
            }
            this.panel_bg.vScrollBarSkin = "";
            var maxheight = dataList[_lastId]["Position"][2] * 50 + 100;
            this.img_icon.height = this.img_line.height = maxheight;
            this.panel_bg.vScrollBar.max = maxheight - this.panel_bg.height;
            this.arrangement = new H52D_Framework.MemoryArrangement(this.img_icon, this.img_line);
            var localY = 360;
            var targetY = 0;
            if (this.arrangement.dungeonLocalY < this.panel_bg.vScrollBar.max + localY) {
                targetY = this.arrangement.dungeonLocalY - localY;
            }
            else {
                targetY = this.panel_bg.vScrollBar.max;
            }
            this.panel_bg.scrollTo(0, targetY);
            this.DragPanel(targetY);
            this.Breathing();
        };
        MemoryView.prototype.EventInit = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_close.on(Laya.Event.CLICK, this, this.OnCloseHander);
            this.btn_tujian.on(Laya.Event.CLICK, this, this.ShowTujianHander);
            this.btn_add.on(Laya.Event.CLICK, this, this.BuyPower);
            this.panel_bg.vScrollBar.changeHandler = new Laya.Handler(this, this.DragPanel);
            H52D_Framework.Event.RegistEvent("PowerFrush", Laya.Handler.create(this, this.PowerFrush));
        };
        MemoryView.prototype.DragPanel = function (value) {
            this.img_arrow_up.visible = value > 0;
            this.img_arrow_down.visible = value < this.panel_bg.vScrollBar.max;
        };
        MemoryView.prototype.Breathing = function () {
            var _this = this;
            Laya.Tween.to(this.img_arrow, { alpha: 0 }, 800, Laya.Ease.linearInOut, Laya.Handler.create(this, function () {
                Laya.Tween.to(_this.img_arrow, { alpha: 1 }, 1500, Laya.Ease.linearInOut, Laya.Handler.create(_this, function () {
                    _this.Breathing();
                }));
            }));
        };
        MemoryView.prototype.OnCloseHander = function () {
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [this.parent]);
        };
        /** 查看图鉴 */
        MemoryView.prototype.ShowTujianHander = function () {
            H52D_Framework.HeroHandbookManager.Instance.OpenHandBookView();
        };
        MemoryView.prototype.BuyPower = function () {
            H52D_Framework.UIManager.Instance.CreateUI("BuyMemoryPowerView", [H52D_Framework.ViewDownRoot]);
        };
        /** 刷新体力 */
        MemoryView.prototype.PowerFrush = function () {
            this.tx_power.text = H52D_Framework.MemoryLogic.Instance.Power + "/" + H52D_Framework.GameParamConfig["PowerMax"];
        };
        MemoryView.prototype.Destroy = function () {
            this.offAll();
            Laya.Tween.clearAll(this);
            H52D_Framework.Event.DispatchEvent("PowerFrush", Laya.Handler.create(this, this.PowerFrush));
        };
        return MemoryView;
    }(ui.action.memory.MemoryViewUI));
    H52D_Framework.MemoryView = MemoryView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MemoryView.js.map