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
    var BCamp = /** @class */ (function (_super) {
        __extends(BCamp, _super);
        function BCamp(vo, viewRoot) {
            var _this = _super.call(this, viewRoot) || this;
            _this._dataVo = vo;
            _this.SE = SkinEnum.SkinCamp;
            _this.type = eCharacter_TYPE.CAMP;
            return _this;
        }
        /**加载阵营模型 */
        BCamp.prototype.LoadMoudle = function (x, y, order, callback) {
            var _this = this;
            this._PosX = x;
            this._PosY = y;
            /**加载模型 */
            this._avatar = new H52D_Framework.Avatar(this.viewRoot);
            this._avatar.Load("res/player/chuan/chuan.sk", 1, 0.3, x, y, Laya.Handler.create(this, function () {
                _this._avatar.Rotate(8);
                _this.vo.Setattribute();
                /**初始化英雄普攻 */
                _this._attackskill = new H52D_Framework.Skill(_this.vo.skillid, _this, eBELONGS_TO.ATTACK);
                _this.Idle();
                if (callback)
                    callback.run();
            }));
        };
        /**更新函数 */
        BCamp.prototype.OnUpdate = function () {
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
        return BCamp;
    }(H52D_Framework.Entity));
    H52D_Framework.BCamp = BCamp;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=BCamp.js.map