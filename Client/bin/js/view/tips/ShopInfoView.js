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
/**商城通用介绍*/
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("ShopInfoView", [
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS }
    ]);
    var ShopInfoView = /** @class */ (function (_super) {
        __extends(ShopInfoView, _super);
        /**
         * @param buf { 1:标题 2:文字 3:ItemId数组}
         */
        function ShopInfoView(buf) {
            var _this = _super.call(this) || this;
            var data = [];
            for (var info in buf) {
                if (Number(info) != 0)
                    data.push(buf[info]);
            }
            _this.Init(data);
            _this.AddEvent();
            return _this;
        }
        ShopInfoView.prototype.Init = function (data) {
            this.ItemIdArr = [];
            this.ItemArr = [];
            this.infoName.text = data[0];
            this.introduce.text = data[1];
            if (data.length == 3) {
                for (var type in data[2]) {
                    var data_rewrad = data[2][type];
                    for (var rewrad in data_rewrad) {
                        var id = data_rewrad[rewrad][2];
                        var isRepetition = false;
                        for (var i in this.ItemIdArr) {
                            if (id == this.ItemIdArr[i]) {
                                isRepetition = true;
                            }
                        }
                        if (!isRepetition)
                            this.ItemIdArr.push(id);
                    }
                }
                var arr = this.ItemIdArr;
                for (var i = 0; i < arr.length; i++) {
                    var ItemTypes_1 = H52D_Framework.ItemConfig[arr[i]].dwItemQuality;
                    var dwItemType_1 = H52D_Framework.ItemConfig[arr[i]].dwItemTypes;
                    for (var j = i + 1; j < arr.length; j++) {
                        var ItemTypes_2 = H52D_Framework.ItemConfig[arr[j]].dwItemQuality;
                        var dwItemType_2 = H52D_Framework.ItemConfig[arr[j]].dwItemTypes;
                        var ItemTypes_1_1 = H52D_Framework.ItemConfig[arr[i]].dwItemQuality;
                        if (dwItemType_1 == H52D_Framework.BaseDefine.ItemSonTypeUesHero) {
                            if (dwItemType_2 == H52D_Framework.BaseDefine.ItemSonTypeUesHero) {
                                if (ItemTypes_2 > ItemTypes_1_1) {
                                    var id = arr[i];
                                    arr[i] = arr[j];
                                    arr[j] = id;
                                }
                            }
                        }
                        else {
                            if (dwItemType_2 == H52D_Framework.BaseDefine.ItemSonTypeUesHero) {
                                var id = arr[i];
                                arr[i] = arr[j];
                                arr[j] = id;
                            }
                            else {
                                if (ItemTypes_2 > ItemTypes_1_1) {
                                    var id = arr[i];
                                    arr[i] = arr[j];
                                    arr[j] = id;
                                }
                            }
                        }
                    }
                }
                this.itemList.array = arr;
                this.itemList.vScrollBarSkin = "";
            }
        };
        ShopInfoView.prototype.AddEvent = function () {
            this.close.on(Laya.Event.CLICK, this, this.CloseUI);
            this.on(Laya.Event.REMOVED, this, this.OnDestroy);
            this.itemList.renderHandler = new Laya.Handler(this, this.SetitemList);
        };
        /**销毁按钮侦听器 */
        ShopInfoView.prototype.OnDestroy = function () {
            this.offAll();
        };
        /**
         * 设置itemlist样式
         * @param item 单个box
         * @param index 索引
        */
        ShopInfoView.prototype.SetitemList = function (item, index) {
            var id = this.ItemIdArr[index];
            var data = H52D_Framework.ItemConfig[id];
            var name = item.getChildByName("name");
            var icon = item.getChildByName("icon");
            var bjIcon = item.getChildByName("bjIcon");
            name.text = H52D_Framework.GetInfoAttr.Instance.GetText(data.dwItemName);
            name.color = H52D_Framework.BaseDefine.LabelColor[data.dwItemQuality];
            icon.skin = "ui_icon/" + data.strIconID_B;
            bjIcon.skin = H52D_Framework.BaseDefine.QualityList[data.dwItemQuality];
        };
        ShopInfoView.prototype.CloseUI = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("ShopInfoView", [H52D_Framework.ViewUpRoot]);
        };
        return ShopInfoView;
    }(ui.tips.ShopInfoViewUI));
    H52D_Framework.ShopInfoView = ShopInfoView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ShopInfoView.js.map