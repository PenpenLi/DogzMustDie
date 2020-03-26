/*
* 奖励界面;
*/
module H52D_Framework {
    export class TipsRewardView extends ui.consumer.TipsRewardViewUI {
        private _award: any;//奖励列表
        private _showNum: number = 0;//显示第几个item
        private _awardLength: number = 0;
        private _time: number = 10;
        private b_first: boolean = true;//是否为初始显示(隐藏)
        constructor(buf: any) {
            super();
            this.tipName.text = buf[1];
            this.describe.text = buf[2];
            this._award = buf[3];

            this.AddEvent();
            Tick.Loop(300, this, this.Update);
            this.SetReward();
        }

        private AddEvent() {
            this.close.on(Laya.Event.CLICK, this, this.OnClickClose);
            this.ExitBtn.on(Laya.Event.CLICK, this, this.OnClickClose);
            // Tick.Loop(1000, this, this.UpdataTimer);
            this.ExitLab.text = "退出 " + "(" + this._time + ")";
        }

        private UpdataTimer() {
            this.ExitLab.text = "退出 " + "(" + this._time + ")";
            this._time -= 1;
            if (this._time < 0) {
                this.OnClickClose();
            }
        }

        private Update() {
            if (this._showNum > 8) {//this._awardLength
                this.b_first = false;//再渲染列表时不需隐藏
                Tick.Clear(this, this.Update);
                Tick.Loop(1000, this, this.UpdataTimer);
                this.boxList.mouseEnabled = true;
                return;
            }
            this.boxList["_cells"][this._showNum].visible = true;
            this._showNum++;
        }

        private SetReward() {
            let oAward: Array<any> = new Array<any>();
            let _itemId: number;
            let _itemInfo: any;
            let _bjIcon: string;
            let _boxProImg: string;
            let _boxProNum: number;
            let _boxProName: string;
            for (let i in this._award) {
                this._awardLength++;
                _itemId = this._award[i][2];
                _boxProNum = this._award[i][3];
                _itemInfo = ItemConfig[_itemId];
                _boxProImg = "ui_icon/" + _itemInfo.strIconID_B;
                _bjIcon = BaseDefine.QualityList[Number(_itemInfo.dwItemQuality)];
                _boxProName = GetInfoAttr.Instance.GetText(_itemInfo.dwItemName);
                oAward.push({
                    boxProImg: { skin: _boxProImg }, bjIcon: { skin: _bjIcon }, boxProNum: { text: _boxProNum },
                    boxProName: { color: BaseDefine.LabelColor[Number(_itemInfo.dwItemQuality)], text: _boxProName }
                })
            }

            this.boxList.array = oAward;
            this.boxList.renderHandler = new Laya.Handler(this, this.ShowContentList);
            this.boxList.mouseEnabled = false;
        }

        private ShowContentList(item: Laya.Box, index: number) {
            let boxProNum: Laya.Label = item.getChildByName("boxProNum") as Laya.Label;
            let boxProName: Laya.Label = item.getChildByName("boxProName") as Laya.Label;
            let boxProImg: Laya.Image = item.getChildByName("boxProImg") as Laya.Image;
            let bjIcon: Laya.Image = item.getChildByName("bjIcon") as Laya.Image;

            if (index < 8 && this.b_first)
                item.visible = false;
        }

        private OnClickClose() {
            UIManager.Instance.DestroyUI("TipsRewardView", [ViewToppestRoot]);
            Tick.ClearAll;
        }
    }
}