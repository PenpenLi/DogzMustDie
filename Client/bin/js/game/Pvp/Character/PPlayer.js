/*
* 主角战斗类
*/
var H52D_Framework;
(function (H52D_Framework) {
    var PPlayer = /** @class */ (function () {
        /**初始化 */
        function PPlayer(btype, vo) {
            this._btype = 0;
            /**伤害技能目标 */
            this.target_D = [];
            /**Buff技能目标 */
            this.Target_B = [];
            this.bclose = false;
            this._dtime = 0;
            /**玩家技能列表 */
            this._skillTab = [];
            this._target_a = null;
            this._btype = btype;
            this.vo = vo;
            this._target_a = new H52D_Framework.Formation();
            this.type = eCharacter_TYPE.PLAYER;
            this.SE = SkinEnum.SkinTap;
            this.SetSkillIDList();
            if (this._btype == 1) {
                H52D_Framework.PlaySkill.Init.Destroy();
                H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.SPELL_SKILL, Laya.Handler.create(this, this.Spell));
            }
        }
        PPlayer.prototype.ImValue = function () {
            var attr = this.vo.attr;
            var a = attr.GetAttributeTypeValue(22, H52D_Framework.eValueType.Percent);
            var d = attr.GetAttributeTypeValue(23, H52D_Framework.eValueType.Percent);
            var aa = attr.GetAttributeTypeValue(24, H52D_Framework.eValueType.Percent);
            var pet = attr.GetAttributeTypeValue(25, H52D_Framework.eValueType.Percent);
            var camp = attr.GetAttributeTypeValue(26, H52D_Framework.eValueType.Percent);
            var alld = attr.GetAttributeTypeValue(27, H52D_Framework.eValueType.Percent);
            var dstr = "";
            if (this._btype == 1) {
                dstr = "O_";
            }
            else {
                dstr = "E_";
            }
            var basedamage = attr.GetAttributeTypeValue(2, H52D_Framework.eValueType.Base);
            var hpp = attr.GetAttributeValue(1);
            var lc = this.vo.location + 1;
            var sttt = "[" + lc + "]_" + "<" + dstr + this.vo.name + ">_";
            var str = "攻击型减免_" + a + " 防御型减免_" + d + " 所有英雄减免_" + a;
            var str2 = "宠物减免_" + pet + " 阵营减免_" + camp + " 所有伤害减免_" + alld;
            H52D_Framework.DamageShow.Instance.SetText(sttt);
            H52D_Framework.DamageShow.Instance.SetText(str);
            H52D_Framework.DamageShow.Instance.SetText(str2);
            H52D_Framework.DamageShow.Instance.SetText(" 基础伤害 " + "<" + basedamage + ">" +
                "面板血量 " + "<" + hpp + ">");
        };
        /**初始化玩家技能 */
        PPlayer.prototype.SetSkillIDList = function () {
            if (this.vo) {
                for (var i in this.vo.SkillList) {
                    this._skillTab[i] = new H52D_Framework.PSkill(this.vo.SkillList[i], this, this._btype, eBELONGS_TO.PLAYER);
                }
            }
        };
        /**释放技能 */
        PPlayer.prototype.Spell = function (index) {
            var skillId = H52D_Framework.MainRoleLogic.Instance.GetSkillID(index); //  1
            if (index == 0) {
                this.DamageSkill();
            }
            else {
                this.BuffSkill(index);
            }
        };
        /**伤害型技能 */
        PPlayer.prototype.DamageSkill = function () {
            var tar = this._target_a.SetTarget(this.target_D, this._skillTab[0].Data.hitEnemyMode, this._skillTab[0].Data.hitEnemyNum);
            this._skillTab[0].SpellSkill(tar);
        };
        /**Buff类技能 */
        PPlayer.prototype.BuffSkill = function (index) {
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/buff.mp3");
            this._skillTab[index].SpellSkill(this.Target_B);
        };
        PPlayer.prototype.OnUpdate = function () {
            this.SkillUpdate();
            if (this._btype == -1) {
                this.AutoSkill();
            }
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.MatchChampion) {
                this.AutoSkill();
            }
        };
        PPlayer.prototype.AutoSkill = function () {
            if (this.bclose) {
                this._dtime += 100;
            }
            for (var k in this._skillTab) {
                if (this._skillTab[k] &&
                    !this._skillTab[k].IsCD &&
                    this.bclose &&
                    this._dtime >= 2000 &&
                    this.vo.CMp >= this._skillTab[k].Data.conMp) {
                    this._dtime = 0;
                    this.vo.CMp -= this._skillTab[k].Data.conMp;
                    if (Number(k) == 0) {
                        var tar = this._target_a.SetTarget(this.target_D, this._skillTab[k].Data.hitEnemyMode, this._skillTab[k].Data.hitEnemyNum);
                        this._skillTab[k].SpellSkill(tar);
                    }
                    else {
                        this._skillTab[k].SpellSkill(this.Target_B);
                    }
                }
            }
        };
        PPlayer.prototype.SkillUpdate = function () {
            for (var k in this._skillTab) {
                if (this._skillTab[k])
                    this._skillTab[k].OnUpdate();
            }
        };
        /**销毁 */
        PPlayer.prototype.Destroy = function () {
            if (this._btype == 1) {
                H52D_Framework.PlaySkill.Init.Regist();
                H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.SPELL_SKILL, Laya.Handler.create(this, this.Spell));
            }
            for (var i in this.vo.SkillList) {
                if (this._skillTab[i])
                    this._skillTab[i].Destroy();
            }
            this._skillTab = [];
        };
        return PPlayer;
    }());
    H52D_Framework.PPlayer = PPlayer;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PPlayer.js.map