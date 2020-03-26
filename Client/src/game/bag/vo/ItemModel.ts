module H52D_Framework {
    /**
     * 物品类
     * @author zhangyusong
     */
    export class ItemModel  {
        /** 道具ID */
        private _itemId: number;
        /** 道具数量 */
        private _itemNumber: number;
        /** 道具模型 */
        private _itemVo: ItemVo;
        /**
         * @class 物品类
         * @param 物品数据或配置ID
         * 随机属性
         */
        constructor(id: number, num?: number)  {
            this._itemId = id;
            this._itemNumber = num;
        }

        public get itemId(): number  {
            return this._itemId;
        }

        public set itemId(value: number)  {
            this._itemId = value;
        }

        public get itemNumber(): number  {
            return this._itemNumber;
        }

        public set itemNumber(value: number)  {
            this._itemNumber = value;
        }

        public get itemVo(): ItemVo  {
            return this._itemVo
        }
    }
}