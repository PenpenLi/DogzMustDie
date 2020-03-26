/**Created by the LayaAirIDE*/
module H52D_Framework {
	export class MainBubbleView extends ui.main.subinterface.MainBubbleViewUI implements IViewPanel {
		constructor() {
			super();
			this.InitView();
			this.InitEvent();
		}

		private InitEvent() {
			Event.RegistEvent("ClearOneBubble", Laya.Handler.create(this, this.ClearOneBubble));
			Event.RegistEvent("StartBubbleMonster", Laya.Handler.create(this, this.StartBubbleMonster));
			Event.RegistEvent("ClearBubble", Laya.Handler.create(this, this.ClearBubble));
			Event.RegistEvent("SetClickPetButton", Laya.Handler.create(this, this.SetClickPetButton));
		}

		public Destroy(): void {
			Event.RemoveEvent("ClearOneBubble", Laya.Handler.create(this, this.ClearOneBubble));
			Event.RemoveEvent("StartBubbleMonster", Laya.Handler.create(this, this.StartBubbleMonster));
			Event.RemoveEvent("ClearBubble", Laya.Handler.create(this, this.ClearBubble));
			Event.RemoveEvent("SetClickPetButton", Laya.Handler.create(this, this.SetClickPetButton));
		}

		/**英雄对话初始时间 */
		private _heroHreoTime: number = 0;
		/**队长技能提示次数 */
		private _skillBubblNum: number = 1;
		/**队长技能提示时间 */
		private _skillBubblTime: number = 15000;

		private _bubbleImage = {
			0: this.bubble_pet,
			1: this.bubble_hreo,
			2: this.bubble_monster,
			3: this.bubble_skill
		}

		private InitView() {
			this.bubble.visible = true;
			for (let i in this._bubbleImage) {
				this._bubbleImage[i].visible = false;
				this._bubbleImage[i].width = 220;
			}
			this._bubbleImage[2].width = 260;

			this.StartBubble();
		}
		/**气泡渐变 */
		private SetBubbleScale(bubbleType: E_BubbleType, scale: number, hideTime: number) {
			//大小
			TweenList.to(this, this._bubbleImage[bubbleType], { scaleX: scale, scaleY: scale }, 200,
				() => {
					this._bubbleImage[bubbleType].scale(1, 1);
					if (bubbleType == E_BubbleType.eHero) return;
					Tick.Clear(this, this.SetBubbleAlpha);
					Tick.Once(hideTime, this, this.SetBubbleAlpha, [bubbleType])

				}, 0, Laya.Ease.backInOut)
		}
		/**气泡渐变 */
		private SetBubbleAlpha(bubbleType: E_BubbleType) {
			TweenList.to(this, this._bubbleImage[bubbleType], { alpha: 0 }, 1000,
				() => {
					this._bubbleImage[bubbleType].visible = false;
					this._bubbleImage[bubbleType].alpha = 0;
					this._bubbleImage[bubbleType].scale(0, 0);
					BubbleManager.Instance.bMonsterFirst = false;
					Tick.Clear(this, this.SetBubbleAlpha);

				}, 0, Laya.Ease.linearIn)
		}

        /**强制关闭所有气泡
         * @param bubbleType 不关闭的气泡类型
         */
		private ClearBubble(bubbleType: E_BubbleType = -1) {
			Tick.Clear(this, this.SetBubbleAlpha);

			for (let bubble in this._bubbleImage) {
				if (bubbleType != Number(bubble)) {
					this._bubbleImage[bubble].visible = false;
					this._bubbleImage[bubble].alpha = 1;
					this._bubbleImage[bubble].scale(0, 0);
				}
			}

		}

        /**强制关闭指定气泡
         * @param bubbleType 不关闭的气泡类型
         */
		private ClearOneBubble(bubbleType: E_BubbleType) {
			this._bubbleImage[bubbleType].visible = false;
			this._bubbleImage[bubbleType].alpha = 1;
			this._bubbleImage[bubbleType].scale(0, 0);
		}

		/**开启所有气泡入口 */
		private StartBubble() {
			this._heroHreoTime = GameParamConfig.HeroTalkInterval * 1000;
			let monsterTime: number = GameParamConfig.MonsterTalkCD * 1000;
			Tick.Loop(this._heroHreoTime, this, this.RandTime);
			Tick.Loop(monsterTime, this, this.StartBubbleMonster, [E_BubbleType.eMonster, 1, null, true, true]);
			this.clickPet.on(Laya.Event.CLICK, this, this.StartBubblePet, [E_BubbleType.ePet, 1]);
			Tick.Loop(this._skillBubblTime, this, this.StartBubbleSkill, [E_BubbleType.eSkill, 1]);
		}

