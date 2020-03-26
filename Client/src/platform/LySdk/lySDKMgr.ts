/**
* 联运SDK管理类 
*/
module H52D_Framework {
	export class lySDKMgr {
		private static _inst: lySDKMgr;
		public static get Inst() { //单例模式
			if (lySDKMgr._inst == null)
				lySDKMgr._inst = new lySDKMgr();
			return lySDKMgr._inst;
		}

		/**联运平台uid */
		private _uid: string = '';

		/**初始化 */
		public Initialization(): void {
			if (!SDKManager.Instance.isPfLy) {
				return;
			}
			this.RoleLogin()
			this.readyLoad();
		}

		/**获取联运平台uid */
		public get uid(): string {
			return this._uid || '';
		}

		/**联运SDK判断是否是微端 */
		public IsMicroClient(): boolean {
			if (!SDKManager.Instance.isPfLy) {
				return false;
			}
			return lySDKBase.Inst.oSDK.isMicroClient();
		}

		/**请求SDK登陆uid */
		private RoleLogin(): void {
			// 获取到链接参数
			let oUrlData: Object = SDKManager.Instance.GetRequest();
			let hSs: HttpService = new HttpService();
			let postLoginServerUrlHost: string = "https://ssjxzh5-serverlist.gyyx.cn/selserver/serverList_ssbxs.php?";
			if (SDKManager.Instance.isIOSExamine) {
				postLoginServerUrlHost = "https://ssjxzh5-serverlist.gyyx.cn/selserver/serverList_ios.php?";
			}

			// 转换Url
			oUrlData["fp"] = oUrlData["fp"].replace(/\+/g, "%2B");
			oUrlData["fp"] = oUrlData["fp"].replace(/\&/g, "%26");

			// 发起http请求
			let postLoginServerUrl: string = "";
			postLoginServerUrl += "pf=";
			postLoginServerUrl += window["g_pf"];
			postLoginServerUrl += "&token=";
			postLoginServerUrl += oUrlData["token"];
			postLoginServerUrl += "&fp=";
			postLoginServerUrl += oUrlData["fp"];
			postLoginServerUrl += "&timestamp=";
			postLoginServerUrl += oUrlData['timestamp'];
			postLoginServerUrl += "&signType=";
			postLoginServerUrl += oUrlData['signType'];
			postLoginServerUrl += "&sign=";
			postLoginServerUrl += oUrlData['sign'];
			postLoginServerUrl += "&serverGroup=";
			postLoginServerUrl += oUrlData['serverGroup'] || "";
			postLoginServerUrl += "&mType=";
			postLoginServerUrl += oUrlData['mType'] || "";

			let that = this;
			hSs.Request(postLoginServerUrlHost + postLoginServerUrl, null, "get", "text", (d) => {
				console.log("============ ServersFn.getGameInfoFn.success ============", d);
				//canClick=true;
				d = JSON.parse(d);
				if (d.status == 0) {
					that._uid = d.uid;
					LoginLogic.Instance.Login(that._uid);
				} else {
					alert("登录异常！错误码（" + d.status + "）" + "错误信息（" + d.msg + "）");
				}
			});
		}

		/**初始化关注方法 */
		public concernGivePrize(cb): void {
			if (!SDKManager.Instance.isPfLy) {
				return;
			}
			lySDKBase.Inst.concernGivePrize(cb);
		}

		/**cp需要在游戏加载(loading)完成之后调用该方法，以便于我们进行后续操作 */
		public readyLoad(): void {
			if (!SDKManager.Instance.isPfLy) {
				return;
			}
			// cp需要在游戏加载(loading)完成之后调用该方法，以便于我们进行后续操作
			lySDKBase.Inst.readyLoad();
			// 调用SDK支持功能的接口
			lySDKBase.Inst.supportFunction();
			lySDKBase.Inst.supportFunctionAdvert();
			// 初始化分享回调方法
			lySDKBase.Inst.shareCallbackFn();
		}

		/**获取广告功能的支持状态 */
		public GetSupportAdvert(): boolean {
			return lySDKBase.Inst.GetSupportAdvert();
		}

		/**获取所支持的广告类型列表 */
		public GetSupportAdvertType(): any {
			return lySDKBase.Inst.GetSupportAdvertType();
		}
		/**获取分享功能的支持状态 */
		public GetSupportShare(): boolean {
			return lySDKBase.Inst.GetSupportShare();
		}

		/**获取前段分享回调功能的支持状态 */
		public GetSupportinvite(): boolean {
			return lySDKBase.Inst.GetSupportinvite();
		}

		/**获取邀请功能的支持状态 */
		public GetSupportShareNotice(): boolean {
			return lySDKBase.Inst.GetSupportShareNotice();
		}

		/**获取功能是否支持状态 */
		public GetSupport(i_strFunc: string): boolean {
			if (!SDKManager.Instance.isPfLy) {
				return false;
			}
			return lySDKBase.Inst.GetSupport(i_strFunc);
		}

		/**拉起广告 */
		public Advert(adData, cb): void {
			if (!SDKManager.Instance.isPfLy) {
				return;
			}
			lySDKBase.Inst.Advert(adData, cb);
		}
		/**判断用户是否关注 */
		public isConcern(cb): void {
			if (!SDKManager.Instance.isPfLy) {
				return;
			}
			lySDKBase.Inst.isConcern(cb);
		}

		/**拉起分享 */
		public share(): void {
			if (!SDKManager.Instance.isPfLy) {
				return;
			}
			lySDKBase.Inst.share();
		}

		/**注销登陆 */
		public logout(): void {
			if (!SDKManager.Instance.isPfLy) {
				return;
			}
			lySDKBase.Inst.logout();
		}

		/**
		* 下载微端
		* 注意：CP需要先判断支持下载微端功能。且与我方沟通有微端可以下载。 
		*/
		public microClient(): void {
			if (!SDKManager.Instance.isPfLy) {
				return;
			}
			lySDKBase.Inst.microClient();
		}

		/**获取微端信息 */
		//返回 osType,imei,androidId,idfa,idfv,iosId信息
		public microClientInfo(microClientInfo) {
			if (!SDKManager.Instance.isPfLy) {
				return;
			}
			microClientInfo = lySDKBase.Inst.microClientInfo();
			return microClientInfo;
		}

		/**拉起个人中心 */
		public userCenter() {
			if (!SDKManager.Instance.isPfLy) {
				return;
			}
			lySDKBase.Inst.userCenter();
		}

		/**数据上报 */
		public dataReporting(i_eLog: SDKLOGENUM, i_oData: any): void {
			if (!SDKManager.Instance.isPfLy) {
				return;
			}
			lySDKBase.Inst.dataReporting(i_eLog, i_oData);
		}


		/**判定订单成功失败请以支付回调为准 */
		public pay(param) {
			lySDKBase.Inst.pay(param);
		}
	}
}