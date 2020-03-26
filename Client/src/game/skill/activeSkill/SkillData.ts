/**
* 技能数据类 
*/
module H52D_Framework {
	export class SkillData {
		/** 技能ID*/
		public id: number;
		/** 名称ID*/
		public get nameId(): number { return ActiveSkillConfig[this.id].nameId; }
		/** 描述ID*/
		public get descId(): number { return ActiveSkillConfig[this.id].descId; }
		/** 图标名称*/
		public get strIcon(): string { return ActiveSkillConfig[this.id].nameId; }
		/** 技能特效*/
		public get actionEffect(): any { return ActiveSkillConfig[this.id].actionEffect; }
		/** 子弹特效*/
		public get flyEffect(): any { return ActiveSkillConfig[this.id].flyEffect; }
		/** 被击特效*/
		public get hitEffect(): any { return ActiveSkillConfig[this.id].hitEffect; }
		/** 技能音效*/
		public get soundParam(): any { return ActiveSkillConfig[this.id].soundParam; }
		/** 被击音效*/
		public get hitSound(): any { return ActiveSkillConfig[this.id].hitSound; }
		/** 技能等级*/
		public get level(): number { return ActiveSkillConfig[this.id].level; }
		/** 法力消耗*/
		public get conMp(): number { return ActiveSkillConfig[this.id].conMp; }
		/** 技能cd*/
		public get skillCD(): number { return ActiveSkillConfig[this.id].skillCD; }
		/** 攻击目标*/
		public get hitEnemyMode(): number { return ActiveSkillConfig[this.id].hitEnemyMode; }
		/** 攻击数量*/
		public get hitEnemyNum(): number { return ActiveSkillConfig[this.id].hitEnemyNum; }
		/** 技能伤害*/
		public get damageList(): any { return ActiveSkillConfig[this.id].damageList; }
		/** 技能状态*/
		public get statusList(): any { return ActiveSkillConfig[this.id].statusList; }
		/** 技能层级 */
		public get hierarchy(): number { return ActiveSkillConfig[this.id].hierarchy; }
		/**效果id */
		public get shake(): Object { return ActiveSkillConfig[this.id].shake; }
		public get point(): Object { return ActiveSkillConfig[this.id].point; }

		public get special() { return ActiveSkillConfig[this.id].special; }
		public get fixedDamage(): number {
			if (ActiveSkillConfig[this.id].fixedDamage[1])
				return ActiveSkillConfig[this.id].fixedDamage[1];
			else
				return 0;
		}
		
		constructor(id: number) {
			this.id = id;
		}

	}
}