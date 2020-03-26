
module H52D_Framework {
	AddViewResource("SkillNameView",
		[
			{ url: "res/ui/ui_skillname.atlas", type: Laya.Loader.ATLAS }
		]);
	export class SkillNameView extends ui.common.SkillNameUI {
		constructor(params: Array<any>) {
			super();
			this.width = G_StageWidth;
			this.height = G_StageHeight;
			let name: string = params[1];
			this.SName.x = params[2];
			this.SName.y = params[3];
			let x = name.length;
			switch (x) {
				case 6:
					this.SName.width = 76;
					break;
				case 7:
					this.SName.width = 107;
					break;
				case 8:
					this.SName.width = 136;
					break;
			}
			this.SName.skin = "ui_skillname/" + name;
			this.SName.visible = true;
			this.SName.alpha = 1;
			TweenList.to(this, this.SName, { alpha: 1 }, 200, () => {
				Tick.Once(700, this, () => {
					TweenList.to(this, this.SName, { alpha: 0 }, 200, () => {
						this.Destroy();
					});
				});
			})
		}

		private Destroy() {
			this.SName.alpha = 0;
			Laya.Tween.clearAll(this);
			UIManager.Instance.DestroyUI(this, [ViewDownRoot]);
		}


	}
}