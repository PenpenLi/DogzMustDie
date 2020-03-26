/*
* 百度sdk;
*/
module H52D_Framework {
    export class SDKManager {
        private static _inst: SDKManager;
        public static get Instance() {
            if (SDKManager._inst == null) {
                SDKManager._inst = new SDKManager();
            }
            return SDKManager._inst;
        }

        // 平台pf标识
        private _pfEnum = {
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
        }

        /**初始化 */
        public Initialize() {
            if (window["swan"]) {
                // 执行百度平台的初始化
                BaiDuSDK.Instance.Initialize();
            }
            else if (window['wx']) {
                // 执行微信平台的初始化
                let cls = {
                    "GameId": "tieba",
                    "shareTitle": "好玩有趣上手So Easy",
                    "adUnitId_Banner": "adunit-65d5fdb12fc30229",
                    "adUnitId_Excitation": "adunit-c9498ae846220ec0",
                    "LoginBtnTop": 500,
                    "LoginBtnWidth": 286,
                    "LoginBtnHight": 80,
                    "LoginIcon": "https://ssjxzh5-wb-login.gyyx.cn/wxSharePic/btn-kaishi-chuangjue.png"
                }
                wxSDKMgr.Inst.Initialization(cls);
            }
            else if (this.isPfLy) {
                // 执行联运平台的初始化
                lySDKMgr.Inst.Initialization();
            }
            else {
                UIManager.Instance.CreateUI("LoginView", [ViewDownRoot]);
            }
        }

        /**获取URL参数 */
        public GetRequest(): Object {
            let sURL: string = location.search; //获取url中"?"符后的字串  
            let theRequest: Object = {};
            if (sURL.indexOf("?") != -1) {
                let str: string = sURL.substr(1);
                let arrStr: Array<string> = str.split("&");
                for (let i = 0; i < arrStr.length; i++) {
                    theRequest[arrStr[i].split("=")[0]] = decodeURIComponent(arrStr[i].split("=")[1]);
                }
            }
            theRequest["path"] = location.pathname;
            return theRequest;
        }

        /**是否是微信平台 */
        public get isWx(): boolean {
            return window["wx"] != null;
        }

        /**是否是联运平台 */
        public get isPfLy(): boolean {
            return this.AnalyFunc('ly', window["g_pf"]);
        }

        /**是否是百度平台 */
        public get isPfBaiDu(): boolean {
            return window["swan"] != null;
        }

        /**如果是IOS审核版本,则屏蔽部分功能 */
        public get isIOSExamine(): boolean {
            // 联运平台
            return (Laya.Browser.onIOS || Laya.Browser.onIPhone) && lySDKMgr.Inst.IsMicroClient();
        }

        /**解析函数 */
        private AnalyFunc(str: string, pf: number): boolean {
            let pfStr = this._pfEnum[str] as string;
            let pfArr = pfStr.split(',');

            for (let i: number = 0; i < pfArr.length; i++) {
                let pfArrItem = pfArr[i];
                if (pfArrItem.search('-') == -1) {
                    if (pfArrItem == String(pf)) {
                        return true;
                    }
                }
                else {
                    let pfArrs = pfArrItem.split('-');
                    if (pf >= Number(pfArrs[0]) && pf <= Number(pfArrs[1])) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
}
