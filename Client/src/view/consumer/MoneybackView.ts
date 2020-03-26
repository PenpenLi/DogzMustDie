/**Created by the LayaAirIDE*/
module H52D_Framework {
	AddViewResource("MoneybackView",
		[
			{ url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
		]);

	/**充值返馈 */
	export class MoneybackView extends ui.consumer.MoneybackViewUI {
		constructor() {
			super();

			this.AddEvent();
			this.Initview();
		}

		private AddEvent() {
			this.btn_close.on(Laya.Event.CLICK, this, this.Btn_close);
			this.Other.on(Laya.Event.CLICK, this, this.Btn_close);
			Event.RegistEvent("UpdateView_moneyback", Laya.Handler.create(this, this.ReshHandler));
			this.on(Laya.Event.REMOVED, this, this.Destroy);
		}

		private Initview() {
			this.ReshHandler();
			ShopLogic.Instance.EffShow = false;
		}
		private ReshHandler() {
			this.m_backlist.vScrollBarSkin = "";
			this.m_backlist.array = ShopLogic.Instance.MonenArr;			
			this.m_backlist.renderHandler = new Laya.Handler(this, this.Handler)
		}

		private Handler(item, index: number) {
			let n_cfgId = this.m_backlist.array[index];
			let n_cfg = ChargeReturnConfig[n_cfgId];
			let recfg_id = n_cfg.chargeReward//道具表ID			
			let btn: Laya.Button = item.getChildByName("btn_isgo");
			let say: Laya.HTMLDivElement = item.getChildByName("M_say");
			let item_bg: Laya.Image = item.getChildByName("item_bg1");
			let icon: Laya.Image = item_bg.getChildByName("item_icon1") as Laya.Image;
			let name: Laya.Label = item_bg.getChildByName("item_name") as Laya.Label;
			let bg: Laya.Label = item_bg.getChildByName("bg") as Laya.Label;
			let lab: Laya.Image = item.getChildByName("lab_text");

			if (ShopLogic.Instance.MoneyBack[n_cfgId] == 1) {
				lab.visible = true;
				btn.visible = false;
			}
			SetHtmlStyle(say, 20, "#ff7a6d", "left");
			say.innerHTML = Format(GetInfoAttr.Instance.GetText(7093), n_cfgId);
			let item_infolist = RewardConfig[recfg_id].reWrad[1];
			let iteminfo;
			if (item_infolist[1] == BaseDefine.ItemTypePro) {
				iteminfo = ItemConfig[item_infolist[2]];
				icon.skin = "ui_icon/" + iteminfo.strIconID_B;
				name.text = GetInfoAttr.Instance.GetText(iteminfo.dwItemName) + "X" + item_infolist[3];
				name.color = BaseDefine.LabelColor1[iteminfo.dwItemQuality];
				item_bg.skin = BaseDefine.HeroAllinfo_bg[iteminfo.dwItemQuality];
				bg.bgColor = BaseDefine.ItemBgColor[iteminfo.dwItemQuality];
			}
			if (item_infolist[1] == BaseDefine.ItemTypeEquip) {
				iteminfo = EquipConfig[item_infolist[2]];
				icon.skin = "ui_icon/" + iteminfo.equipIcon;
				name.text = GetInfoAttr.Instance.GetText(iteminfo.equipName);
			}
			if (item_infolist[1] == BaseDefine.ItemTypeHero) {
				iteminfo = HeroConfig[item_infolist[2]];
				icon.skin = "ui_icon/" + iteminfo.strIcon;
				name.text = GetInfoAttr.Instance.GetText(iteminfo.name);
			}
			if (item_infolist[1] == BaseDefine.ItemTypePet) {
				iteminfo = PetConfig[item_infolist[2]];
				icon.skin = "ui_icon/" + iteminfo.strPetIcon;
				name.text = GetInfoAttr.Instance.GetText(iteminfo.petName);
			}
			let num = index + 4;
			if (ShopLogic.Instance.isFristCharge(1, num)) {
				btn.on(Laya.Event.CLICK, this, this.Btn_receive, [num]);
			}
			else {
				btn.label = "领取";
				btn.on(Laya.Event.CLICK, this, this.n_Money, [n_cfgId]);
			}
		}

		private Btn_receive(num: number) {
			this.Btn_close();
			if (ViewUILogic.Instance.OpenPanel == E_OpenGrade.SHOP) {
				OneTimer(500, () => {
					Event.DispatchEvent("toGemShop", num);
					Event.DispatchEvent(EventDefine.BOTTOM_SET_PANEL);//调整面板高度  成为 全屏
				});
			} else {
				Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
				// ShopLogic.Instance.nIdx = num;
				OneTimer(500, () => {
					Event.DispatchEvent("toGemShop", num);
					Event.DispatchEvent(EventDefine.BOTTOM_SET_PANEL);//调整面板高度  成为 全屏
				});
			}
		}

		/***发送领取消息  */
		private n_Money(n_money: number) {
			ShopLogic.Instance.K_ReqChargeFeedback(n_money);
		}

		private Btn_close() {
			UIManager.Instance.DestroyUI("MoneybackView", [ViewUpRoot]);
			this.m_backlist.array = [];
			Event.DispatchEvent("UpdateBtnList");
		}

		private Destroy() {
			this.offAll();
			Event.RemoveEvent("UpdateView_moneyback", Laya.Handler.create(this, this.ReshHandler));
		}
	}
}