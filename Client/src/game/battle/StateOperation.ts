/*
* 指令状态机;
*/
module H52D_Framework {
    export class StateOperation {
        private _tapSkill: TapSkill;


        /**
         * 初始化
         */
        constructor() {
            this.Destroy();
            this._tapSkill = new TapSkill();
        }

        public OnFire()
        {

        }

        /**销毁 */ 
        public Destroy() {
            if (this._tapSkill) {
                this._tapSkill.Destroy();
                this._tapSkill = null
            }
        }

        /**接收到指令触发行为 */
        public Do(params: any, clickType?) {
            if (params != null) {
                this._tapSkill.TapSkill(clickType);
            }
        }

        public OnUpdate()
        {

        }


    }
}