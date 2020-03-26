var H52D_Framework;
(function (H52D_Framework) {
    /**条件被动技能 */
    var ConditionsPassiveSkill = /** @class */ (function () {
        function ConditionsPassiveSkill(id, owner) {
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
            this._owner = owner;
            this._data = new H52D_Framework.PassiveSkillData(id);
            this.id = id;
            this._buffTab = [];
            this.initParmae();
        }
        Object.defineProperty(ConditionsPassiveSkill.prototype, "BHurt", {
            get: function () { return this._bhurt; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConditionsPassiveSkill.prototype, "BAttack", {
            get: function () { return this._battack; },
            enumerable: true,
            configurable: true
        });
        ConditionsPassiveSkill.prototype.initParmae = function () {
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
        };
        ConditionsPassiveSkill.prototype.Do = function () {
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
        ConditionsPassiveSkill.prototype.TNotHeroAddBuff = function () {
            var colnum = this._owner.vo.colNum;
            var monster = H52D_Framework.MonsterManager.Instance.monsterList;
            if (colnum == 2)
                return;
            for (var k in monster) {
                var m = monster[k];
                if (monster[k]) {
                    if (m.vo.colNum != colnum) {
                        var buf = new H52D_Framework.Buff(this._buffId, this._owner);
                        buf.Do();
                        this._buffTab.push(buf);
                        return;
                    }
                }
            }
        };
        /**直接加buff */
        ConditionsPassiveSkill.prototype.AddBuff = function () {
            var buf = new H52D_Framework.Buff(this._buffId, this._owner);
            buf.Do();
            this._buffTab.push(buf);
        };
        /**与基友上阵时候触发 */
        ConditionsPassiveSkill.prototype.CommonHero = function () {
            if (!H52D_Framework.BattleManager.Instance.HeroCardMgr)
                return;
            var hl = H52D_Framework.BattleManager.Instance.HeroCardMgr.CHeroList;
            var Len = H52D_Framework.GetTabLength(hl);
            for (var i = 0; i < Len; i++) {
                if (hl[i]) {
                    if (hl[i].vo.nHeroID == this._heroid) {
                        var buf = new H52D_Framework.Buff(this._buffId, this._owner);
                        buf.Do();
                        this._buffTab.push(buf);
                        return;
                    }
                }
            }
        };
        /**攻击时触发Buff */
        ConditionsPassiveSkill.prototype.AttackTriggerSkill = function () {
            var num = Math.random() * 10000;
            if (num <= this._triggerOdds) {
                var buf = new H52D_Framework.Buff(this._buffId, this._owner);
                buf.Do();
                this._buffTab.push(buf);
            }
        };
        /**挨揍了触发 */
        ConditionsPassiveSkill.prototype.OnHurtTrigger = function () {
            var num = Math.random() * 10000;
            if (num <= this._triggerOdds) {
                var buf = new H52D_Framework.Buff(this._buffId, this._owner);
                buf.Do();
                this._buffTab.push(buf);
            }
        };
        ConditionsPassiveSkill.prototype.Destroy = function () {
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
        return ConditionsPassiveSkill;
    }());
    H52D_Framework.ConditionsPassiveSkill = ConditionsPassiveSkill;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ConditionsPassiveSkill.js.map