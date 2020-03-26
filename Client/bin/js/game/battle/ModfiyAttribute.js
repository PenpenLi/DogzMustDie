/**
* name
*/
var H52D_Framework;
(function (H52D_Framework) {
    var ModfiyAttribute = /** @class */ (function () {
        /**
         * 初始化
         * @param owner 所属者
         * @param data 属性数据
         */
        function ModfiyAttribute(owner, data) {
            /**属性id */
            this._attributeID = 0;
            /**属性加值*/
            this._attributeSubValue = 0;
            /**作用目标 */
            this._target = [];
            /**当前法力回复速度 */
            this._currentMpRecover = 0;
            /**当前法力上限制 */
            this._currentMp = 0;
            this._data = {};
            this.heroid = 0;
            this._owner = owner;
            this._data = data;
            this._attributeID = data[1];
            this._attributeSubValue = data[2];
        }
        Object.defineProperty(ModfiyAttribute.prototype, "getData", {
            get: function () { return this._data; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModfiyAttribute.prototype, "HeroId", {
            get: function () { return this.heroid; },
            enumerable: true,
            configurable: true
        });
        /**产生效果 */
        ModfiyAttribute.prototype.OnEffect = function (i) {
            if (i === void 0) { i = 0; }
            this._target = [];
            this.heroid = i > 0 ? i : 0;
            this._target = i <= 0 ? H52D_Framework.SelectTarget.ImpactTarget(this._attributeID, this._owner).concat() : this.GetHeroId(i);
            for (var i_1 = 0; i_1 < this._target.length; i_1++) {
                if (this._target[i_1]) {
                    this.AddAttribute(this._target[i_1]);
                }
            }
        };
        ModfiyAttribute.prototype.GetHeroId = function (id) {
            var heroList = H52D_Framework.HeroManager.Instance.Herolist;
            for (var k in heroList) {
                if (heroList[k].nHeroID == id) {
                    return [heroList[k]];
                }
            }
        };
        /**为单个目标 修改属性 */
        ModfiyAttribute.prototype.AddAttribute = function (target) {
            var attr = target.attr;
            if (this._attributeID == 53 || this._attributeID == 51) {
                this.AddAttributePlayer();
                return;
            }
            var modfiy_id = attr.GetAttributeModfiyID(this._attributeID);
            var isPercent = attr.GetAttributeIsPer(modfiy_id);
            if (isPercent == 1) {
                attr.ModfiyAttributeValue(modfiy_id, H52D_Framework.eValueType.Percent, this._attributeSubValue);
            }
            else {
                attr.ModfiyAttributeValue(modfiy_id, H52D_Framework.eValueType.Fixed, this._attributeSubValue);
            }
        };
        /**修改主角特有属性 */
        ModfiyAttribute.prototype.AddAttributePlayer = function () {
            if (this._attributeID == 53) {
                var subvalue = this._attributeSubValue / 10000;
                var mpCurrent = H52D_Framework.MasterPlayer.Instance.player.vo.attr.GetAttributeTypeValue(53, H52D_Framework.eValueType.Base);
                this._currentMpRecover = mpCurrent * subvalue;
                this._currentMpRecover = Math.ceil(this._currentMpRecover);
                H52D_Framework.MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(53, H52D_Framework.eValueType.Fixed, this._currentMpRecover);
                H52D_Framework.Event.DispatchEvent("MpRecoveryRateChange");
                return;
            }
            if (this._attributeID == 51) {
                H52D_Framework.MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(51, H52D_Framework.eValueType.Fixed, this._attributeSubValue);
                H52D_Framework.Event.DispatchEvent("MpPoolChange");
                return;
            }
        };
        /**
         * 删除增加的属性
         * @param target 目标
         */
        ModfiyAttribute.prototype.RemoveAttribute = function (target) {
            var attr = target.attr;
            if (this._attributeID == 53 || this._attributeID == 51) {
                this.RemoveAttributePlayer();
                return;
            }
            var modfiy_id = attr.GetAttributeModfiyID(this._attributeID);
            var isPercent = attr.GetAttributeIsPer(modfiy_id);
            if (isPercent == 1) {
                attr.ModfiyAttributeValue(modfiy_id, H52D_Framework.eValueType.Percent, -this._attributeSubValue);
            }
            else {
                attr.ModfiyAttributeValue(modfiy_id, H52D_Framework.eValueType.Fixed, -this._attributeSubValue);
            }
        };
        /**
         * 删除增加的主角特有属性
         */
        ModfiyAttribute.prototype.RemoveAttributePlayer = function () {
            if (this._attributeID == 53) {
                H52D_Framework.MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(53, H52D_Framework.eValueType.Fixed, -this._currentMpRecover);
                H52D_Framework.Event.DispatchEvent("MpRecoveryRateChange");
            }
            if (this._attributeID == 51) {
                H52D_Framework.MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(51, H52D_Framework.eValueType.Fixed, -this._attributeSubValue);
                H52D_Framework.Event.DispatchEvent("MpPoolChange");
            }
        };
        /**销毁 */
        ModfiyAttribute.prototype.Destroy = function () {
            for (var i = 0; i < this._target.length; i++) {
                if (this._target[i]) {
                    this.RemoveAttribute(this._target[i]);
                }
            }
            this._target = [];
        };
        return ModfiyAttribute;
    }());
    H52D_Framework.ModfiyAttribute = ModfiyAttribute;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ModfiyAttribute.js.map