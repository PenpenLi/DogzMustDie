
module H52D_Framework {
    export class BPetManager {
        private constructor() {

        }

        private static _instance: BPetManager;

        public static get Instance() {
            if (!BPetManager._instance) {
                BPetManager._instance = new BPetManager();
            }
            return BPetManager._instance;
        }
        
        private _Pet: BPet;
        public get PetIns() {
            return this._Pet;
        }

        /**加载神兽模型 */
        public LoadBPet(id: number, sceneId: number) {
            this.Destroy();
            let sid = sceneId - 10000;
            let point = PetPoint[sid];
            let x = point[0];
            let y = point[1];
            //点击宠物气泡            
            Event.DispatchEvent("SetClickPetButton", [x, y]);

            this._Pet = new BPet(id);
            if(this._Pet.vo){
                this._Pet.vo.CurrentState = 1;
            }
            this._Pet.LoadMoudle(x, y, 2, null);
            if (BattleManager.Instance.MonsterFormation) {
                this.SetTarget(BattleManager.Instance.MonsterFormation.GetFrontobject[0]);
            }
            if (BattleManager.Instance.aIOperation) {
                BattleManager.Instance.aIOperation.Dps();
            }
            for (let k in PetManager.Instance.OwnPetList) {
                PetManager.Instance.OwnPetList[k].OnEffectAttribute();
            }
            return this._Pet;
        }
        

        public LoadBPetinfo(id: number) {
            let pet = PetManager.Instance.GetPet_Instance(id);
            pet.CurrentState = 1;
            return pet;
        }
       

        /**设置目标开启战斗 */
        public SetTarget(target: any): void {
            this._Pet.Target = [];
            this._Pet.Target.push(target);
            this._Pet.Close = false;
        }


        public Destroy(): void {
            if (this._Pet) {
                this._Pet.Destroy();
                this._Pet = null;
            }
        }


    }
}