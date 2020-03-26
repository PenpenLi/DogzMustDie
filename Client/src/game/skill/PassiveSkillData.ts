/**
* 被动技能表数据 
*/
module H52D_Framework {
	/**被动技能数据 */
	export class PassiveSkillData {
		/**ID */
		public id;
		/**名字ID */
		public get nameId() { return PassiveSkillConfig[this.id]["nameId"] };
		/**描述ID */
		public get descId() { return PassiveSkillConfig[this.id]["descId"] };
		/**图标ID */
		public get strIcon() { return PassiveSkillConfig[this.id]["strIcon"] };
		/**等级 */
		public get level() { return PassiveSkillConfig[this.id]["level"] };
		/**被动技能类型 */
		public get scriptID() { return PassiveSkillConfig[this.id]["scriptID"] };
		/**参数 */
		public get scriptParam() { return PassiveSkillConfig[this.id]["scriptParam"] };
		/**是否飘技能名称 */
		public get isPiao() { return PassiveSkillConfig[this.id]["isPiao"] };

		constructor(id: number) {
			this.id = id;
		}


	}
}