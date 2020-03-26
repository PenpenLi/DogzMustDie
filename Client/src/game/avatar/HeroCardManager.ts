/**玩家英雄类 */
module H52D_Framework {
    export class HeroCardManager {


        /**英雄布阵存储信息 */
        private _heroWar: Array<number>;
        /**归属者id */
        private _ascriptionId: number;
        /** 归属者的ID */
        private _readJson: ConfigManager;
        /** 加载完成，回调 */
        private loadComplete: Laya.Handler;

        private static _init: HeroCardManager;
        public static index: number;
        private static _MaxI = 0;
        private static _isonce = false;
        private static _IndexE = 0.1;

        public static get Instance() {
            if (HeroCardManager._init == null) {
                HeroCardManager._init = new HeroCardManager();
            }
            return HeroCardManager._init;
        }

        public get AscriptionId(): number {
            return this._ascriptionId;
        }

        private _CHeroList: Array<HeroCard>;
        public get CHeroList() {
            return this._CHeroList;
        }

        /**初始化 */
        constructor() {
            RemoteCall.Instance.RegistJXS2CProtocol("C_HeartBeat", this);
            this._CHeroList = [];
        }


        public GetHeroCardByid(id: number) {
            for (let k in this._CHeroList) {
                if (this._CHeroList[k]) {
                    if (this._CHeroList[k].vo.nHeroID == id) {
                        return this._CHeroList[k];
                    }
                }
            }
        }


        private data: Array<HeroInfo> = [];

        public DataInit(Obj: Object): void {
            HeroCardManager._IndexE += 0.1;
            this.data = new Array<HeroInfo>();
            for (let _id in Obj) {
                let vo: HeroInfo = HeroManager.Instance.GetHero(Obj[_id]);
                vo.location = Number(_id);
                this.data.push(vo);
            }
            if (this.data.length == 9) {
                HeroCardManager._MaxI += 0.1;
            }
        }

        public static _index: number = 0;

        public AvatarInit(callBack: Laya.Handler): void {
            this.loadComplete = callBack;
            let Len = GetTabLength(this.CHeroList);
            if (CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                this.DataInit(MemoryLogic.Instance.war);
            }
            else if (CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                if (GetTabLength(MatchLogic.Instance.war) != 0) {
                    this.DataInit(MatchLogic.Instance.war);
                }
                else {
                    this.DataInit(MasterPlayer.Instance.player.HeroWarList);
                }
            }
            else {
                this.DataInit(MasterPlayer.Instance.player.HeroWarList);
            }

            if (Len < 9 && Len > 0) {
                HeroCardManager._index = Len + 1;
            }
            if (Len > 0) {
                for (let i = Len - 1; i >= 0; i--) {
                    if (this.CHeroList[i]) {
                        this.CHeroList[i].Destroy();
                        this.CHeroList[i] = null;
                    }
                }
            }
            HeroCardManager.index = 0;
            //加载英雄
            this.loadHero();
            MHAManager.Instance.LUpdate();
        }

        // private _index = 0;
        private _loadone = false;
        private loadHero(): void {
            for (let i = 0; i < this.data.length; i++) {
                let hero: HeroCard = new HeroCard(this.data[i]);
                let dir: number = 1;
                let id: number = this.data[i].nHeroID;
                let scale: number = HeroConfig[id]["modelScale"];
                let x = HeroLocal[this.data[i]["location"]][0] * G_StageWidthScale;
                let y = HeroLocal[this.data[i]["location"]][1];
                this._CHeroList[i] = hero;
                hero.LoadMoudle(dir, scale, x, y, 0, false);
            }
            Tick.Loop(100, this, this.LoadUpdate);
        }

        private LoadUpdate() {
            for (let k in this._CHeroList) {
                if (this._CHeroList[k].avatar) {
                    this._CHeroList[k].bLoadDown = true;
                }
            }
            if (this.isLoad && !this._loadone) {
                this._loadone = true;
                Tick.Clear(this, this.LoadUpdate);
                if (HeroCardManager._MaxI > 0.1 || HeroCardManager._IndexE > 0.2 && HeroCardManager._MaxI == 0.1 ||
                    HeroCardManager._IndexE > 0.2 && HeroCardManager._MaxI == 0) {
                    if (this._CHeroList && this._CHeroList.length > 0) {
                        if (this._CHeroList.length <= 5 && this._CHeroList.length > 1) {
                            this._CHeroList[this._CHeroList.length - 2].ChangeEffect();
                        }
                        else {
                            this._CHeroList[this._CHeroList.length - 1].ChangeEffect();
                        }
                    }
                }
                if (HeroCardManager._IndexE <= 0.2) {
                    MHAManager.Instance.InitS();
                }
                else {
                    MHAManager.Instance.LUpdate();
                }
                this.HeroLoadComplete();
            }
        }



        private get isLoad() {
            for (let k in this._CHeroList) {
                if (!this._CHeroList[k].bLoadDown) {
                    return false;
                }
            }
            return true;
        }


        private HeroLoadComplete(): void {
            this.SortTospeed();
            /**所有英雄伤害之和 */
            if (BattleManager.Instance.aIOperation)
                BattleManager.Instance.aIOperation.Dps();
            this.loadComplete.run();
            this._loadone = false;
        }

        public OnEffectPassive() {
            for (let k in this.CHeroList) {
                if (this.CHeroList[k]) {
                    this.CHeroList[k].OnEffectPassive();
                }
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
                let hc = hf[i] as HeroCard;
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
                    let firstHero = hf[len] as HeroCard;
                    let F = firstHero.vo.ToSpeed;
                    time = X + (F - hc.vo.ToSpeed) * Y;
                }
                Tick.Once(time, this, () => {
                    hc.Close = false;
                });
            }
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
        }


    }
}