
module H52D_Framework {
	/**非子弹类 */
	export class SkillNone {
		/**技能数据 */
		private _skillData: SkillData;
		/**总数据 */
		private _Data: Object;
		/**目标 */
		private _target: Array<any>;
		/**属于谁 */
		private _owner: any;
		/**朝向 */
		private _dir: number = 1;
		private _order: number = 0;
		private _posX: number = 0;
		private _posY: number = 1;
		private _ViewRoot: Laya.Box;
		/**特效列表 */
		private _avtarTab: Array<Avatar> = [];
		/**被击特效列表*/
		private _hitAvatarTab: Array<Avatar> = [];
		public isDie = false;
		private _belongs: eBELONGS_TO;
		private _callBack: Laya.Handler;
		private _bcomplete: boolean = false;
		public get BComplete() { return this._bcomplete; }
		public set BComplete(value: boolean) { this._bcomplete = value; }
		/**特效路径 */
		private get _path(): string { return this._skillData.actionEffect[3] }
		/**特效大小 */
		private get _scla(): number { return this._skillData.actionEffect[5] }
		/**特效挂点ID */
		private get _PointId(): number { return this._skillData.actionEffect[1] }
		/**延迟时间 */
		private get _delayTime(): number { return this._skillData.actionEffect[2] }
		/**特效动画名字 */
		private get _name(): string { return this._skillData.actionEffect[4] }
		/**被击特效路径 */
		private get _hitPath(): string { return this._skillData.hitEffect[1] }
		/**被击特效动画名 */
		private get _hitName(): string { return this._skillData.hitEffect[2] }
		/**被击特效大小 */
		private get _hitScla(): number { return this._skillData.hitEffect[3] }
		private _btype: number = 0;

		constructor(owner: any, data: any, view: Laya.Box, to: eBELONGS_TO, btype = 1) {
			this._skillData = data;
			this._owner = owner;
			this._order = 0;
			this._ViewRoot = view;
			this._avtarTab = [];
			this._hitAvatarTab = [];
			this._belongs = to;
			this._btype = btype;
			this._dir = btype == 1 ? 1 : -1;
		}


		/**释放技能 */
		public SpellSkill(target: Array<any>, _belongs?): void {
			this._avtarTab = [];
			this._hitAvatarTab = [];
			this._target = [];
			this._bcomplete = false;
			if (this._skillData.special == 1) {
				/**设置目标 */
				for (let i = 0; i < target.length; i++) {
					this._target.push(target[i]);
				}
			}
			else {
				for (let i = 0; i < target.length; i++) {
					if ((target[i])) {
						this._target.push(target[i]);
						break;
					}
				}
			}
			/**攻击特效 */
			for (let i = 0; i < this._target.length; i++) {
				this.DoPlayEffect(this._delayTime, this._target[i]);
			}
			/**有人物模型的 */
			if (this._owner.avatar) {
				Tick.Once(200, this, () => {
					this.AttackOnComplete();
				});
			}
			else {
				this.AttackOnComplete();
			}
		}

		/**攻击回调 */
		private AttackOnComplete(): void {
			this.DoHitEffect();
			this._bcomplete = true;
			if (this._callBack) {
				this._callBack.run();
			}
		}



		public OnUpdate() {

		}


		/**近战技能特效 */
		private DoPlayEffect(time: number, target: any): void {
			Tick.Once(time, this, () => {
				this.PlaySkillEffect(target);
			});
		}

		private PlaySkillEffect(target: any) {
			if (this.CheckDestroy()) return;
			let avatar = new Avatar(this._ViewRoot)
			if (this._skillData.special == 2) {
				this.MoveX(avatar, target);
			}
			else if (this._skillData.hitEnemyMode == 5) {
				this.FixedPosition(avatar, target);
			}
			else {
				this.CopyEffect(avatar, target);
			}
			if (this._avtarTab) {
				this._avtarTab.push(avatar);
			}
			avatar.SetOrder(this._owner.Order);
		}


