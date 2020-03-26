var H52D_Framework;
(function (H52D_Framework) {
    /**PVP人物 */
    var Character = /** @class */ (function () {
        /**初始化 */
        function Character(btype, bbool) {
            this._id = 0;
            this.CCTarget = [];
            /**攻击目标 */
            this._target = [];
            this._order = 0;
            this._PosX = 0;
            this._PosY = 0;
            /**被动技能列表 */
            this._passiveSkillList = [];
            this._bClose = true;
            this._currentHp = 0;
            this._btype = 1;
            this.CaptainTarget = [];
            this.IsDie = false;
            this.bAttack = false;
            this._bcaptain = false;
            this._target_a = null;
            this._btype = btype;
            this._bcaptain = false;
            this._target_a = new H52D_Framework.Formation();
        }
        Object.defineProperty(Character.prototype, "ID", {
            get: function () { return this._id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Character.prototype, "Target", {
            get: function () { return this._target; },
            /**攻击目标 */
            set: function (value) { this._target = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Character.prototype, "avatar", {
            get: function () { return this._avatar; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Character.prototype, "vo", {
            /**数据模型*/
            get: function () { return this._dataVo; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Character.prototype, "Order", {
            /**人物层级 */
            get: function () { return this._order; },
            enumerable: true,
            configurable: true
        });
        /**设置人物层级 */
        Character.prototype.SetOrderZ = function (i) {
            this._order = i;
            this._avatar.SetOrder(i);
        };
        Object.defineProperty(Character.prototype, "PosY", {
            /**人物位置Y坐标 */
            get: function () { return this._PosY; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Character.prototype, "PosX", {
            /**人物位置X坐标 */
            get: function () { return this._PosX; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Character.prototype, "BClose", {
            /**是否关闭战斗 */
            get: function () { return this._bClose; },
            set: function (Value) { this._bClose = Value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Character.prototype, "bCaptain", {
            get: function () { return this._bcaptain; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Character.prototype, "attackSkill", {
            get: function () { return this._attackskill; },
            enumerable: true,
            configurable: true
        });
        Character.prototype.setCurrentHp = function (value) {
            this._currentHp = value;
        };
        /**初始化英雄技能 */
        Character.prototype.InitSkill = function () {
            /**初始化英雄普攻 */
            this._attackskill = new H52D_Framework.PSkill(this.vo.skillid[0], this, this._btype, eBELONGS_TO.ATTACK);
            /**是队长就初始化队长技能 */
            if (this.vo.location == 4) {
                this._bcaptain = true;
                this._captainSkill = new H52D_Framework.PSkill(this.vo.skillid[1], this, this._btype, eBELONGS_TO.BIG);
            }
        };
        /**获取当前动画时间 */
        Character.prototype.GetAniDuration = function () {
            return this._avatar.GetAniDuration();
        };
        /**出生特效 */
        Character.prototype.ChangeEffect = function () {
            var _this = this;
            var oldScale = this.vo.Scla;
            this._avatar.scale = 0;
            H52D_Framework.TweenList.to(this, this._avatar, { scale: oldScale }, 250, function () {
                if (!_this._avatar)
                    return;
                _this._avatar.scale = oldScale;
            });
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/boss_appear2.mp3");
            if (this._brithAvatar) {
                this._brithAvatar.Play("effect_state_qiehuan", false);
            }
            else {
                this._brithAvatar = new H52D_Framework.Avatar(H52D_Framework.AvatarEffectRoot);
                this._brithAvatar.Load("res/effect/effect_state_qiehuan/effect_state_qiehuan.sk", 1, 0.4, this.PosX, this.PosY - 78, Laya.Handler.create(this, function () {
                    _this._brithAvatar.Play("effect_state_qiehuan", false);
                }));
            }
        };
        /**释放队长技能 */
        Character.prototype.SpellCaptainSkill = function () {
        };
        /**普通攻击 */
        Character.prototype.SpellAttackSkill = function () {
            var _this = this;
            if (!this._target || !this._attackskill)
                return;
            this.bAttack = true;
            this._avatar.Play(H52D_Framework.AnimationName.attack, false, true, function () {
                _this.bAttack = false;
                _this.Idle();
            });
            this._attackskill.SpellSkill(this._target);
        };
        /** 待机 */
        Character.prototype.Idle = function () {
            if (!this._avatar)
                return;
            this._avatar.Play(H52D_Framework.AnimationName.idle, true);
        };
        /** 被击 */
        Character.prototype.Hit = function () {
            var _this = this;
            if (!this._avatar || this.bAttack || this.IsDie)
                return;
            this._avatar.Play(H52D_Framework.AnimationName.hit, false, true, function () {
                _this.Idle();
            });
        };
        /** 死亡 */
        Character.prototype.Die = function () {
            var _this = this;
            if (!this._avatar)
                return;
            this._avatar.Play(H52D_Framework.AnimationName.die, false, true, function () {
                _this.Destroy();
            });
        };
        /** 受伤 */
        Character.prototype.OnHurt = function (be, owr, damage, e, iscrit, type, viewRoot) {
            if ((this._currentHp <= 0) || this.IsDie || this._avatar == null) {
                return;
            }
            if (type != SPECIAL_TYPE.SUSRAINED) {
                this.Hit();
            }
            H52D_Framework.Floating.DamageText(damage.toString(), e, this.PosX, this.PosY - 100, iscrit);
            this.setCurrentHp(this._currentHp - damage);
            var Bbji = "";
            if (iscrit) {
                Bbji = "暴击";
            }
            else {
                Bbji = " ";
            }
            var str = "";
            var oloc = 0;
            if (!owr.vo)
                return;
            if (owr.vo && owr.vo.location) {
                oloc = owr.vo.location + 1;
            }
            var eloc = this.vo.location + 1;
            var dtype = "普攻";
            if (be == eBELONGS_TO.BIG) {
                dtype = " 队长技能";
            }
            if (this._btype == 1) {
                str = "敌方【" + oloc + "】位置 [" + owr.vo.name + "]" + "使用【" + dtype + "】对我方【" +
                    eloc + "】位置 [" + this.vo.name + "] 造成 " + Bbji + damage.toString() + " 伤害";
            }
            else {
                str = "我方【" + oloc + "】位置 [" + owr.vo.name + "] " + "使用【" + dtype + "】对敌方【" +
                    eloc + "】位置 [" + this.vo.name + "] 造成 " + Bbji + damage.toString() + " 伤害";
            }
            H52D_Framework.DamageShow.Instance.SetText(str);
        };
        Character.prototype.ImValue = function () {
            var attr = this.vo.attr;
            var jm = attr.GetAttributeTypeValue(21, H52D_Framework.eValueType.Percent);
            var a = attr.GetAttributeTypeValue(22, H52D_Framework.eValueType.Percent);
            var d = attr.GetAttributeTypeValue(23, H52D_Framework.eValueType.Percent);
            var aa = attr.GetAttributeTypeValue(24, H52D_Framework.eValueType.Percent);
            var pet = attr.GetAttributeTypeValue(25, H52D_Framework.eValueType.Percent);
            var camp = attr.GetAttributeTypeValue(26, H52D_Framework.eValueType.Percent);
            var alld = attr.GetAttributeTypeValue(27, H52D_Framework.eValueType.Percent);
            var aj = attr.GetAttributeTypeValue(2, H52D_Framework.eValueType.Percent);
            var bjm = attr.GetAttributeTypeValue(21, H52D_Framework.eValueType.BPercent);
            var ba = attr.GetAttributeTypeValue(22, H52D_Framework.eValueType.BPercent);
            var bd = attr.GetAttributeTypeValue(23, H52D_Framework.eValueType.BPercent);
            var baa = attr.GetAttributeTypeValue(24, H52D_Framework.eValueType.BPercent);
            var bpet = attr.GetAttributeTypeValue(25, H52D_Framework.eValueType.BPercent);
            var bcamp = attr.GetAttributeTypeValue(26, H52D_Framework.eValueType.BPercent);
            var balld = attr.GetAttributeTypeValue(27, H52D_Framework.eValueType.BPercent);
            var dstr = "";
            if (this._btype == 1) {
                dstr = "O_";
            }
            else {
                dstr = "E_";
            }
            var damage = attr.GetAttributeValue(2);
            var basedamage = attr.GetAttributeTypeValue(2, H52D_Framework.eValueType.Base);
            var hpp = attr.GetAttributeValue(1);
            var lc = this.vo.location + 1;
            var CJM = jm + bjm;
            var AJM = a + ba;
            var DJM = d + bd;
            var ALLHJM = aa + baa;
            var PETJM = pet + bpet;
            var CAMPJM = camp + bcamp;
            var ALLJM = alld + balld;
            var sttt = "[" + lc + "]_" + "<" + dstr + this.vo.name + ">_";
            var str = "点击减免_" + CJM + " 攻击型减免_" + AJM + " 防御型减免_" + DJM + " 所有英雄减免_" + ALLHJM;
            var str2 = "宠物减免_" + PETJM + " 阵营减免_" + CAMPJM + " 所有伤害减免_" + ALLJM;
            var strj = "伤害加成_" + aj;
            H52D_Framework.DamageShow.Instance.SetText(sttt);
            H52D_Framework.DamageShow.Instance.SetText(str);
            H52D_Framework.DamageShow.Instance.SetText(str2);
            H52D_Framework.DamageShow.Instance.SetText(strj);
            if (this.type == eCharacter_TYPE.PET || this.type == eCharacter_TYPE.CAMP) {
                // damage = damage * this.vo.ratio >>0;
                basedamage = basedamage * this.vo.ratio >> 0;
            }
            H52D_Framework.DamageShow.Instance.SetText(" 基础伤害 " + "<" + basedamage + ">" +
                " 面板血量 " + "<" + hpp + ">");
        };
        /**攻击触发Buff */
        Character.prototype.AttackTriggerConditions = function () {
            for (var i = 0; i < this._passiveSkillList.length; i++) {
                if (this._passiveSkillList[i]) {
                    if (this._passiveSkillList[i].BAttack) {
                        this._passiveSkillList[i].AttackTriggerSkill();
                    }
                }
            }
        };
        /**被攻击触发Buff */
        Character.prototype.OnHurtTriggerConditions = function () {
            for (var i = 0; i < this._passiveSkillList.length; i++) {
                if (this._passiveSkillList[i]) {
                    if (this._passiveSkillList[i].BHurt) {
                        this._passiveSkillList[i].OnHurtTrigger();
                    }
                }
            }
        };
        /**更新函数 */
        Character.prototype.OnUpdate = function () {
            if (this.IsDie || this.BClose)
                return;
            if (this._attackskill) {
                this._attackskill.OnUpdate();
                if (!this._attackskill.IsCD && this._target.length > 0) {
                    this.SpellAttackSkill();
                }
            }
            if (this._captainSkill && this._btype == -1) {
                if (!this._captainSkill.IsCD && this.CaptainTarget.length > 0 && !this.IsDie) {
                    this.SpellCaptainSkill();
                }
            }
            if (this._captainSkill) {
                this._captainSkill.OnUpdate();
            }
            if (this.TargetIsNull()) {
                this._target = [];
            }
            if (this._currentHp <= 0) {
                if (!this.IsDie) {
                    this.IsDie = true;
                    this.Die();
                }
            }
        };
        /**判断目标是不是空 */
        Character.prototype.TargetIsNull = function () {
            for (var i = 0; i < this._target.length; i++) {
                if (this._target[i]) {
                    if (!this._target[i].IsDie) {
                        return false;
                    }
                }
            }
            return true;
        };
        /**清理目标 */
        Character.prototype.ClearTarget = function () {
            /**普攻目标清理 */
            if (this._attackskill) {
                this._attackskill.Clear();
            }
            /**队长技能目标清理 */
            if (this._captainSkill) {
                this._captainSkill.Clear();
            }
            if (this._target) {
                this._target = [];
            }
            this.CaptainTarget = [];
        };
        Character.prototype.DestroyPassive = function () {
            var Len = this._passiveSkillList.length;
            for (var i = 0; i < Len; i++) {
                if (this._passiveSkillList[i]) {
                    this._passiveSkillList[i].Destroy();
                    this._passiveSkillList[i] = null;
                }
            }
            this._passiveSkillList = [];
        };
        /**销毁 */
        Character.prototype.Destroy = function () {
            this.ClearTarget();
            this.DestroyPassive();
            if (this._avatar) {
                this._avatar.Destroy();
                this._avatar = null;
            }
            if (this._attackskill) {
                this._attackskill.Destroy();
                this._attackskill = null;
            }
            if (this._captainSkill) {
                this._captainSkill.Destroy();
                this._captainSkill = null;
            }
            if (this._brithAvatar) {
                this._brithAvatar.Destroy();
                this._brithAvatar = null;
            }
        };
        return Character;
    }());
    H52D_Framework.Character = Character;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Character.js.map