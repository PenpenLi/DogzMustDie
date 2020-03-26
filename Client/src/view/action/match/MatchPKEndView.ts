module H52D_Framework {
	export class MatchPKEndView extends ui.action.match.MatchPKEndViewUI {
		constructor() {
			super();
			this.ViewInit();
		}

		private _time: number = 5;
		private ViewInit() {
			this.AddEvent();
			this.ViewInfo();
		}

		private AddEvent() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.Btn_sure.on(Laya.Event.CLICK, this, this.Btn_closeclick);
		}

		private ViewInfo() {
			this.ShowTitleText();
			Tick.Loop(100, this, this.TimeFrame);
		}

		private TimeFrame(time: number) {
			this._time -= 0.1;
			this.Quit_time.text = "自动退出倒计时(" + Math.floor(this._time) + ")";
			if (this._time <= 0) {
				this.Btn_closeclick();
			}
		}

		private ShowTitleText() {
			//判断有没有自己
			this.title.text = "PK胜利";			
			if (MatchLogic.Instance.winnerIndexInGroup == StanceType.eLeft) {
				if (MatchLogic.Instance.Player2Name == MasterPlayer.Instance.player.Name) {
					this.title.text = "PK失败";
				}
			}
			else {
				if (MatchLogic.Instance.Player1Name == MasterPlayer.Instance.player.Name) {
					this.title.text = "PK失败";
				}
			}
		}

		private Btn_closeclick() {
			UIManager.Instance.DestroyUI(this.name, [this.parent]);		
			Event.DispatchEvent("DeputyClose");			
			BattleManager.Instance.OpenBattle();
		}

		private Destroy() {
			Tick.Clear(this, this.TimeFrame);
			this.offAll();
		}
	}
}