
module H52D_Framework {
    export class BCamp extends Entity {

        constructor(vo: BCampVo, viewRoot?: Laya.Box) {
            super(viewRoot);
            this._dataVo = vo;
            this.SE = SkinEnum.SkinCamp;
            this.type = eCharacter_TYPE.CAMP;
        }

        /**加载阵营模型 */
        public LoadMoudle(x: number, y: number, order: number, callback: Laya.Handler): void {
            this._PosX = x;
            this._PosY = y;
            /**加载模型 */
            this._avatar = new Avatar(this.viewRoot);
            this._avatar.Load("res/player/chuan/chuan.sk", 1, 0.3, x, y, Laya.Handler.create(this, () => {
                this._avatar.Rotate(8);
                this.vo.Setattribute();
                /**初始化英雄普攻 */
                this._attackskill = new Skill(this.vo.skillid, this, eBELONGS_TO.ATTACK);
                this.Idle();
                if (callback)
                    callback.run();
            }));
        }

        /**更新函数 */
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