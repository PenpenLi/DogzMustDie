/**Created by the LayaAirIDE*/
module H52D_Framework {

	AddViewResource("ProfitView",
		[
			{ url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_over.atlas", type: Laya.Loader.ATLAS },
		]);
	/**离线收益 */
	export class ProfitView extends ui.GameOver.ProfitViewUI {
		constructor() {
			super();
			this.Btn_sure.on(Laya.Event.CLICK, this, this.Btnclick_lookAd);
			this.Btn_close.on(Laya.Event.CLICK, this, this.Btn_click);
			this.on(Laya.Event.REMOVED, this, this.OnDestroy);
			Event.RegistEvent(EventDefine.WATCH_ADVERTISMENT, Laya.Handler.create(this, this.WathchADBack));
			this.CampInfo();
		}

		/**设置文本信息 */
		private CampInfo() {
			SetHtmlStyle(this.sys_Info, 20, "#49495b", "left",true);
			this.sys_Info.innerHTML = GetInfoAttr.Instance.GetText(7050);
			if (window["wx"]){
				this.Btn_sure.label = "观看领取";
			}else{
				this.Btn_sure.label ="确定";
			}
			let ward = ProfManager.Instance.AddReward;
			let time = ProfManager.Instance.Time;
			let x: number = ward[1][1];
			let y = x.toFixed(2);
			this.Money_Num.text = ward[1][1];
			if (ward[1][1] > 1000000) {
				ward[1][1] = ward[1][1] / 10000;
				let y = ward[1][1].toFixed(2);
				this.Money_Num.text = y + "W";
			}			
			this.exp_num.text = ward[1][3];
			this.Off_time.text = "离线时间：" + GetFormatTime(time);
		}
			/**关闭按钮事件 */
		private Btnclick_lookAd() {
			if (window["wx"]){
				//this.WathchADBack();
				WatchAD(AdvertisingId.profitView);
			}else{
				this.Btn_click()
			}
		}
		private OnDestroy(){
			this.offAll()
			this.on(Laya.Event.REMOVED, this, this.OnDestroy);
			Event.RemoveEvent(EventDefine.WATCH_ADVERTISMENT, Laya.Handler.create(this, this.WathchADBack));
		}

		/**关闭按钮事件 */
		private Btn_click() {
			UIManager.Instance.DestroyUI("ProfitView", [ViewUpRoot]);
		}

		/** 看广告回调 */
		private WathchADBack() {
			AdvertisingManager.Instance.K_ReqAdvertising(AdvertisementType.LeaveAward)
		}

	}
}