
module H52D_Framework {
	export class PBuffEffect {
		private _owner: any = null;
		private _buffData: BuffData = null;
		/**作用目标列表 */
		private _target: Array<any> = [];
		/**取值目标列表 */
		private _takeTarget: Array<any> = [];
		/**取值之和 */
		private _subValueSum: number = 0;
		/**伤害系数 */
		private _ratio: number = 0;
		/**修改属性ID */
		private _modfiyID: number = 0;
		/**战场类型 1 我  -1 敌 */
		private _btype: number = 0;
		private belongs: eBELONGS_TO = eBELONGS_TO.ATTACK;


		constructor(buffdata: BuffData, owner: any, ratio: number, btype, belongs) {
			this._buffData = buffdata;
			this._owner = owner;
			this._ratio = ratio;
			this._btype = btype;
			this.belongs = belongs;
		}


		public Do() {
			if (!this._buffData) return;
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
				for (let i = 0; i < this._target.length; i++) {
					this.Select(i);
				}
			}
		}

		/**给目标赋值 */
		private assTarget(btype, belongs) {
			this._target = [];
			this._takeTarget = [];
			this._takeTarget = SelectTarget.PBuffTarget(
				this._buffData,
				this._buffData.statusBirthTarget,
				this._owner, btype, belongs).concat();
			this._target = SelectTarget.PBuffTarget(
				this._buffData,
				this._buffData.statusActionTarget,
				this._owner, btype, belongs).concat();
		}

		/**是否是修改MP */
		private BMpModfiy(): boolean {
			if (!this._buffData) return false;
			if (this._buffData.attributeId == 53 || this._buffData.attributeId == 51) {
				return true;
			}
			return false;
		}

		private Select(index: number): void {
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
		}

		/**获取加成值 */
		private GetSubValue(target: any): void {
			if (!target || !this._buffData.attributeId) return;

			// let modfiy_value = 0;
			// let last_value = 0;
			// let subvalue = 0;

			let attr = target.vo.attr as Attribute;

			this._modfiyID = attr.GetAttributeModfiyID(this._buffData.attributeId);

			let isPer = attr.GetAttributeIsPer(this._modfiyID);

			if (isPer == 1) {
				attr.ModfiyAttributeValue(this._modfiyID, eValueType.BPercent, this._buffData.attributePer);
				// subvalue = this._buffData.attributePer / 10000;
				// modfiy_value = last_value * subvalue;
			}
			else {
				attr.ModfiyAttributeValue(this._modfiyID, eValueType.BFixed, this._buffData.attributePer);
				// modfiy_value = this._buffData.attributePer;
			}

			// if (this._buffData.statusBirthTarget == 8) {
			// 	this._subValueSum += modfiy_value >> 0;
			// }
			// else {
			// 	this._subValue.push(modfiy_value >> 0);
			// }
		}

		private GetSubValueA(target: Array<any>): void {
			for (let k in target) {
				if (target[k]) {
					let modfiy_value = 0;
					let last_value = 0;
					let subvalue = 0;
					let attr = target[k].vo.attr as Attribute;
					this._modfiyID = attr.GetAttributeModfiyID(this._buffData.attributeId);
					subvalue = this._buffData.attributePer / 10000;
					modfiy_value = last_value * subvalue;
					this._subValueSum += modfiy_value >> 0;
				}
			}
			// attr.ModfiyAttributeValue(this._modfiyID, eValueType.BFixed, this._buffData.attributePer);
		}

		/**改属性 */
		private Modfiy_Attr(target: any, subvalue?): void {
			/**目标属性 */
			if (!target || !this._buffData.attributeId) return;
			let attr = target.vo.attr as Attribute;
			if (this._buffData.statusBirthTarget == 8) {
				attr.ModfiyAttributeValue(this._modfiyID, eValueType.Other, subvalue);
			}
			else {
				this._modfiyID = attr.GetAttributeModfiyID(this._buffData.attributeId);
				let isPer = attr.GetAttributeIsPer(this._modfiyID);
				if (isPer == 1) {
					attr.ModfiyAttributeValue(this._modfiyID, eValueType.BPercent, this._buffData.attributePer);
				}
				else {
					attr.ModfiyAttributeValue(this._modfiyID, eValueType.BFixed, this._buffData.attributePer);
				}
			}
			Tick.Once(this._buffData.existTime, this, () => {
				this.Destroy();
			});
		}

		private Modfiy_MP() {
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
		}

		/**眩晕BUFF*/
		private DoDizzness(target: any): void {
			let tar = target as PHeroCrad;
			if (tar.IsDie) return;
			tar.BClose = true;
			target.Idle();
			Tick.Once(this._buffData.existTime, this, () => {
				tar.BClose = false;
			});
		}

		/**吸血BUFF */
		private SuckHP(target: any): void {
			if (target && target.vo) {
				let attr = target.vo.attr as Attribute;
				let num = this._buffData.attributePer / 10000;
				let mod_damage = this._ratio * num >> 0;
				target.CurrentHp += mod_damage;
				Floating.DamageText(mod_damage.toString(), SkinEnum.SkinHP, target.PosX,
					target.PosY - 30, false);
			}
		}

		/**按生命上限比例回血 */
		private HPMaxBoold(target: any) {
			if (!target) return;
			let attr = this._owner.vo.attr as Attribute;
			let hpMax = attr.GetAttributeValue(1);
			let oncehp = hpMax * (this._buffData.attributePer / 10000) >> 0;
			Tick.Loop(this._buffData.LoopTime, this, () => {
				target.CurrentHp += oncehp;
				Floating.DamageText(oncehp.toString(), SkinEnum.SkinHP, target.PosX,
					target.PosY - 30, false);
			});
			Tick.Once(this._buffData.existTime, this, () => {
				Tick.ClearAll(this);
			});
		}

		/**哀木涕：嘿 ，孙子 */
		private Sneer() {
			for (let k in this._target) {
				if (this._target[k])
					this._target[k].Target[0] = this._owner;
			}
			Tick.Once(this._buffData.existTime, this, () => {
				if (!BattlefieldManager.Instance.end)
					BattlefieldManager.Instance.ResetT();
			});
		}

		/**持续效果BUFF */
		private Sustained(target: any): void {
			if (!this._owner) return;
			let attr = this._owner.vo.attr as Attribute;
			let num = this._buffData.attributePer / 10000;
			let damage = attr.GetAttributeValue(2);
			let mod_damage = damage * num;
			Tick.Loop(this._buffData.LoopTime, this, () => {
				target.OnHurt(this.belongs, this._owner, mod_damage >> 0, SPECIAL_TYPE.SUSRAINED, false, );
			});
			Tick.Once(this._buffData.existTime, this, () => {
				Tick.Once(100, this, () => {
					Tick.ClearAll(this);
				});
			});
		}

		/**移除加成的属性 */
		private RemoveAttribute(target: any, subvalue: number) {
			let attr = target.vo.attr as Attribute;
			attr.ModfiyAttributeValue(this._modfiyID, eValueType.Other, -subvalue);
		}

		private RemoveMp() {
				
		}

		/**刷新所有属性面板 */
		private Refresh() {

		}

		public OnUpdate() {

		}

		public Destroy() {
			Tick.ClearAll(this);
			if (this._buffData.statusType == 1) {
				for (let i = 0; i < this._target.length; i++) {
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
		}



	}
}