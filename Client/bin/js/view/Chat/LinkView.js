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
    var LinkView = /** @class */ (function (_super) {
        __extends(LinkView, _super);
        function LinkView() {
            var _this = _super.call(this) || this;
            _this.on(Laya.Event.REMOVED, _this, _this.Destroy);
            return _this;
        }
        LinkView.prototype.Destroy = function () {
            this.offAll();
        };
        return LinkView;
    }(ui.Chat.LinkViewUI));
    H52D_Framework.LinkView = LinkView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=LinkView.js.map