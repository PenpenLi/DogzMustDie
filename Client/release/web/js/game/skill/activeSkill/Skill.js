var H52D_Framework;
(function (H52D_Framework) {
    /**主动技能类
     * @author zhangzhenming
     */
    var Skill = /** @class */ (function () {
        function Skill(id, owner, to, btype) {
            if (btype === void 0) { btype = 1; }
            /**目标*/
            this._target = [];
            this._isCd = false;
            this._bsbuff = false;
            this._delaybufftime = 0;
            this._currenttime = 0;
            this._damage = 0;
            this._btype = -1;
            this._data = new H52D_Framework.SkillData(id);
            this._owner = owner;
            this._cd = 0;
            this._belongs = to;
            this._btype = btype;
            var _ViewRoot = this._data.hierarchy == 1 ? H52D_Framework.AvatarRoot : H52D_Framework.AvatarEffectRoot;
            if (!H52D_Framework.ObjIsEmpty(this._data.actionEffect)) {
                this._type = eSKill_SHOW_TYPE.NOTBALL;
                this._skillNone = new H52D_Framework.SkillNone(this._owner, this._data, _ViewRoot, this._belongs, this._btype);
            }
            if (!H52D_Framework.ObjIsEmpty(this._data.flyEffect)) {
                this._type = eSKill_SHOW_TYPE.BALLISTIC;
                this._pool = new H52D_Framework.ObjectPool(5);
                for (var i = 0; i < this._pool.MaxIndex; i++) {
                    var av = new H52D_Framework.SkillObject(this._owner, this._data, _ViewRoot, this._belongs, this._btype);
                    this._pool.AddNoActivePool(av);
                }
            }
            if (!H52D_Framework.ObjIsEmpty(this.Data.statusList)) {
                this._buff = new H52D_Framework.SkillBuff(this.Data.statusList, this._owner, this._btype);
            }
        }
        Object.defineProperty(Skill.prototype, "id", {
            get: function () { return this._data.id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Skill.prototype, "Data", {
            get: function () { return this._data; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Skill.prototype, "IsCD", {
            get: function () { return this._isCd; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Skill.prototype, "sType", {
            get: function () { return this._belongs; },
            enumerable: true,
            configurable: true
        });
        /*** 释放技能*/
        Skill.prototype.SpellSkill = function (tar_arr) {
            this._target = [];
            /**在CD中 */
            if (this._isCd && this._belongs != eBELONGS_TO.BIG)
                return;
            /**释放技能*/
            this._isCd = true;
            if (this._owner.type == eCharacter_TYPE.PLAYER && this.id > 199) {
                this._cd = this.Data.skillCD + 10000;
            }
            else {
                this._cd = this.Data.skillCD;
            }
            if (this._belongs == eBELONGS_TO.BIG && this._btype != -1) {
                H52D_Framework.Event.DispatchEvent("CaptainCd", [this._cd]);
            }
            this._target = tar_arr;
            if (!this._target)
                return;
            this._bsbuff = true;
            this.Select(this._type);
            this.PlaySound();
            this.SetShake();
        };
        Skill.prototype.OnHurt = function () {
            /**伤害计算 */
            if (!H52D_Framework.ObjIsEmpty(this._data.damageList)) {
                this._damage = 0;
                var damage = 0;
                var skilldamage = new H52D_Framework.SkillDamage(this._owner, this._target, this._data.damageList);
                for (var i = 0; i < this._target.length; i++) {
                    var mon = this._target[i];
                    if (mon) {
                        this._damage = skilldamage.ComputeDamageN(mon) + this._data.fixedDamage;
                        if (mon.vo.allDamgeReduction != -1)
                            this._damage = this._damage * mon.vo.allDamgeReduction >> 0;
                        mon.OnHurt(this._damage, this._owner.SE, skilldamage.bCrit);
                    }
                }
                if (skilldamage.bCrit) {
                    if (this._buff)
                        this._buff.SetBuffasCrit(this._damage);
                }
            }
        };
        Skill.prototype.PlaySound = function () {
            var _this = this;
            if (!H52D_Framework.ObjIsEmpty(this.Data.soundParam)) {
                H52D_Framework.Tick.Once(this.Data.soundParam[2], this, function () {
                    H52D_Framework.SoundManager.Instance.OnPlaySound(_this.Data.soundParam[1]);
                });
            }
        };
        Skill.prototype.Select = function (type) {
            switch (type) {
                case eSKill_SHOW_TYPE.BALLISTIC:
                    if (this._pool.GetPoolElement()) {
                        this._pool.GetPoolElement().Spell(this._target[0]);
                    }
                    break;
                case eSKill_SHOW_TYPE.NOTBALL:
                    this._skillNone.SpellSkill(this._target);
                    break;
            }
        };
        Skill.prototype.SetShake = function () {
            var _this = this;
            if (!H52D_Framework.ObjIsEmpty(this._data.shake)) {
                H52D_Framework.Tick.Once(this._data.shake[2], this, function () {
                    H52D_Framework.EffectManager.Instance.StartShock(_this._data.shake[1]);
                });
            }
        };
        Skill.prototype.ClearTarget = function () {
            this._target = [];
        };
        Skill.prototype.OnUpdate = function () {
            if (this._isCd) {
                this._cd -= 100;
                if (this._cd <= 0) {
                    this._isCd = false;
                }
            }
            if (this._pool) {
                for (var k in this._pool.GetActivePool) {
                    if (this._pool.GetActivePool[k] && this._pool.GetActivePool[k].BComplete) {
                        this._pool.GetActivePool[k].BComplete = false;
                        this.OnHurt();
                    }
                }
                var len = this._pool.GetActivePool.length;
                for (var i = len - 1; i >= 0; i--) {
                    if (this._pool.GetActivePool[i]) {
                        if (this._pool.GetActivePool[i].isdestroy) {
                            this._pool.GetActivePool[i].Hidden();
                            this._pool.AddNoActivePool(this._pool.GetActivePool[i]);
                            this._pool.GetActivePool.splice(i, 1);
                        }
                    }
                }
            }
            if (this._skillNone && this._skillNone.BComplete) {
                this._skillNone.BComplete = false;
                this.OnHurt();
            }
            if (this._buff && this._bsbuff && !H52D_Framework.ObjIsEmpty(this.Data.damageList)) {
                this._delaybufftime += 100;
                if (this._delaybufftime >= 500) {
                    this._delaybufftime = 0;
                    this._buff.SetBuffasHave(this._damage);
                    this._bsbuff = false;
                }
            }
            else if (this._buff && this._bsbuff && H52D_Framework.ObjIsEmpty(this.Data.damageList)) {
                this._buff.SetBuffasHave(0);
                this._bsbuff = false;
            }
            if (this._buff) {
                this._buff.OnUpdate();
            }
        };
        Skill.prototype.Destroy = function () {
            H52D_Framework.Tick.ClearAll(this);
            if (this._buff) {
                this._buff.Destroy();
                this._buff = null;
            }
            if (this._skillNone) {
                this._skillNone.Destroy();
                this._skillNone = null;
            }
            if (this._pool) {
                this._pool.Destroy();
                this._pool = null;
            }
            // this.Currentbuttle = [];
            // this._owner = null;
            // this._data = null;
            // this._target_a = null;
            // this._target = [];
        };
        return Skill;
    }());
    H52D_Framework.Skill = Skill;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Skill.js.map