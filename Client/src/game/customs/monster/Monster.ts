module H52D_Framework {
    /**
     * 怪物类
     */
    export class Monster extends Entity {

        private _blood: number;
        private _isDestroyDwon: boolean = false;
        private _scla = 0.1;
      

        /**队长技能 */
        private _captainSkill: Skill = null;
        public get vo(): MonsterVo {
            return this._dataVo as MonsterVo;
        }

        public get blood(): number {
            return this._blood;
        }

        public set blood(value: number) {
            this._blood = value;
        }

        public get ViewRoot() { return this.viewRoot; }

        /**初始化 */
        constructor(vo: MonsterVo, viewRoot?: Laya.Box) {
            super(viewRoot);
            this._dataVo = vo;
            this.type = eCharacter_TYPE.MONSTER;
        }

        public Init(): void {
            this._isDestroyDwon = false;
            if (this.vo.location == 4 && this.vo.captainid != 0) {
                this._captainSkill = new Skill(this.vo.captainid, this, eBELONGS_TO.BIG, -1);
            }
            if (this.vo.attackid != 0) {
                this._attackskill = new Skill(this.vo.attackid, this, eBELONGS_TO.ATTACK, -1);
            }
            this.bloodMax = this._dataVo.attr.GetAttributeValue(1);
            this.currentHp = this._dataVo.attr.GetAttributeValue(1);
            this._isDie = false;
            this._target_a = new Formation();
            Tick.Loop(100, this, this.OnUpdate);
        }


        public LoadMonster(dir: number, scale: number, x: number, y: number, shadow: number, order: number, callback?: Laya.Handler): void {
            this._PosX = x;
            this._scla = scale;
            this._PosY = y;
            this._isDie = false;
            this.vo.SetCol();
            this._avatar = new Avatar(this.viewRoot)
            this._avatar.Load(this._dataVo.strModelId, dir, this._scla, x, y, Laya.Handler.create(this, (_avatar) => {
                this.Init();
                if (CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                    this.heroBlood = new HeroBloodView();
                    this.heroBlood.x = this._avatar.PosX - 25;
                    this.heroBlood.y = this._avatar.PosY - 120;
                    AvatarEffectRoot.addChild(this.heroBlood);
                }
                this.ChangeEffect(shadow);
                _avatar.SetOrder(order);
                this.Idle();
                if (callback) {
                    callback.run();
                }
            }), this.vo.modlight);
        }

        public beforDie = false;
        public afterDie = false;
        /**死亡函数 */
        public Die(callback?: Laya.Handler): void {
            if (!this._avatar) return;
            BattleManager.mDieNumber += 1;
            SoundManager.Instance.OnPlaySound("res/sound/die_sound.mp3");
            CustomsManager.Instance.monsterDieNum++;
            this.beforDie = true;
            this._avatar.Play(AnimationName.die, false, true, () => {
                this._isDestroyDwon = true;
                this.afterDie = true;
                Event.DispatchEvent("ClearOneBubble", [E_BubbleType.eMonster])
                this.Destroy();
                if (callback) {
                    callback.run();
                }
            });
            Event.DispatchEvent("ClearOneBubble", [E_BubbleType.eMonster]);
            Event.DispatchEvent("StopBubbleMonster");
        }

        /**出生特效 */
        private ChangeEffect(shadow): void {
            if (!this._avatar) return;
            if (this.vo.boss) {
                let oPosY = 0;
                oPosY = this._avatar.PosY;
                this._avatar.PosY = -100;
                if (!oPosY) oPosY = 730;
                TweenList.to(this, this._avatar, { PosY: oPosY }, 350, () => {
                    if (!this._avatar) return;
                    if (!oPosY) oPosY = 730;
                    this._avatar.PosY = oPosY;
                    this._avatar.Shadow(shadow, true);
                    EffectManager.Instance.StartShock(600, null, 6);
                });
            }
            else {
                if (!this._avatar) return;
                this._avatar.scale = 0;
                if (!this._avatar) return;
                TweenList.to(this, this._avatar, { scale: this._scla }, 250, () => {
                    if (!this._scla) {
                        this._scla = 0;
                    }
                    if (!this._avatar) return;
                    if (this._avatar) {
                        this._avatar.scale = this._scla;
                    }
                    if (!this._avatar) return;
                    this._avatar.Shadow(shadow, true);
                });
                SoundManager.Instance.OnPlaySound("res/sound/boss_appear2.mp3");
                if (this._brithAvatar) {
                    this._brithAvatar.Play("effect_state_qiehuan", false);
                }
                else {
                    this._brithAvatar = new Avatar(AvatarEffectRoot)
                    this._brithAvatar.Load("res/effect/effect_state_qiehuan/effect_state_qiehuan.sk", 1, 1.1,
                        this.PosX, this.PosY - 200, Laya.Handler.create(this, (_brithAvatar) => {
                            _brithAvatar.Play("effect_state_qiehuan", false);
                        }));
                }
            }
        }
        
        public setHp()  {
            this.currentHp = 0;
        }

        public Attack(): void {
            if (this._isDie || this._avatar == null) {
                return;
            }
            this.bAttack = true;
            this._avatar.Play(AnimationName.attack, false, true, () => {
                this.bAttack = false;
                this.Idle();
            });
            this._attackskill.SpellSkill(this._target);
        }


        public OnHurt(damage: number, e: SkinEnum, iscrit: boolean, type?: SPECIAL_TYPE, viewRoot?: Laya.Box): void {
            if ((this._currentHp <= 0) || this._isDie || this._avatar == null) {
                return;
            }
            if (type != SPECIAL_TYPE.SUSRAINED) {
                this.Hit();
            }
            if (type == SPECIAL_TYPE.ACTION) {
                UIManager.Instance.InstanceUI("FloatView",
                    [viewRoot, damage.toString(), e, 420, 100, false]);
                return;
            }
            if (damage <= 0) damage = 1;
            Floating.DamageText(damage.toString(), e, this.PosX, this.PosY - 200, iscrit);
            this.currentHp -= damage;
            if (CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                BattleManager.damageAll += damage;
            }
            BattleManager.Instance.TheWordBossDamage += damage;
            BattleManager.Instance.TheMatchBossDamage += damage;
            //通知UI
            Event.DispatchEvent(EventDefine.CUSTOMS_DROP_BLOOD, damage);
        }

        public OnUpdate(): void {
            if (this._isDie) {
                return;
            }
            if (this.currentHp <= 0) {
                this._isDie = true;
                this.Die();
            }
            if (this.Close) return;
            if (this._attackskill) {
                this._attackskill.OnUpdate();
                if (!this._attackskill.IsCD && this._target.length > 0) {
                    this.Attack();
                }
            }
            if (this._captainSkill) {
                if (!this._captainSkill.IsCD) {
                    this.SpellCaptainSkill();
                }
            }
            if (this._captainSkill) {
                this._captainSkill.OnUpdate();
            }
        }

        private CCTarget = [];
        private _target_a: Formation = null;
        protected SpellCaptainSkill(): void {
            if (!BattleManager.Instance.HeroCardMgr && !BattleManager.Instance.HeroCardMgr.CHeroList &&
                BattleManager.Instance.HeroCardMgr.CHeroList.length > 0) return;
            let mgr = BattleManager.Instance.HeroCardMgr;
            if (!mgr) return;
            let tar = this._target_a.SetTarget(mgr.CHeroList,
                this._captainSkill.Data.hitEnemyMode, this._captainSkill.Data.hitEnemyNum);
            this._captainSkill.SpellSkill(tar);
            this.CCTarget = [];
            this.CCTarget = tar;
            this.CaptainEffct();
            Tick.Once(200, this, () => {
                this.CaptainEffct_Z();
                if(!this._captainSkill) return;
                let name = SkillName[this._captainSkill.Data.id];
                Floating.SkillNameText(name, this.PosX, this.PosY - 130);
            });
        }

        private CaptainEffct() {
            let avatar = new Avatar(AvatarEffectRoot)
            avatar.Load(
                EffectDefine.shifa, 1, 1, this.PosX + 5, this.PosY - 75, Laya.Handler.create(this, (avatars) => {
                    avatars.Play("effect_state_shifa", false, true, () => {
                        avatars.Destroy();
                    });
                }));
        }

        private CaptainEffct_Z() {
            let avatar = new Avatar(AvatarEffectRoot)
            avatar.Load("res/effect/effect_state_shifa2/effect_state_shifa2.sk", 1, 1, this.PosX, this.PosY - 160,
                Laya.Handler.create(this, (avatars) => {
                    if (!avatars) return;
                    avatars.Armature.alpha = 0;
                    avatars.Play("effect_state_shifa2", true, true, () => {
                    });
                    TweenList.to(this, avatars.Armature, { alpha: 1 }, 200, () => {
                        Tick.Once(700, this, () => {
                            if (!avatars) return;
                            if (!avatars.Armature) return;
                            TweenList.to(this, avatars.Armature, { alpha: 0 }, 200, () => {
                                avatars.Destroy();
                            });
                        });
                    })
                }));
        }

        /**销毁 */
        public Destroy() {
            Tick.Clear(this,this.OnUpdate);
            if (this._avatar) {
                this._avatar.Destroy();
                this._avatar = null;
            }
            if (this.heroBlood) {
                this.heroBlood.destroy();
            }

            if (this._brithAvatar) {
                this._brithAvatar.Destroy();
                this._brithAvatar = null;
            }
            if (this._attackskill) {
                this._attackskill.Destroy();
                this._attackskill = null;
            }
            if (this._captainSkill) {
                this._captainSkill.Destroy();
                this._captainSkill = null;
            }
        }


    }
}