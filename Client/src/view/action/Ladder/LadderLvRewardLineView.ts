/**Created by the LayaAirIDE*/
module H52D_Framework {
	export class LadderLvRewardLineView extends ui.action.Ladder.LadderLvRewardLineViewUI {
		constructor(buf, index) {
			super();

			this._ladderRewardView = buf;
			this._nIdx = index;
			this.ViewInit();
			
			
		}


		private _nIdx: number;
		private _ladderRewardView: LadderReward;
		private _nIndex: number;

		private _openItemFlag: boolean = true;

		private _line_num: Array<number> = [];
		private ViewInit() {
			this.ViewEvent();
			this.ViewInfo();			
		}

		private SetItemFlag() {
			this._openItemFlag = true;
		}

		private ViewInfo() {

			this._line_num = LadderManager.Instance.getLadderLv();
			LadderManager.Instance.Sort_ladderlist(this._line_num, LadderManager.Instance.PlayId);
			this._line_num = LadderManager.Instance.Ladderreward_arr;
			SetHtmlStyle(this.name_Id, 22, "#e4eafe", "left");
			this._nIndex = this._line_num[this._nIdx];
			this.name_Id.innerHTML = GetInfoAttr.Instance.GetText(LadderConfig[this._nIndex].DuanName);
		}

		private ViewEvent() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.Duan_name.on(Laya.Event.CLICK, this, this.Ladderline_list);
		}

		public Ladderline_list() {
			let nheight = 0;
			for (let index = this._ladderRewardView.panel.content._childs.length - 1; index > this._line_num.length - 1; index--) {
				let itemline = this._ladderRewardView.panel.content._childs[index];
				itemline.Destroy();
				this._ladderRewardView.panel.removeChildAt(index);
			}
			for (let index = 0; index < this._line_num.length; index++) {
				let itemline: LadderLvRewardLineView = this._ladderRewardView.panel.getChildAt(index) as LadderLvRewardLineView;
				itemline.y = itemline.height * index + 20;
				itemline.x = 0;
				let bg: Laya.Image = itemline.getChildByName("Duan_name") as Laya.Image;
				let ladder_names: Laya.HTMLDivElement = bg.getChildByName("name_Id") as Laya.HTMLDivElement;
				let ladder_btn: Laya.Button = bg.getChildByName("btn_downup") as Laya.Button
				SetHtmlStyle(ladder_names, 22, "#e4eafe", "left");
				ladder_names.innerHTML = GetInfoAttr.Instance.GetText(LadderConfig[this._line_num[index]].DuanName);
				ladder_btn.skin = "ui_ladder/btn_xialai.png";
				ladder_btn.rotation = 180;
			}			
			if (!this._openItemFlag) {
				this._openItemFlag = true;
				return
			} else {
				this._openItemFlag = false;
				for (let index = 0; index < this._line_num.length; index++) {
					if (index != this._nIdx) {
						let panel = this.parent;
						if (panel && panel._childs[index]) {
							panel._childs[index].SetItemFlag(true);
						}
					}
				}
			}
			for (let Indx = 0; Indx <= 3; Indx++) {
				let item_line: RewardItemLine = new RewardItemLine(Indx, this._nIndex);
				this._ladderRewardView.panel.addChild(item_line);
				let nLenth = this.height * (this._nIdx + 1) + 3;
				item_line.y = item_line.height * Indx + nLenth;
				item_line.x = 0;
				nheight = item_line.y + 30;
			}
			for (let Indx = this._nIdx + 1; Indx < this._line_num.length; Indx++) {
				let item: Laya.Image = this._ladderRewardView.panel.getChildAt(Indx) as Laya.Image
				item.y = nheight + (Indx - this._nIdx + 1) * item.height + 5;
			}
			let itemline: Laya.Image = this._ladderRewardView.panel.getChildAt(this._nIdx) as Laya.Image
			let bg: Laya.Image = itemline.getChildByName("Duan_name") as Laya.Image;
			let ladder_name: Laya.HTMLDivElement = bg.getChildByName("names") as Laya.HTMLDivElement;
			let ladder_btn: Laya.Button = bg.getChildByName("btn_downup") as Laya.Button
			ladder_btn.rotation = 0;
		}		

		private Destroy() {
			this.offAll();
		}
	}
}