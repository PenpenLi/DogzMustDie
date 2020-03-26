/**剧情*/
module H52D_Framework {
	AddViewResource("StoryView",
		[
			{ url: "res/ui/ui_guid.atlas", type: Laya.Loader.ATLAS },
		]);
	export class StoryView extends ui.guidance.StoryViewUI {
		constructor(buf: any) {
			super();
			this.AddEvent();
			this.Init(buf);
		}

		private Init(buf: any) {
			let sound = buf[1][1].sound;
			let shake = buf[1][1].shake;
			let AnimaName = buf[1][1].AnimaName;
			let strFlieName = buf[1][1].strFlieName;
			this.PlaySound(sound, shake);
			this.PlayStory(strFlieName, AnimaName);
		}

		private AddEvent() {
			this.on(Laya.Event.REMOVED, this, this.OnDestroy);
			this.overBtn.on(Laya.Event.CLICK, this, this.OverStory);
		}

		private OnDestroy() {
			this.offAll();
		}

		//剧情动画
		private _storyImgMod: Avatar;

		//播放音效、震屏处理
		private PlaySound(sound: any, shake: any) {
			//播放音效
			for (let key in sound) {
				let time = sound[key][1];
				let soundName = sound[key][2];
				Tick.Once(time, this, () => {
					SoundManager.Instance.OnStopMusic();
					SoundManager.Instance.OnPlaySound(soundName);
				})
			}
			//震屏
			for (let key in shake) {
				let time = shake[key][1];
				let value_1 = shake[key][2];
				let value_2 = shake[key][3];
				Tick.Once(time, this, () => {
					EffectManager.Instance.StartShock(value_1, true, value_2);
				})
			}
		}

		//播放动画
		private PlayStory(aimUrl: string, aimNameArr: any) {
			if (this._storyImgMod != null) {
				this._storyImgMod.Destroy();
			}

			//动画名字
			let aimName: string;
			//延迟播放、结束时间
			let standingTime: number = 0;
			this._storyImgMod = new Avatar(this.aim)
			this._storyImgMod.Load(aimUrl, 1, 0.69, 0, 0, Laya.Handler.create(this, () => {
				aimName = aimNameArr[1][2];
				standingTime = aimNameArr[1][1];
				OneTimer(standingTime, () => {
					this._storyImgMod.Play(aimName, false, null, () => {
						aimName = aimNameArr[2][2];
						standingTime = aimNameArr[2][1];
						OneTimer(standingTime, () => {
							this._storyImgMod.Play(aimName, false, null, () => {
								aimName = aimNameArr[3][2];
								standingTime = aimNameArr[3][1];
								OneTimer(standingTime, () => {
									this._storyImgMod.Play(aimName, false, null, () => {
										this.OverStory();
									})
								})
							})
						})
					})
				})
			}));
		}

		//结束动画
		private OverStory() {
			if (this._storyImgMod != null) {
				this._storyImgMod.Destroy();
			}
			BattleManager.Instance.OpenBattle();
			if (UIManager.Instance.IsHave("StoryView", ViewStoryRoot)) {
				UIManager.Instance.DestroyUI("StoryView", [ViewStoryRoot], Laya.Handler.create(this, () => {
					Event.DispatchEvent("StoryEvent");
				}));
			}
		}
	}
}