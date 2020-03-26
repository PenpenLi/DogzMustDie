/**Created by the LayaAirIDE*/
module H52D_Framework {
	AddViewResource("WroldBossBuffView",
		[
			{ url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_wroldboss.atlas", type: Laya.Loader.ATLAS },
		]);

	/**世界bossbuff购买 */
	export class WroldBossBuffView extends ui.action.boss.WroldBossBuffViewUI {
		constructor() {
			super();
			this.ViewInit();
		}
		public static once = 0;

		private Addevent() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.Btn_close.on(Laya.Event.CLICK, this, this.Btn_clickclose);
			Event.RegistEvent('Update_bossbuffView', Laya.Handler.create(this, this.ReshList));
			Event.RegistEvent("BackBackGround", Laya.Handler.create(this, this.BackBackGround));
		}

		private ViewInit() {
			this.Buff_list.vScrollBarSkin = "";
			this.ReshList();
			this.Addevent();
			this.Button();
			this.ADFail();
		}

		private ReshList() {
			WroldBossLogic.Instance.Buff_List = [];
			this.Buff_list.array = WroldBossLogic.Instance.Buff_num();
			this.Buff_list.renderHandler = new Laya.Handler(this, this.Handler);
		}

		private Button() {
			if (WroldBossBuffView.once >= 0.01) {
				this.StartChange.visible = false;
			}
			if (WroldBossBuffView.once < 0.01) {
				this.Btn_close.visible = false;
			}
			else {
				this.Btn_close.visible = true;
			}
			WroldBossBuffView.once += 0.01;
			if (IsAD()) {
				this.SetAD();
			}
			else {
				this.NoAD();
			}
		}

		private ADFail() {
			if (!AdvertisingManager.Instance.bnWXAdertisingTimes) {
				this.Look.gray = true;
				this.Look.disabled = true;
				TipsLogic.Instance.OpenSystemTips(30071);
			}
		}

		private BackBackGround() {
			this.Look.visible = false;
			this.StartChange.centerX = 0;
			this.bot_font.visible = false;
		}

		/**广告版本 */
		private SetAD() {
			this.Look.on(Laya.Event.CLICK, this, this.LooKCB);
			this.StartChange.on(Laya.Event.CLICK, this, this.ChangeCB);
			if (!AdvertisingManager.Instance.bnWXAdertisingTimes || AdvertisingManager.Instance.IsBuyBossBuff) {
				this.Look.visible = false;
				this.StartChange.centerX = 0;
				this.bot_font.visible = false;
			}
			if (!this.StartChange.visible) this.Look.centerX = 0;
		}

		/**非广告版本 */
		private NoAD() {
			this.bot_font.visible = false;
			this.Look.visible = false;
			this.StartChange.centerX = 0;
			this.StartChange.on(Laya.Event.CLICK, this, this.ChangeCB);
		}

		/**开始挑战按钮回调 */
		private ChangeCB() {
			this.StartChange.visible = false;
			this.Btn_clickclose();
			Event.DispatchEvent("DeputyFireStart");
			WroldBossLogic.Instance.StopFight = true;
			Event.DispatchEvent(EventDefine.CUSTOMS_CURRENT);
		}
		/**观看按钮回调 */
		private LooKCB() {
			UIManager.Instance.CreateUI("AdvertisementView", [ViewUpRoot, AdvertisementType.wroldBoss]);
		}

		private Handler(item, index: number) {
			let buff_info = MarketConfig[3][this.Buff_list.array[index]];
			let buff_price = buff_info.Price;
			let item_Id = buff_info.sellContent[2];
			let Icon: Laya.Image = item.getChildByName("buff_icon");
			let buyed: Laya.Image = item.getChildByName("buff_buyed");
			let Say: Laya.HTMLDivElement = item.getChildByName("buff_say");
			let btn: Laya.Button = item.getChildByName("btn_buy");
			let price_icon: Laya.Image = btn.getChildByName("buff_price_icon") as Laya.Image;
			let price_num: Laya.Label = btn.getChildByName("buff_price") as Laya.Label;
			let isBuy = WroldBossLogic.Instance.Buff_Buy
			let bool = isBuy[item_Id] == 1 ? true : false;
			buyed.visible = bool;
			btn.visible = !bool;
			if (buff_price[1] == 2) {
				price_icon.skin = "ui_icon/icon_prop_013.png";
			}
			price_num.text = buff_price[2];
			let buff_itemcfg = ItemConfig[item_Id];
			let name_Id = buff_itemcfg.dwItemAState;

			Icon.skin = "ui_icon/" + buff_itemcfg.strIconID_B;
			SetHtmlStyle(Say, 22, "#ffa5a7", "center");
			if (buyed.visible) {
				SetHtmlStyle(Say, 22, "#c5ffa5", "center");
			}
			Say.innerHTML = GetInfoAttr.Instance.GetText(name_Id);

			btn.on(Laya.Event.CLICK, this, this.Btn_clickbuy, [3, this.Buff_list.array[index], 1, buff_price]);
		}

		private Btn_clickclose() {
			UIManager.Instance.DestroyUI("WroldBossBuffView", [ViewUpRoot]);
		}

		/**购买Buff */
		private Btn_clickbuy(type: number, buff_ID: number, buff_num: number, d_num) {
			let my_num = BagManager.Instance.getItemNumber(2);
			if (d_num > my_num) {
				if (IsShieldRecharge()) {
					let str = SysPromptConfig[30060].strPromptInfo;
					TipsLogic.Instance.OpenMessageBox(str,
						Laya.Handler.create(this, () => {
							UIManager.Instance.DestroyUI("BuyTimesView", [ViewDownRoot]);
						}));
				} else {
					let str = SysPromptConfig[10014].strPromptInfo;
					TipsLogic.Instance.OpenMessageBox(str,
						Laya.Handler.create(this, () => {
							Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
						}));
				}
			} else {
				//发送请求 购买buff
				WroldBossLogic.Instance.Buff_buy(type, buff_ID, buff_num);
			}
		}

		private Destroy() {
			WroldBossLogic.Instance.Buff_List = [];
			this.offAll();
			Event.RemoveEvent('Update_bossbuffView', Laya.Handler.create(this, this.ReshList));
			Event.RemoveEvent("BackBackGround", Laya.Handler.create(this, this.BackBackGround));
		}
	}
}