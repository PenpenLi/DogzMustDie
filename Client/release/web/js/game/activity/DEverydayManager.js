/*
* name;
*/
var H52D_Framework;
(function (H52D_Framework) {
    /***消耗钻石  数据管理 */
    var DEverydayManager = /** @class */ (function () {
        function DEverydayManager() {
            this._lingqu = {};
            this.action_arr = [];
            this.Initialize();
        }
        Object.defineProperty(DEverydayManager, "Instance", {
            get: function () {
                if (DEverydayManager._init == null) {
                    DEverydayManager._init = new DEverydayManager();
                }
                return DEverydayManager._init;
            },
            enumerable: true,
            configurable: true
        });
        DEverydayManager.prototype.Initialize = function () {
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_DayConsumeInfo", this); // 花费了多少钻石
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_DayConsumeGetAward", this);
            this._bool = true;
        };
        Object.defineProperty(DEverydayManager.prototype, "ShowEff", {
            get: function () {
                return this._bool;
            },
            set: function (value) {
                this._bool = value;
            },
            enumerable: true,
            configurable: true
        });
        // 活动开启
        DEverydayManager.prototype.Start = function (cls) {
            this.ActionData = cls.data;
        };
        //活动结束
        DEverydayManager.prototype.OnDestroy = function (_type) {
            H52D_Framework.Event.DispatchEvent("CloseOActivityView", _type);
        };
        Object.defineProperty(DEverydayManager.prototype, "Dnum", {
            /** 消耗的钻石数 */
            get: function () {
                return this.d_num;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DEverydayManager.prototype, "ActionData", {
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
        Object.defineProperty(DEverydayManager.prototype, "ActionArr", {
            get: function () {
                return this.action_arr;
            },
            set: function (value) {
                this.action_arr = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DEverydayManager.prototype, "LingQu", {
            get: function () {
                return this._lingqu;
            },
            enumerable: true,
            configurable: true
        });
        DEverydayManager.prototype.GetInfoArr = function () {
            this.action_arr = [];
            if (this._actionDate == null)
                return this.action_arr;
            for (var key in this._actionDate.award) {
                this.action_arr.push(Number(key));
            }
            return this.action_arr;
        };
        /**控制特效显示 */
        DEverydayManager.prototype.eff_Contr = function () {
            if (this._actionDate == null)
                return false;
            for (var key in this._actionDate.award) {
                var info = this._actionDate.award[key];
                var bool = info.value > this.d_num ? false : true;
                if (this._lingqu[key] != 1 && !bool) {
                    return true;
                }
            }
            return false;
        };
        DEverydayManager.prototype.red_contr = function () {
            if (this._actionDate == null)
                return false;
            for (var key in this._actionDate.award) {
                var info = this._actionDate.award[key];
                var bool = info.value > this.d_num ? false : true;
                if (this._lingqu[key] != 1 && bool) {
                    return true;
                }
            }
            return false;
        };
        /**************************** */
        /** 消耗了多少钻石 */
        DEverydayManager.prototype.C_DayConsumeInfo = function (buf) {
            this.d_num = buf[0];
            this._lingqu = buf[1];
        };
        /**请求领取奖励成功 */
        DEverydayManager.prototype.C_DayConsumeGetAward = function (buf) {
            var item_id = buf[0];
            H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(buf[1]);
            this._lingqu[item_id] = 1;
            H52D_Framework.Event.DispatchEvent("resh_diamond");
            H52D_Framework.Event.DispatchEvent("UpdateOActivitysEntrance");
            H52D_Framework.Event.DispatchEvent("UpdateBtnList");
            H52D_Framework.Event.DispatchEvent("UpdateBtnList_activebg");
        };
        return DEverydayManager;
    }());
    H52D_Framework.DEverydayManager = DEverydayManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=DEverydayManager.js.map