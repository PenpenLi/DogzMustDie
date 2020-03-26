enum SystemTipsEnum {
    CommonEnum = 1,         //普通信息
    RoleEnum = 2, 	        //玩家信息
    ItemEnum = 3, 	        //物品信息

}

module H52D_Framework {
    export class TipsLogic {
        private _tipsArr: Array<Object> = [];
        private _tipsMaxLen = 100;
        /**通用奖励界面 缓存奖励 */
        public _showGoodsList: Array<any> = [];
        private static _inst: TipsLogic;
        public static get Instance() {
            if (TipsLogic._inst == null)
                TipsLogic._inst = new TipsLogic();
            return TipsLogic._inst;
        }

        public Initialize() {
            this.ShowTweenBox();
            RemoteCall.Instance.RegistJXS2CProtocol("C_SystemTips", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_LastError", this);
        }

        /**获得物品提示 */
        public OpenGoodsProTips(params, bMore?: boolean, fun?: Laya.Handler): void {
            let bShow = false
            for (let type in params) {
                bShow = true
                break
            }
            if (!bShow) {
                return
            }
            if (UIManager.Instance.IsHave("ShowGoodsTipsView", ViewToppestRoot)) {
                this._showGoodsList.push(params);
                return;
            }
            UIManager.Instance.CreateUI("ShowGoodsTipsView", [ViewToppestRoot, params, bMore], fun, true);
        }
        /**
         * @系统提示
         * @param msg 提示信息
         */
        public OpenTips(msg: string, time?): void {
            let object: Object = {};
            object[1] = msg;
            object[2] = time;
            this._tipsArr.unshift(object);
            if (this._tipsArr.length >= this._tipsMaxLen) {
                this._tipsArr.splice(this._tipsMaxLen - 1, 1);
            }
        }

        private ShowTweenBox(): void {
            Tick.ClearAll(this);
            if (this._tipsArr.length <= 0) {
                Tick.Once(500, this, this.ShowTweenBox);
                return;
            }
            let data = this._tipsArr[0];
            UIManager.Instance.InstanceUI("TipsView", [ViewTipRoot, data], Laya.Handler.create(this, () => {
                Tick.Once(400, this, this.ShowTweenBox);
                this._tipsArr.splice(0, 1);
            }));
        }

        //系统弹框
        public OpenMessageBox(msg: any, okFun?: Laya.Handler, cancelFun?: Laya.Handler, closeTime?: number): void {
            UIManager.Instance.CreateUI("MessageBoxView", [ViewToppestRoot, msg, okFun, cancelFun, closeTime]);
        }

        /**
         * @系统提示
         * @param msg 提示信息 
         * @param args %s 参数
         */
        public OpenSystemTips(msg: any, ...args): void {
            if (typeof (msg) == "string") {
                msg = msg;
            }
            else if (typeof (msg) == "number") {
                if (SysPromptConfig[msg]) {
                    msg = SysPromptConfig[msg].strPromptInfo;//系统提示
                }
                else if (GetInfoAttr.Instance.GetText(msg)) {
                    msg = GetInfoAttr.Instance.GetText(msg);//国际化
                }
                else {
                    msg = "";
                }
            }
            else {
                msg = "";
            }
            msg = Format(msg, ...args);
            TipsLogic.Instance.OpenTips(msg);
        }

        /**
         * 服务器发来的系统提示
         * @param buf 
         */
        private C_SystemTips(buf: any): void {
            let tipsID = buf[0];
            let params = buf[1];
            let data = SysPromptConfig[tipsID];
            if (!data) {
                Debugger.LogError("错误的系统提示提示ID: " + tipsID);
                return;
            }
            if (data.promptPos == 1) {
                this.OpenSystemTips1(data, params || []);
            }
            else if (data.promptPos == 2) {
                this.OpenSystemTips2(data, params || []);
            }
            else if (data.promptPos == 3) {
                let strName: string = "";
                if (buf && buf[1] && buf[1][1] && buf[1][1][2]) {
                    strName = buf[1][1][2];
                }
                this.OpenSystemTips4(data, params || [], tipsID, strName);
            }
        }

        //系统提示信息
        private OpenSystemTips1(data, params) {
            let msg = Format(data.strPromptInfo, params[1], params[2], params[3], params[4], params[5], params[6], params[7], params[8], params[9], params[10]);
            TipsLogic.Instance.OpenSystemTips(msg);
        }

        //弹出提示、二级确认面板
        private OpenSystemTips2(data, params) {
            let msg = Format(data.strPromptInfo, params[1][2], params[2][2], params[3], params[4], params[5], params[6], params[7], params[8], params[9], params[10]);
            TipsLogic.Instance.OpenMessageBox(msg);
            //pk聯賽
            // let msg: string = ""
            // msg = data.strPromptInfo
            // if (GetTabLength(params) > 0) {
            //     msg = Format(data.strPromptInfo, params[1][2], params[2][2]);
            // }
            // TipsLogic.Instance.OpenMessageBox(msg);
        }
        //系统公告(走马灯)
        private OpenSystemTips4(data, params, tipsID?: number, strName?: string) {
            let Str: Array<any> = []
            for (let i in params) {
                switch (params[i][1]) {
                    case SystemTipsEnum.CommonEnum: {
                        Str.push(params[i][2])
                        break
                    }
                    case SystemTipsEnum.RoleEnum: {
                        Str.push(GetHtmlStrByColor(params[i][2], "#ffec50"));
                        break
                    }
                    case SystemTipsEnum.ItemEnum: {
                        let item = new ItemData(params[i][2], 1);
                        let itemName = item.name;
                        let ret = GetHtmlStrByColor(itemName, BaseDefine.LabelColor[ItemConfig[params[i][2]].dwItemQuality]);
                        Str.push(ret);
                        break
                    }
                    default: {
                        break
                    }
                }
            }
            let msg = Format(data.strPromptInfo, Str[0], Str[1], Str[2], Str[3], Str[4], Str[5], Str[6], Str[7], Str[8], Str[9], Str[10]);
            let id: Number = tipsID;
            if (id == 100181 || id == 100235) {
                // msg = msg + id + "~" + GetHtmlStrByColor(strName, "#ffec50");
                msg = msg + id + "~" + strName;
            }
            Event.DispatchEvent("NoticeEvent", [msg]);
        }
        //---------------------------------------------------------服务器断线提示------------------------------------------------------------
        //离线类型
        private offLineType: OffLineEnum = OffLineEnum.eUnknow;
        //离线附加数据
        private offLineData: any;
        private _disConnectTips = {
            1: "与服务器断开连接(#%s)！<br>",
            2: "您的账号将在%s被解封，请大侠耐心等待！",
            3: "登陆异常！您的账号在IP：%s登录！您已被迫下线！",
            4: "抱歉,您已被GM请出游戏！",
            5: "服务器已关闭,请诸位耐心等候！",
            6: "登录失败,请大侠重新登陆！",
            7: "登录服务器出现异常,请重新登陆！",
            8: "当前在线人数已超出服务器上限，请大侠重新登录！",
            9: "恭喜您,改名成功，请重新登录！",
            10: "当前网络出现异常，请重新登录！",
            11: "检测到您正在使用外挂, 请关闭后重试！",
            12: "您的数据出现异常，请重新登录！",
        }

        /**
         * 服务器返回账号掉线信息
         * @param type 掉线类型
         * @param data 提示数据
         */
        private C_LastError(buf: any) {
            this.offLineType = buf[0];
            this.offLineData = buf[1];
        }

        /**
         * 服务器连接断开了，给予提示信息
         */
        public OnDisConnect() {
            let str = Format(this._disConnectTips[1], this.offLineType);
            //封号踢人
            if (OffLineEnum.eBanPlay == this.offLineType) {
                let tstr = GetFormatTime(this.offLineData);
                str += Format(this._disConnectTips[2], tstr);
                RemoteCall.Instance.CloseReConnect();
            }
            //顶号（重复登录）
            else if (OffLineEnum.eRepeatLogin == this.offLineType) {
                str += Format(this._disConnectTips[3], this.offLineData);
                RemoteCall.Instance.CloseReConnect();
            }
            //GM踢人，不封号
            else if (OffLineEnum.eGMKick == this.offLineType) {
                str += this._disConnectTips[4];
                RemoteCall.Instance.CloseReConnect();
            }
            //服务器关闭
            else if (OffLineEnum.eServerShutdown == this.offLineType) {
                str += this._disConnectTips[5];
                RemoteCall.Instance.CloseReConnect();
            }
            //登陆失败
            else if (OffLineEnum.eLoginFailed == this.offLineType) {
                str += this._disConnectTips[6];
                RemoteCall.Instance.CloseReConnect();
            }
            // 登陆服务器错误
            else if (OffLineEnum.eLoginServerError == this.offLineType) {
                str += this._disConnectTips[7];
                RemoteCall.Instance.CloseReConnect();
            }
            //服务器高负载
            else if (OffLineEnum.eLoginFull == this.offLineType) {
                str += this._disConnectTips[8];
                RemoteCall.Instance.CloseReConnect();
            }
            //改名被踢
            else if (OffLineEnum.eReName == this.offLineType) {
                str += this._disConnectTips[9];
                RemoteCall.Instance.CloseReConnect();
            }
            //网络异常
            else if (OffLineEnum.eUnknow == this.offLineType) {
                if (MasterPlayer.Instance.bInGame) {
                    return;
                }
                else {
                    str += this._disConnectTips[10];
                }
            }
            //使用外挂，恶意软件
            else if (OffLineEnum.eShield == this.offLineType) {
                str += this._disConnectTips[11];
                RemoteCall.Instance.CloseReConnect();
            }
            //未知错误
            else {
                //已经在游戏中，不提示，走断线重连
                if (MasterPlayer.Instance.bInGame) {
                    return;
                }
                else {
                    str += this._disConnectTips[12];
                }
            }
            TipsLogic.Instance.OpenMessageBox(str, Laya.Handler.create(this, () => {
                location.reload();
            }));
        }
    }
}