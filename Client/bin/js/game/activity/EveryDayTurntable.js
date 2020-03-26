/*
* 充值转盘;
*/
var H52D_Framework;
(function (H52D_Framework) {
    var EveryDayTurntable = /** @class */ (function () {
        // 接收服务器消息
        function EveryDayTurntable() {
            this.tableAngle = 0; // 储存的角度
            this.awardArr = []; // 道具奖励信息
            this.startTime = 0; // 开始时间
            this.endTime = 0; // 结束时间
            this.timerNum = 0; // 剩余时间 
            this.freeNum = 0;
            this.canFreeNum = 0; // 可用免费次数
            this.endNum = 0; // 累计使用次数
            this.functionName = ""; // 功能名字
            this.onePrice = 0; // 一次的价钱
            this.tenPrice = 0; // 十次的价钱
            this._turnNumObjAll = [5, 10, 50, 70, 100];
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_DayDialInfo", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_DayDialAward", this);
        }
        Object.defineProperty(EveryDayTurntable, "Instance", {
            get: function () {
                if (EveryDayTurntable._inst == null)
                    EveryDayTurntable._inst = new EveryDayTurntable();
                return EveryDayTurntable._inst;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 上线同步数据
         */
        EveryDayTurntable.prototype.C_DayDialInfo = function (buf) {
            this.canFreeNum = this.freeNum - buf[0][1];
            this.endNum = buf[0][2];
            this.giftTypeData = buf[0][3];
            this.historyData = buf[0][4];
            var _historyData = new Object();
            var _index = 1;
            for (var h = H52D_Framework.GetTabLength(this.historyData); h > 0; h--) {
                _historyData[_index] = this.historyData[h];
                _index++;
            }
            this.historyData = _historyData;
            H52D_Framework.Event.DispatchEvent("updataTurnTable");
            H52D_Framework.Event.DispatchEvent('RefTurnTable');
            H52D_Framework.Event.DispatchEvent("UpdateBtnList_activebg");
        };
        /**
         * 转转盘
         */
        EveryDayTurntable.prototype.K_BuyChargeAward = function (num) {
            H52D_Framework.RemoteCall.Instance.Send('K_BuyChargeAward', this.functionID, num);
        };
        /**
         * 转盘回调
         */
        EveryDayTurntable.prototype.C_DayDialAward = function (buf) {
            this.indexItemData = buf[0];
            H52D_Framework.Event.DispatchEvent("TurnTableYAOYIYAO");
        };
        /**
         * 领取奖励
         */
        EveryDayTurntable.prototype.K_GetActivityAwardReq = function (num) {
            H52D_Framework.RemoteCall.Instance.Send('K_GetActivityAwardReq', this.functionID, num);
        };
        // 活动开启
        EveryDayTurntable.prototype.Start = function (cls) {
            this.ActionData = cls.data;
        };
        //活动结束
        EveryDayTurntable.prototype.OnDestroy = function (type) {
            H52D_Framework.Event.DispatchEvent("CloseOActivityView", type);
            this.tableAngle = 0;
            this.turnData = null;
            this.awardArr = [];
            this.functionID = null;
            this.giftData = null;
            this.startTime = 0;
            this.endTime = 0;
            this.timerNum = 0;
            this.canFreeNum = 0;
            this.freeNum = 0;
            this.endNum = 0;
            this.giftTypeData = null;
            this.indexItemData = null;
            this.functionName = "";
            this.historyData = null;
            this.onePrice = 0;
            this.tenPrice = 0;
        };
        Object.defineProperty(EveryDayTurntable.prototype, "ActionData", {
            /**当前的数据信息 */
            get: function () {
                return this.turnData;
            },
            set: function (buf) {
                this.turnData = buf; // 所有信息
                this.awardArr = []; // 道具信息
                this.functionID = buf["id"]; // 功能id
                this.giftData = buf["cost"]; // 达成礼包信息
                this.startTime = Number(buf["svst"]); // 开始时间
                this.endTime = Number(buf["svot"]); // 结束时间
                this.tableAngle = 0;
                if (buf["award"]) {
                    this.freeNum = buf["award"][0]['freenum']; //免费次数
                    this.discount = buf["award"][0]['rebate'] / 10 == 0 ? 1 : buf["award"][0]['rebate'] / 10; //折扣
                    this.onePrice = buf["award"][0]["onecost"];
                    this.tenPrice = buf["award"][0]["tencost"];
                    // for (let i in buf["award"]) {
                    //     this.awardArr.push(buf.award[String(i)]);
                    // }
                    for (var i = 1; i <= 10; i++) {
                        this.awardArr.push(buf.award[String(i)]);
                    }
                }
                this.functionName = buf["name"];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EveryDayTurntable.prototype, "TimerNum", {
            /**
             * 获取当前剩余时间
             */
            get: function () {
                return this.timerNum;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EveryDayTurntable.prototype, "TableAngle", {
            /**
             * 记录转盘角度
             */
            get: function () {
                return this.tableAngle;
            },
            set: function (angle) {
                this.tableAngle = angle;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EveryDayTurntable.prototype, "AwardData", {
            /**
             * 道具列表
             */
            get: function () {
                return this.awardArr;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EveryDayTurntable.prototype, "FunctionID", {
            /**
             * 功能id
             */
            get: function () {
                return this.functionID;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EveryDayTurntable.prototype, "GiftData", {
            /**
             * 达成礼包信息
             */
            get: function () {
                return this.giftData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EveryDayTurntable.prototype, "FunctionName", {
            /**
             * 功能名字
             */
            get: function () {
                return this.functionName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EveryDayTurntable.prototype, "EndNum", {
            /**
             * 累计使用次数
             */
            get: function () {
                return this.endNum;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EveryDayTurntable.prototype, "FreeNum", {
            /**
             * 免费次数
             */
            get: function () {
                return this.canFreeNum;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EveryDayTurntable.prototype, "GiftTypeData", {
            /**
             * 礼包领取状态
             */
            get: function () {
                return this.giftTypeData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EveryDayTurntable.prototype, "StartTime", {
            /**
             * 开始时间
             */
            get: function () {
                return this.startTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EveryDayTurntable.prototype, "EndTime", {
            /**
             * 结束时间
             */
            get: function () {
                return this.endTime;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 后台返回抽到几个物品
         */
        EveryDayTurntable.prototype.GetIndexGift = function () {
            var num = 0;
            for (var i in this.indexItemData) {
                num++;
            }
            return num;
        };
        Object.defineProperty(EveryDayTurntable.prototype, "GiftItemData", {
            /**
             * 返回摇到的物品
             */
            get: function () {
                return this.indexItemData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EveryDayTurntable.prototype, "ShowGift", {
            /**展示的物品list(1抽) */
            get: function () {
                var _itemArr0 = new Object();
                var _itemArr = new Object();
                for (var i in this.indexItemData) {
                    _itemArr[this.indexItemData[i][2]] = this.indexItemData[i][3];
                    var _itemType = this.awardArr[this.indexItemData[i][1] - 1]["Type"];
                    _itemArr0[_itemType] = _itemArr;
                }
                return _itemArr0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EveryDayTurntable.prototype, "ShowGiftMore", {
            /**展示的物品list(10抽) */
            get: function () {
                var _itemArr0 = new Object();
                var _itemArrType = new Object();
                var _itemArr = new Object();
                for (var i in this.indexItemData) {
                    _itemArr = new Object();
                    _itemArrType = new Object();
                    _itemArr[this.indexItemData[i][2]] = this.indexItemData[i][3];
                    var _itemType = this.awardArr[this.indexItemData[i][1] - 1]["Type"];
                    _itemArrType[_itemType] = _itemArr;
                    _itemArr0[i] = _itemArrType;
                }
                return _itemArr0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EveryDayTurntable.prototype, "HistoryData", {
            /**
             * 中奖历史记录
             */
            get: function () {
                return this.historyData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EveryDayTurntable.prototype, "GetTurnNum", {
            /**抽奖次数 */
            get: function () {
                return this._turnNum;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EveryDayTurntable.prototype, "Discount", {
            /**折扣 */
            get: function () {
                return this.discount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EveryDayTurntable.prototype, "OneCost", {
            /**
             * 一次的价钱
             */
            get: function () {
                return Number(this.onePrice);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EveryDayTurntable.prototype, "TenCost", {
            /**
             * 十次的价钱
             */
            get: function () {
                return Number(this.tenPrice);
            },
            enumerable: true,
            configurable: true
        });
        /**点击额外宝箱奖励 */
        EveryDayTurntable.prototype.OnClickOpenBox = function (id) {
            if (this._turnNum >= this._turnNumObjAll[id]) {
                if (this.giftTypeData[id] != 1) {
                    //可领取
                }
            }
            else {
                //打开详情
            }
        };
        /**红点 */
        EveryDayTurntable.prototype.red_contr = function () {
            if (this.canFreeNum > 0) {
                return true;
            }
            return false;
        };
        return EveryDayTurntable;
    }());
    H52D_Framework.EveryDayTurntable = EveryDayTurntable;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=EveryDayTurntable.js.map