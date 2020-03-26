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
    H52D_Framework.AddViewResource(" CampDonateView", [
        { url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS },
    ]);
    var CampDonateView = /** @class */ (function (_super) {
        __extends(CampDonateView, _super);
        function CampDonateView() {
            var _this = _super.call(this) || this;
            _this._time = 0;
            _this.AddEvent();
            _this.Info();
            return _this;
        }
        CampDonateView.prototype.AddEvent = function () {
            H52D_Framework.Event.RegistEvent("changetimes", Laya.Handler.create(this, this.Info));
            this.Btn_Close.on(Laya.Event.CLICK, this, this.BtnClick_close);
            this.Other.on(Laya.Event.CLICK, this, this.BtnClick_close);
            this.m_d.on(Laya.Event.CLICK, this, this.Btn_click, [1]);
            this.D_d.on(Laya.Event.CLICK, this, this.Btn_click, [2]);
            this.on(Laya.Event.REMOVED, this, this.OnDestroy);
        };
        CampDonateView.prototype.Info = function () {
            if (!H52D_Framework.MasterPlayer.Instance.player.Donatetimes[1]) {
                H52D_Framework.MasterPlayer.Instance.player.Donatetimes[1] = 0;
            }
            var m_tcfg = H52D_Framework.GangDonateConfig[1].consume;
            var d_tcfg = H52D_Framework.GangDonateConfig[2].consume;
            var a = H52D_Framework.GangDonateConfig[1].num - H52D_Framework.MasterPlayer.Instance.player.Donatetimes[1];
            H52D_Framework.SetHtmlStyle(this.M_Times, 26, "#5f2904", "center", true);
            this.M_Times.innerHTML = "剩余次数: " + a + "/" + H52D_Framework.GangDonateConfig[1].num;
            if (a == 0) {
                this.M_Times.innerHTML = "剩余次数: " + H52D_Framework.GetHtmlStrByColor(a + "", "#ff9595") + "/" + H52D_Framework.GangDonateConfig[1].num;
            }
            this.money_heat.text = "阵营热度:+" + H52D_Framework.GangDonateConfig[1].heat;
            this.M_num.text = "捐献" + m_tcfg[2] + H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.ItemConfig[m_tcfg[1]].dwItemName);
            this.times = a;
            this.num_d.text = d_tcfg[2];
            this.D_heat.text = "阵营热度:+" + H52D_Framework.GangDonateConfig[2].heat;
            this.D_num.text = "捐献" + d_tcfg[2] + H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.ItemConfig[d_tcfg[1]].dwItemName);
            this.num_m.text = m_tcfg[2];
            if (m_tcfg[2] == 1) {
                this.num_m.text = "";
            }
        };
        CampDonateView.prototype.BtnClick_close = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("CampDonateView", [H52D_Framework.ViewUpRoot]);
        };
        CampDonateView.prototype.Btn_click = function (itemId) {
            var nowDate = new Date();
            var time = (nowDate.getDate() * 24 * 60 + nowDate.getHours() * 60 + nowDate.getMinutes()) * 60 + nowDate.getSeconds();
            if (this._time == 0 || time - this._time > 0.5) {
                this._time = time;
                var iteminfo = H52D_Framework.GangDonateConfig[itemId].consume;
                var play_itemnum = H52D_Framework.BagManager.Instance.getItemNumber(iteminfo[1]);
                var itenname = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.ItemConfig[iteminfo[1]].dwItemName);
                var str = H52D_Framework.Format(H52D_Framework.SysPromptConfig[30027].strPromptInfo, itenname);
                if (play_itemnum < iteminfo[2]) {
                    if (itemId == 2) {
                        if (H52D_Framework.IsShieldRecharge()) {
                            H52D_Framework.TipsLogic.Instance.OpenMessageBox("钻石不足!");
                            return;
                        }
                        else {
                            var str_1 = H52D_Framework.SysPromptConfig[10009].strPromptInfo;
                            H52D_Framework.TipsLogic.Instance.OpenMessageBox(str_1, Laya.Handler.create(this, function () {
                                H52D_Framework.ViewUILogic.Instance.halfPanel = false;
                                H52D_Framework.Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
                                H52D_Framework.UIManager.Instance.DestroyUI("CampMainInfo", [H52D_Framework.ViewUpRoot]);
                                H52D_Framework.UIManager.Instance.DestroyUI("CampDonateView", [H52D_Framework.ViewUpRoot]);
                            }));
                        }
                    }
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
                    return;
                }
                if (itemId == 1) {
                    if (this.times < 1) {
                        H52D_Framework.TipsLogic.Instance.OpenSystemTips("捐献次数不足！");
                        return;
                    }
                }
                H52D_Framework.CampManager.Instance.Donate_times(itemId);
            }
            else {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("0.5秒内只能赠送一次");
            }
        };
        CampDonateView.prototype.OnDestroy = function () {
            H52D_Framework.Event.RemoveEvent("changetimes", Laya.Handler.create(this, this.Info));
        };
        return CampDonateView;
    }(ui.camp.CampDonateViewUI));
    H52D_Framework.CampDonateView = CampDonateView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=CampDonateView.js.map