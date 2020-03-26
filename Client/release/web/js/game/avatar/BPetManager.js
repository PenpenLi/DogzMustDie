var H52D_Framework;
(function (H52D_Framework) {
    var BPetManager = /** @class */ (function () {
        function BPetManager() {
        }
        Object.defineProperty(BPetManager, "Instance", {
            get: function () {
                if (!BPetManager._instance) {
                    BPetManager._instance = new BPetManager();
                }
                return BPetManager._instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BPetManager.prototype, "PetIns", {
            get: function () {
                return this._Pet;
            },
            enumerable: true,
            configurable: true
        });
        /**加载神兽模型 */
        BPetManager.prototype.LoadBPet = function (id, sceneId) {
            this.Destroy();
            var sid = sceneId - 10000;
            var point = H52D_Framework.PetPoint[sid];
            var x = point[0];
            var y = point[1];
            //点击宠物气泡            
            H52D_Framework.Event.DispatchEvent("SetClickPetButton", [x, y]);
            this._Pet = new H52D_Framework.BPet(id);
            if (this._Pet.vo) {
                this._Pet.vo.CurrentState = 1;
            }
            this._Pet.LoadMoudle(x, y, 2, null);
            if (H52D_Framework.BattleManager.Instance.MonsterFormation) {
                this.SetTarget(H52D_Framework.BattleManager.Instance.MonsterFormation.GetFrontobject[0]);
            }
            if (H52D_Framework.BattleManager.Instance.aIOperation) {
                H52D_Framework.BattleManager.Instance.aIOperation.Dps();
            }
            for (var k in H52D_Framework.PetManager.Instance.OwnPetList) {
                H52D_Framework.PetManager.Instance.OwnPetList[k].OnEffectAttribute();
            }
            return this._Pet;
        };
        BPetManager.prototype.LoadBPetinfo = function (id) {
            var pet = H52D_Framework.PetManager.Instance.GetPet_Instance(id);
            pet.CurrentState = 1;
            return pet;
        };
        /**设置目标开启战斗 */
        BPetManager.prototype.SetTarget = function (target) {
            this._Pet.Target = [];
            this._Pet.Target.push(target);
            this._Pet.Close = false;
        };
        BPetManager.prototype.Destroy = function () {
            if (this._Pet) {
                this._Pet.Destroy();
                this._Pet = null;
            }
        };
        return BPetManager;
    }());
    H52D_Framework.BPetManager = BPetManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=BPetManager.js.map