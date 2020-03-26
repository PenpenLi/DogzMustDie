
module H52D_Framework {
    AddViewResource("MatchPraiseView",
        [
            { url: "res/ui/ui_memory.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_match.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_head.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_icon.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
        ]);
    export class MatchPraiseView extends ui.action.match.MatchPraiseViewUI {
        constructor() {
            super();
            this.ViewInfo();
            this.AddEvent();
        }
        /**剩余点赞次数 */
        private myNum: number;
        /**总点赞次数 */
        private totalNum: number;

        /**当前是哪一场 */
        private matchNum: number;

        /**本厂点赞数据 */
        private dataPraiseList: any;

        /**是否显示观战按钮,是否是观战阶段 */
        private _bool: boolean;

        //当前活动剩余总秒数
        private _surplusTime: number;
        private _min: string;
        private _sec: string;

        public ViewInfo() {
            this._bool = MatchLogic.Instance.isSeeStage;
            this.ShowTitle();
            this.ShowPraiseCount();
            this.ShowTime();
            Tick.Loop(1000, this, this.ShowTime);

            this.groupList.vScrollBarSkin = "";
            this.SetDataToList();
            //this.groupList.repeatY = this.groupList.array.length;
        }

        private AddEvent() {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_close.on(Laya.Event.CLICK, this, this.CloseUI);
            Event.RegistEvent("MatchPraiseUpdateView", Laya.Handler.create(this, this.UpdateItem));
        }

        private Destroy() {
            this.offAll();
            Tick.ClearAll(this);
            Event.RemoveEvent("MatchPraiseUpdateView", Laya.Handler.create(this, this.UpdateItem));
        }

        /**显示标题 */
        private ShowTitle() {
            this.matchNum = MatchLogic.Instance.currentTypeNum;
            if (this._bool) {
                //是观战状态
                this.title_text.text = this.matchNum + "强观战";
            }
            else {
                this.title_text.text = this.matchNum + "强点赞";
            }
        }

        /**显示剩余点赞次数*/
        private ShowPraiseCount() {
            if (this._bool) {
                //是观战状态不显示剩余次数
                this.praiseCount.visible = false;
                return;
            }
            this.praiseCount.visible = true;
            //本阶段总次数
            this.totalNum = MatchLogic.Instance.totalPraiseTimes;
            //剩余次数
            this.myNum = MatchLogic.Instance.totalPraiseTimes - MatchLogic.Instance.praiseTimes;
            SetHtmlStyle(this.praiseCount, 22, "#e4eafe", "left");
            this.praiseCount.innerHTML = "剩余点赞：" + "<font color='#fefeff'>" + this.myNum + "</font>" + "/" + this.totalNum;
        }
        //倒计时
        private ShowTime() {
            this._surplusTime = MatchLogic.Instance.GetCountDown();
            if (this._surplusTime <= 0) {
                this._surplusTime = 0;
            }
            this._min = Math.floor(this._surplusTime / 60).toString();
            this._sec = (this._surplusTime % 60).toString();
            if (!this._bool) {
                //不是观战阶段
                this.timetext.text = Format(GetInfoAttr.Instance.GetText(7111), this._min, this._sec, this.matchNum);
            }
            else {
                if (MatchLogic.Instance.curMatchStage == MacthType.eLeagueWar2) {//要进入冠军点赞时显示
                    this.timetext.text = Format(GetInfoAttr.Instance.GetText(7154), this._min, this._sec);
                }
                else {
                    this.timetext.text = Format(GetInfoAttr.Instance.GetText(7111), this._min, this._sec, this.matchNum / 2);
                }
            }

            //打开下个界面
            if (this._surplusTime <= 0 && !MatchLogic.Instance.isAllredaySendOpen) {
                MatchLogic.Instance.isAllredaySendOpen = true;
                Tick.Once(500, this, () => {
                    MatchLogic.Instance.OpenMatchUI();
                })
            }
        }

        /**为list添加数据源 */
        public SetDataToList() {
            //对战数据
            let data = MatchLogic.Instance.curFightPlayerList;
            //点赞数据
            this.dataPraiseList = MatchLogic.Instance.curPraiseInfo;
            let data_List: any = [];
            for (let i in data) {
                data_List.push(data[i]);
            }
            this.groupList.array = data_List;
            this.groupList.renderHandler = new Laya.Handler(this, this.SetListRender);
        }

		/** 
		 * 设置 list样式
         * @param item 单个box
         * @param index 索引
		*/
        private SetListRender(item, index: number): void {
            let groupNum: Laya.Text = item.getChildByName("groupNum");
            let btn_see: Laya.Button = item.getChildByName("btn_see");
            let bgImg_1: Laya.Image = item.getChildByName("bgImg_1");
            let bgImg_2: Laya.Image = item.getChildByName("bgImg_2");
            let btn_praise2: Laya.Button = item.getChildByName("btn_praise2");
            let btn_praise1: Laya.Button = item.getChildByName("btn_praise1");
            let icon_1: Laya.Image = item.getChildByName("icon_1");
            let icon_2: Laya.Image = item.getChildByName("icon_2");
            let odds_1: Laya.Text = item.getChildByName("odds_1");
            let odds_2: Laya.Text = item.getChildByName("odds_2");
            let name_1: Laya.Text = item.getChildByName("name_1");
            let name_2: Laya.Text = item.getChildByName("name_2");
            let praise_1: Laya.Image = item.getChildByName("praise_1");
            let praise_2: Laya.Image = item.getChildByName("praise_2");
            let praiseCost_1: Laya.Text = btn_praise1.getChildByName("praiseCost_1") as Laya.Text;
            let praiseCost_2: Laya.Text = btn_praise2.getChildByName("praiseCost_2") as Laya.Text;

            let data = this.groupList.array[index];
            let nindex = index + 1;
            let data1 = data[1];
            let data2 = data[2];
            let dataPraise = this.dataPraiseList[index];//1左  2右

            groupNum.changeText("第" + MatchLogic.Instance.NumToWord(nindex) + "组");
            praiseCost_1.changeText(MatchLogic.Instance.curPraiseCost.toString());
            praiseCost_2.changeText(MatchLogic.Instance.curPraiseCost.toString());

            btn_see.visible = MatchLogic.Instance.isSeeStage;
            if (dataPraise == StanceType.eLeft || dataPraise == StanceType.eRight) {
                if (dataPraise == StanceType.eLeft) {
                    btn_praise1.label = "已点赞";
                    btn_praise2.label = "点赞";
                    //btn_praise1.mouseEnabled = false;
                    btn_praise1.disabled = false;
                    btn_praise2.disabled = true;
                    praise_1.visible = true;
                    praise_2.visible = false;
                    btn_praise1.visible = true;
                    btn_praise2.visible = true;
                }
                else {
                    btn_praise2.label = "已点赞";
                    btn_praise1.label = "点赞";
                    //btn_praise2.mouseEnabled = false;
                    btn_praise1.disabled = true;
                    btn_praise2.disabled = false;
                    praise_2.visible = true;
                    praise_1.visible = false;
                    btn_praise1.visible = true;
                    btn_praise2.visible = true;
                }
            }
            else {
                if (this.myNum > 0) {
                    btn_praise1.visible = true;
                    btn_praise2.visible = true;
                    btn_praise1.disabled = false;
                    btn_praise2.disabled = false;
                    praise_2.visible = false;
                    praise_1.visible = false;
                }
                else {
                    btn_praise1.visible = true;
                    btn_praise2.visible = true;
                    btn_praise1.disabled = true;
                    btn_praise2.disabled = true;
                    praise_2.visible = false;
                    praise_1.visible = false
                }
            }
            if (MatchLogic.Instance.isSeeStage) {
                //点赞按钮在观战状态时由置灰变为不渲染
                // btn_praise1.disabled = true;
                // btn_praise2.disabled = true;
                btn_praise1.visible = false;
                btn_praise2.visible = false;
            }

            //头像
            let nHeadID_1 = data1[1];
            if (nHeadID_1 != null && nHeadID_1 > 0) {
                let cfg = HeroConfig[nHeadID_1]
                icon_1.skin = "ui_icon/" + cfg.strIcon
            } else {
                icon_1.skin = "ui_head/icon_ui_01.png";
            }

            let nHeadID_2 = data2[1];
            if (nHeadID_2 != null && nHeadID_2 > 0) {
                let cfg = HeroConfig[nHeadID_2]
                icon_2.skin = "ui_icon/" + cfg.strIcon
            } else {
                icon_2.skin = "ui_head/icon_ui_01.png";
            }

            //名字
            name_1.changeText(data1[2]);
            name_2.changeText(data2[2]);
            if (name_1.text == MasterPlayer.Instance.player.Name) {
                name_1.text = "我";
                bgImg_1.skin = "ui_match/img-bg-ziji-dianzan-pkliansai.png";
                bgImg_2.skin = "ui_match/img-bg-bieren-dianzan-pkliansai.png";
            }
            else if (name_2.text == MasterPlayer.Instance.player.Name) {
                name_2.text = "我";
                bgImg_2.skin = "ui_match/img-bg-ziji-dianzan-pkliansai.png";
                bgImg_1.skin = "ui_match/img-bg-bieren-dianzan-pkliansai.png";
            }
            else {
                bgImg_2.skin = "ui_match/img-bg-bieren-dianzan-pkliansai.png";
                bgImg_1.skin = "ui_match/img-bg-bieren-dianzan-pkliansai.png";
            }

            //赔率
            odds_1.changeText("赔率" + (data1[3] / 100).toString());
            odds_2.changeText("赔率" + (data2[3] / 100).toString());

            //点赞事件
            btn_praise1.on(Laya.Event.CLICK, this, this.Btnclick_Praise, [MatchLogic.Instance.curMatchStage, nindex, StanceType.eLeft, dataPraise]);
            btn_praise2.on(Laya.Event.CLICK, this, this.Btnclick_Praise, [MatchLogic.Instance.curMatchStage, nindex, StanceType.eRight, dataPraise]);

            //观看按钮
            btn_see.on(Laya.Event.CLICK, this, this.WatchLeague, [MatchLogic.Instance.curMatchStage, nindex, data1[2], data2[2]]);
        }

        private WatchLeague(curMatchStage, nindex, data1, data2) {
            MatchLogic.Instance.K_ReqWatchLeague(curMatchStage, nindex, data1, data2);
        }

        /**刷新页面 */
        private UpdateItem() {
            this._bool = MatchLogic.Instance.isSeeStage;
            this.ShowTitle();
            this.ShowPraiseCount();
            this.ShowTime();
            this.SetDataToList();
            this.ShowPraiseCount();
        }

        /**判断钻石是否足够， */
        private Btnclick_Praise(type, nindex, num, dataPraise) {
            let play_d_num = BagManager.Instance.getItemNumber(BaseDefine.ItemIdDiamonds);//已拥有钻石数量
            if (play_d_num >= MatchLogic.Instance.curPraiseCost) {
                if (dataPraise == 0) {
                    MatchLogic.Instance.K_ReqLeagueBetInfo(type, nindex, num);
                }
            } else {
                if (IsShieldRecharge()) {
                    let str = SysPromptConfig[30060].strPromptInfo;
                    TipsLogic.Instance.OpenMessageBox(str,
                        Laya.Handler.create(this, () => {
                            let panel_id = ViewUILogic.Instance.OpenPanel
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

        /**关闭UI */
        private CloseUI() {
            SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            UIManager.Instance.DestroyUI(this.name, [this.parent]);
            //Event.DispatchEvent("OnPanelClick", [E_OpenGrade.ACTION]);
        }
    }
}