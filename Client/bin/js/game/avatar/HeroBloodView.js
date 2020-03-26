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
/**
 * 英雄血条
 * @author zhangyusong
 */
var H52D_Framework;
(function (H52D_Framework) {
    var HeroBloodView = /** @class */ (function (_super) {
        __extends(HeroBloodView, _super);
        /**初始化 */
        function HeroBloodView() {
            var _this = _super.call(this) || this;
            _this.visible = true;
            _this.img_blood.x = 0;
            _this.maxWidth = _this.img_blood.width;
            return _this;
        }
        Object.defineProperty(HeroBloodView.prototype, "proportion", {
            set: function (value) {
                if (value <= 0) {
                    value = 0;
                    this.visible = false;
                    this.destroy();
                }
                else if (value > 1) {
                    value = 1;
                }
                this.img_blood.x = -this.maxWidth * (1 - value);
            },
            enumerable: true,
            configurable: true
        });
        return HeroBloodView;
    }(ui.action.kicking.HeroBloodViewUI));
    H52D_Framework.HeroBloodView = HeroBloodView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=HeroBloodView.js.map