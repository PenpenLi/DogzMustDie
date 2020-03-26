/**Created by the LayaAirIDE*/
module H52D_Framework {
	export class HeroStar extends ui.heroList.HeroStarUI {
		private _Lveffect;
		private _icon: any;
		private nHeroID;
		constructor(buf) {
			super();
			this.AddEvent();
			this.heroStar_List.vScrollBarSkin = "";
			this.UpdateList();
			this.ChangeListHigth();
			this.Refesh();			
		}
		private _once: boolean = false;

		private AddEvent() {
			Event.RegistEvent('ReqHeroStartUps', Laya.Handler.create(this, this.ReqHeroStartUps));//ClickBtnStar
			Event.RegistEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
			Event.RegistEvent('ClickBtnStar', Laya.Handler.create(this, this.NewTeach_Star));
			Event.DispatchEvent("ShowMaxBtn", [true]);
		}

		private OnDestroy(): void {
			this.offAll();
			Event.RemoveEvent('ReqHeroStartUps', Laya.Handler.create(this, this.ReqHeroStartUps))
			Event.RemoveEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
			Event.RemoveEvent('ClickBtnStar', Laya.Handler.create(this, this.NewTeach_Star));
		}

		private ChangeListHigth(): void {
			if (ViewUILogic.Instance.halfPanel) {
				if (this.destroyed) return;
				this.heroStar_List.height = 230 * G_StageHeightScale;
			} else {
				this.heroStar_List.height = (1040 - wxsclae) * G_StageHeightScale;
			}
		}

		private bool: boolean = false;
		/** 进阶成功 */
		private ReqHeroStartUps() {
			TipsLogic.Instance.OpenSystemTips("英雄进阶成功！");
			//this.UpdateList();
			this.Refesh();
			this.LvUpEffect();
			Event.DispatchEvent(EventDefine.MODIFYATTR, [this.nHeroID]);
		}

		/***播放晋阶特效 */
		private LvUpEffect() {
			this._Lveffect = new Avatar(this._icon)
			this._Lveffect.Load("res/effect/effect_ui_shengji/effect_ui_shengji.sk", 1, 2, 46, 46,
				Laya.Handler.create(this, () => {
					//this._Lveffect.visible=true;
					this._Lveffect.Play("effect_ui_shengji", false, true, () => {
						this._Lveffect.Destroy();
					})
				}));
			SoundManager.Instance.OnPlaySound("res/sound/level_up.mp3");
		}

		private heroList: Array<number> = [];//存放英雄的id

		private UpdateList(): void {
			this.heroList = HeroManager.Instance.GetCfgHeroList();
			this.SortHero(true);
			this.heroStar_List.array = this.heroList;
			this.heroStar_List.renderHandler = new Laya.Handler(this, this.ListStar);
			//刷新红点
			Event.DispatchEvent("UpdateRedPoint");
		}

		private Refesh() {
			this.heroList = HeroManager.Instance.GetCfgHeroList();
			this.heroStar_List.array = this.heroList;
			this.heroStar_List.renderHandler = new Laya.Handler(this, this.ListStar);
			//刷新红点
			Event.DispatchEvent("UpdateRedPoint");
			this.SortHero();
		}

		/**新手指导 激活英雄 */
		private NewTeach_Star() {
			let nHeroId = this.heroList[0];
			this.BtnStatUp(nHeroId);
		}

		private SortHero(bool?) {
			function tsort(left, right): number {
				let leftActive = HeroManager.Instance.IsActive(left)
				let leftCan = leftActive && HeroManager.Instance.HeroIsStar(left)
				let left_quality = HeroConfig[left].heroPosition;
				let rightActive = HeroManager.Instance.IsActive(right)
				let rightCan = rightActive && HeroManager.Instance.HeroIsStar(right)
				let right_quality = HeroConfig[right].heroPosition;

				if (leftCan != rightCan) {
					return leftCan ? -1 : 1
				}
				if (leftActive != rightActive) {
					return leftActive ? -1 : 1
				}
				if (left_quality && left_quality != right_quality) {
					return left_quality < right_quality ? -1 : 1;
				}
				return left - right
			}
			if (bool) {
				this.heroList.sort(tsort);
			}

		}

