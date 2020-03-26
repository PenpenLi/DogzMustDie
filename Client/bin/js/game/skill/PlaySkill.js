/*
* 角色技能
*/
var H52D_Framework;
(function (H52D_Framework) {
    /**玩家技能类 */
    var PlaySkill = /** @class */ (function () {
        /**初始化 */
        function PlaySkill() {
            /**玩家技能列表 */
            this._skillTab = [];
            this.bclose = false;
            this._dtime = 0;
            this.type = eCharacter_TYPE.PLAYER;
            this.SE = SkinEnum.SkinTap;
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.SPELL_SKILL, Laya.Handler.create(this, this.Spell));
            this.vo = H52D_Framework.MasterPlayer.Instance.player.vo;
            this._skillTab = [];
        }
        Object.defineProperty(PlaySkill, "Init", {
            get: function () {
                if (PlaySkill._init == null) {
                    PlaySkill._init = new PlaySkill();
                }
                return PlaySkill._init;
            },
            enumerable: true,
            configurable: true
        });
        /**初始化玩家技能 */
        PlaySkill.prototype.SetSkillIDList = function () {
            var x = H52D_Framework.MasterPlayer.Instance.player.SkillList;
            for (var k in x) {
                this.UpdateSkill(Number(k), x[k]);
            }
        };
        /**初始化玩家技能 */
        PlaySkill.prototype.UpdateSkill = function (index, id) {
            if (this._skillTab[index]) {
                this._skillTab[index].Destroy();
                this._skillTab[index] = null;
                var ret = new H52D_Framework.Skill(id, this, eBELONGS_TO.PLAYER);
                this._skillTab[index] = ret;
            }
            else {
                var ret = new H52D_Framework.Skill(id, this, eBELONGS_TO.PLAYER);
                this._skillTab[index] = ret;
            }
        };
        /**释放技能 */
        PlaySkill.prototype.Spell = function (index) {
            var skillId = H52D_Framework.MainRoleLogic.Instance.GetSkillID(index);
            this.UpdateSkill(index, skillId);
            if (index == 0) {
                this.DamageSkill();
            }
            else {
                this.BuffSkill(index);
            }
        };
        /**伤害型技能 */
        PlaySkill.prototype.DamageSkill = function () {
            var monster = H52D_Framework.BattleManager.Instance.MonsterFormation.Getobject;
            var captian = [];
            for (var k in monster) {
                var m = monster[k];
                if (m && m.vo.location == 4) {
                    captian.push(m);
                }
            }
            this._skillTab[0].SpellSkill(captian);
        };
        /**Buff类技能 */
        PlaySkill.prototype.BuffSkill = function (index) {
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/buff.mp3");
            var herolist = H52D_Framework.BattleManager.Instance.HeroCardMgr.CHeroList;
            this._skillTab[index].SpellSkill(herolist);
        };
        PlaySkill.prototype.AutoSkill = function () {
            if (H52D_Framework.BattleManager.Instance.MathcEnd)
                return;
            if (this.bclose) {
                this._dtime += 100;
            }
            var CMp = H52D_Framework.MasterPlayer.Instance.player.Mp;
            for (var k in this._skillTab) {
                if (this._skillTab[k] &&
                    !this._skillTab[k].IsCD &&
                    this.bclose &&
                    this._dtime >= 2000) {
                    if (CMp >= this._skillTab[k].Data.conMp) {
                        this._dtime = 0;
                        H52D_Framework.Event.DispatchEvent("OnSkillClick", [Number(k), false]);
                    }
                }
            }
        };
        PlaySkill.prototype.OnUpdate = function () {
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                this.AutoSkill();
            }
            for (var k in this._skillTab) {
                if (this._skillTab[k])
                    this._skillTab[k].OnUpdate();
            }
        };
        /**销毁 */
        PlaySkill.prototype.Destroy = function () {
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.SPELL_SKILL, Laya.Handler.create(this, this.Spell));
        };
        PlaySkill.prototype.Regist = function () {
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.SPELL_SKILL, Laya.Handler.create(this, this.Spell));
        };
        return PlaySkill;
    }());
    H52D_Framework.PlaySkill = PlaySkill;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PlaySkill.js.map