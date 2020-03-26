/**
* 运营活动逻辑类;
*/

//活动入口位置
enum OActivityPosEnum {
	eOActivityPos0 = 0,
	eOActivityPos1 = 1, 		//活动
}

// 活动入口名称
let OActivityPosName = {
	1: "活动",
}

//活动入口图标
let OActivityPosIcon = {
	1: "btn-zhujiemian-huodong.png",
}

// 功能类型
enum OActivityEnum {
	eEverydayMoney = 1,			//每日累充 
	eDiamondView = 2,			//每日累消
	eLotteryDiscount = 3,		//十连抽打折
	ePrivilegeDiscount = 4,		//特权打折
	eBoxDiscount = 5,			//宝箱打折
	eChangeitem = 6,            //物品兑换
	eDrop = 7,            		//物品兑换
	eEveryDayTurn = 8,          //每日转盘
}

// 功能类型对应的View名
let OActivityViewName = {
	1: "EverydayMoneyView",		//每日累充 
	2: "DiamondView",			//每日累消
	3: "",						//十连抽打折
	4: "",						//特权打折
	5: "",						//宝箱打折
	6: "ChangeGoodsView",   	//物品兑换
	7: "",						//掉落物品
	8: 'EveryDayTurntableView'	//每日转盘
}

module H52D_Framework {
	export class OActivityLogic {
		private static _inst: OActivityLogic;
		public static get Instance() { //单例模式
			if (OActivityLogic._inst == null)
				OActivityLogic._inst = new OActivityLogic();
			return OActivityLogic._inst;
		}

		/**活动逻辑类对象集合 */
		private OActivityFun: Object = {};
		private OActivityRed: Object = {};

		/**注册类对象*/
		private RegisterClass() {
			this.OActivityFun[OActivityEnum.eEverydayMoney] = mEverydayManager;
			this.OActivityFun[OActivityEnum.eDiamondView] = DEverydayManager;
			this.OActivityFun[OActivityEnum.eLotteryDiscount] = DiscountManager;
			this.OActivityFun[OActivityEnum.ePrivilegeDiscount] = DiscountManager;
			this.OActivityFun[OActivityEnum.eBoxDiscount] = DiscountManager;
			this.OActivityFun[OActivityEnum.eChangeitem] = ChangeGoodsManager;
			this.OActivityFun[OActivityEnum.eDrop] = DiscountManager;
			this.OActivityFun[OActivityEnum.eEveryDayTurn] = EveryDayTurntable;
		}

		private RegisterRedPoint() {
			this.OActivityRed[OActivityEnum.eEverydayMoney] = this.EverydayManager;
			this.OActivityRed[OActivityEnum.eDiamondView] = this.DEverydayManager;
			// this.OActivityRed[OActivityEnum.eLotteryDiscount] = DiscountManager.Instance.IsShowRolePint;
			// this.OActivityRed[OActivityEnum.ePrivilegeDiscount] = DiscountManager.Instance.IsShowRolePint;
			// this.OActivityRed[OActivityEnum.eBoxDiscount] = DiscountManager.Instance.IsShowRolePint;
			// this.OActivityRed[OActivityEnum.eChangeitem] = ChangeGoodsManager.Instance.red_contr;
			// this.OActivityRed[OActivityEnum.eDrop] = DiscountManager.Instance.IsShowRolePint;
			this.OActivityRed[OActivityEnum.eEveryDayTurn] = this.EveryDayTurn;
		}

		/**初始化所有活动 */
		public Initialize() {
			//注册类对象
			this.RegisterClass();
			this.RegisterRedPoint();
			//调用所有类对象
			for (let i in this.OActivityFun) {
				this.OActivityFun[i].Instance;
			}
			//每5秒更新一次活动状态
			Tick.Loop(5000, this, this.UpdateOActivityOpen);
			Tick.Loop(1000, this, this.UpdateOActivityCloseTime);
			//同步所有活动的信息
			RemoteCall.Instance.RegistJXS2CProtocol("C_AllActivitys", this);
			RemoteCall.Instance.RegistJXS2CProtocol("C_AllActivitysEnd", this);

		}

