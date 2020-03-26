
module H52D_Framework {
    export class BPet extends Entity {
        public get vo() { return this._dataVo as BPetVo; }

        /**初始化 */
        constructor(id: number, viewRoot?: Laya.Box, bbool?: boolean, ) {
            super(viewRoot);
            this.SE = SkinEnum.SkinPet;
            this._dataVo = PetManager.Instance.GetPet_Instance(id);
            this.type = eCharacter_TYPE.PET;
        }

        /**出生特效 */
        private ChangeEffect(): void {
            if (this._avatar == null) {
                return
            }
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
                this._brithAvatar = new Avatar(AvatarEffectRoot)
                this._brithAvatar.Load("res/effect/effect_state_qiehuan/effect_state_qiehuan.sk", 1, 0.4,
                    this.PosX, this.PosY - 78, Laya.Handler.create(this, () => {
                        if (!this._brithAvatar) {
                            return
                        }
                        this._brithAvatar.Play("effect_state_qiehuan", false);
                    }));
            }
        }

        /**加载模型 */
        public LoadMoudle(x: number, y: number, order: number, callback: Laya.Handler): void {
            this._PosX = x;
            this._PosY = y;
            /**加载模型 */
            if(!this.vo){
                return;
            }
            this._avatar = new Avatar(this.viewRoot)
            this._avatar.Load(this.vo.Path, this.vo.Direction, this.vo.Scla, x, y, Laya.Handler.create(this, (_avatar) => {
                /**设置阴影 */
                this.ChangeEffect();
                this._order = order;
                if (_avatar) {
                    _avatar.SetOrder(order);
                }
                /**初始化英雄普攻 */
                this._attackskill = new Skill(this.vo.SkillID, this, eBELONGS_TO.ATTACK);
                this.Idle();
                if (callback)
                    callback.run();
            }));
        }

        /** 攻击 */
        public Attack(): void {
            super.Attack();
            BattleManager.Instance.petAttackNum++;
        }

        /**更新*/
        public OnUpdate(): void {
            super.OnUpdate();
            if (!this._target || this.Close) return;
            if (this._attackskill) {
                if (!this._attackskill.IsCD) {
                    this.Attack();
                }
                this._attackskill.OnUpdate();
            }
        }

    }
}