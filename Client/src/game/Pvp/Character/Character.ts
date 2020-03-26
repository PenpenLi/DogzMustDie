module H52D_Framework {
    /**PVP人物 */
    export class Character {
        /**英雄的模型 */
        protected _avatar: Avatar;
        /**挂点类型*/
        public type: eCharacter_TYPE;
        protected _id: number = 0;
        protected CCTarget = [];
        /**攻击目标 */
        protected _target: Array<any> = []
        /**模型层级*/
        protected viewRoot: Laya.Box;
        protected _dataVo: any;
        private _order: number = 0;
        /**漂字类型 */
        public SE: SkinEnum;
        protected _PosX: number = 0;
        protected _PosY: number = 0;
        protected _attackskill: PSkill;
        /**队长技能 */
        protected _captainSkill: PSkill;
        /**被动技能列表 */
        protected _passiveSkillList: Array<PConditionsPassiveSkill> = [];
        /**出生特效 */
        protected _brithAvatar: Avatar;
        protected _bClose: boolean = true;
        protected _currentHp: number = 0;
        protected _btype: number = 1;
        public CaptainTarget: Array<PHeroCrad> = [];
        public IsDie = false;
        protected bAttack: boolean = false;
        public get ID() { return this._id; }
        /**攻击目标 */
        public set Target(value: Array<any>) { this._target = value; }
        public get Target() { return this._target; }
        public get avatar(): Avatar { return this._avatar; }
        /**数据模型*/
        public get vo() { return this._dataVo; }
        /**人物层级 */
        public get Order() { return this._order; }
        /**设置人物层级 */
        protected SetOrderZ(i: number) {
            this._order = i;
            this._avatar.SetOrder(i);
        }
        /**人物位置Y坐标 */
        public get PosY() { return this._PosY; }
        /**人物位置X坐标 */
        public get PosX() { return this._PosX; }
        /**是否关闭战斗 */
        public get BClose() { return this._bClose; }
        public set BClose(Value: any) { this._bClose = Value; }
        protected _bcaptain: boolean = false;
        public get bCaptain() { return this._bcaptain; }
        public get attackSkill() { return this._attackskill; }
        protected _target_a: Formation = null;
        /**初始化 */
        constructor(btype: number, bbool?: boolean) {
            this._btype = btype;
            this._bcaptain = false;
            this._target_a = new Formation();
        }

        protected setCurrentHp(value: number) {
            this._currentHp = value;
        }

        /**初始化英雄技能 */
        protected InitSkill() {
            /**初始化英雄普攻 */
            this._attackskill = new PSkill(this.vo.skillid[0], this, this._btype, eBELONGS_TO.ATTACK);
            /**是队长就初始化队长技能 */
            if (this.vo.location == 4) {
                this._bcaptain = true;
                this._captainSkill = new PSkill(this.vo.skillid[1], this, this._btype, eBELONGS_TO.BIG);
            }
        }

        /**获取当前动画时间 */
        public GetAniDuration(): number {
            return this._avatar.GetAniDuration();
        }

        /**出生特效 */
        protected ChangeEffect(): void {
            let oldScale = this.vo.Scla;
            this._avatar.scale = 0;
            TweenList.to(this, this._avatar, { scale: oldScale }, 250, () => {
                if (!this._avatar) return;
                this._avatar.scale = oldScale
            });
            SoundManager.Instance.OnPlaySound("res/sound/boss_appear2.mp3");
            if (this._brithAvatar) {
                this._brithAvatar.Play("effect_state_qiehuan", false);
            }
            else {
                this._brithAvatar = new Avatar(AvatarEffectRoot);
                this._brithAvatar.Load("res/effect/effect_state_qiehuan/effect_state_qiehuan.sk", 1, 0.4,
                    this.PosX, this.PosY - 78, Laya.Handler.create(this, () => {
                        this._brithAvatar.Play("effect_state_qiehuan", false);
                    }));
            }
        }

        /**释放队长技能 */
        protected SpellCaptainSkill(): void {

        }

        /**普通攻击 */
        public SpellAttackSkill(): void {
            if (!this._target || !this._attackskill) return;
            this.bAttack = true;
            this._avatar.Play(AnimationName.attack, false, true, () => {
                this.bAttack = false;
                this.Idle();
            });
            this._attackskill.SpellSkill(this._target);
        }

        /** 待机 */
        public Idle(): void {
            if (!this._avatar) return;
            this._avatar.Play(AnimationName.idle, true);
        }

        /** 被击 */
        private Hit(): void {
            if (!this._avatar || this.bAttack || this.IsDie) return;
            this._avatar.Play(AnimationName.hit, false, true, () => {
                this.Idle()
            });
        }

        /** 死亡 */
        private Die(): void {
            if (!this._avatar) return;
            this._avatar.Play(AnimationName.die, false, true, () => {
                this.Destroy();
            });
        }

        /** 受伤 */
        public OnHurt(be, owr, damage: number, e: SkinEnum, iscrit: boolean, type?: SPECIAL_TYPE, viewRoot?: Laya.Box): void {
            if ((this._currentHp <= 0) || this.IsDie || this._avatar == null) {
                return;
            }
            if (type != SPECIAL_TYPE.SUSRAINED) {
                this.Hit();
            }
            Floating.DamageText(damage.toString(), e, this.PosX, this.PosY - 100, iscrit);
            this.setCurrentHp(this._currentHp - damage);
            let Bbji = "";
            if (iscrit) {
                Bbji = "暴击"
            }
            else {
                Bbji = " "
            }
            let str = "";
            let oloc = 0;
            if (!owr.vo) return;
            if (owr.vo && owr.vo.location) {
                oloc = owr.vo.location + 1;
            }
            let eloc = this.vo.location + 1;
            let dtype = "普攻";
            if (be == eBELONGS_TO.BIG) {
                dtype = " 队长技能"
            }
            if (this._btype == 1) {
                str = "敌方【" + oloc + "】位置 [" + owr.vo.name + "]" + "使用【" + dtype + "】对我方【" +
                    eloc + "】位置 [" + this.vo.name + "] 造成 " + Bbji + damage.toString() + " 伤害";
            }
            else {
                str = "我方【" + oloc + "】位置 [" + owr.vo.name + "] " + "使用【" + dtype + "】对敌方【" +
                    eloc + "】位置 [" + this.vo.name + "] 造成 " + Bbji + damage.toString() + " 伤害";
            }
            DamageShow.Instance.SetText(str);
        }

        public ImValue() {
            let attr = this.vo.attr as Attribute;
            let jm = attr.GetAttributeTypeValue(21, eValueType.Percent);
            let a = attr.GetAttributeTypeValue(22, eValueType.Percent);
            let d = attr.GetAttributeTypeValue(23, eValueType.Percent);
            let aa = attr.GetAttributeTypeValue(24, eValueType.Percent);
            let pet = attr.GetAttributeTypeValue(25, eValueType.Percent);
            let camp = attr.GetAttributeTypeValue(26, eValueType.Percent);
            let alld = attr.GetAttributeTypeValue(27, eValueType.Percent);
            let aj = attr.GetAttributeTypeValue(2, eValueType.Percent);
            
            let bjm = attr.GetAttributeTypeValue(21, eValueType.BPercent);
            let ba = attr.GetAttributeTypeValue(22, eValueType.BPercent);
            let bd = attr.GetAttributeTypeValue(23, eValueType.BPercent);
            let baa = attr.GetAttributeTypeValue(24, eValueType.BPercent);
            let bpet = attr.GetAttributeTypeValue(25, eValueType.BPercent);
            let bcamp = attr.GetAttributeTypeValue(26, eValueType.BPercent);
            let balld = attr.GetAttributeTypeValue(27, eValueType.BPercent);

            let dstr = "";
            if (this._btype == 1) {
                dstr = "O_"
            }
            else {
                dstr = "E_"
            }
            let damage = attr.GetAttributeValue(2);
            let basedamage = attr.GetAttributeTypeValue(2, eValueType.Base);
            let hpp = attr.GetAttributeValue(1);
            let lc = this.vo.location + 1;
            let CJM = jm+bjm; let AJM = a +ba; let DJM = d+bd; let ALLHJM = aa+baa;let PETJM = pet + bpet;
            let CAMPJM = camp +bcamp; let ALLJM = alld + balld;
            let sttt = "[" + lc + "]_" + "<" + dstr + this.vo.name + ">_";
            let str = "点击减免_" + CJM + " 攻击型减免_" + AJM + " 防御型减免_" + DJM + " 所有英雄减免_" + ALLHJM;
            let str2 = "宠物减免_" + PETJM + " 阵营减免_" + CAMPJM + " 所有伤害减免_" + ALLJM;
            let strj = "伤害加成_" + aj;

            DamageShow.Instance.SetText(sttt);
            DamageShow.Instance.SetText(str);
            DamageShow.Instance.SetText(str2);
            DamageShow.Instance.SetText(strj);
            if (this.type == eCharacter_TYPE.PET || this.type == eCharacter_TYPE.CAMP) {
                // damage = damage * this.vo.ratio >>0;
                basedamage = basedamage * this.vo.ratio >> 0;
            }
            DamageShow.Instance.SetText(
                " 基础伤害 " + "<" + basedamage + ">" +
                " 面板血量 " + "<" + hpp + ">");
        }

        /**攻击触发Buff */
        protected AttackTriggerConditions() {
            for (let i = 0; i < this._passiveSkillList.length; i++) {
                if (this._passiveSkillList[i]) {
                    if (this._passiveSkillList[i].BAttack) {
                        this._passiveSkillList[i].AttackTriggerSkill();
                    }
                }
            }
        }

        /**被攻击触发Buff */
        protected OnHurtTriggerConditions() {
            for (let i = 0; i < this._passiveSkillList.length; i++) {
                if (this._passiveSkillList[i]) {
                    if (this._passiveSkillList[i].BHurt) {
                        this._passiveSkillList[i].OnHurtTrigger();
                    }
                }
            }
        }

        /**更新函数 */
        public OnUpdate(): void {
            if (this.IsDie || this.BClose) return;
            if (this._attackskill) {
                this._attackskill.OnUpdate();
                if (!this._attackskill.IsCD && this._target.length > 0) {
                    this.SpellAttackSkill();
                }
            }
            if (this._captainSkill && this._btype == -1) {
                if (!this._captainSkill.IsCD && this.CaptainTarget.length > 0 && !this.IsDie) {
                    this.SpellCaptainSkill();
                }
            }
            if (this._captainSkill)  {
                this._captainSkill.OnUpdate();
            }
            if (this.TargetIsNull()) {
                this._target = [];
            }
            if (this._currentHp <= 0) {
                if (!this.IsDie) {
                    this.IsDie = true;
                    this.Die();
                }
            }
        }

        /**判断目标是不是空 */
        protected TargetIsNull(): boolean {
            for (let i = 0; i < this._target.length; i++) {
                if (this._target[i]) {
                    if (!this._target[i].IsDie) {
                        return false;
                    }
                }
            }
            return true;
        }

        /**清理目标 */
        public ClearTarget(): void {
            /**普攻目标清理 */
            if (this._attackskill) {
                this._attackskill.Clear();
            }
            /**队长技能目标清理 */
            if (this._captainSkill) {
                this._captainSkill.Clear();
            }
            if (this._target) {
                this._target = [];
            }
            this.CaptainTarget = [];
        }

        public DestroyPassive(): void {
            let Len = this._passiveSkillList.length
            for (let i = 0; i < Len; i++) {
                if (this._passiveSkillList[i]) {
                    this._passiveSkillList[i].Destroy();
                    this._passiveSkillList[i] = null;
                }
            }
            this._passiveSkillList = [];
        }


        /**销毁 */
        public Destroy(): void {
            this.ClearTarget();
            this.DestroyPassive();
            if (this._avatar) {
                this._avatar.Destroy();
                this._avatar = null;
            }
            if (this._attackskill) {
                this._attackskill.Destroy();
                this._attackskill = null;
            }
            if (this._captainSkill) {
                this._captainSkill.Destroy();
                this._captainSkill = null;
            }
            if (this._brithAvatar) {
                this._brithAvatar.Destroy();
                this._brithAvatar = null;
            }
        }

    }
}