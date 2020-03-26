/**Created by the LayaAirIDE*/
module H52D_Framework {
	AddViewResource("ListRoleView",
		[
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_head.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_setting.atlas", type: Laya.Loader.ATLAS },
		]);
	export class ListRoleView extends ui.main.list.ListRoleViewUI implements IViewPanel {
		private _roleSkill: Array<{ "lv": number, "cd": number }> = [];
		private _roleSkillCfg: Array<any> = [];
		private _cfg = RoleLevelUpConfig;
		private _effSelect: Avatar;

		constructor() {
			super();
			this.ViewInit();
			this.EventInit();
			this.UpdateUseTime();
			this.SetPanelHeight()
		}

		private ViewInit(): void {
			MainRoleLogic.Instance.SetPrivList();
			//角色信息
			let roleLv: number = MasterPlayer.Instance.player.Level;
			let camp_ID = MasterPlayer.Instance.player.CampID;
			if (camp_ID != 0) {
				this.Camp_name.text = "【阵营：" + GetInfoAttr.Instance.GetText(GangConfig[camp_ID].nameId) + "】";
			}
			else {
				this.Camp_name.text = "【阵营：无】";
			}
			this.vip.visible = MasterPlayer.Instance.player.IsVip;
			MasterPlayer.Instance.player.Head = "ui_head/icon_ui_01.png";
			this.ListPanel.vScrollBarSkin = "";
			this.SetHead();
			this.SetName();
			this.HeroLevel.text = roleLv + "";
			this.damage.text = MasterPlayer.Instance.player.vo.attr.GetAttributeValue(2) + "";
			//经验
			this.ExpProgressbar();
			//list
			this._roleSkillCfg = MainRoleLogic.Instance.roleSkillCfg;
			this._roleSkill = MainRoleLogic.Instance.roleSkill;
			this.list.vScrollBarSkin = "";
			this.list.array = this._roleSkill;
			this.list.renderHandler = new Laya.Handler(this, this.RenderHandler);
			this.list.height = 95 * this._roleSkill.length;
			this.privilegeBox.y = 26 + this.list.height;
			this.RedPoint();
			Tick.Loop(1000, this, this.RedPoint);
			this.privilegeBox.visible = true;
			this.RefPrivList()
			this.ConcealIcon();
			this._effSelect = new Avatar(this.eff_privilege);
			this._effSelect.Load("res/effect/effect_ui_guangquan2/effect_ui_guangquan2.sk", 1, 2.2, 366, 72, Laya.Handler.create(this, () => {
				this._effSelect.scale_y = 2.5;
				this._effSelect.Play("effect_ui_guangquan2");
			}));
			this.ShowPrivilege(false);
		}

		private EventInit(): void {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.achieven.on(Laya.Event.CLICK, this, this.OnAchieven);
			this.onMail.on(Laya.Event.CLICK, this, this.OnMailInfo);
			this.setting.on(Laya.Event.CLICK, this, this.OnSetting);
			this.sign.on(Laya.Event.CLICK, this, this.Onsign);
			Event.RegistEvent("RefreshList", Laya.Handler.create(this, this.RefreshList));
			Event.RegistEvent("privListTime", Laya.Handler.create(this, this.privListTime));
			Event.RegistEvent("LvUpEffect", Laya.Handler.create(this, this.LvUpEffect));
			Event.RegistEvent("changelisthigth", Laya.Handler.create(this, this.SetPanelHeight));
			Event.RegistEvent("RefPrivList", Laya.Handler.create(this, this.RefPrivList));
			Event.RegistEvent("ClickUpSkill", Laya.Handler.create(this, this.OnActUpSkill));
			Event.RegistEvent(EventDefine.PLAYER_NAME_UPDATE, Laya.Handler.create(this, this.SetName));
			Event.RegistEvent(EventDefine.PLAYER_HEAD_UPDATE, Laya.Handler.create(this, this.SetHead));
			Event.RegistEvent('ConcealIcon', Laya.Handler.create(this, this.ConcealIcon));
			Event.RegistEvent('RolePrivilege', Laya.Handler.create(this, this.RolePrivilege));
			Event.RegistEvent('RoleShowPrivilege', Laya.Handler.create(this, this.ShowPrivilege));
			//Event.RegistEvent('GetunlockButtonPos', Laya.Handler.create(this, this.GetunlockButtonPos));
		}

