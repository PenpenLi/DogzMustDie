/**Created by the LayaAirIDE*/
module H52D_Framework {

	AddViewResource("ReplaceCampView",
		[
			{ url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
		]);

	/**更换阵营界面 */
	export class ReplaceCampView extends ui.camp.ReplaceCampViewUI {
		constructor() {
			super();

			CampManager.Instance.camp_Info = [];
			CampManager.Instance.Camp_sort();
			this._camplist = [];
			for (let key in CampManager.Instance.CampList) {
				let Indx = Number(key);
				this._camplist.push(Indx);
			}
			this.AddEvent();
			this.UpdaList();
		}

		private _camplist: Array<number> = [];
		private AddEvent() {
			Event.RegistEvent('C_ReqGuildList', Laya.Handler.create(this, this.UpdaList));
			this.Btn_Close.on(Laya.Event.CLICK, this, this.Btn_CloseClick);
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.Other.on(Laya.Event.CLICK, this, this.Btn_CloseClick);
		}

		private UpdaList() {
			CampManager.Instance.SortCamp(CampManager.Instance.camp_Info);
			this.Camp_List.array = this._camplist;
			this.Camp_List.vScrollBarSkin = "";
			//this.Camp_List.repeatY=this._camplist.length;
			this.Camp_List.renderHandler = new Laya.Handler(this, this.Render);
		}

		private Render(item, index) {
			let Idx = CampManager.Instance.camp_Info[index][1];
			let campInfo = CampManager.Instance.CampList[Idx];
			let campname: Laya.Label = item.getChildByName("Camp_Name");
			let camp_playnum: Laya.HTMLDivElement = item.getChildByName("Camp_play_num");
			let img: Laya.Image = item.getChildByName("Rank_Num");
			let _text: Laya.Text = item.getChildByName("rankNum");	//Btn_Change
			let btn_change: Laya.Button = item.getChildByName("Btn_Change");
			campname.text = GetInfoAttr.Instance.GetText(GangConfig[campInfo[1]].nameId);
			SetHtmlStyle(camp_playnum, 22, "#feff79", "center");
			let n_campplaynum = GangLevelUpConfig[campInfo[3]].Membership;
			camp_playnum.innerHTML = campInfo[2] + GetHtmlStrByColor("/" + n_campplaynum, "#fefeff");
			let Indx = index + 1;
			if (Indx <= 3) {
				img.visible = true;
				img.skin = "ui_rank/img-" + Indx + "-paiming.png";
				_text.visible = false;
			}
			else {
				_text.visible = true;
				img.visible = false;
				_text.text = Indx + "";
			}
			btn_change.label = "更换";
			btn_change.gray = false;
			btn_change.mouseEnabled = true;
			if (Idx == MasterPlayer.Instance.player.CampID) {
				btn_change.label = "已加入";
				btn_change.gray = true;
				btn_change.mouseEnabled = false;
				this.camp_Name.text = campname.text;
				this.rankNum.text = Indx + "";
				SetHtmlStyle(this.camp_num, 22, "#feff79", "center");
				this.camp_num.innerHTML = campInfo[2] + GetHtmlStrByColor("/" + n_campplaynum, "#fefeff");
			}
			btn_change.on(Laya.Event.CLICK, this, this.OpenView, [Idx]);
		}

		private OpenView(id: number) {
			UIManager.Instance.CreateUI("ReplaceTipView", [ViewUpRoot, id]);
		}

		private Btn_CloseClick() {
			UIManager.Instance.DestroyUI("ReplaceCampView", [ViewUpRoot]);
			CampManager.Instance.camp_Info = [];
		}

		private Destroy() {
			this.offAll();
		}
	}
}