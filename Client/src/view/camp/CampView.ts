/**Created by the LayaAirIDE*/
module H52D_Framework {
	AddViewResource("CampView",
		[
			{ url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
		]);

	/**阵营界面 */
	export class CampView extends ui.camp.CampViewUI {
		private nsys_cfg;
		constructor() {
			super();
			if (window["wx"]) {
				this.lclbg.bottom = 0
			} else {
				this.lclbg.centerY = 0
			}
			CampManager.Instance.Camp_sort();			
			this.arrow_up.visible = false;
			this.GetCampList();
			this.nsys_cfg = SysPromptConfig;
			
			this.AddEvent();			
		}
		private _campId: Array<number> = [];	
		private _campname: string;
		private _addBtn: Laya.Button;
		private AddEvent() {
			this.Btn_Close.on(Laya.Event.CLICK, this, this.Btnclick);
			this.arrow_up.on(Laya.Event.CLICK, this, this.Move_List, [-10]);
			this.arrow_down.on(Laya.Event.CLICK, this, this.Move_List, [10]);
			this.Refresh();
			Event.RegistEvent('C_ReqAddCamp', Laya.Handler.create(this, this.JoinCamp));
			Event.RegistEvent('C_ReqGuildList', Laya.Handler.create(this, this.GetCamp));
			this.on(Laya.Event.REMOVED,this,this.Destory);			
		}

		private Destory() {
			this.offAll();
			Event.RemoveEvent('C_ReqAddCamp', Laya.Handler.create(this, this.JoinCamp));
			Event.RemoveEvent('C_ReqGuildList', Laya.Handler.create(this, this.GetCamp));
		}

		private UpdateList() {
			CampManager.Instance.SortCamp(CampManager.Instance.camp_Info);
			this.Camp_List.vScrollBarSkin = "";
			this._campId = CampManager.Instance.CampId;
			this.Camp_List.array = CampManager.Instance.camp_Info;
			//this.Camp_List.repeatY = this.Camp_List.length;
			this.Camp_List.renderHandler = new Laya.Handler(this, this.CampHander)
		}
		private CampHander(item, index: number) {
			let ncampID = CampManager.Instance.camp_Info[index][1];
			let campinfo_cfg = GangConfig[ncampID];
			let camplist = CampManager.Instance.CampList;
			let camp_info = camplist[ncampID];
			let member_Num = GangLevelUpConfig[camp_info[3]].Membership;
			let paly_campId = MasterPlayer.Instance.player.CampID
			let campname: Laya.Label = item.getChildByName("Camp_Name");
			let Btn_join: Laya.Button = item.getChildByName("Btn_join");
			let camp_Info: Laya.Button = item.getChildByName("Camp_Info");
			let camp_Icon: Laya.Button = item.getChildByName("Camp_Icon");
			let camp_playernum: Laya.HTMLDivElement = item.getChildByName("Camp_PalyNum");
			SetHtmlStyle(camp_playernum, 24, "#f4ff79", "left");
			camp_playernum.innerHTML = camp_info[2] + GetHtmlStrByColor("/" + member_Num, "#fefeff");
			campname.text = GetInfoAttr.Instance.GetText(campinfo_cfg.nameId);
			camp_Icon.skin = "ui_icon/" + campinfo_cfg.stricon;
			Btn_join.on(Laya.Event.CLICK, this, this.AddCamp, [ncampID, Btn_join]);
			if (paly_campId == ncampID) {
				Btn_join.label = "已加入";
				Btn_join.mouseEnabled = false;
				Btn_join.skin = "ui_camp/btn-jiaruhui-tongyong-n.png";
			}
			let value = this.Camp_List.scrollBar.value;
			camp_Info.on(Laya.Event.CLICK, this, this.Btn_Info, [ncampID]);
		}

		private Move_List(dis: number) {
			this.Camp_List.scrollBar.value += dis * 8.8;
			//this.Refresh(this.camp_list.scrollBar.value);			
		}

		private Refresh() {
			Tick.FrameLoop(1, this, () => {
				if (this.Camp_List && this.Camp_List.scrollBar) {
					this.Camp_List.scrollBar.changeHandler = Laya.Handler.create(this, (value) => {
						if (value < 10) {
							this.arrow_up.visible = false;
						}
						else {
							this.arrow_up.visible = true;
						}
						if (value > 1700) {
							this.arrow_down.visible = false;
						}
						else {
							this.arrow_down.visible = true;
						}
					});
				}
			})
		}
		private Btnclick() {
			UIManager.Instance.DestroyUI("CampView", [ViewUpRoot]);
			CampManager.Instance.CampList=[];
			CampManager.Instance.BShowFlag = false;
			CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.camp, true);
		}

		/**阵营加入成功 */
		private JoinCamp() {
			let ID = MasterPlayer.Instance.player.CampID;
			this._addBtn.skin = "ui_camp/btn-jiaruhui-tongyong-n.png";
			let tex = this.nsys_cfg[10016].strPromptInfo;//提示id  加入成功
			TipsLogic.Instance.OpenSystemTips(tex + GetInfoAttr.Instance.GetText(GangConfig[ID].nameId));
			UIManager.Instance.DestroyUI("CampView", [ViewUpRoot]);
			//UIManager.Instance.CreateUI("CampMainInfo", [ViewUpRoot]);
			//增加阵营大船的伤害
			this.UpdateList();
		}

		/**获取阵营列表信息 */
		private GetCamp() {
			this.UpdateList();
		}

		private AddCamp(id: number, btn: Laya.Button) {
			this._addBtn = btn;
			let camp = CampManager.Instance.nCamp(id);
			let Maxnum = GangLevelUpConfig[camp[3]].Membership;
			let tex = this.nsys_cfg[10015].strPromptInfo;// 人数已满的提示id
			if (camp[2] == Maxnum) {
				//TipsLogic.Instance.OpenSystemTips("该阵营成员已达上限，换一个阵营加入吧！");
				TipsLogic.Instance.OpenSystemTips(tex);
				return
			}
			CampManager.Instance.Camp_Jion(id);
		}

		private GetCampList() {
			CampManager.Instance.GetCamp_List();
		}

		private Btn_Info(id: number) {
			UIManager.Instance.CreateUI("CampInfoView", [ViewUpRoot, id, true]);
		}
	}
}