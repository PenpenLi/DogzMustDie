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
    var PPet = /** @class */ (function (_super) {
        __extends(PPet, _super);
        /**初始化 */
        function PPet(id, vo, btype, viewRoot, bbool) {
            var _this = _super.call(this, btype, bbool) || this;
            _this.SE = SkinEnum.SkinPet;
            _this.type = eCharacter_TYPE.PET;
            _this._dataVo = vo;
            return _this;
        }
        /**加载英雄模型 */
        PPet.prototype.LoadMoudle = function (x, y, order, callback) {
            var _this = this;
            if (callback === void 0) { callback = null; }
            this._PosX = x;
            this._PosY = y;
            var dir = this._btype == 1 ? -1 : 1;
            /**加载模型 */
            this._avatar = new H52D_Framework.Avatar(H52D_Framework.AvatarRoot);
            this._avatar.Load(this.vo.Path, dir, this.vo.Scla, x, y, Laya.Handler.create(this, function () {
                _this.ChangeEffect();
                _this.SetOrderZ(order);
                /**初始化英雄普攻 */
                _this._attackskill = new H52D_Framework.PSkill(_this.vo.Sid, _this, _this._btype, eBELONGS_TO.ATTACK);
                _this.Idle();
                if (callback) {
                    callback.run();
                }
            }));
        };
        PPet.prototype.SetDamage = function () {
            this._btype == 1 ? this.vo.SetDamage(this.GetHeroList(0)) : this.vo.SetDamage(this.GetHeroList(1));
        };
        PPet.prototype.GetHeroList = function (index) {
            return H52D_Framework.BattlefieldManager.Instance.Characterlist[index].HeroList;
        };
        PPet.prototype.OnUpdate = function () {
            if (!this._target)
                return;
            if (this._attackskill) {
                this._attackskill.OnUpdate();
                if (!this._attackskill.IsCD &&
                    !this._bClose &&
                    this._target.length > 0) {
                    this.SpellAttackSkill();
                }
            }
            if (this.TargetIsNull()) {
                this._target = [];
            }
        };
        return PPet;
    }(H52D_Framework.Character));
    H52D_Framework.PPet = PPet;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PPet.js.map