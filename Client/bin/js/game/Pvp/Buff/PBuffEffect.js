var H52D_Framework;
(function (H52D_Framework) {
    var PBuffEffect = /** @class */ (function () {
        function PBuffEffect(buffdata, owner, ratio, btype, belongs) {
            this._owner = null;
            this._buffData = null;
            /**作用目标列表 */
            this._target = [];
            /**取值目标列表 */
            this._takeTarget = [];
            /**取值之和 */
            this._subValueSum = 0;
            /**伤害系数 */
            this._ratio = 0;
            /**修改属性ID */
            this._modfiyID = 0;
            /**战场类型 1 我  -1 敌 */
            this._btype = 0;
            this.belongs = eBELONGS_TO.ATTACK;
            this._buffData = buffdata;
            this._owner = owner;
            this._ratio = ratio;
            this._btype = btype;
            this.belongs = belongs;
        }
        PBuffEffect.prototype.Do = function () {
            if (!this._buffData)
                return;
            if (this.BMpModfiy()) {
                return;
            }
            this.assTarget(this._btype, this.belongs);
            if (this._buffData.statusBirthTarget == 8) {
                this.GetSubValueA(this._takeTarget);
            }
            if (this._buffData.statusType == 4) {
                this.Select(0);
            }
            else {
                for (var i = 0; i < this._target.length; i++) {
                    this.Select(i);
                }
            }
        };
        /**给目标赋值 */
        PBuffEffect.prototype.assTarget = function (btype, belongs) {
            this._target = [];
            this._takeTarget = [];
            this._takeTarget = H52D_Framework.SelectTarget.PBuffTarget(this._buffData, this._buffData.statusBirthTarget, this._owner, btype, belongs).concat();
            this._target = H52D_Framework.SelectTarget.PBuffTarget(this._buffData, this._buffData.statusActionTarget, this._owner, btype, belongs).concat();
        };
        /**是否是修改MP */
        PBuffEffect.prototype.BMpModfiy = function () {
            if (!this._buffData)
                return false;
            if (this._buffData.attributeId == 53 || this._buffData.attributeId == 51) {
                return true;
            }
            return false;
        };
        PBuffEffect.prototype.Select = function (index) {
            switch (this._buffData.statusType) {
                case 1:
                    if (this.BMpModfiy()) {
                        return;
                    }
                    else {
                        if (this._buffData.statusBirthTarget == 8) {
                            this.Modfiy_Attr(this._target[index], this._subValueSum);
                        }
                        else {
                            this.Modfiy_Attr(this._target[index]);
                        }
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
        PBuffEffect.prototype.GetSubValue = function (target) {
            if (!target || !this._buffData.attributeId)
                return;
            // let modfiy_value = 0;
            // let last_value = 0;
            // let subvalue = 0;
            var attr = target.vo.attr;
            this._modfiyID = attr.GetAttributeModfiyID(this._buffData.attributeId);
            var isPer = attr.GetAttributeIsPer(this._modfiyID);
            if (isPer == 1) {
                attr.ModfiyAttributeValue(this._modfiyID, H52D_Framework.eValueType.BPercent, this._buffData.attributePer);
                // subvalue = this._buffData.attributePer / 10000;
                // modfiy_value = last_value * subvalue;
            }
            else {
                attr.ModfiyAttributeValue(this._modfiyID, H52D_Framework.eValueType.BFixed, this._buffData.attributePer);
                // modfiy_value = this._buffData.attributePer;
            }
            // if (this._buffData.statusBirthTarget == 8) {
            // 	this._subValueSum += modfiy_value >> 0;
            // }
            // else {
            // 	this._subValue.push(modfiy_value >> 0);
            // }
        };
        PBuffEffect.prototype.GetSubValueA = function (target) {
            for (var k in target) {
                if (target[k]) {
                    var modfiy_value = 0;
                    var last_value = 0;
                    var subvalue = 0;
                    var attr = target[k].vo.attr;
                    this._modfiyID = attr.GetAttributeModfiyID(this._buffData.attributeId);
                    subvalue = this._buffData.attributePer / 10000;
                    modfiy_value = last_value * subvalue;
                    this._subValueSum += modfiy_value >> 0;
                }
            }
            // attr.ModfiyAttributeValue(this._modfiyID, eValueType.BFixed, this._buffData.attributePer);
        };
        /**改属性 */
        PBuffEffect.prototype.Modfiy_Attr = function (target, subvalue) {
            var _this = this;
            /**目标属性 */
            if (!target || !this._buffData.attributeId)
                return;
            var attr = target.vo.attr;
            if (this._buffData.statusBirthTarget == 8) {
                attr.ModfiyAttributeValue(this._modfiyID, H52D_Framework.eValueType.Other, subvalue);
            }
            else {
                this._modfiyID = attr.GetAttributeModfiyID(this._buffData.attributeId);
                var isPer = attr.GetAttributeIsPer(this._modfiyID);
                if (isPer == 1) {
                    attr.ModfiyAttributeValue(this._modfiyID, H52D_Framework.eValueType.BPercent, this._buffData.attributePer);
                }
                else {
                    attr.ModfiyAttributeValue(this._modfiyID, H52D_Framework.eValueType.BFixed, this._buffData.attributePer);
                }
            }
            H52D_Framework.Tick.Once(this._buffData.existTime, this, function () {
                _this.Destroy();
            });
        };
        PBuffEffect.prototype.Modfiy_MP = function () {
            // if (this._buffData.attributeId == 53) {
            // 	let subvalue = this._buffData.attributePer / 10000;
            // 	let MpRecoveryCurrent = MasterPlayer.Instance.player.vo.attr.GetAttributeValue(53);
            // 	let NowValue = MpRecoveryCurrent * subvalue;
            // 	NowValue = Math.ceil(NowValue);
            // 	this._MpRecoveryCurrent = NowValue;
            // 	MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(53, eValueType.Other, NowValue);
            // 	Event.DispatchEvent("MpRecoveryRateChange");
            // 	Tick.Once(this._buffData.existTime, this, () => {
            // 		MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(53, eValueType.Other, -NowValue);
            // 		Event.DispatchEvent("MpRecoveryRateChange");
            // 	});
            // }
            // if (this._buffData.attributeId == 51) {
            // 	MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(51, eValueType.Other, this._buffData.attributePer);
            // 	Event.DispatchEvent("MpPoolChange");
            // 	this._MpPoolCurrent = this._buffData.attributePer;
            // 	Tick.Once(this._buffData.existTime, this, () => {
            // 		MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(51, eValueType.Other, -this._buffData.attributePer);
            // 		Event.DispatchEvent("MpPoolChange");
            // 	});
            // }
        };
        /**眩晕BUFF*/
        PBuffEffect.prototype.DoDizzness = function (target) {
            var tar = target;
            if (tar.IsDie)
                return;
            tar.BClose = true;
            target.Idle();
            H52D_Framework.Tick.Once(this._buffData.existTime, this, function () {
                tar.BClose = false;
            });
        };
        /**吸血BUFF */
        PBuffEffect.prototype.SuckHP = function (target) {
            if (target && target.vo) {
                var attr = target.vo.attr;
                var num = this._buffData.attributePer / 10000;
                var mod_damage = this._ratio * num >> 0;
                target.CurrentHp += mod_damage;
                H52D_Framework.Floating.DamageText(mod_damage.toString(), SkinEnum.SkinHP, target.PosX, target.PosY - 30, false);
            }
        };
        /**按生命上限比例回血 */
        PBuffEffect.prototype.HPMaxBoold = function (target) {
            var _this = this;
            if (!target)
                return;
            var attr = this._owner.vo.attr;
            var hpMax = attr.GetAttributeValue(1);
            var oncehp = hpMax * (this._buffData.attributePer / 10000) >> 0;
            H52D_Framework.Tick.Loop(this._buffData.LoopTime, this, function () {
                target.CurrentHp += oncehp;
                H52D_Framework.Floating.DamageText(oncehp.toString(), SkinEnum.SkinHP, target.PosX, target.PosY - 30, false);
            });
            H52D_Framework.Tick.Once(this._buffData.existTime, this, function () {
                H52D_Framework.Tick.ClearAll(_this);
            });
        };
        /**哀木涕：嘿 ，孙子 */
        PBuffEffect.prototype.Sneer = function () {
            for (var k in this._target) {
                if (this._target[k])
                    this._target[k].Target[0] = this._owner;
            }
            H52D_Framework.Tick.Once(this._buffData.existTime, this, function () {
                if (!H52D_Framework.BattlefieldManager.Instance.end)
                    H52D_Framework.BattlefieldManager.Instance.ResetT();
            });
        };
        /**持续效果BUFF */
        PBuffEffect.prototype.Sustained = function (target) {
            var _this = this;
            if (!this._owner)
                return;
            var attr = this._owner.vo.attr;
            var num = this._buffData.attributePer / 10000;
            var damage = attr.GetAttributeValue(2);
            var mod_damage = damage * num;
            H52D_Framework.Tick.Loop(this._buffData.LoopTime, this, function () {
                target.OnHurt(_this.belongs, _this._owner, mod_damage >> 0, SPECIAL_TYPE.SUSRAINED, false);
            });
            H52D_Framework.Tick.Once(this._buffData.existTime, this, function () {
                H52D_Framework.Tick.Once(100, _this, function () {
                    H52D_Framework.Tick.ClearAll(_this);
                });
            });
        };
        /**移除加成的属性 */
        PBuffEffect.prototype.RemoveAttribute = function (target, subvalue) {
            var attr = target.vo.attr;
            attr.ModfiyAttributeValue(this._modfiyID, H52D_Framework.eValueType.Other, -subvalue);
        };
        PBuffEffect.prototype.RemoveMp = function () {
        };
        /**刷新所有属性面板 */
        PBuffEffect.prototype.Refresh = function () {
        };
        PBuffEffect.prototype.OnUpdate = function () {
        };
        PBuffEffect.prototype.Destroy = function () {
            H52D_Framework.Tick.ClearAll(this);
            if (this._buffData.statusType == 1) {
                for (var i = 0; i < this._target.length; i++) {
                    if (this._target[i]) {
                        if (this._buffData.statusBirthTarget == 8) {
                            this.RemoveAttribute(this._target[i], this._subValueSum);
                        }
                        else {
                            this.RemoveAttribute(this._target[i], this._buffData.attributePer);
                        }
                    }
                }
                // this.RemoveMp();
                // this.Refresh();
            }
            this._takeTarget = [];
            this._target = [];
            this._owner = null;
        };
        return PBuffEffect;
    }());
    H52D_Framework.PBuffEffect = PBuffEffect;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PBuffEffect.js.map