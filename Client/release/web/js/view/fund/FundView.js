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
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("FundView", [
        { url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_common.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_fund.atlas", type: Laya.Loader.ATLAS },
    ]);
    /**
     * @class 分享邀请页面
     * @author zhangyusong
     **/
    var FundView = /** @class */ (function (_super) {
        __extends(FundView, _super);
        function FundView() {
            var _this = _super.call(this) || this;
            /** 面板名字ID */
            _this.VIEW_NAME_ID = 5017;
            /** 描述字 */
            _this.DESCRIPTION_WORD = 7121;
            /** 钻石不够 */
            _this.DIAMONDS = 10014;
            /** 没有永久VIP */
            _this.VIP = 30051;
            /** 您未购买基金 */
            _this.NOBUY = 30052;
            /** 通关可领取 */
            _this.CUSTOMS = 30053;
            _this._bool = true;
            _this.TextControl();
            _this.ViewInit();
            _this.EventInit();
            _this.btn_close.y = wxsclae + 2;
            return _this;
        }
        FundView.prototype.TextControl = function () {
            if (H52D_Framework.IsShieldRecharge() && (!H52D_Framework.IsNotBaiDuSdk()) && !H52D_Framework.IsAD()) {
                this._bool = false;
            }
            if (H52D_Framework.IsShieldRecharge() && H52D_Framework.IsNotBaiDuSdk() && H52D_Framework.IsAD()) {
                this._bool = false;
            }
        };
        FundView.prototype.ViewInit = function () {
            var _this = this;
            this.isad_bg.skin = H52D_Framework.IsAD() ? "ui_fund/img-guanggao-jijin.png" : "ui_fund/img-guanggao-jijin.jpg";
            this.tx_name_bg.text = this.tx_name.text = H52D_Framework.GetInfoAttr.Instance.GetSystemText(this.VIEW_NAME_ID);
            this.tx_money.text = H52D_Framework.GameParamConfig["BuyFoundationNeedDiamond"];
            this.dataList = [];
            for (var i in H52D_Framework.FoundationConfig) {
                var data = H52D_Framework.FoundationConfig[i];
                data["id"] = Number(i);
                this.dataList.push(data);
            }
            this.list_fund.renderHandler = new Laya.Handler(this, function (view, index) {
                var tCfg = _this.dataList[index];
                var customsNum = tCfg["customsNum"];
                var rewardid = tCfg["rewardId"];
                var txShow = view.getChildByName("tx_show");
                H52D_Framework.SetHtmlStyle(txShow, 22, "#ff7a6d", "left");
                var sColor = H52D_Framework.BaseDefine.LabelColor[2];
                if (H52D_Framework.CustomsManager.Instance.CustomsVo.customsOrder < customsNum) {
                    sColor = H52D_Framework.BaseDefine.LabelColor[6];
                }
                var sInfo = H52D_Framework.GetHtmlStrByColor("(" + String(H52D_Framework.CustomsManager.Instance.CustomsVo.customsOrder) + "/" + String(customsNum) + ")", sColor);
                txShow.innerHTML = H52D_Framework.GetInfoAttr.Instance.GetSystemText(_this.DESCRIPTION_WORD, String(customsNum)) + sInfo;
                var btnReward = view.getChildByName("btn_reward");
                var imgComplete = view.getChildByName("img_complete");
                var reward = H52D_Framework.RewardConfig[rewardid]["reWrad"];
                for (var i in reward) {
                    var itemId = reward[i][2];
                    var itemNum = reward[i][3];
                    var model = new H52D_Framework.RewardView(itemId);
                    model.itemNum = itemNum;
                    model.x = 24 + 96 * (Number(i) - 1);
                    model.y = 53;
                    view.addChild(model);
                }
                btnReward.offAll();
                //已经投资
                // if (IsAD()) {
                // 	if (MasterPlayer.Instance.fundBuy) {
                // 		
                // 		imgComplete.visible = !!tCfg["receive"];
                // 		btnReward.visible = !imgComplete.visible;
                // 		btnReward.gray = CustomsManager.Instance.CustomsVo.customsOrder < Number(this.dataList[index]["customsNum"]);
                // 		if (btnReward.visible) {
                // 			btnReward.on(Laya.Event.CLICK, this, this.OnRewardHander, [index]);
                // 		}
                // 	}
                //} else {
                if (H52D_Framework.MasterPlayer.Instance.fundBuy) {
                    imgComplete.visible = !!tCfg["receive"];
                    btnReward.visible = !imgComplete.visible;
                    btnReward.gray = H52D_Framework.CustomsManager.Instance.CustomsVo.customsOrder < Number(_this.dataList[index]["customsNum"]);
                    if (btnReward.visible) {
                        btnReward.on(Laya.Event.CLICK, _this, _this.OnRewardHander, [index]);
                    }
                }
                else {
                    imgComplete.visible = false;
                    btnReward.visible = true;
                    btnReward.gray = true;
                    btnReward.on(Laya.Event.CLICK, _this, function () {
                        H52D_Framework.TipsLogic.Instance.OpenSystemTips(_this.NOBUY);
                    });
                }
                //}
            });
            this.Frush();
        };
        /** 页面刷新 */
        FundView.prototype.Frush = function () {
            this.btn_investment.gray = H52D_Framework.MasterPlayer.Instance.fundBuy;
            this.btn_investment.mouseEnabled = !H52D_Framework.MasterPlayer.Instance.fundBuy;
            this.btn_investment.label = !H52D_Framework.MasterPlayer.Instance.fundBuy ? "投资" : "已投资";
            for (var i in this.dataList) {
                var id = this.dataList[i]["id"];
                this.dataList[i]["receive"] = H52D_Framework.MasterPlayer.Instance.getFundReceive(id);
            }
            this.list_fund.array = this.dataList;
        };
        FundView.prototype.EventInit = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            H52D_Framework.Event.RegistEvent("FundFrush", Laya.Handler.create(this, this.Frush));
            this.btn_close.on(Laya.Event.CLICK, this, this.OnCloseHander);
            this.btn_investment.on(Laya.Event.CLICK, this, this.Investment);
        };
        FundView.prototype.Destroy = function () {
            H52D_Framework.Event.RemoveEvent("FundFrush", Laya.Handler.create(this, this.Frush));
        };
        FundView.prototype.OnCloseHander = function () {
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [this.parent]);
        };
        /** 投资 */
        FundView.prototype.Investment = function () {
            var _this = this;
            if (H52D_Framework.IsAD()) {
                if (H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdDiamonds) >= H52D_Framework.GameParamConfig["BuyFoundationNeedDiamond"]) {
                    H52D_Framework.FundLogic.Instance.ReqBuyFund(true);
                }
                else { //钻石不够
                    if (!this._bool) {
                        var str = H52D_Framework.SysPromptConfig[30073].strPromptInfo;
                        H52D_Framework.TipsLogic.Instance.OpenMessageBox(str, Laya.Handler.create(this, function () {
                        }));
                    }
                    else {
                        H52D_Framework.TipsLogic.Instance.OpenMessageBox(this.DIAMONDS, Laya.Handler.create(this, function () {
                            _this.OnCloseHander();
                            // 钻石充值
                            H52D_Framework.Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
                            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.BOTTOM_SET_PANEL);
                            H52D_Framework.OneTimer(100, function () {
                                H52D_Framework.Event.DispatchEvent("toGemShop");
                            });
                        }));
                    }
                }
            }
            else {
                if (H52D_Framework.MasterPlayer.Instance.player.IsPermanentVip) {
                    if (H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdDiamonds) >= H52D_Framework.GameParamConfig["BuyFoundationNeedDiamond"]) {
                        H52D_Framework.FundLogic.Instance.ReqBuyFund();
                    }
                    else { //钻石不够
                        if (!this._bool) {
                            var str = H52D_Framework.SysPromptConfig[30073].strPromptInfo;
                            H52D_Framework.TipsLogic.Instance.OpenMessageBox(str, Laya.Handler.create(this, function () {
                            }));
                        }
                        else {
                            H52D_Framework.TipsLogic.Instance.OpenMessageBox(this.DIAMONDS, Laya.Handler.create(this, function () {
                                _this.OnCloseHander();
                                // 钻石充值
                                H52D_Framework.Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
                                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.BOTTOM_SET_PANEL);
                                H52D_Framework.OneTimer(100, function () {
                                    H52D_Framework.Event.DispatchEvent("toGemShop");
                                });
                            }));
                        }
                    }
                }
                else {
                    H52D_Framework.TipsLogic.Instance.OpenMessageBox(this.VIP, Laya.Handler.create(this, function () {
                        // 是否前往激活VIP
                        H52D_Framework.UIManager.Instance.CreateUI("VipView", [H52D_Framework.ViewUpRoot]);
                    }));
                }
            }
        };
        /** 领奖 */
        FundView.prototype.OnRewardHander = function (index) {
            var data = this.dataList[index];
            if (H52D_Framework.CustomsManager.Instance.CustomsVo.customsOrder >= Number(data["customsNum"])) {
                H52D_Framework.FundLogic.Instance.ReqGetFundAward(data["id"]);
            }
            else {
                H52D_Framework.SysPromptConfig[this.CUSTOMS];
                H52D_Framework.TipsLogic.Instance.OpenSystemTips(this.CUSTOMS, data["customsNum"]);
            }
        };
        return FundView;
    }(ui.fund.FundViewUI));
    H52D_Framework.FundView = FundView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=FundView.js.map