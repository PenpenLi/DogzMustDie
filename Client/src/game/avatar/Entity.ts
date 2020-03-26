/**
* name 
*/
module H52D_Framework {
	export class Entity {
		/**英雄的模型 */
		protected _avatar: Avatar;
		public get avatar(): Avatar { return this._avatar; }
		/**挂点类型*/
		public type: eCharacter_TYPE = eCharacter_TYPE.PET;
		/** ID */
		protected _id: number = 0;
		public get ID() { return this._id; }
		/**攻击目标 */
		protected _target: Array<any> = [];
		/**攻击目标 */
		public set Target(value: Array<any>) { this._target = value; }
		public get Target() { return this._target; }
		/**模型层级*/
		protected viewRoot: Laya.Box;
		protected _dataVo: any;
		/**数据模型*/
		public get vo() { return this._dataVo; }
		protected _order: number = 0;
		/**层级 */
		public get Order() { return this._order; }
		protected _PosX: number = 0;
		/**位置X坐标 */
		public get PosX() { return this._PosX; }
		protected _PosY: number = 0;
		/**位置Y坐标 */
		public get PosY() { return this._PosY; }
		protected _attackskill: Skill;
		/**普攻 */
		public get attackSkill() { return this._attackskill; }
		public SE: SkinEnum = SkinEnum.SkinHero;
		/**重置循环普攻 */
		private _bClose: boolean = true;
		public get Close() { return this._bClose; }
		public set Close(value) { this._bClose = value; }
		/**出生特效 */
		protected _brithAvatar: Avatar;
		private _bloadDown = false;
		public get bLoadDown() { return this._bloadDown; }
		public set bLoadDown(value) { this._bloadDown = value; }

		protected _currentHp: number;
		protected _isDie: boolean;
		public get IsDie() {
			return this._isDie;
		}
		public set IsDie(value) {
			this._isDie = value;
		}
		protected bAttack: boolean = false;


		protected heroBlood: HeroBloodView;
		protected bloodMax: number;
		public set currentHp(value: number) {
			this._currentHp = value;
			if (this.heroBlood) {
				this.heroBlood.proportion = this._currentHp / this.bloodMax;
			}
		}

		public get currentHp() {
			return this._currentHp;
		}

		/** 血条 */
		// protected heroBlood: HeroBloodView;
		// protected bloodMax: number;
		// public set setCurrentHp(value: number) {
		// 	this._currentHP = value;
		// 	if (this.heroBlood) {
		// 		this.heroBlood.proportion = this._currentHP / this.bloodMax;
		// 	}
		// }

		// public get setCurrentHp() {
		// 	return this._currentHP;
		// }
		/**初始化 */
		constructor(viewRoot?: Laya.Box) {
			this.viewRoot = viewRoot ? viewRoot : AvatarRoot;
		}

		/**获取当前动画时间 */
		public GetAniDuration(): number {
			return this._avatar.GetAniDuration();
		}

		/** 待机 */
		public Idle(): void {
			if (!this._avatar) return;
			this._avatar.Play(AnimationName.idle, true);
		}

		/** 被击 */
		protected Hit(): void {
			if (!this._avatar || this.bAttack || this.IsDie) return;
			this._avatar.Play(AnimationName.hit, false, true, () => {
				this.Idle()
			});
		}
		public isDown = false;
		/** 死亡 */
		protected Die(): void {
			if (!this._avatar) return;
			BattleManager.hDienumber += 1;
			this._avatar.Play(AnimationName.die, false, true, () => {
				this.Destroy();
				this.isDown = true;
			});
		}

		/** 攻击 */
		public Attack(): void {
			if (!this._target || !this._attackskill || !this._avatar) return;
			/**攻击完毕  自动待机状态 */
			this._avatar.Play(AnimationName.attack, false, true, () => {
				this.Idle();
			});
			this._attackskill.SpellSkill(this._target);
		}

		/**更新函数 */
		public OnUpdate(): void {
			if (this.TargetIsNull()) {
				this.Close = true;
				this._target = [];
			}
		}

		/**判断目标是不是空 */
		protected TargetIsNull(): boolean {
			for (let i = 0; i < this._target.length; i++) {
				if (this._target[i]) {
					if (!this._target[i].IsDie) {
						return false;
					}
				}
			}
			return true;
		}


		/**清理目标 */
		public ClearTarget(): void {
			if (this._target) {
				this._target = [];
			}
			/**普攻目标清理 */
			if (this.attackSkill) {
				this.attackSkill.ClearTarget();
			}
		}

		/**销毁 */
		public Destroy(): void {
			this.Close = true;
			this.ClearTarget();
			if (this._avatar) {
				this._avatar.Destroy();
				this._avatar = null;
			}
			if (this._attackskill) {
				this._attackskill.Destroy();
				this._attackskill = null;
			}
			if (this._brithAvatar) {
				this._brithAvatar.Destroy();
				this._brithAvatar = null;
			}
		}

	}
}