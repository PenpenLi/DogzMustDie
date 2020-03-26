/**Created by the LayaAirIDE*/
module H52D_Framework{

	AddViewResource("JoinCampTip",
		[
			{ url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
		]);
	export class JoinCampTip extends ui.camp.JoinCampTipUI{
		constructor(){
			super();

			this.Init();
			
		}
		private Init(){
			this.AddEvent();
			this.camp_text.text=GetInfoAttr.Instance.GetText(6011);
		}

		private AddEvent(){
			this.btn_jioncamp.on(Laya.Event.CLICK,this,this.OpenView);
			this.btn_cancel.on(Laya.Event.CLICK,this,this.Btn_click);
			this.btn_close.on(Laya.Event.CLICK,this,this.Btn_click);	
			this.on(Laya.Event.REMOVED, this, this.Destroy);		
		}
		private OpenView(){
			//UIManager.Instance.CreateUI("CampView",[ViewUpRoot]);
			UIManager.Instance.DestroyUI("JoinCampTip",[ViewUpRoot]);
		}

		private Btn_click(){
			CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.camp, true);
			UIManager.Instance.DestroyUI("JoinCampTip",[ViewUpRoot]);
		}

		private Destroy() {
			this.offAll();
		}
	}
}