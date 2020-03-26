/**Created by the LayaAirIDE*/
module H52D_Framework {
	export class RewardItemLine extends ui.action.Ladder.RewardItemLineUI {
		constructor(buf, index) {
			super();

			this._nIdex = buf;
			this._nIdx = index;
			this.ViewInit();
		}

		private _nIdex;//一个段位的不同星星的奖励

		private _nIdx;//当前段位ID

		private ViewInit() {
			this.ViewEvent();
			this.ViewInfo();
		}

		private ViewEvent() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
		}

		private ViewInfo() {
			let ntcfg = LadderConfig[this._nIdx];
			let item_Info = RewardConfig[ntcfg.WinBaseAward].reWrad[1]
			this.start_icon.skin = BaseDefine.Start_Icon[this._nIdex];
			this.start_num.text = BaseDefine.Start_Name[this._nIdex];
			if (item_Info[1] == 1) {
				let item_tcfg = ItemConfig[item_Info[2]];
				this.item_name.text = GetInfoAttr.Instance.GetText(item_tcfg.dwItemName);
				this.item_num.text = item_Info[3];
				this.item_bg.bgColor = BaseDefine.LadderItemBgColor[item_tcfg.dwItemQuality];
				this.item_icon.skin = "ui_icon/" + item_tcfg.strIconID_B;
				this.item_name.color = BaseDefine.LabelColor[item_tcfg.dwItemQuality];
				let n = GameParamConfig.LadderStarData[3 - this._nIdex]
				if (n) {
					this.item_num.text = item_Info[3] * n[3] + "";
				}
			}
			item_Info = RewardConfig[ntcfg.WinExtraAward].reWrad[1];
			if (item_Info[1] == 1) {
				let item_tcfg = ItemConfig[item_Info[2]];
				this.item_name1.text = GetInfoAttr.Instance.GetText(item_tcfg.dwItemName);
				this.item_num1.text = item_Info[3];
				this.item_bg1.bgColor = BaseDefine.LadderItemBgColor[item_tcfg.dwItemQuality];
				this.item_icon1.skin = "ui_icon/" + item_tcfg.strIconID_B;
				this.item_name1.color = BaseDefine.LabelColor[item_tcfg.dwItemQuality];
			}
			if(this.item_num.text=="1"){
				this.item_num.text=" ";
			}
			if(this.item_num1.text=="1"){
				this.item_num1.text=" ";
			}
		}

		private Destroy() {
			this.offAll();
		}

	}
}
