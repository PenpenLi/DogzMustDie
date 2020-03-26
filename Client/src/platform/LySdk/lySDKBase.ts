/**
* 联运SDK基础类 
*/
module H52D_Framework {
	export class lySDKBase {
		private static _inst: lySDKBase;
		public static get Inst() { //单例模式
			if (lySDKBase._inst == null)
				lySDKBase._inst = new lySDKBase();
			return lySDKBase._inst;
		}

		/**联运SDK */
		private _oSDK: any = window['g_objSDK'];
		/**保存平台对于某些功能的支持情况 */
		private _supportFunction = {};

		/**获取联运平台sdk实例 */
		public get oSDK(): any {
			return this._oSDK;
		}

		/**初始化分享回调方法 */
		public shareCallbackFn(): void {
			let newShareCallback = {
				//shareGivePrize值：boolean型  发放奖励：true;不发放奖励：false
				successFn: function (shareGivePrize) {
					// 分享成功将缓存打包发给服务器
					if (ShareInfo) {
						RemoteCall.Instance.Send("K_ReqShareGame", ShareInfo);
					}
				},
				failFn: function () {
					// alert("重置后的分享失败");
				}
			}
			this._oSDK.shareCallbackFn(newShareCallback);
		}

		/**初始化关注回调方法 */
		public concernGivePrize(cb): void {
			this._oSDK.shareCallbackFn = function () {
				cb && cb();
			};
		}

		/**cp需要在游戏加载(loading)完成之后调用该方法，以便于我们进行后续操作 */
		public readyLoad(): void {
			this._oSDK.readyLoad();
		}

		/**获取功能是否支持状态 */
		public supportFunction() {
			let rsp = this._oSDK.supportFunction();
			this._supportFunction['logout'] = rsp['logout'];
			this._supportFunction['share'] = rsp['share'];
			this._supportFunction['concern'] = rsp['concern'];
			this._supportFunction['microClient'] = rsp['microClient'];
			this._supportFunction['shareTipPop'] = rsp['shareTipPop'];
			this._supportFunction['shareBtnText'] = rsp['shareBtnText'];
			this._supportFunction['invite'] = rsp['invite'];
			this._supportFunction['userCenter'] = rsp['userCenter'];
			this._supportFunction['shareNotice'] = rsp['shareNotice'];
			this._supportFunction['advert'] = rsp['advert'];
		}

		/**获取所支持的广告类型列表0:渠道方决定类型;1:视频类型;2:H5类型 */
		public supportFunctionAdvert() {
			let rsp = this._oSDK.supportFunction();
			this._supportFunction['advertType'] = rsp['advertType'];
		}

		/**获取所支持的广告类型列表 */
		public GetSupportAdvertType(): any {
			return this._supportFunction['advertType'] || ['0'];
		}

		/**获取广告功能的支持状态 */
		public GetSupportAdvert(): boolean {
			return this._supportFunction["advert"] || false;
		}

		/**获取分享功能的支持状态 */
		public GetSupportShare(): boolean {
			return this._supportFunction["share"] || false;
		}

		/**获取前段分享回调功能的支持状态 */
		public GetSupportShareNotice(): boolean {
			return this._supportFunction["shareNotice"] || false;
		}

		/**获取邀请功能的支持状态 */
		public GetSupportinvite(): boolean {
			return this._supportFunction["invite"] || false;
		}



		/**获取某个功能的支持状态 */
		public GetSupport(i_strFunc: string): boolean {
			return this._supportFunction[i_strFunc] || false;
		}

		/**拉起广告 */
		public Advert(adData, cb): void {
			this._oSDK.advert(adData, (status: boolean) => {
				//status值：boolean型  成功了 领取奖励：true;关闭了：false
				if (status) {
					//成功了 领取奖励
					cb.successFn && cb.successFn();
					// AdvertisingManager.Instance.adertisingBack = true;
					Event.DispatchEvent(EventDefine.WATCH_ADVERTISMENT);
				} else {
					cb.failFn && cb.failFn();
					// AdvertisingManager.Instance.adertisingBack = false;
					// Event.DispatchEvent(EventDefine.WATCH_ADVERTISMENT);
				}
			});
		}

		/**判断用户是否关注 */
		public isConcern(cb): void {
			this._oSDK.isConcern((status: boolean) => {
				//status值：boolean型  用户已关注：true;用户未关注：false
				if (status) {
					//关注了
					cb.successFn && cb.successFn();
				} else {
					cb.failFn && cb.failFn();
					// 没有关注的话不需要向服务器上报状态
				}
			});
		}

		/**拉起分享 */
		public share(): void {
			this._oSDK.share();
		}

		/**注销登陆 */
		public logout(): void {
			this._oSDK.logout();
		}

		/**
		* 下载微端
		* 注意：CP需要先判断支持下载微端功能。且与我方沟通有微端可以下载。 
		*/
		public microClient(): void {
			this._oSDK.microClient();
		}

		/**判断是否为微端 */
		public isMicroClient() {
			return this._oSDK.isMicroClient();
		}

		/**获取微端信息 */
		//返回 osType,imei,androidId,idfa,idfv,iosId信息 
		public microClientInfo() {
			return this._oSDK.microClientInfo();
		}

		/**拉起个人中心 */
		public userCenter() {
			this._oSDK.userCenter();
		}

		/**判定订单成功失败请以支付回调为准 */
		public pay(param) {
			this._oSDK.pay(param);
		}

		/**数据上报 */
		public dataReporting(i_eLog: SDKLOGENUM, i_oData: any): void {
			// 没有SDK情况下不能进行上报
			if (this._oSDK) {
				return;
			}
			if (SDKLOGENUM.eSelServer == i_eLog) {
				//完成选服
				this._oSDK.reportSelectServer(i_oData);
			} else if (SDKLOGENUM.eEndLoading == i_eLog) {
				//加载完成
				this._oSDK.readyLoad();
			} else if (SDKLOGENUM.eLevelUp == i_eLog) {
				//角色升级
				this._oSDK.reportRoleInfo(i_oData);
			} else if (SDKLOGENUM.eEnterGame == i_eLog) {
				//进入游戏
				this._oSDK.reportEnterInfo(i_oData);
			} else if (SDKLOGENUM.eRoleUpdate == i_eLog) {
				//变更角色信息数据
				this._oSDK.reportRoleInfoChange(i_oData);
			} else if (SDKLOGENUM.eChargeSuccess == i_eLog) {
				//支付成功
				this._oSDK.reportSendGoodsSuccessInfo(i_oData);
			} else if (SDKLOGENUM.eCreate == i_eLog) {
				//角色创建
				this._oSDK.createRoleInfo(i_oData);
			} else if (SDKLOGENUM.ePreCreateRole == i_eLog) {
				//到达游戏内创建角色场景
				this._oSDK.preCreateRoleInfo(i_oData);
			}
		}
	}
}