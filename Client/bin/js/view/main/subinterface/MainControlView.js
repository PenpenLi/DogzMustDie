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
    /**
     * @class：主界面控制页面
     * @author：zhangyusong
     */
    var MainControlView = /** @class */ (function (_super) {
        __extends(MainControlView, _super);
        function MainControlView() {
            var _this = _super.call(this) || this;
            _this.tieshiEnd = -500;
            /** 展开按钮是否正在展开 */
            _this.isDeplogShow = true;
            _this.btn_funshouw = true;
            _this.adTime = 0;
            _this._showeff = {};
            _this.ShowFun();
            _this.ViewInit();
            _this.EventInit();
            _this.btn_camp.visible = false;
            return _this;
        }
        MainControlView.prototype.ShowFun = function () {
            if (!H52D_Framework.IsAD()) {
                if (!H52D_Framework.IsShieldRecharge()) {
                    this.btn_funshouw = true;
                }
                else {
                    this.btn_funshouw = false;
                }
            }
        };
        MainControlView.prototype.ViewInit = function () {
            this.btn_fund.visible = this.btn_funshouw;
            this.btn_moregame.visible = false; //IsAD() && IsNotBaiDuSdk() && IsShieldRecharge();
            var Item_num = H52D_Framework.BagManager.Instance.getItemNumber(4001);
            if (!H52D_Framework.IsAD() && !H52D_Framework.IsShieldRecharge()) {
                this.btn_frist.visible = H52D_Framework.ShopLogic.Instance.isFristCharge(3, 1) || Item_num <= 1;
                this.return_money.visible = !this.btn_frist.visible;
            }
            else {
                this.btn_frist.visible = false;
                this.return_money.visible = false;
            }
            H52D_Framework.Tick.Loop(1000, this, this.Update);
            H52D_Framework.OneTimer(1000, function () {
                H52D_Framework.ProfManager.Instance.Add_Prof();
                H52D_Framework.CampManager.Instance.Add_camp();
            }, "");
            H52D_Framework.ViewUILogic.Instance.CampRed = this.Camp_red;
            var bool = H52D_Framework.CampManager.Instance.Bool;
            this.ShowRedPoint(E_OpenGrade.CAMP);
            H52D_Framework.CampManager.Instance.GetCamp_List();
            this.SetShopPetVisible(H52D_Framework.PetManager.Instance.HasTimes > 0);
            this.ShowRedPoint(E_OpenGrade.VIP);
            this.ShowRedPoint(E_OpenGrade.DEPLOY);
            // 创建走马灯界面
            if (!H52D_Framework.UIManager.Instance.IsHave("NoticeView", H52D_Framework.ViewToppestRoot)) {
                H52D_Framework.UIManager.Instance.CreateUI("NoticeView", [H52D_Framework.ViewToppestRoot]);
            }
            //vip特效和活动特效
            if (!H52D_Framework.IsShieldRecharge()) {
                this.SetMoneny(true, "e_vip");
                this.SetMoneny(true, "action_eff");
            }
            this.AdUpdate();
            this.UpdateBtnList();
            // 刷新运营活动入口
            this.UpdateOActivitysEntrance();
            this.UpdateIOSExamine();
            this.img_tie.right = this.tieshiEnd;
            H52D_Framework.SetHtmlStyle(this.tx_tie, 20, '#ffffff', 'left');
            if (H52D_Framework.IsNotBaiDuSdk()) {
                this.xiaotieshi.text = "英雄小贴士：";
            }
            else {
                this.xiaotieshi.text = "百度小贴士：";
            }
            this.img_ad.visible = this.tx_ad.visible = H52D_Framework.IsAD();
        };
        MainControlView.prototype.EventInit = function () {
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
            H52D_Framework.Event.RegistEvent("ShowControlRedPoint", Laya.Handler.create(this, this.ShowRedPoint));
            H52D_Framework.Event.RegistEvent('SetShopPetVisible', Laya.Handler.create(this, this.SetShopPetVisible));
            H52D_Framework.Event.RegistEvent('UpdateBtnList', Laya.Handler.create(this, this.UpdateBtnList));
            H52D_Framework.Event.RegistEvent('UpdateOActivitysEntrance', Laya.Handler.create(this, this.UpdateOActivitysEntrance));
            H52D_Framework.Event.RegistEvent('SetMoneny', Laya.Handler.create(this, this.SetMoneny));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.CunstomCurrent));
            H52D_Framework.Event.RegistEvent('UpdateBtnList', Laya.Handler.create(this, this.Show_Control));
            H52D_Framework.Event.RegistEvent('BaiDuXiaoTieShi', Laya.Handler.create(this, this.TieShi));
            H52D_Framework.Event.RegistEvent('AdUpdate', Laya.Handler.create(this, this.AdUpdate));
        };
        /** 显示红点 */
        MainControlView.prototype.ShowRedPoint = function (type, open) {
            if (open === void 0) { open = false; }
            switch (type) {
                case E_OpenGrade.ACTION:
                    this.action_print.visible = open;
                    break;
                case E_OpenGrade.CAMP:
                    this.Camp_red.visible = H52D_Framework.CampManager.Instance.ShowRed(this.Camp_red);
                    break;
                case E_OpenGrade.DEPLOY:
                    this.deploy_red.visible = this.CanShowDeployRed();
                    break;
                case E_OpenGrade.FIRST:
                    this.money_red.visible = this.FirstShowRed();
                    break;
                case E_OpenGrade.FUND:
                    this.fund_red.visible = H52D_Framework.FundLogic.Instance.ShowRedPoint();
                    break;
                case E_OpenGrade.SEVEN:
                    this.btnweekred.visible = H52D_Framework.SignInLogic.Instance.IsBtnVisible();
                    break;
                case E_OpenGrade.VIP:
                    this.btnHong_3.visible = false;
                    break;
                case E_OpenGrade.SHARE:
                    this.share_red.visible = open;
                    break;
                case E_OpenGrade.FREE:
                    this.ad_red.visible = (H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes
                        || H52D_Framework.GameParamConfig["advertisementDailyNum"] == -1)
                        && H52D_Framework.ViewUILogic.Instance.adState == 3;
                    break;
            }
        };
        MainControlView.prototype.UpdateIOSExamine = function () {
            // ios屏蔽功能
            if (H52D_Framework.IsShieldRecharge()) {
                this.btn_frist.visible = false;
                this.return_money.visible = false;
                this.SetMoneny(false, "e_vip");
                this.SetMoneny(false, "action_eff");
                this.SetMoneny(false, "f_showred");
                this.SetMoneny(false, "m_showred");
            }
            if (H52D_Framework.IsShieldRecharge() && !H52D_Framework.IsNotBaiDuSdk()) {
                this.btn_vip.visible = false;
            }
        };
        MainControlView.prototype.Destroy = function () {
            if (this._petEffectBj) {
                this._petEffectBj.Destroy();
                this._petEffectBj = null;
            }
            H52D_Framework.Event.RemoveEvent("ShowControlRedPoint", Laya.Handler.create(this, this.ShowRedPoint));
            H52D_Framework.Event.RemoveEvent('SetShopPetVisible', Laya.Handler.create(this, this.SetShopPetVisible));
            H52D_Framework.Event.RemoveEvent('UpdateBtnList', Laya.Handler.create(this, this.UpdateBtnList));
            H52D_Framework.Event.RemoveEvent('UpdateOActivitysEntrance', Laya.Handler.create(this, this.UpdateOActivitysEntrance));
            H52D_Framework.Event.RemoveEvent('SetMoneny', Laya.Handler.create(this, this.SetMoneny));
            H52D_Framework.Event.RemoveEvent('UpdateBtnList', Laya.Handler.create(this, this.Show_Control));
            H52D_Framework.Event.RemoveEvent('BaiDuXiaoTieShi', Laya.Handler.create(this, this.TieShi));
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.CunstomCurrent));
            this.countdown.Destroy();
            this.countdown = null;
        };
        MainControlView.prototype.CunstomCurrent = function () {
            var _this = this;
            this.Btn_control();
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Ladder) {
                this.Btn_Control_ladder();
                H52D_Framework.OneTimer(1000, function () {
                    _this.timesd();
                }, "bosstimerdaojishi");
            }
        };
        /** 刷新主界面按钮 */
        MainControlView.prototype.UpdateBtnList = function () {
            this.btn_week.visible = H52D_Framework.SignInLogic.Instance.IsShowMainBtn();
            this.ShowRedPoint(E_OpenGrade.SEVEN);
            this.ShowRedPoint(E_OpenGrade.ACTION);
            var Item_num = H52D_Framework.BagManager.Instance.getItemNumber(4001);
            this.frist_print.visible = Item_num == 1 ? true : false;
            var bo = H52D_Framework.ShopLogic.Instance.isFristCharge(3, 1) && Item_num != 0;
            if (Item_num == 0 && !H52D_Framework.ShopLogic.Instance.isFristCharge(3, 1)) {
                this.btn_frist.visible = false;
            }
            if (!H52D_Framework.IsAD() && !H52D_Framework.IsShieldRecharge()) {
                if (!this.btn_frist.visible) {
                    this.return_money.visible = true;
                }
            }
            this.SetMoneny(H52D_Framework.ShopLogic.Instance.EffShow && this.btn_frist.visible && !H52D_Framework.IsShieldRecharge(), "f_showred");
            this.ShowIcon();
            if (this.return_money.visible) {
                this.SetMoneny(H52D_Framework.ShopLogic.Instance.EffShow && !H52D_Framework.IsShieldRecharge(), "m_showred");
            }
            this.ShowRedPoint(E_OpenGrade.FIRST);
            this.UpdateIOSExamine();
            //this.chatbtn.visible = WroldBossLogic.Instance.Show || LadderManager.Instance.View_Control();
            this.chatbtn.visible = false;
            // 微信暂时屏蔽掉聊天
            if (window["wx"]) {
                this.chatbtn.visible = false;
                this.showPet.x = 51;
            }
            this.ShowRedPoint(E_OpenGrade.DEPLOY);
            this.btn_heropeck.visible = H52D_Framework.HeroManager.Instance.PeckIcon; //&& !IsShieldRecharge();
            this.heropeck_red.visible = H52D_Framework.HeroManager.Instance.PeckShow;
            this.SetDeployBtnPos();
            this.action_print.visible = H52D_Framework.OActivityLogic.Instance.RedPoint;
        };
        /** 广告按钮刷新 */
        MainControlView.prototype.AdUpdate = function () {
            var _this = this;
            if (H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes || H52D_Framework.GameParamConfig["advertisementDailyNum"] == -1) {
                //倒计时             
                this.adTime = H52D_Framework.GameParamConfig["advertisementCD"] - (H52D_Framework.Time.serverSecodes - H52D_Framework.ViewUILogic.Instance.adTimeStamp);
                if (this.adTime > 0) {
                    H52D_Framework.ViewUILogic.Instance.adState = 1;
                    H52D_Framework.Tick.Clear(this, this.AdShowTime);
                    this.tx_ad.text = H52D_Framework.GetFormatNumTime(this.adTime);
                    H52D_Framework.Tick.Loop(1000, this, this.AdShowTime);
                }
                //开启
                else {
                    this.AdShowTime();
                }
                this.btn_ad.gray = false;
                this.btn_ad.mouseEnabled = true;
                this.tx_ad.color = "#ffffff";
                if (H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes) {
                    this.box_ad.visible = H52D_Framework.ViewUILogic.Instance.adState == 2;
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
                this._adEffectBj = new H52D_Framework.Avatar(this.box_ad);
                this._adEffectBj.Load(H52D_Framework.EffectDefine.daoju2, 1, 1.5, 26, 30, Laya.Handler.create(this, function () {
                    _this._adEffectBj.Play("effect_ui_daoju2");
                }));
            }
        };
        MainControlView.prototype.AdShowTime = function () {
            if (--this.adTime > 0) {
                this.tx_ad.text = H52D_Framework.GetFormatNumTime(this.adTime);
            }
            else {
                if (H52D_Framework.ViewUILogic.Instance.adState != 3) {
                    H52D_Framework.ViewUILogic.Instance.adState = 2;
                    this.box_ad.visible = true;
                }
                this.tx_ad.text = H52D_Framework.GetInfoAttr.Instance.GetText(5022);
                H52D_Framework.Tick.Clear(this, this.AdShowTime);
            }
        };
        /** 百度小贴士 */
        MainControlView.prototype.TieShi = function () {
            var _this = this;
            var tie = H52D_Framework.CastingConfig[H52D_Framework.LoginLogic.Instance.profid]["tips_" + H52D_Framework.CustomsManager.Instance.CustomsVo.customsId];
            if (!tie) {
                tie = H52D_Framework.CustomsManager.Instance.CustomsVo.tie;
            }
            var color = H52D_Framework.BaseDefine.LabelColor[H52D_Framework.HeroConfig[tie[4]].quality];
            var heroname = H52D_Framework.GetInfoAttr.Instance.GetSystemText(H52D_Framework.HeroConfig[tie[4]].name);
            var hero = "<font color='" + color + "'>" + heroname + "</font>";
            if (tie[1] == 1) {
                this.tx_tie.innerHTML = H52D_Framework.GetInfoAttr.Instance.GetSystemText(tie[2], tie[3], hero);
            }
            this.img_tie.right = this.tieshiEnd;
            H52D_Framework.Tick.Clear(this, this.Update);
            var speed = 400;
            var out;
            out = Laya.Tween.to(this.img_tie, { "right": 0 }, speed, Laya.Ease.linearInOut);
            H52D_Framework.Tick.Once(speed, this, function () {
                Laya.Tween.clear(out);
                _this.img_tie.right = 0;
            });
            H52D_Framework.Tick.Once(5000 + speed, this, function () {
                out = Laya.Tween.to(_this.img_tie, { "right": _this.tieshiEnd }, speed, Laya.Ease.linearInOut);
            });
            H52D_Framework.Tick.Once((5000 + speed * 2), this, function () {
                Laya.Tween.clear(out);
                _this.img_tie.right = _this.tieshiEnd;
            });
            H52D_Framework.Tick.Loop(1000, this, this.Update);
        };
        MainControlView.prototype.FirstShowRed = function () {
            if (this.btn_frist.visible)
                return false;
            var m_arr = H52D_Framework.ShopLogic.Instance.MoneyBack;
            if (!m_arr)
                return false;
            var arr = H52D_Framework.ShopLogic.Instance.Eff_show();
            for (var key in arr) {
                var money = H52D_Framework.ChargeConfig[1][arr[key]].Money;
                var bool = H52D_Framework.ShopLogic.Instance.isFristCharge(1, arr[key]);
                if (m_arr[money] != 1 && bool == false) {
                    return true;
                }
            }
            return false;
        };
        MainControlView.prototype.ShowIcon = function () {
            if (this.btn_frist.visible)
                return false;
            var bool = H52D_Framework.ShopLogic.Instance.Contr_redshow();
            if (!H52D_Framework.IsAD() && !H52D_Framework.IsShieldRecharge()) {
                this.return_money.visible = !bool;
            }
            this.UpdateIOSExamine();
        };
        /**
         * 主界面按钮事件
         * @param clickType 功能类型
         */
        MainControlView.prototype.OnOptionClick = function (clickType) {
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            var condition = H52D_Framework.OpenCondition(clickType);
            if (!condition) {
                return;
            }
            switch (clickType) {
                case E_OpenGrade.RANK:
                    //ViewUILogic.Instance.C_ReleaseSkill([1])
                    H52D_Framework.UIManager.Instance.CreateUI("RankView", [H52D_Framework.ViewUpRoot]);
                    break;
                case E_OpenGrade.CAMP:
                    if (H52D_Framework.MasterPlayer.Instance.player.CampID != 0) {
                        //UIManager.Instance.CreateUI("CampMainInfo", [ViewUpRoot]);
                    }
                    else {
                        //UIManager.Instance.CreateUI("JoinCampTip", [ViewUpRoot]);
                    }
                    break;
                case E_OpenGrade.SEVEN:
                    H52D_Framework.UIManager.Instance.CreateUI("SevenSigninView", [H52D_Framework.ViewUpRoot]);
                    break;
                case E_OpenGrade.VIP:
                    H52D_Framework.UIManager.Instance.CreateUI("VipView", [H52D_Framework.ViewUpRoot]);
                    break;
                case E_OpenGrade.FIRST:
                    break;
                case E_OpenGrade.SHARE:
                    H52D_Framework.UIManager.Instance.CreateUI("ShareBaseView", [H52D_Framework.ViewUpRoot]);
                    break;
                case E_OpenGrade.FUND:
                    H52D_Framework.UIManager.Instance.CreateUI("FundView", [H52D_Framework.ViewUpRoot]);
                    break;
                case E_OpenGrade.HeroPeck:
                    H52D_Framework.UIManager.Instance.CreateUI("HeroStarPeckView", [H52D_Framework.ViewUpRoot]);
                    break;
                case E_OpenGrade.DEPLOY:
                    this.ClickDeploy(true, false);
                    break;
                case E_OpenGrade.FREE:
                    H52D_Framework.UIManager.Instance.CreateUI("AdvertisementView", [H52D_Framework.ViewUpRoot, AdvertisementType.diamond]);
                    break;
                case E_OpenGrade.MoreGame:
                    H52D_Framework.UIManager.Instance.CreateUI("MoerGameView", [H52D_Framework.ViewUpRoot]);
                    break;
            }
        };
        /**排列左上方功能图标位置*/
        MainControlView.prototype.SetDeployBtnPos = function () {
            var nYpos = 220;
            for (var i = 0; i < this.toprightbox._childs.length; i++) {
                var child = this.toprightbox._childs[i];
                if (child.visible) {
                    child.pos(child.x, nYpos);
                    nYpos = nYpos + child.height + 5;
                }
            }
        };
        /**是否显示功能伸缩的红点 */
        MainControlView.prototype.CanShowDeployRed = function () {
            if (H52D_Framework.SignInLogic.Instance.IsBtnVisible() && H52D_Framework.SignInLogic.Instance.IsShowMainBtn() && !this.isDeplogShow) {
                return true;
            }
            if (H52D_Framework.HeroManager.Instance.PeckShow && H52D_Framework.HeroManager.Instance.PeckIcon && !this.isDeplogShow) {
                return true;
            }
            if (this.FirstShowRed() && !this.isDeplogShow && !H52D_Framework.IsShieldRecharge()) {
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
        };
        /**功能伸缩 */
        MainControlView.prototype.ClickDeploy = function (bShow, bControl) {
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
        };
        MainControlView.prototype.ClickShopPet = function () {
            if (H52D_Framework.PetManager.Instance.HasTimes <= 0) {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("没有可领取的神兽！");
                return;
            }
            //领取神兽
            H52D_Framework.PetManager.Instance.GetPet();
        };
        MainControlView.prototype.ChatBtn = function () {
            //播放按钮音效
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            if (H52D_Framework.MasterPlayer.Instance.player.CunstLevel > H52D_Framework.OpenGradeConfig[8].Checkpoint) {
                H52D_Framework.UIManager.Instance.CreateUI("ChatView", [H52D_Framework.ViewUpRoot]);
            }
            else {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("通关" + H52D_Framework.OpenGradeConfig[8].Checkpoint + "关开启");
            }
        };
        MainControlView.prototype.Update = function () {
            var bool = false;
            if (H52D_Framework.MailLogic.Inst.checkShowRed || H52D_Framework.AchievenManger.Instance.showPoint() || this.RoleRedPoint()) {
                bool = true;
            }
            else {
                bool = false;
            }
            //聊天红点
            if (H52D_Framework.MasterPlayer.Instance.player.CunstLevel > H52D_Framework.OpenGradeConfig[8].Checkpoint) {
                this.chatbtnpoint.visible = H52D_Framework.ChatLogic.Inst.newMsg;
            }
            else {
                this.chatbtnpoint.visible = false;
            }
            //分享红点儿
            this.ShowRedPoint(E_OpenGrade.SHARE, H52D_Framework.ShareLogic.Instance.ShowRed());
            H52D_Framework.Event.DispatchEvent("ShowRedPoint", [E_OpenGrade.ROLE, bool]);
            this.UpdateOActivitysEntrance();
            this.ShowRedPoint(E_OpenGrade.DEPLOY);
        };
        MainControlView.prototype.RoleRedPoint = function () {
            var roleSkill = H52D_Framework.MainRoleLogic.Instance.roleSkill;
            var roleLv = H52D_Framework.MasterPlayer.Instance.player.Level;
            var ownMoney = H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdGold);
            var bool = false;
            for (var index = 0; index < roleSkill.length; index++) {
                var element = roleSkill[index];
                //技能解锁
                if (!H52D_Framework.MainRoleLogic.Instance.IsMaxLv(index)) {
                    if (!H52D_Framework.MainRoleLogic.Instance.IsSkillUnlocked(index)) {
                        var condition = H52D_Framework.MainRoleLogic.Instance.GetSkillUnlockCondition(index);
                        if (roleLv >= condition[1]) { //如果角色等级达到解锁技能条件
                            if (ownMoney >= condition[2]) { //如果金币够
                                bool = true;
                                break;
                            }
                        }
                    }
                }
            }
            return bool;
        };
        /**加载神兽蛋特效 */
        MainControlView.prototype.SetShopPetVisible = function (bvisible) {
            var _this = this;
            this.showPet.visible = bvisible;
            this.showPetBg.visible = bvisible;
            if (this._petEffectBj != null) {
                this._petEffectBj.Destroy();
            }
            this._petEffectBj = new H52D_Framework.Avatar(this.showPetBg);
            this._petEffectBj.Load(H52D_Framework.EffectDefine.daoju2, 1, 1.5, 0, 0, Laya.Handler.create(this, function () {
                _this._petEffectBj.Play("effect_ui_daoju2", true, true, function () {
                });
            }));
        };
        /***加载充值返馈特效 */
        MainControlView.prototype.SetMoneny = function (bool, name) {
            var _this = this;
            if (this._showeff[name]) {
                this._showeff[name].Destroy();
            }
            this[name].visible = bool;
            this._showeff[name] = new H52D_Framework.Avatar(this[name]);
            this._showeff[name].Load(H52D_Framework.EffectDefine.tubiao2, 1, 1.1, 1, 0, Laya.Handler.create(this, function () {
                _this._showeff[name].Play("effect_ui_tubiao2", true, true, function () {
                });
            }));
        };
        MainControlView.prototype.OpenView = function (name) {
            H52D_Framework.UIManager.Instance.CreateUI(name, [H52D_Framework.ViewUpRoot]);
        };
        /**刷新运营活动入口 */
        MainControlView.prototype.UpdateOActivitysEntrance = function () {
            //活动入口初始化
            for (var i = 1; i < 2; i++) {
                var btn = this["btn_active" + i];
                btn.off(Laya.Event.CLICK, this, this.OnOActivityBtnClick);
                btn.visible = false;
                this.SetMoneny(H52D_Framework.OActivityLogic.Instance.RedPoint, "action_eff");
            }
            if (H52D_Framework.OActivityLogic.Instance.msgLoaded) {
                var index = 1;
                for (var i in H52D_Framework.OActivityLogic.Instance.openList) {
                    var strName = OActivityPosName[i];
                    if (strName) {
                        var btn = this["btn_active" + index];
                        this["btn_active" + index].text = strName;
                        btn.skin = "ui_main/" + OActivityPosIcon[i];
                        btn.visible = true;
                        this.ActionInfo(btn.visible);
                        btn.on(Laya.Event.CLICK, this, this.OnOActivityBtnClick, [i, btn]);
                        index++;
                    }
                }
            }
        };
        MainControlView.prototype.ActionInfo = function (bool) {
            if (bool) {
                var bool1 = H52D_Framework.DEverydayManager.Instance.eff_Contr();
                var bool2 = H52D_Framework.mEverydayManager.Instance.eff_Contr();
                var bool_1 = H52D_Framework.DEverydayManager.Instance.ShowEff && bool1 ? true : false;
                var bool_2 = H52D_Framework.DEverydayManager.Instance.ShowEff && bool2;
                var istrue = bool_1 || bool_2;
                if (!istrue) {
                    this.SetMoneny(istrue && !H52D_Framework.IsShieldRecharge(), "action_eff");
                }
                var _bool = H52D_Framework.OActivityLogic.Instance.RedPoint; //DEverydayManager.Instance.red_contr() || mEverydayManager.Instance.red_contr();
                this.ShowRedPoint(E_OpenGrade.ACTION, _bool);
                this.ShowRedPoint(E_OpenGrade.DEPLOY, _bool);
            }
        };
        MainControlView.prototype.OnOActivityBtnClick = function (index, btn) {
            H52D_Framework.UIManager.Instance.CreateUI("ActiveBgView", [H52D_Framework.ViewUpRoot, index]);
        };
        MainControlView.prototype.Btn_control = function () {
            var bool = H52D_Framework.WroldBossLogic.Instance.View_Control();
            this.Customs.visible = bool;
            this.showPet.visible = bool && H52D_Framework.PetManager.Instance.HasTimes > 0;
            this.btn_deploy.visible = bool;
            this.toprightbox.visible = bool && this.btn_deploy.skin == "ui_main/btn-zhujiemian-zhankai.png";
        };
        MainControlView.prototype.Btn_Control_ladder = function () {
            var bool = H52D_Framework.LadderManager.Instance.View_Control();
            this.chatbtn.visible = false; // 微信暂时屏蔽掉聊天
            if (window["wx"]) {
                this.chatbtn.visible = false;
            }
        };
        MainControlView.prototype.Show_Control = function () {
            var bool = H52D_Framework.WroldBossLogic.Instance.View_Control();
            this.showPet.visible = bool && H52D_Framework.PetManager.Instance.HasTimes > 0;
            this.btn_deploy.visible = bool;
            this.toprightbox.visible = bool && this.btn_deploy.skin == "ui_main/btn-zhujiemian-zhankai.png";
        };
        MainControlView.prototype.timesd = function () {
            this.countdown = new H52D_Framework.Countdwon();
            this.addChild(this.countdown);
            this.countdown.centerX = 0;
            this.countdown.centerY = 0;
            this.countdown.time = 3;
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Ladder) {
                this.countdown.Start(Laya.Handler.create(this, this.Show_Control));
                H52D_Framework.Tick.Once(6100, this, function () {
                });
            }
        };
        return MainControlView;
    }(ui.main.subinterface.MainControlViewUI));
    H52D_Framework.MainControlView = MainControlView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MainControlView.js.map