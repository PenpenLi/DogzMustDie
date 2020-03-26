module H52D_Framework {
    AddViewResource("ChampionPraiseView",
        [
            { url: "res/ui/ui_common.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_main.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_match.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_icon.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
        ]);
    export class ChampionPraiseView extends ui.action.match.ChampionPraiseViewUI {
        constructor() {
            super();
            this._heroAvatarMap = {};
            this.ViewInfo();
            this.AddEvent();
        }
        private _heroAvatarMap: { [pos: number]: Avatar } = {};
        //哪一方获胜 1or2
        private winNum: number;
        //两方玩家姓名
        private playerName_1: string;
        private playerName_2: string;
        //当前活动剩余总秒数
        private _surplusTime: number;
        private _min: string;
        private _sec: string;
        private dataPraise: number;

        private ViewInfo() {
            this.winNum = MatchLogic.Instance.winnerIndexInGroup;
            this.dataPraise = MatchLogic.Instance.curPraiseInfo[0];//1左  2右
            this.ShowTitle();
            this.ShowPlayerInfo();
            this.ShowTime();
            Tick.Loop(1000, this, this.ShowTime);
            this.ShowHeroView();
            this.ShowChangeInfoView();

        }
        private AddEvent() {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.Btn_close.on(Laya.Event.CLICK, this, this.Btn_clickclose);
            this.Btn_see.on(Laya.Event.CLICK, this, this.WatchChampionMatch);
            //点赞参数为阶段，组号，位置，当前是否有值
            this.Btn_praise_1.on(Laya.Event.CLICK, this, this.Btn_Praise, [MatchLogic.Instance.curMatchStage, 1, StanceType.eLeft, this.dataPraise]);
            this.Btn_praise_2.on(Laya.Event.CLICK, this, this.Btn_Praise, [MatchLogic.Instance.curMatchStage, 1, StanceType.eRight, this.dataPraise]);
            Event.RegistEvent("MatchChampionUpdateView", Laya.Handler.create(this, this.UpdateView));
        }
        private Destroy() {
            this.offAll();
            Tick.ClearAll(this);
            Event.RemoveEvent("MatchChampionUpdateView", Laya.Handler.create(this, this.UpdateView));
            for (let pos in this._heroAvatarMap) {
                let mod = this._heroAvatarMap[pos]
                if (mod != null) {
                    mod.Destroy();
                }
            }
            this._heroAvatarMap = {};
        }

        //刷新界面用
        private UpdateView(){
            this.ShowPlayerInfo();
            this.ShowChangeInfoView();
        }

        //显示标题
        private ShowTitle() {
            if (MatchLogic.Instance.isSeeStage) {
                this.title.text = "冠军观战";
            }
            else {
                this.title.text = "冠军点赞";
            }
        }

        //显示玩家名字,赔率，点赞花费
        private ShowPlayerInfo() {
            let playerInfo1 = MatchLogic.Instance.curFightPlayerList[1][1];
            let playerInfo2 = MatchLogic.Instance.curFightPlayerList[1][2];

            this.playerName_1 = playerInfo1[2].toString();
            if (this.playerName_1 == MasterPlayer.Instance.player.Name) {
                this.Name_1.text = "我";
            }
            else {
                this.Name_1.text = this.playerName_1;
            }

            this.playerName_2 = playerInfo2[2].toString();
            if (this.playerName_2 == MasterPlayer.Instance.player.Name) {
                this.Name_2.text = "我";
            }
            else {
                this.Name_2.text = this.playerName_2;
            }

            this.odds_1.changeText("赔率" + (playerInfo1[3] / 100).toString());
            this.odds_2.changeText("赔率" + (playerInfo2[3] / 100).toString());
            this.praiseCost_1.changeText(MatchLogic.Instance.curPraiseCost.toString());
            this.praiseCost_2.changeText(MatchLogic.Instance.curPraiseCost.toString());
        }

        //倒计时
        private ShowTime() {
            this._surplusTime = MatchLogic.Instance.GetCountDown();
            if (this._surplusTime <= 0) {
                this._surplusTime = 0;
            }
            this._min = Math.floor(this._surplusTime / 60).toString();
            this._sec = (this._surplusTime % 60).toString();
            if (MatchLogic.Instance.isSeeStage) {
                this.Time.text = Format(GetInfoAttr.Instance.GetText(7113), this._min, this._sec, MatchLogic.Instance.currentTypeNum);
            }
            else {
                this.Time.text = Format(GetInfoAttr.Instance.GetText(7112), this._min, this._sec, MatchLogic.Instance.currentTypeNum);
            }

            //如果是追后一个阶段（直接关闭界面）
            if (this._surplusTime <= 0 && MatchLogic.Instance.curMatchStage == MacthType.eLeagueWar1) {
                this.Btn_clickclose();
                return;
            }

            //打开下个界面
            if (this._surplusTime <= 0 && !MatchLogic.Instance.isAllredaySendOpen) {
                MatchLogic.Instance.isAllredaySendOpen = true;
                Tick.Once(1000, this, () => {
                    MatchLogic.Instance.OpenMatchUI();
                })
            }
        }

        //根据不同状态显示（可刷新界面）
        public ShowChangeInfoView() {
            //先给点赞数据信息重新付个值
            this.dataPraise = MatchLogic.Instance.curPraiseInfo[0];
            if (MatchLogic.Instance.isSeeStage) {
                /**是观战状态 */
                this.Btn_praise_1.visible = false;
                this.Btn_praise_2.visible = false;
                this.Btn_see.visible = true;
                if (MatchLogic.Instance.curPraiseInfo[0] == 1 || MatchLogic.Instance.curPraiseInfo[0] == 2) {
                    if (MatchLogic.Instance.curPraiseInfo[0] == 1) {
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
                if (MatchLogic.Instance.curPraiseInfo[0] == 1 || MatchLogic.Instance.curPraiseInfo[0] == 2) {
                    if (MatchLogic.Instance.curPraiseInfo[0] == 1) {
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
            if (MatchLogic.Instance.isWatchMatch && MatchLogic.Instance.isSeeStage) {
                //传入获胜是哪个
                this.ShowWin(this.winNum);
            }
        }

        private ShowWin(index: number) {
            //判断决赛玩家有没有自己
            if (MasterPlayer.Instance.player.Name == this.playerName_1) {
                if (index == StanceType.eLeft) {
                    //this.box_2.gray = true;
                    this.WinOrFail_1.visible = true;
                }
                else {
                    //this.box_1.gray = true;
                    this.WinOrFail_1.visible = true;
                    this.WinOrFail_1.skin = "ui_match/icon-pkliansai-shibai.png"
                }
                return;
            }
            else if (MasterPlayer.Instance.player.Name == this.playerName_2) {
                if (index == StanceType.eRight) {
                    // this.box_1.gray = true;
                    this.WinOrFail_2.visible = true;
                }
                else {
                    //this.box_2.gray = true;
                    this.WinOrFail_2.visible = true;
                    this.WinOrFail_2.skin = "ui_match/icon-pkliansai-shibai.png"
                }
                return;
            }

            //没有的情况
            if (index == StanceType.eLeft) {
                //this.box_2.gray = true;
                this.WinOrFail_1.visible = true;
            }
            else {
                //this.box_1.gray = true;                
                this.WinOrFail_2.visible = true;
            }
        }


        /** 显示阵容 */
        public ShowHeroView() {
            //使用临时数据
            let tPositionWar = MatchLogic.Instance.ChampionPlayerInfoAll;
            let k = 0;
            //0为左侧阵容 1为右侧阵容
            for (let i = 0; i <= 1; i++) {
                let j = i + 1;
                for (let pos = 0; pos <= 8; pos++) {
                    let Mod: Laya.View = this["mod" + pos + "_" + j];
                    let nHeroID = tPositionWar[i][pos.toString()];
                    if ((nHeroID == null)) {
                    }
                    else {
                        let path = HeroConfig[nHeroID].strFacadeModel;
                        let tPosInfo = this.GetDirAndScale(nHeroID, i);
                        this._heroAvatarMap[k] = new Avatar(Mod);
                        this._heroAvatarMap[k].Load(path, tPosInfo[0], tPosInfo[1], 0, 0, Laya.Handler.create(this, (avatar) => {
                            avatar.visible = true;
                            avatar.Play(AnimationName.idle, true);
                            avatar.SetOrder(pos);
                        }));
                        k = k + 1;
                    }
                }
            }
        }
        /** 获取方向和坐标 */
        private GetDirAndScale(nHeroID, i) {
            if (i == 0) {
                let dir = 1;
                let scale = HeroConfig[nHeroID].modelScale;
                return [dir, scale];
            }
            else {
                let dir = -1;
                let scale = HeroConfig[nHeroID].modelScale;;
                return [dir, scale]
            }
        }
        /**点赞按钮事件 */
        private Btn_Praise(type, groupNum, btnNum, dataPraise) {
            /**判断钻石是否足够， */
            let play_d_num = BagManager.Instance.getItemNumber(BaseDefine.ItemIdDiamonds);//已拥有钻石数量
            if (play_d_num >= MatchLogic.Instance.curPraiseCost) {
                if (dataPraise == 0) {
                    MatchLogic.Instance.K_ReqLeagueBetInfo(type, groupNum, btnNum);
                }
            } else {
                if (IsShieldRecharge()) {
                    let str = SysPromptConfig[30060].strPromptInfo;
                    TipsLogic.Instance.OpenMessageBox(str,
                        Laya.Handler.create(this, () => {
                            let panel_id = ViewUILogic.Instance.OpenPanel;
                            UIManager.Instance.DestroyUI(this.name, [this.parent]);
                        }));
                } else {
                    let str = SysPromptConfig[10014].strPromptInfo;
                    TipsLogic.Instance.OpenMessageBox(str,
                        Laya.Handler.create(this, () => {
                            let panel_id = ViewUILogic.Instance.OpenPanel
                            if (panel_id != E_OpenGrade.SHOP) {
                                ViewUILogic.Instance.halfPanel = false;
                                UIManager.Instance.DestroyUI(this.name, [this.parent]);
                                Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
                                ViewUILogic.Instance.OpenPanel = E_OpenGrade.SHOP;

                                OneTimer(500, () => {
                                    Event.DispatchEvent("toGemShop");
                                });
                            } else {
                                UIManager.Instance.DestroyUI(this.name, [this.parent]);
                            }
                        }));
                }
            }
        }

        /**关闭界面 */
        private Btn_clickclose() {
            UIManager.Instance.DestroyUI(this.name, [this.parent]);
            //Event.DispatchEvent("OnPanelClick", [E_OpenGrade.ACTION]);
        }
        /**观看决赛 */
        private WatchChampionMatch() {
            MatchLogic.Instance.isWatchMatch = true;
            MatchLogic.Instance.K_ReqWatchLeague(MatchLogic.Instance.curMatchStage, 1, this.playerName_1, this.playerName_2);//参数为 （阶段，组）
        }
    }
}