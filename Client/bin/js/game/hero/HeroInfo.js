var H52D_Framework;
(function (H52D_Framework) {
    /** 英雄类型*/
    var HeroType;
    (function (HeroType) {
    })(HeroType = H52D_Framework.HeroType || (H52D_Framework.HeroType = {}));
    /** 英雄技能*/
    var HeroSkill;
    (function (HeroSkill) {
    })(HeroSkill || (HeroSkill = {}));
    /**英雄信息  常万 */
    var HeroInfo = /** @class */ (function () {
        function HeroInfo() {
            /**普攻大招id */
            this.skillid = [];
            /**站位  -1 为上阵 */
            this.location = -1;
            /**解锁技能id */
            this.onPassiveID = [];
            /**属性被动技能id */
            this.attributeID = [];
            /**条件被动技能id */
            this.conditionsID = [];
            /**表  所有被动技能id列表 */
            this.passiveId = [];
            /**表  英雄解锁被动技能的等级列表*/
            this.passiveOnLevel = [];
            this.allDamgeReduction = -1;
            this.ToSpeed = 0;
        }
        /** 解析服务器数据 */
        HeroInfo.prototype.unpackData = function (tData) {
            this.nHeroID = tData[1];
            this._level = tData[2];
            this._star = tData[3];
            this.Init();
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.MODIFYATTR, Laya.Handler.create(this, this.LevelComplete));
        };
        Object.defineProperty(HeroInfo.prototype, "nHeroID", {
            get: function () {
                return this._id;
            },
            /** 配置ID */
            set: function (id) {
                this._cfg = H52D_Framework.HeroConfig[id];
                this._id = id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroInfo.prototype, "heroCfg", {
            get: function () {
                return this._cfg;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroInfo.prototype, "Level", {
            /** 英雄等级 */
            get: function () {
                return this._level;
            },
            /** 英雄等级 */
            set: function (level) {
                this._level = level;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroInfo.prototype, "Star", {
            /***英雄星级 */
            get: function () {
                return this._star;
            },
            set: function (value) {
                this._star = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroInfo.prototype, "OnPassiveID", {
            get: function () { return this.onPassiveID; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroInfo.prototype, "attr", {
            /**基础属性表 */
            get: function () { return this._attr; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroInfo.prototype, "HeadIcon", {
            /** 英雄头像 */
            get: function () {
                return "ui_icon/" + this._cfg.strIcon;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroInfo.prototype, "HeroType", {
            get: function () { return this._cfg.type; },
            enumerable: true,
            configurable: true
        });
        /***获取英雄属性 */
        HeroInfo.prototype.GetHeroInfo = function (heroid) {
            var hero = H52D_Framework.HeroConfig[heroid];
            var info = H52D_Framework.HeroManager.Instance.GetHero(heroid);
            var base = H52D_Framework.HeroUpgrateConfig[hero.type][info.Level]["Attr"];
            return base;
        };
        Object.defineProperty(HeroInfo.prototype, "ModlePath", {
            get: function () { return this._cfg["strFacadeModel"]; },
            enumerable: true,
            configurable: true
        });
        HeroInfo.prototype.LevelComplete = function (id) {
            if (id == this.nHeroID) {
                this.Update();
                this.UpdatePassiveskill();
                // AttributePassiveManager.Instance.Update();
            }
        };
        Object.defineProperty(HeroInfo.prototype, "Upgrate", {
            /**升级表*/
            get: function () { return H52D_Framework.HeroUpgrateConfig[this.HeroType]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroInfo.prototype, "Advance", {
            /**进阶表*/
            get: function () { return H52D_Framework.HeroAdvanceConfig[this._id]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroInfo.prototype, "stationaryAttribute", {
            /**固定属性表*/
            get: function () { return H52D_Framework.HeroConfig[this._id]["stationaryAttribute"]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroInfo.prototype, "Level_attr", {
            /**升级属性表 */
            get: function () { return this.Upgrate[this._level]["Attr"]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroInfo.prototype, "Start_attr", {
            /**进阶属性表 */
            get: function () { return this.Advance[this._star]["Attr"]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroInfo.prototype, "heroRatio", {
            /**英雄系数 */
            get: function () { return this._cfg.heroRatio; },
            enumerable: true,
            configurable: true
        });
        /**初始化 */
        HeroInfo.prototype.Init = function () {
            this._attr = new H52D_Framework.Attribute();
            this.ReadAttr();
            this.InitPassiveID();
        };
        Object.defineProperty(HeroInfo.prototype, "id", {
            get: function () { return this.nHeroID; },
            enumerable: true,
            configurable: true
        });
        /**读表属性*/
        HeroInfo.prototype.ReadAttr = function () {
            /**表HP */
            var TabHP = 0;
            /**表伤害 */
            var TabDamage = 0;
            /**有英雄星级 */
            if (this._star != 0) {
                /**HP转化比 */
                var HpPer = 1 + this.Start_attr[1][2] / 10000;
                /**伤害转化比 */
                var DamagePer = 1 + this.Start_attr[2][2] / 10000;
                /**
                 * 最终属性 =  等级属性 * 系数 + 等及属性*加成比
                 */
                TabHP = this.Level_attr[1][2] * this.heroRatio * HpPer;
                TabDamage = this.Level_attr[2][2] * this.heroRatio * DamagePer;
            }
            /**没有英雄星级 */
            else {
                /**
                 * 最终属性 =  等级属性 * 英雄系数
                 */
                TabHP = this.Level_attr[1][2] * this.heroRatio;
                TabDamage = this.Level_attr[2][2] * this.heroRatio;
            }
            this.skillid = [this._cfg["heroAtt"], this._cfg["heroBigSkill"]];
            /**设置HP */
            this.attr.SetAttributeValue(1, H52D_Framework.eValueType.Base, TabHP);
            /**设置伤害 */
            this.attr.SetAttributeValue(2, H52D_Framework.eValueType.Base, TabDamage);
            /**设置出手速度 */
            var speed = this.stationaryAttribute["1"]["2"];
            this.attr.SetAttributeValue(3, H52D_Framework.eValueType.Base, speed);
            /**设置暴击率 */
            var crit = this.stationaryAttribute["2"]["2"];
            this.attr.SetAttributeValue(4, H52D_Framework.eValueType.Base, crit);
            /**设置暴击倍率 */
            var ratio = this.stationaryAttribute["3"]["2"];
            this.attr.SetAttributeValue(5, H52D_Framework.eValueType.Base, ratio);
        };
        /**初始化被动技能id表 */
        HeroInfo.prototype.InitPassiveID = function () {
            for (var i = 1; i < H52D_Framework.GetTabLength(this._cfg.heroPassiveSkill); i++) {
                this.passiveId.push(this._cfg.heroPassiveSkill[i]["1"]);
                this.passiveOnLevel.push(this._cfg.heroPassiveSkill[i]["2"]);
            }
            this.onPassiveID = [];
            this.attributeID = [];
            this.conditionsID = [];
            for (var i = 0; i < this.passiveOnLevel.length; i++) {
                if (this._level >= this.passiveOnLevel[i]) {
                    this.onPassiveID.push(this.passiveId[i]);
                }
            }
            for (var i = 0; i < this.onPassiveID.length; i++) {
                var type_id = H52D_Framework.PassiveSkillConfig[this.onPassiveID[i]]["scriptID"];
                if (type_id == 1) {
                    this.attributeID.push(this.onPassiveID[i]);
                }
                else {
                    this.conditionsID.push(this.onPassiveID[i]);
                }
            }
        };
        /**更新属性 */
        HeroInfo.prototype.Update = function () {
            this.ReadAttr();
            this.UpdatePassiveskill();
        };
        /**更新被动属性技能*/
        HeroInfo.prototype.UpdatePassiveskill = function () {
            for (var i = 0; i < this.passiveOnLevel.length; i++) {
                if (this._level >= this.passiveOnLevel[i]) {
                    if (this.onPassiveID.length == 0) {
                        var id = this.passiveId[0];
                        H52D_Framework.AttributePassiveManager.Instance.OnLock(id, this.nHeroID);
                        this.onPassiveID.push(id);
                        this.attributeID.push(id);
                        if (this.onlockpassive) {
                            this.onlockpassive.run();
                        }
                        return;
                    }
                    var sid = this.passiveId[i];
                    var oid = this.onPassiveID[i];
                    if (sid != oid) {
                        var id = this.passiveId[i];
                        this.onPassiveID.push(id);
                        this.attributeID.push(id);
                        H52D_Framework.AttributePassiveManager.Instance.OnLock(id, this.nHeroID);
                        if (this.onlockpassive) {
                            this.onlockpassive.run();
                        }
                        return;
                    }
                }
            }
        };
        HeroInfo.prototype.OnLock = function () {
        };
        /**加成属性设置为0 以便不重复加成 */
        HeroInfo.prototype.UpdateAttrbute = function () {
            for (var i = 1; i <= 5; i++) {
                this.attr.SetAttributeValue(i, H52D_Framework.eValueType.Percent, 0);
                this.attr.SetAttributeValue(i, H52D_Framework.eValueType.Fixed, 0);
            }
            for (var i = 21; i <= 27; i++) {
                this.attr.SetAttributeValue(i, H52D_Framework.eValueType.Percent, 0);
                this.attr.SetAttributeValue(i, H52D_Framework.eValueType.Fixed, 0);
            }
        };
        /**设置第几排第几列 */
        HeroInfo.prototype.SetColOrow = function () {
            if (this.location == 0 || this.location == 1 || this.location == 2) {
                this.rowNum = 1;
            }
            else if (this.location == 3 || this.location == 4 || this.location == 5) {
                this.rowNum = 2;
            }
            else if (this.location == 6 || this.location == 7 || this.location == 8) {
                this.rowNum = 3;
            }
            if (this.location == 0 || this.location == 3 || this.location == 6) {
                this.colNum = 1;
            }
            else if (this.location == 1 || this.location == 4 || this.location == 7) {
                this.colNum = 2;
            }
            else if (this.location == 2 || this.location == 5 || this.location == 8) {
                this.colNum = 3;
            }
        };
        HeroInfo.prototype.SetToSpeed = function () {
            /**先手速度浮动点 （0.95-1.05） */
            var speedoffect = (Math.random() * 11 + 95) >> 0;
            /**转化百分比为小数 */
            var speedfloat = speedoffect / 100;
            /**先手速度 = 先手速度*浮动点 */
            var speed = this.attr.GetAttributeValue(3);
            this.ToSpeed = speed * speedfloat;
        };
        return HeroInfo;
    }());
    H52D_Framework.HeroInfo = HeroInfo;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=HeroInfo.js.map