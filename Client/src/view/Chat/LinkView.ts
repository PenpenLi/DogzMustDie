module H52D_Framework {
	export class LinkView extends ui.Chat.LinkViewUI {	
		constructor() {
			super();

			this.on(Laya.Event.REMOVED, this, this.Destroy);
		}

		private Destroy(): void {
			this.offAll();
		}
	}
}