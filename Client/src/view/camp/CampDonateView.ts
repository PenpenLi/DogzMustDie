/**Created by the LayaAirIDE*/
module H52D_Framework {
	AddViewResource(" CampDonateView",
		[
			{ url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS },
		]);
	export class CampDonateView extends ui.camp.CampDonateViewUI {

		private _time = 0;
		constructor() {
			super();

			this.AddEvent();
			this.Info();
		}

		private times;
		private AddEvent() {
			Event.RegistEvent("changetimes", Laya.Handler.create(this, this.Info))
			this.Btn_Close.on(Laya.Event.CLICK, this, this.BtnClick_close);
			this.Other.on(Laya.Event.CLICK, this, this.BtnClick_close);
			this.m_d.on(Laya.Event.CLICK, this, this.Btn_click, [1]);
			this.D_d.on(Laya.Event.CLICK, this, this.Btn_click, [2]);
			this.on(Laya.Event.REMOVED, this, this.OnDestroy);
		}

		private Info() {
			if (!MasterPlayer.Instance.player.Donatetimes[1]) {
				MasterPlayer.Instance.player.Donatetimes[1] = 0;
			}
			let m_tcfg = GangDonateConfig[1].consume;
			let d_tcfg = GangDonateConfig[2].consume;
			let a = GangDonateConfig[1].num - MasterPlayer.Instance.player.Donatetimes[1];	
			SetHtmlStyle(this.M_Times, 26, "#5f2904", "center",true);					
			this.M_Times.innerHTML = "剩余次数: " + a + "/" + GangDonateConfig[1].num;			
			if (a == 0) {				
				this.M_Times.innerHTML = "剩余次数: " + GetHtmlStrByColor(a + "", "#ff9595") + "/" + GangDonateConfig[1].num;
			}
			this.money_heat.text = "阵营热度:+" + GangDonateConfig[1].heat;
			this.M_num.text = "捐献" + m_tcfg[2] + GetInfoAttr.Instance.GetText(ItemConfig[m_tcfg[1]].dwItemName);
			this.times = a;
			this.num_d.text = d_tcfg[2];
			this.D_heat.text = "阵营热度:+" + GangDonateConfig[2].heat;
			this.D_num.text = "捐献" + d_tcfg[2] + GetInfoAttr.Instance.GetText(ItemConfig[d_tcfg[1]].dwItemName);
			this.num_m.text = m_tcfg[2];
			if (m_tcfg[2] == 1) {
				this.num_m.text = "";
			}
		}

		private BtnClick_close() {
			UIManager.Instance.DestroyUI("CampDonateView", [ViewUpRoot]);
		}

		private Btn_click(itemId: number) {
			let nowDate: Date = new Date();
			let time: number = (nowDate.getDate() * 24 * 60 + nowDate.getHours() * 60 + nowDate.getMinutes()) * 60 + nowDate.getSeconds();
			if (this._time == 0 || time - this._time > 0.5) {
				this._time = time;
				let iteminfo = GangDonateConfig[itemId].consume;
				let play_itemnum = BagManager.Instance.getItemNumber(iteminfo[1]);
				let itenname = GetInfoAttr.Instance.GetText(ItemConfig[iteminfo[1]].dwItemName)
				let str = Format(SysPromptConfig[30027].strPromptInfo, itenname)
				if (play_itemnum < iteminfo[2]) {
					if (itemId == 2) {
						if (IsShieldRecharge()) {
							TipsLogic.Instance.OpenMessageBox("钻石不足!");
							return;
						} else {
							let str = SysPromptConfig[10009].strPromptInfo
							TipsLogic.Instance.OpenMessageBox(str,
								Laya.Handler.create(this, () => {
									ViewUILogic.Instance.halfPanel = false;
									Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
									UIManager.Instance.DestroyUI("CampMainInfo", [ViewUpRoot]);
									UIManager.Instance.DestroyUI("CampDonateView", [ViewUpRoot]);
								}));
						}
					}
					TipsLogic.Instance.OpenSystemTips(str);
					return;
				}
				if (itemId == 1) {
					if (this.times < 1) {
						TipsLogic.Instance.OpenSystemTips("捐献次数不足！");
						return;
					}
				}
				CampManager.Instance.Donate_times(itemId);
			}
			else {
				TipsLogic.Instance.OpenSystemTips("0.5秒内只能赠送一次");
			}
		}

		private OnDestroy() {
			Event.RemoveEvent("changetimes", Laya.Handler.create(this, this.Info))
		}
	}
}