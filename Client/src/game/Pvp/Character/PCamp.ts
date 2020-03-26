/**
* name 
*/
module H52D_Framework {
    export class PCamp extends Character {

        constructor(vo: any, btype: number, viewRoot?: Laya.Box, bblood?) {
            super(btype, bblood);
            this._btype = btype;
            this._dataVo = vo;
            this.type = eCharacter_TYPE.CAMP;
            this.SE = SkinEnum.SkinCamp;
        }

        /**加载阵营模型 */
        public LoadMoudle(x: number, y: number, order: number, callback: Laya.Handler = null): void {
            this._PosX = x;
            this._PosY = y;
            /**加载模型 */
            this._avatar = new Avatar(AvatarRoot);
            this._avatar.Load("res/player/chuan/chuan.sk",
                this._btype, 0.3, x, y, Laya.Handler.create(this, () => {
                    this._btype == 1 ? this._avatar.Rotate(8) : this._avatar.Rotate(-8);
                    this.SetOrderZ(order);
                    /**初始化英雄普攻 */
                    this._attackskill = new PSkill(this.vo.skillid, this, this._btype, eBELONGS_TO.ATTACK);
                    this.Idle();
                    if (callback) { callback.run(); }
                }));
        }
        
        public SetDamage() {
            this._btype == 1 ? this.vo.SetDamage(this.GetHeroList(0)) : this.vo.SetDamage(this.GetHeroList(1));
        }

        private GetHeroList(index) {
            return BattlefieldManager.Instance.Characterlist[index].HeroList;
        }

        /**更新函数 */
        public OnUpdate(): void {
            if (this.TargetIsNull()) {
                this._bClose = true;
                this._target = [];
            }
            if (!this._target || this._bClose) return;
            if (this._attackskill) {
                this._attackskill.OnUpdate();
                if (!this._attackskill.IsCD) {
                    this.SpellAttackSkill();
                }
            }
        }


    }
}