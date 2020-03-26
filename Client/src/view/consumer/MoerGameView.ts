/**Created by the LayaAirIDE*/
module H52D_Framework {

	AddViewResource("MoerGameView",
		[			
			{ url: "res/ui/ui_wroldboss.atlas", type: Laya.Loader.ATLAS },
		]);
	export class MoerGameView extends ui.consumer.MoerGameViewUI {
		constructor() {
			super();

			this.ViewInit();
		}

		private ViewInit() {
			this.ViewEvent();
			this.ViewInfo();
		}

		private ViewInfo() {
			this.pet_name.text = "天天欢乐萌宠";
			this.tank_name.text = "坦克大战";
		}

		private ViewEvent() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.other.on(Laya.Event.CLICK, this, this.btnclick_close);
			this.btn_close.on(Laya.Event.CLICK, this, this.btnclick_close);
			this.game_pet.on(Laya.Event.CLICK, this, this.MoreGame,["wx2b026a0fb135e79a"]);
			this.game_tank.on(Laya.Event.CLICK, this, this.MoreGame,["wxfb63ea5b79b63292"]);
		}

		private btnclick_close() {
			UIManager.Instance.DestroyUI("MoerGameView", [ViewUpRoot])
		}

		private MoreGame(str:string) {
			wxSDKMgr.Inst.Jump(str);
		}

		private Destroy() {
			this.offAll();
		}
	}
}