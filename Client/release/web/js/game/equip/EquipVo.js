/**
* 时空法器类
*/
var H52D_Framework;
(function (H52D_Framework) {
    var EquipVo = /** @class */ (function () {
        /**
         * @param equipData 装备数据
         */
        function EquipVo(cfgId) {
            this._cfgId = cfgId; // 配置ID
            this._instId = -1; // 实例ID
            this._bLock = false; // 是否上锁
            this._cfgData = H52D_Framework.EquipConfig[this._cfgId];
        }
        Object.defineProperty(EquipVo.prototype, "instId", {
            /**装备实例ID */
            get: function () { return this._instId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EquipVo.prototype, "cfgId", {
            /**装备配置ID */
            get: function () { return this._cfgId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EquipVo.prototype, "bLock", {
            /**装备是否上锁 */
            get: function () { return this._bLock; },
            /**设置装备是否上锁 */
            set: function (b) { this._bLock = b; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EquipVo.prototype, "bNew", {
            /**是否新装备 */
            get: function () { return this._bNew; },
            /**设置是否新装备 */
            set: function (b) { this._bNew = b; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EquipVo.prototype, "equipGroup", {
            /**所属装备组 */
            get: function () { return this._cfgData.equipGroup; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EquipVo.prototype, "suitId", {
            /**归属套装ID */
            get: function () { return this._cfgData.suitId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EquipVo.prototype, "equipLevel", {
            /**装备等级 */
            get: function () { return this._cfgData.equipLevel; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EquipVo.prototype, "baseAttribute", {
            /**基础属性 */
            get: function () { return this._cfgData.baseAttribute; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EquipVo.prototype, "composeNeedNum", {
            /**合成需要数量 */
            get: function () { return this._cfgData.composeNeedNum; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EquipVo.prototype, "sellNum", {
            /**出售钻石数量 */
            get: function () { return this._cfgData.sellNum; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EquipVo.prototype, "equipName", {
            /**装备名称 */
            get: function () {
                if (this._cfgData) {
                    return H52D_Framework.GetInfoAttr.Instance.GetText(this._cfgData.equipName) ? H52D_Framework.GetInfoAttr.Instance.GetText(this._cfgData.equipName) : " ";
                }
                else {
                    return "时空法器";
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EquipVo.prototype, "equipIcon", {
            /**装备图标 */
            get: function () {
                if (this._cfgData) {
                    return this._cfgData.equipIcon ? this._cfgData.equipIcon : "lw_icon_20.png";
                }
                else {
                    return "lw_icon_20.png";
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EquipVo.prototype, "equipType", {
            /**装备类型 */
            get: function () {
                if (this._cfgData) {
                    return this._cfgData.equipType;
                }
                else {
                    return 1;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EquipVo.prototype, "equipColor", {
            /**装备品质 */
            get: function () {
                if (this._cfgData) {
                    return this._cfgData.equipColor;
                }
                else {
                    return 1;
                }
            },
            enumerable: true,
            configurable: true
        });
        /** 解析服务器数据 */
        EquipVo.prototype.unpackData = function (equipData) {
            // 接收数据
            this._instId = equipData[0]; // 实例ID
            this._bLock = equipData[1] == 1; // 是否上锁
            this._bNew = equipData[2] == 1; // 是否上锁
            this._cfgData = H52D_Framework.EquipConfig[this._cfgId];
        };
        return EquipVo;
    }());
    H52D_Framework.EquipVo = EquipVo;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=EquipVo.js.map