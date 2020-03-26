/**
* 商城系统数据类;
*/
//商城数据类型
var ShopDataEnum;
(function (ShopDataEnum) {
    ShopDataEnum[ShopDataEnum["eEmpty"] = 0] = "eEmpty";
    ShopDataEnum[ShopDataEnum["eProShop"] = 1] = "eProShop";
    ShopDataEnum[ShopDataEnum["eBoxShop"] = 2] = "eBoxShop";
    ShopDataEnum[ShopDataEnum["ePetShop"] = 3] = "ePetShop"; //宝箱商城
})(ShopDataEnum || (ShopDataEnum = {}));
//钻石充值数据类型
var ChargeDataEnum;
(function (ChargeDataEnum) {
    ChargeDataEnum[ChargeDataEnum["eCharge"] = 1] = "eCharge";
    ChargeDataEnum[ChargeDataEnum["eVIP"] = 2] = "eVIP";
    ChargeDataEnum[ChargeDataEnum["eFristCharge"] = 3] = "eFristCharge"; //首充
})(ChargeDataEnum || (ChargeDataEnum = {}));
//抽奖数据类型
var LotteryDataEnum;
(function (LotteryDataEnum) {
    LotteryDataEnum[LotteryDataEnum["eOne"] = 1] = "eOne";
    LotteryDataEnum[LotteryDataEnum["eTen"] = 2] = "eTen";
})(LotteryDataEnum || (LotteryDataEnum = {}));
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["Succeed"] = 1] = "Succeed";
    ErrorCode[ErrorCode["CostUnEnough"] = 2] = "CostUnEnough"; //消耗不足
})(ErrorCode || (ErrorCode = {}));
var ChargeType;
(function (ChargeType) {
    ChargeType[ChargeType["eGem"] = 1] = "eGem";
    ChargeType[ChargeType["eOneBag"] = 3] = "eOneBag";
    ChargeType[ChargeType["eVip"] = 4] = "eVip";
    ChargeType[ChargeType["eHeroBag"] = 5] = "eHeroBag"; //购买英雄礼包
})(ChargeType || (ChargeType = {}));
var H52D_Framework;
(function (H52D_Framework) {
    var ShopLogic = /** @class */ (function () {
        function ShopLogic() {
            this.tChargeTimes = {};
            /**是否打开vip */
            this.bOpenVipView = false;
            this.n_freeDrawTimes = 0; // 看广告免费抽奖次数
            this.n_adCoolTime = 0; //广告冷却时间
            /** 商城数据*/
            this._shopData = {};
            /** 充值数据*/
            this._chargeData = {};
            /** 抽奖数据*/
            this._lotteryData = {};
            this._moneyback = {};
            this.money_arr = [];
            /** 限购次数 */
            this.BuyTimes = {};
            this._SendLotteryFlag = true;
            //初始化数据
            this._isFirst = false;
            this._shopData[ShopDataEnum.eBoxShop] = [];
            this._chargeData[ShopDataEnum.eBoxShop] = {};
            this._lotteryData[ShopDataEnum.eBoxShop] = [];
            this.SortData(H52D_Framework.MarketConfig, this._shopData);
            this.SortGemData(H52D_Framework.ChargeConfig, this._chargeData);
            this.SortData(H52D_Framework.LotteryConfig, this._lotteryData);
            this.setmoneydata();
        }
        Object.defineProperty(ShopLogic, "Instance", {
            get: function () {
                if (ShopLogic._inst == null)
                    ShopLogic._inst = new ShopLogic();
                return ShopLogic._inst;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShopLogic.prototype, "isFirst", {
            get: function () {
                return this._isFirst;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShopLogic.prototype, "isPromotion", {
            get: function () {
                return this._isPromotion;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShopLogic.prototype, "nIdx", {
            /**商品id */
            get: function () {
                return this.n_Idx;
            },
            set: function (value) {
                this.n_Idx = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShopLogic.prototype, "FreedrawTimes", {
            get: function () {
                return this.n_freeDrawTimes;
            },
            set: function (value) {
                this.n_freeDrawTimes = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShopLogic.prototype, "AdCoolTime", {
            /** 观看完广告的时间戳  */
            get: function () {
                return this.n_adCoolTime;
            },
            set: function (value) {
                this.n_adCoolTime = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShopLogic.prototype, "EffShow", {
            get: function () {
                return this.eff_bool;
            },
            set: function (value) {
                this.eff_bool = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShopLogic.prototype, "ShopData", {
            /**获取商城数据*/
            get: function () {
                return this._shopData;
            },
            enumerable: true,
            configurable: true
        });
        ShopLogic.prototype.setmoneydata = function () {
            for (var key in H52D_Framework.ChargeReturnConfig) {
                var nIdx = Number(key);
                this.money_arr.push(nIdx);
            }
        };
        Object.defineProperty(ShopLogic.prototype, "MonenArr", {
            get: function () {
                return this.money_arr;
            },
            enumerable: true,
            configurable: true
        });
        ShopLogic.prototype.Eff_show = function () {
            var arr = [];
            var c_cfg = H52D_Framework.ChargeConfig[1];
            for (var key in c_cfg) {
                for (var nIdx in H52D_Framework.ChargeReturnConfig) {
                    var shopInfo = c_cfg[key];
                    if (shopInfo.Money == nIdx) {
                        arr.push(Number(key));
                    }
                }
            }
            return arr;
        };
        ShopLogic.prototype.Contr_redshow = function () {
            var a = 0;
            for (var key in this._moneyback) {
                if (!this._moneyback[key])
                    return false;
                if (this._moneyback[key] == 1) {
                    a++;
                }
            }
            if (a < 3) {
                return false;
            }
            else {
                return true;
            }
        };
        Object.defineProperty(ShopLogic.prototype, "ChargeData", {
            /**获取充值数据*/
            get: function () {
                return this._chargeData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShopLogic.prototype, "MoneyBack", {
            get: function () {
                return this._moneyback;
            },
            set: function (value) {
                this._moneyback = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShopLogic.prototype, "LotteryData", {
            /**获取抽奖数据*/
            get: function () {
                return this._lotteryData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShopLogic.prototype, "gemNum", {
            /**获取钻石*/
            get: function () {
                return H52D_Framework.BagManager.Instance.getItemNumber(2);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShopLogic.prototype, "goldNum", {
            /**获取金币*/
            get: function () {
                return H52D_Framework.BagManager.Instance.getItemNumber(1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShopLogic.prototype, "ticketNum", {
            /**获取待抽券*/
            get: function () {
                return H52D_Framework.BagManager.Instance.getItemNumber(2301);
            },
            enumerable: true,
            configurable: true
        });
        /** 获取购买次数 */
        ShopLogic.prototype.GetBuyTimes = function (type, Id) {
            if (this.BuyTimes[type] == null) {
                return 0;
            }
            return this.BuyTimes[type][Id] || 0;
        };
        /** 初始化*/
        ShopLogic.prototype.Initialize = function () {
            //购买回调通知
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_MarketBuyRes', this);
            //抽奖回调通知
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_ReqLottery', this);
            //充值信息
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_ChargeTime', this);
            //vip购买成功
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_Charge', this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqChargeFeedback", this);
            /**sdk 付费回调 */
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_OnCharge", this);
            this.eff_bool = true;
        };
        /**购买通知 */
        ShopLogic.prototype.C_MarketBuyRes = function (buf) {
            var nErrorCode = buf[0];
            var type = buf[1];
            var Id = buf[2];
            var raw = buf[3];
            if (nErrorCode == ErrorCode.Succeed) {
                var bIsHasRes = false;
                for (var i in raw) {
                    bIsHasRes = true;
                    break;
                }
                if (bIsHasRes) {
                    H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(raw);
                }
                H52D_Framework.Event.DispatchEvent("BuySucceed");
            }
            else {
                H52D_Framework.TipsLogic.Instance.OpenMessageBox("钻石不足！");
                H52D_Framework.Event.DispatchEvent("toGemShop");
            }
            if (this.BuyTimes[type] == null) {
                this.BuyTimes[type] = {};
            }
            if (this.BuyTimes[type][Id] == null) {
                this.BuyTimes[type][Id] = 1;
            }
            else {
                this.BuyTimes[type][Id] += 1;
            }
            // if (type == 2) {
            // 	if (DiscountManager.Instance.IsStartBoxAction &&
            // 		DiscountManager.Instance.getBoxTims(Id) < DiscountManager.Instance.nBoxMaxTims) {
            // 		DiscountManager.Instance.addBoxTims(Id);
            // 	}
            // }
            if (type == 3) {
                H52D_Framework.WroldBossLogic.Instance.ReqBuyBuff(type, Id);
            }
            H52D_Framework.Event.DispatchEvent("update_heropeck");
        };
        /**付费 sdk callback */
        ShopLogic.prototype.C_OnCharge = function (buf) {
            var goodsType = buf[0];
            var goodsId = buf[1];
            var tAllGift = buf[2];
            //充值不同类型回调处理
            switch (goodsType) {
                case ChargeType.eGem:
                    H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(tAllGift);
                    break;
                case ChargeType.eOneBag:
                    break;
                case ChargeType.eVip:
                    H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(tAllGift);
                    break;
                case ChargeType.eHeroBag:
                    var nId = 0;
                    H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(tAllGift);
                    H52D_Framework.Event.DispatchEvent("update_heropeck");
                    for (var key in tAllGift[1]) {
                        nId = Number(key);
                    }
                    //Array<{[type:number]:number}>=[{}];
                    H52D_Framework.HeroManager.Instance.PeckRecord[nId] = {};
                    H52D_Framework.HeroManager.Instance.PeckRecord[nId][goodsType] = 1;
                    break;
            }
        };
        ShopLogic.prototype.C_ReqLottery = function (buf) {
            this._SendLotteryFlag = true;
            var nErrorCode = buf[0];
            var type = buf[1];
            var item_info = buf[2];
            if (window["wx"]) {
                ShopLogic.Instance.FreedrawTimes = buf[3];
                ShopLogic.Instance.AdCoolTime = buf[4];
                H52D_Framework.Event.DispatchEvent("Drawbegin");
            }
            if (nErrorCode == ErrorCode.Succeed) {
                H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(item_info, type == 2);
                H52D_Framework.Event.DispatchEvent("BuySucceed");
            }
            else {
                H52D_Framework.TipsLogic.Instance.OpenMessageBox("钻石不足！");
                H52D_Framework.Event.DispatchEvent("toGemShop");
            }
            H52D_Framework.Event.DispatchEvent("ShowRedPoint", [E_OpenGrade.SHOP]);
        };
        /**付费 回调 */
        ShopLogic.prototype.C_ChargeTime = function (buf) {
            ShopLogic.Instance.tChargeTimes = buf[0];
            H52D_Framework.Event.DispatchEvent("UpdateBtnList");
            H52D_Framework.BagManager.Instance.IsShow = true;
            H52D_Framework.Event.DispatchEvent("UpdateChargeList");
            H52D_Framework.Event.DispatchEvent("CloseEffect", [false]);
            H52D_Framework.Tick.Once(1000, this, function () {
                H52D_Framework.Event.DispatchEvent("UpdateLotteryShop");
            });
            H52D_Framework.Event.DispatchEvent("updataview_twoyuan");
        };
        ShopLogic.prototype.C_Charge = function (buf) {
            var goodsType = buf[0];
            var goodsId = buf[1];
            H52D_Framework.Event.DispatchEvent("UpdateVipInfo");
        };
        /** 加载数据*/
        ShopLogic.prototype.SortData = function (cfg, shopData) {
            for (var shop_Info in cfg) {
                shopData[shop_Info] = [];
                var data = cfg[shop_Info];
                for (var com_info in data) {
                    var info = data[com_info];
                    shopData[shop_Info].push(info);
                }
            }
        };
        /** 加载数据*/
        ShopLogic.prototype.SortGemData = function (cfg, shopData) {
            for (var shop_Info in cfg) {
                shopData[shop_Info] = {};
                var data = cfg[shop_Info];
                for (var com_info in data) {
                    var info = data[com_info];
                    shopData[shop_Info][com_info] = info;
                }
            }
        };
        /***领取奖励 */
        ShopLogic.prototype.C_ReqChargeFeedback = function (buf) {
            var data = buf[0];
            var item = buf[1];
            H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(item);
            this._moneyback[data] = 1;
            H52D_Framework.Event.DispatchEvent("UpdateView_moneyback");
        };
        /** 发送购买消息
         * @param i_ntype   商品类型
         * @param i_nID     物品Id
         * @param i_nNum    购买数量
         */
        ShopLogic.prototype.SendBuyMsg = function (i_ntype, i_nID, i_nNum, bAdvertising) {
            H52D_Framework.RemoteCall.Instance.Send('K_MarketBuyReq', i_ntype, i_nID, i_nNum, bAdvertising);
        };
        /** 发送抽奖请求
         * @param i_ntype   抽奖类型
         */
        ShopLogic.prototype.SendLotteryMsg = function (i_ntype) {
            var _this = this;
            if (this._SendLotteryFlag == false) {
                return;
            }
            this._SendLotteryFlag = false;
            H52D_Framework.RemoteCall.Instance.Send('K_ReqLottery', i_ntype);
            H52D_Framework.OneTimer(1000, function () {
                _this._SendLotteryFlag = true;
            }, "SendLotteryMsg");
        };
        /**是否是第一次充值该商品 */
        ShopLogic.prototype.isFristCharge = function (i_nType, i_nID) {
            if (ShopLogic.Instance.tChargeTimes[i_nType] == null) {
                return true;
            }
            else if (ShopLogic.Instance.tChargeTimes[i_nType][i_nID] == null) {
                return true;
            }
            return ShopLogic.Instance.tChargeTimes[i_nType][i_nID] == 0;
        };
        /**发送请求领取对应档位的奖励 */
        ShopLogic.prototype.K_ReqChargeFeedback = function (nMoney) {
            H52D_Framework.RemoteCall.Instance.Send('K_ReqChargeFeedback', nMoney);
        };
        /**
          * 转换奖励tip格式
          * @param item {1:类型,2:道具id,3:数量}
          */
        ShopLogic.prototype.ConvertAwardFormat = function (item) {
            var _a;
            var award = {};
            for (var key in item) {
                var a1 = item[key][1];
                var a2 = item[key][2];
                var a3 = item[key][3];
                award[a1] = (_a = {}, _a[a2] = a3, _a);
            }
            return award;
        };
        return ShopLogic;
    }());
    H52D_Framework.ShopLogic = ShopLogic;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ShopLogic.js.map