		/**水平移动技能特效 */
		private MoveX(avatar, target) {
			avatar.Load(this._path, this._dir, this._scla, 0, 0,
				Laya.Handler.create(this, () => {
					this.SkillPoint(avatar, target);
					avatar.Play(this._name, true, true, () => {
					});
					let moveX = this._btype == 1 ? 1000 : -10;
					TweenList.to(this, avatar, { PosX: moveX }, 1000, () => {
						avatar.PosX = moveX;
						avatar.Destroy();
					});
				}));
		}
		/**固定位置技能特效 */
		private FixedPosition(avatar, target) {
			avatar.Load(this._path, this._dir, this._scla, 0, 0,
				Laya.Handler.create(this, (avatars) => {
					let point = !ObjIsEmpty(this._skillData.point) ? [this._skillData.point[1], this._skillData.point[2]] : [0, 0];
					if (this._btype == 1) {
						avatars.PosX = 540 + point[0];
						avatars.PosY = 730 + point[1];
					}
					else {
						avatars.PosX = 190 - point[0];
						avatars.PosY = 730 + point[1];
					}
					avatars.Play(this._name, false, false, () => {
						avatars.Destroy();
					});
				}))
		}
		/**默认技能特效 */
		private CopyEffect(avatar, target) {
			avatar.Load(this._path, this._dir, this._scla, 0, 0,
				Laya.Handler.create(this, () => {
					this.SkillPoint(avatar, target);
					avatar.Play(this._name, false, true, () => {
						avatar.Destroy();
					});
				})
			);
		}

		/**技能挂点 */
		private SkillPoint(avatar: Avatar, target: any) {
			if (!target) return;
			if (this._owner.avatar && this._belongs == eBELONGS_TO.ATTACK) {
				if (this._owner.avatar.Armature) {
					let point = this._btype == 1 ? Pvp_Point_O[this._PointId - 1] : Pvp_Point_E[this._PointId - 1];
					if (this._btype == 1 || this._belongs == eBELONGS_TO.ATTACK) {
						avatar.PosX = this._owner.avatar.PosX + point[0];
						avatar.PosY = this._owner.avatar.PosY + point[1];
					}
					else {
						avatar.PosX = this._owner.avatar.PosX - point[0];
						avatar.PosY = this._owner.avatar.PosY + point[1];
					}
				}
			}
			else {
				let point = !ObjIsEmpty(this._skillData.point) ? [this._skillData.point[1], this._skillData.point[2]] : [0, 0];
				if (this._btype == 1 || this._belongs == eBELONGS_TO.ATTACK) {
					avatar.PosX = target.PosX + point[0];
					avatar.PosY = target.PosY + point[1];
				}
				else {
					avatar.PosX = target.PosX - point[0];
					avatar.PosY = target.PosY + point[1];
				}
			}
		}

		private DoHitEffect() {
			if (!ObjIsEmpty(this._skillData.hitEffect)) {
				for (let i = 0; i < this._target.length; i++) {
					if (this._target[i]) {
						if (this._target[i].avatar) {
							let h = 50 + Math.random() * 200;//this._target[i].avatar.height * 0.5;
							if (CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
								h = 50;
							}
							let newPos = new Laya.Point(this._target[i].PosX, this._target[i].PosY - h);
							newPos.x += Math.random() * 40 - 20;
							newPos.y += Math.random() * 40 - 20;
							/**受伤特效 */
							this.PlayHitEffect(newPos.x, newPos.y);
						}
					}
				}
			}
		}

		private PlayHitEffect(x: number, y: number) {
			let hitAvatar = new Avatar(AvatarEffectRoot)
			hitAvatar.Load(this._hitPath, this._dir, this._hitScla, x, y,
				Laya.Handler.create(this, (avatar) => {
					if (this._skillData.hitSound[1] != null) {
						SoundManager.Instance.OnPlaySound(this._skillData.hitSound[1]);
					}
					if (!avatar) {
						return
					}
					if (!avatar.Play) {
						return
					}
					avatar.Play(this._hitName, false, true,
						() => {
							avatar.Destroy();
							avatar = null;
							this.isDie = true;
						});
					avatar.PosX = x;
					avatar.PosY = y;
				}));
			if (this._hitAvatarTab) {
				this._hitAvatarTab.push(hitAvatar);
			}
		}

		private CheckDestroy(): boolean {
			if (!this._owner || GetTabLength(this._target) == 0) {
				this.HitTabDestroy();
				return true;
			}
			return false;
		}

		private HitTabDestroy(): void {
			for (let k in this._hitAvatarTab) {
				if (this._hitAvatarTab[k]) {
					if (this._hitAvatarTab[k].Armature) {
						this._hitAvatarTab[k].visible = false;
					}
					this._hitAvatarTab[k].Destroy();
					this._hitAvatarTab[k] = null;
				}
			}
			this._hitAvatarTab = [];
		}

		private AvatarTabDestroy() {
			for (let k in this._avtarTab) {
				if (this._avtarTab[k]) {
					if (this._avtarTab[k].Armature) {
						this._avtarTab[k].visible = false;
					}
					this._avtarTab[k].Destroy();
					this._avtarTab[k] = null;
				}
			}
			this._avtarTab = [];
		}

		public Destroy(): void {
			this.AvatarTabDestroy();
			this.HitTabDestroy();
		}

	}
}