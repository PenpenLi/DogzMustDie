module H52D_Framework {
	AddViewResource("FundView", [
		{ url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
		{ url: "res/ui/ui_common.atlas", type: Laya.Loader.ATLAS },
		{ url: "res/ui/ui_fund.atlas", type: Laya.Loader.ATLAS },
	]);

	/**
	 * @class 分享邀请页面
	 * @author zhangyusong 
	 **/
	export class FundView extends ui.fund.FundViewUI {
		/** 面板名字ID */
		private readonly VIEW_NAME_ID: number = 5017;
		/** 描述字 */
		private readonly DESCRIPTION_WORD: number = 7121;
		/** 钻石不够 */
		private readonly DIAMONDS: number = 10014;
		/** 没有永久VIP */
		private readonly VIP: number = 30051;
		/** 您未购买基金 */
		private readonly NOBUY: number = 30052;
		/** 通关可领取 */
		private readonly CUSTOMS: number = 30053;

		private dataList: Array<Object>;

		private _bool: boolean = true;
		public constructor() {
			super();
			this.TextControl();
			this.ViewInit();
			this.EventInit();
			this.btn_close.y = wxsclae + 2
		}

		private TextControl(){
			if(IsShieldRecharge()&&(!IsNotBaiDuSdk())&&!IsAD()){
				this._bool = false;
			}
			if(IsShieldRecharge()&&IsNotBaiDuSdk()&&IsAD()){
				this._bool = false;
			}
		}

		private ViewInit() {
			this.isad_bg.skin = IsAD() ? "ui_fund/img-guanggao-jijin.png" : "ui_fund/img-guanggao-jijin.jpg"
			this.tx_name_bg.text = this.tx_name.text = GetInfoAttr.Instance.GetSystemText(this.VIEW_NAME_ID);
			this.tx_money.text = GameParamConfig["BuyFoundationNeedDiamond"];
			this.dataList = [];
			for (let i in FoundationConfig) {
				let data: Object = FoundationConfig[i];
				data["id"] = Number(i);
				this.dataList.push(data);
			}
			this.list_fund.renderHandler = new Laya.Handler(this, (view: Laya.Box, index: number) => {
				let tCfg = this.dataList[index]
				let customsNum: number = tCfg["customsNum"];
				let rewardid = tCfg["rewardId"]
				let txShow: Laya.HTMLDivElement = view.getChildByName("tx_show") as Laya.HTMLDivElement;
				SetHtmlStyle(txShow, 22, "#ff7a6d", "left")
				let sColor = BaseDefine.LabelColor[2]
				if (CustomsManager.Instance.CustomsVo.customsOrder < customsNum) {
					sColor = BaseDefine.LabelColor[6];
				}
				let sInfo = GetHtmlStrByColor("(" + String(CustomsManager.Instance.CustomsVo.customsOrder) + "/" + String(customsNum) + ")", sColor);
				txShow.innerHTML = GetInfoAttr.Instance.GetSystemText(this.DESCRIPTION_WORD, String(customsNum)) + sInfo;
				let btnReward: Laya.Button = view.getChildByName("btn_reward") as Laya.Button;
				let imgComplete: Laya.Image = view.getChildByName("img_complete") as Laya.Image;
				let reward: Object = RewardConfig[rewardid]["reWrad"];
				for (let i in reward) {
					let itemId = reward[i][2];
					let itemNum = reward[i][3];
					let model: RewardView = new RewardView(itemId);
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
				if (MasterPlayer.Instance.fundBuy) {
					imgComplete.visible = !!tCfg["receive"];
					btnReward.visible = !imgComplete.visible;
					btnReward.gray = CustomsManager.Instance.CustomsVo.customsOrder < Number(this.dataList[index]["customsNum"]);
					if (btnReward.visible) {
						btnReward.on(Laya.Event.CLICK, this, this.OnRewardHander, [index]);
					}
				}
				else {
					imgComplete.visible = false;
					btnReward.visible = true;
					btnReward.gray = true;
					btnReward.on(Laya.Event.CLICK, this, () => {
						TipsLogic.Instance.OpenSystemTips(this.NOBUY);
					});
				}
				//}

			});
			this.Frush();
		}

		/** 页面刷新 */
		private Frush() {
			this.btn_investment.gray = MasterPlayer.Instance.fundBuy;
			this.btn_investment.mouseEnabled = !MasterPlayer.Instance.fundBuy;
			this.btn_investment.label = !MasterPlayer.Instance.fundBuy ? "投资" : "已投资";
			for (let i in this.dataList) {
				let id: number = this.dataList[i]["id"];
				this.dataList[i]["receive"] = MasterPlayer.Instance.getFundReceive(id);
			}
			this.list_fund.array = this.dataList;
		}

		private EventInit() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			Event.RegistEvent("FundFrush", Laya.Handler.create(this, this.Frush));
			this.btn_close.on(Laya.Event.CLICK, this, this.OnCloseHander);
			this.btn_investment.on(Laya.Event.CLICK, this, this.Investment);
		}

		private Destroy() {
			Event.RemoveEvent("FundFrush", Laya.Handler.create(this, this.Frush));
		}
		private OnCloseHander() {
			UIManager.Instance.DestroyUI(this.name, [this.parent]);
		}

		/** 投资 */
		private Investment() {
			if (IsAD()) {
				if (BagManager.Instance.getItemNumber(BaseDefine.ItemIdDiamonds) >= GameParamConfig["BuyFoundationNeedDiamond"]) {
					FundLogic.Instance.ReqBuyFund(true);
				}
				else {//钻石不够
					if (!this._bool) {
						let str = SysPromptConfig[30073].strPromptInfo
						TipsLogic.Instance.OpenMessageBox(str, Laya.Handler.create(this, () => {
						}));
					}
					else {
						TipsLogic.Instance.OpenMessageBox(this.DIAMONDS, Laya.Handler.create(this, () => {
							this.OnCloseHander();
							// 钻石充值
							Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
							Event.DispatchEvent(EventDefine.BOTTOM_SET_PANEL);
							OneTimer(100, () => {
								Event.DispatchEvent("toGemShop");
							});
						}));
					}
				}
			} else {
				if (MasterPlayer.Instance.player.IsPermanentVip) {
					if (BagManager.Instance.getItemNumber(BaseDefine.ItemIdDiamonds) >= GameParamConfig["BuyFoundationNeedDiamond"]) {
						FundLogic.Instance.ReqBuyFund();
					}
					else {//钻石不够
						if (!this._bool) {
							let str = SysPromptConfig[30073].strPromptInfo
							TipsLogic.Instance.OpenMessageBox(str, Laya.Handler.create(this, () => {
							}));
						} else {
							TipsLogic.Instance.OpenMessageBox(this.DIAMONDS, Laya.Handler.create(this, () => {
								this.OnCloseHander();
								// 钻石充值
								Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
								Event.DispatchEvent(EventDefine.BOTTOM_SET_PANEL);
								OneTimer(100, () => {
									Event.DispatchEvent("toGemShop");
								});
							}));
						}

					}
				}
				else {
					TipsLogic.Instance.OpenMessageBox(this.VIP, Laya.Handler.create(this, () => {
						// 是否前往激活VIP
						UIManager.Instance.CreateUI("VipView", [ViewUpRoot]);
					}));
				}
			}

		}

		/** 领奖 */
		private OnRewardHander(index: number) {
			let data: Object = this.dataList[index];
			if (CustomsManager.Instance.CustomsVo.customsOrder >= Number(data["customsNum"])) {
				FundLogic.Instance.ReqGetFundAward(data["id"]);
			}
			else {
				SysPromptConfig[this.CUSTOMS]
				TipsLogic.Instance.OpenSystemTips(this.CUSTOMS, data["customsNum"]);
			}
		}
	}
}