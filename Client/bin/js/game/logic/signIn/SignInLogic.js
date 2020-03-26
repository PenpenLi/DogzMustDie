/**
* 签到逻辑
*/
var H52D_Framework;
(function (H52D_Framework) {
    var SignInLogic = /** @class */ (function () {
        function SignInLogic() {
            /**今天第几天*/
            this._toDayNum = 1;
            // 控制七日登录 底部文本显示
            this._textBool = false;
            /**今天签到了没*/
            this._toDayAlr = false;
            /**七日今天签到了没*/
            this._toDayAlrSeven = false;
            /**累计几天 七日*/
            this._toDayNumSeven = 0;
            // 广告专用记录领取次数
            this._todayNum = 0;
            this._alreadyArr = {};
            /** 记录领取记录 */
            this._weekReceive = 0;
            this._weekIndx = 0;
            /**记录QQ版本奖励领取次数  即将领取的天数*/
            this._dayTimes = 1;
            /**输入天数 获取7日物品*/
            this._sevenListData = {};
            /**List数据*/
            this._listData = {};
        }
        Object.defineProperty(SignInLogic, "Instance", {
            get: function () {
                if (SignInLogic._inst == null)
                    SignInLogic._inst = new SignInLogic();
                return SignInLogic._inst;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignInLogic.prototype, "ListData", {
            /**获取List数据*/
            get: function () {
                return this._listData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignInLogic.prototype, "SevenListData", {
            /**获取SevenList数据*/
            get: function () {
                return this._sevenListData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignInLogic.prototype, "WeekIndx", {
            get: function () {
                return this._weekIndx;
            },
            set: function (value) {
                this._weekIndx = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignInLogic.prototype, "WeekText", {
            get: function () {
                return this._textBool;
            },
            set: function (value) {
                this._textBool = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignInLogic.prototype, "ToDayNum", {
            /**获取今天第几天*/
            get: function () {
                return this._toDayNum;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignInLogic.prototype, "ToDayNumSeven", {
            /**获取今天第几天 七日*/
            get: function () {
                return this._toDayNumSeven;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignInLogic.prototype, "ReceiveTimes", {
            /**记录领取登录奖励天数 */
            get: function () {
                return this._dayTimes;
            },
            /**记录领取登录奖励天数 */
            set: function (value) {
                this._dayTimes = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignInLogic.prototype, "toDayAlrSeven", {
            /**今天是否领取了七日*/
            get: function () {
                return this._toDayAlrSeven;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignInLogic.prototype, "ToDayAlr", {
            /**获取今天签到了没*/
            get: function () {
                return this._toDayAlr;
            },
            enumerable: true,
            configurable: true
        });
        SignInLogic.prototype.Initialize = function () {
            //上线同步 每日签到
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_SignInSystemInfo', this);
            //签到回调 每日签到
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_ReqSignIn', this);
            //上线同步 七日签到
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_UpdateSevenInfo', this);
            //签到回调 七日签到
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_ReqSevenSignIn', this);
        };
        /** 是否显示主界面按钮 */
        SignInLogic.prototype.IsShowMainBtn = function () {
            if (window["wx"]) {
                return this._toDayNumSeven < 7;
            }
            else {
                return this._toDayNumSeven <= 7;
            }
        };
        /** 是否显示主界面按钮 */
        SignInLogic.prototype.IsBtnVisible = function () {
            return this._toDayNumSeven > 0 && !this._toDayAlrSeven;
        };
        /**上线同步 每日签到 */
        SignInLogic.prototype.C_SignInSystemInfo = function (buf) {
            var toDay = Number(buf[0]);
            this._alreadyArr = buf[1];
            this.AddData(toDay, this._alreadyArr);
        };
        /**上线同步 七日签到 */
        SignInLogic.prototype.C_UpdateSevenInfo = function (buf) {
            var nSevenFlagDay = buf[0];
            var nSevenGetFlag = buf[1];
            this._toDayNumSeven = nSevenGetFlag;
            this._todayNum = nSevenGetFlag;
            this._toDayAlrSeven = nSevenGetFlag == 1;
            this._dayTimes = nSevenGetFlag + 1;
            this._weekReceive = this._toDayNumSeven;
            this.SevenData();
            if (window["wx"]) {
                this._toDayAlrSeven = false;
            }
            H52D_Framework.Event.DispatchEvent("UpdateBtnList");
            if (window["wx"]) {
                if (H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes && SignInLogic.Instance.ReceiveTimes <= 7) {
                    if (H52D_Framework.OpenCondition(E_OpenGrade.SEVEN, false, false)) {
                        H52D_Framework.UIManager.Instance.CreateUI("SevenSigninView", [H52D_Framework.ViewUpRoot]);
                    }
                }
            }
        };
        /**签到回调 每日签到 */
        SignInLogic.prototype.C_ReqSignIn = function (buf) {
            var item_info = buf[1];
            H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(item_info);
            this._listData[this._toDayNum].bAlready = true;
            this._toDayAlr = true;
            H52D_Framework.Event.DispatchEvent("UpDateList");
            H52D_Framework.Event.DispatchEvent("ConcealIcon");
            H52D_Framework.Event.DispatchEvent("ShowRedPoint", [E_OpenGrade.ROLE]);
        };
        /**签到回调 七日签到 */
        SignInLogic.prototype.C_ReqSevenSignIn = function (buf) {
            var item_info = buf[0];
            this._weekReceive = buf[1];
            if (this._weekReceive < 0) {
                this._weekReceive = 0;
            }
            this._toDayAlrSeven = true;
            H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(item_info);
            H52D_Framework.Event.DispatchEvent("UpdateBtnList");
            this._dayTimes += 1;
            this._toDayNumSeven = this._weekReceive;
            H52D_Framework.Event.DispatchEvent("changelabelText");
            this.SevenData();
            if (this._weekReceive >= 7 && H52D_Framework.UIManager.Instance.IsHave("SevenSigninView", H52D_Framework.ViewUpRoot)) {
                H52D_Framework.UIManager.Instance.DestroyUI("SevenSigninView", [H52D_Framework.ViewUpRoot]);
            }
        };
        /** 判断 七日登陆奖励是否领取 */
        SignInLogic.prototype.WeekReceive = function (nIdx) {
            var _bool = this._weekReceive <= nIdx ? true : false;
            return _bool;
        };
        /**每日签到请求 */
        SignInLogic.prototype.SendReqSignIn = function (bool) {
            H52D_Framework.RemoteCall.Instance.Send('K_ReqSignIn', bool);
        };
        /**七日签到请求 */
        SignInLogic.prototype.SendReqSevenSignIn = function (nIdx) {
            H52D_Framework.RemoteCall.Instance.Send('K_ReqSevenSignIn', nIdx);
        };
        SignInLogic.prototype.AddData = function (toDay, alreadyArr) {
            this._toDayNum = toDay;
            this._signData = {};
            for (var dayId in H52D_Framework.SignConfig) {
                var rewardId = H52D_Framework.SignConfig[dayId].reward;
                var reWradData = H52D_Framework.RewardConfig[rewardId].reWrad;
                this._signData[Number(dayId)] = reWradData;
            }
            for (var dayId in this._signData) {
                var dayIdNum = Number(dayId);
                var data = this._signData[dayId][1];
                var isOpt = void 0;
                var isToDay = void 0;
                var isOverdue = void 0;
                var isAlready = void 0;
                var isAlr = Number(alreadyArr[dayId] ? alreadyArr[dayId] : 0);
                isAlr == 0 ? isAlready = false : isAlready = true;
                dayIdNum < toDay ? isOverdue = true : isOverdue = false;
                if (dayIdNum == toDay) {
                    isToDay = true;
                    isOpt = true;
                }
                else {
                    isToDay = false;
                    isOpt = false;
                }
                this.ListData[Number(dayId)] = {
                    itemType: data[H52D_Framework.BaseDefine.ItemSellContentType],
                    itemId: data[H52D_Framework.BaseDefine.ItemSellContentId],
                    itemNum: data[H52D_Framework.BaseDefine.ItemNumSellContent],
                    bOpt: isOpt,
                    btToDay: isToDay,
                    bOverdue: isOverdue,
                    bAlready: isAlready
                };
            }
            if (this._toDayNum > 0) {
                this._toDayAlr = this.ListData[this._toDayNum].bAlready;
            }
            ;
        };
        SignInLogic.prototype.EmptyData = function () {
            this._alreadyArr[this._toDayNum] = this._toDayAlr == false ? 0 : 1;
            this._toDayAlrSeven = this._toDayAlr = false;
            var toDayNum = this._toDayNum == 15 ? 1 : (this._toDayNum + 1);
            this.AddData(toDayNum, this._alreadyArr);
            H52D_Framework.Event.DispatchEvent("UpDateList");
            H52D_Framework.Event.DispatchEvent("UpDateSevenList");
        };
        SignInLogic.prototype.SevenData = function () {
            //七日
            for (var dayId in H52D_Framework.SevenConfig) {
                var rewardId = H52D_Framework.SevenConfig[dayId].reward;
                var reward = H52D_Framework.RewardConfig[rewardId].reWrad;
                var toDay = this._toDayNumSeven == Number(dayId);
                var already = this._toDayNumSeven > Number(dayId);
                this.SevenListData[Number(dayId)] = {
                    itemType: reward[1][H52D_Framework.BaseDefine.ItemSellContentType],
                    itemId: reward[1][H52D_Framework.BaseDefine.ItemSellContentId],
                    itemNum: reward[1][H52D_Framework.BaseDefine.ItemNumSellContent],
                    btToDay: toDay,
                    bAlready: already,
                };
                if (this._toDayNumSeven > 0) {
                    var id = Number(dayId);
                    this.SevenListData[id].bAlready = this._toDayNumSeven >= Number(dayId);
                    //this.SevenListData[this._toDayNumSeven].bAlready = this._toDayAlrSeven;
                }
            }
            H52D_Framework.Event.DispatchEvent("UpDateSevenList");
        };
        return SignInLogic;
    }());
    H52D_Framework.SignInLogic = SignInLogic;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=SignInLogic.js.map