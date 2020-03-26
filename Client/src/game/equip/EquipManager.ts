/**
* 时空法器管理器 
*/
module H52D_Framework {
	export class EquipManager {
		private static _init: EquipManager;
		public static get Instance(): EquipManager {
			if (EquipManager._init == null) {
				EquipManager._init = new EquipManager();
			}
			return EquipManager._init;
		}
		/**是否溢出 */
		private _IsOverflow: boolean = false;
		/**已拥有武器信息 */
		private _ownEquipList: { [instId: number]: EquipVo } = {};
		/**已拥有武器库容器 */
		private _equipInstIdList: { [EquipType: number]: PackModule } = {};
		/**武器所属装备组ID映射表 */
		private _equipGroupList: { [equipGroup: number]: PackModule } = {};
		/**当前佩戴的武器 */
		private _currentEquipList: { [EquipType: number]: number } = {};
		/**当前佩戴的武器属性生效 */
		private _currentAttrributeList: { [EquipType: number]: Array<ModfiyAttribute> } = {};
		public get CurrentAttrributeList() { return this._currentAttrributeList; }
		/**当前套装属性生效列表 */
		private _suitAttrributeList: { [suitId: number]: Array<ModfiyAttribute> } = {};
		public get SuitAttrributeList() { return this._suitAttrributeList; }
		/**套装激活 */
		private _suitActivateList: { [suitId: number]: { [groupId: number]: boolean } } = {};
		/**套装配置type映射表 */
		private _suitCfgList: { [EquipType: number]: Array<number> } = {};
		/**套装id、等级映射表*/
		private _suitMakeList: { [suitId: number]: { [equipLevel: number]: number } } = {};


		private equip_onlyone: boolean = true;
		constructor() {
			this.Init();

			/**初始化套装列表 */
			for (let suitId in SuitConfig) {
				let suit = SuitConfig[suitId];
				let suitColor = suit.suitColor;
				if (this._suitCfgList[suitColor] == null) {
					this._suitCfgList[suitColor] = [];
				}
				this._suitCfgList[suitColor].push(Number(suitId));
			}
		}

		public Initialize() {
			RemoteCall.Instance.RegistJXS2CProtocol("C_AddEquip", this);
			RemoteCall.Instance.RegistJXS2CProtocol("C_DelEquip", this);
			RemoteCall.Instance.RegistJXS2CProtocol("C_ReqUseEquip", this);
			RemoteCall.Instance.RegistJXS2CProtocol("C_ReqLockEquip", this);
			RemoteCall.Instance.RegistJXS2CProtocol("C_ReqSellEquip", this);
			RemoteCall.Instance.RegistJXS2CProtocol("C_SendEquipInfo", this);
			RemoteCall.Instance.RegistJXS2CProtocol("C_ReqCompoundEquip", this);
		}

		private Init() {
			/**初始化已拥有武器信息 */
			this._ownEquipList = {};

			/**初始化武器库容器 */
			this._equipInstIdList = {
				/** 手套背包 */
				[E_EquipType.eGlove]: new PackModule(),
				/** 星戒背包 */
				[E_EquipType.eRing]: new PackModule(),
				/** 卷轴背包 */
				[E_EquipType.eScroll]: new PackModule(),
				/** 容器背包 */
				[E_EquipType.eContainer]: new PackModule(),
				/** 灵背包 */
				[E_EquipType.eSoul]: new PackModule()
			}

			/**初始化当前佩戴的武器 */
			this._currentEquipList = {
				/** 佩戴手套Id */
				[E_EquipType.eGlove]: 0,
				/** 佩戴星戒Id */
				[E_EquipType.eRing]: 0,
				/** 佩戴卷轴Id */
				[E_EquipType.eScroll]: 0,
				/** 佩戴容器Id */
				[E_EquipType.eContainer]: 0,
				/** 佩戴灵Id */
				[E_EquipType.eSoul]: 0,
			}
			/***********************************/
			for (let cfgId in EquipConfig) {
				let cfg = EquipConfig[cfgId];
				let equipGroup = cfg.equipGroup;
				let equipLevel = cfg.equipLevel;
				if (this._suitMakeList[equipGroup] == null) {
					this._suitMakeList[equipGroup] = {};
				}
				this._suitMakeList[equipGroup][equipLevel] = Number(cfgId);
			}
		}

