
module H52D_Framework {
	export class PAIOperation {

		private _campDps: number = 0;
		private _heroDps: number = 0;
		private _petDps: number = 0;
		private _allDps: number = 0;


		/**阵营DPS */
		public get CampDps() { return this._campDps; }
		/**英雄DPS */
		public get HeroDps() { return this._heroDps; }
		/**神兽DPS */
		public get PetDps() { return this._petDps; }
		/**总DPS */
		public get AllDps() { return this._allDps; }

		constructor() {
		}

		/**销毁 */
		public Destroy() {

		}

		public OnUpdate(): void {

		}


		/**DPS小面板 */
		public Dps() {
			this._allDps = 0;
			this._petDps = 0;
			this._heroDps = 0;
			this._campDps = 0;
			let pvpChara = BattlefieldManager.Instance.Characterlist[0];
			/**通知修改英雄DPS显示 */
			if (pvpChara.Heromanager) {
				let count = pvpChara.HeroList.length;
				for (let index = 0; index < count; index++) {
					let heroC = pvpChara.HeroList[index];
					if (heroC) {
						let cd = 1.5;
						if (heroC.attackSkill) { cd = (heroC.attackSkill.Data.skillCD) / 1000; }
						let dps = heroC.vo.attr.GetAttributeValue(2) / cd;
						this._heroDps += dps >> 0;
					}
				}
				Event.DispatchEvent(EventDefine.HERO_DPS, [this._heroDps.toString()]);
			}
			/**通知修改神兽DPS显示 */
			if (pvpChara.petMgr) {
				this._petDps = pvpChara.petMgr.PetIns.vo.attr.GetAttributeValue(2);
				this._petDps = this._petDps * pvpChara.petMgr.PetIns.vo.ratio;
				this._petDps = this._petDps / pvpChara.petMgr.PetIns.vo.CD >>0;
				Event.DispatchEvent(EventDefine.PET_DPS, [this._petDps.toString()]);
			}
			/**通知修改阵营DPS显示*/
			if (pvpChara.campMgr) {
				this._campDps = pvpChara.campMgr.Camp.vo.attr.GetAttributeValue(2) *pvpChara.campMgr.Camp.vo.ratio;
				let cd = pvpChara.campMgr.Camp.vo.CD;
				this._campDps = this._campDps / cd >>0;
				Event.DispatchEvent(EventDefine.CAMP_DPS, [this._campDps.toString()]);
			}
			/**通知修改所有DPS显示*/
			this._allDps = this._heroDps + this._petDps + this._campDps >>0;
			Event.DispatchEvent(EventDefine.ALL_DPS, [this._allDps.toString()]);
		}


	}
}