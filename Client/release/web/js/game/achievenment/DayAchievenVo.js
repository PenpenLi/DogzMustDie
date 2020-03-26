/**
* 成就模板
*/
var H52D_Framework;
(function (H52D_Framework) {
    var DayAchievenVo = /** @class */ (function () {
        function DayAchievenVo(eventId) {
            this._star = 1;
            this._eventId = eventId;
            this.Init();
        }
        Object.defineProperty(DayAchievenVo.prototype, "eventId", {
            /**事件ID */
            get: function () {
                return this._eventId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DayAchievenVo.prototype, "aimvalue", {
            /**达成条件值 */
            get: function () {
                return this._aimValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DayAchievenVo.prototype, "yetvalue", {
            /**已达成条件值 */
            get: function () {
                return this._yetValue;
            },
            set: function (value) {
                this._yetValue = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DayAchievenVo.prototype, "reward", {
            /**达成奖励 */
            get: function () {
                return this._reward;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DayAchievenVo.prototype, "rewardType", {
            /**达成奖励类型 */
            get: function () {
                return this._rewardType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DayAchievenVo.prototype, "order", {
            /**类型排序 */
            get: function () {
                return this._order;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DayAchievenVo.prototype, "star", {
            /**第几星 */
            get: function () {
                return this._star;
            },
            set: function (num) {
                this._star = num;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DayAchievenVo.prototype, "maxStar", {
            /**最大星星数 */
            get: function () {
                return this._maxStar;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DayAchievenVo.prototype, "info", {
            /**成就描述 */
            get: function () {
                return this._info;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DayAchievenVo.prototype, "strPic", {
            /**成就图片路径 */
            get: function () {
                return this._strPic;
            },
            enumerable: true,
            configurable: true
        });
        DayAchievenVo.prototype.Init = function () {
            this._maxStar = H52D_Framework.GetTabLength(H52D_Framework.DayAchieveConfig[this._eventId]);
            var star = this._star > this._maxStar ? this._maxStar : this._star;
            var achieve = H52D_Framework.DayAchieveConfig[this._eventId][star];
            this._aimValue = achieve.Value;
            this._yetValue = H52D_Framework.MasterPlayer.Instance.GetEventDayProByType(this._eventId);
            achieve.Reward[1] == 0 ? this._reward = achieve.Reward[2] : this._reward = achieve.Reward[1];
            achieve.Reward[1] != 0 ? this._rewardType = H52D_Framework.BaseDefine.ItemIdGold : this._rewardType = H52D_Framework.BaseDefine.ItemIdDiamonds;
            this._order = achieve.order;
            this._info = H52D_Framework.GetInfoAttr.Instance.GetText(achieve.info);
            this._strPic = achieve.strPic;
        };
        DayAchievenVo.prototype.SetYetValue = function () {
            this._yetValue = H52D_Framework.MasterPlayer.Instance.GetEventProByType(this._eventId);
        };
        return DayAchievenVo;
    }());
    H52D_Framework.DayAchievenVo = DayAchievenVo;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=DayAchievenVo.js.map