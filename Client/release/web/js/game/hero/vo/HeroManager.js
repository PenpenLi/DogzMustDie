var H52D_Framework;
(function (H52D_Framework) {
    var SelectType;
    (function (SelectType) {
        SelectType[SelectType["One"] = 1] = "One";
        SelectType[SelectType["Five"] = 2] = "Five";
        SelectType[SelectType["Max"] = 3] = "Max";
    })(SelectType || (SelectType = {}));
    var HeroManager = /** @class */ (function () {
        function HeroManager() {
            /**所有已有英雄 */
            this._herolist = [];
            /**英雄布阵存储信息 */
            this._heroWar = [];
            /**所有英雄的id数组 */
            this.hero_List = [];
            /**已拥有英雄id */
            this.has_List = [];
            this._hero_peck = [];
            this._hero_pecktime = {};
            this.HeroMaxLv = 0;
            this._HeroMaxStar = 0;
            this._peck_num = 0;
            this._peck_buyed = [];
            /**英雄礼包购买记录 */
            this._heropeck_record = {};
            /** 英雄礼包购买记录  广告版*/
            this._heropeck_buy_ad = {};
            this._heropeck = [];
            this._peck_icon = false;
            this._loading = false;
            this.MoneyColor = {
                1: "#75d888",
                2: "#ffa5a7" //hong
            };
            this.StarColorurl = {
                0: "ui_icon/icon-weijihuo-jinjie-yingxiong.png",
                1: "ui_icon/icon-lan-jinjie-yingxiong.png",
                2: "ui_icon/icon-zi-jinjie-yingxiong.png",
                3: "ui_icon/icon-huang-jinjie-yingxiong.png",
                4: "ui_icon/icon-hong-jinjie-yingxiong.png",
            };
            this.hero_List = [];
            for (var key in H52D_Framework.HeroConfig) {
                var nHeroID = Number(key);
                this.hero_List.push(nHeroID);
            }
            this._heroNum = 0;
            this.HeroMaxLv = 0;
            var tCfg = H52D_Framework.HeroUpgrateConfig[1];
            for (var nLv in tCfg) {
                this.HeroMaxLv = Number(nLv);
            }
            this._HeroMaxStar = 0;
            var n_tCfg = H52D_Framework.HeroAdvanceConfig[this.hero_List[0]];
            for (var star in n_tCfg) {
                this._HeroMaxStar = Number(star);
            }
            for (var key in H52D_Framework.HeroPeckConfig) {
                var nId = Number(key);
                this._hero_peck.push(nId);
            }
        }
        Object.defineProperty(HeroManager.prototype, "PeckIcon", {
            get: function () {
                return this._peck_icon;
            },
            set: function (value) {
                this._peck_icon = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroManager.prototype, "HeroPeck_arr", {
            get: function () {
                return this._heropeck;
            },
            set: function (value) {
                this._heropeck = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroManager.prototype, "PeckRecord", {
            get: function () {
                return this._heropeck_record;
            },
            set: function (value) {
                this._heropeck_record = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroManager.prototype, "Peck_Ad", {
            /**广告版 礼包购买 */
            get: function () {
                return this._heropeck_buy_ad;
            },
            set: function (value) {
                this._heropeck_buy_ad = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroManager.prototype, "PeckShow", {
            get: function () {
                return this._peck_show;
            },
            set: function (value) {
                this._peck_show = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroManager.prototype, "PeckBuyed", {
            get: function () {
                return this._peck_buyed;
            },
            set: function (value) {
                this._peck_buyed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroManager.prototype, "PeckNum", {
            get: function () {
                return this._peck_num;
            },
            set: function (value) {
                this._peck_num = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroManager.prototype, "HeroPeck", {
            get: function () {
                return this._hero_peck;
            },
            set: function (value) {
                this._hero_peck = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroManager.prototype, "HeroPeckTime", {
            get: function () {
                return this._hero_pecktime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroManager.prototype, "HeroMaxStar", {
            get: function () {
                return this._HeroMaxStar;
            },
            enumerable: true,
            configurable: true
        });
        /** 角色放在第一位 */
        HeroManager.prototype.ProfSort = function () {
        };
        HeroManager.prototype.Initialize = function () {
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqActivateHero", this); //激活英雄
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqHeroLevelUp", this); //请求英雄升级回调
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_HeroLevelUp", this); //英雄升级
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqHeroStarUp", this); //英雄进阶
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_SendHeroBeginMsg", this); //开始同步上线英雄  
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_SendGroupHeroMsg", this); //上线同步英雄
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_SendHeroEndMsg", this); //上线同步英雄结束
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_SaveBattleArray", this); //发送布阵的数据信息  
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_AddHero", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ActivateHeroAward", this);
            this._peck_show = true;
            this._hero_pecktime = H52D_Framework.MasterPlayer.Instance.player.Hero_pecktime;
        };
        HeroManager.prototype.GetHeroStar = function (nIdx) {
            var ntcfg = H52D_Framework.HeroAdvanceConfig[nIdx];
            var star;
            for (var nstar in ntcfg) {
                star = Number(nstar);
            }
            return star;
        };
        HeroManager.prototype.C_SendHeroBeginMsg = function () {
            this._herolist = {};
        };
        /** 上线同步英雄 */
        HeroManager.prototype.C_SendGroupHeroMsg = function (buf) {
            var tGroup = buf[0];
            for (var nIdx in tGroup) {
                var tData = tGroup[nIdx];
                var oHero = new H52D_Framework.HeroInfo();
                oHero.unpackData(tData);
                this._herolist[oHero.nHeroID] = oHero;
            }
        };
        /** 上綫同步英雄結束 */
        HeroManager.prototype.C_SendHeroEndMsg = function (buf) {
            var tGroup = buf[0];
            for (var nIdx in tGroup) {
                var tData = tGroup[nIdx];
                var oHero = new H52D_Framework.HeroInfo();
                oHero.unpackData(tData);
                this._herolist[oHero.nHeroID] = oHero;
            }
        };
        /** 添加英雄 */
        HeroManager.prototype.C_AddHero = function (buf) {
            var tData = buf[0];
            var oHero = new H52D_Framework.HeroInfo();
            oHero.unpackData(tData);
            this._herolist[oHero.nHeroID] = oHero;
        };
        HeroManager.prototype.C_ActivateHeroAward = function (buf) {
            var data = buf[0];
            H52D_Framework.MasterPlayer.Instance.player.Hero_pecktime[data] = buf[1];
            HeroManager.Instance.PeckShow = true;
            this._peck_icon = true;
            H52D_Framework.Event.DispatchEvent("UpdateBtnList");
        };
        /**检测某个英雄礼包 */
        HeroManager.prototype.Hero_peck_one = function (nHeroId) {
            if (H52D_Framework.GetTabLength(this._peck_buyed) == 0) {
                return false;
            }
            for (var key in this._peck_buyed) {
                if (nHeroId == this._peck_buyed[key]) {
                    return false;
                }
            }
            return true;
        };
        /**返回单个英雄的礼包时间 */
        HeroManager.prototype.GetHeroPecktime = function (nHeroId) {
            return H52D_Framework.MasterPlayer.Instance.player.Hero_pecktime[nHeroId];
            // return 0;
        };
        /** 获取配置全部英雄 */
        HeroManager.prototype.GetCfgHeroList = function () {
            return this.hero_List;
        };
        /** 檢測英雄是否激活 */
        HeroManager.prototype.IsActive = function (nHeroID) {
            return this._herolist[nHeroID] ? true : false;
        };
        /**英雄是否满足激活条件 */
        HeroManager.prototype.HeroIstrue = function (nHeroID) {
            var bool = this.IsActive(nHeroID);
            if (bool) {
                return false;
            }
            var herolv;
            var hero = this.GetHero(nHeroID);
            if (!hero) {
                herolv = 1;
            }
            else {
                herolv = hero.Level;
            }
            var itemID = H52D_Framework.HeroConfig[nHeroID].needItem;
            var itenNum = H52D_Framework.HeroConfig[nHeroID].needNum;
            var hasitem = H52D_Framework.BagManager.Instance.getItemNumber(itemID);
            return (hasitem >= itenNum) ? true : false;
        };
        /**获取所有英雄是否有可以激活的  控制新的显示隐藏*/
        HeroManager.prototype.All_HeroIstrue = function () {
            var IsCan;
            for (var key in H52D_Framework.HeroConfig) {
                var nHeroID = Number(key);
                var tcfg = H52D_Framework.HeroConfig[nHeroID];
                var bool = this.IsActive(nHeroID);
                if (!bool) {
                    var item_Id = tcfg.needItem;
                    var play_itemnum = H52D_Framework.BagManager.Instance.getItemNumber(item_Id);
                    IsCan = play_itemnum >= tcfg.needNum ? true : false;
                    return IsCan;
                }
                else {
                    IsCan = false;
                    continue;
                }
            }
            return IsCan;
        };
        /**判断英雄是否满足进阶条件 */
        HeroManager.prototype.HeroIsStar = function (nHeroID) {
            var herostar;
            var hero = this.GetHero(nHeroID);
            if (!hero)
                return;
            else {
                herostar = hero.Star;
            }
            if (herostar < this.HeroMaxStar) {
                var iteminfo = H52D_Framework.HeroAdvanceConfig[nHeroID][herostar + 1].Consume;
                var itemID = iteminfo[1][1];
                var itenNum = iteminfo[1][2];
                var hasitem = H52D_Framework.BagManager.Instance.getItemNumber(itemID);
                return (hasitem >= itenNum) ? true : false;
            }
            else {
                var iteminfo = H52D_Framework.HeroAdvanceConfig[nHeroID][herostar].Consume;
                var itemID = iteminfo[1][1];
                var itenNum = iteminfo[1][2];
                var hasitem = H52D_Framework.BagManager.Instance.getItemNumber(itemID);
                return false;
                //return (hasitem >= itenNum) ? true : false;
            }
        };
        /**判断英雄是否 有礼包 */
        HeroManager.prototype.HeroIsHave_peck = function (nheroId) {
            for (var key in this._hero_peck) {
                var nId = this._hero_peck[key];
                if (nId == nheroId) {
                    return true;
                }
            }
            return false;
        };
        /** 初始化购买过的英雄礼包 */
        HeroManager.prototype.Buyed_peck = function () {
            this._peck_buyed = [];
            for (var key in this._hero_peck) {
                var nID = this._hero_peck[key];
                var peck_cfg = H52D_Framework.HeroPeckConfig[nID];
                var Buy_times = H52D_Framework.ShopLogic.Instance.GetBuyTimes(4, peck_cfg.shopId);
                var bool_m = H52D_Framework.ShopLogic.Instance.isFristCharge(5, peck_cfg.chargeId);
                var bool_d = Buy_times == 0 ? true : false;
                if (H52D_Framework.IsAD()) {
                    if (Buy_times >= 2) {
                        this._peck_buyed.push(nID);
                    }
                }
                else {
                    if (!bool_d || !bool_m) {
                        this._peck_buyed.push(nID);
                    }
                }
            }
        };
        /** 检测该英雄是否买过礼包 */
        HeroManager.prototype.Heropeck_IsBuy = function (nHeroID) {
            var a = 0;
            for (var key in this._peck_buyed) {
                if (nHeroID == this._peck_buyed[key]) {
                    return false;
                }
            }
            return true;
        };
        /**判断英雄是否可以升级 */
        HeroManager.prototype.HeroIsUp = function (nheroID) {
            var hero_cfg = H52D_Framework.HeroConfig[nheroID];
            var hero = this.GetHero(nheroID);
            var type = hero_cfg.type;
            var nx = hero_cfg.heroRatio;
            if (hero && hero.Level < 300) {
                var lv = hero ? hero.Level : 1;
                var n_money = H52D_Framework.HeroUpgrateConfig[type][lv + 1].ConsumeGold - H52D_Framework.HeroUpgrateConfig[type][lv].ConsumeGold;
                var lock_Money = Math.floor(n_money * nx);
                var lock_lv = H52D_Framework.HeroUpgrateConfig[type][lv + 1].needPlayerLv;
                var play_money = H52D_Framework.BagManager.Instance.getItemNumber(1);
                var play_lv = H52D_Framework.MasterPlayer.Instance.player.Level;
                if (play_lv >= lock_lv && play_money >= lock_Money) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        };
        HeroManager.prototype.GetheroUpMoney = function (Idx) {
            for (var key in this._herolist) {
                var nheroID = Number(key);
                this.has_List.push(nheroID);
            }
            var a = this.has_List[Idx];
            var needMoney = this.GetHeroLvUpUse(a, 1);
            if (!needMoney) {
                return;
            }
            return needMoney[1];
        };
        /** 获取升级需要的金币数量 */
        HeroManager.prototype.GetHeroLvUpUse = function (nHeroID, nSelectType) {
            if (nSelectType == 0) {
                nSelectType = 1;
            }
            var nUpLevel = null;
            var nMoney = 0; //升级需要的钱数
            var hero = HeroManager.Instance.GetHero(nHeroID);
            if (!hero) {
                return;
            }
            var nNowLevel = hero.Level;
            var tCfg = H52D_Framework.HeroConfig[nHeroID];
            var nx = tCfg.heroRatio;
            var nUpgrate_Cfg = H52D_Framework.HeroUpgrateConfig[tCfg.type];
            var nMaxLv = HeroManager.Instance.HeroMaxLv;
            var nHasMoney = H52D_Framework.BagManager.Instance.getItemNumber(1); //人物金币
            if (nHeroID == 111) {
                var nHasMoney_1 = H52D_Framework.BagManager.Instance.getItemNumber(1); //人物金币
            }
            // 判断是否已经满级
            if (nUpgrate_Cfg[nNowLevel + 1] == null) {
                return [-1, 0];
            }
            var nNowMoney = nUpgrate_Cfg[nNowLevel].ConsumeGold;
            if (nSelectType == SelectType.One) {
                var tLastCfg_1 = nUpgrate_Cfg[nNowLevel + 1];
                nMoney = (tLastCfg_1.ConsumeGold - nNowMoney) * nx;
                return [nNowLevel + 1, nMoney];
            }
            var nCanMaxLv = 0;
            // 检测当前能升到的最大等级
            for (var nCanLv = nNowLevel + 1; nCanLv <= nMaxLv; nCanLv++) {
                var tLastCfg_2 = nUpgrate_Cfg[nCanLv];
                var nCanMoney = tLastCfg_2.ConsumeGold - nNowMoney;
                if (nCanMoney > nHasMoney) {
                    nCanMaxLv = nCanLv - 1;
                    break;
                }
                nCanMaxLv = nCanLv;
            }
            switch (nSelectType) {
                case SelectType.Five:
                    if (nNowLevel + 10 > nCanMaxLv) {
                        nUpLevel = nCanMaxLv;
                    }
                    else {
                        nUpLevel = nNowLevel + 10;
                    }
                    break;
                case SelectType.Max:
                    nUpLevel = nCanMaxLv;
                    break;
                default:
                    break;
            }
            var tLastCfg = nUpgrate_Cfg[nUpLevel];
            nMoney = tLastCfg.ConsumeGold - nNowMoney;
            var up_info = this.Money_color(nHeroID, nUpLevel, nSelectType);
            return up_info;
        };
        HeroManager.prototype.Money_color = function (nheroId, nUpLevel, nSelectType) {
            var tCfg = H52D_Framework.HeroConfig[nheroId];
            var nx = tCfg.heroRatio;
            var hero = this.GetHero(nheroId);
            var nUpgrate_Cfg = H52D_Framework.HeroUpgrateConfig[tCfg.type];
            var nowmoney = (nUpgrate_Cfg[hero.Level].ConsumeGold);
            var lock_lv = nUpgrate_Cfg[nUpLevel].needPlayerLv;
            var lock_money = (nUpgrate_Cfg[nUpLevel].ConsumeGold - nowmoney) * nx;
            var play_lv = H52D_Framework.MasterPlayer.Instance.player.Level;
            var my_money = H52D_Framework.BagManager.Instance.getItemNumber(1);
            var nCanLv, nMoney;
            var nCanMaxLv = 0;
            var nMaxLv = this.HeroMaxLv;
            for (var nCanLv_1 = hero.Level + 1; nCanLv_1 <= nMaxLv; nCanLv_1++) {
                var tLastCfg = nUpgrate_Cfg[nCanLv_1];
                var nCanMoney = tLastCfg.ConsumeGold - nowmoney;
                if (nCanMoney > my_money) {
                    nCanMaxLv = nCanLv_1 - 1;
                    break;
                }
                nCanMaxLv = nCanLv_1;
            }
            if (play_lv >= lock_lv) {
                switch (nSelectType) {
                    case 1:
                        nCanLv = 1;
                        break;
                    case SelectType.Five:
                        if (hero.Level + 10 > nCanMaxLv) {
                            nCanLv = nCanMaxLv;
                        }
                        else {
                            nCanLv = hero.Level + 10;
                        }
                        break;
                    case SelectType.Max:
                        nCanLv = this.MaxLvUp(nheroId, play_lv);
                        break;
                }
                var needMoney = (nUpgrate_Cfg[nCanLv].ConsumeGold - nowmoney) * nx;
                if (needMoney > my_money) {
                    nCanLv = this.M_MaxLvup(nheroId, my_money);
                    nMoney = nUpgrate_Cfg[nCanLv].ConsumeGold;
                    nMoney = (nMoney - nowmoney) * nx;
                    return [nCanLv, nMoney];
                }
                else {
                    return [nCanLv, needMoney];
                }
            }
            else {
                if (nSelectType == 2 && lock_lv <= play_lv) {
                    nCanLv = nUpLevel;
                    nMoney = nUpgrate_Cfg[nCanLv].ConsumeGold;
                    return [nCanLv, nMoney];
                }
                nCanLv = this.MaxLvUp(nheroId, play_lv);
                nMoney = nUpgrate_Cfg[nCanLv].ConsumeGold;
                nMoney = (nMoney - nowmoney) * nx;
                if (my_money < nMoney) {
                    nCanLv = this.M_MaxLvup(nheroId, my_money);
                    nMoney = nUpgrate_Cfg[nCanLv].ConsumeGold;
                    nMoney = (nMoney - nowmoney) * nx;
                    return [nCanLv, nMoney];
                }
                else {
                    // return [nUpLevel, lock_money];
                    return [nCanLv, nMoney];
                }
            }
        };
        /**未上阵的英雄 */
        HeroManager.prototype.NHero = function () {
            var heroobj = H52D_Framework.HeroCardManager.Instance.CHeroList;
            var key = [];
            var nkey = [];
            for (var k in this._herolist) {
                key.push(Number(k));
            }
            for (var k in heroobj) {
                nkey.push(heroobj[k].vo.nHeroID);
            }
            for (var i = 0; i < nkey.length; i++) {
                key.push(nkey[i]);
            }
            for (var i = 0; i < key.length; i++) {
                for (var j = i + 1; j < key.length; j++) {
                    if (key[i] && key[j]) {
                        if (key[i] == key[j]) {
                            key[i] = null;
                            key[j] = null;
                        }
                    }
                }
            }
            for (var i = key.length; i >= 0; i--) {
                if (key[i] == null) {
                    key.splice(i, 1);
                }
            }
            return key;
        };
        Object.defineProperty(HeroManager, "Instance", {
            get: function () {
                if (HeroManager._init == null) {
                    HeroManager._init = new HeroManager();
                }
                return HeroManager._init;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroManager.prototype, "Herolist", {
            /** 获取已有英雄列表 */
            get: function () {
                return this._herolist;
            },
            enumerable: true,
            configurable: true
        });
        HeroManager.prototype.Hero_sort = function (id) {
            var heroID = [];
            for (var nheroId in this._herolist) {
                var nIdx = Number(nheroId);
                heroID.push(nIdx);
            }
            function tsort(a, b) {
                var a_q = H52D_Framework.HeroConfig[a].quality;
                var b_q = H52D_Framework.HeroConfig[b].quality;
                if (a_q == b_q) {
                    return a > b ? 1 : -1;
                }
                return a_q > b_q ? -1 : 1;
            }
            heroID.sort(tsort);
            return heroID[id];
        };
        Object.defineProperty(HeroManager.prototype, "ActiveHeroNum", {
            /** 获取玩家可激活的英雄数量 */
            get: function () {
                var length = 0;
                for (var nHeroID in H52D_Framework.HeroConfig) {
                    if (!this.IsActive(nHeroID)) {
                        var hero = H52D_Framework.HeroConfig[nHeroID];
                        var heroID_item = hero.needItem;
                        var heroID_itemNum = hero.needNum;
                        var itemNum = H52D_Framework.BagManager.Instance.getItemNumber(heroID_item);
                        if (itemNum >= heroID_itemNum) {
                            length++;
                        }
                    }
                }
                return length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroManager.prototype, "StarHeroNum", {
            /**获取英雄可以进阶的数量 */
            get: function () {
                var num = 0;
                for (var nHeroID in H52D_Framework.HeroConfig) {
                    if (this.IsActive(nHeroID)) {
                        if (this.HeroIsStar(nHeroID)) {
                            num++;
                        }
                    }
                }
                return num;
            },
            enumerable: true,
            configurable: true
        });
        /**获取玩家英雄解锁数量 */
        HeroManager.prototype.GetHeroNum = function () {
            var _HasHeroList = [];
            for (var nHeroID in HeroManager.Instance.Herolist) {
                _HasHeroList.push(nHeroID);
            }
            return _HasHeroList.length;
        };
        /** 获取英雄实例 */
        HeroManager.prototype.GetHero = function (nHeroID) {
            return this._herolist[nHeroID];
        };
        Object.defineProperty(HeroManager.prototype, "Herowar", {
            get: function () {
                return this._heroWar;
            },
            set: function (value) {
                this._heroWar = value;
            },
            enumerable: true,
            configurable: true
        });
        /**激活英雄 */
        HeroManager.prototype.K_ReqActivateHero = function (nHeroID) {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqActivateHero", nHeroID);
        };
        /**英雄等级提升 */
        HeroManager.prototype.HeroLevlUp = function (index, how) {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqHeroLevelUp", index, how);
        };
        /**进阶 */
        HeroManager.prototype.HeroStartUp = function (index) {
            var hero = this.Herolist[index];
            H52D_Framework.RemoteCall.Instance.Send("K_ReqHeroStarUp", index);
        };
        /**英雄布阵信息 */
        HeroManager.prototype.HeroWarInfo = function (herowar) {
            H52D_Framework.RemoteCall.Instance.Send("K_SaveBattleArray", herowar);
        };
        /** 通知英雄布阵信息 */
        HeroManager.prototype.C_SaveBattleArray = function (buf) {
            var _this = this;
            //if (this._loading) return;
            this._loading = true;
            var HeroWarList = buf[0];
            H52D_Framework.MasterPlayer.Instance.player.HeroWarList = HeroWarList;
            // 更新完阵容信息后刷新对话列表
            H52D_Framework.BubbleManager.Instance.UpdateAllBubbleID();
            //清除气泡
            H52D_Framework.Event.DispatchEvent("ClearBubble");
            H52D_Framework.HeroCardManager.Instance.AvatarInit(Laya.Handler.create(this, function () {
                _this._loading = false;
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.BEGIN_FIRE);
                if (buf[1]) {
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips("阵容保存成功！");
                }
            }));
        };
        /** 通知客户端激活成功 */
        HeroManager.prototype.C_ReqActivateHero = function (buf) {
            var heroid = buf[0];
            var hero = H52D_Framework.HeroConfig[heroid];
            H52D_Framework.AttributePassiveManager.Instance.Update();
            //hero.OwnIsTrue(a);            
            H52D_Framework.Event.DispatchEvent("ReqActivateHero");
            //重新生效武器属性
            H52D_Framework.EquipManager.Instance.AnewLoadAttribute();
            H52D_Framework.PetManager.Instance.OnResetAttr();
            H52D_Framework.MHAManager.Instance.OnRest();
            //激活成功后，打开分享
            if (hero.isShare) {
                H52D_Framework.ShareLogic.Instance.ShareHero(heroid);
            }
        };
        /** 通知客户端升级成功*/
        HeroManager.prototype.C_ReqHeroLevelUp = function (buf) {
            H52D_Framework.Event.DispatchEvent("ReqHeroLevelUp");
        };
        HeroManager.prototype.C_HeroLevelUp = function (buf) {
            var heroid = buf[0];
            var lvnum = buf[1];
            var herobase = this._herolist[heroid];
            herobase.Level = lvnum;
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.MODIFYATTR, [heroid]);
        };
        /*** 通知客户端进阶成功 */
        HeroManager.prototype.C_ReqHeroStarUp = function (buf) {
            var heroid = buf[0];
            var herostat = buf[1];
            var hero = this._herolist[heroid];
            hero.Star = herostat;
            H52D_Framework.Event.DispatchEvent("ReqHeroStartUps");
            //调用方法 进阶
        };
        /** 主界面红点 */
        HeroManager.prototype.HeroMainRed = function () {
            var herolist = HeroManager.Instance.GetCfgHeroList();
            for (var Idex = 0; Idex < herolist.length; Idex++) {
                var nheroID = herolist[Idex];
                var hero = this.GetHero(nheroID);
                if (!H52D_Framework.IsShieldRecharge()) {
                    if (this._peck_show && this._peck_icon) {
                        return true;
                    }
                }
                var IsActive = HeroManager.Instance.IsActive(nheroID);
                if (IsActive) {
                    var Red_star = HeroManager.Instance.HeroIsStar(nheroID);
                    if (Red_star) {
                        return true;
                    }
                    var Red_lvup = HeroManager.Instance.HeroIsUp(nheroID);
                    if (Red_lvup) {
                        return true;
                    }
                }
                else {
                    var Red_open = HeroManager.Instance.HeroIstrue(nheroID);
                    if (Red_open) {
                        return true;
                    }
                }
            }
            var bool = H52D_Framework.HeroHandbookManager.Instance.Red_Show();
            return bool;
        };
        HeroManager.prototype.OpenView = function (nHeroID) {
            if (H52D_Framework.UIManager.Instance.IsHave("Hero_AlInfo", H52D_Framework.ViewToppestRoot)) {
                H52D_Framework.UIManager.Instance.DestroyUI("Hero_AlInfo", [H52D_Framework.ViewToppestRoot]);
            }
            H52D_Framework.UIManager.Instance.CreateUI("Hero_AlInfo", [H52D_Framework.ViewToppestRoot, nHeroID]);
        };
        /**My_money 自己的金币 ，need_mone需要的金币  判断等级不足时 金币数量的颜色  */
        HeroManager.prototype.HeroUp_labelcolor = function (My_money, need_money) {
            var a = My_money >= need_money ? 1 : 2;
            return this.MoneyColor[a];
        };
        /**同一等级限制下能升级的最大等级 */
        HeroManager.prototype.MaxLvUp = function (nHeroID, playlv) {
            var hero = HeroManager.Instance.GetHero(nHeroID);
            var type = H52D_Framework.HeroConfig[nHeroID].type;
            var lv = H52D_Framework.HeroUpgrateConfig[type][hero.Level].needPlayerLv;
            if (playlv < lv) {
                return lv;
            }
            for (var Idex = hero.Level; Idex < Idex + 10; Idex++) {
                if (Idex > 300)
                    return 300;
                var lock = H52D_Framework.HeroUpgrateConfig[type][Idex].needPlayerLv;
                if (playlv < lock) {
                    if (lv < lock) {
                        return Idex - 1;
                    }
                }
            }
        };
        /**现有金币下能升的级数 */
        HeroManager.prototype.M_MaxLvup = function (nHeroID, play_money) {
            var hero = HeroManager.Instance.GetHero(nHeroID);
            var type = H52D_Framework.HeroConfig[nHeroID].type;
            var nx = H52D_Framework.HeroConfig[nHeroID].heroRatio;
            var lv = H52D_Framework.HeroUpgrateConfig[type][hero.Level].needPlayerLv;
            for (var Idex = hero.Level; Idex < Idex + 10; Idex++) {
                if (Idex > 300)
                    return 300;
                var needMoney = H52D_Framework.HeroUpgrateConfig[type][Idex].ConsumeGold - H52D_Framework.HeroUpgrateConfig[type][hero.Level].ConsumeGold;
                needMoney = needMoney * nx;
                if (play_money < needMoney) {
                    return Idex - 1;
                }
            }
        };
        HeroManager.prototype.Up_one = function (play_money, nType, lv, nowmoney, nx) {
            var a = H52D_Framework.HeroUpgrateConfig[nType][lv + 1].ConsumeGold - nowmoney;
            var money_label = (Math.floor(a * nx)).toString();
            var money_color = HeroManager.Instance.HeroUp_labelcolor(play_money, money_label);
            var str = H52D_Framework.GetHtmlStrByColor(money_label, money_color);
            return str;
        };
        HeroManager.prototype.Base_one = function (nType, lv, nx, star) {
            var next_base = H52D_Framework.HeroUpgrateConfig[nType][lv + 1].Attr;
            var base = H52D_Framework.HeroUpgrateConfig[nType][lv];
            var addhp = next_base[1][2] - base.Attr[1][2];
            var addhurt = next_base[2][2] - base.Attr[2][2];
            var str_hp = "(↑" + (Math.floor((addhp * nx) * (star + 1))).toString() + ")";
            var str_hurt = "(↑" + (Math.floor((addhurt * nx) * (star + 1))).toString() + ")";
            return [str_hp, str_hurt];
        };
        /**激活英雄 */
        HeroManager.prototype.OpenHero = function (nHeroID) {
            var tCfg = H52D_Framework.HeroConfig[nHeroID];
            var needItem = tCfg.needItem;
            var needNum = tCfg.needNum;
            if (H52D_Framework.BagManager.Instance.getItemNumber(needItem) < needNum) {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("激活英雄所需材料不足！");
                return;
            }
            this.K_ReqActivateHero(nHeroID);
        };
        HeroManager.prototype.OpenShop = function (Pos) {
            H52D_Framework.Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
            if (Pos == 2) {
                H52D_Framework.OneTimer(500, function () {
                    H52D_Framework.Event.DispatchEvent("toGemShop");
                });
            }
        };
        HeroManager.prototype.SortHero = function (arr, bool) {
            function tsort(left, right) {
                var leftcan = false; //是否能够激活
                var leftActive = false;
                var rightcan = false; //是否已经激活
                var rightActive = false;
                leftActive = HeroManager.Instance.IsActive(left); //是否已经激活
                leftcan = HeroManager.Instance.HeroIstrue(left);
                var left_quality = H52D_Framework.HeroConfig[left].heroPosition;
                rightActive = HeroManager.Instance.IsActive(right);
                rightcan = HeroManager.Instance.HeroIstrue(right);
                var right_quality = H52D_Framework.HeroConfig[right].heroPosition;
                if (leftcan != rightcan) {
                    return leftcan ? -1 : 1;
                }
                if (leftActive != rightActive) {
                    return leftActive ? -1 : 1;
                }
                //修改选角英雄的排序
                if (left == H52D_Framework.LoginLogic.Instance.profid) {
                    left_quality = 1;
                }
                if (left == H52D_Framework.LoginLogic.Instance.secondid) {
                    left_quality = 2;
                }
                if (left == H52D_Framework.LoginLogic.Instance.thirdid) {
                    left_quality = 3;
                }
                if (left_quality && left_quality != right_quality) {
                    return left_quality < right_quality ? -1 : 1;
                }
                return left - right;
                //先排能够激活的
            }
            if (bool) {
                arr.sort(tsort);
            }
        };
        HeroManager.prototype.WarSort = function (a) {
            function tsort(a, b) {
                var a_q = H52D_Framework.HeroConfig[a].quality;
                var b_q = H52D_Framework.HeroConfig[b].quality;
                if (a_q == b_q) {
                    return a > b ? 1 : -1;
                }
                return a_q > b_q ? -1 : 1;
            }
            a.sort(tsort);
        };
        return HeroManager;
    }());
    H52D_Framework.HeroManager = HeroManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=HeroManager.js.map