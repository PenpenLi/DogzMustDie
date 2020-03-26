var H52D_Framework;
(function (H52D_Framework) {
    /**阵营管理类 */
    var PCampManager = /** @class */ (function () {
        function PCampManager() {
            this._Camp = null;
        }
        Object.defineProperty(PCampManager.prototype, "Camp", {
            /**阵营 */
            get: function () { return this._Camp; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PCampManager.prototype, "vo", {
            get: function () { return this._Camp.vo; },
            enumerable: true,
            configurable: true
        });
        /**加载阵营模型 */
        PCampManager.prototype.LoadBCamp = function (btype, vo) {
            this.Destroy();
            this._Camp = new H52D_Framework.PCamp(vo, btype);
            btype == 1 ? this._Camp.LoadMoudle(30, 300, 2) : this._Camp.LoadMoudle(710, 300, 2);
        };
        /**设置目标开启战斗 */
        PCampManager.prototype.SetTarget = function (target) {
            this._Camp.Target = target;
            this._Camp.BClose = false;
        };
        PCampManager.prototype.SetDamage = function () {
            this._Camp.SetDamage();
        };
        PCampManager.prototype.Destroy = function () {
            if (this._Camp) {
                this._Camp.Destroy();
                this._Camp = null;
            }
        };
        return PCampManager;
    }());
    H52D_Framework.PCampManager = PCampManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PCampManager.js.map