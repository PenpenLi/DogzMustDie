module H52D_Framework {
    export class SettingLogic {
        
        private _defaultVo:HeadVo;
        private heroHead:Array<number>;

        private static _inst: SettingLogic;
        public static get Instance() {
            if (SettingLogic._inst == null) {
                SettingLogic._inst = new SettingLogic();
            }
            return SettingLogic._inst;
        }

        constructor() {
        }

        public Initialize(){
            this._defaultVo = new HeadVo();
            this.InitEvent();
        }

        private InitEvent(){

        }

        public get defaultVo():HeadVo{
            this._defaultVo.headId = 0;
            this._defaultVo.headRes = "ui_head/icon_ui_01.png";
            this._defaultVo.headSelect = true;
            return this._defaultVo;
        }

        public get headList():Array<HeadVo>{
            let list:Array<HeadVo> = new Array<HeadVo>();
            this.heroHead = HeroManager.Instance.GetCfgHeroList();

            for(let i:number=0; i<this.heroHead.length;i++){
                let nHeroID = this.heroHead[i];
                let bActive = HeroManager.Instance.IsActive(nHeroID);
                if(bActive){
                    let hvo:HeadVo = new HeadVo();
                    hvo.headId = nHeroID;
                    hvo.headRes = "ui_icon/" + HeroConfig[nHeroID].strIcon;
                    hvo.headSelect = nHeroID == this._defaultVo.headId;
                    list.push(hvo);
                }
            }
            list.unshift(this.defaultVo);
            return list;
        }

        public get cost():number{
            return 0;
        }
    }
}