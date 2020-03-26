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
var H52D_Framework;
(function (H52D_Framework) {
    /**
     * @class：奖品模块
     * @author：zhangyusong
     */
    var RewardView = /** @class */ (function (_super) {
        __extends(RewardView, _super);
        function RewardView(itemId) {
            var _this = _super.call(this) || this;
            _this.itemId = itemId;
            _this.itemName = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.ItemConfig[_this.itemId]["dwItemName"]);
            _this.pic = H52D_Framework.ItemConfig[_this.itemId]["strIconID_B"];
            _this.quality = H52D_Framework.ItemConfig[_this.itemId]["dwItemQuality"];
            return _this;
        }
        Object.defineProperty(RewardView.prototype, "itemNum", {
            set: function (value) {
                this.tx_num.text = value > 1 ? String(value) : "";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RewardView.prototype, "itemName", {
            set: function (value) {
                this.tx_name.text = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RewardView.prototype, "pic", {
            set: function (value) {
                this.img_icon.skin = "ui_icon/" + value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RewardView.prototype, "quality", {
            set: function (value) {
                this.img_quality.bgColor = H52D_Framework.BaseDefine.ItemBgColor[value];
                this.tx_name.color = H52D_Framework.BaseDefine.LabelColor1[value];
            },
            enumerable: true,
            configurable: true
        });
        return RewardView;
    }(ui.common.RewardViewUI));
    H52D_Framework.RewardView = RewardView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=RewardView.js.map