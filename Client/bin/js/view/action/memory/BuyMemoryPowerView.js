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
    var BuyMemoryPowerView = /** @class */ (function (_super) {
        __extends(BuyMemoryPowerView, _super);
        function BuyMemoryPowerView() {
            var _this = _super.call(this) || this;
            /**买一次体力花费钻石数量 */
            _this._price = 0;
            /**购买体力数量 */
            _this._power = 0;
            /** 剩余购买次数 */
            _this.myNum = 0;
            _this.ViewInit();
            _this.EventInit();
            return _this;
        }
        BuyMemoryPowerView.prototype.ViewInit = function () {
            this._price = H52D_Framework.GameParamConfig["BuyPower"][1];
            this._power = H52D_Framework.GameParamConfig["BuyPower"][2];
            this.say.text = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(14003), this._price, this._power);
            //刷新剩余可购买体力次数
            this.ShowMyNum();
            this.Btn_sure.disabled = this.myNum == 0;
            this.tx_price.text = String(this._price);
            this.ShowPower();
            H52D_Framework.Tick.Loop(1000, this, this.ShowPower);
        };
        BuyMemoryPowerView.prototype.EventInit = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.Btn_close.on(Laya.Event.CLICK, this, this.Btnclick_close);
            this.Btn_sure.on(Laya.Event.CLICK, this, this.Btnclick_sure);
            H52D_Framework.Event.RegistEvent("PowerFrush", Laya.Handler.create(this, this.PowerFrush));
        };
        BuyMemoryPowerView.prototype.PowerFrush = function () {
            //刷新剩余可购买体力次数
            this.ShowMyNum();
            H52D_Framework.TipsLogic.Instance.OpenSystemTips("体力购买成功");
            this.ShowPower();
            H52D_Framework.Tick.Clear(this, this.ShowPower);
            this.myNum = H52D_Framework.GameParamConfig.DailyPowerBuyMaxNum - H52D_Framework.MemoryLogic.Instance.BuyPowerTimes;
            this.residueTimes.innerHTML = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(14004), this.myNum);
            H52D_Framework.Tick.Loop(1000, this, this.ShowPower);
        };
        BuyMemoryPowerView.prototype.ShowPower = function () {
            if (H52D_Framework.MemoryLogic.Instance.Power < H52D_Framework.GameParamConfig["PowerMax"]) {
                this.tx_time.text = "(" + this.FormatTime(H52D_Framework.MemoryLogic.Instance.surplusTime) + ")";
            }
            else {
                this.tx_time.text = "";
                H52D_Framework.Tick.Clear(this, this.ShowPower);
            }
            this.tx_power.text = H52D_Framework.MemoryLogic.Instance.Power + "/" + H52D_Framework.GameParamConfig["PowerMax"];
        };
        //刷新剩余购买次数
        BuyMemoryPowerView.prototype.ShowMyNum = function () {
            this.myNum = H52D_Framework.GameParamConfig.DailyPowerBuyMaxNum - H52D_Framework.MemoryLogic.Instance.BuyPowerTimes;
            if (!this.myNum) {
                this.myNum = 0;
            }
            H52D_Framework.SetHtmlStyle(this.residueTimes, 22, "#e4eafe", "left");
            if (this.myNum == 0) {
                this.residueTimes.innerHTML = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(14004), "<font color='#ff0000'>" + this.myNum + "</font>");
            }
            else {
                this.residueTimes.innerHTML = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(14004), this.myNum);
            }
        };
        //调用买的方法
        BuyMemoryPowerView.prototype.Btnclick_sure = function () {
            var _this = this;
            var play_d_num = H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdDiamonds); //已拥有钻石数量
            if (play_d_num >= this._price) {
                if (this.myNum > 0) {
                    // 调用买体力方法;
                    H52D_Framework.RemoteCall.Instance.Send("K_ReqBuyPower");
                }
                else {
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips("购买次数不足");
                }
            }
            else {
                if (H52D_Framework.IsShieldRecharge()) {
                    var str = H52D_Framework.SysPromptConfig[30060].strPromptInfo;
                    H52D_Framework.TipsLogic.Instance.OpenMessageBox(str, Laya.Handler.create(this, function () {
                        var panel_id = H52D_Framework.ViewUILogic.Instance.OpenPanel;
                        _this.Btnclick_close();
                        H52D_Framework.UIManager.Instance.DestroyUI(_this.name, [_this.parent]);
                    }));
                }
                else {
                    var str = H52D_Framework.SysPromptConfig[10014].strPromptInfo;
                    H52D_Framework.TipsLogic.Instance.OpenMessageBox(str, Laya.Handler.create(this, function () {
                        var panel_id = H52D_Framework.ViewUILogic.Instance.OpenPanel;
                        if (panel_id != E_OpenGrade.SHOP) {
                            H52D_Framework.ViewUILogic.Instance.halfPanel = false;
                            _this.Btnclick_close();
                            H52D_Framework.UIManager.Instance.DestroyUI("MemoryView", [H52D_Framework.ViewDownRoot]);
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
        BuyMemoryPowerView.prototype.Btnclick_close = function () {
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [this.parent]);
        };
        BuyMemoryPowerView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Tick.ClearAll(this);
            H52D_Framework.Event.RemoveEvent("PowerFrush", Laya.Handler.create(this, this.PowerFrush));
        };
        BuyMemoryPowerView.prototype.FormatTime = function (nowDate) {
            var min = Math.floor(nowDate / 60) + "";
            if (min.length < 2)
                min = "0" + min;
            var sec = nowDate % 60 + "";
            if (sec.length < 2)
                sec = "0" + sec;
            return min + ":" + sec;
        };
        return BuyMemoryPowerView;
    }(ui.action.memory.BuyMemoryPowerViewUI));
    H52D_Framework.BuyMemoryPowerView = BuyMemoryPowerView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=BuyMemoryPowerView.js.map