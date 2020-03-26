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
    var MainListViewUI = ui.main.subinterface.MainListViewUI;
    /**
     * @class：列表视图
     * @author：zhangyusong
     */
    var MainListView = /** @class */ (function (_super) {
        __extends(MainListView, _super);
        function MainListView() {
            var _this = _super.call(this) || this;
            /** 全屏位置 */
            _this.local_full = 0;
            /** 半屏位置 */
            _this.local_half = 807 * G_StageHeightScale;
            _this._bBoxRun = false;
            _this.InitView();
            _this.InitEvent();
            return _this;
        }
        MainListView.prototype.GetMainBtn = function (type) {
            switch (type) {
                case E_OpenGrade.ROLE:
                    return this.btn_role;
                case E_OpenGrade.HERO:
                    return this.btn_hero;
                case E_OpenGrade.EQUIP:
                    return this.btn_equip;
                case E_OpenGrade.PET:
                    return this.btn_pet;
                case E_OpenGrade.ACTION:
                    return this.btn_active;
                case E_OpenGrade.SHOP:
                    return this.btn_shop;
            }
        };
        MainListView.prototype.InitView = function () {
            var _this = this;
            this.curr_panel = E_OpenGrade.EMPTY;
            this.halfPanel = true;
            this.ui_box.y = G_StageHeight;
            this.local_start = this.ui_box.y;
            H52D_Framework.ViewUILogic.Instance.listView = this;
            H52D_Framework.ViewUILogic.Instance.OpenPanel = E_OpenGrade.EMPTY;
            H52D_Framework.Tick.Once(3000, this, function () {
                _this.ShowRedPoint(E_OpenGrade.PET);
                _this.ShowRedPoint(E_OpenGrade.ROLE);
                _this.ShowRedPoint(E_OpenGrade.HERO);
                _this.ShowRedPoint(E_OpenGrade.EQUIP);
                _this.ShowRedPoint(E_OpenGrade.SHOP);
            });
            this.NameInit(this.btn_role, E_OpenGrade.ROLE);
            this.NameInit(this.btn_hero, E_OpenGrade.HERO);
            this.NameInit(this.btn_pet, E_OpenGrade.PET);
            this.NameInit(this.btn_equip, E_OpenGrade.EQUIP);
            this.NameInit(this.btn_active, E_OpenGrade.ACTION);
            this.NameInit(this.btn_shop, E_OpenGrade.SHOP);
        };
        MainListView.prototype.NameInit = function (btn, grade) {
            btn.getChildByName("tx_title_0").text =
                btn.getChildByName("tx_title_1").text =
                    H52D_Framework.GetInfoAttr.Instance.GetTitle(grade);
        };
        MainListView.prototype.InitEvent = function () {
            var _this = this;
            this.btn_role.on(Laya.Event.CLICK, this, this.OnPanelClick, [E_OpenGrade.ROLE]);
            this.btn_hero.on(Laya.Event.CLICK, this, this.OnPanelClick, [E_OpenGrade.HERO]);
            this.btn_pet.on(Laya.Event.CLICK, this, this.OnPanelClick, [E_OpenGrade.PET]);
            this.btn_equip.on(Laya.Event.CLICK, this, this.OnPanelClick, [E_OpenGrade.EQUIP]);
            this.btn_active.on(Laya.Event.CLICK, this, this.OnPanelClick, [E_OpenGrade.ACTION]);
            this.btn_shop.on(Laya.Event.CLICK, this, this.OnPanelClick, [E_OpenGrade.SHOP]);
            this.btn_ui_max.on(Laya.Event.CLICK, this, function () {
                _this.halfPanel = !_this.halfPanel;
                if (_this.halfPanel) {
                    H52D_Framework.OneTimer(250, function () {
                        H52D_Framework.Event.DispatchEvent("changelisthigth");
                    }, "ChangeListHigth");
                }
                else {
                    H52D_Framework.Event.DispatchEvent("changelisthigth");
                }
                _this.PanelMove();
            });
            this.btn_ui_close.on(Laya.Event.CLICK, this, this.PanelClose, [null]);
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.BOTTOM_SET_PANEL, Laya.Handler.create(this, this.OpenPanel));
            H52D_Framework.Event.RegistEvent("PanelClose", Laya.Handler.create(this, this.PanelClose));
            H52D_Framework.Event.RegistEvent("ShowRedPoint", Laya.Handler.create(this, this.ShowRedPoint));
            H52D_Framework.Event.RegistEvent("OnPanelClick", Laya.Handler.create(this, this.OnPanelClick, [E_OpenGrade]));
            H52D_Framework.Event.RegistEvent("Role_lvup", Laya.Handler.create(this, this.OpenEffect));
            H52D_Framework.Event.RegistEvent("ShowMaxBtn", Laya.Handler.create(this, this.ShowMaxBtn));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.CunstomCurrent));
            H52D_Framework.Event.RegistEvent("SetHalfPanel", Laya.Handler.create(this, this.SetHalfPanel));
            H52D_Framework.MainActionLogic.Instance.ShowRedPoint();
            H52D_Framework.ViewUILogic.Instance.roleLvUp = this.btn_role;
            H52D_Framework.Tick.Loop(5000, this, this.UpdateRed);
        };
        MainListView.prototype.UpdateRed = function () {
            H52D_Framework.WroldBossLogic.Instance.ShowPrint();
            this.ShowRedPoint(E_OpenGrade.HERO);
        };
        MainListView.prototype.Destroy = function () {
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.BOTTOM_SET_PANEL, Laya.Handler.create(this, this.OpenPanel));
            H52D_Framework.Event.RemoveEvent("PanelClose", Laya.Handler.create(this, this.PanelClose));
            H52D_Framework.Event.RemoveEvent("ShowRedPoint", Laya.Handler.create(this, this.ShowRedPoint));
            H52D_Framework.Event.RemoveEvent("OnPanelClick", Laya.Handler.create(this, this.OnPanelClick, [E_OpenGrade]));
            H52D_Framework.Event.RemoveEvent("Role_lvup", Laya.Handler.create(this, this.OpenEffect));
            H52D_Framework.Event.RemoveEvent("ShowMaxBtn", Laya.Handler.create(this, this.ShowMaxBtn));
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.CunstomCurrent));
            H52D_Framework.Event.RemoveEvent("SetHalfPanel", Laya.Handler.create(this, this.SetHalfPanel));
        };
        MainListView.prototype.CunstomCurrent = function () {
            this.Btn_control();
        };
        //
        /**显示最大化按钮*/
        MainListView.prototype.ShowMaxBtn = function (value) {
            this.btn_ui_max.visible = value;
        };
        /** 显示红点 */
        MainListView.prototype.ShowRedPoint = function (type, open) {
            if (open === void 0) { open = false; }
            switch (type) {
                case E_OpenGrade.ROLE:
                    this.role_point.visible = !H52D_Framework.SignInLogic.Instance.ToDayAlr || H52D_Framework.AchievenManger.Instance.showPoint() || H52D_Framework.MailLogic.Inst.checkShowRed || H52D_Framework.DiscountManager.Instance.IsShowShopPint();
                    break;
                case E_OpenGrade.HERO:
                    this.hero_new.visible = H52D_Framework.HeroManager.Instance.All_HeroIstrue();
                    if (!this.hero_new.visible) {
                        this.hero_point.visible = H52D_Framework.HeroManager.Instance.HeroMainRed();
                    }
                    break;
                case E_OpenGrade.EQUIP:
                    this.equip_new.visible = H52D_Framework.EquipManager.Instance.IsMainShowRed();
                    break;
                case E_OpenGrade.PET:
                    this.pet_new.visible = H52D_Framework.PetManager.Instance.IsMainShowRed();
                    break;
                case E_OpenGrade.ACTION:
                    this.active_point.visible = open;
                    break;
                case E_OpenGrade.SHOP:
                    this.shop_point.visible = H52D_Framework.DiscountManager.Instance.IsShowShopPint();
                    break;
            }
        };
        MainListView.prototype.OpenEffect = function () {
            this.Role_lvup_Effect(H52D_Framework.ViewUILogic.Instance.roleLvUp);
        };
        /**角色升级特效 */
        MainListView.prototype.Role_lvup_Effect = function (pos) {
            var apos = new H52D_Framework.Avatar(pos);
            apos.Load(H52D_Framework.EffectDefine.shengji, 1, 3.3, 80, 68, Laya.Handler.create(this, function (aposs) {
                aposs.Play("effect_ui_shengji", false, true, function () {
                    aposs.Destroy();
                });
            }));
        };
        MainListView.prototype.PanelSound = function () {
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            H52D_Framework.OneTimer(100, function () {
                H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/menu_check.mp3");
            });
        };
        /**
         * 打开面板事件
         * @param clickType 面板类型
         * @param open 强制打开
         * @param fun 回调
         */
        MainListView.prototype.OnPanelClick = function (clickType, _open, fun) {
            var _this = this;
            if (this._bBoxRun) {
                return;
            }
            //屏蔽战斗连点动能
            if (H52D_Framework.PrivilegeBuff.Instance.IsStart) {
                H52D_Framework.Event.DispatchEvent("RemoveContinuity");
            }
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            this.currentPanel = clickType;
            var leve = H52D_Framework.MasterPlayer.Instance.player.Level;
            var needLeve = H52D_Framework.OpenGradeConfig[clickType]["Level"];
            if (!needLeve) {
                needLeve = 0;
            }
            if (leve < needLeve) {
                var str = H52D_Framework.Format(H52D_Framework.SysPromptConfig[10007]["strPromptInfo"], needLeve, H52D_Framework.BaseDefine.ButtonStr[clickType]);
                H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
                return;
            }
            var ShowView = Laya.Handler.create(this, function () {
                var view_name;
                var getInImg;
                var condition = H52D_Framework.OpenCondition(clickType);
                if (!condition) {
                    return;
                }
                switch (clickType) {
                    case E_OpenGrade.ROLE:
                        view_name = "ListRoleView";
                        getInImg = _this.btn_role.getChildByName("getIn");
                        break;
                    case E_OpenGrade.HERO:
                        view_name = "ListHeroView";
                        getInImg = _this.btn_hero.getChildByName("getIn");
                        break;
                    case E_OpenGrade.PET:
                        view_name = "ListPetView";
                        getInImg = _this.btn_pet.getChildByName("getIn");
                        break;
                    case E_OpenGrade.EQUIP:
                        view_name = "ListEquipView";
                        getInImg = _this.btn_equip.getChildByName("getIn");
                        break;
                    case E_OpenGrade.ACTION:
                        view_name = "ListActionView";
                        getInImg = _this.btn_active.getChildByName("getIn");
                        break;
                    case E_OpenGrade.SHOP:
                        view_name = "ListShopView";
                        getInImg = _this.btn_shop.getChildByName("getIn");
                        break;
                }
                _this.SetBtnType();
                getInImg.visible = true;
                H52D_Framework.Event.DispatchEvent("changelisthigth");
                if (H52D_Framework.ViewUILogic.Instance.OpenPanel == E_OpenGrade.EMPTY) {
                    _this.curr_panel = clickType;
                    H52D_Framework.UIManager.Instance.CreateUI(view_name, [_this.ui_panel], Laya.Handler.create(_this, function (view) {
                        if (_this.ui_panel.numChildren > 1) {
                            _this.ui_panel.removeChild(view);
                        }
                        else {
                            view.x = 0;
                            view.y = 0;
                            _this.currPanel = view;
                        }
                        //回调里需要跑的
                        if (fun) {
                            fun.run();
                        }
                    }));
                    _this.PanelMove();
                    H52D_Framework.mEverydayManager.Instance.IsOpen = true;
                }
                else {
                    //是当前面板,则关闭
                    if (_this.curr_panel == clickType) {
                        var a = typeof (_open);
                        if (typeof (_open) != "boolean" || _open == false) {
                            getInImg.visible = false;
                            _this.PanelClose();
                        }
                    }
                    else {
                        //不是当前面板则直接打开
                        _this.curr_panel = clickType;
                        getInImg.visible = true;
                        if (_this.ui_panel.numChildren > 0) {
                            _this.ui_panel.removeChildren();
                            _this.currPanel.Destroy();
                        }
                        H52D_Framework.UIManager.Instance.CreateUI(view_name, [_this.ui_panel], Laya.Handler.create(_this, function (view) {
                            view.x = 0;
                            view.y = 0;
                            if (!H52D_Framework.ViewUILogic.Instance.halfPanel) {
                                _this.PanelMove();
                            }
                            else {
                                //播放点击按钮音效
                                H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
                            }
                            _this.currPanel = view;
                        }));
                    }
                }
                _this.btn_ui_max.visible = true;
            });
            if (H52D_Framework.HeroPosition.Instance.bChange) {
                H52D_Framework.Event.DispatchEvent("btn_closes", ShowView);
            }
            else {
                ShowView.run();
            }
        };
        /**下方按钮 */
        MainListView.prototype.SetBtnType = function () {
            for (var i = 1; i <= 6; i++) {
                this['getIn' + i].visible = false;
            }
        };
        MainListView.prototype.OpenPanel = function (half, callBack) {
            this.halfPanel = half;
            this.PanelMove(false, callBack);
            H52D_Framework.Event.DispatchEvent("changelisthigth");
        };
        Object.defineProperty(MainListView.prototype, "halfPanel", {
            get: function () {
                return H52D_Framework.ViewUILogic.Instance.halfPanel;
            },
            set: function (b) {
                H52D_Framework.ViewUILogic.Instance.halfPanel = b;
                this.btn_ui_up.visible = b;
                this.btn_ui_down.visible = !b;
            },
            enumerable: true,
            configurable: true
        });
        MainListView.prototype.SetHalfPanel = function (b) {
            H52D_Framework.ViewUILogic.Instance.halfPanel = b;
            this.btn_ui_up.visible = b;
            this.btn_ui_down.visible = !b;
        };
        MainListView.prototype.PanelMove = function (close, handler) {
            var _this = this;
            if (close === void 0) { close = false; }
            var _y;
            //关闭界面
            if (close) {
                _y = this.local_start;
                H52D_Framework.GetInfoAttr.Instance.IsAllScreen = false;
            }
            else { //缩放界面
                _y = this.halfPanel ? this.local_half : this.local_full;
                H52D_Framework.GetInfoAttr.Instance.IsAllScreen = !this.halfPanel;
                this.bombg.visible = true;
            }
            var time = Math.abs(this.ui_box.y - _y) * 0.3; //位移×系数=移动时间（毫秒）
            this._bBoxRun = true;
            H52D_Framework.TweenList.to(this, this.ui_box, { y: _y }, time, function () {
                _this.ui_box.y = _y;
                if (_this._bBoxRun) {
                    _this._bBoxRun = false;
                    if (handler) {
                        handler.run();
                    }
                }
            });
            if (this.halfPanel) {
                //this.bombg.y = this.ui_panel.y;
                this.bombg.visible = false;
            }
            else {
                //this.bombg.y = 0;
            }
            H52D_Framework.ViewUILogic.Instance.OpenPanel = this.currentPanel;
            this.PanelSound();
        };
        /** 关闭面板 */
        MainListView.prototype.PanelClose = function (callBack) {
            var _this = this;
            H52D_Framework.mEverydayManager.Instance.IsOpen = false;
            if (this.currPanel) {
                if (H52D_Framework.HeroPosition.Instance.bChange) {
                    H52D_Framework.Event.DispatchEvent("btn_closes");
                    return;
                }
                this.currPanel.Destroy();
                this.bombg.visible = false;
            }
            this.SetBtnType();
            this.PanelMove(true, Laya.Handler.create(this, function () {
                //清空面板
                if (_this.ui_panel.numChildren > 0) {
                    _this.ui_panel.removeChildren();
                }
                if (callBack) {
                    callBack.run();
                }
            }));
            H52D_Framework.ViewUILogic.Instance.OpenPanel = E_OpenGrade.EMPTY;
            this.PanelSound();
        };
        MainListView.prototype.Btn_control = function () {
            var bool = H52D_Framework.WroldBossLogic.Instance.View_Control() || H52D_Framework.LadderManager.Instance.View_Control();
            this.bg.visible = this.top_bg.visible = bool;
        };
        return MainListView;
    }(MainListViewUI));
    H52D_Framework.MainListView = MainListView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MainListView.js.map