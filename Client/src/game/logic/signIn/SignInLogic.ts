/**
* 签到逻辑 
*/
module H52D_Framework {
	export class SignInLogic {
		private static _inst: SignInLogic;
		public static get Instance() {
			if (SignInLogic._inst == null)
				SignInLogic._inst = new SignInLogic();
			return SignInLogic._inst;
		}
		/**今天第几天*/
		private _toDayNum: number = 1;
		// 控制七日登录 底部文本显示
		private _textBool: boolean = false
		/**今天签到了没*/
		private _toDayAlr: boolean = false;
		/**七日今天签到了没*/
		private _toDayAlrSeven: boolean = false;
		/**累计几天 七日*/
		private _toDayNumSeven: number = 0;
		// 广告专用记录领取次数
		private _todayNum: number = 0;
		private _alreadyArr = {}
		/** 记录领取记录 */
		private _weekReceive = 0;
		private _weekIndx = 0;
		/**输入天数 获取物品*/
		private _signData: { [dayNum: number]: any };
		/**记录QQ版本奖励领取次数  即将领取的天数*/
		private _dayTimes: number = 1;
		/**输入天数 获取7日物品*/
		private _sevenListData: {
			[index: number]: {		//天数Id
				itemType: number,	//itemType
				itemId: number,		//ItemId
				itemNum: number,	//itemNum
				btToDay: boolean,	//是否今天
				bAlready: boolean	//是否已签到
			}
		} = {};

		/**List数据*/
		private _listData: {
			[index: number]: {		//天数Id
				itemType: number,	//itemType
				itemId: number,		//ItemId
				itemNum: number,	//itemNum
				bOpt: boolean,		//是否选中
				btToDay: boolean,	//是否今天
				bOverdue: boolean,	//是否过期
				bAlready: boolean	//是否已签到
			}
		} = {};


		/**获取List数据*/
		public get ListData(): any {
			return this._listData;
		}

		/**获取SevenList数据*/
		public get SevenListData(): any {
			return this._sevenListData;
		}

		public get WeekIndx() {
			return this._weekIndx;
		}

		public set WeekIndx(value) {
			this._weekIndx = value;
		}

		public get WeekText() {
			return this._textBool;
		}
		public set WeekText(value) {
			this._textBool = value;
		}
		/**获取今天第几天*/
		public get ToDayNum(): number {
			return this._toDayNum;
		}

		/**获取今天第几天 七日*/
		public get ToDayNumSeven(): number {
			return this._toDayNumSeven;
		}

		/**记录领取登录奖励天数 */
		public get ReceiveTimes() {
			return this._dayTimes;
		}
		/**记录领取登录奖励天数 */
		public set ReceiveTimes(value) {
			this._dayTimes = value;
		}

		/**今天是否领取了七日*/
		public get toDayAlrSeven(): boolean {
			return this._toDayAlrSeven;
		}

		/**获取今天签到了没*/
		public get ToDayAlr(): boolean {
			return this._toDayAlr;
		}

		public Initialize() {
			//上线同步 每日签到
			RemoteCall.Instance.RegistJXS2CProtocol('C_SignInSystemInfo', this);
			//签到回调 每日签到
			RemoteCall.Instance.RegistJXS2CProtocol('C_ReqSignIn', this);
			//上线同步 七日签到
			RemoteCall.Instance.RegistJXS2CProtocol('C_UpdateSevenInfo', this);
			//签到回调 七日签到
			RemoteCall.Instance.RegistJXS2CProtocol('C_ReqSevenSignIn', this);
		}

		/** 是否显示主界面按钮 */
		public IsShowMainBtn(): boolean {
			if (window["wx"]) {
				return this._toDayNumSeven < 7
			} else {
				return this._toDayNumSeven <= 7
			}
		}

		/** 是否显示主界面按钮 */
		public IsBtnVisible(): boolean {
			return this._toDayNumSeven > 0 && !this._toDayAlrSeven
		}

		/**上线同步 每日签到 */
		private C_SignInSystemInfo(buf: any) {
			let toDay: number = Number(buf[0]);
			this._alreadyArr = buf[1];
			this.AddData(toDay, this._alreadyArr);
		}

		/**上线同步 七日签到 */
		private C_UpdateSevenInfo(buf: any) {
			let nSevenFlagDay = buf[0];
			let nSevenGetFlag = buf[1];
			this._toDayNumSeven = nSevenGetFlag;
			this._todayNum = nSevenGetFlag;
			this._toDayAlrSeven = nSevenGetFlag == 1;
			this._dayTimes = nSevenGetFlag + 1;
			this._weekReceive = this._toDayNumSeven
			this.SevenData();
			if (window["wx"]) {
				this._toDayAlrSeven = false;
			}
			Event.DispatchEvent("UpdateBtnList");
			   if (window["wx"]){
                if(AdvertisingManager.Instance.bnWXAdertisingTimes && SignInLogic.Instance.ReceiveTimes<=7){
					if( OpenCondition(E_OpenGrade.SEVEN,false,false)){
                    	UIManager.Instance.CreateUI("SevenSigninView",[ViewUpRoot]);
					}
                }
            }
		}