		/**同步所有活动的信息 */ 
		private C_AllActivitys(data: any) {
			if (this._msgLoaded) {
				this._openList = {};
				this._unOpenList = {};
			}
			this._msgLoaded = false;
			this.SaveOActivitysData(data[0]);
		}

		/**同步所有活动信息结束 */
		private C_AllActivitysEnd() {
			this._msgLoaded = true;
			Event.DispatchEvent("UpdateOActivitysEntrance");
			Event.DispatchEvent("CloseOActivityView");
		}

		//添加活动
		private Start(type: OActivityEnum, data: OActivityData) {
			if (type && this.OActivityFun[type]) {
				this.OActivityFun[type].Instance.Start(data);
			}
		}

		//移除活动
		private OnDestroy(type: OActivityEnum) {
			if (type && this.OActivityFun[type]) {
				this.OActivityFun[type].Instance.OnDestroy(type);
				Event.DispatchEvent("OActivityOnDestroy", [type]);
			}
		}

		//更新活动状态
		private UpdateOActivityOpen() {
			let curTime = Date.now() / 1000;
			let b_des: boolean = false;
			//删除已结束的活动
			for (let i in this._openList) {
				let data = this._openList[i];
				for (let j = data.length - 1; j >= 0; j--) {
					let cls = data[j];
					if (curTime >= cls.clot) {
						//此活动已结束
						delete this._openData[cls.type];
						if (data[j] && data[j].type == cls.type)
							data.splice(j, 1);
						this.OnDestroy(cls.type);
						b_des = true;
					}
				}
			}

			for (let i in this._openList) {
				if (this._openList[i].length == 0) {
					delete this._openList[i];
				}
			}

			//增加已开启的活动
			for (let i in this._unOpenList) {
				let data = this._unOpenList[i];
				for (let j = data.length - 1; j >= 0; j--) {
					let cls = data[j];
					if (curTime >= cls.clst && curTime < cls.clot && MasterPlayer.Instance.player.Level >= cls.limitLevel) {
						//此活动已开启
						if (!this._openList[cls.pos]) {
							this._openList[cls.pos] = [];
						}
						this._openList[cls.pos].push(cls);
						this._openList[cls.pos].sort((o1, o2) => o1.order - o2.order);
						this._openData[cls.type] = cls;
						this.Start(cls.type, cls);
						data.splice(j, 1);
						b_des = true;
					}
				}
			}

			for (let i in this._unOpenList) {
				if (this._unOpenList[i].length == 0) {
					delete this._unOpenList[i];
				}
			}

			if (b_des) {
				//Event.DispatchEvent("UpdateBtnList_activebg");
			}

			//在此更新活动红点/提醒特效
			this.SetRedPoint();
		}

		/**更新活动剩余时间 */
		private UpdateOActivityCloseTime() {
			let curTime = Date.now() / 1000;
			for (let i in this._openList) {
				let data = this._openList[i];
				for (let j = data.length - 1; j >= 0; j--) {
					let cls = data[j];
					let svot = cls.svot;
					let lastTime = svot - curTime;
					cls.svotString = GetActivityLastTime(lastTime);
				}
			}
			//更新运营剩余时间通知
			Event.DispatchEvent('UpdateOActivityCloseTime');
		}

		/**缓存当前开启的运营活动数据 */
		private _openData: { [type: number]: OActivityData } = {};
		public GetActivityDataByType(type: number) {
			return this._openData[type];
		}

		/**同步状态 */
		private _msgLoaded: boolean = false;
		public get msgLoaded(): boolean {
			return this._msgLoaded;
		}

		/**储存当前开启的活动数据 */
		private _openList: { [pos: number]: Array<OActivityData> } = {}
		public get openList(): { [pos: number]: Array<OActivityData> } {
			return this._openList;
		}

		/**储存当前未开启的活动数据 */
		private _unOpenList: { [index: number]: Array<OActivityData> } = {}
		public get unOpenList(): { [index: number]: Array<OActivityData> } {
			return this._unOpenList;
		}

