/**
* Buff表现类
*/
module H52D_Framework {
	export class BuffAvatar {

		private _owner: any;
		private _buffData: BuffData;
		private _target: Array<any>;
		private _buffAvatar: { [id: number]: Avatar } = {};
		private _ViewRoot: Laya.Box;
		private _btype : number = 0;

		constructor(buffdata: BuffData, owner: any, btype) {
			this._btype = btype;
			this._buffData = buffdata;
			this._ViewRoot = this._buffData.hierarchy == 1 ? AvatarRoot : AvatarEffectRoot;
			this._owner = owner;
			this._target = SelectTarget.BuffTarget(this._buffData,
				this._buffData.statusActionTarget, this._owner, btype).concat();
			this._buffAvatar = {};
			this.Do();
			Event.RegistEvent("DestryBuffById",Laya.Handler.create(this,this.DestroyByid));
		}

		/**添加Buff显示效果 */
		private Do(): void {
			if (!this._target) return;
			for (let i = 0; i < this._target.length; i++) {
				let pointid = this._buffData.pointID;
				let point;
				if (this._target[i]) {
					if (CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
						if (this._btype == -1) {
							point = PHeroBuffPoint[pointid - 1];
						}
						else {
							point = OHeroBuffPoint[pointid - 1];
						}
					}
					else {
						if (this._target[i].type == eCharacter_TYPE.AHERO
							|| this._target[i].type == eCharacter_TYPE.DHERO) {
							point = HeroBuffPoint[pointid - 1];
						}
						else {
							if (this._target[i].vo.boss) {
								point = BossBuffPoint[pointid - 1];
							}
							else {
								point = MonsterBuffPoint[pointid - 1];
							}
						}
					}
					let x = this._target[i].PosX + point[0];
					let y = this._target[i].PosY + point[1];
					this.AddbuffEffect(x, y, this._target[i]);
				}
			}
		}

		/**添加初始化Buff表现特效 */
		private AddbuffEffect(x: number, y: number, target): void {
			if (this._buffData == null) return;
			let avatar = new Avatar(this._ViewRoot)
			avatar.Load(this._buffData.effectPath, this._buffData.Dir, this._buffData.effectScla,
				x, y,
				Laya.Handler.create(this, (avatars) => {
					avatars.SetOrder(0);
					avatars.Play(this._buffData.effectName, true);
				}), null, this._buffData.hierarchy == 1);
			this._buffAvatar[target.vo.id] = avatar;
		}
		private die: Array<number> = [];

		public OnUpdate() {
			for (let k in this._target) {
				if (this._target[k]) {
					if (this._target[k].type == eCharacter_TYPE.MONSTER) {
						let a = this._target[k] as Monster;
						if (a.IsDie) this.Destroy();
					}
				}
			}
		}

		private DestroyByid(id) {
			if (this._buffAvatar[id]) {
				this._buffAvatar[id].Destroy();
				this._buffAvatar[id] = null;
			}
		}

		/**删除所有buff的表现效果 */
		public Destroy(): void {
			Event.RemoveEvent("DestryBuffById",Laya.Handler.create(this,this.DestroyByid));
			for (let k in this._buffAvatar) {
				if (this._buffAvatar[k]) {
					this._buffAvatar[k].Destroy();
					this._buffAvatar[k] = null;
				}
			}
			this._buffAvatar = {};
			this._target = [];
			this._owner = null;
			Tick.ClearAll(this);
		}


	}
}