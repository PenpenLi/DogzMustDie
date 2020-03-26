/**
* 打折管理器
*/
module H52D_Framework {
	export class DiscountManager {

		private static _init: DiscountManager;
		public static get Instance(): DiscountManager {
			if (DiscountManager._init == null) {
				DiscountManager._init = new DiscountManager();
			}
			return DiscountManager._init
		}

		private _actionDate: any;
		public _bStartLottery: boolean;
		public _bStartPrivilege: boolean;
		public _bStartBox: boolean;

		//活动购买价格
		public tPrivilegeMoney: any = {};
		public tBoxMoney: any = {};
		public tLotteryMoney: any = {};

		//活动购买最大次数
		public nPrivilegeMaxTims: number = 0;
		public nBoxMaxTims: number = 0;
		public nLotteryMaxTims;
		//活动已购买次数
		public tPrivilegeTims: any = {}
		public tBoxTims: any = {}

		public getPrivilegeTims(id) {
			return this.tPrivilegeTims[id] || 0
		}
		public getBoxTims(id) {
			return this.tBoxTims[id] || 0
		}

		// public addPrivilegeTims(id) {
		// 	if (!this.tPrivilegeTims[id]) {
		// 		this.tPrivilegeTims[id] = 0
		// 	}
		// 	this.tPrivilegeTims[id]++
		// }
		// public addBoxTims(id) {
		// 	if (!this.tBoxTims[id]) {
		// 		this.tBoxTims[id] = 0
		// 	}
		// 	this.tBoxTims[id]++
		// }
		//活动结束时间
		public tPrivilegeSvot: number = 0;
		public tBoxSvot: number = 0;

		constructor() {
			RemoteCall.Instance.RegistJXS2CProtocol("C_UpdatePrivilegeDiscount", this);
			RemoteCall.Instance.RegistJXS2CProtocol("C_UpdateBoxDiscount", this);

			this._bStartLottery = false;
			this._bStartPrivilege = false;
			this._bStartBox = false;

		}

		private C_UpdatePrivilegeDiscount(buf) {
			let nPrivilege = buf[0];
			let nPrivilegeDiscount = buf[1];
			this.tPrivilegeTims[nPrivilege] = nPrivilegeDiscount;
		}

		private C_UpdateBoxDiscount(buf) {
			let nID = buf[0];
			let nBoxDiscount = buf[1];
			this.tBoxTims[nID] = nBoxDiscount;
		}
		// 活动开启
		public Start(cls: OActivityData) {
			this.ActionData = cls.data;
			let type = cls.type;
			if (type == OActivityEnum.eLotteryDiscount) {
				this._bStartLottery = true;
				this.tLotteryMoney = this.ActionData.award[1].money;
				this.nLotteryMaxTims = this.ActionData.award[1].value;
				Event.DispatchEvent("ShowRedPoint", [E_OpenGrade.SHOP]);
			}
			else if (type == OActivityEnum.ePrivilegeDiscount) {
				this._bStartPrivilege = true;
				this.tPrivilegeMoney = this.ActionData.award[1].money;
				this.nPrivilegeMaxTims = this.ActionData.award[1].value;
				this.tPrivilegeSvot = cls.svot;
			}
			else if (type == OActivityEnum.eBoxDiscount) {
				this._bStartBox = true;
				this.tBoxMoney = this.ActionData.award[1].money;
				this.nBoxMaxTims = this.ActionData.award[1].value;
				this.tBoxSvot = cls.svot;
			}
		}

		//活动结束
		public OnDestroy(_type: any) {
			Event.DispatchEvent("CloseOActivityView", _type);
			//打折类型
			if (_type == OActivityEnum.eLotteryDiscount) {
				this._bStartLottery = false;
			}
			else if (_type == OActivityEnum.ePrivilegeDiscount) {
				this._bStartPrivilege = false;
				MainRoleLogic.Instance.SetPrivList()
				Event.DispatchEvent('privListTime');
			}
			else if (_type == OActivityEnum.eBoxDiscount) {
				this._bStartBox = false;
				Event.DispatchEvent("UpdateBoxList");
			}
			Event.DispatchEvent("ShowRedPoint", [E_OpenGrade.SHOP]);
		}

		/**当前的数据信息 */
		public get ActionData() {
			return this._actionDate;
		}

		public set ActionData(view: any) {
			this._actionDate = view;
		}

		public get LotteryMoney() {
			if (this._actionDate == null) return;
			return this.tLotteryMoney;
		}

		public get DiscountDay() {
			if (this._actionDate == null) return;
			return this.nLotteryMaxTims;
		}

		/**是否开启了十连抽打折 */
		public IsStartLotteryAction(): boolean {
			if (this.DiscountDay == null || !this._bStartLottery) {
				return false;
			}
			let day = Time.serverTime.getDay();
			let b = false;
			let daySer = this.DiscountDay.split("#");
			for (let key in daySer) {
				b = daySer[key] == String(day);
				if (b) break;
			}
			return (MasterPlayer.Instance.GetEventDayProByType(EventProEnum.LotteryNum) == null || MasterPlayer.Instance.GetEventDayProByType(EventProEnum.LotteryNum) == 0) && b;
		}

		/**是否开启了特权打折 */
		public IsStartPrivilegeAction(): boolean {
			if (this.DiscountDay == null || !this._bStartPrivilege) {
				return false;
			}

			return this._bStartPrivilege;
		}

		/**是否开启了宝箱打折 */
		public IsStartBoxAction(): boolean {
			if (this.DiscountDay == null || !this._bStartBox) {
				return false;
			}
			return this._bStartBox;
		}

		/**是否显示红点 宝箱 */
		public IsShowShopPint(): boolean {
			let b: boolean;
			let boxCfg = MarketConfig[2];
			for (let id in boxCfg) {
				if (this.getBoxTims(id) < this.nBoxMaxTims) {
					b = true;
				}
			}
			return this.IsStartBoxAction() && b && this.IsStartLotteryAction();
		}

		/**是否显示红点 特权 */
		public IsShowRolePint(): boolean {
			let b: boolean;
			let cfg = PrivilegeConfig;
			for (let id in cfg) {
				if (this.getPrivilegeTims(id) < this.nPrivilegeMaxTims) {
					b = true;
				}
			}
			return this.IsStartPrivilegeAction() && b;
		}
	}
}