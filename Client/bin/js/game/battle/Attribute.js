/**
* name
*/
var H52D_Framework;
(function (H52D_Framework) {
    /**属性 */
    var Attribute = /** @class */ (function () {
        /**1: 0 固定值 1百分比 */
        /**2: 0 不显示百分比 1显示百分比 */
        /**3: 0 没有  对应修改的ID*/
        /**4: 0 不带目标  1：主角 2：攻击型 3：防御型  4：所有英雄 5：神兽 6：阵营 7：所有*/
        function Attribute() {
            var _a;
            this._attributeTab = {};
            this._attributeTab = (_a = {},
                _a[1] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 0, 3: 1, 4: 0 },
                _a[2] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 0, 3: 2, 4: 0 },
                _a[3] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 0, 3: 3, 4: 0 },
                _a[4] = { 0: new H52D_Framework.AttributeValue(), 1: 0, 2: 1, 3: 4, 4: 0 },
                _a[5] = { 0: new H52D_Framework.AttributeValue(), 1: 0, 2: 1, 3: 5, 4: 0 },
                _a[8] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 1, 3: 3, 4: 0 },
                _a[9] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 1, 3: 1, 4: 0 },
                _a[10] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 1, 3: 2, 4: 0 },
                _a[11] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 1, 3: 2, 4: 1 },
                _a[12] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 1, 3: 2, 4: 2 },
                _a[13] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 1, 3: 2, 4: 3 },
                _a[14] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 1, 3: 2, 4: 4 },
                _a[15] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 1, 3: 2, 4: 5 },
                _a[16] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 1, 3: 2, 4: 6 },
                _a[17] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 1, 3: 2, 4: 7 },
                _a[21] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 1, 3: 21, 4: 4 },
                _a[22] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 1, 3: 22, 4: 4 },
                _a[23] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 1, 3: 23, 4: 4 },
                _a[24] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 1, 3: 24, 4: 4 },
                _a[25] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 1, 3: 25, 4: 4 },
                _a[26] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 1, 3: 26, 4: 4 },
                _a[27] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 1, 3: 27, 4: 7 },
                _a[31] = { 0: new H52D_Framework.AttributeValue(), 1: 0, 2: 1, 3: 4, 4: 1 },
                _a[32] = { 0: new H52D_Framework.AttributeValue(), 1: 0, 2: 1, 3: 4, 4: 2 },
                _a[33] = { 0: new H52D_Framework.AttributeValue(), 1: 0, 2: 1, 3: 4, 4: 3 },
                _a[34] = { 0: new H52D_Framework.AttributeValue(), 1: 0, 2: 1, 3: 4, 4: 4 },
                _a[35] = { 0: new H52D_Framework.AttributeValue(), 1: 0, 2: 1, 3: 4, 4: 5 },
                _a[36] = { 0: new H52D_Framework.AttributeValue(), 1: 0, 2: 1, 3: 4, 4: 6 },
                _a[37] = { 0: new H52D_Framework.AttributeValue(), 1: 0, 2: 1, 3: 4, 4: 7 },
                _a[41] = { 0: new H52D_Framework.AttributeValue(), 1: 0, 2: 1, 3: 5, 4: 1 },
                _a[42] = { 0: new H52D_Framework.AttributeValue(), 1: 0, 2: 1, 3: 5, 4: 2 },
                _a[43] = { 0: new H52D_Framework.AttributeValue(), 1: 0, 2: 1, 3: 5, 4: 3 },
                _a[44] = { 0: new H52D_Framework.AttributeValue(), 1: 0, 2: 1, 3: 5, 4: 4 },
                _a[45] = { 0: new H52D_Framework.AttributeValue(), 1: 0, 2: 1, 3: 5, 4: 5 },
                _a[46] = { 0: new H52D_Framework.AttributeValue(), 1: 0, 2: 1, 3: 5, 4: 6 },
                _a[47] = { 0: new H52D_Framework.AttributeValue(), 1: 0, 2: 1, 3: 5, 4: 7 },
                _a[51] = { 0: new H52D_Framework.AttributeValue(), 1: 0, 2: 0, 3: 51, 4: 1 },
                _a[52] = { 0: new H52D_Framework.AttributeValue(), 1: 0, 2: 0, 3: 52, 4: 1 },
                _a[53] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 0, 3: 53, 4: 1 },
                _a[54] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 1, 3: 0, 4: 0 },
                _a[55] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 1, 3: 0, 4: 0 },
                _a[56] = { 0: new H52D_Framework.AttributeValue(), 1: 0, 2: 1, 3: 0, 4: 0 },
                _a[57] = { 0: new H52D_Framework.AttributeValue(), 1: 1, 2: 1, 3: 0, 4: 0 },
                _a);
        }
        /**获取属性表————
         * 属性 1 生命  2 伤害 3 先手速度 4 暴击率 5 暴击倍率
         * 其他id 用于修改以上属性
         */
        Attribute.prototype.GetAttributeTab = function (id) {
            if (this._attributeTab[id]) {
                return this._attributeTab[id];
            }
            H52D_Framework.Debugger.LogError(id + "GetAttributeTab() this attribute is no exist");
            return null;
        };
        /**获取是否以百分比的方式加成 0固定值  1百分比加成 */
        Attribute.prototype.GetAttributeIsPer = function (id) {
            if (this._attributeTab[id]) {
                return this._attributeTab[id][1];
            }
            H52D_Framework.Debugger.LogError(id + "GetAttributeIsPer() this attribute is no exist");
            return null;
        };
        /**获取属性是否显示百分比 0不显示  1显示 */
        Attribute.prototype.GetAttributeIsPerShow = function (id) {
            if (this._attributeTab[id]) {
                return this._attributeTab[id][2];
            }
            H52D_Framework.Debugger.LogError(id + "GetAttributeIsPerShow() this attribute is no exist");
            return null;
        };
        /**获取属性修改ID */
        Attribute.prototype.GetAttributeModfiyID = function (id) {
            if (this._attributeTab[id]) {
                return this._attributeTab[id][3];
            }
            H52D_Framework.Debugger.LogError(id + "GetAttributeModfiyID() this attribute is no exist");
            return null;
        };
        /**获得属性目标ID */
        Attribute.prototype.GetAttributeTargetID = function (id) {
            if (this._attributeTab[id]) {
                return this._attributeTab[id][4];
            }
            H52D_Framework.Debugger.LogError(id + "GetAttributeTargetID() this attribute is no exist");
            return null;
        };
        /**获取属性值
         * 属性ID 1 生命  2 伤害 3 先手速度 4 暴击率 5 暴击倍率
         * 其他id 用于修改以上属性
         */
        Attribute.prototype.GetAttributeValue = function (id) {
            if (this._attributeTab[id]) {
                var v = this._attributeTab[id][0].Value;
                if (id == 4 && v > 10000) {
                    var y = 0;
                    return 10000;
                }
                else {
                    return this._attributeTab[id][0].Value;
                }
            }
            H52D_Framework.Debugger.LogError(id + "GetAttributeValue() this attribute is no exist");
            return null;
        };
        /**
         * 计算非暴击最终伤害
         * @param sratio 技能系数
         * @param id 减免ID1
         * @param id1 减免ID2
         */
        Attribute.prototype.GetAttributeDamage = function (sratio, breaks, Others) {
            var B = this._attributeTab[2][0].Base;
            var P = this._attributeTab[2][0].Percent;
            var F = this._attributeTab[2][0].Fixed;
            var O = this._attributeTab[2][0].Other;
            var bp = this._attributeTab[2][0].BPercent;
            var bf = this._attributeTab[2][0].BFixed;
            var sp = (P - breaks) / 10000;
            if (sp <= H52D_Framework.GameParamConfig["InjuryInsuranceCoefficient"]) {
                sp = H52D_Framework.GameParamConfig["InjuryInsuranceCoefficient"];
            }
            var bl = 1 + sp;
            var op = (bp - Others) / 10000;
            if (op <= H52D_Framework.GameParamConfig["InjuryInsuranceCoefficient"]) {
                op = H52D_Framework.GameParamConfig["InjuryInsuranceCoefficient"];
            }
            var opbl = 1 + op;
            var Damage = B * sratio * bl * opbl + F + O + bf;
            return Math.floor(Damage);
        };
        Attribute.prototype.GetAttributeD = function (sratio) {
            var B = this._attributeTab[2][0].Base;
            var P = this._attributeTab[2][0].Percent;
            var F = this._attributeTab[2][0].Fixed;
            var O = this._attributeTab[2][0].Other;
            var bl = 1 + (P / 10000);
            var Damage = B * sratio * bl + F + O;
            return Math.floor(Damage);
        };
        /**Buff获取基础值 */
        Attribute.prototype.GetAttributeBuff = function (id) {
            if (this._attributeTab[id]) {
                return this._attributeTab[id][0].bValue;
            }
            H52D_Framework.Debugger.LogError(id + "GetAttributeBuff() this attribute is no exist");
            return null;
        };
        /**属性ID 1 生命  2 伤害 3 先手速度 4 暴击率 5 暴击倍率
         * Base 配置值  Fixed 固定加值  Percent 百分比加值  Other 附加值
         * @param id 属性ID
         * @param type 类型ID
         */
        Attribute.prototype.GetAttributeTypeValue = function (id, type) {
            if (this._attributeTab[id]) {
                var value = 0;
                switch (type) {
                    case H52D_Framework.eValueType.Base:
                        value = this._attributeTab[id][0].Base;
                        break;
                    case H52D_Framework.eValueType.Fixed:
                        value = this._attributeTab[id][0].Fixed;
                        break;
                    case H52D_Framework.eValueType.Other:
                        value = this._attributeTab[id][0].Other;
                        break;
                    case H52D_Framework.eValueType.Percent:
                        value = this._attributeTab[id][0].Percent;
                        break;
                    case H52D_Framework.eValueType.BFixed:
                        value = this._attributeTab[id][0].BFixed;
                        break;
                    case H52D_Framework.eValueType.BPercent:
                        value = this._attributeTab[id][0].BPercent;
                        break;
                }
                return value;
            }
            H52D_Framework.Debugger.LogError(id + " GetAttributeTypev()  this attribute is no exist");
            return null;
        };
        /**属性 1 生命  2 伤害 3 先手速度 4 暴击率 5 暴击倍率
         * 其他id 用于修改以上属性
         * type：base配置值 percent加成百分比 fixed加成固定值 other附加固定值
         * 不可叠加
         */
        Attribute.prototype.SetAttributeValue = function (id, type, value) {
            if (this._attributeTab[id]) {
                this._attributeTab[id][0].SetValue(type, value);
            }
            else {
                H52D_Framework.Debugger.LogError(id + "SetAttributeValue()  this attribute is no exist");
            }
        };
        /**属性 1 生命  2 伤害 3 先手速度 4 暴击率 5 暴击倍率
         * 其他id 用于修改以上属性
         * type：base配置值 percent加成百分比 fixed加成固定值 other附加固定值
         * 可叠加
         */
        Attribute.prototype.ModfiyAttributeValue = function (id, type, value) {
            if (this._attributeTab[id]) {
                var x = this._attributeTab[id][0];
                x.ModfiyValue(type, value);
            }
            else {
                H52D_Framework.Debugger.LogError(id + "ModfiyAttributeValue()  this attribute is no exist");
            }
        };
        return Attribute;
    }());
    H52D_Framework.Attribute = Attribute;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Attribute.js.map