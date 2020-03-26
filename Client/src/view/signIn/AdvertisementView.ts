/** 宝箱掉落 */
module H52D_Framework {
	AddViewResource("AdvertisementView", [
		{ url: "res/ui/ui_angle.atlas", type: Laya.Loader.ATLAS },
	]);

	export class AdvertisementView extends ui.signIn.AdvertisementViewUI {
		/** 广告类型 */
		private type: AdvertisementType;
		/** 广告类型 */
		private adid: string;

		/** 广告倒计时 */
		private adTime: number = 0;

		private _item_id: any;
		private _weekDay_num = 0;

		constructor(buf) {
			super();
			this.type = buf[1];
			this._item_id = buf[2];
			this.ViewInit();
			this.EventInit();
		}

		private ViewInit() {
			switch (this.type) {
				case AdvertisementType.diamond:
					this.DiamondAD();
					break;
				case AdvertisementType.signIn:
					this.SignAD();
					break;
				case AdvertisementType.pvp:
					this.KickingAd();
					break;
				case AdvertisementType.mpRecover:
					this.MpvalueAd();
					break;
				case AdvertisementType.heroPeck:
					this.HeroPeckAD();
					break;
				case AdvertisementType.wroldBoss:
					this.WroldBossAD();
					break;
				case AdvertisementType.ladder:
					this.LadderAD();
					break;
				case AdvertisementType.weekLogin:
					this.WeekLogin();
					break;
				case AdvertisementType.Achievement:
					this.AchievementView();
					break;

			}
		}
		/** 成就广告 */
		private AchievementView() {
			this.adid = AdvertisingId.achevement;
			this.tx_content.text = GetInfoAttr.Instance.GetText(7160);
			this.btn_rec_direct.label = "直接领取";
			this.tx_num.visible = false;
			this.tx_reward_ad.text = "10倍奖励";
			this.icon_ad.visible = false;
		}

		/**七日登录广告版 */
		private WeekLogin() {
			this.adid = AdvertisingId.weeklogin;
			this.btn_rec_direct.visible = false;
			this.tx_num.visible = false;
			this.tx_reward_ad.visible = false;
			this.icon_ad.visible = false;
			this.btn_ad.x = 294;
			this.tx_content.text = GetInfoAttr.Instance.GetSystemText(7157, this._item_id);
		}

		/**天梯 */
		private LadderAD() {
			this.adid = AdvertisingId.ladder;
			this.tx_title.text = GetInfoAttr.Instance.GetText(7138);
			this.tx_content.text = GetInfoAttr.Instance.GetText(7149);
			this.btn_rec_direct.label = "购买次数";
			this.tx_num.visible = false;
			this.tx_reward_ad.text = "挑战次数+1";
			this.icon_ad.visible = false;
		}

		private DisLadderAD() {
			this.btn_ad.gray = true;
		}

		/**世界Boss */
		private WroldBossAD() {
			this.adid = AdvertisingId.boss;
			this.tx_title.text = GetInfoAttr.Instance.GetText(7138);
			this.tx_content.text = GetInfoAttr.Instance.GetText(7153);
			this.btn_ad.x = 286;
			this.btn_rec_direct.visible = false;
			this.tx_num.visible = false;
			this.tx_reward_ad.text = "Buff获得";
			this.icon_ad.visible = false;
		}

		/**限购礼包 广告 */
		private HeroPeckAD() {
			this.adid = AdvertisingId.gift;
			this.tx_title.text = GetInfoAttr.Instance.GetText(7138);
			this.tx_content.text = GetInfoAttr.Instance.GetText(7152);
			this.btn_rec_direct.visible = false;
			this.btn_ad.x = 294;
			this.tx_num.visible = false;
			this.tx_reward_ad.text = "刷新购买次数";
			this.icon_ad.visible = false;
		}

