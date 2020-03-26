module H52D_Framework {
    /**技能伤害计算类 @author zhangzhenming */
    export class SkillDamage {
        private _owner: any = null;
        private _target: any = null;
        private _data: Object = {};
        private _bCrit: boolean = false;
        private _currentD: number = 0;
        public get bCrit() { return this._bCrit; }

        constructor(onwer: any, target: any, data: Object) {
            this._owner = onwer;
            this._target = target;
            this._data = data;
            this._bCrit = false;
        }

        private IsCrit(): boolean {
            if (!this._owner.vo) return false;
            let attr = this._owner.vo.attr as Attribute;
            let num = Math.random() * 10000;
            if (num == 0) return false;
            if (num <= attr.GetAttributeValue(4)) {
                return true;
            }
            return false;
        }
        
        /**加上减免 计算出的伤害 */
        private ImDamage(ratio: number, target: any): number {
            let damage = 0;
            if (!this._owner.vo) return 0;
            /**自身属性 */
            let attr = this._owner.vo.attr as Attribute;
            /**目标属性 */
            let tattr = target.vo.attr as Attribute;
            /**目标类型 */
            let type = target.type;
            /**己方类型 */
            let otype = this._owner.type;
            //自身减免
            let OwnerIm = 0;
            //Buff减免
            let BuffIm = 0;

            switch (otype) {
                case eCharacter_TYPE.AHERO:
                    OwnerIm = tattr.GetAttributeTypeValue(22, eValueType.Percent) +
                        tattr.GetAttributeTypeValue(24, eValueType.Percent) +
                        tattr.GetAttributeTypeValue(27, eValueType.Percent);
                    BuffIm = tattr.GetAttributeTypeValue(22, eValueType.BPercent) +
                        tattr.GetAttributeTypeValue(24, eValueType.BPercent) +
                        tattr.GetAttributeTypeValue(27, eValueType.BPercent);
                    damage = attr.GetAttributeDamage(ratio, OwnerIm, BuffIm);
                    break;
                case eCharacter_TYPE.DHERO:
                    OwnerIm = tattr.GetAttributeTypeValue(23, eValueType.Percent) +
                        tattr.GetAttributeTypeValue(24, eValueType.Percent) +
                        tattr.GetAttributeTypeValue(27, eValueType.Percent);
                    BuffIm = tattr.GetAttributeTypeValue(23, eValueType.BPercent) +
                        tattr.GetAttributeTypeValue(24, eValueType.BPercent) +
                        tattr.GetAttributeTypeValue(27, eValueType.BPercent);
                    damage = attr.GetAttributeDamage(ratio, OwnerIm, BuffIm);
                    break;
                case eCharacter_TYPE.PLAYER:
                    OwnerIm = tattr.GetAttributeTypeValue(21, eValueType.Percent)
                        + tattr.GetAttributeTypeValue(27, eValueType.Percent);
                    BuffIm = tattr.GetAttributeTypeValue(21, eValueType.BPercent)
                    tattr.GetAttributeTypeValue(27, eValueType.BPercent);
                    damage = attr.GetAttributeDamage(ratio, OwnerIm, BuffIm);
                    break;
                case eCharacter_TYPE.PET:
                    OwnerIm = tattr.GetAttributeTypeValue(25, eValueType.Percent) +
                        tattr.GetAttributeTypeValue(27, eValueType.Percent);
                    BuffIm = tattr.GetAttributeTypeValue(25, eValueType.BPercent) +
                        tattr.GetAttributeTypeValue(27, eValueType.BPercent);
                    damage = attr.GetAttributeDamage(ratio, OwnerIm, BuffIm);
                    break;
                case eCharacter_TYPE.CAMP:
                    OwnerIm = tattr.GetAttributeTypeValue(26, eValueType.Percent) +
                        tattr.GetAttributeTypeValue(27, eValueType.Percent);
                    BuffIm = tattr.GetAttributeTypeValue(26, eValueType.BPercent) +
                        tattr.GetAttributeTypeValue(27, eValueType.BPercent);
                    damage = attr.GetAttributeDamage(ratio, OwnerIm, BuffIm);
                    break;
            }
            return damage >> 0;
        }


        public ComputeDamage(target: any) {
            if (!this._owner) return
            this._bCrit = false;
            let num = this._data["1"]["2"] / 10000;
            let damage = this.ImDamage(num, target);
            if (this.IsCrit()) {
                this._bCrit = true;
                let attr = this._owner.vo.attr as Attribute;
                let wfb = attr.GetAttributeValue(5) / 10000;
                damage = damage * wfb;
            }
            return damage >> 0;
        }

        public ComputeDamageN(target: any) {
            if (!this._owner) return
            this._bCrit = false;
            let attr = this._owner.vo.attr as Attribute;
            let num = this._data["1"]["2"] / 10000;
            let damage = attr.GetAttributeD(num);
            if (this.IsCrit()) {
                this._bCrit = true;
                let wfb = attr.GetAttributeValue(5) / 10000;
                damage = damage * wfb;
            }
            return damage >> 0;
        }


    }
}