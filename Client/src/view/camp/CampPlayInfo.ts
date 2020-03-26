/**Created by the LayaAirIDE*/
module H52D_Framework {

	AddViewResource("CampPlayInfo",
		[
			{ url: "res/ui/ui_head.atlas", type: Laya.Loader.ATLAS },
		]);
	export class CampPlayInfo extends ui.camp.CampPlayInfoUI {
		constructor() {
			super();

			this.Play_Info=CampManager.Instance.OntherPlatInfo;			
			this.Add_Event();
			this.CampInfo();
			
		}
		
		private Play_Info=[];
		private Add_Event() {
			this.Btn_Close.on(Laya.Event.CLICK, this, this.BtnClick_close);
			this.Other.on(Laya.Event.CLICK, this, this.BtnClick_close);	
			this.btn_sure.on(Laya.Event.CLICK, this, this.BtnClick_close);
			this.on(Laya.Event.REMOVED, this, this.Destroy);
		}

		private BtnClick_close(name: string) {
			UIManager.Instance.DestroyUI("CampPlayInfo", [ViewUpRoot]);
		}

		private CampInfo() {			
			this.Play_Name.text=this.Play_Info[1];
			let camp_id=this.Play_Info[3];
			let cuorder=this.Play_Info[4]
			
			let play_list = CampManager.Instance.Camp_PlayInfO;
			let play = this.Play_Info[1];						
			let camp_name = GetInfoAttr.Instance.GetText(GangConfig[camp_id].nameId);			
			this.camp_name.text = camp_name;
			this.guanka_num.text = "" +this.Play_Info[4]
			if(this.Play_Info[4]>10000){
				this.guanka_num.text = "" +(this.Play_Info[4]-10000);
			}
			this.hero_num.text = "" + this.Play_Info[5];
			this.pet_num.text = "" + this.Play_Info[6];
			if(!this.Play_Info[5]){
				this.hero_num.text="无";
			}
			if(!this.Play_Info[6]){
				this.pet_num.text="无";
			}			
			if (this.Play_Info[7]) {
				let now=Time.serverSecodes - this.Play_Info[7]				
				let time = GetFormatTime(now);
				this.time_num.text = time + "前";
			}
			else{
				this.time_num.text="小于 1 分钟";
			}

		}
		private Destroy() {
			this.offAll();
		}
	}
}