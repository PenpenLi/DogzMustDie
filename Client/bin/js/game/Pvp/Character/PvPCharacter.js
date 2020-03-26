var H52D_Framework;
(function (H52D_Framework) {
    /**PVP人物实例 */
    var PvPCharacter = /** @class */ (function () {
        function PvPCharacter(i) {
            this._btype = 0;
            this._btype = i;
        }
        Object.defineProperty(PvPCharacter.prototype, "Heromanager", {
            get: function () { return this._HeroManger; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PvPCharacter.prototype, "HeroList", {
            get: function () { return this._HeroManger.CHeroList; },
            enumerable: true,
            configurable: true
        });
        PvPCharacter.prototype.Load = function () {
            this.LoadHero();
            this.LoadPet();
            this.LoadCamp();
            this.LoadPlayer();
            this.LoadAttr();
        };
        PvPCharacter.prototype.LoadAttr = function () {
            if (this._btype == 1) {
                var info = H52D_Framework.DataManager.Instance.UnOPack.AttributeInfo;
                for (var k in info) {
                    info[k].OnEffect(H52D_Framework.DataManager.Instance.UnOPack.Info);
                }
            }
            else {
                var info = H52D_Framework.DataManager.Instance.UnEPack.AttributeInfo;
                for (var k in info) {
                    info[k].OnEffect(H52D_Framework.DataManager.Instance.UnEPack.Info);
                }
            }
        };
        PvPCharacter.prototype.LoadPlayer = function () {
            if (this._btype == 1) {
                this.player = new H52D_Framework.PPlayer(this._btype, H52D_Framework.DataManager.Instance.UnOPack.Playinfo);
            }
            else {
                this.player = new H52D_Framework.PPlayer(this._btype, H52D_Framework.DataManager.Instance.UnEPack.Playinfo);
            }
        };
        PvPCharacter.prototype.LoadHero = function () {
            this._HeroManger = new H52D_Framework.PHeroCradMgr(this._btype);
            if (this._btype == 1) {
                this._HeroManger.AvatarInit(null, H52D_Framework.DataManager.Instance.UnOPack.HeroList);
            }
            else {
                this._HeroManger.AvatarInit(null, H52D_Framework.DataManager.Instance.UnEPack.HeroList);
            }
        };
        PvPCharacter.prototype.LoadPet = function () {
            if (this._btype == 1) {
                if (!H52D_Framework.ObjIsEmpty(H52D_Framework.DataManager.Instance.UnOPack.PetList[0])) {
                    var sceneid = H52D_Framework.CustomsManager.Instance.CustomsVo.sceneID;
                    this.petMgr = new H52D_Framework.PPetManager();
                    this.petMgr.LoadBPet(H52D_Framework.PetManager.Instance.CurrentpetID, sceneid, this._btype, H52D_Framework.DataManager.Instance.UnOPack.PetList[0]);
                }
            }
            else {
                if (!H52D_Framework.ObjIsEmpty(H52D_Framework.DataManager.Instance.UnEPack.PetList[0])) {
                    var sceneid = H52D_Framework.CustomsManager.Instance.CustomsVo.sceneID;
                    this.petMgr = new H52D_Framework.PPetManager();
                    this.petMgr.LoadBPet(H52D_Framework.PetManager.Instance.CurrentpetID, sceneid, this._btype, H52D_Framework.DataManager.Instance.UnEPack.PetList[0]);
                }
            }
        };
        PvPCharacter.prototype.LoadCamp = function () {
            if (this._btype == 1) {
                if (!H52D_Framework.ObjIsEmpty(H52D_Framework.DataManager.Instance.UnOPack.Camp)) {
                    this.campMgr = new H52D_Framework.PCampManager();
                    this.campMgr.LoadBCamp(this._btype, H52D_Framework.DataManager.Instance.UnOPack.Camp);
                }
            }
            else {
                if (!H52D_Framework.ObjIsEmpty(H52D_Framework.DataManager.Instance.UnEPack.Camp)) {
                    this.campMgr = new H52D_Framework.PCampManager();
                    this.campMgr.LoadBCamp(this._btype, H52D_Framework.DataManager.Instance.UnEPack.Camp);
                }
            }
        };
        PvPCharacter.prototype.OnUpdate = function () {
            if (this._HeroManger) {
                this._HeroManger.OnUpdate();
            }
            if (this.campMgr) {
                this.campMgr.Camp.OnUpdate();
            }
            if (this.petMgr) {
                this.petMgr.PetIns.OnUpdate();
            }
            if (this.player) {
                this.player.OnUpdate();
            }
        };
        PvPCharacter.prototype.Destroy = function () {
            if (this._HeroManger) {
                this._HeroManger.Destroy();
                this._HeroManger = null;
            }
            if (this.campMgr) {
                this.campMgr.Destroy();
                this.campMgr = null;
            }
            if (this.petMgr) {
                this.petMgr.Destroy();
                this.petMgr = null;
            }
            if (this.player) {
                this.player.Destroy();
            }
        };
        return PvPCharacter;
    }());
    H52D_Framework.PvPCharacter = PvPCharacter;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PvPCharacter.js.map