		private SetName() {
			this.HeroName.text = MasterPlayer.Instance.player.Name;
		}
		private SetHead() {
			let headId = MasterPlayer.Instance.player.HeadId;
			if (headId == 0) {
				this.HeadIcon.skin = "ui_head/icon_ui_01.png";
			}
			else {
				this.HeadIcon.skin = "ui_icon/" + HeroConfig[headId].strIcon;
			}
		}

		public Destroy(): void {
			this.offAll();
			Laya.timer.clearAll(this);
			Event.RemoveEvent("RefreshList", Laya.Handler.create(this, this.RefreshList));
			Event.RemoveEvent("LvUpEffect", Laya.Handler.create(this, this.LvUpEffect));
			Event.RemoveEvent("changelisthigth", Laya.Handler.create(this, this.SetPanelHeight));
			Event.RemoveEvent("RefPrivList", Laya.Handler.create(this, this.RefPrivList));
			Event.RemoveEvent("privListTime", Laya.Handler.create(this, this.privListTime));
			Event.RemoveEvent("ClickUpSkill", Laya.Handler.create(this, this.OnActUpSkill));
			Event.RemoveEvent('ConcealIcon', Laya.Handler.create(this, this.ConcealIcon));
			Event.RemoveEvent('RoleShowPrivilege', Laya.Handler.create(this, this.ShowPrivilege));
			//Event.RemoveEvent('GetunlockButtonPos', Laya.Handler.create(this, this.GetunlockButtonPos));

			this.ShowPrivilege(false);
		}
		private RefreshList(): void {
			this._roleSkill = MainRoleLogic.Instance.roleSkill;
			let roleLv: number = MasterPlayer.Instance.player.Level;
			this.HeroLevel.text = roleLv + "";
			this.list.array = this._roleSkill;
			this.damage.text = MasterPlayer.Instance.player.vo.attr.GetAttributeValue(2) + "";
			this.list.refresh();
			this.ExpProgressbar();

			this.privilegeBox.y = 26 + this.list.height;

		}
		private ExpProgressbar() {
			let roleLv: number = MasterPlayer.Instance.player.Level;
			let roleMaxLv: number = MainRoleLogic.Instance.roleMaxLv;
			let nextExp: number = RoleLevelUpConfig[roleLv + 1 > roleMaxLv ? roleMaxLv : roleLv + 1].levelUpExp;
			let curExp: number = MasterPlayer.Instance.player.Exp;
			if (roleLv == roleMaxLv) {
				this.progressbar.width = this.progressbg.width;
				this.progresslabel.text = curExp + "/" + nextExp;
			} else {
				this.progressbar.width = (curExp / nextExp) * this.progressbg.width;
				this.progresslabel.text = curExp + "/" + nextExp;
			}
		}
		/**刷新特权list */
		private RefPrivList() {
			this.privList.array = MainRoleLogic.Instance.PrivList;
			this.privList.renderHandler = new Laya.Handler(this, this.privRenderHandler);
			this.privList.height = 95 * this.privList.array.length;
		}

		private bGuidanceButton = true;
		/**特权list */
		private privRenderHandler(item: Laya.Box, index: number): void {
			let desc: Laya.HTMLDivElement = item.getChildByName('desc') as Laya.HTMLDivElement;
			let useBtn = item.getChildByName('useBtn') as Laya.Button;//按钮
			let useNumHtml = useBtn.getChildByName('useNumHtml') as Laya.HTMLDivElement;
			let useNum = item.getChildByName('useNum') as Laya.Label;
			SetHtmlStyle(desc, 20, "#d7e6ff", "left");
			SetHtmlStyle(useNumHtml, 18, "#fafa85", "center");
			useBtn.label = '使用';
			useBtn.gray = false;
			useBtn.mouseEnabled = true;

			desc.innerHTML = GetInfoAttr.Instance.GetText(PrivilegeConfig[index + 1].description);

			//if(useNum["diamonds"]){	//显示钻石
			useNumHtml.innerHTML = useNum.text;
			//}
			// else{
			// 	useNumHtml.innerHTML = useNum.text;
			//}
			let privInfo = MainRoleLogic.Instance.PrivListInfo;

			if (privInfo[index + 1] && MainRoleLogic.Instance.GetBuffTime(index + 1) == -1) {//若永久已购买
				useBtn.label = '已生效';
				useBtn.gray = true;
				useBtn.mouseEnabled = false;
			}
			useBtn.on(Laya.Event.CLICK, this, this.UseBuff, [useBtn, index + 1]);

			//引导按钮
			if (index == 1 && this.bGuidanceButton) {
				Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_11, useBtn)
				this.bGuidanceButton = false;
			}
		}

