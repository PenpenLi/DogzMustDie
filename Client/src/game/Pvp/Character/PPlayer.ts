/*
* 主角战斗类
*/
module H52D_Framework {

    export class PPlayer {
        public type: eCharacter_TYPE;
        /**玩家数据 */
        public vo: PPlayerInfo;
        public SE: SkinEnum.SkinTap;
        private _btype: number = 0;
        /**伤害技能目标 */
        public target_D = [];
        /**Buff技能目标 */
        public Target_B = [];
        public bclose: boolean = false;
        private _dtime = 0;
        /**玩家技能列表 */
        private _skillTab: Array<PSkill> = [];
        private _target_a = null;
        
        /**初始化 */
        constructor(btype: number, vo: any) {
            this._btype = btype;
            this.vo = vo;
            this._target_a = new Formation();
            this.type = eCharacter_TYPE.PLAYER;
            this.SE = SkinEnum.SkinTap;
            this.SetSkillIDList();
            if (this._btype == 1) {
                PlaySkill.Init.Destroy();
                Event.RegistEvent(EventDefine.SPELL_SKILL, Laya.Handler.create(this, this.Spell))
            }
        }

        public ImValue() {
            let attr = this.vo.attr as Attribute;
            let a = attr.GetAttributeTypeValue(22, eValueType.Percent);
            let d = attr.GetAttributeTypeValue(23, eValueType.Percent);
            let aa = attr.GetAttributeTypeValue(24, eValueType.Percent);
            let pet = attr.GetAttributeTypeValue(25, eValueType.Percent);
            let camp = attr.GetAttributeTypeValue(26, eValueType.Percent);
            let alld = attr.GetAttributeTypeValue(27, eValueType.Percent);
            let dstr = "";
            if (this._btype == 1) {
                dstr = "O_"
            }
            else {
                dstr = "E_"
            }
            let basedamage = attr.GetAttributeTypeValue(2, eValueType.Base);
            let hpp = attr.GetAttributeValue(1);
            let lc = this.vo.location + 1;
            let sttt = "[" + lc + "]_" + "<" + dstr + this.vo.name + ">_";
            let str = "攻击型减免_" + a + " 防御型减免_" + d + " 所有英雄减免_" + a;
            let str2 = "宠物减免_" + pet + " 阵营减免_" + camp + " 所有伤害减免_" + alld;
            DamageShow.Instance.SetText(sttt);
            DamageShow.Instance.SetText(str);
            DamageShow.Instance.SetText(str2);
            DamageShow.Instance.SetText(" 基础伤害 " + "<" + basedamage + ">" +
                "面板血量 " + "<" + hpp + ">");
        }
        
        /**初始化玩家技能 */
        private SetSkillIDList() {
            if (this.vo) {
                for (let i in this.vo.SkillList) {
                    this._skillTab[i] = new PSkill(this.vo.SkillList[i], this, this._btype, eBELONGS_TO.PLAYER);
                }
            }
        }

        /**释放技能 */
        private Spell(index: number): void {
            let skillId = MainRoleLogic.Instance.GetSkillID(index)//  1
            if (index == 0) {
                this.DamageSkill();
            }
            else {
                this.BuffSkill(index);
            }
        }

        /**伤害型技能 */
        public DamageSkill(): void {
            let tar = this._target_a.SetTarget(this.target_D,
                this._skillTab[0].Data.hitEnemyMode, this._skillTab[0].Data.hitEnemyNum);
            this._skillTab[0].SpellSkill(tar);
        }

        /**Buff类技能 */
        public BuffSkill(index: number): void {
            SoundManager.Instance.OnPlaySound("res/sound/buff.mp3");
            this._skillTab[index].SpellSkill(this.Target_B);
        }

        public OnUpdate() {
            this.SkillUpdate();
            if (this._btype == -1) {
                this.AutoSkill();
            }
            if (CustomsManager.Instance.CustomsType == Customs_Type.MatchChampion) {
                this.AutoSkill();
            }
        }


        private AutoSkill() {
            if (this.bclose) {
                this._dtime += 100;
            }
            for (let k in this._skillTab) {
                if (this._skillTab[k] &&
                    !this._skillTab[k].IsCD &&
                    this.bclose &&
                    this._dtime >= 2000 &&
                    this.vo.CMp >= this._skillTab[k].Data.conMp) {
                    this._dtime = 0;
                    this.vo.CMp -= this._skillTab[k].Data.conMp;
                    if (Number(k) == 0) {
                        let tar = this._target_a.SetTarget(this.target_D,
                            this._skillTab[k].Data.hitEnemyMode, this._skillTab[k].Data.hitEnemyNum);
                        this._skillTab[k].SpellSkill(tar);
                    }
                    else {
                        this._skillTab[k].SpellSkill(this.Target_B);
                    }
                }
            }
        }


        private SkillUpdate() {
            for (let k in this._skillTab) {
                if (this._skillTab[k])
                    this._skillTab[k].OnUpdate();
            }
        }

        /**销毁 */
        public Destroy(): void {
            if (this._btype == 1) {
                PlaySkill.Init.Regist();
                Event.RemoveEvent(EventDefine.SPELL_SKILL, Laya.Handler.create(this, this.Spell))
            }
            for (let i in this.vo.SkillList) {
                if (this._skillTab[i])
                    this._skillTab[i].Destroy();
            }
            this._skillTab = [];
        }

    }
}
