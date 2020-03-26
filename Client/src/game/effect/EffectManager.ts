/** 特效管理类 */
module H52D_Framework {
    export class EffectManager {

        //打开掉落函数，多出调用，静态私有
        // private static _droping: boolean;
        //一个金币多少钱
        private readonly min: number = 1;
        private readonly max: number = 9;
        private mainview: MainView;

        private box: Object = null;
        public RootList:Laya.Component[] = [];

        private static _inst: EffectManager;
        public static get Instance() {
            if (EffectManager._inst == null) {
                EffectManager._inst = new EffectManager();
            }
            return EffectManager._inst;
        }

        public Initialize(): void {
            this.RootList.push(SceneRoot);
        }


        /** 增加物品 */
        public AddItem(itemId: number, itemNum: number): void {
            if (itemId == BaseDefine.ItemIdGold) {//金币
                // EffectManager._droping = true;
                let location: Laya.Point = BattleManager.Instance.LastMosterLocation;
                if (!location.x) return;
                // 设定多少个金币
                let howMoney: number = this.min + Math.floor(Math.random() * (this.max - this.min + 1));
                let cost: number = Math.round(itemNum / howMoney);
                let lastCost: number = itemNum % cost;
                if (lastCost < (cost >> 1)) {
                    lastCost += cost;
                }
                else {
                    howMoney++;
                }
                for (let i: number = 0; i < howMoney; i++) {
                    DropManager.Instance.AddDropCoin(location.x, 500, i ? cost : lastCost, 400);
                }
            }
            if (itemId == BaseDefine.ItemIdDiamonds) {//钻石
                this.ShowDiamonds(itemNum);
            }
            if (itemId == BaseDefine.ItemIdExperience) {//经验
                this.ShowExp(itemNum);
            }
        }

        /** 增加宝箱 */
        public AddBox(type: number, itemId: number, itemNum: number): void {
            if (this.box == null) {
                this.box = {};
            }
            if (this.box[type] == null) {
                this.box[type] = {};
            }
            this.box[type][itemId] = itemNum;
        }

        public SendBox() {
            if (this.box == null) return;
            let location: Laya.Point = BattleManager.Instance.LastMosterLocation;
            DropManager.Instance.AddDropBox(location.x, location.y - 120, this.box);
            this.box = null;
        }

        private ShowGold(goldNum: number): void {

        }
        private ShowDiamonds(diamondsNum: number): void {
            Tick.Once(3000, this, () => {

            });
        }
        private ShowExp(expNum: number): void {
            Tick.Once(3000, this, () => {

            });
        }

        //-----------------------------------------屏幕震动效果-----------------------------------------
        private _shockTime: number = 0;
        private _shockTotalTime: number = 0;

        /**
         * 屏幕震动
         * @param time 震动时间
         * @param bNew 新手引导特殊震动
         * @param nShakeTime 震动次数
         */
        public StartShock(time?: number, bNew?: boolean, nShakeTime?: number) {
            Tick.Clear(this, this.UpdateShock);
            if (!nShakeTime) {
                this.nShakeTime = 3;
            }
            else {
                this.nShakeTime = nShakeTime;
            }
            Tick.FrameLoop(1, this, this.UpdateShock, [bNew]);
            this._shockTotalTime = this._shockTime = (time / 1000) || 0.3;
        }

        private nShakeTime: number = 0;
        /**处理震屏效果 */
        private UpdateShock(bNew?: boolean) {
            if (this._shockTime > 0) {
                // 震动次数
                //let nShakeTime: number = 3;
                let nRate = 1 - this._shockTime / this._shockTotalTime;
                // 求震动偏移
                // y = ( 1 - t ) * sin( t * shockTime * x * 2PI )
                let nOffX = nRate * this.nShakeTime * Math.PI * 2;
                let nOffset = (1 - nRate) * Math.sin(nOffX);

                // 屏幕震动最大偏移量
                nOffset = nOffset * 10;
                if (bNew == true) {
                    NewGuidRoot.centerX = nOffset;
                    NewGuidRoot.centerY = nOffset;

                    ViewStoryRoot.centerX = nOffset;
                    ViewStoryRoot.centerY = nOffset;

                } else {
                    this.RootList.forEach(element => {
                        element.centerX = nOffset;
                        element.centerY = nOffset;
                    });
                    
                }
                this._shockTime -= Time.deltaTime / 1000;
            }
            else {
                this._shockTime = 0;
                if (bNew == true) {
                    NewGuidRoot.centerX = 0;
                    NewGuidRoot.centerY = 0;
                } else {
                    this.RootList.forEach(element => {
                        element.centerX = 0;
                        element.centerY = 0;
                    });
                }
                Tick.Clear(this, this.UpdateShock);
            }
        }


    /**
      * 屏幕震动
      * @param time 震动时间
      * @param bNew 新手引导特殊震动
      */
        public PStartShock(time?: number, nShakeTime?: number) {
            Tick.Clear(this, this.UpdateShock);
            if (!nShakeTime) {
                this.nShakeTime = 3;
            }
            else {
                this.nShakeTime = nShakeTime;
            }
            Tick.FrameLoop(1, this, this.PUpdateShock);
            this._shockTotalTime = this._shockTime = (time / 1000) || 0.3;
        }

        // private nShakeTime:number = 0;
        /**处理震屏效果 */
        private PUpdateShock() {
            if (this._shockTime > 0) {
                // 震动次数
                //let nShakeTime: number = 3;
                let nRate = 1 - this._shockTime / this._shockTotalTime;
                // 求震动偏移
                // y = ( 1 - t ) * sin( t * shockTime * x * 2PI )
                let nOffX = nRate * this.nShakeTime * Math.PI * 2;
                let nOffset = (1 - nRate) * Math.sin(nOffX);

                // 屏幕震动最大偏移量
                nOffset = nOffset * 10;
                this.RootList.forEach(element => {
                    element.centerX = nOffset;
                    element.centerY = nOffset;
                });
                this._shockTime -= Time.deltaTime / 1000;
            }
            else {
                this._shockTime = 0;
                this.RootList.forEach(element => {
                    element.centerX = 0;
                    element.centerY = 0;
                });
                Tick.Clear(this, this.UpdateShock);
            }
        }

    }
}