/**Created by the LayaAirIDE*/
module H52D_Framework {
	AddViewResource("EverydayMoneyView",
		[
			{ url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
		]);

	/***每日累充 */
	export class EverydayMoneyView extends ui.consumer.EverydayMoneyViewUI {


		constructor() {
			super();
			this.InitView();
			this.AddEvent();
		}

		private InitView() {
			this.lay_outlist.vScrollBarSkin = "";
			this.Reshlist();
			this.ViewInfo();
			//this.lay_outlist.repeatY = this.lay_outlist.array.length;
		}

		private ViewInfo() {
			this.showmoney.text = "今日已充值:" + mEverydayManager.Instance.MyMoney;
			this.say.text = GetInfoAttr.Instance.GetText(7081);
		}

		private AddEvent() {
			Event.RegistEvent("UpdateView_everydaymoney", Laya.Handler.create(this, this.Reshlist));
			this.on(Laya.Event.REMOVED, this, this.Destroy);
		}


		private Reshlist() {
			mEverydayManager.Instance.Activonarr = [];
			this.lay_outlist.array = mEverydayManager.Instance.GetArr();
			this.lay_outlist.renderHandler = new Laya.Handler(this, this.Handler);
		}

		private Handler(item, index: number) {
			let id = this.lay_outlist.array[index];
			let itemInfo = mEverydayManager.Instance.ActionData.award[id];
			let action_id = mEverydayManager.Instance.ActionData.id;
			let shop
			let lock: Laya.Label = item.getChildByName("lock");
			let img_lingqu: Laya.Image = item.getChildByName("reced");
			let sya: Laya.HTMLDivElement = item.getChildByName("D_say");

			let btn: Laya.Button = item.getChildByName("btn_isgo");
			let s = GetTabLength(itemInfo.items)
			for (let i = 1; i <= s; i++) {
				let item_bg: Laya.Label = item.getChildByName("item_icon" + i);
				item_bg.visible = true;
				let bg: Laya.Label = item_bg.getChildByName("bg") as Laya.Label;
				let icon: Laya.Image = item_bg.getChildByName("item_icon") as Laya.Image;
				let item_name: Laya.Label = item_bg.getChildByName("item_name") as Laya.Label;
				let item_num: Laya.Label = item_bg.getChildByName("item_num") as Laya.Label;
				let bg_img: Laya.Image = item_bg.getChildByName("bg-img") as Laya.Image;
				shop = itemInfo.items[i];
				bg_img.visible = true;
				item_num.text = shop[3];
				let n_tcfg = ItemConfig[shop[2]];
				item_bg.bgColor = "#20263e";
				bg.bgColor = BaseDefine.ItemBgColor[n_tcfg.dwItemQuality];
				item_name.text = GetInfoAttr.Instance.GetText(n_tcfg.dwItemName);
				item_name.color = BaseDefine.LabelColor1[n_tcfg.dwItemQuality];
				icon.skin = "ui_icon/" + n_tcfg.strIconID_B;
			}
			let needmoney = mEverydayManager.Instance.MyMoney
			SetHtmlStyle(sya, 26, "#ff7a6d", "left");
			sya.innerHTML = Format(GetInfoAttr.Instance.GetText(7082), itemInfo.value, needmoney, itemInfo.value);
			let bool = needmoney >= itemInfo.value ? true : false;
			btn.label = "充值";
			if (bool) {
				btn.label = "领取";
				sya.innerHTML = Format(GetInfoAttr.Instance.GetText(7082), itemInfo.value,
					GetHtmlStrByColor(needmoney + "", "#90f96f"),
					GetHtmlStrByColor(itemInfo.value, "#90f96f"));
			}
			let a = mEverydayManager.Instance.Lingqu;
			if (mEverydayManager.Instance.Lingqu[id] == 1) {
				img_lingqu.visible = true;
				btn.visible = false;
			}
			if (bool) {
				btn.on(Laya.Event.CLICK, this, this.Btn_lingqu, [action_id, id, shop[3]]);
			}
			else {
				btn.on(Laya.Event.CLICK, this, this.GoShop);
			}
		}

		private OpenView(nheroID: number) {
			HeroManager.Instance.OpenView(nheroID);
		}

		private GoShop() {
			if (mEverydayManager.Instance.IsOpen) {
				UIManager.Instance.DestroyUI("ActiveBgView", [ViewUpRoot]);				
				return
			} else {
				Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
				OneTimer(500, () => {
					Event.DispatchEvent("toGemShop");
					UIManager.Instance.DestroyUI("ActiveBgView", [ViewUpRoot]);
				});
			}
		}

		private Btn_lingqu(type: number, id: number, num: number) {
			OActivityLogic.Instance.K_GetActivityAwardReq(type, id, num);
		}

		private ShowItem() {
            TipsLogic.Instance.OpenGoodsProTips(ViewToppestRoot)
		}

		private Destroy() {
			this.offAll();			
			mEverydayManager.Instance.Activonarr = [];
		}

		private OnDestroy() {
			this.offAll();			
			mEverydayManager.Instance.Activonarr = [];
			Event.RemoveEvent("UpdateView_everydaymoney", Laya.Handler.create(this, this.Reshlist));
		}
	}
}