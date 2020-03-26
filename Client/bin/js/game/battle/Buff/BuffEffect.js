/**
* Buff效果类
*/
var H52D_Framework;
(function (H52D_Framework) {
    var BuffEffect = /** @class */ (function () {
        function BuffEffect(buffdata, owner, ratio, btype) {
            this._owner = null;
            this._buffData = null;
            /**作用目标列表 */
            this._target = [];
            /**取值目标列表 */
            this._takeTarget = [];
            /**最大取值列表数 */
            this._maxSubValueNum = 0;
            /**当前取值列表数 */
            this._indexSubValueNum = 0;
            /**Mp回复速度 */
            this._MpRecoveryCurrent = 0;
            /**Mp上限值 */
            this._MpPoolCurrent = 0;
            this._LastValueArray = [];
            /**从取值目标里获得的加值列表 */
            this._subValue = [];
            /**取值之和 */
            this._subValueSum = 0;
            /**伤害系数 */
            this._ratio = 0;
            this._modfiyID = 0;
            this._timeboold = 0;
            this._buffData = buffdata;
            this._owner = owner;
            if (!this._buffData)
                return;
            if (this.BMpModfiy()) {
                this._target.push(H52D_Framework.MasterPlayer.Instance.player);
                this.Select(0);
                return;
            }
            this._target = [];
            this._takeTarget = [];
            this._takeTarget = H52D_Framework.SelectTarget.BuffTarget(this._buffData, this._buffData.statusBirthTarget, this._owner, btype).concat();
            this._target = H52D_Framework.SelectTarget.BuffTarget(this._buffData, this._buffData.statusActionTarget, this._owner, btype).concat();
            if (ratio) {
                this._ratio = ratio;
            }
            for (var i = 0; i < this._takeTarget.length; i++) {
                this.GetSubValue(this._takeTarget[i]);
            }
            for (var i = 0; i < this._target.length; i++) {
                this.Select(i);
            }
            this.Refresh();
        }
        /**是否是修改MP */
        BuffEffect.prototype.BMpModfiy = function () {
            if (!this._buffData)
                return false;
            if (this._buffData.attributeId == 53 || this._buffData.attributeId == 51) {
                return true;
            }
            return false;
        };
        BuffEffect.prototype.Select = function (index) {
            this._maxSubValueNum = this._subValue.length;
            switch (this._buffData.statusType) {
                case 1:
                    if (this.BMpModfiy()) {
                        this.Modfiy_MP();
                    }
                    else {
                        this.Modfiy_Target(index);
                    }
                    break;
                case 2:
                    this.SuckHP(this._target[index]);
                    break;
                /**按生命上线比例回血 */
                case 3:
                    this.HPMaxBoold(this._target[index]);
                    break;
                /**嘲讽 */
                case 4:
                    this.Sneer();
                    break;
                case 5:
                    this.DoDizzness(this._target[index]);
                    break;
                case 6:
                    this.Sustained(this._target[index]);
                    break;
            }
        };
        /**获取加成值 */
        BuffEffect.prototype.GetSubValue = function (target) {
            if (!target || !this._buffData.attributeId)
                return;
            var modfiy_value = 0;
            var last_value = 0;
            var subvalue = 0;
            var attr = target.vo.attr;
            this._modfiyID = attr.GetAttributeModfiyID(this._buffData.attributeId);
            var isPer = attr.GetAttributeIsPer(this._modfiyID);
            last_value = attr.GetAttributeBuff(this._modfiyID);
            var ImIdArr = [21, 22, 23, 24, 25, 26, 27];
            var bIm = false;
            for (var k in ImIdArr) {
                if (this._modfiyID == ImIdArr[k]) {
                    bIm = true;
                }
            }
            if (isPer == 1 && !bIm) {
                subvalue = this._buffData.attributePer / 10000;
                modfiy_value = last_value * subvalue;
            }
            else {
                modfiy_value = this._buffData.attributePer;
            }
            if (this._buffData.statusBirthTarget == 8) {
                this._subValueSum += modfiy_value >> 0;
            }
            else {
                this._subValue.push(modfiy_value >> 0);
            }
        };
        /**从取值列表里选择取值*/
        BuffEffect.prototype.Modfiy_Target = function (index) {
            if (this._indexSubValueNum >= this._maxSubValueNum)
                this._indexSubValueNum = 0;
            if (this._buffData.statusBirthTarget == 8)
                this.Modfiy_Attr(this._target[index], this._subValueSum);
            else
                this.Modfiy_Attr(this._target[index], this._subValue[this._indexSubValueNum]);
            this._indexSubValueNum++;
        };
        /**改属性 */
        BuffEffect.prototype.Modfiy_Attr = function (target, subvalue) {
            /**目标属性 */
            if (!target)
                return;
            this._LastValueArray.push(subvalue);
            if (this._modfiyID == 0) {
                this._modfiyID = target.vo.attr.GetAttributeModfiyID(this._buffData.attributeId);
                subvalue = 0;
            }
            target.vo.attr.ModfiyAttributeValue(this._modfiyID, H52D_Framework.eValueType.Other, subvalue);
        };
        BuffEffect.prototype.Modfiy_MP = function () {
            var _this = this;
            if (this._buffData.attributeId == 53) {
                var subvalue = this._buffData.attributePer / 10000;
                var MpRecoveryCurrent = H52D_Framework.MasterPlayer.Instance.player.vo.attr.GetAttributeValue(53);
                var NowValue_1 = MpRecoveryCurrent * subvalue;
                NowValue_1 = Math.ceil(NowValue_1);
                this._MpRecoveryCurrent = NowValue_1;
                H52D_Framework.MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(53, H52D_Framework.eValueType.Other, NowValue_1);
                H52D_Framework.Event.DispatchEvent("MpRecoveryRateChange");
                H52D_Framework.Tick.Once(this._buffData.existTime, this, function () {
                    H52D_Framework.MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(53, H52D_Framework.eValueType.Other, -NowValue_1);
                    H52D_Framework.Event.DispatchEvent("MpRecoveryRateChange");
                });
            }
            if (this._buffData.attributeId == 51) {
                H52D_Framework.MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(51, H52D_Framework.eValueType.Other, this._buffData.attributePer);
                H52D_Framework.Event.DispatchEvent("MpPoolChange");
                this._MpPoolCurrent = this._buffData.attributePer;
                H52D_Framework.Tick.Once(this._buffData.existTime, this, function () {
                    H52D_Framework.MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(51, H52D_Framework.eValueType.Other, -_this._buffData.attributePer);
                    H52D_Framework.Event.DispatchEvent("MpPoolChange");
                });
            }
        };
        /**眩晕BUFF*/
        BuffEffect.prototype.DoDizzness = function (target) {
            var _this = this;
            H52D_Framework.Tick.Loop(100, this, function () {
                if (target.IsDie) {
                    return;
                }
                target.Idle();
            });
            H52D_Framework.Tick.Once(this._buffData.existTime, this, function () {
                H52D_Framework.Tick.Once(100, _this, function () {
                    H52D_Framework.Tick.ClearAll(_this);
                });
            });
        };
        /**吸血BUFF */
        BuffEffect.prototype.SuckHP = function (target) {
            if (target && target.vo) {
                var attr = target.vo.attr;
                var num = this._buffData.attributePer / 10000;
                //let damage = attr.GetAttributeValue(2) * this._ratio;
                var mod_damage = this._ratio * num >> 0;
                // if (BattleManager.Instance.PassType == 2 && CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                // 	mod_damage = 1;
                // }
                target.currentHp += mod_damage;
                H52D_Framework.Floating.DamageText(mod_damage.toString(), SkinEnum.SkinHP, target.PosX, target.PosY - 30, false);
            }
        };
        /**按生命上限比例回血 */
        BuffEffect.prototype.HPMaxBoold = function (target) {
            var _this = this;
            var attr = this._owner.vo.attr;
            var hpMax = attr.GetAttributeValue(1);
            var oncehp = hpMax * (this._buffData.attributePer / 10000) >> 0;
            // if (BattleManager.Instance.PassType == 2 && CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
            // 	oncehp = 1;
            // }
            H52D_Framework.Tick.Loop(this._buffData.LoopTime, this, function () {
                if (!target)
                    return;
                target.currentHp += oncehp;
                H52D_Framework.Floating.DamageText(oncehp.toString(), SkinEnum.SkinHP, target.PosX, target.PosY - 30, false);
                _this.BooldUpdate();
            });
            // Tick.Once(this._buffData.existTime, this, () => {
            // })
        };
        BuffEffect.prototype.BooldUpdate = function () {
            this._timeboold += 100;
            if (this._timeboold >= this._buffData.existTime) {
                this._timeboold = 0;
                H52D_Framework.Tick.ClearAll(this);
            }
        };
        /**哀木涕：嘿 ，孙子 */
        BuffEffect.prototype.Sneer = function () {
        };
        /**持续效果BUFF */
        BuffEffect.prototype.Sustained = function (target) {
            var _this = this;
            if (!this._owner)
                return;
            var attr = this._owner.vo.attr;
            var num = this._buffData.attributePer / 10000;
            var damage = attr.GetAttributeValue(2);
            var mod_damage = damage * num;
            if (target.vo.allDamgeReduction != -1) {
                mod_damage = mod_damage * target.vo.allDamgeReduction;
                if (mod_damage <= 0.9) {
                    mod_damage = 1;
                }
            }
            H52D_Framework.Tick.Loop(this._buffData.LoopTime, this, function () {
                target.OnHurt(mod_damage >> 0, false, SPECIAL_TYPE.SUSRAINED);
            });
            H52D_Framework.Tick.Once(this._buffData.existTime, this, function () {
                H52D_Framework.Tick.Once(100, _this, function () {
                    H52D_Framework.Tick.ClearAll(_this);
                });
            });
        };
        BuffEffect.prototype.Remove_Target = function (index) {
            if (this._indexSubValueNum >= this._maxSubValueNum)
                this._indexSubValueNum = 0;
            if (this._buffData.statusBirthTarget == 8)
                this.RemoveAttribute(this._target[index], this._subValueSum);
            else
                this.RemoveAttribute(this._target[index], this._subValue[this._indexSubValueNum]);
            this._indexSubValueNum++;
        };
        /**移除加成的属性 */
        BuffEffect.prototype.RemoveAttribute = function (target, subvalue) {
            if (target != null) {
                var attr = target.vo.attr;
                attr.ModfiyAttributeValue(this._modfiyID, H52D_Framework.eValueType.Other, -subvalue);
            }
        };
        BuffEffect.prototype.RemoveMp = function () {
            if (this._buffData.attributeId) {
                if (this._buffData.attributeId == 53) {
                    H52D_Framework.MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(53, H52D_Framework.eValueType.Other, -this._MpRecoveryCurrent);
                    H52D_Framework.Event.DispatchEvent("MpRecoveryRateChange");
                }
                if (this._buffData.attributeId == 51) {
                    H52D_Framework.MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(53, H52D_Framework.eValueType.Other, -this._MpPoolCurrent);
                    H52D_Framework.Event.DispatchEvent("MpPoolChange");
                }
            }
        };
        /**刷新所有属性面板 */
        BuffEffect.prototype.Refresh = function () {
            if (H52D_Framework.BattleManager.Instance.aIOperation) {
                H52D_Framework.BattleManager.Instance.aIOperation.Dps();
            }
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.REFFIXEDATTR);
            H52D_Framework.Event.DispatchEvent("RefreshList");
        };
        BuffEffect.prototype.OnUpdate = function () {
            for (var k in this._target) {
                if (this._target[k]) {
                    if (this._target[k].type == eCharacter_TYPE.MONSTER) {
                        var a = this._target[k];
                        if (a.IsDie)
                            this.Destroy();
                    }
                }
            }
        };
        BuffEffect.prototype.Destroy = function () {
            H52D_Framework.Tick.ClearAll(this);
            this._indexSubValueNum = 0;
            if (this._buffData.statusType == 1) {
                for (var i = 0; i < this._target.length; i++) {
                    this.Remove_Target(i);
                }
                this.RemoveMp();
                this.Refresh();
            }
            this._LastValueArray = [];
            this._takeTarget = [];
            this._target = [];
            this._owner = null;
            // this._buffData = null;
        };
        return BuffEffect;
    }());
    H52D_Framework.BuffEffect = BuffEffect;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=BuffEffect.js.map