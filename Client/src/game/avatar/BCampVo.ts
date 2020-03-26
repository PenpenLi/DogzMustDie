
module H52D_Framework {
	export class BCampVo {

		private level: number = 1;
		public get Level() { return this.level; }
		public skillid: number = 0;
		public ratio: number = 0;
		public CD: number = 0;
		public attr: Attribute;

		constructor() {
			this.attr = new Attribute();
		}

		public Setattribute() {
			this.setDamage();
			let cmp = CampManager.Instance.nCamp(MasterPlayer.Instance.player.CampID);
			if (!cmp) {
				return
			}
			this.level = cmp["3"];
			this.skillid = GangLevelUpConfig[this.level]["GangSkillId"];
			this.ratio = ActiveSkillConfig[this.skillid]["damageList"]["1"]["2"] / 10000;
			this.CD = ActiveSkillConfig[this.skillid]["skillCD"] / 1000;
		}

		public setDamage(): void {
			let damage = 0;
			for (let k in HeroManager.Instance.Herolist) {
				let Hc = HeroManager.Instance.Herolist[k] as HeroInfo;
				if (Hc) { damage += Hc.attr.GetAttributeValue(2); }
			}
			this.attr.SetAttributeValue(2, eValueType.Base, damage);
			this.attr.SetAttributeValue(5, eValueType.Base, 15000);
		}

		public UpdatePassiveAttribute(): void {
			for (let i = 1; i <= 5; i++) {
				this.attr.SetAttributeValue(i, eValueType.Percent, 0);
				this.attr.SetAttributeValue(i, eValueType.Fixed, 0);
			}
			for (let i = 21; i <= 27; i++) {
				this.attr.SetAttributeValue(i, eValueType.Percent, 0);
				this.attr.SetAttributeValue(i, eValueType.Fixed, 0);
			}
		}
		
	}

}