/*
* name;
*/
module H52D_Framework {
    export class Cartridge {
        private _Flag: Array<any>
        constructor() {
            this._Flag = []
        }

        /** 添加一个方法 */
        public AddFunc(handler: Laya.Handler) {
            this._Flag.push(handler)
        }

        /** 添加一个延迟 */
        public AddDelay(time: number) {
            this._Flag.push(time)
        }

        /** 清除 */
        public Clear() {
            this._Flag = []
            Tick.ClearAll(this)
        }

        /** 执行 */
        public Do() {
            let obg = this._Flag.shift()
            while (obg != null) {
                if (typeof (obg) == "number") {
                    Tick.Once(obg, this, () => {
                        this.Do()
                    })
                    return
                } else {
                    obg.run()
                }
                obg = this._Flag.shift()
            }
        }

        public RemoveNum() {
            for (let key in this._Flag) {
                let obg = this._Flag[key];
                if (typeof (obg) == "number") {
                    this._Flag[key] = 10;
                }
            }
        }
    }
}