
module H52D_Framework {
	export class PPetInfo {
		/**神兽ID */
		public ID: number = 0;
		/**神兽模型路径 */
		public get Path(): string { return PetConfig[this.ID].strPetModel }
		/**神兽模型大小 */
		public get Scla(): number { return PetConfig[this.ID].modelScale }
		/**神兽普攻ID */
		public get Sid(): number { return PetConfig[this.ID].attackSkillID }

		public Direction: number = -1;

		/**神兽等级 */
		private _level: number = 0;
		public get Level() { return this._level; }
		public set Level(value: number) {
			this._level = value;
			if (value < 2) {
				this.SetAttribute_I();
			}
			else {this.SetAttribute_X();}
		}

		/**状态：0：未上阵 1：上阵 */
		private _currentState: number = 0;
		public get CurrentState() {
			return this._currentState;
		}
		public set CurrentState(value: number) {
			this._currentState = value;
			if (value == 0) {
				this.currentAttribute = this._AllAuxAttribute;
			}
			else {
				this.currentAttribute = this._AllMainAttribute;
			}
			this.OnEffectAttribute();
		}
		public get name() { return GetInfoAttr.Instance.GetText(PetConfig[this.ID].petName);}
		private _attributePassive: Array<PPetAttributeAdd> = [];
		/**神兽系数 */
		public ratio = 0;
		public CD: number = 0;
		/**生效的属性 */
		public attr: Attribute;
		public currentAttribute: Object;
		/**初始化主属性 */
		private get _initMainAttribute(): Object { return PetConfig[this.ID].initialPrimeAttribute }
		/**初始化辅属性 */
		private get _initAuxAttribute(): Object { return PetConfig[this.ID].initialAuxiliaryAttribute }
		/**增加的主属性总值 */
		private _AllMainAttribute: Object;
		/**增加的辅属性总值 */
		private _AllAuxAttribute: Object;
		public get AllMainAttribute(): Object { return this._AllMainAttribute; }
		public get AllAuxAttribute(): Object { return this._AllAuxAttribute; }
		/**每X级增加的主属性*/
		private get _addMainAttr(): Object { return PetConfig[this.ID].primeAttributeUp }
		/**每X级增加的辅属性*/
		private get _addAuxiliaryAttr(): Object { return PetConfig[this.ID].auxiliaryAttributeUp }
		public location = -2;
		
		constructor(data) {
			this.ID = data["id"];
			this.Level = data["level"];
			this.CurrentState = 0;
			this.currentAttribute = {};
			this.Direction = -1;
			this.attr = new Attribute();
			this.ratio = ActiveSkillConfig[this.Sid]["damageList"]["1"]["2"] / 10000;
			this.CD = ActiveSkillConfig[this.Sid]["skillCD"] / 1000;
		}

		public SetDamage(List) {
			let damage = 0;
			for (let k in List) {
				if (List[k]) {
					damage += List[k].vo.attr.GetAttributeValue(2);
				}
			}
			this.attr.SetAttributeValue(2, eValueType.Base, damage);
		}


		/**属性加成效果 */
		public OnEffectAttribute() {
			/*** 如果有先清理*/
			for (let i = 0; i < this._attributePassive.length; i++) {
				if (this._attributePassive[i]) {
					this._attributePassive[i].Destroy();
					this._attributePassive[i] = null;
				}
			}
			this._attributePassive = [];
			/**获取属性数据 */
			let data = [];
			for (let j = 0; j < GetTabLength(this.currentAttribute); j++) {
				data.push(this.currentAttribute[j + 1]);
			}
			/**初始化属性属性 */
			for (let i = 0; i < data.length; i++) {
				let p = new PPetAttributeAdd(this, data[i]);
				this._attributePassive.push(p);
			}
			/**产生属性加成效果 */
			for (let i = 0; i < this._attributePassive.length; i++) {
				if (this._attributePassive[i]) {
					this._attributePassive[i].OnEffect();
				}
			}
			Event.DispatchEvent(EventDefine.REFFIXEDATTR);
		}

		/**1-4级用初始化属性 */
		public SetAttribute_I() {
			this._AllMainAttribute = this._initMainAttribute;
			this._AllAuxAttribute = this._initAuxAttribute;
		}

		/**5级以后，根据等级算出属性的加成 */
		public SetAttribute_X() {
			let config = PetConfig[this.ID];
			let PrimeAttributeInterval = GameParamConfig["PrimeAttributeInterval"];
			let main = this.AddAttribute(this._addMainAttr, PrimeAttributeInterval);
			if (this._level <= 4) {
				this._AllAuxAttribute = this._initAuxAttribute;
			}
			else {
				let AuxiliaryAttributeInterval = GameParamConfig["AuxiliaryAttributeInterval"];
				let aux = this.AddAttribute(this._addAuxiliaryAttr, AuxiliaryAttributeInterval);
				this._AllAuxAttribute = this.AddAttributeX(aux, this._initAuxAttribute);
			}
			this._AllMainAttribute = this.AddAttributeX(main, this._initMainAttribute);
			if (this._currentState == 1) {
				this.currentAttribute = this._AllMainAttribute;
			}
			else {
				this.currentAttribute = this._AllAuxAttribute;
			}
		}

		/**每X等级加属性*/
		public AddAttribute(O: Object, I: number) {
			let index = Math.floor(this._level / I);
			if (index == 0) return O;
			let Odd = new Object();
			for (let idx in O) {
				let tAttr = O[idx];
				let id = tAttr[1];
				let value = tAttr[2];
				let modfiy = value * index;
				Odd[idx] = { 1: id, 2: modfiy }
			}
			return Odd;
		}

		/**每X等级加属性*/
		public AddAttributeX(add: Object, init: Object) {
			let Odd = new Object();
			for (let idx in add) {
				let aAttr = add[idx];
				let iAttr = init[idx];
				let id = aAttr[1];
				let value = aAttr[2];
				let value2 = iAttr[2];
				let modfiy = value + value2;
				Odd[idx] = { 1: id, 2: modfiy }
			}
			return Odd;
		}

	}
}