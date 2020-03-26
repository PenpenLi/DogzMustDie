module H52D_Framework {
    AddViewResource("ListHeroView",
        [
            { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        ]);

    enum SelectType {
        One = 0,
        Five = 1,
        Max = 2,
    }

    export class ListHeroView extends ui.main.list.ListHeroViewUI implements IViewPanel {
        public _child;
        private _tabItemIndex: number = 0;
        private lock: boolean;
        private currentBtn: Array<any> = [];
        private readonly childViews = {
            lv: ["Btn_Lv", "HeroLvUp", "lv"],
            star: ["Btn_Star", "HeroStar", "star"],
            war: ["Btn_War", "HeroWar", "war"],
            handbook: ["Btn_handbook", "HeroHandBookView", "handbook"]
        }
        private titleStr = {
            0: "升级",
            1: "进阶",
            2: "布阵",
        }

        constructor() {
            super();
            this._tabItemIndex = 0;
            this.lock = true;
            this.currentBtn = [];

            // 暂时适配微信版本
            //if (window['wx']) {
            // this.tail_war.x = 287;
            // this.tail_handbook.visible = false;
            //}
            //引导按钮
            Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_4, this.Btn_War)
            Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_8, this.Btn_War)
            Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_5, this.Btn_Star)
            this.AddEvent();
            this.UpdateRedPoint();
            this.InitEvent();
        }

        // 移除事件监听
        public Destroy(): void {
            this.offAll();
            if (this.ChildBox._childs[0]) {
                this.ChildBox._childs[0].OnDestroy();
            }
            this.ChildBox.destroyChildren();
            Tick.ClearAll(this);

            Event.RemoveEvent("UpdateRedPoint", Laya.Handler.create(this, this.UpdateRedPoint))
            Event.RemoveEvent("NewTeachBtn_ClickWar", Laya.Handler.create(this, this.NewTeachBtn_ClickWar));
            Event.RemoveEvent("NewTeachBtn_ClickStar", Laya.Handler.create(this, this.NewTeachBtn_ClickStar));
        }

        private AddEvent() {
            Event.RegistEvent("UpdateRedPoint", Laya.Handler.create(this, this.UpdateRedPoint))
            Event.RegistEvent("NewTeachBtn_ClickWar", Laya.Handler.create(this, this.NewTeachBtn_ClickWar));
            Event.RegistEvent("NewTeachBtn_ClickStar", Laya.Handler.create(this, this.NewTeachBtn_ClickStar));
        }

        private InitEvent() {
            this.Btn_Lv.on(Laya.Event.CLICK, this, this.Btn_Click, [this.childViews.lv]);
            this.Btn_Star.on(Laya.Event.CLICK, this, this.Btn_Click, [this.childViews.star]);
            this.Btn_War.on(Laya.Event.CLICK, this, this.Btn_Click, [this.childViews.war]);
            this.Btn_handbook.on(Laya.Event.CLICK, this, this.Btn_Click, [this.childViews.handbook])
            if (!HeroHandbookManager.Instance.IsTrue) {
                this.Btn_Click(this.childViews.handbook);
            } else {
                this.Btn_Click(this.childViews.lv);
            }
            //给按钮添加点击播放音效的事件
            this.Btn_Lv.on(Laya.Event.CLICK, this, () => { SoundManager.Instance.OnPlaySound("res/sound/check.mp3"); });
            this.Btn_Star.on(Laya.Event.CLICK, this, () => { SoundManager.Instance.OnPlaySound("res/sound/check.mp3"); });
            this.Btn_War.on(Laya.Event.CLICK, this, () => { SoundManager.Instance.OnPlaySound("res/sound/check.mp3"); });
        }

        // 刷新红点
        public UpdateRedPoint() {
            //升级，激活
            let red_open: boolean = false;
            //进阶，进阶
            let red_star: boolean = false;
            let lv, star = 0;

            let herolist = HeroManager.Instance.GetCfgHeroList();
            for (let Idex = 0; Idex < herolist.length; Idex++) {
                let nheroID = herolist[Idex];
                let IsActive = HeroManager.Instance.IsActive(nheroID);
                if (IsActive) {
                    let Red_star = HeroManager.Instance.HeroIsStar(nheroID);
                    let Red_lvup = HeroManager.Instance.HeroIsUp(nheroID);
                    if (Red_lvup) {
                        red_open = true;
                    } if (Red_star) {
                        red_star = true;
                    }
                }
                else {
                    let Red_open = HeroManager.Instance.HeroIstrue(nheroID);
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
            if (MasterPlayer.Instance.player.CunstLevel >= 80) {
                this.red_handbook.visible = HeroHandbookManager.Instance.Red_Show();
            }
            Event.DispatchEvent("ShowRedPoint", [E_OpenGrade.HERO]);
        }

        private Btn_Click(child: Array<string>) {
            ///切换页签  提示弹框
            this._child = child[1];
            let ShowView = Laya.Handler.create(this, () => {
                if (this.lock && this.currentBtn[0] != child[0]) {
                    if (this.currentBtn.length > 0) {
                        this[this.currentBtn[0]].bgColor = "#2c2129";
                        this[this.currentBtn[0]].alpha = 0.3;
                        this[this.currentBtn[2]].visible = false;
                        for (let key in this.childViews) {
                            if (key != child[2]) {
                                this[key + "_gang"].visible = false;
                                this["view_" + key].color = "#9a9fb2";
                            }
                        }
                    }
                    this.currentBtn = child;
                    this[this.currentBtn[0]].bgColor = "";
                    this[this.currentBtn[0]].alpha = 0;
                    this[this.currentBtn[0]].visible = true;
                    this[child[2]].visible = true;
                    this["view_" + child[2]].color = "#d3c1aa";
                    this[child[2] + "_gang"].visible = true;
                    this.lock = false;
                    UIManager.Instance.CreateUI(child[1], [this, this],
                        Laya.Handler.create(this, (view) => {
                            if (this.destroyed) {
                                view.destroy(true);
                            }
                            else {
                                if (this.ChildBox._childs[0]) {
                                    this.ChildBox._childs[0].OnDestroy();
                                }
                                this.ChildBox.destroyChildren();
                                this.ChildBox.addChild(view);
                            }
                            this.lock = true;
                        }));
                }
                if (child[0] == "Btn_War") {
                    Event.DispatchEvent(EventDefine.BOTTOM_SET_PANEL);
                }

            })
            if (child[1] != "HeroWar") {
                if (HeroPosition.Instance.bChange) {
                    Event.DispatchEvent("btn_closes", ShowView);
                    return
                }
                else {
                    //ShowView.run();
                }
            }
            if (child[1] == "HeroHandBookView") {
                let open_cfg = OpenGradeConfig[24];
                let cuid_num = MasterPlayer.Instance.player.CunstLevel;
                if (cuid_num < open_cfg.Checkpoint) {
                    let str = SysPromptConfig[10018].strPromptInfo
                    let a = Format(str, open_cfg.Checkpoint,
                        GetInfoAttr.Instance.GetText(open_cfg.NamaId));
                    TipsLogic.Instance.OpenSystemTips(a);
                    return
                }
            }
            SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            ShowView.run();
        }

        private NewTeachBtn_ClickWar() {
            this.Btn_Click(this.childViews.war);
        }

        private NewTeachBtn_ClickStar() {
            this.Btn_Click(this.childViews.star);
        }
    }
}