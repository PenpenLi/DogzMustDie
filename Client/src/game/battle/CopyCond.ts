
module H52D_Framework {
	export class CopyCond {
		/**第几颗星 */
		private _id: number = -1;
		/**类型 */
		private _index = 0;
		public get Type() { return this._index; }
		/**通关值 */
		private _value = 0;

		private get herolist() { return BattleManager.Instance.HeroCardMgr.CHeroList; }
		private get MonsterList() { return MonsterManager.Instance.monsterList; }

		/**防止多次添加 */
		private _once = false;
		private get curTime() { return BattleManager.Instance.curtime; }


		constructor(id, index, value) {
			this._id = id;
			this._index = index;
			this._value = value;
		}

		public OnEffect() {
			let id = this._index - 1;
			switch (id) {
				case 0:
					this.BeatFail();
					break;
				case 1:
					this.LifeTime();
					break;
				case 2:
					this.OwnerDieNumber();
					break;
				case 3:
					this.TimeNotOwnerDie();
					break;
				case 4:
					this.TakeTypeHeroV();
					break;
				case 5:
					this.TimeDamage();
					break;
				case 6:
					this.HitNumber();
					break;
			}
		}

		/**击败所有敌方 */
		private BeatFail() {
			if (this.curTime <= this._value * 1000 && this.bEnemyDie() && !this._once) {
				this._once = true;
				this.AddList(1);
			}
		}

		/**生存时间 */
		private LifeTime() {
			if (this.curTime >= this._value * 1000 && this.bOwnerDie() && !this._once) {
				this._once = true;
				this.AddList(1);
			}
		}

		/**我放阵亡数量 */
		private OwnerDieNumber() {
			if (BattleManager.Instance.nWin == 1) {
				if (BattleManager.hDienumber <= this._value && !this._once) {
					this.AddList(1);
					this._once = true;
				}
			}
		}

		/**规定时间没有阵亡 */
		private TimeNotOwnerDie() {
			if (this.curTime >= this._value * 1000 && BattleManager.hDienumber < 1 && !this._once) {
				this.AddList(1);
				this._once = true;
			}
		}

		/**携带指定类型英雄通关 */
		private TakeTypeHeroV() {
			if (BattleManager.Instance.nWin == 1) {
				let index = 0;
				for (let k in this.herolist) {
					if (this.herolist[k] && this.herolist[k].type == eCharacter_TYPE.DHERO) {
						index++;
					}
				}
				if (index >= this._value && !this._once) {
					this.AddList(1);
					this._once = true;
				}
			}
		}

		/**规定时间造成伤害 */
		private TimeDamage() {
			if (this.curTime <= 10 * 1000 && BattleManager.damageAll >= this._value && !this._once) {
				this.AddList(1);
				this._once = true;
			}
		}

		/**被击数 */
		private HitNumber() {
			if (BattleManager.Instance.nWin == 1 && BattleManager.hitNum <= this._value && !this._once) {
				this.AddList(1);
				this._once = true;
			}
		}

		private AddList(obj) {
			let list = BattleManager.Instance.StarList;
			list[this._id] = obj;
		}

		private bEnemyDie() {
			for (let k in this.MonsterList) {
				if (this.MonsterList[k] && this.MonsterList[k].IsDie != true) {
					return false;
				}
			}
			return true;
		}

		private bOwnerDie() {
			for (let k in this.herolist) {
				if (this.herolist[k] && this.herolist[k].IsDie == true) {
					return false;
				}
			}
			return true;
		}


	}
}