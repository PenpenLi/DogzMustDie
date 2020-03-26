/**
* Buff效果类 
*/
module H52D_Framework {
	export class BuffEffect {

		private _owner: any = null;
		private _buffData: BuffData = null;

		/**作用目标列表 */
		private _target: Array<any> = [];
		/**取值目标列表 */
		private _takeTarget: Array<any> = [];

		/**最大取值列表数 */
		private _maxSubValueNum: number = 0;
		/**当前取值列表数 */
		private _indexSubValueNum: number = 0;

		/**Mp回复速度 */
		private _MpRecoveryCurrent: number = 0;
		/**Mp上限值 */
		private _MpPoolCurrent: number = 0;

		private _LastValueArray: Array<number> = [];
		/**从取值目标里获得的加值列表 */
		private _subValue: Array<number> = [];
		/**取值之和 */
		private _subValueSum: number = 0;

		/**伤害系数 */
		private _ratio: number = 0;

		private _modfiyID: number = 0;

		constructor(buffdata: BuffData, owner: any, ratio: number, btype) {
			this._buffData = buffdata;
			this._owner = owner;
			if (!this._buffData) return;
			if (this.BMpModfiy()) {
				this._target.push(MasterPlayer.Instance.player);
				this.Select(0);
				return;
			}
			this._target = [];
			this._takeTarget = [];
			this._takeTarget = SelectTarget.BuffTarget(this._buffData, this._buffData.statusBirthTarget, this._owner, btype).concat();
			this._target = SelectTarget.BuffTarget(this._buffData, this._buffData.statusActionTarget, this._owner, btype).concat();

			if (ratio) { this._ratio = ratio; }

			for (let i = 0; i < this._takeTarget.length; i++) {
				this.GetSubValue(this._takeTarget[i]);
			}

			for (let i = 0; i < this._target.length; i++) {
				this.Select(i);
			}

			this.Refresh();
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
		}

