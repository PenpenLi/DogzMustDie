var H52D_Framework;
(function (H52D_Framework) {
    var PAIOperation = /** @class */ (function () {
        function PAIOperation() {
            this._campDps = 0;
            this._heroDps = 0;
            this._petDps = 0;
            this._allDps = 0;
        }
        Object.defineProperty(PAIOperation.prototype, "CampDps", {
            /**阵营DPS */
            get: function () { return this._campDps; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PAIOperation.prototype, "HeroDps", {
            /**英雄DPS */
            get: function () { return this._heroDps; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PAIOperation.prototype, "PetDps", {
            /**神兽DPS */
            get: function () { return this._petDps; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PAIOperation.prototype, "AllDps", {
            /**总DPS */
            get: function () { return this._allDps; },
            enumerable: true,
            configurable: true
        });
        /**销毁 */
        PAIOperation.prototype.Destroy = function () {
        };
        PAIOperation.prototype.OnUpdate = function () {
        };
        /**DPS小面板 */
        PAIOperation.prototype.Dps = function () {
            this._allDps = 0;
            this._petDps = 0;
            this._heroDps = 0;
            this._campDps = 0;
            var pvpChara = H52D_Framework.BattlefieldManager.Instance.Characterlist[0];
            /**通知修改英雄DPS显示 */
            if (pvpChara.Heromanager) {
                var count = pvpChara.HeroList.length;
                for (var index = 0; index < count; index++) {
                    var heroC = pvpChara.HeroList[index];
                    if (heroC) {
                        var cd = 1.5;
                        if (heroC.attackSkill) {
                            cd = (heroC.attackSkill.Data.skillCD) / 1000;
                        }
                        var dps = heroC.vo.attr.GetAttributeValue(2) / cd;
                        this._heroDps += dps >> 0;
                    }
                }
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.HERO_DPS, [this._heroDps.toString()]);
            }
            /**通知修改神兽DPS显示 */
            if (pvpChara.petMgr) {
                this._petDps = pvpChara.petMgr.PetIns.vo.attr.GetAttributeValue(2);
                this._petDps = this._petDps * pvpChara.petMgr.PetIns.vo.ratio;
                this._petDps = this._petDps / pvpChara.petMgr.PetIns.vo.CD >> 0;
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.PET_DPS, [this._petDps.toString()]);
            }
            /**通知修改阵营DPS显示*/
            if (pvpChara.campMgr) {
                this._campDps = pvpChara.campMgr.Camp.vo.attr.GetAttributeValue(2) * pvpChara.campMgr.Camp.vo.ratio;
                var cd = pvpChara.campMgr.Camp.vo.CD;
                this._campDps = this._campDps / cd >> 0;
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.CAMP_DPS, [this._campDps.toString()]);
            }
            /**通知修改所有DPS显示*/
            this._allDps = this._heroDps + this._petDps + this._campDps >> 0;
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.ALL_DPS, [this._allDps.toString()]);
        };
        return PAIOperation;
    }());
    H52D_Framework.PAIOperation = PAIOperation;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PAIOperation.js.map