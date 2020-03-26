/**VIP*/
module H52D_Framework {
	AddViewResource("VipView",
		[
			{ url: "res/ui/ui_vip.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
		]);
	export class VipView extends ui.vip.VipViewUI {
		private VipChargeCfg = ChargeConfig[4][1];
		/** 倒计时 */
		private countdown: number;

		constructor() {
			super();
			this.Init();
			this.AddEvent();
			this.UpdatePlayerInfo();
			this.AddList();
		}

		private Init() {
			this.contentList.vScrollBarSkin = "";
			let nPrice = this.VipChargeCfg.Price;
			let nMoney = this.VipChargeCfg.Money;
			this.buytext.text = IsAD()?"邀请":nPrice + "元";
			if (window['wx']) {
				this.buytext.text = "邀请"
			}
			this.moneytext.text = "原价" + nMoney;

			(this.buybun.getChildByName("text_2") as Laya.Text).text = IsAD()?"获得2天VIP特权":"获得永久VIP特权";
			(this.buybun.getChildByName("point") as Laya.Image).visible = !IsAD();

			this.text_1.visible = this.text_2.visible = false;
			let VipDiamondDescription = GetInfoAttr.Instance.GetText(GameParamConfig.VipDiamondDescription);
			this.boxDiamondDescription.visible = !IsAD();
			SetHtmlStyle(this.vipDiamondDescription, 24, "#fef5cd", "left");
			this.vipDiamondDescription.innerHTML = VipDiamondDescription;
			Event.DispatchEvent("SetMoneny", [false, "e_vip"]);
		}

		/**添加事件 */
		private AddEvent() {
			this.on(Laya.Event.REMOVED, this, this.OnDestroy);
			this.close.on(Laya.Event.CLICK, this, this.CloseUI);
			this.buybun.on(Laya.Event.CLICK, this, this.Buy);
			// this.invitationbtn.on(Laya.Event.CLICK, this, this.Invitation);
			Event.RegistEvent('UpdateVipInfo', Laya.Handler.create(this, this.UpdatePlayerInfo));
		}

		public UpdatePlayerInfo() {
			this.addNum.visible = !IsAD();
			this.addNum.text = "累计次数：" + MasterPlayer.Instance.invitaVipTimes + "/5次";
			let bIsVip = MasterPlayer.Instance.player.IsVip;

			// 是否是永久VIP
			if (MasterPlayer.Instance.player.ExpirationTime == -1) {
				this.validTime.text = "有效时间：永久激活";
				this.text_1.text = this.text_2.text = GetInfoAttr.Instance.GetText(7115);
				this.text_1.visible = this.text_2.visible = true;
				this.buybun.visible = this.moneytext.visible = false;
			} else {
				this.text_1.visible = this.text_2.visible = false;
				this.buybun.visible = true
				this.moneytext.visible = !IsAD();
				this.countdown = 0;
				if (MasterPlayer.Instance.player.ExpirationTime > Time.serverSecodes) {
					this.countdown = MasterPlayer.Instance.player.ExpirationTime - Time.serverSecodes;
				}
				this.validTime.text = "有效时间：" + GetFormatNumTime(this.countdown);
				if(this.countdown > 0){
					Tick.Loop(1000, this, this.ShowTime);
				}
			}
			this.buybun.disabled = MasterPlayer.Instance.player.IsPermanentVip;
			this.AddList();
			this.contentList.renderHandler = new Laya.Handler(this, this.SetContentList);
		}

		private ShowTime() {
			if (--this.countdown > 0) {
				this.validTime.text = "有效时间：" + GetFormatNumTime(this.countdown);
			}
			else if (this.countdown <= 0) {
				this.countdown = 0;
				Tick.Clear(this, this.ShowTime);
			}
		}
		
		private OnSharePanel() {
			CallShare(ShareType.base);
		}

		/**销毁按钮侦听器 */
		private OnDestroy(): void {
			this.offAll();
			Event.RemoveEvent('UpdateVipInfo', Laya.Handler.create(this, this.UpdatePlayerInfo));

		}

		/**关闭UI */
		private CloseUI() {
			UIManager.Instance.DestroyUI("VipView", [ViewUpRoot]);
			//添加按钮音效
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
		}

		private Buy() {
			if(IsAD()){
				// 邀请
				CallShare(ShareType.base);
			}
			// 购买 
			else{
				BaiDuSDK.Instance.ToRecharge(4, 1, "VIP");
			}
		}


		/**添加List数据 */
		private AddList() {
			// vip特权国际化
			let VipContentDescription = GameParamConfig.VipContentDescription;
			let arr = [];
			for (let strId in VipContentDescription) {
				arr.push(VipContentDescription[strId]);
			}
			this.contentList.array = arr;
			this.contentList.renderHandler = new Laya.Handler(this, this.SetContentList);
		}

		/** 
		 * 设置每日奖励list样式
         * @param item 单个box
         * @param index 索引
		*/
		private SetContentList(item, index: number): void {
			let contentStr: Laya.HTMLDivElement = item.getChildByName("contentStr");
			let arr = this.contentList.array;
			let str = GetInfoAttr.Instance.GetText(arr[index]);
			SetHtmlStyle(contentStr, 20, "#fbe4e0", "left", true);
			contentStr.innerHTML = str;
		}
	}
}