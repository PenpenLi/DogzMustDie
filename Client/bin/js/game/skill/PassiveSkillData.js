/**
* 被动技能表数据
*/
var H52D_Framework;
(function (H52D_Framework) {
    /**被动技能数据 */
    var PassiveSkillData = /** @class */ (function () {
        function PassiveSkillData(id) {
            this.id = id;
        }
        Object.defineProperty(PassiveSkillData.prototype, "nameId", {
            /**名字ID */
            get: function () { return H52D_Framework.PassiveSkillConfig[this.id]["nameId"]; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(PassiveSkillData.prototype, "descId", {
            /**描述ID */
            get: function () { return H52D_Framework.PassiveSkillConfig[this.id]["descId"]; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(PassiveSkillData.prototype, "strIcon", {
            /**图标ID */
            get: function () { return H52D_Framework.PassiveSkillConfig[this.id]["strIcon"]; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(PassiveSkillData.prototype, "level", {
            /**等级 */
            get: function () { return H52D_Framework.PassiveSkillConfig[this.id]["level"]; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(PassiveSkillData.prototype, "scriptID", {
            /**被动技能类型 */
            get: function () { return H52D_Framework.PassiveSkillConfig[this.id]["scriptID"]; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(PassiveSkillData.prototype, "scriptParam", {
            /**参数 */
            get: function () { return H52D_Framework.PassiveSkillConfig[this.id]["scriptParam"]; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(PassiveSkillData.prototype, "isPiao", {
            /**是否飘技能名称 */
            get: function () { return H52D_Framework.PassiveSkillConfig[this.id]["isPiao"]; },
            enumerable: true,
            configurable: true
        });
        ;
        return PassiveSkillData;
    }());
    H52D_Framework.PassiveSkillData = PassiveSkillData;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PassiveSkillData.js.map