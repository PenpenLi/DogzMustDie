var H52D_Framework;
(function (H52D_Framework) {
    /**
     * ：道具模型
     * @author zhangyusong
     */
    var ItemVo = /** @class */ (function () {
        function ItemVo(id, num) {
            this.id = id;
            var a = H52D_Framework.ItemConfig;
            var data = H52D_Framework.ItemConfig[id];
            this.dwItemName = data["dwItemName"];
            this.dwItemType = data["dwItemType"];
            this.dwItemTypes = data["dwItemTypes"];
            this.dwItemAState = data["dwItemAState"];
            this.strIconID = data["strIconID"];
            this.strIconID_B = data["strIconID_B"];
            this.strDrop = data["strDrop"];
            this.dwItemQuality = data["dwItemQuality"];
            this.heroId = data["heroId"];
            this.dwUseCondition = data["dwUseCondition"];
            this.dwUseEffect = data["dwUseEffect"];
            this.itemNumber = num;
        }
        Object.defineProperty(ItemVo.prototype, "itemNumber", {
            get: function () {
                return this._itemNumber;
            },
            set: function (value) {
                this._itemNumber = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemVo.prototype, "itemStrName", {
            /** 获取道具名字 */
            get: function () {
                return H52D_Framework.GetInfoAttr.Instance.GetText(this.dwItemName) ? H52D_Framework.GetInfoAttr.Instance.GetText(this.dwItemName) : "没有配置国际化";
            },
            enumerable: true,
            configurable: true
        });
        return ItemVo;
    }());
    H52D_Framework.ItemVo = ItemVo;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ItemVo.js.map