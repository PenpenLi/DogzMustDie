var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * 战斗英雄实例
 */
var H52D_Framework;
(function (H52D_Framework) {
    var HeroCard = /** @class */ (function (_super) {
        __extends(HeroCard, _super);
        /**初始化 */
        function HeroCard(vo, viewRoot, bbool) {
            var _this = _super.call(this, viewRoot) || this;
            /**队长技能 */
            _this._captainSkill = null;
            /**被动技能列表 */
            _this._passiveSkillList = [];
            _this._bAttack = false;
            _this._isPlayAttackDown = false;
            _this.bbool = false;
            _this._IsDie = false;
            _this._dataVo = vo;
            _this.SE = SkinEnum.SkinHero;
            _this.type = vo.HeroType == 1 ? eCharacter_TYPE.AHERO : eCharacter_TYPE.DHERO;
            _this.vo.onlockpassive = Laya.Handler.create(_this, _this.OnlockPassive, [], false);
            _this.bbool = bbool;
            _this.bloodMax = vo.attr.GetAttributeValue(1);
            /**如果是队长就启动 队长技能事件 */
            if (_this._dataVo.location == 4) {
                H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.CAPATIAN_SKILL, Laya.Handler.create(_this, _this.SpellCaptainSkill));
            }
            _this.vo.SetToSpeed();
            _this.vo.SetColOrow();
            return _this;
        }
        /** 血条 */
        // private heroBlood: HeroBloodView;
        // private bloodMax: number;
        // public set currentHp(value: number) {
        //     if(!value){
        //         value = 0;
        //     }
        //     this._currentHp = value;
        //     if (this.heroBlood){
        //         this.heroBlood.proportion = this._currentHp / this.bloodMax;
        //     }
        // }
        // public get currentHp(): number {
        //     return this._currentHp;
        // }
        /**
         * 加载英雄模型
         * @param dir:方向
         * @param scale:缩放比例
         * @param xy: 位置
         * @param order: 层级
         * @param blood: 血条
         * @param callback:回调函数
         **/
        HeroCard.prototype.LoadMoudle = function (dir, scale, x, y, order, blood, callback) {
            var _this = this;
            if (blood === void 0) { blood = false; }
            if (callback === void 0) { callback = null; }
            this._id = this._dataVo.nHeroID;
            this._PosX = x;
            this._PosY = y;
            this.currentHp = this._dataVo.attr.GetAttributeValue(1);
            /**加载模型 */
            this._avatar = new H52D_Framework.Avatar(this.viewRoot);
            this._avatar.Load(this.vo.ModlePath, dir, scale, x, y, Laya.Handler.create(this, function (_avatar) {
                _this.LoadPassive();
                _this.InitSkill();
                if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                    _this.heroBlood = new H52D_Framework.HeroBloodView();
                    _this.heroBlood.x = _this._avatar.PosX - 25;
                    _this.heroBlood.y = _this._avatar.PosY - 120;
                    H52D_Framework.AvatarEffectRoot.addChild(_this.heroBlood);
                }
                /**设置阴影 */
                _avatar.Shadow(1, true);
                _avatar.visible = true;
                /**设置人物层级 */
                _this._order = _this.vo.colNum;
                _avatar.SetOrder(_this.vo.colNum);
                _this.Idle();
                if (callback)
                    callback.run();
            }));
        };
        HeroCard.prototype.LoadPassive = function () {
            this._passiveSkillList = [];
            for (var i = 0; i < this.vo.conditionsID.length; i++) {
                var pas = new H52D_Framework.ConditionsPassiveSkill(this.vo.conditionsID[i], this);
                this._passiveSkillList.push(pas);
            }
        };
        /**条件类被动技能生效 */
        HeroCard.prototype.OnEffectPassive = function () {
            for (var i = 0; i < this._passiveSkillList.length; i++) {
                if (this._passiveSkillList[i]) {
                    this._passiveSkillList[i].Do();
                }
            }
        };
        /**解锁条件被动技能 */
        HeroCard.prototype.OnlockPassive = function () {
            var clen = this.vo.OnPassiveID.length;
            if (clen == 0)
                return;
            var id = this.vo.OnPassiveID[clen - 1];
            var type_id = H52D_Framework.PassiveSkillConfig[id]["scriptID"];
            if (type_id != 1) {
                var pas = new H52D_Framework.ConditionsPassiveSkill(id, this);
                pas.Do();
                this._passiveSkillList.push(pas);
            }
            this.OnEffectPassive();
        };
        HeroCard.prototype.DestroyPassive = function () {
            var Len = this._passiveSkillList.length;
            for (var i = 0; i < Len; i++) {
                if (this._passiveSkillList[i]) {
                    this._passiveSkillList[i].Destroy();
                    this._passiveSkillList[i] = null;
                }
            }
            this._passiveSkillList = [];
        };
        /** 受伤 */
        HeroCard.prototype.OnHurt = function (damage, e, iscrit, type, viewRoot) {
            if (type != SPECIAL_TYPE.SUSRAINED) {
                this.Hit();
            }
            if (damage <= 0)
                damage = 1;
            H52D_Framework.Floating.DamageText(damage.toString(), e, this.PosX, this.PosY, iscrit);
            this.currentHp -= damage;
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                H52D_Framework.BattleManager.hitNum += 1;
            }
            this.OnHurtTriggerConditions();
        };
        /**出生特效 */
        HeroCard.prototype.ChangeEffect = function () {
            var _this = this;
            // SoundManager.Instance.playSound("res/sound/boss_appear.mp3", 1);
            if (this._brithAvatar) {
                this._brithAvatar.Play("effect_state_appear", false);
            }
            else {
                this._brithAvatar = new H52D_Framework.Avatar(H52D_Framework.AvatarEffectRoot);
                this._brithAvatar.Load("res/effect/effect_state_appear/effect_state_appear.sk", 1, 1, this.PosX, this.PosY - 175, Laya.Handler.create(this, function () {
                    _this._brithAvatar.Play("effect_state_appear", false);
                }));
            }
        };
        /**普通攻击 */
        HeroCard.prototype.Attack = function () {
            var _this = this;
            if (!this._target || !this._attackskill)
                return;
            this._isPlayAttackDown = false;
            this._bAttack = true;
            this._avatar.Play(H52D_Framework.AnimationName.attack, false, true, function () {
                _this._bAttack = false;
                _this._isPlayAttackDown = true;
                _this.Idle();
            });
            this._attackskill.SpellSkill(this._target);
            this.AttackTriggerConditions();
            H52D_Framework.BattleManager.Instance.heroAttackNum++;
        };
        HeroCard.prototype.SkillUpdate = function () {
            if (this._attackskill)
                this._attackskill.OnUpdate();
            if (this._captainSkill)
                this._captainSkill.OnUpdate();
        };
        Object.defineProperty(HeroCard.prototype, "IsDie", {
            get: function () { return this._IsDie; },
            enumerable: true,
            configurable: true
        });
        /**更新函数 */
        HeroCard.prototype.OnUpdate = function () {
            if (this._IsDie)
                return;
            _super.prototype.OnUpdate.call(this);
            this.SkillUpdate();
            if (!this._target || this.Close)
                return;
            if (this._attackskill) {
                if (!this._attackskill.IsCD) {
                    this.Attack();
                }
            }
            if (this.currentHp <= 0) {
                if (!this._IsDie) {
                    this._IsDie = true;
                    H52D_Framework.Event.DispatchEvent("DestryBuffById", this.ID);
                    this.Die();
                }
            }
        };
        /**清理目标 */
        HeroCard.prototype.ClearTarget = function () {
            _super.prototype.ClearTarget.call(this);
            /**队长技能目标清理 */
            if (this._captainSkill) {
                this._captainSkill.ClearTarget();
            }
        };
        /**初始化英雄技能 */
        HeroCard.prototype.InitSkill = function () {
            /**初始化英雄普攻 */
            this._attackskill = new H52D_Framework.Skill(this.vo.skillid[0], this, eBELONGS_TO.ATTACK);
            /**是队长就初始化队长技能 */
            if (this.vo.location == 4) {
                this._captainSkill = new H52D_Framework.Skill(this.vo.skillid[1], this, eBELONGS_TO.BIG);
                var icon = "ui_icon/" + H52D_Framework.ActiveSkillConfig[this.vo.skillid[1]]["strIcon"];
                H52D_Framework.Event.DispatchEvent("CaptainSkillInit", [icon]);
            }
        };
        /**释放队长技能 */
        HeroCard.prototype.SpellCaptainSkill = function () {
            var _this = this;
            // 如果目标是空则不自动放技能
            if (this.TargetIsNull()) {
                return;
            }
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.MatchElection && H52D_Framework.BattleManager.Instance.MathcEnd)
                return;
            this._captainSkill.SpellSkill(this.Target);
            this.CaptainEffct();
            H52D_Framework.Tick.Once(200, this, function () {
                _this.CaptainEffct_Z();
                var name = H52D_Framework.SkillName[_this.vo.skillid[1]];
                H52D_Framework.Floating.SkillNameText(name, _this.PosX, _this.PosY - 130);
            });
        };
        /**脚底队长技能特效 */
        HeroCard.prototype.CaptainEffct = function () {
            var avatar = new H52D_Framework.Avatar(H52D_Framework.AvatarEffectRoot);
            avatar.Load(H52D_Framework.EffectDefine.shifa, 1, 1, this.PosX + 5, this.PosY - 75, Laya.Handler.create(this, function () {
                avatar.Play("effect_state_shifa", false, true, function () {
                    avatar.Destroy();
                    avatar = null;
                });
            }));
        };
        /**头顶队长技能特效 */
        HeroCard.prototype.CaptainEffct_Z = function () {
            var _this = this;
            var avatar = new H52D_Framework.Avatar(H52D_Framework.AvatarEffectRoot);
            avatar.Load("res/effect/effect_state_shifa2/effect_state_shifa2.sk", 1, 1, this.PosX, this.PosY - 160, Laya.Handler.create(this, function () {
                if (!avatar || !avatar.Armature)
                    return;
                avatar.Armature.alpha = 0;
                avatar.Play("effect_state_shifa2", true, true, function () {
                });
                H52D_Framework.TweenList.to(_this, avatar.Armature, { alpha: 1 }, 200, function () {
                    H52D_Framework.Tick.Once(700, _this, function () {
                        if (!avatar)
                            return;
                        if (!avatar.Armature)
                            return;
                        H52D_Framework.TweenList.to(_this, avatar.Armature, { alpha: 0 }, 200, function () {
                            if (avatar != null) {
                                avatar.Destroy();
                                avatar = null;
                            }
                        });
                    });
                });
            }));
        };
        /**攻击触发Buff */
        HeroCard.prototype.AttackTriggerConditions = function () {
            for (var i = 0; i < this._passiveSkillList.length; i++) {
                if (this._passiveSkillList[i]) {
                    if (this._passiveSkillList[i].BAttack) {
                        this._passiveSkillList[i].AttackTriggerSkill();
                    }
                }
            }
        };
        /**被攻击触发Buff */
        HeroCard.prototype.OnHurtTriggerConditions = function () {
            for (var i = 0; i < this._passiveSkillList.length; i++) {
                if (this._passiveSkillList[i]) {
                    if (this._passiveSkillList[i].BHurt) {
                        this._passiveSkillList[i].OnHurtTrigger();
                    }
                }
            }
        };
        /**销毁 */
        HeroCard.prototype.Destroy = function () {
            if (this.heroBlood) {
                this.heroBlood.destroy();
            }
            _super.prototype.Destroy.call(this);
            this.vo.onlockpassive.recover();
            this.DestroyPassive();
            if (this._captainSkill) {
                this._captainSkill.Destroy();
                this._captainSkill = null;
            }
            if (this._dataVo.location == 4) {
                H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.CAPATIAN_SKILL, Laya.Handler.create(this, this.SpellCaptainSkill));
            }
        };
        return HeroCard;
    }(H52D_Framework.Entity));
    H52D_Framework.HeroCard = HeroCard;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=HeroCard.js.map