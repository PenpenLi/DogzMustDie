/**
* name 
*/
module H52D_Framework {
	/**属性 */
	export class Attribute {
		private _attributeTab: Object = {};
		/**1: 0 固定值 1百分比 */
		/**2: 0 不显示百分比 1显示百分比 */
		/**3: 0 没有  对应修改的ID*/
		/**4: 0 不带目标  1：主角 2：攻击型 3：防御型  4：所有英雄 5：神兽 6：阵营 7：所有*/
		constructor() {
			this._attributeTab = {
				[1]: { 0: new AttributeValue(), 1: 1, 2: 0, 3: 1, 4: 0 },
				[2]: { 0: new AttributeValue(), 1: 1, 2: 0, 3: 2, 4: 0 },
				[3]: { 0: new AttributeValue(), 1: 1, 2: 0, 3: 3, 4: 0 },
				[4]: { 0: new AttributeValue(), 1: 0, 2: 1, 3: 4, 4: 0 },
				[5]: { 0: new AttributeValue(), 1: 0, 2: 1, 3: 5, 4: 0 },
				[8]: { 0: new AttributeValue(), 1: 1, 2: 1, 3: 3, 4: 0 },
				[9]: { 0: new AttributeValue(), 1: 1, 2: 1, 3: 1, 4: 0 },
				[10]: { 0: new AttributeValue(), 1: 1, 2: 1, 3: 2, 4: 0 },
				[11]: { 0: new AttributeValue(), 1: 1, 2: 1, 3: 2, 4: 1 },
				[12]: { 0: new AttributeValue(), 1: 1, 2: 1, 3: 2, 4: 2 },
				[13]: { 0: new AttributeValue(), 1: 1, 2: 1, 3: 2, 4: 3 },
				[14]: { 0: new AttributeValue(), 1: 1, 2: 1, 3: 2, 4: 4 },
				[15]: { 0: new AttributeValue(), 1: 1, 2: 1, 3: 2, 4: 5 },
				[16]: { 0: new AttributeValue(), 1: 1, 2: 1, 3: 2, 4: 6 },
				[17]: { 0: new AttributeValue(), 1: 1, 2: 1, 3: 2, 4: 7 },
				[21]: { 0: new AttributeValue(), 1: 1, 2: 1, 3: 21, 4: 4 },
				[22]: { 0: new AttributeValue(), 1: 1, 2: 1, 3: 22, 4: 4 },
				[23]: { 0: new AttributeValue(), 1: 1, 2: 1, 3: 23, 4: 4 },
				[24]: { 0: new AttributeValue(), 1: 1, 2: 1, 3: 24, 4: 4 },
				[25]: { 0: new AttributeValue(), 1: 1, 2: 1, 3: 25, 4: 4 },
				[26]: { 0: new AttributeValue(), 1: 1, 2: 1, 3: 26, 4: 4 },
				[27]: { 0: new AttributeValue(), 1: 1, 2: 1, 3: 27, 4: 7 },
				[31]: { 0: new AttributeValue(), 1: 0, 2: 1, 3: 4, 4: 1 },
				[32]: { 0: new AttributeValue(), 1: 0, 2: 1, 3: 4, 4: 2 },
				[33]: { 0: new AttributeValue(), 1: 0, 2: 1, 3: 4, 4: 3 },
				[34]: { 0: new AttributeValue(), 1: 0, 2: 1, 3: 4, 4: 4 },
				[35]: { 0: new AttributeValue(), 1: 0, 2: 1, 3: 4, 4: 5 },
				[36]: { 0: new AttributeValue(), 1: 0, 2: 1, 3: 4, 4: 6 },
				[37]: { 0: new AttributeValue(), 1: 0, 2: 1, 3: 4, 4: 7 },
				[41]: { 0: new AttributeValue(), 1: 0, 2: 1, 3: 5, 4: 1 },
				[42]: { 0: new AttributeValue(), 1: 0, 2: 1, 3: 5, 4: 2 },
				[43]: { 0: new AttributeValue(), 1: 0, 2: 1, 3: 5, 4: 3 },
				[44]: { 0: new AttributeValue(), 1: 0, 2: 1, 3: 5, 4: 4 },
				[45]: { 0: new AttributeValue(), 1: 0, 2: 1, 3: 5, 4: 5 },
				[46]: { 0: new AttributeValue(), 1: 0, 2: 1, 3: 5, 4: 6 },
				[47]: { 0: new AttributeValue(), 1: 0, 2: 1, 3: 5, 4: 7 },
				[51]: { 0: new AttributeValue(), 1: 0, 2: 0, 3: 51, 4: 1 },
				[52]: { 0: new AttributeValue(), 1: 0, 2: 0, 3: 52, 4: 1 },
				[53]: { 0: new AttributeValue(), 1: 1, 2: 0, 3: 53, 4: 1 },
				[54]: { 0: new AttributeValue(), 1: 1, 2: 1, 3: 0, 4: 0 },
				[55]: { 0: new AttributeValue(), 1: 1, 2: 1, 3: 0, 4: 0 },
				[56]: { 0: new AttributeValue(), 1: 0, 2: 1, 3: 0, 4: 0 },
				[57]: { 0: new AttributeValue(), 1: 1, 2: 1, 3: 0, 4: 0 },
			};
		}

		/**获取属性表————
		 * 属性 1 生命  2 伤害 3 先手速度 4 暴击率 5 暴击倍率
		 * 其他id 用于修改以上属性
		 */
		public GetAttributeTab(id: number): any {
			if (this._attributeTab[id]) {
				return this._attributeTab[id];
			}
			Debugger.LogError(id + "GetAttributeTab() this attribute is no exist");
			return null;
		}



