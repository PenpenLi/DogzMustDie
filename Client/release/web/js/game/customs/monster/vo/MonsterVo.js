var H52D_Framework;
(function (H52D_Framework) {
    /**
     * 怪物数据模型
     * @author zhangyusong
     */
    var MonsterVo = /** @class */ (function () {
        function MonsterVo(_id) {
            this.attr = new H52D_Framework.Attribute();
            this.id = _id;
            this.cfg = H52D_Framework.MonstorConfig[this.id];
            this.attr.SetAttributeValue(1, H52D_Framework.eValueType.Base, this.cfg["hp"]);
            this.attr.SetAttributeValue(2, H52D_Framework.eValueType.Base, this.cfg["damage"]);
            this.attr.SetAttributeValue(4, H52D_Framework.eValueType.Base, this.cfg["critProbability"]);
            this.attr.SetAttributeValue(5, H52D_Framework.eValueType.Base, this.cfg["critDamgeRatio"]);
            /**战斗属性 */
            this.MaxHP = this.attr.GetAttributeValue(1);
            this.CurrentHP = this.MaxHP;
        }
        Object.defineProperty(MonsterVo.prototype, "name", {
            // 怪物名字	
            get: function () {
                var n = H52D_Framework.GetInfoAttr.Instance.GetText(this.cfg["NameId"]);
                if (!n)
                    n = "任性的Boss";
                return n;
            },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(MonsterVo.prototype, "strHeadIcon", {
            // 怪物头像	
            get: function () { return this.cfg["strHeadIcon"]; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(MonsterVo.prototype, "strModelId", {
            // 怪物模型	
            get: function () { return this.cfg["strModelId"]; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(MonsterVo.prototype, "modelScale", {
            // 模型缩放比例	
            get: function () { return this.cfg["modelScale"]; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(MonsterVo.prototype, "monType", {
            // 怪物类型	
            get: function () { return this.cfg["MonType"]; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(MonsterVo.prototype, "skillId", {
            // 怪物技能	
            get: function () { return this.cfg["skillId"]; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(MonsterVo.prototype, "dropRewardId", {
            // 掉落ID	
            get: function () { return this.cfg["dropRewardId"]; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(MonsterVo.prototype, "hpListNum", {
            // 血条数量	
            get: function () { return this.cfg["HpListNum"]; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(MonsterVo.prototype, "modlight", {
            /** 怪物闪光亮度 */
            get: function () { return this.cfg["Modlight"]; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(MonsterVo.prototype, "allDamgeReduction", {
            get: function () {
                var ad = this.cfg["allDamgeReduction"];
                if (ad == 0) {
                    ad = 1;
                }
                else if (ad < 10000) {
                    ad = 1 - this.cfg["allDamgeReduction"] / 10000;
                }
                else if (ad >= 10000) {
                    ad = 0;
                }
                return ad;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonsterVo.prototype, "attackid", {
            get: function () { return this.cfg["attackId"]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonsterVo.prototype, "captainid", {
            get: function () { return this.cfg["SkillId"]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonsterVo.prototype, "boss", {
            /**是不是Boss*/
            get: function () {
                return this.monType == 2;
            },
            enumerable: true,
            configurable: true
        });
        MonsterVo.prototype.SetCol = function () {
            if (this.location == 0 || this.location == 1 || this.location == 2) {
                this.rowNum = 1;
            }
            if (this.location == 3 || this.location == 4 || this.location == 5) {
                this.rowNum = 2;
            }
            if (this.location == 6 || this.location == 7 || this.location == 8) {
                this.rowNum = 3;
            }
            if (this.location == 0 || this.location == 3 || this.location == 6) {
                this.colNum = 1;
            }
            if (this.location == 1 || this.location == 4 || this.location == 7) {
                this.colNum = 2;
            }
            if (this.location == 2 || this.location == 5 || this.location == 8) {
                this.colNum = 3;
            }
        };
        return MonsterVo;
    }());
    H52D_Framework.MonsterVo = MonsterVo;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MonsterVo.js.map