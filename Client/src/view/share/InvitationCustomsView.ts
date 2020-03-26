module H52D_Framework {
	AddViewResource("InvitationCustemsView",
		[
			{ url: "res/ui/ui_chat.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_share.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS },
		]);
	/**
	 * @class 分享邀请页面
	 * @author zhangyusong 
	 **/
	export class InvitationCustomsView extends ui.share.InvitationCustomsViewUI {
		/** 面板类型，0助力通关，1助力邀请 */
		private type: number;
		private heroModle: Avatar;
		//奥特鳗
		private heroId: number = 119;

		constructor(buf: any) {
			super();
			this.type = buf[1];
			this.ViewInit();
			this.EventInit();
		}

		private ViewInit() {
			SetHtmlStyle(this.tx_num, 20, "#491a0b", "right", true);
			SetHtmlStyle(this.tx_content, 20, "#491a0b", "left", true);
			this.tx_title.text = this.type == 0 ? "助力通关" : "助力邀请";
			this.btn_customs.label = this.type == 0 ? "即刻通关" : "即刻邀请";
			let daynum: number = MasterPlayer.Instance.dayInviteNum;
			let totlenum: number = GameParamConfig["HelpPassNeedPlayerNum"];
			this.tx_num.innerHTML = "今日已成功邀请人数：<font color='#4e9d3a'>" + daynum + "</font>/" + totlenum + "人";
			this.tx_content.innerHTML = GetInfoAttr.Instance.GetText(this.type == 0 ? 6029 : 6028);
			this.heroModle = new Avatar(this.hero_icon)
			this.heroModle.Load(HeroConfig[this.heroId].strFacadeModel, 1, 0.21, 48, 168,
				Laya.Handler.create(this, () => { this.heroModle.Play(1, true, true, null, true); }));
		}

		private EventInit() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.btn_close.on(Laya.Event.CLICK, this, this.OnClosePanel);
			this.btn_customs.on(Laya.Event.CLICK, this, this.OnCustomsHander);
		}

		private Destroy() {
			this.offAll();
			if (this.heroModle) {
				this.heroModle.Destroy();
				this.heroModle = null;
			}
		}

		private OnClosePanel() {
			UIManager.Instance.DestroyUI(this.name, [ViewToppestRoot]);
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
		}

		/** 即可通关事件 */
		private OnCustomsHander() {
			if (this.type == 0) {
				//使用过直通特权
				MasterPlayer.Instance.invitadunFlag++;
				TipsLogic.Instance.OpenSystemTips(30039);
				CustomsManager.Instance.CustomsThrough();
			}
			this.OnClosePanel();
		}

	}
}