/**Created by the LayaAirIDE*/
module H52D_Framework {
	AddViewResource("LadderView", [
		{ url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
		{ url: "res/ui/ui_kicking.atlas", type: Laya.Loader.ATLAS },
		{ url: "res/ui/ui_ladder.atlas", type: Laya.Loader.ATLAS },
		{ url: "res/ui/ui_icon.atlas", type: Laya.Loader.ATLAS },
	]);

	export class LadderView extends ui.action.Ladder.LadderViewUI {
		constructor() {
			super();

			this.ViewInit();
		}

		private _play_Id;
		private _captain: { [str: string]: Avatar } = {};

		private _index = 101;

		private _show: Avatar;
		private time: number

		private _fight_time;//天梯挑战次数
		private ViewInit() {
			this.ViewInfo();
			this.ViewEvent();
		}

		private ViewEvent() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.Btn_close.on(Laya.Event.CLICK, this, this.Btnclick_close);
			this.btn_hero_war.on(Laya.Event.CLICK, this, this.OpenView, ["KickingWarView"]);
			this.btn_pet_war.on(Laya.Event.CLICK, this, this.OpenView, ["KickingPetView"]);
			this.btn_challage.on(Laya.Event.CLICK, this, this.btnclick_challag);
			this.Btn_buytimes.on(Laya.Event.CLICK, this, this.OpenView, ["BuyTimesView"]);
			this.reward.on(Laya.Event.CLICK, this, this.OpenView, ["LadderReward"]);

			Event.RegistEvent("ReshView_ladder", Laya.Handler.create(this, this.ViewInfo))
			Event.RegistEvent("matching_ladder", Laya.Handler.create(this, this.MatchIs_win))
			Event.RegistEvent("btnclick_challag", Laya.Handler.create(this, this.btnclick_challag))
		}
		private ViewInfo() {
			//打开天梯页面中
			LadderManager.Instance.IsMatching = false;
			LadderManager.Instance._isOpenLadder = true;

			//引导按钮
			Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_12, this.btn_challage)

			KickingLogic.Instance.InitPosInfo();
			let s = MasterPlayer.Instance.player.Fraction;
			this._play_Id = LadderManager.Instance.GetDuanInfo(s);
			let ntcfg_ladder = LadderConfig[this._play_Id];
			this.title.text = GetInfoAttr.Instance.GetText(5020);
			let c_num = MasterPlayer.Instance.GetEventDayProByType(EventProEnum.LadderTimes);
			let b_num = MasterPlayer.Instance.GetEventDayProByType(EventProEnum.BuyLadderTimes);
			//看广告次数
			let ad_num = AdvertisingManager.Instance.GetAdvertisingTimes(AdvertisementType.ladder)
			this._fight_time = MasterPlayer.Instance.player.Laddertimes - c_num + b_num + ad_num;
			let sys_times = GameParamConfig.LadderFreeNum;
			SetHtmlStyle(this.my_times, 25, "#fdfdfb", "center");
			this.my_times.innerHTML = "今日剩余次数:" + GetHtmlStrByColor(this._fight_time + "", "#c5ffa5") + "/" + sys_times
			if (this._fight_time <= 0) {
				this._fight_time = 0;
				this.my_times.innerHTML = "今日剩余次数:" + GetHtmlStrByColor(this._fight_time + "/" + sys_times, "#ffa5a7");
			}
			this.LadderRank_icon.skin = "ui_icon/" + ntcfg_ladder.DuanIcon;
			let lv = ntcfg_ladder.DuanIconBs;
			this.SetRankLV(lv);
			this.LadderRank_name.text = GetInfoAttr.Instance.GetText(ntcfg_ladder.DuanName) + "(" + ntcfg_ladder.DuanMin + "-" + ntcfg_ladder.DuanMax + ")";
			this.play_min.text = "当前积分:" + MasterPlayer.Instance.player.Fraction + "/" + ntcfg_ladder.DuanMax;
			this.play_lv.text = MasterPlayer.Instance.player.Level + "";
			this.play_ladderrank.text = "胜场:" + MasterPlayer.Instance.player.LadderWinnNum;
			this.play_win_num.text = "   ";
			this.play_name.text = MasterPlayer.Instance.player.Name;
			this.SetModler(LadderManager.Instance.GetCaptainId(), "my_captain_mod", true);//获取玩家的英雄队长ID
			this.Handle();
			if (b_num >= 10 && this._fight_time == 0) {
				if (!LadderManager.Instance.IsMatching) {
					this.btn_challage.visible = false
					this.match_win.visible = true;
					this.match_win.text = GetInfoAttr.Instance.GetText(7131);
				}
			}
			this.oppo_captain(false);
			if (LadderManager.Instance.Oppn_grad != 0) {
				this.oppo_captain(true);
			}
		}

