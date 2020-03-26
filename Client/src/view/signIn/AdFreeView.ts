/** 宝箱掉落 */
module H52D_Framework {
	AddViewResource("AdFreeView",[
			{ url: "res/ui/ui_angle.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_main.atlas", type: Laya.Loader.ATLAS },
		]);

	export class AdFreeView extends ui.signIn.AdFreeViewUI {
		private readonly anglePath: string = "res/player/xiaoxiannv/xxn.sk";
        private readonly angleScale: number = 0.4;
        private readonly boxPath: string = "res/player/box/box.sk";
        private readonly boxScale: number = 0.3;

		private angle:Avatar;
		private box:Avatar;

		constructor() {
			super();
			this.ViewInit();
			this.EventInit();
		}

		private ViewInit() {
			SetHtmlStyle(this.tx_ad, 18, "#020202", "left");
			this.tx_ad.innerHTML = GetInfoAttr.Instance.GetText(7140);
			this.box = new Avatar(this.box_angle);
			this.box.Load(this.boxPath, AvatarDirection.right, this.boxScale, 90, 200, Laya.Handler.create(this, () => {
                this.box.Play(AnimationName.idle, true, true, null, true);
            }));
			this.angle = new Avatar(this.box_angle);
			this.angle.Load(this.anglePath, AvatarDirection.right, this.angleScale, 90, 200, Laya.Handler.create(this, () => {
                this.angle.Play(AnimationName.idle, true, true, null, true);
				this.angle.rotation = 20;
            }));
			this.tx_reward_ad.text = GameParamConfig["advertisementDaiamod"];
		}

		private EventInit() {
			this.on(Laya.Event.REMOVED, this, this.OnDestroy);
			this.btn_close.on(Laya.Event.CLICK, this, this.OnCloseHander);
			this.btn_ad.on(Laya.Event.CLICK, this, this.OnAdHander);
		}
		
        private OnDestroy(){
            this.offAll();
        }

        private OnCloseHander(){
            UIManager.Instance.DestroyUI(this.name,[this.parent]);
        }

		private OnAdHander(){
			//请求领奖
			AdvertisingManager.Instance.K_ReqAdvertising(AdvertisementType.diamond)
			this.OnCloseHander();
		}
	}
}