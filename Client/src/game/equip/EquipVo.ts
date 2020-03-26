/**
* 时空法器类 
*/
module H52D_Framework {
	export class EquipVo {

		private _cfgId: number;		// 配置ID
		private _instId: number;	// 实例ID
		private _cfgData: any;		// 配置数据
		private _bLock: boolean;	// 是否上锁
		private _bNew: boolean;		// 是否新装备

		/**装备实例ID */
		public get instId() { return this._instId; }
		/**装备配置ID */
		public get cfgId() { return this._cfgId; }
		/**装备是否上锁 */
		public get bLock() { return this._bLock; }
		/**设置装备是否上锁 */
		public set bLock(b: boolean) { this._bLock = b; }
		/**是否新装备 */
		public get bNew() { return this._bNew; }
		/**设置是否新装备 */
		public set bNew(b: boolean) { this._bNew = b; }
		/**所属装备组 */
		public get equipGroup() { return this._cfgData.equipGroup; }
		/**归属套装ID */
		public get suitId() { return this._cfgData.suitId; }
		/**装备等级 */
		public get equipLevel() { return this._cfgData.equipLevel; }
		/**基础属性 */
		public get baseAttribute() { return this._cfgData.baseAttribute; }
		/**合成需要数量 */
		public get composeNeedNum() { return this._cfgData.composeNeedNum; }
		/**出售钻石数量 */
		public get sellNum() { return this._cfgData.sellNum; }
		/**装备名称 */
		public get equipName() {
			if (this._cfgData) {
				return GetInfoAttr.Instance.GetText(this._cfgData.equipName) ? GetInfoAttr.Instance.GetText(this._cfgData.equipName) : " ";
			} else {
				return "时空法器"
			}
		}
		/**装备图标 */
		public get equipIcon() {
			if (this._cfgData) {
				return this._cfgData.equipIcon ? this._cfgData.equipIcon : "lw_icon_20.png";
			}
			else {
				return "lw_icon_20.png"
			}
		}
		/**装备类型 */
		public get equipType() {
			if (this._cfgData) {
				return this._cfgData.equipType;
			}
			else {
				return 1
			}
		}
		/**装备品质 */
		public get equipColor() {
			if (this._cfgData) {
				return this._cfgData.equipColor;
			} else {
				return 1
			}
		}

		/**
		 * @param equipData 装备数据
		 */
		constructor(cfgId: number) {
			this._cfgId = cfgId;	// 配置ID
			this._instId = -1;	// 实例ID
			this._bLock = false;	// 是否上锁
			this._cfgData = EquipConfig[this._cfgId];
		}

		/** 解析服务器数据 */
		public unpackData(equipData) {
			// 接收数据
			this._instId = equipData[0];		// 实例ID
			this._bLock = equipData[1] == 1;	// 是否上锁
			this._bNew = equipData[2] == 1;		// 是否上锁
			this._cfgData = EquipConfig[this._cfgId];
		}
	}
}