		private bGuidanceButton1 = true;
		/**技能list */
		private RenderHandler(item: Laya.Box, index: number): void {
			let skillicon: Laya.Image = item.getChildByName("skillicon") as Laya.Image;
			let skillname: Laya.Label = item.getChildByName("skillname") as Laya.Label;
			let skilllvlabel: Laya.Label = item.getChildByName("skilllvlabel") as Laya.Label;
			let desc: Laya.HTMLDivElement = item.getChildByName("desc") as Laya.HTMLDivElement;
			let skillBgBtn: Laya.Label = item.getChildByName("skillBgBtn") as Laya.Label;
			let unlock: Laya.Button = item.getChildByName("unlock") as Laya.Button;
			let btnlabel: Laya.Label = unlock.getChildByName("btnlabel") as Laya.Label;
			let money: Laya.HTMLDivElement = unlock.getChildByName("money") as Laya.HTMLDivElement;
			let newskill: Laya.Image = unlock.getChildByName("newskill") as Laya.Image;
			let maxLv: Laya.Label = item.getChildByName("maxLv") as Laya.Label;

			//引导按钮
			if (index == 0 && this.bGuidanceButton1) {
				Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_6, unlock)
				this.bGuidanceButton1 = false;
			}

			newskill.visible = false;
			unlock.on(Laya.Event.CLICK, this, this.OnActUpSkill, [{ 1: index, 2: btnlabel, 3: skillicon }]);
			skillBgBtn.on(Laya.Event.CLICK, this, this.OnSkillInfo, [index]);
			let skilllv: number = this._roleSkill[index].lv;
			let roleLv: number = MasterPlayer.Instance.player.Level;
			let ownMoney: number = BagManager.Instance.getItemNumber(BaseDefine.ItemIdGold);
			if (skilllv == 0) {
				skilllv = skilllv + 1;
			}

