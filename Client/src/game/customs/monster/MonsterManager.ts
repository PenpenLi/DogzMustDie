module H52D_Framework {
    /**
     * 怪物管理类
     * @author zhangyusong
     */
    export class MonsterManager {
        /** 加载完成，回调 */
        private loadComplete: Laya.Handler;
        /** 怪物数据 */
        private data: Array<MonsterVo>;
        /** 怪物模型列表 key：怪物ID */
        private _monsterList: { [key: number]: Monster };
        /** 战位索引 */
        private static index: number;

        private static _instance: MonsterManager;
        public static get Instance(): MonsterManager {
            if (this._instance == null) {
                this._instance = new MonsterManager();
            }
            return this._instance;
        }

        public constructor() {
        }

        public get monsterList() {
            return this._monsterList;
        }

        /**
         * 管理类设置数据
         * @param data
         * @constructor
         */
        public DataInit(obj: Object): void {
            this.data = new Array<MonsterVo>();
            for (let _id in obj) {
                let vo: MonsterVo = new MonsterVo(Number(_id))
                vo.location = obj[_id] - 1;
                this.data.push(vo);
            }
        }

        public GetMonsterByID(id) {
            if (this.monsterList[id]) {
                return this.monsterList[id];
            }
        }

        /**
         * 加载资源
         * @param callBack 加载完成时回调
         * @constructor
         */
        public Initialize(callBack: Laya.Handler) {
            this.loadComplete = callBack;
            this._monsterList = {};
            MonsterManager.index = 0;
            //循环加载怪物
            this.loadMonster();
        }

        /** 清除所有怪物 */
        public Destroy() {
            if (this._monsterList) {
                let kaylist = [];
                for (let index in this._monsterList) {
                    kaylist.push(index);
                }
                let Len = kaylist.length;
                for (let i = 0; i < Len; i++) {
                    if (this._monsterList[kaylist[i]]) {
                        this._monsterList[kaylist[i]].Destroy();
                        this._monsterList[kaylist[i]] = null;
                    }
                }
                kaylist = [];
            }
            MonsterManager.index = 0;
            this._monsterList = {};
        }

        private loadMonster(): void {
            let _hp: number = 0;
            let _name: string = "";
            for (let md in this.data) {
                let vo: MonsterVo = this.data[md];
                let monster: Monster = new Monster(vo);
                //队长位
                if (vo.location == 4) {
                    _name = vo.name;
                }
                let scale: number = vo.modelScale;
                let x = MonsterLocal[vo.location][0] * G_StageWidthScale;
                let y = MonsterLocal[vo.location][1];
                //阴影大小
                let shadow: number = MonstorConfig[vo.id]["shadow"];
                _hp += vo.attr.GetAttributeValue(1);
                let dir = CustomsManager.Instance.CustomsType == Customs_Type.Memory ? -1 : 1;
                monster.LoadMonster(dir, scale, x, y, shadow, vo.location,
                    Laya.Handler.create(this, () => {
                        this._monsterList[MonsterManager.index] = monster;
                        MonsterManager.index++;
                        if (MonsterManager.index >= this.data.length) {
                            Event.DispatchEvent(EventDefine.CUSTOMS_BASEINFOR, { "monster_name": _name, "blood": _hp });
                            this.loadComplete.run();
                        }
                    }));
            }
        }


        public MonsterAttack() {
            let monster = this.monsterList;
            for (let k in monster) {
                if (monster[k]) {
                    let r = Math.random() * 95;
                    let s = Math.random() * 200 - 100;
                    let time = s * (r / 100);
                    Tick.Once(time, this, () => {
                        monster[k].Close = false;
                    });
                }
            }
        }


    }
}