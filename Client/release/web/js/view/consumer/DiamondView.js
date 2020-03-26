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
/**每日累消*/
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("DiamondView", [
        { url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
    ]);
    /***消耗钻石领取奖励   每日累消 */
    var DiamondView = /** @class */ (function (_super) {
        __extends(DiamondView, _super);
        function DiamondView() {
            var _this = _super.call(this) || this;
            _this.AddEvent();
            _this.Initview();
            return _this;
        }
        DiamondView.prototype.AddEvent = function () {
            H52D_Framework.Event.RegistEvent("resh_diamond", Laya.Handler.create(this, this.addListener));
            this.on(Laya.Event.REMOVED, this, this.OnDestroy);
        };
        DiamondView.prototype.Initview = function () {
            this.ReshHandle();
            this.D_list.vScrollBarSkin = "";
        };
        DiamondView.prototype.addListener = function () {
            this.ReshHandle();
        };
        DiamondView.prototype.ReshHandle = function () {
            this.D_list.array = [];
            this.D_list.array = H52D_Framework.DEverydayManager.Instance.GetInfoArr();
            this.D_list.renderHandler = new Laya.Handler(this, this.Handler);
        };
        DiamondView.prototype.Handler = function (item, index) {
            var nIdx = this.D_list.array[index];
            var D_num = H52D_Framework.DEverydayManager.Instance.Dnum;
            var action_id = H52D_Framework.DEverydayManager.Instance.ActionData.id;
            var data = H52D_Framework.DEverydayManager.Instance.ActionData.award;
            var d_num = data[nIdx].value;
            var shop = data[nIdx].items;
            var btn = item.getChildByName("btn_receive");
            var say = item.getChildByName("D_say");
            var getbag = item.getChildByName("reced");
            H52D_Framework.SetHtmlStyle(say, 26, "#ff7a6d", "left");
            var num = D_num + "/" + d_num;
            var str = H52D_Framework.GetInfoAttr.Instance.GetText(7094);
            var bool = H52D_Framework.DEverydayManager.Instance.Dnum >= d_num ? true : false;
            say.innerHTML = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(7094), d_num, H52D_Framework.GetHtmlStrByColor(D_num, "#ff7a6d"), H52D_Framework.GetHtmlStrByColor(d_num, "#ff7a6d"));
            if (bool) {
                say.innerHTML = H52D_Framework.Format(str, d_num, H52D_Framework.GetHtmlStrByColor(D_num, "#90f96f"), H52D_Framework.GetHtmlStrByColor(d_num, "#90f96f"));
            }
            btn.gray = !bool;
            btn.mouseEnabled = bool;
            for (var key in shop) {
                var icon_bg = item.getChildByName("item_icon" + key);
                var icon = icon_bg.getChildByName("item_icon");
                var name_1 = icon_bg.getChildByName("item_name");
                var item_num = icon_bg.getChildByName("item_num");
                var bg = icon_bg.getChildByName("bg");
                var bg_img = icon_bg.getChildByName("bg-img");
                bg_img.visible = true;
                icon_bg.bgColor = "#20263e";
                var Item = shop[key];
                item_num.text = Item[3];
                if (item_num.text == "1") {
                    item_num.text = "";
                }
                var ShopInfo = H52D_Framework.ItemConfig[Item[2]];
                if (ShopInfo) {
                    icon.skin = "ui_icon/" + ShopInfo.strIconID_B;
                    name_1.text = H52D_Framework.GetInfoAttr.Instance.GetText(ShopInfo.dwItemName);
                    name_1.color = H52D_Framework.BaseDefine.LabelColor1[ShopInfo.dwItemQuality];
                    bg.bgColor = H52D_Framework.BaseDefine.ItemBgColor[ShopInfo.dwItemQuality];
                }
            }
            var Istrue = H52D_Framework.DEverydayManager.Instance.LingQu[nIdx] == 1 ? false : true;
            btn.visible = Istrue;
            getbag.visible = !Istrue;
            btn.on(Laya.Event.CLICK, this, this.Btn_receive, [action_id, nIdx]);
        };
        DiamondView.prototype.Btn_receive = function (type, id) {
            H52D_Framework.OActivityLogic.Instance.K_GetActivityAwardReq(type, id);
        };
        DiamondView.prototype.OnDestroy = function () {
            this.offAll();
            H52D_Framework.DEverydayManager.Instance.ActionArr = [];
        };
        DiamondView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent("resh_diamond", Laya.Handler.create(this, this.addListener));
            H52D_Framework.DEverydayManager.Instance.ActionArr = [];
        };
        return DiamondView;
    }(ui.consumer.DiamondViewUI));
    H52D_Framework.DiamondView = DiamondView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=DiamondView.js.map