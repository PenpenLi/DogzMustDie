/**
* name
*/
var H52D_Framework;
(function (H52D_Framework) {
    var Entity = /** @class */ (function () {
        /** 血条 */
        // protected heroBlood: HeroBloodView;
        // protected bloodMax: number;
        // public set setCurrentHp(value: number) {
        // 	this._currentHP = value;
        // 	if (this.heroBlood) {
        // 		this.heroBlood.proportion = this._currentHP / this.bloodMax;
        // 	}
        // }
        // public get setCurrentHp() {
        // 	return this._currentHP;
        // }
        /**初始化 */
        function Entity(viewRoot) {
            /**挂点类型*/
            this.type = eCharacter_TYPE.PET;
            /** ID */
            this._id = 0;
            /**攻击目标 */
            this._target = [];
            this._order = 0;
            this._PosX = 0;
            this._PosY = 0;
            this.SE = SkinEnum.SkinHero;
            /**重置循环普攻 */
            this._bClose = true;
            this._bloadDown = false;
            this.bAttack = false;
            this.isDown = false;
            this.viewRoot = viewRoot ? viewRoot : H52D_Framework.AvatarRoot;
        }
        Object.defineProperty(Entity.prototype, "avatar", {
            get: function () { return this._avatar; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "ID", {
            get: function () { return this._id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "Target", {
            get: function () { return this._target; },
            /**攻击目标 */
            set: function (value) { this._target = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "vo", {
            /**数据模型*/
            get: function () { return this._dataVo; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "Order", {
            /**层级 */
            get: function () { return this._order; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "PosX", {
            /**位置X坐标 */
            get: function () { return this._PosX; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "PosY", {
            /**位置Y坐标 */
            get: function () { return this._PosY; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "attackSkill", {
            /**普攻 */
            get: function () { return this._attackskill; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "Close", {
            get: function () { return this._bClose; },
            set: function (value) { this._bClose = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "bLoadDown", {
            get: function () { return this._bloadDown; },
            set: function (value) { this._bloadDown = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "IsDie", {
            get: function () {
                return this._isDie;
            },
            set: function (value) {
                this._isDie = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "currentHp", {
            get: function () {
                return this._currentHp;
            },
            set: function (value) {
                this._currentHp = value;
                if (this.heroBlood) {
                    this.heroBlood.proportion = this._currentHp / this.bloodMax;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**获取当前动画时间 */
        Entity.prototype.GetAniDuration = function () {
            return this._avatar.GetAniDuration();
        };
        /** 待机 */
        Entity.prototype.Idle = function () {
            if (!this._avatar)
                return;
            this._avatar.Play(H52D_Framework.AnimationName.idle, true);
        };
        /** 被击 */
        Entity.prototype.Hit = function () {
            var _this = this;
            if (!this._avatar || this.bAttack || this.IsDie)
                return;
            this._avatar.Play(H52D_Framework.AnimationName.hit, false, true, function () {
                _this.Idle();
            });
        };
        /** 死亡 */
        Entity.prototype.Die = function () {
            var _this = this;
            if (!this._avatar)
                return;
            H52D_Framework.BattleManager.hDienumber += 1;
            this._avatar.Play(H52D_Framework.AnimationName.die, false, true, function () {
                _this.Destroy();
                _this.isDown = true;
            });
        };
        /** 攻击 */
        Entity.prototype.Attack = function () {
            var _this = this;
            if (!this._target || !this._attackskill || !this._avatar)
                return;
            /**攻击完毕  自动待机状态 */
            this._avatar.Play(H52D_Framework.AnimationName.attack, false, true, function () {
                _this.Idle();
            });
            this._attackskill.SpellSkill(this._target);
        };
        /**更新函数 */
        Entity.prototype.OnUpdate = function () {
            if (this.TargetIsNull()) {
                this.Close = true;
                this._target = [];
            }
        };
        /**判断目标是不是空 */
        Entity.prototype.TargetIsNull = function () {
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
        Entity.prototype.ClearTarget = function () {
            if (this._target) {
                this._target = [];
            }
            /**普攻目标清理 */
            if (this.attackSkill) {
                this.attackSkill.ClearTarget();
            }
        };
        /**销毁 */
        Entity.prototype.Destroy = function () {
            this.Close = true;
            this.ClearTarget();
            if (this._avatar) {
                this._avatar.Destroy();
                this._avatar = null;
            }
            if (this._attackskill) {
                this._attackskill.Destroy();
                this._attackskill = null;
            }
            if (this._brithAvatar) {
                this._brithAvatar.Destroy();
                this._brithAvatar = null;
            }
        };
        return Entity;
    }());
    H52D_Framework.Entity = Entity;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Entity.js.map