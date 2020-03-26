module H52D_Framework {
	AddViewResource("ShareHeroView",
		[
			{ url: "res/ui/ui_share.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS }
		]);
	/**
	 * @class 分享英雄页面
	 * @author zhangyusong 
	 **/
	export class ShareHeroView extends ui.share.ShareHeroViewUI {
		private heroId: number;
		constructor(buf) {
			super();
			this.heroId = buf[1];
			this.ViewInit();
			this.EventInit();
		}
		private heroAni:Avatar=null;

		private ViewInit() {
			this.tx_levelup.text = GetInfoAttr.Instance.GetText(6024)
			this.nameTex.text = GetInfoAttr.Instance.GetText(HeroConfig[this.heroId].name)
			let tcfg_hero = HeroConfig[this.heroId];
			let pos = tcfg_hero.position;
			let model = HeroConfig[this.heroId].strFacadeModel;
			this.heroAni=new Avatar( this.exhero )
			this.heroAni.Load( tcfg_hero.strFacadeModel, 1, tcfg_hero.modelScale * 2.6, pos[1], pos[2],
				Laya.Handler.create(this, (heroAins) => {
					heroAins.Play(1, true, true, () => {
					}, true)
				}));
		}

		private EventInit() {
			this.on(Laya.Event.REMOVED, this, this.Destroy)
			this.btn_close.on(Laya.Event.CLICK, this, this.OnClosePanel)
			this.btn_share.on(Laya.Event.CLICK, this, this.OnSharePanel)
		}

		private Destroy() {
			this.offAll();
			if(this.heroAni)
			{
				this.heroAni.Destroy();
				this.heroAni=null;
			}
		}
		
		private OnClosePanel() {
			UIManager.Instance.DestroyUI(this.name, [ViewToppestRoot]);
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
		}
		
		/** 分享 */
		private OnSharePanel() {
			CallShare(ShareType.hero, {["id"]: this.heroId});
			this.OnClosePanel();
		}

	}
}