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
    var TextNameView = /** @class */ (function (_super) {
        __extends(TextNameView, _super);
        function TextNameView() {
            var _this = _super.call(this) || this;
            _this.logArray = [];
            _this.UpdateList();
            return _this;
        }
        TextNameView.prototype.UpdateList = function () {
            this.sList.vScrollBarSkin = "";
            this.sList.array = this.logArray;
            this.sList.renderHandler = new Laya.Handler(this, this.OnComeplete);
        };
        TextNameView.prototype.OnComeplete = function (item, index) {
            var tx = item.getChildByName("tx_log");
            tx.text = this.logArray[index];
        };
        TextNameView.prototype.SetLog = function (list) {
            this.logArray.push(list);
            this.sList.array = this.logArray;
        };
        TextNameView.prototype._Cler = function () {
            this.logArray = [];
        };
        return TextNameView;
    }(ui.common.TextDamageUI));
    H52D_Framework.TextNameView = TextNameView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=TextNameView.js.map