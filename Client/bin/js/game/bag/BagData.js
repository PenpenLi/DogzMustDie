var H52D_Framework;
(function (H52D_Framework) {
    /**
     * 背包类,存放物品
     * @author zhangyusong
     */
    var BagData = /** @class */ (function () {
        function BagData() {
        }
        /** 获取道具列表 */
        BagData.prototype.GetList = function () {
            return this.data;
        };
        /** 初始化 */
        BagData.prototype.Init = function () {
            this.data = {};
        };
        /** 道具放入背包 */
        BagData.prototype.Push = function (vo) {
            this.data[vo.id] = vo;
        };
        /**
         * 获取物品
         * @param itemType:道具类型,
         * @param id:道具ID,没有id返回整个列表
         */
        BagData.prototype.getItem = function (id) {
            return this.data[id];
        };
        /**
         * 获取物品数量
         * @param itemType:道具类型,
         * @param id:道具ID,没有id返回整个列表
         */
        BagData.prototype.getItemNum = function (id) {
            var oItem = this.data[id];
            if (!oItem) {
                return 0;
            }
            return oItem.itemNumber;
        };
        /** 道具数量更新 */
        BagData.prototype.UpdateItem = function (id, num) {
            var item = this.data[id];
            if (!item) {
                item = new H52D_Framework.ItemVo(id, num);
                this.data[id] = item;
            }
            else {
                item.itemNumber = num;
            }
            // 派发金币事件
            if (id == H52D_Framework.BaseDefine.ItemIdGold) {
                H52D_Framework.Event.DispatchEvent("ChangeMoeny");
            }
            //新手引导
            // if (Guidance.Instance.bNewbie == true &&
            //     item.dwItemTypes == 21 &&
            //     HeroManager.Instance.HeroIstrue(item.heroId) == true) {
            //     Guidance.Instance.SecondGuidance();
            // }
        };
        return BagData;
    }());
    H52D_Framework.BagData = BagData;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=BagData.js.map