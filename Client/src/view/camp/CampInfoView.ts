/**Created by the LayaAirIDE*/
module H52D_Framework {
	AddViewResource("CampInfoView",
		[
			{ url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
		]);
	export class CampInfoView extends ui.camp.CampInfoViewUI {
		
		private camp_ID:number;
		private bool:boolean;
		constructor(buf) {
			super();
			
			this.camp_ID=buf[1];
			this.bool=buf[2];
			this.Info();
			this.AddEvent();
		}

		private AddEvent() {
			this.camp_Btn_join.visible=false;
			this.Look_member.on(Laya.Event.CLICK, this, this.Btn_look);
			this.camp_Btn_join.on(Laya.Event.CLICK, this, this.Btn_Add);
			this.Btn_close.on(Laya.Event.CLICK, this, this.Btn_Clickclose);
			this.Other.on(Laya.Event.CLICK, this, this.Btn_Clickclose);
			this.on(Laya.Event.REMOVED,this,this.Destory);
		}

		private Info() {
			let camplist = CampManager.Instance.CampList;
			let nIdx = this.camp_ID;
			let campinfo = CampManager.Instance.nCamp(nIdx);
			let camp = GangConfig[nIdx];		
			this.Camp_icon.skin = "ui_icon/" + camp.stricon;
			this.Camp_name.text = GetInfoAttr.Instance.GetText(camp.nameId);
			this.Camp_Level.text = campinfo[3]+"/"+CampManager.Instance.Camp_LvMax();
			this.Camp_MemberNum.text = campinfo[2] + "/" + GangLevelUpConfig[campinfo[3]].Membership;//阵营人数
			//阵营代码
			if (nIdx == MasterPlayer.Instance.player.CampID) {
				this.camp_Btn_join.visible = false;
			}
			if (MasterPlayer.Instance.player.CampID == 0) {
				this.camp_Btn_join.label = "加入阵营";
			}
			else {
				this.camp_Btn_join.label = "更换阵营";
			}
			//this.Camp_Level.text=(campinfo.CampLevel).toString();
		}

		/** 查看成员按钮事件 */
		private Btn_look() {
			UIManager.Instance.CreateUI("CampMemberView", [ViewUpRoot,this.camp_ID]);
			CampManager.Instance.GetCampPlayInfo(this.camp_ID);
		}

		/**加入阵营   更换阵营 */
		private Btn_Add() {
			let camp_id = MasterPlayer.Instance.player.CampID;
			let iten_num=BagManager.Instance.getItemNumber(2);
			if(camp_id==this.camp_ID){
				this.camp_Btn_join.label = "已加入";
				this.camp_Btn_join.mouseEnabled=false;
			}
			if (camp_id == 0) {
				this.camp_Btn_join.label = "加入阵营";
				CampManager.Instance.Camp_Jion(this.camp_ID);
			}
			else {
				this.camp_Btn_join.label = "更换阵营";
				let n_camp = CampManager.Instance.nCamp(camp_id);
				let campMaxNum=n_camp[3]*GangLevelUpConfig.hip;
				if (campMaxNum > n_camp[2]) {
					if ("身上的钱满足") {
						CampManager.Instance.Camp_Jion(this.camp_ID);
					}
					else {
						TipsLogic.Instance.OpenSystemTips("钻石不足")
					}
				}
				else {
					//弹出人数上限 换个阵营					
					TipsLogic.Instance.OpenSystemTips(SysPromptConfig[10015].strPromptInfo);
				}
			}
		}

		/**关闭面板 */
		private Btn_Clickclose() {
			UIManager.Instance.DestroyUI("CampInfoView", [ViewUpRoot]);
		}

		private Destory() {
			this.offAll();			
		}
	}
}