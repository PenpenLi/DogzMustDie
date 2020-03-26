
module H52D_Framework {
    export class PSkill {
        public get id(): number { return this._data.id; }
        public get Data() { return this._data; };
        public get IsCD() { return this._isCd; };
        /**目标*/
        private _target: Array<any> = [];
        public get target() { return this._target; }
        public get belongs() { return this._belongs; }
        /**属于谁 */
        private _owner: any;
        private _data: SkillData;
        /**技能表现形式 1远程 2近战*/
        private _type: eSKill_SHOW_TYPE;
        private _isCd: boolean = false;
        private _cd: number = 0;
        /**对象池 */
        private _pool: ObjectPool;
        private _skillNone: PSkillNone;
        private _belongs: eBELONGS_TO;
        private _buff: PSkillBuff;
        private _bsbuff: boolean = false;
        private _delaybufftime = 0;
        private _damage: number = 0;
        private _btype: number = 0;

        constructor(id: number, owner: any, btype: number, to: eBELONGS_TO) {
            this._data = new SkillData(id);
            this._owner = owner;
            this._cd = 0;
            this._belongs = to;
            this._btype = btype;
            let viewRoot = this._data.hierarchy == 1 ? AvatarRoot : AvatarEffectRoot;
            if (!ObjIsEmpty(this._data.actionEffect)) {
                this._type = eSKill_SHOW_TYPE.NOTBALL;
                this._skillNone = new PSkillNone(this._owner, this._data, viewRoot, btype, this._belongs);
            }
            if (!ObjIsEmpty(this._data.flyEffect)) {
                this._type = eSKill_SHOW_TYPE.BALLISTIC;
                if (this._owner.type == eCharacter_TYPE.CAMP) {
                    this._pool = new ObjectPool(10);
                }
                else {
                    this._pool = new ObjectPool(5);
                }
                for (let i = 0; i < this._pool.MaxIndex; i++) {
                    let av: PSkillObject = new PSkillObject(this._owner, this._data, viewRoot, btype, this._belongs);
                    this._pool.AddNoActivePool(av);
                }
            }
            if (!ObjIsEmpty(this.Data.statusList)) {
                this._buff = new PSkillBuff(this.Data.statusList, this._owner, btype, this.belongs);
            }
        }

        /*** 释放技能*/
        public SpellSkill(tar_arr?: Array<any>): void {
            this._target = [];
            /**在CD中 */
            if (this._isCd && this.belongs != eBELONGS_TO.BIG && this._btype != 1) return;
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
            if (CustomsManager.Instance.CustomsType == Customs_Type.MatchChampion) {
                if (!MatchLogic.Instance.IsPlayerInPk() && this.belongs == eBELONGS_TO.BIG && this._btype == 1) {
                    Event.DispatchEvent("CaptainCd", [this._cd]);
                }
            }
            else if (this.belongs == eBELONGS_TO.BIG && this._btype == 1) {
                Event.DispatchEvent("CaptainCd", [this._cd]);
            }
            if (!this._target) return;
            this._bsbuff = true;
            this.Select(this._type);
            this.PlaySound();
            this.SetShake();
        }

        private OnDamage(): void {
            /**伤害计算 */
            if (!ObjIsEmpty(this._data.damageList)) {
                this._damage = 0;
                let damage = 0;
                let skilldamage = new SkillDamage(this._owner, this._target, this._data.damageList);
                for (let i = 0; i < this._target.length; i++) {
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
        }

        /**播放音效 */
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
                        if (this._owner.type == eCharacter_TYPE.CAMP) {
                            for (let i = 0; i < this._target.length; i++) {
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
        }

        /**設置震屏 */
        private SetShake() {
            if (!ObjIsEmpty(this._data.shake)) {
                Tick.Once(this._data.shake[2], this, () => {
                    EffectManager.Instance.StartShock(this._data.shake[1]);
                });
            }
        }

        public Clear() {
            this._target = [];
            if (this._skillNone) {
                this._skillNone.Clear();
            }
            if (!this._pool) return;
            if (this._pool.GetActivePool.length) {
                for (let i = this._pool.GetActivePool.length - 1; i >= 0; i--) {
                    let ob = this._pool.GetActivePool[i] as PSkillObject;
                    ob.Claer();
                }
            }
        }

        public OnUpdate(): void {
            /**技能CD */
            if (this._isCd) {
                this._cd -= 100;
                if (this._cd <= 0) {
                    this._isCd = false;
                }
            }
            this.EffectUpdate();
            this.Buff();
        }

        /**技能效果類更新 */
        private EffectUpdate() {
            if (this._pool) {
                for (let k in this._pool.GetActivePool) {
                    if (this._pool.GetActivePool[k] && this._pool.GetActivePool[k].BComplete) {
                        this._pool.GetActivePool[k].BComplete = false;
                        this.OnDamage();
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
                this.OnDamage();
            }
        }

        /**Buff更新 */
        private Buff() {
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

        /**隨機目標 */
        private RandomTarget(tar_arr) {
            this._target = [];
            for (let k = 0; k < tar_arr.length; k++) {
                if (tar_arr[k] && !tar_arr[k].IsDie) {
                    this._target.push(tar_arr[k]);
                    break;
                }
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
            this._owner = null;
            this._data = null;
            this._target = [];
        }

    }
}