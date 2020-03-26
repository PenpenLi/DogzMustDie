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
* 奖励界面;
*/
var H52D_Framework;
(function (H52D_Framework) {
    var TipsRewardView = /** @class */ (function (_super) {
        __extends(TipsRewardView, _super);
        function TipsRewardView(buf) {
            var _this = _super.call(this) || this;
            _this._showNum = 0; //显示第几个item
            _this._awardLength = 0;
            _this._time = 10;
            _this.b_first = true; //是否为初始显示(隐藏)
            _this.tipName.text = buf[1];
            _this.describe.text = buf[2];
            _this._award = buf[3];
            _this.AddEvent();
            H52D_Framework.Tick.Loop(300, _this, _this.Update);
            _this.SetReward();
            return _this;
        }
        TipsRewardView.prototype.AddEvent = function () {
            this.close.on(Laya.Event.CLICK, this, this.OnClickClose);
            this.ExitBtn.on(Laya.Event.CLICK, this, this.OnClickClose);
            // Tick.Loop(1000, this, this.UpdataTimer);
            this.ExitLab.text = "退出 " + "(" + this._time + ")";
        };
        TipsRewardView.prototype.UpdataTimer = function () {
            this.ExitLab.text = "退出 " + "(" + this._time + ")";
            this._time -= 1;
            if (this._time < 0) {
                this.OnClickClose();
            }
        };
        TipsRewardView.prototype.Update = function () {
            if (this._showNum > 8) { //this._awardLength
                this.b_first = false; //再渲染列表时不需隐藏
                H52D_Framework.Tick.Clear(this, this.Update);
                H52D_Framework.Tick.Loop(1000, this, this.UpdataTimer);
                this.boxList.mouseEnabled = true;
                return;
            }
            this.boxList["_cells"][this._showNum].visible = true;
            this._showNum++;
        };
        TipsRewardView.prototype.SetReward = function () {
            var oAward = new Array();
            var _itemId;
            var _itemInfo;
            var _bjIcon;
            var _boxProImg;
            var _boxProNum;
            var _boxProName;
            for (var i in this._award) {
                this._awardLength++;
                _itemId = this._award[i][2];
                _boxProNum = this._award[i][3];
                _itemInfo = H52D_Framework.ItemConfig[_itemId];
                _boxProImg = "ui_icon/" + _itemInfo.strIconID_B;
                _bjIcon = H52D_Framework.BaseDefine.QualityList[Number(_itemInfo.dwItemQuality)];
                _boxProName = H52D_Framework.GetInfoAttr.Instance.GetText(_itemInfo.dwItemName);
                oAward.push({
                    boxProImg: { skin: _boxProImg }, bjIcon: { skin: _bjIcon }, boxProNum: { text: _boxProNum },
                    boxProName: { color: H52D_Framework.BaseDefine.LabelColor[Number(_itemInfo.dwItemQuality)], text: _boxProName }
                });
            }
            this.boxList.array = oAward;
            this.boxList.renderHandler = new Laya.Handler(this, this.ShowContentList);
            this.boxList.mouseEnabled = false;
        };
        TipsRewardView.prototype.ShowContentList = function (item, index) {
            var boxProNum = item.getChildByName("boxProNum");
            var boxProName = item.getChildByName("boxProName");
            var boxProImg = item.getChildByName("boxProImg");
            var bjIcon = item.getChildByName("bjIcon");
            if (index < 8 && this.b_first)
                item.visible = false;
        };
        TipsRewardView.prototype.OnClickClose = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("TipsRewardView", [H52D_Framework.ViewToppestRoot]);
            H52D_Framework.Tick.ClearAll;
        };
        return TipsRewardView;
    }(ui.consumer.TipsRewardViewUI));
    H52D_Framework.TipsRewardView = TipsRewardView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=TipsRewardView.js.map