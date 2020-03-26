/**
* 联运SDK基础类
*/
var H52D_Framework;
(function (H52D_Framework) {
    var lySDKBase = /** @class */ (function () {
        function lySDKBase() {
            /**联运SDK */
            this._oSDK = window['g_objSDK'];
            /**保存平台对于某些功能的支持情况 */
            this._supportFunction = {};
        }
        Object.defineProperty(lySDKBase, "Inst", {
            get: function () {
                if (lySDKBase._inst == null)
                    lySDKBase._inst = new lySDKBase();
                return lySDKBase._inst;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(lySDKBase.prototype, "oSDK", {
            /**获取联运平台sdk实例 */
            get: function () {
                return this._oSDK;
            },
            enumerable: true,
            configurable: true
        });
        /**初始化分享回调方法 */
        lySDKBase.prototype.shareCallbackFn = function () {
            var newShareCallback = {
                //shareGivePrize值：boolean型  发放奖励：true;不发放奖励：false
                successFn: function (shareGivePrize) {
                    // 分享成功将缓存打包发给服务器
                    if (H52D_Framework.ShareInfo) {
                        H52D_Framework.RemoteCall.Instance.Send("K_ReqShareGame", H52D_Framework.ShareInfo);
                    }
                },
                failFn: function () {
                    // alert("重置后的分享失败");
                }
            };
            this._oSDK.shareCallbackFn(newShareCallback);
        };
        /**初始化关注回调方法 */
        lySDKBase.prototype.concernGivePrize = function (cb) {
            this._oSDK.shareCallbackFn = function () {
                cb && cb();
            };
        };
        /**cp需要在游戏加载(loading)完成之后调用该方法，以便于我们进行后续操作 */
        lySDKBase.prototype.readyLoad = function () {
            this._oSDK.readyLoad();
        };
        /**获取功能是否支持状态 */
        lySDKBase.prototype.supportFunction = function () {
            var rsp = this._oSDK.supportFunction();
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
        };
        /**获取所支持的广告类型列表0:渠道方决定类型;1:视频类型;2:H5类型 */
        lySDKBase.prototype.supportFunctionAdvert = function () {
            var rsp = this._oSDK.supportFunction();
            this._supportFunction['advertType'] = rsp['advertType'];
        };
        /**获取所支持的广告类型列表 */
        lySDKBase.prototype.GetSupportAdvertType = function () {
            return this._supportFunction['advertType'] || ['0'];
        };
        /**获取广告功能的支持状态 */
        lySDKBase.prototype.GetSupportAdvert = function () {
            return this._supportFunction["advert"] || false;
        };
        /**获取分享功能的支持状态 */
        lySDKBase.prototype.GetSupportShare = function () {
            return this._supportFunction["share"] || false;
        };
        /**获取前段分享回调功能的支持状态 */
        lySDKBase.prototype.GetSupportShareNotice = function () {
            return this._supportFunction["shareNotice"] || false;
        };
        /**获取邀请功能的支持状态 */
        lySDKBase.prototype.GetSupportinvite = function () {
            return this._supportFunction["invite"] || false;
        };
        /**获取某个功能的支持状态 */
        lySDKBase.prototype.GetSupport = function (i_strFunc) {
            return this._supportFunction[i_strFunc] || false;
        };
        /**拉起广告 */
        lySDKBase.prototype.Advert = function (adData, cb) {
            this._oSDK.advert(adData, function (status) {
                //status值：boolean型  成功了 领取奖励：true;关闭了：false
                if (status) {
                    //成功了 领取奖励
                    cb.successFn && cb.successFn();
                    // AdvertisingManager.Instance.adertisingBack = true;
                    H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.WATCH_ADVERTISMENT);
                }
                else {
                    cb.failFn && cb.failFn();
                    // AdvertisingManager.Instance.adertisingBack = false;
                    // Event.DispatchEvent(EventDefine.WATCH_ADVERTISMENT);
                }
            });
        };
        /**判断用户是否关注 */
        lySDKBase.prototype.isConcern = function (cb) {
            this._oSDK.isConcern(function (status) {
                //status值：boolean型  用户已关注：true;用户未关注：false
                if (status) {
                    //关注了
                    cb.successFn && cb.successFn();
                }
                else {
                    cb.failFn && cb.failFn();
                    // 没有关注的话不需要向服务器上报状态
                }
            });
        };
        /**拉起分享 */
        lySDKBase.prototype.share = function () {
            this._oSDK.share();
        };
        /**注销登陆 */
        lySDKBase.prototype.logout = function () {
            this._oSDK.logout();
        };
        /**
        * 下载微端
        * 注意：CP需要先判断支持下载微端功能。且与我方沟通有微端可以下载。
        */
        lySDKBase.prototype.microClient = function () {
            this._oSDK.microClient();
        };
        /**判断是否为微端 */
        lySDKBase.prototype.isMicroClient = function () {
            return this._oSDK.isMicroClient();
        };
        /**获取微端信息 */
        //返回 osType,imei,androidId,idfa,idfv,iosId信息 
        lySDKBase.prototype.microClientInfo = function () {
            return this._oSDK.microClientInfo();
        };
        /**拉起个人中心 */
        lySDKBase.prototype.userCenter = function () {
            this._oSDK.userCenter();
        };
        /**判定订单成功失败请以支付回调为准 */
        lySDKBase.prototype.pay = function (param) {
            this._oSDK.pay(param);
        };
        /**数据上报 */
        lySDKBase.prototype.dataReporting = function (i_eLog, i_oData) {
            // 没有SDK情况下不能进行上报
            if (this._oSDK) {
                return;
            }
            if (SDKLOGENUM.eSelServer == i_eLog) {
                //完成选服
                this._oSDK.reportSelectServer(i_oData);
            }
            else if (SDKLOGENUM.eEndLoading == i_eLog) {
                //加载完成
                this._oSDK.readyLoad();
            }
            else if (SDKLOGENUM.eLevelUp == i_eLog) {
                //角色升级
                this._oSDK.reportRoleInfo(i_oData);
            }
            else if (SDKLOGENUM.eEnterGame == i_eLog) {
                //进入游戏
                this._oSDK.reportEnterInfo(i_oData);
            }
            else if (SDKLOGENUM.eRoleUpdate == i_eLog) {
                //变更角色信息数据
                this._oSDK.reportRoleInfoChange(i_oData);
            }
            else if (SDKLOGENUM.eChargeSuccess == i_eLog) {
                //支付成功
                this._oSDK.reportSendGoodsSuccessInfo(i_oData);
            }
            else if (SDKLOGENUM.eCreate == i_eLog) {
                //角色创建
                this._oSDK.createRoleInfo(i_oData);
            }
            else if (SDKLOGENUM.ePreCreateRole == i_eLog) {
                //到达游戏内创建角色场景
                this._oSDK.preCreateRoleInfo(i_oData);
            }
        };
        return lySDKBase;
    }());
    H52D_Framework.lySDKBase = lySDKBase;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=lySDKBase.js.map