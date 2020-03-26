var H52D_Framework;
(function (H52D_Framework) {
    var BCampVo = /** @class */ (function () {
        function BCampVo() {
            this.level = 1;
            this.skillid = 0;
            this.ratio = 0;
            this.CD = 0;
            this.attr = new H52D_Framework.Attribute();
        }
        Object.defineProperty(BCampVo.prototype, "Level", {
            get: function () { return this.level; },
            enumerable: true,
            configurable: true
        });
        BCampVo.prototype.Setattribute = function () {
            this.setDamage();
            var cmp = H52D_Framework.CampManager.Instance.nCamp(H52D_Framework.MasterPlayer.Instance.player.CampID);
            if (!cmp) {
                return;
            }
            this.level = cmp["3"];
            this.skillid = H52D_Framework.GangLevelUpConfig[this.level]["GangSkillId"];
            this.ratio = H52D_Framework.ActiveSkillConfig[this.skillid]["damageList"]["1"]["2"] / 10000;
            this.CD = H52D_Framework.ActiveSkillConfig[this.skillid]["skillCD"] / 1000;
        };
        BCampVo.prototype.setDamage = function () {
            var damage = 0;
            for (var k in H52D_Framework.HeroManager.Instance.Herolist) {
                var Hc = H52D_Framework.HeroManager.Instance.Herolist[k];
                if (Hc) {
                    damage += Hc.attr.GetAttributeValue(2);
                }
            }
            this.attr.SetAttributeValue(2, H52D_Framework.eValueType.Base, damage);
            this.attr.SetAttributeValue(5, H52D_Framework.eValueType.Base, 15000);
        };
        BCampVo.prototype.UpdatePassiveAttribute = function () {
            for (var i = 1; i <= 5; i++) {
                this.attr.SetAttributeValue(i, H52D_Framework.eValueType.Percent, 0);
                this.attr.SetAttributeValue(i, H52D_Framework.eValueType.Fixed, 0);
            }
            for (var i = 21; i <= 27; i++) {
                this.attr.SetAttributeValue(i, H52D_Framework.eValueType.Percent, 0);
                this.attr.SetAttributeValue(i, H52D_Framework.eValueType.Fixed, 0);
            }
        };
        return BCampVo;
    }());
    H52D_Framework.BCampVo = BCampVo;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=BCampVo.js.map