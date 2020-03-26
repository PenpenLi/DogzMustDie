/**
* 联运SDK管理类
*/
var H52D_Framework;
(function (H52D_Framework) {
    var lySDKMgr = /** @class */ (function () {
        function lySDKMgr() {
            /**联运平台uid */
            this._uid = '';
        }
        Object.defineProperty(lySDKMgr, "Inst", {
            get: function () {
                if (lySDKMgr._inst == null)
                    lySDKMgr._inst = new lySDKMgr();
                return lySDKMgr._inst;
            },
            enumerable: true,
            configurable: true
        });
        /**初始化 */
        lySDKMgr.prototype.Initialization = function () {
            if (!H52D_Framework.SDKManager.Instance.isPfLy) {
                return;
            }
            this.RoleLogin();
            this.readyLoad();
        };
        Object.defineProperty(lySDKMgr.prototype, "uid", {
            /**获取联运平台uid */
            get: function () {
                return this._uid || '';
            },
            enumerable: true,
            configurable: true
        });
        /**联运SDK判断是否是微端 */
        lySDKMgr.prototype.IsMicroClient = function () {
            if (!H52D_Framework.SDKManager.Instance.isPfLy) {
                return false;
            }
            return H52D_Framework.lySDKBase.Inst.oSDK.isMicroClient();
        };
        /**请求SDK登陆uid */
        lySDKMgr.prototype.RoleLogin = function () {
            // 获取到链接参数
            var oUrlData = H52D_Framework.SDKManager.Instance.GetRequest();
            var hSs = new H52D_Framework.HttpService();
            var postLoginServerUrlHost = "https://ssjxzh5-serverlist.gyyx.cn/selserver/serverList_ssbxs.php?";
            if (H52D_Framework.SDKManager.Instance.isIOSExamine) {
                postLoginServerUrlHost = "https://ssjxzh5-serverlist.gyyx.cn/selserver/serverList_ios.php?";
            }
            // 转换Url
            oUrlData["fp"] = oUrlData["fp"].replace(/\+/g, "%2B");
            oUrlData["fp"] = oUrlData["fp"].replace(/\&/g, "%26");
            // 发起http请求
            var postLoginServerUrl = "";
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
            var that = this;
            hSs.Request(postLoginServerUrlHost + postLoginServerUrl, null, "get", "text", function (d) {
                console.log("============ ServersFn.getGameInfoFn.success ============", d);
                //canClick=true;
                d = JSON.parse(d);
                if (d.status == 0) {
                    that._uid = d.uid;
                    H52D_Framework.LoginLogic.Instance.Login(that._uid);
                }
                else {
                    alert("登录异常！错误码（" + d.status + "）" + "错误信息（" + d.msg + "）");
                }
            });
        };
        /**初始化关注方法 */
        lySDKMgr.prototype.concernGivePrize = function (cb) {
            if (!H52D_Framework.SDKManager.Instance.isPfLy) {
                return;
            }
            H52D_Framework.lySDKBase.Inst.concernGivePrize(cb);
        };
        /**cp需要在游戏加载(loading)完成之后调用该方法，以便于我们进行后续操作 */
        lySDKMgr.prototype.readyLoad = function () {
            if (!H52D_Framework.SDKManager.Instance.isPfLy) {
                return;
            }
            // cp需要在游戏加载(loading)完成之后调用该方法，以便于我们进行后续操作
            H52D_Framework.lySDKBase.Inst.readyLoad();
            // 调用SDK支持功能的接口
            H52D_Framework.lySDKBase.Inst.supportFunction();
            H52D_Framework.lySDKBase.Inst.supportFunctionAdvert();
            // 初始化分享回调方法
            H52D_Framework.lySDKBase.Inst.shareCallbackFn();
        };
        /**获取广告功能的支持状态 */
        lySDKMgr.prototype.GetSupportAdvert = function () {
            return H52D_Framework.lySDKBase.Inst.GetSupportAdvert();
        };
        /**获取所支持的广告类型列表 */
        lySDKMgr.prototype.GetSupportAdvertType = function () {
            return H52D_Framework.lySDKBase.Inst.GetSupportAdvertType();
        };
        /**获取分享功能的支持状态 */
        lySDKMgr.prototype.GetSupportShare = function () {
            return H52D_Framework.lySDKBase.Inst.GetSupportShare();
        };
        /**获取前段分享回调功能的支持状态 */
        lySDKMgr.prototype.GetSupportinvite = function () {
            return H52D_Framework.lySDKBase.Inst.GetSupportinvite();
        };
        /**获取邀请功能的支持状态 */
        lySDKMgr.prototype.GetSupportShareNotice = function () {
            return H52D_Framework.lySDKBase.Inst.GetSupportShareNotice();
        };
        /**获取功能是否支持状态 */
        lySDKMgr.prototype.GetSupport = function (i_strFunc) {
            if (!H52D_Framework.SDKManager.Instance.isPfLy) {
                return false;
            }
            return H52D_Framework.lySDKBase.Inst.GetSupport(i_strFunc);
        };
        /**拉起广告 */
        lySDKMgr.prototype.Advert = function (adData, cb) {
            if (!H52D_Framework.SDKManager.Instance.isPfLy) {
                return;
            }
            H52D_Framework.lySDKBase.Inst.Advert(adData, cb);
        };
        /**判断用户是否关注 */
        lySDKMgr.prototype.isConcern = function (cb) {
            if (!H52D_Framework.SDKManager.Instance.isPfLy) {
                return;
            }
            H52D_Framework.lySDKBase.Inst.isConcern(cb);
        };
        /**拉起分享 */
        lySDKMgr.prototype.share = function () {
            if (!H52D_Framework.SDKManager.Instance.isPfLy) {
                return;
            }
            H52D_Framework.lySDKBase.Inst.share();
        };
        /**注销登陆 */
        lySDKMgr.prototype.logout = function () {
            if (!H52D_Framework.SDKManager.Instance.isPfLy) {
                return;
            }
            H52D_Framework.lySDKBase.Inst.logout();
        };
        /**
        * 下载微端
        * 注意：CP需要先判断支持下载微端功能。且与我方沟通有微端可以下载。
        */
        lySDKMgr.prototype.microClient = function () {
            if (!H52D_Framework.SDKManager.Instance.isPfLy) {
                return;
            }
            H52D_Framework.lySDKBase.Inst.microClient();
        };
        /**获取微端信息 */
        //返回 osType,imei,androidId,idfa,idfv,iosId信息
        lySDKMgr.prototype.microClientInfo = function (microClientInfo) {
            if (!H52D_Framework.SDKManager.Instance.isPfLy) {
                return;
            }
            microClientInfo = H52D_Framework.lySDKBase.Inst.microClientInfo();
            return microClientInfo;
        };
        /**拉起个人中心 */
        lySDKMgr.prototype.userCenter = function () {
            if (!H52D_Framework.SDKManager.Instance.isPfLy) {
                return;
            }
            H52D_Framework.lySDKBase.Inst.userCenter();
        };
        /**数据上报 */
        lySDKMgr.prototype.dataReporting = function (i_eLog, i_oData) {
            if (!H52D_Framework.SDKManager.Instance.isPfLy) {
                return;
            }
            H52D_Framework.lySDKBase.Inst.dataReporting(i_eLog, i_oData);
        };
        /**判定订单成功失败请以支付回调为准 */
        lySDKMgr.prototype.pay = function (param) {
            H52D_Framework.lySDKBase.Inst.pay(param);
        };
        return lySDKMgr;
    }());
    H52D_Framework.lySDKMgr = lySDKMgr;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=lySDKMgr.js.map