var H52D_Framework;
(function (H52D_Framework) {
    var PlayerVo = /** @class */ (function () {
        function PlayerVo() {
            this._isvip = false;
            this.attr = new H52D_Framework.Attribute();
            var level = H52D_Framework.MasterPlayer.Instance.player.Level;
            var data = H52D_Framework.RoleLevelUpConfig[level];
            this.attr.SetAttributeValue(2, H52D_Framework.eValueType.Base, data["Attack"]);
            this.attr.SetAttributeValue(4, H52D_Framework.eValueType.Base, data["Crit"]);
            this.attr.SetAttributeValue(5, H52D_Framework.eValueType.Base, data["CritRatio"]);
        }
        Object.defineProperty(PlayerVo.prototype, "_VipHitDamageUp", {
            get: function () {
                return H52D_Framework.GameParamConfig["VipHitDamageUp"];
            },
            enumerable: true,
            configurable: true
        });
        PlayerVo.prototype.setVip = function () {
            this._isvip = true;
            this.attr.ModfiyAttributeValue(2, H52D_Framework.eValueType.Percent, this._VipHitDamageUp);
        };
        PlayerVo.prototype.UpdateInfo = function () {
            this.attr = new H52D_Framework.Attribute();
            var level = H52D_Framework.MasterPlayer.Instance.player.Level;
            var data = H52D_Framework.RoleLevelUpConfig[level];
            if (this._isvip) {
                this.attr.ModfiyAttributeValue(2, H52D_Framework.eValueType.Percent, this._VipHitDamageUp);
            }
            this.attr.SetAttributeValue(2, H52D_Framework.eValueType.Base, data["Attack"]);
            this.attr.SetAttributeValue(4, H52D_Framework.eValueType.Base, data["Crit"]);
            this.attr.SetAttributeValue(5, H52D_Framework.eValueType.Base, data["CritRatio"]);
        };
        PlayerVo.prototype.UpdateBase = function () {
            var level = H52D_Framework.MasterPlayer.Instance.player.Level;
            var data = H52D_Framework.RoleLevelUpConfig[level];
            this.attr.SetAttributeValue(2, H52D_Framework.eValueType.Base, data["Attack"]);
        };
        PlayerVo.prototype.UpdatePassive = function () {
            for (var i = 1; i <= 5; i++) {
                this.attr.SetAttributeValue(i, H52D_Framework.eValueType.Percent, 0);
                this.attr.SetAttributeValue(i, H52D_Framework.eValueType.Fixed, 0);
            }
            for (var i = 21; i <= 27; i++) {
                this.attr.SetAttributeValue(i, H52D_Framework.eValueType.Percent, 0);
                this.attr.SetAttributeValue(i, H52D_Framework.eValueType.Fixed, 0);
            }
            if (this._isvip) {
                /**设置伤害 */
                this.attr.SetAttributeValue(2, H52D_Framework.eValueType.Percent, this._VipHitDamageUp);
            }
            this.attr.SetAttributeValue(51, H52D_Framework.eValueType.Fixed, 0);
            this.attr.SetAttributeValue(53, H52D_Framework.eValueType.Fixed, 0);
        };
        return PlayerVo;
    }());
    H52D_Framework.PlayerVo = PlayerVo;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PlayerVo.js.map