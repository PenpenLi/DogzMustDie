/**
* 成就管理器
*/
var H52D_Framework;
(function (H52D_Framework) {
    var AchievenManger = /** @class */ (function () {
        function AchievenManger() {
            /**每日成就任务列表 */
            this._dayMission = {};
            /**永久成就任务列表 */
            this._achievenMission = {};
            /**当前页面类型 */
            this._achievenType = E_AchievenType.eDay;
            this.LoadDayMission();
            this.LoadAchievenMission();
            H52D_Framework.Tick.Loop(5000, this, function () {
                H52D_Framework.Event.DispatchEvent("AchievenAttackNum");
            });
        }
        Object.defineProperty(AchievenManger, "Instance", {
            get: function () {
                if (AchievenManger._init == null) {
                    AchievenManger._init = new AchievenManger();
                }
                return AchievenManger._init;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AchievenManger.prototype, "dayMission", {
            /**每日成就任务列表 */
            get: function () {
                return this._dayMission;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AchievenManger.prototype, "achievenMission", {
            /**永久成就任务列表 */
            get: function () {
                return this._achievenMission;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AchievenManger.prototype, "achievenType", {
            /**当前页面类型 */
            get: function () {
                return this._achievenType;
            },
            /**设置当前页面类型 */
            set: function (type) {
                this._achievenType = type;
            },
            enumerable: true,
            configurable: true
        });
        AchievenManger.prototype.Initialize = function () {
            //开始同步通知
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_AllAchieveOnLine", this);
            //请求领取成就奖励回调
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqAchievementAward", this);
            //请求领取每日成就回调
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqDayAchievementAward", this);
        };
        /**上线同步成就信息 */
        AchievenManger.prototype.C_AllAchieveOnLine = function (buf) {
            var m_tAwardRecord = buf[0];
            var m_tDayAwardRecord = buf[1];
            for (var id in m_tAwardRecord) {
                var eventId = Number(id);
                var star = m_tAwardRecord[id];
                this._achievenMission[eventId].star = star;
                this._achievenMission[eventId].Init();
            }
            for (var id in m_tDayAwardRecord) {
                var eventId = Number(id);
                var star = m_tDayAwardRecord[id];
                this._dayMission[eventId].star = star;
                this._dayMission[eventId].Init();
            }
        };
        /**请求领取成就奖励回调 */
        AchievenManger.prototype.C_ReqAchievementAward = function (buf) {
            var nEventType = buf[0];
            var m_tAwardRecord = buf[1];
            var tAllAward = buf[2];
            var bShare = buf[3];
            var proType = H52D_Framework.BaseDefine.ItemShopTypePro;
            var reward = this._achievenMission[nEventType].reward;
            var rewardType = this._achievenMission[nEventType].rewardType;
            this._achievenMission[nEventType].star = m_tAwardRecord;
            this._achievenMission[nEventType].Init();
            if (bShare) {
                H52D_Framework.OneTimer(2000, function () {
                    H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(tAllAward);
                    H52D_Framework.OneTimer(200, function () {
                        H52D_Framework.Event.DispatchEvent("UpdateAchievenDate", [E_AchievenType.eAchieven]);
                    });
                });
            }
            else {
                H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(tAllAward);
                H52D_Framework.OneTimer(200, function () {
                    H52D_Framework.Event.DispatchEvent("UpdateAchievenDate", [E_AchievenType.eAchieven]);
                });
            }
        };
        /**请求领取每日成就回调 */
        AchievenManger.prototype.C_ReqDayAchievementAward = function (buf) {
            var nEventType = buf[0];
            var m_tAwardRecord = buf[1];
            var tAllAward = buf[2];
            var bShare = buf[3];
            var proType = H52D_Framework.BaseDefine.ItemShopTypePro;
            var reward = this._dayMission[nEventType].reward;
            var rewardType = this._dayMission[nEventType].rewardType;
            this._dayMission[nEventType].star = m_tAwardRecord;
            this._dayMission[nEventType].Init();
            if (bShare) {
                H52D_Framework.OneTimer(2000, function () {
                    H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(tAllAward);
                    H52D_Framework.OneTimer(200, function () {
                        H52D_Framework.Event.DispatchEvent("UpdateAchievenDate", [E_AchievenType.eDay]);
                    });
                });
            }
            else {
                H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(tAllAward);
                H52D_Framework.OneTimer(200, function () {
                    H52D_Framework.Event.DispatchEvent("UpdateAchievenDate", [E_AchievenType.eDay]);
                });
            }
        };
        /**请求领取成就奖励 */
        AchievenManger.prototype.K_ReqAchievementAward = function (nEventType) {
            H52D_Framework.RemoteCall.Instance.Send('K_ReqAchievementAward', nEventType);
        };
        /**请求领取每日成就 */
        AchievenManger.prototype.K_ReqDayAchievementAward = function (nEventType) {
            H52D_Framework.RemoteCall.Instance.Send('K_ReqDayAchievementAward', nEventType);
        };
        /**加载成就任务 */
        AchievenManger.prototype.LoadAchievenMission = function () {
            /**加载永久成就任务 */
            for (var id in H52D_Framework.AchieveConfig) {
                var eventId = Number(id);
                this._achievenMission[eventId] = new H52D_Framework.AchievenVo(eventId, E_AchievenType.eAchieven);
            }
            /**加载每日目标 */
        };
        AchievenManger.prototype.LoadDayMission = function () {
            this._dayMission = {};
            /**加载每日成就任务 */
            for (var id in H52D_Framework.DayAchieveConfig) {
                var eventId = Number(id);
                this._dayMission[eventId] = new H52D_Framework.AchievenVo(eventId, E_AchievenType.eDay);
            }
            if (H52D_Framework.UIManager.Instance.IsHave("AchievementView", H52D_Framework.ViewUpRoot)) {
                H52D_Framework.Event.DispatchEvent("UpdateAchievenDate", [E_AchievenType.eDay]);
            }
        };
        /**是否显示红点 */
        AchievenManger.prototype.showPoint = function () {
            var bShow = false;
            for (var id in this._achievenMission) {
                var achieve = this._achievenMission[id];
                achieve.Init();
                if (achieve.yetvalue >= achieve.aimvalue && achieve.star <= achieve.maxStar) {
                    bShow = true;
                }
            }
            for (var id in this._dayMission) {
                var achieve = this._dayMission[id];
                achieve.Init();
                if (achieve.yetvalue >= achieve.aimvalue && achieve.star <= achieve.maxStar) {
                    bShow = true;
                }
            }
            return bShow;
        };
        AchievenManger.prototype.showPointAchieven = function () {
            var bShow = false;
            for (var id in this._achievenMission) {
                var achieve = this._achievenMission[id];
                achieve.Init();
                if (achieve.yetvalue >= achieve.aimvalue && achieve.star <= achieve.maxStar) {
                    bShow = true;
                }
            }
            return bShow;
        };
        AchievenManger.prototype.showPointDay = function () {
            var bShow = false;
            for (var id in this._dayMission) {
                var achieve = this._dayMission[id];
                achieve.Init();
                if (achieve.yetvalue >= achieve.aimvalue && achieve.star <= achieve.maxStar) {
                    bShow = true;
                }
            }
            return bShow;
        };
        return AchievenManger;
    }());
    H52D_Framework.AchievenManger = AchievenManger;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=AchievenManger.js.map