module H52D_Framework {
	AddViewResource("MatchWarView",
		[
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_scene01.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_head.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS }
		]);
	export class MatchWarView extends ui.action.match.MatchWarViewUI {
		/**选择的上阵位置 */
		private _HasHeroList = [];
		private _Lveffect: { [id: number]: Avatar } = {};
		private bool = true;
		private _npos;
		private _opos;
		private _eTpye: number;
		private _heroAvatarMap: { [pos: number]: Avatar } = {};
		/** 拖拽物 */
		private nDragHeroID = null;
		/** 记录拖拽物坐标 */
		private tDragPos = [0, 0];
		/** 记录之前的位置颜色 */
		private sFlagColorSkin = [];
		private _heroPathFlagMap: { [pos: number]: String } = {};
		constructor(buf) {
			super();
			this.BackGround.skin = "res/ui/ui_noPack/img-daguanchangjing-huantixiangfeng.png";
			this._heroAvatarMap = {};
			this._heroPathFlagMap = {};
			this.nDragHeroID = null;
			this._eTpye = buf[1];
			this.sFlagColorSkin = [];
			this.dragHeroIcon.visible = false;
			MatchLogic.Instance.InitPosInfo();
			this.on(Laya.Event.REMOVED, this, this.OnDestroy);
			Event.RegistEvent('OnMouseUp', Laya.Handler.create(this, this.MouseUp));

			if (GetTabLength(MatchLogic.Instance.war) == 0) {
				MatchLogic.Instance.war = MatchLogic.Instance.war;
			}
			// 缓存已有英雄列表
			for (let nHeroID in HeroManager.Instance.Herolist) {
				this._HasHeroList.push(nHeroID);
			}
			this.Btn_save.on(Laya.Event.CLICK, this, this.SaveBtnClick);
			for (let pos = 0; pos <= 8; pos++) {
				this["dragpos" + pos].on(Laya.Event.MOUSE_DOWN, this, this.CurMouseDown, [pos]);
			}
			this.UpdatePosView()
			this.UpateHeroLsit()
			this.INfo();
			this.bgbox.on(Laya.Event.MOUSE_MOVE, this, this.MouseMove);
			this.btn_close.on(Laya.Event.CLICK, this, this.Btn_Close);
		}

		private OnCloseHander() {
			if (!this.IsQuit()) return
			UIManager.Instance.DestroyUI(this.name, [ViewToppestRoot]);
		}

		private INfo() {
			this.tixing.text = GetInfoAttr.Instance.GetText(7011);
		}
		public OnDestroy() {
			this.MouseUp();
			this.offAll();
			for (let pos in this._heroAvatarMap) {
				let mod = this._heroAvatarMap[pos]
				if (mod != null) {
					mod.Destroy();
				}
			}
			this._heroAvatarMap = {};
			this._heroPathFlagMap = {}
			Event.RemoveEvent('OnMouseUp', Laya.Handler.create(this, this.MouseUp));
		}
		private old_heroid = 0;
		/** 拾取英雄 */
		private DragHero(nHeroID, bShowDrag) {
			this.dragHeroIcon.visible = true;
			this.nDragHeroID = nHeroID;
			this.old_heroid = nHeroID;
			let hero = HeroManager.Instance.GetHero(nHeroID);
			if (this._heroAvatarMap[-1]) {
				this._heroAvatarMap[-1].Destroy();
				this._heroAvatarMap[-1] = null;
				delete this._heroAvatarMap[-1];
			}
			let info_cfg = hero.heroCfg;
			let path = info_cfg.strFacadeModel;
			let tPosInfo = this.GetDirAndScale(nHeroID); //获取方向和坐标
			this._heroAvatarMap[-1] = new Avatar(this.dragHeroMod)
			this._heroAvatarMap[-1].Load(path, tPosInfo[0], tPosInfo[1] * 2, 0, 0, Laya.Handler.create(this, () => {
				this._heroAvatarMap[-1].visible = true
				this._heroAvatarMap[-1].Play(AnimationName.idle, true);
				this._heroAvatarMap[-1].SetOrder(10);
			}));
			if (!MatchLogic.Instance.IsInWar(nHeroID)) {
				//let mod:Laya.View=this._heroAvatarMap[-1]
			}
			SoundManager.Instance.OnPlaySound("res/sound/ui_buzhen01.mp3");
			this.UpdatePosView(true, bShowDrag)
		}

		/** 列表按下事件 */
		private ListHeadDown(nHeroID, item, event) {
			Tick.Once(300, this, this.OneListHeadDown, [nHeroID, this.match_listwar._childs[1].value, item, event])
		}

		/** 列表按下事件 */
		private OneListHeadDown(nHeroID, scrollBarY, item, event) {
			if (this.match_listwar._childs[1].value != scrollBarY) {
				return
			}
			let bool = false;
			this.dragHeroIcon.x = this.match_listwar.x + item.x + 120
			this.dragHeroIcon.y = this.match_listwar.y + item.y - this.match_listwar._childs[1].value + 120
			this.match_listwar._childs[0]
			this.match_listwar.scrollBar.stopDrag()
			this.match_listwar.scrollBar.stopScroll()
			bool = MatchLogic.Instance.IsInWar(nHeroID);
			this.DragHero(nHeroID, bool);
		}

		/** 按住阵容上的英雄 */
		private CurMouseDown(pos) {
			let tPositionWar = MatchLogic.Instance.war
			let nCurHeroID = tPositionWar[pos]
			if (nCurHeroID == null) {
				return
			}
			let dragpos = this["dragpos" + pos] as Laya.Image
			this._opos = pos;
			this.dragHeroIcon.x = dragpos.x + dragpos.width / 2
			this.dragHeroIcon.y = dragpos.y + dragpos.height - 15
			this.DragHero(nCurHeroID, true)
		}

		/** 鼠标移动事件 */
		private MouseMove(event: laya.events.Event): void {
			if (this.nDragHeroID == null) {
				return
			}
			this.dragHeroIcon.x = event.currentTarget.mouseX
			this.dragHeroIcon.y = event.currentTarget.mouseY
			// 记录坐标
			this.tDragPos[0] = event.currentTarget.mouseX
			this.tDragPos[1] = event.currentTarget.mouseY

			let nNowPos = this.GetJionPos()
			if (nNowPos != this.sFlagColorSkin[0]) {
				if (this.sFlagColorSkin[0] != null) {
					let dragpos = this["Pos_" + this.sFlagColorSkin[0]] as Laya.Image
					dragpos.skin = this.sFlagColorSkin[1]
				}
			}
			if (nNowPos != null) {
				if (nNowPos != this.sFlagColorSkin[0]) {
					let dragpos = this["Pos_" + nNowPos] as Laya.Image
					let strSkin = dragpos.skin
					this.sFlagColorSkin = [nNowPos, dragpos.skin]
					dragpos.skin = "ui_hero/img-yingxiong-tuozhaua-bg.png"
				}
			} else {
				this.sFlagColorSkin = []
			}
		}

		/** 鼠标抬起事件 */
		private MouseUp(): void {
			this.dragHeroIcon.visible = false
			this.sFlagColorSkin = []
			Tick.Clear(this, this.OneListHeadDown)
			if (this.nDragHeroID == null) {
				this.UpdatePosView()
				return
			}
			// 记录ID
			let nDragHeroID = this.nDragHeroID
			this.nDragHeroID = null
			let nNowPos = this.GetJionPos()
			this.tDragPos = [0, 0]
			if (nNowPos == null) {
				this.UpdatePosView()
				return
			}
			let tPositionWar = MatchLogic.Instance.war
			let nCurHeroID = tPositionWar[nNowPos]
			// 当前位置与拖拽的相同
			if (nCurHeroID == nDragHeroID) {
				this.UpdatePosView()
				return
			}
			if (nCurHeroID != nDragHeroID) {
				SoundManager.Instance.OnPlaySound("res/sound/ui_buzhen02.mp3");
			}
			// 放置英雄
			this.PutHero(nNowPos, nDragHeroID);
			let bool = MatchLogic.Instance.IsInSaveWar(nNowPos, nDragHeroID)
			let hero_id = MatchLogic.Instance.war[this._opos];
			if (bool) {
				if (hero_id) {
					this.WarEffect(this._opos);
				}
			}
		}

		private PutHero(nNowPos: number, nDragHeroID: number) {
			// 放置英雄
			MatchLogic.Instance.PutHero(nNowPos, nDragHeroID)
			MatchLogic.Instance.bChange = true
			this.UpdatePosView()
			this.UpateHeroLsit()
			this.WarEffect(nNowPos);
			let oldhero = this.old_heroid;
		}

		/** 获取当前在哪个位置上 */
		private GetJionPos() {
			if (this.tDragPos[0] == 0 && this.tDragPos[1] == 0) {
				return null
			}
			let nNowX = this.tDragPos[0]
			let nNowY = this.tDragPos[1]
			for (let pos = 0; pos <= 8; pos++) {
				let dragpos = this["dragpos" + pos] as Laya.Image
				if (dragpos.x < nNowX && dragpos.x + dragpos.width > nNowX && dragpos.y < nNowY && dragpos.y + dragpos.height > nNowY) {
					return pos
				}
			}
			return null
		}

		/** 打开英雄详情面板 */
		private OpenView(nHeroID: number): void {
			if (this.nDragHeroID != null) {
				return
			}
			HeroManager.Instance.OpenView(nHeroID);
		}

		/** 刷新位置信息 */
		public UpdatePosView(bDrag?, bShowDrag?) {
			let tPositionWar = MatchLogic.Instance.war;
			for (let pos = 0; pos <= 8; pos++) {
				let PosBtn: Laya.Image = this["Pos_" + pos]
				let Mod: Laya.View = this["mod" + pos]
				if (bDrag) {
					PosBtn.scale(1.3, 1.3)
				} else {
					PosBtn.scale(1, 1)
				}
				let nHeroID = tPositionWar[pos]
				if ((bDrag && bShowDrag && nHeroID == this.nDragHeroID)) {
					Mod.alpha = 0.5
				} else {
					Mod.alpha = 1
				}
				if ((nHeroID == null)) {
					if ((this._heroAvatarMap[pos] != null) && this._heroAvatarMap[pos].loaded) {
						this._heroAvatarMap[pos].visible = false
					}
					this._heroPathFlagMap[pos] = "";
					PosBtn.skin = "ui_hero/img-yingxiong-renwuyuan-bg.png"
				} else {
					if (pos == 4) {
						PosBtn.skin = "ui_hero/img-yingxiong-duizhang-bg.png"
					} else {
						PosBtn.skin = "ui_hero/img-yingxiong-xuanzhong-bg.png"
					}
					let hero = HeroManager.Instance.GetHero(nHeroID)
					let info_cfg = hero.heroCfg;
					let path = info_cfg.strFacadeModel;
					if (this._heroPathFlagMap[pos] != path) {
						if (this._heroAvatarMap[pos]) {
							this._heroAvatarMap[pos].Destroy();
							this._heroAvatarMap[pos] = null;
							delete this._heroAvatarMap[pos];
						}

						this._heroPathFlagMap[pos] = path
						let tPosInfo = this.GetDirAndScale(nHeroID)
						this._heroAvatarMap[pos] = new Avatar(Mod)
						this._heroAvatarMap[pos].Load(path, tPosInfo[0], tPosInfo[1], 0, 0, Laya.Handler.create(this, () => {
							this._heroAvatarMap[pos].visible = true
							this._heroAvatarMap[pos].Play(AnimationName.idle, true);
							this._heroAvatarMap[pos].SetOrder(pos);
						}));
					}
				}
			}
			this.SetMainskillIcon(tPositionWar[4]);
		}

		/** 获取方向和坐标 */
		private GetDirAndScale(nHeroID) {
			let dir = 1
			let scale = HeroConfig[nHeroID].modelScale
			return [dir, scale]
		}

		private WarSort() {
			function tsort(a, b): number {
				let a_q = HeroConfig[a].quality;
				let b_q = HeroConfig[b].quality;
				if (a_q == b_q) {
					return a > b ? 1 : -1;
				}
				return a_q > b_q ? -1 : 1;
			}
			this._HasHeroList.sort(tsort);
		}

		public UpateHeroLsit() {
			this.WarSort();
			this.match_listwar.array = this._HasHeroList;
			this.match_listwar.vScrollBarSkin = "";
			this.match_listwar.renderHandler = new Laya.Handler(this, this.SetHandler);
		}

		private SetHandler(item, index: number): void {
			let nHeroID = this._HasHeroList[index];
			let tcfg = HeroConfig[nHeroID];
			let nx = tcfg.heroRatio;
			let colorID = tcfg.quality;
			let ntype = tcfg.type;
			let hero = HeroManager.Instance.GetHero(nHeroID);
			let bg_color: Laya.Image = item.getChildByName("background");
			let btn_01: Laya.Button = item.getChildByName("Btn_skill");
			let bg_k: Laya.Image = btn_01.getChildByName("background_k") as Laya.Image;
			let duihao: Laya.Image = btn_01.getChildByName("hero_zhiwei") as Laya.Image;
			let heroinfo: Laya.Button = btn_01.getChildByName("Btn_Info") as Laya.Button;
			let head: Laya.Image = btn_01.getChildByName("HeadIcon") as Laya.Image;
			let hp: Laya.Label = btn_01.getChildByName("Hp") as Laya.Label;
			let hurt: Laya.Label = btn_01.getChildByName("Hurt") as Laya.Label;
			let hero_type: Laya.Image = btn_01.getChildByName("Hero_Type") as Laya.Image;;
			let gowar: Laya.Image = btn_01.getChildByName("IsGoWar") as Laya.Image;
			let type_bg: Laya.Image = btn_01.getChildByName("Hero_Type_bg") as Laya.Image;
			let lv = hero.Level;
			duihao.skin = "";
			let herolist = MatchLogic.Instance.HeroWar
			let a = MatchLogic.Instance.IsInWar(nHeroID);
			if (a) {
				duihao.skin = BaseDefine.HeroWar_pos[2];
				if (herolist[nHeroID] == 4) {
					duihao.skin = BaseDefine.HeroWar_pos[1];
				}
			}
			bg_color.skin = BaseDefine.QualityList[colorID];
			bg_k.skin = BaseDefine.HeroQualityList[colorID];
			hero_type.skin = BaseDefine.HeroTypeIcon[ntype];
			let bool = MatchLogic.Instance.IsInWar(nHeroID);
			gowar.visible = bool;
			type_bg.skin = "ui_hero/icon-renwu-leixing-bg.png"
			let star = hero.Star = 0 ? 1 : (hero.Star);
			let base_f;
			if (hero.Star == 0) {
				star = 1;
				let base = HeroAdvanceConfig[nHeroID][star].Attr
				base_f = 0;
				let basenum = nx * (base_f + 1);
				hp.text = hero.attr.GetAttributeValue(1);
				hurt.text = hero.attr.GetAttributeValue(2);
			}
			else {
				let base = HeroAdvanceConfig[nHeroID][star].Attr
				base_f = base[1][2] / 10000;
				let basenum = nx * (base_f + 1);
				hp.text = hero.attr.GetAttributeValue(1);
				hurt.text = hero.attr.GetAttributeValue(2);
			}
			btn_01.on(Laya.Event.MOUSE_UP, this, this.OpenView, [nHeroID]);
			btn_01.on(Laya.Event.MOUSE_DOWN, this, this.ListHeadDown, [nHeroID, item])
			head.skin = hero.HeadIcon;
		}
		private _bool: boolean = false;

		/** 点击保存按钮 */
		public SaveBtnClick() {
			let heroposInfo = MatchLogic.Instance.war;
			let bool = MatchLogic.Instance.bChange;
			if (heroposInfo[4] == null) {
				TipsLogic.Instance.OpenSystemTips("必须有队长才能保存！！");
				return
			}
			if (!bool) {
				TipsLogic.Instance.OpenSystemTips("阵容未发生改变！！");
				return
			}
			heroposInfo = MatchLogic.Instance.getwar();
			if (!CacheManager.Instance.getDerailByType(CacheTypeEnum.common, CacheTypeCommon.pvpSaveCombat)) {
				CacheManager.Instance.setDerailByType(CacheTypeEnum.common, CacheTypeCommon.pvpSaveCombat, true);
			}
			//MatchLogic.Instance.K_SaveMatchBattleArray(this._eTpye, heroposInfo);
			MatchLogic.Instance.MatchWarInfo(heroposInfo);
			MatchLogic.Instance.bChange = false;
		}

		private IsQuit() {

			return true;
		}

		/**关闭按钮 弹出提示框 */
		private Btn_Close() {
			let heroposInfo = MatchLogic.Instance.war;
			let bool = MatchLogic.Instance.bChange;
			if (heroposInfo[4] == null) {
				//弹出面板 保存失败 提示队长不能保存
				TipsLogic.Instance.OpenSystemTips("必须有队长才能保存！！");
				return;
			}
			if (MatchLogic.Instance.bChange) {
				let str = SysPromptConfig[10012].strPromptInfo;
				TipsLogic.Instance.OpenMessageBox(str,
					Laya.Handler.create(this, () => {
						this.SaveBtnClick();
						UIManager.Instance.DestroyUI("MatchWarView", [this.parent]);
					}),
					Laya.Handler.create(this, () => {
						UIManager.Instance.DestroyUI("MatchWarView", [this.parent]);
					})
				);
			}
			else {
				UIManager.Instance.DestroyUI("MatchWarView", [this.parent]);
				//Event.DispatchEvent("ReshView_ladder");
			}
		}

		/***播放特效 */
		private WarEffect(pos) {
			if (this._Lveffect[pos]) {
				this._Lveffect[pos].Destroy();
			}
			let PosBtn: Laya.Image = this["Pos_" + pos]
			this._Lveffect[pos] = new Avatar(PosBtn)
			this._Lveffect[pos].Load("res/effect/effect_state_buzhen/effect_state_buzhen.sk", 1, 1, 60, 36,
				Laya.Handler.create(this, () => {
					this._Lveffect[pos].Play("effect_state_buzhen", false, true, () => {
						this._Lveffect[pos].Destroy();
					})
				}));
		}

		/**设置队长技能图片 */
		private SetMainskillIcon(nHeroID) {
			if (nHeroID) {
				this.L.visible = true;
				this.main_skillName.visible = true;
				let skill_ID = HeroConfig[nHeroID].heroBigSkill;
				let skill_Info = ActiveSkillConfig[skill_ID];
				this.Skill_Icon.skin = "ui_icon/" + skill_Info.strIcon;
				this.Skill_Icon.on(Laya.Event.CLICK, this, this.OpenView, [nHeroID]);
			}
			else {
				this.L.visible = false;
				this.main_skillName.visible = false;
				this.Skill_Icon.skin = "";
			}
		}
	}
}

