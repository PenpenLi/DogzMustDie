/**商城通用介绍*/
module H52D_Framework {

	AddViewResource("ShopInfoView",
		[
			{ url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS }
		]);
	export class ShopInfoView extends ui.tips.ShopInfoViewUI {

		private ItemIdArr: Array<any>;
		private ItemArr: Array<any>;
		/**
		 * @param buf { 1:标题 2:文字 3:ItemId数组}
		 */
		constructor(buf: any) {
			super();
			let data: Array<any> = [];
			for (let info in buf) {
				if (Number(info) != 0)
					data.push(buf[info]);
			}
			this.Init(data);
			this.AddEvent();
		}

		private Init(data: Array<any>) {

			this.ItemIdArr = [];
			this.ItemArr = [];
			this.infoName.text = data[0];
			this.introduce.text = data[1];

			if (data.length == 3) {
				for (let type in data[2]) {
					let data_rewrad = data[2][type];
					for (let rewrad in data_rewrad) {
						let id = data_rewrad[rewrad][2]
						let isRepetition = false;
						for (let i in this.ItemIdArr) {
							if (id == this.ItemIdArr[i]) {
								isRepetition = true;
							}
						}
						if (!isRepetition)
							this.ItemIdArr.push(id);
					}
				}

				let arr = this.ItemIdArr;
				for (let i = 0; i < arr.length; i++) {
					let ItemTypes_1 = ItemConfig[arr[i]].dwItemQuality;
					let dwItemType_1 = ItemConfig[arr[i]].dwItemTypes;
					for (let j = i + 1; j < arr.length; j++) {
						let ItemTypes_2 = ItemConfig[arr[j]].dwItemQuality;
						let dwItemType_2 = ItemConfig[arr[j]].dwItemTypes;
						let ItemTypes_1 = ItemConfig[arr[i]].dwItemQuality;
						if (dwItemType_1 == BaseDefine.ItemSonTypeUesHero) {
							if (dwItemType_2 == BaseDefine.ItemSonTypeUesHero) {
								if (ItemTypes_2 > ItemTypes_1) {
									let id = arr[i];
									arr[i] = arr[j];
									arr[j] = id;
								}
							}
						}
						else {
							if (dwItemType_2 == BaseDefine.ItemSonTypeUesHero) {
								let id = arr[i];
								arr[i] = arr[j];
								arr[j] = id;
							}
							else {
								if (ItemTypes_2 > ItemTypes_1) {
									let id = arr[i];
									arr[i] = arr[j];
									arr[j] = id;
								}
							}
						}
					}
				}
				this.itemList.array = arr;
				this.itemList.vScrollBarSkin = "";
			}
		}

		private AddEvent() {
			this.close.on(Laya.Event.CLICK, this, this.CloseUI);
			this.on(Laya.Event.REMOVED, this, this.OnDestroy);
			this.itemList.renderHandler = new Laya.Handler(this, this.SetitemList);
		}

		/**销毁按钮侦听器 */
		private OnDestroy(): void {
			this.offAll();
		}

		/** 
		 * 设置itemlist样式
         * @param item 单个box
         * @param index 索引
		*/
		private SetitemList(item, index: number) {
			let id = this.ItemIdArr[index];
			let data = ItemConfig[id];
			let name: Laya.Label = item.getChildByName("name");
			let icon: Laya.Image = item.getChildByName("icon");
			let bjIcon: Laya.Image = item.getChildByName("bjIcon");
			name.text = GetInfoAttr.Instance.GetText(data.dwItemName);
			name.color = BaseDefine.LabelColor[data.dwItemQuality];
			icon.skin = "ui_icon/" + data.strIconID_B;
			bjIcon.skin = BaseDefine.QualityList[data.dwItemQuality];
		}

		private CloseUI() {
			UIManager.Instance.DestroyUI("ShopInfoView", [ViewUpRoot]);

		}
	}
}