
module H52D_Framework {
    export class PPetManager {
        constructor() {

        }

        private _Pet: PPet;
        public get PetIns() { return this._Pet; }
        
        /**加载神兽模型 */
        public LoadBPet(id: number, sceneId: number, btype: number, vo: any): void {
            this.Destroy();
            let sid = sceneId - 10000;
            let point = btype == 1 ? PetPoint[sid] : EPetPoint[sid];
            this._Pet = new PPet(id, vo, btype);
            this._Pet.LoadMoudle(point[0], point[1], 2);
        }


        /**设置目标开启战斗 */
        public SetTarget(target: any): void {
            this._Pet.Target = [];
            this._Pet.Target = target;
            this._Pet.BClose = false;
        }

        public SetDamage() {
            this._Pet.SetDamage();
        }

        public Destroy(): void {
            if (this._Pet) {
                this._Pet.Destroy();
                this._Pet = null;
            }
        }


    }
}