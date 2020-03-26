/** 容器模块 */
var H52D_Framework;
(function (H52D_Framework) {
    var PackModule = /** @class */ (function () {
        function PackModule(sortFunc) {
            this._list = {};
            this._count = 0;
            this._dirty = false;
            this._array = [];
            this._sort = sortFunc;
        }
        /** 添加 */
        PackModule.prototype.Add = function (key, val) {
            if (this._list[key] == null) {
                this._count++;
            }
            this._list[key] = val;
            this._dirty = true;
        };
        /** 移除 */
        PackModule.prototype.Remove = function (key) {
            if (this._list[key] == null) {
                return;
            }
            delete this._list[key];
            this._count--;
            this._dirty = true;
        };
        Object.defineProperty(PackModule.prototype, "list", {
            /** 获取容器 */
            get: function () {
                return this._list;
            },
            enumerable: true,
            configurable: true
        });
        /** 获取值 */
        PackModule.prototype.getVal = function (key) {
            return this._list[key];
        };
        Object.defineProperty(PackModule.prototype, "count", {
            /** 获取数量 */
            get: function () {
                return this._count;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PackModule.prototype, "dirty", {
            /** 获取脏位 */
            get: function () {
                return this._dirty;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PackModule.prototype, "array", {
            /** 获取数组列表 */
            get: function () {
                if (this._dirty) {
                    this._array = [];
                    for (var key in this._list) {
                        var val = this._list[key];
                        this._array.push(val);
                    }
                    if (this._sort != null) {
                        this._array.sort(this._sort);
                    }
                    this._dirty = false;
                }
                return this._array;
            },
            enumerable: true,
            configurable: true
        });
        return PackModule;
    }());
    H52D_Framework.PackModule = PackModule;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PackModule.js.map