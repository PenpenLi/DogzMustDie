var H52D_Framework;
(function (H52D_Framework) {
    var PPlayerInfo = /** @class */ (function () {
        function PPlayerInfo(data) {
            this._isvip = false;
            this._level = 0;
            this._MpMax = 0;
            /**当前MP */
            this.CMp = 0;
            this._MpRec = 0;
            this.SkillList = [];
            this.location = -2;
            this.MpMax = data["MpMax"];
            this._level = data["level"];
            this.MpRec = data["MpRec"];
            this.CMp = data["Cmp"];
            this.SkillList = data["sList"];
            this._isvip = data["isVip"];
            this.attr = new H52D_Framework.Attribute();
            var dataUp = H52D_Framework.RoleLevelUpConfig[this._level];
            this.attr.SetAttributeValue(2, H52D_Framework.eValueType.Base, dataUp["Attack"]);
            this.attr.SetAttributeValue(4, H52D_Framework.eValueType.Base, dataUp["Crit"]);
            this.attr.SetAttributeValue(5, H52D_Framework.eValueType.Base, dataUp["CritRatio"]);
            if (this._isvip) {
                this.attr.ModfiyAttributeValue(2, H52D_Framework.eValueType.Percent, this._VipHitDamageUp);
            }
        }
        Object.defineProperty(PPlayerInfo.prototype, "_VipHitDamageUp", {
            /**Vip加成的点击伤害 */
            get: function () {
                return H52D_Framework.GameParamConfig["VipHitDamageUp"];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PPlayerInfo.prototype, "Level", {
            get: function () { return this._level; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PPlayerInfo.prototype, "MpMax", {
            get: function () { return this._MpMax; },
            set: function (value) { this._MpMax = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PPlayerInfo.prototype, "MpRec", {
            /**MP回复速度 */
            get: function () { return this._MpRec; },
            set: function (value) { this._MpRec = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PPlayerInfo.prototype, "name", {
            get: function () { return "玩家"; },
            enumerable: true,
            configurable: true
        });
        return PPlayerInfo;
    }());
    H52D_Framework.PPlayerInfo = PPlayerInfo;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PPlayerInfo.js.map