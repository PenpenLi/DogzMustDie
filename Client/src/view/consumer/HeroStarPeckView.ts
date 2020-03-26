/**Created by the LayaAirIDE*/
module H52D_Framework {
	AddViewResource("HeroStarPeckView",
		[
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_wroldboss.atlas", type: Laya.Loader.ATLAS },
		]);

	export class HeroStarPeckView extends ui.consumer.HeroStarPeckViewUI {
		private tTimeUseInfo = {}
		constructor() {
			super();
			//HeroStarPeckView._ishavetimes = AdvertisingManager.Instance.bnWXAdertisingTimes;
			this.tTimeUseInfo = {}
			Tick.Loop(1000, this, this.TimerViewUpdate);
			this.ViewInit();

			// 微信适配
			this.Btn_close.y = wxsclae
			this.tipsicon.y = wxsclae
			this.List_peck.y = wxsclae + 84
			this.List_peck.height = this.List_peck.height - wxsclae
			this.List_peck_.y = wxsclae + 84
			this.List_peck_.height = this.List_peck_.height - wxsclae
			this.ListPeck_noM.y = wxsclae + 84
			this.ListPeck_noM.height = this.ListPeck_noM.height - wxsclae
		}

		private static _ishavetimes: boolean = false;
		private ViewInit() {
			this.ViewEvent();
			this.Update_View();
		}

		private ViewEvent() {
			this.Btn_close.on(Laya.Event.CLICK, this, this.Btnclick_close);
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			Event.RegistEvent("AdUpdate", Laya.Handler.create(this, this.Update_View));
			Event.RegistEvent("update_heropeck", Laya.Handler.create(this, this.Update_View));
		}

		private ARR() {
			this.List_peck.array = [];
			this.List_peck_.array = [];
			this.ListPeck_noM.array = [];
			HeroManager.Instance.PeckBuyed = [];
			for (let key in HeroManager.Instance.HeroPeck) {
				let nID = HeroManager.Instance.HeroPeck[key];
				let bool = HeroManager.Instance.IsActive(nID);
				let time = Time.serverSecodes - HeroManager.Instance.GetHeroPecktime(nID);
				let bool_s = time > 0 ? true : false;

				let peck_cfg = HeroPeckConfig[nID];
				let bool_S = ShopLogic.Instance.isFristCharge(5, peck_cfg.chargeId)
				let Buy_times = ShopLogic.Instance.GetBuyTimes(4, peck_cfg.shopId);
				if (bool && !bool_s && time) {
					if (IsAD()) {
						let a = HeroManager.Instance.Peck_Ad;
						if (GetTabLength(a) >= 0) {
							if (Buy_times < 2 || a[nID] == null) {
								this.List_peck_.array.push(nID);
								HeroManager.Instance.HeroPeck_arr = this.List_peck_.array
							} else {
								HeroManager.Instance.PeckBuyed.push(nID);
							}
						}
					} else {
						if (!IsNotBaiDuSdk()) {
							if (IsShieldRecharge()) {
								if (Buy_times == 0) {
									this.ListPeck_noM.array.push(nID);
									HeroManager.Instance.HeroPeck_arr = this.ListPeck_noM.array
								} else {
									HeroManager.Instance.PeckBuyed.push(nID);
								}
							} else {
								if (bool_S || Buy_times == 0) {
									this.List_peck.array.push(nID);
									HeroManager.Instance.HeroPeck_arr = this.List_peck.array
								} else {
									HeroManager.Instance.PeckBuyed.push(nID);
								}
							}
						} else {
							if (bool_S || Buy_times == 0) {
								this.List_peck.array.push(nID);
								HeroManager.Instance.HeroPeck_arr = this.List_peck.array
							} else {
								HeroManager.Instance.PeckBuyed.push(nID);
							}
						}
					}
				} else {
					if (MasterPlayer.Instance.player.Hero_pecktime[nID]) {
						delete MasterPlayer.Instance.player.Hero_pecktime[nID];
					}
				}
			}
			if (this.List_peck.array.length > 0 || this.List_peck_.array.length > 0 ||
				this.ListPeck_noM.length > 0) {
				Event.DispatchEvent("UpdateBtnList");
			}
			else {
				HeroManager.Instance.PeckIcon = false;
				this.Btnclick_close();
			}
		}

		private Sort_heroPeck(arr: Array<number>) {
			function tsort(left, right): number {
				let left_time = HeroManager.Instance.GetHeroPecktime(left);
				let right_time = HeroManager.Instance.GetHeroPecktime(right);
				return left_time - right_time;
			}
			arr.sort(tsort);
		}

