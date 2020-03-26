/**Created by the LayaAirIDE*/
module H52D_Framework {
	AddViewResource("ChangeSceneView",
		[
			// { url: "res/ui/ui_scene01.atlas", type: Laya.Loader.ATLAS },
			// { url: "res/ui/ui_scene02.atlas", type: Laya.Loader.ATLAS },
			// { url: "res/ui/ui_scene03.atlas", type: Laya.Loader.ATLAS },
			// { url: "res/ui/ui_scene04.atlas", type: Laya.Loader.ATLAS },
			// { url: "res/ui/ui_scene05.atlas", type: Laya.Loader.ATLAS },
			// { url: "res/ui/ui_scene06.atlas", type: Laya.Loader.ATLAS },
			// { url: "res/ui/ui_scene07.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_login.atlas", type: Laya.Loader.ATLAS }
		]);
	export class ChangeSceneView extends ui.loading.ChangeSceneViewUI {
		private path: string = "ui_icon/";
		// private scenebg: Laya.Image;

		private _storyImgMod: Avatar;
		constructor() {
			super();
			this.visible = false;
			// this.scenebg = new Laya.Image();
			// this.scenebg.bottom = 0;
			// this.img_bg.addChild(this.scenebg);
			// this.img_bg.width = G_StageWidth * G_StageWidthScale;
			// this.img_bg.height = G_StageHeight * G_StageHeightScale;

			this.img_bg.skin = "res/ui/ui_noPack/login_background.png";
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			Event.RegistEvent(EventDefine.SHOW_SCENE, Laya.Handler.create(this, this.ShowScene));
			Event.RegistEvent(EventDefine.CLOSE_SCENE, Laya.Handler.create(this, this.CloseScene));
		}

		public ShowScene(sceneVo: SceneVo) {
			this.scene_name.text = sceneVo.sceneName;
			// let sceneurl: string = "ui_scene" + sceneVo.strSceneFileName.substr(-2, 2);
			// this.scenebg.skin = sceneurl + "/02.png";
			// this.scenebg.height = G_StageWidth * G_StageWidthScale / this.scenebg.width * this.scenebg.height;
			// this.scenebg.width = G_StageWidth * G_StageWidthScale;
			// this.img_bg.skin = sceneurl + "/01.png";

			this.img_sign.skin = this.path + sceneVo.strSceneChange + ".png";
			this.alpha = 1;
			this.visible = true;
		}

		private CloseScene(callBack?: Function): void {
			TweenList.to(this, this, { alpha: 0 }, 600, () => {
				this.visible = false;
				if (callBack) {
					callBack();
				}
				else {					
					// if (CustomsManager.Instance.CustomsType == Customs_Type.Boss) {
					// 	Tick.Once(2500, this, () => {
					// 		Event.DispatchEvent(EventDefine.BEGIN_FIRE);
					// 		BattleManager.Instance.OpenBattle();
					// 	});
					// } else {
					// 	Event.DispatchEvent(EventDefine.BEGIN_FIRE);
					// 	BattleManager.Instance.OpenBattle();
					// }
				}
			}, 800);
		}

		private Destroy() {
			UIManager.Instance.DestroyUI(this.name, [this.parent]);
			Event.RemoveEvent(EventDefine.SHOW_SCENE, Laya.Handler.create(this, this.ShowScene));
			Event.RemoveEvent(EventDefine.CLOSE_SCENE, Laya.Handler.create(this, this.CloseScene));
		}
	}
}