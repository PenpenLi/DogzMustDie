
module H52D_Framework {
    /**主动技能类 
     * @author zhangzhenming
     */
    export class Skill {
        public get id(): number { return this._data.id; }
        public get Data() { return this._data; };
        public get IsCD() { return this._isCd; };
        /**目标*/
        private _target: Array<any> = [];
        /**属于谁 */
        private _owner: any;
        private _data: SkillData;
        /**技能表现形式 1远程 2近战*/
        private _type: eSKill_SHOW_TYPE;
        private _isCd: boolean = false;
        private _cd: number;
        /**对象池 */
        private _pool: ObjectPool;
        private _skillNone: SkillNone;
        private _belongs: eBELONGS_TO;
        public get sType() { return this._belongs; }
        private _buff: SkillBuff;
        private _bsbuff: boolean = false;
        private _delaybufftime = 0;
        private _currenttime = 0;
        private _damage: number = 0;
        private _btype: number = -1;

        constructor(id: number, owner: any, to: eBELONGS_TO, btype = 1) {
            this._data = new SkillData(id);
            this._owner = owner;
            this._cd = 0;
            this._belongs = to;
            this._btype = btype;
            let _ViewRoot = this._data.hierarchy == 1 ? AvatarRoot : AvatarEffectRoot;

            if (!ObjIsEmpty(this._data.actionEffect)) {
                this._type = eSKill_SHOW_TYPE.NOTBALL;
                this._skillNone = new SkillNone(this._owner, this._data, _ViewRoot, this._belongs, this._btype);
            }
            if (!ObjIsEmpty(this._data.flyEffect)) {
                this._type = eSKill_SHOW_TYPE.BALLISTIC;
                this._pool = new ObjectPool(5);
                for (let i = 0; i < this._pool.MaxIndex; i++) {
                    let av: SkillObject = new SkillObject(this._owner, this._data, _ViewRoot, this._belongs, this._btype);
                    this._pool.AddNoActivePool(av);
                }
            }
            if (!ObjIsEmpty(this.Data.statusList)) {
                this._buff = new SkillBuff(this.Data.statusList, this._owner, this._btype);
            }
        }


        /*** 释放技能*/
        public SpellSkill(tar_arr: Array<any>): void {
            this._target = [];
            /**在CD中 */
            if (this._isCd && this._belongs != eBELONGS_TO.BIG) return;
            /**释放技能*/
            this._isCd = true;
            if (this._owner.type == eCharacter_TYPE.PLAYER && this.id > 199)  {
                this._cd = this.Data.skillCD + 10000;
            }
            else  {
                this._cd = this.Data.skillCD;
            }
            if (this._belongs == eBELONGS_TO.BIG && this._btype != -1) {
                Event.DispatchEvent("CaptainCd", [this._cd]);
            }
            this._target = tar_arr;
            if (!this._target) return;
            this._bsbuff = true;
            this.Select(this._type);
            this.PlaySound();
            this.SetShake();
        }

        private OnHurt(): void {
            /**伤害计算 */
            if (!ObjIsEmpty(this._data.damageList)) {
                this._damage = 0;
                let damage = 0;
                let skilldamage = new SkillDamage(this._owner, this._target, this._data.damageList);
                for (let i = 0; i < this._target.length; i++) {
                    let mon = this._target[i];
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
        }

        private PlaySound(): void {
            if (!ObjIsEmpty(this.Data.soundParam)) {
                Tick.Once(this.Data.soundParam[2], this, () => {
                    SoundManager.Instance.OnPlaySound(this.Data.soundParam[1]);
                });
            }
        }

        private Select(type: eSKill_SHOW_TYPE): void {
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
        }

        private SetShake() {
            if (!ObjIsEmpty(this._data.shake)) {
                Tick.Once(this._data.shake[2], this, () => {
                    EffectManager.Instance.StartShock(this._data.shake[1]);
                });
            }
        }

        public ClearTarget() {
            this._target = [];
        }

        public OnUpdate(): void {
            if (this._isCd) {
                this._cd -= 100;
                if (this._cd <= 0) {
                    this._isCd = false;
                }
            }
            if (this._pool) {
                for (let k in this._pool.GetActivePool) {
                    if (this._pool.GetActivePool[k] && this._pool.GetActivePool[k].BComplete) {
                        this._pool.GetActivePool[k].BComplete = false;
                        this.OnHurt();
                    }
                }
                let len = this._pool.GetActivePool.length;
                for (let i = len - 1; i >= 0; i--) {
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
            if (this._buff && this._bsbuff && !ObjIsEmpty(this.Data.damageList)) {
                this._delaybufftime += 100;
                if (this._delaybufftime >= 500) {
                    this._delaybufftime = 0;
                    this._buff.SetBuffasHave(this._damage);
                    this._bsbuff = false;
                }
            }
            else if (this._buff && this._bsbuff && ObjIsEmpty(this.Data.damageList)) {
                this._buff.SetBuffasHave(0);
                this._bsbuff = false;
            }
            if (this._buff) {
                this._buff.OnUpdate();
            }
        }

        public Destroy(): void {
            Tick.ClearAll(this);
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
        }
    }
}