		/**获取是否以百分比的方式加成 0固定值  1百分比加成 */
		public GetAttributeIsPer(id: number): number {
			if (this._attributeTab[id]) {
				return this._attributeTab[id][1];
			}
			Debugger.LogError(id + "GetAttributeIsPer() this attribute is no exist");
			return null;
		}


		/**获取属性是否显示百分比 0不显示  1显示 */
		public GetAttributeIsPerShow(id: number): number {
			if (this._attributeTab[id]) {
				return this._attributeTab[id][2];
			}
			Debugger.LogError(id + "GetAttributeIsPerShow() this attribute is no exist");
			return null;
		}


		/**获取属性修改ID */
		public GetAttributeModfiyID(id: number): number {
			if (this._attributeTab[id]) {
				return this._attributeTab[id][3];
			}
			Debugger.LogError(id + "GetAttributeModfiyID() this attribute is no exist");
			return null;
		}


		/**获得属性目标ID */
		public GetAttributeTargetID(id: number): number {
			if (this._attributeTab[id]) {
				return this._attributeTab[id][4];
			}
			Debugger.LogError(id + "GetAttributeTargetID() this attribute is no exist");
			return null;
		}


		/**获取属性值
		 * 属性ID 1 生命  2 伤害 3 先手速度 4 暴击率 5 暴击倍率
		 * 其他id 用于修改以上属性
		 */
		public GetAttributeValue(id: number): any {
			if (this._attributeTab[id]) {
				let v = this._attributeTab[id][0].Value;
				if (id == 4 && v > 10000) {
					let y = 0;
					return 10000;
				}
				else {
					return this._attributeTab[id][0].Value;
				}
			}
			Debugger.LogError(id + "GetAttributeValue() this attribute is no exist");
			return null;
		}

		/**
		 * 计算非暴击最终伤害
		 * @param sratio 技能系数
		 * @param id 减免ID1
		 * @param id1 减免ID2 
		 */
		public GetAttributeDamage(sratio: number, breaks: number, Others?) {
			let B = this._attributeTab[2][0].Base;
			let P = this._attributeTab[2][0].Percent;
			let F = this._attributeTab[2][0].Fixed;
			let O = this._attributeTab[2][0].Other;
			let bp = this._attributeTab[2][0].BPercent;
			let bf = this._attributeTab[2][0].BFixed;

			let sp = (P - breaks) / 10000;
			if (sp <= GameParamConfig["InjuryInsuranceCoefficient"]) {
				sp = GameParamConfig["InjuryInsuranceCoefficient"];
			}
			let bl = 1 + sp;

			let op = (bp - Others) / 10000;
			if (op <= GameParamConfig["InjuryInsuranceCoefficient"]) {
				op = GameParamConfig["InjuryInsuranceCoefficient"];
			}
			let opbl = 1 + op;

			let Damage = B * sratio * bl * opbl + F + O + bf;

			return Math.floor(Damage);
		}

		public GetAttributeD(sratio: number) {
			let B = this._attributeTab[2][0].Base;
			let P = this._attributeTab[2][0].Percent;
			let F = this._attributeTab[2][0].Fixed;
			let O = this._attributeTab[2][0].Other;
			let bl = 1 + (P / 10000);
			let Damage = B * sratio * bl + F + O;
			return Math.floor(Damage);
		}


		/**Buff获取基础值 */
		public GetAttributeBuff(id: number) {
			if (this._attributeTab[id]) {
				return this._attributeTab[id][0].bValue;
			}
			Debugger.LogError(id + "GetAttributeBuff() this attribute is no exist");
			return null;
		}

		/**属性ID 1 生命  2 伤害 3 先手速度 4 暴击率 5 暴击倍率
		 * Base 配置值  Fixed 固定加值  Percent 百分比加值  Other 附加值
		 * @param id 属性ID 
		 * @param type 类型ID
		 */
		public GetAttributeTypeValue(id: number, type: eValueType): any {
			if (this._attributeTab[id]) {
				let value = 0;
				switch (type) {
					case eValueType.Base:
						value = this._attributeTab[id][0].Base;
						break;
					case eValueType.Fixed:
						value = this._attributeTab[id][0].Fixed;
						break;
					case eValueType.Other:
						value = this._attributeTab[id][0].Other;
						break;
					case eValueType.Percent:
						value = this._attributeTab[id][0].Percent;
						break;
					case eValueType.BFixed:
						value = this._attributeTab[id][0].BFixed;
						break;
					case eValueType.BPercent:
						value = this._attributeTab[id][0].BPercent;
						break;
				}
				return value;
			}
			Debugger.LogError(id + " GetAttributeTypev()  this attribute is no exist");
			return null;
		}

		/**属性 1 生命  2 伤害 3 先手速度 4 暴击率 5 暴击倍率
		 * 其他id 用于修改以上属性
		 * type：base配置值 percent加成百分比 fixed加成固定值 other附加固定值
		 * 不可叠加
		 */
		public SetAttributeValue(id: number, type: eValueType, value: number, ) {
			if (this._attributeTab[id]) {
				this._attributeTab[id][0].SetValue(type, value);
			}
			else {
				Debugger.LogError(id + "SetAttributeValue()  this attribute is no exist");
			}
		}

		/**属性 1 生命  2 伤害 3 先手速度 4 暴击率 5 暴击倍率
		 * 其他id 用于修改以上属性
		 * type：base配置值 percent加成百分比 fixed加成固定值 other附加固定值
		 * 可叠加
		 */
		public ModfiyAttributeValue(id: number, type: eValueType, value: number) {
			if (this._attributeTab[id]) {
				let x = this._attributeTab[id][0] as AttributeValue;
				x.ModfiyValue(type, value);
			}
			else {
				Debugger.LogError(id + "ModfiyAttributeValue()  this attribute is no exist");
			}
		}


	}
}