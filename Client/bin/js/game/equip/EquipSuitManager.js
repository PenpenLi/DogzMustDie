/**
* 时空法器套装管理器
*/
var H52D_Framework;
(function (H52D_Framework) {
    var EquipSuitManager = /** @class */ (function () {
        function EquipSuitManager() {
        }
        Object.defineProperty(EquipSuitManager, "Instance", {
            get: function () {
                if (EquipSuitManager._init == null) {
                    EquipSuitManager._init = new EquipSuitManager();
                }
                return EquipSuitManager._init;
            },
            enumerable: true,
            configurable: true
        });
        return EquipSuitManager;
    }());
    H52D_Framework.EquipSuitManager = EquipSuitManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=EquipSuitManager.js.map