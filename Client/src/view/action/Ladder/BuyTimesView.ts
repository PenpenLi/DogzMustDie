/**Created by the LayaAirIDE*/
module H52D_Framework {

	AddViewResource("BuyTimesView", [
		{ url: "res/ui/ui_ladder.atlas", type: Laya.Loader.ATLAS },

	]);
	export class BuyTimesView extends ui.action.Ladder.BuyTimesViewUI {
		constructor() {
			super();

			this.InitView();
		}

		private InitView() {
			this.ViewEvent();
			this.ViewInfo();
			this.changeprice();
		}

		private ViewEvent() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.Btn_close.on(Laya.Event.CLICK, this, this.Btnclick_close);
			this.Btn_canle.on(Laya.Event.CLICK, this, this.Btnclick_close);
			this.Btn_sure.on(Laya.Event.CLICK, this, this.Btnclick_sure);
			this.Btn_reduce.on(Laya.Event.CLICK, this, this.Btnclick_reduce);
			this.Btn_add.on(Laya.Event.CLICK, this, this.Btnclick_add);
		}
		private _price;
		private changeprice() {
			let path = "<img src= 'ui_icon/icon_prop_013.png' width='24px' height='18px'></img>";
			let _one_prive = GameParamConfig.PurchasePrice;
			this._price = Number(this.BuyTimes.text) * _one_prive;
			SetHtmlStyle(this.price, 28, "", "center")
			this.price.innerHTML = path + this._price;
		}

		private ViewInfo() {
			this.say.text = GetInfoAttr.Instance.GetText(7130);
		}

		private Btnclick_sure() {
			let time = Number(this.BuyTimes.text);
			let play_d_num = BagManager.Instance.getItemNumber(2);
			let bool = play_d_num >= this._price ? true : false;
			if (bool) {
				let b_num = MasterPlayer.Instance.GetEventDayProByType(EventProEnum.BuyLadderTimes);
				this.my_num = MasterPlayer.Instance.player.BuyLaddertimes - b_num;
				LadderManager.Instance.IsCanBuy = this.my_num >= time ? true : false;
				if (!LadderManager.Instance.IsCanBuy) {
					TipsLogic.Instance.OpenSystemTips("购买次数不足");
				} else {
					LadderManager.Instance.BuyTimes(time);
				}
			} else {
				if (IsShieldRecharge()) {
					let str = SysPromptConfig[30060].strPromptInfo;
					TipsLogic.Instance.OpenMessageBox(str,
						Laya.Handler.create(this, () => {
							let panel_id = ViewUILogic.Instance.OpenPanel
							this.Btnclick_close();
							UIManager.Instance.DestroyUI("BuyTimesView", [ViewDownRoot]);
						}));
				} else {
					let str = SysPromptConfig[10014].strPromptInfo;
					TipsLogic.Instance.OpenMessageBox(str,
						Laya.Handler.create(this, () => {
							let panel_id = ViewUILogic.Instance.OpenPanel
							if (panel_id != E_OpenGrade.SHOP) {
								ViewUILogic.Instance.halfPanel = false;
								this.Btnclick_close();
								UIManager.Instance.DestroyUI("LadderView", [ViewDownRoot]);
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
			let time = Number(this.BuyTimes.text);
			if (time <= 1) return
			time -= 1;
			let b_num = MasterPlayer.Instance.GetEventDayProByType(EventProEnum.BuyLadderTimes);
			this.my_num = MasterPlayer.Instance.player.BuyLaddertimes - b_num;
			LadderManager.Instance.IsCanBuy = this.my_num >= time ? true : false;
			this.BuyTimes.text = time + "";
			this.changeprice();
		}

		private my_num
		/**加 购买次数 */
		private Btnclick_add() {
			let time = Number(this.BuyTimes.text);
			time += 1;
			let b_num = MasterPlayer.Instance.GetEventDayProByType(EventProEnum.BuyLadderTimes);
			this.my_num = MasterPlayer.Instance.player.BuyLaddertimes - b_num;
			LadderManager.Instance.IsCanBuy = this.my_num >= time ? true : false;
			if (time == 1) {
				LadderManager.Instance.IsCanBuy = false;
			}
			if (LadderManager.Instance.IsCanBuy) {
				this.BuyTimes.text = time + "";
				this.changeprice();
			} else {
				TipsLogic.Instance.OpenSystemTips("购买次数不足");
			}
		}

		private Btnclick_close() {
			UIManager.Instance.DestroyUI("BuyTimesView", [ViewToppestRoot]);
		}

		private Destroy() {
			this.offAll();
		}
	}
}