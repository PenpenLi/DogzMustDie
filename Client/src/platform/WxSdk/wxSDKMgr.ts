/**
* 微信SDK对外接口 
*/
module H52D_Framework {
	export class wxSDKMgr {
		private static _inst: wxSDKMgr;
		public static get Inst() { //单例模式
			if (wxSDKMgr._inst == null)
				wxSDKMgr._inst = new wxSDKMgr();
			return wxSDKMgr._inst;
		}

		/**小游戏openId */
		private _openId: string = '';
		/**小游戏session_key */
		private _sessionKey: string = '';
		/**小游戏已请求过的权限信息 */
		private _settingData: any = {};
		/**获取到的玩家数据 */
		private _userInfo: any = {};
		/**获取玩家的地理位置信息 */
		private _location: any = {};
		/**token信息 */
		private _access_token: string = '';
		/**玩家所有数据 */
		private _allUserData = {
			session_key: '',
			openId: '',
			encryptedData: '',
			iv: '',
			signature: '',
			rawData: ''
		}
		/**系统信息 */
		private _systemInfo: any;
		/**登陆的code */
		private g_jsCode: any;

		/**微信SDK的初始化 */
		public Initialization(cls: any): void {
			Laya.MiniAdpter.init(true, false);
			let init = new wxCfgData(cls);
			this.RoleLogin();
			this.ShowShareMenu();
		}

		/** 玩家登陆游戏 */
		public RoleLogin(cb?: any) {
			// Wx.aldSendEvent("进入首页");
			if (Laya.Browser.window.wx) {
				cb = cb || {};
				let that = this;
				let shareCallBack = {
					successFn: function (res) {
						let query = res["inviter"]
						wxSDKMgr.Inst.GetSystemInfo({});
						wxSDKMgr.Inst.Login(//调用登录
							{
								"successFn": function (res) {
									LoginLogic.Instance.Login(wxSDKMgr.Inst.openId, query);
								},
								"failFn": function (res) {
									console.log("登录失败");
								}
							}
						)
					}
				}
				wxSDKBase.Inst.onShow(shareCallBack);
			}
		}
		/**
		 * 调用登录
		 * @param cb 回调函数
		 */
		public Login(cb?: any) {
			if (Laya.Browser.window.wx) {
				cb = cb || {};
				let that = this;
				let loginCallBack = {
					successFn: function (res) {
						that.g_jsCode = res.code;
						let urlParam = '?code=' + res.code + '&gameId=' + GameId;
						wxSDKBase.Inst.Request(ResUrl + urlParam, () => {
							cb.failFn && cb.failFn();
						}, (res) => {
							res = res['data'];
							that._openId = res['openid'];
							that._sessionKey = res['session_key'];
							that._allUserData['openId'] = res['openid'];
							that._allUserData['session_key'] = res['session_key'];
							that.CheckData(cb);
							cb.successFn && cb.successFn(res);
						}, 'Get', {})
					},
					failFn: function () {
						cb.failFn && cb.failFn();
					}
				}

				// 先获取用户是否授权
				this.GetSetting({
					successFn: (res) => {
						let w = this._systemInfo.windowWidth || 750;
						let h = this._systemInfo.windowHeight || 1200;
						var authSetting = res.authSetting;
						if (authSetting['scope.userInfo'] == true) {
							// 用户已经授权过，获取用户信息之后直接执行登录流程
							let getUserInfoCallBack = {
								successFn: function (res) {
									PfLog.Inst.SendClientLog(400, 0)
									wxSDKBase.Inst.Login(loginCallBack);
								},
								failFn: function () {
									cb.failFn && cb.failFn();
								}
							}
							// 获取用户登录信息
							let param = {
								withCredentials: true,
								lang: ""
							}
							that.GetUserInfo(param, getUserInfoCallBack);
						}
						else {
							PfLog.Inst.SendClientLog(401, 0)
							UIManager.Instance.CreateUI("GetScopeView", [ViewDownRoot]);
							// 用户没有授权的情况下创建按钮获取用户个人信息授权
							let userInfoBtn = Laya.Browser.window.wx.createUserInfoButton({
								type: "image",
								image: LoginIcon,
								style: {
									left: (w - LoginBtnWidth) / 2,
									top: h - LoginBtnHight - 100,
									width: LoginBtnWidth,
									height: LoginBtnHight,
									lineHeight: 40,
									backgroundColor: '#009944',
									color: '#ffffff',
									textAlign: 'center',
									fontSize: 16,
									borderRadius: 4
								}
							})
							userInfoBtn.onTap((res => {
								if (res.errMsg == "getUserInfo:ok") {//如果点击了确定登陆
									// 获取用户登录信息
									let param = {
										withCredentials: true,
										lang: ""
									}
									that.GetUserInfo(param);
									PfLog.Inst.SendClientLog(402, 0)
									UIManager.Instance.DestroyUI("GetScopeView", [ViewDownRoot]);
									userInfoBtn.destroy();//销毁按钮
									wxSDKBase.Inst.Login(loginCallBack);
								} else {
									PfLog.Inst.SendClientLog(403, 0)
									console.log("并没有登陆，点击了取消按钮");
									cb.failFn && cb.failFn();
								}
							}));
						}
					}
				})
			}
		}

