/**
* 商城系统数据类; 
*/

//商城数据类型
enum ShopDataEnum {
	eEmpty = 0,
	eProShop = 1,		//道具商城
	eBoxShop = 2,		//宝箱商城
	ePetShop = 3		//宝箱商城
}

//钻石充值数据类型
enum ChargeDataEnum {
	eCharge = 1, 		//充值
	eVIP,				//特权卡
	eFristCharge		//首充
}
//抽奖数据类型
enum LotteryDataEnum {
	eOne = 1, 			//单抽
	eTen,				//十连抽
}

enum ErrorCode {
	Succeed = 1, 		//操作成功
	CostUnEnough = 2 	//消耗不足
}

enum ChargeType {
	eGem = 1, 		//购买钻石
	eOneBag = 3, 	//购买一元礼包
	eVip = 4, 		//购买VIP
	eHeroBag = 5 	//购买英雄礼包
}
module H52D_Framework {
	export class ShopLogic {
		private static _inst: ShopLogic;
		public tChargeTimes = {}
		public static get Instance() {
			if (ShopLogic._inst == null)
				ShopLogic._inst = new ShopLogic();
			return ShopLogic._inst;
		}
		constructor() {
			//初始化数据
			this._isFirst = false;
			this._shopData[ShopDataEnum.eBoxShop] = [];
			this._chargeData[ShopDataEnum.eBoxShop] = {};
			this._lotteryData[ShopDataEnum.eBoxShop] = [];
			this.SortData(MarketConfig, this._shopData);
			this.SortGemData(ChargeConfig, this._chargeData);
			this.SortData(LotteryConfig, this._lotteryData);
			this.setmoneydata();
		}

		/**是否首冲过 */
		private _isFirst: boolean;
		public get isFirst() {
			return this._isFirst;
		}
		/**是否有促销 */
		private _isPromotion: boolean;
		public get isPromotion() {
			return this._isPromotion;
		}

		/**是否打开vip */
		public bOpenVipView: boolean = false;


		private eff_bool: boolean;

		private n_Idx: number;

		private n_freeDrawTimes:number = 0; // 看广告免费抽奖次数
		private n_adCoolTime :number = 0; //广告冷却时间
		/**商品id */
		public get nIdx() {
			return this.n_Idx;
		}

		public get FreedrawTimes(){
			return  this.n_freeDrawTimes;
		}

		public set FreedrawTimes(value){
			this.n_freeDrawTimes = value;
		}

		/** 观看完广告的时间戳  */
		public get AdCoolTime(){
			return  this.n_adCoolTime;
		}

		public set AdCoolTime(value){
			this.n_adCoolTime = value;
		}

		public set nIdx(value) {
			this.n_Idx = value;
		}

		public get EffShow() {
			return this.eff_bool;
		}

		public set EffShow(value) {
			this.eff_bool = value;
		}

		/** 商城数据*/
		private _shopData: { [index: number]: Object[] } = {};
		/** 充值数据*/
		private _chargeData: { [index: number]: any } = {};
		/** 抽奖数据*/
		private _lotteryData: { [index: number]: Object[] } = {};
		/**获取商城数据*/
		public get ShopData(): { [index: number]: Object[] } {
			return this._shopData;
		}

		private _moneyback: { [nmoney: number]: number } = {};
		private money_arr: Array<any> = [];

		/** 限购次数 */
		public BuyTimes = {}

		public setmoneydata() {
			for (let key in ChargeReturnConfig) {
				let nIdx = Number(key);
				this.money_arr.push(nIdx);
			}
		}

		public get MonenArr() {
			return this.money_arr;
		}


		public Eff_show() {
			let arr = [];
			let c_cfg = ChargeConfig[1];
			for (let key in c_cfg) {
				for (let nIdx in ChargeReturnConfig) {
					let shopInfo = c_cfg[key];
					if (shopInfo.Money == nIdx) {
						arr.push(Number(key))
					}
				}
			}
			return arr;
		}

		public Contr_redshow() {
			let a = 0;
			for (let key in this._moneyback) {
				if (!this._moneyback[key]) return false;
				if (this._moneyback[key] == 1) {
					a++;
				}
			}
			if (a < 3) {
				return false;
			}
			else {
				return true;
			}
		}

