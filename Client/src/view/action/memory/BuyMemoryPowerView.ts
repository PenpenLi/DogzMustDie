module H52D_Framework {
    export class BuyMemoryPowerView extends ui.action.memory.BuyMemoryPowerViewUI {
        /**买一次体力花费钻石数量 */
        private _price: number = 0;
        /**购买体力数量 */
        private _power: number = 0;
        /** 剩余购买次数 */
        private myNum: number=0;

        constructor() {
            super();
            this.ViewInit();
            this.EventInit();
        }

        private ViewInit() {
            this._price = GameParamConfig["BuyPower"][1];
            this._power = GameParamConfig["BuyPower"][2];
            this.say.text = Format(GetInfoAttr.Instance.GetText(14003), this._price, this._power);
            //刷新剩余可购买体力次数
            this.ShowMyNum();

            this.Btn_sure.disabled = this.myNum == 0;
            this.tx_price.text = String(this._price);

            this.ShowPower();
            Tick.Loop(1000, this, this.ShowPower);
        }

        private EventInit() {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.Btn_close.on(Laya.Event.CLICK, this, this.Btnclick_close);
            this.Btn_sure.on(Laya.Event.CLICK, this, this.Btnclick_sure);
            Event.RegistEvent("PowerFrush", Laya.Handler.create(this, this.PowerFrush));
        }

        private PowerFrush() {
            //刷新剩余可购买体力次数
            this.ShowMyNum();

            TipsLogic.Instance.OpenSystemTips("体力购买成功");
            this.ShowPower();
            Tick.Clear(this, this.ShowPower);
            this.myNum = GameParamConfig.DailyPowerBuyMaxNum - MemoryLogic.Instance.BuyPowerTimes;
            this.residueTimes.innerHTML = Format(GetInfoAttr.Instance.GetText(14004), this.myNum);
            Tick.Loop(1000, this, this.ShowPower);
        }

        private ShowPower() {
            if (MemoryLogic.Instance.Power < GameParamConfig["PowerMax"]) {
                this.tx_time.text = "(" + this.FormatTime(MemoryLogic.Instance.surplusTime) + ")";
            }
            else {
                this.tx_time.text = "";
                Tick.Clear(this, this.ShowPower);
            }
            this.tx_power.text = MemoryLogic.Instance.Power + "/" + GameParamConfig["PowerMax"];
        }

        //刷新剩余购买次数
        private ShowMyNum() {
            this.myNum = GameParamConfig.DailyPowerBuyMaxNum - MemoryLogic.Instance.BuyPowerTimes;
            if (!this.myNum) {
                this.myNum = 0;
            }
            SetHtmlStyle(this.residueTimes, 22, "#e4eafe", "left");
            if (this.myNum == 0) {
                this.residueTimes.innerHTML = Format(GetInfoAttr.Instance.GetText(14004),
                    "<font color='#ff0000'>" + this.myNum + "</font>");
            }
            else {
                this.residueTimes.innerHTML = Format(GetInfoAttr.Instance.GetText(14004), this.myNum);
            }
        }

        //调用买的方法
        private Btnclick_sure() {
            let play_d_num = BagManager.Instance.getItemNumber(BaseDefine.ItemIdDiamonds);//已拥有钻石数量
            if (play_d_num >= this._price) {
                if (this.myNum > 0) {
                    // 调用买体力方法;
                    RemoteCall.Instance.Send("K_ReqBuyPower");
                } else {
                    TipsLogic.Instance.OpenSystemTips("购买次数不足");
                }
            } else {
                if (IsShieldRecharge()) {
                    let str = SysPromptConfig[30060].strPromptInfo;
                    TipsLogic.Instance.OpenMessageBox(str,
                        Laya.Handler.create(this, () => {
                            let panel_id = ViewUILogic.Instance.OpenPanel
                            this.Btnclick_close();
                            UIManager.Instance.DestroyUI(this.name, [this.parent]);
                        }));
                } else {
                    let str = SysPromptConfig[10014].strPromptInfo;
                    TipsLogic.Instance.OpenMessageBox(str,
                        Laya.Handler.create(this, () => {
                            let panel_id = ViewUILogic.Instance.OpenPanel
                            if (panel_id != E_OpenGrade.SHOP) {
                                ViewUILogic.Instance.halfPanel = false;
                                this.Btnclick_close();
                                UIManager.Instance.DestroyUI("MemoryView", [ViewDownRoot]);
                                Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
                                ViewUILogic.Instance.OpenPanel = E_OpenGrade.SHOP;

                                OneTimer(500, () => {
                                    Event.DispatchEvent("toGemShop");
                                });
                            } else {
                                this.Btnclick_close();
                            }
                        }));
                }
            }
        }

        private Btnclick_close() {
            UIManager.Instance.DestroyUI(this.name, [this.parent]);
        }

        private Destroy() {
            this.offAll();
            Tick.ClearAll(this);
            Event.RemoveEvent("PowerFrush", Laya.Handler.create(this, this.PowerFrush));
        }

        private FormatTime(nowDate: number): string {
            let min: string = Math.floor(nowDate / 60) + "";
            if (min.length < 2) min = "0" + min;
            let sec: string = nowDate % 60 + "";
            if (sec.length < 2) sec = "0" + sec;
            return min + ":" + sec;
        }
    }
}