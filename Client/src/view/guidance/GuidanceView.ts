/**新手引导*/
module H52D_Framework {
	import Label = laya.ui.Label;
	AddViewResource("GuidanceView",
		[
			{ url: "res/ui/ui_guid.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS }
		]);

	enum E_GuidanceType {
		E_Strong,	//强引导
		E_Weak		//弱引导
	}

	export class GuidanceView extends ui.guidance.GuidanceViewUI {
		//光圈特效
		private _aperture: Avatar;
		//箭头特效
		private _arrows: Avatar;
		//倒计时时间
		private _time: number;
		//计数玩家点击次数
		private _clickNum: number;
		//引导类型
		private _guidanceType: E_GuidanceType;
		//剧情动画
		private _storyImgMod: Avatar;
		private _oneTimer: number = 700;

		constructor() {
			super();
			this.AddEvent();
			this.Init();
		}

		private Init() {
			//暂停游戏战斗
			OneTimer(1000, () => {
				BattleManager.Instance.StopBattle();
			})
			//开启点击
			BattleManager.Instance.oClick = false;
			//关闭所有气泡
			Event.DispatchEvent("ClearBubble");
			//暂停宝箱
			DropManager.Instance.openBox = false;
			this.spr_1.width = this.spr_2.width = this.shade.width = G_StageWidth //* G_StageWidthScale;
			this.spr_1.height = this.spr_2.height = this.shade.height = G_StageHeight //* G_StageHeightScale;
			Guidance.Instance._bProceeding = true;
			this._time = 10;
			this._clickNum = 0;
			if (Guidance.Instance.guidanceStep == E_GuidanceStep.E_Aide) {
				this._time = 7;
			}

			this.infoBg.visible = false;
			this.guidBj.visible = false;
			this.storyBj.visible = false;
			this.clickImg.visible = false;
			this._guidanceType = E_GuidanceType.E_Strong;
			this.time.text = "自动引导下一步（" + this._time + "s)";
			this.click.blendMode = "destination-out";
			this.SetEffectScale();
		}

		private AddEvent() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.over.on(Laya.Event.CLICK, this, this.StoryOver);
			this.storyBj.on(Laya.Event.CLICK, this, this.setAniT);
			// Event.RegistEvent('ShowStory', Laya.Handler.create(this, this.ShowStory));
			Event.RegistEvent('ShowStory', Laya.Handler.create(this, this.StoryOver));
			Event.RegistEvent('EventSaveWar', Laya.Handler.create(this, this.SaveWar));
			Event.RegistEvent('StartGuidance', Laya.Handler.create(this, this.StartGuidance));
		}

		private Destroy(): void {
			this.offAll();
			Tick.ClearAll(this);
			this.Close();
			if (this._storyImgMod != null) {
				this._storyImgMod.Destroy()
			}
			if (this._arrows != null) {
				this._arrows.Destroy();
			}
			if (this._aperture != null) {
				this._aperture.Destroy();
			}
			Event.RemoveEvent('ShowStory', Laya.Handler.create(this, this.ShowStory));
			Event.RemoveEvent('EventSaveWar', Laya.Handler.create(this, this.SaveWar));
			Event.RemoveEvent('StartGuidance', Laya.Handler.create(this, this.StartGuidance));
		}

		/**关闭UI */
		private CloseUI() {
			//恢复游戏战斗
			OneTimer(1000, () => {
				BattleManager.Instance.OpenBattle();
			})
			//开启宝箱
			DropManager.Instance.openBox = true;
			Guidance.Instance._bProceeding = false;
			this.infoBg.removeSelf();
			UIManager.Instance.DestroyUI("GuidanceView", [NewGuidRoot], Laya.Handler.create(this, () => {
				if (Guidance.Instance.guidanceStep != E_GuidanceStep.E_Guidance_14) {
					Guidance.Instance.TriggerAll();
				}
			}));

			this.Destroy();
		}

		//****************************开场剧情************************** */
		/**剧情参数 */
		private _StandingTime: number = 4000;
		private _currentTime = 0;
		private _timeTab = [];
		private _aniTab = [];
		private _index = 0;
		private bSetAniT = true;
		/**显示故事 */
		private ShowStory() {
			this._currentTime = 0;
			this._timeTab = [0, this._StandingTime, 400, this._StandingTime, 400, this._StandingTime, 700];
			this._aniTab = ["idle", "dead", "idle2", "dead2", "idle3", "dead3"];
			this._index = 0;
			this._storyImgMod = new Avatar(this.storyImg)
			let sRes = "res/player/juqing/juqing.sk"
			if (IsNotBaiDuSdk()) {
				sRes = "res/player/juqing_1/juqing.sk"
			}
			this._storyImgMod.Load(sRes, 1, 0.69, 0, 0, Laya.Handler.create(this, () => {
				this._storyImgMod.visible = true;
				Tick.Loop(10, this, () => {
					this.timec();
				})
			}));
			this.storyBj.visible = true;
			SoundManager.Instance.OnStopMusic();
			SoundManager.Instance.OnPlaySound("res/sound/story_sound.mp3");
		}
		private timec() {
			this._currentTime += 10;
			if (this._currentTime >= this._timeTab[this._index] &&
				this._index <= this._timeTab.length) {
				this._currentTime = 0;
				let list = this._timeTab.length - 1;
				Tick.Clear(this, playSound_1);
				Tick.Clear(this, playSound_2);
				this._StandingTime = 4000;
				switch (this._index) {
					case 0:
						Tick.Once(1000, this, playSound_1);
						break;
					case 1:
						SoundManager.Instance.OnPlaySound("res/sound/menu_check.mp3");
						break;
					case 2:
						Tick.Once(500, this, playSound_2);
						break;
					case 3:
						SoundManager.Instance.OnPlaySound("res/sound/menu_check.mp3");
						break;
					case 4:
						OneTimer(2000, () => {
							SoundManager.Instance.OnPlaySound("res/sound/story_shake.mp3");
							EffectManager.Instance.StartShock(800, true);
						})
						break;
					case 5:
						break;
					case list:
						Tick.Clear(this, this.timec);
						this.StoryOver();
						return;

				}
				this._storyImgMod.Play(this._aniTab[this._index], false, null);
				this._index += 1;
			}

			function playSound_1() {
				SoundManager.Instance.OnPlaySound("res/sound/typewriting.mp3");
			}
			function playSound_2() {
				SoundManager.Instance.OnPlaySound("res/sound/phone.mp3");
			}
		}
		private setAniT() {
			if (this.bSetAniT) {
				SoundManager.Instance.OnStopSound("res/sound/phone.mp3");
				SoundManager.Instance.OnStopSound("res/sound/typewriting.mp3");
				SoundManager.Instance.OnPlaySound("res/sound/menu_check.mp3");
				this.bSetAniT = false;
				// this._index += 1;
				this._StandingTime = 10;
				this._currentTime = this._timeTab[this._index];
				OneTimer(1000, () => {
					this.bSetAniT = true;
				})
			}
		}
		/**跳过故事 */
		private StoryOver() {
			SoundManager.Instance.OnStopMusic();
			Event.DispatchEvent("LoadingGame");
			//加载主界面
			UIManager.Instance.CreateUI("MainView", [ViewDownRoot], Laya.Handler.create(this, () => {
				//加载关卡场景
				CustomsManager.Instance.Initialize();
			}));
			SoundManager.Instance.OnPlaySound("res/sound/story_end.mp3");
			SoundManager.Instance.OnStopSound("res/sound/story_sound.mp3");
			this.CloseUI();
			this.StartGuidance(E_GuidanceStep.E_Aide);
		}

		/****************************引导功能***************************/
		/**
		 * 设置常规引导信息
		 * @param guidanceType	引导类型
		 * @param guidanceStep	引导步骤
		 * @param listener 		点击函数
		 * @param rotation 		箭头旋转弧度
		 * @param x 			光圈、箭头 x轴
		 * @param y 			光圈、箭头 y轴
		 * @param excursion_x 	箭头x轴偏移
		 * @param excursion_y 	箭头y轴偏移
		 */
		private SetGuidanceInfo(guidanceType: E_GuidanceType, guidanceStep: E_GuidanceStep, listener?: Function, args?: Array<any>, rotation: number = 180,
			x: number = 0, y: number = 0, excursion_x: number = 0, excursion_y: number = -100) {
			this.offAll();
			this.guidBj.visible = true;
			Guidance.Instance.SetGuidanceStep(guidanceStep);
			this.aperture.on(Laya.Event.CLICK, this, listener, args);
			this.GuidanceType(guidanceType);
			this.SetEffectPos(x, y, excursion_x, excursion_y);
			this.ApertureEffect(0, 3);
			this.ArrowsEffect(rotation, 1);
			this.GuidanceAuto(Laya.Handler.create(this, listener, args));
		}

		/**
		 * 设置引导文本信息
		 * @param bVisible 是否显示文本框
		 * @param stringID 国际化ID
		 */
		private SetintroduceInfo(bVisible: boolean, stringID?: number) {
			this.infoBg.visible = bVisible;
			if (stringID) {
				this.introduce.text = GetInfoAttr.Instance.GetText(stringID);
			}
		}

		/**开始引导 */
		private StartGuidance(type: E_GuidanceStep) {
			let point;
			switch (type) {
				case E_GuidanceStep.E_Aide:
					this.offAll();
					this.guidBj.visible = true;
					this.time.visible = true;
					this._time = GameParamConfig.GuideTime;
					this.storyBj.visible = false;
					this.arrows.visible = false;
					this.SetintroduceInfo(true, 7021);
					this.infoBg.y -= 200 //* G_StageHeightScale;
					this.guidBj.on(Laya.Event.CLICK, this, () => {
						this.CloseUI();
						Guidance.Instance.StartGuidance(E_GuidanceStep.E_Guidance_1);
					});
					this.GuidanceAuto(Laya.Handler.create(this, () => {
						this.CloseUI();
						Guidance.Instance.StartGuidance(E_GuidanceStep.E_Guidance_1);
					}));
					break;
				case E_GuidanceStep.E_Guidance_1:
					this.offAll();
					this.guidBj.visible = true;
					this.clickImg.visible = true;
					this.infoBg.top = 320;
					this.SetintroduceInfo(true, 7009);
					this.aperture.on(Laya.Event.CLICK, this, this.ClickAttack, [1]);
					Tick.Loop(5000, this, this.GameShowPic);
					this.GuidanceAuto(Laya.Handler.create(this, this.ClickAttack, [3]));
					this.GuidanceType(E_GuidanceType.E_Strong);
					this.SetEffectPos(MonsterLocal[4][0], MonsterLocal[4][1] - 50, 0, 0);
					this.ApertureEffect(0, 3);
					this.ArrowsSlide(MonsterLocal[4][0], MonsterLocal[4][1] - 150, MonsterLocal[4][0] + 40, MonsterLocal[4][1] - 200, 200);
					this.clickImg.x = MonsterLocal[4][0];
					this.clickImg.y = MonsterLocal[4][1] + 70;
					break;
				case E_GuidanceStep.E_Guidance_2:
					this.SetintroduceInfo(false, 7010);
					point = this.GetButtonPoint(ViewUILogic.Instance.listView.GetMainBtn(E_OpenGrade.HERO), true)
					this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_2, this.HeroActivate, [E_OpenGrade.HERO], 180, point.x, point.y)
					break;
				case E_GuidanceStep.E_Guidance_3:
					this.SetintroduceInfo(false, 7012);
					point = this.GetButtonPoint(ViewUILogic.Instance.listView.GetMainBtn(E_OpenGrade.HERO), true)
					this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_3, this.HeroActivate, [E_OpenGrade.HERO], 180, point.x, point.y)
					break;
				case E_GuidanceStep.E_Guidance_4:
					this.SetintroduceInfo(false, 7013);
					point = this.GetButtonPoint(ViewUILogic.Instance.listView.GetMainBtn(E_OpenGrade.HERO), true)
					this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_4, this.HeroActivate, [E_OpenGrade.HERO], 180, point.x, point.y)
					break;
				case E_GuidanceStep.E_Guidance_5:
					this.SetintroduceInfo(false, 7014);
					point = this.GetButtonPoint(ViewUILogic.Instance.listView.GetMainBtn(E_OpenGrade.HERO), true)
					this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_5, this.HeroActivate, [E_OpenGrade.HERO], 180, point.x, point.y)
					break;
				case E_GuidanceStep.E_Guidance_6:
					this.SetintroduceInfo(false, 7015);
					point = this.GetButtonPoint(ViewUILogic.Instance.listView.GetMainBtn(E_OpenGrade.ROLE), true)
					this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_6, this.HeroActivate, [E_OpenGrade.ROLE], 180, point.x, point.y);
					break;
				case E_GuidanceStep.E_Guidance_7:
					this.SetintroduceInfo(true, 7016);
					point = this.GetButtonPoint(Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_7), true)
					this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_7, this.ClickBtnEvent, [EventDefine.BOSSHANDER], 0, point.x, point.y, 0, 100);
					break;
				case E_GuidanceStep.E_Guidance_8:
					this.SetintroduceInfo(false, 7017);
					point = this.GetButtonPoint(ViewUILogic.Instance.listView.GetMainBtn(E_OpenGrade.HERO), true)
					this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_8, this.HeroActivate, [E_OpenGrade.HERO], 180, point.x, point.y);
					break;
				case E_GuidanceStep.E_Guidance_9:
					this.SetintroduceInfo(false, 7018);
					point = this.GetButtonPoint(ViewUILogic.Instance.listView.GetMainBtn(E_OpenGrade.PET), true)
					this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_9, this.HeroActivate, [E_OpenGrade.PET], 180, point.x, point.y);
					break;
				case E_GuidanceStep.E_Guidance_10:
					this.SetintroduceInfo(false, 7022);
					this.infoBg.top = 320;
					point = this.GetButtonPoint(ViewUILogic.Instance.listView.GetMainBtn(E_OpenGrade.SHOP), true)
					this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_10, this.HeroActivate, [E_OpenGrade.SHOP], 180, point.x, point.y);
					break;
				case E_GuidanceStep.E_Guidance_11:
					this.SetintroduceInfo(false, 7023);
					point = this.GetButtonPoint(Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_11), true)
					this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_11, this.ClickBtnEvent, null, 0, point.x, point.y, 0, 100);
					break;
				case E_GuidanceStep.E_Guidance_12:
					this.SetintroduceInfo(false, 7024);
					point = this.GetButtonPoint(ViewUILogic.Instance.listView.GetMainBtn(E_OpenGrade.ACTION), true)
					this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_12, this.HeroActivate, [E_OpenGrade.ACTION], 180, point.x, point.y);
					break;
				case E_GuidanceStep.E_Guidance_13:
					this.SetintroduceInfo(false);
					point = this.GetButtonPoint(ViewUILogic.Instance.listView.GetMainBtn(E_OpenGrade.HERO), true)
					this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_13, this.HeroActivate, [E_OpenGrade.HERO], 180, point.x, point.y)
					break;
				case E_GuidanceStep.E_Guidance_14:
					this.SetintroduceInfo(true, 7025);
					point = this.GetButtonPoint(Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_14), true)
					this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_14, this.ClickBtnEvent, null, 0, point.x, point.y, 0, 100);
					break;
				case E_GuidanceStep.E_Empty:
					break;
			}
		}

		/**一级引导触发效果 */
		private HeroActivate(clickType: E_OpenGrade) {
			this.visible = false;
			this.aperture.off(Laya.Event.CLICK, this, this.HeroActivate);
			this.GuidanceType(E_GuidanceType.E_Strong);
			//设置全屏开窗
			Event.DispatchEvent("SetHalfPanel", [false]);

			Event.DispatchEvent("OnPanelClick", [clickType, true, Laya.Handler.create(this, () => {
				//需要文字的引导
				if (Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_2 ||
					Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_3 ||
					Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_6 ||
					Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_8 ||
					Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_9 ||
					Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_10) {
					this.SetintroduceInfo(true);
				}
				this.aperture.on(Laya.Event.CLICK, this, this.ClickBtnEvent);
				this.GuidanceAuto(Laya.Handler.create(this, this.ClickBtnEvent));
				//设置引导位置
				this.NewTeach();
			})]);
		}

		/**
		 * 引导触发效果，派发点击按钮事件
		 * @param EventStr 事件名
		 * @param args 事件参数
		 */
		private ClickBtnEvent(EventStr?: string, args?: Array<any>) {
			this.visible = false;
			//直接派发事件
			if (typeof (EventStr) == "string") {
				Event.DispatchEvent(EventStr, args);
				this.CloseUI();
			}
			//有多级引导
			else {
				//触发按钮事件
				this.ClickButton(Guidance.Instance.guidanceStep);
				switch (Guidance.Instance.guidanceStep) {
					case E_GuidanceStep.E_Guidance_4:
						this.ClickGoWarGuidance_4();
						return;
					case E_GuidanceStep.E_Guidance_5:
						this.ClickGoStar();
						break;
					case E_GuidanceStep.E_Guidance_6:
						this.ClickUpSkill();
						break;
					case E_GuidanceStep.E_Guidance_8:
						this.ClickGoWarGuidance_8();
						return;
					case E_GuidanceStep.E_Guidance_11:
						this.ClickStronger();
						break;
					case E_GuidanceStep.E_Guidance_12:
						this.ClickLaddle();
						break;
					case E_GuidanceStep.E_Guidance_13:
						this.ClickLv();
						break;
					default:
						this.CloseUI();
						break;
				}
			}
		}

		/**自动调整光圈位置 */
		private NewTeach() {
			let guidanceStep = Guidance.Instance.guidanceStep;
			OneTimer(this._oneTimer, () => {
				this.visible = true;
				this.ApertureEffect(0, 3);
				this.ArrowsEffect(0, 1);
				//不需要转坐标的引导
				// if (guidanceStep == E_GuidanceStep.E_Guidance_13) {
				// 	this.SetEffectPos(Guidance.Instance.GetGuidanceButton(Guidance.Instance.guidanceStep).x, Guidance.Instance.GetGuidanceButton(guidanceStep).y + 50, 0, 100);
				// }
				// else {
				let point = this.GetButtonPoint(Guidance.Instance.GetGuidanceButton(guidanceStep), true);
				this.SetEffectPos(point.x, point.y, 0, 100);
				//}
			})
		}

		/**点击引导光圈攻击 */
		private ClickAttack(num: number) {
			this._clickNum += num;
			Event.DispatchEvent("OnSlideDown");
			if (this._clickNum >= 3) {
				this.CloseUI();
				Guidance.Instance.SetGuidanceStep(E_GuidanceStep.E_Guidance_2);
			}
		}
		/**点击我要变强 */
		private ClickStronger() {
			this.SetintroduceInfo(true);
			this.aperture.off(Laya.Event.CLICK, this, this.ClickBtnEvent);
			this.aperture.on(Laya.Event.CLICK, this, this.ClickPrivilege);
			this.GuidanceAuto(Laya.Handler.create(this, this.ClickPrivilege));
			OneTimer(this._oneTimer, () => {
				this.visible = true;
				let point = this.GetButtonPoint(Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_11), true);
				this.SetEffectPos(point.x, point.y, 0, 100);
			})
		}

		/**点击我要变强 特权 */
		private ClickPrivilege() {
			this.ClickButton(E_GuidanceStep.E_Guidance_11);
			this.CloseUI();
			OneTimer(1000, () => {
				Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_7);
			})
		}

		/**点击升级*1 */
		private ClickLv() {
			this.visible = true;
			//触发按钮事
			// let btn: Laya.ComboBox = Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_13) as Laya.ComboBox;
			// btn.isOpen = true;
			let point = this.GetButtonPoint(Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_13 + 1000), true);
			this.SetEffectPos(point.x, point.y, 0, 100);
			this.aperture.off(Laya.Event.CLICK, this, this.ClickBtnEvent);
			this.aperture.on(Laya.Event.CLICK, this, this.ClickLvMax);
			this.GuidanceAuto(Laya.Handler.create(this, this.ClickLvMax));
		}
		/**点击升级*10 */
		private ClickLvMax() {
			this.ClickButton(E_GuidanceStep.E_Guidance_13 + 1000);

			let point = this.GetButtonPoint(Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_13 + 2000), true);
			this.SetEffectPos(point.x, point.y, 0, 100);
			// let btn: Laya.ComboBox = Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_13) as Laya.ComboBox;
			// btn.selectedIndex = 2;
			// Event.DispatchEvent("Btn_shopclick");
			this.aperture.off(Laya.Event.CLICK, this, this.ClickLvMax);
			this.aperture.on(Laya.Event.CLICK, this, this.ClickLvTwoHero);
			this.GuidanceAuto(Laya.Handler.create(this, this.ClickLvTwoHero));
		}

		/**点击升级第二个英雄 */
		private ClickLvTwoHero() {
			this.ClickButton(E_GuidanceStep.E_Guidance_13 + 2000)
			this.CloseUI();
		}

		/**点击布阵页面Guidance_4 */
		private ClickGoWarGuidance_4() {
			this.SetintroduceInfo(true);
			this.Close();
			OneTimer(this._oneTimer, () => {
				this.visible = true;
				let point_1 = this.GetButtonPoint(Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_4 + 2000), true);
				let point_2 = this.GetButtonPoint(Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_4 + 3000), true);
				this.aperture.off(Laya.Event.CLICK, this, this.ClickBtnEvent);
				this.aperture.on(Laya.Event.MOUSE_DOWN, this, this.ExchangePlace);
				this.GuidanceAuto(Laya.Handler.create(this, this.AutoExchangePlace));
				this._arrows.visible = false;
				this.SetEffectPos(point_1.x, point_1.y, 0, 0);
				this.ArrowsSlide(point_1.x, point_1.y - 100, point_2.x, point_2.y - 100, 2000, 0);
			})
		}
		/**点击布阵页面Guidance_8 */
		private ClickGoWarGuidance_8() {
			this.SetintroduceInfo(true);
			this.Close();
			OneTimer(this._oneTimer, () => {
				this.visible = true;
				let point_1 = this.GetButtonPoint(Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_8 + 1000), true);
				let point_2 = this.GetButtonPoint(Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_4 + 3000), true);
				this.aperture.off(Laya.Event.CLICK, this, this.ClickBtnEvent);
				this.aperture.on(Laya.Event.MOUSE_DOWN, this, this.ExchangePlace);
				this.GuidanceAuto(Laya.Handler.create(this, this.AutoExchangePlace));
				this.SetEffectPos(point_1.x, point_1.y, 0, 0);
				this._arrows.visible = false;
				this.ArrowsSlide(point_1.x, point_1.y - 100, point_2.x, point_2.y - 100, 3000, 0);
			})
		}
		/**点击进阶页面 */
		private ClickGoStar() {
			this.SetintroduceInfo(true);
			this.GuidanceType(E_GuidanceType.E_Strong);
			this.aperture.off(Laya.Event.CLICK, this, this.ClickBtnEvent);
			this.aperture.on(Laya.Event.CLICK, this, this.ClickBtnEvent, ["ClickBtnStar"]);
			this.GuidanceAuto(Laya.Handler.create(this, this.ClickBtnEvent, ["ClickBtnStar"]));
			OneTimer(this._oneTimer, () => {
				this.visible = true;
				let point = this.GetButtonPoint(Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_5 + 1000), true);
				this.SetEffectPos(point.x, point.y, 0, 100);
			})
		}
		/**手动交换位置 */
		private ExchangePlace() {
			this.infoBg.visible = true;
			if (Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_4) {
				Event.DispatchEvent("ExchangePlace");
			} else if (Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_8) {
				Event.DispatchEvent("fsTen");
			}
			this.guidBj.visible = false;
			this.aperture.off(Laya.Event.MOUSE_DOWN, this, this.ExchangePlace);
			this.CloseUI();
		}
		/**自动交换位置 */
		private AutoExchangePlace() {
			this.aperture.off(Laya.Event.MOUSE_DOWN, this, this.ExchangePlace);
			if (Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_4) {
				Guidance.Instance.SetGuidanceStep(E_GuidanceStep.E_Guidance_4);
				let heroID = HeroPosition.Instance.PositionWar[0];
				Event.DispatchEvent("PutHero", [4, heroID])
			} else if (Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_8) {
				Guidance.Instance.SetGuidanceStep(E_GuidanceStep.E_Guidance_8);
				let heroID = HeroManager.Instance.Hero_sort(9);
				Event.DispatchEvent("PutHero", [4, heroID])
			}
			this.Close();
			this.SaveWar();
		}
		/**保存布阵 */
		private SaveWar() {
			this.visible = true;
			this.infoBg.visible = false;
			let point = this.GetButtonPoint(Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_4 + 1000), true)
			if (Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_4) {
				CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_war_1, true)
				this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_4, this.ClickBtnEvent, ["SaveWar"], 0, point.x, point.y, 0, 100);
			} else if (Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_8) {
				CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_war_2, true)
				this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_8, this.ClickBtnEvent, ["SaveWar"], 0, point.x, point.y, 0, 100);
			}
		}

		/**解锁技能 */
		private ClickUpSkill() {
			this.SetintroduceInfo(true);
			Event.DispatchEvent("PanelClose");
			this.aperture.off(Laya.Event.CLICK, this, this.ClickBtnEvent);
			this.aperture.on(Laya.Event.CLICK, this, this.ClickOnSkill);
			this.GuidanceAuto(Laya.Handler.create(this, this.ClickOnSkill));
			OneTimer(this._oneTimer, () => {
				this.visible = true;
				this._arrows.rotation = 180;
				let point = this.GetButtonPoint(Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_6 + 1000), true);
				this.SetEffectPos(point.x, point.y, 0, -100);
			})
		}

		/**释放技能 */
		private ClickOnSkill() {
			this.ClickButton(E_GuidanceStep.E_Guidance_6 + 1000)
			this.CloseUI();
		}

		/**天梯匹配 */
		private ClickLaddle() {
			this.SetintroduceInfo(true);
			this.aperture.off(Laya.Event.CLICK, this, this.ClickBtnEvent);
			this.aperture.on(Laya.Event.CLICK, this, this.ClickBtnEvent, ["btnclick_challag"]);
			this.GuidanceAuto(Laya.Handler.create(this, this.ClickBtnEvent, ["btnclick_challag"]));
			OneTimer(this._oneTimer, () => {
				this.visible = true;
				let point = this.GetButtonPoint(Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_12), true);
				this.SetEffectPos(point.x, point.y, 0, 100);
			})
		}

		/**选择引导类型 */
		private GuidanceType(guidanceType: E_GuidanceType) {
			this.storyBj.visible = false;
			this._guidanceType = guidanceType;
			this.spr_1.visible = this.time.visible = guidanceType == E_GuidanceType.E_Strong;
		}

		/**自动引导 */
		private GuidanceAuto(fun: Laya.Handler) {
			Tick.Clear(this, this.AutoTime);
			this._time = 10;
			if (Guidance.Instance.guidanceStep == E_GuidanceStep.E_Aide) {
				this._time = 7;
			}
			Tick.Loop(1000, this, this.AutoTime, [fun]);
		}
		private AutoTime(fun: Laya.Handler) {
			this._time--;
			this.time.text = "自动引导下一步（" + this._time + "s)";
			if (this._time <= 0) {
				fun.run();
			}
		}

		/*******************************特效功能*******************************/
		/**
 		 * 光圈特效加载
 		 * @param direction 旋转
 		 * @param scale 大小
 		 * @param Btn 附载框
 		 */
		private ApertureEffect(direction: number, scale: number, Btn?: any) {
			if (this._aperture) {
				this._aperture.Destroy();
			}
			if (Btn) {
				this._aperture = new Avatar(Btn)
				this._aperture.Load("res/effect/effect_ui_guangquan/effect_ui_guangquan.sk", 1, scale, 50, 50,
					Laya.Handler.create(this, () => {
						this._aperture.Play("effect_ui_guangquan", true, true, () => {
						});
						this._aperture.Armature.rotation = direction;
					}));
			} else {
				this._aperture = new Avatar(this.aperture)
				this._aperture.Load("res/effect/effect_ui_guangquan/effect_ui_guangquan.sk", 1, scale, 50, 50,
					Laya.Handler.create(this, () => {
						this._aperture.Play("effect_ui_guangquan", true, true, () => {
						});
						this._aperture.Armature.rotation = direction;
					}));
			}
		}

		/**
		 * 箭头特效加载
		 * @param direction 旋转
		 * @param scale 大小
		 * @param Btn 附载框
		 */
		private ArrowsEffect(direction: number, scale: number, Btn?: any) {
			this.arrows.skin = "";
			if (this._arrows) {
				this._arrows.Destroy();
			}
			if (Btn) {
				this._arrows = new Avatar(Btn)
				this._arrows.Load("res/effect/effect_ui_jiantou/effect_ui_jiantou.sk", 1, scale, 0, 0,
					Laya.Handler.create(this, () => {
						this._arrows.Play("effect_ui_jiantou", true, true, () => {
						})
						this._arrows.Armature.rotation = direction;
					}));
			} else {
				this._arrows = new Avatar(this.arrows)
				this._arrows.Load("res/effect/effect_ui_jiantou/effect_ui_jiantou.sk", 1, scale, 0, 0,
					Laya.Handler.create(this, () => {
						this._arrows.Play("effect_ui_jiantou", true, true, () => {
						})
						this._arrows.Armature.rotation = direction;
					}));
			}
		}


		/**
		 * 设置特效位置
		 * @param x 光圈、箭头x轴
		 * @param y 光圈、箭头y轴
		 * @param excursion_x 箭头x轴偏移
		 * @param excursion_y 箭头y轴偏移
		 * @param Btn 附载框
		 */
		private SetEffectPos(x: number, y: number, excursion_x: number, excursion_y: number, Btn?: boolean) {
			let value_x = x //* G_StageWidthScale;
			let value_y = y //* G_StageHeightScale;
			let ax = value_x + excursion_x;
			let ay = value_y + excursion_y;
			this.aperture.x = value_x;
			this.aperture.y = value_y;
			this.arrows.x = ax;
			this.arrows.y = ay;
			this.click.x = value_x;
			this.click.y = value_y;
		}

		/**光圈呼吸效果 */
		private SetEffectScale() {
			let x: number = 1;
			Tick.FrameLoop(2, this, () => {
				if (!this._aperture || !this._aperture.loaded) return;
				let scaleValue: number = Math.sin(x);
				scaleValue > 0 ? scaleValue += 4 : scaleValue -= 4;
				this._aperture.scale = scaleValue / 2;
				this.click.scale(scaleValue, scaleValue);
				x += 0.02;
			})
		}

		/**
		 * 获取引导按钮的准确位置
		 * @param button 引导下的按钮
		 * @param bCentre 按钮的锚点是否在中心
		 */
		private GetButtonPoint(button: any, bCentre: boolean) {
			if (button == null || button._destroyed) {
				return new laya.maths.Point(0, 0);
			}
			let x = bCentre ? button.width / 2 : 0;
			let y = bCentre ? button.height / 2 : 0;
			let point = button.localToGlobal(new laya.maths.Point(x, y))
			return NewGuidRoot.globalToLocal(point)
		}


		/**
		 * 点击触发对应按钮
		 * @param eGuidanceStep 
		 * @param bCentre 
		 */
		private ClickButton(eGuidanceStep: number) {
			let btn: Laya.Button = Guidance.Instance.GetGuidanceButton(eGuidanceStep)
			btn.event(Laya.Event.CLICK, btn);
		}

		/** 点点点文字呼吸效果*/
		private GameShowPic() {
			let tween: laya.utils.Tween;
			tween = Laya.Tween.to(this.clickImg, { alpha: 0 }, 500, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
				Laya.Tween.clear(tween);
				tween = Laya.Tween.to(this.clickImg, { alpha: 1 }, 1200, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
					Laya.Tween.clear(tween);
				}));
			}));
		}

		private loop: boolean;
		private comeTween: laya.utils.Tween
		private goTween: laya.utils.Tween
		/**
		 * 手指来回移动功能
		 * @param start_x 起点x轴
		 * @param start_y 起点y轴
		 * @param end_x 终点x轴
		 * @param end_y 终点y轴
		 * @param time 移动总时间
		 * @param rot 旋转
		 */
		private ArrowsSlide(start_x: number, start_y: number, end_x: number, end_y: number, time: number, rot: number = 0) {
			this.arrows.visible = true;
			this.arrows.skin = "ui_guid/ui_shouzhi.png";
			this.arrows.rotation = rot;
			this.arrows.x = start_x //* G_StageWidthScale;
			this.arrows.y = start_y //* G_StageHeightScale;
			//this.Open(start_x * G_StageWidthScale, start_y * G_StageHeightScale, end_x * G_StageWidthScale, end_y * G_StageHeightScale, time);
			this.Open(start_x, start_y, end_x, end_y, time);
		}
		private Open(start_x: number, start_y: number, end_x: number, end_y: number, time: number) {
			this.loop = true;
			this.Come(start_x, start_y, end_x, end_y, time)
		}
		private Close() {
			if (this.comeTween == null || this.goTween == null) return;
			Laya.Tween.clear(this.comeTween);
			Laya.Tween.clear(this.goTween);
		}
		private Come(start_x: number, start_y: number, end_x: number, end_y: number, time: number) {
			this.comeTween = Laya.Tween.to(this.arrows, { x: end_x, y: end_y }, time, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
				if (this.loop) {
					this.Go(start_x, start_y, end_x, end_y, time);
				}
				else {
					this.Close();
				}
			}));
		}
		private Go(start_x: number, start_y: number, end_x: number, end_y: number, time: number) {
			this.goTween = Laya.Tween.to(this.arrows, { x: start_x, y: start_y }, time, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
				if (this.loop) {
					this.Come(start_x, start_y, end_x, end_y, time);
				}
				else {
					this.Close();
				}
			}));
		}
	}
}