		/**签到回调 每日签到 */
		private C_ReqSignIn(buf: any) {
			let item_info = buf[1];
			TipsLogic.Instance.OpenGoodsProTips(item_info)
			this._listData[this._toDayNum].bAlready = true;
			this._toDayAlr = true;
			Event.DispatchEvent("UpDateList");
			Event.DispatchEvent("ConcealIcon");
			Event.DispatchEvent("ShowRedPoint", [E_OpenGrade.ROLE]);

		}

		/**签到回调 七日签到 */
		private C_ReqSevenSignIn(buf: any) {
			let item_info = buf[0];
			this._weekReceive = buf[1]
			if (this._weekReceive < 0) {
				this._weekReceive = 0;
			}
			this._toDayAlrSeven = true;
			TipsLogic.Instance.OpenGoodsProTips(item_info)
			Event.DispatchEvent("UpdateBtnList");
			this._dayTimes += 1;
			this._toDayNumSeven = this._weekReceive;			
			Event.DispatchEvent("changelabelText");
			this.SevenData();
			if (this._weekReceive>= 7 && UIManager.Instance.IsHave("SevenSigninView",ViewUpRoot)){
				UIManager.Instance.DestroyUI("SevenSigninView",[ViewUpRoot]);
			}
		}

		/** 判断 七日登陆奖励是否领取 */
		public WeekReceive(nIdx) {
			let _bool = this._weekReceive <= nIdx ? true : false;
			return _bool;
		}

		/**每日签到请求 */
		public SendReqSignIn(bool?: boolean) {
			RemoteCall.Instance.Send('K_ReqSignIn', bool);
		}

		/**七日签到请求 */
		public SendReqSevenSignIn(nIdx?: number) {
			RemoteCall.Instance.Send('K_ReqSevenSignIn', nIdx);
		}

		private AddData(toDay: number, alreadyArr: any) {
			this._toDayNum = toDay;

			this._signData = {};
			for (let dayId in SignConfig) {
				let rewardId = SignConfig[dayId].reward;
				let reWradData = RewardConfig[rewardId].reWrad;
				this._signData[Number(dayId)] = reWradData;
			}

			for (let dayId in this._signData) {
				let dayIdNum = Number(dayId);
				let data = this._signData[dayId][1];
				let isOpt: boolean;
				let isToDay: boolean;
				let isOverdue: boolean;
				let isAlready: boolean;
				let isAlr: number = Number(alreadyArr[dayId] ? alreadyArr[dayId] : 0);

				isAlr == 0 ? isAlready = false : isAlready = true;
				dayIdNum < toDay ? isOverdue = true : isOverdue = false;

				if (dayIdNum == toDay) {
					isToDay = true;
					isOpt = true;
				}
				else {
					isToDay = false;
					isOpt = false;
				}

				this.ListData[Number(dayId)] = {
					itemType: data[BaseDefine.ItemSellContentType],
					itemId: data[BaseDefine.ItemSellContentId],
					itemNum: data[BaseDefine.ItemNumSellContent],
					bOpt: isOpt,
					btToDay: isToDay,
					bOverdue: isOverdue,
					bAlready: isAlready
				}
			}
			if (this._toDayNum > 0) {
				this._toDayAlr = this.ListData[this._toDayNum].bAlready;
			};
		}

		public EmptyData() {
			this._alreadyArr[this._toDayNum] = this._toDayAlr == false ? 0 : 1
			this._toDayAlrSeven = this._toDayAlr = false;
			let toDayNum = this._toDayNum == 15 ? 1 : (this._toDayNum + 1)
			this.AddData(toDayNum, this._alreadyArr);
			Event.DispatchEvent("UpDateList");
			Event.DispatchEvent("UpDateSevenList");
		}

		private SevenData() {
			//七日
			for (let dayId in SevenConfig) {
				let rewardId = SevenConfig[dayId].reward;
				let reward = RewardConfig[rewardId].reWrad;

				let toDay: boolean = this._toDayNumSeven == Number(dayId);
				let already: boolean = this._toDayNumSeven > Number(dayId);
				this.SevenListData[Number(dayId)] = {
					itemType: reward[1][BaseDefine.ItemSellContentType],
					itemId: reward[1][BaseDefine.ItemSellContentId],
					itemNum: reward[1][BaseDefine.ItemNumSellContent],
					btToDay: toDay,
					bAlready: already,
				}
				if (this._toDayNumSeven > 0) {
					let id = Number(dayId);
					this.SevenListData[id].bAlready = this._toDayNumSeven >= Number(dayId);

					//this.SevenListData[this._toDayNumSeven].bAlready = this._toDayAlrSeven;
				}
			}


			Event.DispatchEvent("UpDateSevenList");
		}
	}
}