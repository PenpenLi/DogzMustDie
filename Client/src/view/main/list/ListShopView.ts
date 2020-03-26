/**
* 商城UI类 叶;
*/

/**商城类型枚举 */
enum ShopEnum {
	/** 空*/
	eEmpty,
	/** 首冲*/
	eFirstRecharge,
	/** 宝箱*/
	eTreasureBox,
	/** 宝石*/
	eGem,
	/** 道具*/
	ePro,
	/** 抽奖*/
	eLottery,
}

module H52D_Framework {

	AddViewResource("ListShopView",
		[
			{ url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_sign.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS }
		]);
	export class ListShopView extends ui.main.list.ListShopViewUI implements IViewPanel {
		
		private _boxList: Array<Object> = [];
		private _proList: Array<Object> = [];
		/** 充值列表 */
		private _chargeList: Array<Object> = [];
		//奖励表充值档位
		private Reward_gemGift: any = [];
		//钻石礼包的道具表现
		private Item_gemGift: any = [];
		//钻石礼包对应的奖励表
		private Reward_Gem: any = [];

		private _effSelect: Avatar;
		/** 首充列表 */
		private _fristList: Array<Object> = [];
		private _fristItemList: Array<Object> = [];
		/** 抽奖列表 */
		private _lotteryOneList: Array<Object> = [];
		private _lotteryTenList: Array<Object> = [];
		/** 玩家钻石数量 */
		private _gemNum: number;
		/** 玩家金币数量 */
		private _goldNum: number;
		/** 玩家抽奖券数量 */
		private _ticketNum: number;

		constructor() {
			super();
			this.Init();
			this.AddEvent();
			this.ChangeListHigth();
		}
		public Destroy(): void {

		}
		/**添加按钮侦听器 */
		private AddEvent(): void {
			this.on(Laya.Event.REMOVED, this, this.OnDestroy);
			Event.RegistEvent('BuySucceed', Laya.Handler.create(this, this.Init));
			Event.RegistEvent('PackRef', Laya.Handler.create(this, this.UpDateData));
			Event.RegistEvent('toGemShop', Laya.Handler.create(this, this.ToGemShop));
			Event.RegistEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
			Event.RegistEvent('UpdateChargeList', Laya.Handler.create(this, this.UpdateChargeList));
			Event.RegistEvent('CloseEffect', Laya.Handler.create(this, this.PlayEffect));
			Event.RegistEvent('UpdateLotteryShop', Laya.Handler.create(this, this.SetLotteryShop));
			Event.RegistEvent('UpdateBoxList', Laya.Handler.create(this, this.UpdateBoxList));
			Event.RegistEvent('ClickLotteryBtn', Laya.Handler.create(this, this.ClickLotteryBtn));
			Event.RegistEvent('ToLotteryShop', Laya.Handler.create(this, this.ToLotteryShop));
			Event.RegistEvent(EventDefine.WATCH_ADVERTISMENT, Laya.Handler.create(this, this.WatchADBack));
			//CloseEffect
			// this.firstShop.proInfo.on(Laya.Event.CLICK, this, this.ClickHintRule, [ShopEnum.eFirstRecharge]);
			// this.firstShop.firstList.renderHandler = new Laya.Handler(this, this.SetFristListRender);

			this.boxShop.treList.renderHandler = new Laya.Handler(this, this.SetBoxListRender);
			this.boxShop.proInfo.on(Laya.Event.CLICK, this, this.ClickHintRule, [ShopEnum.eTreasureBox]);

			this.gemShop.gemList.renderHandler = new Laya.Handler(this, this.SetChargeListRender);
			this.gemShop.proInfo.on(Laya.Event.CLICK, this, this.ClickHintRule, [ShopEnum.eGem]);

			this.lotteryShop.proInfo.on(Laya.Event.CLICK, this, this.ClickHintRule, [ShopEnum.eLottery]);
			this.lotteryShop.oneBtn.on(Laya.Event.CLICK, this, this.ClickLotteryBtn, [LotteryDataEnum.eOne]);
			this.lotteryShop.tenBtn.on(Laya.Event.CLICK, this, this.ClickLotteryBtn, [LotteryDataEnum.eTen]);
			this.lotteryShop.btn_free.on(Laya.Event.CLICK, this, this.Btnclick_free);
		}

