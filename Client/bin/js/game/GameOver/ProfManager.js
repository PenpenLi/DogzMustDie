/*
* name;
*/
var H52D_Framework;
(function (H52D_Framework) {
    /**离线收益 管理 */
    var ProfManager = /** @class */ (function () {
        function ProfManager() {
        }
        ProfManager.prototype.Initialize = function () {
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_AddLeaveAward", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqLeaveAward", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_AddLeaveAwardAd", this);
        };
        Object.defineProperty(ProfManager, "Instance", {
            get: function () {
                if (this._instance == null) {
                    this._instance = new ProfManager();
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        /**接收 离线收益 */
        ProfManager.prototype.C_AddLeaveAward = function (buf) {
            this._time = buf[0];
            this._reward = buf[1];
        };
        ProfManager.prototype.C_AddLeaveAwardAd = function (buf) {
            this._time = buf[0];
            this._reward = buf[1];
            if (window["wx"]) {
                if (this._time > 60) {
                    if (H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes) {
                        H52D_Framework.UIManager.Instance.CreateUI("ProfitView", [H52D_Framework.ViewUpRoot]);
                    }
                    else {
                        var str = H52D_Framework.GetInfoAttr.Instance.GetSystemText(30071);
                        H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
                    }
                }
            }
        };
        ProfManager.prototype.C_ReqLeaveAward = function (buf) {
            if (window["wx"]) {
                var str = "恭喜获得：";
                str = str + "金币" + this._reward[1][1];
                H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
                str = "获得：经验" + this._reward[1][3];
                H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
            }
            if (H52D_Framework.UIManager.Instance.IsHave("ProfitView", H52D_Framework.ViewUpRoot)) {
                H52D_Framework.UIManager.Instance.DestroyUI("ProfitView", [H52D_Framework.ViewUpRoot]);
            }
        };
        /**创建离线收益面板 */
        ProfManager.prototype.Add_Prof = function () {
            if (H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes && this._time > 60) {
                H52D_Framework.UIManager.Instance.CreateUI("ProfitView", [H52D_Framework.ViewUpRoot]);
            }
        };
        Object.defineProperty(ProfManager.prototype, "Time", {
            get: function () {
                return this._time;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfManager.prototype, "AddReward", {
            get: function () {
                return this._reward;
            },
            enumerable: true,
            configurable: true
        });
        return ProfManager;
    }());
    H52D_Framework.ProfManager = ProfManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ProfManager.js.map