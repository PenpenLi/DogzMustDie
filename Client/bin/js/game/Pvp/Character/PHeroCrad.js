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
    /**PVP */
    var PHeroCrad = /** @class */ (function (_super) {
        __extends(PHeroCrad, _super);
        /**初始化 */
        function PHeroCrad(vo, btype, viewRoot, bbool) {
            var _this = _super.call(this, btype, bbool) || this;
            _this._dataVo = vo;
            _this._passiveSkillList = [];
            _this.type = vo.hero_Type == 1 ? eCharacter_TYPE.AHERO : eCharacter_TYPE.DHERO;
            _this.SE = SkinEnum.SkinHero;
            _this.InitSkill();
            _this.CaptainSkillInit(btype);
            return _this;
        }
        PHeroCrad.prototype.CaptainSkillInit = function (btype) {
            if (this.vo.location == 4 && btype == 1) {
                H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.CAPATIAN_SKILL, Laya.Handler.create(this, this.SpellCaptainSkill));
                var icon = "ui_icon/" + H52D_Framework.ActiveSkillConfig[this.vo.skillid[1]]["strIcon"];
                H52D_Framework.Event.DispatchEvent("CaptainSkillInit", [icon]);
            }
        };
        Object.defineProperty(PHeroCrad.prototype, "vo", {
            get: function () { return this._dataVo; },
            enumerable: true,
            configurable: true
        });
        PHeroCrad.prototype.setCurrentHp = function (value) {
            this._currentHp = value;
            this.heroBlood.proportion = value / this.bloodMax;
        };
        /**加载英雄模型 */
        PHeroCrad.prototype.LoadMoudle = function (id, dir, scale, x, y, order, callback) {
            var _this = this;
            this._id = id;
            this._PosX = x;
            this._PosY = y;
            this.vo.InitPassiveID();
            this.vo.SetColOrow();
            this.vo.SetToSpeed();
            this.bloodMax = this.vo.attr.GetAttributeValue(1);
            this._currentHp = this.vo.attr.GetAttributeValue(1);
            /**加载模型 */
            this._avatar = new H52D_Framework.Avatar(H52D_Framework.AvatarRoot);
            this._avatar.Load(this.vo.ModlePath, dir, scale, x, y, Laya.Handler.create(this, function () {
                /**设置阴影 */
                _this._avatar.Shadow(1, true);
                _this.SetOrderZ(_this.vo.colNum);
                _this.Idle();
                _this.heroBlood = new H52D_Framework.HeroBloodView();
                _this.heroBlood.x = _this._avatar.PosX - 25;
                _this.heroBlood.y = _this._avatar.PosY - 120;
                H52D_Framework.AvatarEffectRoot.addChild(_this.heroBlood);
                if (callback) {
                    callback.run();
                }
            }));
        };
        PHeroCrad.prototype.OnHurt = function (be, owr, damage, e, iscrit, type, viewRoot) {
            _super.prototype.OnHurt.call(this, be, owr, damage, e, iscrit, type, viewRoot);
            this.OnHurtTriggerConditions();
        };
        PHeroCrad.prototype.SpellAttackSkill = function () {
            _super.prototype.SpellAttackSkill.call(this);
            this.AttackTriggerConditions();
        };
        /**条件类被动技能生效 */
        PHeroCrad.prototype.OnEffectPassive = function () {
            for (var i = 0; i < this.vo.conditionsID.length; i++) {
                var pas = new H52D_Framework.PConditionsPassiveSkill(this.vo.conditionsID[i], this._btype, this);
                this._passiveSkillList.push(pas);
            }
            for (var i = 0; i < this._passiveSkillList.length; i++) {
                if (this._passiveSkillList[i]) {
                    this._passiveSkillList[i].Do();
                }
            }
        };
        PHeroCrad.prototype.SpellCaptainSkill = function () {
            var _this = this;
            var tar = this._target_a.SetTarget(this.CaptainTarget, this._captainSkill.Data.hitEnemyMode, this._captainSkill.Data.hitEnemyNum);
            this._captainSkill.SpellSkill(tar);
            this.CCTarget = [];
            this.CCTarget = tar;
            this.CaptainEffct();
            H52D_Framework.Tick.Once(200, this, function () {
                _this.CaptainEffct_Z();
                var name = H52D_Framework.SkillName[_this.vo.skillid[1]];
                H52D_Framework.Floating.SkillNameText(name, _this.PosX, _this.PosY - 130);
            });
        };
        PHeroCrad.prototype.CaptainEffct = function () {
            var avatar = new H52D_Framework.Avatar(H52D_Framework.AvatarEffectRoot);
            avatar.Load(H52D_Framework.EffectDefine.shifa, 1, 1, this.PosX + 5, this.PosY - 75, Laya.Handler.create(this, function (avatars) {
                avatars.Play("effect_state_shifa", false, true, function () {
                    avatars.Destroy();
                });
            }));
        };
        PHeroCrad.prototype.CaptainEffct_Z = function () {
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
        PHeroCrad.prototype.Destroy = function () {
            if (this.heroBlood.parent) {
                this.heroBlood.parent.removeChild(this.heroBlood);
            }
            _super.prototype.Destroy.call(this);
            if (this._dataVo.location == 4 && this._btype == 1) {
                H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.CAPATIAN_SKILL, Laya.Handler.create(this, this.SpellCaptainSkill));
            }
        };
        return PHeroCrad;
    }(H52D_Framework.Character));
    H52D_Framework.PHeroCrad = PHeroCrad;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PHeroCrad.js.map