		/**移除事件监听 */
		private OnDestroy(): void {
			this.offAll();
			Tick.ClearAll(this);
			Event.RemoveEvent('PackRef', Laya.Handler.create(this, this.UpDateData));
			Event.RemoveEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
			Event.RemoveEvent('toGemShop', Laya.Handler.create(this, this.ToGemShop));
			Event.RemoveEvent('BuySucceed', Laya.Handler.create(this, this.Init));
			Event.RemoveEvent('UpdateChargeList', Laya.Handler.create(this, this.UpdateChargeList));
			Event.RemoveEvent('CloseEffect', Laya.Handler.create(this, this.PlayEffect));
			Event.RemoveEvent('UpdateLotteryShop', Laya.Handler.create(this, this.SetLotteryShop));
			Event.RemoveEvent('UpdateBoxList', Laya.Handler.create(this, this.UpdateBoxList));
			Event.RemoveEvent('ClickLotteryBtn', Laya.Handler.create(this, this.ClickLotteryBtn));
			Event.RemoveEvent('ToLotteryShop', Laya.Handler.create(this, this.ToLotteryShop));
			Event.RemoveEvent(EventDefine.WATCH_ADVERTISMENT, Laya.Handler.create(this, this.WatchADBack));
			// this.eff_lottery.visible = false;

			if (this._moneyEffectBg) {
				this._moneyEffectBg.Destroy();
				this._moneyEffectBg = null;
			}
		}

		/**更新商城数值 */
		private UpDateData() {
			this._gemNum = ShopLogic.Instance.gemNum;
			this._goldNum = ShopLogic.Instance.goldNum;
			this._ticketNum = ShopLogic.Instance.ticketNum;
			this.TxtNum.text = this._goldNum >= 1000000 ? Number(this._goldNum * 0.0001).toFixed(2).toString() + "W" : this._goldNum.toString();
			this.gemTxtNum.text = "x" + this._gemNum;
			this.lotteryShop.ticketNum.text = "x" + this._ticketNum;
		}
		/**初始化UI */
		private Init(): void {					
			this.SetFreeDrawTime();
			this.UpDateData();
			this.SetDataToList();	
			this.SetLotteryShop();
			this.shopPanel.vScrollBarSkin = "";
			this.SetIconScale(this.boxShop.proInfo);
			this.SetIconScale(this.gemShop.proInfo);
			this.SetIconScale(this.lotteryShop.proInfo);
			this.SetIconScale(this.lotteryShop.oneBtn);
			this.SetIconScale(this.lotteryShop.tenBtn);
			this.SetProShopH();
			if (IsShieldRecharge()) {
				this.gemShop.visible = false;
				this.gemShop.height = 0;
			}
			//引导按钮
			Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_10, this.lotteryShop.oneBtn)
		}