		private MatchIs_win() {
			this.btn_challage.label = "匹配";
			this.oppo_captain(false);
			this.btn_challage.visible = true;
			this.match_win.visible = false;
			Tick.Clear(this, this.CreatHeroModl);
		}

		private SetRankLV(lv: number) {
			let str: string;
			switch (lv) {
				case 1:
					str = "ui_icon/icon_duanwei_shuzi_yi.png";
					this.rank_lv_2.skin = str;
					this.rank_lv_1.visible = this.rank_lv_3.visible = false;
					break;
				case 2:
					str = "ui_icon/icon_duanwei_shuzi_yi.png"
					this.rank_lv_1.skin = this.rank_lv_3.skin = str;
					this.rank_lv_2.visible = false;
					break;
				case 3:
					str = "ui_icon/icon_duanwei_shuzi_yi.png";
					this.rank_lv_1.skin = this.rank_lv_3.skin = this.rank_lv_2.skin = str;
					break;
				case 4:
					str = "ui_icon/icon_duanwei_shuzi_yi.png"
					this.rank_lv_1.skin = str;
					this.rank_lv_3.skin = "ui_icon/icon_duanwei_shuzi_si.png";
					this.rank_lv_2.visible = false;
					break;
				case 5:
					str = "ui_icon/icon_duanwei_shuzi_si.png";
					this.rank_lv_2.skin = str;
					this.rank_lv_1.visible = this.rank_lv_3.visible = false;
					break;
			}
		}

		/**设置队长模型 */
		private SetModler(HeroID: number, str: string, bool: boolean) {
			if (this._captain[str]) {
				this._captain[str].Destroy();
			}
			let tcfg_hero = HeroConfig[HeroID];
			let pos = tcfg_hero.position;
			let x;
			let left = 1;
			if (bool) {
				x = 95;
			} else {
				x = 77;
				left = -1;
			}
			this._captain[str] = new Avatar(this[str])
			this._captain[str].Load(tcfg_hero.strFacadeModel, left,
				tcfg_hero.modelScale * 2.6, x, pos[2],
				Laya.Handler.create(this, () => {
					this._captain[str].Play(1, true, true, () => {
					}, true)
				}));
		}

		private oppo_captain(bool: boolean) {
			if (bool) {
				let s = LadderConfig[LadderManager.Instance.Oppn_grad].DuanName;
				this.oppo_lv.text = "";
				this.oppo_ladderrank.text = "胜场:" + LadderManager.Instance.OppnWinTimes   //GetInfoAttr.Instance.GetText(s);
				this.oppo_win_num.text = "";
				this.oppo_name.text = LadderManager.Instance.OPpn_name;
				this.oppo_captain_mod.skin = "";
				//this.oppo_captain_mod.y -= 140;
			} else {
				this.oppo_lv.text = "???";
				this.oppo_ladderrank.text = "胜场:???";
				this.oppo_win_num.text = "???胜";
				this.oppo_name.text = "???";
				this.oppo_captain_mod.skin = "ui_ladder/btn-wenhao-tianti.png";
			}
		}

		/**设置奖励道具 */
		private Handle() {
			let ntcfg = LadderConfig[this._play_Id];
			let item_Info = RewardConfig[ntcfg.WinBaseAward].reWrad[1]
			let item_tcfg = ItemConfig[item_Info[2]];
			this.win_basename.text = GetInfoAttr.Instance.GetText(item_tcfg.dwItemName);

			this.win_basebg.bgColor = BaseDefine.LadderItemBgColor[item_tcfg.dwItemQuality];
			this.win_baseicon.skin = "ui_icon/" + item_tcfg.strIconID_B;
			this.win_basename.color = BaseDefine.LabelColor[item_tcfg.dwItemQuality];

			item_Info = RewardConfig[ntcfg.WinExtraAward].reWrad[1];
			item_tcfg = ItemConfig[item_Info[2]];
			this.win_extraname.text = GetInfoAttr.Instance.GetText(item_tcfg.dwItemName);
			this.win_extrabg.bgColor = BaseDefine.LadderItemBgColor[item_tcfg.dwItemQuality];
			this.win_extraicon.skin = "ui_icon/" + item_tcfg.strIconID_B;
			this.win_extraname.color = BaseDefine.LabelColor[item_tcfg.dwItemQuality];
		}

