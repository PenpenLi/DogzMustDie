var H52D_Framework;
(function (H52D_Framework) {
    /**
     * @class：活动奖品模块
     * @author：zhangyusong
     */
    var ActionRewordModel = /** @class */ (function () {
        function ActionRewordModel(item) {
            this.item = item;
            this.itembg = item._childs[0];
            this.itemPic = item._childs[1];
            this.itemNun = item._childs[2];
            this.itemName = item._childs[3];
        }
        Object.defineProperty(ActionRewordModel.prototype, "visible", {
            set: function (value) {
                this.item.visible = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionRewordModel.prototype, "pic", {
            set: function (value) {
                this.itemPic.skin = "ui_icon/" + value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionRewordModel.prototype, "name", {
            set: function (value) {
                this.itemName.text = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionRewordModel.prototype, "num", {
            set: function (value) {
                this.itemNun.text = value > 1 ? String(value) : "";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionRewordModel.prototype, "quality", {
            set: function (value) {
                this.itembg.bgColor = H52D_Framework.BaseDefine.ItemBgColor[value];
                this.itemName.color = H52D_Framework.BaseDefine.LabelColor1[value];
            },
            enumerable: true,
            configurable: true
        });
        return ActionRewordModel;
    }());
    H52D_Framework.ActionRewordModel = ActionRewordModel;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ActionRewordModel.js.map