		/**设置抽奖界面 */
		private SetLotteryShop() {
			let oneData: any = this._lotteryOneList;
			let tenData: any = this._lotteryTenList;
			let cusNum = MasterPlayer.Instance.player.CunstLevel
			let gemNum = ShopLogic.Instance.gemNum;
			// this.eff_lottery.visible = false;
			//单抽
			for (let info in oneData) {
				if (oneData[info].customNum <= cusNum) {
					let onePrict = oneData[info].needDiamond;
					this.lotteryShop.onePrict.changeText(onePrict.toString());
					this.lotteryShop.oneNum.changeText("x1");

					let ticketNum = ShopLogic.Instance.ticketNum;
					gemNum > onePrict ? this.lotteryShop.onePrict.color = "#ffffff" : this.lotteryShop.onePrict.color = "#ff0400";
					ticketNum >= 1 ? this.lotteryShop.oneNum.color = "#ffffff" : this.lotteryShop.oneNum.color = "#ff0400";
					break;
				}
			}
			//十连抽
			let bDiscount: boolean = DiscountManager.Instance.IsStartLotteryAction();
			let discountNum = DiscountManager.Instance.LotteryMoney;

			for (let info in tenData) {
				if (tenData[info].customNum <= cusNum) {
					let needgem = tenData[info].needDiamond;
					if (bDiscount) {
						this.lotteryShop.img_1.visible = false;
						this.lotteryShop.tenPrict.visible = false;
						this.lotteryShop.discount.visible = true;
						this.lotteryShop.discountNum.text = "限时"//discountNum / 10 + "折";
						this.lotteryShop.residueNum.text = "今日剩余优惠次数：1/1";
						this.lotteryShop.discount_1.text = needgem + "";
						this.lotteryShop.discount_2.text = discountNum + "";
						this.lotteryShop.new.visible = true;
						gemNum >= discountNum ? this.lotteryShop.discount_2.color = "#ffffff" : this.lotteryShop.discount_2.color = "#ff0400";
						gemNum >= needgem ? this.lotteryShop.discount_1.color = "#ffffff" : this.lotteryShop.discount_1.color = "#ff0400";
					} else {
						this.lotteryShop.new.visible = false;
						this.lotteryShop.residueNum.visible = false;
						this.lotteryShop.img_1.visible = true;
						this.lotteryShop.tenPrict.visible = true;
						this.lotteryShop.discount.visible = false;
						gemNum >= needgem ? this.lotteryShop.tenPrict.color = "#ffffff" : this.lotteryShop.tenPrict.color = "#ff0400";
						this.lotteryShop.tenPrict.text = needgem + "";
					}
					break;
				}
			}
		}
		/**关闭UI */
		private CloseUI() {
			UIManager.Instance.DestroyUI("ShopView", [ViewDownRoot]);
		}

		private ChangeListHigth(): void {
			if (ViewUILogic.Instance.halfPanel) {
				this.shopPanel.height = 270 * G_StageHeightScale;
			} else {
				this.shopPanel.height = (1030 - wxsclae) * G_StageHeightScale;
			}
		}

		private adTime:number = 0;
		/*** 设置免费抽奖时间 */
		private SetFreeDrawTime(){			
			let freeDrawTime=GameParamConfig.LuckDrawCD
			if (window["wx"]) {
				if (AdvertisingManager.Instance.bnWXAdertisingTimes) {
					this.lotteryShop.btn_free.visible = true
					SetHtmlStyle(this.lotteryShop.tx_adtime, 18, "#f6ecea", "center");
					this.lotteryShop.tx_adtime.innerHTML = "免费抽奖";
				} else {
					this.lotteryShop.btn_free.visible = false
				}
			} else {
				this.lotteryShop.btn_free.visible = false
			}
			let _times=ShopLogic.Instance.FreedrawTimes<5?ShopLogic.Instance.FreedrawTimes:5
			this.adTime = freeDrawTime[_times]-(Time.serverSecodes-ShopLogic.Instance.AdCoolTime)
			if (this.adTime>0){
				this.lotteryShop.tx_adtime.innerHTML = " "
				Tick.Loop(1000, this, this.OnFrameHander);
			}else{
				SetHtmlStyle(this.lotteryShop.tx_adtime, 18, "#f6ecea", "center");
				this.lotteryShop.tx_adtime.innerHTML = "免费抽奖";
			}
		}		
		private OnFrameHander() {
			if (--this.adTime > 0) {
				SetHtmlStyle(this.lotteryShop.tx_adtime, 18, "#f6ecea", "left");
				let str = GetInfoAttr.Instance.GetSystemText(7161,GetFormatNumTime(this.adTime,1));			
				let path="<img src= 'ui_shop/icon-danchou-daojishi.png' width='20px' height='20px'></img>"	
				this.lotteryShop.tx_adtime.innerHTML = path + str
			}
			else {
				Tick.Clear(this, this.OnFrameHander);
				this.lotteryShop.tx_adtime.innerHTML = "免费抽奖";
			}
		}

		//QQ广告版 免费抽奖
		private Btnclick_free() {
			if (!AdvertisingManager.Instance.bnWXAdertisingTimes) {
				this.lotteryShop.btn_free.visible = false
				TipsLogic.Instance.OpenSystemTips(SysPromptConfig[30071].strPromptInfo);
			} else {
				if (this.adTime > 0) {

				}else{
					WatchAD(AdvertisingId.freeluckdraw);
					//this.WatchADBack();
				}
			}			
		}