		/**
		 * 分享
		 * @param param 分享的参数设置 {content: '', image: '', query: ''}
		 * @param content 分享内容
		 * @param imageUrl 分享的图标
		 * @param cb 分享回调，微信API没有明确标出回调，有可能收不到
		 */
		public Share(param?: any, cb?: any) {
			if (Laya.Browser.window.wx) {
				param = param || {
					title: ShareTitle,
					imageUrl: ShareUrl
				};
				cb = cb || {};
				let shareCallBack = {
					successFn: function (res) {
						cb.successFn && cb.successFn(res);
					},
					failFn: function () {
						cb.failFn && cb.failFn();
					}
				}
				wxSDKBase.Inst.Share(param, shareCallBack);
				// 分享成功将缓存打包发给服务器
				if (ShareInfo) {
					RemoteCall.Instance.Send("K_ReqShareGame", ShareInfo);
				}
			} else {
				// 分享成功将缓存打包发给服务器
				if (ShareInfo) {
					RemoteCall.Instance.Send("K_ReqShareGame", ShareInfo);
				}
			}
		}

		/**
		 * 显示转发按钮
		 * @param param 附加参数 {withShareTicket: false}
		 * @param cb 回调函数
		 */
		public ShowShareMenu(param?: any, cb?: any) {
			// if (Laya.Browser.window.wx) {
			// 	param = param || {};
			// 	cb = cb || {};
			// 	let showShareCallBack = {
			// 		successFn: function (res) {
			// 			cb.successFn && cb.successFn(res);
			// 		},
			// 		failFn: function () {
			// 			cb.failFn && cb.failFn();
			// 		}
			// 	}
			// 	wxSDKBase.Inst.ShowShareMenu(param, showShareCallBack);
			// }
			Wx.showShareMenu({
				// withShareTicket: param['withShareTicket'] || false,
				success() {
					//cb.successFn && cb.successFn();
				},
				fail() {
					//cb.failFn && cb.failFn();
				}
			});
			Wx.aldOnShareAppMessage(() => ({
			// Wx.onShareAppMessage(() => ({
				title: ShareTitle,
				imageUrl: ShareUrl // 图片 URL
			}))
		}

		/**
		 * 隐藏转发按钮
		 * @param cb 回调函数
		 */
		public HideShareMenu(cb?: any) {
			if (Laya.Browser.window.wx) {
				cb = cb || {};
				let hideShareCallBack = {
					successFn: function (res) {
						cb.successFn && cb.successFn(res);
					},
					failFn: function () {
						cb.failFn && cb.failFn();
					}
				}
				wxSDKBase.Inst.HideShareMenu(hideShareCallBack);
			}
		}

		/**
		 * 获取用户信息
		 * @param param 附加参数 {withShareTicket: false, lang: 'en'}
		 * @param cb 回调函数
		 */
		public GetUserInfo(param?: any, cb?: any) {
			if (Laya.Browser.window.wx) {
				param = param || {};
				cb = cb || {};
				let that = this;
				let getUserInfoCallBack = {
					successFn: function (res) {
						that._userInfo = res.userInfo;
						that._allUserData['encryptedData'] = res['encryptedData'];
						that._allUserData['rawData'] = res['rawData'];
						that._allUserData['signature'] = res['signature'];
						that._allUserData['iv'] = res['iv'];
						cb.successFn && cb.successFn(res);
					},
					failFn: function () {
						cb.failFn && cb.failFn();
					}
				}
				wxSDKBase.Inst.GetUserInfo(param, getUserInfoCallBack);
			}
		}

