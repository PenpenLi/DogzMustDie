var H52D_Framework;
(function (H52D_Framework) {
    /**阵营管理类 */
    var BCampManager = /** @class */ (function () {
        function BCampManager() {
        }
        Object.defineProperty(BCampManager, "Instance", {
            get: function () {
                if (!BCampManager._instance) {
                    BCampManager._instance = new BCampManager();
                }
                return BCampManager._instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BCampManager.prototype, "Camp", {
            /**阵营 */
            get: function () { return this._Camp; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BCampManager.prototype, "vo", {
            get: function () { return this._CampVo; },
            enumerable: true,
            configurable: true
        });
        BCampManager.prototype.initData = function () {
            this._CampVo = new H52D_Framework.BCampVo();
        };
        /**加载阵营模型 */
        BCampManager.prototype.LoadBCamp = function () {
            this.Destroy();
            this._Camp = new H52D_Framework.BCamp(this._CampVo);
            this._Camp.LoadMoudle(30, 300, 2, Laya.Handler.create(this, function () {
                if (H52D_Framework.BattleManager.Instance.aIOperation)
                    H52D_Framework.BattleManager.Instance.aIOperation.Dps();
            }));
            return this._Camp;
        };
        /**设置目标开启战斗 */
        BCampManager.prototype.SetTarget = function (target) {
            this._Camp.Target = [];
            this._Camp.Target.push(target);
            this._Camp.Close = false;
        };
        BCampManager.prototype.Destroy = function () {
            if (this._Camp) {
                this._Camp.Destroy();
                this._Camp = null;
            }
        };
        return BCampManager;
    }());
    H52D_Framework.BCampManager = BCampManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=BCampManager.js.map