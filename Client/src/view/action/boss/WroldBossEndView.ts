/**Created by the LayaAirIDE*/
module H52D_Framework {
	export class WroldBossEndView extends ui.action.boss.WroldBossEndViewUI {
		constructor() {
			super();
		
			this.ViewInit();
		}
				
		private _time :number=5;
		private ViewInit() {
			WroldBossLogic.Instance.Show=false;		
			this.AddEvent();
			this.ViewInfo();
		}

		private AddEvent() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			//this.Other.on(Laya.Event.CLICK, this, this.Btn_closeclick);
			this.Btn_sure.on(Laya.Event.CLICK, this, this.Btn_closeclick);
		}

		private ViewInfo() {
			this.My_hurt.text = Format(GetInfoAttr.Instance.GetText(7118), BattleManager.Instance.TheWordBossDamage);			
			Tick.Loop(100, this, this.TimeFrame);
		}

		private TimeFrame(time:number) {
			this._time -= 0.1;			
			this.Quit_time.text = "自动退出倒计时(" + Math.floor(this._time) + ")";
			if(this._time<=0){
				this.Btn_closeclick();
			}
		}
		

		private Btn_closeclick() {
			Tick.Clear(this, this.TimeFrame);
			UIManager.Instance.DestroyUI("WroldBossEndView", [ViewUpRoot]);
			Event.DispatchEvent("CUSTOMS_RESULT", [false]);
			WroldBossLogic.Instance.Show=true;
			Event.DispatchEvent("DeputyClose");	
			BattleManager.Instance.OpenBattle();
		}

		private Destroy() {
			this.offAll();			
		}
	}
}