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
var H52D_Framework;
(function (H52D_Framework) {
    /**
     * 怪物类
     */
    var Monster = /** @class */ (function (_super) {
        __extends(Monster, _super);
        /**初始化 */
        function Monster(vo, viewRoot) {
            var _this = _super.call(this, viewRoot) || this;
            _this._isDestroyDwon = false;
            _this._scla = 0.1;
            /**队长技能 */
            _this._captainSkill = null;
            _this.beforDie = false;
            _this.afterDie = false;
            _this.CCTarget = [];
            _this._target_a = null;
            _this._dataVo = vo;
            _this.type = eCharacter_TYPE.MONSTER;
            return _this;
        }
        Object.defineProperty(Monster.prototype, "vo", {
            get: function () {
                return this._dataVo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Monster.prototype, "blood", {
            get: function () {
                return this._blood;
            },
            set: function (value) {
                this._blood = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Monster.prototype, "ViewRoot", {
            get: function () { return this.viewRoot; },
            enumerable: true,
            configurable: true
        });
        Monster.prototype.Init = function () {
            this._isDestroyDwon = false;
            if (this.vo.location == 4 && this.vo.captainid != 0) {
                this._captainSkill = new H52D_Framework.Skill(this.vo.captainid, this, eBELONGS_TO.BIG, -1);
            }
            if (this.vo.attackid != 0) {
                this._attackskill = new H52D_Framework.Skill(this.vo.attackid, this, eBELONGS_TO.ATTACK, -1);
            }
            this.bloodMax = this._dataVo.attr.GetAttributeValue(1);
            this.currentHp = this._dataVo.attr.GetAttributeValue(1);
            this._isDie = false;
            this._target_a = new H52D_Framework.Formation();
            H52D_Framework.Tick.Loop(100, this, this.OnUpdate);
        };
        Monster.prototype.LoadMonster = function (dir, scale, x, y, shadow, order, callback) {
            var _this = this;
            this._PosX = x;
            this._scla = scale;
            this._PosY = y;
            this._isDie = false;
            this.vo.SetCol();
            this._avatar = new H52D_Framework.Avatar(this.viewRoot);
            this._avatar.Load(this._dataVo.strModelId, dir, this._scla, x, y, Laya.Handler.create(this, function (_avatar) {
                _this.Init();
                if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                    _this.heroBlood = new H52D_Framework.HeroBloodView();
                    _this.heroBlood.x = _this._avatar.PosX - 25;
                    _this.heroBlood.y = _this._avatar.PosY - 120;
                    H52D_Framework.AvatarEffectRoot.addChild(_this.heroBlood);
                }
                _this.ChangeEffect(shadow);
                _avatar.SetOrder(order);
                _this.Idle();
                if (callback) {
                    callback.run();
                }
            }), this.vo.modlight);
        };
        /**死亡函数 */
        Monster.prototype.Die = function (callback) {
            var _this = this;
            if (!this._avatar)
                return;
            H52D_Framework.BattleManager.mDieNumber += 1;
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/die_sound.mp3");
            H52D_Framework.CustomsManager.Instance.monsterDieNum++;
            this.beforDie = true;
            this._avatar.Play(H52D_Framework.AnimationName.die, false, true, function () {
                _this._isDestroyDwon = true;
                _this.afterDie = true;
                H52D_Framework.Event.DispatchEvent("ClearOneBubble", [E_BubbleType.eMonster]);
                _this.Destroy();
                if (callback) {
                    callback.run();
                }
            });
            H52D_Framework.Event.DispatchEvent("ClearOneBubble", [E_BubbleType.eMonster]);
            H52D_Framework.Event.DispatchEvent("StopBubbleMonster");
        };
        /**出生特效 */
        Monster.prototype.ChangeEffect = function (shadow) {
            var _this = this;
            if (!this._avatar)
                return;
            if (this.vo.boss) {
                var oPosY_1 = 0;
                oPosY_1 = this._avatar.PosY;
                this._avatar.PosY = -100;
                if (!oPosY_1)
                    oPosY_1 = 730;
                H52D_Framework.TweenList.to(this, this._avatar, { PosY: oPosY_1 }, 350, function () {
                    if (!_this._avatar)
                        return;
                    if (!oPosY_1)
                        oPosY_1 = 730;
                    _this._avatar.PosY = oPosY_1;
                    _this._avatar.Shadow(shadow, true);
                    H52D_Framework.EffectManager.Instance.StartShock(600, null, 6);
                });
            }
            else {
                if (!this._avatar)
                    return;
                this._avatar.scale = 0;
                if (!this._avatar)
                    return;
                H52D_Framework.TweenList.to(this, this._avatar, { scale: this._scla }, 250, function () {
                    if (!_this._scla) {
                        _this._scla = 0;
                    }
                    if (!_this._avatar)
                        return;
                    if (_this._avatar) {
                        _this._avatar.scale = _this._scla;
                    }
                    if (!_this._avatar)
                        return;
                    _this._avatar.Shadow(shadow, true);
                });
                H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/boss_appear2.mp3");
                if (this._brithAvatar) {
                    this._brithAvatar.Play("effect_state_qiehuan", false);
                }
                else {
                    this._brithAvatar = new H52D_Framework.Avatar(H52D_Framework.AvatarEffectRoot);
                    this._brithAvatar.Load("res/effect/effect_state_qiehuan/effect_state_qiehuan.sk", 1, 1.1, this.PosX, this.PosY - 200, Laya.Handler.create(this, function (_brithAvatar) {
                        _brithAvatar.Play("effect_state_qiehuan", false);
                    }));
                }
            }
        };
        Monster.prototype.setHp = function () {
            this.currentHp = 0;
        };
        Monster.prototype.Attack = function () {
            var _this = this;
            if (this._isDie || this._avatar == null) {
                return;
            }
            this.bAttack = true;
            this._avatar.Play(H52D_Framework.AnimationName.attack, false, true, function () {
                _this.bAttack = false;
                _this.Idle();
            });
            this._attackskill.SpellSkill(this._target);
        };
        Monster.prototype.OnHurt = function (damage, e, iscrit, type, viewRoot) {
            if ((this._currentHp <= 0) || this._isDie || this._avatar == null) {
                return;
            }
            if (type != SPECIAL_TYPE.SUSRAINED) {
                this.Hit();
            }
            if (type == SPECIAL_TYPE.ACTION) {
                H52D_Framework.UIManager.Instance.InstanceUI("FloatView", [viewRoot, damage.toString(), e, 420, 100, false]);
                return;
            }
            if (damage <= 0)
                damage = 1;
            H52D_Framework.Floating.DamageText(damage.toString(), e, this.PosX, this.PosY - 200, iscrit);
            this.currentHp -= damage;
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                H52D_Framework.BattleManager.damageAll += damage;
            }
            H52D_Framework.BattleManager.Instance.TheWordBossDamage += damage;
            H52D_Framework.BattleManager.Instance.TheMatchBossDamage += damage;
            //通知UI
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.CUSTOMS_DROP_BLOOD, damage);
        };
        Monster.prototype.OnUpdate = function () {
            if (this._isDie) {
                return;
            }
            if (this.currentHp <= 0) {
                this._isDie = true;
                this.Die();
            }
            if (this.Close)
                return;
            if (this._attackskill) {
                this._attackskill.OnUpdate();
                if (!this._attackskill.IsCD && this._target.length > 0) {
                    this.Attack();
                }
            }
            if (this._captainSkill) {
                if (!this._captainSkill.IsCD) {
                    this.SpellCaptainSkill();
                }
            }
            if (this._captainSkill) {
                this._captainSkill.OnUpdate();
            }
        };
        Monster.prototype.SpellCaptainSkill = function () {
            var _this = this;
            if (!H52D_Framework.BattleManager.Instance.HeroCardMgr && !H52D_Framework.BattleManager.Instance.HeroCardMgr.CHeroList &&
                H52D_Framework.BattleManager.Instance.HeroCardMgr.CHeroList.length > 0)
                return;
            var mgr = H52D_Framework.BattleManager.Instance.HeroCardMgr;
            if (!mgr)
                return;
            var tar = this._target_a.SetTarget(mgr.CHeroList, this._captainSkill.Data.hitEnemyMode, this._captainSkill.Data.hitEnemyNum);
            this._captainSkill.SpellSkill(tar);
            this.CCTarget = [];
            this.CCTarget = tar;
            this.CaptainEffct();
            H52D_Framework.Tick.Once(200, this, function () {
                _this.CaptainEffct_Z();
                if (!_this._captainSkill)
                    return;
                var name = H52D_Framework.SkillName[_this._captainSkill.Data.id];
                H52D_Framework.Floating.SkillNameText(name, _this.PosX, _this.PosY - 130);
            });
        };
        Monster.prototype.CaptainEffct = function () {
            var avatar = new H52D_Framework.Avatar(H52D_Framework.AvatarEffectRoot);
            avatar.Load(H52D_Framework.EffectDefine.shifa, 1, 1, this.PosX + 5, this.PosY - 75, Laya.Handler.create(this, function (avatars) {
                avatars.Play("effect_state_shifa", false, true, function () {
                    avatars.Destroy();
                });
            }));
        };
        Monster.prototype.CaptainEffct_Z = function () {
            var _this = this;
            var avatar = new H52D_Framework.Avatar(H52D_Framework.AvatarEffectRoot);
            avatar.Load("res/effect/effect_state_shifa2/effect_state_shifa2.sk", 1, 1, this.PosX, this.PosY - 160, Laya.Handler.create(this, function (avatars) {
                if (!avatars)
                    return;
                avatars.Armature.alpha = 0;
                avatars.Play("effect_state_shifa2", true, true, function () {
                });
                H52D_Framework.TweenList.to(_this, avatars.Armature, { alpha: 1 }, 200, function () {
                    H52D_Framework.Tick.Once(700, _this, function () {
                        if (!avatars)
                            return;
                        if (!avatars.Armature)
                            return;
                        H52D_Framework.TweenList.to(_this, avatars.Armature, { alpha: 0 }, 200, function () {
                            avatars.Destroy();
                        });
                    });
                });
            }));
        };
        /**销毁 */
        Monster.prototype.Destroy = function () {
            H52D_Framework.Tick.Clear(this, this.OnUpdate);
            if (this._avatar) {
                this._avatar.Destroy();
                this._avatar = null;
            }
            if (this.heroBlood) {
                this.heroBlood.destroy();
            }
            if (this._brithAvatar) {
                this._brithAvatar.Destroy();
                this._brithAvatar = null;
            }
            if (this._attackskill) {
                this._attackskill.Destroy();
                this._attackskill = null;
            }
            if (this._captainSkill) {
                this._captainSkill.Destroy();
                this._captainSkill = null;
            }
        };
        return Monster;
    }(H52D_Framework.Entity));
    H52D_Framework.Monster = Monster;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Monster.js.map