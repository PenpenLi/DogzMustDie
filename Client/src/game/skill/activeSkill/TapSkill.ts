/**
* 点击技能类 
*/
module H52D_Framework {
	export class TapSkill {
		constructor(viewRoot?: Laya.Box) {
			this._sData = new SkillData(100);
			this._viewRoot = viewRoot ? viewRoot : EffectRoot;
		}

		private _sData: SkillData = null;
		private _tapAvatar: Avatar = null;
		private get _path() { return this._sData.actionEffect["3"]; }
		private get _name() { return this._sData.actionEffect["4"]; }
		private get _scla(): number { return this._sData.actionEffect["5"]; }
		private _dir: number = 1;
		private _viewRoot: Laya.Box = EffectRoot;

		/**点击技能 */
		public TapSkill(clickType?): void {
			if (!this._tapAvatar) {
				this._tapAvatar = new Avatar(this._viewRoot)
				this._tapAvatar.Load(this._path, this._dir, this._scla, 0, 0, Laya.Handler.create(this, () => { this.PlayTapEffect(clickType); }));
			}
			else {
				this.PlayTapEffect(clickType);
			}
		}
		/**播放技能特效 */
		private PlayTapEffect(clickType?) {
			if (!this._tapAvatar) return;
			SoundManager.Instance.OnPlaySound("res/sound/tap_sound.mp3");
			if (clickType == 1) {
				let x = Laya.MouseManager.instance.mouseX;
				let y = Laya.MouseManager.instance.mouseY;
				let point = this._viewRoot.globalToLocal(new Laya.Point(x, y));
				this._tapAvatar.PosX = point.x;
				this._tapAvatar.PosY = point.y;
				//if(PrivilegeBuff.Instance.IsStart)
				this._tapAvatar.Play(this._name, false);
			}
		}

		public Destroy(): void {
			if (this._tapAvatar) {
				this._tapAvatar.Destroy();
				this._tapAvatar = null;
			}
		}
	}
}