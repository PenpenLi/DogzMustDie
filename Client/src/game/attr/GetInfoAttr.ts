module H52D_Framework {
    export class GetInfoAttr {
        private static _inst: GetInfoAttr;
        public static get Instance() {
            if (GetInfoAttr._inst == null) {
                GetInfoAttr._inst = new GetInfoAttr();
            }
            return GetInfoAttr._inst;
        }
        private b_isAllScreen: boolean = false;
        constructor() {

        }

        /**主界面下方界面是否为全屏 */
        public set IsAllScreen(buf: any) {
            this.b_isAllScreen = buf;
        }
        public get IsAllScreen() {
            return this.b_isAllScreen;
        }
        /**获取国际化文字 */
        public GetText(id: number): string {
            let sStr = ""
            if (StringInfoConfig[id]) {
                if (IsNotBaiDuSdk()) {
                    sStr = StringInfoConfig[id].ss
                    if (sStr == "0") {
                        sStr = StringInfoConfig[id].s
                    }
                } else {
                    sStr = StringInfoConfig[id].s
                }
            }
            return sStr
        }

        /** 获取国际化文字,包含替换 */
        public GetSystemText(msg: any, ...args): string {
            if (typeof (msg) == "string") {
                msg = msg;
            }
            else if (typeof (msg) == "number") {
                if (SysPromptConfig[msg]) {
                    msg = SysPromptConfig[msg].strPromptInfo;//系统提示
                }
                else if (StringInfoConfig[msg]) {
                    msg = this.GetText(msg);//国际化
                }
                else {
                    msg = "";
                }
            }
            else {
                msg = "";
            }
            return Format(msg, ...args);
        }

        /**获取UI标题文字 */
        public GetTitle(e: E_OpenGrade): string {
            let id = OpenGradeConfig[e].NamaId;
            let sStr = this.GetText(id);
            return sStr;
        }

        /**获取时间间隔(时间戳)
         * b_front:是否为前置的时间戳
         */
        public GetCountDown(time: number, b_front: boolean) {
            let timeNow = Date.now() / 1000;
            if (b_front) {
                return timeNow - time;
            }
            return time - timeNow;
        }

        /**获取倒计时 */
        public GrtTimeOut(secs: number): string {
            secs = Number(secs.toString().split(".")[0]);
            let day: number = Math.floor(secs / 86400);
            let hour: number = Math.floor((secs - day * 86400) / 3600);
            let min: number = Math.floor((secs - hour * 3600) / 60);
            let sec: number = secs - hour * 3600 - min * 60;
            let str: string = '';
            if (day > 0) {
                str = (day >= 10 ? day : '0' + day) + ':' + (hour >= 10 ? hour : '0' + hour);
            }
            else if (hour > 0) {
                str = (hour >= 10 ? hour : '0' + hour) + ':' + (min >= 10 ? min : '0' + min);
            }
            else if (min > 0) {
                str = (min >= 10 ? min : '0' + min) + ':' + (sec >= 10 ? sec : '0' + sec);
            } else {
                str = (min >= 10 ? min : '0' + min) + ':' + (sec >= 10 ? sec : '0' + sec);
            }
            return str;
        }

        /**[]是否为空 */
        public GetObjIsNull(obj: Object) {
            for (let i in obj) {
                return false;
            }
            return true;
        }

        /**起名空格 */
        public Format(str: string): string {
            let index = 0;
            while (str.search(" ") != -1) {
                str = str.replace(' ', "");
            }
            return str;
        }
        /**当前关卡可得金币数量 */
        public GetThisOrderGoldNum() {
            let Order = MasterPlayer.Instance.player.CunstLevel
            let goldNum = 0;
            let rewardObj: Object = new Object();
            for (let i in CustomspassConfig) {
                if (CustomspassConfig[i].customsOrder == Order) {
                    rewardObj[1] = CustomspassConfig[i].waveRewardID;
                    rewardObj[2] = CustomspassConfig[i].extraRewardID;
                    break;
                }
            }

            for (let i in rewardObj) {
                let _reward = RewardConfig[rewardObj[i]].reWrad;
                for (let j in _reward) {
                    if (_reward[j][2] == 1) {
                        //金币
                        goldNum += _reward[j][3];
                    }
                }
            }

            return goldNum;
        }


        /**根据物品品质获取颜色 */
        GetColor(num: number): string {
            return QulityColorEnum[num] ? QulityColorEnum[num] : QulityColorEnum[7];
        }

        /**获取长度 */
        GetObjLength(obj: any) {
            let _length = 0;
            for (let i in obj) {
                _length++;
            }
            return _length;
        }

    }
}