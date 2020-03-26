var H52D_Framework;
(function (H52D_Framework) {
    var PSkill = /** @class */ (function () {
        function PSkill(id, owner, btype, to) {
            /**目标*/
            this._target = [];
            this._isCd = false;
            this._cd = 0;
            this._bsbuff = false;
            this._delaybufftime = 0;
            this._damage = 0;
            this._btype = 0;
            this._data = new H52D_Framework.SkillData(id);
            this._owner = owner;
            this._cd = 0;
            this._belongs = to;
            this._btype = btype;
            var viewRoot = this._data.hierarchy == 1 ? H52D_Framework.AvatarRoot : H52D_Framework.AvatarEffectRoot;
            if (!H52D_Framework.ObjIsEmpty(this._data.actionEffect)) {
                this._type = eSKill_SHOW_TYPE.NOTBALL;
                this._skillNone = new H52D_Framework.PSkillNone(this._owner, this._data, viewRoot, btype, this._belongs);
            }
            if (!H52D_Framework.ObjIsEmpty(this._data.flyEffect)) {
                this._type = eSKill_SHOW_TYPE.BALLISTIC;
                if (this._owner.type == eCharacter_TYPE.CAMP) {
                    this._pool = new H52D_Framework.ObjectPool(10);
                }
                else {
                    this._pool = new H52D_Framework.ObjectPool(5);
                }
                for (var i = 0; i < this._pool.MaxIndex; i++) {
                    var av = new H52D_Framework.PSkillObject(this._owner, this._data, viewRoot, btype, this._belongs);
                    this._pool.AddNoActivePool(av);
                }
            }
            if (!H52D_Framework.ObjIsEmpty(this.Data.statusList)) {
                this._buff = new H52D_Framework.PSkillBuff(this.Data.statusList, this._owner, btype, this.belongs);
            }
        }
        Object.defineProperty(PSkill.prototype, "id", {
            get: function () { return this._data.id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PSkill.prototype, "Data", {
            get: function () { return this._data; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(PSkill.prototype, "IsCD", {
            get: function () { return this._isCd; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(PSkill.prototype, "target", {
            get: function () { return this._target; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PSkill.prototype, "belongs", {
            get: function () { return this._belongs; },
            enumerable: true,
            configurable: true
        });
        /*** 释放技能*/
        PSkill.prototype.SpellSkill = function (tar_arr) {
            this._target = [];
            /**在CD中 */
            if (this._isCd && this.belongs != eBELONGS_TO.BIG && this._btype != 1)
                return;
            /**释放技能*/
            this._isCd = true;
            if (this._owner.type == eCharacter_TYPE.PLAYER && this.id > 199) {
                this._cd = this.Data.skillCD + 10000;
            }
            else {
                this._cd = this.Data.skillCD;
            }
            if (this._owner.type == eCharacter_TYPE.PET) {
                this.RandomTarget(tar_arr);
            }
            else {
                this._target = tar_arr;
            }
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.MatchChampion) {
                if (!H52D_Framework.MatchLogic.Instance.IsPlayerInPk() && this.belongs == eBELONGS_TO.BIG && this._btype == 1) {
                    H52D_Framework.Event.DispatchEvent("CaptainCd", [this._cd]);
                }
            }
            else if (this.belongs == eBELONGS_TO.BIG && this._btype == 1) {
                H52D_Framework.Event.DispatchEvent("CaptainCd", [this._cd]);
            }
            if (!this._target)
                return;
            this._bsbuff = true;
            this.Select(this._type);
            this.PlaySound();
            this.SetShake();
        };
        PSkill.prototype.OnDamage = function () {
            /**伤害计算 */
            if (!H52D_Framework.ObjIsEmpty(this._data.damageList)) {
                this._damage = 0;
                var damage = 0;
                var skilldamage = new H52D_Framework.SkillDamage(this._owner, this._target, this._data.damageList);
                for (var i = 0; i < this._target.length; i++) {
                    if (this._target[i]) {
                        this._damage = skilldamage.ComputeDamage(this._target[i]) + this._data.fixedDamage >> 0;
                        // this._damage = 1;
                        this._target[i].OnHurt(this._belongs, this._owner, this._damage, this._owner.SE, skilldamage.bCrit);
                    }
                }
                if (skilldamage.bCrit) {
                    if (this._buff)
                        this._buff.SetBuffasCrit(this._damage);
                }
            }
        };
        /**播放音效 */
        PSkill.prototype.PlaySound = function () {
            var _this = this;
            if (!H52D_Framework.ObjIsEmpty(this.Data.soundParam)) {
                H52D_Framework.Tick.Once(this.Data.soundParam[2], this, function () {
                    H52D_Framework.SoundManager.Instance.OnPlaySound(_this.Data.soundParam[1]);
                });
            }
        };
        PSkill.prototype.Select = function (type) {
            switch (type) {
                case eSKill_SHOW_TYPE.BALLISTIC:
                    if (this._pool.GetPoolElement()) {
                        if (this._owner.type == eCharacter_TYPE.CAMP) {
                            for (var i = 0; i < this._target.length; i++) {
                                if (this._target[i]) {
                                    this._pool.GetPoolElement().Spell(this._target[i]);
                                    break;
                                }
                            }
                        }
                        else {
                            this._pool.GetPoolElement().Spell(this._target[0]);
                        }
                    }
                    break;
                case eSKill_SHOW_TYPE.NOTBALL:
                    this._skillNone.SpellSkill(this._target);
                    break;
            }
        };
        /**設置震屏 */
        PSkill.prototype.SetShake = function () {
            var _this = this;
            if (!H52D_Framework.ObjIsEmpty(this._data.shake)) {
                H52D_Framework.Tick.Once(this._data.shake[2], this, function () {
                    H52D_Framework.EffectManager.Instance.StartShock(_this._data.shake[1]);
                });
            }
        };
        PSkill.prototype.Clear = function () {
            this._target = [];
            if (this._skillNone) {
                this._skillNone.Clear();
            }
            if (!this._pool)
                return;
            if (this._pool.GetActivePool.length) {
                for (var i = this._pool.GetActivePool.length - 1; i >= 0; i--) {
                    var ob = this._pool.GetActivePool[i];
                    ob.Claer();
                }
            }
        };
        PSkill.prototype.OnUpdate = function () {
            /**技能CD */
            if (this._isCd) {
                this._cd -= 100;
                if (this._cd <= 0) {
                    this._isCd = false;
                }
            }
            this.EffectUpdate();
            this.Buff();
        };
        /**技能效果類更新 */
        PSkill.prototype.EffectUpdate = function () {
            if (this._pool) {
                for (var k in this._pool.GetActivePool) {
                    if (this._pool.GetActivePool[k] && this._pool.GetActivePool[k].BComplete) {
                        this._pool.GetActivePool[k].BComplete = false;
                        this.OnDamage();
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
                this.OnDamage();
            }
        };
        /**Buff更新 */
        PSkill.prototype.Buff = function () {
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
        /**隨機目標 */
        PSkill.prototype.RandomTarget = function (tar_arr) {
            this._target = [];
            for (var k = 0; k < tar_arr.length; k++) {
                if (tar_arr[k] && !tar_arr[k].IsDie) {
                    this._target.push(tar_arr[k]);
                    break;
                }
            }
        };
        PSkill.prototype.Destroy = function () {
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
            this._owner = null;
            this._data = null;
            this._target = [];
        };
        return PSkill;
    }());
    H52D_Framework.PSkill = PSkill;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PSkill.js.map