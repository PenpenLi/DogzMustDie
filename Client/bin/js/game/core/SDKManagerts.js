/*
* 百度sdk;
*/
var H52D_Framework;
(function (H52D_Framework) {
    var SDKManager = /** @class */ (function () {
        function SDKManager() {
            // 平台pf标识
            this._pfEnum = {
                // 1: 微信正式服     1000: 微信提审服
                'wx': "1,1000",
                // 2-100: 联运平台正式服区间     1001: 联运平台提审服
                'ly': "2-100,1001",
                // 101: 玩吧安卓服       102: 玩吧IOS服
                'wb': "101,102",
                // 111: 玩一玩测试值
                "wyw": "111",
                // 121: IOS Native测试值
                "IOSNative": "121"
            };
        }
        Object.defineProperty(SDKManager, "Instance", {
            get: function () {
                if (SDKManager._inst == null) {
                    SDKManager._inst = new SDKManager();
                }
                return SDKManager._inst;
            },
            enumerable: true,
            configurable: true
        });
        /**初始化 */
        SDKManager.prototype.Initialize = function () {
            if (window["swan"]) {
                // 执行百度平台的初始化
                H52D_Framework.BaiDuSDK.Instance.Initialize();
            }
            else if (window['wx']) {
                // 执行微信平台的初始化
                var cls = {
                    "GameId": "tieba",
                    "shareTitle": "好玩有趣上手So Easy",
                    "adUnitId_Banner": "adunit-65d5fdb12fc30229",
                    "adUnitId_Excitation": "adunit-c9498ae846220ec0",
                    "LoginBtnTop": 500,
                    "LoginBtnWidth": 286,
                    "LoginBtnHight": 80,
                    "LoginIcon": "https://ssjxzh5-wb-login.gyyx.cn/wxSharePic/btn-kaishi-chuangjue.png"
                };
                H52D_Framework.wxSDKMgr.Inst.Initialization(cls);
            }
            else if (this.isPfLy) {
                // 执行联运平台的初始化
                H52D_Framework.lySDKMgr.Inst.Initialization();
            }
            else {
                H52D_Framework.UIManager.Instance.CreateUI("LoginView", [H52D_Framework.ViewDownRoot]);
            }
        };
        /**获取URL参数 */
        SDKManager.prototype.GetRequest = function () {
            var sURL = location.search; //获取url中"?"符后的字串  
            var theRequest = {};
            if (sURL.indexOf("?") != -1) {
                var str = sURL.substr(1);
                var arrStr = str.split("&");
                for (var i = 0; i < arrStr.length; i++) {
                    theRequest[arrStr[i].split("=")[0]] = decodeURIComponent(arrStr[i].split("=")[1]);
                }
            }
            theRequest["path"] = location.pathname;
            return theRequest;
        };
        Object.defineProperty(SDKManager.prototype, "isWx", {
            /**是否是微信平台 */
            get: function () {
                return window["wx"] != null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SDKManager.prototype, "isPfLy", {
            /**是否是联运平台 */
            get: function () {
                return this.AnalyFunc('ly', window["g_pf"]);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SDKManager.prototype, "isPfBaiDu", {
            /**是否是百度平台 */
            get: function () {
                return window["swan"] != null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SDKManager.prototype, "isIOSExamine", {
            /**如果是IOS审核版本,则屏蔽部分功能 */
            get: function () {
                // 联运平台
                return (Laya.Browser.onIOS || Laya.Browser.onIPhone) && H52D_Framework.lySDKMgr.Inst.IsMicroClient();
            },
            enumerable: true,
            configurable: true
        });
        /**解析函数 */
        SDKManager.prototype.AnalyFunc = function (str, pf) {
            var pfStr = this._pfEnum[str];
            var pfArr = pfStr.split(',');
            for (var i = 0; i < pfArr.length; i++) {
                var pfArrItem = pfArr[i];
                if (pfArrItem.search('-') == -1) {
                    if (pfArrItem == String(pf)) {
                        return true;
                    }
                }
                else {
                    var pfArrs = pfArrItem.split('-');
                    if (pf >= Number(pfArrs[0]) && pf <= Number(pfArrs[1])) {
                        return true;
                    }
                }
            }
            return false;
        };
        return SDKManager;
    }());
    H52D_Framework.SDKManager = SDKManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=SDKManagerts.js.map