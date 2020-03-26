/**
* 技能数据类
*/
var H52D_Framework;
(function (H52D_Framework) {
    var SkillData = /** @class */ (function () {
        function SkillData(id) {
            this.id = id;
        }
        Object.defineProperty(SkillData.prototype, "nameId", {
            /** 名称ID*/
            get: function () { return H52D_Framework.ActiveSkillConfig[this.id].nameId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillData.prototype, "descId", {
            /** 描述ID*/
            get: function () { return H52D_Framework.ActiveSkillConfig[this.id].descId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillData.prototype, "strIcon", {
            /** 图标名称*/
            get: function () { return H52D_Framework.ActiveSkillConfig[this.id].nameId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillData.prototype, "actionEffect", {
            /** 技能特效*/
            get: function () { return H52D_Framework.ActiveSkillConfig[this.id].actionEffect; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillData.prototype, "flyEffect", {
            /** 子弹特效*/
            get: function () { return H52D_Framework.ActiveSkillConfig[this.id].flyEffect; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillData.prototype, "hitEffect", {
            /** 被击特效*/
            get: function () { return H52D_Framework.ActiveSkillConfig[this.id].hitEffect; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillData.prototype, "soundParam", {
            /** 技能音效*/
            get: function () { return H52D_Framework.ActiveSkillConfig[this.id].soundParam; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillData.prototype, "hitSound", {
            /** 被击音效*/
            get: function () { return H52D_Framework.ActiveSkillConfig[this.id].hitSound; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillData.prototype, "level", {
            /** 技能等级*/
            get: function () { return H52D_Framework.ActiveSkillConfig[this.id].level; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillData.prototype, "conMp", {
            /** 法力消耗*/
            get: function () { return H52D_Framework.ActiveSkillConfig[this.id].conMp; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillData.prototype, "skillCD", {
            /** 技能cd*/
            get: function () { return H52D_Framework.ActiveSkillConfig[this.id].skillCD; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillData.prototype, "hitEnemyMode", {
            /** 攻击目标*/
            get: function () { return H52D_Framework.ActiveSkillConfig[this.id].hitEnemyMode; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillData.prototype, "hitEnemyNum", {
            /** 攻击数量*/
            get: function () { return H52D_Framework.ActiveSkillConfig[this.id].hitEnemyNum; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillData.prototype, "damageList", {
            /** 技能伤害*/
            get: function () { return H52D_Framework.ActiveSkillConfig[this.id].damageList; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillData.prototype, "statusList", {
            /** 技能状态*/
            get: function () { return H52D_Framework.ActiveSkillConfig[this.id].statusList; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillData.prototype, "hierarchy", {
            /** 技能层级 */
            get: function () { return H52D_Framework.ActiveSkillConfig[this.id].hierarchy; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillData.prototype, "shake", {
            /**效果id */
            get: function () { return H52D_Framework.ActiveSkillConfig[this.id].shake; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillData.prototype, "point", {
            get: function () { return H52D_Framework.ActiveSkillConfig[this.id].point; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillData.prototype, "special", {
            get: function () { return H52D_Framework.ActiveSkillConfig[this.id].special; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillData.prototype, "fixedDamage", {
            get: function () {
                if (H52D_Framework.ActiveSkillConfig[this.id].fixedDamage[1])
                    return H52D_Framework.ActiveSkillConfig[this.id].fixedDamage[1];
                else
                    return 0;
            },
            enumerable: true,
            configurable: true
        });
        return SkillData;
    }());
    H52D_Framework.SkillData = SkillData;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=SkillData.js.map