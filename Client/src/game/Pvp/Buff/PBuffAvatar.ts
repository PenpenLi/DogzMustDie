module H52D_Framework {

	export class PBuffAvatar {
		private _owner: any;
		private _buffData: BuffData;
		private _target: Array<any>;
		private _buffAvatar: { [id: number]: Avatar } = {};
		private _ViewRoot = null;

		constructor(buffdata: BuffData, owner: any, btype: number, belongs) {
			this._buffData = buffdata;
			this._owner = owner;
			this._target = SelectTarget.PBuffTarget(this._buffData,
				this._buffData.statusActionTarget, this._owner, btype, belongs).concat();
			this._buffAvatar = {};
			this._ViewRoot = this._buffData.hierarchy == 1 ? AvatarRoot : AvatarEffectRoot;
		}

		/**添加Buff显示效果 */
		public Do(): void {
			if (!this._target) return;
			for (let i = 0; i < this._target.length; i++) {
				let pointid = this._buffData.pointID;
				let point = PHeroBuffPoint[pointid - 1];
				if (this._target[i] && this._target[i]) {
					let x = this._target[i].PosX + point[0];
					let y = this._target[i].PosY + point[1];
					this.AddbuffEffect(x, y, this._target[i]);
				}
			}
		}

		/**添加初始化Buff表现特效 */
		private AddbuffEffect(x: number, y: number, target): void {
			if (this._buffData == null) return;
			let avatar = new Avatar(this._ViewRoot);
			this._buffAvatar[target.ID] = avatar;
			avatar.Load(this._buffData.effectPath, this._buffData.Dir, this._buffData.effectScla,
				x, y,
				Laya.Handler.create(this, () => {
					avatar.Play(this._buffData.effectName, true);
				}));
		}


		public OnUpdate() {
			for (let t in this._target) {
				if (this._target[t] && this._target[t].IsDie) {
					this.DestroyZ(this._target[t].ID);
					this._target[t] = null;
				}
			}
		}

		public DestroyZ(index: number) {
			if (this._buffAvatar[index]) {
				this._buffAvatar[index].Destroy();
				this._buffAvatar[index] = null;
			}
		}

		/**删除所有buff的表现效果 */
		public Destroy(): void {
			for (let k in this._buffAvatar) {
				if (this._buffAvatar[k]) {
					this._buffAvatar[k].Destroy();
					this._buffAvatar[k] = null;
				}
			}
			this._buffAvatar = {};
			this._target = [];
			this._owner = null;
			// Tick.ClearAll(this);
		}

	}
}