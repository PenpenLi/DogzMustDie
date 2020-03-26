/**
* 微信SDK对外接口
*/
var H52D_Framework;
(function (H52D_Framework) {
    var wxSDKMgr = /** @class */ (function () {
        function wxSDKMgr() {
            /**小游戏openId */
            this._openId = '';
            /**小游戏session_key */
            this._sessionKey = '';
            /**小游戏已请求过的权限信息 */
            this._settingData = {};
            /**获取到的玩家数据 */
            this._userInfo = {};
            /**获取玩家的地理位置信息 */
            this._location = {};
            /**token信息 */
            this._access_token = '';
            /**玩家所有数据 */
            this._allUserData = {
                session_key: '',
                openId: '',
                encryptedData: '',
                iv: '',
                signature: '',
                rawData: ''
            };
        }
        Object.defineProperty(wxSDKMgr, "Inst", {
            get: function () {
                if (wxSDKMgr._inst == null)
                    wxSDKMgr._inst = new wxSDKMgr();
                return wxSDKMgr._inst;
            },
            enumerable: true,
            configurable: true
        });
        /**微信SDK的初始化 */
        wxSDKMgr.prototype.Initialization = function (cls) {
            Laya.MiniAdpter.init(true, false);
            var init = new H52D_Framework.wxCfgData(cls);
            this.RoleLogin();
            this.ShowShareMenu();
        };
        /** 玩家登陆游戏 */
        wxSDKMgr.prototype.RoleLogin = function (cb) {
            // Wx.aldSendEvent("进入首页");
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                var that = this;
                var shareCallBack = {
                    successFn: function (res) {
                        var query = res["inviter"];
                        wxSDKMgr.Inst.GetSystemInfo({});
                        wxSDKMgr.Inst.Login(//调用登录
                        {
                            "successFn": function (res) {
                                H52D_Framework.LoginLogic.Instance.Login(wxSDKMgr.Inst.openId, query);
                            },
                            "failFn": function (res) {
                                console.log("登录失败");
                            }
                        });
                    }
                };
                H52D_Framework.wxSDKBase.Inst.onShow(shareCallBack);
            }
        };
        /**
         * 调用登录
         * @param cb 回调函数
         */
        wxSDKMgr.prototype.Login = function (cb) {
            var _this = this;
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                var that_1 = this;
                var loginCallBack_1 = {
                    successFn: function (res) {
                        that_1.g_jsCode = res.code;
                        var urlParam = '?code=' + res.code + '&gameId=' + H52D_Framework.GameId;
                        H52D_Framework.wxSDKBase.Inst.Request(H52D_Framework.ResUrl + urlParam, function () {
                            cb.failFn && cb.failFn();
                        }, function (res) {
                            res = res['data'];
                            that_1._openId = res['openid'];
                            that_1._sessionKey = res['session_key'];
                            that_1._allUserData['openId'] = res['openid'];
                            that_1._allUserData['session_key'] = res['session_key'];
                            that_1.CheckData(cb);
                            cb.successFn && cb.successFn(res);
                        }, 'Get', {});
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                // 先获取用户是否授权
                this.GetSetting({
                    successFn: function (res) {
                        var w = _this._systemInfo.windowWidth || 750;
                        var h = _this._systemInfo.windowHeight || 1200;
                        var authSetting = res.authSetting;
                        if (authSetting['scope.userInfo'] == true) {
                            // 用户已经授权过，获取用户信息之后直接执行登录流程
                            var getUserInfoCallBack = {
                                successFn: function (res) {
                                    H52D_Framework.PfLog.Inst.SendClientLog(400, 0);
                                    H52D_Framework.wxSDKBase.Inst.Login(loginCallBack_1);
                                },
                                failFn: function () {
                                    cb.failFn && cb.failFn();
                                }
                            };
                            // 获取用户登录信息
                            var param = {
                                withCredentials: true,
                                lang: ""
                            };
                            that_1.GetUserInfo(param, getUserInfoCallBack);
                        }
                        else {
                            H52D_Framework.PfLog.Inst.SendClientLog(401, 0);
                            H52D_Framework.UIManager.Instance.CreateUI("GetScopeView", [H52D_Framework.ViewDownRoot]);
                            // 用户没有授权的情况下创建按钮获取用户个人信息授权
                            var userInfoBtn_1 = Laya.Browser.window.wx.createUserInfoButton({
                                type: "image",
                                image: H52D_Framework.LoginIcon,
                                style: {
                                    left: (w - H52D_Framework.LoginBtnWidth) / 2,
                                    top: h - H52D_Framework.LoginBtnHight - 100,
                                    width: H52D_Framework.LoginBtnWidth,
                                    height: H52D_Framework.LoginBtnHight,
                                    lineHeight: 40,
                                    backgroundColor: '#009944',
                                    color: '#ffffff',
                                    textAlign: 'center',
                                    fontSize: 16,
                                    borderRadius: 4
                                }
                            });
                            userInfoBtn_1.onTap((function (res) {
                                if (res.errMsg == "getUserInfo:ok") { //如果点击了确定登陆
                                    // 获取用户登录信息
                                    var param = {
                                        withCredentials: true,
                                        lang: ""
                                    };
                                    that_1.GetUserInfo(param);
                                    H52D_Framework.PfLog.Inst.SendClientLog(402, 0);
                                    H52D_Framework.UIManager.Instance.DestroyUI("GetScopeView", [H52D_Framework.ViewDownRoot]);
                                    userInfoBtn_1.destroy(); //销毁按钮
                                    H52D_Framework.wxSDKBase.Inst.Login(loginCallBack_1);
                                }
                                else {
                                    H52D_Framework.PfLog.Inst.SendClientLog(403, 0);
                                    console.log("并没有登陆，点击了取消按钮");
                                    cb.failFn && cb.failFn();
                                }
                            }));
                        }
                    }
                });
            }
        };
        /**
         * 分享
         * @param param 分享的参数设置 {content: '', image: '', query: ''}
         * @param content 分享内容
         * @param imageUrl 分享的图标
         * @param cb 分享回调，微信API没有明确标出回调，有可能收不到
         */
        wxSDKMgr.prototype.Share = function (param, cb) {
            if (Laya.Browser.window.wx) {
                param = param || {
                    title: H52D_Framework.ShareTitle,
                    imageUrl: H52D_Framework.ShareUrl
                };
                cb = cb || {};
                var shareCallBack = {
                    successFn: function (res) {
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                H52D_Framework.wxSDKBase.Inst.Share(param, shareCallBack);
                // 分享成功将缓存打包发给服务器
                if (H52D_Framework.ShareInfo) {
                    H52D_Framework.RemoteCall.Instance.Send("K_ReqShareGame", H52D_Framework.ShareInfo);
                }
            }
            else {
                // 分享成功将缓存打包发给服务器
                if (H52D_Framework.ShareInfo) {
                    H52D_Framework.RemoteCall.Instance.Send("K_ReqShareGame", H52D_Framework.ShareInfo);
                }
            }
        };
        /**
         * 显示转发按钮
         * @param param 附加参数 {withShareTicket: false}
         * @param cb 回调函数
         */
        wxSDKMgr.prototype.ShowShareMenu = function (param, cb) {
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
            H52D_Framework.Wx.showShareMenu({
                // withShareTicket: param['withShareTicket'] || false,
                success: function () {
                    //cb.successFn && cb.successFn();
                },
                fail: function () {
                    //cb.failFn && cb.failFn();
                }
            });
            H52D_Framework.Wx.aldOnShareAppMessage(function () { return ({
                // Wx.onShareAppMessage(() => ({
                title: H52D_Framework.ShareTitle,
                imageUrl: H52D_Framework.ShareUrl // 图片 URL
            }); });
        };
        /**
         * 隐藏转发按钮
         * @param cb 回调函数
         */
        wxSDKMgr.prototype.HideShareMenu = function (cb) {
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                var hideShareCallBack = {
                    successFn: function (res) {
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                H52D_Framework.wxSDKBase.Inst.HideShareMenu(hideShareCallBack);
            }
        };
        /**
         * 获取用户信息
         * @param param 附加参数 {withShareTicket: false, lang: 'en'}
         * @param cb 回调函数
         */
        wxSDKMgr.prototype.GetUserInfo = function (param, cb) {
            if (Laya.Browser.window.wx) {
                param = param || {};
                cb = cb || {};
                var that_2 = this;
                var getUserInfoCallBack = {
                    successFn: function (res) {
                        that_2._userInfo = res.userInfo;
                        that_2._allUserData['encryptedData'] = res['encryptedData'];
                        that_2._allUserData['rawData'] = res['rawData'];
                        that_2._allUserData['signature'] = res['signature'];
                        that_2._allUserData['iv'] = res['iv'];
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                H52D_Framework.wxSDKBase.Inst.GetUserInfo(param, getUserInfoCallBack);
            }
        };
        /**
         * 获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限
         * @param cb 回调函数
         */
        wxSDKMgr.prototype.GetSetting = function (cb) {
            if (Laya.Browser.window.wx) {
                var that_3 = this;
                cb = cb || {};
                var getSettingCallBack = {
                    successFn: function (res) {
                        that_3._settingData = res['authSetting'];
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                H52D_Framework.wxSDKBase.Inst.GetSetting(getSettingCallBack);
            }
        };
        /**
         * 调起客户端小程序设置界面 (成功时返回用户授权结果authSetting)
         * @param cb 回调函数
         */
        wxSDKMgr.prototype.OpenSetting = function (cb) {
            if (Laya.Browser.window.wx) {
                var that_4 = this;
                cb = cb || {};
                var openSettingCallBack = {
                    successFn: function (res) {
                        that_4._settingData = res;
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                H52D_Framework.wxSDKBase.Inst.OpenSetting(openSettingCallBack);
            }
        };
        /**
         * 向用户发起授权请求
         * @param scope 授权列表('scope.userLocation', 'scope.werun', 'scope.writePhotosAlbum')
         * @param cb 回调函数
         */
        wxSDKMgr.prototype.Authorize = function (scope, cb) {
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                var authorizeCallBack = {
                    successFn: function () {
                        cb.successFn && cb.successFn();
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                H52D_Framework.wxSDKBase.Inst.Authorize(scope, authorizeCallBack);
            }
        };
        /**
         * 获取当前的地理位置、速度, 调用前需要用户授权('scope.userLocation')
         * @param param 附加参数
         * @param cb 回调函数
         */
        wxSDKMgr.prototype.GetLocation = function (param, cb) {
            if (Laya.Browser.window.wx) {
                param = param || {};
                cb = cb || {};
                var that_5 = this;
                var getLocationCallBack = {
                    successFn: function (res) {
                        that_5._location = res;
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                H52D_Framework.wxSDKBase.Inst.GetLocation(param, getLocationCallBack);
            }
        };
        /**
         * 保存图片到系统相册，需要用户授权('scope.writePhotosAlbum')
         * @param filePath 图片文件路径，可以是临时文件路径或永久文件路径，不支持网络图片路径
         * @param cb 回调函数
         */
        wxSDKMgr.prototype.SaveImageToPhotosAlbum = function (filePath, cb) {
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                var saveImageCallBack = {
                    successFn: function (res) {
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                H52D_Framework.wxSDKBase.Inst.SaveImageToPhotosAlbum(filePath, saveImageCallBack);
            }
        };
        /**获取当前小游戏的权限信息 */
        wxSDKMgr.prototype.GetSettingStatus = function (str) {
            return this._settingData[str] || false;
        };
        /**
         * 上传微信所需要保存的数据，例如分数等,
         * @param key
         * @param value
         * @param cb 回调函数
         */
        wxSDKMgr.prototype.WxUpload = function (key, value, cb) {
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                var saveImageCallBack = {
                    successFn: function (res) {
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                H52D_Framework.wxSDKBase.Inst.WxUpload(key, value, saveImageCallBack);
            }
        };
        /**
         * 发信息到子域
         * @param strData 需要转成json的形式
         */
        wxSDKMgr.prototype.sendMsgToSub = function (strData, cb) {
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                var saveImageCallBack = {
                    successFn: function (res) {
                        console.log("错误1  包装成功返回错误");
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                H52D_Framework.wxSDKBase.Inst.SendMsgToSub(strData, saveImageCallBack);
            }
        };
        /**
         * 验证玩家数据
         */
        wxSDKMgr.prototype.CheckData = function (cb) {
            if (Laya.Browser.window.wx) {
                var that_6 = this;
                var obj = {
                    rawData: this._allUserData["rawData"],
                    signature: this._allUserData["signature"],
                    encryptedData: this._allUserData["encryptedData"],
                    iv: this._allUserData["iv"],
                    session_key: this._allUserData['session_key'],
                    gameId: H52D_Framework.GameId
                };
                H52D_Framework.wxSDKBase.Inst.Request(H52D_Framework.ResUrl, function () {
                    cb.failFn && cb.failFn();
                }, function (res) {
                    if (res.data.status == 0) {
                        that_6._access_token = JSON.parse('' + res.data.access_token).access_token;
                        console.log('---------CheckData success--------------------', that_6._access_token);
                    }
                    else {
                        console.log(res.data.msg);
                        cb.failFn && cb.failFn();
                    }
                }, 'Get', obj);
            }
        };
        /**
        * 生成二维码
        */
        wxSDKMgr.prototype.Qr_Code = function (cb) {
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                var saveImageCallBack = {
                    successFn: function (res) {
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                H52D_Framework.wxSDKBase.Inst.QR_Code(wxSDKMgr.Inst.access_token, saveImageCallBack);
            }
        };
        /**删除某一个key的数据*/
        wxSDKMgr.prototype.removeData = function (key, cb) {
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                var saveImageCallBack = {
                    successFn: function (res) {
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                H52D_Framework.wxSDKBase.Inst.RemoveData(key, cb);
            }
        };
        /**拉起Banner广告 */
        wxSDKMgr.prototype.WxBanner = function (adUnitId, w, cb) {
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                var saveImageCallBack = {
                    successFn: function (res) {
                        cb.successFn && cb.successFn(res);
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                H52D_Framework.wxSDKBase.Inst.Establish(adUnitId, w, cb);
            }
        };
        /**销毁Banner广告*/
        wxSDKMgr.prototype.DeBanner = function () {
            H52D_Framework.wxSDKBase.Inst.Delete();
        };
        /**拉起激励广告 */
        wxSDKMgr.prototype.WxExcitation_Wx = function (adUnitId, cb) {
            if (Laya.Browser.window.wx) {
                H52D_Framework.PfLog.Inst.SendClientLog(4000, 0);
                cb = cb || {};
                var saveImageCallBack = {
                    successFn: function (res) {
                        H52D_Framework.PfLog.Inst.SendClientLog(4001, 0);
                        cb.successFn && cb.successFn(res);
                        // AdvertisingManager.Instance.adertisingBack = true;
                        H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.WATCH_ADVERTISMENT);
                    },
                    failFn: function () {
                        H52D_Framework.PfLog.Inst.SendClientLog(4002, 0);
                        cb.failFn && cb.failFn();
                        // AdvertisingManager.Instance.adertisingBack = false;
                        // Event.DispatchEvent(EventDefine.WATCH_ADVERTISMENT);
                    }
                };
                H52D_Framework.wxSDKBase.Inst.Excitation_Wx(adUnitId, saveImageCallBack);
            }
            else {
                // 如果不是微信SDK直接成功
                // AdvertisingManager.Instance.adertisingBack = true;
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.WATCH_ADVERTISMENT);
            }
        };
        wxSDKMgr.prototype.WxExcitation_Qq = function (adUnitId, cb) {
            if (Laya.Browser.window.wx) {
                H52D_Framework.PfLog.Inst.SendClientLog(4000, 0);
                cb = cb || {};
                var saveImageCallBack = {
                    successFn: function (res) {
                        H52D_Framework.PfLog.Inst.SendClientLog(4001, 0);
                        cb.successFn && cb.successFn(res);
                        // AdvertisingManager.Instance.adertisingBack = true;
                        H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.WATCH_ADVERTISMENT);
                    },
                    failFn: function () {
                        H52D_Framework.PfLog.Inst.SendClientLog(4002, 0);
                        cb.failFn && cb.failFn();
                        // AdvertisingManager.Instance.adertisingBack = false;
                        // Event.DispatchEvent(EventDefine.WATCH_ADVERTISMENT);
                    }
                };
                H52D_Framework.wxSDKBase.Inst.Excitation_Qq(adUnitId, saveImageCallBack);
            }
            else {
                // 如果不是微信SDK直接成功
                // AdvertisingManager.Instance.adertisingBack = true;
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.WATCH_ADVERTISMENT);
            }
        };
        /**拉起支付 */
        wxSDKMgr.prototype.wxPayment = function (data, cb) {
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                var payCallBack = {
                    successFn: function () {
                        cb.successFn && cb.successFn();
                    },
                    failFn: function () {
                        cb.failFn && cb.failFn();
                    }
                };
                H52D_Framework.wxSDKBase.Inst.payment(payCallBack);
            }
        };
        /**
         * 获取系统信息
         */
        wxSDKMgr.prototype.GetSystemInfo = function (cb) {
            if (Laya.Browser.window.wx) {
                cb = cb || {};
                var that_7 = this;
                var getSystemInfoCallBack = {
                    successFn: function (res) {
                        that_7._systemInfo = res;
                        cb.successFn && cb.successFn(res);
                    }
                };
                H52D_Framework.wxSDKBase.Inst.GetSystemInfo(getSystemInfoCallBack);
            }
        };
        /**重新获取code */
        wxSDKMgr.prototype.GetJSCode = function (cb) {
            var that = this;
            H52D_Framework.Wx.login({
                success: function (res) {
                    that.g_jsCode = res.code;
                    cb.successFn && cb.successFn(res);
                },
                fail: function (res) {
                    cb.failFn && cb.failFn();
                },
                complete: function (res) { }
            });
        };
        Object.defineProperty(wxSDKMgr.prototype, "openId", {
            /**获取openId */
            get: function () {
                return this._openId || '';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(wxSDKMgr.prototype, "userInfo", {
            /**获取用户信息
             * string nickName 用户昵称
             * string avatarUrl 用户头像图片的 URL
             * number gender 用户性别 0未知 1男性 2女性
             * string country 用户所在国家
             * string province 用户所在省份
             * string city 用户所在城市
             * string language 显示 country，province，city 所用的语言 en英文 zh_CN简体中文 zh_TW繁体中文
             */
            get: function () {
                return this._userInfo || {};
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(wxSDKMgr.prototype, "location", {
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
            get: function () {
                return this._location || {};
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(wxSDKMgr.prototype, "access_token", {
            get: function () {
                return this._access_token || '';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(wxSDKMgr.prototype, "systemInfo", {
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
            get: function () {
                return this._systemInfo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(wxSDKMgr.prototype, "jsCode", {
            get: function () {
                return this.g_jsCode;
            },
            enumerable: true,
            configurable: true
        });
        /**
  * 跳转另一个程序
  */
        wxSDKMgr.prototype.Jump = function (appid, cb) {
            if (!window["wx"]) {
                return;
            }
            var getJumpCallBack = {
                successFn: function (res) {
                },
                failFn: function () {
                    cb.fail;
                }
            };
            H52D_Framework.wxSDKBase.Inst.Jump(appid, getJumpCallBack);
        };
        return wxSDKMgr;
    }());
    H52D_Framework.wxSDKMgr = wxSDKMgr;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=wxSDKMgr.js.map