		/**
		 * 获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限
		 * @param cb 回调函数
		 */
		public GetSetting(cb?: any) {
			if (Laya.Browser.window.wx) {
				let that = this;
				cb = cb || {};
				let getSettingCallBack = {
					successFn: function (res) {
						that._settingData = res['authSetting'];
						cb.successFn && cb.successFn(res);
					},
					failFn: function () {
						cb.failFn && cb.failFn();
					}
				}
				wxSDKBase.Inst.GetSetting(getSettingCallBack);
			}
		}

		/**
		 * 调起客户端小程序设置界面 (成功时返回用户授权结果authSetting)
		 * @param cb 回调函数
		 */
		public OpenSetting(cb?: any) {
			if (Laya.Browser.window.wx) {
				let that = this;
				cb = cb || {};
				let openSettingCallBack = {
					successFn: function (res) {
						that._settingData = res;
						cb.successFn && cb.successFn(res);
					},
					failFn: function () {
						cb.failFn && cb.failFn();
					}
				}
				wxSDKBase.Inst.OpenSetting(openSettingCallBack);
			}
		}

		/**
		 * 向用户发起授权请求
		 * @param scope 授权列表('scope.userLocation', 'scope.werun', 'scope.writePhotosAlbum')
		 * @param cb 回调函数
		 */
		public Authorize(scope: string, cb?: any) {
			if (Laya.Browser.window.wx) {
				cb = cb || {};
				let authorizeCallBack = {
					successFn: function () {
						cb.successFn && cb.successFn();
					},
					failFn: function () {
						cb.failFn && cb.failFn();
					}
				}
				wxSDKBase.Inst.Authorize(scope, authorizeCallBack);
			}
		}

		/**
		 * 获取当前的地理位置、速度, 调用前需要用户授权('scope.userLocation')
		 * @param param 附加参数
		 * @param cb 回调函数
		 */
		public GetLocation(param?: any, cb?: any) {
			if (Laya.Browser.window.wx) {
				param = param || {};
				cb = cb || {};
				let that = this;
				let getLocationCallBack = {
					successFn: function (res) {
						that._location = res;
						cb.successFn && cb.successFn(res);
					},
					failFn: function () {
						cb.failFn && cb.failFn();
					}
				}
				wxSDKBase.Inst.GetLocation(param, getLocationCallBack);
			}
		}

		/**
		 * 保存图片到系统相册，需要用户授权('scope.writePhotosAlbum')
		 * @param filePath 图片文件路径，可以是临时文件路径或永久文件路径，不支持网络图片路径
		 * @param cb 回调函数
		 */
		public SaveImageToPhotosAlbum(filePath: string, cb?: any) {
			if (Laya.Browser.window.wx) {
				cb = cb || {};
				let saveImageCallBack = {
					successFn: function (res) {
						cb.successFn && cb.successFn(res);
					},
					failFn: function () {
						cb.failFn && cb.failFn();
					}
				}
				wxSDKBase.Inst.SaveImageToPhotosAlbum(filePath, saveImageCallBack);
			}
		}

		/**获取当前小游戏的权限信息 */
		public GetSettingStatus(str: string): boolean {
			return this._settingData[str] || false;
		}



		/**
		 * 上传微信所需要保存的数据，例如分数等,  
		 * @param key
		 * @param value 
		 * @param cb 回调函数
		 */
		public WxUpload(key: string, value: any, cb?: any) {
			if (Laya.Browser.window.wx) {
				cb = cb || {};
				let saveImageCallBack = {
					successFn: function (res) {
						cb.successFn && cb.successFn(res);
					},
					failFn: function () {
						cb.failFn && cb.failFn();
					}
				}
				wxSDKBase.Inst.WxUpload(key, value, saveImageCallBack);
			}
		}

		/**
		 * 发信息到子域
		 * @param strData 需要转成json的形式 
		 */
		public sendMsgToSub(strData: string, cb?: any) {
			if (Laya.Browser.window.wx) {
				cb = cb || {};
				let saveImageCallBack = {
					successFn: function (res) {
						console.log("错误1  包装成功返回错误");

						cb.successFn && cb.successFn(res);
					},
					failFn: function () {
						cb.failFn && cb.failFn();
					}
				}
				wxSDKBase.Inst.SendMsgToSub(strData, saveImageCallBack);
			}
		}

