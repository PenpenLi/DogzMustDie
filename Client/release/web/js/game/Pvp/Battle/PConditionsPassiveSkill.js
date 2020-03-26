var H52D_Framework;
(function (H52D_Framework) {
    var PConditionsPassiveSkill = /** @class */ (function () {
        function PConditionsPassiveSkill(id, btype, owner) {
            this._data = null;
            /**buff id */
            this._buffId = 0;
            /**英雄 id */
            this._heroid = 0;
            /**属性 id */
            this._attributeID = 0;
            /**触发几率*/
            this._triggerOdds = 0;
            /**属性加值*/
            this._attributeSubValue = 0;
            /**技能id */
            this.id = 0;
            /**作用目标 */
            this._target = [];
            this._bhurt = false;
            this._battack = false;
            this._btype = 0;
            this._btype = btype;
            this._owner = owner;
            this._data = new H52D_Framework.PassiveSkillData(id);
            this.id = id;
            this._buffTab = [];
            switch (this._data.scriptID) {
                case 2:
                    this._buffId = this._data.scriptParam[1];
                    break;
                case 3:
                    this._heroid = this._data.scriptParam[1];
                    this._buffId = this._data.scriptParam[2];
                    break;
                case 4:
                    this._triggerOdds = this._data.scriptParam[1];
                    this._buffId = this._data.scriptParam[2];
                    break;
                case 5:
                    this._triggerOdds = this._data.scriptParam[1];
                    this._buffId = this._data.scriptParam[2];
                    break;
                case 6:
                    this._buffId = this._data.scriptParam[1];
                    break;
            }
        }
        Object.defineProperty(PConditionsPassiveSkill.prototype, "BHurt", {
            get: function () { return this._bhurt; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PConditionsPassiveSkill.prototype, "BAttack", {
            get: function () { return this._battack; },
            enumerable: true,
            configurable: true
        });
        PConditionsPassiveSkill.prototype.Do = function () {
            this.Destroy();
            switch (this._data.scriptID) {
                case 2:
                    this.TNotHeroAddBuff();
                    break;
                case 3:
                    this.CommonHero();
                    break;
                case 4:
                    if (!this._battack)
                        this._battack = true;
                    break;
                case 5:
                    if (!this._bhurt)
                        this._bhurt = true;
                    break;
                case 6:
                    this.AddBuff();
                    break;
            }
        };
        /**目中无人*/
        PConditionsPassiveSkill.prototype.TNotHeroAddBuff = function () {
            var colnum = this._owner.vo.colNum;
            var monster = this._btype == 1 ? H52D_Framework.BattlefieldManager.Instance.Characterlist[1].HeroList :
                H52D_Framework.BattlefieldManager.Instance.Characterlist[0].HeroList;
            if (colnum == 2)
                return;
            for (var k in monster) {
                if (monster[k]) {
                    if (monster[k].vo.colNum != colnum) {
                        var buf = new H52D_Framework.PBuff(this._buffId, this._btype, this._owner);
                        buf.Do(eBELONGS_TO.ATTACK);
                        this._buffTab.push(buf);
                        return;
                    }
                }
            }
        };
        /**直接加buff */
        PConditionsPassiveSkill.prototype.AddBuff = function () {
            var buf = new H52D_Framework.PBuff(this._buffId, this._btype, this._owner);
            buf.Do(eBELONGS_TO.ATTACK);
            this._buffTab.push(buf);
        };
        /**与基友上阵时候触发 */
        PConditionsPassiveSkill.prototype.CommonHero = function () {
            var hl = this._btype == 1 ? H52D_Framework.BattlefieldManager.Instance.Characterlist[1].HeroList :
                H52D_Framework.BattlefieldManager.Instance.Characterlist[0].HeroList;
            var Len = H52D_Framework.GetTabLength(hl);
            for (var i = 0; i < Len; i++) {
                if (hl[i]) {
                    if (hl[i].vo.id == this._heroid) {
                        var buf = new H52D_Framework.PBuff(this._buffId, this._btype, this._owner);
                        buf.Do(eBELONGS_TO.ATTACK);
                        this._buffTab.push(buf);
                        return;
                    }
                }
            }
        };
        /**攻击时触发Buff */
        PConditionsPassiveSkill.prototype.AttackTriggerSkill = function () {
            var num = Math.random() * 10000;
            if (num <= this._triggerOdds) {
                var buf = new H52D_Framework.PBuff(this._buffId, this._btype, this._owner);
                buf.Do(eBELONGS_TO.ATTACK);
                this._buffTab.push(buf);
            }
        };
        /**挨揍了触发 */
        PConditionsPassiveSkill.prototype.OnHurtTrigger = function () {
            var num = Math.random() * 10000;
            if (num <= this._triggerOdds) {
                var buf = new H52D_Framework.PBuff(this._buffId, this._btype, this._owner);
                buf.Do(eBELONGS_TO.ATTACK);
                this._buffTab.push(buf);
            }
        };
        PConditionsPassiveSkill.prototype.Destroy = function () {
            if (this._buffTab) {
                var len = this._buffTab.length;
                for (var i = 0; i < len; i++) {
                    if (this._buffTab[i]) {
                        this._buffTab[i].Destroy();
                        this._buffTab[i] = null;
                    }
                }
            }
            this._battack = false;
            this._bhurt = false;
            this._buffTab = [];
        };
        return PConditionsPassiveSkill;
    }());
    H52D_Framework.PConditionsPassiveSkill = PConditionsPassiveSkill;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PConditionsPassiveSkill.js.map