		/**上线同步回调 */
		private C_SendEquipInfo(buf: any) {
			this.Init();

			//装备实例列表
			let tEquipList = buf[0];
			//装备穿戴信息
			let tUseList = buf[1];

			//同步客户端装备实例列表
			for (let Id in tEquipList) {
				let instId = Number(Id);
				let info = tEquipList[Id];
				let cfgId = info[1];
				let bLock = info[2];
				let bNew = info[3];
				let bUse = info[4];
				let equip: EquipVo = new EquipVo(cfgId);
				this._ownEquipList[instId] = equip;
				equip.unpackData([instId, bLock, bNew]);
				let equipType = equip.equipType;
				let equipGroup = equip.equipGroup;
				this._equipInstIdList[equipType].Add(instId, equip);
				if (this._equipGroupList[equipGroup] == null) {
					this._equipGroupList[equipGroup] = new PackModule();
				}
				this._equipGroupList[equipGroup].Add(instId, equip);

				let suitId = equip.suitId;
				this.SuitOnceActivate(suitId, equipGroup, true);
				//同步客户端当前佩戴的武器
				if (bUse != null && bUse == 1) {
					this._currentEquipList[equipType] = instId;
					this.LoadAttribute(instId);
				}
			}
			this._IsOverflow = this.GetEquipNum() == GameParamConfig.EquipMaxNum;
		}
		/**添加装备回调 */
		private C_AddEquip(buf: any) {
			//装备实例ID
			let instId = buf[0];
			//装备信息
			let tUseList = buf[1];
			//装备配置ID
			let cfgId = tUseList[1];
			//装备是否上锁			
			let bLock = tUseList[2];
			//装备是否new		
			let bNew = tUseList[3];

			let equip = new EquipVo(cfgId);
			equip.unpackData([instId, bLock, bNew]);

			this._IsOverflow = false;

			this._ownEquipList[instId] = equip;
			let equipType = equip.equipType;
			let equipGroup = equip.equipGroup;
			let suitId = equip.suitId;
			this._equipInstIdList[equipType].Add(instId, equip);
			if (this._equipGroupList[equipGroup] == null) {
				this._equipGroupList[equipGroup] = new PackModule();
			}
			this._equipGroupList[equipGroup].Add(instId, equip);

			this.SuitOnceActivate(suitId, equipGroup, true);

			let bool = this.GetEquip_one(instId, cfgId);
			if (bool) {
				Event.DispatchEvent("ShowRedPoint", E_OpenGrade.EQUIP);
			}
		}

		public get EquipOnlyone() {
			return this.equip_onlyone;
		}
		/**检测有没有相同的武器 */
		public GetEquip_one(instId, cfg_Id: number) {
			let num = 0;
			for (let key in this._ownEquipList) {
				let equip_Info = this._ownEquipList[key];
				if (equip_Info.cfgId == cfg_Id) {
					num++;
					let bool = num == 1 ? true : false;
				}
			}
			let bool = num == 1 ? true : false;
			this.equip_onlyone = bool;
			if (!bool) {
				this.K_ReqLookEquip(instId)
			}
			return bool
		}

		/**删除装备回调 */
		private C_DelEquip(buf: any) {
			//装备实例ID
			let instId = buf[0];

			let equip = this._ownEquipList[instId];
			let cfgId = equip.cfgId;
			let equipType = equip.equipType;
			let equipGroup = equip.equipGroup;
			let suitId = equip.suitId;
			//先卸载装备属性
			if (instId == this._currentEquipList[equipType]) {
				this.UnLoadAttribute(instId);
			}
			if (this.IsSuitActivate && this._equipGroupList[equipGroup].count == 1) {
				this.UnLoadSuitAttribute(suitId);
			}

			if (this._ownEquipList[instId] != null) {
				delete this._ownEquipList[instId];
			}
			this._equipInstIdList[equipType].Remove(instId);
			this._equipGroupList[equipGroup].Remove(instId);
			if (this._equipGroupList[equipGroup].count == 0) {
				this.SuitOnceActivate(suitId, equipGroup, false);
			}
			this._IsOverflow = true;
			Event.DispatchEvent("DeleShow");
		}

		/**出售装备获得奖励回调 */
		private C_ReqSellEquip(buf: any) {
			//奖励
			let tAllAward = buf[0];
			TipsLogic.Instance.OpenGoodsProTips(tAllAward)
		}

