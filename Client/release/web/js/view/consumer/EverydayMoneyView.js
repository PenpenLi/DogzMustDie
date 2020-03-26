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
/**Created by the LayaAirIDE*/
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("EverydayMoneyView", [
        { url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
    ]);
    /***每日累充 */
    var EverydayMoneyView = /** @class */ (function (_super) {
        __extends(EverydayMoneyView, _super);
        function EverydayMoneyView() {
            var _this = _super.call(this) || this;
            _this.InitView();
            _this.AddEvent();
            return _this;
        }
        EverydayMoneyView.prototype.InitView = function () {
            this.lay_outlist.vScrollBarSkin = "";
            this.Reshlist();
            this.ViewInfo();
            //this.lay_outlist.repeatY = this.lay_outlist.array.length;
        };
        EverydayMoneyView.prototype.ViewInfo = function () {
            this.showmoney.text = "今日已充值:" + H52D_Framework.mEverydayManager.Instance.MyMoney;
            this.say.text = H52D_Framework.GetInfoAttr.Instance.GetText(7081);
        };
        EverydayMoneyView.prototype.AddEvent = function () {
            H52D_Framework.Event.RegistEvent("UpdateView_everydaymoney", Laya.Handler.create(this, this.Reshlist));
            this.on(Laya.Event.REMOVED, this, this.Destroy);
        };
        EverydayMoneyView.prototype.Reshlist = function () {
            H52D_Framework.mEverydayManager.Instance.Activonarr = [];
            this.lay_outlist.array = H52D_Framework.mEverydayManager.Instance.GetArr();
            this.lay_outlist.renderHandler = new Laya.Handler(this, this.Handler);
        };
        EverydayMoneyView.prototype.Handler = function (item, index) {
            var id = this.lay_outlist.array[index];
            var itemInfo = H52D_Framework.mEverydayManager.Instance.ActionData.award[id];
            var action_id = H52D_Framework.mEverydayManager.Instance.ActionData.id;
            var shop;
            var lock = item.getChildByName("lock");
            var img_lingqu = item.getChildByName("reced");
            var sya = item.getChildByName("D_say");
            var btn = item.getChildByName("btn_isgo");
            var s = H52D_Framework.GetTabLength(itemInfo.items);
            for (var i = 1; i <= s; i++) {
                var item_bg = item.getChildByName("item_icon" + i);
                item_bg.visible = true;
                var bg = item_bg.getChildByName("bg");
                var icon = item_bg.getChildByName("item_icon");
                var item_name = item_bg.getChildByName("item_name");
                var item_num = item_bg.getChildByName("item_num");
                var bg_img = item_bg.getChildByName("bg-img");
                shop = itemInfo.items[i];
                bg_img.visible = true;
                item_num.text = shop[3];
                var n_tcfg = H52D_Framework.ItemConfig[shop[2]];
                item_bg.bgColor = "#20263e";
                bg.bgColor = H52D_Framework.BaseDefine.ItemBgColor[n_tcfg.dwItemQuality];
                item_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(n_tcfg.dwItemName);
                item_name.color = H52D_Framework.BaseDefine.LabelColor1[n_tcfg.dwItemQuality];
                icon.skin = "ui_icon/" + n_tcfg.strIconID_B;
            }
            var needmoney = H52D_Framework.mEverydayManager.Instance.MyMoney;
            H52D_Framework.SetHtmlStyle(sya, 26, "#ff7a6d", "left");
            sya.innerHTML = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(7082), itemInfo.value, needmoney, itemInfo.value);
            var bool = needmoney >= itemInfo.value ? true : false;
            btn.label = "充值";
            if (bool) {
                btn.label = "领取";
                sya.innerHTML = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(7082), itemInfo.value, H52D_Framework.GetHtmlStrByColor(needmoney + "", "#90f96f"), H52D_Framework.GetHtmlStrByColor(itemInfo.value, "#90f96f"));
            }
            var a = H52D_Framework.mEverydayManager.Instance.Lingqu;
            if (H52D_Framework.mEverydayManager.Instance.Lingqu[id] == 1) {
                img_lingqu.visible = true;
                btn.visible = false;
            }
            if (bool) {
                btn.on(Laya.Event.CLICK, this, this.Btn_lingqu, [action_id, id, shop[3]]);
            }
            else {
                btn.on(Laya.Event.CLICK, this, this.GoShop);
            }
        };
        EverydayMoneyView.prototype.OpenView = function (nheroID) {
            H52D_Framework.HeroManager.Instance.OpenView(nheroID);
        };
        EverydayMoneyView.prototype.GoShop = function () {
            if (H52D_Framework.mEverydayManager.Instance.IsOpen) {
                H52D_Framework.UIManager.Instance.DestroyUI("ActiveBgView", [H52D_Framework.ViewUpRoot]);
                return;
            }
            else {
                H52D_Framework.Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
                H52D_Framework.OneTimer(500, function () {
                    H52D_Framework.Event.DispatchEvent("toGemShop");
                    H52D_Framework.UIManager.Instance.DestroyUI("ActiveBgView", [H52D_Framework.ViewUpRoot]);
                });
            }
        };
        EverydayMoneyView.prototype.Btn_lingqu = function (type, id, num) {
            H52D_Framework.OActivityLogic.Instance.K_GetActivityAwardReq(type, id, num);
        };
        EverydayMoneyView.prototype.ShowItem = function () {
            H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(H52D_Framework.ViewToppestRoot);
        };
        EverydayMoneyView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.mEverydayManager.Instance.Activonarr = [];
        };
        EverydayMoneyView.prototype.OnDestroy = function () {
            this.offAll();
            H52D_Framework.mEverydayManager.Instance.Activonarr = [];
            H52D_Framework.Event.RemoveEvent("UpdateView_everydaymoney", Laya.Handler.create(this, this.Reshlist));
        };
        return EverydayMoneyView;
    }(ui.consumer.EverydayMoneyViewUI));
    H52D_Framework.EverydayMoneyView = EverydayMoneyView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=EverydayMoneyView.js.map