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
    H52D_Framework.AddViewResource("MoneybackView", [
        { url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
    ]);
    /**充值返馈 */
    var MoneybackView = /** @class */ (function (_super) {
        __extends(MoneybackView, _super);
        function MoneybackView() {
            var _this = _super.call(this) || this;
            _this.AddEvent();
            _this.Initview();
            return _this;
        }
        MoneybackView.prototype.AddEvent = function () {
            this.btn_close.on(Laya.Event.CLICK, this, this.Btn_close);
            this.Other.on(Laya.Event.CLICK, this, this.Btn_close);
            H52D_Framework.Event.RegistEvent("UpdateView_moneyback", Laya.Handler.create(this, this.ReshHandler));
            this.on(Laya.Event.REMOVED, this, this.Destroy);
        };
        MoneybackView.prototype.Initview = function () {
            this.ReshHandler();
            H52D_Framework.ShopLogic.Instance.EffShow = false;
        };
        MoneybackView.prototype.ReshHandler = function () {
            this.m_backlist.vScrollBarSkin = "";
            this.m_backlist.array = H52D_Framework.ShopLogic.Instance.MonenArr;
            this.m_backlist.renderHandler = new Laya.Handler(this, this.Handler);
        };
        MoneybackView.prototype.Handler = function (item, index) {
            var n_cfgId = this.m_backlist.array[index];
            var n_cfg = H52D_Framework.ChargeReturnConfig[n_cfgId];
            var recfg_id = n_cfg.chargeReward; //道具表ID			
            var btn = item.getChildByName("btn_isgo");
            var say = item.getChildByName("M_say");
            var item_bg = item.getChildByName("item_bg1");
            var icon = item_bg.getChildByName("item_icon1");
            var name = item_bg.getChildByName("item_name");
            var bg = item_bg.getChildByName("bg");
            var lab = item.getChildByName("lab_text");
            if (H52D_Framework.ShopLogic.Instance.MoneyBack[n_cfgId] == 1) {
                lab.visible = true;
                btn.visible = false;
            }
            H52D_Framework.SetHtmlStyle(say, 20, "#ff7a6d", "left");
            say.innerHTML = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(7093), n_cfgId);
            var item_infolist = H52D_Framework.RewardConfig[recfg_id].reWrad[1];
            var iteminfo;
            if (item_infolist[1] == H52D_Framework.BaseDefine.ItemTypePro) {
                iteminfo = H52D_Framework.ItemConfig[item_infolist[2]];
                icon.skin = "ui_icon/" + iteminfo.strIconID_B;
                name.text = H52D_Framework.GetInfoAttr.Instance.GetText(iteminfo.dwItemName) + "X" + item_infolist[3];
                name.color = H52D_Framework.BaseDefine.LabelColor1[iteminfo.dwItemQuality];
                item_bg.skin = H52D_Framework.BaseDefine.HeroAllinfo_bg[iteminfo.dwItemQuality];
                bg.bgColor = H52D_Framework.BaseDefine.ItemBgColor[iteminfo.dwItemQuality];
            }
            if (item_infolist[1] == H52D_Framework.BaseDefine.ItemTypeEquip) {
                iteminfo = H52D_Framework.EquipConfig[item_infolist[2]];
                icon.skin = "ui_icon/" + iteminfo.equipIcon;
                name.text = H52D_Framework.GetInfoAttr.Instance.GetText(iteminfo.equipName);
            }
            if (item_infolist[1] == H52D_Framework.BaseDefine.ItemTypeHero) {
                iteminfo = H52D_Framework.HeroConfig[item_infolist[2]];
                icon.skin = "ui_icon/" + iteminfo.strIcon;
                name.text = H52D_Framework.GetInfoAttr.Instance.GetText(iteminfo.name);
            }
            if (item_infolist[1] == H52D_Framework.BaseDefine.ItemTypePet) {
                iteminfo = H52D_Framework.PetConfig[item_infolist[2]];
                icon.skin = "ui_icon/" + iteminfo.strPetIcon;
                name.text = H52D_Framework.GetInfoAttr.Instance.GetText(iteminfo.petName);
            }
            var num = index + 4;
            if (H52D_Framework.ShopLogic.Instance.isFristCharge(1, num)) {
                btn.on(Laya.Event.CLICK, this, this.Btn_receive, [num]);
            }
            else {
                btn.label = "领取";
                btn.on(Laya.Event.CLICK, this, this.n_Money, [n_cfgId]);
            }
        };
        MoneybackView.prototype.Btn_receive = function (num) {
            this.Btn_close();
            if (H52D_Framework.ViewUILogic.Instance.OpenPanel == E_OpenGrade.SHOP) {
                H52D_Framework.OneTimer(500, function () {
                    H52D_Framework.Event.DispatchEvent("toGemShop", num);
                    H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.BOTTOM_SET_PANEL); //调整面板高度  成为 全屏
                });
            }
            else {
                H52D_Framework.Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
                // ShopLogic.Instance.nIdx = num;
                H52D_Framework.OneTimer(500, function () {
                    H52D_Framework.Event.DispatchEvent("toGemShop", num);
                    H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.BOTTOM_SET_PANEL); //调整面板高度  成为 全屏
                });
            }
        };
        /***发送领取消息  */
        MoneybackView.prototype.n_Money = function (n_money) {
            H52D_Framework.ShopLogic.Instance.K_ReqChargeFeedback(n_money);
        };
        MoneybackView.prototype.Btn_close = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("MoneybackView", [H52D_Framework.ViewUpRoot]);
            this.m_backlist.array = [];
            H52D_Framework.Event.DispatchEvent("UpdateBtnList");
        };
        MoneybackView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent("UpdateView_moneyback", Laya.Handler.create(this, this.ReshHandler));
        };
        return MoneybackView;
    }(ui.consumer.MoneybackViewUI));
    H52D_Framework.MoneybackView = MoneybackView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MoneybackView.js.map