var H52D_Framework;
(function (H52D_Framework) {
    var PAttribute = /** @class */ (function () {
        /**owner在这里基本属于无用的 别问为什么 我也不知道 */
        // private tardata:any;
        /**
         * 初始化
         * @param owner 所属者
         * @param data 一条完整的数据格式{id:0,value:0}
         */
        function PAttribute(data) {
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
            this._owner = this;
            this._attributeID = data[1];
            this._attributeSubValue = data[2];
        }
        /**产生效果 */
        PAttribute.prototype.OnEffect = function (tardata) {
            this._target = [];
            this._target = H52D_Framework.SelectTarget.PImpactTarget(this._attributeID, tardata).concat();
            for (var i = 0; i < this._target.length; i++) {
                if (this._target[i]) {
                    this.AddAttribute(this._target[i]);
                }
            }
        };
        /**为单个目标 修改属性 */
        PAttribute.prototype.AddAttribute = function (target) {
            var attr = target.attr;
            if (attr == null)
                return;
            if (this._attributeID == 53 || this._attributeID == 51) {
                // this.AddAttributePlayer();
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
        PAttribute.prototype.AddAttributePlayer = function () {
            // if (this._attributeID == 53) {
            // 	let subvalue = this._attributeSubValue / 10000;
            // 	let mpCurrent = MasterPlayer.Instance.player.vo.attr.GetAttributeTypeValue(53, eValueType.Base);
            // 	this._currentMpRecover = mpCurrent * subvalue;
            // 	this._currentMpRecover = Math.ceil(this._currentMpRecover);
            // 	MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(53, eValueType.Fixed, this._currentMpRecover);
            // 	Event.DispatchEvent("MpRecoveryRateChange");
            // 	return;
            // }
            // if (this._attributeID == 51) {
            // 	MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(51, eValueType.Fixed, this._attributeSubValue);
            // 	Event.DispatchEvent("MpPoolChange");
            // 	return;
            // }
        };
        /**
         * 删除增加的属性
         * @param target 目标
         */
        PAttribute.prototype.RemoveAttribute = function (target) {
            var attr = target.attr;
            if (this._attributeID == 53 || this._attributeID == 51) {
                // this.RemoveAttributePlayer();
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
        PAttribute.prototype.RemoveAttributePlayer = function () {
            // if (this._attributeID == 53) {
            // 	MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(53, eValueType.Fixed, -this._currentMpRecover);
            // 	Event.DispatchEvent("MpRecoveryRateChange");
            // }
            // if (this._attributeID == 51) {
            // 	MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(51, eValueType.Fixed, -this._attributeSubValue);
            // 	Event.DispatchEvent("MpPoolChange");
            // }
        };
        /**销毁 */
        PAttribute.prototype.Destroy = function () {
            for (var i = 0; i < this._target.length; i++) {
                if (this._target[i]) {
                    this.RemoveAttribute(this._target[i]);
                }
            }
            this._target = [];
        };
        return PAttribute;
    }());
    H52D_Framework.PAttribute = PAttribute;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PAttribute.js.map