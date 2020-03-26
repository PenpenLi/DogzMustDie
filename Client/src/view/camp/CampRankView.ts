/**Created by the LayaAirIDE*/
module H52D_Framework {

	AddViewResource("CampRankView",
		[
			{ url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
		]);
	export class CampRankView extends ui.camp.CampRankViewUI {
		constructor() {
			super();

			this.Init();
		}
		private Init() {
			CampManager.Instance.camp_Info = [];
			CampManager.Instance.Camp_sort();
			this.Addevent();
			this.Updatelist();
		}
		private Addevent() {
			this.btn_close.on(Laya.Event.CLICK, this, this.btn_click);
			this.Other.on(Laya.Event.CLICK, this, this.btn_click);
			this.on(Laya.Event.REMOVED, this, this.Destroy);
		}

		private Updatelist() {
			this.camp_list.vScrollBarSkin = "";
			CampManager.Instance.SortCamp(CampManager.Instance.camp_Info);
			this.camp_list.array = CampManager.Instance.camp_Info;
			//this.camp_list.repeatY = CampManager.Instance.CampId.length;
			this.camp_list.renderHandler = new Laya.Handler(this, this.Camp_handler);
		}

		private Camp_handler(item, index) {
			let Idx = CampManager.Instance.camp_Info[index][1];
			let n_camp = CampManager.Instance.nCamp(Idx);
			let n_tcfg = GangConfig[Idx];
			let rank_bg: Laya.Image = item.getChildByName("Rank_Num");
			let camp_name: Laya.Label = item.getChildByName("Camp_Name");//rankNum
			let camp_lv: Laya.Label = item.getChildByName("camp_lv");
			let rank: Laya.Text = item.getChildByName("rankNum");
			let camp_playnum: Laya.HTMLDivElement = item.getChildByName("Camp_play_num");
			camp_name.text = GetInfoAttr.Instance.GetText(n_tcfg.nameId);
			camp_lv.text = n_camp[3] + "";
			SetHtmlStyle(camp_playnum, 20, "#feff79", "center");
			let Indx = index + 1;
			if (Indx <= 3) {
				rank_bg.visible = true;
				rank_bg.skin = "ui_rank/img-" + Indx + "-paiming.png";
				rank.visible = false;
			}
			else {
				rank.visible=true;
				rank_bg.visible = false;
				rank.text = Indx + "";
			}
			camp_playnum.innerHTML = n_camp[2] + GetHtmlStrByColor("/" + GangLevelUpConfig[n_camp[3]].Membership, "#fefeff");
			if (MasterPlayer.Instance.player.CampID == Idx) {//设置自己阵营的信息
				this.my_campname.text = camp_name.text;
				SetHtmlStyle(this.camp_num, 20, "#feff79", "center")
				this.camp_num.innerHTML = n_camp[2] + GetHtmlStrByColor("/" + GangLevelUpConfig[n_camp[3]].Membership, "#fefeff");;
				this.camp_rank.text = Indx + "";
				this.camp_lv.text = n_camp[3];
			}
			item.on(Laya.Event.CLICK, this, this.Openview, [Idx]);
		}

		private Openview(id) {
			UIManager.Instance.CreateUI("CampInfoView", [ViewUpRoot, id, false]);
		}

		private btn_click() {
			UIManager.Instance.DestroyUI("CampRankView", [ViewUpRoot]);
			CampManager.Instance.camp_Info = [];
		}

		private Destroy() {
			this.offAll();
		}
	}
}