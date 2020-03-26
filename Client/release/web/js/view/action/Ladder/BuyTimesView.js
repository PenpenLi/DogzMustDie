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
    H52D_Framework.AddViewResource("BuyTimesView", [
        { url: "res/ui/ui_ladder.atlas", type: Laya.Loader.ATLAS },
    ]);
    var BuyTimesView = /** @class */ (function (_super) {
        __extends(BuyTimesView, _super);
        function BuyTimesView() {
            var _this = _super.call(this) || this;
            _this.InitView();
            return _this;
        }
        BuyTimesView.prototype.InitView = function () {
            this.ViewEvent();
            this.ViewInfo();
            this.changeprice();
        };
        BuyTimesView.prototype.ViewEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.Btn_close.on(Laya.Event.CLICK, this, this.Btnclick_close);
            this.Btn_canle.on(Laya.Event.CLICK, this, this.Btnclick_close);
            this.Btn_sure.on(Laya.Event.CLICK, this, this.Btnclick_sure);
            this.Btn_reduce.on(Laya.Event.CLICK, this, this.Btnclick_reduce);
            this.Btn_add.on(Laya.Event.CLICK, this, this.Btnclick_add);
        };
        BuyTimesView.prototype.changeprice = function () {
            var path = "<img src= 'ui_icon/icon_prop_013.png' width='24px' height='18px'></img>";
            var _one_prive = H52D_Framework.GameParamConfig.PurchasePrice;
            this._price = Number(this.BuyTimes.text) * _one_prive;
            H52D_Framework.SetHtmlStyle(this.price, 28, "", "center");
            this.price.innerHTML = path + this._price;
        };
        BuyTimesView.prototype.ViewInfo = function () {
            this.say.text = H52D_Framework.GetInfoAttr.Instance.GetText(7130);
        };
        BuyTimesView.prototype.Btnclick_sure = function () {
            var _this = this;
            var time = Number(this.BuyTimes.text);
            var play_d_num = H52D_Framework.BagManager.Instance.getItemNumber(2);
            var bool = play_d_num >= this._price ? true : false;
            if (bool) {
                var b_num = H52D_Framework.MasterPlayer.Instance.GetEventDayProByType(EventProEnum.BuyLadderTimes);
                this.my_num = H52D_Framework.MasterPlayer.Instance.player.BuyLaddertimes - b_num;
                H52D_Framework.LadderManager.Instance.IsCanBuy = this.my_num >= time ? true : false;
                if (!H52D_Framework.LadderManager.Instance.IsCanBuy) {
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips("购买次数不足");
                }
                else {
                    H52D_Framework.LadderManager.Instance.BuyTimes(time);
                }
            }
            else {
                if (H52D_Framework.IsShieldRecharge()) {
                    var str = H52D_Framework.SysPromptConfig[30060].strPromptInfo;
                    H52D_Framework.TipsLogic.Instance.OpenMessageBox(str, Laya.Handler.create(this, function () {
                        var panel_id = H52D_Framework.ViewUILogic.Instance.OpenPanel;
                        _this.Btnclick_close();
                        H52D_Framework.UIManager.Instance.DestroyUI("BuyTimesView", [H52D_Framework.ViewDownRoot]);
                    }));
                }
                else {
                    var str = H52D_Framework.SysPromptConfig[10014].strPromptInfo;
                    H52D_Framework.TipsLogic.Instance.OpenMessageBox(str, Laya.Handler.create(this, function () {
                        var panel_id = H52D_Framework.ViewUILogic.Instance.OpenPanel;
                        if (panel_id != E_OpenGrade.SHOP) {
                            H52D_Framework.ViewUILogic.Instance.halfPanel = false;
                            _this.Btnclick_close();
                            H52D_Framework.UIManager.Instance.DestroyUI("LadderView", [H52D_Framework.ViewDownRoot]);
                            H52D_Framework.Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
                            H52D_Framework.ViewUILogic.Instance.OpenPanel = E_OpenGrade.SHOP;
                            H52D_Framework.OneTimer(500, function () {
                                H52D_Framework.Event.DispatchEvent("toGemShop");
                            });
                        }
                        else {
                            _this.Btnclick_close();
                        }
                    }));
                }
            }
        };
        /**减的购买次数 */
        BuyTimesView.prototype.Btnclick_reduce = function () {
            var time = Number(this.BuyTimes.text);
            if (time <= 1)
                return;
            time -= 1;
            var b_num = H52D_Framework.MasterPlayer.Instance.GetEventDayProByType(EventProEnum.BuyLadderTimes);
            this.my_num = H52D_Framework.MasterPlayer.Instance.player.BuyLaddertimes - b_num;
            H52D_Framework.LadderManager.Instance.IsCanBuy = this.my_num >= time ? true : false;
            this.BuyTimes.text = time + "";
            this.changeprice();
        };
        /**加 购买次数 */
        BuyTimesView.prototype.Btnclick_add = function () {
            var time = Number(this.BuyTimes.text);
            time += 1;
            var b_num = H52D_Framework.MasterPlayer.Instance.GetEventDayProByType(EventProEnum.BuyLadderTimes);
            this.my_num = H52D_Framework.MasterPlayer.Instance.player.BuyLaddertimes - b_num;
            H52D_Framework.LadderManager.Instance.IsCanBuy = this.my_num >= time ? true : false;
            if (time == 1) {
                H52D_Framework.LadderManager.Instance.IsCanBuy = false;
            }
            if (H52D_Framework.LadderManager.Instance.IsCanBuy) {
                this.BuyTimes.text = time + "";
                this.changeprice();
            }
            else {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("购买次数不足");
            }
        };
        BuyTimesView.prototype.Btnclick_close = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("BuyTimesView", [H52D_Framework.ViewToppestRoot]);
        };
        BuyTimesView.prototype.Destroy = function () {
            this.offAll();
        };
        return BuyTimesView;
    }(ui.action.Ladder.BuyTimesViewUI));
    H52D_Framework.BuyTimesView = BuyTimesView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=BuyTimesView.js.map