		private _cartridge = new Cartridge();
		private RandTime() {
			let num = Math.random() * 100;
			let heroTalkProbability = GameParamConfig.HeroTalkProbability;
			if (!this.CheckCanShowBubble(-1)) {
				return;
			}
			if (num < heroTalkProbability) {
				this.StartBubbleHreo(E_BubbleType.eHero, 1);
				Tick.Clear(this, this.RandTime);
			} else {
				this._heroHreoTime = GameParamConfig.HeroTalkInterval * 1000;
			}
		}

		/**开启技能提示气泡 */
		private StartBubbleSkill(bubbleType: E_BubbleType, scale: number = 1) {
			//引导中
			if (Guidance.Instance._bProceeding) {
				return;
			}
			if (this._skillBubblNum >= 5) {
				return
			}
			this._skillBubblNum++;

			let x = 370;
			let y = 820;
			let str: string = GetInfoAttr.Instance.GetText(7071);
			let hideTime: number = 4000;
			let html: Laya.HTMLDivElement = this._bubbleImage[bubbleType].getChildByName('text');
			let strLen = str.length / 9 >> 0;
			html.width = this._bubbleImage[bubbleType].width - 8;
			this._bubbleImage[bubbleType].height = 64 + strLen * 26;
			SetHtmlStyle(html, 20, "#231614", "left", true);
			html.innerHTML = str;
			this._bubbleImage[bubbleType].x = x;
			this._bubbleImage[bubbleType].y = y;

			this._bubbleImage[bubbleType].visible = true;
			this._bubbleImage[bubbleType].alpha = 1;
			this._bubbleImage[bubbleType].scale(0, 0);
			//大小
			TweenList.to(this, this._bubbleImage[bubbleType], { scaleX: scale, scaleY: scale }, 200,
				() => {
					this._bubbleImage[bubbleType].scale(1, 1);
					Tick.Once(hideTime, this, () => {
						TweenList.to(this, this._bubbleImage[bubbleType], { alpha: 0 }, 1000,
							() => {
								this._bubbleImage[bubbleType].visible = false;
								this._bubbleImage[bubbleType].alpha = 0;
								this._bubbleImage[bubbleType].scale(0, 0);
							}, 0, Laya.Ease.linearIn)
					})
				}, 0, Laya.Ease.backInOut)
		}

		/**开启英雄气泡 */
		private StartBubbleHreo(bubbleType: E_BubbleType, scale: number, heroTalkId?: number) {
			//引导中
			if (Guidance.Instance._bProceeding) {
				return;
			}
			//已经有冒泡进行中
			if (!this.CheckCanShowBubble(-1)) {
				return
			}
			let id: number = BubbleManager.Instance.RandomHeroBubbleID();
			if (id == null) {
				return
			}
			this.ClearBubble(E_BubbleType.eSkill);
			let heroWord = HeroWordConfig[id];
			this._cartridge.Clear()
			for (let heroTalkId in heroWord) {
				let x = 0;
				let y = 0;
				let cfg: any;
				let heroid: number;
				let str: string = "";
				let hideTime: number = 0;

				let idx = heroTalkId;
				let func = Laya.Handler.create(this, () => {
					heroid = heroWord[idx].heroid;
					str = GetInfoAttr.Instance.GetText(heroWord[idx].word[1]);
					hideTime = heroWord[idx].word[2];

					if (!HeroCardManager.Instance.GetHeroCardByid(heroid)) {
						return;
					}
					x = HeroCardManager.Instance.GetHeroCardByid(heroid).PosX + 20;
					y = HeroCardManager.Instance.GetHeroCardByid(heroid).PosY - 72;

					this.SetBubble(bubbleType, 1, hideTime, str, 20, x, y);

				})
				this._cartridge.AddFunc(func)
				hideTime = heroWord[idx].word[2];
				this._cartridge.AddDelay(hideTime);
			}
			let funss = Laya.Handler.create(this, () => {
				this.SetBubbleAlpha(bubbleType);
				this._heroHreoTime = GameParamConfig.HeroTalkCD * 1000;
				Tick.Loop(this._heroHreoTime, this, this.RandTime);
			})
			this._cartridge.AddFunc(funss)
			this._cartridge.AddDelay(100)
			this._cartridge.Do();
		}


