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
    var BPet = /** @class */ (function (_super) {
        __extends(BPet, _super);
        /**初始化 */
        function BPet(id, viewRoot, bbool) {
            var _this = _super.call(this, viewRoot) || this;
            _this.SE = SkinEnum.SkinPet;
            _this._dataVo = H52D_Framework.PetManager.Instance.GetPet_Instance(id);
            _this.type = eCharacter_TYPE.PET;
            return _this;
        }
        Object.defineProperty(BPet.prototype, "vo", {
            get: function () { return this._dataVo; },
            enumerable: true,
            configurable: true
        });
        /**出生特效 */
        BPet.prototype.ChangeEffect = function () {
            var _this = this;
            if (this._avatar == null) {
                return;
            }
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
                    if (!_this._brithAvatar) {
                        return;
                    }
                    _this._brithAvatar.Play("effect_state_qiehuan", false);
                }));
            }
        };
        /**加载模型 */
        BPet.prototype.LoadMoudle = function (x, y, order, callback) {
            var _this = this;
            this._PosX = x;
            this._PosY = y;
            /**加载模型 */
            if (!this.vo) {
                return;
            }
            this._avatar = new H52D_Framework.Avatar(this.viewRoot);
            this._avatar.Load(this.vo.Path, this.vo.Direction, this.vo.Scla, x, y, Laya.Handler.create(this, function (_avatar) {
                /**设置阴影 */
                _this.ChangeEffect();
                _this._order = order;
                if (_avatar) {
                    _avatar.SetOrder(order);
                }
                /**初始化英雄普攻 */
                _this._attackskill = new H52D_Framework.Skill(_this.vo.SkillID, _this, eBELONGS_TO.ATTACK);
                _this.Idle();
                if (callback)
                    callback.run();
            }));
        };
        /** 攻击 */
        BPet.prototype.Attack = function () {
            _super.prototype.Attack.call(this);
            H52D_Framework.BattleManager.Instance.petAttackNum++;
        };
        /**更新*/
        BPet.prototype.OnUpdate = function () {
            _super.prototype.OnUpdate.call(this);
            if (!this._target || this.Close)
                return;
            if (this._attackskill) {
                if (!this._attackskill.IsCD) {
                    this.Attack();
                }
                this._attackskill.OnUpdate();
            }
        };
        return BPet;
    }(H52D_Framework.Entity));
    H52D_Framework.BPet = BPet;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=BPet.js.map