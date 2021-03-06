
module H52D_Framework {
	export class PConditionsPassiveSkill {
		private _data: PassiveSkillData = null;
		/**buff id */
		private _buffId: number = 0;
		/**英雄 id */
		private _heroid: number = 0;
		/**属性 id */
		private _attributeID: number = 0;
		/**触发几率*/
		private _triggerOdds: number = 0;
		/**属性加值*/
		private _attributeSubValue: number = 0;
		/**拥有者 */
		private _owner: any;
		/**技能id */
		public id: number = 0;
		/**Buff表 */
		private _buffTab: Array<PBuff>;
		/**作用目标 */
		private _target: Array<any> = [];

		private _bhurt: boolean = false;
		public get BHurt() { return this._bhurt; }

		private _battack: boolean = false;
		public get BAttack() { return this._battack; }
		private _btype: number = 0;
		constructor(id: number, btype: number, owner: any) {
			this._btype = btype;
			this._owner = owner;
			this._data = new PassiveSkillData(id);
			this.id = id;
			this._buffTab = [];
			switch (this._data.scriptID) {
				case 2:
					this._buffId = this._data.scriptParam[1];
					break;
				case 3:
					this._heroid = this._data.scriptParam[1];
					this._buffId = this._data.scriptParam[2];
					break;
				case 4:
					this._triggerOdds = this._data.scriptParam[1];
					this._buffId = this._data.scriptParam[2];
					break;
				case 5:
					this._triggerOdds = this._data.scriptParam[1];
					this._buffId = this._data.scriptParam[2];
					break;
				case 6:
					this._buffId = this._data.scriptParam[1];
					break;
			}
		}


		public Do() {
			this.Destroy();
			switch (this._data.scriptID) {
				case 2:
					this.TNotHeroAddBuff();
					break;
				case 3:
					this.CommonHero();
					break;
				case 4:
					if (!this._battack)
						this._battack = true;
					break;
				case 5:
					if (!this._bhurt)
						this._bhurt = true;
					break;
				case 6:
					this.AddBuff();
					break;
			}
		}

		/**目中无人*/
		private TNotHeroAddBuff(): void {
			let colnum = this._owner.vo.colNum;
			let monster = this._btype == 1 ? BattlefieldManager.Instance.Characterlist[1].HeroList :
				BattlefieldManager.Instance.Characterlist[0].HeroList;
			if (colnum == 2) return;
			for (let k in monster) {
				if (monster[k]) {
					if (monster[k].vo.colNum != colnum) {
						let buf = new PBuff(this._buffId, this._btype, this._owner);
						buf.Do(eBELONGS_TO.ATTACK);
						this._buffTab.push(buf);
						return;
					}
				}
			}
		}

		/**直接加buff */
		private AddBuff(): void {
			let buf = new PBuff(this._buffId, this._btype, this._owner);
			buf.Do(eBELONGS_TO.ATTACK);
			this._buffTab.push(buf);
		}
		
		/**与基友上阵时候触发 */
		private CommonHero() {
			let hl = this._btype == 1 ? BattlefieldManager.Instance.Characterlist[1].HeroList :
				BattlefieldManager.Instance.Characterlist[0].HeroList;
			let Len = GetTabLength(hl);
			for (let i = 0; i < Len; i++) {
				if (hl[i]) {
					if (hl[i].vo.id == this._heroid) {
						let buf = new PBuff(this._buffId, this._btype, this._owner);
						buf.Do(eBELONGS_TO.ATTACK);
						this._buffTab.push(buf);
						return;
					}
				}
			}
		}

		/**攻击时触发Buff */
		public AttackTriggerSkill() {
			let num = Math.random() * 10000;
			if (num <= this._triggerOdds) {
				let buf = new PBuff(this._buffId, this._btype, this._owner);
				buf.Do(eBELONGS_TO.ATTACK);
				this._buffTab.push(buf);
			}
		}

		/**挨揍了触发 */
		public OnHurtTrigger() {
			let num = Math.random() * 10000;
			if (num <= this._triggerOdds) {
				let buf = new PBuff(this._buffId, this._btype, this._owner);
				buf.Do(eBELONGS_TO.ATTACK);
				this._buffTab.push(buf);
			}
		}

		public Destroy(): void {
			if (this._buffTab) {
				let len = this._buffTab.length;
				for (let i = 0; i < len; i++) {
					if (this._buffTab[i]) {
						this._buffTab[i].Destroy();
						this._buffTab[i] = null;
					}
				}
			}
			this._battack = false;
			this._bhurt = false;
			this._buffTab = [];
		}


	}
}