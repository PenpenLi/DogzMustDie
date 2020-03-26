
module H52D_Framework {
	export class PPlayerInfo {
		/**Vip加成的点击伤害 */
		private get _VipHitDamageUp(): number {
			return GameParamConfig["VipHitDamageUp"];
		}
		private _isvip: boolean = false;
		public attr: Attribute;
		private _level: number = 0;
		public get Level() { return this._level; }
		private _MpMax: number = 0;
		public get MpMax() { return this._MpMax; }
		public set MpMax(value: number) { this._MpMax = value; }
		/**当前MP */
		public CMp: number = 0;
		private _MpRec: number = 0;
		/**MP回复速度 */
		public get MpRec() { return this._MpRec; }
		public set MpRec(value: number) { this._MpRec = value; }
		public SkillList = [];
		public get name() { return "玩家" }
		public location = -2;
		constructor(data) {
			this.MpMax = data["MpMax"];
			this._level = data["level"];
			this.MpRec = data["MpRec"];
			this.CMp = data["Cmp"];
			this.SkillList = data["sList"];
			this._isvip = data["isVip"];
			this.attr = new Attribute();
			let dataUp = RoleLevelUpConfig[this._level];
			this.attr.SetAttributeValue(2, eValueType.Base, dataUp["Attack"]);
			this.attr.SetAttributeValue(4, eValueType.Base, dataUp["Crit"]);
			this.attr.SetAttributeValue(5, eValueType.Base, dataUp["CritRatio"]);

			if (this._isvip) {
				this.attr.ModfiyAttributeValue(2, eValueType.Percent, this._VipHitDamageUp);
			}

		}

	}
}