		private OpenView(name: string) {
			if (LadderManager.Instance.IsMatching) {
				if ((name == "KickingWarView") || (name == "KickingPetView") || name == "BuyTimesView") {
					TipsLogic.Instance.OpenSystemTips("匹配过程中不能进行此操作！");
					return
				}
			}
			if (name == "KickingWarView") {
				UIManager.Instance.CreateUI(name, [ViewToppestRoot, ActionType.ladder]);
				return 
			}
			if (name == "BuyTimesView") {
				if (IsAD()) {
					if (!AdvertisingManager.Instance.bnWXAdertisingTimes) {
						UIManager.Instance.CreateUI(name, [ViewToppestRoot, this._play_Id]);
					}
					else {
						UIManager.Instance.CreateUI("AdvertisementView", [ViewUpRoot, AdvertisementType.ladder]);
					}
				}
				else {
					UIManager.Instance.CreateUI(name, [ViewToppestRoot, this._play_Id]);
				}
			}
			else {
				UIManager.Instance.CreateUI(name, [ViewToppestRoot, this._play_Id]);
			}
		}

		/**匹配按钮的点击事件 */
		private btnclick_challag() {
			LadderManager.Instance.IsMatching = !LadderManager.Instance.IsMatching;
			if (LadderManager.Instance.IsMatching) {
				if (this._fight_time <= 0) {
					TipsLogic.Instance.OpenSystemTips("挑战次数不足！");
					LadderManager.Instance.IsMatching = false;
					return
				}
				this.oppo_captain_mod.skin = "";
				this.time = 0;
				Tick.Loop(900, this, this.CreatHeroModl)
				Tick.Loop(100, this, this.Go_ladder);
			} else {
				Tick.Clear(this, this.Go_ladder);
				Tick.Clear(this, this.CreatHeroModl);
				this.btn_challage.label = "匹配";
				this.oppo_captain(false);
				//取消匹配停止匹配音效
				SoundManager.Instance.OnStopSound("res/sound/colck.mp3");
			}
		}

		/**创建模型 */
		private CreatHeroModl() {
			// if (LadderManager.Instance.IsMatching) {
			let tcfg_hero
			let pos
			if (LadderManager.Instance.Oppn_grad == 0) {
				tcfg_hero = HeroConfig[this._index];
				if (!tcfg_hero) {
					this._index = 101;
					tcfg_hero = HeroConfig[this._index];
				}
				pos = tcfg_hero.position;
			} else {
				let a = LadderManager.Instance.Oppncaptain
				tcfg_hero = HeroConfig[a];
				pos = tcfg_hero.position;
			}
			if (this._show != null) {
				this._show.Destroy();
			}
			this._show = new Avatar(this.oppo_captain_mod)
			this._show.Load(
				tcfg_hero.strFacadeModel, -1, tcfg_hero.modelScale * 2.6, pos[1] / 2, pos[2],
				Laya.Handler.create(this, () => {
					this._show.Play(1, true, true, () => {
					}, true)
					let a = LadderManager.Instance.Oppn_grad
					if (LadderManager.Instance.Oppn_grad == 0) {
						TweenList.to(this, this._show, { PosY: 215 }, 300, () => {
							Tick.Once(200, this, () => {
								TweenList.to(this, this._show, { PosY: -30 }, 300, () => {
									this._show.Destroy();
									this._index++;
								}, 0, Laya.Ease.linearIn)
							});
						}, 0, Laya.Ease.linearIn)
					} else {
						Tick.Clear(this, this.CreatHeroModl)
						TweenList.to(this, this._show, { PosY: 215 }, 1200, () => {
						}, 0, Laya.Ease.linearIn)
					}
				})
			);
		}


		/**进入天梯 */
		private Go_ladder() {
			//播放匹配音效
			if (this.time == 0) {
				SoundManager.Instance.OnPlaySound("res/sound/colck.mp3", 0);
			}
			this.time += 0.1
			this.btn_challage.labelSize = 22;
			this.btn_challage.label = "取消匹配(" + Math.floor(this.time) + "s)"
			if (this.time >= GameParamConfig.LadderMatchTime) {
				//停止播放匹配音效
				SoundManager.Instance.OnStopSound("res/sound/colck.mp3");
				//播放匹配成功音效
				SoundManager.Instance.OnPlaySound("res/sound/match_succese.mp3");
				this.btn_challage.visible = false;
				this.match_win.visible = true;
				this.match_win.text = "匹配成功";
				LadderManager.Instance.K_ReqLadderMatching();
				Tick.Clear(this, this.Go_ladder);
			}
		}

		private Btnclick_close() {
			UIManager.Instance.DestroyUI("LadderView", [ViewDownRoot]);
		}

		private Destroy() {
			SoundManager.Instance.OnStopSound("res/sound/colck.mp3");
			//打开天梯页面中
			LadderManager.Instance._isOpenLadder = false;
			this.offAll();
			Tick.ClearAll(this);
			if (this._show != null) {
				this._show.Destroy();
			}
			Event.RemoveEvent("ReshView_ladder", Laya.Handler.create(this, this.ViewInfo))
			Event.RemoveEvent("matching_ladder", Laya.Handler.create(this, this.MatchIs_win))
			Event.RemoveEvent("btnclick_challag", Laya.Handler.create(this, this.btnclick_challag))
		}
	}
}