module H52D_Framework
{
    /**
     * @class：活动奖品模块
     * @author：zhangyusong
     */
    export class ActionRewordModel
    {
        private item: Laya.Image;
        private itembg:Laya.Label
        private itemPic: Laya.Image;
        private itemNun: Laya.Text;
        private itemName: Laya.Text;

        public constructor(item: Laya.Image)
        {
            this.item = item;
            this.itembg=item._childs[0];
            this.itemPic = item._childs[1];
            this.itemNun = item._childs[2];
            this.itemName = item._childs[3];
        }

        public set visible(value: boolean)
        {
            this.item.visible = value;
        }

        public set pic(value: string)
        {
            this.itemPic.skin = "ui_icon/" + value;
        }

        public set name(value: string)
        {
            this.itemName.text = value;
        }

        public set num(value: number)
        {
            this.itemNun.text = value > 1 ? String(value) : "";
        }

        public set quality(value: number)
        {
            this.itembg.bgColor = BaseDefine.ItemBgColor[value];
            this.itemName.color = BaseDefine.LabelColor1[value];
        }

    }
}