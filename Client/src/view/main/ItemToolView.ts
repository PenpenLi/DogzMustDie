/**首冲商城UI*/
module H52D_Framework {
	export class ItemToolView extends ui.main.ItemToolViewUI {
		constructor() {
			super();
            this.on(Laya.Event.REMOVED, this, this.OnDestroy)
			Event.RegistEvent('PackRef', Laya.Handler.create(this, this.UpDateText));//背包界面刷新
			this.UpDateText( )
		}

		//** 刷新UI */
		public UpDateText(){
			let sText = ""
			let list = BagManager.Instance.GetItemList( )
			for( let id in list ){
				let item = list[id]
				sText += item.itemStrName + "(" + item.dwItemName + ")" + ":" + item.itemNumber + "\n"
			}
			this.tipstext.text = sText
		}

		// 移除事件监听
        private OnDestroy(): void {
            this.offAll();
            Event.RemoveEvent('PackRef', Laya.Handler.create(this, this.UpDateText));
        }
	}
}