		private WatchADBack() {
			AdvertisingManager.Instance.K_ReqAdvertising(AdvertisementType.free_Luckdraw, LotteryDataEnum.eOne)			
		}

		/**
		 * 为list添加数据源
		 */
		private SetDataToList(): void {
			//首充数据装载  
			let Charge_Info = ShopLogic.Instance.ChargeData;
			let Charge_Frist: any = Charge_Info[ChargeDataEnum.eFristCharge];
			this._fristList = Charge_Frist;
			for (let info in Charge_Frist) {
				let data = Charge_Frist[info];
				let Reward_Info = RewardConfig[data.chargeReward].reWrad;
				for (let i in Reward_Info) {
					this._fristItemList.push(Reward_Info[i]);
				}
			}
			//钻石充值数据装载
			//钻石充值商店
			let Charge_Gem: any = Charge_Info[ChargeDataEnum.eCharge];
			let Item_Gem: any = [];

			//老代码 有时间优化。。。
			for (let id in Charge_Gem) {
				let Charge_data = Charge_Gem[id];
				this._chargeList.push(Number(id));
				let Reward_data = RewardConfig[Charge_data.chargeReward].reWrad[1];
				this.Reward_gemGift.push(Reward_data);
			}

			for (let info in this.Reward_gemGift) {
				let Item_data = this.Reward_gemGift[info];
				this.Item_gemGift.push(ItemConfig[Item_data[2]]);
			}

			for (let Item_info in this.Item_gemGift) {
				let data = this.Item_gemGift[Item_info];
				let dw_data = data.dwUseEffect;
				for (let dw_info in dw_data) {
					this.Reward_Gem.push(RewardConfig[dw_data[dw_info]]);
				}
			}

			this.gemShop.gemList.array = this._chargeList;

			this._boxList = ShopLogic.Instance.ShopData[ShopDataEnum.eBoxShop];
			//this._proList = ShopLogic.Instance.ShopData[ShopDataEnum.eProShop];

			this._lotteryOneList = ShopLogic.Instance.LotteryData[1];
			this._lotteryTenList = ShopLogic.Instance.LotteryData[2];

			this.boxShop.treList.array = this._boxList;
			//this.proShop.proList.array = this._proList;
			// this.firstShop.firstList.array = this._fristItemList;
		}

		/**
		 * 设置商城list样式,首充
         * @param item 单个box
         * @param index 索引
		*/
		// private SetFristListRender(item, index: number): void {
		// 	let info: any = this._fristItemList[index];
		// 	let Item_Info: any;
		// 	//物品数据类型
		// 	let Item_Id = info[BaseDefine.ItemSellContentId];
		// 	let Item_Num = info[BaseDefine.ItemNumSellContent];
		// 	let Item_Type = info[BaseDefine.ItemSellContentType];

		// 	let icon: Laya.Image = item.getChildByName('icon');
		// 	if (Item_Type == BaseDefine.ItemTypePro) {
		// 		Item_Info = ItemConfig[Item_Id];
		// 		if (Item_Info.dwItemTypes == BaseDefine.ItemSonTypeUesHero) {
		// 			let hero = HeroConfig[Item_Info.heroId];
		// 			//获取动画帧数成图片
		// 			let heroAin: Avatar.Load(icon);
		// 			heroAin.Load(hero.strFacadeModel, 1, hero.modelScale * 2.7, icon.x + 77, icon.y + 180,
		// 				Laya.Handler.create(this, () => {
		// 					heroAin.Play(1, true, true, () => {
		// 					}, true)
		// 				}));
		// 		}
		// 		else {
		// 			icon.skin = "ui_icon/" + Item_Info.strIconID_B;
		// 		}
		// 	}
		// }

