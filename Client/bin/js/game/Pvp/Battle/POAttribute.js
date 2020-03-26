var H52D_Framework;
(function (H52D_Framework) {
    var POAttribute = /** @class */ (function () {
        function POAttribute(owner, data) {
            this._owner = null;
            /**属性id */
            this._attributeID = 0;
            /**属性加值*/
            this._attributeSubValue = 0;
            this._owner = owner;
            this._attributeID = data[1];
            this._attributeSubValue = data[2];
        }
        /**修改属性 */
        POAttribute.prototype.OnEffect = function () {
            var attr = this._owner.attr;
            if (attr == null)
                return;
            var modfiy_id = attr.GetAttributeModfiyID(this._attributeID);
            var isPercent = attr.GetAttributeIsPer(modfiy_id);
            if (isPercent == 1) {
                attr.ModfiyAttributeValue(modfiy_id, H52D_Framework.eValueType.Percent, this._attributeSubValue);
            }
            else {
                attr.ModfiyAttributeValue(modfiy_id, H52D_Framework.eValueType.Fixed, this._attributeSubValue);
            }
        };
        return POAttribute;
    }());
    H52D_Framework.POAttribute = POAttribute;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=POAttribute.js.map