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
    H52D_Framework.AddViewResource("WroldBossBuffView", [
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_wroldboss.atlas", type: Laya.Loader.ATLAS },
    ]);
    /**世界bossbuff购买 */
    var WroldBossBuffView = /** @class */ (function (_super) {
        __extends(WroldBossBuffView, _super);
        function WroldBossBuffView() {
            var _this = _super.call(this) || this;
            _this.ViewInit();
            return _this;
        }
        WroldBossBuffView.prototype.Addevent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.Btn_close.on(Laya.Event.CLICK, this, this.Btn_clickclose);
            H52D_Framework.Event.RegistEvent('Update_bossbuffView', Laya.Handler.create(this, this.ReshList));
            H52D_Framework.Event.RegistEvent("BackBackGround", Laya.Handler.create(this, this.BackBackGround));
        };
        WroldBossBuffView.prototype.ViewInit = function () {
            this.Buff_list.vScrollBarSkin = "";
            this.ReshList();
            this.Addevent();
            this.Button();
            this.ADFail();
        };
        WroldBossBuffView.prototype.ReshList = function () {
            H52D_Framework.WroldBossLogic.Instance.Buff_List = [];
            this.Buff_list.array = H52D_Framework.WroldBossLogic.Instance.Buff_num();
            this.Buff_list.renderHandler = new Laya.Handler(this, this.Handler);
        };
        WroldBossBuffView.prototype.Button = function () {
            if (WroldBossBuffView.once >= 0.01) {
                this.StartChange.visible = false;
            }
            if (WroldBossBuffView.once < 0.01) {
                this.Btn_close.visible = false;
            }
            else {
                this.Btn_close.visible = true;
            }
            WroldBossBuffView.once += 0.01;
            if (H52D_Framework.IsAD()) {
                this.SetAD();
            }
            else {
                this.NoAD();
            }
        };
        WroldBossBuffView.prototype.ADFail = function () {
            if (!H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes) {
                this.Look.gray = true;
                this.Look.disabled = true;
                H52D_Framework.TipsLogic.Instance.OpenSystemTips(30071);
            }
        };
        WroldBossBuffView.prototype.BackBackGround = function () {
            this.Look.visible = false;
            this.StartChange.centerX = 0;
            this.bot_font.visible = false;
        };
        /**广告版本 */
        WroldBossBuffView.prototype.SetAD = function () {
            this.Look.on(Laya.Event.CLICK, this, this.LooKCB);
            this.StartChange.on(Laya.Event.CLICK, this, this.ChangeCB);
            if (!H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes || H52D_Framework.AdvertisingManager.Instance.IsBuyBossBuff) {
                this.Look.visible = false;
                this.StartChange.centerX = 0;
                this.bot_font.visible = false;
            }
            if (!this.StartChange.visible)
                this.Look.centerX = 0;
        };
        /**非广告版本 */
        WroldBossBuffView.prototype.NoAD = function () {
            this.bot_font.visible = false;
            this.Look.visible = false;
            this.StartChange.centerX = 0;
            this.StartChange.on(Laya.Event.CLICK, this, this.ChangeCB);
        };
        /**开始挑战按钮回调 */
        WroldBossBuffView.prototype.ChangeCB = function () {
            this.StartChange.visible = false;
            this.Btn_clickclose();
            H52D_Framework.Event.DispatchEvent("DeputyFireStart");
            H52D_Framework.WroldBossLogic.Instance.StopFight = true;
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.CUSTOMS_CURRENT);
        };
        /**观看按钮回调 */
        WroldBossBuffView.prototype.LooKCB = function () {
            H52D_Framework.UIManager.Instance.CreateUI("AdvertisementView", [H52D_Framework.ViewUpRoot, AdvertisementType.wroldBoss]);
        };
        WroldBossBuffView.prototype.Handler = function (item, index) {
            var buff_info = H52D_Framework.MarketConfig[3][this.Buff_list.array[index]];
            var buff_price = buff_info.Price;
            var item_Id = buff_info.sellContent[2];
            var Icon = item.getChildByName("buff_icon");
            var buyed = item.getChildByName("buff_buyed");
            var Say = item.getChildByName("buff_say");
            var btn = item.getChildByName("btn_buy");
            var price_icon = btn.getChildByName("buff_price_icon");
            var price_num = btn.getChildByName("buff_price");
            var isBuy = H52D_Framework.WroldBossLogic.Instance.Buff_Buy;
            var bool = isBuy[item_Id] == 1 ? true : false;
            buyed.visible = bool;
            btn.visible = !bool;
            if (buff_price[1] == 2) {
                price_icon.skin = "ui_icon/icon_prop_013.png";
            }
            price_num.text = buff_price[2];
            var buff_itemcfg = H52D_Framework.ItemConfig[item_Id];
            var name_Id = buff_itemcfg.dwItemAState;
            Icon.skin = "ui_icon/" + buff_itemcfg.strIconID_B;
            H52D_Framework.SetHtmlStyle(Say, 22, "#ffa5a7", "center");
            if (buyed.visible) {
                H52D_Framework.SetHtmlStyle(Say, 22, "#c5ffa5", "center");
            }
            Say.innerHTML = H52D_Framework.GetInfoAttr.Instance.GetText(name_Id);
            btn.on(Laya.Event.CLICK, this, this.Btn_clickbuy, [3, this.Buff_list.array[index], 1, buff_price]);
        };
        WroldBossBuffView.prototype.Btn_clickclose = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("WroldBossBuffView", [H52D_Framework.ViewUpRoot]);
        };
        /**购买Buff */
        WroldBossBuffView.prototype.Btn_clickbuy = function (type, buff_ID, buff_num, d_num) {
            var my_num = H52D_Framework.BagManager.Instance.getItemNumber(2);
            if (d_num > my_num) {
                if (H52D_Framework.IsShieldRecharge()) {
                    var str = H52D_Framework.SysPromptConfig[30060].strPromptInfo;
                    H52D_Framework.TipsLogic.Instance.OpenMessageBox(str, Laya.Handler.create(this, function () {
                        H52D_Framework.UIManager.Instance.DestroyUI("BuyTimesView", [H52D_Framework.ViewDownRoot]);
                    }));
                }
                else {
                    var str = H52D_Framework.SysPromptConfig[10014].strPromptInfo;
                    H52D_Framework.TipsLogic.Instance.OpenMessageBox(str, Laya.Handler.create(this, function () {
                        H52D_Framework.Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
                    }));
                }
            }
            else {
                //发送请求 购买buff
                H52D_Framework.WroldBossLogic.Instance.Buff_buy(type, buff_ID, buff_num);
            }
        };
        WroldBossBuffView.prototype.Destroy = function () {
            H52D_Framework.WroldBossLogic.Instance.Buff_List = [];
            this.offAll();
            H52D_Framework.Event.RemoveEvent('Update_bossbuffView', Laya.Handler.create(this, this.ReshList));
            H52D_Framework.Event.RemoveEvent("BackBackGround", Laya.Handler.create(this, this.BackBackGround));
        };
        WroldBossBuffView.once = 0;
        return WroldBossBuffView;
    }(ui.action.boss.WroldBossBuffViewUI));
    H52D_Framework.WroldBossBuffView = WroldBossBuffView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=WroldBossBuffView.js.map