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
    H52D_Framework.AddViewResource("ListHeroView", [
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
    ]);
    var SelectType;
    (function (SelectType) {
        SelectType[SelectType["One"] = 0] = "One";
        SelectType[SelectType["Five"] = 1] = "Five";
        SelectType[SelectType["Max"] = 2] = "Max";
    })(SelectType || (SelectType = {}));
    var ListHeroView = /** @class */ (function (_super) {
        __extends(ListHeroView, _super);
        function ListHeroView() {
            var _this = _super.call(this) || this;
            _this._tabItemIndex = 0;
            _this.currentBtn = [];
            _this.childViews = {
                lv: ["Btn_Lv", "HeroLvUp", "lv"],
                star: ["Btn_Star", "HeroStar", "star"],
                war: ["Btn_War", "HeroWar", "war"],
                handbook: ["Btn_handbook", "HeroHandBookView", "handbook"]
            };
            _this.titleStr = {
                0: "升级",
                1: "进阶",
                2: "布阵",
            };
            _this._tabItemIndex = 0;
            _this.lock = true;
            _this.currentBtn = [];
            // 暂时适配微信版本
            //if (window['wx']) {
            // this.tail_war.x = 287;
            // this.tail_handbook.visible = false;
            //}
            //引导按钮
            H52D_Framework.Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_4, _this.Btn_War);
            H52D_Framework.Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_8, _this.Btn_War);
            H52D_Framework.Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_5, _this.Btn_Star);
            _this.AddEvent();
            _this.UpdateRedPoint();
            _this.InitEvent();
            return _this;
        }
        // 移除事件监听
        ListHeroView.prototype.Destroy = function () {
            this.offAll();
            if (this.ChildBox._childs[0]) {
                this.ChildBox._childs[0].OnDestroy();
            }
            this.ChildBox.destroyChildren();
            H52D_Framework.Tick.ClearAll(this);
            H52D_Framework.Event.RemoveEvent("UpdateRedPoint", Laya.Handler.create(this, this.UpdateRedPoint));
            H52D_Framework.Event.RemoveEvent("NewTeachBtn_ClickWar", Laya.Handler.create(this, this.NewTeachBtn_ClickWar));
            H52D_Framework.Event.RemoveEvent("NewTeachBtn_ClickStar", Laya.Handler.create(this, this.NewTeachBtn_ClickStar));
        };
        ListHeroView.prototype.AddEvent = function () {
            H52D_Framework.Event.RegistEvent("UpdateRedPoint", Laya.Handler.create(this, this.UpdateRedPoint));
            H52D_Framework.Event.RegistEvent("NewTeachBtn_ClickWar", Laya.Handler.create(this, this.NewTeachBtn_ClickWar));
            H52D_Framework.Event.RegistEvent("NewTeachBtn_ClickStar", Laya.Handler.create(this, this.NewTeachBtn_ClickStar));
        };
        ListHeroView.prototype.InitEvent = function () {
            this.Btn_Lv.on(Laya.Event.CLICK, this, this.Btn_Click, [this.childViews.lv]);
            this.Btn_Star.on(Laya.Event.CLICK, this, this.Btn_Click, [this.childViews.star]);
            this.Btn_War.on(Laya.Event.CLICK, this, this.Btn_Click, [this.childViews.war]);
            this.Btn_handbook.on(Laya.Event.CLICK, this, this.Btn_Click, [this.childViews.handbook]);
            if (!H52D_Framework.HeroHandbookManager.Instance.IsTrue) {
                this.Btn_Click(this.childViews.handbook);
            }
            else {
                this.Btn_Click(this.childViews.lv);
            }
            //给按钮添加点击播放音效的事件
            this.Btn_Lv.on(Laya.Event.CLICK, this, function () { H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3"); });
            this.Btn_Star.on(Laya.Event.CLICK, this, function () { H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3"); });
            this.Btn_War.on(Laya.Event.CLICK, this, function () { H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3"); });
        };
        // 刷新红点
        ListHeroView.prototype.UpdateRedPoint = function () {
            //升级，激活
            var red_open = false;
            //进阶，进阶
            var red_star = false;
            var lv, star = 0;
            var herolist = H52D_Framework.HeroManager.Instance.GetCfgHeroList();
            for (var Idex = 0; Idex < herolist.length; Idex++) {
                var nheroID = herolist[Idex];
                var IsActive = H52D_Framework.HeroManager.Instance.IsActive(nheroID);
                if (IsActive) {
                    var Red_star = H52D_Framework.HeroManager.Instance.HeroIsStar(nheroID);
                    var Red_lvup = H52D_Framework.HeroManager.Instance.HeroIsUp(nheroID);
                    if (Red_lvup) {
                        red_open = true;
                    }
                    if (Red_star) {
                        red_star = true;
                    }
                }
                else {
                    var Red_open = H52D_Framework.HeroManager.Instance.HeroIstrue(nheroID);
                    if (Red_open) {
                        red_open = true;
                    }
                }
                if (red_open || red_star) {
                    if (red_open && red_star) {
                        break;
                    }
                }
            }
            this.red_lv.visible = red_open;
            this.red_star.visible = red_star;
            if (H52D_Framework.MasterPlayer.Instance.player.CunstLevel >= 80) {
                this.red_handbook.visible = H52D_Framework.HeroHandbookManager.Instance.Red_Show();
            }
            H52D_Framework.Event.DispatchEvent("ShowRedPoint", [E_OpenGrade.HERO]);
        };
        ListHeroView.prototype.Btn_Click = function (child) {
            var _this = this;
            ///切换页签  提示弹框
            this._child = child[1];
            var ShowView = Laya.Handler.create(this, function () {
                if (_this.lock && _this.currentBtn[0] != child[0]) {
                    if (_this.currentBtn.length > 0) {
                        _this[_this.currentBtn[0]].bgColor = "#2c2129";
                        _this[_this.currentBtn[0]].alpha = 0.3;
                        _this[_this.currentBtn[2]].visible = false;
                        for (var key in _this.childViews) {
                            if (key != child[2]) {
                                _this[key + "_gang"].visible = false;
                                _this["view_" + key].color = "#9a9fb2";
                            }
                        }
                    }
                    _this.currentBtn = child;
                    _this[_this.currentBtn[0]].bgColor = "";
                    _this[_this.currentBtn[0]].alpha = 0;
                    _this[_this.currentBtn[0]].visible = true;
                    _this[child[2]].visible = true;
                    _this["view_" + child[2]].color = "#d3c1aa";
                    _this[child[2] + "_gang"].visible = true;
                    _this.lock = false;
                    H52D_Framework.UIManager.Instance.CreateUI(child[1], [_this, _this], Laya.Handler.create(_this, function (view) {
                        if (_this.destroyed) {
                            view.destroy(true);
                        }
                        else {
                            if (_this.ChildBox._childs[0]) {
                                _this.ChildBox._childs[0].OnDestroy();
                            }
                            _this.ChildBox.destroyChildren();
                            _this.ChildBox.addChild(view);
                        }
                        _this.lock = true;
                    }));
                }
                if (child[0] == "Btn_War") {
                    H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.BOTTOM_SET_PANEL);
                }
            });
            if (child[1] != "HeroWar") {
                if (H52D_Framework.HeroPosition.Instance.bChange) {
                    H52D_Framework.Event.DispatchEvent("btn_closes", ShowView);
                    return;
                }
                else {
                    //ShowView.run();
                }
            }
            if (child[1] == "HeroHandBookView") {
                var open_cfg = H52D_Framework.OpenGradeConfig[24];
                var cuid_num = H52D_Framework.MasterPlayer.Instance.player.CunstLevel;
                if (cuid_num < open_cfg.Checkpoint) {
                    var str = H52D_Framework.SysPromptConfig[10018].strPromptInfo;
                    var a = H52D_Framework.Format(str, open_cfg.Checkpoint, H52D_Framework.GetInfoAttr.Instance.GetText(open_cfg.NamaId));
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips(a);
                    return;
                }
            }
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            ShowView.run();
        };
        ListHeroView.prototype.NewTeachBtn_ClickWar = function () {
            this.Btn_Click(this.childViews.war);
        };
        ListHeroView.prototype.NewTeachBtn_ClickStar = function () {
            this.Btn_Click(this.childViews.star);
        };
        return ListHeroView;
    }(ui.main.list.ListHeroViewUI));
    H52D_Framework.ListHeroView = ListHeroView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ListHeroView.js.map