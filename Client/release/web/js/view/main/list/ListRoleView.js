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
/**Created by the LayaAirIDE*/
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("ListRoleView", [
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_head.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_setting.atlas", type: Laya.Loader.ATLAS },
    ]);
    var ListRoleView = /** @class */ (function (_super) {
        __extends(ListRoleView, _super);
        function ListRoleView() {
            var _this = _super.call(this) || this;
            _this._roleSkill = [];
            _this._roleSkillCfg = [];
            _this._cfg = H52D_Framework.RoleLevelUpConfig;
            _this.bGuidanceButton = true;
            _this.bGuidanceButton1 = true;
            _this._Lveffect = null;
            _this.ViewInit();
            _this.EventInit();
            _this.UpdateUseTime();
            _this.SetPanelHeight();
            return _this;
        }
        ListRoleView.prototype.ViewInit = function () {
            var _this = this;
            H52D_Framework.MainRoleLogic.Instance.SetPrivList();
            //角色信息
            var roleLv = H52D_Framework.MasterPlayer.Instance.player.Level;
            var camp_ID = H52D_Framework.MasterPlayer.Instance.player.CampID;
            if (camp_ID != 0) {
                this.Camp_name.text = "【阵营：" + H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.GangConfig[camp_ID].nameId) + "】";
            }
            else {
                this.Camp_name.text = "【阵营：无】";
            }
            this.vip.visible = H52D_Framework.MasterPlayer.Instance.player.IsVip;
            H52D_Framework.MasterPlayer.Instance.player.Head = "ui_head/icon_ui_01.png";
            this.ListPanel.vScrollBarSkin = "";
            this.SetHead();
            this.SetName();
            this.HeroLevel.text = roleLv + "";
            this.damage.text = H52D_Framework.MasterPlayer.Instance.player.vo.attr.GetAttributeValue(2) + "";
            //经验
            this.ExpProgressbar();
            //list
            this._roleSkillCfg = H52D_Framework.MainRoleLogic.Instance.roleSkillCfg;
            this._roleSkill = H52D_Framework.MainRoleLogic.Instance.roleSkill;
            this.list.vScrollBarSkin = "";
            this.list.array = this._roleSkill;
            this.list.renderHandler = new Laya.Handler(this, this.RenderHandler);
            this.list.height = 95 * this._roleSkill.length;
            this.privilegeBox.y = 26 + this.list.height;
            this.RedPoint();
            H52D_Framework.Tick.Loop(1000, this, this.RedPoint);
            this.privilegeBox.visible = true;
            this.RefPrivList();
            this.ConcealIcon();
            this._effSelect = new H52D_Framework.Avatar(this.eff_privilege);
            this._effSelect.Load("res/effect/effect_ui_guangquan2/effect_ui_guangquan2.sk", 1, 2.2, 366, 72, Laya.Handler.create(this, function () {
                _this._effSelect.scale_y = 2.5;
                _this._effSelect.Play("effect_ui_guangquan2");
            }));
            this.ShowPrivilege(false);
        };
        ListRoleView.prototype.EventInit = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.achieven.on(Laya.Event.CLICK, this, this.OnAchieven);
            this.onMail.on(Laya.Event.CLICK, this, this.OnMailInfo);
            this.setting.on(Laya.Event.CLICK, this, this.OnSetting);
            this.sign.on(Laya.Event.CLICK, this, this.Onsign);
            H52D_Framework.Event.RegistEvent("RefreshList", Laya.Handler.create(this, this.RefreshList));
            H52D_Framework.Event.RegistEvent("privListTime", Laya.Handler.create(this, this.privListTime));
            H52D_Framework.Event.RegistEvent("LvUpEffect", Laya.Handler.create(this, this.LvUpEffect));
            H52D_Framework.Event.RegistEvent("changelisthigth", Laya.Handler.create(this, this.SetPanelHeight));
            H52D_Framework.Event.RegistEvent("RefPrivList", Laya.Handler.create(this, this.RefPrivList));
            H52D_Framework.Event.RegistEvent("ClickUpSkill", Laya.Handler.create(this, this.OnActUpSkill));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.PLAYER_NAME_UPDATE, Laya.Handler.create(this, this.SetName));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.PLAYER_HEAD_UPDATE, Laya.Handler.create(this, this.SetHead));
            H52D_Framework.Event.RegistEvent('ConcealIcon', Laya.Handler.create(this, this.ConcealIcon));
            H52D_Framework.Event.RegistEvent('RolePrivilege', Laya.Handler.create(this, this.RolePrivilege));
            H52D_Framework.Event.RegistEvent('RoleShowPrivilege', Laya.Handler.create(this, this.ShowPrivilege));
            //Event.RegistEvent('GetunlockButtonPos', Laya.Handler.create(this, this.GetunlockButtonPos));
        };
        ListRoleView.prototype.SetName = function () {
            this.HeroName.text = H52D_Framework.MasterPlayer.Instance.player.Name;
        };
        ListRoleView.prototype.SetHead = function () {
            var headId = H52D_Framework.MasterPlayer.Instance.player.HeadId;
            if (headId == 0) {
                this.HeadIcon.skin = "ui_head/icon_ui_01.png";
            }
            else {
                this.HeadIcon.skin = "ui_icon/" + H52D_Framework.HeroConfig[headId].strIcon;
            }
        };
        ListRoleView.prototype.Destroy = function () {
            this.offAll();
            Laya.timer.clearAll(this);
            H52D_Framework.Event.RemoveEvent("RefreshList", Laya.Handler.create(this, this.RefreshList));
            H52D_Framework.Event.RemoveEvent("LvUpEffect", Laya.Handler.create(this, this.LvUpEffect));
            H52D_Framework.Event.RemoveEvent("changelisthigth", Laya.Handler.create(this, this.SetPanelHeight));
            H52D_Framework.Event.RemoveEvent("RefPrivList", Laya.Handler.create(this, this.RefPrivList));
            H52D_Framework.Event.RemoveEvent("privListTime", Laya.Handler.create(this, this.privListTime));
            H52D_Framework.Event.RemoveEvent("ClickUpSkill", Laya.Handler.create(this, this.OnActUpSkill));
            H52D_Framework.Event.RemoveEvent('ConcealIcon', Laya.Handler.create(this, this.ConcealIcon));
            H52D_Framework.Event.RemoveEvent('RoleShowPrivilege', Laya.Handler.create(this, this.ShowPrivilege));
            //Event.RemoveEvent('GetunlockButtonPos', Laya.Handler.create(this, this.GetunlockButtonPos));
            this.ShowPrivilege(false);
        };
        ListRoleView.prototype.RefreshList = function () {
            this._roleSkill = H52D_Framework.MainRoleLogic.Instance.roleSkill;
            var roleLv = H52D_Framework.MasterPlayer.Instance.player.Level;
            this.HeroLevel.text = roleLv + "";
            this.list.array = this._roleSkill;
            this.damage.text = H52D_Framework.MasterPlayer.Instance.player.vo.attr.GetAttributeValue(2) + "";
            this.list.refresh();
            this.ExpProgressbar();
            this.privilegeBox.y = 26 + this.list.height;
        };
        ListRoleView.prototype.ExpProgressbar = function () {
            var roleLv = H52D_Framework.MasterPlayer.Instance.player.Level;
            var roleMaxLv = H52D_Framework.MainRoleLogic.Instance.roleMaxLv;
            var nextExp = H52D_Framework.RoleLevelUpConfig[roleLv + 1 > roleMaxLv ? roleMaxLv : roleLv + 1].levelUpExp;
            var curExp = H52D_Framework.MasterPlayer.Instance.player.Exp;
            if (roleLv == roleMaxLv) {
                this.progressbar.width = this.progressbg.width;
                this.progresslabel.text = curExp + "/" + nextExp;
            }
            else {
                this.progressbar.width = (curExp / nextExp) * this.progressbg.width;
                this.progresslabel.text = curExp + "/" + nextExp;
            }
        };
        /**刷新特权list */
        ListRoleView.prototype.RefPrivList = function () {
            this.privList.array = H52D_Framework.MainRoleLogic.Instance.PrivList;
            this.privList.renderHandler = new Laya.Handler(this, this.privRenderHandler);
            this.privList.height = 95 * this.privList.array.length;
        };
        /**特权list */
        ListRoleView.prototype.privRenderHandler = function (item, index) {
            var desc = item.getChildByName('desc');
            var useBtn = item.getChildByName('useBtn'); //按钮
            var useNumHtml = useBtn.getChildByName('useNumHtml');
            var useNum = item.getChildByName('useNum');
            H52D_Framework.SetHtmlStyle(desc, 20, "#d7e6ff", "left");
            H52D_Framework.SetHtmlStyle(useNumHtml, 18, "#fafa85", "center");
            useBtn.label = '使用';
            useBtn.gray = false;
            useBtn.mouseEnabled = true;
            desc.innerHTML = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.PrivilegeConfig[index + 1].description);
            //if(useNum["diamonds"]){	//显示钻石
            useNumHtml.innerHTML = useNum.text;
            //}
            // else{
            // 	useNumHtml.innerHTML = useNum.text;
            //}
            var privInfo = H52D_Framework.MainRoleLogic.Instance.PrivListInfo;
            if (privInfo[index + 1] && H52D_Framework.MainRoleLogic.Instance.GetBuffTime(index + 1) == -1) { //若永久已购买
                useBtn.label = '已生效';
                useBtn.gray = true;
                useBtn.mouseEnabled = false;
            }
            useBtn.on(Laya.Event.CLICK, this, this.UseBuff, [useBtn, index + 1]);
            //引导按钮
            if (index == 1 && this.bGuidanceButton) {
                H52D_Framework.Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_11, useBtn);
                this.bGuidanceButton = false;
            }
        };
        /**技能list */
        ListRoleView.prototype.RenderHandler = function (item, index) {
            var skillicon = item.getChildByName("skillicon");
            var skillname = item.getChildByName("skillname");
            var skilllvlabel = item.getChildByName("skilllvlabel");
            var desc = item.getChildByName("desc");
            var skillBgBtn = item.getChildByName("skillBgBtn");
            var unlock = item.getChildByName("unlock");
            var btnlabel = unlock.getChildByName("btnlabel");
            var money = unlock.getChildByName("money");
            var newskill = unlock.getChildByName("newskill");
            var maxLv = item.getChildByName("maxLv");
            //引导按钮
            if (index == 0 && this.bGuidanceButton1) {
                H52D_Framework.Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_6, unlock);
                this.bGuidanceButton1 = false;
            }
            newskill.visible = false;
            unlock.on(Laya.Event.CLICK, this, this.OnActUpSkill, [{ 1: index, 2: btnlabel, 3: skillicon }]);
            skillBgBtn.on(Laya.Event.CLICK, this, this.OnSkillInfo, [index]);
            var skilllv = this._roleSkill[index].lv;
            var roleLv = H52D_Framework.MasterPlayer.Instance.player.Level;
            var ownMoney = H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdGold);
            if (skilllv == 0) {
                skilllv = skilllv + 1;
            }
            var roleSkillId = this._roleSkillCfg[index][skilllv].roleSkillId;
            skillicon.skin = H52D_Framework.GetIcon(H52D_Framework.ActiveSkillConfig[roleSkillId].strIcon);
            skillname.text = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.ActiveSkillConfig[roleSkillId].nameId);
            skilllvlabel.text = skilllv + "";
            H52D_Framework.SetHtmlStyle(desc, 20, "#d7e6ff", "left");
            desc.innerHTML = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.ActiveSkillConfig[roleSkillId].descId);
            H52D_Framework.SetHtmlStyle(money, 18, "#fafa85", "center");
            unlock.disabled = false;
            //技能解锁
            if (!H52D_Framework.MainRoleLogic.Instance.IsMaxLv(index)) {
                unlock.visible = true;
                maxLv.visible = false;
                if (H52D_Framework.MainRoleLogic.Instance.IsSkillUnlocked(index)) {
                    var condition = H52D_Framework.MainRoleLogic.Instance.GetSkillLvUpCondition(index);
                    money.innerHTML = "<img src= 'ui_main/icon-jinbi.png' width='20px' height='20px'></img>" + condition[2];
                    if (roleLv >= condition[1]) { //如果角色等级达到升级技能条件
                        btnlabel.text = "升级";
                        if (ownMoney >= condition[2]) { //如果金币够
                        }
                        else {
                            unlock.disabled = true;
                        }
                    }
                    else { //角色等级未达到解锁技能条件
                        unlock.disabled = true;
                        btnlabel.text = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(7004), condition[1]);
                    }
                }
                else { //技能未解锁
                    var condition = H52D_Framework.MainRoleLogic.Instance.GetSkillUnlockCondition(index);
                    money.innerHTML = "<img src= 'ui_main/icon-jinbi.png' width='20px' height='20px'></img>" + condition[2];
                    if (roleLv >= condition[1]) { //如果角色等级达到解锁技能条件
                        btnlabel.text = "解锁技能";
                        if (ownMoney >= condition[2]) { //如果金币够
                            newskill.visible = true;
                        }
                        else {
                            unlock.disabled = true;
                        }
                    }
                    else { //角色等级未达到解锁技能条件
                        unlock.disabled = true;
                        btnlabel.text = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(7005), condition[1]);
                    }
                }
            }
            else {
                unlock.visible = false;
                maxLv.visible = true;
            }
        };
        //播放按钮点击音效
        ListRoleView.prototype.PlayClickSound = function () {
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
        };
        /**
         * 技能按钮点击
         */
        ListRoleView.prototype.OnActUpSkill = function (buf) {
            this._icon = buf[3];
            var index = buf[1] + 1;
            if (buf[2].text == "解锁技能") {
                H52D_Framework.RemoteCall.Instance.Send("K_ReqActivateSkill", index);
            }
            else if (buf[2].text == "升级") {
                //升级到哪一级
                H52D_Framework.RemoteCall.Instance.Send("K_ReqSkillLevelUp", index, this._roleSkill[buf[1]].lv + 1);
            }
        };
        ListRoleView.prototype.OnAchieven = function () {
            // if (OpenGradeConfig[7].Level < MasterPlayer.Instance.player.Level) {
            H52D_Framework.UIManager.Instance.CreateUI("AchievementView", [H52D_Framework.ViewUpRoot]);
            // } else {
            // 	let str = SysPromptConfig[10007].strPromptInfo
            // 	let strCont: string = str;
            // 	strCont = Format(str, OpenGradeConfig[7].Level, GetInfoAttr.Instance.GetText(5007));
            // 	TipsLogic.Instance.OpenSystemTips(strCont);
            // }
            this.PlayClickSound();
        };
        //打开邮件界面
        ListRoleView.prototype.OnMailInfo = function () {
            if (H52D_Framework.OpenGradeConfig[7].Level < H52D_Framework.MasterPlayer.Instance.player.Level) {
                H52D_Framework.UIManager.Instance.CreateUI("MailView", [H52D_Framework.ViewUpRoot]);
            }
            else {
                var str = H52D_Framework.SysPromptConfig[10007].strPromptInfo;
                var strCont = str;
                strCont = H52D_Framework.Format(str, H52D_Framework.OpenGradeConfig[7].Level, H52D_Framework.GetInfoAttr.Instance.GetText(5007));
                H52D_Framework.TipsLogic.Instance.OpenSystemTips(strCont);
            }
            this.PlayClickSound();
        };
        //打开系统设置
        ListRoleView.prototype.OnSetting = function () {
            H52D_Framework.UIManager.Instance.CreateUI("SettingView", [H52D_Framework.ViewUpRoot]);
            this.PlayClickSound();
        };
        /**打开签到界面 */
        ListRoleView.prototype.Onsign = function () {
            H52D_Framework.UIManager.Instance.CreateUI("SignInView", [H52D_Framework.ViewUpRoot]);
            this.PlayClickSound();
        };
        /**
         * 技能详情
         */
        ListRoleView.prototype.OnSkillInfo = function (index) {
            H52D_Framework.UIManager.Instance.CreateUI("SkillInfoView", [H52D_Framework.ViewUpRoot, index]);
        };
        ListRoleView.prototype.LvUpEffect = function () {
            var _this = this;
            this._Lveffect = new H52D_Framework.Avatar(this._icon);
            this._Lveffect.Load("res/effect/effect_ui_shengji/effect_ui_shengji.sk", 1, 2, 35, 30, Laya.Handler.create(this, function () {
                _this._Lveffect.Play("effect_ui_shengji", false, true, function () {
                });
            }));
        };
        /**使用buff */
        ListRoleView.prototype.UseBuff = function (useBtn, index) {
            useBtn.mouseEnabled = false;
            if (H52D_Framework.MainRoleLogic.Instance.UseBuff(index)) {
                useBtn.gray = true;
            }
            this.ShowPrivilege(false);
        };
        /** 显示光圈特效 */
        ListRoleView.prototype.ShowPrivilege = function (open) {
            if (this.eff_privilege) {
                this.eff_privilege.visible = open;
            }
        };
        /**buff倒计时 */
        ListRoleView.prototype.UpdateUseTime = function () {
            //this.buffTime=MainRoleLogic.Instance.SetToUpdatePriv();
            this.privListTime();
            Laya.timer.loop(1000, this, this.privListTime);
        };
        /**特权倒计时 */
        ListRoleView.prototype.privListTime = function () {
            var obj = H52D_Framework.MainRoleLogic.Instance.SetToUpdatePriv();
            for (var i in obj) {
                var listChild = this.privList.cells[Number(i) - 1];
                var _button = listChild._childs[7];
                var _bewrite = listChild._childs[8];
                var _useNumHtml = _button.getChildByName("useNumHtml");
                var _time = _button.getChildByName("time");
                var _discountBg = _button.getChildByName("discountBg");
                var _discount = _discountBg.getChildByName("discount");
                var _useNum = H52D_Framework.MainRoleLogic.Instance.PrivList[Number(i) - 1].useNum.text;
                _useNumHtml.innerHTML = _useNum;
                var otime = H52D_Framework.DiscountManager.Instance.tPrivilegeSvot - H52D_Framework.Time.serverSecodes;
                if (H52D_Framework.MainRoleLogic.Instance.PrivList[Number(i) - 1].discount == -1 || H52D_Framework.DiscountManager.Instance._bStartPrivilege == false || otime < 0) {
                    _time.visible = _discountBg.visible = false;
                }
                else {
                    _time.visible = _discountBg.visible = true;
                    _time.visible = false; //策划不要倒计时了。。。
                    _time.text = H52D_Framework.GetFormatNumTime(otime);
                    var disNum = H52D_Framework.MainRoleLogic.Instance.PrivList[Number(i) - 1].discount;
                    _discount.text = (disNum == 0 ? 1 : disNum) + "折";
                }
                if (H52D_Framework.GetInfoAttr.Instance.GetCountDown(obj[i], false) >= 0) {
                    _button.label = H52D_Framework.GetInfoAttr.Instance.GrtTimeOut(H52D_Framework.GetInfoAttr.Instance.GetCountDown(obj[i], false));
                    _button.gray = true;
                    _button.mouseEnabled = false;
                    _bewrite.visible = true;
                    // if (MainRoleLogic.Instance.GetBuffTime(Number(i)) == 0) {//没有持续时间,显示冷却时间
                    // 	_bewrite.text = '冷却';
                    // }else{
                    // 	_bewrite.text = PrivilegeConfig[i].isActive==1?'主动':'被动';
                    // }
                }
                else {
                    _button.label = '使用';
                    _button.gray = false;
                    _button.mouseEnabled = true;
                    _bewrite.visible = false;
                }
                //永久经验加成
                var privInfo = H52D_Framework.MainRoleLogic.Instance.PrivListInfo;
                if (privInfo[Number(i)] && H52D_Framework.MainRoleLogic.Instance.GetBuffTime(Number(i)) == -1) { //若永久已购买
                    _button.label = '已生效';
                    _button.gray = true;
                    _button.mouseEnabled = false;
                    _bewrite.visible = true;
                    //_bewrite.text = PrivilegeConfig[i].isActive==1?'主动':'被动';
                }
            }
            for (var a = 0; a < this.privList.cells.length; a++) {
                if (obj[Number(a) + 1])
                    continue;
                var listChild = this.privList.cells[a];
                var _button = listChild._childs[7];
                var _bewrite = listChild._childs[8];
                var _useNumHtml = _button.getChildByName("useNumHtml");
                var _time = _button.getChildByName("time");
                var _discountBg = _button.getChildByName("discountBg");
                var _discount = _discountBg.getChildByName("discount");
                var _useNum = H52D_Framework.MainRoleLogic.Instance.PrivList[Number(a)].useNum.text;
                var otime = H52D_Framework.DiscountManager.Instance.tPrivilegeSvot - H52D_Framework.Time.serverSecodes;
                var aaa = H52D_Framework.MainRoleLogic.Instance.PrivList[Number(a)].discount;
                var bbb = H52D_Framework.DiscountManager.Instance._bStartPrivilege == false;
                var vvv = otime < 0;
                if (H52D_Framework.MainRoleLogic.Instance.PrivList[Number(a)].discount == -1 || H52D_Framework.DiscountManager.Instance._bStartPrivilege == false || otime < 0) {
                    _time.visible = _discountBg.visible = false;
                }
                else {
                    _time.visible = _discountBg.visible = true;
                    _time.visible = false; //策划不要倒计时了。。。
                    _time.text = H52D_Framework.GetFormatNumTime(otime);
                    var disNum = H52D_Framework.MainRoleLogic.Instance.PrivList[Number(a)].discount;
                    _discount.text = (disNum == 0 ? 1 : disNum) + "折";
                }
                _button.label = '使用';
                _button.gray = false;
                _button.mouseEnabled = true;
                _bewrite.visible = false;
            }
        };
        /**设置panel高度,为了滑动 */
        ListRoleView.prototype.SetPanelHeight = function () {
            var bool = Boolean(H52D_Framework.ViewUILogic.Instance.halfPanel);
            if (bool) {
                this.ListPanel.height = 150 * G_StageHeightScale;
            }
            else {
                this.ListPanel.height = (940 - wxsclae) * G_StageHeightScale;
            }
        };
        //邮件红点
        ListRoleView.prototype.RedPoint = function () {
            this.redPoint.visible = H52D_Framework.MailLogic.Inst.checkShowRed;
            this.achPoint.visible = H52D_Framework.AchievenManger.Instance.showPoint();
        };
        /**签到红点 */
        ListRoleView.prototype.ConcealIcon = function () {
            this.btnHong_3.visible = !H52D_Framework.SignInLogic.Instance.ToDayAlr;
        };
        /** 角色特权位置调整 */
        ListRoleView.prototype.RolePrivilege = function (type) {
            if (type == 1) {
                this.eff_privilege.y = 92;
            }
            else if (type == 2) {
                this.ListPanel.vScrollBar.value = 74;
                this.eff_privilege.y = 284;
            }
            this.ShowPrivilege(true);
        };
        return ListRoleView;
    }(ui.main.list.ListRoleViewUI));
    H52D_Framework.ListRoleView = ListRoleView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ListRoleView.js.map