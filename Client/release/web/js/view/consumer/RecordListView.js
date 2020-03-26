var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
* 转盘奖励记录;
*/
var H52D_Framework;
(function (H52D_Framework) {
    var RecordListView = /** @class */ (function (_super) {
        __extends(RecordListView, _super);
        function RecordListView() {
            var _this = _super.call(this) || this;
            _this._reward = H52D_Framework.EveryDayTurntable.Instance.HistoryData;
            _this.Btn_close.on(Laya.Event.CLICK, _this, _this.OnClickClose);
            _this.Init();
            return _this;
        }
        RecordListView.prototype.Init = function () {
            var _array = new Array();
            var _itemId;
            var _itemInfo;
            var _bjIcon;
            var _boxProImg;
            var _boxProNum;
            var _boxProName;
            var _describeLab; //描述(获得世界)
            for (var i in this._reward) {
                _itemId = this._reward[i][1];
                _boxProNum = this._reward[i][2];
                _itemInfo = H52D_Framework.ItemConfig[_itemId];
                _boxProName = H52D_Framework.GetInfoAttr.Instance.GetText(_itemInfo.dwItemName);
                _describeLab = "获得" + _boxProName + "*" + _boxProNum; //描述(获得)
                _boxProImg = "ui_icon/" + _itemInfo.strIconID_B;
                _bjIcon = H52D_Framework.BaseDefine.QualityList[Number(_itemInfo.dwItemQuality)];
                _array.push({
                    boxProImg: { skin: _boxProImg }, bjIcon: { skin: _bjIcon }, boxProNum: { text: _boxProNum == 1 ? "" : _boxProNum },
                    boxProName: { color: H52D_Framework.BaseDefine.LabelColor[Number(_itemInfo.dwItemQuality)], text: _boxProName },
                    describeLab: { text: _describeLab }
                });
            }
            this.rewardList.array = _array;
            this.rewardList.renderHandler = new Laya.Handler(this, this.ShowRewardList);
        };
        RecordListView.prototype.ShowRewardList = function (item, index) {
            var boxProNum = item.getChildByName("boxProNum");
            var boxProName = item.getChildByName("boxProName");
            var boxProImg = item.getChildByName("boxProImg");
            var bjIcon = item.getChildByName("bjIcon");
        };
        RecordListView.prototype.OnClickClose = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("RecordListView", [H52D_Framework.ViewToppestRoot]);
        };
        return RecordListView;
    }(ui.consumer.RecordListViewUI));
    H52D_Framework.RecordListView = RecordListView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=RecordListView.js.map