		private Update_View() {
			this.ARR();
			if (!IsNotBaiDuSdk()) {
				if (!IsShieldRecharge()) {
					this.List_peck.visible = true;//贴吧 安卓版
					this.List_peck.vScrollBarSkin = "";
					this.List_handle();
				} else {
					this.ListPeck_noM.visible = true;//贴吧 苹果版
					this.ListPeck_noM.vScrollBarSkin = "";
					this.list_noMoney_handle();
				}
			} else {
				if (IsAD()) {
					this.List_peck_.visible = true;//广告版
					this.List_peck_.vScrollBarSkin = "";
					this.list_handle_();
				} else {
					this.List_peck.visible = true;//贴吧 安卓版
					this.List_peck.vScrollBarSkin = "";
					this.List_handle();
				}
			}
		}

		private List_handle() {
			this.DesAvatar();
			this.Sort_heroPeck(this.List_peck.array);
			this.tTimeUseInfo = {}
			this.List_peck.renderHandler = new Laya.Handler(this, this.Handle);
		}

		private list_handle_() {
			this.DesAvatar();
			this.Sort_heroPeck(this.List_peck_.array);
			this.tTimeUseInfo = {}
			this.List_peck_.renderHandler = new Laya.Handler(this, this.herostar_handle);
		}

		private list_noMoney_handle() {
			this.DesAvatar();
			this.Sort_heroPeck(this.ListPeck_noM.array);
			this.tTimeUseInfo = {}
			this.ListPeck_noM.renderHandler = new Laya.Handler(this, this.herostar_noMoney_handle);
		}

