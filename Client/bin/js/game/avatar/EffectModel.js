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
/*
* 临时特效模型类;
*/
var H52D_Framework;
(function (H52D_Framework) {
    /**模型类 */
    var EffectModel = /** @class */ (function (_super) {
        __extends(EffectModel, _super);
        function EffectModel() {
            var _this = _super.call(this) || this;
            _this.graphics.drawRect(0, 0, 10, 3, "#ff0000");
            _this.visible = false;
            H52D_Framework.EffectRoot.addChild(_this);
            return _this;
        }
        EffectModel.prototype.Play = function (url, b) {
            this.visible = true;
        };
        EffectModel.prototype.Rotate = function (value) {
            this.rotation = value;
        };
        Object.defineProperty(EffectModel.prototype, "PosX", {
            get: function () {
                return this.x;
            },
            set: function (value) {
                this.x = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EffectModel.prototype, "PosY", {
            get: function () {
                return this.y;
            },
            set: function (value) {
                this.y = value;
            },
            enumerable: true,
            configurable: true
        });
        return EffectModel;
    }(Laya.Sprite));
    H52D_Framework.EffectModel = EffectModel;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=EffectModel.js.map