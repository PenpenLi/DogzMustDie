module H52D_Framework {
    /**技能BUff @author zhangzhenming*/
    export class SkillBuff {

        private _data: Object;
        private _owner: any;
        private _ratio: number;
        private _buff:Buff;
        private _bHave : boolean = false;
        private _btype = 1;
        constructor(data: Object, owner: any,btype) {
            this._data = data;
            this._owner = owner;
            this._btype = btype;
            if (!ObjIsEmpty(this._data))  {
                this._bHave = true;
                let id = this._data[1][3];
                this._buff = new Buff(id, this._owner,btype);
            }
        }

        /**数据表里有BUFF就增加 */
        public SetBuffasHave(ratio) {
            this._ratio = ratio;
            if (this._bHave) {
                let num = Math.random() * 10000;
                let odds = this._data[1][2];
                let type = this._data[1][1];
                if (num <= odds && type != 2) {
                    this.AddBuff();
                }
            }
        }
        /**暴击增加BUFF */
        public SetBuffasCrit(ratio) {
            this._ratio = ratio;
            if (this._bHave) {
                let num = Math.random() * 10000;
                let odds = this._data[1][2];
                let type = this._data[1][1];
                if (num <= odds && type == 2) {
                    this.AddBuff();
                }
            }
        }

        private AddBuff(): void {
            let stype = StatusConfig[this._buff.id]["statusType"];
            if (this._ratio > 0) {
                if (stype == 2) { this._buff.Do(this._ratio); }
                else { this._buff.Do(); }
            }
            else { this._buff.Do(); }
        }

        public OnUpdate()  {
            this._buff.OnUpdate();
        }

        public Destroy()  {
            if (this._buff)  {
                this._buff.Destroy();
                this._buff = null;
            }
        }

    }
}