
module H52D_Framework {
	export class POAttribute {

		private _owner: any = null;
		/**属性id */
		private _attributeID: number = 0;
		/**属性加值*/
		private _attributeSubValue: number = 0;

		constructor(owner: any, data: any) {
			this._owner = owner;
			this._attributeID = data[1];
			this._attributeSubValue = data[2];
		}

		/**修改属性 */
		public OnEffect(): void {
			let attr = this._owner.attr as Attribute;
			if (attr == null) return;
			let modfiy_id = attr.GetAttributeModfiyID(this._attributeID);
			let isPercent = attr.GetAttributeIsPer(modfiy_id);

			if (isPercent == 1) {
				attr.ModfiyAttributeValue(modfiy_id, eValueType.Percent, this._attributeSubValue);
			}
			else {
				attr.ModfiyAttributeValue(modfiy_id, eValueType.Fixed, this._attributeSubValue);
			}
		}

	}
}