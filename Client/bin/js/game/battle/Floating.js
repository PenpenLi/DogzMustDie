/**
* 漂字类
* @author张振明
*/
var H52D_Framework;
(function (H52D_Framework) {
    var Floating = /** @class */ (function () {
        function Floating() {
        }
        /**
         * 漂字函数
         * @param value 数字
         * @param skinEnum  类型
         * @param x 位置x
         * @param y 位置y
         * @param birthY y位置随机高度
         */
        Floating.DamageText = function (value, skinEnum, x, y, isCrit, birthY) {
            if (birthY === void 0) { birthY = 0; }
            H52D_Framework.UIManager.Instance.InstanceUI("FloatView", [H52D_Framework.AvatarEffectRoot, value, skinEnum, x, y, isCrit, birthY]);
        };
        Floating.SkillNameText = function (name, x, y) {
            H52D_Framework.UIManager.Instance.InstanceUI("SkillNameView", [H52D_Framework.AvatarEffectRoot, name, x, y]);
        };
        return Floating;
    }());
    H52D_Framework.Floating = Floating;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Floating.js.map