var H52D_Framework;
(function (H52D_Framework) {
    /**
     * 物品类
     * @author zhangyusong
     */
    var ItemModel = /** @class */ (function () {
        /**
         * @class 物品类
         * @param 物品数据或配置ID
         * 随机属性
         */
        function ItemModel(id, num) {
            this._itemId = id;
            this._itemNumber = num;
        }
        Object.defineProperty(ItemModel.prototype, "itemId", {
            get: function () {
                return this._itemId;
            },
            set: function (value) {
                this._itemId = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemModel.prototype, "itemNumber", {
            get: function () {
                return this._itemNumber;
            },
            set: function (value) {
                this._itemNumber = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemModel.prototype, "itemVo", {
            get: function () {
                return this._itemVo;
            },
            enumerable: true,
            configurable: true
        });
        return ItemModel;
    }());
    H52D_Framework.ItemModel = ItemModel;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ItemModel.js.map