		private _time;
		private _tAvatarHeromodList = {}
		private _tAvatarHeroAinList = {}
		private Handle(item, index: number) {
			let nId = this.List_peck.array[index];
			let peck_cfg = HeroPeckConfig[nId];

			let time: Laya.Label = item.getChildByName("Shop_time")

			let hero_modle_d: Laya.Image = item.getChildByName("hero_d");
			let hero_name_d: Laya.Label = hero_modle_d.getChildByName("hero_name") as Laya.Label;
			let hero_pin_d: Laya.Image = hero_modle_d.getChildByName("hero_pinzhi") as Laya.Image;//品质色
			let hero_icon_d: Laya.Image = hero_modle_d.getChildByName("hero_icon_d") as Laya.Image;//模型
			let hero_num_d: Laya.Label = hero_modle_d.getChildByName("hero_num_D") as Laya.Label;//数量
			let discount_d: Laya.Label = hero_modle_d.getChildByName("discount") as Laya.Label; //打折数
			let hero_btn_d: Laya.Button = hero_modle_d.getChildByName("Btn_buy") as Laya.Button;//购买按钮  //
			let price_d_new: Laya.HTMLDivElement = hero_btn_d.getChildByName("new_price") as Laya.HTMLDivElement;
			let price_d_old: Laya.HTMLDivElement = hero_modle_d.getChildByName("old_price") as Laya.HTMLDivElement;
			let line_d: Laya.Label = hero_modle_d.getChildByName("line") as Laya.Label;

			let hero_modle_m: Laya.Image = item.getChildByName("hero_m");
			let hero_name_m: Laya.Label = hero_modle_m.getChildByName("hero_name") as Laya.Label;
			let hero_pin_m: Laya.Image = hero_modle_m.getChildByName("hero_pinzhi") as Laya.Image;//品质色
			let hero_icon_m: Laya.Image = hero_modle_m.getChildByName("hero_icon_d") as Laya.Image;//模型
			let hero_num_m: Laya.Label = hero_modle_m.getChildByName("hero_num_M") as Laya.Label;
			let discount_m: Laya.Label = hero_modle_m.getChildByName("discount") as Laya.Label; //打折数
			let hero_btn_m: Laya.Button = hero_modle_m.getChildByName("Btn_buy") as Laya.Button;//购买按钮
			let price_m: Laya.HTMLDivElement = hero_modle_m.getChildByName("new_price") as Laya.HTMLDivElement;
			let line_m: Laya.Label = hero_modle_m.getChildByName("line") as Laya.Label;

			let tcfg_hero = HeroConfig[nId];
			hero_name_d.text = hero_name_m.text = GetInfoAttr.Instance.GetText(tcfg_hero.name);
			let pos = tcfg_hero.position;
			hero_pin_d.skin = hero_pin_m.skin = BaseDefine.HeroAllinfo_bg[tcfg_hero.quality];
			if (this._tAvatarHeroAinList[nId] != null) {
				this._tAvatarHeroAinList[nId].Destroy()
				this._tAvatarHeroAinList[nId] = null
			}
			if (this._tAvatarHeromodList[nId] != null) {
				this._tAvatarHeromodList[nId].Destroy()
				this._tAvatarHeromodList[nId] = null
			}
			hero_icon_d.destroyChildren();
			hero_icon_m.destroyChildren();
			let heroAin: Avatar = new Avatar(hero_icon_d)
			heroAin.Load(tcfg_hero.strFacadeModel, 1, tcfg_hero.modelScale * 2.6, pos[1], pos[2],
				Laya.Handler.create(this, (heroAins) => {
					heroAins.Play(1, true, true, () => {
					}, true)
				}));


			this._tAvatarHeroAinList[nId] = heroAin
			let heromod: Avatar = new Avatar(hero_icon_m)
			heromod.Load(tcfg_hero.strFacadeModel, 1, tcfg_hero.modelScale * 2.6, pos[1], pos[2],
				Laya.Handler.create(this, (heromods) => {
					heromods.Play(1, true, true, () => {
					}, true)
				}));

			this._tAvatarHeromodList[nId] = heromod
			this.tTimeUseInfo[index] = [nId, time]

			let Buy_times = ShopLogic.Instance.GetBuyTimes(4, peck_cfg.shopId);
			let bool_d = Buy_times == 0 ? true : false;

			//line_d.visible = bool_d;
			let Item_Info_d = MarketConfig[4][peck_cfg.shopId];
			let Shop_Info_d = Item_Info_d.sellContent;
			let preic = Item_Info_d.Price//
			let old_m = preic[2] * Item_Info_d.Discount / 10;
			let Item_cfg = ItemConfig[Shop_Info_d[2]];
			hero_num_d.text = "X" + Shop_Info_d[3];
			hero_num_d.color = BaseDefine.LabelColor1[tcfg_hero.quality];
			let path = "<img src= 'ui_icon/icon_prop_013.png' width='30px' height='20px'></img>";
			SetHtmlStyle(price_d_new, 25, "#fdcbad", "center");
			SetHtmlStyle(price_d_old, 25, "#fdcbad", "center");
			price_d_old.innerHTML = path + preic[2]
			price_d_new.innerHTML = path + old_m + "   ";
			discount_d.text = Item_Info_d.Discount + "折";

			if (!bool_d) {
				price_d_new.innerHTML = "已购买";
			}

			//********************************* 人民币↓

			let bool_m = ShopLogic.Instance.isFristCharge(5, peck_cfg.chargeId)//
			//hero_modle_m.visible = bool;
			let Item_Info_m = ChargeConfig[5][peck_cfg.chargeId];
			let rew_cfg = RewardConfig[Item_Info_m.chargeReward].reWrad[1]
			let Shop_Info_m = ItemConfig[rew_cfg[2]];
			hero_num_m.text = "X" + rew_cfg[3];
			hero_num_m.color = BaseDefine.LabelColor1[tcfg_hero.quality];
			let item_name = GetInfoAttr.Instance.GetText(Shop_Info_m.dwItemName) + "X " + rew_cfg[3];
			SetHtmlStyle(price_m, 25, "#fdcbad", "center");
			price_m.innerHTML = Item_Info_m.Money + "元 ";
			hero_btn_m.label = Item_Info_m.Price + "元";
			discount_m.text = (Item_Info_m.Price / Item_Info_m.Money) * 10 + "折"
			if (!bool_m) {
				hero_btn_m.label = "已购买";
			}
			//line_m.visible = bool_m;

			if (!bool_d && !bool_m) {
				this.Update_View();
			}


			hero_icon_d.on(Laya.Event.CLICK, this, this.OPenView, [nId]);
			hero_icon_m.on(Laya.Event.CLICK, this, this.OPenView, [nId]);

			hero_btn_m.on(Laya.Event.CLICK, this, this.Btnclick_Mbuy, [5, peck_cfg.chargeId, item_name, bool_m]);
			hero_btn_d.on(Laya.Event.CLICK, this, this.Btnclick_Dbuy, [nId, 4, peck_cfg.shopId, 1, old_m, preic[1], bool_d]);
		}

