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
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("ChampionPraiseView", [
        { url: "res/ui/ui_common.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_main.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_match.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_icon.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
    ]);
    var ChampionPraiseView = /** @class */ (function (_super) {
        __extends(ChampionPraiseView, _super);
        function ChampionPraiseView() {
            var _this = _super.call(this) || this;
            _this._heroAvatarMap = {};
            _this._heroAvatarMap = {};
            _this.ViewInfo();
            _this.AddEvent();
            return _this;
        }
        ChampionPraiseView.prototype.ViewInfo = function () {
            this.winNum = H52D_Framework.MatchLogic.Instance.winnerIndexInGroup;
            this.dataPraise = H52D_Framework.MatchLogic.Instance.curPraiseInfo[0]; //1左  2右
            this.ShowTitle();
            this.ShowPlayerInfo();
            this.ShowTime();
            H52D_Framework.Tick.Loop(1000, this, this.ShowTime);
            this.ShowHeroView();
            this.ShowChangeInfoView();
        };
        ChampionPraiseView.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.Btn_close.on(Laya.Event.CLICK, this, this.Btn_clickclose);
            this.Btn_see.on(Laya.Event.CLICK, this, this.WatchChampionMatch);
            //点赞参数为阶段，组号，位置，当前是否有值
            this.Btn_praise_1.on(Laya.Event.CLICK, this, this.Btn_Praise, [H52D_Framework.MatchLogic.Instance.curMatchStage, 1, H52D_Framework.StanceType.eLeft, this.dataPraise]);
            this.Btn_praise_2.on(Laya.Event.CLICK, this, this.Btn_Praise, [H52D_Framework.MatchLogic.Instance.curMatchStage, 1, H52D_Framework.StanceType.eRight, this.dataPraise]);
            H52D_Framework.Event.RegistEvent("MatchChampionUpdateView", Laya.Handler.create(this, this.UpdateView));
        };
        ChampionPraiseView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Tick.ClearAll(this);
            H52D_Framework.Event.RemoveEvent("MatchChampionUpdateView", Laya.Handler.create(this, this.UpdateView));
            for (var pos in this._heroAvatarMap) {
                var mod = this._heroAvatarMap[pos];
                if (mod != null) {
                    mod.Destroy();
                }
            }
            this._heroAvatarMap = {};
        };
        //刷新界面用
        ChampionPraiseView.prototype.UpdateView = function () {
            this.ShowPlayerInfo();
            this.ShowChangeInfoView();
        };
        //显示标题
        ChampionPraiseView.prototype.ShowTitle = function () {
            if (H52D_Framework.MatchLogic.Instance.isSeeStage) {
                this.title.text = "冠军观战";
            }
            else {
                this.title.text = "冠军点赞";
            }
        };
        //显示玩家名字,赔率，点赞花费
        ChampionPraiseView.prototype.ShowPlayerInfo = function () {
            var playerInfo1 = H52D_Framework.MatchLogic.Instance.curFightPlayerList[1][1];
            var playerInfo2 = H52D_Framework.MatchLogic.Instance.curFightPlayerList[1][2];
            this.playerName_1 = playerInfo1[2].toString();
            if (this.playerName_1 == H52D_Framework.MasterPlayer.Instance.player.Name) {
                this.Name_1.text = "我";
            }
            else {
                this.Name_1.text = this.playerName_1;
            }
            this.playerName_2 = playerInfo2[2].toString();
            if (this.playerName_2 == H52D_Framework.MasterPlayer.Instance.player.Name) {
                this.Name_2.text = "我";
            }
            else {
                this.Name_2.text = this.playerName_2;
            }
            this.odds_1.changeText("赔率" + (playerInfo1[3] / 100).toString());
            this.odds_2.changeText("赔率" + (playerInfo2[3] / 100).toString());
            this.praiseCost_1.changeText(H52D_Framework.MatchLogic.Instance.curPraiseCost.toString());
            this.praiseCost_2.changeText(H52D_Framework.MatchLogic.Instance.curPraiseCost.toString());
        };
        //倒计时
        ChampionPraiseView.prototype.ShowTime = function () {
            this._surplusTime = H52D_Framework.MatchLogic.Instance.GetCountDown();
            if (this._surplusTime <= 0) {
                this._surplusTime = 0;
            }
            this._min = Math.floor(this._surplusTime / 60).toString();
            this._sec = (this._surplusTime % 60).toString();
            if (H52D_Framework.MatchLogic.Instance.isSeeStage) {
                this.Time.text = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(7113), this._min, this._sec, H52D_Framework.MatchLogic.Instance.currentTypeNum);
            }
            else {
                this.Time.text = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(7112), this._min, this._sec, H52D_Framework.MatchLogic.Instance.currentTypeNum);
            }
            //如果是追后一个阶段（直接关闭界面）
            if (this._surplusTime <= 0 && H52D_Framework.MatchLogic.Instance.curMatchStage == H52D_Framework.MacthType.eLeagueWar1) {
                this.Btn_clickclose();
                return;
            }
            //打开下个界面
            if (this._surplusTime <= 0 && !H52D_Framework.MatchLogic.Instance.isAllredaySendOpen) {
                H52D_Framework.MatchLogic.Instance.isAllredaySendOpen = true;
                H52D_Framework.Tick.Once(1000, this, function () {
                    H52D_Framework.MatchLogic.Instance.OpenMatchUI();
                });
            }
        };
        //根据不同状态显示（可刷新界面）
        ChampionPraiseView.prototype.ShowChangeInfoView = function () {
            //先给点赞数据信息重新付个值
            this.dataPraise = H52D_Framework.MatchLogic.Instance.curPraiseInfo[0];
            if (H52D_Framework.MatchLogic.Instance.isSeeStage) {
                /**是观战状态 */
                this.Btn_praise_1.visible = false;
                this.Btn_praise_2.visible = false;
                this.Btn_see.visible = true;
                if (H52D_Framework.MatchLogic.Instance.curPraiseInfo[0] == 1 || H52D_Framework.MatchLogic.Instance.curPraiseInfo[0] == 2) {
                    if (H52D_Framework.MatchLogic.Instance.curPraiseInfo[0] == 1) {
                        this.Praise_1.visible = true;
                        this.Praise_2.visible = false;
                    }
                    else {
                        this.Praise_2.visible = true;
                        this.Praise_1.visible = false;
                    }
                }
            }
            else {
                this.Btn_praise_1.visible = true;
                this.Btn_praise_2.visible = true;
                this.Btn_see.visible = false;
                if (H52D_Framework.MatchLogic.Instance.curPraiseInfo[0] == 1 || H52D_Framework.MatchLogic.Instance.curPraiseInfo[0] == 2) {
                    if (H52D_Framework.MatchLogic.Instance.curPraiseInfo[0] == 1) {
                        this.Btn_text_1.text = "已点赞";
                        this.Praise_1.visible = true;
                        this.Praise_2.visible = false;
                        this.Btn_praise_2.disabled = true;
                    }
                    else {
                        this.Btn_text_2.text = "已点赞";
                        this.Praise_2.visible = true;
                        this.Praise_1.visible = false;
                        this.Btn_praise_1.disabled = true;
                    }
                }
                else {
                    this.Praise_1.visible = false;
                    this.Praise_2.visible = false;
                }
            }
            //判断玩家是否完成观战
            if (H52D_Framework.MatchLogic.Instance.isWatchMatch && H52D_Framework.MatchLogic.Instance.isSeeStage) {
                //传入获胜是哪个
                this.ShowWin(this.winNum);
            }
        };
        ChampionPraiseView.prototype.ShowWin = function (index) {
            //判断决赛玩家有没有自己
            if (H52D_Framework.MasterPlayer.Instance.player.Name == this.playerName_1) {
                if (index == H52D_Framework.StanceType.eLeft) {
                    //this.box_2.gray = true;
                    this.WinOrFail_1.visible = true;
                }
                else {
                    //this.box_1.gray = true;
                    this.WinOrFail_1.visible = true;
                    this.WinOrFail_1.skin = "ui_match/icon-pkliansai-shibai.png";
                }
                return;
            }
            else if (H52D_Framework.MasterPlayer.Instance.player.Name == this.playerName_2) {
                if (index == H52D_Framework.StanceType.eRight) {
                    // this.box_1.gray = true;
                    this.WinOrFail_2.visible = true;
                }
                else {
                    //this.box_2.gray = true;
                    this.WinOrFail_2.visible = true;
                    this.WinOrFail_2.skin = "ui_match/icon-pkliansai-shibai.png";
                }
                return;
            }
            //没有的情况
            if (index == H52D_Framework.StanceType.eLeft) {
                //this.box_2.gray = true;
                this.WinOrFail_1.visible = true;
            }
            else {
                //this.box_1.gray = true;                
                this.WinOrFail_2.visible = true;
            }
        };
        /** 显示阵容 */
        ChampionPraiseView.prototype.ShowHeroView = function () {
            //使用临时数据
            var tPositionWar = H52D_Framework.MatchLogic.Instance.ChampionPlayerInfoAll;
            var k = 0;
            //0为左侧阵容 1为右侧阵容
            for (var i = 0; i <= 1; i++) {
                var j = i + 1;
                var _loop_1 = function (pos) {
                    var Mod = this_1["mod" + pos + "_" + j];
                    var nHeroID = tPositionWar[i][pos.toString()];
                    if ((nHeroID == null)) {
                    }
                    else {
                        var path = H52D_Framework.HeroConfig[nHeroID].strFacadeModel;
                        var tPosInfo = this_1.GetDirAndScale(nHeroID, i);
                        this_1._heroAvatarMap[k] = new H52D_Framework.Avatar(Mod);
                        this_1._heroAvatarMap[k].Load(path, tPosInfo[0], tPosInfo[1], 0, 0, Laya.Handler.create(this_1, function (avatar) {
                            avatar.visible = true;
                            avatar.Play(H52D_Framework.AnimationName.idle, true);
                            avatar.SetOrder(pos);
                        }));
                        k = k + 1;
                    }
                };
                var this_1 = this;
                for (var pos = 0; pos <= 8; pos++) {
                    _loop_1(pos);
                }
            }
        };
        /** 获取方向和坐标 */
        ChampionPraiseView.prototype.GetDirAndScale = function (nHeroID, i) {
            if (i == 0) {
                var dir = 1;
                var scale = H52D_Framework.HeroConfig[nHeroID].modelScale;
                return [dir, scale];
            }
            else {
                var dir = -1;
                var scale = H52D_Framework.HeroConfig[nHeroID].modelScale;
                ;
                return [dir, scale];
            }
        };
        /**点赞按钮事件 */
        ChampionPraiseView.prototype.Btn_Praise = function (type, groupNum, btnNum, dataPraise) {
            var _this = this;
            /**判断钻石是否足够， */
            var play_d_num = H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdDiamonds); //已拥有钻石数量
            if (play_d_num >= H52D_Framework.MatchLogic.Instance.curPraiseCost) {
                if (dataPraise == 0) {
                    H52D_Framework.MatchLogic.Instance.K_ReqLeagueBetInfo(type, groupNum, btnNum);
                }
            }
            else {
                if (H52D_Framework.IsShieldRecharge()) {
                    var str = H52D_Framework.SysPromptConfig[30060].strPromptInfo;
                    H52D_Framework.TipsLogic.Instance.OpenMessageBox(str, Laya.Handler.create(this, function () {
                        var panel_id = H52D_Framework.ViewUILogic.Instance.OpenPanel;
                        H52D_Framework.UIManager.Instance.DestroyUI(_this.name, [_this.parent]);
                    }));
                }
                else {
                    var str = H52D_Framework.SysPromptConfig[10014].strPromptInfo;
                    H52D_Framework.TipsLogic.Instance.OpenMessageBox(str, Laya.Handler.create(this, function () {
                        var panel_id = H52D_Framework.ViewUILogic.Instance.OpenPanel;
                        if (panel_id != E_OpenGrade.SHOP) {
                            H52D_Framework.ViewUILogic.Instance.halfPanel = false;
                            H52D_Framework.UIManager.Instance.DestroyUI(_this.name, [_this.parent]);
                            H52D_Framework.Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
                            H52D_Framework.ViewUILogic.Instance.OpenPanel = E_OpenGrade.SHOP;
                            H52D_Framework.OneTimer(500, function () {
                                H52D_Framework.Event.DispatchEvent("toGemShop");
                            });
                        }
                        else {
                            H52D_Framework.UIManager.Instance.DestroyUI(_this.name, [_this.parent]);
                        }
                    }));
                }
            }
        };
        /**关闭界面 */
        ChampionPraiseView.prototype.Btn_clickclose = function () {
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [this.parent]);
            //Event.DispatchEvent("OnPanelClick", [E_OpenGrade.ACTION]);
        };
        /**观看决赛 */
        ChampionPraiseView.prototype.WatchChampionMatch = function () {
            H52D_Framework.MatchLogic.Instance.isWatchMatch = true;
            H52D_Framework.MatchLogic.Instance.K_ReqWatchLeague(H52D_Framework.MatchLogic.Instance.curMatchStage, 1, this.playerName_1, this.playerName_2); //参数为 （阶段，组）
        };
        return ChampionPraiseView;
    }(ui.action.match.ChampionPraiseViewUI));
    H52D_Framework.ChampionPraiseView = ChampionPraiseView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ChampionPraiseView.js.map