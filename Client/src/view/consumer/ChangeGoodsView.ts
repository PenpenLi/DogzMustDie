
/**物品兑换 视图类 */
module H52D_Framework {

	AddViewResource("ChangeGoodsView", [
		{ url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
		{ url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
		{ url: "res/ui/ui_icon.atlas", type: Laya.Loader.ATLAS },
	]);
	export class ChangeGoodsView extends ui.consumer.ChangeGoodsViewUI {
		constructor() {
			super();

			this.ViewInit();

		}

		private _time:number=0;;
		private ViewInit() {
			this.ChangeItem_list.vScrollBarSkin = "";

			this.ViewEvent();
			this.SetItem_list();
			this._time=ChangeGoodsManager.Instance.ActionData.svot- Time.serverSecodes
			Tick.Loop(100,this,this.OnceTime);
			this.say.text=GetInfoAttr.Instance.GetText(7142);
		}

		private OnceTime(){
			this._time-=0.1
			this.times.text= "剩余时间:"+GetFormatTime(this._time)+"";
		}

		private ViewEvent() {
			Event.RegistEvent("resh_goods", Laya.Handler.create(this, this.SetItem_list));
			this.on(Laya.Event.REMOVED, this, this.OnDestroy);
		}

		private SetItem_list() {
			this.ChangeItem_list.array = [];
			this.ChangeItem_list.array = ChangeGoodsManager.Instance.GetArr();
			//this.ChangeItem_list.repeatY=this.ChangeItem_list.array.length;
			this.ChangeItem_list.renderHandler = new Laya.Handler(this, this.Handler)
		}

		private Handler(item, index: number) {
			let Id = this.ChangeItem_list.array[index];
			let itemInfo = ChangeGoodsManager.Instance.ActionData.award[Id];
			let n_type = ChangeGoodsManager.Instance.ActionData.id;
			
			let needsItem = itemInfo.items1;
			let GoodsItem = itemInfo.items2[1];
			let ntcfg = ItemConfig[GoodsItem[2]]
			let times = itemInfo.value;

			let changeItem: Laya.Image = item.getChildByName("changeItem");
			let man: Laya.Button = item.getChildByName("man");
			let btn_change: Laya.Button = man.getChildByName("Btn_change") as Laya.Button;
			let Changetimes: Laya.Label = man.getChildByName("item_ChangetImes") as Laya.Label;
			let Changed: Laya.Label = man.getChildByName("Changed") as Laya.Label;

			let item_pinzhi: Laya.Label = changeItem.getChildByName("item_pinzhi") as Laya.Label;
			let item_num: Laya.Label = changeItem.getChildByName("item_num") as Laya.Label;
			let item_name: Laya.Label = changeItem.getChildByName("item_name") as Laya.Label;
			let item_Icon: Laya.Image = changeItem.getChildByName("item_icon") as Laya.Image;

			item_pinzhi.bgColor = BaseDefine.LadderItemBgColor[ntcfg.dwItemQuality];
			item_num.text = GoodsItem[3];
			item_name.text = GetInfoAttr.Instance.GetText(ntcfg.dwItemName);
			item_name.color = BaseDefine.LabelColor1[ntcfg.dwItemQuality];
			item_Icon.skin = "ui_icon/" + ntcfg.strIconID_B;
			let changetimes = ChangeGoodsManager.Instance.PlayChangeTimes[index + 1];
			if (!changetimes) {
				changetimes = 0;
			}
			Changetimes.text = "剩余次数:" + (times - changetimes) + "/" + times;
			for (let key in needsItem) {
				let iteminfo = needsItem[key];
				if (iteminfo[1] != 0) {
					let item_cfg = ItemConfig[iteminfo[2]];
					let item_Info: Laya.Image = item.getChildByName("itemInfo" + key);
					item_Info.visible = true;
					let item_bg: Laya.Label = item_Info.getChildByName("item_bg") as Laya.Label;
					let item_pinzhi: Laya.Label = item_Info.getChildByName("item_pinzhi") as Laya.Label;
					let item_Icon: Laya.Image = item_Info.getChildByName("item_icon") as Laya.Image;
					let item_num: Laya.Label = item_Info.getChildByName("item_num") as Laya.Label;
					//let item_name: Laya.Label = item_Info.getChildByName("item_name") as Laya.Label;
					item_pinzhi.bgColor = BaseDefine.LadderItemBgColor[item_cfg.dwItemQuality];
					item_Icon.skin = "ui_icon/" + item_cfg.strIconID_B;
					let play_Item = BagManager.Instance.getItemNumber(iteminfo[2]);
					item_num.text = "(" + play_Item + "/" + iteminfo[3] + ")";
					item_num.color = BaseDefine.LabelColor1[2];
					if (play_Item < iteminfo[3]) {
						item_num.color = BaseDefine.LadderItemBgColor[6];
					}
				}

				// item_name.text = GetInfoAttr.Instance.GetText(item_cfg.dwItemName);
				// item_name.color = BaseDefine.LabelColor[item_cfg.dwItemQuality];
			}
			let bool = ChangeGoodsManager.Instance.IsChangeItem(needsItem);
			btn_change.gray = !bool;
			man.mouseEnabled = bool;
			if (times - changetimes <= 0) {
				btn_change.visible = false;
				Changetimes.visible = false;
				Changed.visible = true;
				// TipsLogic.Instance.OpenSystemTips(str);
				return
			}
			man.on(Laya.Event.CLICK, this, this.ChangeItem, [n_type, index + 1]);
		}

		private ChangeItem(type, Item_Id: number) {
			ChangeGoodsManager.Instance.ChangeItem(type, Item_Id);
		}

		private stringinfoInit() {
			GetInfoAttr.Instance.GetText(7142);
		}

		private Btnclick_close() {
			UIManager.Instance.DestroyUI("ChangeGoodsView", [ViewUpRoot]);
		}

		private OnDestroy() {
			this.offAll();
			DEverydayManager.Instance.ActionArr = [];
		}

		private Destroy() {
			this.offAll();
			Event.RemoveEvent("resh_goods", Laya.Handler.create(this, this.Handler))
		}
	}
}