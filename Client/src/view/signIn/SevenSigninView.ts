/**七日登入页面*/
module H52D_Framework {
	AddViewResource("SevenSigninView",
		[
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_sign.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
		]);

	export class SevenSigninView extends ui.signIn.SevenSigninViewUI {

		private _effectList = {}
		constructor() {
			super();
			this.Init();
			this.AddEvent();
		}
		private Init() {
			if (IsNotBaiDuSdk()) {
				this.baibuImg.visible = false;
				this.sevenSignInList.y = 560;
				this.sevenday.y = 190;
			}
			if (!AdvertisingManager.Instance.bnWXAdertisingTimes) {
				let str = GetInfoAttr.Instance.GetSystemText(30077);
				this.weekqqadw.text = str
				this.weekqqadw.visible = true
			} else {
				this.weekqqadw.visible = false
			}
			this.UpDateList();
			this.type.text = GetInfoAttr.Instance.GetText(5307);
			this.textVip.text = Format(GetInfoAttr.Instance.GetText(7119), GameParamConfig.TotalLoadDay);
		}

		/**添加事件 */
		private AddEvent() {
			this.on(Laya.Event.REMOVED, this, this.OnDestroy);
			this.close.on(Laya.Event.CLICK, this, this.CloseUI);
			Event.RegistEvent('UpDateSevenList', Laya.Handler.create(this, this.UpDateList));
			Event.RegistEvent('changelabelText', Laya.Handler.create(this, this.Changetext));
		}

		private Changetext() {
			if (window["wx"]) {
				this.weekqqadw.visible = SignInLogic.Instance.WeekText;
				if (AdvertisingManager.Instance.bnWXAdertisingTimes) {
					if (SignInLogic.Instance.ReceiveTimes > 1) {
						let str = GetInfoAttr.Instance.GetSystemText(7158, SignInLogic.Instance.ReceiveTimes);
						this.weekqqadw.text = str
						this.weekqqadw.visible = true
					}
				} else {
					this.weekqqadw.text = GetInfoAttr.Instance.GetSystemText(7159);
				}

			} else {
				this.weekqqadw.visible = false
			}
		}

		/**销毁按钮侦听器 */
		private OnDestroy(): void {
			for (let idx in this._effectList) {
				let eff = this._effectList[idx]
				eff.Destroy()
			}
			this._effectList = {}
			this.offAll();
		}

		/**关闭UI */
		private CloseUI() {
			UIManager.Instance.DestroyUI("SevenSigninView", [ViewUpRoot]);
		}

		private AddList() {
			let arr: Array<number> = [];
			let sevenListData = SignInLogic.Instance.SevenListData;
			for (let dayNum in sevenListData) {
				arr.push(Number(dayNum));
			}
			this.sevenSignInList.array = arr;
		}
		private UpDateList() {
			this.AddList();
			this.sevenSignInList.renderHandler = new Laya.Handler(this, this.SetSignInList);
		}

