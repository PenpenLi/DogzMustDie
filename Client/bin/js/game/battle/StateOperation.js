/*
* 指令状态机;
*/
var H52D_Framework;
(function (H52D_Framework) {
    var StateOperation = /** @class */ (function () {
        /**
         * 初始化
         */
        function StateOperation() {
            this.Destroy();
            this._tapSkill = new H52D_Framework.TapSkill();
        }
        StateOperation.prototype.OnFire = function () {
        };
        /**销毁 */
        StateOperation.prototype.Destroy = function () {
            if (this._tapSkill) {
                this._tapSkill.Destroy();
                this._tapSkill = null;
            }
        };
        /**接收到指令触发行为 */
        StateOperation.prototype.Do = function (params, clickType) {
            if (params != null) {
                this._tapSkill.TapSkill(clickType);
            }
        };
        StateOperation.prototype.OnUpdate = function () {
        };
        return StateOperation;
    }());
    H52D_Framework.StateOperation = StateOperation;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=StateOperation.js.map