		private herostar_handle(item, index: number) {
			let nId = this.List_peck_.array[index];
			let peck_cfg = HeroPeckConfig[nId];
			let time: Laya.Label = item.getChildByName("Shop_time")
			let hero_modle_d: Laya.Image = item.getChildByName("hero_d");
			let buyend: Laya.Image = item.getChildByName("buyend");
			let hero_name_d: Laya.Label = hero_modle_d.getChildByName("hero_name") as Laya.Label;
			let hero_pin_d: Laya.Image = hero_modle_d.getChildByName("hero_pinzhi") as Laya.Image;//品质色
			let hero_icon_d: Laya.Image = hero_modle_d.getChildByName("hero_icon_d") as Laya.Image;//模型
			let hero_num_d: Laya.Label = hero_modle_d.getChildByName("hero_num_D") as Laya.Label;//数量
			let discount_d: Laya.Label = hero_modle_d.getChildByName("discount") as Laya.Label; //打折数
			let hero_btn_d: Laya.Button = hero_modle_d.getChildByName("Btn_buy") as Laya.Button;//购买按钮  //
			let price_d_new: Laya.HTMLDivElement = hero_btn_d.getChildByName("new_price") as Laya.HTMLDivElement;
			let price_d_old: Laya.HTMLDivElement = hero_modle_d.getChildByName("old_price") as Laya.HTMLDivElement;
			let line_d: Laya.Label = hero_modle_d.getChildByName("line") as Laya.Label;

			let tcfg_hero = HeroConfig[nId];
			hero_name_d.text = GetInfoAttr.Instance.GetText(tcfg_hero.name);
			let pos = tcfg_hero.position;
			hero_pin_d.skin = BaseDefine.HeroAllinfo_bg[tcfg_hero.quality];
			if (this._tAvatarHeroAinList[nId] != null) {
				this._tAvatarHeroAinList[nId].Destroy()
				this._tAvatarHeroAinList[nId] = null
			}
			if (this._tAvatarHeromodList[nId] != null) {
				this._tAvatarHeromodList[nId].Destroy()
				this._tAvatarHeromodList[nId] = null
			}
			hero_icon_d.destroyChildren();
			let heroAin: Avatar = new Avatar(hero_icon_d)
			heroAin.Load(tcfg_hero.strFacadeModel, 1, tcfg_hero.modelScale * 2.6, pos[1], pos[2],
				Laya.Handler.create(this, (heroAins) => {
					heroAins.Play(1, true, true, () => {
					}, true)
				}));
			this._tAvatarHeroAinList[nId] = heroAin
			this.tTimeUseInfo[index] = [nId, time]
			let Buy_times = ShopLogic.Instance.GetBuyTimes(4, peck_cfg.shopId);
			let bool_d = Buy_times == 0 ? true : false;

			//line_d.visible = bool_d;
			let Item_Info_d = MarketConfig[4][peck_cfg.shopId];
			let Shop_Info_d = Item_Info_d.sellContent;
			let preic = Item_Info_d.Price//
			let old_m = preic[2] * Item_Info_d.Discount / 10;
			let Item_cfg = ItemConfig[Shop_Info_d[2]];
			hero_num_d.text = "X" + Shop_Info_d[3];
			hero_num_d.color = BaseDefine.LabelColor1[tcfg_hero.quality];
			let path = "<img src= 'ui_icon/icon_prop_013.png' width='30px' height='20px'></img>";
			SetHtmlStyle(price_d_new, 25, "#fdcbad", "center");
			SetHtmlStyle(price_d_old, 25, "#fdcbad", "center");
			price_d_old.innerHTML = path + preic[2]
			price_d_new.innerHTML = path + old_m + "   ";
			discount_d.text = Item_Info_d.Discount + "折";
			buyend.visible = false
			if (!bool_d) {
				price_d_new.innerHTML = "已购买";
				if (HeroManager.Instance.Peck_Ad[nId] == null) {
					buyend.visible = true;
					price_d_old.innerHTML = GetInfoAttr.Instance.GetText(7147);
					SetHtmlStyle(price_d_new, 25, "#fefeff", "center");
					price_d_new.innerHTML = "广告";
					line_d.visible = false;					
				} else if (HeroManager.Instance.Peck_Ad[nId] == 1 && Buy_times < 2) {
					price_d_old.innerHTML = path + preic[2]
					price_d_new.innerHTML = path + old_m + "   ";
					discount_d.text = Item_Info_d.Discount + "折";
					buyend.visible = false
					line_d.visible = true;
					bool_d = true;
				} 
				else {
					buyend.visible = false
					price_d_new.innerHTML = "已购买";
				}
			}
			hero_btn_d.disabled=false;
			if (Buy_times == 1) {
				hero_btn_d.disabled = HeroStarPeckView._ishavetimes;
			}
			hero_icon_d.on(Laya.Event.CLICK, this, this.OPenView, [nId]);
			hero_btn_d.on(Laya.Event.CLICK, this, this.Btnclick_Dbuy, [nId, 4, peck_cfg.shopId, 1, old_m, preic[1], bool_d, hero_btn_d]);
		}
		private herostar_noMoney_handle(item, index: number) {
			let nId = this.ListPeck_noM.array[index];
			let peck_cfg = HeroPeckConfig[nId];
			let time: Laya.Label = item.getChildByName("Shop_time")
			let hero_modle_d: Laya.Image = item.getChildByName("hero_d");
			let buyend: Laya.Image = item.getChildByName("buyend");
			let hero_name_d: Laya.Label = hero_modle_d.getChildByName("hero_name") as Laya.Label;
			let hero_pin_d: Laya.Image = hero_modle_d.getChildByName("hero_pinzhi") as Laya.Image;//品质色
			let hero_icon_d: Laya.Image = hero_modle_d.getChildByName("hero_icon_d") as Laya.Image;//模型
			let hero_num_d: Laya.Label = hero_modle_d.getChildByName("hero_num_D") as Laya.Label;//数量
			let discount_d: Laya.Label = hero_modle_d.getChildByName("discount") as Laya.Label; //打折数
			let hero_btn_d: Laya.Button = hero_modle_d.getChildByName("Btn_buy") as Laya.Button;//购买按钮  //
			let price_d_new: Laya.HTMLDivElement = hero_btn_d.getChildByName("new_price") as Laya.HTMLDivElement;
			let price_d_old: Laya.HTMLDivElement = hero_modle_d.getChildByName("old_price") as Laya.HTMLDivElement;
			let line_d: Laya.Label = hero_modle_d.getChildByName("line") as Laya.Label;

			let tcfg_hero = HeroConfig[nId];
			hero_name_d.text = GetInfoAttr.Instance.GetText(tcfg_hero.name);
			let pos = tcfg_hero.position;
			hero_pin_d.skin = BaseDefine.HeroAllinfo_bg[tcfg_hero.quality];
			if (this._tAvatarHeroAinList[nId] != null) {
				this._tAvatarHeroAinList[nId].Destroy()
				this._tAvatarHeroAinList[nId] = null
			}
			if (this._tAvatarHeromodList[nId] != null) {
				this._tAvatarHeromodList[nId].Destroy()
				this._tAvatarHeromodList[nId] = null
			}
			hero_icon_d.destroyChildren();
			let heroAin: Avatar = new Avatar(hero_icon_d)
			heroAin.Load(tcfg_hero.strFacadeModel, 1, tcfg_hero.modelScale * 2.6, pos[1], pos[2],
				Laya.Handler.create(this, (heroAins) => {
					heroAins.Play(1, true, true, () => {
					}, true)
				}));
			this._tAvatarHeroAinList[nId] = heroAin
			this.tTimeUseInfo[index] = [nId, time]
			let Buy_times = ShopLogic.Instance.GetBuyTimes(4, peck_cfg.shopId);
			let bool_d = Buy_times == 0 ? true : false;
			//line_d.visible = bool_d;
			let Item_Info_d = MarketConfig[4][peck_cfg.shopId];
			let Shop_Info_d = Item_Info_d.sellContent;
			let preic = Item_Info_d.Price//
			let old_m = preic[2] * Item_Info_d.Discount / 10;
			let Item_cfg = ItemConfig[Shop_Info_d[2]];
			hero_num_d.text = "X" + Shop_Info_d[3];
			hero_num_d.color = BaseDefine.LabelColor1[tcfg_hero.quality];
			let path = "<img src= 'ui_icon/icon_prop_013.png' width='30px' height='20px'></img>";
			SetHtmlStyle(price_d_new, 25, "#fdcbad", "center");
			SetHtmlStyle(price_d_old, 25, "#fdcbad", "center");
			price_d_old.innerHTML = path + preic[2]
			price_d_new.innerHTML = path + old_m + "   ";
			discount_d.text = Item_Info_d.Discount + "折";
			if (!bool_d) {
				price_d_new.innerHTML = "已购买";
			}
			hero_btn_d.disabled=false;
			if (Buy_times == 1) {
				hero_btn_d.disabled = HeroStarPeckView._ishavetimes;
			}
			hero_icon_d.on(Laya.Event.CLICK, this, this.OPenView, [nId]);
			hero_btn_d.on(Laya.Event.CLICK, this, this.Btnclick_Dbuy, [nId, 4, peck_cfg.shopId, 1, old_m, preic[1], bool_d, hero_btn_d]);
		}

