/**
* 属性被动管理
*/
module H52D_Framework {
	/***属性被动技能管理*/
	export class AttributePassiveManager {

		/**被动属性技能列表 */
		private _attributePassive: Array<ModfiyAttribute> = [];

		private static _instance: AttributePassiveManager = null;
		public static get Instance() {
			if (!AttributePassiveManager._instance) {
				AttributePassiveManager._instance = new AttributePassiveManager();
			}
			return AttributePassiveManager._instance;
		}

		constructor() {
		}
		

		/**初始化被动 */
		public Init(): void {
			this._attributePassive = [];
			let idList: Array<{ id: number, heroid: number }> = [];
			let Ahero = HeroManager.Instance.Herolist;
			/**获取所有英雄的被动ID */
			for (let k in Ahero) {
				let info = Ahero[k] as HeroInfo;
				for (let j = 0; j < info.attributeID.length; j++) {
					let ele = { id: info.attributeID[j], heroid: info.nHeroID };
					idList.push(ele);
				}
			}
			/**初始化属性被动技能 */
			for (let i = 0; i < idList.length; i++) {
				let id = idList[i].id;
				let heroid = idList[i].heroid;
				let data = new PassiveSkillData(id);
				let pas = new ModfiyAttribute(Ahero[heroid], data.scriptParam);
				this._attributePassive.push(pas);
			}
			/**产生被动加属性效果 */
			for (let i = 0; i < this._attributePassive.length; i++) {
				if (this._attributePassive[i]) {
					this._attributePassive[i].OnEffect();
				}
			}
			/**刷新小面板UI*/
			Event.DispatchEvent(EventDefine.REFFIXEDATTR);
		}

		/**解锁属性被动 */
		public OnLock(id: number, heroid: number): void {
			let Ahero = HeroManager.Instance.Herolist;
			let type_id = PassiveSkillConfig[id]["scriptID"];
			if (type_id == 1) {
				let data = new PassiveSkillData(id);
				let pas = new ModfiyAttribute(Ahero[heroid], data.scriptParam);
				pas.OnEffect();
				this._attributePassive.push(pas);
			}
			/**刷新小面板UI*/
			Event.DispatchEvent(EventDefine.REFFIXEDATTR);
		}


		public Update() {
			for (let k in HeroManager.Instance.Herolist) {
				HeroManager.Instance.Herolist[k].UpdateAttrbute();
			}
			MasterPlayer.Instance.player.vo.UpdatePassive();
			if (MasterPlayer.Instance.player.CampID > 0) {
				BCampManager.Instance.vo.UpdatePassiveAttribute();
			}
			if (PetManager.Instance.CurrentpetID > 0) {
				let petvo = PetManager.Instance.GetPet_Instance(PetManager.Instance.CurrentpetID);
				petvo.UpdatePassiveAttribute();
			}
			for (let i = 0; i < this._attributePassive.length; i++) {
				if (this._attributePassive[i]) {
					this._attributePassive[i].OnEffect();
				}
			}
			/**更新小面板属性 */
			Event.DispatchEvent(EventDefine.REFFIXEDATTR);
		}

	}
}