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
    var RewardItemLine = /** @class */ (function (_super) {
        __extends(RewardItemLine, _super);
        function RewardItemLine(buf, index) {
            var _this = _super.call(this) || this;
            _this._nIdex = buf;
            _this._nIdx = index;
            _this.ViewInit();
            return _this;
        }
        RewardItemLine.prototype.ViewInit = function () {
            this.ViewEvent();
            this.ViewInfo();
        };
        RewardItemLine.prototype.ViewEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
        };
        RewardItemLine.prototype.ViewInfo = function () {
            var ntcfg = H52D_Framework.LadderConfig[this._nIdx];
            var item_Info = H52D_Framework.RewardConfig[ntcfg.WinBaseAward].reWrad[1];
            this.start_icon.skin = H52D_Framework.BaseDefine.Start_Icon[this._nIdex];
            this.start_num.text = H52D_Framework.BaseDefine.Start_Name[this._nIdex];
            if (item_Info[1] == 1) {
                var item_tcfg = H52D_Framework.ItemConfig[item_Info[2]];
                this.item_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(item_tcfg.dwItemName);
                this.item_num.text = item_Info[3];
                this.item_bg.bgColor = H52D_Framework.BaseDefine.LadderItemBgColor[item_tcfg.dwItemQuality];
                this.item_icon.skin = "ui_icon/" + item_tcfg.strIconID_B;
                this.item_name.color = H52D_Framework.BaseDefine.LabelColor[item_tcfg.dwItemQuality];
                var n = H52D_Framework.GameParamConfig.LadderStarData[3 - this._nIdex];
                if (n) {
                    this.item_num.text = item_Info[3] * n[3] + "";
                }
            }
            item_Info = H52D_Framework.RewardConfig[ntcfg.WinExtraAward].reWrad[1];
            if (item_Info[1] == 1) {
                var item_tcfg = H52D_Framework.ItemConfig[item_Info[2]];
                this.item_name1.text = H52D_Framework.GetInfoAttr.Instance.GetText(item_tcfg.dwItemName);
                this.item_num1.text = item_Info[3];
                this.item_bg1.bgColor = H52D_Framework.BaseDefine.LadderItemBgColor[item_tcfg.dwItemQuality];
                this.item_icon1.skin = "ui_icon/" + item_tcfg.strIconID_B;
                this.item_name1.color = H52D_Framework.BaseDefine.LabelColor[item_tcfg.dwItemQuality];
            }
            if (this.item_num.text == "1") {
                this.item_num.text = " ";
            }
            if (this.item_num1.text == "1") {
                this.item_num1.text = " ";
            }
        };
        RewardItemLine.prototype.Destroy = function () {
            this.offAll();
        };
        return RewardItemLine;
    }(ui.action.Ladder.RewardItemLineUI));
    H52D_Framework.RewardItemLine = RewardItemLine;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=RewardItemLine.js.map