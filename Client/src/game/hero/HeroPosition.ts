/*
* name;
*/
module H52D_Framework {
    /**英雄站位  常万*/
    export class HeroPosition {
        /** 当前界面布阵信息 */
        private _PositionWar: { [pos: number]: number } = {}
        private _HeroWar: { [HeroID: number]: number } = {}
        private static _init: HeroPosition;
        private _bChange: boolean = false;
        private bool = false;

        /**存放英雄的数组 */
        private _putHero: Array<number> = [];

        //引导需要的参数
        //是否在布阵页面
        public _bHeroWar: boolean = false;
        
        
        constructor() {

            this.AddEvent();
        }

        private AddEvent() {
        }
        public static get Instance() {
            if (HeroPosition._init == null) {
                HeroPosition._init = new HeroPosition();
            }
            return HeroPosition._init;
        }

        public get bChange(): boolean {
            return this._bChange;
        }
        public set bChange(value: boolean) {
            this._bChange = value;
        }

        public set Puthero(value) {
            this._putHero = value;
        }

        private Close() {
            this.bool = true;
        }

        /** 判断是否在阵容上 */
        public IsInWar(nHeroID) {
            return this._HeroWar[nHeroID] == null ? false : true
        }
        /** 初始化阵容信息 */
        public InitPosInfo() {
            this._PositionWar = {}
            this._HeroWar = {}
            let HeroWarList = MasterPlayer.Instance.player.HeroWarList
            for (let pos in HeroWarList) {
                let nHeroID = HeroWarList[pos]
                this.PutHero(pos, nHeroID)
            }
        }

        /** 当前布阵信息 */
        public get PositionWar() {
            return this._PositionWar
        }

        /** 当前英雄位置信息 */
        public get HeroWar() {
            return this._HeroWar
        }

        /**判断是否在保存的阵容上 */
        public IsInSaveWar(pos, nHeroID) {
            let InWar = false;
            let NoWar = false;
            let war = MasterPlayer.Instance.player.HeroWarList;
            for (let nIdx in war) {
                let a = war[nIdx];
                if (a == nHeroID) {
                    InWar = true;
                }
                else {
                    NoWar = false;
                }
            }
            return (InWar || NoWar) ? true : false;
        }


        /** 放置英雄 */
        public PutHero(nPos, nHeroID) {
            // 目标位置当前英雄ID
            let nLastHeroID = this._PositionWar[nPos]
            // 目标英雄上一个位置
            let nLastPos = this._HeroWar[nHeroID]

            if (nLastHeroID != null) {
                this._HeroWar[nLastHeroID] = nLastPos
                this._bChange = true;
            }

            if (nLastPos != null) {
                this._PositionWar[nLastPos] = nLastHeroID
                this._bChange = true;
            }

            this._PositionWar[nPos] = nHeroID
            this._HeroWar[nHeroID] = nPos
        }

        public HeroWar_Info() {
            for (let key in MasterPlayer.Instance.player.HeroWarList) {
                this._putHero.push(MasterPlayer.Instance.player.HeroWarList[key]);
            }
            return this._putHero;
        }

    }

}
