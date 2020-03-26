
module H52D_Framework {
	export class PlayerVo {
		public attr: Attribute;
		private get _VipHitDamageUp(): number {
			return GameParamConfig["VipHitDamageUp"];
		}
		private _isvip: boolean = false;
		constructor() {
			this.attr = new Attribute();
			let level = MasterPlayer.Instance.player.Level;
			let data = RoleLevelUpConfig[level];
			this.attr.SetAttributeValue(2, eValueType.Base, data["Attack"]);
			this.attr.SetAttributeValue(4, eValueType.Base, data["Crit"]);
			this.attr.SetAttributeValue(5, eValueType.Base, data["CritRatio"]);
		}

		public setVip() {
			this._isvip = true;
			this.attr.ModfiyAttributeValue(2, eValueType.Percent, this._VipHitDamageUp);
		}

		public UpdateInfo() {
			this.attr = new Attribute();
			let level = MasterPlayer.Instance.player.Level;
			let data = RoleLevelUpConfig[level];
			if (this._isvip) {
				this.attr.ModfiyAttributeValue(2, eValueType.Percent, this._VipHitDamageUp);
			}
			this.attr.SetAttributeValue(2, eValueType.Base, data["Attack"]);
			this.attr.SetAttributeValue(4, eValueType.Base, data["Crit"]);
			this.attr.SetAttributeValue(5, eValueType.Base, data["CritRatio"]);
		}

		public UpdateBase() {
			let level = MasterPlayer.Instance.player.Level;
			let data = RoleLevelUpConfig[level];
			this.attr.SetAttributeValue(2, eValueType.Base, data["Attack"]);
		}

		public UpdatePassive() {
			for (let i = 1; i <= 5; i++) {
				this.attr.SetAttributeValue(i, eValueType.Percent, 0);
				this.attr.SetAttributeValue(i, eValueType.Fixed, 0);
			}
			for (let i = 21; i <= 27; i++) {
				this.attr.SetAttributeValue(i, eValueType.Percent, 0);
				this.attr.SetAttributeValue(i, eValueType.Fixed, 0);
			}
			if (this._isvip) {
				/**设置伤害 */
				this.attr.SetAttributeValue(2, eValueType.Percent, this._VipHitDamageUp);
			}
			this.attr.SetAttributeValue(51, eValueType.Fixed, 0);
			this.attr.SetAttributeValue(53, eValueType.Fixed, 0);
		}

	}
}