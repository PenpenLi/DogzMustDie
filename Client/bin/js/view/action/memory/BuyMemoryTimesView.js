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
    H52D_Framework.AddViewResource("BuyMemoryTimesView", [
        { url: "res/ui/ui_ladder.atlas", type: Laya.Loader.ATLAS },
    ]);
    var BuyMemoryTimesView = /** @class */ (function (_super) {
        __extends(BuyMemoryTimesView, _super);
        function BuyMemoryTimesView() {
            var _this = _super.call(this) || this;
            _this.my_num = 0;
            _this.ViewInit();
            _this.EventInit();
            return _this;
        }
        BuyMemoryTimesView.prototype.ViewInit = function () {
            this.data = H52D_Framework.MemoryLogic.Instance.challengeData;
            this.buyTimes = 1;
            this.BuyTimes.text = String(this.buyTimes);
            this.say.text = H52D_Framework.GetInfoAttr.Instance.GetText(14005);
            this.ShowCanBuyTimes();
            this.changeprice();
        };
        BuyMemoryTimesView.prototype.EventInit = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.Btn_close.on(Laya.Event.CLICK, this, this.Btnclick_close);
            this.Btn_sure.on(Laya.Event.CLICK, this, this.Btnclick_sure);
            this.Btn_canle.on(Laya.Event.CLICK, this, this.Btnclick_close);
            this.Btn_reduce.on(Laya.Event.CLICK, this, this.Btnclick_reduce);
            this.Btn_add.on(Laya.Event.CLICK, this, this.Btnclick_add);
            H52D_Framework.Event.RegistEvent("ChallengeFrush", Laya.Handler.create(this, this.ChallengeFrush));
        };
        /** 挑战次数刷新 */
        BuyMemoryTimesView.prototype.ChallengeFrush = function () {
            H52D_Framework.TipsLogic.Instance.OpenSystemTips("购买成功");
            this.ViewInit();
        };
        //改变价格
        BuyMemoryTimesView.prototype.changeprice = function () {
            var path = "<img src= 'ui_icon/icon_prop_013.png' width='24px' height='18px'></img>";
            //买一次多少钱读表还是直接写10
            this._one_prive = 10;
            this._price = this.buyTimes * this._one_prive;
            H52D_Framework.SetHtmlStyle(this.price, 24, "", "center");
            this.price.innerHTML = path + this._price;
            //每次改变时都判定加减按钮是否可以点击
            this.IsAddReduceBtn();
        };
        BuyMemoryTimesView.prototype.ShowCanBuyTimes = function () {
            this.my_num = H52D_Framework.GameParamConfig.CopyBuyMaxNum - H52D_Framework.MemoryLogic.Instance.GetBuyDungeonTimes(H52D_Framework.MemoryType.equip, this.data.CopyId);
            H52D_Framework.SetHtmlStyle(this.residueTimes, 22, "#e4eafe", "left");
            if (this.my_num == 0) {
                this.residueTimes.innerHTML = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(14004), "<font color='#ff0000'>" + this.my_num + "</font>");
            }
            else {
                this.residueTimes.innerHTML = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(14004), this.my_num);
            }
        };
        //加减按钮是否可以点击的判定
        BuyMemoryTimesView.prototype.IsAddReduceBtn = function () {
            if (this.buyTimes == 1) {
                this.Btn_reduce.disabled = true;
            }
            else {
                this.Btn_reduce.disabled = false;
            }
            //判定是否达到上线
            //let arriveTop=this.IsArriveTop();
            if (this.IsArriveTop()) {
                this.Btn_add.disabled = true;
            }
            else {
                this.Btn_add.disabled = false;
            }
        };
        //达到钻石上线        
        BuyMemoryTimesView.prototype.IsArriveTop = function () {
            var result = false;
            //刚进入时判断(初始值为1)
            if (this._one_prive > H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdDiamonds) || this.my_num <= this.buyTimes) {
                return true;
            }
            if ((this.buyTimes + 1) * this._one_prive > H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdDiamonds)
                || this.my_num < this.buyTimes) {
                result = true;
            }
            return result;
        };
        BuyMemoryTimesView.prototype.Btnclick_sure = function () {
            var _this = this;
            var play_d_num = H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdDiamonds); //已拥有钻石数量
            var bool = play_d_num >= this._price ? true : false;
            //更具已有次数和可买次数判断是否能购买次数
            if (bool) {
                this.IsCanBuy = this.my_num >= this.buyTimes ? true : false;
                if (!this.IsCanBuy) {
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips(30069);
                }
                else {
                    // 调用买次数方法
                    H52D_Framework.MemoryLogic.Instance.K_ReqBuyDungeonTimes(H52D_Framework.MemoryType.equip, this.data.CopyId, this.buyTimes);
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
        /**减的购买次数 */
        BuyMemoryTimesView.prototype.Btnclick_reduce = function () {
            if (this.buyTimes <= 1)
                return;
            this.buyTimes -= 1;
            this.IsCanBuy = this.my_num >= this.buyTimes ? true : false;
            this.BuyTimes.text = this.buyTimes + "";
            this.changeprice();
        };
        /**加 购买次数 */
        BuyMemoryTimesView.prototype.Btnclick_add = function () {
            this.buyTimes += 1;
            this.IsCanBuy = this.my_num >= this.buyTimes ? true : false;
            if (this.buyTimes == 1) {
                this.IsCanBuy = false;
            }
            if (this.IsCanBuy) {
                this.BuyTimes.text = this.buyTimes + "";
                this.changeprice();
            }
            else {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("购买次数不足");
            }
        };
        BuyMemoryTimesView.prototype.Btnclick_close = function () {
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [this.parent]);
        };
        BuyMemoryTimesView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent("ChallengeFrush", Laya.Handler.create(this, this.ChallengeFrush));
        };
        return BuyMemoryTimesView;
    }(ui.action.memory.BuyMemoryTimesViewUI));
    H52D_Framework.BuyMemoryTimesView = BuyMemoryTimesView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=BuyMemoryTimesView.js.map