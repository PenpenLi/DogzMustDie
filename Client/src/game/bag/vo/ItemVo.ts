module H52D_Framework {
    /**
     * ：道具模型
     * @author zhangyusong
     */
    export class ItemVo {
        /** ID */
        public id: number;
        /** 名称 */
        public dwItemName: number;
        /** 类型 */
        public dwItemType: number;
        /** 子类型 */
        public dwItemTypes: number;
        /** 道具描述 */
        public dwItemAState: number;
        /** 图标ID */
        public strIconID: string;
        /** 大图标ID */
        public strIconID_B: string;
        /** 掉落外显 */
        public strDrop: string;
        /** 品质 */
        public dwItemQuality: number;
        /** 对应英雄ID */
        public heroId: number;
        /** 使用条件 */
        public dwUseCondition: Object;
        /** 使用效果 */
        public dwUseEffect: Object;

        public constructor(id: number, num: number) {
            this.id = id;
            let a = ItemConfig;
            let data = ItemConfig[id];
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

        private _itemNumber: number;

        public set itemNumber(value: number) {
            this._itemNumber = value;
        }

        public get itemNumber(): number {
            return this._itemNumber;
        }

        /** 获取道具名字 */
        public get itemStrName() {
            return GetInfoAttr.Instance.GetText(this.dwItemName) ? GetInfoAttr.Instance.GetText(this.dwItemName) : "没有配置国际化"
        }

    }
}