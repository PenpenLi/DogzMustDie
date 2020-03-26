/*
* buff类;
*/
module H52D_Framework {
    
    export class Buff {
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
        private _avatar: BuffAvatar = null;
        /**Buff效果 */
        private _effect: BuffEffect = null;
        private _id:number = 0;
        public get id(){return this._id;}
        private _currenttime = 0;
        private _bSpell:boolean = false;
        private _btype = 1;
        /**初始化 */
        constructor(id: number, owner: any,btype = 1) {
            this._buffData = new BuffData(id);
            this._id = id;
            this._owner = owner;
            this._btype = btype
        }

        /**Buff产生效果 */
        public Do(ratio?: number): void {
            if (!this._buffData) return;
            Event.RegistEvent("Destroy_s", Laya.Handler.create(this, this.Destroy_S));
            if (this._bCD)  {
                this._bSpell = true;
                this._currentCd = this._buffData.inlayCd;
                this._bCD = false;
                if (ratio) this._ratio = ratio; else this._ratio = 0;
                this._effect = new BuffEffect(this._buffData, this._owner, this._ratio,this._btype);
                if (this._buffData.effectPath)
                    this._avatar = new BuffAvatar(this._buffData, this._owner,this._btype);
            }
        }

        /**替换规则 */
        public RepeatBuff(): void {

        }
        
        public OnUpdate(): void {
            if (this._buffData) { 
                if (this._buffData.existTime != -1 && this._buffData.id != 1 && this._bSpell) {
                    this._currenttime += 100;
                    if (this._currenttime >= this._buffData.existTime) {
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

        }

        public Destroy_S()  {
            if (this._buffData.existTime == -1) {
                this.Destroy();
            }
        }

        /**
         * DsetroyEvent
         */
        public DsetroyEvent() {
            
        }


        /**销毁 */
        public Destroy() {
            if (this._effect)  {
                this._effect.Destroy();
                this._effect = null;
            }
            //删除buff表现效果
            if (this._avatar) {
                this._avatar.Destroy();
                this._avatar = null;
            }
            Event.RemoveEvent("Destroy_s", Laya.Handler.create(this, this.Destroy_S));
        }



    }
}