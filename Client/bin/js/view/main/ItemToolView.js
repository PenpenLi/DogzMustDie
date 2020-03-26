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
/**首冲商城UI*/
var H52D_Framework;
(function (H52D_Framework) {
    var ItemToolView = /** @class */ (function (_super) {
        __extends(ItemToolView, _super);
        function ItemToolView() {
            var _this = _super.call(this) || this;
            _this.on(Laya.Event.REMOVED, _this, _this.OnDestroy);
            H52D_Framework.Event.RegistEvent('PackRef', Laya.Handler.create(_this, _this.UpDateText)); //背包界面刷新
            _this.UpDateText();
            return _this;
        }
        //** 刷新UI */
        ItemToolView.prototype.UpDateText = function () {
            var sText = "";
            var list = H52D_Framework.BagManager.Instance.GetItemList();
            for (var id in list) {
                var item = list[id];
                sText += item.itemStrName + "(" + item.dwItemName + ")" + ":" + item.itemNumber + "\n";
            }
            this.tipstext.text = sText;
        };
        // 移除事件监听
        ItemToolView.prototype.OnDestroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent('PackRef', Laya.Handler.create(this, this.UpDateText));
        };
        return ItemToolView;
    }(ui.main.ItemToolViewUI));
    H52D_Framework.ItemToolView = ItemToolView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ItemToolView.js.map