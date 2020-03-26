/** 掉落管理类 */
var H52D_Framework;
(function (H52D_Framework) {
    var DropManager = /** @class */ (function () {
        function DropManager() {
            /** 自动打开宝箱 */
            this.openBox = true;
            this._arrayCoinCls = [];
            this._arrayBoxCls = [];
        }
        Object.defineProperty(DropManager, "Instance", {
            get: function () {
                if (DropManager._inst == null) {
                    DropManager._inst = new DropManager();
                }
                return DropManager._inst;
            },
            enumerable: true,
            configurable: true
        });
        /** 创建金币
        * @param nX 位置
        * @param nY 位置
        * @param nMoney  金币卸载量
        * @param callback 金币消失回调
        */
        DropManager.prototype.AddDropCoin = function (nX, nY, nMoney, speed_x) {
            var cls = new H52D_Framework.DropCoin(nX, nY, nMoney, speed_x);
            this._arrayCoinCls.push(cls);
        };
        /** 设置附近胡金币全部飞回 */
        DropManager.prototype.SearchCoinFlyback = function (nX, nY) {
            for (var i = 0; i < this._arrayCoinCls.length; i++) {
                var coin = this._arrayCoinCls[i];
                if (coin.IsCanFlyback()) {
                    // 求是否在范围
                    var nDesX = Math.abs(nX - coin.GetPosX());
                    if (nDesX < 64) {
                        this._arrayCoinCls[i].BeginFlyBack();
                    }
                }
            }
        };
        /** 创建宝箱
        * @param nX 位置
        * @param nY 位置
        * @param nid 宝箱ID
        * @param callback 金币消失回调
        */
        DropManager.prototype.AddDropBox = function (nX, nY, nbox, callback) {
            var cls = new H52D_Framework.DropBox(nX, nY, nbox, callback);
            this._arrayBoxCls.push(cls);
        };
        /** 销毁掉落物 */
        DropManager.prototype.DeleteCoin = function (cls) {
            for (var i = 0; i < this._arrayCoinCls.length; i++) {
                if (this._arrayCoinCls[i] == cls) {
                    this._arrayCoinCls[i].Destroy();
                    this._arrayCoinCls[i] = null;
                    this._arrayCoinCls.splice(i, 1);
                    return;
                }
            }
        };
        /** 销毁掉宝箱 */
        DropManager.prototype.DeleteBox = function (cls) {
            for (var i = 0; i < this._arrayBoxCls.length; i++) {
                if (this._arrayBoxCls[i] == cls) {
                    this._arrayBoxCls[i].Destroy();
                    this._arrayBoxCls[i] = null;
                    this._arrayBoxCls.splice(i, 1);
                    return;
                }
            }
        };
        /** 清空所有金币和宝箱 */
        DropManager.prototype.Destroy = function () {
            for (var i = 0; i < this._arrayCoinCls.length; i++) {
                if (this._arrayCoinCls[i]) {
                    this._arrayCoinCls[i].Destroy();
                    this._arrayCoinCls[i] = null;
                }
            }
            this._arrayCoinCls = [];
            for (var i = 0; i < this._arrayBoxCls.length; i++) {
                if (this._arrayBoxCls[i]) {
                    this._arrayBoxCls[i].Destroy();
                    this._arrayBoxCls[i] = null;
                }
            }
            this._arrayBoxCls = [];
        };
        return DropManager;
    }());
    H52D_Framework.DropManager = DropManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=DropManager.js.map