		/**获取充值数据*/
		public get ChargeData(): { [index: number]: any } {
			return this._chargeData;
		}

		public get MoneyBack() {
			return this._moneyback;
		}

		public set MoneyBack(value) {
			this._moneyback = value;
		}

		/**获取抽奖数据*/
		public get LotteryData(): { [index: number]: Object[] } {
			return this._lotteryData;
		}

		/**获取钻石*/
		public get gemNum(): number {
			return BagManager.Instance.getItemNumber(2);
		}

		/**获取金币*/
		public get goldNum(): number {
			return BagManager.Instance.getItemNumber(1);
		}

		/**获取待抽券*/
		public get ticketNum(): number {
			return BagManager.Instance.getItemNumber(2301);
		}

		/** 获取购买次数 */
		public GetBuyTimes(type, Id) {
			if (this.BuyTimes[type] == null) {
				return 0
			}
			return this.BuyTimes[type][Id] || 0
		}

		/** 初始化*/
		public Initialize(): void {
			//购买回调通知
			RemoteCall.Instance.RegistJXS2CProtocol('C_MarketBuyRes', this);
			//抽奖回调通知
			RemoteCall.Instance.RegistJXS2CProtocol('C_ReqLottery', this);
			//充值信息
			RemoteCall.Instance.RegistJXS2CProtocol('C_ChargeTime', this);
			//vip购买成功
			RemoteCall.Instance.RegistJXS2CProtocol('C_Charge', this);

			RemoteCall.Instance.RegistJXS2CProtocol("C_ReqChargeFeedback", this);

			/**sdk 付费回调 */
			RemoteCall.Instance.RegistJXS2CProtocol("C_OnCharge", this);


			this.eff_bool = true;
		}

		/**购买通知 */
		private C_MarketBuyRes(buf: any): void {
			let nErrorCode: ErrorCode = buf[0];
			let type = buf[1];
			let Id = buf[2];
			let raw = buf[3];
			if (nErrorCode == ErrorCode.Succeed) {
				let bIsHasRes = false
				for (let i in raw) {
					bIsHasRes = true
					break
				}
				if (bIsHasRes) {
					TipsLogic.Instance.OpenGoodsProTips(raw)
				}
				Event.DispatchEvent("BuySucceed");
			} else {
				TipsLogic.Instance.OpenMessageBox("钻石不足！");
				Event.DispatchEvent("toGemShop");
			}
			if (this.BuyTimes[type] == null) {
				this.BuyTimes[type] = {}
			}
			if (this.BuyTimes[type][Id] == null) {
				this.BuyTimes[type][Id] = 1
			} else {
				this.BuyTimes[type][Id] += 1
			}

			// if (type == 2) {
			// 	if (DiscountManager.Instance.IsStartBoxAction &&
			// 		DiscountManager.Instance.getBoxTims(Id) < DiscountManager.Instance.nBoxMaxTims) {
			// 		DiscountManager.Instance.addBoxTims(Id);
			// 	}
			// }
			if (type == 3) {
				WroldBossLogic.Instance.ReqBuyBuff(type, Id);
			}
			Event.DispatchEvent("update_heropeck");
		}

		/**付费 sdk callback */
		private C_OnCharge(buf) {
			let goodsType = buf[0];
			let goodsId = buf[1];
			let tAllGift = buf[2];

			//充值不同类型回调处理
			switch (goodsType) {
				case ChargeType.eGem:
					TipsLogic.Instance.OpenGoodsProTips(tAllGift)
					break;
				case ChargeType.eOneBag:

					break;
				case ChargeType.eVip:
					TipsLogic.Instance.OpenGoodsProTips(tAllGift)
					break;
				case ChargeType.eHeroBag:
					let nId = 0;
					TipsLogic.Instance.OpenGoodsProTips(tAllGift)
					Event.DispatchEvent("update_heropeck");
					for (let key in tAllGift[1]) {
						nId = Number(key);
					}
					//Array<{[type:number]:number}>=[{}];
					HeroManager.Instance.PeckRecord[nId] = {}
					HeroManager.Instance.PeckRecord[nId][goodsType] = 1;
					break;
			}
		}