		/** 
		 * 设置每日奖励list样式
         * @param item 单个box
         * @param index 索引
		*/
		private SetSignInList(item, index: number): void {
			let arr = this.sevenSignInList.array;
			let toDayNum: number = arr[index];
			let signInData = SignInLogic.Instance.SevenListData[toDayNum];
			if (window["wx"]) {
				if ((7 <= SignInLogic.Instance.ReceiveTimes) && (AdvertisingManager.Instance.bnWXAdertisingTimes)) {
					item.visible = false
					toDayNum = SignInLogic.Instance.ReceiveTimes
					if (signInData.itemType == BaseDefine.ItemTypePro) {
						let tItem = ItemConfig[signInData.itemId];
						this.sevenBg.skin = BaseDefine.QualityList[tItem.dwItemQuality];
						this.sevenIcon.skin = "ui_icon/" + tItem.strIconID_B;
						this.sevenNum.visible = signInData.itemNum != 1;
						this.sevenNum.text = "x" + signInData.itemNum + "";
						this.sevenName.text = GetInfoAttr.Instance.GetText(tItem.dwItemName);
						if (this._effectList[7] != null) {
							this._effectList[7].Destroy()
						}
						if (toDayNum <= SignInLogic.Instance.ToDayNumSeven) {
							this.sevenday.alpha = 1
						} else {
							this.sevenday.alpha = 0.7
						}
						if ((toDayNum == 7)) {
							this._effectList[toDayNum] = new Avatar(this.sevenBg)
							this._effectList[toDayNum].Load("res/effect/effect_ui_daoju2/effect_ui_daoju2.sk", 1, 5, 72, 72,
								Laya.Handler.create(this, () => {
									this._effectList[toDayNum].Play("effect_ui_daoju2", true, true, () => {
									})
								}));
						}
						this.sevenAlready.visible = signInData.bAlready;
					}
					this.clickSevenBtn.on(Laya.Event.CLICK, this, this.ClickOkBtn, [toDayNum, 6]);
					return;
				}
			}
			if (toDayNum >= 7) {
				item.visible = false
				if (signInData.itemType == BaseDefine.ItemTypePro) {
					let tItem = ItemConfig[signInData.itemId];
					this.sevenBg.skin = BaseDefine.QualityList[tItem.dwItemQuality];
					this.sevenIcon.skin = "ui_icon/" + tItem.strIconID_B;
					this.sevenNum.visible = signInData.itemNum != 1;
					this.sevenNum.text = "x" + signInData.itemNum + "";
					this.sevenName.text = GetInfoAttr.Instance.GetText(tItem.dwItemName);
					if (this._effectList[toDayNum] != null) {
						this._effectList[toDayNum].Destroy()
					}
					if (toDayNum <= SignInLogic.Instance.ToDayNumSeven) {
						this.sevenday.alpha = 1
					} else {
						this.sevenday.alpha = 0.7
					}
					if ((toDayNum == SignInLogic.Instance.ToDayNumSeven) && (!SignInLogic.Instance.toDayAlrSeven)) {
						this._effectList[toDayNum] = new Avatar(this.sevenBg)
						this._effectList[toDayNum].Load("res/effect/effect_ui_daoju2/effect_ui_daoju2.sk", 1, 5, 72, 72,
							Laya.Handler.create(this, () => {
								this._effectList[toDayNum].Play("effect_ui_daoju2", true, true, () => {
								})
							}));
					}
					this.sevenAlready.visible = signInData.bAlready;
				}
				this.clickSevenBtn.on(Laya.Event.CLICK, this, this.ClickOkBtn, [toDayNum]);
				return;
			}
			let name: Laya.Label = item.getChildByName("name");
			let itemBg: Laya.Image = item.getChildByName("itemBg");
			let dayNum: Laya.Label = item.getChildByName("dayNum");
			let already: Laya.Image = item.getChildByName("already");
			let itemIcon: Laya.Image = item.getChildByName("itemIcon");
			let clickBtn: Laya.Button = item.getChildByName("clickBtn");
			let num: Laya.Label = item.getChildByName("num");

			if (this._effectList[toDayNum] != null) {
				this._effectList[toDayNum].Destroy()
			}
			if (window["wx"]) {
				if ((toDayNum == SignInLogic.Instance.ReceiveTimes) && (AdvertisingManager.Instance.bnWXAdertisingTimes)) {
					this._effectList[SignInLogic.Instance.ReceiveTimes] = new Avatar(itemBg)
					this._effectList[SignInLogic.Instance.ReceiveTimes].Load("res/effect/effect_ui_daoju2/effect_ui_daoju2.sk", 1, 2, 50, 50,
						Laya.Handler.create(this, () => {
							this._effectList[SignInLogic.Instance.ReceiveTimes].Play("effect_ui_daoju2", true, true, () => {
							})
						}));
				}
				if (toDayNum <= SignInLogic.Instance.ReceiveTimes) {
					item.alpha = 1
				} else {
					item.alpha = 0.7
				}
			}
			else {
				if ((toDayNum == SignInLogic.Instance.ToDayNumSeven) && (!SignInLogic.Instance.toDayAlrSeven)) {
					this._effectList[toDayNum] = new Avatar(itemBg)
					this._effectList[toDayNum].Load("res/effect/effect_ui_daoju2/effect_ui_daoju2.sk", 1, 2, 50, 50,
						Laya.Handler.create(this, () => {
							this._effectList[toDayNum].Play("effect_ui_daoju2", true, true, () => {
							})
						}));
				}
				if (toDayNum <= SignInLogic.Instance.ToDayNumSeven) {
					item.alpha = 1
				} else {
					item.alpha = 0.7
				}
			}

			num.visible = signInData.itemNum != 1;
			num.text = "x" + signInData.itemNum + "";
			dayNum.text = "第" + arr[index] + "天";
			if (signInData.itemType == BaseDefine.ItemTypePro) {
				let tItem = ItemConfig[signInData.itemId];
				name.text = GetInfoAttr.Instance.GetText(tItem.dwItemName);
				itemBg.skin = BaseDefine.QualityList[tItem.dwItemQuality];
				already.visible = signInData.bAlready;
				itemIcon.skin = "ui_icon/" + tItem.strIconID_B;
			}
			clickBtn.on(Laya.Event.CLICK, this, this.ClickOkBtn, [toDayNum, index]);
		}

		/** 点击领取*/
		private ClickOkBtn(toDayNum, nDay) {
			SignInLogic.Instance.WeekIndx = nDay
			if (window["wx"]) {
				if (SignInLogic.Instance.ReceiveTimes <= toDayNum) {
					if (AdvertisingManager.Instance.bnWXAdertisingTimes) {  //有观看广告次数
						if (SignInLogic.Instance.ReceiveTimes >= toDayNum) {
							UIManager.Instance.CreateUI("AdvertisementView", [ViewUpRoot, AdvertisementType.weekLogin, toDayNum])
						} else {
							let str = GetInfoAttr.Instance.GetSystemText(30076);
							TipsLogic.Instance.OpenSystemTips(str);
						}
					} else { //没有广告次数
						let str = GetInfoAttr.Instance.GetSystemText(30077);
						this.weekqqadw.text = str
						this.weekqqadw.visible = true
						if (this._effectList[toDayNum] != null) {
							this._effectList[toDayNum].Destroy()
						}
					}
					this.weekqqadw.text = GetInfoAttr.Instance.GetSystemText(7159);
				} else {
					TipsLogic.Instance.OpenSystemTips("您今天已经领取过奖励了");
				}
			} else {
				if (toDayNum == SignInLogic.Instance.ToDayNumSeven) {
					if (SignInLogic.Instance.toDayAlrSeven) {
						TipsLogic.Instance.OpenSystemTips("您今天已经领取过奖励了");
						return
					}
					SignInLogic.Instance.SendReqSevenSignIn();
				}
				else if (toDayNum > SignInLogic.Instance.ToDayNumSeven) {
					let str = Format(SysPromptConfig[30041].strPromptInfo, toDayNum);
					TipsLogic.Instance.OpenSystemTips(str);
				} else if (toDayNum < SignInLogic.Instance.ToDayNumSeven) {
					TipsLogic.Instance.OpenSystemTips("您已经领取过该奖励！");
				}
			}
		}
	}
}