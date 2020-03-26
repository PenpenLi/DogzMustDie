module H52D_Framework {
    /**PVP数据管理 */
    export class PHeroCradMgr {
        /** 加载完成，回调 */
        private loadComplete: Laya.Handler;
        private _CHeroList: Array<PHeroCrad>;
        public get CHeroList() { return this._CHeroList; }
        private _type: number = 0;
        private _index: number = 0;

        /**初始化 */
        constructor(type: number) {
            this._type = type;
            this._CHeroList = [];
        }

        public GetHeroCardByid(id: number) {
            for (let k in this._CHeroList) {
                if (this._CHeroList[k]) {
                    if (this._CHeroList[k].vo.id == id) {
                        return this._CHeroList[k];
                    }
                }
            }
        }

        public OnUpdate() {
            for (let k in this._CHeroList) {
                if (this._CHeroList[k]) {
                    this._CHeroList[k].OnUpdate();
                }
            }
            for (let i = this._CHeroList.length; i >= 0; i--) {
                if (this._CHeroList[i] && this._CHeroList[i].IsDie) {
                    this._CHeroList[i] = null;
                }
            }
        }

        private Info: Array<PheroInfo> = [];
        public AvatarInit(callBack: Laya.Handler, info: Array<PheroInfo>): void {
            this.loadComplete = callBack;
            this.Info = info;
            this._CHeroList = [];
            this._index = 0;
            //加载英雄
            this.loadHero();
        }

        private loadHero(): void {
            for (let key = 0; key < this.Info.length; key++) {
                let hero: PHeroCrad = new PHeroCrad(this.Info[key], this._type);
                let dir: number = 1;
                let id: number = this.Info[key].id;
                let scale: number = HeroConfig[id]["modelScale"];
                let x = 0;
                let y = 0;
                let location = hero.vo.location;
                if (this._type == 1) {
                    x = HeroLocal[location][0] * G_StageWidthScale;
                    y = HeroLocal[location][1];
                    dir = 1;
                }
                else {
                    x = MonsterLocal[location][0] * G_StageWidthScale;
                    y = MonsterLocal[location][1];
                    dir = -1;
                }
                this._CHeroList.push(hero);
                
                hero.LoadMoudle(id, dir, scale, x, y, 0, Laya.Handler.create(this, () => {
                    this._index++;
                    if (this._index >= this.Info.length) {
                        this.HeroLoadComplete();
                    }
                }));
            }
        }


        private HeroLoadComplete(): void {
            this.SortTospeed();
            if (this.loadComplete) {
                this.loadComplete.run();
            }
        }


        public TospeedList = [];
        private SortTospeed(): void {
            this.TospeedList = this._CHeroList.concat();
            /**英雄表长度 */
            let Length = this.TospeedList.length;
            /**用先手速度排序 最慢的是0 */
            for (let i = 0; i < Length; i++) {
                for (let j = i + 1; j < Length; j++) {
                    if (this.TospeedList[i] && this.TospeedList[j]) {
                        if (this.TospeedList[i].vo.ToSpeed > this.TospeedList[j].vo.ToSpeed) {
                            let current = this.TospeedList[i];
                            this.TospeedList[i] = this.TospeedList[j];
                            this.TospeedList[j] = current;
                        }
                    }
                }
            }
        }

        public HeroAttack(): void {
            let hf = this.TospeedList;
            if (!hf) return;
            let len = hf.length - 1;
            for (let i: number = len; i >= 0; i--) {
                let hc = hf[i] as PHeroCrad;
                if (!hc) return;
                let time = 0;
                /**第一位出手英雄 */
                let X = GameParamConfig["FastestHeroFirstAttackTime"];
                /**其他英雄出手 */
                let Y = GameParamConfig["OtherHeroFirstAttackTimeRatio"];
                if (i == len) {
                    time = X;
                }
                else {
                    let firstHero = hf[len] as PHeroCrad;
                    let F = firstHero.vo.ToSpeed;
                    time = X + (F - hc.vo.ToSpeed) * Y;
                }
                // hc.InitTimer(time, Laya.Handler.create(this, () => {
                //     hc.BClose = false;
                // }));
                Tick.Once(time, this, () => {
                    hc.BClose = false;
                });
            }
            // this._OpenTimer = true;
        }

        /**销毁 */
        public Destroy() {
            if (this._CHeroList) {
                for (let i = 0; i < GetTabLength(this._CHeroList); i++) {
                    if (this._CHeroList[i]) {
                        this._CHeroList[i].Destroy();
                        this._CHeroList[i] = null;
                    }
                }
                this._CHeroList = [];
            }
            this.TospeedList = [];
        }


        public show() {
            if (this._CHeroList) {
                for (let i = 0; i < GetTabLength(this._CHeroList); i++) {
                    if (this._CHeroList[i]) {
                        this._CHeroList[i].ImValue();
                    }
                }
            }
        }



    }
}