		private TimerViewUpdate() {
			for (let index in this.tTimeUseInfo) {
				let info = this.tTimeUseInfo[index]
				if (info == null) return
				let nId = info[0]
				let time = info[1]
				let _time = HeroManager.Instance.GetHeroPecktime(nId) - Time.serverSecodes
				if (_time <= 0) {
					this.Update_View();
				}
				time.text = GetFormatTime(_time) + "后到期，请及时购买";
			}
		}

		private Btnclick_Mbuy(type: number, item_id: number, item_des: string, bool: string) {
			if (bool) {
				BaiDuSDK.Instance.ToRecharge(type, item_id, item_des);
			} else {
				TipsLogic.Instance.OpenSystemTips("已购买");
			}
		}

		private Btnclick_Dbuy(nid, type: number, item_id: number, item_num: number, price: number, item_type: number, bool, btn_look: Laya.Button) {
			if (bool) {
				let price_num = BagManager.Instance.getItemNumber(item_type);
				if (price_num < price) {
					if (IsShieldRecharge()) {
						let str = SysPromptConfig[30060].strPromptInfo;
						TipsLogic.Instance.OpenMessageBox(str,
							Laya.Handler.create(this, () => {
							}));
						return
					} else {
						let str = SysPromptConfig[10014].strPromptInfo
						TipsLogic.Instance.OpenMessageBox(str,
							Laya.Handler.create(this, () => {
								Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
								OneTimer(500, () => {
									Event.DispatchEvent("toGemShop");
								});
								UIManager.Instance.DestroyUI("MessageBoxView", [ViewToppestRoot]);
								UIManager.Instance.DestroyUI("HeroStarPeckView", [ViewUpRoot]);
							}),
							Laya.Handler.create(this, () => {
								UIManager.Instance.DestroyUI("MessageBoxView", [ViewToppestRoot]);
							})
						);
						return
					}
				}
				if (HeroManager.Instance.Peck_Ad[nid] == 1) {
					ShopLogic.Instance.SendBuyMsg(type, item_id, item_num, true);
				} else {
					ShopLogic.Instance.SendBuyMsg(type, item_id, item_num);
				}
			} else {
				if (HeroManager.Instance.Peck_Ad[nid] == null) {
					if (IsAD()) {
						let times = AdvertisingManager.Instance.bnWXAdertisingTimes;
						if (times) {
							UIManager.Instance.CreateUI("AdvertisementView", [ViewUpRoot, AdvertisementType.heroPeck, nid]);
						} else {
							btn_look.disabled = true;
							HeroStarPeckView._ishavetimes = true;
							let str = SysPromptConfig[30071].strPromptInfo
							TipsLogic.Instance.OpenSystemTips(str);
						}
					} else {
						TipsLogic.Instance.OpenSystemTips("已购买");
					}
				}
			}
		}

		private OPenView(nHeroId: number) {
			HeroManager.Instance.OpenView(nHeroId);
		}

		private Btnclick_close() {
			UIManager.Instance.DestroyUI("HeroStarPeckView", [ViewUpRoot]);
			HeroManager.Instance.PeckShow = false;
			Event.DispatchEvent("UpdateBtnList");
			Event.DispatchEvent("ChangeMoeny");
		}

		private DesAvatar() {
			for (let nId in this._tAvatarHeroAinList) {
				let oAvatar = this._tAvatarHeroAinList[nId]
				oAvatar.Destroy()
			}
			this._tAvatarHeroAinList = {}

			for (let nId in this._tAvatarHeromodList) {
				let oAvatar = this._tAvatarHeromodList[nId]
				oAvatar.Destroy()
			}
			this._tAvatarHeromodList = {}
		}

		private Destroy() {
			this.tTimeUseInfo = {}
			Tick.ClearAll(this);
			this.DesAvatar()
			this.offAll();
			Event.RemoveEvent("update_heropeck", Laya.Handler.create(this, this.Update_View));
			Event.RemoveEvent("AdUpdate", Laya.Handler.create(this, this.Update_View));
		}
	}
}