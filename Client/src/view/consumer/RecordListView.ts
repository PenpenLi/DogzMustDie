/*
* 转盘奖励记录;
*/
module H52D_Framework {
    export class RecordListView extends ui.consumer.RecordListViewUI {
        private _reward: any;//抽奖记录
        constructor() {
            super();
            this._reward = EveryDayTurntable.Instance.HistoryData;
            this.Btn_close.on(Laya.Event.CLICK, this, this.OnClickClose);
            this.Init();
        }

        private Init() {
            let _array: Array<any> = new Array<any>();
            let _itemId: number;
            let _itemInfo: any;

            let _bjIcon: string;
            let _boxProImg: string;
            let _boxProNum: number;
            let _boxProName: string;
            let _describeLab: string;//描述(获得世界)

            for (let i in this._reward) {
                _itemId = this._reward[i][1];
                _boxProNum = this._reward[i][2];
                _itemInfo = ItemConfig[_itemId];
                _boxProName = GetInfoAttr.Instance.GetText(_itemInfo.dwItemName);
                _describeLab = "获得" + _boxProName + "*" + _boxProNum;//描述(获得)
                _boxProImg = "ui_icon/" + _itemInfo.strIconID_B;
                _bjIcon = BaseDefine.QualityList[Number(_itemInfo.dwItemQuality)];
                _array.push({
                    boxProImg: { skin: _boxProImg }, bjIcon: { skin: _bjIcon }, boxProNum: { text: _boxProNum == 1 ? "" : _boxProNum },
                    boxProName: { color: BaseDefine.LabelColor[Number(_itemInfo.dwItemQuality)], text: _boxProName },
                    describeLab: { text: _describeLab }
                })
            }

            this.rewardList.array = _array;
            this.rewardList.renderHandler = new Laya.Handler(this, this.ShowRewardList);
        }

        private ShowRewardList(item, index: number) {
            let boxProNum: Laya.Text = item.getChildByName("boxProNum");
            let boxProName: Laya.Text = item.getChildByName("boxProName");
            let boxProImg: Laya.Image = item.getChildByName("boxProImg");
            let bjIcon: Laya.Image = item.getChildByName("bjIcon");
        }

        private OnClickClose() {
            UIManager.Instance.DestroyUI("RecordListView", [ViewToppestRoot]);
        }
    }
}