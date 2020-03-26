/*
* AI计算类;
*/
//备注：战斗流程
var H52D_Framework;
(function (H52D_Framework) {
    var AIOperation = /** @class */ (function () {
        function AIOperation() {
            this.heroDpsNum = 0;
            this._campDps = 0;
            this._heroDps = 0;
            this._petDps = 0;
            this._allDps = 0;
            /**面板展示神兽伤害 不算秒伤 */
            this.PetShoWDamage = 0;
            this.heroDpsNum = H52D_Framework.MasterPlayer.Instance.GetEventProByType(EventProEnum.HeroDPS);
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.MODIFYATTR, Laya.Handler.create(this, this.Dps));
        }
        Object.defineProperty(AIOperation.prototype, "CampDps", {
            /**阵营DPS */
            get: function () { return this._campDps; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AIOperation.prototype, "HeroDps", {
            /**英雄DPS */
            get: function () { return this._heroDps; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AIOperation.prototype, "PetDps", {
            /**神兽DPS */
            get: function () { return this._petDps; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AIOperation.prototype, "AllDps", {
            /**总DPS */
            get: function () { return this._allDps; },
            enumerable: true,
            configurable: true
        });
        /**销毁 */
        AIOperation.prototype.Destroy = function () {
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.MODIFYATTR, Laya.Handler.create(this, this.Dps));
        };
        AIOperation.prototype.OnUpdate = function () {
        };
        /**DPS小面板 */
        AIOperation.prototype.Dps = function () {
            this._allDps = 0;
            this._petDps = 0;
            this._heroDps = 0;
            this._campDps = 0;
            this.PetShoWDamage = 0;
            if (H52D_Framework.BattleManager.Instance.HeroCardMgr) {
                var count = H52D_Framework.BattleManager.Instance.HeroCardMgr.CHeroList.length;
                for (var index = 0; index < count; index++) {
                    var heroC = H52D_Framework.BattleManager.Instance.HeroCardMgr.CHeroList[index];
                    if (heroC) {
                        var cd = heroC.attackSkill ? (heroC.attackSkill.Data.skillCD) / 1000 : 1.5;
                        var dps = heroC.vo.attr.GetAttributeValue(2) / cd;
                        this._heroDps += dps >> 0;
                        this._petDps += heroC.vo.attr.GetAttributeValue(2);
                        this.PetShoWDamage += heroC.vo.attr.GetAttributeValue(2);
                    }
                }
            }
            if (this.heroDpsNum < this._heroDps) {
                this.heroDpsNum = this._heroDps;
                //英雄DPS最大值
                H52D_Framework.MasterPlayer.Instance.ReqOnEvent(EventProEnum.HeroDPS, this.heroDpsNum);
            }
            /**通知修改英雄DPS显示 */
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.HERO_DPS, [this._heroDps.toString()]);
            /**通知修改神兽DPS显示 */
            if (H52D_Framework.BPetManager.Instance.PetIns) {
                H52D_Framework.BPetManager.Instance.PetIns.vo.attr.SetAttributeValue(2, H52D_Framework.eValueType.Base, this._petDps >> 0);
                this._petDps = this._petDps * H52D_Framework.BPetManager.Instance.PetIns.vo.ratio;
                this._petDps = this._petDps / H52D_Framework.BPetManager.Instance.PetIns.vo.CD;
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.PET_DPS, this._petDps >> 0);
                this._allDps = this._petDps + this._heroDps >> 0;
            }
            else {
                this._allDps = this._heroDps;
            }
            /**知修改阵营DPS显示*/
            if (H52D_Framework.BCampManager.Instance.Camp) {
                H52D_Framework.BCampManager.Instance.Camp.vo.setDamage();
                this._campDps = H52D_Framework.BCampManager.Instance.Camp.vo.attr.GetAttributeValue(2) * H52D_Framework.BCampManager.Instance.Camp.vo.ratio;
                var cd = H52D_Framework.BCampManager.Instance.Camp.vo.CD;
                this._campDps = this._campDps / H52D_Framework.BCampManager.Instance.Camp.vo.CD >> 0;
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.CAMP_DPS, this._campDps);
            }
            this._allDps = this._allDps + this._campDps;
            /**通知修改所有伤害DPS显示 */
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.ALL_DPS, [this._allDps.toString()]);
        };
        /**计算点击暴击 */
        AIOperation.prototype.IsCrit = function () {
            var randnum = Math.random() * 10000;
            if (randnum == 0)
                return false;
            if (randnum <= H52D_Framework.MasterPlayer.Instance.player.vo.attr.GetAttributeValue(4)) {
                return true;
            }
            return false;
        };
        /**点击目标伤害 */
        AIOperation.prototype.EnemyOnHurt = function (damage, bScrit) {
            var monsterarr = H52D_Framework.MonsterManager.Instance.monsterList;
            var num = H52D_Framework.GetTabLength(monsterarr);
            for (var j = 0; j < num; j++) {
                if (monsterarr[j] != null) {
                    damage = damage * monsterarr[j].vo.allDamgeReduction;
                    monsterarr[j].OnHurt(damage >> 0, SkinEnum.SkinTap, bScrit);
                    return;
                }
            }
        };
        /**执行ai计算并触发攻击指令 */
        AIOperation.prototype.Do = function () {
            var _a, _b;
            var data = new H52D_Framework.SkillData(100);
            if (H52D_Framework.MasterPlayer.Instance.Damage == 999999999) {
                var color = SkinEnum.SkinTap;
                H52D_Framework.BattleManager.Instance.clickCritNum++;
                this.EnemyOnHurt(H52D_Framework.MasterPlayer.Instance.Damage >> 0, false);
                return _a = {}, _a[1] = H52D_Framework.MasterPlayer.Instance.Damage >> 0, _a[2] = color, _a[3] = false, _a;
            }
            else {
                var damage = H52D_Framework.MasterPlayer.Instance.player.vo.attr.GetAttributeValue(2);
                var color = SkinEnum.SkinTap;
                var isCrit = false;
                if (this.IsCrit()) {
                    isCrit = true;
                    var ratio = H52D_Framework.MasterPlayer.Instance.player.vo.attr.GetAttributeValue(5) / 10000;
                    damage = damage * ratio;
                    H52D_Framework.BattleManager.Instance.clickCritNum++;
                }
                this.EnemyOnHurt(damage + data.fixedDamage >> 0, isCrit);
                return _b = {}, _b[1] = damage + data.fixedDamage >> 0, _b[2] = color, _b[3] = isCrit, _b;
            }
        };
        return AIOperation;
    }());
    H52D_Framework.AIOperation = AIOperation;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=AIOperation.js.map