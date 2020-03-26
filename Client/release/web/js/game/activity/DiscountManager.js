/**
* 打折管理器
*/
var H52D_Framework;
(function (H52D_Framework) {
    var DiscountManager = /** @class */ (function () {
        function DiscountManager() {
            //活动购买价格
            this.tPrivilegeMoney = {};
            this.tBoxMoney = {};
            this.tLotteryMoney = {};
            //活动购买最大次数
            this.nPrivilegeMaxTims = 0;
            this.nBoxMaxTims = 0;
            //活动已购买次数
            this.tPrivilegeTims = {};
            this.tBoxTims = {};
            // public addPrivilegeTims(id) {
            // 	if (!this.tPrivilegeTims[id]) {
            // 		this.tPrivilegeTims[id] = 0
            // 	}
            // 	this.tPrivilegeTims[id]++
            // }
            // public addBoxTims(id) {
            // 	if (!this.tBoxTims[id]) {
            // 		this.tBoxTims[id] = 0
            // 	}
            // 	this.tBoxTims[id]++
            // }
            //活动结束时间
            this.tPrivilegeSvot = 0;
            this.tBoxSvot = 0;
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_UpdatePrivilegeDiscount", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_UpdateBoxDiscount", this);
            this._bStartLottery = false;
            this._bStartPrivilege = false;
            this._bStartBox = false;
        }
        Object.defineProperty(DiscountManager, "Instance", {
            get: function () {
                if (DiscountManager._init == null) {
                    DiscountManager._init = new DiscountManager();
                }
                return DiscountManager._init;
            },
            enumerable: true,
            configurable: true
        });
        DiscountManager.prototype.getPrivilegeTims = function (id) {
            return this.tPrivilegeTims[id] || 0;
        };
        DiscountManager.prototype.getBoxTims = function (id) {
            return this.tBoxTims[id] || 0;
        };
        DiscountManager.prototype.C_UpdatePrivilegeDiscount = function (buf) {
            var nPrivilege = buf[0];
            var nPrivilegeDiscount = buf[1];
            this.tPrivilegeTims[nPrivilege] = nPrivilegeDiscount;
        };
        DiscountManager.prototype.C_UpdateBoxDiscount = function (buf) {
            var nID = buf[0];
            var nBoxDiscount = buf[1];
            this.tBoxTims[nID] = nBoxDiscount;
        };
        // 活动开启
        DiscountManager.prototype.Start = function (cls) {
            this.ActionData = cls.data;
            var type = cls.type;
            if (type == OActivityEnum.eLotteryDiscount) {
                this._bStartLottery = true;
                this.tLotteryMoney = this.ActionData.award[1].money;
                this.nLotteryMaxTims = this.ActionData.award[1].value;
                H52D_Framework.Event.DispatchEvent("ShowRedPoint", [E_OpenGrade.SHOP]);
            }
            else if (type == OActivityEnum.ePrivilegeDiscount) {
                this._bStartPrivilege = true;
                this.tPrivilegeMoney = this.ActionData.award[1].money;
                this.nPrivilegeMaxTims = this.ActionData.award[1].value;
                this.tPrivilegeSvot = cls.svot;
            }
            else if (type == OActivityEnum.eBoxDiscount) {
                this._bStartBox = true;
                this.tBoxMoney = this.ActionData.award[1].money;
                this.nBoxMaxTims = this.ActionData.award[1].value;
                this.tBoxSvot = cls.svot;
            }
        };
        //活动结束
        DiscountManager.prototype.OnDestroy = function (_type) {
            H52D_Framework.Event.DispatchEvent("CloseOActivityView", _type);
            //打折类型
            if (_type == OActivityEnum.eLotteryDiscount) {
                this._bStartLottery = false;
            }
            else if (_type == OActivityEnum.ePrivilegeDiscount) {
                this._bStartPrivilege = false;
                H52D_Framework.MainRoleLogic.Instance.SetPrivList();
                H52D_Framework.Event.DispatchEvent('privListTime');
            }
            else if (_type == OActivityEnum.eBoxDiscount) {
                this._bStartBox = false;
                H52D_Framework.Event.DispatchEvent("UpdateBoxList");
            }
            H52D_Framework.Event.DispatchEvent("ShowRedPoint", [E_OpenGrade.SHOP]);
        };
        Object.defineProperty(DiscountManager.prototype, "ActionData", {
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
        Object.defineProperty(DiscountManager.prototype, "LotteryMoney", {
            get: function () {
                if (this._actionDate == null)
                    return;
                return this.tLotteryMoney;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DiscountManager.prototype, "DiscountDay", {
            get: function () {
                if (this._actionDate == null)
                    return;
                return this.nLotteryMaxTims;
            },
            enumerable: true,
            configurable: true
        });
        /**是否开启了十连抽打折 */
        DiscountManager.prototype.IsStartLotteryAction = function () {
            if (this.DiscountDay == null || !this._bStartLottery) {
                return false;
            }
            var day = H52D_Framework.Time.serverTime.getDay();
            var b = false;
            var daySer = this.DiscountDay.split("#");
            for (var key in daySer) {
                b = daySer[key] == String(day);
                if (b)
                    break;
            }
            return (H52D_Framework.MasterPlayer.Instance.GetEventDayProByType(EventProEnum.LotteryNum) == null || H52D_Framework.MasterPlayer.Instance.GetEventDayProByType(EventProEnum.LotteryNum) == 0) && b;
        };
        /**是否开启了特权打折 */
        DiscountManager.prototype.IsStartPrivilegeAction = function () {
            if (this.DiscountDay == null || !this._bStartPrivilege) {
                return false;
            }
            return this._bStartPrivilege;
        };
        /**是否开启了宝箱打折 */
        DiscountManager.prototype.IsStartBoxAction = function () {
            if (this.DiscountDay == null || !this._bStartBox) {
                return false;
            }
            return this._bStartBox;
        };
        /**是否显示红点 宝箱 */
        DiscountManager.prototype.IsShowShopPint = function () {
            var b;
            var boxCfg = H52D_Framework.MarketConfig[2];
            for (var id in boxCfg) {
                if (this.getBoxTims(id) < this.nBoxMaxTims) {
                    b = true;
                }
            }
            return this.IsStartBoxAction() && b && this.IsStartLotteryAction();
        };
        /**是否显示红点 特权 */
        DiscountManager.prototype.IsShowRolePint = function () {
            var b;
            var cfg = H52D_Framework.PrivilegeConfig;
            for (var id in cfg) {
                if (this.getPrivilegeTims(id) < this.nPrivilegeMaxTims) {
                    b = true;
                }
            }
            return this.IsStartPrivilegeAction() && b;
        };
        return DiscountManager;
    }());
    H52D_Framework.DiscountManager = DiscountManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=DiscountManager.js.map