		/**获取加成值 */
		private GetSubValue(target: any): void {
			if (!target || !this._buffData.attributeId) return;

			let modfiy_value = 0;
			let last_value = 0;
			let subvalue = 0;

			let attr = target.vo.attr as Attribute;

			this._modfiyID = attr.GetAttributeModfiyID(this._buffData.attributeId);

			let isPer = attr.GetAttributeIsPer(this._modfiyID);
			last_value = attr.GetAttributeBuff(this._modfiyID);
			let ImIdArr = [21, 22, 23, 24, 25, 26, 27];
			let bIm = false;
			for (let k in ImIdArr) {
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
		}

		/**从取值列表里选择取值*/
		private Modfiy_Target(index: number): void {
			if (this._indexSubValueNum >= this._maxSubValueNum)
				this._indexSubValueNum = 0;

			if (this._buffData.statusBirthTarget == 8)
				this.Modfiy_Attr(this._target[index], this._subValueSum);
			else
				this.Modfiy_Attr(this._target[index], this._subValue[this._indexSubValueNum]);

			this._indexSubValueNum++;
		}

		/**改属性 */
		private Modfiy_Attr(target: any, subvalue: number): void {
			/**目标属性 */
			if (!target) return;
			this._LastValueArray.push(subvalue);
			if (this._modfiyID == 0) {
				this._modfiyID = target.vo.attr.GetAttributeModfiyID(this._buffData.attributeId);
				subvalue = 0;
			}
			target.vo.attr.ModfiyAttributeValue(this._modfiyID, eValueType.Other, subvalue);
		}

		private Modfiy_MP() {
			if (this._buffData.attributeId == 53) {
				let subvalue = this._buffData.attributePer / 10000;
				let MpRecoveryCurrent = MasterPlayer.Instance.player.vo.attr.GetAttributeValue(53);
				let NowValue = MpRecoveryCurrent * subvalue;
				NowValue = Math.ceil(NowValue);
				this._MpRecoveryCurrent = NowValue;
				MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(53, eValueType.Other, NowValue);
				Event.DispatchEvent("MpRecoveryRateChange");
				Tick.Once(this._buffData.existTime, this, () => {
					MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(53, eValueType.Other, -NowValue);
					Event.DispatchEvent("MpRecoveryRateChange");
				});
			}
			if (this._buffData.attributeId == 51) {
				MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(51, eValueType.Other, this._buffData.attributePer);
				Event.DispatchEvent("MpPoolChange");
				this._MpPoolCurrent = this._buffData.attributePer;
				Tick.Once(this._buffData.existTime, this, () => {
					MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(51, eValueType.Other, -this._buffData.attributePer);
					Event.DispatchEvent("MpPoolChange");
				});
			}
		}

		/**眩晕BUFF*/
		private DoDizzness(target: any): void {
			Tick.Loop(100, this, () => {
				if (target.IsDie) {
					return;
				}
				target.Idle();
			});
			Tick.Once(this._buffData.existTime, this, () => {
				Tick.Once(100, this, () => {
					Tick.ClearAll(this);
				});
			});
		}

		/**吸血BUFF */
		private SuckHP(target: any): void {
			if (target && target.vo) {
				let attr = target.vo.attr as Attribute;
				let num = this._buffData.attributePer / 10000;
				//let damage = attr.GetAttributeValue(2) * this._ratio;
				let mod_damage = this._ratio * num >> 0;
				// if (BattleManager.Instance.PassType == 2 && CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
				// 	mod_damage = 1;
				// }
				target.currentHp += mod_damage;
				Floating.DamageText(mod_damage.toString(), SkinEnum.SkinHP, target.PosX,
					target.PosY - 30, false);
			}
		}

		private _timeboold: number = 0;
		/**按生命上限比例回血 */
		private HPMaxBoold(target: any) {
			let attr = this._owner.vo.attr as Attribute;
			let hpMax = attr.GetAttributeValue(1);
			let oncehp = hpMax * (this._buffData.attributePer / 10000) >> 0;
			// if (BattleManager.Instance.PassType == 2 && CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
			// 	oncehp = 1;
			// }
			Tick.Loop(this._buffData.LoopTime, this, () => {
				if (!target) return;
				target.currentHp += oncehp;
				Floating.DamageText(oncehp.toString(), SkinEnum.SkinHP, target.PosX,
					target.PosY - 30, false);
				this.BooldUpdate();
			});
			// Tick.Once(this._buffData.existTime, this, () => {

			// })
		}

		BooldUpdate() {
			this._timeboold += 100;
			if (this._timeboold >= this._buffData.existTime) {
				this._timeboold = 0;
				Tick.ClearAll(this);
			}
		}

		/**哀木涕：嘿 ，孙子 */
		private Sneer() {

		}

		/**持续效果BUFF */
		private Sustained(target: any): void {
			if (!this._owner) return;
			let attr = this._owner.vo.attr as Attribute;
			let num = this._buffData.attributePer / 10000;
			let damage = attr.GetAttributeValue(2);
			let mod_damage = damage * num;
			if (target.vo.allDamgeReduction != -1) {
				mod_damage = mod_damage * target.vo.allDamgeReduction;
				if (mod_damage <= 0.9) {
					mod_damage = 1;
				}
			}
			Tick.Loop(this._buffData.LoopTime, this, () => {
				target.OnHurt(mod_damage >> 0, false, SPECIAL_TYPE.SUSRAINED);
			});
			Tick.Once(this._buffData.existTime, this, () => {
				Tick.Once(100, this, () => {
					Tick.ClearAll(this);
				});
			});
		}


		private Remove_Target(index: number): void {
			if (this._indexSubValueNum >= this._maxSubValueNum)
				this._indexSubValueNum = 0;

			if (this._buffData.statusBirthTarget == 8)
				this.RemoveAttribute(this._target[index], this._subValueSum);
			else
				this.RemoveAttribute(this._target[index], this._subValue[this._indexSubValueNum]);

			this._indexSubValueNum++;
		}


		/**移除加成的属性 */
		public RemoveAttribute(target: any, subvalue: number) {
			if (target != null) {
				let attr = target.vo.attr as Attribute;
				attr.ModfiyAttributeValue(this._modfiyID, eValueType.Other, -subvalue);
			}
		}


		private RemoveMp() {
			if (this._buffData.attributeId) {
				if (this._buffData.attributeId == 53) {
					MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(53, eValueType.Other, -this._MpRecoveryCurrent);
					Event.DispatchEvent("MpRecoveryRateChange");
				}
				if (this._buffData.attributeId == 51) {
					MasterPlayer.Instance.player.vo.attr.ModfiyAttributeValue(53, eValueType.Other, -this._MpPoolCurrent);
					Event.DispatchEvent("MpPoolChange");
				}
			}
		}

		/**刷新所有属性面板 */
		private Refresh() {
			if (BattleManager.Instance.aIOperation) {
				BattleManager.Instance.aIOperation.Dps();
			}
			Event.DispatchEvent(EventDefine.REFFIXEDATTR);
			Event.DispatchEvent("RefreshList");
		}

		public OnUpdate() {
			for (let k in this._target) {
				if (this._target[k]) {
					if (this._target[k].type == eCharacter_TYPE.MONSTER) {
						let a = this._target[k] as Monster;
						if (a.IsDie) this.Destroy();
					}
				}
			}
		}

		public Destroy() {
			Tick.ClearAll(this);
			this._indexSubValueNum = 0;
			if (this._buffData.statusType == 1) {
				for (let i = 0; i < this._target.length; i++) {
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
		}
	}
}