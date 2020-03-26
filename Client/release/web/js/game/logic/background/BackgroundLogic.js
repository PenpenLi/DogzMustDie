var H52D_Framework;
(function (H52D_Framework) {
    /** 背景逻辑累 */
    var BackgroundManager = /** @class */ (function () {
        function BackgroundManager() {
        }
        Object.defineProperty(BackgroundManager, "Instance", {
            get: function () {
                if (BackgroundManager._inst == null) {
                    BackgroundManager._inst = new BackgroundManager();
                }
                return BackgroundManager._inst;
            },
            enumerable: true,
            configurable: true
        });
        BackgroundManager.prototype.Initialize = function () {
        };
        /** 更换背景图 */
        BackgroundManager.prototype.changePictrue = function () {
        };
        return BackgroundManager;
    }());
    H52D_Framework.BackgroundManager = BackgroundManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=BackgroundLogic.js.map