module H52D_Framework {
    /**PVP */
    export class PHeroCrad extends Character {
        /** 血条 */
        private heroBlood: HeroBloodView;
        private bloodMax: number;

        /**初始化 */
        constructor(vo: any, btype: number, viewRoot?: Laya.Box, bbool?: boolean, ) {
            super(btype, bbool);
            this._dataVo = vo;
            this._passiveSkillList = [];
            this.type = vo.hero_Type == 1 ? eCharacter_TYPE.AHERO : eCharacter_TYPE.DHERO;
            this.SE = SkinEnum.SkinHero;
            this.InitSkill();
            this.CaptainSkillInit(btype);
        }

        private CaptainSkillInit(btype: number) {
            if (this.vo.location == 4 && btype == 1) {
                Event.RegistEvent(EventDefine.CAPATIAN_SKILL, Laya.Handler.create(this, this.SpellCaptainSkill));
                let icon = "ui_icon/" + ActiveSkillConfig[this.vo.skillid[1]]["strIcon"];
                Event.DispatchEvent("CaptainSkillInit", [icon]);
            }
        }

        public get vo() { return this._dataVo as PheroInfo; }
        
        protected setCurrentHp(value: number) {
            this._currentHp = value;
            this.heroBlood.proportion = value / this.bloodMax;
        }

        /**加载英雄模型 */
        public LoadMoudle(id: number, dir: number, scale: number, x: number, y: number, order: number, callback: Laya.Handler): void {
            this._id = id;
            this._PosX = x;
            this._PosY = y;
            this.vo.InitPassiveID();
            this.vo.SetColOrow();
            this.vo.SetToSpeed();
            this.bloodMax = this.vo.attr.GetAttributeValue(1);
            this._currentHp = this.vo.attr.GetAttributeValue(1);
            /**加载模型 */
            this._avatar = new Avatar(AvatarRoot)
            this._avatar.Load(this.vo.ModlePath, dir, scale, x, y, Laya.Handler.create(this, () => {
                /**设置阴影 */
                this._avatar.Shadow(1, true);
                this.SetOrderZ(this.vo.colNum);
                this.Idle();
                
                this.heroBlood = new HeroBloodView();
                this.heroBlood.x = this._avatar.PosX - 25;
                this.heroBlood.y = this._avatar.PosY - 120;
                AvatarEffectRoot.addChild(this.heroBlood);

                if (callback) {
                    callback.run();
                }
            }));
        }

        public OnHurt(be, owr, damage: number, e: SkinEnum, iscrit: boolean, type?: SPECIAL_TYPE, viewRoot?: Laya.Box): void {
            super.OnHurt(be, owr, damage, e, iscrit, type, viewRoot);
            this.OnHurtTriggerConditions();
        }

        public SpellAttackSkill(): void {
            super.SpellAttackSkill();
            this.AttackTriggerConditions();
        }

        /**条件类被动技能生效 */
        public OnEffectPassive(): void {
            for (let i = 0; i < this.vo.conditionsID.length; i++) {
                let pas = new PConditionsPassiveSkill(this.vo.conditionsID[i], this._btype, this);
                this._passiveSkillList.push(pas);
            }
            for (let i = 0; i < this._passiveSkillList.length; i++) {
                if (this._passiveSkillList[i]) {
                    this._passiveSkillList[i].Do();
                }
            }
        }

        protected SpellCaptainSkill(): void {
            let tar = this._target_a.SetTarget(this.CaptainTarget,
                this._captainSkill.Data.hitEnemyMode, this._captainSkill.Data.hitEnemyNum);
            this._captainSkill.SpellSkill(tar);
            this.CCTarget = [];
            this.CCTarget = tar;
            this.CaptainEffct();
            Tick.Once(200, this, () => {
                this.CaptainEffct_Z();
                let name = SkillName[this.vo.skillid[1]];
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


        public Destroy(): void {
            if (this.heroBlood.parent) {
                this.heroBlood.parent.removeChild(this.heroBlood);
            }
            super.Destroy();
            if (this._dataVo.location == 4 && this._btype == 1) {
                Event.RemoveEvent(EventDefine.CAPATIAN_SKILL, Laya.Handler.create(this, this.SpellCaptainSkill));
            }
        }

    }
}