/**Created by the LayaAirIDE*/
module H52D_Framework {
	export class HeroLvUp extends ui.heroList.HeroLvUpUI {
		private _icon;
		private nHeroID;
		private _btn;
		private _lv;
		private _iconlock;
		private static _Indx = 0;
		private _time = 0;
		private static nIdex: number = 1;
		//private _isclick=false;
		private _Lveffect: Avatar = null;
		private _tabItemIndex: number = 0;
		private _lock: boolean = false;
		constructor(buf) {
			super();
			this._tabItemIndex = 0;
			this.List_hero.vScrollBarSkin = "";
			this.Btn_shop.visible = true;

			this.Btn_shop.text = this.btn_label[HeroLvUp.nIdex];
			this.Btn_shop1.visible = false;
			this.Btn_shop10.visible = false;
			this.Btn_shopMax.visible = false;
			//this.BtnShop.selectedIndex=0;
			Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_13, this.Btn_shop)
			Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_13 + 1000, this.Btn_shopMax)
			HeroPosition.Instance.InitPosInfo();
			//this.UpdateList();
			this.Refesh();
			this.ChangeListHigth();
			this.AddEvent();
			this.Btn_OnClick();
		}


		private btn_label = {
			0: "升级",
			1: "升级X1",
			2: "升级X10",
			3: "升级最大",
		}
		private Refesh() {
			//this.BtnShop.selectedIndex = HeroLvUp._Indx;
			this.hero = HeroManager.Instance.GetCfgHeroList();
			HeroManager.Instance.SortHero(this.hero, true);
			this.List_hero.array = this.hero;
			this.List_hero.renderHandler = new Laya.Handler(this, this.BtnList);
			//this.BtnShop.selectHandler = new Laya.Handler(this, this.BtnShopClick);
		}

		private Btn_enum = {
			1: this.Btn_shop,
			2: this.Btn_shop1,
			3: this.Btn_shop10,
			4: this.Btn_shopMax,
		}

		private Btn_OnClick() {
			this.Btn_shop.on(Laya.Event.CLICK, this, this.Btn_shopclick, [1]);
			this.Btn_shop1.on(Laya.Event.CLICK, this, this.Btn_shopclick, [2]);
			this.Btn_shop10.on(Laya.Event.CLICK, this, this.Btn_shopclick, [3]);
			this.Btn_shopMax.on(Laya.Event.CLICK, this, this.Btn_shopclick, [4]);

		}
		private AddEvent() {
			Event.RegistEvent('ClickActivate', Laya.Handler.create(this, this.NewTeach_Active));
			Event.RegistEvent('ChangeMoeny', Laya.Handler.create(this, this.ChangeMoney));
			Event.RegistEvent('ReqActivateHero', Laya.Handler.create(this, this.ReqActivateHero));
			Event.RegistEvent('ReqHeroLevelUp', Laya.Handler.create(this, this.ReqHeroLevelUp));
			Event.RegistEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
			Event.RegistEvent('ClickUpgrade', Laya.Handler.create(this, this.NewTeach_LvUp));
			Event.RegistEvent('TweenToOnesHero', Laya.Handler.create(this, this.TweenToOnesHero));
			// Event.RegistEvent('Btn_shopclick', Laya.Handler.create(this, this.BtnShopClick));
			Event.DispatchEvent("ShowMaxBtn", [true]);
			//this.BtnShop.on(Laya.Event.CLICK,this,this.BtnShopClick)
		}

		private ChangeMoney() {
			this.UpdateList();
		}

		// 移除事件监听
		private OnDestroy(): void {
			this.offAll();
			//this._Lveffect.Destroy();
			Event.RemoveEvent('ClickActivate', Laya.Handler.create(this, this.NewTeach_Active));//激活按钮
			Event.RemoveEvent('ChangeMoeny', Laya.Handler.create(this, this.ChangeMoney));
			Event.RemoveEvent('ReqActivateHero', Laya.Handler.create(this, this.ReqActivateHero));
			Event.RemoveEvent('ReqHeroLevelUp', Laya.Handler.create(this, this.ReqHeroLevelUp));
			Event.RemoveEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
			Event.RemoveEvent('ClickUpgrade', Laya.Handler.create(this, this.NewTeach_LvUp));
			Event.RemoveEvent('TweenToOnesHero', Laya.Handler.create(this, this.TweenToOnesHero));
			// Event.RemoveEvent('Btn_shopclick', Laya.Handler.create(this, this.BtnShopClick));
		}

		private ChangeListHigth(): void {
			if (ViewUILogic.Instance.halfPanel) {
				if (this.destroyed) return;
				this.List_hero.height = 230 * G_StageHeightScale;
			}
			else {
				this.List_hero.height = (1028 - wxsclae) * G_StageHeightScale;
			}
		}
		/** 激活成功 */
		private ReqActivateHero() {
			this.LvUpEffect();
			TipsLogic.Instance.OpenSystemTips("英雄激活成功！");
			SoundManager.Instance.OnPlaySound("res/sound/level_up.mp3");
			OneTimer(500, () => {
				this.UpdateList(false);
			});
			Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_8);
		}
		/** 升级成功 */
		private ReqHeroLevelUp() {
			TipsLogic.Instance.OpenSystemTips("英雄升级成功！");
			this.LvUpEffect();
			Event.DispatchEvent(EventDefine.ADD_GOLD);
			// this.UpdateList();
			SoundManager.Instance.OnPlaySound("res/sound/level_up.mp3");
			OneTimer(300, () => {
				this.UpdateList();
			});
		}

		/***播放特效 */
		private LvUpEffect() {
			this._Lveffect = new Avatar(this._icon)
			this._Lveffect.Load("res/effect/effect_ui_shengji/effect_ui_shengji.sk", 1, 2.0, 46, 46,
				Laya.Handler.create(this, () => {
					//this._Lveffect.visible=true;
					this._Lveffect.Play("effect_ui_shengji", false, true, () => {
						this._Lveffect.Destroy();
					})
				}));
		}

		private skill: Array<any> = [];
		private hero: Array<any> = [];

		private UpdateList(bool?: boolean): void {
			bool = false;
			this.hero = HeroManager.Instance.GetCfgHeroList();
			HeroManager.Instance.SortHero(this.hero, bool);
			this.List_hero.array = this.hero;
			this.List_hero.refresh();
			this.List_hero.renderHandler = new Laya.Handler(this, this.BtnList);
			Event.DispatchEvent("UpdateRedPoint");
		}

		/**新手指导 激活英雄 */
		private NewTeach_Active() {
			let nHeroId = this.List_hero.array[0];
			HeroManager.Instance.OpenHero(nHeroId);
		}

		/**新手引导  升级 */
		private NewTeach_LvUp(num: number = 1) {
			let tArr = this.List_hero.array
			let nIndex: number
			let nNum: number = 0;
			for (let index in tArr) {
				let id = tArr[index]
				if (HeroManager.Instance.IsActive(id)) {
					nIndex = Number(index);
					nNum++;
				}
				if (nNum >= num) {
					nIndex = Number(index);
					break
				}
			}

			this.nHeroID = tArr[nIndex];
			let lv = HeroManager.Instance.MaxLvUp(this.nHeroID, MasterPlayer.Instance.player.Level);
			if (HeroManager.Instance.GetHero(this.nHeroID).Level >= lv) {
				return;
			}
			this.LvUpHero(this.nHeroID, HeroManager.Instance.GetHero(this.nHeroID).Level + 1);
		}

		private TweenToOnesHero(num: number = 1) {
			let tArr = this.List_hero.array
			let nIndex: number

			for (let index in tArr) {
				let id = tArr[index]
				if (HeroManager.Instance.IsActive(id)) {
					let heroId;
					nIndex = Number(index);
					if ((num - 1) == nIndex) {
						return;
					}
					heroId = tArr[(num - 1)]
					tArr[(num - 1)] = id;
					tArr[nIndex] = heroId;
					break;
				}
			}

			this.UpdateList(false);
		}

		private bGuidanceButton = true;
		private BtnList(item, index: number): void {
			let nHeroID = this.hero[index]
			let tCfg = HeroConfig[nHeroID]
			let Item_id = tCfg.needItem;
			let Item_tcfg = ItemConfig[Item_id].Line;
			let nx = tCfg.heroRatio;
			let nType = tCfg.type
			// 是否激活
			let bActive = HeroManager.Instance.IsActive(nHeroID);
			let n_canActive = HeroManager.Instance.HeroIstrue(nHeroID);//检测英雄是否满足激活条件
			let herotype: Laya.Image = item.getChildByName("HeroType");
			let level: Laya.Label = item.getChildByName("HeroLevel");//拿到人物等级信息
			let icon: Laya.Image = item.getChildByName("HeadIcon");
			let hero_war: Laya.Image = icon.getChildByName("War_img") as Laya.Image;
			let hero_warbg: Laya.Image = icon.getChildByName("War_bg") as Laya.Image;
			let hero_point: Laya.Image = icon.getChildByName("hero_point") as Laya.Image;
			let icon_bg: Laya.Image = item.getChildByName("pinzhi_bg");
			let hero_name: Laya.Label = item.getChildByName("HeroName");
			let hurt: Laya.Label = item.getChildByName("HeroHurt");
			let hp: Laya.Label = item.getChildByName("HeroHp");
			let btn_1: Laya.Button = item.getChildByName("Btn_1");
			let btn_label: Laya.Label = btn_1.getChildByName("Btn_label") as Laya.Label;
			let money_html: Laya.HTMLDivElement = btn_1.getChildByName("money") as Laya.HTMLDivElement;
			let nlock: Laya.Label = btn_1.getChildByName("lvup_lock") as Laya.Label;
			let btn_img: Laya.Image = btn_1.getChildByName("btn_img") as Laya.Image;
			let new_logo: Laya.Image = btn_1.getChildByName("new_logo") as Laya.Image;
			let btn_2: Laya.Button = item.getChildByName("Btn_2");
			let skill: Laya.Label = item.getChildByName("Btn_skill");
			let btn_labels: Laya.Label = item.getChildByName("Btn_labels");
			let Addhurt: Laya.Label = item.getChildByName("Add_Hurt");
			let Addhp: Laya.Label = item.getChildByName("Add_hp");
			let icon1: Laya.Image = item.getChildByName("heroicon1");
			let get_name: Laya.Label = item.getChildByName("get_LandName");
			let get_land1: Laya.Label = item.getChildByName("get_Land1");
			let get_land2: Laya.Label = item.getChildByName("get_Land2");
			let get_land3: Laya.Label = item.getChildByName("get_Land3");
			let img_max: Laya.Image = item.getChildByName("lv_max");
			btn_1.gray = false
			new_logo.visible = n_canActive;
			herotype.skin = BaseDefine.HeroTypeIcon[nType];
			btn_2.on(Laya.Event.CLICK, this, this.HeroAllInfo, [nHeroID]);
			hero_name.text = GetInfoAttr.Instance.GetText(tCfg.name);
			hero_name.color = BaseDefine.LabelColor[tCfg.quality];
			icon.skin = "ui_icon/" + tCfg.strIcon;
			SetHtmlStyle(money_html, 20, "#c5ffa5", "center");
			let path = "<img src= 'ui_main/icon-jinbi.png' width='24px' height='24px'></img>"
			money_html.innerHTML = path;
			let my_money = BagManager.Instance.getItemNumber(1);
			let _playlv = MasterPlayer.Instance.player.Level;
			let myNum = BagManager.Instance.getItemNumber(tCfg.needItem);
			icon_bg.skin = BaseDefine.QualityList[tCfg.quality];
			btn_1.mouseEnabled = true;
			btn_labels.visible = false;
			hero_war.skin = "";
			nlock.visible = false;
			nlock.color = "#892020";
			hero_point.visible = false
			btn_1.visible = true;
			money_html.visible = true;
			img_max.visible = false
			//引导按钮
			if (index == 0 && this.bGuidanceButton) {
				Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_2, btn_1)
				Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_3, btn_1)
				Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_13 + 2000, btn_1)
				this.bGuidanceButton = false
			}
			hero_warbg.visible = HeroPosition.Instance.IsInWar(nHeroID);
			if (bActive) {
				let bool = CacheManager.Instance.getDerailByType(CacheTypeEnum.hero,
					nHeroID);
				let _bool = HeroManager.Instance.HeroIsHave_peck(nHeroID);
				if (_bool && !bool) {
					hero_point.visible = HeroManager.Instance.Heropeck_IsBuy(nHeroID);
				} else {
					hero_point.visible = false
				}
				let war = HeroPosition.Instance.HeroWar;
				if (HeroPosition.Instance.IsInWar(nHeroID)) {
					if (war[nHeroID] == 4) {
						hero_war.skin = BaseDefine.HeroWar_pos[1];
					}
					else {
						hero_war.skin = BaseDefine.HeroWar_pos[2];
					}
				}
				let hero = HeroManager.Instance.GetHero(nHeroID);
				icon.gray = false;
				btn_1.visible = true;
				Addhp.visible = true;
				Addhurt.visible = true;
				get_name.visible = get_land1.visible = get_land2.visible = get_land3.visible = false;
				money_html.innerHTML = path;

				let star = hero.Star == 0 ? 1 : hero.Star;
				let add_star = HeroAdvanceConfig[nHeroID][star].Attr[1][2] / 10000;
				if (hero.Star == 0) {
					add_star = 0;
				}
				let base = HeroUpgrateConfig[nType][hero.Level];
				hp.text = GetInfoAttr.Instance.GetText(base.Attr[1][1]) + ":" + hero.attr.GetAttributeValue(1);
				hurt.text = GetInfoAttr.Instance.GetText(base.Attr[2][1]) + ":" + hero.attr.GetAttributeValue(2);
				level.text = hero.Level + "";
				let tSkillCfg = HeroConfig[nHeroID].heroPassiveSkill
				let nSkillFlag = 0
				for (let nIdx = 1; nIdx <= 10; nIdx++) {//设置技能图片
					let tSkillInfo = tSkillCfg[nIdx]
					let nSKillID = tSkillInfo[1]
					let info = PassiveSkillConfig[nSKillID];
					let nUseLevel = tSkillInfo[2]
					let skillicon: Laya.Image = item.getChildByName("skill_icon" + nIdx) as Laya.Image;
					let iconlock: Laya.Label = skillicon.getChildByName("skill_lock") as Laya.Label;
					skillicon.visible = true
					//设置图片
					skillicon.skin = "ui_icon/" + info.strIcon;
					if (hero.Level >= nUseLevel) {
						iconlock.visible = false;
					} else {
						if (nSkillFlag < 1) {
							nSkillFlag += 1
							// 至灰							
							iconlock.visible = true;
						} else {
							skillicon.visible = false
							iconlock.visible = true;
						}
					}
				}
				if (HeroManager.Instance.HeroMaxLv <= hero.Level) {//满级判断
					Addhp.visible = false;
					Addhurt.visible = false;
					img_max.visible = true;
					money_html.visible = false;
					btn_1.visible = false;
					btn_labels.visible = true;
					return;
				}
				else {
					let needs = GetInfoAttr.Instance.GetText(7001);
					let up_lock_one = HeroUpgrateConfig[nType][hero.Level + 1].needPlayerLv;
					nlock.text = "角色" + Format(needs, up_lock_one);
					let nowmoney = HeroUpgrateConfig[nType][hero.Level].ConsumeGold;
					let tUseList = HeroManager.Instance.GetHeroLvUpUse(nHeroID, HeroLvUp.nIdex);
					let play_lv = MasterPlayer.Instance.player.Level;
					let play_money = BagManager.Instance.getItemNumber(1);
					let upnext_mongey = (HeroUpgrateConfig[nType][hero.Level + 1].ConsumeGold - nowmoney) * nx;
					money_html.innerHTML = path + Math.floor(tUseList[1]);
					let lvup_lock = HeroUpgrateConfig[nType][tUseList[0]].needPlayerLv;
					let next_base = HeroUpgrateConfig[nType][tUseList[0]].Attr;
					btn_img.gray = false;
					let one_needInfo = HeroManager.Instance.Up_one(play_money, nType, hero.Level, nowmoney, nx);
					if (play_money < upnext_mongey) {
						money_html.innerHTML = path + one_needInfo;
						btn_img.gray = true;
						btn_1.mouseEnabled = !btn_img.gray;
					}
					if (play_lv < up_lock_one) {
						btn_label.y = 14;
						nlock.visible = true;
						nlock.text = "角色" + Format(needs, up_lock_one);
						if (tUseList[0] == hero.Level + 1) {
							btn_img.gray = true;
							btn_1.mouseEnabled = !btn_img.gray;
						}
					}
					btn_label.text = "升级 X" + (tUseList[0] - hero.Level);
					if (tUseList[0] <= hero.Level || lvup_lock - 10 > play_lv) {
						next_base = HeroUpgrateConfig[nType][hero.Level + 1].Attr;
						btn_label.text = "升级 X1";
						btn_img.gray = true;
						btn_1.mouseEnabled = !btn_img.gray;
						money_html.innerHTML = path + one_needInfo;
					}
					let addhp = next_base[1][2] - base.Attr[1][2];
					let addhurt = next_base[2][2] - base.Attr[2][2];
					Addhp.text = "(↑" + (Math.floor((addhp * nx) * (add_star + 1))).toString() + ")";
					Addhurt.text = "(↑" + (Math.floor((addhurt * nx) * (add_star + 1))).toString() + ")";
					if (btn_img.gray) {
						return
					}
					btn_1.on(Laya.Event.CLICK, this, this.BtnClick, [nHeroID, icon1, btn_img, tUseList[0]]);
					return
				}
			}
			else {				
				for (let nIdx = 1; nIdx <= 10; nIdx++) {
					let skillicon: Laya.Image = item.getChildByName("skill_icon" + nIdx) as Laya.Image;
					let iconlock: Laya.Label = skillicon.getChildByName("skill_lock") as Laya.Label;
					skillicon.visible = iconlock.visible = false
				}
				get_name.visible = get_land1.visible = get_land2.visible = get_land3.visible = true;
				if (Item_tcfg[2]) {
					get_land2.text = GetInfoAttr.Instance.GetText(LineConfig[Item_tcfg[2]].LineName);
					if (LineConfig[Item_tcfg[2]].param != 0) {
						get_land2.on(Laya.Event.CLICK, this, HeroManager.Instance.OpenShop, [LineConfig[Item_tcfg[2]].param]);
					}
					else {
						get_land2.underline = false;
					}
				}
				if (Item_tcfg[1]) {
					get_land1.text = GetInfoAttr.Instance.GetText(LineConfig[Item_tcfg[1]].LineName);//充奖获得的文本内容
					if (LineConfig[Item_tcfg[1]].param != 0) {
						get_land1.on(Laya.Event.CLICK, this, HeroManager.Instance.OpenShop, [LineConfig[Item_tcfg[1]].param]);
					} else {
						get_land1.underline = false;
					}
				}
				if (Item_tcfg[3]) {
					get_land3.text = GetInfoAttr.Instance.GetText(LineConfig[Item_tcfg[3]].LineName);//充奖获得的文本内容
					if (LineConfig[Item_tcfg[3]].param != 0) {
						get_land3.on(Laya.Event.CLICK, this, HeroManager.Instance.OpenShop, [LineConfig[Item_tcfg[3]].param]);
					} else {
						get_land3.underline = false;
					}
				}
				icon.gray = true;
				btn_img.gray = false
				let base = HeroUpgrateConfig[nType][1]["Attr"];
				hp.text = "生命：" + Math.floor(base[1][2] * nx).toString();
				hurt.text = "伤害：" + Math.floor(base[2][2] * nx).toString();
				Addhp.text = "";
				Addhurt.text = "";
				btn_label.text = "激活";
				let num = myNum / tCfg.needNum;
				let money = myNum + "/" + tCfg.needNum;
				money_html.innerHTML = "<img src= " + "'ui_icon/" + tCfg.strIcon + "'" + " width='24px' height='24px'></img>" + money;
				level.text = "1";
				if (myNum < tCfg.needNum) {
					btn_1.gray = true;
					SetHtmlStyle(money_html, 20, "#c5ffa5", "center");
					btn_1.mouseEnabled = !btn_img.gray;
				}
				else {
					SetHtmlStyle(money_html, 20, "#c5ffa5", "center");
					btn_1.gray = false;
					btn_1.mouseEnabled = !btn_img.gray;
				}
				btn_1.on(Laya.Event.CLICK, this, this.BtnClick, [nHeroID, icon1, btn_img]);
			}
			//let bool = HeroManager.Instance.HeroIstrue(nHeroID);
		}
		/**按钮的点击时间 */
		private BtnClick(nHeroID: number, icon: any, btn_img: Laya.Image, lv: number): void {
			this._icon = icon;
			this.nHeroID = nHeroID;
			this._btn = btn_img;
			this._lv = lv;
			let bActive = HeroManager.Instance.IsActive(nHeroID);
			let skillinfo = HeroConfig[nHeroID].heroPassiveSkill;
			let nowDate: Date = new Date();
			let time: number = (nowDate.getDate() * 24 * 60 + nowDate.getHours() * 60 + nowDate.getMinutes()) * 60 + nowDate.getSeconds();
			if (this._time == 0 || time - this._time > 0.2) {
				this._time = time;
				if (bActive) {
					if (lv == null) {
						return
					}
					this.LvUpHero(nHeroID, lv);
				}
				else {
					HeroManager.Instance.OpenHero(nHeroID);
				}
				//播放按钮音效
				SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
			}
			else {
				TipsLogic.Instance.OpenSystemTips("0.2秒内只能点击一次");
			}
		}
		private HeroAllInfo(nHeroID: number): void {
			HeroManager.Instance.OpenView(nHeroID);
		}


		/**英雄升级 */
		private LvUpHero(nHeroID: number, lv: number): void {
			let tUseList = HeroManager.Instance.GetHeroLvUpUse(nHeroID, HeroLvUp._Indx);
			let hasMoney = BagManager.Instance.getItemNumber(1);
			let a = HeroManager.Instance.M_MaxLvup(nHeroID, hasMoney);
			let ntype = HeroConfig[nHeroID].type;
			let hero = HeroManager.Instance.GetHero(nHeroID);
			let lvup_lock = HeroUpgrateConfig[ntype][tUseList[0]].needPlayerLv;
			let _playlv = MasterPlayer.Instance.player.Level;
			let maxup = HeroManager.Instance.MaxLvUp(nHeroID, _playlv);
			if (_playlv < lvup_lock) {
				if (hero.Level < maxup) {
					tUseList[0] = maxup;
				}
			}
			if (tUseList[1] > hasMoney) {
				TipsLogic.Instance.OpenSystemTips("金币不足！");
				this._btn.gray = true;
				return;
			}
			if (lvup_lock > _playlv) {
				TipsLogic.Instance.OpenSystemTips("等级不足！");
				return;
			}

			HeroManager.Instance.HeroLevlUp(nHeroID, lv);
		}

		// private BtnShopClick() {
		// 	HeroLvUp._Indx = this.BtnShop.selectedIndex;
		// 	this.UpdateList()
		// }

		/**控制购买按钮 */
		private Btn_shopclick(btnIdnx: number) {
			if (btnIdnx == 1) {
				if (this.Btn_shop1.visible) {
					this.Btn_shop1.visible = false;
					this.Btn_shop10.visible = false;
					this.Btn_shopMax.visible = false;
					this.Btn_shop.bgColor = "#30303a";
				}
				else {
					this.Btn_shop1.visible = true;
					this.Btn_shop10.visible = true;
					this.Btn_shopMax.visible = true;
					this.Btn_shop.bgColor = "#474557";//
					if (HeroLvUp.nIdex == 1) {
						this.Btn_shop1.color = "#b5b2c6";
						this.Btn_shop10.color = "#89848a";
						this.Btn_shopMax.color = "#89848a";
					}
					if (HeroLvUp.nIdex == 2) {
						this.Btn_shop10.color = "#b5b2c6";
						this.Btn_shopMax.color = "#89848a";
						this.Btn_shop1.color = "#89848a";
					}
					if (HeroLvUp.nIdex == 3) {
						this.Btn_shopMax.color = "#b5b2c6";
						this.Btn_shop10.color = "#89848a";
						this.Btn_shop1.color = "#89848a";
					}
				}
			}
			if (btnIdnx == 2) {
				this.Btn_shop1.visible = false;
				this.Btn_shop10.visible = false;
				this.Btn_shopMax.visible = false;
				this.Btn_shop.text = "升级X1";
				this.Btn_shop.bgColor = "#30303a";
				HeroLvUp.nIdex = 1;
				this.UpdateList();
			}
			if (btnIdnx == 3) {
				this.Btn_shop1.visible = false;
				this.Btn_shop10.visible = false;
				this.Btn_shopMax.visible = false;
				this.Btn_shop.text = "升级X10";
				this.Btn_shop.bgColor = "#30303a";
				HeroLvUp.nIdex = 2;
				this.UpdateList();
			}
			if (btnIdnx == 4) {
				this.Btn_shop1.visible = false;
				this.Btn_shop10.visible = false;
				this.Btn_shopMax.visible = false;
				this.Btn_shop.text = "升级最大";
				this.Btn_shop.bgColor = "#30303a";
				HeroLvUp.nIdex = 3;
				this.UpdateList();
			}
		}
	}
}