		private C_ReqLottery(buf: any): void {
			this._SendLotteryFlag = true
			let nErrorCode: ErrorCode = buf[0];
			let type = buf[1];
			let item_info = buf[2];
			if(window["wx"]){
				ShopLogic.Instance.FreedrawTimes=buf[3];
				ShopLogic.Instance.AdCoolTime = buf[4];
                Event.DispatchEvent("Drawbegin");
			}
			if (nErrorCode == ErrorCode.Succeed) {
				TipsLogic.Instance.OpenGoodsProTips(item_info, type == 2)
				Event.DispatchEvent("BuySucceed");
			} else {
				TipsLogic.Instance.OpenMessageBox("钻石不足！");
				Event.DispatchEvent("toGemShop");
			}
			Event.DispatchEvent("ShowRedPoint", [E_OpenGrade.SHOP]);
			
		}


		/**付费 回调 */
		private C_ChargeTime(buf: any) {
			ShopLogic.Instance.tChargeTimes = buf[0];
			Event.DispatchEvent("UpdateBtnList");
			BagManager.Instance.IsShow = true;
			Event.DispatchEvent("UpdateChargeList");
			Event.DispatchEvent("CloseEffect", [false]);
			Tick.Once(1000, this, () => {
				Event.DispatchEvent("UpdateLotteryShop");
			})
			Event.DispatchEvent("updataview_twoyuan");
		}

		private C_Charge(buf: any) {
			let goodsType = buf[0];
			let goodsId = buf[1];
			Event.DispatchEvent("UpdateVipInfo");
		}
		/** 加载数据*/
		private SortData(cfg: any, shopData: { [index: number]: Object[] }): void {
			for (let shop_Info in cfg) {
				shopData[shop_Info] = [];
				let data = cfg[shop_Info];
				for (let com_info in data) {
					let info = data[com_info];
					shopData[shop_Info].push(info);
				}
			}
		}

		/** 加载数据*/
		private SortGemData(cfg: any, shopData: { [index: number]: any }): void {
			for (let shop_Info in cfg) {
				shopData[shop_Info] = {};
				let data = cfg[shop_Info];
				for (let com_info in data) {
					let info = data[com_info];
					shopData[shop_Info][com_info] = info;

				}
			}
		}


		/***领取奖励 */
		private C_ReqChargeFeedback(buf) {
			let data = buf[0];
			let item = buf[1];
			TipsLogic.Instance.OpenGoodsProTips(item)
			this._moneyback[data] = 1;
			Event.DispatchEvent("UpdateView_moneyback");

		}

		/** 发送购买消息
         * @param i_ntype   商品类型
         * @param i_nID     物品Id
         * @param i_nNum    购买数量
         */
		public SendBuyMsg(i_ntype: number, i_nID: number, i_nNum: number, bAdvertising?: boolean) {
			RemoteCall.Instance.Send('K_MarketBuyReq', i_ntype, i_nID, i_nNum, bAdvertising);
		}

		private _SendLotteryFlag = true
		/** 发送抽奖请求
         * @param i_ntype   抽奖类型
         */
		public SendLotteryMsg(i_ntype: number) {
			if (this._SendLotteryFlag == false) {
				return
			}
			this._SendLotteryFlag = false
			RemoteCall.Instance.Send('K_ReqLottery', i_ntype);
			OneTimer(1000, () => {
				this._SendLotteryFlag = true
			}, "SendLotteryMsg")
		}

		/**是否是第一次充值该商品 */
		public isFristCharge(i_nType, i_nID: number): boolean {
			if (ShopLogic.Instance.tChargeTimes[i_nType] == null) {
				return true
			} else if (ShopLogic.Instance.tChargeTimes[i_nType][i_nID] == null) {
				return true
			}
			return ShopLogic.Instance.tChargeTimes[i_nType][i_nID] == 0
		}


		/**发送请求领取对应档位的奖励 */
		public K_ReqChargeFeedback(nMoney: number) {
			RemoteCall.Instance.Send('K_ReqChargeFeedback', nMoney);
		}

		/**
		  * 转换奖励tip格式
		  * @param item {1:类型,2:道具id,3:数量}
		  */
		public ConvertAwardFormat(item: any): any {
			let award: any = {};
			for (let key in item) {
				let a1 = item[key][1];
				let a2 = item[key][2];
				let a3 = item[key][3];
				award[a1] = { [a2]: a3 };
			}
			return award;
		}




	}
}