		/**
		 * 验证玩家数据
		 */
		public CheckData(cb: any) {
			if (Laya.Browser.window.wx) {
				let that = this;
				let obj = {
					rawData: this._allUserData["rawData"],
					signature: this._allUserData["signature"],
					encryptedData: this._allUserData["encryptedData"],
					iv: this._allUserData["iv"],
					session_key: this._allUserData['session_key'],
					gameId: GameId
				}
				wxSDKBase.Inst.Request(ResUrl, () => {
					cb.failFn && cb.failFn();
				}, (res) => {
					if (res.data.status == 0) {
						that._access_token = JSON.parse('' + res.data.access_token).access_token;
						console.log('---------CheckData success--------------------', that._access_token);
					} else {
						console.log(res.data.msg);
						cb.failFn && cb.failFn();
					}
				}, 'Get', obj)
			}
		}

		/**
	 	* 生成二维码
	 	*/
		public Qr_Code(cb?: any) {
			if (Laya.Browser.window.wx) {
				cb = cb || {};
				let saveImageCallBack = {
					successFn: function (res) {
						cb.successFn && cb.successFn(res);
					},
					failFn: function () {
						cb.failFn && cb.failFn();
					}
				}
				wxSDKBase.Inst.QR_Code(wxSDKMgr.Inst.access_token, saveImageCallBack);
			}
		}
		/**删除某一个key的数据*/
		public removeData(key: string, cb?: any) {
			if (Laya.Browser.window.wx) {
				cb = cb || {};
				let saveImageCallBack = {
					successFn: function (res) {
						cb.successFn && cb.successFn(res);
					},
					failFn: function () {
						cb.failFn && cb.failFn();
					}
				}
				wxSDKBase.Inst.RemoveData(key, cb);
			}
		}
		/**拉起Banner广告 */
		public WxBanner(adUnitId?: string, w?: number, cb?: any) {
			if (Laya.Browser.window.wx) {
				cb = cb || {};
				let saveImageCallBack = {
					successFn: function (res) {
						cb.successFn && cb.successFn(res);
					},
					failFn: function () {
						cb.failFn && cb.failFn();
					}
				}
				wxSDKBase.Inst.Establish(adUnitId, w, cb);
			}
		}
		/**销毁Banner广告*/
		public DeBanner() {
			wxSDKBase.Inst.Delete();
		}
		/**拉起激励广告 */
		public WxExcitation_Wx(adUnitId?: string, cb?: any) {
			if (Laya.Browser.window.wx) {
				PfLog.Inst.SendClientLog(4000, 0);
				cb = cb || {};
				let saveImageCallBack = {
					successFn: function (res) {
						PfLog.Inst.SendClientLog(4001, 0);
						cb.successFn && cb.successFn(res);
						// AdvertisingManager.Instance.adertisingBack = true;
						Event.DispatchEvent(EventDefine.WATCH_ADVERTISMENT);
					},
					failFn: function () {
						PfLog.Inst.SendClientLog(4002, 0);
						cb.failFn && cb.failFn();
						// AdvertisingManager.Instance.adertisingBack = false;
						// Event.DispatchEvent(EventDefine.WATCH_ADVERTISMENT);
					}
				}
				wxSDKBase.Inst.Excitation_Wx(adUnitId, saveImageCallBack);
			} else {
				// 如果不是微信SDK直接成功
				// AdvertisingManager.Instance.adertisingBack = true;
				Event.DispatchEvent(EventDefine.WATCH_ADVERTISMENT);
			}
		}

