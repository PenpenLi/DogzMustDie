module H52D_Framework {

    export class PSkillBuff {
        private _data: Object;
        private _owner: any;
        private _ratio: number;
        private _buff: Array<PBuff> = [];
        private _bHave: boolean = false;
        private belongs =  eBELONGS_TO.ATTACK;

        constructor(data: Object, owner: any,btype:number,belongs) {
            this._data = data;
            this._owner = owner;
            this.belongs = belongs;
            if (!ObjIsEmpty(this._data)) {
                this._bHave = true;
                for (let k in this._data)  {
                    let id = this._data[k][3];
                    this._buff.push(new PBuff(id, btype, this._owner));
                }
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
                    for (let k in this._buff)  {
                        this.AddBuff(k);
                    }
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
                    for (let k in this._buff) {
                        this.AddBuff(k);
                    }
                }
            }
        }

        private AddBuff(i): void {
            let stype = StatusConfig[this._buff[i].id]["statusType"];
            if (this._ratio > 0) {
                if (stype == 2) { this._buff[i].Do(this.belongs,this._ratio); }
                else { this._buff[i].Do(this.belongs); }
            }
            else { this._buff[i].Do(this.belongs); }
        }

        public OnUpdate() {
            for (let k in this._buff)  {
                this._buff[k].OnUpdate();
            }
        }

        public Destroy() {
            for (let k in this._buff) {
                this._buff[k].Destroy();
            }
            this._buff = [];
        }

        
    }
}