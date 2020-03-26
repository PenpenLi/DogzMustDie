/**
 * 战斗英雄实例
 */
module H52D_Framework {
    export class HeroCard extends Entity {
        /**队长技能 */
        private _captainSkill: Skill = null;
        /**被动技能列表 */
        private _passiveSkillList: Array<ConditionsPassiveSkill> = [];
        private _bAttack: boolean = false;
        private _isPlayAttackDown: boolean = false;
        
        private bbool = false;

        /**初始化 */
        constructor(vo: HeroInfo, viewRoot?: Laya.Box, bbool?: boolean, ) {
            super(viewRoot);
            this._dataVo = vo;
            this.SE = SkinEnum.SkinHero;
            this.type = vo.HeroType == 1 ? eCharacter_TYPE.AHERO : eCharacter_TYPE.DHERO;
            this.vo.onlockpassive = Laya.Handler.create(this, this.OnlockPassive, [], false);
            this.bbool = bbool;
            this.bloodMax = vo.attr.GetAttributeValue(1);
            /**如果是队长就启动 队长技能事件 */
            if (this._dataVo.location == 4) {
                Event.RegistEvent(EventDefine.CAPATIAN_SKILL, Laya.Handler.create(this, this.SpellCaptainSkill));
            }
            this.vo.SetToSpeed();
            this.vo.SetColOrow();
        }

        /** 血条 */
        // private heroBlood: HeroBloodView;
        // private bloodMax: number;
        // public set currentHp(value: number) {
        //     if(!value){
        //         value = 0;
        //     }
        //     this._currentHp = value;
        //     if (this.heroBlood){
        //         this.heroBlood.proportion = this._currentHp / this.bloodMax;
        //     }
        // }
        // public get currentHp(): number {
        //     return this._currentHp;
        // }

        /**
         * 加载英雄模型
         * @param dir:方向
         * @param scale:缩放比例
         * @param xy: 位置
         * @param order: 层级
         * @param blood: 血条
         * @param callback:回调函数
         **/
        public LoadMoudle(dir: number, scale: number, x: number, y: number,
            order: number, blood: boolean = false, callback: Laya.Handler = null): void {
            this._id = this._dataVo.nHeroID;
            this._PosX = x;
            this._PosY = y;
            this.currentHp = this._dataVo.attr.GetAttributeValue(1);
            /**加载模型 */
            this._avatar = new Avatar(this.viewRoot);
            this._avatar.Load(
                this.vo.ModlePath, dir, scale, x, y, Laya.Handler.create(this, (_avatar) => {
                    this.LoadPassive();
                    this.InitSkill();
                    if (CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                        this.heroBlood = new HeroBloodView();
                        this.heroBlood.x = this._avatar.PosX - 25;
                        this.heroBlood.y = this._avatar.PosY - 120;
                        AvatarEffectRoot.addChild(this.heroBlood);
                    }
                    /**设置阴影 */
                    _avatar.Shadow(1, true);
                    _avatar.visible = true;
                    /**设置人物层级 */
                    this._order = this.vo.colNum;
                    _avatar.SetOrder(this.vo.colNum);
                    this.Idle();
                    if (callback)
                        callback.run();
                }));
        }

        private LoadPassive() {
            this._passiveSkillList = [];
            for (let i = 0; i < this.vo.conditionsID.length; i++) {
                let pas = new ConditionsPassiveSkill(this.vo.conditionsID[i], this);
                this._passiveSkillList.push(pas);
            }
        }

        /**条件类被动技能生效 */
        public OnEffectPassive(): void {
            for (let i = 0; i < this._passiveSkillList.length; i++) {
                if (this._passiveSkillList[i]) {
                    this._passiveSkillList[i].Do();
                }
            }
        }

