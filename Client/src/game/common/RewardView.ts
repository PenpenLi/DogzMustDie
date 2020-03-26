module H52D_Framework {

    /**
     * @class：奖品模块
     * @author：zhangyusong
     */
    export class RewardView extends ui.common.RewardViewUI {
        private itemId: number;

        public constructor(itemId) {
            super();
            this.itemId = itemId;

            this.itemName = GetInfoAttr.Instance.GetText(ItemConfig[this.itemId]["dwItemName"]);
            this.pic = ItemConfig[this.itemId]["strIconID_B"];
            this.quality = ItemConfig[this.itemId]["dwItemQuality"];
        }

        public set itemNum(value: number) {
            this.tx_num.text = value > 1 ? String(value) : "";
        }

        private set itemName(value: string) {
            this.tx_name.text = value;
        }

        private set pic(value: string) {
            this.img_icon.skin = "ui_icon/" + value;
        }

        private set quality(value: number) {
            this.img_quality.bgColor = BaseDefine.ItemBgColor[value];
            this.tx_name.color = BaseDefine.LabelColor1[value];
        }
    }
}