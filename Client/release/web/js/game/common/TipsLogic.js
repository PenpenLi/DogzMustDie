var SystemTipsEnum;
(function (SystemTipsEnum) {
    SystemTipsEnum[SystemTipsEnum["CommonEnum"] = 1] = "CommonEnum";
    SystemTipsEnum[SystemTipsEnum["RoleEnum"] = 2] = "RoleEnum";
    SystemTipsEnum[SystemTipsEnum["ItemEnum"] = 3] = "ItemEnum";
})(SystemTipsEnum || (SystemTipsEnum = {}));
var H52D_Framework;
(function (H52D_Framework) {
    var TipsLogic = /** @class */ (function () {
        function TipsLogic() {
            this._tipsArr = [];
            this._tipsMaxLen = 100;
            /**通用奖励界面 缓存奖励 */
            this._showGoodsList = [];
            //---------------------------------------------------------服务器断线提示------------------------------------------------------------
            //离线类型
            this.offLineType = OffLineEnum.eUnknow;
            this._disConnectTips = {
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
            };
        }
        Object.defineProperty(TipsLogic, "Instance", {
            get: function () {
                if (TipsLogic._inst == null)
                    TipsLogic._inst = new TipsLogic();
                return TipsLogic._inst;
            },
            enumerable: true,
            configurable: true
        });
        TipsLogic.prototype.Initialize = function () {
            this.ShowTweenBox();
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_SystemTips", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_LastError", this);
        };
        /**获得物品提示 */
        TipsLogic.prototype.OpenGoodsProTips = function (params, bMore, fun) {
            var bShow = false;
            for (var type in params) {
                bShow = true;
                break;
            }
            if (!bShow) {
                return;
            }
            if (H52D_Framework.UIManager.Instance.IsHave("ShowGoodsTipsView", H52D_Framework.ViewToppestRoot)) {
                this._showGoodsList.push(params);
                return;
            }
            H52D_Framework.UIManager.Instance.CreateUI("ShowGoodsTipsView", [H52D_Framework.ViewToppestRoot, params, bMore], fun, true);
        };
        /**
         * @系统提示
         * @param msg 提示信息
         */
        TipsLogic.prototype.OpenTips = function (msg, time) {
            var object = {};
            object[1] = msg;
            object[2] = time;
            this._tipsArr.unshift(object);
            if (this._tipsArr.length >= this._tipsMaxLen) {
                this._tipsArr.splice(this._tipsMaxLen - 1, 1);
            }
        };
        TipsLogic.prototype.ShowTweenBox = function () {
            var _this = this;
            H52D_Framework.Tick.ClearAll(this);
            if (this._tipsArr.length <= 0) {
                H52D_Framework.Tick.Once(500, this, this.ShowTweenBox);
                return;
            }
            var data = this._tipsArr[0];
            H52D_Framework.UIManager.Instance.InstanceUI("TipsView", [H52D_Framework.ViewTipRoot, data], Laya.Handler.create(this, function () {
                H52D_Framework.Tick.Once(400, _this, _this.ShowTweenBox);
                _this._tipsArr.splice(0, 1);
            }));
        };
        //系统弹框
        TipsLogic.prototype.OpenMessageBox = function (msg, okFun, cancelFun, closeTime) {
            H52D_Framework.UIManager.Instance.CreateUI("MessageBoxView", [H52D_Framework.ViewToppestRoot, msg, okFun, cancelFun, closeTime]);
        };
        /**
         * @系统提示
         * @param msg 提示信息
         * @param args %s 参数
         */
        TipsLogic.prototype.OpenSystemTips = function (msg) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (typeof (msg) == "string") {
                msg = msg;
            }
            else if (typeof (msg) == "number") {
                if (H52D_Framework.SysPromptConfig[msg]) {
                    msg = H52D_Framework.SysPromptConfig[msg].strPromptInfo; //系统提示
                }
                else if (H52D_Framework.GetInfoAttr.Instance.GetText(msg)) {
                    msg = H52D_Framework.GetInfoAttr.Instance.GetText(msg); //国际化
                }
                else {
                    msg = "";
                }
            }
            else {
                msg = "";
            }
            msg = H52D_Framework.Format.apply(void 0, [msg].concat(args));
            TipsLogic.Instance.OpenTips(msg);
        };
        /**
         * 服务器发来的系统提示
         * @param buf
         */
        TipsLogic.prototype.C_SystemTips = function (buf) {
            var tipsID = buf[0];
            var params = buf[1];
            var data = H52D_Framework.SysPromptConfig[tipsID];
            if (!data) {
                H52D_Framework.Debugger.LogError("错误的系统提示提示ID: " + tipsID);
                return;
            }
            if (data.promptPos == 1) {
                this.OpenSystemTips1(data, params || []);
            }
            else if (data.promptPos == 2) {
                this.OpenSystemTips2(data, params || []);
            }
            else if (data.promptPos == 3) {
                var strName = "";
                if (buf && buf[1] && buf[1][1] && buf[1][1][2]) {
                    strName = buf[1][1][2];
                }
                this.OpenSystemTips4(data, params || [], tipsID, strName);
            }
        };
        //系统提示信息
        TipsLogic.prototype.OpenSystemTips1 = function (data, params) {
            var msg = H52D_Framework.Format(data.strPromptInfo, params[1], params[2], params[3], params[4], params[5], params[6], params[7], params[8], params[9], params[10]);
            TipsLogic.Instance.OpenSystemTips(msg);
        };
        //弹出提示、二级确认面板
        TipsLogic.prototype.OpenSystemTips2 = function (data, params) {
            var msg = H52D_Framework.Format(data.strPromptInfo, params[1][2], params[2][2], params[3], params[4], params[5], params[6], params[7], params[8], params[9], params[10]);
            TipsLogic.Instance.OpenMessageBox(msg);
            //pk聯賽
            // let msg: string = ""
            // msg = data.strPromptInfo
            // if (GetTabLength(params) > 0) {
            //     msg = Format(data.strPromptInfo, params[1][2], params[2][2]);
            // }
            // TipsLogic.Instance.OpenMessageBox(msg);
        };
        //系统公告(走马灯)
        TipsLogic.prototype.OpenSystemTips4 = function (data, params, tipsID, strName) {
            var Str = [];
            for (var i in params) {
                switch (params[i][1]) {
                    case SystemTipsEnum.CommonEnum: {
                        Str.push(params[i][2]);
                        break;
                    }
                    case SystemTipsEnum.RoleEnum: {
                        Str.push(H52D_Framework.GetHtmlStrByColor(params[i][2], "#ffec50"));
                        break;
                    }
                    case SystemTipsEnum.ItemEnum: {
                        var item = new H52D_Framework.ItemData(params[i][2], 1);
                        var itemName = item.name;
                        var ret = H52D_Framework.GetHtmlStrByColor(itemName, H52D_Framework.BaseDefine.LabelColor[H52D_Framework.ItemConfig[params[i][2]].dwItemQuality]);
                        Str.push(ret);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
            var msg = H52D_Framework.Format(data.strPromptInfo, Str[0], Str[1], Str[2], Str[3], Str[4], Str[5], Str[6], Str[7], Str[8], Str[9], Str[10]);
            var id = tipsID;
            if (id == 100181 || id == 100235) {
                // msg = msg + id + "~" + GetHtmlStrByColor(strName, "#ffec50");
                msg = msg + id + "~" + strName;
            }
            H52D_Framework.Event.DispatchEvent("NoticeEvent", [msg]);
        };
        /**
         * 服务器返回账号掉线信息
         * @param type 掉线类型
         * @param data 提示数据
         */
        TipsLogic.prototype.C_LastError = function (buf) {
            this.offLineType = buf[0];
            this.offLineData = buf[1];
        };
        /**
         * 服务器连接断开了，给予提示信息
         */
        TipsLogic.prototype.OnDisConnect = function () {
            var str = H52D_Framework.Format(this._disConnectTips[1], this.offLineType);
            //封号踢人
            if (OffLineEnum.eBanPlay == this.offLineType) {
                var tstr = H52D_Framework.GetFormatTime(this.offLineData);
                str += H52D_Framework.Format(this._disConnectTips[2], tstr);
                H52D_Framework.RemoteCall.Instance.CloseReConnect();
            }
            //顶号（重复登录）
            else if (OffLineEnum.eRepeatLogin == this.offLineType) {
                str += H52D_Framework.Format(this._disConnectTips[3], this.offLineData);
                H52D_Framework.RemoteCall.Instance.CloseReConnect();
            }
            //GM踢人，不封号
            else if (OffLineEnum.eGMKick == this.offLineType) {
                str += this._disConnectTips[4];
                H52D_Framework.RemoteCall.Instance.CloseReConnect();
            }
            //服务器关闭
            else if (OffLineEnum.eServerShutdown == this.offLineType) {
                str += this._disConnectTips[5];
                H52D_Framework.RemoteCall.Instance.CloseReConnect();
            }
            //登陆失败
            else if (OffLineEnum.eLoginFailed == this.offLineType) {
                str += this._disConnectTips[6];
                H52D_Framework.RemoteCall.Instance.CloseReConnect();
            }
            // 登陆服务器错误
            else if (OffLineEnum.eLoginServerError == this.offLineType) {
                str += this._disConnectTips[7];
                H52D_Framework.RemoteCall.Instance.CloseReConnect();
            }
            //服务器高负载
            else if (OffLineEnum.eLoginFull == this.offLineType) {
                str += this._disConnectTips[8];
                H52D_Framework.RemoteCall.Instance.CloseReConnect();
            }
            //改名被踢
            else if (OffLineEnum.eReName == this.offLineType) {
                str += this._disConnectTips[9];
                H52D_Framework.RemoteCall.Instance.CloseReConnect();
            }
            //网络异常
            else if (OffLineEnum.eUnknow == this.offLineType) {
                if (H52D_Framework.MasterPlayer.Instance.bInGame) {
                    return;
                }
                else {
                    str += this._disConnectTips[10];
                }
            }
            //使用外挂，恶意软件
            else if (OffLineEnum.eShield == this.offLineType) {
                str += this._disConnectTips[11];
                H52D_Framework.RemoteCall.Instance.CloseReConnect();
            }
            //未知错误
            else {
                //已经在游戏中，不提示，走断线重连
                if (H52D_Framework.MasterPlayer.Instance.bInGame) {
                    return;
                }
                else {
                    str += this._disConnectTips[12];
                }
            }
            TipsLogic.Instance.OpenMessageBox(str, Laya.Handler.create(this, function () {
                location.reload();
            }));
        };
        return TipsLogic;
    }());
    H52D_Framework.TipsLogic = TipsLogic;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=TipsLogic.js.map