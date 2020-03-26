module H52D_Framework {
	AddViewResource("ShareAchievenView",
		[
			{ url: "res/ui/ui_share.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },

		]);
	//领取方式
	export enum AchiDrawType {
		eShareDraw = 0,//分享领取翻倍
		eAchievementDraw = 1, //直接领取
	}
	/**
	 * @class 分享邀请页面
	 * @author zhangyusong 
	 **/
	export class ShareAchievenView extends ui.share.ShareAchievenViewUI {
		private type: number;
		private eventId: number;
		constructor(buf) {
			super();
			this.type = buf[1];
			this.eventId = buf[2];
			this.ViewInit();
			this.EventInit();
		}

		private ViewInit() {
			let achieven: AchievenVo = null;
			for (var key in AchievenManger.Instance.achievenMission) {
				if (AchievenManger.Instance.achievenMission[key].eventId == this.eventId) {
					achieven = AchievenManger.Instance.achievenMission[key];
				}
			}
			this.tx_content.text = GetInfoAttr.Instance.GetText(6025);
			if (achieven) {
				this.tx_nosharenum.text = String(achieven.reward);
				this.tx_sharenum.text = String(achieven.reward * 2);
			}
		}

		private EventInit() {
			this.on(Laya.Event.REMOVED, this, this.Destroy)
			this.btn_close.on(Laya.Event.CLICK, this, this.OnClosePanel)
			//直接领取
			this.btn_receive.on(Laya.Event.CLICK, this, this.OnReceivePanel)
			//分享领取
			this.btn_share.on(Laya.Event.CLICK, this, this.OnSharePanel);
		}

		private Destroy() {
			this.offAll();
		}

		private OnClosePanel() {
			//播放点击音效
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
			UIManager.Instance.DestroyUI(this.name, [ViewToppestRoot]);
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
		}

		/** 直接领取 */
		private OnReceivePanel() {
			this.OnClosePanel();
			AchievenManger.Instance.K_ReqAchievementAward(this.eventId);
		}

		/** 分享领取 */
		private OnSharePanel() {
			CallShare(ShareType.achieven, { ["id"]: this.type, ["eventId"]: this.eventId });
			this.OnClosePanel();
		}
	}
}