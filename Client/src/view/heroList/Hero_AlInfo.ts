module H52D_Framework {
	AddViewResource("Hero_AlInfo",
		[
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
		]);
	export class Hero_AlInfo extends ui.heroList.Hero_AlInfoUI {
		/** 当前界面英雄 */
		private _HeroID
		private _bool: boolean = false;
		constructor(buf: number) {
			super();
			this._HeroID = buf[1]
			this.skill_panel.vScrollBarSkin = "";
			let cfg = HeroConfig[this._HeroID].heroPassiveSkill
			this.listInfo = []
			for (let idx in cfg) {
				let info = cfg[idx]
				this.listInfo.push(info)
			}
			this.Info();
			this.UpdateList();
			this.ViewEvent();
			this.GetHeroMolde();
		}

		private ViewEvent() {
			this.hero_peck.on(Laya.Event.CLICK, this, this.Btnclick_openview);
			this.close.on(Laya.Event.CLICK, this, this.BtnClick);
			Event.RegistEvent(EventDefine.REFFIXEDATTR, Laya.Handler.create(this, this.Info));
			this.on(Laya.Event.REMOVED, this, this.OnDestroy);
		}

		private listInfo: Array<number> = [];
		private UpdateList(): void {
			this.skill_List.array = this.listInfo;
			//this.skill_List.repeatY = this.skill_List.array.length;
			this.skill_List.height = this.listInfo.length * 104;
			this.skill_List.renderHandler = new Laya.Handler(this, this.OtherSkill);
		}

		private OtherSkill(item, index: number): void {
			let nHeroID = this._HeroID;
			let hero = HeroManager.Instance.GetHero(nHeroID);
			let lv = hero ? hero.Level : 1;
			let info = this.listInfo[index];
			let SkillID = info[1];
			// 解锁技能等级
			let a = this.skill_List.array.length;
			let SKillFlag = info[2];
			let tSkillCfg = PassiveSkillConfig[SkillID];
			let skillNameID = tSkillCfg.nameId;
			let icon: Laya.Image = item.getChildByName("skill_Icon");
			let skillOrigin: Laya.HTMLDivElement = item.getChildByName("skill_Base");
			let skillLock: Laya.Image = item.getChildByName("SkillLock");
			let skilllv: Laya.HTMLDivElement = item.getChildByName("SkillLv");
			let openlock: Laya.Label = item.getChildByName("openlock");
			skilllv.text = "lv." + SKillFlag.toString();
			SetHtmlStyle(skillOrigin, 20, "#d7e6ff", "left");
			skillOrigin.innerHTML = GetInfoAttr.Instance.GetText(tSkillCfg.descId);
			icon.skin = "ui_icon/" + tSkillCfg.strIcon;
			let name: Laya.Label = item.getChildByName("skill_Name");
			name.text = GetInfoAttr.Instance.GetText(skillNameID)
			skillLock.visible = true;
			if (SKillFlag <= lv) {
				skillLock.visible = false;
				skilllv.visible = false;
				openlock.visible = false;
			}
		}

		private _time;
		private Info(): void {
			let tcfg_hero = HeroConfig[this._HeroID];
			let pos = tcfg_hero.position;
			let ntype = tcfg_hero.type;
			this.heroIcon_bg.skin = BaseDefine.HeroAllinfo_bg[tcfg_hero.quality];
			let hero = HeroManager.Instance.GetHero(this._HeroID);
			let nActive = HeroManager.Instance.IsActive(this._HeroID);
			let buyed = HeroManager.Instance.Heropeck_IsBuy(this._HeroID);
			let peck_icon = HeroManager.Instance.PeckIcon
			let is_inpeck = HeroManager.Instance.HeroIsHave_peck(this._HeroID)
			this.hero_peck.visible = is_inpeck && nActive && peck_icon && buyed
			let star = hero ? hero.Star : 1;
			if (IsAD() && !IsShieldRecharge() && IsNotBaiDuSdk()) {
				this.hero_peck.visible = IsAD();
			}
			let _add;
			if (!HeroManager.Instance.Heropeck_IsBuy(this._HeroID)) {
				this.hero_peck.visible = false
			}
			if (hero) {
				if (hero.Star == 0) {
					star = 1;
					_add = 0;
				}
				else {
					star = hero.Star;
					_add = HeroAdvanceConfig[this._HeroID][star].Attr[1][2] / 10000;
				}
			}
			else {
				_add = 0;
			}
			this.herolevel
			let base = HeroAdvanceConfig[this._HeroID][star].Attr;
			let lv = hero ? hero.Level : 1;
			let info = HeroConfig[this._HeroID];
			let nx = info.heroRatio;
			let heroinfos = info.stationaryAttribute;
			let list = info.heroBigSkill
			let herobase = HeroUpgrateConfig[info.type][lv].Attr
			this.herolevel.text = hero != null ? hero.Level + "级" : "1级";
			if (hero) {
				if (hero.Star != 0) {
					this.herolevel.text = hero.Star + "阶" + hero.Level + "级";
				}
			}
			this.heroName.text = GetInfoAttr.Instance.GetText(info.name);
			this.heroName.color = BaseDefine.LabelColor[tcfg_hero.quality];
			this.heroOrigin.text = GetInfoAttr.Instance.GetText(info.heroOrigin);
			let tData = ActiveSkillConfig[info.heroBigSkill];
			this.Teamskill_Icon.skin = "ui_icon/" + tData.strIcon;
			this.skill_Name.text = GetInfoAttr.Instance.GetText(tData.nameId) + "(作为队长时候才能生效)";
			SetHtmlStyle(this.skill_Origin, 18, "#d7e6ff", "left");
			this.skill_Origin.innerHTML = GetInfoAttr.Instance.GetText(tData.descId);
			Tick.Loop(60000, this, this.GetHeroMolde);
			// 设置升级属性
			for (let nIdx = 1; nIdx <= 2; nIdx++) {
				let attNameLable: Laya.Label = this["heroattl" + nIdx]
				let valLable: Laya.Label = this["val" + nIdx]
				let attrInfo = herobase[nIdx];
				let nAttrID = attrInfo[1];
				let nAttrVal = Math.floor((attrInfo[2] * nx) * (1 + _add)).toString();
				let nName = QualityValue[nAttrID].dwName
				let isper = QualityValue[nAttrID].isper
				attNameLable.text = GetInfoAttr.Instance.GetText(nName) + "：";
				if (isper == 1) {
					//nAttrVal = nAttrVal / 10000 + "%"
				}
				valLable.text = nAttrVal;
				if (hero) {
					valLable.text = hero.attr.GetAttributeValue(nIdx);
				}
			}
			//基础属性
			for (let nIdx = 3; nIdx <= 5; nIdx++) {
				let attNameLable: Laya.Label = this["heroattl" + nIdx];
				let valLable: Laya.Label = this["val" + nIdx];
				let atteInfo = heroinfos[(nIdx - 2)];
				let nattrID = atteInfo[1];
				let nattrval = atteInfo[2];
				let nName = QualityValue[nattrID].dwName
				let isper = QualityValue[nattrID].isper
				attNameLable.text = GetInfoAttr.Instance.GetText(nName) + "：";
				valLable.text = nattrval.toString();
				if (isper == 1) {
					nattrval = nattrval / 100 + "%";
					if (hero) {
						let value = hero.attr.GetAttributeValue(nIdx);
						if (nIdx == 4 && value > 10000) {
							value = 10000;
						}
						valLable.text = value / 100 + "%";
					}
					else {
						valLable.text = nattrval.toString();
					}
				}
				else {
					if (hero) {
						valLable.text = hero.attr.GetAttributeValue(nIdx) + "";
					}
				}
			}
			this.SetHeropeck_red();
			let a = HeroManager.Instance.GetHeroPecktime(this._HeroID)
			this._time = a - Time.serverSecodes
			if (this.hero_peck.visible) {
				Tick.Loop(100, this, this.nHero_time);
			}
		}

		private SetHeropeck_red() {
			let bool = CacheManager.Instance.getDerailByType(CacheTypeEnum.hero,
				this._HeroID);
			let bools = HeroManager.Instance.Heropeck_IsBuy(this._HeroID);
			this.heropeck_red.visible = !bool && bools;
		}

		private nHero_time() {
			this.peck_time.text = GetFormatTime(this._time) + "";
			this._time -= 0.1;

		}

		private heroModle: Avatar
		private GetHeroMolde() {
			if (this.heroModle) {
				this.heroModle.Destroy();
			}
			let tcfg_hero = HeroConfig[this._HeroID];
			let pos = tcfg_hero.position;
			this.heroModle = new Avatar(this.heroIcon)
			this.heroModle.Load(tcfg_hero.strFacadeModel, 1, tcfg_hero.modelScale * 2.6, pos[1], pos[2],
				Laya.Handler.create(this, () => {
					// this.heroModle.Play(1, true, true, () => {
					// }, true)
					this.heroModle.Play(AnimationName.idle)
				}));
		}

		private BtnClick(buf: any): void {
			UIManager.Instance.DestroyUI(this, [ViewToppestRoot]);
			Event.RemoveEvent(EventDefine.REFFIXEDATTR, Laya.Handler.create(this, this.Info));
		}

		private Btnclick_openview() {
			CacheManager.Instance.setDerailByType(CacheTypeEnum.hero,
				this._HeroID, true)
			if (UIManager.Instance.IsHave("HeroStarPeckView", ViewUpRoot)) {
				UIManager.Instance.DestroyUI("HeroStarPeckView", [ViewUpRoot])
			}
			UIManager.Instance.CreateUI("HeroStarPeckView", [ViewUpRoot]);
			UIManager.Instance.DestroyUI("Hero_AlInfo", [ViewToppestRoot]);
		}

		private OnDestroy(): void {
			if (this.heroModle) {
				this.heroModle.Destroy();
				this.heroModle = null;
			}
			this.offAll();
		}
	}
}