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
/**Created by the LayaAirIDE*/
var H52D_Framework;
(function (H52D_Framework) {
    var LadderLvRewardLineView = /** @class */ (function (_super) {
        __extends(LadderLvRewardLineView, _super);
        function LadderLvRewardLineView(buf, index) {
            var _this = _super.call(this) || this;
            _this._openItemFlag = true;
            _this._line_num = [];
            _this._ladderRewardView = buf;
            _this._nIdx = index;
            _this.ViewInit();
            return _this;
        }
        LadderLvRewardLineView.prototype.ViewInit = function () {
            this.ViewEvent();
            this.ViewInfo();
        };
        LadderLvRewardLineView.prototype.SetItemFlag = function () {
            this._openItemFlag = true;
        };
        LadderLvRewardLineView.prototype.ViewInfo = function () {
            this._line_num = H52D_Framework.LadderManager.Instance.getLadderLv();
            H52D_Framework.LadderManager.Instance.Sort_ladderlist(this._line_num, H52D_Framework.LadderManager.Instance.PlayId);
            this._line_num = H52D_Framework.LadderManager.Instance.Ladderreward_arr;
            H52D_Framework.SetHtmlStyle(this.name_Id, 22, "#e4eafe", "left");
            this._nIndex = this._line_num[this._nIdx];
            this.name_Id.innerHTML = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.LadderConfig[this._nIndex].DuanName);
        };
        LadderLvRewardLineView.prototype.ViewEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.Duan_name.on(Laya.Event.CLICK, this, this.Ladderline_list);
        };
        LadderLvRewardLineView.prototype.Ladderline_list = function () {
            var nheight = 0;
            for (var index = this._ladderRewardView.panel.content._childs.length - 1; index > this._line_num.length - 1; index--) {
                var itemline_1 = this._ladderRewardView.panel.content._childs[index];
                itemline_1.Destroy();
                this._ladderRewardView.panel.removeChildAt(index);
            }
            for (var index = 0; index < this._line_num.length; index++) {
                var itemline_2 = this._ladderRewardView.panel.getChildAt(index);
                itemline_2.y = itemline_2.height * index + 20;
                itemline_2.x = 0;
                var bg_1 = itemline_2.getChildByName("Duan_name");
                var ladder_names = bg_1.getChildByName("name_Id");
                var ladder_btn_1 = bg_1.getChildByName("btn_downup");
                H52D_Framework.SetHtmlStyle(ladder_names, 22, "#e4eafe", "left");
                ladder_names.innerHTML = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.LadderConfig[this._line_num[index]].DuanName);
                ladder_btn_1.skin = "ui_ladder/btn_xialai.png";
                ladder_btn_1.rotation = 180;
            }
            if (!this._openItemFlag) {
                this._openItemFlag = true;
                return;
            }
            else {
                this._openItemFlag = false;
                for (var index = 0; index < this._line_num.length; index++) {
                    if (index != this._nIdx) {
                        var panel = this.parent;
                        if (panel && panel._childs[index]) {
                            panel._childs[index].SetItemFlag(true);
                        }
                    }
                }
            }
            for (var Indx = 0; Indx <= 3; Indx++) {
                var item_line = new H52D_Framework.RewardItemLine(Indx, this._nIndex);
                this._ladderRewardView.panel.addChild(item_line);
                var nLenth = this.height * (this._nIdx + 1) + 3;
                item_line.y = item_line.height * Indx + nLenth;
                item_line.x = 0;
                nheight = item_line.y + 30;
            }
            for (var Indx = this._nIdx + 1; Indx < this._line_num.length; Indx++) {
                var item = this._ladderRewardView.panel.getChildAt(Indx);
                item.y = nheight + (Indx - this._nIdx + 1) * item.height + 5;
            }
            var itemline = this._ladderRewardView.panel.getChildAt(this._nIdx);
            var bg = itemline.getChildByName("Duan_name");
            var ladder_name = bg.getChildByName("names");
            var ladder_btn = bg.getChildByName("btn_downup");
            ladder_btn.rotation = 0;
        };
        LadderLvRewardLineView.prototype.Destroy = function () {
            this.offAll();
        };
        return LadderLvRewardLineView;
    }(ui.action.Ladder.LadderLvRewardLineViewUI));
    H52D_Framework.LadderLvRewardLineView = LadderLvRewardLineView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=LadderLvRewardLineView.js.map