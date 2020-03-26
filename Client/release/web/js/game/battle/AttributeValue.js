/**
* name
*/
var H52D_Framework;
(function (H52D_Framework) {
    /**值类型 */
    var eValueType;
    (function (eValueType) {
        /**配置值 */
        eValueType[eValueType["Base"] = 0] = "Base";
        /**加成百分比 */
        eValueType[eValueType["Percent"] = 1] = "Percent";
        /**加成固定值 */
        eValueType[eValueType["Fixed"] = 2] = "Fixed";
        /**附加固定值 */
        eValueType[eValueType["Other"] = 3] = "Other";
        /**Buff固定值 */
        eValueType[eValueType["BFixed"] = 4] = "BFixed";
        /**Buff百分比 */
        eValueType[eValueType["BPercent"] = 5] = "BPercent";
    })(eValueType = H52D_Framework.eValueType || (H52D_Framework.eValueType = {}));
    /**属性值 */
    var AttributeValue = /** @class */ (function () {
        /**
         *
         * @param base 配置值
         * @param percent 加成百分比
         * @param fixed 加成固定值
         * @param other 附加固定值
         */
        function AttributeValue(base, percent, fixed, other, peta, bfixed, bper) {
            var _a;
            this._value = {};
            this._value = (_a = {},
                _a[eValueType.Base] = base >> 0,
                _a[eValueType.Percent] = percent >> 0,
                _a[eValueType.Fixed] = fixed >> 0,
                _a[eValueType.Other] = other >> 0,
                _a[eValueType.BFixed] = bfixed >> 0,
                _a[eValueType.BPercent] = bper >> 0,
                _a);
        }
        /**设置属性 */
        AttributeValue.prototype.SetValue = function (valType, value) {
            this._value[valType] = value;
            if (this._value[valType] < 0) {
                this._value[valType] = 0;
            }
        };
        /**修改属性 */
        AttributeValue.prototype.ModfiyValue = function (valType, value) {
            this._value[valType] += value;
            if (this._value[valType] < 0) {
                this._value[valType] = 0;
            }
        };
        Object.defineProperty(AttributeValue.prototype, "bValue", {
            get: function () {
                var value = (this._value[eValueType.Base]
                    + this._value[eValueType.Fixed])
                    * (1 + this._value[eValueType.Percent] / 10000);
                return Math.floor(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AttributeValue.prototype, "Value", {
            /**获取属性值 */
            get: function () {
                var value = (this._value[eValueType.Base]
                    + this._value[eValueType.Fixed])
                    * (1 + this._value[eValueType.Percent] / 10000)
                    + this._value[eValueType.Other];
                value = value + this._value[eValueType.BFixed] *
                    (1 + this._value[eValueType.BPercent] / 10000);
                return Math.floor(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AttributeValue.prototype, "Fixed", {
            /**获取固定属性值 */
            get: function () {
                var value = this._value[eValueType.Fixed];
                return Math.floor(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AttributeValue.prototype, "Percent", {
            /**获取百分比属性加值 */
            get: function () {
                var value = this._value[eValueType.Percent];
                return Math.floor(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AttributeValue.prototype, "Base", {
            /**获取配置表属性值 */
            get: function () {
                var value = this._value[eValueType.Base];
                return Math.floor(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AttributeValue.prototype, "Other", {
            /**获取附加值 */
            get: function () {
                var value = this._value[eValueType.Other];
                return Math.floor(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AttributeValue.prototype, "BFixed", {
            /**获取附加值 */
            get: function () {
                var value = this._value[eValueType.BFixed];
                return Math.floor(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AttributeValue.prototype, "BPercent", {
            /**获取附加值 */
            get: function () {
                var value = this._value[eValueType.BPercent];
                return Math.floor(value);
            },
            enumerable: true,
            configurable: true
        });
        return AttributeValue;
    }());
    H52D_Framework.AttributeValue = AttributeValue;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=AttributeValue.js.map