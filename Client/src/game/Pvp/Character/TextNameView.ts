
module H52D_Framework {
	export class TextNameView extends ui.common.TextDamageUI {

		constructor() {
			super();
			this.UpdateList();
		}


		private UpdateList() {
			this.sList.vScrollBarSkin = "";
			this.sList.array = this.logArray;
			this.sList.renderHandler = new Laya.Handler(this, this.OnComeplete);
		}

		private OnComeplete(item: Laya.Box, index: number) {
			let tx: Laya.Text = item.getChildByName("tx_log") as Laya.Text;
			tx.text = this.logArray[index];
		}

		private logArray: string[] = [];

		public SetLog(list) {
			this.logArray.push(list);
			this.sList.array = this.logArray;
		}

		public _Cler() {
			this.logArray = [];
		}

	}
}