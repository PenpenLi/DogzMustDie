
module H52D_Framework {

    export class PBuff {
        private _owner: any = null;
        /** buff数据*/
        private _buffData: BuffData = null;
        /**特效层级 */
        private _ViewRoot: Laya.Box;
        /**伤害系数 */
        private _ratio: number = 0;
        private _currentCd: number = 0;
        private _bCD: boolean = true;
        /**Buff表现 */
        private _avatar: PBuffAvatar = null;
        /**Buff效果 */    
        private _effect: PBuffEffect = null;
        private _id: number = 0;
        public get id() { return this._id; }
        private _currenttime = 0;
        private _bSpell: boolean = false;
        private _btype: number = 0;


        /**初始化 */
        constructor(id: number, btype: number, owner?: any) {
            this._buffData = new BuffData(id);
            this._id = id;
            this._btype = btype;
            this._owner = owner;
        }

        /**Buff产生效果 */
        public Do(belongs,ratio?: number): void {
            if (!this._buffData) return;
            if (this._bCD) {
                this._bSpell = true;
                this._currentCd = this._buffData.inlayCd;
                this._bCD = false;
                this._ratio = ratio;

                this._effect = new PBuffEffect(this._buffData, this._owner, this._ratio, this._btype,belongs);
                this._effect.Do();
                if (this._buffData.effectPath) {
                    this._avatar = new PBuffAvatar(this._buffData, this._owner, this._btype,belongs);
                    this._avatar.Do();
                }
            }
        }

        /**替换规则 */
        public RepeatBuff(): void {

        }

        public OnUpdate(): void {
            if (this._buffData) {
                if (this._buffData.existTime != -1 && this._buffData.id != 1 && this._bSpell) {
                    this._currenttime += 100;
                    if (this._currenttime + 100  >= this._buffData.existTime) {
                        this._currenttime = 0;
                        this._bSpell = false;
                        this.Destroy();
                    }
                }

                if (!this._buffData.existTime && this._buffData.continueType == 3 && this._bSpell) {
                    this._currenttime += 100;
                    if (this._currenttime >= 1000) {
                        this._currenttime = 0;
                        this._bSpell = false;
                        this.Destroy();
                    }
                }
            }
            if (this._effect)
                this._effect.OnUpdate();
            if (this._avatar)
                this._avatar.OnUpdate();
            if (this._currentCd > 0) {
                this._currentCd -= 100;
            }
            else if (this._currentCd <= 0) {
                this._bCD = true;
            }
            // if (!BattleManager.Instance.IsHasAliveTarget())  {
            //     this.Destroy_S();
            // }
        }

        public Destroy_S() {
            if (this._buffData.existTime == -1) {
                this.Destroy();
            }
        }

        /**销毁 */
        public Destroy() {
            // if (this._effect) {
            //     this._effect.Destroy();
            //     this._effect = null;
            // }
            //删除buff表现效果
            if (this._avatar) {
                this._avatar.Destroy();
                this._avatar = null;
            }
        }

    }
}