		private DiamondAD() {
			this.adid = AdvertisingId.diamonds;
			this.btn_rec_direct.visible = false;
			this.btn_ad.x = 294;
			this.tx_title.text = GetInfoAttr.Instance.GetTitle(E_OpenGrade.FREE);
			this.tx_content.text = GetInfoAttr.Instance.GetText(7139);
			this.tx_num.text = "剩余次数:" + (GameParamConfig["advertisementDailyNum"] - AdvertisingManager.Instance.GetAdvertisingTimes(AdvertisementType.diamond))
				+ "/" + GameParamConfig["advertisementDailyNum"];
			if (ViewUILogic.Instance.adState == 1) {
				//倒计时
				this.adTime = GameParamConfig["advertisementCD"] - (Time.serverSecodes - ViewUILogic.Instance.adTimeStamp);
				if (this.adTime > 0) {
					Tick.Clear(this, this.OnFrameHander);
					this.tx_reward_ad.text = GetFormatNumTime(this.adTime) + "后可观看";
					this.icon_ad.visible = false;
					Tick.Loop(1000, this, this.OnFrameHander);
				}
				else {
					ViewUILogic.Instance.adState = 2;
				}
			}
			this.AdState();
		}

		/**签到 广告  */
		private SignAD() {
			this.adid = AdvertisingId.sign;
			this.tx_title.text = GetInfoAttr.Instance.GetText(7138);
			this.tx_content.text = GetInfoAttr.Instance.GetText(7148);
			this.tx_reward_ad.text = "三倍奖励";
			this.tx_reward_ad.x = 0;
			this.tx_reward_ad.align = "center";
			this.btn_ad.x = 419;
			this.btn_rec_direct.visible = true;
			this.icon_ad.visible = false;
			this.tx_num.visible = false;
		}

		private KickingAd() {
			this.adid = AdvertisingId.kicking;
			this.tx_title.text = GetInfoAttr.Instance.GetText(7138);
			this.tx_content.text = GetInfoAttr.Instance.GetSystemText(7150);
			this.btn_rec_direct.visible = false;
			this.btn_ad.x = 294;
			this.tx_reward_ad.text = "挑战次数+1";
			this.icon_ad.visible = false;
			this.tx_num.visible = false;
		}

		private MpvalueAd() {
			this.adid = AdvertisingId.skill;
			this.tx_title.text = GetInfoAttr.Instance.GetText(7138);
			this.tx_content.text = GetInfoAttr.Instance.GetSystemText(7146);
			this.btn_rec_direct.visible = false;
			this.btn_ad.x = 294;
			this.btn_ad.label = "观看";
			this.tx_reward_ad.text = "满值恢复";
			this.icon_ad.skin = "ui_icon/icon_prop_014.png"
			this.icon_ad.x = 25;
			this.tx_num.visible = false
		}

		private EventInit() {
			this.on(Laya.Event.REMOVED, this, this.OnDestroy);
			this.btn_close.on(Laya.Event.CLICK, this, this.OnCloseHander);
			this.btn_ad.on(Laya.Event.CLICK, this, this.OnAdHander);
			this.btn_rec_direct.on(Laya.Event.CLICK, this, this.Btn_rec);
			Event.RegistEvent(EventDefine.WATCH_ADVERTISMENT, Laya.Handler.create(this, this.WatchAdBack));
		}

		private OnDestroy() {
			this.offAll();
			Event.RemoveEvent(EventDefine.WATCH_ADVERTISMENT, Laya.Handler.create(this, this.WatchAdBack));
		}

		private OnCloseHander() {
			UIManager.Instance.DestroyUI(this.name, [this.parent]);
		}

		private AdState() {
			this.btn_ad.gray = ViewUILogic.Instance.adState == 1;
			this.btn_ad.mouseEnabled = ViewUILogic.Instance.adState != 1;
			//倒计时
			if (ViewUILogic.Instance.adState == 1) {
				this.btn_ad.label = "观看";
				this.tx_reward_ad.x = 0;
				this.tx_reward_ad.align = "center";
			}
			//观看
			else if (ViewUILogic.Instance.adState == 2) {
				this.btn_ad.label = "观看";
				this.tx_reward_ad.x = this.icon_ad.x + 20;
				this.tx_reward_ad.align = "left";
				this.tx_reward_ad.text = "+" + GameParamConfig["advertisementDaiamod"];
			}
			//领奖
			else if (ViewUILogic.Instance.adState == 3) {
				this.btn_ad.label = "领奖";
				this.tx_reward_ad.x = this.icon_ad.x + 20;
				this.tx_reward_ad.align = "left";
				this.tx_reward_ad.text = GameParamConfig["advertisementDaiamod"];
				Event.DispatchEvent("ShowControlRedPoint", E_OpenGrade.FREE);
			}
			Event.DispatchEvent("AdUpdate");
		}