		/**开启怪物气泡 */
		private StartBubbleMonster(bubbleType: E_BubbleType, scale: number, bubbleId?: number, b?: boolean, bfirst: boolean = false) {
			//引导中
			if (Guidance.Instance._bProceeding || CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
				return;
			}
			//已经有冒泡进行中
			if (!this.CheckCanShowBubble(bubbleType)) {
				return
			}
			BubbleManager.Instance.bMonsterFirst = bfirst;
			BubbleManager.Instance.bMonsterBubble = b;
			this.ClearBubble(E_BubbleType.eSkill);
			let x = 0;
			let y = 0;
			let cfg: any;
			let id: number = 0;
			let str: string = "";
			let hideTime: number = 0;
			let monId: number = 0;
			if (MonsterManager.Instance.monsterList == null || MonsterManager.Instance.monsterList[0] == null) {
				return;
			}
			monId = MonsterManager.Instance.monsterList[0].vo.id;
			let nameId = MonstorConfig[monId].NameId;
			id = bubbleId ? bubbleId : nameId;
			if(!MonsterWordConfig[id]){
				return
			}
			let MonstorWord = MonsterWordConfig[id].word;
			let MonstorCfgLen = GetTabLength(MonstorWord);
			let RandId = (Math.random() * MonstorCfgLen) + 1 << 0;
			let strId = MonsterWordConfig[id].word[RandId][1];
			str = GetInfoAttr.Instance.GetText(strId)
			hideTime = MonsterWordConfig[id].word[RandId][2];
			if (CustomsManager.Instance.bBoss) {
				x = MonsterManager.Instance.monsterList[0].PosX - 200;
				y = MonsterManager.Instance.monsterList[0].PosY - 300;
			} else {
				x = MonsterManager.Instance.monsterList[0].PosX - 150;
				y = MonsterManager.Instance.monsterList[0].PosY - 250;
			}
			this.SetBubble(bubbleType, 1, hideTime, str, 20, x, y);
		}

		/**开启神兽气泡 */
		private StartBubblePet(bubbleType: E_BubbleType, scale: number, bubbleId?: number) {
			//引导中
			if (Guidance.Instance._bProceeding) {
				return;
			}
			//已经有冒泡进行中
			if (!this.CheckCanShowBubble(bubbleType) || PetManager.Instance.CurrentpetID == 0) {
				return
			}
			this.ClearBubble(E_BubbleType.eSkill);
			let x = 0;
			let y = 0;
			let cfg: any;
			let str: string = "";
			let strLen: number = 0;
			let hideTime: number = 0;
			let id: number = bubbleId;
			let petLen = GetTabLength(PetWordConfig);
			let sceneId = SceneManager.Instance.sceneId - 10000;


			id = (Math.random() * petLen) + 1 << 0;;
			str = GetInfoAttr.Instance.GetText(PetWordConfig[id].word[1]);
			hideTime = PetWordConfig[id].word[2];

			x = PetPoint[sceneId][0] + 10;
			y = PetPoint[sceneId][1] - 80;

			this.SetBubble(bubbleType, 1, hideTime, str, 18, x, y);
		}


		/**
		 * 设置气泡统一接口
		 * @param bubbleType 气泡类型
		 * @param scale 气泡大小
		 * @param hideTime 气泡持续时间
		 * @param str 气泡内容
		 * @param strScale 气泡内容文字大小 
		 * @param x 气泡x轴
		 * @param y 气泡y轴
		 */
		private SetBubble(bubbleType: E_BubbleType, scale: number, hideTime: number, str: string, strScale: number, x: number, y: number) {

			let html: Laya.HTMLDivElement = this._bubbleImage[bubbleType].getChildByName('text');
			let strLen = str.length / 9 >> 0;
			html.width = this._bubbleImage[bubbleType].width - 6;
			this._bubbleImage[bubbleType].height = 64 + strLen * 24;

			SetHtmlStyle(html, strScale, "#231614", "left", true);
			html.innerHTML = str;

			this._bubbleImage[bubbleType].x = x;
			this._bubbleImage[bubbleType].y = y;
			this._bubbleImage[bubbleType].alpha = 1;
			this._bubbleImage[bubbleType].scale(0, 0);
			this._bubbleImage[bubbleType].visible = true;
			this.SetBubbleScale(bubbleType, scale, hideTime);
		}

		private CheckCanShowBubble(bubbleType: E_BubbleType): boolean {
			for (let eBubbleType in this._bubbleImage) {
				if (Number(eBubbleType) == E_BubbleType.eSkill) {
					continue;
				}
				if (bubbleType != Number(eBubbleType)) {
					let image = this._bubbleImage[eBubbleType]
					if (image.visible) {
						return false;
					}
				}
			}
			return true;
		}

		private SetClickPetButton(x: number, y: number) {
			this.clickPet.x = x;
			this.clickPet.y = y;
		}
	}
}