			let roleSkillId: number = this._roleSkillCfg[index][skilllv].roleSkillId;
			skillicon.skin = GetIcon(ActiveSkillConfig[roleSkillId].strIcon);
			skillname.text = GetInfoAttr.Instance.GetText(ActiveSkillConfig[roleSkillId].nameId);
			skilllvlabel.text = skilllv + "";
			SetHtmlStyle(desc, 20, "#d7e6ff", "left");
			desc.innerHTML = GetInfoAttr.Instance.GetText(ActiveSkillConfig[roleSkillId].descId);
			SetHtmlStyle(money, 18, "#fafa85", "center");
			unlock.disabled = false;
			//技能解锁
			if (!MainRoleLogic.Instance.IsMaxLv(index)) {
				unlock.visible = true;
				maxLv.visible = false;
				if (MainRoleLogic.Instance.IsSkillUnlocked(index)) {
					let condition: Object = MainRoleLogic.Instance.GetSkillLvUpCondition(index);
					money.innerHTML = "<img src= 'ui_main/icon-jinbi.png' width='20px' height='20px'></img>" + condition[2];
					if (roleLv >= condition[1]) {//如果角色等级达到升级技能条件
						btnlabel.text = "升级";
						if (ownMoney >= condition[2]) {//如果金币够

						} else {
							unlock.disabled = true;
						}
					} else {//角色等级未达到解锁技能条件
						unlock.disabled = true;
						btnlabel.text = Format(GetInfoAttr.Instance.GetText(7004), condition[1]);
					}
				} else {//技能未解锁
					let condition: Object = MainRoleLogic.Instance.GetSkillUnlockCondition(index);
					money.innerHTML = "<img src= 'ui_main/icon-jinbi.png' width='20px' height='20px'></img>" + condition[2];
					if (roleLv >= condition[1]) {//如果角色等级达到解锁技能条件
						btnlabel.text = "解锁技能";
						if (ownMoney >= condition[2]) {//如果金币够
							newskill.visible = true;
						} else {
							unlock.disabled = true;
						}
					} else {//角色等级未达到解锁技能条件
						unlock.disabled = true;
						btnlabel.text = Format(GetInfoAttr.Instance.GetText(7005), condition[1]);
					}
				}
			} else {
				unlock.visible = false;
				maxLv.visible = true;
			}

		}
		//播放按钮点击音效
		private PlayClickSound() {
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3")
		}

		/**
		 * 技能按钮点击		 
		 */
		private OnActUpSkill(buf: any): void {
			this._icon = buf[3];
			let index: number = buf[1] + 1;
			if (buf[2].text == "解锁技能") {
				RemoteCall.Instance.Send("K_ReqActivateSkill", index);
			} else if (buf[2].text == "升级") {

				//升级到哪一级
				RemoteCall.Instance.Send("K_ReqSkillLevelUp", index, this._roleSkill[buf[1]].lv + 1);
			}
		}


		private OnAchieven() {
			// if (OpenGradeConfig[7].Level < MasterPlayer.Instance.player.Level) {
			UIManager.Instance.CreateUI("AchievementView", [ViewUpRoot]);
			// } else {
			// 	let str = SysPromptConfig[10007].strPromptInfo
			// 	let strCont: string = str;
			// 	strCont = Format(str, OpenGradeConfig[7].Level, GetInfoAttr.Instance.GetText(5007));
			// 	TipsLogic.Instance.OpenSystemTips(strCont);
			// }
			this.PlayClickSound();
		}

		//打开邮件界面
		private OnMailInfo() {
			if (OpenGradeConfig[7].Level < MasterPlayer.Instance.player.Level) {
				UIManager.Instance.CreateUI("MailView", [ViewUpRoot]);
			} else {
				let str = SysPromptConfig[10007].strPromptInfo
				let strCont: string = str;
				strCont = Format(str, OpenGradeConfig[7].Level, GetInfoAttr.Instance.GetText(5007));
				TipsLogic.Instance.OpenSystemTips(strCont);
			}
			this.PlayClickSound();
		}

		//打开系统设置
		private OnSetting() {
			UIManager.Instance.CreateUI("SettingView", [ViewUpRoot]);
			this.PlayClickSound();
		}

		/**打开签到界面 */
		private Onsign() {
			UIManager.Instance.CreateUI("SignInView", [ViewUpRoot]);
			this.PlayClickSound();
		}

		/**
		 * 技能详情
		 */
		private OnSkillInfo(index: number): void {
			UIManager.Instance.CreateUI("SkillInfoView", [ViewUpRoot, index]);
		}
		private _icon;
		private _Lveffect: Avatar = null;
		private LvUpEffect() {
			this._Lveffect = new Avatar(this._icon)
			this._Lveffect.Load("res/effect/effect_ui_shengji/effect_ui_shengji.sk", 1, 2, 35, 30,
				Laya.Handler.create(this, () => {
					this._Lveffect.Play("effect_ui_shengji", false, true, () => {
					})
				}));
		}

		/**使用buff */
		private UseBuff(useBtn: Laya.Button, index: number) {
			useBtn.mouseEnabled = false;
			if (MainRoleLogic.Instance.UseBuff(index)) {
				useBtn.gray = true;
			}
			this.ShowPrivilege(false);
		}

		/** 显示光圈特效 */
		private ShowPrivilege(open: boolean) {
			if (this.eff_privilege) {
				this.eff_privilege.visible = open;
			}
		}

		private buffTime: any;
		/**buff倒计时 */
		private UpdateUseTime() {
			//this.buffTime=MainRoleLogic.Instance.SetToUpdatePriv();
			this.privListTime();
			Laya.timer.loop(1000, this, this.privListTime);
		}

		/**特权倒计时 */
		private privListTime() {
			let obj = MainRoleLogic.Instance.SetToUpdatePriv();
			for (let i in obj) {
				let listChild = this.privList.cells[Number(i) - 1];
				let _button: Laya.Button = listChild._childs[7] as Laya.Button;
				let _bewrite: Laya.Label = listChild._childs[8] as Laya.Label;
				let _useNumHtml: Laya.HTMLDivElement = _button.getChildByName("useNumHtml") as Laya.HTMLDivElement;
				let _time: Laya.Label = _button.getChildByName("time") as Laya.Label;
				let _discountBg: Laya.Image = _button.getChildByName("discountBg") as Laya.Image;
				let _discount: Laya.Label = _discountBg.getChildByName("discount") as Laya.Label;
				let _useNum = MainRoleLogic.Instance.PrivList[Number(i) - 1].useNum.text
				_useNumHtml.innerHTML = _useNum;

				let otime = DiscountManager.Instance.tPrivilegeSvot - Time.serverSecodes;
				if (MainRoleLogic.Instance.PrivList[Number(i) - 1].discount == -1 || DiscountManager.Instance._bStartPrivilege == false || otime < 0) {
					_time.visible = _discountBg.visible = false;

				} else {
					_time.visible = _discountBg.visible = true;
					_time.visible = false;//策划不要倒计时了。。。
					_time.text = GetFormatNumTime(otime);
					let disNum = MainRoleLogic.Instance.PrivList[Number(i) - 1].discount
					_discount.text = (disNum == 0 ? 1 : disNum) + "折";
				}
				if (GetInfoAttr.Instance.GetCountDown(obj[i], false) >= 0) {
					_button.label = GetInfoAttr.Instance.GrtTimeOut(GetInfoAttr.Instance.GetCountDown(obj[i], false));
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
				let privInfo = MainRoleLogic.Instance.PrivListInfo;
				if (privInfo[Number(i)] && MainRoleLogic.Instance.GetBuffTime(Number(i)) == -1) {//若永久已购买
					_button.label = '已生效';
					_button.gray = true;
					_button.mouseEnabled = false;
					_bewrite.visible = true;
					//_bewrite.text = PrivilegeConfig[i].isActive==1?'主动':'被动';
				}

			}
			for (let a = 0; a < this.privList.cells.length; a++) {
				if (obj[Number(a) + 1]) continue;
				let listChild = this.privList.cells[a];
				let _button: Laya.Button = listChild._childs[7] as Laya.Button;
				let _bewrite: Laya.Label = listChild._childs[8] as Laya.Label;
				let _useNumHtml: Laya.HTMLDivElement = _button.getChildByName("useNumHtml") as Laya.HTMLDivElement;
				let _time: Laya.Label = _button.getChildByName("time") as Laya.Label;
				let _discountBg: Laya.Image = _button.getChildByName("discountBg") as Laya.Image;
				let _discount: Laya.Label = _discountBg.getChildByName("discount") as Laya.Label;
				let _useNum = MainRoleLogic.Instance.PrivList[Number(a)].useNum.text
				let otime = DiscountManager.Instance.tPrivilegeSvot - Time.serverSecodes;
				let aaa = MainRoleLogic.Instance.PrivList[Number(a)].discount
				let bbb = DiscountManager.Instance._bStartPrivilege == false
				let vvv = otime < 0
				if (MainRoleLogic.Instance.PrivList[Number(a)].discount == -1 || DiscountManager.Instance._bStartPrivilege == false || otime < 0) {
					_time.visible = _discountBg.visible = false;
				} else {
					_time.visible = _discountBg.visible = true;
					_time.visible = false;//策划不要倒计时了。。。
					_time.text = GetFormatNumTime(otime);
					let disNum: number = MainRoleLogic.Instance.PrivList[Number(a)].discount
					_discount.text = (disNum == 0 ? 1 : disNum) + "折";
				}
				_button.label = '使用';
				_button.gray = false;
				_button.mouseEnabled = true;
				_bewrite.visible = false;
			}
		}

		/**设置panel高度,为了滑动 */
		private SetPanelHeight() {
			let bool: boolean = Boolean(ViewUILogic.Instance.halfPanel);
			if (bool) {
				this.ListPanel.height = 150 * G_StageHeightScale;
			}
			else {
				this.ListPanel.height = (940 - wxsclae) * G_StageHeightScale;
			}
		}
		//邮件红点
		private RedPoint() {
			this.redPoint.visible = MailLogic.Inst.checkShowRed;
			this.achPoint.visible = AchievenManger.Instance.showPoint();
		}

		/**签到红点 */
		private ConcealIcon() {
			this.btnHong_3.visible = !SignInLogic.Instance.ToDayAlr;
		}

		/** 角色特权位置调整 */
		private RolePrivilege(type: number) {
			if (type == 1) {
				this.eff_privilege.y = 92;
			}
			else if (type == 2) {
				this.ListPanel.vScrollBar.value = 74;
				this.eff_privilege.y = 284;
			}
			this.ShowPrivilege(true);
		}
	}
}