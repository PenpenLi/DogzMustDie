
module H52D_Framework {
	export class PCampInfo {
		private level: number = 1;
		public get Level() { return this.level; }
		public skillid: number = 0;
		public ratio: number = 0;
		public CD: number = 0;
		public attr: Attribute;
		public get name() { return "大船" }
		public location = -2;

		constructor(data) {
			this.attr = new Attribute();
			this.level = data["level"];
			this.attr.SetAttributeValue(2, eValueType.Base, data["Base"]);
			this.skillid = GangLevelUpConfig[this.level]["GangSkillId"];
			this.ratio = ActiveSkillConfig[this.skillid]["damageList"]["1"]["2"] / 10000;
			this.CD = ActiveSkillConfig[this.skillid]["skillCD"] / 1000;
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


	}
}