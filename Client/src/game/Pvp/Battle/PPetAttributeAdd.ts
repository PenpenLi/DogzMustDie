/**
* name 
*/
module H52D_Framework {
	export class PPetAttributeAdd {

		/**属性id */
		private _attributeID: number = 0;
		/**属性加值*/
		private _attributeSubValue: number = 0;
		/**作用目标 */
		private _target: Array<any> = [];
		/**神兽所有者（数据） */
		private _owner: any;
		/**当前法力回复速度 */
		private _currentMpRecover: number = 0;
		/**当前法力上限制 */
		private _currentMp: number = 0;

		/**记录增加的属性值 */
		//public LastArrary:Array<Array<number>> = [];

		/**
		 * 初始化
		 * @param owner 所属者
		 * @param data 属性数据
		 */
		constructor(owner: any, data: Object) {
			this._owner = owner;
			this._attributeID = data[1];
			this._attributeSubValue = data[2];
		}

		/**产生效果 */
		public OnEffect(): void {
			this._target = [];
			this._target = SelectTarget.ImpactTarget(this._attributeID, this._owner).concat();
			for (let i = 0; i < this._target.length; i++) {
				if (this._target[i]) {
					this.AddAttribute(this._target[i]);
				}
			}
		}

		/**为单个目标 修改属性 */
		private AddAttribute(target: any): void {
			let attr = target.attr as Attribute;
			if (this._attributeID == 53 || this._attributeID == 51) {
				// this.AddAttributePlayer();
				return;
			}
			let modfiy_id = attr.GetAttributeModfiyID(this._attributeID);

			let isPercent = attr.GetAttributeIsPer(modfiy_id);
			if (isPercent == 1) {
				attr.ModfiyAttributeValue(modfiy_id, eValueType.Percent, this._attributeSubValue);
			}
			else {
				attr.ModfiyAttributeValue(modfiy_id, eValueType.Fixed, this._attributeSubValue);
			}
		}

		/**修改主角特有属性 */
		private AddAttributePlayer() {
			// if (this._attributeID == 53) {
			// 	let subvalue = this._attributeSubValue / 10000;
			// 	let mpCurrent = MasterPlayer.Instance.player.vo.attr.GetAttributeTypeValue(53,eValueType.Base);
			// 	this._currentMpRecover = mpCurrent * subvalue;
			// 	this._currentMpRecover = Math.ceil(this._currentMpRecover);
			// 	MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(53, eValueType.Fixed, this._currentMpRecover);
			// 	Event.DispatchEvent("MpRecoveryRateChange");
			// 	return;
			// }
			// if (this._attributeID == 51) {
			// 	MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(51, eValueType.Percent, this._attributeSubValue);
			// 	Event.DispatchEvent("MpPoolChange");
			// 	return;
			// }
		}

		/**
		 * 删除增加的属性
		 * @param target 目标
		 */
		private RemoveAttribute(target: any): void {
			let attr = target.attr as Attribute;
			if (this._attributeID == 53 || this._attributeID == 51) {
				// this.RemoveAttributePlayer();
				return;
			}
			let modfiy_id = attr.GetAttributeModfiyID(this._attributeID);

			let isPercent = attr.GetAttributeIsPer(modfiy_id);
			if (isPercent == 1) {
				attr.ModfiyAttributeValue(modfiy_id, eValueType.Percent, -this._attributeSubValue);
			}
			else {
				attr.ModfiyAttributeValue(modfiy_id, eValueType.Fixed, -this._attributeSubValue);
			}
		}

		/**
		 * 删除增加的主角特有属性
		 */
		private RemoveAttributePlayer() {
			// if (this._attributeID == 53) {
			// 	MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(53, eValueType.Fixed, -this._currentMpRecover);
			// 	Event.DispatchEvent("MpRecoveryRateChange");
			// }
			// if (this._attributeID == 51) {
			// 	MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(51, eValueType.Percent, -this._attributeSubValue);
			// 	Event.DispatchEvent("MpPoolChange");
			// }
		}

		/**销毁 */
		public Destroy(): void {
			for (let i = 0; i < this._target.length; i++) {
				if (this._target[i]) {
					this.RemoveAttribute(this._target[i]);
				}
			}
			this._target = [];
		}

	}
}