		private bGuidanceButton = true;
		/**对英雄列表赋值 */
		private ListStar(item, index: number): void {
			//let lock: Laya.Image = item.getChildByName("Lock");
			let icon: Laya.Image = item.getChildByName("hero_Icon");
			let icon_bg: Laya.Image = item.getChildByName("pinzhi_bg");
			let name: Laya.Label = item.getChildByName("hero_Name");
			let hp: Laya.Label = item.getChildByName("hero_Hp");
			let hurt: Laya.Label = item.getChildByName("hero_Hurt");
			let starNum: Laya.Label = item.getChildByName("hero_StarNum");
			let btn_starup: Laya.Button = item.getChildByName("Btn_StarUp");
			let up_start: Laya.Label = btn_starup.getChildByName("UP_Start") as Laya.Label;
			let type_icon: Laya.Image = item.getChildByName("hero_TypeIcon");
			//let itemNum: Laya.Label = item.getChildByName("ItemNum");
			//let heropoker: Laya.Image = btn_starup.getChildByName("Hero_Poker") as Laya.Image;
			let Star_Max: Laya.Label = item.getChildByName("Star_Max");
			let Star_Maximg: Laya.Image = item.getChildByName("star_max");
			let changeBase: Laya.Label = btn_starup.getChildByName("BaseChange") as Laya.Label;
			let item_num: Laya.HTMLDivElement = btn_starup.getChildByName("ItemNum") as Laya.HTMLDivElement;
			let btnlock: Laya.Label = item.getChildByName("Btn_lock");
			//引导按钮
			if (index == 0 && this.bGuidanceButton) {
				Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_5 + 1000, btn_starup)
				this.bGuidanceButton = false;
			}

