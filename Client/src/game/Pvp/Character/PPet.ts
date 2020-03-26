
module H52D_Framework {
    export class PPet extends Character {

        /**初始化 */
        constructor(id: number, vo: any, btype: number, viewRoot?: Laya.Box, bbool?: boolean, ) {
            super(btype, bbool)
            this.SE = SkinEnum.SkinPet;
            this.type = eCharacter_TYPE.PET;
            this._dataVo = vo;
        }

        /**加载英雄模型 */
        public LoadMoudle(x: number, y: number, order: number, callback: Laya.Handler = null): void {
            this._PosX = x;
            this._PosY = y;
            let dir = this._btype == 1 ? -1 : 1;
            /**加载模型 */
            this._avatar = new Avatar(AvatarRoot);
            this._avatar.Load(this.vo.Path, dir,
                this.vo.Scla, x, y, Laya.Handler.create(this, () => {
                    this.ChangeEffect();
                    this.SetOrderZ(order);
                    /**初始化英雄普攻 */
                    this._attackskill = new PSkill(this.vo.Sid, this, this._btype, eBELONGS_TO.ATTACK);
                    this.Idle();
                    if (callback){callback.run();}
                }));
        }

        public SetDamage() {
            this._btype == 1 ? this.vo.SetDamage(this.GetHeroList(0)) : this.vo.SetDamage(this.GetHeroList(1));
        }

        private GetHeroList(index) {
            return BattlefieldManager.Instance.Characterlist[index].HeroList;
        }

        public OnUpdate() {
            if (!this._target) return;
            if (this._attackskill) {
                this._attackskill.OnUpdate();
                if (!this._attackskill.IsCD &&
                    !this._bClose &&
                    this._target.length > 0) {
                    this.SpellAttackSkill();
                }
            }
            if (this.TargetIsNull()) {
                this._target = [];
            }
        }


    }
}