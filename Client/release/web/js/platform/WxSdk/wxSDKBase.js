/**
*  微信SDK底层类
*/
var H52D_Framework;
(function (H52D_Framework) {
    var bannerAd;
    //let videoAd = 
    var wxSDKBase = /** @class */ (function () {
        function wxSDKBase() {
        }
        Object.defineProperty(wxSDKBase, "Inst", {
            get: function () {
                if (wxSDKBase._inst == null)
                    wxSDKBase._inst = new wxSDKBase();
                return wxSDKBase._inst;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(wxSDKBase.prototype, "getShareTicket", {
            get: function () {
                return this._shareTicket;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 登录
         * @param cb 回调函数
         */
        wxSDKBase.prototype.Login = function (cb) {
            //调用接口wx.login() 获取临时登录凭证（code）
            H52D_Framework.Wx.login({
                fail: function (res) {
                    console.log("Get Login Code Fail");
                    cb.failFn && cb.failFn();
                },
                success: function (res) {
                    cb.successFn && cb.successFn(res);
                }
            });
        };
        /**
         * 微信网络请求
         * @param url 请求地址
         * @param failCb 失败回调
         * @param successCb 成功回调
         * @param method Get Post
         */
        wxSDKBase.prototype.Request = function (url, failCb, successCb, method, data) {
            H52D_Framework.Wx.request({
                url: url,
                method: method,
                data: data,
                fail: function (res) {
                    failCb && failCb();
                },
                success: function (res) {
                    successCb && successCb(res);
                }
            });
        };
        /**
         * 分享
         * @param param 分享的参数设置 {content: '', image: '', query: {}} 参数不能出现空字符串
         * @param cb 分享回调，微信API没有明确标出回调，有可能收不到
         */
        wxSDKBase.prototype.Share = function (param, cb) {
            H52D_Framework.Wx.aldShareAppMessage({
                // Wx.shareAppMessage({
                title: param['title'] + '',
                imageUrl: param['imageUrl'] + '',
                query: param['query'] + '',
                success: function (res) {
                    console.log(res);
                    //this._shareTicket = res.shareTicket[0]
                    cb.successFn && cb.successFn(res);
                },
                fail: function (res) {
                    console.log("Try To Share Fail");
                    cb.failFn && cb.failFn();
                }
            });
        };
        /**更新转发属性 */
        wxSDKBase.prototype.updateShareMenu = function () {
            H52D_Framework.Wx.updateShareMenu({
                withShareTicket: true,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) {
                }
            });
        };
        /**
         * 显示转发按钮
         * @param param 附加参数 {withShareTicket: false}
         * @param cb 回调函数
         */
        wxSDKBase.prototype.ShowShareMenu = function (param, cb) {
            H52D_Framework.Wx.showShareMenu({
                withShareTicket: param['withShareTicket'] || false,
                success: function () {
                    //cb.successFn && cb.successFn();
                },
                fail: function () {
                    //cb.failFn && cb.failFn();
                }
            });
        };
        /**
         * 隐藏转发按钮
         * @param cb 回调函数
         */
        wxSDKBase.prototype.HideShareMenu = function (cb) {
            H52D_Framework.Wx.hideShareMenu({
                success: function () {
                    cb.successFn && cb.successFn();
                },
                fail: function () {
                    cb.failFn && cb.failFn();
                }
            });
        };
        /**
         * 获取用户信息
         * @param param 附加参数 {withShareTicket: false}
         * @param cb 回调函数
         */
        wxSDKBase.prototype.GetUserInfo = function (param, cb) {
            H52D_Framework.Wx.getUserInfo({
                withShareTicket: param['withShareTicket'] || false,
                lang: param['lang'] || 'en',
                success: function (res) {
                    cb.successFn && cb.successFn(res);
                },
                fail: function () {
                    cb.failFn && cb.failFn();
                }
            });
        };
        /**
         * 获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限
         * @param cb 回调函数
         */
        wxSDKBase.prototype.GetSetting = function (cb) {
            H52D_Framework.Wx.getSetting({
                fail: function (res) {
                    console.log('Get User Setting fail');
                    cb.failFn && cb.failFn();
                },
                success: function (res) {
                    cb.successFn && cb.successFn(res);
                }
            });
        };
        /**
         * 调起客户端小程序设置界面 (成功时返回用户授权结果authSetting)
         * @param cb 回调函数
         */
        wxSDKBase.prototype.OpenSetting = function (cb) {
            H52D_Framework.Wx.openSetting({
                fail: function (res) {
                    console.log('Open User Setting fail');
                    cb.failFn && cb.failFn();
                },
                success: function (res) {
                    cb.successFn && cb.successFn(res);
                }
            });
        };
        /**
         * 向用户发起授权请求,重复获取某一权限将不能吊起授权界面
         * @param scope 授权列表('scope.userLocation', 'scope.werun', 'scope.writePhotosAlbum')
         * @param cb 回调函数
         */
        wxSDKBase.prototype.Authorize = function (scope, cb) {
            H52D_Framework.Wx.authorize({
                scope: scope,
                fail: function (res) {
                    console.log('Open User Setting fail');
                    cb.failFn && cb.failFn();
                },
                success: function (res) {
                    cb.successFn && cb.successFn(res);
                }
            });
        };
        /**
         * 此处需要特殊处理scope.userInfo授权请求
         */
        /**
         * 获取当前的地理位置、速度, 调用前需要用户授权('scope.userLocation')
         * @param param 附加参数
         * @param cb 回调函数
         */
        wxSDKBase.prototype.GetLocation = function (param, cb) {
            H52D_Framework.Wx.getLocation({
                type: param['type'] || 'wgs84',
                altitude: param['altitude'] || 'false',
                fail: function () {
                    console.log('GetLocation fail');
                    cb.failFn && cb.failFn();
                },
                success: function (res) {
                    cb.successFn && cb.successFn(res);
                }
            });
        };
        /**
         * 保存图片到系统相册，需要用户授权('scope.writePhotosAlbum')
         * @param filePath 图片文件路径，可以是临时文件路径或永久文件路径，不支持网络图片路径
         * @param cb 回调函数
         */
        wxSDKBase.prototype.SaveImageToPhotosAlbum = function (filePath, cb) {
            H52D_Framework.Wx.saveImageToPhotosAlbum({
                filePath: filePath,
                fail: function () {
                    console.log('SaveImageToPhotosAlbum fail');
                    cb.failFn && cb.failFn();
                },
                success: function (res) {
                    cb.successFn && cb.successFn(res);
                }
            });
        };
        /**
         * 上传微信所需要保存的数据，例如分数等,
         * @param key
         * @param value
         * @param cb 回调函数
         */
        wxSDKBase.prototype.WxUpload = function (key, value, cb) {
            H52D_Framework.Wx.setUserCloudStorage({
                KVDataList: [{ key: "" + key, value: "" + value }],
                success: function (res) {
                    cb.successFn && cb.successFn(res);
                },
                fail: function () {
                    cb.failFn && cb.failFn();
                }
            });
        };
        /**
        * 发信息到子域
        * @param strData 需要转成json的形式
        */
        wxSDKBase.prototype.SendMsgToSub = function (strData, cb) {
            if (Laya.Browser.onMiniGame) {
                H52D_Framework.Wx.getOpenDataContext().postMessage({
                    message: strData,
                    success: function (res) {
                        console.log("错误2  底层成功返回错误");
                        cb.successFn && cb.successFn(res);
                    },
                    fail: function () {
                        cb.failFn && cb.failFn();
                    }
                });
            }
        };
        /**
         * 生成二维码
        */
        wxSDKBase.prototype.QR_Code = function (access_token, cb) {
            var param = {
                access_token: access_token
            };
            H52D_Framework.Wx.request({
                url: "https://api.weixin.qq.com/wxa/getwxacodeunlimit",
                method: 'POST',
                data: 'access_token=' + param,
                fail: function (res) {
                    cb && cb.failFn(res);
                },
                success: function (res) {
                    console.log("二维码的返回值");
                    console.log(res);
                    cb && cb.successFn(res);
                }
            });
        };
        /**删除用户托管的数据 */
        wxSDKBase.prototype.RemoveData = function (key, cb) {
            H52D_Framework.Wx.removeUserCloudStorage({
                keyList: [key],
                success: function (res) {
                    cb.successFn && cb.successFn(res);
                },
                fail: function (res) {
                    cb.failFn && cb.failFn(res);
                }
            });
        };
        /**Banner广告 */
        wxSDKBase.prototype.Establish = function (adUnitId, w, cb) {
            this.Delete();
            /**获取实际的宽高 */
            var screenWidth = H52D_Framework.Wx.getSystemInfoSync().screenWidth;
            var screenHeight = H52D_Framework.Wx.getSystemInfoSync().screenHeight;
            var height = screenHeight;
            w = screenWidth;
            bannerAd = H52D_Framework.Wx.createBannerAd({
                adUnitId: adUnitId || H52D_Framework.adUnitId_Banner,
                style: {
                    left: 0,
                    top: 0,
                    width: 200,
                    height: 0
                },
                success: function (res) {
                    cb.successFn && cb.successFn(res);
                }
            });
            bannerAd.onResize(function (res) {
                console.log(res.width, res.height);
                console.log(bannerAd.style.realWidth, bannerAd.style.realHeight);
                bannerAd.style.left = (screenWidth - bannerAd.style.realWidth) / 2;
                bannerAd.style.top = screenHeight - bannerAd.style.realHeight;
                //bannerAd.style.height = 120;
            });
            bannerAd.onError(function (err) {
                console.log(err);
            });
            // bannerAd.onResize()
            bannerAd.show();
        };
        /**销毁Banner广告 */
        wxSDKBase.prototype.Delete = function () {
            if (bannerAd) {
                bannerAd.destroy();
            }
            console.log("销毁");
        };
        /**微信激励视频 */
        wxSDKBase.prototype.Excitation_Wx = function (adUnitId, cb) {
            this.Delete();
            var videoAd = H52D_Framework.Wx.createRewardedVideoAd({
                adUnitId: adUnitId
            });
            videoAd.load()
                .then(function () { return videoAd.show(); })
                .catch(function (err) { return console.log(err.errMsg); });
            videoAd.onLoad(function (res) {
                console.log("激励广告 广告加载成功");
                videoAd.offLoad();
            });
            videoAd.show(function (res) {
                console.log("激励视频 广告显示");
            });
            videoAd.onError(function (res) {
                console.log(res);
                videoAd.offError();
            });
            videoAd.onClose(function (res) {
                //用户点击关闭按钮 没有看完视频点击关闭
                if (res && res.isEnded || res == undefined) {
                    // 正常播放结束，可以下发游戏奖励
                    cb.successFn && cb.successFn(res);
                }
                else {
                    // 播放中途退出，不下发游戏奖励
                    cb.failFn && cb.failFn(res);
                }
                videoAd.offClose();
            });
        };
        /**QQ激励视频 */
        wxSDKBase.prototype.Excitation_Qq = function (adUnitId, cb) {
            var videoAd = H52D_Framework.Wx.createRewardedVideoAd({
                adUnitId: adUnitId
            });
            videoAd.show()
                .then(function () { return console.log('激励视频 广告显示'); })
                .catch(function () {
                videoAd.load()
                    .then(function () { return videoAd.show(); })
                    .catch(function (err) {
                    console.log('激励视频 广告显示失败');
                });
            });
            videoAd.onError(function (res) {
                console.log(res);
            });
            videoAd.onClose(function (res) {
                //用户点击关闭按钮 没有看完视频点击关闭
                if (res && res.isEnded || res == undefined) {
                    // 正常播放结束，可以下发游戏奖励
                    cb.successFn && cb.successFn(res);
                }
                else {
                    // 播放中途退出，不下发游戏奖励
                    cb.failFn && cb.failFn(res);
                }
                videoAd.offClose();
            });
        };
        /**拉起支付 */
        wxSDKBase.prototype.payment = function (cb) {
            H52D_Framework.Wx.requestMidasPayment({
                mode: 'game',
                env: "1",
                offerId: '1450016739',
                currencyType: "CNY",
                buyQuantity: 10,
                zoneId: 1,
                platform: "android",
                success: function () {
                    // 支付成功
                    console.log("支付成功");
                    cb.success && cb.success();
                },
                fail: function () {
                    // 支付失败
                    console.log("支付失败");
                    cb.fail && cb.fail();
                }
            });
        };
        /**
         * 小游戏初始参数
         */
        wxSDKBase.prototype.onShow = function (cb) {
            var ret = H52D_Framework.Wx.getLaunchOptionsSync();
            if (ret.query) {
                console.log("查询的字串是");
                console.log(ret.query.inviter);
                cb.successFn && cb.successFn(ret.query);
            }
        };
        /**
         * 获取系统信息
         */
        wxSDKBase.prototype.GetSystemInfo = function (cb) {
            H52D_Framework.Wx.getSystemInfo({
                success: function (res) {
                    cb.successFn && cb.successFn(res);
                },
                fail: function () {
                    cb.failFn && cb.failFn();
                }
            });
        };
        /**
         * 跳转另一个小程序
        */
        wxSDKBase.prototype.Jump = function (appid, cb) {
            H52D_Framework.Wx.navigateToMiniProgram({
                appId: appid,
                success: function (res) {
                    cb.successFn && cb.successFn(res);
                },
                fail: function () {
                    cb.failFn && cb.failFn();
                }
            });
        };
        return wxSDKBase;
    }());
    H52D_Framework.wxSDKBase = wxSDKBase;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=wxSDKBase.js.map