		/**保存活动数据 */
		private SaveOActivitysData(data: any) {
			let cls = new OActivityData(data);

			// if (cls.pos <= 0) {
			// 	this.Start(cls.type, cls);
			// 	return;
			// }

			// 屏蔽部分功能
			if (IsShieldRecharge()) {
				if (cls.type == OActivityEnum.eEverydayMoney) {
					return
				}
			}

			//当前时间戳(秒)
			let curTime = Date.now() / 1000;
			if (curTime >= cls.clst && curTime < cls.clot && MasterPlayer.Instance.player.Level >= cls.limitLevel) {
				//活动开启
				if (!this._openList[cls.pos]) {
					this._openList[cls.pos] = [];
				}
				this._openList[cls.pos].push(cls);
				this._openList[cls.pos].sort((o1, o2) => o1.order - o2.order);
				//存已开启活动的所有数据
				this._openData[cls.type] = cls;
				this.Start(cls.type, cls);
			}
			else {
				//活动未开启
				if (!this._unOpenList[cls.pos]) {
					this._unOpenList[cls.pos] = [];
				}
				this._unOpenList[cls.pos].push(cls);
			}
		}
		/** 请求领取奖励 */
		public K_GetActivityAwardReq(i_sActionID: number, i_nIndex?: number, i_nNum?: number) {
			RemoteCall.Instance.Send('K_GetActivityAwardReq', i_sActionID, i_nIndex, i_nNum);
		}

		//=========================红点======================
		//每日消耗
		private EverydayManager(type:any){
			return mEverydayManager.Instance.red_contr();
		}
		//消耗
		private DEverydayManager(type:any){
			return DEverydayManager.Instance.red_contr();
		}

		//每日转盘
		private EveryDayTurn(type:any)
		{
			return EveryDayTurntable.Instance.red_contr();
		}

		//private redpoint: boolean;
		public get RedPoint() {
			return this.SetRedPoint();
		}

		private SetRedPoint() {
			for(let i in this._openList){
				let _activity = this._openList[i];
				for (let j in _activity) {
					let _type = _activity[j].type;
					if(!this.OActivityRed[_type]){
						continue;
					}
					let fun = this.OActivityRed[_type];
					if(fun(_type)){
						return true;
					}
				}
			}
			return false;
		}

	}

	/** 活动数据*/
	export class OActivityData {
		constructor(data: any) {
			this._type = data['type'];
			this._pos = data['pos'];
			this._order = data['order'];
			this._tabName = data['name'];
			this._desc = data['desc'];
			this._icon = data['icon'];
			this._limitLevel = data['level'];
			this._svot = data['svot'];
			this._svst = data['svst'];
			this._clot = data['clot'];
			this._clst = data['clst'];
			let lastTime: number = this._svot - Date.now() / 1000;
			this._svotString = GetActivityLastTime(lastTime);
			this._data = data;
		}

		/**活动类型 */
		private _type: OActivityEnum;
		public get type() {
			return this._type;
		}

		/**活动入口 */
		private _pos: OActivityPosEnum;
		public get pos() {
			return this._pos;
		}

		/**活动排序 */
		private _order: number;
		public get order() {
			return this._order;
		}

		/**活动名称 */
		private _tabName: string;
		public get tabName() {
			return this._tabName;
		}

		/**活动描述 */
		private _desc: string;
		public get desc() {
			return this._desc;
		}

		/**活动图标路径 */
		private _icon: string;
		public get icon() {
			return this._icon;
		}

		/**开启等级限制 */
		private _limitLevel: number;
		public get limitLevel() {
			return this._limitLevel;
		}

		/**开启时间(秒) */
		private _svst: any;
		public get svst() {
			return this._svst;
		}

		/**结束时间(秒) */
		private _svot: any;
		public get svot() {
			return this._svot;
		}

		/**结束时间(string) */
		private _svotString: any;
		public get svotString() {
			return this._svotString;
		}
		public set svotString(buf: any) {
			this._svotString = buf;
		}

		/**活动图标开始显示时间(秒) */
		private _clst: any;
		public get clst() {
			return this._clst;
		}

		/**活动图标结束显示时间(秒) */
		private _clot: any;
		public get clot() {
			return this._clot;
		}

		/**所有其他数据 */
		private _data: any;
		public get data() {
			return this._data;
		}
	}
}