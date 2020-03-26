module H52D_Framework {

    /**
     * @class：主界面控制页面
     * @author：zhangyusong
     */
    export class MainControlView extends ui.main.subinterface.MainControlViewUI implements IViewPanel {
        /**神兽蛋特效 */
        private _petEffectBj: Avatar;
        private _moneyEffectBg: Avatar;
        private _adEffectBj: Avatar;
        /** 倒计时表现类 */
        private countdown: Countdwon;
        private tieshiEnd: number = -500;

        /** 展开按钮是否正在展开 */
        private isDeplogShow: boolean = true;
        private btn_funshouw: boolean = true;
        public constructor() {
            super();
            this.ShowFun();
            this.ViewInit();
            this.EventInit();
            this.btn_camp.visible = false

        }

        private ShowFun() {
            if (!IsAD()) {
                if (!IsShieldRecharge()) {
                    this.btn_funshouw = true;
                } else {
                    this.btn_funshouw = false;
                }
            }
        }
        private ViewInit() {
            this.btn_fund.visible = this.btn_funshouw;
            this.btn_moregame.visible = false;//IsAD() && IsNotBaiDuSdk() && IsShieldRecharge();
            let Item_num = BagManager.Instance.getItemNumber(4001);
            if (!IsAD() && !IsShieldRecharge()) {
                this.btn_frist.visible = ShopLogic.Instance.isFristCharge(3, 1) || Item_num <= 1;
                this.return_money.visible = !this.btn_frist.visible;
            }
            else {
                this.btn_frist.visible = false;
                this.return_money.visible = false;
            }

            Tick.Loop(1000, this, this.Update);
            OneTimer(1000, () => {
                ProfManager.Instance.Add_Prof();
                CampManager.Instance.Add_camp();
            }, "");

            ViewUILogic.Instance.CampRed = this.Camp_red;
            let bool = CampManager.Instance.Bool;
            this.ShowRedPoint(E_OpenGrade.CAMP);
            CampManager.Instance.GetCamp_List();
            this.SetShopPetVisible(PetManager.Instance.HasTimes > 0);
            this.ShowRedPoint(E_OpenGrade.VIP);
            this.ShowRedPoint(E_OpenGrade.DEPLOY);
            // 创建走马灯界面
            if (!UIManager.Instance.IsHave("NoticeView", ViewToppestRoot)) {
                UIManager.Instance.CreateUI("NoticeView", [ViewToppestRoot]);
            }
            //vip特效和活动特效
            if (!IsShieldRecharge()) {
                this.SetMoneny(true, "e_vip");
                this.SetMoneny(true, "action_eff");
            }
            this.AdUpdate();
            this.UpdateBtnList()
            // 刷新运营活动入口
            this.UpdateOActivitysEntrance();
            this.UpdateIOSExamine();
            this.img_tie.right = this.tieshiEnd;
            SetHtmlStyle(this.tx_tie, 20, '#ffffff', 'left');
            if (IsNotBaiDuSdk()) {
                this.xiaotieshi.text = "英雄小贴士："
            } else {
                this.xiaotieshi.text = "百度小贴士：";
            }
            this.img_ad.visible = this.tx_ad.visible = IsAD();

        }

        private EventInit() {
            this.btn_rank.on(Laya.Event.CLICK, this, this.OnOptionClick, [E_OpenGrade.RANK]);
            this.btn_vip.on(Laya.Event.CLICK, this, this.OnOptionClick, [E_OpenGrade.VIP]);
            //this.btn_camp.on(Laya.Event.CLICK, this, this.OnOptionClick, [E_OpenGrade.CAMP]);
            this.btn_week.on(Laya.Event.CLICK, this, this.OnOptionClick, [E_OpenGrade.SEVEN]);
            this.btn_share.on(Laya.Event.CLICK, this, this.OnOptionClick, [E_OpenGrade.SHARE]);
            this.btn_fund.on(Laya.Event.CLICK, this, this.OnOptionClick, [E_OpenGrade.FUND]);
            this.return_money.on(Laya.Event.CLICK, this, this.OpenView, ["MoneybackView"]);
            this.btn_frist.on(Laya.Event.CLICK, this, this.OpenView, ["GiftBag2YuanView"]);
            this.btn_heropeck.on(Laya.Event.CLICK, this, this.OnOptionClick, [E_OpenGrade.HeroPeck]);
            this.btn_deploy.on(Laya.Event.CLICK, this, this.OnOptionClick, [E_OpenGrade.DEPLOY]);
            this.btn_ad.on(Laya.Event.CLICK, this, this.OnOptionClick, [E_OpenGrade.FREE]);
            this.btn_moregame.on(Laya.Event.CLICK, this, this.OnOptionClick, [E_OpenGrade.MoreGame]);

            this.showPet.on(Laya.Event.CLICK, this, this.ClickShopPet);
            //this.chatbtn.on(Laya.Event.CLICK, this, this.ChatBtn);

            Event.RegistEvent("ShowControlRedPoint", Laya.Handler.create(this, this.ShowRedPoint));
            Event.RegistEvent('SetShopPetVisible', Laya.Handler.create(this, this.SetShopPetVisible));
            Event.RegistEvent('UpdateBtnList', Laya.Handler.create(this, this.UpdateBtnList));
            Event.RegistEvent('UpdateOActivitysEntrance', Laya.Handler.create(this, this.UpdateOActivitysEntrance));
            Event.RegistEvent('SetMoneny', Laya.Handler.create(this, this.SetMoneny));
            Event.RegistEvent(EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.CunstomCurrent));
            Event.RegistEvent('UpdateBtnList', Laya.Handler.create(this, this.Show_Control));
            Event.RegistEvent('BaiDuXiaoTieShi', Laya.Handler.create(this, this.TieShi));
            Event.RegistEvent('AdUpdate', Laya.Handler.create(this, this.AdUpdate));
        }

        /** 显示红点 */
        private ShowRedPoint(type: E_OpenGrade, open: boolean = false) {
            switch (type) {
                case E_OpenGrade.ACTION:
                    this.action_print.visible = open;
                    break;
                case E_OpenGrade.CAMP:
                    this.Camp_red.visible = CampManager.Instance.ShowRed(this.Camp_red);
                    break;
                case E_OpenGrade.DEPLOY:
                    this.deploy_red.visible = this.CanShowDeployRed();
                    break;
                case E_OpenGrade.FIRST:
                    this.money_red.visible = this.FirstShowRed();
                    break;
                case E_OpenGrade.FUND:
                    this.fund_red.visible = FundLogic.Instance.ShowRedPoint();
                    break;
                case E_OpenGrade.SEVEN:
                    this.btnweekred.visible = SignInLogic.Instance.IsBtnVisible();
                    break;
                case E_OpenGrade.VIP:
                    this.btnHong_3.visible = false;
                    break;
                case E_OpenGrade.SHARE:
                    this.share_red.visible = open;
                    break;
                case E_OpenGrade.FREE:
                    this.ad_red.visible = (AdvertisingManager.Instance.bnWXAdertisingTimes
                        || GameParamConfig["advertisementDailyNum"] == -1)
                        && ViewUILogic.Instance.adState == 3;
                    break;
            }
        }

        public UpdateIOSExamine() {
            // ios屏蔽功能
            if (IsShieldRecharge()) {
                this.btn_frist.visible = false;
                this.return_money.visible = false;
                this.SetMoneny(false, "e_vip");
                this.SetMoneny(false, "action_eff");
                this.SetMoneny(false, "f_showred");
                this.SetMoneny(false, "m_showred");
            }
            if (IsShieldRecharge() && !IsNotBaiDuSdk()) {
                this.btn_vip.visible = false;
            }
        }

        public Destroy(): void {
            if (this._petEffectBj) {
                this._petEffectBj.Destroy()
                this._petEffectBj = null
            }
            Event.RemoveEvent("ShowControlRedPoint", Laya.Handler.create(this, this.ShowRedPoint));
            Event.RemoveEvent('SetShopPetVisible', Laya.Handler.create(this, this.SetShopPetVisible));
            Event.RemoveEvent('UpdateBtnList', Laya.Handler.create(this, this.UpdateBtnList));
            Event.RemoveEvent('UpdateOActivitysEntrance', Laya.Handler.create(this, this.UpdateOActivitysEntrance));
            Event.RemoveEvent('SetMoneny', Laya.Handler.create(this, this.SetMoneny));
            Event.RemoveEvent('UpdateBtnList', Laya.Handler.create(this, this.Show_Control));
            Event.RemoveEvent('BaiDuXiaoTieShi', Laya.Handler.create(this, this.TieShi));
            Event.RemoveEvent(EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.CunstomCurrent));
            this.countdown.Destroy();
            this.countdown = null;
        }

        private CunstomCurrent() {
            this.Btn_control();
            if (CustomsManager.Instance.CustomsType == Customs_Type.Ladder) {
                this.Btn_Control_ladder();
                OneTimer(1000, () => {
                    this.timesd();
                }, "bosstimerdaojishi")
            }
        }

        /** 刷新主界面按钮 */
        public UpdateBtnList() {
            this.btn_week.visible = SignInLogic.Instance.IsShowMainBtn()

            this.ShowRedPoint(E_OpenGrade.SEVEN);
            this.ShowRedPoint(E_OpenGrade.ACTION);
            let Item_num = BagManager.Instance.getItemNumber(4001);
            this.frist_print.visible = Item_num == 1 ? true : false;
            let bo = ShopLogic.Instance.isFristCharge(3, 1) && Item_num != 0
            if (Item_num == 0 && !ShopLogic.Instance.isFristCharge(3, 1)) {
                this.btn_frist.visible = false;
            }
            if (!IsAD() && !IsShieldRecharge()) {
                if (!this.btn_frist.visible) {
                    this.return_money.visible = true;
                }
            }
            this.SetMoneny(ShopLogic.Instance.EffShow && this.btn_frist.visible && !IsShieldRecharge(), "f_showred");

            this.ShowIcon();
            if (this.return_money.visible) {
                this.SetMoneny(ShopLogic.Instance.EffShow && !IsShieldRecharge(), "m_showred");
            }
            this.ShowRedPoint(E_OpenGrade.FIRST);
            this.UpdateIOSExamine()
            //this.chatbtn.visible = WroldBossLogic.Instance.Show || LadderManager.Instance.View_Control();
            this.chatbtn.visible = false
            // 微信暂时屏蔽掉聊天
            if(window["wx"]){
                this.chatbtn.visible = false
                this.showPet.x = 51
            }
            this.ShowRedPoint(E_OpenGrade.DEPLOY);
            this.btn_heropeck.visible = HeroManager.Instance.PeckIcon //&& !IsShieldRecharge();
            this.heropeck_red.visible = HeroManager.Instance.PeckShow;
            this.SetDeployBtnPos();
            this.action_print.visible = OActivityLogic.Instance.RedPoint;
        }

        /** 广告按钮刷新 */
        private AdUpdate() {
            if (AdvertisingManager.Instance.bnWXAdertisingTimes || GameParamConfig["advertisementDailyNum"] == -1) {
                //倒计时             
                this.adTime = GameParamConfig["advertisementCD"] - (Time.serverSecodes - ViewUILogic.Instance.adTimeStamp);
                if (this.adTime > 0) {
                    ViewUILogic.Instance.adState = 1;
                    Tick.Clear(this, this.AdShowTime);
                    this.tx_ad.text = GetFormatNumTime(this.adTime);
                    Tick.Loop(1000, this, this.AdShowTime);
                }
                //开启
                else {
                    this.AdShowTime();
                }
                this.btn_ad.gray = false;
                this.btn_ad.mouseEnabled = true;
                this.tx_ad.color = "#ffffff";
                if (AdvertisingManager.Instance.bnWXAdertisingTimes) {
                    this.box_ad.visible = ViewUILogic.Instance.adState == 2;
                }
            }
            else {
                this.btn_ad.gray = true;
                this.btn_ad.mouseEnabled = false;
                this.tx_ad.color = "#ff0000";
                this.box_ad.visible = false;
            }
            this.ShowRedPoint(E_OpenGrade.FREE);
            if (!this._adEffectBj) {
                this._adEffectBj = new Avatar(this.box_ad)
                this._adEffectBj.Load(EffectDefine.daoju2, 1, 1.5, 26, 30,
                    Laya.Handler.create(this, () => {
                        this._adEffectBj.Play("effect_ui_daoju2");
                    }));
            }
        }

        private adTime: number = 0;
        private AdShowTime() {
            if (--this.adTime > 0) {
                this.tx_ad.text = GetFormatNumTime(this.adTime);
            }
            else {
                if (ViewUILogic.Instance.adState != 3) {
                    ViewUILogic.Instance.adState = 2;
                    this.box_ad.visible = true;
                }
                this.tx_ad.text = GetInfoAttr.Instance.GetText(5022);
                Tick.Clear(this, this.AdShowTime);
            }
        }

        /** 百度小贴士 */
        private TieShi() {
            let tie = CastingConfig[LoginLogic.Instance.profid]["tips_"+CustomsManager.Instance.CustomsVo.customsId]
            if(!tie){
                tie = CustomsManager.Instance.CustomsVo.tie;
            }
            let color = BaseDefine.LabelColor[HeroConfig[tie[4]].quality];
            let heroname = GetInfoAttr.Instance.GetSystemText(HeroConfig[tie[4]].name)
            let hero = "<font color='" + color + "'>" + heroname + "</font>";
            if (tie[1] == 1) {
                this.tx_tie.innerHTML = GetInfoAttr.Instance.GetSystemText(tie[2], tie[3], hero);
            }
            this.img_tie.right = this.tieshiEnd;
            Tick.Clear(this, this.Update);
            let speed: number = 400;
            let out: laya.utils.Tween;
            out = Laya.Tween.to(this.img_tie, { "right": 0 }, speed, Laya.Ease.linearInOut);
            Tick.Once(speed, this, () => {
                Laya.Tween.clear(out);
                this.img_tie.right = 0;
            });
            Tick.Once(5000 + speed, this, () => {
                out = Laya.Tween.to(this.img_tie, { "right": this.tieshiEnd }, speed, Laya.Ease.linearInOut);
            });
            Tick.Once((5000 + speed * 2), this, () => {
                Laya.Tween.clear(out);
                this.img_tie.right = this.tieshiEnd;
            });
            Tick.Loop(1000, this, this.Update);
        }

        private FirstShowRed() {
            if (this.btn_frist.visible) return false
            let m_arr = ShopLogic.Instance.MoneyBack;
            if (!m_arr) return false;
            let arr = ShopLogic.Instance.Eff_show();
            for (let key in arr) {
                let money = ChargeConfig[1][arr[key]].Money;
                let bool = ShopLogic.Instance.isFristCharge(1, arr[key]);

                if (m_arr[money] != 1 && bool == false) {
                    return true;
                }
            }
            return false;
        }

        private ShowIcon() {
            if (this.btn_frist.visible) return false
            let bool = ShopLogic.Instance.Contr_redshow();
            if (!IsAD() && !IsShieldRecharge()) {
                this.return_money.visible = !bool;
            }
            this.UpdateIOSExamine()
        }

        /**
         * 主界面按钮事件
         * @param clickType 功能类型
         */
        private OnOptionClick(clickType: E_OpenGrade): void {
            SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            let condition: boolean = OpenCondition(clickType);
            if (!condition) {
                return;
            }
            switch (clickType) {
                case E_OpenGrade.RANK:
                    //ViewUILogic.Instance.C_ReleaseSkill([1])
                    UIManager.Instance.CreateUI("RankView", [ViewUpRoot]);
                    break;
                case E_OpenGrade.CAMP:
                    if (MasterPlayer.Instance.player.CampID != 0) {
                        //UIManager.Instance.CreateUI("CampMainInfo", [ViewUpRoot]);
                    }
                    else {
                        //UIManager.Instance.CreateUI("JoinCampTip", [ViewUpRoot]);
                    }
                    break;
                case E_OpenGrade.SEVEN:
                    UIManager.Instance.CreateUI("SevenSigninView", [ViewUpRoot]);
                    break;
                case E_OpenGrade.VIP:
                    UIManager.Instance.CreateUI("VipView", [ViewUpRoot]);
                    break;
                case E_OpenGrade.FIRST:

                    break;
                case E_OpenGrade.SHARE:
                    UIManager.Instance.CreateUI("ShareBaseView", [ViewUpRoot]);
                    break;
                case E_OpenGrade.FUND:
                    UIManager.Instance.CreateUI("FundView", [ViewUpRoot]);
                    break;
                case E_OpenGrade.HeroPeck:
                    UIManager.Instance.CreateUI("HeroStarPeckView", [ViewUpRoot]);
                    break;
                case E_OpenGrade.DEPLOY:
                    this.ClickDeploy(true, false);
                    break;
                case E_OpenGrade.FREE:
                    UIManager.Instance.CreateUI("AdvertisementView", [ViewUpRoot, AdvertisementType.diamond]);
                    break;
                case E_OpenGrade.MoreGame:
                    UIManager.Instance.CreateUI("MoerGameView", [ViewUpRoot]);
                    break;
            }
        }

        /**排列左上方功能图标位置*/
        public SetDeployBtnPos() {
            let nYpos = 220;
            for (let i: number = 0; i < this.toprightbox._childs.length; i++) {
                let child = this.toprightbox._childs[i];
                if (child.visible) {
                    child.pos(child.x, nYpos);
                    nYpos = nYpos + child.height + 5;
                }
            }
        }

        /**是否显示功能伸缩的红点 */
        private CanShowDeployRed() {
            if (SignInLogic.Instance.IsBtnVisible() && SignInLogic.Instance.IsShowMainBtn() && !this.isDeplogShow) {
                return true;
            }
            if (HeroManager.Instance.PeckShow && HeroManager.Instance.PeckIcon && !this.isDeplogShow) {
                return true;
            }
            if (this.FirstShowRed() && !this.isDeplogShow && !IsShieldRecharge()) {
                return true;
            }

            if (this.action_print.visible && !this.isDeplogShow) {
                return true;
            }

            if (this.fund_red.visible && !this.isDeplogShow) {
                return true;
            }

            if (this.frist_print.visible && !this.isDeplogShow) {
                return true;
            }

            if (this.btnweekred.visible && !this.isDeplogShow) {
                return true;
            }

            if (this.share_red.visible && !this.isDeplogShow) {
                return true;
            }
            return false;
        }

        /**功能伸缩 */
        private ClickDeploy(bShow: boolean, bControl: boolean) {
            if (bShow) {
                if (this.btn_deploy.visible) {
                    this.toprightbox.visible = !this.toprightbox.visible;
                    this.btn_deploy.skin = this.toprightbox.visible ? "ui_main/btn-zhujiemian-zhankai.png" : "ui_main/btn-zhujiemian-shousuo.png";
                    this.Btn_showbox.visible = this.toprightbox.visible;
                }
                else {
                    this.btn_deploy.visible = true;
                    this.toprightbox.visible = this.btn_deploy.skin == "ui_main/btn-zhujiemian-zhankai.png";
                }
            }
            else {
                this.btn_deploy.visible = bControl;
                this.toprightbox.visible = bControl && this.btn_deploy.skin == "ui_main/btn-zhujiemian-zhankai.png";
            }
            this.isDeplogShow = !this.isDeplogShow;
        }

        private ClickShopPet(): void {
            if (PetManager.Instance.HasTimes <= 0) {
                TipsLogic.Instance.OpenSystemTips("没有可领取的神兽！")
                return
            }
            //领取神兽
            PetManager.Instance.GetPet();
        }

        private ChatBtn() {
            //播放按钮音效
            SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            if (MasterPlayer.Instance.player.CunstLevel > OpenGradeConfig[8].Checkpoint) {
                UIManager.Instance.CreateUI("ChatView", [ViewUpRoot]);
            }
            else {
                TipsLogic.Instance.OpenSystemTips("通关" + OpenGradeConfig[8].Checkpoint + "关开启");
            }
        }

        private Update() {
            let bool: boolean = false;
            if (MailLogic.Inst.checkShowRed || AchievenManger.Instance.showPoint() || this.RoleRedPoint()) {
                bool = true;
            }
            else {
                bool = false;
            }
            //聊天红点
            if (MasterPlayer.Instance.player.CunstLevel > OpenGradeConfig[8].Checkpoint) {
                this.chatbtnpoint.visible = ChatLogic.Inst.newMsg;
            } else {
                this.chatbtnpoint.visible = false;
            }
            //分享红点儿
            this.ShowRedPoint(E_OpenGrade.SHARE, ShareLogic.Instance.ShowRed());
            Event.DispatchEvent("ShowRedPoint", [E_OpenGrade.ROLE, bool]);
            this.UpdateOActivitysEntrance();
            this.ShowRedPoint(E_OpenGrade.DEPLOY);
        }

        private RoleRedPoint(): boolean {
            let roleSkill = MainRoleLogic.Instance.roleSkill;
            let roleLv: number = MasterPlayer.Instance.player.Level;
            let ownMoney: number = BagManager.Instance.getItemNumber(BaseDefine.ItemIdGold);
            let bool: boolean = false;
            for (var index = 0; index < roleSkill.length; index++) {
                var element = roleSkill[index];
                //技能解锁
                if (!MainRoleLogic.Instance.IsMaxLv(index)) {
                    if (!MainRoleLogic.Instance.IsSkillUnlocked(index)) {
                        let condition: Object = MainRoleLogic.Instance.GetSkillUnlockCondition(index);
                        if (roleLv >= condition[1]) {//如果角色等级达到解锁技能条件
                            if (ownMoney >= condition[2]) {//如果金币够
                                bool = true;
                                break;
                            }
                        }
                    }
                }
            }
            return bool;
        }

        /**加载神兽蛋特效 */
        private SetShopPetVisible(bvisible: boolean) {
            this.showPet.visible = bvisible;
            this.showPetBg.visible = bvisible;

            if (this._petEffectBj != null) {
                this._petEffectBj.Destroy()
            }
            this._petEffectBj = new Avatar(this.showPetBg)
            this._petEffectBj.Load(EffectDefine.daoju2, 1, 1.5, 0, 0,
                Laya.Handler.create(this, () => {
                    this._petEffectBj.Play("effect_ui_daoju2", true, true, () => {
                    })
                }));
        }

        private _showeff: { [id: string]: Avatar } = {};
        /***加载充值返馈特效 */
        private SetMoneny(bool, name: string) {
            if (this._showeff[name]) {
                this._showeff[name].Destroy();
            }
            this[name].visible = bool;
            this._showeff[name] = new Avatar(this[name])
            this._showeff[name].Load(EffectDefine.tubiao2, 1, 1.1, 1, 0,
                Laya.Handler.create(this, () => {
                    this._showeff[name].Play("effect_ui_tubiao2", true, true, () => {
                    })
                }));
        }

        private OpenView(name: string) {
            UIManager.Instance.CreateUI(name, [ViewUpRoot]);
        }

        /**刷新运营活动入口 */
        private UpdateOActivitysEntrance() {
            //活动入口初始化
            for (let i = 1; i < 2; i++) {
                let btn = this["btn_active" + i];
                btn.off(Laya.Event.CLICK, this, this.OnOActivityBtnClick);
                btn.visible = false;
                this.SetMoneny(OActivityLogic.Instance.RedPoint, "action_eff");
            }
            if (OActivityLogic.Instance.msgLoaded) {
                let index = 1;
                for (let i in OActivityLogic.Instance.openList) {
                    let strName = OActivityPosName[i];
                    if (strName) {
                        let btn = this["btn_active" + index];
                        this["btn_active" + index].text = strName;
                        btn.skin = "ui_main/" + OActivityPosIcon[i];
                        btn.visible = true;
                        this.ActionInfo(btn.visible);
                        btn.on(Laya.Event.CLICK, this, this.OnOActivityBtnClick, [i, btn]);
                        index++;
                    }
                }
            }
        }

        private ActionInfo(bool: boolean) {
            if (bool) {
                let bool1 = DEverydayManager.Instance.eff_Contr();
                let bool2 = mEverydayManager.Instance.eff_Contr();
                let bool_1 = DEverydayManager.Instance.ShowEff && bool1 ? true : false;
                let bool_2 = DEverydayManager.Instance.ShowEff && bool2;
                let istrue = bool_1 || bool_2;
                if (!istrue) {
                    this.SetMoneny(istrue && !IsShieldRecharge(), "action_eff");
                }
                let _bool = OActivityLogic.Instance.RedPoint; //DEverydayManager.Instance.red_contr() || mEverydayManager.Instance.red_contr();
                this.ShowRedPoint(E_OpenGrade.ACTION, _bool);
                this.ShowRedPoint(E_OpenGrade.DEPLOY, _bool);
            }
        }
        private OnOActivityBtnClick(index: number, btn: any) {
            UIManager.Instance.CreateUI("ActiveBgView", [ViewUpRoot, index]);
        }

        private Btn_control() {
            let bool = WroldBossLogic.Instance.View_Control();
            this.Customs.visible = bool;
            this.showPet.visible = bool && PetManager.Instance.HasTimes > 0;
            this.btn_deploy.visible = bool;
            this.toprightbox.visible = bool && this.btn_deploy.skin == "ui_main/btn-zhujiemian-zhankai.png";
        }

        private Btn_Control_ladder() {
            let bool = LadderManager.Instance.View_Control();
            this.chatbtn.visible = false;            // 微信暂时屏蔽掉聊天
            if(window["wx"]){
                this.chatbtn.visible = false
            }
        }

        private Show_Control() {
            let bool = WroldBossLogic.Instance.View_Control();
            this.showPet.visible = bool && PetManager.Instance.HasTimes > 0;
            this.btn_deploy.visible = bool;
            this.toprightbox.visible = bool && this.btn_deploy.skin == "ui_main/btn-zhujiemian-zhankai.png";
        }

        private timesd() {
            this.countdown = new Countdwon();
            this.addChild(this.countdown);
            this.countdown.centerX = 0;
            this.countdown.centerY = 0;
            this.countdown.time = 3;
            if (CustomsManager.Instance.CustomsType == Customs_Type.Ladder) {
                this.countdown.Start(Laya.Handler.create(this, this.Show_Control));
                Tick.Once(6100, this, () => {
                });
            }
        }

    }
}