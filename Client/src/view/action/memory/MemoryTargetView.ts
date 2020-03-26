module H52D_Framework {
	// AddViewResource("MemoryChallengeView", [
	// 	{ url: "res/ui/ui_memory.atlas", type: Laya.Loader.ATLAS },
	// 	{ url: "res/ui/ui_kicking.atlas", type: Laya.Loader.ATLAS },
	// ]);
	export class MemoryTargetView extends ui.action.memory.MemoryTargetViewUI {
		private data:any;

		constructor() {
			super();
			this.ViewInit();
			this.EventInit();
		}

		private ViewInit() {
			this.data = MemoryLogic.Instance.challengeData;
			this.tx_hero_name.text = GetInfoAttr.Instance.GetText(this.data.CopyName);
			let winid: number = this.data.PassType == 1 ? 14007 : 14008;
			this.tx_win.text = "胜利条件：" + GetInfoAttr.Instance.GetSystemText(winid, this.data.PassValue);
			
			let condition = this.data.StarConditon;
			let star: Object = MemoryLogic.Instance.GetDungeonStar(MemoryType.equip, this.data.CopyId);
			for (let i: number = 1; i <= 3; i++) {
				(this["target_" + i].getChildByName("tx_through") as Laya.Text).text = this.GetCondition(condition[i], this.data.StarValue[i]);
				(this["target_" + i].getChildByName("img_star") as Laya.Image).gray = star[i] == 0;
				(this["target_" + i].getChildByName("img_diamonds") as Laya.Image).visible = star[i] == 0;
				(this["target_" + i].getChildByName("tx_diamonds") as Laya.Text).visible = star[i] == 0;
				(this["target_" + i].getChildByName("tx_diamonds") as Laya.Text).text="+"+this.data.FirstGetDiamond[i];
				(this["target_" + i].getChildByName("tx_cannot_complete") as Laya.Text).visible = star[i] == 1;
			}
		}

		private GetCondition(value: number, fill: Object): string {
			let id = 14006 + Number(value);
			let sys: string = GetInfoAttr.Instance.GetText(id);
			return Format(sys, fill[1], fill[2]);
		}

		private EventInit() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.btn_close.on(Laya.Event.CLICK, this, this.OnCloseHander);
		}

		private OnCloseHander() {
			UIManager.Instance.DestroyUI(this.name, [this.parent]);
		}

		private Destroy() {
			this.offAll();
		}

	}
}