		/**刷新充值页面 */
		private UpdateChargeList(): void {
			this.SetDataToList();
			this.gemShop.gemList.renderHandler = new Laya.Handler(this, this.SetChargeListRender);
		}
		/**刷新充值页面 */
		private UpdateBoxList(): void {
			Tick.ClearAll(this);
			this.boxShop.treList.renderHandler = new Laya.Handler(this, this.SetBoxListRender);
		}
		/**
		 * 设置商城list样式,充值
         * @param item 单个box
         * @param index 索引
		*/
		private SetChargeListRender(item, index: number): void {
			let gemNum: Laya.Text = item.getChildByName('gemNum');
			let gemName: Laya.Text = item.getChildByName('gemName');
			let gemIcon: Laya.Image = item.getChildByName('gemIcon');
			let buyBtn: Laya.Button = gemIcon.getChildByName('buyBtn') as Laya.Button;
			let gemPrice: Laya.Text = item.getChildByName('gemPrice');
			let discountBg: Laya.Image = item.getChildByName('discountBg');
			let discount: Laya.Text = discountBg.getChildByName('discount') as Laya.Text;

			let buyId = this.gemShop.gemList.array[index];
			let gemPrices = ShopLogic.Instance.ChargeData[ChargeDataEnum.eCharge][buyId]['Price'];
			let nItemQuality = this.Item_gemGift[index].dwItemQuality
			let gemNames = GetInfoAttr.Instance.GetText(this.Item_gemGift[index].dwItemName);
			let gemNums = this.Reward_Gem[index].reWrad[1][BaseDefine.ItemRewardNum];
			let icon = this.Item_gemGift[index].strIconID_B;
			let discountNum = ShopLogic.Instance.ChargeData[ChargeDataEnum.eCharge][buyId]['firstChargeRate'];
			discountBg.visible = ShopLogic.Instance.isFristCharge(1, buyId);
			if (ShopLogic.Instance.isFristCharge(1, buyId)) {
				discount.text = discountNum + "倍";
				gemNums *= discountNum;
			}
			gemName.changeText(gemNames);
			gemName.color = BaseDefine.LabelColor[nItemQuality];
			gemNum.changeText("x" + gemNums);
			gemPrice.changeText(gemPrices);
			gemIcon.skin = "ui_icon/" + icon;
			this.SetIconScale(gemIcon);

			if (ShopLogic.Instance.nIdx == buyId) {
				let bool = ShopLogic.Instance.isFristCharge(1, buyId);
				this.PlayEffect(bool, buyBtn);
			}
			buyBtn.on(Laya.Event.CLICK, this, this.ToBuyGemInterface, [ChargeDataEnum.eCharge, buyId, gemNames]);
		}

