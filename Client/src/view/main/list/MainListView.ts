module H52D_Framework {
    import MainListViewUI = ui.main.subinterface.MainListViewUI;

    /**
     * @class：列表视图
     * @author：zhangyusong
     */
    export class MainListView extends MainListViewUI implements IViewPanel {
        /** 全屏位置 */
        private readonly local_full: number = 0;
        /** 半屏位置 */
        private readonly local_half: number = 807 * G_StageHeightScale;
        /** 起始位置 */
        private local_start: number;
        /** 当前展示面板 */
        private curr_panel: E_OpenGrade;
        private _bBoxRun = false;
        /** 缓存当前面板 */
        private currPanel: IViewPanel;
        /** 当前面板 */
        private currentPanel: E_OpenGrade;

        public constructor() {
            super();
            this.InitView();
            this.InitEvent();
        }

        public GetMainBtn(type: E_OpenGrade): any {
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
        }

        private InitView() {
            this.curr_panel = E_OpenGrade.EMPTY;
            this.halfPanel = true;
            this.ui_box.y = G_StageHeight;
            this.local_start = this.ui_box.y;
            ViewUILogic.Instance.listView = this;
            ViewUILogic.Instance.OpenPanel = E_OpenGrade.EMPTY;
            Tick.Once(3000, this, () => {
                this.ShowRedPoint(E_OpenGrade.PET);
                this.ShowRedPoint(E_OpenGrade.ROLE);
                this.ShowRedPoint(E_OpenGrade.HERO);
                this.ShowRedPoint(E_OpenGrade.EQUIP);
                this.ShowRedPoint(E_OpenGrade.SHOP);
            });
            this.NameInit(this.btn_role,E_OpenGrade.ROLE);
            this.NameInit(this.btn_hero,E_OpenGrade.HERO);
            this.NameInit(this.btn_pet,E_OpenGrade.PET);
            this.NameInit(this.btn_equip,E_OpenGrade.EQUIP);
            this.NameInit(this.btn_active,E_OpenGrade.ACTION);
            this.NameInit(this.btn_shop,E_OpenGrade.SHOP);
        }

        private NameInit(btn:Laya.Box, grade:E_OpenGrade){
            (btn.getChildByName("tx_title_0") as Laya.Text).text = 
            (btn.getChildByName("tx_title_1") as Laya.Text).text = 
            GetInfoAttr.Instance.GetTitle(grade);
        }

        private InitEvent(): void {
            this.btn_role.on(Laya.Event.CLICK, this, this.OnPanelClick, [E_OpenGrade.ROLE]);
            this.btn_hero.on(Laya.Event.CLICK, this, this.OnPanelClick, [E_OpenGrade.HERO]);
            this.btn_pet.on(Laya.Event.CLICK, this, this.OnPanelClick, [E_OpenGrade.PET]);
            this.btn_equip.on(Laya.Event.CLICK, this, this.OnPanelClick, [E_OpenGrade.EQUIP]);
            this.btn_active.on(Laya.Event.CLICK, this, this.OnPanelClick, [E_OpenGrade.ACTION]);
            this.btn_shop.on(Laya.Event.CLICK, this, this.OnPanelClick, [E_OpenGrade.SHOP]);
            this.btn_ui_max.on(Laya.Event.CLICK, this, () => {
                this.halfPanel = !this.halfPanel;
                if (this.halfPanel) {
                    OneTimer(250, () => {
                        Event.DispatchEvent("changelisthigth");
                    }, "ChangeListHigth");
                }
                else {
                    Event.DispatchEvent("changelisthigth");
                }
                this.PanelMove();
            });
            this.btn_ui_close.on(Laya.Event.CLICK, this, this.PanelClose, [null]);

            Event.RegistEvent(EventDefine.BOTTOM_SET_PANEL, Laya.Handler.create(this, this.OpenPanel));
            Event.RegistEvent("PanelClose", Laya.Handler.create(this, this.PanelClose));
            Event.RegistEvent("ShowRedPoint", Laya.Handler.create(this, this.ShowRedPoint));
            Event.RegistEvent("OnPanelClick", Laya.Handler.create(this, this.OnPanelClick, [E_OpenGrade]));
            Event.RegistEvent("Role_lvup", Laya.Handler.create(this, this.OpenEffect));
            Event.RegistEvent("ShowMaxBtn", Laya.Handler.create(this, this.ShowMaxBtn));
            Event.RegistEvent(EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.CunstomCurrent));
            Event.RegistEvent("SetHalfPanel",Laya.Handler.create(this,this.SetHalfPanel));
            MainActionLogic.Instance.ShowRedPoint();
            ViewUILogic.Instance.roleLvUp = this.btn_role;
            Tick.Loop(5000, this, this.UpdateRed)
        }

        private UpdateRed() {
            WroldBossLogic.Instance.ShowPrint()
            this.ShowRedPoint(E_OpenGrade.HERO);
        }

        public Destroy() {
            Event.RemoveEvent(EventDefine.BOTTOM_SET_PANEL, Laya.Handler.create(this, this.OpenPanel));
            Event.RemoveEvent("PanelClose", Laya.Handler.create(this, this.PanelClose));
            Event.RemoveEvent("ShowRedPoint", Laya.Handler.create(this, this.ShowRedPoint));
            Event.RemoveEvent("OnPanelClick", Laya.Handler.create(this, this.OnPanelClick, [E_OpenGrade]));
            Event.RemoveEvent("Role_lvup", Laya.Handler.create(this, this.OpenEffect));
            Event.RemoveEvent("ShowMaxBtn", Laya.Handler.create(this, this.ShowMaxBtn));
            Event.RemoveEvent(EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.CunstomCurrent));
            Event.RemoveEvent("SetHalfPanel",Laya.Handler.create(this,this.SetHalfPanel));
        }

        private CunstomCurrent() {
            this.Btn_control();
        }
        //
        /**显示最大化按钮*/
        private ShowMaxBtn(value: boolean) {
            this.btn_ui_max.visible = value;
        }

        /** 显示红点 */
        private ShowRedPoint(type: E_OpenGrade, open: boolean = false) {
            switch (type) {
                case E_OpenGrade.ROLE:
                    this.role_point.visible = !SignInLogic.Instance.ToDayAlr || AchievenManger.Instance.showPoint() || MailLogic.Inst.checkShowRed || DiscountManager.Instance.IsShowShopPint();
                    break;
                case E_OpenGrade.HERO:
                    this.hero_new.visible = HeroManager.Instance.All_HeroIstrue();
                    if (!this.hero_new.visible) {
                        this.hero_point.visible = HeroManager.Instance.HeroMainRed();
                    }
                    break;
                case E_OpenGrade.EQUIP:
                    this.equip_new.visible = EquipManager.Instance.IsMainShowRed();
                    break;
                case E_OpenGrade.PET:
                    this.pet_new.visible = PetManager.Instance.IsMainShowRed();
                    break;
                case E_OpenGrade.ACTION:
                    this.active_point.visible = open;
                    break;
                case E_OpenGrade.SHOP:
                    this.shop_point.visible = DiscountManager.Instance.IsShowShopPint();
                    break;
            }
        }

        private OpenEffect() {
            this.Role_lvup_Effect(ViewUILogic.Instance.roleLvUp);
        }

        /**角色升级特效 */
        private Role_lvup_Effect(pos) {
            let apos = new Avatar(pos)
            apos.Load(EffectDefine.shengji, 1, 3.3, 80, 68,
                Laya.Handler.create(this, (aposs) => {
                    aposs.Play("effect_ui_shengji", false, true, () => {
                        aposs.Destroy();
                    })
                }));
        }

        private PanelSound() {
            SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            OneTimer(100, () => {
                SoundManager.Instance.OnPlaySound("res/sound/menu_check.mp3");
            })
        }

        /**
         * 打开面板事件
         * @param clickType 面板类型
         * @param open 强制打开
         * @param fun 回调
         */
        private OnPanelClick(clickType: E_OpenGrade, _open: boolean, fun?: Laya.Handler): void {
            if (this._bBoxRun) {
                return;
            }
            //屏蔽战斗连点动能
            if (PrivilegeBuff.Instance.IsStart) {
                Event.DispatchEvent("RemoveContinuity");
            }
            SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            this.currentPanel = clickType;
            let leve: number = MasterPlayer.Instance.player.Level;
            let needLeve: number = OpenGradeConfig[clickType]["Level"];
            if (!needLeve) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                needLeve = 0;
            }
            if (leve < needLeve) {
                let str = Format(SysPromptConfig[10007]["strPromptInfo"], needLeve, BaseDefine.ButtonStr[clickType]);
                TipsLogic.Instance.OpenSystemTips(str);
                return;
            }

            let ShowView = Laya.Handler.create(this, () => {
                let view_name: string;
                let getInImg: Laya.Image;
                let condition: boolean = OpenCondition(clickType);
                if (!condition) {
                    return;
                }
                switch (clickType) {
                    case E_OpenGrade.ROLE:
                        view_name = "ListRoleView";
                        getInImg = this.btn_role.getChildByName("getIn") as Laya.Image;
                        break;
                    case E_OpenGrade.HERO:
                        view_name = "ListHeroView";
                        getInImg = this.btn_hero.getChildByName("getIn") as Laya.Image;
                        break;
                    case E_OpenGrade.PET:
                        view_name = "ListPetView";
                        getInImg = this.btn_pet.getChildByName("getIn") as Laya.Image;
                        break;
                    case E_OpenGrade.EQUIP:
                        view_name = "ListEquipView";
                        getInImg = this.btn_equip.getChildByName("getIn") as Laya.Image;
                        break;
                    case E_OpenGrade.ACTION:
                        view_name = "ListActionView";
                        getInImg = this.btn_active.getChildByName("getIn") as Laya.Image;
                        break;
                    case E_OpenGrade.SHOP:
                        view_name = "ListShopView";
                        getInImg = this.btn_shop.getChildByName("getIn") as Laya.Image;
                        break;
                }
                this.SetBtnType();
                getInImg.visible = true;
                Event.DispatchEvent("changelisthigth");
                if (ViewUILogic.Instance.OpenPanel == E_OpenGrade.EMPTY) {
                    this.curr_panel = clickType;
                    UIManager.Instance.CreateUI(view_name, [this.ui_panel], Laya.Handler.create(this, (view) => {
                        if (this.ui_panel.numChildren > 1) {
                            this.ui_panel.removeChild(view);
                        }
                        else {
                            view.x = 0;
                            view.y = 0;
                            this.currPanel = view;
                        }
                        //回调里需要跑的
                        if (fun) {
                            fun.run();
                        }
                    }));
                    this.PanelMove();
                    mEverydayManager.Instance.IsOpen = true;
                }
                else {
                    //是当前面板,则关闭
                    if (this.curr_panel == clickType) {
                        let a = typeof (_open);
                        if (typeof (_open) != "boolean" || _open == false) {
                            getInImg.visible = false;
                            this.PanelClose();
                        }
                    }
                    else {
                        //不是当前面板则直接打开
                        this.curr_panel = clickType;
                        getInImg.visible = true;
                        if (this.ui_panel.numChildren > 0) {
                            this.ui_panel.removeChildren();
                            this.currPanel.Destroy();
                        }
                        UIManager.Instance.CreateUI(view_name, [this.ui_panel], Laya.Handler.create(this, (view) => {
                            view.x = 0;
                            view.y = 0;
                            if (!ViewUILogic.Instance.halfPanel) {
                                this.PanelMove();
                            }
                            else {
                                //播放点击按钮音效
                                SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
                            }
                            this.currPanel = view;
                        }));
                    }
                }
                this.btn_ui_max.visible = true;
            });

            if (HeroPosition.Instance.bChange) {
                Event.DispatchEvent("btn_closes", ShowView);
            } else {
                ShowView.run()
            }

        }

        /**下方按钮 */
        private SetBtnType() {
            for (let i = 1; i <= 6; i++) {
                this['getIn' + i].visible = false;
            }
        }

        private OpenPanel(half: boolean, callBack?: Laya.Handler): void {
            this.halfPanel = half;
            this.PanelMove(false, callBack);
            Event.DispatchEvent("changelisthigth");
        }

        private set halfPanel(b: boolean) {
            ViewUILogic.Instance.halfPanel = b;
            this.btn_ui_up.visible = b;
            this.btn_ui_down.visible = !b;
        }

        private get halfPanel(): boolean {
            return ViewUILogic.Instance.halfPanel;
        }

        public SetHalfPanel(b:boolean){
            ViewUILogic.Instance.halfPanel = b;
            this.btn_ui_up.visible = b;
            this.btn_ui_down.visible = !b;
        }

        private PanelMove(close: boolean = false, handler?: Laya.Handler): void {
            let _y: number;
            //关闭界面
            if (close) {
                _y = this.local_start;
                GetInfoAttr.Instance.IsAllScreen = false;
            }
            else {//缩放界面
                _y = this.halfPanel ? this.local_half : this.local_full;
                GetInfoAttr.Instance.IsAllScreen = !this.halfPanel;
                this.bombg.visible = true
            }
            let time: number = Math.abs(this.ui_box.y - _y) * 0.3;//位移×系数=移动时间（毫秒）
            this._bBoxRun = true;
            TweenList.to(this, this.ui_box, { y: _y }, time, () => {
                this.ui_box.y = _y;
                if (this._bBoxRun) {
                    this._bBoxRun = false;
                    if (handler) {
                        handler.run();
                    }
                }
            });
            if (this.halfPanel) {
                //this.bombg.y = this.ui_panel.y;
                this.bombg.visible = false
            }
            else {
                //this.bombg.y = 0;
            }
            ViewUILogic.Instance.OpenPanel = this.currentPanel;
            this.PanelSound();
        }

        /** 关闭面板 */
        public PanelClose(callBack?: Laya.Handler): void {
            mEverydayManager.Instance.IsOpen = false;
            if (this.currPanel) {
                if (HeroPosition.Instance.bChange) {
                    Event.DispatchEvent("btn_closes");
                    return
                }
                this.currPanel.Destroy();
                this.bombg.visible = false
            }
            this.SetBtnType();
            this.PanelMove(true, Laya.Handler.create(this, () => {
                //清空面板
                if (this.ui_panel.numChildren > 0) {
                    this.ui_panel.removeChildren();
                }
                if (callBack) {
                    callBack.run();
                }
            }));
            ViewUILogic.Instance.OpenPanel = E_OpenGrade.EMPTY;
            this.PanelSound();
        }

        private Btn_control() {
            let bool = WroldBossLogic.Instance.View_Control() || LadderManager.Instance.View_Control();
            this.bg.visible = this.top_bg.visible = bool;
        }

    }
}