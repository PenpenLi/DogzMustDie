/**
* name 
*/
module H52D_Framework {
	/**值类型 */
	export enum eValueType {
		/**配置值 */
		Base = 0,
		/**加成百分比 */
		Percent = 1,
		/**加成固定值 */
		Fixed = 2,
		/**附加固定值 */
		Other = 3,
		/**Buff固定值 */
		BFixed = 4,
		/**Buff百分比 */
		BPercent = 5,
	}


	/**属性值 */
	export class AttributeValue {
		private _value = {};
		/**
		 * 
		 * @param base 配置值
		 * @param percent 加成百分比
		 * @param fixed 加成固定值
		 * @param other 附加固定值
		 */
		constructor(base?: number, percent?: number, fixed?: number, other?: number, peta?: number, bfixed?, bper?) {
			this._value = {
				[eValueType.Base]: base >> 0,
				[eValueType.Percent]: percent >> 0,
				[eValueType.Fixed]: fixed >> 0,
				[eValueType.Other]: other >> 0,
				[eValueType.BFixed]: bfixed >> 0,
				[eValueType.BPercent]: bper >> 0,
			};
		}

		/**设置属性 */
		public SetValue(valType: eValueType, value: number) {
			this._value[valType] = value
			if (this._value[valType] < 0) {
				this._value[valType] = 0;
			}
		}
		/**修改属性 */
		public ModfiyValue(valType: eValueType, value: number) {
			this._value[valType] += value
			if (this._value[valType] < 0) {
				this._value[valType] = 0;
			}
		}


		public get bValue() {
			let value = (this._value[eValueType.Base]
				+ this._value[eValueType.Fixed])
				* (1 + this._value[eValueType.Percent] / 10000)
			return Math.floor(value);
		}

		/**获取属性值 */
		public get Value() {
			let value = (this._value[eValueType.Base]
				+ this._value[eValueType.Fixed])
				* (1 + this._value[eValueType.Percent] / 10000)
				+ this._value[eValueType.Other];
			value = value + this._value[eValueType.BFixed] *
				(1 + this._value[eValueType.BPercent] / 10000);
			return Math.floor(value);
		}

		/**获取固定属性值 */
		public get Fixed() {
			let value = this._value[eValueType.Fixed];
			return Math.floor(value)
		}
		/**获取百分比属性加值 */
		public get Percent() {
			let value = this._value[eValueType.Percent];
			return Math.floor(value)
		}
		/**获取配置表属性值 */
		public get Base() {
			let value = this._value[eValueType.Base];
			return Math.floor(value)
		}

		/**获取附加值 */
		public get Other() {
			let value = this._value[eValueType.Other];
			return Math.floor(value)
		}

		/**获取附加值 */
		public get BFixed() {
			let value = this._value[eValueType.BFixed];
			return Math.floor(value)
		}

		/**获取附加值 */
		public get BPercent() {
			let value = this._value[eValueType.BPercent];
			return Math.floor(value)
		}


	}
}