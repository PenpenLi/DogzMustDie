/**
* 成就模板
*/
var H52D_Framework;
(function (H52D_Framework) {
    var AchievenVo = /** @class */ (function () {
        /**
         *
         * @param eventId 事件ID
         * @param achievenType 成就类型
         */
        function AchievenVo(eventId, achievenType) {
            this._star = 1;
            this._eventId = eventId;
            this._achievenType = achievenType;
            this.Init();
        }
        Object.defineProperty(AchievenVo.prototype, "eventId", {
            /**事件ID */
            get: function () {
                return this._eventId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AchievenVo.prototype, "achievenType", {
            /**成就类型 */
            get: function () {
                return this._achievenType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AchievenVo.prototype, "aimvalue", {
            /**达成条件值 */
            get: function () {
                return this._aimValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AchievenVo.prototype, "yetvalue", {
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
        Object.defineProperty(AchievenVo.prototype, "reward", {
            /**达成奖励 */
            get: function () {
                return this._reward;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AchievenVo.prototype, "rewardType", {
            /**达成奖励类型 */
            get: function () {
                return this._rewardType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AchievenVo.prototype, "order", {
            /**类型排序 */
            get: function () {
                return this._order;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AchievenVo.prototype, "star", {
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
        Object.defineProperty(AchievenVo.prototype, "maxStar", {
            /**最大星星数 */
            get: function () {
                return this._maxStar;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AchievenVo.prototype, "info", {
            /**成就描述 */
            get: function () {
                return this._info;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AchievenVo.prototype, "strPic", {
            /**成就图片路径 */
            get: function () {
                return this._strPic;
            },
            enumerable: true,
            configurable: true
        });
        AchievenVo.prototype.Init = function () {
            var star;
            var achieve;
            if (this._achievenType == E_AchievenType.eDay) {
                this._maxStar = H52D_Framework.GetTabLength(H52D_Framework.DayAchieveConfig[this._eventId]);
                star = this._star > this._maxStar ? this._maxStar : this._star;
                achieve = H52D_Framework.DayAchieveConfig[this._eventId][star];
                this._yetValue = H52D_Framework.MasterPlayer.Instance.GetEventDayProByType(this._eventId);
            }
            else if (this._achievenType == E_AchievenType.eAchieven) {
                this._maxStar = H52D_Framework.GetTabLength(H52D_Framework.AchieveConfig[this._eventId]);
                star = this._star > this._maxStar ? this._maxStar : this._star;
                achieve = H52D_Framework.AchieveConfig[this._eventId][star];
                this._yetValue = H52D_Framework.MasterPlayer.Instance.GetEventProByType(this._eventId);
            }
            this._aimValue = achieve.Value;
            achieve.Reward[1] == 0 ? this._reward = achieve.Reward[2] : this._reward = achieve.Reward[1];
            achieve.Reward[1] != 0 ? this._rewardType = H52D_Framework.BaseDefine.ItemIdGold : this._rewardType = H52D_Framework.BaseDefine.ItemIdDiamonds;
            this._order = achieve.order;
            this._info = H52D_Framework.GetInfoAttr.Instance.GetText(achieve.info);
            this._strPic = achieve.strPic;
        };
        AchievenVo.prototype.SetYetValue = function () {
            this._yetValue = H52D_Framework.MasterPlayer.Instance.GetEventProByType(this._eventId);
        };
        return AchievenVo;
    }());
    H52D_Framework.AchievenVo = AchievenVo;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=achievenVo.js.map