
module H52D_Framework {
    /**PVP人物实例 */
    export class PvPCharacter {
        private _HeroManger: PHeroCradMgr;
        public get Heromanager() { return this._HeroManger; }
        public get HeroList() { return this._HeroManger.CHeroList; }
        public petMgr: PPetManager;
        public campMgr: PCampManager;
        public player: PPlayer;
        private _btype: number = 0;

        constructor(i: number) {
            this._btype = i;
        }
        
        public Load() {
            this.LoadHero();
            this.LoadPet();
            this.LoadCamp();
            this.LoadPlayer();
            this.LoadAttr();
        }

        private LoadAttr() {
            if (this._btype == 1) {
                let info = DataManager.Instance.UnOPack.AttributeInfo;
                for (let k in info) {
                    info[k].OnEffect(DataManager.Instance.UnOPack.Info);
                }
            }
            else {
                let info = DataManager.Instance.UnEPack.AttributeInfo;
                for (let k in info) {
                    info[k].OnEffect(DataManager.Instance.UnEPack.Info);
                }
            }
        }

        private LoadPlayer() {
            if (this._btype == 1) {
                this.player = new PPlayer(this._btype, DataManager.Instance.UnOPack.Playinfo);
            }
            else {
                this.player = new PPlayer(this._btype, DataManager.Instance.UnEPack.Playinfo);
            }
        }

        private LoadHero() {
            this._HeroManger = new PHeroCradMgr(this._btype);
            if (this._btype == 1) {
                this._HeroManger.AvatarInit(null, DataManager.Instance.UnOPack.HeroList);
            }
            else {
                this._HeroManger.AvatarInit(null, DataManager.Instance.UnEPack.HeroList);
            }
        }

        private LoadPet() {
            if (this._btype == 1) {
                if (!ObjIsEmpty(DataManager.Instance.UnOPack.PetList[0])) {
                    let sceneid = CustomsManager.Instance.CustomsVo.sceneID;
                    this.petMgr = new PPetManager();
                    this.petMgr.LoadBPet(PetManager.Instance.CurrentpetID, sceneid,
                        this._btype, DataManager.Instance.UnOPack.PetList[0]);
                }
            }
            else {
                if (!ObjIsEmpty(DataManager.Instance.UnEPack.PetList[0])) {
                    let sceneid = CustomsManager.Instance.CustomsVo.sceneID;
                    this.petMgr = new PPetManager();
                    this.petMgr.LoadBPet(PetManager.Instance.CurrentpetID, sceneid,
                        this._btype, DataManager.Instance.UnEPack.PetList[0]);
                }
            }
        }

        private LoadCamp() {
            if (this._btype == 1) {
                if (!ObjIsEmpty(DataManager.Instance.UnOPack.Camp)) {
                    this.campMgr = new PCampManager();
                    this.campMgr.LoadBCamp(this._btype, DataManager.Instance.UnOPack.Camp);
                }
            }
            else {
                if (!ObjIsEmpty(DataManager.Instance.UnEPack.Camp)) {
                    this.campMgr = new PCampManager();
                    this.campMgr.LoadBCamp(this._btype, DataManager.Instance.UnEPack.Camp);
                }
            }
        }

        public OnUpdate() {
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
        }

        public Destroy() {
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
        }

    }
}