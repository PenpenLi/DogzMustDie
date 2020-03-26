var H52D_Framework;
(function (H52D_Framework) {
    var PCampInfo = /** @class */ (function () {
        function PCampInfo(data) {
            this.level = 1;
            this.skillid = 0;
            this.ratio = 0;
            this.CD = 0;
            this.location = -2;
            this.attr = new H52D_Framework.Attribute();
            this.level = data["level"];
            this.attr.SetAttributeValue(2, H52D_Framework.eValueType.Base, data["Base"]);
            this.skillid = H52D_Framework.GangLevelUpConfig[this.level]["GangSkillId"];
            this.ratio = H52D_Framework.ActiveSkillConfig[this.skillid]["damageList"]["1"]["2"] / 10000;
            this.CD = H52D_Framework.ActiveSkillConfig[this.skillid]["skillCD"] / 1000;
        }
        Object.defineProperty(PCampInfo.prototype, "Level", {
            get: function () { return this.level; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PCampInfo.prototype, "name", {
            get: function () { return "大船"; },
            enumerable: true,
            configurable: true
        });
        PCampInfo.prototype.SetDamage = function (List) {
            var damage = 0;
            for (var k in List) {
                if (List[k]) {
                    damage += List[k].vo.attr.GetAttributeValue(2);
                }
            }
            this.attr.SetAttributeValue(2, H52D_Framework.eValueType.Base, damage);
        };
        return PCampInfo;
    }());
    H52D_Framework.PCampInfo = PCampInfo;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PCampInfo.js.map