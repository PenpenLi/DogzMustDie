/**Created by the LayaAirIDE*/
module H52D_Framework {
	export class LadderLvUpView extends ui.action.Ladder.LadderLvUpViewUI {
		private _tatilnum: number = 0;
		private _saynum: number = 0;
		private _newladderlv: number = 0;// 玩家天梯分数

		private _rew:number=0;
		constructor(buf) {
			super();

			this._tatilnum = buf[1];
			this._saynum = buf[2];
			this._newladderlv = buf[3];
			this._rew=buf[4];
			this.ViewInit();
		}

		private ViewInit() {
			this.ViewEvent();
			this.ViewInfo();
		}

		private ViewEvent() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.btn_close.on(Laya.Event.CLICK, this, this.btnclick_close);
			this.Btn_share.on(Laya.Event.CLICK, this, this.btnclick_share);
		}

		private ViewInfo() {
			this.tx_tatil.text = GetInfoAttr.Instance.GetText(this._tatilnum);
			this.say.text = GetInfoAttr.Instance.GetText(this._saynum);

			let new_ladderlv = LadderManager.Instance.GetDuanInfo(this._newladderlv);
			let old_ladderlv = LadderManager.Instance.GetDuanInfo(LadderManager.Instance.Last_Ladderlv);

			let ntcfg_ladder = LadderConfig[new_ladderlv];
			let otcfg_ladder = LadderConfig[old_ladderlv];

			this.new_duan_name.text=GetInfoAttr.Instance.GetText(ntcfg_ladder.DuanName);
			this.old_duan_name.text=GetInfoAttr.Instance.GetText(otcfg_ladder.DuanName);

			this.new_duan_icon.skin = "ui_icon/" + ntcfg_ladder.DuanIcon;
			this.old_duan_icon.skin = "ui_icon/" + otcfg_ladder.DuanIcon;
			
			this.SetRankLV(ntcfg_ladder.DuanIconBs, "old");
			this.SetRankLV(otcfg_ladder.DuanIconBs, "new");

			this.rew.text="积分+"+this._rew;
		}

		private btnclick_close() {
			UIManager.Instance.DestroyUI("LadderLvUpView", [ViewUpRoot]);
		}

		private btnclick_share() {
			CallShare(ShareType.ladder_lvup);
			this.btnclick_close();
		}

		public SetRankLV(lv: number, name: string) {
			let maxlv=LadderManager.Instance.LadderLvMax();
			if(maxlv<=lv){
				this[name + "_lv_2"]=this[name + "_lv_1"].visible = this[name + "_lv_3"].visible = false;
				return				
			}
			let str: string;
			switch (lv) {
				case 1:
					str = "ui_icon/icon_duanwei_shuzi_yi.png";
					this[name + "_lv_2"].skin = str;
					this[name + "_lv_1"].visible = this[name + "_lv_3"].visible = false;
					break;
				case 2:
					str = "ui_icon/icon_duanwei_shuzi_yi.png"
					this[name + "_lv_1"].skin = this[name + "_lv_3"].skin = str;
					this[name + "_lv_2"].visible = false;
					break;
				case 3:
					str = "ui_icon/icon_duanwei_shuzi_yi.png";
					this[name + "_lv_1"].skin = this[name + "_lv_3"].skin = this[name + "_lv_2"].skin = str;
					break;
				case 4:
					str = "ui_icon/icon_duanwei_shuzi_yi.png"
					this[name + "_lv_1"].skin = str;
					this[name + "_lv_3"].skin = "ui_icon/icon_duanwei_shuzi_si.png";
					this[name + "_lv_2"].visible = false;
					break;
				case 5:
					str = "ui_icon/icon_duanwei_shuzi_si.png";
					this[name + "_lv_2"].skin = str;
					this[name + "_lv_1"].visible = this[name + "_lv_3"].visible = false;
					break;
			}
		}

		private Destroy() {
			this.offAll();
		}
	}
}