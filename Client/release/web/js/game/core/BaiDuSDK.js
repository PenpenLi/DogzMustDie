/*
* 百度sdk;
*/
var H52D_Framework;
(function (H52D_Framework) {
    var BaiDuSDK = /** @class */ (function () {
        function BaiDuSDK() {
            /**是否是百度平台 */
            this._isBaiDu = false;
            /**百度用户唯一id */
            this._openid = "";
            /**获取百度昵称 */
            this._nickname = "";
            /**获取百度账号头像地址(https://......) */
            this._headimgUrl = "";
            /**获取百度用户性别(女:0,男:1) */
            this._sex = -1;
        }
        Object.defineProperty(BaiDuSDK, "Instance", {
            get: function () {
                if (BaiDuSDK._inst == null) {
                    BaiDuSDK._inst = new BaiDuSDK();
                }
                return BaiDuSDK._inst;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaiDuSDK.prototype, "isBaiDu", {
            get: function () {
                return this._isBaiDu;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaiDuSDK.prototype, "openid", {
            get: function () {
                return this._openid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaiDuSDK.prototype, "nickname", {
            get: function () {
                return this._nickname;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaiDuSDK.prototype, "headimgUrl", {
            get: function () {
                return this._headimgUrl;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaiDuSDK.prototype, "sex", {
            get: function () {
                return this._sex;
            },
            enumerable: true,
            configurable: true
        });
        /**初始化 */
        BaiDuSDK.prototype.Initialize = function () {
            this.GetEnv();
        };
        /**接收小程序发来的消息 */
        BaiDuSDK.prototype.GetEnv = function () {
            if (!window["swan"]) {
                H52D_Framework.UIManager.Instance.CreateUI("LoginView", [H52D_Framework.ViewDownRoot]);
                return;
            }
            window["swan"].webView.getEnv(function (res) {
                BaiDuSDK.Instance._isBaiDu = res.smartprogram;
                if (BaiDuSDK.Instance._isBaiDu) {
                    var url = window.location.search;
                    var params = BaiDuSDK.Instance.ParseQueryString(url);
                    BaiDuSDK.Instance._openid = params["openid"] || "";
                    BaiDuSDK.Instance._nickname = params["nickname"] || "";
                    BaiDuSDK.Instance._headimgUrl = params["headimgUrl"] || "";
                    BaiDuSDK.Instance._sex = params["sex"] || -1;
                    var InviteRoleID = params["inviteRoleID"] || "";
                    H52D_Framework.LoginLogic.Instance.Login(BaiDuSDK.Instance.openid, InviteRoleID);
                }
                else {
                    H52D_Framework.UIManager.Instance.CreateUI("LoginView", [H52D_Framework.ViewDownRoot]);
                }
            });
        };
        /**
         * 解析网页参数
         * @param url 网页地址
         */
        BaiDuSDK.prototype.ParseQueryString = function (url) {
            var params = {};
            if (url == "") {
                return params;
            }
            var arr = url.split("?");
            var arr1 = arr[1].split("&");
            for (var i = 0; i < arr1.length; i++) {
                var arr2 = arr1[i].split('=');
                if (!arr2[1]) {
                    params[arr2[0]] = 'true';
                }
                else if (params[arr2[0]]) {
                    var arr3 = [params[arr2[0]]];
                    arr3.push(arr2[1]);
                    params[arr2[0]] = arr3;
                }
                else {
                    params[arr2[0]] = decodeURI(arr2[1]);
                }
            }
            return params;
        };
        /**
         * 前往充值
         * @param goodsType 商品类型
         * @param goodsId 商品id
         * @param goodsDesc 商品描述
         */
        BaiDuSDK.prototype.ToRecharge = function (goodsType, goodsId, goodsDesc) {
            if (!this._isBaiDu) {
                H52D_Framework.RemoteCall.Instance.Send('K_ChgCharge', goodsType, goodsId);
                return;
            }
            if (Laya.Browser.onIOS) {
                H52D_Framework.TipsLogic.Instance.OpenMessageBox("受苹果政策影响，IOS充值暂未开放。请用户到安卓系统上充值。");
                return;
            }
            var price = H52D_Framework.ChargeConfig[goodsType][goodsId].Price;
            if (!price) {
                return;
            }
            window["swan"].webView.navigateTo({
                url: '/pages/payment/payment?' +
                    'openid=' + H52D_Framework.GameLink.Instance.urlParams["openid"] + '&' +
                    'payTime=' + H52D_Framework.Time.serverMilliSecodes + '&' +
                    'price=' + price + '&' +
                    'dealTitle=' + goodsDesc + '&' +
                    'serverid=' + H52D_Framework.GameLink.Instance.urlParams["serverid"] + '&' +
                    'roleid=' + H52D_Framework.MasterPlayer.Instance.player.ID + '&' +
                    'rolename=' + H52D_Framework.MasterPlayer.Instance.player.Name + '&' +
                    'goodsType=' + goodsType + '&' +
                    'goodsId=' + goodsId
            });
        };
        /**
         * 分享
         */
        BaiDuSDK.prototype.CallTieBa = function (nType, tParam) {
            var _a;
            if (!window["swan"]) {
                var tInfo = (_a = {},
                    _a["calltype"] = nType,
                    _a["roleid"] = H52D_Framework.MasterPlayer.Instance.player.ID,
                    _a);
                if (tParam) {
                    for (var k in tParam) {
                        tInfo[k] = tParam[k];
                    }
                }
                H52D_Framework.RemoteCall.Instance.Send("K_ReqShareGame", tInfo);
                return;
            }
            window["swan"].webView.navigateTo({
                url: '/pages/calltieba/calltieba?' +
                    'calltype=' + nType + '&' +
                    'roleid=' + H52D_Framework.MasterPlayer.Instance.player.ID + '&' +
                    'param=' + JSON.stringify(tParam || null)
            });
        };
        return BaiDuSDK;
    }());
    H52D_Framework.BaiDuSDK = BaiDuSDK;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=BaiDuSDK.js.map