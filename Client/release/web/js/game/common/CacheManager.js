var H52D_Framework;
(function (H52D_Framework) {
    /**
     * @class 缓存管理类
     * @author zhangyusong
     */
    var CacheManager = /** @class */ (function () {
        function CacheManager() {
        }
        Object.defineProperty(CacheManager, "Instance", {
            get: function () {
                if (CacheManager._inst == null) {
                    CacheManager._inst = new CacheManager();
                }
                return CacheManager._inst;
            },
            enumerable: true,
            configurable: true
        });
        /** 获取开关信息 */
        CacheManager.prototype.getDerailByType = function (cls, type) {
            var local = type;
            var cacheValue = H52D_Framework.MasterPlayer.Instance.cacheValue;
            this._derailData = cacheValue[Number(cls)];
            // this._derailData = MasterPlayer.Instance.cacheValue[cls];
            var open = !!(this._derailData & (1 << local));
            return open;
        };
        /**
         * 设置某个类型的开关
         */
        CacheManager.prototype.setDerailByType = function (cls, type, open) {
            var local = type;
            this._derailData = H52D_Framework.MasterPlayer.Instance.cacheValue[cls];
            if (open) {
                this._derailData |= (1 << local);
            }
            else {
                this._derailData &= ~(1 << local);
            }
            H52D_Framework.MasterPlayer.Instance.cacheValue[cls] = this._derailData;
            H52D_Framework.RemoteCall.Instance.Send("K_ChgCliendInfo", cls, this._derailData);
        };
        return CacheManager;
    }());
    H52D_Framework.CacheManager = CacheManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=CacheManager.js.map