var H52D_Framework;
(function (H52D_Framework) {
    var GetInfoAttr = /** @class */ (function () {
        function GetInfoAttr() {
            this.b_isAllScreen = false;
        }
        Object.defineProperty(GetInfoAttr, "Instance", {
            get: function () {
                if (GetInfoAttr._inst == null) {
                    GetInfoAttr._inst = new GetInfoAttr();
                }
                return GetInfoAttr._inst;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GetInfoAttr.prototype, "IsAllScreen", {
            get: function () {
                return this.b_isAllScreen;
            },
            /**主界面下方界面是否为全屏 */
            set: function (buf) {
                this.b_isAllScreen = buf;
            },
            enumerable: true,
            configurable: true
        });
        /**获取国际化文字 */
        GetInfoAttr.prototype.GetText = function (id) {
            var sStr = "";
            if (H52D_Framework.StringInfoConfig[id]) {
                if (H52D_Framework.IsNotBaiDuSdk()) {
                    sStr = H52D_Framework.StringInfoConfig[id].ss;
                    if (sStr == "0") {
                        sStr = H52D_Framework.StringInfoConfig[id].s;
                    }
                }
                else {
                    sStr = H52D_Framework.StringInfoConfig[id].s;
                }
            }
            return sStr;
        };
        /** 获取国际化文字,包含替换 */
        GetInfoAttr.prototype.GetSystemText = function (msg) {
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
                else if (H52D_Framework.StringInfoConfig[msg]) {
                    msg = this.GetText(msg); //国际化
                }
                else {
                    msg = "";
                }
            }
            else {
                msg = "";
            }
            return H52D_Framework.Format.apply(void 0, [msg].concat(args));
        };
        /**获取UI标题文字 */
        GetInfoAttr.prototype.GetTitle = function (e) {
            var id = H52D_Framework.OpenGradeConfig[e].NamaId;
            var sStr = this.GetText(id);
            return sStr;
        };
        /**获取时间间隔(时间戳)
         * b_front:是否为前置的时间戳
         */
        GetInfoAttr.prototype.GetCountDown = function (time, b_front) {
            var timeNow = Date.now() / 1000;
            if (b_front) {
                return timeNow - time;
            }
            return time - timeNow;
        };
        /**获取倒计时 */
        GetInfoAttr.prototype.GrtTimeOut = function (secs) {
            secs = Number(secs.toString().split(".")[0]);
            var day = Math.floor(secs / 86400);
            var hour = Math.floor((secs - day * 86400) / 3600);
            var min = Math.floor((secs - hour * 3600) / 60);
            var sec = secs - hour * 3600 - min * 60;
            var str = '';
            if (day > 0) {
                str = (day >= 10 ? day : '0' + day) + ':' + (hour >= 10 ? hour : '0' + hour);
            }
            else if (hour > 0) {
                str = (hour >= 10 ? hour : '0' + hour) + ':' + (min >= 10 ? min : '0' + min);
            }
            else if (min > 0) {
                str = (min >= 10 ? min : '0' + min) + ':' + (sec >= 10 ? sec : '0' + sec);
            }
            else {
                str = (min >= 10 ? min : '0' + min) + ':' + (sec >= 10 ? sec : '0' + sec);
            }
            return str;
        };
        /**[]是否为空 */
        GetInfoAttr.prototype.GetObjIsNull = function (obj) {
            for (var i in obj) {
                return false;
            }
            return true;
        };
        /**起名空格 */
        GetInfoAttr.prototype.Format = function (str) {
            var index = 0;
            while (str.search(" ") != -1) {
                str = str.replace(' ', "");
            }
            return str;
        };
        /**当前关卡可得金币数量 */
        GetInfoAttr.prototype.GetThisOrderGoldNum = function () {
            var Order = H52D_Framework.MasterPlayer.Instance.player.CunstLevel;
            var goldNum = 0;
            var rewardObj = new Object();
            for (var i in H52D_Framework.CustomspassConfig) {
                if (H52D_Framework.CustomspassConfig[i].customsOrder == Order) {
                    rewardObj[1] = H52D_Framework.CustomspassConfig[i].waveRewardID;
                    rewardObj[2] = H52D_Framework.CustomspassConfig[i].extraRewardID;
                    break;
                }
            }
            for (var i in rewardObj) {
                var _reward = H52D_Framework.RewardConfig[rewardObj[i]].reWrad;
                for (var j in _reward) {
                    if (_reward[j][2] == 1) {
                        //金币
                        goldNum += _reward[j][3];
                    }
                }
            }
            return goldNum;
        };
        /**根据物品品质获取颜色 */
        GetInfoAttr.prototype.GetColor = function (num) {
            return QulityColorEnum[num] ? QulityColorEnum[num] : QulityColorEnum[7];
        };
        /**获取长度 */
        GetInfoAttr.prototype.GetObjLength = function (obj) {
            var _length = 0;
            for (var i in obj) {
                _length++;
            }
            return _length;
        };
        return GetInfoAttr;
    }());
    H52D_Framework.GetInfoAttr = GetInfoAttr;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=GetInfoAttr.js.map