module H52D_Framework {
    export class PfLog {
        private static _inst: PfLog;
        public static get Inst() { //单例模式
            if (PfLog._inst == null)
                PfLog._inst = new PfLog();
            return PfLog._inst;
        }

        // 初始化函数
        public Initialize(): void {

        }

        // 上报客户端log
        public DoClient(i_eventid, i_typ): void {
            let oHttp: HttpService = new HttpService();
            let fName = ""
            if (window["wx"]) {
                fName = "playeractionlog_weixin"
            } else if (window["swan"]) {
                fName = "playeractionlog_tieba"
            } else {
                return
            }

            let strPostURL: string = "https://ssjxzh5-log.gyyx.cn/php/" + fName + ".php?";
            if (GameLink.Instance.urlParams["openid"] == "") {
                i_typ = 1;
            }

            strPostURL += "userid=";
            strPostURL += GameLink.Instance.urlParams["openid"] || "test02";
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
        }
        /**发送客户端打点 */
        public SendClientLog(i_eventid: number, i_typ: number): void {
            //是否走SDK登录  微信 百度
            if (!(window["wx"] || window["swan"])) {
                return
            }
            this.DoClient(i_eventid, i_typ);
        }
    }
}