		/**
		 * 设置商城list样式，宝箱
         * @param item 单个box
         * @param index 索引
		*/
		private SetBoxListRender(item, index: number): void {
			let resName: Laya.HTMLDivElement = item.getChildByName('resName');
			let resIcon: Laya.Image = item.getChildByName('resIcon');
			let buyBtn: Laya.Button = resIcon.getChildByName('buyBtn') as Laya.Button;
			let resPrice: Laya.Text = item.getChildByName('resPrice');
			let priceType: Laya.Image = item.getChildByName('priceType');
			let discountBg: Laya.Image = item.getChildByName('discountBg');
			let discount: Laya.Label = discountBg.getChildByName('discount') as Laya.Label;
			let activityTime: Laya.Label = item.getChildByName('activityTime');
			let info: any = this._boxList[index];
			//出售内容
			let sellContent = info.sellContent;
			//商品类型
			let nItemType = sellContent[BaseDefine.ItemSellContentType];

			discountBg.visible = activityTime.visible = DiscountManager.Instance.IsStartBoxAction();

			//策划突然不要倒计时了。。。先隐藏了
			activityTime.visible = false;

			if (nItemType == BaseDefine.ItemTypePro) {
				let nItemID = sellContent[BaseDefine.ItemSellContentId];
				let nItemNum = sellContent[BaseDefine.ItemNumSellContent];
				let nItemPrice = info.Price[BaseDefine.ItemIdPrice];

				let nItemPriceType = info.Price[BaseDefine.ItemIdCurrency];
				//道具信息
				let Item_Info = ItemConfig[nItemID];
				let nItemName = GetInfoAttr.Instance.GetText(Item_Info.dwItemName) ? GetInfoAttr.Instance.GetText(Item_Info.dwItemName) : "未匹配Name";

				let nItemQuality = Item_Info.dwItemQuality;
				let color = BaseDefine.LabelColor[nItemQuality];

				SetHtmlStyle(resName, 24, color, "center", true);

				resPrice.changeText(nItemPrice);
				nItemPriceType == 1 ? priceType.skin = "ui_icon/icon_prop_012.png" : priceType.skin = "ui_icon/icon_prop_013.png";

				resName.innerHTML = nItemName;
				let bbb = DiscountManager.Instance.getBoxTims(index + 1) < DiscountManager.Instance.nBoxMaxTims;
				//是否打折
				if (discountBg.visible && DiscountManager.Instance.getBoxTims(index + 1) < DiscountManager.Instance.nBoxMaxTims) {
					let money = DiscountManager.Instance.tBoxMoney[index + 1];
					let disNum = money / nItemPrice * 10
					discount.text = disNum.toFixed(1) + "折";
					nItemPrice = money
					resName.innerHTML = nItemName + "(" + DiscountManager.Instance.getBoxTims(index + 1) + "/" + DiscountManager.Instance.nBoxMaxTims + ")"
					//活动倒计时
					let time = DiscountManager.Instance.tBoxSvot - Time.serverSecodes;
					activityTime.text = GetFormatTime(time);
					resPrice.changeText(nItemPrice);
					Tick.Loop(1000, this, () => {
						time = DiscountManager.Instance.tBoxSvot - Time.serverSecodes;
						if (time <= 0 || DiscountManager.Instance.getBoxTims(index + 1) >= DiscountManager.Instance.nBoxMaxTims) {
							this.UpdateBoxList();
							resName.innerHTML = nItemName
						} else {
							resName.innerHTML = nItemName + "(" + DiscountManager.Instance.getBoxTims(index + 1) + "/" + DiscountManager.Instance.nBoxMaxTims + ")"
						}
						activityTime.text = GetFormatTime(time);
					}, [], false);
				} else {
					discountBg.visible = activityTime.visible = false;
					resName.innerHTML = nItemName;
				}

				resIcon.skin = "ui_icon/" + Item_Info.strIconID_B;
				resIcon.width = 168;
				resIcon.height = 162;

				buyBtn.on(Laya.Event.CLICK, this, this.ClickBoxItem, [ShopDataEnum.eBoxShop, info.id, index, "宝箱详情", OpenType.eBox, nItemPrice]);
				this.SetIconScale(resIcon);
			}
		}

		private UpdateActivityTime(text: Laya.Label) {

		}

		private _moneyEffectBg: Avatar;
		private PlayEffect(bool: boolean, btn?: Laya.Button) {
			if (this._moneyEffectBg) {
				this._moneyEffectBg.Destroy();
			}
			if (bool) {
				this._moneyEffectBg = new Avatar(btn)
				this._moneyEffectBg.Load("res/effect/effect_ui_shangcheng/effect_ui_shangcheng.sk", 1, 3.5, 110, 110,
					Laya.Handler.create(this, () => {
						this._moneyEffectBg.Play("effect_ui_shangcheng", true, true, () => {
						})
					}));
			}
			else {
				if (this._moneyEffectBg) {
					this._moneyEffectBg.Destroy();
				}
			}
		}