		/**请求穿戴装备回调 */
		private C_ReqUseEquip(buf: any) {
			//装备类型
			let equipType = buf[0];
			//装备实例ID
			let instId = buf[1];

			//先卸载装备属性
			this.UnLoadAttribute(this._currentEquipList[equipType]);

			//再装载装备属性
			this._currentEquipList[equipType] = instId;
			this.LoadAttribute(instId);
			Event.DispatchEvent("Puton", [instId]);
			Event.DispatchEvent("ShowRedPoint", E_OpenGrade.EQUIP);
		}

		/**请求设置锁头回调 */
		private C_ReqLockEquip(buf: any) {
			//装备实例ID
			let nInstID = buf[0];
			//是否锁定 0 or null = false : 1 = true
			let bLock = buf[1];

			this._ownEquipList[nInstID].bLock = bLock;
			Event.DispatchEvent("Setlock", [bLock]);
		}

		/**合成装备回调 */
		private C_ReqCompoundEquip(buf: any) {
			let equipId: number = buf[0];

			let nameId = EquipConfig[equipId].equipName;
			let name = GetInfoAttr.Instance.GetText(nameId);
			let suitId = EquipConfig[equipId].suitId;
			let equipType = EquipConfig[equipId].equipType;
			let tAllAward = { 2: { [equipId]: 1 } };
			let equipGroup = EquipConfig[equipId].equipGroup;
			TipsLogic.Instance.OpenGoodsProTips(tAllAward, false, Laya.Handler.create(this, () => {
				let str = Format(SysPromptConfig[30031].strPromptInfo, GetHtmlStrByColor(name, BaseDefine.EquipQualityColor[EquipConfig[equipId].equipColor]));
				TipsLogic.Instance.OpenSystemTips(str);
			}))
			//this.SuitOnceActivate(suitId, equipGroup, true);
			Event.DispatchEvent("updatelist_equip", [equipId]);
		}

		/*******************************************************/

		/**请求穿戴装备 */
		public K_ReqUseEquip(instId: number) {
			RemoteCall.Instance.Send('K_ReqUseEquip', instId);
		}
		/**请求设置锁头 */
		public K_ReqLockEquip(instId: number, bLock: boolean) {
			let b = bLock ? 1 : 0;
			RemoteCall.Instance.Send('K_ReqLockEquip', instId, b);
		}
		/**出售装备 */
		public K_ReqSellEquip(instId: number) {
			RemoteCall.Instance.Send('K_ReqSellEquip', instId);
		}
		/**查看装备消除New */
		public K_ReqLookEquip(instId: number) {
			RemoteCall.Instance.Send('K_ReqLookEquip', instId);
			this._ownEquipList[instId].bNew = false;
		}
		/**请求合成装备 */
		public K_ReqCompoundEquip(equipGroup: number) {
			//let equipLevel: number = CustomsManager.Instance.CustomsVo.composeEquipLevel;
			this._IsOverflow = true;
			RemoteCall.Instance.Send('K_ReqCompoundEquip', equipGroup);
		}

		/*******************************************************/

		/**获取已拥有武器数量 */
		public GetEquipNum(): number {
			return GetTabLength(this._ownEquipList);
		}

		/**获取已拥有武器信息 */
		public GetEquipByInstId(instId: number): EquipVo {
			return this._ownEquipList[instId];
		}

		/**获取武器库容器 */
		public GetEquipByType(type: E_EquipType) {
			return this._equipInstIdList[type];
		}

		/**获取当前佩戴的武器 */
		public GetCurrentEquipByType(type: E_EquipType) {
			return this._currentEquipList[type];
		}

		/**获取套装列表 */
		public GetSuitCfgListByType(type: E_EquipType) {
			return this._suitCfgList[type];
		}
		/**获取装备ID */
		public GetEquipIdBySuitId(suitId: number): number {
			let equipLevel: number = CustomsManager.Instance.CustomsVo.composeEquipLevel;
			return this._suitMakeList[suitId][equipLevel];
		}
		/**装备是否溢出 */
		public get IsOverflow() {
			return this._IsOverflow;
		}

		/**套装单个内容是否激活 */
		public IsSuitOnceActivate(groupId: number): boolean {
			if (this._equipGroupList[groupId] == null) {
				return false;
			}
			return this._equipGroupList[groupId].count != 0;
		}

		/**套装是否激活 */
		public IsSuitActivate(suitId: number): boolean {
			let suit = this._suitActivateList[suitId];

			if (suit == null) {
				return false;
			}
			for (let groupId in suit) {
				if (suit[groupId] == false) {
					return false;
				}
			}
			return GetTabLength(suit) == 5;
		}

