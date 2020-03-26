/*
* 角色技能
*/
module H52D_Framework {
    /**玩家技能类 */
    export class PlaySkill {
        private static _init: PlaySkill;
        public static get Init() {
            if (PlaySkill._init == null) {
                PlaySkill._init = new PlaySkill();
            }
            return PlaySkill._init;
        }
        public type: eCharacter_TYPE;
        /**玩家数据 */
        public vo: PlayerVo;
        /**玩家技能列表 */
        private _skillTab: Array<Skill> = [];
        public SE: SkinEnum.SkinTap;
        /**初始化 */
        constructor() {
            this.type = eCharacter_TYPE.PLAYER;
            this.SE = SkinEnum.SkinTap;
            Event.RegistEvent(EventDefine.SPELL_SKILL, Laya.Handler.create(this, this.Spell));
            this.vo = MasterPlayer.Instance.player.vo;
            this._skillTab = [];
        }


        /**初始化玩家技能 */
        public SetSkillIDList() {
            let x = MasterPlayer.Instance.player.SkillList;
            for (let k in x) {
                this.UpdateSkill(Number(k), x[k]);
            }
        }


        /**初始化玩家技能 */
        public UpdateSkill(index, id) {
            if (this._skillTab[index]) {
                this._skillTab[index].Destroy();
                this._skillTab[index] = null;
                let ret = new Skill(id, this, eBELONGS_TO.PLAYER);
                this._skillTab[index] = ret;
            }
            else {
                let ret = new Skill(id, this, eBELONGS_TO.PLAYER);
                this._skillTab[index] = ret;
            }
        }

        /**释放技能 */
        private Spell(index: number): void {
            let skillId = MainRoleLogic.Instance.GetSkillID(index)
            this.UpdateSkill(index, skillId);
            if (index == 0) {
                this.DamageSkill();
            }
            else {
                this.BuffSkill(index);
            }
        }

        /**伤害型技能 */
        public DamageSkill(): void {
            let monster = BattleManager.Instance.MonsterFormation.Getobject;
            let captian = [];
            for (let k in monster) {
                let m = monster[k];
                if (m && m.vo.location == 4) {
                    captian.push(m);
                }
            }
            this._skillTab[0].SpellSkill(captian);
        }

        /**Buff类技能 */
        public BuffSkill(index: number): void {
            SoundManager.Instance.OnPlaySound("res/sound/buff.mp3");
            let herolist = BattleManager.Instance.HeroCardMgr.CHeroList;
            this._skillTab[index].SpellSkill(herolist);
        }

        public bclose: boolean = false;
        private _dtime = 0;

        private AutoSkill() {
            if(BattleManager.Instance.MathcEnd) return;
            if (this.bclose) {
                this._dtime += 100;
            }
            let CMp = MasterPlayer.Instance.player.Mp;
            for (let k in this._skillTab) {
                if (this._skillTab[k] &&
                    !this._skillTab[k].IsCD &&
                    this.bclose &&
                    this._dtime >= 2000) {
                    if (CMp >= this._skillTab[k].Data.conMp)  {
                        this._dtime = 0;
                        Event.DispatchEvent("OnSkillClick", [Number(k), false]);
                    }
                }
            }
        }

        public OnUpdate() {
            if (CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                this.AutoSkill();
            }
            for (let k in this._skillTab) {
                if (this._skillTab[k])
                    this._skillTab[k].OnUpdate();
            }
        }


        /**销毁 */
        public Destroy(): void {
            Event.RemoveEvent(EventDefine.SPELL_SKILL, Laya.Handler.create(this, this.Spell));
        }

        public Regist()  {
            Event.RegistEvent(EventDefine.SPELL_SKILL, Laya.Handler.create(this, this.Spell));
        }
    }
}
