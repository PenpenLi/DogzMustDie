var H52D_Framework;
(function (H52D_Framework) {
    var PheroInfo = /** @class */ (function () {
        function PheroInfo(data) {
            /**普攻大招id */
            this.skillid = [];
            /**解锁技能id */
            this.onPassiveID = [];
            /**属性被动技能id */
            this.attributeID = [];
            /**条件被动技能id */
            this.conditionsID = [];
            /**表 被动技能id */
            this.passiveId = [];
            /**表  英雄解锁被动技能的等级*/
            this.passiveOnLevel = [];
            this.ToSpeed = 0;
            /**站位  -1 为上阵 */
            this._location = -1;
            this._id = data["id"];
            this._level = data["level"];
            this._star = data["star"];
            this._location = data["location"];
            this._cfg = H52D_Framework.HeroConfig[this._id];
            this.Init();
        }
        Object.defineProperty(PheroInfo.prototype, "id", {
            get: function () { return this._id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PheroInfo.prototype, "heroCfg", {
            get: function () { return this._cfg; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PheroInfo.prototype, "Level", {
            /** 英雄等级 */
            get: function () { return this._level; },
            /** 英雄等级 */
            set: function (level) { this._level = level; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PheroInfo.prototype, "Star", {
            /***英雄星级 */
            get: function () { return this._star; },
            set: function (value) { this._star = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PheroInfo.prototype, "ModlePath", {
            get: function () { return this._cfg["strFacadeModel"]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PheroInfo.prototype, "name", {
            get: function () { return H52D_Framework.GetInfoAttr.Instance.GetText(this._cfg.name); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PheroInfo.prototype, "OnPassiveID", {
            get: function () { return this.onPassiveID; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PheroInfo.prototype, "attr", {
            /**基础属性表 */
            get: function () { return this._attr; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PheroInfo.prototype, "hero_Type", {
            get: function () { return this._cfg.type; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PheroInfo.prototype, "location", {
            get: function () { return this._location; },
            enumerable: true,
            configurable: true
        });
        /***获取英雄属性 */
        PheroInfo.prototype.GetHeroInfo = function (heroid) {
            var hero = H52D_Framework.HeroConfig[heroid];
            var info = H52D_Framework.HeroManager.Instance.GetHero(heroid);
            var base = H52D_Framework.HeroUpgrateConfig[hero.type][info.Level]["Attr"];
            return base;
        };
        /**初始化 */
        PheroInfo.prototype.Init = function () {
            this._attr = new H52D_Framework.Attribute();
            var s = this._cfg.heroPassiveSkill;
            for (var i = 1; i < H52D_Framework.GetTabLength(s); i++) {
                this.passiveId.push(s[i]["1"]);
                this.passiveOnLevel.push(s[i]["2"]);
            }
            /**升级表*/
            var Upgrate = H52D_Framework.HeroUpgrateConfig[this.hero_Type];
            /**进阶表*/
            var Advance = H52D_Framework.HeroAdvanceConfig[this._id];
            /**固定属性表*/
            var stationaryAttribute = H52D_Framework.HeroConfig[this._id]["stationaryAttribute"];
            /**英雄升级属性表*/
            var Level_attr = Upgrate[this._level]["Attr"];
            /**表HP */
            var TabHP = 0;
            /**表伤害 */
            var TabDamage = 0;
            /**英雄档次系数 */
            var heroRatio = this._cfg.heroRatio;
            /**有英雄星级 */
            if (this._star != 0) {
                /**进阶属性 */
                var adv = Advance[this._star]["Attr"];
                /**HP转化比 */
                var HpPer = 1 + adv[1][2] / 10000;
                /**伤害转化比 */
                var DamagePer = 1 + adv[2][2] / 10000;
                /**
                 * 最终属性 =  等级属性 * 系数 + 等及属性*加成比
                 */
                TabHP = Level_attr[1][2] * heroRatio * HpPer;
                TabDamage = Level_attr[2][2] * heroRatio * DamagePer;
            }
            /**没有英雄星级 */
            else {
                /**
                 * 最终属性 =  等级属性 * 英雄系数
                 */
                TabHP = Level_attr[1][2] * heroRatio;
                TabDamage = Level_attr[2][2] * heroRatio;
            }
            this.skillid = [this._cfg["heroAtt"], this._cfg["heroBigSkill"]];
            /**设置HP */
            this.attr.SetAttributeValue(1, H52D_Framework.eValueType.Base, TabHP >> 0);
            /**设置伤害 */
            this.attr.SetAttributeValue(2, H52D_Framework.eValueType.Base, TabDamage >> 0);
            /**设置出手速度 */
            var speed = stationaryAttribute["1"]["2"];
            this.attr.SetAttributeValue(3, H52D_Framework.eValueType.Base, speed >> 0);
            /**设置暴击率 */
            var crit = stationaryAttribute["2"]["2"];
            this.attr.SetAttributeValue(4, H52D_Framework.eValueType.Base, crit >> 0);
            /**设置暴击倍率 */
            var ratio = stationaryAttribute["3"]["2"];
            this.attr.SetAttributeValue(5, H52D_Framework.eValueType.Base, ratio >> 0);
            this.InitPassiveID();
        };
        /**初始化被动技能id表 */
        PheroInfo.prototype.InitPassiveID = function () {
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
            for (var k in this.attributeID) {
                if (this.attributeID[k]) {
                    var pas = H52D_Framework.PassiveSkillConfig[this.attributeID[k]]["scriptParam"];
                    if (pas[1] == 9 || pas[1] == 10) {
                        var po = new H52D_Framework.POAttribute(this, pas);
                        po.OnEffect();
                    }
                }
            }
        };
        /**设置第几排第几列 */
        PheroInfo.prototype.SetColOrow = function () {
            if (this._location == 0 || this._location == 1 || this._location == 2) {
                this.rowNum = 1;
            }
            else if (this._location == 3 || this._location == 4 || this._location == 5) {
                this.rowNum = 2;
            }
            else if (this._location == 6 || this._location == 7 || this._location == 8) {
                this.rowNum = 3;
            }
            if (this._location == 0 || this._location == 3 || this._location == 6) {
                this.colNum = 1;
            }
            else if (this._location == 1 || this._location == 4 || this._location == 7) {
                this.colNum = 2;
            }
            else if (this._location == 2 || this._location == 5 || this._location == 8) {
                this.colNum = 3;
            }
        };
        /**设置先手速度 */
        PheroInfo.prototype.SetToSpeed = function () {
            /**先手速度浮动点 （0.95-1.05） */
            var speedoffect = (Math.random() * 11 + 95) >> 0;
            /**转化百分比为小数 */
            var speedfloat = speedoffect / 100;
            /**先手速度 = 先手速度*浮动点 */
            var speed = this.attr.GetAttributeValue(3);
            this.ToSpeed = speed * speedfloat;
        };
        return PheroInfo;
    }());
    H52D_Framework.PheroInfo = PheroInfo;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PheroInfo.js.map