		/**套装单个激活 */
		public SuitOnceActivate(suitId: number, groupId: number, bActivate: boolean) {
			if (suitId == 0) return;
			if (this._suitActivateList[suitId] == null) {
				this._suitActivateList[suitId] = {};
			}
			this._suitActivateList[suitId][groupId] = bActivate;

			if (this.IsSuitActivate(suitId) == true) {
				this.UnLoadSuitAttribute(suitId);
				this.LoadSuitAttribute(suitId);
			}
		}

		/**某套装单个激活件数 */
		public GetSuitOnceActivateNum(suitId: number) {
			let suitActivate = this._suitActivateList[suitId];
			let num = 0;
			for (let key in suitActivate) {
				let b = suitActivate[key];
				if (b) {
					num++;
				}
			}
			return num;
		}

		/**重新生成武器属性 */
		public AnewLoadAttribute() {
			for (let type in this._currentAttrributeList) {
				let arr = this._currentAttrributeList[type];
				for (let i in arr) {
					arr[i].OnEffect();
				}
			}

			for (let suitId in this._suitAttrributeList) {
				let arr = this._suitAttrributeList[suitId];
				for (let i in arr) {
					arr[i].OnEffect();
				}
			}
		}


		/**装载装备属性到角色 */
		private LoadAttribute(instId: number) {
			if (instId == 0) return;
			let equip = this._ownEquipList[instId];
			let equipType = equip.equipType;
			let baseAttribute = equip.baseAttribute;
			for (let baseId in baseAttribute) {
				let attribute = baseAttribute[baseId];
				let attrributeEquipment = new ModfiyAttribute(this, attribute);

				this._currentAttrributeList[equipType];
				if (this._currentAttrributeList[equipType] == null) {
					this._currentAttrributeList[equipType] = [];
				}
				attrributeEquipment.OnEffect();
				this._currentAttrributeList[equipType].push(attrributeEquipment);
			}
		}


		/**卸载装备属性 */
		private UnLoadAttribute(instId: number) {
			if (instId == 0) return;
			let equip = this._ownEquipList[instId];
			let equipType = equip.equipType;
			let attrributeList = this._currentAttrributeList[equipType];
			for (let id in attrributeList) {
				attrributeList[id].Destroy();
			}
			this._currentAttrributeList[equipType] = [];
		}

		/**装载套装属性到角色 */
		private LoadSuitAttribute(suitId: number) {
			let suit = SuitConfig[suitId];
			let suitAttribute = suit.suitAttribute;
			for (let baseId in suitAttribute) {
				let attribute = suitAttribute[baseId];
				let attrributeEquipment = new ModfiyAttribute(this, attribute);
				this._suitAttrributeList[suitId];
				if (this._suitAttrributeList[suitId] == null) {
					this._suitAttrributeList[suitId] = [];
				}
				attrributeEquipment.OnEffect();
				this._suitAttrributeList[suitId].push(attrributeEquipment);
			}
		}

		/**卸载套装属性 */
		private UnLoadSuitAttribute(suitId: number) {
			// if (instId == 0) return;
			// let equip = this._ownEquipList[instId];

			// let suitId = equip.suitId;
			if (suitId == 0) return;
			let attrributeList = this._suitAttrributeList[suitId];
			if (attrributeList == []) return;
			for (let id in attrributeList) {
				attrributeList[id].Destroy();
			}
			this._suitAttrributeList[suitId] = [];
		}

		/**控制主界面红点` */
		public IsMainShowRed(): boolean {
			for (let instId in this._ownEquipList) {
				let equip = this._ownEquipList[instId];
				if (equip.bNew) {
					return true;
				}
			}
			return false;
		}

		public SortE(E_id: Array<number>, bool) {
			function sort_E(left, right): number {
				let left_info = EquipManager.Instance.GetEquipByInstId(left.instId);
				let right_Info = EquipManager.Instance.GetEquipByInstId(right.instId);
				if (left_info.bNew != right_Info.bNew) {
					return left_info.bNew ? -1 : 1;
				}
				if (left_info.equipColor == right_Info.equipColor) {
					if(left_info.equipLevel== right_Info.equipLevel){
						return left.instId>right.instId?-1:1;
					}
					return left_info.equipLevel > right_Info.equipLevel ? -1 : 1;
				}
				else {
					return left_info.equipColor > right_Info.equipColor ? -1 : 1;
				}
			}
			if (bool) {
				E_id.sort(sort_E);
			}
		}

	}
}