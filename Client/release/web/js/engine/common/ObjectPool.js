/**
* 对象池
*/
var H52D_Framework;
(function (H52D_Framework) {
    var ObjectPool = /** @class */ (function () {
        function ObjectPool(size, type) {
            /**可用的对象池 */
            this._noActivePool = [];
            /**取出来的对象 存放的池子 */
            this._ActicvePool = [];
            /**最大对象数 */
            this._maxIndex = 0;
            /**最小对象数 */
            this._minIndex = 0;
            this._poolType = type;
            this._maxIndex = size;
            this._minIndex = 1;
            this._noActivePool = [];
            this._ActicvePool = [];
        }
        Object.defineProperty(ObjectPool.prototype, "MaxIndex", {
            /**最大对象数 */
            get: function () { return this._maxIndex; },
            enumerable: true,
            configurable: true
        });
        /**加入到可用的池子 */
        ObjectPool.prototype.AddNoActivePool = function (entity) {
            if (this._noActivePool.length <= this._maxIndex) {
                this._noActivePool.push(entity);
            }
        };
        /**从可用池子里取东西 */
        ObjectPool.prototype.GetPoolElement = function () {
            if (this._noActivePool.length >= this._minIndex) {
                var tem = this._noActivePool.pop();
                if (this._ActicvePool.length <= this._maxIndex) {
                    this._ActicvePool.push(tem);
                }
                return tem;
            }
            return null;
        };
        Object.defineProperty(ObjectPool.prototype, "GetActivePool", {
            get: function () {
                return this._ActicvePool;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectPool.prototype, "GetNoActivePool", {
            get: function () {
                return this._noActivePool;
            },
            enumerable: true,
            configurable: true
        });
        ObjectPool.prototype.Destroy = function () {
            for (var i = 0; i < this.GetActivePool.length; i++) {
                if (this._ActicvePool[i]) {
                    this._ActicvePool[i].Destroy();
                    this._ActicvePool[i] = null;
                }
            }
            for (var i = 0; i < this.GetNoActivePool.length; i++) {
                if (this._noActivePool[i]) {
                    this._noActivePool[i].Destroy();
                    this._noActivePool[i] = null;
                }
            }
            this._noActivePool = [];
            this._ActicvePool = [];
        };
        return ObjectPool;
    }());
    H52D_Framework.ObjectPool = ObjectPool;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ObjectPool.js.map