		private OnFrameHander() {
			if (--this.adTime > 0) {
				this.tx_reward_ad.text = GetFormatNumTime(this.adTime) + "后可观看";
			}
			else {
				Tick.Clear(this, this.OnFrameHander);
				ViewUILogic.Instance.adState = 2;
				this.icon_ad.visible = true;
				this.AdState();
			}
		}

		/** 看广告 */
		private OnAdHander() {
			let times = (AdvertisingManager.Instance.GetAllAdvertisingTimes() < AdvertisingManager.Instance.nWXAdertisingTimes);
			if (!times) {
				TipsLogic.Instance.OpenSystemTips(SysPromptConfig[30071].strPromptInfo);
				this.btn_ad.disabled = true;
				return
			}
			//观看
			if (this.type == AdvertisementType.diamond) {
				if (ViewUILogic.Instance.adState == 2) {
					if (SDKManager.Instance.isWx) {
						WatchAD(AdvertisingId.diamonds);
					}
					else {
						this.WatchAdBack();
						UIManager.Instance.CreateUI("AdFreeView", [ViewUpRoot]);
						this.OnCloseHander();
					}
				}
				//领奖
				else if (ViewUILogic.Instance.adState == 3) {
					//请求领奖
					this.Btn_rec();
				}
			} else if (this.type == AdvertisementType.signIn) {
				if (!times) {
					TipsLogic.Instance.OpenSystemTips(SysPromptConfig[30071].strPromptInfo);
					this.btn_ad.disabled = true;
				}
				else {
					WatchAD(AdvertisingId.sign);
				}
			} 
			else if (this.type == AdvertisementType.weekLogin) {
				if (AdvertisingManager.Instance.bnWXAdertisingTimes) {
					WatchAD(AdvertisingId.weeklogin); //七日登录 未添加
					// this.WatchAdBack()
				} else {
					UIManager.Instance.DestroyUI("AdvertisementView", [ViewUpRoot]);
					SignInLogic.Instance.WeekText = true
					Event.DispatchEvent("changelabelText");					
				}
			}
			else if (this.type == AdvertisementType.Achievement) {
				WatchAD(AdvertisingId.achevement); // 成就广告 未添加
				//this.WatchAdBack()
			}
			else {
				WatchAD(this.adid);
			}
		}

		/**直接领取奖励 */
		private Btn_rec() {
			if (this.type == AdvertisementType.signIn) {
				SignInLogic.Instance.SendReqSignIn();
			}
			else if (this.type == AdvertisementType.ladder) {
				UIManager.Instance.CreateUI("BuyTimesView", [ViewToppestRoot, 16]);
			}
			else if (this.type == AdvertisementType.diamond) {
				AdvertisingManager.Instance.K_ReqAdvertising(AdvertisementType.diamond)
				this.OnCloseHander();
			}
			else if (this.type == AdvertisementType.Achievement) {  //成就奖励
				if (AchievenManger.Instance.achievenType == E_AchievenType.eDay) {
					AchievenManger.Instance.K_ReqDayAchievementAward(this._item_id);
				}
				if (AchievenManger.Instance.achievenType == E_AchievenType.eAchieven) {
					AchievenManger.Instance.K_ReqAchievementAward(this._item_id);
				}
			}
			else {
				AdvertisingManager.Instance.K_ReqAdvertising(AdvertisementType.signIn)
			}
			this.OnCloseHander();
		}

		/** 看广告回调 */
		private WatchAdBack() {
			if (AdvertisingManager.Instance.bnWXAdertisingTimes) {
				if (this.type == AdvertisementType.diamond) {
					ViewUILogic.Instance.adState = 3;
					this.AdState();

				} else if (this.type == AdvertisementType.weekLogin) { ////QQ广告次数
					SignInLogic.Instance.SendReqSevenSignIn(SignInLogic.Instance.WeekIndx)
				}
				else if (this.type == AdvertisementType.Achievement) {
					AdvertisingManager.Instance.K_ReqAdvertising(this.type,AchievenManger.Instance.achievenType,this._item_id);
				}
				else {
					AdvertisingManager.Instance.K_ReqAdvertising(this.type, this._item_id);
				}
				this.OnCloseHander();
			}
			else {
				//没有广告次数
				TipsLogic.Instance.OpenSystemTips(30071);
				this.btn_ad.disabled = true;
			}
		}

	}
}