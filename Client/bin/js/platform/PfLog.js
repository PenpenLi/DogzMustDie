var H52D_Framework;
(function (H52D_Framework) {
    var PfLog = /** @class */ (function () {
        function PfLog() {
        }
        Object.defineProperty(PfLog, "Inst", {
            get: function () {
                if (PfLog._inst == null)
                    PfLog._inst = new PfLog();
                return PfLog._inst;
            },
            enumerable: true,
            configurable: true
        });
        // 初始化函数
        PfLog.prototype.Initialize = function () {
        };
        // 上报客户端log
        PfLog.prototype.DoClient = function (i_eventid, i_typ) {
            var oHttp = new H52D_Framework.HttpService();
            var fName = "";
            if (window["wx"]) {
                fName = "playeractionlog_weixin";
            }
            else if (window["swan"]) {
                fName = "playeractionlog_tieba";
            }
            else {
                return;
            }
            var strPostURL = "https://ssjxzh5-log.gyyx.cn/php/" + fName + ".php?";
            if (H52D_Framework.GameLink.Instance.urlParams["openid"] == "") {
                i_typ = 1;
            }
            strPostURL += "userid=";
            strPostURL += H52D_Framework.GameLink.Instance.urlParams["openid"] || "test02";
            strPostURL += "&pf=";
            strPostURL += window["g_pf"] || "1";
            strPostURL += "&serverid=";
            strPostURL += "1";
            strPostURL += "&eventid=";
            strPostURL += i_eventid;
            strPostURL += "&type=";
            strPostURL += i_typ;
            console.log("==request==>", strPostURL);
            oHttp.Request(strPostURL, null, "get", "text", null);
        };
        /**发送客户端打点 */
        PfLog.prototype.SendClientLog = function (i_eventid, i_typ) {
            //是否走SDK登录  微信 百度
            if (!(window["wx"] || window["swan"])) {
                return;
            }
            this.DoClient(i_eventid, i_typ);
        };
        return PfLog;
    }());
    H52D_Framework.PfLog = PfLog;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PfLog.js.map