		/**
		 * 设置商城list样式，道具
         * @param item 单个box
         * @param index 索引
		*/
		private SetProListRender(item, index: number): void {
			let proBj: Laya.Image = item.getChildByName('proBj');
			let proNum: Laya.Text = item.getChildByName('proNum');
			let proName: Laya.Text = item.getChildByName('proName');
			let proIcon: Laya.Image = item.getChildByName('proIcon');
			let buyBtn: Laya.Button = proIcon.getChildByName('buyBtn') as Laya.Button;
			let proPrice: Laya.Text = item.getChildByName('proPrice');
			let proPriceType: Laya.Image = item.getChildByName('proPriceType');
			let info: any = this._proList[index];
			//出售内容
			let sellContent = info.sellContent;
			//商品类型
			let nItemType = sellContent[BaseDefine.ItemSellContentType];
			let nItemID = sellContent[BaseDefine.ItemSellContentId];
			let nItemNum = sellContent[BaseDefine.ItemNumSellContent];
			let nItemPrice = info.Price[BaseDefine.ItemIdPrice];
			let nItemPriceType = info.Price[BaseDefine.ItemIdCurrency];
			if (nItemPriceType == 1) {
				proPriceType.skin = "ui_icon/icon_prop_012.png";
			}
			else {
				proPriceType.skin = "ui_icon/icon_prop_013.png";
			}

			if (nItemType == BaseDefine.ItemTypePro) {
				//道具信息
				let Item_Info = ItemConfig[nItemID];
				let nItemQuality = Item_Info.dwItemQuality;
				let nItemName = GetInfoAttr.Instance.GetText(Item_Info.dwItemName) ? GetInfoAttr.Instance.GetText(Item_Info.dwItemName) : "未匹配Name";
				if (Item_Info.dwItemTypes != BaseDefine.ItemSonTypeUesHero) {
					buyBtn.on(Laya.Event.CLICK, this, this.ClickBoxItem, [ShopDataEnum.eProShop, info.id, index, "道具详情", OpenType.ePro, nItemPrice]);
				} else {
					buyBtn.on(Laya.Event.CLICK, this, this.ClickBoxItem, [ShopDataEnum.eProShop, info.id, index, "英雄详情", OpenType.eHero, nItemPrice]);
				}
				this.SetIconScale(proIcon);
				proPrice.changeText(nItemPrice);

				proIcon.skin = "ui_icon/" + Item_Info.strIconID_B;
				proName.changeText(nItemName);
				proName.color = BaseDefine.LabelColor[nItemQuality];
				proNum.visible = nItemNum != 1;
				proNum.changeText("X" + nItemNum);
				proBj.skin = BaseDefine.QualityList[nItemQuality];
			}
			else if (nItemType == BaseDefine.ItemTypeEquip) {

			}
			else if (nItemType == BaseDefine.ItemTypeHero) {

			}
			else if (nItemType == BaseDefine.ItemTypePet) {
				let pet: BPetVo = new BPetVo(nItemID);
				buyBtn.on(Laya.Event.CLICK, this, this.ClickBoxItem, [ShopDataEnum.eProShop, info.id, index, "神兽详情", OpenType.ePet, nItemPrice]);
				proIcon.skin = "ui_icon/" + pet.strPetIcon;
				proName.changeText(pet.petName);
				proName.color = BaseDefine.PetColor_label[pet.petColor];
				proNum.visible = nItemNum != 1;
				proNum.changeText("X" + nItemNum);
				proBj.skin = BaseDefine.QualityList[pet.petColor];
			}
		}

		/**
		 * 点击宝箱，打开宝箱tips
		 * @param nType 商城类型
		 * @param nID 商品ID
		 */
		private ClickBoxItem(nType: ShopDataEnum, nID: number, index: number, name: string, openType: OpenType, nprice: number): void {
			let num = index + 1;
			let cfg = MarketConfig[nType][num];
			let price = nprice;
			let PriceType = cfg.Price[BaseDefine.ItemIdCurrency];
			let boxId = cfg.sellContent[BaseDefine.ItemSellContentId];
			let proNum = cfg.sellContent[BaseDefine.ItemNumSellContent];
			let proIcon;
			if (openType == OpenType.ePet) {
				proIcon = 0;
			} else {
				proIcon = ItemConfig[boxId].strIconID_B;
			}
			let tipName = name;
			UIManager.Instance.CreateUI("TipsTreasureView", [ViewToppestRoot, nType, boxId, price, PriceType, num, tipName, openType, proIcon, proNum]);
		}

		private SetIconScale(icon: any) {
			icon.on(Laya.Event.MOUSE_MOVE, this, () => {
				icon.scale(1.07, 1.07);
			});
			icon.on(Laya.Event.MOUSE_OUT, this, () => {
				icon.scale(1, 1);
			});
			icon.on(Laya.Event.MOUSE_DOWN, this, () => {
				icon.scale(0.93, 0.93);
			});
			icon.on(Laya.Event.MOUSE_UP, this, () => {
				icon.scale(1, 1);
			});
		}

