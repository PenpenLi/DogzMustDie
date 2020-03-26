var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**Created by the LayaAirIDE*/
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("LadderView", [
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_kicking.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_ladder.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_icon.atlas", type: Laya.Loader.ATLAS },
    ]);
    var LadderView = /** @class */ (function (_super) {
        __extends(LadderView, _super);
        function LadderView() {
            var _this = _super.call(this) || this;
            _this._captain = {};
            _this._index = 101;
            _this.ViewInit();
            return _this;
        }
        LadderView.prototype.ViewInit = function () {
            this.ViewInfo();
            this.ViewEvent();
        };
        LadderView.prototype.ViewEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.Btn_close.on(Laya.Event.CLICK, this, this.Btnclick_close);
            this.btn_hero_war.on(Laya.Event.CLICK, this, this.OpenView, ["KickingWarView"]);
            this.btn_pet_war.on(Laya.Event.CLICK, this, this.OpenView, ["KickingPetView"]);
            this.btn_challage.on(Laya.Event.CLICK, this, this.btnclick_challag);
            this.Btn_buytimes.on(Laya.Event.CLICK, this, this.OpenView, ["BuyTimesView"]);
            this.reward.on(Laya.Event.CLICK, this, this.OpenView, ["LadderReward"]);
            H52D_Framework.Event.RegistEvent("ReshView_ladder", Laya.Handler.create(this, this.ViewInfo));
            H52D_Framework.Event.RegistEvent("matching_ladder", Laya.Handler.create(this, this.MatchIs_win));
            H52D_Framework.Event.RegistEvent("btnclick_challag", Laya.Handler.create(this, this.btnclick_challag));
        };
        LadderView.prototype.ViewInfo = function () {
            //打开天梯页面中
            H52D_Framework.LadderManager.Instance.IsMatching = false;
            H52D_Framework.LadderManager.Instance._isOpenLadder = true;
            //引导按钮
            H52D_Framework.Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_12, this.btn_challage);
            H52D_Framework.KickingLogic.Instance.InitPosInfo();
            var s = H52D_Framework.MasterPlayer.Instance.player.Fraction;
            this._play_Id = H52D_Framework.LadderManager.Instance.GetDuanInfo(s);
            var ntcfg_ladder = H52D_Framework.LadderConfig[this._play_Id];
            this.title.text = H52D_Framework.GetInfoAttr.Instance.GetText(5020);
            var c_num = H52D_Framework.MasterPlayer.Instance.GetEventDayProByType(EventProEnum.LadderTimes);
            var b_num = H52D_Framework.MasterPlayer.Instance.GetEventDayProByType(EventProEnum.BuyLadderTimes);
            //看广告次数
            var ad_num = H52D_Framework.AdvertisingManager.Instance.GetAdvertisingTimes(AdvertisementType.ladder);
            this._fight_time = H52D_Framework.MasterPlayer.Instance.player.Laddertimes - c_num + b_num + ad_num;
            var sys_times = H52D_Framework.GameParamConfig.LadderFreeNum;
            H52D_Framework.SetHtmlStyle(this.my_times, 25, "#fdfdfb", "center");
            this.my_times.innerHTML = "今日剩余次数:" + H52D_Framework.GetHtmlStrByColor(this._fight_time + "", "#c5ffa5") + "/" + sys_times;
            if (this._fight_time <= 0) {
                this._fight_time = 0;
                this.my_times.innerHTML = "今日剩余次数:" + H52D_Framework.GetHtmlStrByColor(this._fight_time + "/" + sys_times, "#ffa5a7");
            }
            this.LadderRank_icon.skin = "ui_icon/" + ntcfg_ladder.DuanIcon;
            var lv = ntcfg_ladder.DuanIconBs;
            this.SetRankLV(lv);
            this.LadderRank_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(ntcfg_ladder.DuanName) + "(" + ntcfg_ladder.DuanMin + "-" + ntcfg_ladder.DuanMax + ")";
            this.play_min.text = "当前积分:" + H52D_Framework.MasterPlayer.Instance.player.Fraction + "/" + ntcfg_ladder.DuanMax;
            this.play_lv.text = H52D_Framework.MasterPlayer.Instance.player.Level + "";
            this.play_ladderrank.text = "胜场:" + H52D_Framework.MasterPlayer.Instance.player.LadderWinnNum;
            this.play_win_num.text = "   ";
            this.play_name.text = H52D_Framework.MasterPlayer.Instance.player.Name;
            this.SetModler(H52D_Framework.LadderManager.Instance.GetCaptainId(), "my_captain_mod", true); //获取玩家的英雄队长ID
            this.Handle();
            if (b_num >= 10 && this._fight_time == 0) {
                if (!H52D_Framework.LadderManager.Instance.IsMatching) {
                    this.btn_challage.visible = false;
                    this.match_win.visible = true;
                    this.match_win.text = H52D_Framework.GetInfoAttr.Instance.GetText(7131);
                }
            }
            this.oppo_captain(false);
            if (H52D_Framework.LadderManager.Instance.Oppn_grad != 0) {
                this.oppo_captain(true);
            }
        };
        LadderView.prototype.MatchIs_win = function () {
            this.btn_challage.label = "匹配";
            this.oppo_captain(false);
            this.btn_challage.visible = true;
            this.match_win.visible = false;
            H52D_Framework.Tick.Clear(this, this.CreatHeroModl);
        };
        LadderView.prototype.SetRankLV = function (lv) {
            var str;
            switch (lv) {
                case 1:
                    str = "ui_icon/icon_duanwei_shuzi_yi.png";
                    this.rank_lv_2.skin = str;
                    this.rank_lv_1.visible = this.rank_lv_3.visible = false;
                    break;
                case 2:
                    str = "ui_icon/icon_duanwei_shuzi_yi.png";
                    this.rank_lv_1.skin = this.rank_lv_3.skin = str;
                    this.rank_lv_2.visible = false;
                    break;
                case 3:
                    str = "ui_icon/icon_duanwei_shuzi_yi.png";
                    this.rank_lv_1.skin = this.rank_lv_3.skin = this.rank_lv_2.skin = str;
                    break;
                case 4:
                    str = "ui_icon/icon_duanwei_shuzi_yi.png";
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
        };
        /**设置队长模型 */
        LadderView.prototype.SetModler = function (HeroID, str, bool) {
            var _this = this;
            if (this._captain[str]) {
                this._captain[str].Destroy();
            }
            var tcfg_hero = H52D_Framework.HeroConfig[HeroID];
            var pos = tcfg_hero.position;
            var x;
            var left = 1;
            if (bool) {
                x = 95;
            }
            else {
                x = 77;
                left = -1;
            }
            this._captain[str] = new H52D_Framework.Avatar(this[str]);
            this._captain[str].Load(tcfg_hero.strFacadeModel, left, tcfg_hero.modelScale * 2.6, x, pos[2], Laya.Handler.create(this, function () {
                _this._captain[str].Play(1, true, true, function () {
                }, true);
            }));
        };
        LadderView.prototype.oppo_captain = function (bool) {
            if (bool) {
                var s = H52D_Framework.LadderConfig[H52D_Framework.LadderManager.Instance.Oppn_grad].DuanName;
                this.oppo_lv.text = "";
                this.oppo_ladderrank.text = "胜场:" + H52D_Framework.LadderManager.Instance.OppnWinTimes; //GetInfoAttr.Instance.GetText(s);
                this.oppo_win_num.text = "";
                this.oppo_name.text = H52D_Framework.LadderManager.Instance.OPpn_name;
                this.oppo_captain_mod.skin = "";
                //this.oppo_captain_mod.y -= 140;
            }
            else {
                this.oppo_lv.text = "???";
                this.oppo_ladderrank.text = "胜场:???";
                this.oppo_win_num.text = "???胜";
                this.oppo_name.text = "???";
                this.oppo_captain_mod.skin = "ui_ladder/btn-wenhao-tianti.png";
            }
        };
        /**设置奖励道具 */
        LadderView.prototype.Handle = function () {
            var ntcfg = H52D_Framework.LadderConfig[this._play_Id];
            var item_Info = H52D_Framework.RewardConfig[ntcfg.WinBaseAward].reWrad[1];
            var item_tcfg = H52D_Framework.ItemConfig[item_Info[2]];
            this.win_basename.text = H52D_Framework.GetInfoAttr.Instance.GetText(item_tcfg.dwItemName);
            this.win_basebg.bgColor = H52D_Framework.BaseDefine.LadderItemBgColor[item_tcfg.dwItemQuality];
            this.win_baseicon.skin = "ui_icon/" + item_tcfg.strIconID_B;
            this.win_basename.color = H52D_Framework.BaseDefine.LabelColor[item_tcfg.dwItemQuality];
            item_Info = H52D_Framework.RewardConfig[ntcfg.WinExtraAward].reWrad[1];
            item_tcfg = H52D_Framework.ItemConfig[item_Info[2]];
            this.win_extraname.text = H52D_Framework.GetInfoAttr.Instance.GetText(item_tcfg.dwItemName);
            this.win_extrabg.bgColor = H52D_Framework.BaseDefine.LadderItemBgColor[item_tcfg.dwItemQuality];
            this.win_extraicon.skin = "ui_icon/" + item_tcfg.strIconID_B;
            this.win_extraname.color = H52D_Framework.BaseDefine.LabelColor[item_tcfg.dwItemQuality];
        };
        LadderView.prototype.OpenView = function (name) {
            if (H52D_Framework.LadderManager.Instance.IsMatching) {
                if ((name == "KickingWarView") || (name == "KickingPetView") || name == "BuyTimesView") {
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips("匹配过程中不能进行此操作！");
                    return;
                }
            }
            if (name == "KickingWarView") {
                H52D_Framework.UIManager.Instance.CreateUI(name, [H52D_Framework.ViewToppestRoot, H52D_Framework.ActionType.ladder]);
                return;
            }
            if (name == "BuyTimesView") {
                if (H52D_Framework.IsAD()) {
                    if (!H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes) {
                        H52D_Framework.UIManager.Instance.CreateUI(name, [H52D_Framework.ViewToppestRoot, this._play_Id]);
                    }
                    else {
                        H52D_Framework.UIManager.Instance.CreateUI("AdvertisementView", [H52D_Framework.ViewUpRoot, AdvertisementType.ladder]);
                    }
                }
                else {
                    H52D_Framework.UIManager.Instance.CreateUI(name, [H52D_Framework.ViewToppestRoot, this._play_Id]);
                }
            }
            else {
                H52D_Framework.UIManager.Instance.CreateUI(name, [H52D_Framework.ViewToppestRoot, this._play_Id]);
            }
        };
        /**匹配按钮的点击事件 */
        LadderView.prototype.btnclick_challag = function () {
            H52D_Framework.LadderManager.Instance.IsMatching = !H52D_Framework.LadderManager.Instance.IsMatching;
            if (H52D_Framework.LadderManager.Instance.IsMatching) {
                if (this._fight_time <= 0) {
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips("挑战次数不足！");
                    H52D_Framework.LadderManager.Instance.IsMatching = false;
                    return;
                }
                this.oppo_captain_mod.skin = "";
                this.time = 0;
                H52D_Framework.Tick.Loop(900, this, this.CreatHeroModl);
                H52D_Framework.Tick.Loop(100, this, this.Go_ladder);
            }
            else {
                H52D_Framework.Tick.Clear(this, this.Go_ladder);
                H52D_Framework.Tick.Clear(this, this.CreatHeroModl);
                this.btn_challage.label = "匹配";
                this.oppo_captain(false);
                //取消匹配停止匹配音效
                H52D_Framework.SoundManager.Instance.OnStopSound("res/sound/colck.mp3");
            }
        };
        /**创建模型 */
        LadderView.prototype.CreatHeroModl = function () {
            var _this = this;
            // if (LadderManager.Instance.IsMatching) {
            var tcfg_hero;
            var pos;
            if (H52D_Framework.LadderManager.Instance.Oppn_grad == 0) {
                tcfg_hero = H52D_Framework.HeroConfig[this._index];
                if (!tcfg_hero) {
                    this._index = 101;
                    tcfg_hero = H52D_Framework.HeroConfig[this._index];
                }
                pos = tcfg_hero.position;
            }
            else {
                var a = H52D_Framework.LadderManager.Instance.Oppncaptain;
                tcfg_hero = H52D_Framework.HeroConfig[a];
                pos = tcfg_hero.position;
            }
            if (this._show != null) {
                this._show.Destroy();
            }
            this._show = new H52D_Framework.Avatar(this.oppo_captain_mod);
            this._show.Load(tcfg_hero.strFacadeModel, -1, tcfg_hero.modelScale * 2.6, pos[1] / 2, pos[2], Laya.Handler.create(this, function () {
                _this._show.Play(1, true, true, function () {
                }, true);
                var a = H52D_Framework.LadderManager.Instance.Oppn_grad;
                if (H52D_Framework.LadderManager.Instance.Oppn_grad == 0) {
                    H52D_Framework.TweenList.to(_this, _this._show, { PosY: 215 }, 300, function () {
                        H52D_Framework.Tick.Once(200, _this, function () {
                            H52D_Framework.TweenList.to(_this, _this._show, { PosY: -30 }, 300, function () {
                                _this._show.Destroy();
                                _this._index++;
                            }, 0, Laya.Ease.linearIn);
                        });
                    }, 0, Laya.Ease.linearIn);
                }
                else {
                    H52D_Framework.Tick.Clear(_this, _this.CreatHeroModl);
                    H52D_Framework.TweenList.to(_this, _this._show, { PosY: 215 }, 1200, function () {
                    }, 0, Laya.Ease.linearIn);
                }
            }));
        };
        /**进入天梯 */
        LadderView.prototype.Go_ladder = function () {
            //播放匹配音效
            if (this.time == 0) {
                H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/colck.mp3", 0);
            }
            this.time += 0.1;
            this.btn_challage.labelSize = 22;
            this.btn_challage.label = "取消匹配(" + Math.floor(this.time) + "s)";
            if (this.time >= H52D_Framework.GameParamConfig.LadderMatchTime) {
                //停止播放匹配音效
                H52D_Framework.SoundManager.Instance.OnStopSound("res/sound/colck.mp3");
                //播放匹配成功音效
                H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/match_succese.mp3");
                this.btn_challage.visible = false;
                this.match_win.visible = true;
                this.match_win.text = "匹配成功";
                H52D_Framework.LadderManager.Instance.K_ReqLadderMatching();
                H52D_Framework.Tick.Clear(this, this.Go_ladder);
            }
        };
        LadderView.prototype.Btnclick_close = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("LadderView", [H52D_Framework.ViewDownRoot]);
        };
        LadderView.prototype.Destroy = function () {
            H52D_Framework.SoundManager.Instance.OnStopSound("res/sound/colck.mp3");
            //打开天梯页面中
            H52D_Framework.LadderManager.Instance._isOpenLadder = false;
            this.offAll();
            H52D_Framework.Tick.ClearAll(this);
            if (this._show != null) {
                this._show.Destroy();
            }
            H52D_Framework.Event.RemoveEvent("ReshView_ladder", Laya.Handler.create(this, this.ViewInfo));
            H52D_Framework.Event.RemoveEvent("matching_ladder", Laya.Handler.create(this, this.MatchIs_win));
            H52D_Framework.Event.RemoveEvent("btnclick_challag", Laya.Handler.create(this, this.btnclick_challag));
        };
        return LadderView;
    }(ui.action.Ladder.LadderViewUI));
    H52D_Framework.LadderView = LadderView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=LadderView.js.map