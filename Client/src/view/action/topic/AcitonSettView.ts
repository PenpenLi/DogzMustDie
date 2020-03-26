/**Created by the LayaAirIDE*/
module H52D_Framework {


	export class AcitonSettView extends ui.action.topic.AcitonSettViewUI {
		constructor(buf) {
			super();

			this._hurt = buf[1];
			this.ViewInit();

		}

		private _hurt: number = 0;
		private _time = 5;
		private ViewInit() {
			this.AddEvent();
			Tick.Loop(100, this, this.ShowTime);
			this.my_hurt.text = Format(GetInfoAttr.Instance.GetText(7117), this._hurt);
		}

		private ShowTime() {
			this._time -= 0.1;
			this.quit_time.text = "自动退出倒计时(" + Math.floor(this._time) + ")";
			if (this._time <= 0) {
				this.Btn_quitclick();
			}
		}

		private AddEvent() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.Btn_quit.on(Laya.Event.CLICK, this, this.Btn_quitclick);
		}

		private Btn_quitclick() {
			UIManager.Instance.DestroyUI("AcitonSettView", [ViewTipRoot]);
			UIManager.Instance.DestroyUI("TopicView", [ViewToppestRoot]);
			Event.DispatchEvent("Action_sett");
		}

		private Destroy() {
			this.offAll();
			Tick.ClearAll(this);
		}
	}
}