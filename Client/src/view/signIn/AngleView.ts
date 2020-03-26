/** 小仙女 */
module H52D_Framework {
	AddViewResource("AngleView", [
		{ url: "res/ui/ui_angle.atlas", type: Laya.Loader.ATLAS },
	]);
	export enum AdStage {
		/** 1需要看广告获得翻倍奖励的，弹出看广告二级界面 */
		NeedWatch = 1,
		/** 2不需要看广告的奖励，点击小仙女后宝箱落到地上直接弹出获得道具通用展示界面 */
		NotWatch = 2,
		/** 3必须看广告才能领取奖励，看完广告后再回到这个界面，界面显示一个领取按钮，点击领取奖励，界面底部文本描述国际化ID */
		MustWatch = 3
	}
	export class AngleView extends ui.signIn.AngleViewUI {

		private angleId: number = 0;
		
		private fairyType: number = 0;
		//是否看过广告
		private readAd: boolean = false;
		/** 倍数 */
		private readonly beishu: number = 5;

		constructor(buf: any) {
			super();
			this.angleId = buf[1];
			this.ViewInit();
			this.EventInit();
		}

		private ViewInit() {
			this.tx_title.text = GetInfoAttr.Instance.GetTitle(E_OpenGrade.ANGLE);
			this.readAd = false;
			this.fairyType = FairyConfig[ViewUILogic.Instance.angleType][this.angleId]["fairyType"];
			let rewardId = FairyConfig[ViewUILogic.Instance.angleType][this.angleId]["rewardId"];
			let reward = RewardConfig[rewardId]["reWrad"][1];
			let type = reward[1];
			let rid = reward[2];
			let number_r = Number(reward[3]);
			this.icon_ad.visible = true;
			this.icon_ad.skin = "ui_icon/icon_prop_013.png";
			this.icon_ad.scaleX = 1;
			this.icon_ad.scaleY = 1;
			this.tx_reward_ad.x = 80;
			this.tx_reward_ad.align = "left";
			if (this.fairyType == AdStage.NeedWatch) {
				this.btn_direct.visible = true;
				this.tx_content.text = GetInfoAttr.Instance.GetSystemText(7132);
				if (AdvertisingManager.Instance.hasAngleTimes) {
					this.btn_direct.x = 168;
					this.btn_ad.x = 420;
					if (type == RewardType.Item) {
						if (rid == BaseDefine.ItemIdDiamonds) {
							this.tx_reward.text = String(number_r);
							this.tx_reward_ad.text = String(number_r * this.beishu);
						}
					}
				}
				else {
					this.btn_ad.visible = false;
					this.btn_direct.x = 294;
					if (type == RewardType.Item) {
						if (rid == BaseDefine.ItemIdDiamonds) {
							this.tx_reward.text = String(number_r);
						}
					}
				}
			}
			else if (this.fairyType == AdStage.MustWatch) {
				this.btn_direct.visible = false;
				this.btn_ad.x = 294;
				this.tx_content.text = GetInfoAttr.Instance.GetSystemText(7133);
				if (type == RewardType.Item) {
					let dwItemTypes = ItemConfig[rid]["dwItemTypes"];
					if (dwItemTypes == 33) {
						this.icon_ad.skin = "ui_icon/icon_prop_014.png";
						this.icon_ad.scaleX = 1.2;
						this.icon_ad.scaleY = 1.2;
						this.tx_reward_ad.text = ItemConfig[rid]["dwUseEffect"][1];
					}
					else if (dwItemTypes == 35) {
						this.icon_ad.visible = false;
						this.tx_reward_ad.x = 0;
						this.tx_reward_ad.align = "center";
						this.tx_reward_ad.text = GetInfoAttr.Instance.GetText(ItemConfig[rid]["dwItemName"]);
					}
				}
			}
		}

		private EventInit() {
			this.on(Laya.Event.REMOVED, this, this.OnDestroy);
			this.btn_close.on(Laya.Event.CLICK, this, this.OnCloseHander);
			this.btn_direct.on(Laya.Event.CLICK, this, this.OnDirectHander);
			this.btn_ad.on(Laya.Event.CLICK, this, this.OnAdHander);
			Event.RegistEvent(EventDefine.WATCH_ADVERTISMENT, Laya.Handler.create(this, this.WatchAdBack));
		}

		private OnDestroy() {
			this.offAll();
			Event.RemoveEvent(EventDefine.WATCH_ADVERTISMENT, Laya.Handler.create(this, this.WatchAdBack));
		}

		private OnCloseHander() {
			ViewUILogic.Instance.AngleTimeInit();
			UIManager.Instance.DestroyUI(this.name, [this.parent]);
		}

		/** 直接领奖 */
		private OnDirectHander() {
			ViewUILogic.Instance.isWatch = false;
			ViewUILogic.Instance.K_ReqAngelBeats(this.angleId, this.readAd);
			this.OnCloseHander();
		}

		/** 看广告 */
		private OnAdHander() {
			if (SDKManager.Instance.isWx) {
				WatchAD(AdvertisingId.angle);
			}
			else {
				this.WatchAdBack();
			}
		}

		/** 看广告领奖 */
		private WatchAdBack() {
			ViewUILogic.Instance.AngleTimeInit();
			if (AdvertisingManager.Instance.hasAngleTimes) {
				AdvertisingManager.Instance.AddAdvertisingTimes(AdvertisementType.angelBeats);
				ViewUILogic.Instance.isWatch = true;
				AdvertisingManager.Instance.K_ReqAdvertising(AdvertisementType.angelBeats, 2, this.angleId)
			}
			else{
				ViewUILogic.Instance.isWatch = false;
				this.btn_ad.disabled = true;
			}
			this.OnCloseHander();
		}

	}
}
