/**
* Buff数据类
*/
var H52D_Framework;
(function (H52D_Framework) {
    var BuffData = /** @class */ (function () {
        function BuffData(id) {
            this.id = id;
            this.firstTime = H52D_Framework.StatusConfig[id].periodEffect["1"];
            this.LoopTime = H52D_Framework.StatusConfig[id].periodEffect["2"];
            this.existTime = H52D_Framework.StatusConfig[id].periodEffect["3"];
            this.inlayCd = H52D_Framework.StatusConfig[id].inlayCd;
            this.statusType = H52D_Framework.StatusConfig[id].statusType;
            this.attributeId = H52D_Framework.StatusConfig[id].effectList["1"];
            this.attributePer = H52D_Framework.StatusConfig[id].effectList["2"];
            this.statusBirthTarget = H52D_Framework.StatusConfig[id].statusBirthTarget;
            this.statusActionTarget = H52D_Framework.StatusConfig[id].statusActionTarget;
            this.PosX = 0;
            this.PosY = 0;
            this.Dir = 1;
            this.DataDispose();
        }
        Object.defineProperty(BuffData.prototype, "nameId", {
            /**名称ID */
            get: function () { return H52D_Framework.StatusConfig[this.id].nameId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BuffData.prototype, "descId", {
            /**描述ID */
            get: function () { return H52D_Framework.StatusConfig[this.id].descId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BuffData.prototype, "strIcon", {
            /**图标名称 */
            get: function () { return H52D_Framework.StatusConfig[this.id].strIcon; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BuffData.prototype, "pointID", {
            /**状态特效 */
            //public spcEftId:any;
            /**挂点ID */
            get: function () { return H52D_Framework.StatusConfig[this.id].spcEftId[1]; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(BuffData.prototype, "effectPath", {
            /**效果路径 */
            get: function () { return H52D_Framework.StatusConfig[this.id].spcEftId[2]; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(BuffData.prototype, "effectName", {
            /**动画名字 */
            get: function () { return H52D_Framework.StatusConfig[this.id].spcEftId[3]; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(BuffData.prototype, "effectScla", {
            /**特效大小 */
            get: function () { return H52D_Framework.StatusConfig[this.id].spcEftId[4]; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(BuffData.prototype, "level", {
            /**状态等级 */
            get: function () { return H52D_Framework.StatusConfig[this.id].level; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BuffData.prototype, "repeatType", {
            /**替换规则 */
            get: function () { return H52D_Framework.StatusConfig[this.id].repeatType; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BuffData.prototype, "isGoodStatus", {
            /**是否增益 */
            get: function () { return H52D_Framework.StatusConfig[this.id].isGoodStatus; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BuffData.prototype, "continueType", {
            /**状态持续类型 */
            get: function () { return H52D_Framework.StatusConfig[this.id].continueType; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BuffData.prototype, "isDieRemove", {
            /**死亡是否消失 */
            get: function () { return H52D_Framework.StatusConfig[this.id].isDieRemove; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(BuffData.prototype, "offlineDispose", {
            /**离线处理 */
            get: function () { return H52D_Framework.StatusConfig[this.id].offlineDispose; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(BuffData.prototype, "hierarchy", {
            get: function () { return H52D_Framework.StatusConfig[this.id].hierarchy; },
            enumerable: true,
            configurable: true
        });
        ;
        BuffData.prototype.DataDispose = function () {
            if (this.statusType == 2 || this.statusType == 6) {
                this.attributePer = this.attributeId;
                this.attributeId = 2;
            }
            else if (this.statusType == 3) {
                this.attributePer = this.attributeId;
                this.attributeId = 1;
            }
            switch (this.statusActionTarget) {
                case 1:
                    if (this.statusBirthTarget == 0) {
                        this.statusBirthTarget = 1;
                    }
                    break;
                case 5:
                    if (this.statusBirthTarget == 0) {
                        this.statusBirthTarget = 5;
                    }
                    break;
                case 6:
                    if (this.statusBirthTarget == 0) {
                        this.statusBirthTarget = 6;
                    }
                    break;
                case 7:
                    if (this.statusBirthTarget == 0) {
                        this.statusBirthTarget = 7;
                    }
                    break;
            }
        };
        return BuffData;
    }());
    H52D_Framework.BuffData = BuffData;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=BuffData.js.map