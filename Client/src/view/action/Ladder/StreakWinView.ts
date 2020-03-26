/**Created by the LayaAirIDE*/
module H52D_Framework {
	AddViewResource("StreakWinView", [
		{ url: "res/ui/ui_ladder.atlas", type: Laya.Loader.ATLAS },
		{ url: "res/ui/ui_icon.atlas", type: Laya.Loader.ATLAS },
	]);
	export class StreakWinView extends ui.action.Ladder.StreakWinViewUI {
		private _tatilnum: number = 0;
		private _saynum: number = 0;
		private _winnum = 0;
		private _sharetype: number = 0;
		private _dnum = 0;
		constructor(buf) {
			super();
			this._tatilnum = buf[1];
			this._saynum = buf[2];
			this._winnum = buf[3];
			this._dnum = buf[4];
			this.ViewInit();
		}

		private ViewInit() {
			this.ViewInfo();
			this.ViewEvent();
		}

		private ViewEvent() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.Btn_close.on(Laya.Event.CLICK, this, this.btnclick_close);
			this.Btn_share.on(Laya.Event.CLICK, this, this.btnclick_share);
		}

		private ViewInfo() {
			this.tx_tatil.text = GetInfoAttr.Instance.GetText(this._tatilnum);
			this.say.text = GetInfoAttr.Instance.GetText(this._saynum);
			this.action_type.text = this._tatilnum == 5027 ? "恭喜天梯达成" : "恭喜约战达成";
			this._sharetype = this._tatilnum == 5027 ? ShareType.ladder_win : ShareType.pvp;
			SetHtmlStyle(this.share_rew, 20, "#4f7c23", "center");
			let path = "<img src= 'ui_icon/icon_prop_013.png' width='24px' height='24px'></img>";
			this.share_rew.innerHTML = path + this._dnum;
			this.one.index = this._winnum;
			if (this._winnum > 5) {
				this.two.visible = true;
				this.one.index = 1;
				this.two.index = this._winnum % 10;
				this.one.x = 287;
			}
		}

		private btnclick_close() {
			UIManager.Instance.DestroyUI("StreakWinView", [ViewToppestRoot]);
		}

		private btnclick_share() {
			CallShare(this._sharetype);
			this.btnclick_close();
		}

		private Destroy() {
			this.offAll();
		}
	}
}