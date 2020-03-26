var H52D_Framework;
(function (H52D_Framework) {
    /**技能伤害计算类 @author zhangzhenming */
    var SkillDamage = /** @class */ (function () {
        function SkillDamage(onwer, target, data) {
            this._owner = null;
            this._target = null;
            this._data = {};
            this._bCrit = false;
            this._currentD = 0;
            this._owner = onwer;
            this._target = target;
            this._data = data;
            this._bCrit = false;
        }
        Object.defineProperty(SkillDamage.prototype, "bCrit", {
            get: function () { return this._bCrit; },
            enumerable: true,
            configurable: true
        });
        SkillDamage.prototype.IsCrit = function () {
            if (!this._owner.vo)
                return false;
            var attr = this._owner.vo.attr;
            var num = Math.random() * 10000;
            if (num == 0)
                return false;
            if (num <= attr.GetAttributeValue(4)) {
                return true;
            }
            return false;
        };
        /**加上减免 计算出的伤害 */
        SkillDamage.prototype.ImDamage = function (ratio, target) {
            var damage = 0;
            if (!this._owner.vo)
                return 0;
            /**自身属性 */
            var attr = this._owner.vo.attr;
            /**目标属性 */
            var tattr = target.vo.attr;
            /**目标类型 */
            var type = target.type;
            /**己方类型 */
            var otype = this._owner.type;
            //自身减免
            var OwnerIm = 0;
            //Buff减免
            var BuffIm = 0;
            switch (otype) {
                case eCharacter_TYPE.AHERO:
                    OwnerIm = tattr.GetAttributeTypeValue(22, H52D_Framework.eValueType.Percent) +
                        tattr.GetAttributeTypeValue(24, H52D_Framework.eValueType.Percent) +
                        tattr.GetAttributeTypeValue(27, H52D_Framework.eValueType.Percent);
                    BuffIm = tattr.GetAttributeTypeValue(22, H52D_Framework.eValueType.BPercent) +
                        tattr.GetAttributeTypeValue(24, H52D_Framework.eValueType.BPercent) +
                        tattr.GetAttributeTypeValue(27, H52D_Framework.eValueType.BPercent);
                    damage = attr.GetAttributeDamage(ratio, OwnerIm, BuffIm);
                    break;
                case eCharacter_TYPE.DHERO:
                    OwnerIm = tattr.GetAttributeTypeValue(23, H52D_Framework.eValueType.Percent) +
                        tattr.GetAttributeTypeValue(24, H52D_Framework.eValueType.Percent) +
                        tattr.GetAttributeTypeValue(27, H52D_Framework.eValueType.Percent);
                    BuffIm = tattr.GetAttributeTypeValue(23, H52D_Framework.eValueType.BPercent) +
                        tattr.GetAttributeTypeValue(24, H52D_Framework.eValueType.BPercent) +
                        tattr.GetAttributeTypeValue(27, H52D_Framework.eValueType.BPercent);
                    damage = attr.GetAttributeDamage(ratio, OwnerIm, BuffIm);
                    break;
                case eCharacter_TYPE.PLAYER:
                    OwnerIm = tattr.GetAttributeTypeValue(21, H52D_Framework.eValueType.Percent)
                        + tattr.GetAttributeTypeValue(27, H52D_Framework.eValueType.Percent);
                    BuffIm = tattr.GetAttributeTypeValue(21, H52D_Framework.eValueType.BPercent);
                    tattr.GetAttributeTypeValue(27, H52D_Framework.eValueType.BPercent);
                    damage = attr.GetAttributeDamage(ratio, OwnerIm, BuffIm);
                    break;
                case eCharacter_TYPE.PET:
                    OwnerIm = tattr.GetAttributeTypeValue(25, H52D_Framework.eValueType.Percent) +
                        tattr.GetAttributeTypeValue(27, H52D_Framework.eValueType.Percent);
                    BuffIm = tattr.GetAttributeTypeValue(25, H52D_Framework.eValueType.BPercent) +
                        tattr.GetAttributeTypeValue(27, H52D_Framework.eValueType.BPercent);
                    damage = attr.GetAttributeDamage(ratio, OwnerIm, BuffIm);
                    break;
                case eCharacter_TYPE.CAMP:
                    OwnerIm = tattr.GetAttributeTypeValue(26, H52D_Framework.eValueType.Percent) +
                        tattr.GetAttributeTypeValue(27, H52D_Framework.eValueType.Percent);
                    BuffIm = tattr.GetAttributeTypeValue(26, H52D_Framework.eValueType.BPercent) +
                        tattr.GetAttributeTypeValue(27, H52D_Framework.eValueType.BPercent);
                    damage = attr.GetAttributeDamage(ratio, OwnerIm, BuffIm);
                    break;
            }
            return damage >> 0;
        };
        SkillDamage.prototype.ComputeDamage = function (target) {
            if (!this._owner)
                return;
            this._bCrit = false;
            var num = this._data["1"]["2"] / 10000;
            var damage = this.ImDamage(num, target);
            if (this.IsCrit()) {
                this._bCrit = true;
                var attr = this._owner.vo.attr;
                var wfb = attr.GetAttributeValue(5) / 10000;
                damage = damage * wfb;
            }
            return damage >> 0;
        };
        SkillDamage.prototype.ComputeDamageN = function (target) {
            if (!this._owner)
                return;
            this._bCrit = false;
            var attr = this._owner.vo.attr;
            var num = this._data["1"]["2"] / 10000;
            var damage = attr.GetAttributeD(num);
            if (this.IsCrit()) {
                this._bCrit = true;
                var wfb = attr.GetAttributeValue(5) / 10000;
                damage = damage * wfb;
            }
            return damage >> 0;
        };
        return SkillDamage;
    }());
    H52D_Framework.SkillDamage = SkillDamage;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=SkillDamage.js.map