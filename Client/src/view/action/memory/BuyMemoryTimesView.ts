/**Created by the LayaAirIDE*/
module H52D_Framework {
	AddViewResource("BuyMemoryTimesView", [
		{ url: "res/ui/ui_ladder.atlas", type: Laya.Loader.ATLAS },

	]);
	export class BuyMemoryTimesView extends ui.action.memory.BuyMemoryTimesViewUI {
		private data: any;
		/** 体力上限 */
		private totlePower: number;
		/** 体力恢复速度 */
		private powerSpeed: number;
		/** 次数 */
		private buyTimes: number;
		private _price: number;
		private _one_prive: number;
		private my_num: number = 0;

		constructor() {
			super();
			this.ViewInit();
			this.EventInit();
		}

		private ViewInit() {
			this.data = MemoryLogic.Instance.challengeData;
			this.buyTimes = 1;
			this.BuyTimes.text = String(this.buyTimes);
			this.say.text = GetInfoAttr.Instance.GetText(14005);
			this.ShowCanBuyTimes();
			this.changeprice();
		}

		private EventInit() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.Btn_close.on(Laya.Event.CLICK, this, this.Btnclick_close);
			this.Btn_sure.on(Laya.Event.CLICK, this, this.Btnclick_sure);
			this.Btn_canle.on(Laya.Event.CLICK, this, this.Btnclick_close);
			this.Btn_reduce.on(Laya.Event.CLICK, this, this.Btnclick_reduce);
			this.Btn_add.on(Laya.Event.CLICK, this, this.Btnclick_add);
			Event.RegistEvent("ChallengeFrush", Laya.Handler.create(this, this.ChallengeFrush));
		}

		/** 挑战次数刷新 */
		private ChallengeFrush() {
			TipsLogic.Instance.OpenSystemTips("购买成功");
			this.ViewInit();
		}

		//改变价格
		private changeprice() {
			let path = "<img src= 'ui_icon/icon_prop_013.png' width='24px' height='18px'></img>";
			//买一次多少钱读表还是直接写10
			this._one_prive = 10;
			this._price = this.buyTimes * this._one_prive;
			SetHtmlStyle(this.price, 24, "", "center")
			this.price.innerHTML = path + this._price;
			//每次改变时都判定加减按钮是否可以点击
			this.IsAddReduceBtn();
		}

		private ShowCanBuyTimes() {
			this.my_num = GameParamConfig.CopyBuyMaxNum - MemoryLogic.Instance.GetBuyDungeonTimes(MemoryType.equip, this.data.CopyId);
			
			 SetHtmlStyle(this.residueTimes,22,"#e4eafe","left");
            if(this.my_num == 0){
                this.residueTimes.innerHTML = Format(GetInfoAttr.Instance.GetText(14004), 
                "<font color='#ff0000'>"+this.my_num+"</font>");
            }
            else{
                this.residueTimes.innerHTML = Format(GetInfoAttr.Instance.GetText(14004), this.my_num);
            }
		}

		//加减按钮是否可以点击的判定
		private IsAddReduceBtn() {
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
		}
		//达到钻石上线        
		private IsArriveTop(): boolean {
			let result: boolean = false;
			//刚进入时判断(初始值为1)
			if (this._one_prive > BagManager.Instance.getItemNumber(BaseDefine.ItemIdDiamonds) || this.my_num <= this.buyTimes) {
				return true;
			}
			if ((this.buyTimes + 1) * this._one_prive > BagManager.Instance.getItemNumber(BaseDefine.ItemIdDiamonds)
				|| this.my_num < this.buyTimes) {
				result = true;
			}
			return result;
		}

		private IsCanBuy: boolean;
		private Btnclick_sure() {
			let play_d_num = BagManager.Instance.getItemNumber(BaseDefine.ItemIdDiamonds);//已拥有钻石数量
			let bool = play_d_num >= this._price ? true : false;
			//更具已有次数和可买次数判断是否能购买次数
			if (bool) {
				this.IsCanBuy = this.my_num >= this.buyTimes ? true : false;
				if (!this.IsCanBuy) {
					TipsLogic.Instance.OpenSystemTips(30069);
				} else {
					// 调用买次数方法
					MemoryLogic.Instance.K_ReqBuyDungeonTimes(MemoryType.equip, this.data.CopyId, this.buyTimes)
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

		/**减的购买次数 */
		private Btnclick_reduce() {
			if (this.buyTimes <= 1) return
			this.buyTimes -= 1;
			this.IsCanBuy = this.my_num >= this.buyTimes ? true : false;
			this.BuyTimes.text = this.buyTimes + "";
			this.changeprice();
		}

		/**加 购买次数 */
		private Btnclick_add() {
			this.buyTimes += 1;
			this.IsCanBuy = this.my_num >= this.buyTimes ? true : false;
			if (this.buyTimes == 1) {
				this.IsCanBuy = false;
			}
			if (this.IsCanBuy) {
				this.BuyTimes.text = this.buyTimes + "";
				this.changeprice();
			} else {
				TipsLogic.Instance.OpenSystemTips("购买次数不足");
			}
		}

		private Btnclick_close() {
			UIManager.Instance.DestroyUI(this.name, [this.parent]);
		}

		private Destroy() {
			this.offAll();
			Event.RemoveEvent("ChallengeFrush", Laya.Handler.create(this, this.ChallengeFrush));
		}
	}
}