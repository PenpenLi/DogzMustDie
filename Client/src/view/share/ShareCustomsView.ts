module H52D_Framework {
	AddViewResource("ShareCustomsView",
		[
			{ url: "res/ui/ui_share.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS }
		]);
	/**
	 * @class 分享邀请页面
	 * @author zhangyusong 
	 **/
	export class ShareCustomsView extends ui.share.ShareCustomsViewUI {
		/** 关卡数 */
		private order: number;
		private reward: number;
		constructor(buf) {
			super();
			this.order = buf[1];

			this.ViewInit();
			this.EventInit();
		}

		private ViewInit() {
			this.tx_title.text = "恭喜突破" + this.order.toString() + "关";
			let customsList: Array<number> = GameParamConfig.ShareRelationCustoms;
			let rewardList: Array<number> = GameParamConfig.ShareRelationCustomsReward;
			this.reward = 0;
			for (let i in customsList) {
				if (customsList[i] == this.order) {
					this.reward = rewardList[i];
					break;
				}
			}
			this.tx_reward.text = String(this.reward);
			this.strTex.text = GetInfoAttr.Instance.GetText(6034);
		}

		private EventInit() {
			this.on(Laya.Event.REMOVED, this, this.Destroy)
			this.btn_close.on(Laya.Event.CLICK, this, this.OnClosePanel);
			this.btn_share.on(Laya.Event.CLICK, this, this.OnSharePanel);
		}

		private Destroy() {
			this.offAll();
		}

		private OnClosePanel() {
			UIManager.Instance.DestroyUI(this.name, [ViewToppestRoot]);
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
		}

		/** 分享 */
		private OnSharePanel() {
			CallShare(ShareType.customs, { ["id"]: this.order });
			this.OnClosePanel();
		}
	}
}