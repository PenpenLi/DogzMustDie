/**每日累消*/
module H52D_Framework {
	AddViewResource("DiamondView",
		[
			{ url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
		]);
	/***消耗钻石领取奖励   每日累消 */
	export class DiamondView extends ui.consumer.DiamondViewUI {

		constructor() {
			super();

			this.AddEvent();
			this.Initview();

		}

		private AddEvent() {
			Event.RegistEvent("resh_diamond", Laya.Handler.create(this, this.addListener));
			this.on(Laya.Event.REMOVED, this, this.OnDestroy);
		}

		private Initview() {
			this.ReshHandle();
			this.D_list.vScrollBarSkin = "";
		}

		private addListener() {
			this.ReshHandle();
		}

		private ReshHandle() {
			this.D_list.array = [];
			this.D_list.array = DEverydayManager.Instance.GetInfoArr();
			this.D_list.renderHandler = new Laya.Handler(this, this.Handler)
		}

		private Handler(item, index: number) {
			let nIdx = this.D_list.array[index];
			let D_num = DEverydayManager.Instance.Dnum
			let action_id = DEverydayManager.Instance.ActionData.id;
			let data = DEverydayManager.Instance.ActionData.award;
			let d_num = data[nIdx].value;
			let shop = data[nIdx].items;
			let btn: Laya.Button = item.getChildByName("btn_receive");
			let say: Laya.HTMLDivElement = item.getChildByName("D_say");
			let getbag: Laya.Image = item.getChildByName("reced");
			SetHtmlStyle(say, 26, "#ff7a6d", "left");
			let num = D_num + "/" + d_num;
			let str = GetInfoAttr.Instance.GetText(7094);
			let bool = DEverydayManager.Instance.Dnum >= d_num ? true : false;
			say.innerHTML = Format(GetInfoAttr.Instance.GetText(7094), d_num, GetHtmlStrByColor(D_num, "#ff7a6d"), GetHtmlStrByColor(d_num, "#ff7a6d"));
			if (bool) {
				say.innerHTML = Format(str, d_num, GetHtmlStrByColor(D_num, "#90f96f"), GetHtmlStrByColor(d_num, "#90f96f"));
			}
			btn.gray = !bool;
			btn.mouseEnabled = bool;
			for (let key in shop) {
				let icon_bg: Laya.Label = item.getChildByName("item_icon" + key);
				let icon: Laya.Image = icon_bg.getChildByName("item_icon") as Laya.Image;
				let name: Laya.Label = icon_bg.getChildByName("item_name") as Laya.Label;
				let item_num: Laya.Label = icon_bg.getChildByName("item_num") as Laya.Label;
				let bg: Laya.Label = icon_bg.getChildByName("bg") as Laya.Label
				let bg_img: Laya.Image = icon_bg.getChildByName("bg-img") as Laya.Image;
				bg_img.visible = true;
				icon_bg.bgColor = "#20263e";
				let Item = shop[key];
				item_num.text = Item[3];
				if (item_num.text == "1") {
					item_num.text = "";
				}
				let ShopInfo = ItemConfig[Item[2]];
				if (ShopInfo) {
					icon.skin = "ui_icon/" + ShopInfo.strIconID_B;
					name.text = GetInfoAttr.Instance.GetText(ShopInfo.dwItemName);
					name.color = BaseDefine.LabelColor1[ShopInfo.dwItemQuality];
					bg.bgColor = BaseDefine.ItemBgColor[ShopInfo.dwItemQuality];
				}
			}
			let Istrue = DEverydayManager.Instance.LingQu[nIdx] == 1 ? false : true;
			btn.visible = Istrue;
			getbag.visible = !Istrue;

			btn.on(Laya.Event.CLICK, this, this.Btn_receive, [action_id, nIdx]);
		}

		private Btn_receive(type, id) {
			OActivityLogic.Instance.K_GetActivityAwardReq(type, id);
		}

		private OnDestroy() {
			this.offAll();
			DEverydayManager.Instance.ActionArr = [];
		}

		private Destroy() {
			this.offAll();
			Event.RemoveEvent("resh_diamond", Laya.Handler.create(this, this.addListener));
			DEverydayManager.Instance.ActionArr = [];
		}
	}
}