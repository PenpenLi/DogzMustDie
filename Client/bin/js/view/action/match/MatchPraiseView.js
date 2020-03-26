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
    H52D_Framework.AddViewResource("MatchPraiseView", [
        { url: "res/ui/ui_memory.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_match.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_head.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_icon.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
    ]);
    var MatchPraiseView = /** @class */ (function (_super) {
        __extends(MatchPraiseView, _super);
        function MatchPraiseView() {
            var _this = _super.call(this) || this;
            _this.ViewInfo();
            _this.AddEvent();
            return _this;
        }
        MatchPraiseView.prototype.ViewInfo = function () {
            this._bool = H52D_Framework.MatchLogic.Instance.isSeeStage;
            this.ShowTitle();
            this.ShowPraiseCount();
            this.ShowTime();
            H52D_Framework.Tick.Loop(1000, this, this.ShowTime);
            this.groupList.vScrollBarSkin = "";
            this.SetDataToList();
            //this.groupList.repeatY = this.groupList.array.length;
        };
        MatchPraiseView.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_close.on(Laya.Event.CLICK, this, this.CloseUI);
            H52D_Framework.Event.RegistEvent("MatchPraiseUpdateView", Laya.Handler.create(this, this.UpdateItem));
        };
        MatchPraiseView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Tick.ClearAll(this);
            H52D_Framework.Event.RemoveEvent("MatchPraiseUpdateView", Laya.Handler.create(this, this.UpdateItem));
        };
        /**显示标题 */
        MatchPraiseView.prototype.ShowTitle = function () {
            this.matchNum = H52D_Framework.MatchLogic.Instance.currentTypeNum;
            if (this._bool) {
                //是观战状态
                this.title_text.text = this.matchNum + "强观战";
            }
            else {
                this.title_text.text = this.matchNum + "强点赞";
            }
        };
        /**显示剩余点赞次数*/
        MatchPraiseView.prototype.ShowPraiseCount = function () {
            if (this._bool) {
                //是观战状态不显示剩余次数
                this.praiseCount.visible = false;
                return;
            }
            this.praiseCount.visible = true;
            //本阶段总次数
            this.totalNum = H52D_Framework.MatchLogic.Instance.totalPraiseTimes;
            //剩余次数
            this.myNum = H52D_Framework.MatchLogic.Instance.totalPraiseTimes - H52D_Framework.MatchLogic.Instance.praiseTimes;
            H52D_Framework.SetHtmlStyle(this.praiseCount, 22, "#e4eafe", "left");
            this.praiseCount.innerHTML = "剩余点赞：" + "<font color='#fefeff'>" + this.myNum + "</font>" + "/" + this.totalNum;
        };
        //倒计时
        MatchPraiseView.prototype.ShowTime = function () {
            this._surplusTime = H52D_Framework.MatchLogic.Instance.GetCountDown();
            if (this._surplusTime <= 0) {
                this._surplusTime = 0;
            }
            this._min = Math.floor(this._surplusTime / 60).toString();
            this._sec = (this._surplusTime % 60).toString();
            if (!this._bool) {
                //不是观战阶段
                this.timetext.text = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(7111), this._min, this._sec, this.matchNum);
            }
            else {
                if (H52D_Framework.MatchLogic.Instance.curMatchStage == H52D_Framework.MacthType.eLeagueWar2) { //要进入冠军点赞时显示
                    this.timetext.text = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(7154), this._min, this._sec);
                }
                else {
                    this.timetext.text = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(7111), this._min, this._sec, this.matchNum / 2);
                }
            }
            //打开下个界面
            if (this._surplusTime <= 0 && !H52D_Framework.MatchLogic.Instance.isAllredaySendOpen) {
                H52D_Framework.MatchLogic.Instance.isAllredaySendOpen = true;
                H52D_Framework.Tick.Once(500, this, function () {
                    H52D_Framework.MatchLogic.Instance.OpenMatchUI();
                });
            }
        };
        /**为list添加数据源 */
        MatchPraiseView.prototype.SetDataToList = function () {
            //对战数据
            var data = H52D_Framework.MatchLogic.Instance.curFightPlayerList;
            //点赞数据
            this.dataPraiseList = H52D_Framework.MatchLogic.Instance.curPraiseInfo;
            var data_List = [];
            for (var i in data) {
                data_List.push(data[i]);
            }
            this.groupList.array = data_List;
            this.groupList.renderHandler = new Laya.Handler(this, this.SetListRender);
        };
        /**
         * 设置 list样式
         * @param item 单个box
         * @param index 索引
        */
        MatchPraiseView.prototype.SetListRender = function (item, index) {
            var groupNum = item.getChildByName("groupNum");
            var btn_see = item.getChildByName("btn_see");
            var bgImg_1 = item.getChildByName("bgImg_1");
            var bgImg_2 = item.getChildByName("bgImg_2");
            var btn_praise2 = item.getChildByName("btn_praise2");
            var btn_praise1 = item.getChildByName("btn_praise1");
            var icon_1 = item.getChildByName("icon_1");
            var icon_2 = item.getChildByName("icon_2");
            var odds_1 = item.getChildByName("odds_1");
            var odds_2 = item.getChildByName("odds_2");
            var name_1 = item.getChildByName("name_1");
            var name_2 = item.getChildByName("name_2");
            var praise_1 = item.getChildByName("praise_1");
            var praise_2 = item.getChildByName("praise_2");
            var praiseCost_1 = btn_praise1.getChildByName("praiseCost_1");
            var praiseCost_2 = btn_praise2.getChildByName("praiseCost_2");
            var data = this.groupList.array[index];
            var nindex = index + 1;
            var data1 = data[1];
            var data2 = data[2];
            var dataPraise = this.dataPraiseList[index]; //1左  2右
            groupNum.changeText("第" + H52D_Framework.MatchLogic.Instance.NumToWord(nindex) + "组");
            praiseCost_1.changeText(H52D_Framework.MatchLogic.Instance.curPraiseCost.toString());
            praiseCost_2.changeText(H52D_Framework.MatchLogic.Instance.curPraiseCost.toString());
            btn_see.visible = H52D_Framework.MatchLogic.Instance.isSeeStage;
            if (dataPraise == H52D_Framework.StanceType.eLeft || dataPraise == H52D_Framework.StanceType.eRight) {
                if (dataPraise == H52D_Framework.StanceType.eLeft) {
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
                    praise_1.visible = false;
                }
            }
            if (H52D_Framework.MatchLogic.Instance.isSeeStage) {
                //点赞按钮在观战状态时由置灰变为不渲染
                // btn_praise1.disabled = true;
                // btn_praise2.disabled = true;
                btn_praise1.visible = false;
                btn_praise2.visible = false;
            }
            //头像
            var nHeadID_1 = data1[1];
            if (nHeadID_1 != null && nHeadID_1 > 0) {
                var cfg = H52D_Framework.HeroConfig[nHeadID_1];
                icon_1.skin = "ui_icon/" + cfg.strIcon;
            }
            else {
                icon_1.skin = "ui_head/icon_ui_01.png";
            }
            var nHeadID_2 = data2[1];
            if (nHeadID_2 != null && nHeadID_2 > 0) {
                var cfg = H52D_Framework.HeroConfig[nHeadID_2];
                icon_2.skin = "ui_icon/" + cfg.strIcon;
            }
            else {
                icon_2.skin = "ui_head/icon_ui_01.png";
            }
            //名字
            name_1.changeText(data1[2]);
            name_2.changeText(data2[2]);
            if (name_1.text == H52D_Framework.MasterPlayer.Instance.player.Name) {
                name_1.text = "我";
                bgImg_1.skin = "ui_match/img-bg-ziji-dianzan-pkliansai.png";
                bgImg_2.skin = "ui_match/img-bg-bieren-dianzan-pkliansai.png";
            }
            else if (name_2.text == H52D_Framework.MasterPlayer.Instance.player.Name) {
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
            btn_praise1.on(Laya.Event.CLICK, this, this.Btnclick_Praise, [H52D_Framework.MatchLogic.Instance.curMatchStage, nindex, H52D_Framework.StanceType.eLeft, dataPraise]);
            btn_praise2.on(Laya.Event.CLICK, this, this.Btnclick_Praise, [H52D_Framework.MatchLogic.Instance.curMatchStage, nindex, H52D_Framework.StanceType.eRight, dataPraise]);
            //观看按钮
            btn_see.on(Laya.Event.CLICK, this, this.WatchLeague, [H52D_Framework.MatchLogic.Instance.curMatchStage, nindex, data1[2], data2[2]]);
        };
        MatchPraiseView.prototype.WatchLeague = function (curMatchStage, nindex, data1, data2) {
            H52D_Framework.MatchLogic.Instance.K_ReqWatchLeague(curMatchStage, nindex, data1, data2);
        };
        /**刷新页面 */
        MatchPraiseView.prototype.UpdateItem = function () {
            this._bool = H52D_Framework.MatchLogic.Instance.isSeeStage;
            this.ShowTitle();
            this.ShowPraiseCount();
            this.ShowTime();
            this.SetDataToList();
            this.ShowPraiseCount();
        };
        /**判断钻石是否足够， */
        MatchPraiseView.prototype.Btnclick_Praise = function (type, nindex, num, dataPraise) {
            var _this = this;
            var play_d_num = H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdDiamonds); //已拥有钻石数量
            if (play_d_num >= H52D_Framework.MatchLogic.Instance.curPraiseCost) {
                if (dataPraise == 0) {
                    H52D_Framework.MatchLogic.Instance.K_ReqLeagueBetInfo(type, nindex, num);
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
        /**关闭UI */
        MatchPraiseView.prototype.CloseUI = function () {
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [this.parent]);
            //Event.DispatchEvent("OnPanelClick", [E_OpenGrade.ACTION]);
        };
        return MatchPraiseView;
    }(ui.action.match.MatchPraiseViewUI));
    H52D_Framework.MatchPraiseView = MatchPraiseView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MatchPraiseView.js.map