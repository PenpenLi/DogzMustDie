/**
* 商城UI类 叶;
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**商城类型枚举 */
var ShopEnum;
(function (ShopEnum) {
    /** 空*/
    ShopEnum[ShopEnum["eEmpty"] = 0] = "eEmpty";
    /** 首冲*/
    ShopEnum[ShopEnum["eFirstRecharge"] = 1] = "eFirstRecharge";
    /** 宝箱*/
    ShopEnum[ShopEnum["eTreasureBox"] = 2] = "eTreasureBox";
    /** 宝石*/
    ShopEnum[ShopEnum["eGem"] = 3] = "eGem";
    /** 道具*/
    ShopEnum[ShopEnum["ePro"] = 4] = "ePro";
    /** 抽奖*/
    ShopEnum[ShopEnum["eLottery"] = 5] = "eLottery";
})(ShopEnum || (ShopEnum = {}));
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("ListShopView", [
        { url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_sign.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS }
    ]);
    var ListShopView = /** @class */ (function (_super) {
        __extends(ListShopView, _super);
        function ListShopView() {
            var _this = _super.call(this) || this;
            _this._boxList = [];
            _this._proList = [];
            /** 充值列表 */
            _this._chargeList = [];
            //奖励表充值档位
            _this.Reward_gemGift = [];
            //钻石礼包的道具表现
            _this.Item_gemGift = [];
            //钻石礼包对应的奖励表
            _this.Reward_Gem = [];
            /** 首充列表 */
            _this._fristList = [];
            _this._fristItemList = [];
            /** 抽奖列表 */
            _this._lotteryOneList = [];
            _this._lotteryTenList = [];
            _this.adTime = 0;
            _this._SendLotteryFlag = true;
            _this.Init();
            _this.AddEvent();
            _this.ChangeListHigth();
            return _this;
        }
        ListShopView.prototype.Destroy = function () {
        };
        /**添加按钮侦听器 */
        ListShopView.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.OnDestroy);
            H52D_Framework.Event.RegistEvent('BuySucceed', Laya.Handler.create(this, this.Init));
            H52D_Framework.Event.RegistEvent('PackRef', Laya.Handler.create(this, this.UpDateData));
            H52D_Framework.Event.RegistEvent('toGemShop', Laya.Handler.create(this, this.ToGemShop));
            H52D_Framework.Event.RegistEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
            H52D_Framework.Event.RegistEvent('UpdateChargeList', Laya.Handler.create(this, this.UpdateChargeList));
            H52D_Framework.Event.RegistEvent('CloseEffect', Laya.Handler.create(this, this.PlayEffect));
            H52D_Framework.Event.RegistEvent('UpdateLotteryShop', Laya.Handler.create(this, this.SetLotteryShop));
            H52D_Framework.Event.RegistEvent('UpdateBoxList', Laya.Handler.create(this, this.UpdateBoxList));
            H52D_Framework.Event.RegistEvent('ClickLotteryBtn', Laya.Handler.create(this, this.ClickLotteryBtn));
            H52D_Framework.Event.RegistEvent('ToLotteryShop', Laya.Handler.create(this, this.ToLotteryShop));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.WATCH_ADVERTISMENT, Laya.Handler.create(this, this.WatchADBack));
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
        };
        /**移除事件监听 */
        ListShopView.prototype.OnDestroy = function () {
            this.offAll();
            H52D_Framework.Tick.ClearAll(this);
            H52D_Framework.Event.RemoveEvent('PackRef', Laya.Handler.create(this, this.UpDateData));
            H52D_Framework.Event.RemoveEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
            H52D_Framework.Event.RemoveEvent('toGemShop', Laya.Handler.create(this, this.ToGemShop));
            H52D_Framework.Event.RemoveEvent('BuySucceed', Laya.Handler.create(this, this.Init));
            H52D_Framework.Event.RemoveEvent('UpdateChargeList', Laya.Handler.create(this, this.UpdateChargeList));
            H52D_Framework.Event.RemoveEvent('CloseEffect', Laya.Handler.create(this, this.PlayEffect));
            H52D_Framework.Event.RemoveEvent('UpdateLotteryShop', Laya.Handler.create(this, this.SetLotteryShop));
            H52D_Framework.Event.RemoveEvent('UpdateBoxList', Laya.Handler.create(this, this.UpdateBoxList));
            H52D_Framework.Event.RemoveEvent('ClickLotteryBtn', Laya.Handler.create(this, this.ClickLotteryBtn));
            H52D_Framework.Event.RemoveEvent('ToLotteryShop', Laya.Handler.create(this, this.ToLotteryShop));
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.WATCH_ADVERTISMENT, Laya.Handler.create(this, this.WatchADBack));
            // this.eff_lottery.visible = false;
            if (this._moneyEffectBg) {
                this._moneyEffectBg.Destroy();
                this._moneyEffectBg = null;
            }
        };
        /**更新商城数值 */
        ListShopView.prototype.UpDateData = function () {
            this._gemNum = H52D_Framework.ShopLogic.Instance.gemNum;
            this._goldNum = H52D_Framework.ShopLogic.Instance.goldNum;
            this._ticketNum = H52D_Framework.ShopLogic.Instance.ticketNum;
            this.TxtNum.text = this._goldNum >= 1000000 ? Number(this._goldNum * 0.0001).toFixed(2).toString() + "W" : this._goldNum.toString();
            this.gemTxtNum.text = "x" + this._gemNum;
            this.lotteryShop.ticketNum.text = "x" + this._ticketNum;
        };
        /**初始化UI */
        ListShopView.prototype.Init = function () {
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
            if (H52D_Framework.IsShieldRecharge()) {
                this.gemShop.visible = false;
                this.gemShop.height = 0;
            }
            //引导按钮
            H52D_Framework.Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_10, this.lotteryShop.oneBtn);
        };
        /**设置抽奖界面 */
        ListShopView.prototype.SetLotteryShop = function () {
            var oneData = this._lotteryOneList;
            var tenData = this._lotteryTenList;
            var cusNum = H52D_Framework.MasterPlayer.Instance.player.CunstLevel;
            var gemNum = H52D_Framework.ShopLogic.Instance.gemNum;
            // this.eff_lottery.visible = false;
            //单抽
            for (var info in oneData) {
                if (oneData[info].customNum <= cusNum) {
                    var onePrict = oneData[info].needDiamond;
                    this.lotteryShop.onePrict.changeText(onePrict.toString());
                    this.lotteryShop.oneNum.changeText("x1");
                    var ticketNum = H52D_Framework.ShopLogic.Instance.ticketNum;
                    gemNum > onePrict ? this.lotteryShop.onePrict.color = "#ffffff" : this.lotteryShop.onePrict.color = "#ff0400";
                    ticketNum >= 1 ? this.lotteryShop.oneNum.color = "#ffffff" : this.lotteryShop.oneNum.color = "#ff0400";
                    break;
                }
            }
            //十连抽
            var bDiscount = H52D_Framework.DiscountManager.Instance.IsStartLotteryAction();
            var discountNum = H52D_Framework.DiscountManager.Instance.LotteryMoney;
            for (var info in tenData) {
                if (tenData[info].customNum <= cusNum) {
                    var needgem = tenData[info].needDiamond;
                    if (bDiscount) {
                        this.lotteryShop.img_1.visible = false;
                        this.lotteryShop.tenPrict.visible = false;
                        this.lotteryShop.discount.visible = true;
                        this.lotteryShop.discountNum.text = "限时"; //discountNum / 10 + "折";
                        this.lotteryShop.residueNum.text = "今日剩余优惠次数：1/1";
                        this.lotteryShop.discount_1.text = needgem + "";
                        this.lotteryShop.discount_2.text = discountNum + "";
                        this.lotteryShop.new.visible = true;
                        gemNum >= discountNum ? this.lotteryShop.discount_2.color = "#ffffff" : this.lotteryShop.discount_2.color = "#ff0400";
                        gemNum >= needgem ? this.lotteryShop.discount_1.color = "#ffffff" : this.lotteryShop.discount_1.color = "#ff0400";
                    }
                    else {
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
        };
        /**关闭UI */
        ListShopView.prototype.CloseUI = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("ShopView", [H52D_Framework.ViewDownRoot]);
        };
        ListShopView.prototype.ChangeListHigth = function () {
            if (H52D_Framework.ViewUILogic.Instance.halfPanel) {
                this.shopPanel.height = 270 * G_StageHeightScale;
            }
            else {
                this.shopPanel.height = (1030 - wxsclae) * G_StageHeightScale;
            }
        };
        /*** 设置免费抽奖时间 */
        ListShopView.prototype.SetFreeDrawTime = function () {
            var freeDrawTime = H52D_Framework.GameParamConfig.LuckDrawCD;
            if (window["wx"]) {
                if (H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes) {
                    this.lotteryShop.btn_free.visible = true;
                    H52D_Framework.SetHtmlStyle(this.lotteryShop.tx_adtime, 18, "#f6ecea", "center");
                    this.lotteryShop.tx_adtime.innerHTML = "免费抽奖";
                }
                else {
                    this.lotteryShop.btn_free.visible = false;
                }
            }
            else {
                this.lotteryShop.btn_free.visible = false;
            }
            var _times = H52D_Framework.ShopLogic.Instance.FreedrawTimes < 5 ? H52D_Framework.ShopLogic.Instance.FreedrawTimes : 5;
            this.adTime = freeDrawTime[_times] - (H52D_Framework.Time.serverSecodes - H52D_Framework.ShopLogic.Instance.AdCoolTime);
            if (this.adTime > 0) {
                this.lotteryShop.tx_adtime.innerHTML = " ";
                H52D_Framework.Tick.Loop(1000, this, this.OnFrameHander);
            }
            else {
                H52D_Framework.SetHtmlStyle(this.lotteryShop.tx_adtime, 18, "#f6ecea", "center");
                this.lotteryShop.tx_adtime.innerHTML = "免费抽奖";
            }
        };
        ListShopView.prototype.OnFrameHander = function () {
            if (--this.adTime > 0) {
                H52D_Framework.SetHtmlStyle(this.lotteryShop.tx_adtime, 18, "#f6ecea", "left");
                var str = H52D_Framework.GetInfoAttr.Instance.GetSystemText(7161, H52D_Framework.GetFormatNumTime(this.adTime, 1));
                var path = "<img src= 'ui_shop/icon-danchou-daojishi.png' width='20px' height='20px'></img>";
                this.lotteryShop.tx_adtime.innerHTML = path + str;
            }
            else {
                H52D_Framework.Tick.Clear(this, this.OnFrameHander);
                this.lotteryShop.tx_adtime.innerHTML = "免费抽奖";
            }
        };
        //QQ广告版 免费抽奖
        ListShopView.prototype.Btnclick_free = function () {
            if (!H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes) {
                this.lotteryShop.btn_free.visible = false;
                H52D_Framework.TipsLogic.Instance.OpenSystemTips(H52D_Framework.SysPromptConfig[30071].strPromptInfo);
            }
            else {
                if (this.adTime > 0) {
                }
                else {
                    H52D_Framework.WatchAD(H52D_Framework.AdvertisingId.freeluckdraw);
                    //this.WatchADBack();
                }
            }
        };
        ListShopView.prototype.WatchADBack = function () {
            H52D_Framework.AdvertisingManager.Instance.K_ReqAdvertising(AdvertisementType.free_Luckdraw, LotteryDataEnum.eOne);
        };
        /**
         * 为list添加数据源
         */
        ListShopView.prototype.SetDataToList = function () {
            //首充数据装载  
            var Charge_Info = H52D_Framework.ShopLogic.Instance.ChargeData;
            var Charge_Frist = Charge_Info[ChargeDataEnum.eFristCharge];
            this._fristList = Charge_Frist;
            for (var info in Charge_Frist) {
                var data = Charge_Frist[info];
                var Reward_Info = H52D_Framework.RewardConfig[data.chargeReward].reWrad;
                for (var i in Reward_Info) {
                    this._fristItemList.push(Reward_Info[i]);
                }
            }
            //钻石充值数据装载
            //钻石充值商店
            var Charge_Gem = Charge_Info[ChargeDataEnum.eCharge];
            var Item_Gem = [];
            //老代码 有时间优化。。。
            for (var id in Charge_Gem) {
                var Charge_data = Charge_Gem[id];
                this._chargeList.push(Number(id));
                var Reward_data = H52D_Framework.RewardConfig[Charge_data.chargeReward].reWrad[1];
                this.Reward_gemGift.push(Reward_data);
            }
            for (var info in this.Reward_gemGift) {
                var Item_data = this.Reward_gemGift[info];
                this.Item_gemGift.push(H52D_Framework.ItemConfig[Item_data[2]]);
            }
            for (var Item_info in this.Item_gemGift) {
                var data = this.Item_gemGift[Item_info];
                var dw_data = data.dwUseEffect;
                for (var dw_info in dw_data) {
                    this.Reward_Gem.push(H52D_Framework.RewardConfig[dw_data[dw_info]]);
                }
            }
            this.gemShop.gemList.array = this._chargeList;
            this._boxList = H52D_Framework.ShopLogic.Instance.ShopData[ShopDataEnum.eBoxShop];
            //this._proList = ShopLogic.Instance.ShopData[ShopDataEnum.eProShop];
            this._lotteryOneList = H52D_Framework.ShopLogic.Instance.LotteryData[1];
            this._lotteryTenList = H52D_Framework.ShopLogic.Instance.LotteryData[2];
            this.boxShop.treList.array = this._boxList;
            //this.proShop.proList.array = this._proList;
            // this.firstShop.firstList.array = this._fristItemList;
        };
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
        ListShopView.prototype.UpdateChargeList = function () {
            this.SetDataToList();
            this.gemShop.gemList.renderHandler = new Laya.Handler(this, this.SetChargeListRender);
        };
        /**刷新充值页面 */
        ListShopView.prototype.UpdateBoxList = function () {
            H52D_Framework.Tick.ClearAll(this);
            this.boxShop.treList.renderHandler = new Laya.Handler(this, this.SetBoxListRender);
        };
        /**
         * 设置商城list样式,充值
         * @param item 单个box
         * @param index 索引
        */
        ListShopView.prototype.SetChargeListRender = function (item, index) {
            var gemNum = item.getChildByName('gemNum');
            var gemName = item.getChildByName('gemName');
            var gemIcon = item.getChildByName('gemIcon');
            var buyBtn = gemIcon.getChildByName('buyBtn');
            var gemPrice = item.getChildByName('gemPrice');
            var discountBg = item.getChildByName('discountBg');
            var discount = discountBg.getChildByName('discount');
            var buyId = this.gemShop.gemList.array[index];
            var gemPrices = H52D_Framework.ShopLogic.Instance.ChargeData[ChargeDataEnum.eCharge][buyId]['Price'];
            var nItemQuality = this.Item_gemGift[index].dwItemQuality;
            var gemNames = H52D_Framework.GetInfoAttr.Instance.GetText(this.Item_gemGift[index].dwItemName);
            var gemNums = this.Reward_Gem[index].reWrad[1][H52D_Framework.BaseDefine.ItemRewardNum];
            var icon = this.Item_gemGift[index].strIconID_B;
            var discountNum = H52D_Framework.ShopLogic.Instance.ChargeData[ChargeDataEnum.eCharge][buyId]['firstChargeRate'];
            discountBg.visible = H52D_Framework.ShopLogic.Instance.isFristCharge(1, buyId);
            if (H52D_Framework.ShopLogic.Instance.isFristCharge(1, buyId)) {
                discount.text = discountNum + "倍";
                gemNums *= discountNum;
            }
            gemName.changeText(gemNames);
            gemName.color = H52D_Framework.BaseDefine.LabelColor[nItemQuality];
            gemNum.changeText("x" + gemNums);
            gemPrice.changeText(gemPrices);
            gemIcon.skin = "ui_icon/" + icon;
            this.SetIconScale(gemIcon);
            if (H52D_Framework.ShopLogic.Instance.nIdx == buyId) {
                var bool = H52D_Framework.ShopLogic.Instance.isFristCharge(1, buyId);
                this.PlayEffect(bool, buyBtn);
            }
            buyBtn.on(Laya.Event.CLICK, this, this.ToBuyGemInterface, [ChargeDataEnum.eCharge, buyId, gemNames]);
        };
        /**
         * 设置商城list样式，宝箱
         * @param item 单个box
         * @param index 索引
        */
        ListShopView.prototype.SetBoxListRender = function (item, index) {
            var _this = this;
            var resName = item.getChildByName('resName');
            var resIcon = item.getChildByName('resIcon');
            var buyBtn = resIcon.getChildByName('buyBtn');
            var resPrice = item.getChildByName('resPrice');
            var priceType = item.getChildByName('priceType');
            var discountBg = item.getChildByName('discountBg');
            var discount = discountBg.getChildByName('discount');
            var activityTime = item.getChildByName('activityTime');
            var info = this._boxList[index];
            //出售内容
            var sellContent = info.sellContent;
            //商品类型
            var nItemType = sellContent[H52D_Framework.BaseDefine.ItemSellContentType];
            discountBg.visible = activityTime.visible = H52D_Framework.DiscountManager.Instance.IsStartBoxAction();
            //策划突然不要倒计时了。。。先隐藏了
            activityTime.visible = false;
            if (nItemType == H52D_Framework.BaseDefine.ItemTypePro) {
                var nItemID = sellContent[H52D_Framework.BaseDefine.ItemSellContentId];
                var nItemNum = sellContent[H52D_Framework.BaseDefine.ItemNumSellContent];
                var nItemPrice = info.Price[H52D_Framework.BaseDefine.ItemIdPrice];
                var nItemPriceType = info.Price[H52D_Framework.BaseDefine.ItemIdCurrency];
                //道具信息
                var Item_Info = H52D_Framework.ItemConfig[nItemID];
                var nItemName_1 = H52D_Framework.GetInfoAttr.Instance.GetText(Item_Info.dwItemName) ? H52D_Framework.GetInfoAttr.Instance.GetText(Item_Info.dwItemName) : "未匹配Name";
                var nItemQuality = Item_Info.dwItemQuality;
                var color = H52D_Framework.BaseDefine.LabelColor[nItemQuality];
                H52D_Framework.SetHtmlStyle(resName, 24, color, "center", true);
                resPrice.changeText(nItemPrice);
                nItemPriceType == 1 ? priceType.skin = "ui_icon/icon_prop_012.png" : priceType.skin = "ui_icon/icon_prop_013.png";
                resName.innerHTML = nItemName_1;
                var bbb = H52D_Framework.DiscountManager.Instance.getBoxTims(index + 1) < H52D_Framework.DiscountManager.Instance.nBoxMaxTims;
                //是否打折
                if (discountBg.visible && H52D_Framework.DiscountManager.Instance.getBoxTims(index + 1) < H52D_Framework.DiscountManager.Instance.nBoxMaxTims) {
                    var money = H52D_Framework.DiscountManager.Instance.tBoxMoney[index + 1];
                    var disNum = money / nItemPrice * 10;
                    discount.text = disNum.toFixed(1) + "折";
                    nItemPrice = money;
                    resName.innerHTML = nItemName_1 + "(" + H52D_Framework.DiscountManager.Instance.getBoxTims(index + 1) + "/" + H52D_Framework.DiscountManager.Instance.nBoxMaxTims + ")";
                    //活动倒计时
                    var time_1 = H52D_Framework.DiscountManager.Instance.tBoxSvot - H52D_Framework.Time.serverSecodes;
                    activityTime.text = H52D_Framework.GetFormatTime(time_1);
                    resPrice.changeText(nItemPrice);
                    H52D_Framework.Tick.Loop(1000, this, function () {
                        time_1 = H52D_Framework.DiscountManager.Instance.tBoxSvot - H52D_Framework.Time.serverSecodes;
                        if (time_1 <= 0 || H52D_Framework.DiscountManager.Instance.getBoxTims(index + 1) >= H52D_Framework.DiscountManager.Instance.nBoxMaxTims) {
                            _this.UpdateBoxList();
                            resName.innerHTML = nItemName_1;
                        }
                        else {
                            resName.innerHTML = nItemName_1 + "(" + H52D_Framework.DiscountManager.Instance.getBoxTims(index + 1) + "/" + H52D_Framework.DiscountManager.Instance.nBoxMaxTims + ")";
                        }
                        activityTime.text = H52D_Framework.GetFormatTime(time_1);
                    }, [], false);
                }
                else {
                    discountBg.visible = activityTime.visible = false;
                    resName.innerHTML = nItemName_1;
                }
                resIcon.skin = "ui_icon/" + Item_Info.strIconID_B;
                resIcon.width = 168;
                resIcon.height = 162;
                buyBtn.on(Laya.Event.CLICK, this, this.ClickBoxItem, [ShopDataEnum.eBoxShop, info.id, index, "宝箱详情", OpenType.eBox, nItemPrice]);
                this.SetIconScale(resIcon);
            }
        };
        ListShopView.prototype.UpdateActivityTime = function (text) {
        };
        ListShopView.prototype.PlayEffect = function (bool, btn) {
            var _this = this;
            if (this._moneyEffectBg) {
                this._moneyEffectBg.Destroy();
            }
            if (bool) {
                this._moneyEffectBg = new H52D_Framework.Avatar(btn);
                this._moneyEffectBg.Load("res/effect/effect_ui_shangcheng/effect_ui_shangcheng.sk", 1, 3.5, 110, 110, Laya.Handler.create(this, function () {
                    _this._moneyEffectBg.Play("effect_ui_shangcheng", true, true, function () {
                    });
                }));
            }
            else {
                if (this._moneyEffectBg) {
                    this._moneyEffectBg.Destroy();
                }
            }
        };
        /**
         * 设置商城list样式，道具
         * @param item 单个box
         * @param index 索引
        */
        ListShopView.prototype.SetProListRender = function (item, index) {
            var proBj = item.getChildByName('proBj');
            var proNum = item.getChildByName('proNum');
            var proName = item.getChildByName('proName');
            var proIcon = item.getChildByName('proIcon');
            var buyBtn = proIcon.getChildByName('buyBtn');
            var proPrice = item.getChildByName('proPrice');
            var proPriceType = item.getChildByName('proPriceType');
            var info = this._proList[index];
            //出售内容
            var sellContent = info.sellContent;
            //商品类型
            var nItemType = sellContent[H52D_Framework.BaseDefine.ItemSellContentType];
            var nItemID = sellContent[H52D_Framework.BaseDefine.ItemSellContentId];
            var nItemNum = sellContent[H52D_Framework.BaseDefine.ItemNumSellContent];
            var nItemPrice = info.Price[H52D_Framework.BaseDefine.ItemIdPrice];
            var nItemPriceType = info.Price[H52D_Framework.BaseDefine.ItemIdCurrency];
            if (nItemPriceType == 1) {
                proPriceType.skin = "ui_icon/icon_prop_012.png";
            }
            else {
                proPriceType.skin = "ui_icon/icon_prop_013.png";
            }
            if (nItemType == H52D_Framework.BaseDefine.ItemTypePro) {
                //道具信息
                var Item_Info = H52D_Framework.ItemConfig[nItemID];
                var nItemQuality = Item_Info.dwItemQuality;
                var nItemName = H52D_Framework.GetInfoAttr.Instance.GetText(Item_Info.dwItemName) ? H52D_Framework.GetInfoAttr.Instance.GetText(Item_Info.dwItemName) : "未匹配Name";
                if (Item_Info.dwItemTypes != H52D_Framework.BaseDefine.ItemSonTypeUesHero) {
                    buyBtn.on(Laya.Event.CLICK, this, this.ClickBoxItem, [ShopDataEnum.eProShop, info.id, index, "道具详情", OpenType.ePro, nItemPrice]);
                }
                else {
                    buyBtn.on(Laya.Event.CLICK, this, this.ClickBoxItem, [ShopDataEnum.eProShop, info.id, index, "英雄详情", OpenType.eHero, nItemPrice]);
                }
                this.SetIconScale(proIcon);
                proPrice.changeText(nItemPrice);
                proIcon.skin = "ui_icon/" + Item_Info.strIconID_B;
                proName.changeText(nItemName);
                proName.color = H52D_Framework.BaseDefine.LabelColor[nItemQuality];
                proNum.visible = nItemNum != 1;
                proNum.changeText("X" + nItemNum);
                proBj.skin = H52D_Framework.BaseDefine.QualityList[nItemQuality];
            }
            else if (nItemType == H52D_Framework.BaseDefine.ItemTypeEquip) {
            }
            else if (nItemType == H52D_Framework.BaseDefine.ItemTypeHero) {
            }
            else if (nItemType == H52D_Framework.BaseDefine.ItemTypePet) {
                var pet = new H52D_Framework.BPetVo(nItemID);
                buyBtn.on(Laya.Event.CLICK, this, this.ClickBoxItem, [ShopDataEnum.eProShop, info.id, index, "神兽详情", OpenType.ePet, nItemPrice]);
                proIcon.skin = "ui_icon/" + pet.strPetIcon;
                proName.changeText(pet.petName);
                proName.color = H52D_Framework.BaseDefine.PetColor_label[pet.petColor];
                proNum.visible = nItemNum != 1;
                proNum.changeText("X" + nItemNum);
                proBj.skin = H52D_Framework.BaseDefine.QualityList[pet.petColor];
            }
        };
        /**
         * 点击宝箱，打开宝箱tips
         * @param nType 商城类型
         * @param nID 商品ID
         */
        ListShopView.prototype.ClickBoxItem = function (nType, nID, index, name, openType, nprice) {
            var num = index + 1;
            var cfg = H52D_Framework.MarketConfig[nType][num];
            var price = nprice;
            var PriceType = cfg.Price[H52D_Framework.BaseDefine.ItemIdCurrency];
            var boxId = cfg.sellContent[H52D_Framework.BaseDefine.ItemSellContentId];
            var proNum = cfg.sellContent[H52D_Framework.BaseDefine.ItemNumSellContent];
            var proIcon;
            if (openType == OpenType.ePet) {
                proIcon = 0;
            }
            else {
                proIcon = H52D_Framework.ItemConfig[boxId].strIconID_B;
            }
            var tipName = name;
            H52D_Framework.UIManager.Instance.CreateUI("TipsTreasureView", [H52D_Framework.ViewToppestRoot, nType, boxId, price, PriceType, num, tipName, openType, proIcon, proNum]);
        };
        ListShopView.prototype.SetIconScale = function (icon) {
            icon.on(Laya.Event.MOUSE_MOVE, this, function () {
                icon.scale(1.07, 1.07);
            });
            icon.on(Laya.Event.MOUSE_OUT, this, function () {
                icon.scale(1, 1);
            });
            icon.on(Laya.Event.MOUSE_DOWN, this, function () {
                icon.scale(0.93, 0.93);
            });
            icon.on(Laya.Event.MOUSE_UP, this, function () {
                icon.scale(1, 1);
            });
        };
        /**
         * 跳转充值界面
         * @param goodsType 商品类型
         * @param goodsId 商品id
         * @param goodsDesc 商品描述
         */
        ListShopView.prototype.ToBuyGemInterface = function (goodsType, goodsId, goodsDesc) {
            H52D_Framework.BaiDuSDK.Instance.ToRecharge(goodsType, goodsId, goodsDesc);
        };
        /** 跳到钻石充值商城*/
        ListShopView.prototype.ToGemShop = function (Idx) {
            H52D_Framework.ShopLogic.Instance.nIdx = Idx;
            this.UpdateChargeList();
            this.shopPanel.vScrollBar.value = this.gemShop.y;
        };
        /** 跳到钻石充值商城*/
        ListShopView.prototype.ToLotteryShop = function () {
            // this.eff_lottery.visible = true;
            this.UpdateChargeList();
            this.shopPanel.vScrollBar.value = this.lotteryShop.y;
        };
        /**
         * 购买按钮
         * @param nType 商品类型
         * @param nId 商品ID
         */
        ListShopView.prototype.BuyItems = function (nType, nId, index) {
            var num = index + 1;
            H52D_Framework.ShopLogic.Instance.SendBuyMsg(nType, num, 1);
        };
        ListShopView.prototype.ClickLotteryBtn = function (lotteryEnum) {
            var _this = this;
            //播放点击音效
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            if (this._SendLotteryFlag == false) {
                return;
            }
            this._SendLotteryFlag = false;
            //发送抽奖请求
            H52D_Framework.ShopLogic.Instance.SendLotteryMsg(lotteryEnum);
            H52D_Framework.OneTimer(1000, function () {
                _this._SendLotteryFlag = true;
            }, "ClickLotteryBtn");
        };
        /** 点击提示规则
         * @param 提示类型
         */
        ListShopView.prototype.ClickHintRule = function (ruleEnum) {
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            switch (ruleEnum) {
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
        };
        /**打开抽奖查看信息界面 */
        ListShopView.prototype.OpenLotteryInfo = function () {
            var data_id = [];
            var reward_id;
            var reWrad_data = [];
            var front_id;
            var frist = true;
            for (var type in H52D_Framework.LotteryConfig) {
                var data_type = H52D_Framework.LotteryConfig[type];
                for (var info in data_type) {
                    var customNum = Number(data_type[info].customNum);
                    var customsOrder = H52D_Framework.MasterPlayer.Instance.player.CunstLevel;
                    if (frist) {
                        if (customNum >= customsOrder) {
                            frist = false;
                            front_id = data_type[info].id;
                            reWrad_data.push(H52D_Framework.RewardConfig[front_id].reWrad);
                            break;
                        }
                    }
                    var length_1 = H52D_Framework.GetTabLength(data_type);
                    if (customNum > customsOrder) {
                        if (frist) {
                            frist = false;
                            reward_id = data_type[info].id;
                            reWrad_data.push(H52D_Framework.RewardConfig[reward_id].reWrad);
                        }
                        else {
                            reWrad_data.push(H52D_Framework.RewardConfig[front_id].reWrad);
                        }
                        break;
                    }
                    if (customsOrder > customNum && length_1 == Number(info)) {
                        if (frist) {
                            frist = false;
                            reward_id = data_type[info].id;
                            reWrad_data.push(H52D_Framework.RewardConfig[reward_id].reWrad);
                        }
                        else {
                            reWrad_data.push(H52D_Framework.RewardConfig[front_id].reWrad);
                        }
                        break;
                    }
                    frist = false;
                    front_id = data_type[info].id;
                }
            }
            H52D_Framework.UIManager.Instance.CreateUI("ShopInfoView", [H52D_Framework.ViewUpRoot, "奖励预览", "抽奖有概率获得奖励如下：", reWrad_data]);
        };
        /**自定义商城的高度 */
        ListShopView.prototype.SetProShopH = function () {
            var proNum = this._proList.length;
            var boxNum = this._boxList.length;
            var boxH = 272;
            var wNum = 3;
            var proh = (Math.floor(proNum / wNum) + 1) * boxH;
            var boxh = (Math.floor(boxNum / wNum)) * boxH;
            this.boxShop.treList.height = boxh;
            this.boxShop.height = boxh + 60;
        };
        return ListShopView;
    }(ui.main.list.ListShopViewUI));
    H52D_Framework.ListShopView = ListShopView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ListShopView.js.map