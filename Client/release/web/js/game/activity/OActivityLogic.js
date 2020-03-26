/**
* 运营活动逻辑类;
*/
//活动入口位置
var OActivityPosEnum;
(function (OActivityPosEnum) {
    OActivityPosEnum[OActivityPosEnum["eOActivityPos0"] = 0] = "eOActivityPos0";
    OActivityPosEnum[OActivityPosEnum["eOActivityPos1"] = 1] = "eOActivityPos1";
})(OActivityPosEnum || (OActivityPosEnum = {}));
// 活动入口名称
var OActivityPosName = {
    1: "活动",
};
//活动入口图标
var OActivityPosIcon = {
    1: "btn-zhujiemian-huodong.png",
};
// 功能类型
var OActivityEnum;
(function (OActivityEnum) {
    OActivityEnum[OActivityEnum["eEverydayMoney"] = 1] = "eEverydayMoney";
    OActivityEnum[OActivityEnum["eDiamondView"] = 2] = "eDiamondView";
    OActivityEnum[OActivityEnum["eLotteryDiscount"] = 3] = "eLotteryDiscount";
    OActivityEnum[OActivityEnum["ePrivilegeDiscount"] = 4] = "ePrivilegeDiscount";
    OActivityEnum[OActivityEnum["eBoxDiscount"] = 5] = "eBoxDiscount";
    OActivityEnum[OActivityEnum["eChangeitem"] = 6] = "eChangeitem";
    OActivityEnum[OActivityEnum["eDrop"] = 7] = "eDrop";
    OActivityEnum[OActivityEnum["eEveryDayTurn"] = 8] = "eEveryDayTurn";
})(OActivityEnum || (OActivityEnum = {}));
// 功能类型对应的View名
var OActivityViewName = {
    1: "EverydayMoneyView",
    2: "DiamondView",
    3: "",
    4: "",
    5: "",
    6: "ChangeGoodsView",
    7: "",
    8: 'EveryDayTurntableView' //每日转盘
};
var H52D_Framework;
(function (H52D_Framework) {
    var OActivityLogic = /** @class */ (function () {
        function OActivityLogic() {
            /**活动逻辑类对象集合 */
            this.OActivityFun = {};
            this.OActivityRed = {};
            /**缓存当前开启的运营活动数据 */
            this._openData = {};
            /**同步状态 */
            this._msgLoaded = false;
            /**储存当前开启的活动数据 */
            this._openList = {};
            /**储存当前未开启的活动数据 */
            this._unOpenList = {};
        }
        Object.defineProperty(OActivityLogic, "Instance", {
            get: function () {
                if (OActivityLogic._inst == null)
                    OActivityLogic._inst = new OActivityLogic();
                return OActivityLogic._inst;
            },
            enumerable: true,
            configurable: true
        });
        /**注册类对象*/
        OActivityLogic.prototype.RegisterClass = function () {
            this.OActivityFun[OActivityEnum.eEverydayMoney] = H52D_Framework.mEverydayManager;
            this.OActivityFun[OActivityEnum.eDiamondView] = H52D_Framework.DEverydayManager;
            this.OActivityFun[OActivityEnum.eLotteryDiscount] = H52D_Framework.DiscountManager;
            this.OActivityFun[OActivityEnum.ePrivilegeDiscount] = H52D_Framework.DiscountManager;
            this.OActivityFun[OActivityEnum.eBoxDiscount] = H52D_Framework.DiscountManager;
            this.OActivityFun[OActivityEnum.eChangeitem] = H52D_Framework.ChangeGoodsManager;
            this.OActivityFun[OActivityEnum.eDrop] = H52D_Framework.DiscountManager;
            this.OActivityFun[OActivityEnum.eEveryDayTurn] = H52D_Framework.EveryDayTurntable;
        };
        OActivityLogic.prototype.RegisterRedPoint = function () {
            this.OActivityRed[OActivityEnum.eEverydayMoney] = this.EverydayManager;
            this.OActivityRed[OActivityEnum.eDiamondView] = this.DEverydayManager;
            // this.OActivityRed[OActivityEnum.eLotteryDiscount] = DiscountManager.Instance.IsShowRolePint;
            // this.OActivityRed[OActivityEnum.ePrivilegeDiscount] = DiscountManager.Instance.IsShowRolePint;
            // this.OActivityRed[OActivityEnum.eBoxDiscount] = DiscountManager.Instance.IsShowRolePint;
            // this.OActivityRed[OActivityEnum.eChangeitem] = ChangeGoodsManager.Instance.red_contr;
            // this.OActivityRed[OActivityEnum.eDrop] = DiscountManager.Instance.IsShowRolePint;
            this.OActivityRed[OActivityEnum.eEveryDayTurn] = this.EveryDayTurn;
        };
        /**初始化所有活动 */
        OActivityLogic.prototype.Initialize = function () {
            //注册类对象
            this.RegisterClass();
            this.RegisterRedPoint();
            //调用所有类对象
            for (var i in this.OActivityFun) {
                this.OActivityFun[i].Instance;
            }
            //每5秒更新一次活动状态
            H52D_Framework.Tick.Loop(5000, this, this.UpdateOActivityOpen);
            H52D_Framework.Tick.Loop(1000, this, this.UpdateOActivityCloseTime);
            //同步所有活动的信息
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_AllActivitys", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_AllActivitysEnd", this);
        };
        /**同步所有活动的信息 */
        OActivityLogic.prototype.C_AllActivitys = function (data) {
            if (this._msgLoaded) {
                this._openList = {};
                this._unOpenList = {};
            }
            this._msgLoaded = false;
            this.SaveOActivitysData(data[0]);
        };
        /**同步所有活动信息结束 */
        OActivityLogic.prototype.C_AllActivitysEnd = function () {
            this._msgLoaded = true;
            H52D_Framework.Event.DispatchEvent("UpdateOActivitysEntrance");
            H52D_Framework.Event.DispatchEvent("CloseOActivityView");
        };
        //添加活动
        OActivityLogic.prototype.Start = function (type, data) {
            if (type && this.OActivityFun[type]) {
                this.OActivityFun[type].Instance.Start(data);
            }
        };
        //移除活动
        OActivityLogic.prototype.OnDestroy = function (type) {
            if (type && this.OActivityFun[type]) {
                this.OActivityFun[type].Instance.OnDestroy(type);
                H52D_Framework.Event.DispatchEvent("OActivityOnDestroy", [type]);
            }
        };
        //更新活动状态
        OActivityLogic.prototype.UpdateOActivityOpen = function () {
            var curTime = Date.now() / 1000;
            var b_des = false;
            //删除已结束的活动
            for (var i in this._openList) {
                var data = this._openList[i];
                for (var j = data.length - 1; j >= 0; j--) {
                    var cls = data[j];
                    if (curTime >= cls.clot) {
                        //此活动已结束
                        delete this._openData[cls.type];
                        if (data[j] && data[j].type == cls.type)
                            data.splice(j, 1);
                        this.OnDestroy(cls.type);
                        b_des = true;
                    }
                }
            }
            for (var i in this._openList) {
                if (this._openList[i].length == 0) {
                    delete this._openList[i];
                }
            }
            //增加已开启的活动
            for (var i in this._unOpenList) {
                var data = this._unOpenList[i];
                for (var j = data.length - 1; j >= 0; j--) {
                    var cls = data[j];
                    if (curTime >= cls.clst && curTime < cls.clot && H52D_Framework.MasterPlayer.Instance.player.Level >= cls.limitLevel) {
                        //此活动已开启
                        if (!this._openList[cls.pos]) {
                            this._openList[cls.pos] = [];
                        }
                        this._openList[cls.pos].push(cls);
                        this._openList[cls.pos].sort(function (o1, o2) { return o1.order - o2.order; });
                        this._openData[cls.type] = cls;
                        this.Start(cls.type, cls);
                        data.splice(j, 1);
                        b_des = true;
                    }
                }
            }
            for (var i in this._unOpenList) {
                if (this._unOpenList[i].length == 0) {
                    delete this._unOpenList[i];
                }
            }
            if (b_des) {
                //Event.DispatchEvent("UpdateBtnList_activebg");
            }
            //在此更新活动红点/提醒特效
            this.SetRedPoint();
        };
        /**更新活动剩余时间 */
        OActivityLogic.prototype.UpdateOActivityCloseTime = function () {
            var curTime = Date.now() / 1000;
            for (var i in this._openList) {
                var data = this._openList[i];
                for (var j = data.length - 1; j >= 0; j--) {
                    var cls = data[j];
                    var svot = cls.svot;
                    var lastTime = svot - curTime;
                    cls.svotString = GetActivityLastTime(lastTime);
                }
            }
            //更新运营剩余时间通知
            H52D_Framework.Event.DispatchEvent('UpdateOActivityCloseTime');
        };
        OActivityLogic.prototype.GetActivityDataByType = function (type) {
            return this._openData[type];
        };
        Object.defineProperty(OActivityLogic.prototype, "msgLoaded", {
            get: function () {
                return this._msgLoaded;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OActivityLogic.prototype, "openList", {
            get: function () {
                return this._openList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OActivityLogic.prototype, "unOpenList", {
            get: function () {
                return this._unOpenList;
            },
            enumerable: true,
            configurable: true
        });
        /**保存活动数据 */
        OActivityLogic.prototype.SaveOActivitysData = function (data) {
            var cls = new OActivityData(data);
            // if (cls.pos <= 0) {
            // 	this.Start(cls.type, cls);
            // 	return;
            // }
            // 屏蔽部分功能
            if (H52D_Framework.IsShieldRecharge()) {
                if (cls.type == OActivityEnum.eEverydayMoney) {
                    return;
                }
            }
            //当前时间戳(秒)
            var curTime = Date.now() / 1000;
            if (curTime >= cls.clst && curTime < cls.clot && H52D_Framework.MasterPlayer.Instance.player.Level >= cls.limitLevel) {
                //活动开启
                if (!this._openList[cls.pos]) {
                    this._openList[cls.pos] = [];
                }
                this._openList[cls.pos].push(cls);
                this._openList[cls.pos].sort(function (o1, o2) { return o1.order - o2.order; });
                //存已开启活动的所有数据
                this._openData[cls.type] = cls;
                this.Start(cls.type, cls);
            }
            else {
                //活动未开启
                if (!this._unOpenList[cls.pos]) {
                    this._unOpenList[cls.pos] = [];
                }
                this._unOpenList[cls.pos].push(cls);
            }
        };
        /** 请求领取奖励 */
        OActivityLogic.prototype.K_GetActivityAwardReq = function (i_sActionID, i_nIndex, i_nNum) {
            H52D_Framework.RemoteCall.Instance.Send('K_GetActivityAwardReq', i_sActionID, i_nIndex, i_nNum);
        };
        //=========================红点======================
        //每日消耗
        OActivityLogic.prototype.EverydayManager = function (type) {
            return H52D_Framework.mEverydayManager.Instance.red_contr();
        };
        //消耗
        OActivityLogic.prototype.DEverydayManager = function (type) {
            return H52D_Framework.DEverydayManager.Instance.red_contr();
        };
        //每日转盘
        OActivityLogic.prototype.EveryDayTurn = function (type) {
            return H52D_Framework.EveryDayTurntable.Instance.red_contr();
        };
        Object.defineProperty(OActivityLogic.prototype, "RedPoint", {
            //private redpoint: boolean;
            get: function () {
                return this.SetRedPoint();
            },
            enumerable: true,
            configurable: true
        });
        OActivityLogic.prototype.SetRedPoint = function () {
            for (var i in this._openList) {
                var _activity = this._openList[i];
                for (var j in _activity) {
                    var _type = _activity[j].type;
                    if (!this.OActivityRed[_type]) {
                        continue;
                    }
                    var fun = this.OActivityRed[_type];
                    if (fun(_type)) {
                        return true;
                    }
                }
            }
            return false;
        };
        return OActivityLogic;
    }());
    H52D_Framework.OActivityLogic = OActivityLogic;
    /** 活动数据*/
    var OActivityData = /** @class */ (function () {
        function OActivityData(data) {
            this._type = data['type'];
            this._pos = data['pos'];
            this._order = data['order'];
            this._tabName = data['name'];
            this._desc = data['desc'];
            this._icon = data['icon'];
            this._limitLevel = data['level'];
            this._svot = data['svot'];
            this._svst = data['svst'];
            this._clot = data['clot'];
            this._clst = data['clst'];
            var lastTime = this._svot - Date.now() / 1000;
            this._svotString = GetActivityLastTime(lastTime);
            this._data = data;
        }
        Object.defineProperty(OActivityData.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OActivityData.prototype, "pos", {
            get: function () {
                return this._pos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OActivityData.prototype, "order", {
            get: function () {
                return this._order;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OActivityData.prototype, "tabName", {
            get: function () {
                return this._tabName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OActivityData.prototype, "desc", {
            get: function () {
                return this._desc;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OActivityData.prototype, "icon", {
            get: function () {
                return this._icon;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OActivityData.prototype, "limitLevel", {
            get: function () {
                return this._limitLevel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OActivityData.prototype, "svst", {
            get: function () {
                return this._svst;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OActivityData.prototype, "svot", {
            get: function () {
                return this._svot;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OActivityData.prototype, "svotString", {
            get: function () {
                return this._svotString;
            },
            set: function (buf) {
                this._svotString = buf;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OActivityData.prototype, "clst", {
            get: function () {
                return this._clst;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OActivityData.prototype, "clot", {
            get: function () {
                return this._clot;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OActivityData.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        return OActivityData;
    }());
    H52D_Framework.OActivityData = OActivityData;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=OActivityLogic.js.map