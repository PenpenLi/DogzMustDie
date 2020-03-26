/** 掉落管理类 */
module H52D_Framework {
    export class DropManager {
        private static _inst: DropManager;
        public static get Instance() {
            if (DropManager._inst == null) {
                DropManager._inst = new DropManager();
            }
            return DropManager._inst;
        }

        /** 自动打开宝箱 */
        public openBox:boolean = true;
        
        private _arrayCoinCls: Array<DropCoin> = [];
        private _arrayBoxCls: Array<DropBox> = [];

        /** 创建金币
        * @param nX 位置
        * @param nY 位置
        * @param nMoney  金币卸载量
        * @param callback 金币消失回调
        */
        public AddDropCoin(nX: number, nY: number, nMoney: number, speed_x: number): void {
            let cls = new DropCoin(nX, nY, nMoney, speed_x);
            this._arrayCoinCls.push(cls);
        }

        /** 设置附近胡金币全部飞回 */
        public SearchCoinFlyback(nX: number, nY:number):void{
            for (let i = 0; i < this._arrayCoinCls.length; i++) {
                let coin:DropCoin = this._arrayCoinCls[i];
                if ( coin.IsCanFlyback() ) {
                    // 求是否在范围
                    let nDesX = Math.abs(nX - coin.GetPosX());
                    if( nDesX < 64 ){
                        this._arrayCoinCls[i].BeginFlyBack();
                    }
                }
            }
        }

        /** 创建宝箱
        * @param nX 位置
        * @param nY 位置
        * @param nid 宝箱ID
        * @param callback 金币消失回调
        */
        public AddDropBox(nX: number, nY: number, nbox:Object, callback?:Function): void {
            let cls = new DropBox(nX, nY, nbox, callback);
            this._arrayBoxCls.push(cls);
        }

        /** 销毁掉落物 */
        public DeleteCoin(cls: DropCoin): void {
            for (let i = 0; i < this._arrayCoinCls.length; i++) {
                if (this._arrayCoinCls[i] == cls) {
                    this._arrayCoinCls[i].Destroy();
                    this._arrayCoinCls[i] = null;
                    this._arrayCoinCls.splice(i, 1);
                    return;
                }
            }
        }

        /** 销毁掉宝箱 */
        public DeleteBox(cls: DropBox): void {
            for (let i = 0; i < this._arrayBoxCls.length; i++) {
                if (this._arrayBoxCls[i] == cls) {
                    this._arrayBoxCls[i].Destroy();
                    this._arrayBoxCls[i] = null;
                    this._arrayBoxCls.splice(i, 1);
                    return;
                }
            }
        }

        /** 清空所有金币和宝箱 */
        public Destroy(): void {
            for (let i = 0; i < this._arrayCoinCls.length; i++) {
                if (this._arrayCoinCls[i]) {
                    this._arrayCoinCls[i].Destroy();
                    this._arrayCoinCls[i] = null;
                }
            }
            this._arrayCoinCls = [];
            for (let i = 0; i < this._arrayBoxCls.length; i++) {
                if (this._arrayBoxCls[i]) {
                    this._arrayBoxCls[i].Destroy();
                    this._arrayBoxCls[i] = null;
                }
            }
            this._arrayBoxCls = [];
        }
    }
}