		public WxExcitation_Qq(adUnitId?: string, cb?: any) {
			if (Laya.Browser.window.wx) {
				PfLog.Inst.SendClientLog(4000, 0);
				cb = cb || {};
				let saveImageCallBack = {
					successFn: function (res) {
						PfLog.Inst.SendClientLog(4001, 0);
						cb.successFn && cb.successFn(res);
						// AdvertisingManager.Instance.adertisingBack = true;
						Event.DispatchEvent(EventDefine.WATCH_ADVERTISMENT);
					},
					failFn: function () {
						PfLog.Inst.SendClientLog(4002, 0);
						cb.failFn && cb.failFn();
						// AdvertisingManager.Instance.adertisingBack = false;
						// Event.DispatchEvent(EventDefine.WATCH_ADVERTISMENT);
					}
				}
				wxSDKBase.Inst.Excitation_Qq(adUnitId, saveImageCallBack);
			} else {
				// 如果不是微信SDK直接成功
				// AdvertisingManager.Instance.adertisingBack = true;
				Event.DispatchEvent(EventDefine.WATCH_ADVERTISMENT);
			}
		}
		/**拉起支付 */
		public wxPayment(data: any, cb?: any): void {
			if (Laya.Browser.window.wx) {
				cb = cb || {};
				let payCallBack = {
					successFn: function () {
						cb.successFn && cb.successFn();
					},
					failFn: function () {
						cb.failFn && cb.failFn();
					}
				}
				wxSDKBase.Inst.payment(payCallBack);
			}

		}

		/**
		 * 获取系统信息
		 */
		public GetSystemInfo(cb?: any) {
			if (Laya.Browser.window.wx) {
				cb = cb || {};
				let that = this;
				let getSystemInfoCallBack = {
					successFn: function (res) {
						that._systemInfo = res;
						cb.successFn && cb.successFn(res);
					}
				}
				wxSDKBase.Inst.GetSystemInfo(getSystemInfoCallBack);
			}
		}

		/**重新获取code */
		public GetJSCode(cb: any) {
			let that = this;
			Wx.login({
				success: function (res) {
					that.g_jsCode = res.code;
					cb.successFn && cb.successFn(res);
				},
				fail: function (res) {
					cb.failFn && cb.failFn();
				},
				complete: function (res) { }
			})
		}

		/**获取openId */
		public get openId(): string {
			return this._openId || '';
		}

		/**获取用户信息
		 * string nickName 用户昵称
		 * string avatarUrl 用户头像图片的 URL
		 * number gender 用户性别 0未知 1男性 2女性
		 * string country 用户所在国家
		 * string province 用户所在省份
		 * string city 用户所在城市
		 * string language 显示 country，province，city 所用的语言 en英文 zh_CN简体中文 zh_TW繁体中文
		 */
		public get userInfo(): any {
			return this._userInfo || {};
		}

		/**
		 * 获取到地理位置信息
		 * latitude	number	纬度，范围为 -90~90，负数表示南纬
		 * longitude	number	经度，范围为 -180~180，负数表示西经	
		 * speed	number	速度，单位 m/s	
		 * accuracy	number	位置的精确度	
		 * 	altitude	number	高度，单位 m	>= 1.2.0
		 * verticalAccuracy	number	垂直精度，单位 m（Android 无法获取，返回 0）	>= 1.2.0
		 * horizontalAccuracy	number	水平精度，单位 m	>= 1.2.0
		 */
		public get location(): any {
			return this._location || {};
		}

		public get access_token(): string {
			return this._access_token || '';
		}

		/**
		 * 获取到系统信息
		 * brand	string	手机品牌	1.5.0
		 * model	string	手机型号	
		 * pixelRatio	number	设备像素比
		 * screenWidth	number	屏幕宽度
		 * screenHeight	number	屏幕高度
		 * windowWidth	number	可使用窗口宽度
		 * windowHeight	number	可使用窗口高度
		 * statusBarHeight	number	状态栏的高度
		 * language	string	微信设置的语言
		 * version	string	微信版本号
		 * system	string	操作系统版本
		 * platform	string	客户端平台
		 * fontSizeSetting	number	用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位 px。
		 * SDKVersion	string	客户端基础库版本
		 * benchmarkLevel	number	(仅Android小游戏) 性能等级，-2 或 0：该设备无法运行小游戏，-1：性能未知，>=1 设备性能值，该值越高，设备性能越好 (目前设备最高不到50)
		 */
		public get systemInfo(): any {
			return this._systemInfo;
		}

		public get jsCode(): any {
			return this.g_jsCode;
		}

		/**
  * 跳转另一个程序
  */
		public Jump(appid: string, cb?: any) {
			if (!window["wx"]) {
				return
			}
			let getJumpCallBack = {
				successFn: function (res) {
				},
				failFn: function () {
					cb.fail;
				}
			}
			wxSDKBase.Inst.Jump(appid, getJumpCallBack);
		}
	}
}