			let max_star = HeroManager.Instance.HeroMaxStar;
			Star_Maximg.visible = Star_Max.visible;
			item_num.mouseThrough = true;
			let heroid = this.heroList[index];
			let info = HeroConfig[heroid];
			let hero = HeroManager.Instance.GetHero(heroid);
			icon_bg.skin = BaseDefine.QualityList[info.quality]
			let nActive = HeroManager.Instance.IsActive(heroid);//英雄是否激活
			Star_Max.visible = false;
			let path = "<img src= " + "'ui_icon/" + info.strIcon + "'" + " width='24px' height='24px'></img>"
			icon.gray = true;
			if (nActive) {
				btn_starup.visible = true;
				up_start.visible = true;
				icon.gray = false;
				let star = hero.Star == 0 ? 1 : hero.Star;
				if (hero.Star == 0) {
					star = 1;
				}
				else {
					star = hero.Star;
				}
				type_icon.skin = BaseDefine.HeroTypeIcon[hero.heroCfg.type];
				if (hero.Star == HeroManager.Instance.HeroMaxStar) {
					item_num.visible = false;
					changeBase.visible = false;
					Star_Max.visible = true;
					Star_Maximg.visible = Star_Max.visible;
					btn_starup.visible = false;
					let nstarc_Cfg = HeroAdvanceConfig[heroid][star]					
					for (let i = 1; i <= max_star; i++) {
						let star: Laya.Image = item.getChildByName("Star_Icon" + i);
						star.visible = true;
					}
					type_icon.visible = true;
					icon.skin = hero.HeadIcon;
					starNum.text = hero.Star.toString() + "阶";//

					item_num.innerHTML = path + nstarc_Cfg.Consume[1][2].toString();
					let basename = nstarc_Cfg.Attr[1][1];
					let basevalue = (nstarc_Cfg.Attr[1][2] / 100 + "%").toString();
					hp.text = GetInfoAttr.Instance.GetText(basename) + "X" + basevalue;
					hurt.text = GetInfoAttr.Instance.GetText(nstarc_Cfg.Attr[2][1]) + "X" + (nstarc_Cfg.Attr[2][2] / 100 + "%").toString();
					let nFloor = Math.floor(hero.Star / max_star);
					let nOpenStar = hero.Star % max_star;
					for (let nIdx = 1; nIdx <= max_star; nIdx++) {
						let Staricon_Num: Laya.Image = item.getChildByName("Star_Icon" + nIdx);
						Staricon_Num.visible = true;
						if (nIdx <= nOpenStar) {
							Staricon_Num.skin = HeroManager.Instance.StarColorurl[nFloor + 1]
						} else {
							Staricon_Num.skin = HeroManager.Instance.StarColorurl[nFloor]
						}
					}
				}
				else {
					let nstarc_Cfg = HeroAdvanceConfig[heroid][star];				
					for (let i = 1; i <= max_star; i++) {
						let star: Laya.Image = item.getChildByName("Star_Icon" + i);
						star.visible = true;
					}
					type_icon.visible = true;
					icon.skin = hero.HeadIcon;
					if (hero.Star < 1) {
						hp.visible = false;
						hurt.visible = false;
					}
					else {
						hp.visible = true;
						hurt.visible = true;
					}
					starNum.text = hero.Star.toString() + "阶";
					let ItemID = nstarc_Cfg.Consume[1][1];
					let ItemNum = BagManager.Instance.getItemNumber(ItemID);
					if (ItemNum < HeroAdvanceConfig[heroid][hero.Star + 1].Consume[1][2]) {
						SetHtmlStyle(item_num, 20, "#7f190b", "center")
					}
					else {
						SetHtmlStyle(item_num, 20, "#2ae52a", "center")
					}
					changeBase.text = "属性加成" + (HeroAdvanceConfig[heroid][star + 1].Attr[2][2] / 100 + "%").toString();
					if (hero.Star < 1) {
						changeBase.text = "属性加成" + (HeroAdvanceConfig[heroid][1].Attr[2][2] / 100 + "%").toString();
					}
					item_num.innerHTML = path + ItemNum + "/" + HeroAdvanceConfig[heroid][hero.Star + 1].Consume[1][2];
					let basename = nstarc_Cfg.Attr[1][1];
					let basevalue = (nstarc_Cfg.Attr[1][2] / 100 + "%").toString();
					hp.text = GetInfoAttr.Instance.GetText(basename) + "" + basevalue;
					hurt.text = GetInfoAttr.Instance.GetText(nstarc_Cfg.Attr[2][1]) + "" + (nstarc_Cfg.Attr[2][2] / 100 + "%").toString();

					if (HeroAdvanceConfig[heroid][hero.Star + 1].Consume[1][2] > ItemNum) {
						btn_starup.gray = true;
						btn_starup.mouseEnabled = false;
					}
					else {
						btn_starup.mouseEnabled = true;
						btn_starup.gray = false;
					}
					let nFloor = Math.floor(hero.Star / max_star)
					let nOpenStar = hero.Star % max_star
					for (let nIdx = 1; nIdx <= max_star; nIdx++) {
						let Staricon_Num: Laya.Image = item.getChildByName("Star_Icon" + nIdx);
						if (nIdx <= nOpenStar) {
							Staricon_Num.skin = HeroManager.Instance.StarColorurl[nFloor + 1]
						} else {
							Staricon_Num.skin = HeroManager.Instance.StarColorurl[nFloor]
						}
					}
				}
			}
			else {
				let hero_list = HeroManager.Instance.GetCfgHeroList();
				changeBase.visible = false;
				up_start.fontSize = 24;
				let star = 1;
				let nstarc_Cfg = HeroAdvanceConfig[heroid][star];
				let ItemID = nstarc_Cfg.Consume[1][1];
				let ItemNum = BagManager.Instance.getItemNumber(ItemID);
				SetHtmlStyle(item_num, 20, "#7f190b", "center");
				item_num.innerHTML = path + "0/" + nstarc_Cfg.Consume[1][2].toString();
				//icon.visible = true;
				type_icon.visible = false;
				btn_starup.gray = true;
			}
			name.color = BaseDefine.LabelColor[info.quality];
			name.text = GetInfoAttr.Instance.GetText(info.name);
			btn_starup.on(Laya.Event.CLICK, this, this.BtnStatUp, [heroid, icon]);
			icon.skin = "ui_icon/" + info["strIcon"];
			//heropoker.skin = "ui_icon/" + info["strIcon"];
			//改变money颜色，无视上边设置
			SetHtmlStyle(item_num, 20, "#c5ffa5", "center");
		}

		/**英雄进阶 */
		private BtnStatUp(heroid: number, icon?: any): void {
			//播放按钮音效
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
			this._icon = icon;
			let itemnum;
			this.nHeroID = heroid;
			let item,starnum;			 
			let hero = HeroManager.Instance.GetHero(heroid);
			if (!hero) {
				TipsLogic.Instance.OpenSystemTips("英雄未激活！");
			}
			else {
				starnum = hero.Star;
				if (starnum >= HeroManager.Instance.HeroMaxStar) {

				}
				else {
					let iteminfo = HeroAdvanceConfig[heroid][starnum + 1].Consume;
					item = iteminfo[1][1];
					itemnum = iteminfo[1][2];
					if (BagManager.Instance.getItemNumber(item) < itemnum) {						
						return
					}
					HeroManager.Instance.HeroStartUp(heroid);
				}
			}
		}
	}
}