        /**解锁条件被动技能 */
        public OnlockPassive() {
            let clen = this.vo.OnPassiveID.length;
            if (clen == 0) return;
            let id = this.vo.OnPassiveID[clen - 1];
            let type_id = PassiveSkillConfig[id]["scriptID"];
            if (type_id != 1) {
                let pas = new ConditionsPassiveSkill(id, this);
                pas.Do();
                this._passiveSkillList.push(pas);
            }
            this.OnEffectPassive();
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

        /** 受伤 */
        public OnHurt(damage: number, e: SkinEnum, iscrit: boolean, type?: SPECIAL_TYPE, viewRoot?: Laya.Box): void {
            if (type != SPECIAL_TYPE.SUSRAINED) {
                this.Hit();
            }
            if (damage <= 0) damage = 1;
            Floating.DamageText(damage.toString(), e, this.PosX, this.PosY, iscrit);
            this.currentHp -= damage;
            if (CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                BattleManager.hitNum += 1;
            }
            this.OnHurtTriggerConditions();
        }

        /**出生特效 */
        public ChangeEffect(): void {
            // SoundManager.Instance.playSound("res/sound/boss_appear.mp3", 1);
            if (this._brithAvatar) {
                this._brithAvatar.Play("effect_state_appear", false);
            }
            else {
                this._brithAvatar = new Avatar(AvatarEffectRoot)
                this._brithAvatar.Load("res/effect/effect_state_appear/effect_state_appear.sk", 1, 1,
                    this.PosX, this.PosY - 175, Laya.Handler.create(this, () => {
                        this._brithAvatar.Play("effect_state_appear", false);
                    }));
            }
        }

        /**普通攻击 */
        public Attack(): void {
            if (!this._target || !this._attackskill) return;
            this._isPlayAttackDown = false;
            this._bAttack = true;
            this._avatar.Play(AnimationName.attack, false, true, () => {
                this._bAttack = false;
                this._isPlayAttackDown = true;
                this.Idle();
            });
            this._attackskill.SpellSkill(this._target);
            this.AttackTriggerConditions();
            BattleManager.Instance.heroAttackNum++;
        }

        public SkillUpdate() {
            if (this._attackskill)
                this._attackskill.OnUpdate();
            if (this._captainSkill)
                this._captainSkill.OnUpdate();
        }
        private _IsDie = false;
        public get IsDie() { return this._IsDie; }
        /**更新函数 */
        public OnUpdate(): void {
            if (this._IsDie) return;
            super.OnUpdate();
            this.SkillUpdate();
            if (!this._target || this.Close) return;
            if (this._attackskill) {
                if (!this._attackskill.IsCD) {
                    this.Attack();
                }
            }
            if (this.currentHp <= 0) {
                if (!this._IsDie) {
                    this._IsDie = true;
                    Event.DispatchEvent("DestryBuffById",this.ID);
                    this.Die();
                }
            }
        }

        /**清理目标 */
        public ClearTarget(): void {
            super.ClearTarget();
            /**队长技能目标清理 */
            if (this._captainSkill) {
                this._captainSkill.ClearTarget();
            }
        }

        /**初始化英雄技能 */
        private InitSkill() {
            /**初始化英雄普攻 */
            this._attackskill = new Skill(this.vo.skillid[0], this, eBELONGS_TO.ATTACK);
            /**是队长就初始化队长技能 */
            if (this.vo.location == 4) {
                this._captainSkill = new Skill(this.vo.skillid[1], this, eBELONGS_TO.BIG);
                let icon = "ui_icon/" + ActiveSkillConfig[this.vo.skillid[1]]["strIcon"];
                Event.DispatchEvent("CaptainSkillInit", [icon]);
            }
        }

        /**释放队长技能 */
        private SpellCaptainSkill(): void {
            // 如果目标是空则不自动放技能
            if (this.TargetIsNull()) {
                return
            }
            if(CustomsManager.Instance.CustomsType == Customs_Type.MatchElection && BattleManager.Instance.MathcEnd) return;
            this._captainSkill.SpellSkill(this.Target);
            this.CaptainEffct();
            Tick.Once(200, this, () => {
                this.CaptainEffct_Z();
                let name = SkillName[this.vo.skillid[1]];
                Floating.SkillNameText(name, this.PosX, this.PosY - 130);
            });
        }
        /**脚底队长技能特效 */
        private CaptainEffct() {
            let avatar = new Avatar(AvatarEffectRoot)
            avatar.Load(EffectDefine.shifa, 1, 1, this.PosX + 5, this.PosY - 75, Laya.Handler.create(this, () => {
                avatar.Play("effect_state_shifa", false, true, () => {
                    avatar.Destroy();
                    avatar = null;
                });
            }));
        }
        /**头顶队长技能特效 */
        private CaptainEffct_Z() {
            let avatar = new Avatar(AvatarEffectRoot)
            avatar.Load("res/effect/effect_state_shifa2/effect_state_shifa2.sk", 1, 1, this.PosX, this.PosY - 160,
                Laya.Handler.create(this, () => {
                    if (!avatar || !avatar.Armature) return;
                    avatar.Armature.alpha = 0;
                    avatar.Play("effect_state_shifa2", true, true, () => {
                    });
                    TweenList.to(this, avatar.Armature, { alpha: 1 }, 200, () => {
                        Tick.Once(700, this, () => {
                            if (!avatar) return;
                            if (!avatar.Armature) return;
                            TweenList.to(this, avatar.Armature, { alpha: 0 }, 200, () => {
                                if (avatar != null) {
                                    avatar.Destroy();
                                    avatar = null;
                                }
                            });
                        });
                    })
                }));
        }

        /**攻击触发Buff */
        private AttackTriggerConditions() {
            for (let i = 0; i < this._passiveSkillList.length; i++) {
                if (this._passiveSkillList[i]) {
                    if (this._passiveSkillList[i].BAttack) {
                        this._passiveSkillList[i].AttackTriggerSkill();
                    }
                }
            }
        }

        /**被攻击触发Buff */
        private OnHurtTriggerConditions() {
            for (let i = 0; i < this._passiveSkillList.length; i++) {
                if (this._passiveSkillList[i]) {
                    if (this._passiveSkillList[i].BHurt) {
                        this._passiveSkillList[i].OnHurtTrigger();
                    }
                }
            }
        }

        /**销毁 */
        public Destroy(): void {
            if (this.heroBlood) {
                this.heroBlood.destroy();
            }
            super.Destroy();
            this.vo.onlockpassive.recover();
            this.DestroyPassive();
            if (this._captainSkill) {
                this._captainSkill.Destroy();
                this._captainSkill = null;
            }
            if (this._dataVo.location == 4) {
                Event.RemoveEvent(EventDefine.CAPATIAN_SKILL, Laya.Handler.create(this, this.SpellCaptainSkill));
            }
        }



    }
} 