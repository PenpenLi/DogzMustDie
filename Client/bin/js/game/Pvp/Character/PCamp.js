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
* name
*/
var H52D_Framework;
(function (H52D_Framework) {
    var PCamp = /** @class */ (function (_super) {
        __extends(PCamp, _super);
        function PCamp(vo, btype, viewRoot, bblood) {
            var _this = _super.call(this, btype, bblood) || this;
            _this._btype = btype;
            _this._dataVo = vo;
            _this.type = eCharacter_TYPE.CAMP;
            _this.SE = SkinEnum.SkinCamp;
            return _this;
        }
        /**加载阵营模型 */
        PCamp.prototype.LoadMoudle = function (x, y, order, callback) {
            var _this = this;
            if (callback === void 0) { callback = null; }
            this._PosX = x;
            this._PosY = y;
            /**加载模型 */
            this._avatar = new H52D_Framework.Avatar(H52D_Framework.AvatarRoot);
            this._avatar.Load("res/player/chuan/chuan.sk", this._btype, 0.3, x, y, Laya.Handler.create(this, function () {
                _this._btype == 1 ? _this._avatar.Rotate(8) : _this._avatar.Rotate(-8);
                _this.SetOrderZ(order);
                /**初始化英雄普攻 */
                _this._attackskill = new H52D_Framework.PSkill(_this.vo.skillid, _this, _this._btype, eBELONGS_TO.ATTACK);
                _this.Idle();
                if (callback) {
                    callback.run();
                }
            }));
        };
        PCamp.prototype.SetDamage = function () {
            this._btype == 1 ? this.vo.SetDamage(this.GetHeroList(0)) : this.vo.SetDamage(this.GetHeroList(1));
        };
        PCamp.prototype.GetHeroList = function (index) {
            return H52D_Framework.BattlefieldManager.Instance.Characterlist[index].HeroList;
        };
        /**更新函数 */
        PCamp.prototype.OnUpdate = function () {
            if (this.TargetIsNull()) {
                this._bClose = true;
                this._target = [];
            }
            if (!this._target || this._bClose)
                return;
            if (this._attackskill) {
                this._attackskill.OnUpdate();
                if (!this._attackskill.IsCD) {
                    this.SpellAttackSkill();
                }
            }
        };
        return PCamp;
    }(H52D_Framework.Character));
    H52D_Framework.PCamp = PCamp;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PCamp.js.map