/*
* name;
*/
var H52D_Framework;
(function (H52D_Framework) {
    /**每日累充 数据管理 */
    var mEverydayManager = /** @class */ (function () {
        function mEverydayManager() {
            this.activon_arr = [];
            this._lingqu = {};
            this._isOpen = false;
            this.Initialize();
        }
        Object.defineProperty(mEverydayManager, "Instance", {
            get: function () {
                if (mEverydayManager._init == null) {
                    mEverydayManager._init = new mEverydayManager();
                }
                return mEverydayManager._init;
            },
            enumerable: true,
            configurable: true
        });
        mEverydayManager.prototype.Initialize = function () {
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_DayTotalChargeInfo", this); //上线同步 
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_DayTotalChargeGetAward", this);
            //this.GetArr();
        };
        // 活动开启
        mEverydayManager.prototype.Start = function (cls) {
            this.ActionData = cls.data;
        };
        Object.defineProperty(mEverydayManager.prototype, "IsOpen", {
            get: function () {
                return this._isOpen;
            },
            set: function (value) {
                this._isOpen = value;
            },
            enumerable: true,
            configurable: true
        });
        //活动结束
        mEverydayManager.prototype.OnDestroy = function (_type) {
            H52D_Framework.Event.DispatchEvent("CloseOActivityView", _type);
        };
        Object.defineProperty(mEverydayManager.prototype, "ActionData", {
            /**当前的数据信息 */
            get: function () {
                return this._actionDate;
            },
            set: function (view) {
                this._actionDate = view;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(mEverydayManager.prototype, "Activonarr", {
            /**活动里面的数组 */
            get: function () {
                return this.activon_arr;
            },
            set: function (view) {
                this.activon_arr = view;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(mEverydayManager.prototype, "MyMoney", {
            get: function () {
                return this._mymoney;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(mEverydayManager.prototype, "Lingqu", {
            get: function () {
                return this._lingqu;
            },
            enumerable: true,
            configurable: true
        });
        /**获取活动的数组 */
        mEverydayManager.prototype.GetArr = function () {
            if (this._actionDate == null)
                return this.activon_arr;
            this.activon_arr = [];
            for (var key in this._actionDate.award) {
                this.activon_arr.push(Number(key));
            }
            return this.activon_arr;
        };
        mEverydayManager.prototype.red_contr = function () {
            if (this._actionDate == null)
                return false;
            if (H52D_Framework.MasterPlayer.Instance.player.Level < 3)
                return false;
            for (var key in this._actionDate.award) {
                var info = this._actionDate.award[key];
                var bool = info.value > this._mymoney ? false : true;
                if (this._lingqu[key] != 1 && bool) {
                    return true;
                }
            }
            return false;
        };
        /**控制特效显示 */
        mEverydayManager.prototype.eff_Contr = function () {
            if (this._actionDate == null)
                return false;
            for (var key in this._actionDate.award) {
                var info = this._actionDate.award[key];
                var bool = info.value > this._mymoney ? false : true;
                if (!this._lingqu[key] && !bool) {
                    return true;
                }
            }
            return false;
        };
        //********************************* */
        /**上线同步数据 */
        mEverydayManager.prototype.C_DayTotalChargeInfo = function (buf) {
            this._mymoney = buf[0];
            this._lingqu = buf[1];
        };
        /**请求领取奖励成功 */
        mEverydayManager.prototype.C_DayTotalChargeGetAward = function (buf) {
            var data = buf[0];
            H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(buf[1]);
            this._lingqu[data] = 1;
            H52D_Framework.Event.DispatchEvent("UpdateView_everydaymoney");
            H52D_Framework.Event.DispatchEvent("UpdateBtnList");
            H52D_Framework.Event.DispatchEvent("UpdateOActivitysEntrance");
            H52D_Framework.Event.DispatchEvent("UpdateBtnList_activebg");
        };
        mEverydayManager.prototype.Red_print = function () {
            for (var key in this._lingqu) {
                var itemInfo = mEverydayManager.Instance.ActionData.award[key];
                var bool = mEverydayManager.Instance.MyMoney >= itemInfo.value ? true : false;
                if (bool && this._lingqu[key] != 1) {
                    return true;
                }
            }
            return false;
        };
        return mEverydayManager;
    }());
    H52D_Framework.mEverydayManager = mEverydayManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=mEverydayManager.js.map