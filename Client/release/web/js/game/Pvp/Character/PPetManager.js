var H52D_Framework;
(function (H52D_Framework) {
    var PPetManager = /** @class */ (function () {
        function PPetManager() {
        }
        Object.defineProperty(PPetManager.prototype, "PetIns", {
            get: function () { return this._Pet; },
            enumerable: true,
            configurable: true
        });
        /**加载神兽模型 */
        PPetManager.prototype.LoadBPet = function (id, sceneId, btype, vo) {
            this.Destroy();
            var sid = sceneId - 10000;
            var point = btype == 1 ? H52D_Framework.PetPoint[sid] : H52D_Framework.EPetPoint[sid];
            this._Pet = new H52D_Framework.PPet(id, vo, btype);
            this._Pet.LoadMoudle(point[0], point[1], 2);
        };
        /**设置目标开启战斗 */
        PPetManager.prototype.SetTarget = function (target) {
            this._Pet.Target = [];
            this._Pet.Target = target;
            this._Pet.BClose = false;
        };
        PPetManager.prototype.SetDamage = function () {
            this._Pet.SetDamage();
        };
        PPetManager.prototype.Destroy = function () {
            if (this._Pet) {
                this._Pet.Destroy();
                this._Pet = null;
            }
        };
        return PPetManager;
    }());
    H52D_Framework.PPetManager = PPetManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PPetManager.js.map