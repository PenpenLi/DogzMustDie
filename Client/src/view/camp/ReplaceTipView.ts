/**Created by the LayaAirIDE*/
module H52D_Framework {
	export class ReplaceTipView extends ui.camp.ReplaceTipViewUI {
		constructor(buf) {
			super();

			this.camp_Id = buf[1];
			this.Init();
		}

		private camp_Id;


		private Init() {
			let n_camp = CampManager.Instance.nCamp(this.camp_Id);
			this.camp_hot.text = n_camp[4] + "";
			this.camp_playnum.text = n_camp[2] + "/" + GangLevelUpConfig[n_camp[3]].Membership;
			this.camp_lv.text = n_camp[3] + "";
			let camp = GangConfig[this.camp_Id];
			this.camp_icon.skin = "ui_icon/" + camp.stricon;
			this.camp_name.text = GetInfoAttr.Instance.GetText(camp.nameId);
			SetHtmlStyle(this.DiamondNUm, 20, "#1f5e18", "center");
			this.DiamondNUm.innerHTML = "<img src= 'ui_icon/icon_prop_013.png' width='24px' height='24px'></img>" + GameParamConfig.GangChangeConsume;
			this.AddEvent();
		}

		private AddEvent() {
			this.look_play.on(Laya.Event.CLICK, this, this.OpenView);
			this.Btn_close.on(Laya.Event.CLICK, this, this.btnclick);
			this.Other.on(Laya.Event.CLICK, this, this.btnclick);
			this.on(Laya.Event.REMOVED, this, this.OnDestroy);
			this.btn_change.on(Laya.Event.CLICK, this, this.camp_change);
			Event.RegistEvent("ReqchangeCamp", Laya.Handler.create(this, this.camp_jion));
		}

		private btnclick() {
			UIManager.Instance.DestroyUI("ReplaceTipView", [ViewUpRoot]);
		}


		private camp_change() {
			let n_camp = CampManager.Instance.nCamp(this.camp_Id);
			if (n_camp[2] < GangLevelUpConfig[n_camp[3]].Membership) {
				if (BagManager.Instance.getItemNumber(2) >= 100) {
					CampManager.Instance.Camp_Jion(this.camp_Id);
					//打开加入阵营后的主界面
				}
				else {
					if (IsShieldRecharge()) {
						TipsLogic.Instance.OpenMessageBox("钻石不足!");
						return
					} else {
						if (IsShieldRecharge()) {
							let str = SysPromptConfig[30060].strPromptInfo;
							TipsLogic.Instance.OpenMessageBox(str, Laya.Handler.create(this, () => {
							}))
						} else {
							let str = SysPromptConfig[10014].strPromptInfo
							TipsLogic.Instance.OpenMessageBox(str,
								Laya.Handler.create(this, () => {
									let panel_id = ViewUILogic.Instance.OpenPanel
									if (panel_id != E_OpenGrade.SHOP) {
										ViewUILogic.Instance.halfPanel = false;
										Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
										ViewUILogic.Instance.OpenPanel = E_OpenGrade.SHOP;
										UIManager.Instance.DestroyUI("CampMainInfo", [ViewUpRoot]);
										UIManager.Instance.DestroyUI("ReplaceCampView", [ViewUpRoot]);
										UIManager.Instance.DestroyUI("ReplaceTipView", [ViewUpRoot]);
										OneTimer(500, () => {
											Event.DispatchEvent("toGemShop");
										});
									} else {
										UIManager.Instance.DestroyUI("CampMainInfo", [ViewUpRoot]);
										UIManager.Instance.DestroyUI("ReplaceCampView", [ViewUpRoot]);
										UIManager.Instance.DestroyUI("ReplaceTipView", [ViewUpRoot]);
									}
								}));
						}						
					}
				}
			}
			else {
				TipsLogic.Instance.OpenSystemTips(SysPromptConfig[10015].strPromptInfo);//
			}
		}

		private camp_jion() {
			TipsLogic.Instance.OpenSystemTips(SysPromptConfig[10016].strPromptInfo);
			UIManager.Instance.DestroyUI("CampMainInfo", [ViewUpRoot]);
			UIManager.Instance.DestroyUI("ReplaceCampView", [ViewUpRoot]);
			UIManager.Instance.DestroyUI("ReplaceTipView", [ViewUpRoot]);
		}

		private OpenView() {
			UIManager.Instance.CreateUI("CampMemberView", [ViewUpRoot, this.camp_Id]);
			CampManager.Instance.GetCampPlayInfo(this.camp_Id);
		}

		private OnDestroy() {
			this.offAll();
			Event.RemoveEvent("ReqchangeCamp", Laya.Handler.create(this, this.camp_jion));
		}
	}
}