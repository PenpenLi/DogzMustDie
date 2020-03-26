var H52D_Framework;
(function (H52D_Framework) {
    /**
     * @class 基金管理类
     * @author zhangyusong
     **/
    var FundLogic = /** @class */ (function () {
        function FundLogic() {
        }
        Object.defineProperty(FundLogic, "Instance", {
            get: function () {
                if (FundLogic._instance == null) {
                    FundLogic._instance = new FundLogic();
                }
                return FundLogic._instance;
            },
            enumerable: true,
            configurable: true
        });
        FundLogic.prototype.Initialize = function () {
            this.EventInit();
        };
        FundLogic.prototype.EventInit = function () {
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_RecBuyFund", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_RecGetFundAward", this);
        };
        /** 基金红点 */
        FundLogic.prototype.ShowRedPoint = function () {
            if (H52D_Framework.IsShieldRecharge()) {
                return false;
            }
            var has = false;
            if (H52D_Framework.MasterPlayer.Instance.player.IsPermanentVip) {
                if (H52D_Framework.MasterPlayer.Instance.fundBuy) {
                    for (var i in H52D_Framework.FoundationConfig) {
                        if (H52D_Framework.CustomsManager.Instance.CustomsVo &&
                            H52D_Framework.CustomsManager.Instance.CustomsVo.customsOrder >= H52D_Framework.FoundationConfig[i]["customsNum"] &&
                            !H52D_Framework.MasterPlayer.Instance.getFundReceive(Number(i))) {
                            has = true;
                            break;
                        }
                    }
                }
            }
            return has;
        };
        /** 购买基金 */
        FundLogic.prototype.ReqBuyFund = function (bool) {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqBuyFund", bool);
        };
        /** 领取基金 */
        FundLogic.prototype.ReqGetFundAward = function (fundId) {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqGetFundAward", fundId);
        };
        /** 购买基金回调 */
        FundLogic.prototype.C_RecBuyFund = function (buf) {
            H52D_Framework.MasterPlayer.Instance.fundBuy = true;
            H52D_Framework.TipsLogic.Instance.OpenSystemTips("基金购买成功");
            H52D_Framework.Event.DispatchEvent("ShowControlRedPoint", E_OpenGrade.FUND);
            H52D_Framework.Event.DispatchEvent("FundFrush");
        };
        /** 领取基金回调 */
        FundLogic.prototype.C_RecGetFundAward = function (buf) {
            H52D_Framework.MasterPlayer.Instance.setFundReceive(buf[0], 1);
            H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(buf[1]);
            H52D_Framework.Event.DispatchEvent("ShowControlRedPoint", E_OpenGrade.FUND);
            H52D_Framework.Event.DispatchEvent("FundFrush");
        };
        return FundLogic;
    }());
    H52D_Framework.FundLogic = FundLogic;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=FundLogic.js.map