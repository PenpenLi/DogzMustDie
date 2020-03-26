module H52D_Framework {
    import MainDpsViewUI = ui.main.subinterface.MainDpsViewUI;
    const path: string = "ui_icon/";

    /**
     * @class：
     * @author：zhangyusong
     */
    export class MainDpsView extends MainDpsViewUI implements IViewPanel {
        private type:string;
        public constructor(type:string="") {
            super();
            this.type = type;           
            this.InitEvent();
        }


        public Destroy(): void {
            Event.RemoveEvent('UpdateBtnList', Laya.Handler.create(this, this.Show_Control));
            Event.RemoveEvent(EventDefine.ALL_DPS, Laya.Handler.create(this, this.ShowTotlesDps));
            Event.RemoveEvent(EventDefine.HERO_DPS, Laya.Handler.create(this, this.ShowHeroDps));
            Event.RemoveEvent(EventDefine.PET_DPS, Laya.Handler.create(this, this.ShowPetDps));
            Event.RemoveEvent(EventDefine.CAMP_DPS, Laya.Handler.create(this, this.ShowCampDps));
            this.destroy();
        }

        private InitEvent(): void {
            Event.RegistEvent('UpdateBtnList', Laya.Handler.create(this, this.Show_Control));
            Event.RegistEvent(EventDefine.ALL_DPS, Laya.Handler.create(this, this.ShowTotlesDps));
            Event.RegistEvent(EventDefine.HERO_DPS, Laya.Handler.create(this, this.ShowHeroDps));
            Event.RegistEvent(EventDefine.PET_DPS, Laya.Handler.create(this, this.ShowPetDps));
            Event.RegistEvent(EventDefine.CAMP_DPS, Laya.Handler.create(this, this.ShowCampDps));
        }

        private ShowTotlesDps(totles: string): void {
            this.dsp_totles.text = Abbreviation(Number(totles));
        }

        private ShowHeroDps(hero: string): void {
            this.dsp_hero.text = Abbreviation(Number(hero));
        }

        private ShowPetDps(pet: string): void {
            this.dsp_pet.text = Abbreviation(Number(pet));
        }

        private ShowCampDps(camp: string): void {
            this.dsp_camp.text = Abbreviation(Number(camp));
        }

        private Show_Control(){
            this.bg.visible=WroldBossLogic.Instance.Show;
        }
    }
}