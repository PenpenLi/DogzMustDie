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
    var ReplaceTipView = /** @class */ (function (_super) {
        __extends(ReplaceTipView, _super);
        function ReplaceTipView(buf) {
            var _this = _super.call(this) || this;
            _this.camp_Id = buf[1];
            _this.Init();
            return _this;
        }
        ReplaceTipView.prototype.Init = function () {
            var n_camp = H52D_Framework.CampManager.Instance.nCamp(this.camp_Id);
            this.camp_hot.text = n_camp[4] + "";
            this.camp_playnum.text = n_camp[2] + "/" + H52D_Framework.GangLevelUpConfig[n_camp[3]].Membership;
            this.camp_lv.text = n_camp[3] + "";
            var camp = H52D_Framework.GangConfig[this.camp_Id];
            this.camp_icon.skin = "ui_icon/" + camp.stricon;
            this.camp_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(camp.nameId);
            H52D_Framework.SetHtmlStyle(this.DiamondNUm, 20, "#1f5e18", "center");
            this.DiamondNUm.innerHTML = "<img src= 'ui_icon/icon_prop_013.png' width='24px' height='24px'></img>" + H52D_Framework.GameParamConfig.GangChangeConsume;
            this.AddEvent();
        };
        ReplaceTipView.prototype.AddEvent = function () {
            this.look_play.on(Laya.Event.CLICK, this, this.OpenView);
            this.Btn_close.on(Laya.Event.CLICK, this, this.btnclick);
            this.Other.on(Laya.Event.CLICK, this, this.btnclick);
            this.on(Laya.Event.REMOVED, this, this.OnDestroy);
            this.btn_change.on(Laya.Event.CLICK, this, this.camp_change);
            H52D_Framework.Event.RegistEvent("ReqchangeCamp", Laya.Handler.create(this, this.camp_jion));
        };
        ReplaceTipView.prototype.btnclick = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("ReplaceTipView", [H52D_Framework.ViewUpRoot]);
        };
        ReplaceTipView.prototype.camp_change = function () {
            var n_camp = H52D_Framework.CampManager.Instance.nCamp(this.camp_Id);
            if (n_camp[2] < H52D_Framework.GangLevelUpConfig[n_camp[3]].Membership) {
                if (H52D_Framework.BagManager.Instance.getItemNumber(2) >= 100) {
                    H52D_Framework.CampManager.Instance.Camp_Jion(this.camp_Id);
                    //打开加入阵营后的主界面
                }
                else {
                    if (H52D_Framework.IsShieldRecharge()) {
                        H52D_Framework.TipsLogic.Instance.OpenMessageBox("钻石不足!");
                        return;
                    }
                    else {
                        if (H52D_Framework.IsShieldRecharge()) {
                            var str = H52D_Framework.SysPromptConfig[30060].strPromptInfo;
                            H52D_Framework.TipsLogic.Instance.OpenMessageBox(str, Laya.Handler.create(this, function () {
                            }));
                        }
                        else {
                            var str = H52D_Framework.SysPromptConfig[10014].strPromptInfo;
                            H52D_Framework.TipsLogic.Instance.OpenMessageBox(str, Laya.Handler.create(this, function () {
                                var panel_id = H52D_Framework.ViewUILogic.Instance.OpenPanel;
                                if (panel_id != E_OpenGrade.SHOP) {
                                    H52D_Framework.ViewUILogic.Instance.halfPanel = false;
                                    H52D_Framework.Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
                                    H52D_Framework.ViewUILogic.Instance.OpenPanel = E_OpenGrade.SHOP;
                                    H52D_Framework.UIManager.Instance.DestroyUI("CampMainInfo", [H52D_Framework.ViewUpRoot]);
                                    H52D_Framework.UIManager.Instance.DestroyUI("ReplaceCampView", [H52D_Framework.ViewUpRoot]);
                                    H52D_Framework.UIManager.Instance.DestroyUI("ReplaceTipView", [H52D_Framework.ViewUpRoot]);
                                    H52D_Framework.OneTimer(500, function () {
                                        H52D_Framework.Event.DispatchEvent("toGemShop");
                                    });
                                }
                                else {
                                    H52D_Framework.UIManager.Instance.DestroyUI("CampMainInfo", [H52D_Framework.ViewUpRoot]);
                                    H52D_Framework.UIManager.Instance.DestroyUI("ReplaceCampView", [H52D_Framework.ViewUpRoot]);
                                    H52D_Framework.UIManager.Instance.DestroyUI("ReplaceTipView", [H52D_Framework.ViewUpRoot]);
                                }
                            }));
                        }
                    }
                }
            }
            else {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips(H52D_Framework.SysPromptConfig[10015].strPromptInfo); //
            }
        };
        ReplaceTipView.prototype.camp_jion = function () {
            H52D_Framework.TipsLogic.Instance.OpenSystemTips(H52D_Framework.SysPromptConfig[10016].strPromptInfo);
            H52D_Framework.UIManager.Instance.DestroyUI("CampMainInfo", [H52D_Framework.ViewUpRoot]);
            H52D_Framework.UIManager.Instance.DestroyUI("ReplaceCampView", [H52D_Framework.ViewUpRoot]);
            H52D_Framework.UIManager.Instance.DestroyUI("ReplaceTipView", [H52D_Framework.ViewUpRoot]);
        };
        ReplaceTipView.prototype.OpenView = function () {
            H52D_Framework.UIManager.Instance.CreateUI("CampMemberView", [H52D_Framework.ViewUpRoot, this.camp_Id]);
            H52D_Framework.CampManager.Instance.GetCampPlayInfo(this.camp_Id);
        };
        ReplaceTipView.prototype.OnDestroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent("ReqchangeCamp", Laya.Handler.create(this, this.camp_jion));
        };
        return ReplaceTipView;
    }(ui.camp.ReplaceTipViewUI));
    H52D_Framework.ReplaceTipView = ReplaceTipView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ReplaceTipView.js.map