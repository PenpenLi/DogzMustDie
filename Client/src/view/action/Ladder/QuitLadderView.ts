/**Created by the LayaAirIDE*/
module H52D_Framework{
	export class QuitLadderView extends ui.action.Ladder.QuitLadderViewUI{
		constructor(){
			super();
			this. ViewInit();

		}

		private ViewInit(){
			this.ViewEvent();
		}

		private ViewEvent(){
			this.on(Laya.Event.REMOVED,this,this.Destroy);
			this.Btn_close.on(Laya.Event.CLICK,this,this.Btnclick_close);
			this.Btn_canle.on(Laya.Event.CLICK,this,this.Btnclick_close);
			this.Btn_sure.on(Laya.Event.CLICK,this,this.Btnclick_sure);
		}

		private ViewInfo(){
			this.Say.text=SysPromptConfig[30056].strPromptInfo;
		}


		private Btnclick_close(){
			UIManager.Instance.DestroyUI("QuitLadderView",[ViewDownRoot]);
		}

		private Btnclick_sure(){	
			CustomsManager.Instance.LeaveCustomsManager();
			BattlefieldManager.Instance.Destroy(); 
			UIManager.Instance.CreateUI("LadderView", [ViewDownRoot]);
			Event.DispatchEvent("DeputyClose");		
			LadderManager.Instance.IsMatching=false;
			// this.Btnclick_close();
		}

		private Destroy(){
			this.offAll();
		}
		
	}
}