		/**
		 * 跳转充值界面
		 * @param goodsType 商品类型
		 * @param goodsId 商品id
		 * @param goodsDesc 商品描述
		 */
		private ToBuyGemInterface(goodsType: number, goodsId: number, goodsDesc: string) {
			BaiDuSDK.Instance.ToRecharge(goodsType, goodsId, goodsDesc);
		}

		private n_Idx: number;
		/** 跳到钻石充值商城*/
		private ToGemShop(Idx: number) {
			ShopLogic.Instance.nIdx = Idx;
			this.UpdateChargeList();
			this.shopPanel.vScrollBar.value = this.gemShop.y;
		}

		/** 跳到钻石充值商城*/
		private ToLotteryShop() {
			// this.eff_lottery.visible = true;
			this.UpdateChargeList();
			this.shopPanel.vScrollBar.value = this.lotteryShop.y;
		}

		/**
         * 购买按钮
		 * @param nType 商品类型
         * @param nId 商品ID
         */
		private BuyItems(nType: number, nId: number, index: number): void {
			let num = index + 1;

			ShopLogic.Instance.SendBuyMsg(nType, num, 1)
		}

		private _SendLotteryFlag = true
		private ClickLotteryBtn(lotteryEnum: LotteryDataEnum) {
			//播放点击音效
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
			if (this._SendLotteryFlag == false) {
				return
			}
			this._SendLotteryFlag = false;
			//发送抽奖请求
			ShopLogic.Instance.SendLotteryMsg(lotteryEnum);

			OneTimer(1000, () => {
				this._SendLotteryFlag = true
			}, "ClickLotteryBtn")
		}

		/** 点击提示规则
		 * @param 提示类型
		 */
		private ClickHintRule(ruleEnum: ShopEnum) {
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
			switch (ruleEnum as ShopEnum) {
				case ShopEnum.eFirstRecharge:

					break;
				case ShopEnum.eGem:

					break;
				case ShopEnum.eTreasureBox:

					break;
				case ShopEnum.eLottery:
					this.OpenLotteryInfo();
					break;
				case ShopEnum.ePro:

					break;
				default:
					break;
			}
		}

		/**打开抽奖查看信息界面 */
		private OpenLotteryInfo() {
			let data_id = [];
			let reward_id: any;
			let reWrad_data: any = [];
			let front_id: any;
			let frist: boolean = true;
			for (let type in LotteryConfig) {
				let data_type = LotteryConfig[type];
				for (let info in data_type) {
					let customNum: number = Number(data_type[info].customNum);
					let customsOrder = MasterPlayer.Instance.player.CunstLevel;
					if (frist) {
						if (customNum >= customsOrder) {
							frist = false;
							front_id = data_type[info].id;
							reWrad_data.push(RewardConfig[front_id].reWrad);
							break;
						}
					}
					let length = GetTabLength(data_type);
					if (customNum > customsOrder) {
						if (frist) {
							frist = false;
							reward_id = data_type[info].id;
							reWrad_data.push(RewardConfig[reward_id].reWrad);
						}
						else {
							reWrad_data.push(RewardConfig[front_id].reWrad);
						}
						break;
					}
					if (customsOrder > customNum && length == Number(info)) {
						if (frist) {
							frist = false;
							reward_id = data_type[info].id;
							reWrad_data.push(RewardConfig[reward_id].reWrad);
						}
						else {
							reWrad_data.push(RewardConfig[front_id].reWrad);
						}
						break;
					}

					frist = false;
					front_id = data_type[info].id;
				}
			}
			UIManager.Instance.CreateUI("ShopInfoView", [ViewUpRoot, "奖励预览", "抽奖有概率获得奖励如下：", reWrad_data])
		}

		/**自定义商城的高度 */
		private SetProShopH() {
			let proNum: number = this._proList.length;
			let boxNum: number = this._boxList.length;
			let boxH: number = 272;
			let wNum: number = 3;
			let proh: number = (Math.floor(proNum / wNum) + 1) * boxH;
			let boxh: number = (Math.floor(boxNum / wNum)) * boxH;
			this.boxShop.treList.height = boxh;
			this.boxShop.height = boxh + 60;
		}
	}
}