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
/**物品兑换 视图类 */
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("ChangeGoodsView", [
        { url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_icon.atlas", type: Laya.Loader.ATLAS },
    ]);
    var ChangeGoodsView = /** @class */ (function (_super) {
        __extends(ChangeGoodsView, _super);
        function ChangeGoodsView() {
            var _this = _super.call(this) || this;
            _this._time = 0;
            _this.ViewInit();
            return _this;
        }
        ;
        ChangeGoodsView.prototype.ViewInit = function () {
            this.ChangeItem_list.vScrollBarSkin = "";
            this.ViewEvent();
            this.SetItem_list();
            this._time = H52D_Framework.ChangeGoodsManager.Instance.ActionData.svot - H52D_Framework.Time.serverSecodes;
            H52D_Framework.Tick.Loop(100, this, this.OnceTime);
            this.say.text = H52D_Framework.GetInfoAttr.Instance.GetText(7142);
        };
        ChangeGoodsView.prototype.OnceTime = function () {
            this._time -= 0.1;
            this.times.text = "剩余时间:" + H52D_Framework.GetFormatTime(this._time) + "";
        };
        ChangeGoodsView.prototype.ViewEvent = function () {
            H52D_Framework.Event.RegistEvent("resh_goods", Laya.Handler.create(this, this.SetItem_list));
            this.on(Laya.Event.REMOVED, this, this.OnDestroy);
        };
        ChangeGoodsView.prototype.SetItem_list = function () {
            this.ChangeItem_list.array = [];
            this.ChangeItem_list.array = H52D_Framework.ChangeGoodsManager.Instance.GetArr();
            //this.ChangeItem_list.repeatY=this.ChangeItem_list.array.length;
            this.ChangeItem_list.renderHandler = new Laya.Handler(this, this.Handler);
        };
        ChangeGoodsView.prototype.Handler = function (item, index) {
            var Id = this.ChangeItem_list.array[index];
            var itemInfo = H52D_Framework.ChangeGoodsManager.Instance.ActionData.award[Id];
            var n_type = H52D_Framework.ChangeGoodsManager.Instance.ActionData.id;
            var needsItem = itemInfo.items1;
            var GoodsItem = itemInfo.items2[1];
            var ntcfg = H52D_Framework.ItemConfig[GoodsItem[2]];
            var times = itemInfo.value;
            var changeItem = item.getChildByName("changeItem");
            var man = item.getChildByName("man");
            var btn_change = man.getChildByName("Btn_change");
            var Changetimes = man.getChildByName("item_ChangetImes");
            var Changed = man.getChildByName("Changed");
            var item_pinzhi = changeItem.getChildByName("item_pinzhi");
            var item_num = changeItem.getChildByName("item_num");
            var item_name = changeItem.getChildByName("item_name");
            var item_Icon = changeItem.getChildByName("item_icon");
            item_pinzhi.bgColor = H52D_Framework.BaseDefine.LadderItemBgColor[ntcfg.dwItemQuality];
            item_num.text = GoodsItem[3];
            item_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(ntcfg.dwItemName);
            item_name.color = H52D_Framework.BaseDefine.LabelColor1[ntcfg.dwItemQuality];
            item_Icon.skin = "ui_icon/" + ntcfg.strIconID_B;
            var changetimes = H52D_Framework.ChangeGoodsManager.Instance.PlayChangeTimes[index + 1];
            if (!changetimes) {
                changetimes = 0;
            }
            Changetimes.text = "剩余次数:" + (times - changetimes) + "/" + times;
            for (var key in needsItem) {
                var iteminfo = needsItem[key];
                if (iteminfo[1] != 0) {
                    var item_cfg = H52D_Framework.ItemConfig[iteminfo[2]];
                    var item_Info = item.getChildByName("itemInfo" + key);
                    item_Info.visible = true;
                    var item_bg = item_Info.getChildByName("item_bg");
                    var item_pinzhi_1 = item_Info.getChildByName("item_pinzhi");
                    var item_Icon_1 = item_Info.getChildByName("item_icon");
                    var item_num_1 = item_Info.getChildByName("item_num");
                    //let item_name: Laya.Label = item_Info.getChildByName("item_name") as Laya.Label;
                    item_pinzhi_1.bgColor = H52D_Framework.BaseDefine.LadderItemBgColor[item_cfg.dwItemQuality];
                    item_Icon_1.skin = "ui_icon/" + item_cfg.strIconID_B;
                    var play_Item = H52D_Framework.BagManager.Instance.getItemNumber(iteminfo[2]);
                    item_num_1.text = "(" + play_Item + "/" + iteminfo[3] + ")";
                    item_num_1.color = H52D_Framework.BaseDefine.LabelColor1[2];
                    if (play_Item < iteminfo[3]) {
                        item_num_1.color = H52D_Framework.BaseDefine.LadderItemBgColor[6];
                    }
                }
                // item_name.text = GetInfoAttr.Instance.GetText(item_cfg.dwItemName);
                // item_name.color = BaseDefine.LabelColor[item_cfg.dwItemQuality];
            }
            var bool = H52D_Framework.ChangeGoodsManager.Instance.IsChangeItem(needsItem);
            btn_change.gray = !bool;
            man.mouseEnabled = bool;
            if (times - changetimes <= 0) {
                btn_change.visible = false;
                Changetimes.visible = false;
                Changed.visible = true;
                // TipsLogic.Instance.OpenSystemTips(str);
                return;
            }
            man.on(Laya.Event.CLICK, this, this.ChangeItem, [n_type, index + 1]);
        };
        ChangeGoodsView.prototype.ChangeItem = function (type, Item_Id) {
            H52D_Framework.ChangeGoodsManager.Instance.ChangeItem(type, Item_Id);
        };
        ChangeGoodsView.prototype.stringinfoInit = function () {
            H52D_Framework.GetInfoAttr.Instance.GetText(7142);
        };
        ChangeGoodsView.prototype.Btnclick_close = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("ChangeGoodsView", [H52D_Framework.ViewUpRoot]);
        };
        ChangeGoodsView.prototype.OnDestroy = function () {
            this.offAll();
            H52D_Framework.DEverydayManager.Instance.ActionArr = [];
        };
        ChangeGoodsView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent("resh_goods", Laya.Handler.create(this, this.Handler));
        };
        return ChangeGoodsView;
    }(ui.consumer.ChangeGoodsViewUI));
    H52D_Framework.ChangeGoodsView = ChangeGoodsView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ChangeGoodsView.js.map