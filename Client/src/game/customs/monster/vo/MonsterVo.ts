module H52D_Framework {
    /**
     * 怪物数据模型
     * @author zhangyusong
     */
    export class MonsterVo {
        // 怪物ID
        public id: number;
        private cfg: any;
        // 怪物名字	
        public get name(): string {
            let n = GetInfoAttr.Instance.GetText(this.cfg["NameId"]);
            if (!n) n = "任性的Boss";
            return n;
        };
        // 怪物头像	
        public get strHeadIcon(): string { return this.cfg["strHeadIcon"] };
        // 怪物模型	
        public get strModelId(): string { return this.cfg["strModelId"] };
        // 模型缩放比例	
        public get modelScale(): number { return this.cfg["modelScale"] };
        // 怪物类型	
        public get monType(): number { return this.cfg["MonType"] };
        // 怪物技能	
        public get skillId(): number { return this.cfg["skillId"] };
        // 掉落ID	
        public get dropRewardId(): number { return this.cfg["dropRewardId"] };
        // 血条数量	
        public get hpListNum(): number { return this.cfg["HpListNum"] };

        /** 怪物闪光亮度 */
        public get modlight(): number { return this.cfg["Modlight"] };

        public get allDamgeReduction() {
            let ad = this.cfg["allDamgeReduction"];
            if (ad == 0) { ad = 1; }
            else if (ad < 10000) {
                ad = 1 - this.cfg["allDamgeReduction"] / 10000;
            }
            else if (ad >= 10000) {
                ad = 0;
            }
            return ad;
        }

        public attr: Attribute;
        // 战位
        public location: number;
        //_________战斗属性//
        /**最大生命 */
        public MaxHP: number;
        /**当前生命 */
        public CurrentHP: number;
        public get attackid() { return this.cfg["attackId"]; }
        public get captainid() { return this.cfg["SkillId"]; }
        /**列*/
        public colNum: number;
        /**排*/
        public rowNum: number;
        /**是不是Boss*/
        public get boss(): boolean {
            return this.monType == 2
        }


        public constructor(_id: number) {
            this.attr = new Attribute();
            this.id = _id;
            this.cfg = MonstorConfig[this.id]
            this.attr.SetAttributeValue(1, eValueType.Base, this.cfg["hp"]);
            this.attr.SetAttributeValue(2, eValueType.Base, this.cfg["damage"]);
            this.attr.SetAttributeValue(4, eValueType.Base, this.cfg["critProbability"]);
            this.attr.SetAttributeValue(5, eValueType.Base, this.cfg["critDamgeRatio"])
            /**战斗属性 */
            this.MaxHP = this.attr.GetAttributeValue(1);
            this.CurrentHP = this.MaxHP;
        }


        public SetCol() {
            if (this.location == 0 || this.location == 1 || this.location == 2) {
                this.rowNum = 1;
            }
            if (this.location == 3 || this.location == 4 || this.location == 5) {
                this.rowNum = 2;
            }
            if (this.location == 6 || this.location == 7 || this.location == 8) {
                this.rowNum = 3;
            }
            if (this.location == 0 || this.location == 3 || this.location == 6) {
                this.colNum = 1;
            }
            if (this.location == 1 || this.location == 4 || this.location == 7) {
                this.colNum = 2;
            }
            if (this.location == 2 || this.location == 5 || this.location == 8) {
                this.colNum = 3;
            }
        }

    }
}