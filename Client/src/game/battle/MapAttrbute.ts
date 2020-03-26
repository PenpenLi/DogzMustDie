/**
* name 
*/
module H52D_Framework {
	export class MapAttrbute {
		private _target = [];
		private _Data = {};
		private _Location = {};
		private _mid = 0;
		public get mid() { return this._mid; }
		private get Herolist() {
			return HeroCardManager.Instance.CHeroList;
		}

		constructor(location, Data, id) {
			this._Location = location;
			this._Data = Data;
			this._mid = id;
		}

		public HeroTarget() {
			this._target = [];
			for (let k in this._Location) {
				for (let i in this.Herolist) {
					let x = this._Location[k] - 1;
					let y = this.Herolist[i].vo.location;
					let id = this.Herolist[i].vo.id;
					if (this.Herolist[i] && this.Herolist[i].vo.location == this._Location[k] - 1) {
						this._target.push(this.Herolist[i]);
					}
				}
			}
		}

		public OnEffect() {
			this.HeroTarget();
			if (this._target.length <= 0) return;
			for (let k in this._target) {
				for (let i in this._Data) {
					this.AddAttribute(this._target[k], this._Data[i]);
				}
			}
		}

		public OnUpdate(location, data) {
			this.Destroy();
			this._Data = data;
			this._Location = location;
			this.OnEffect();
		}


		public Update() {
			this.Destroy();
			this.OnEffect();
		}

		/**为单个目标 修改属性 */
		private AddAttribute(target, data): void {
			let attr = target.vo.attr as Attribute;
			let modfiy_id = attr.GetAttributeModfiyID(data[1]);

			let isPercent = attr.GetAttributeIsPer(modfiy_id);
			if (isPercent == 1) {
				attr.ModfiyAttributeValue(modfiy_id, eValueType.Percent, data[2]);
			}
			else {
				attr.ModfiyAttributeValue(modfiy_id, eValueType.Fixed, data[2]);
			}
		}

		/**
		 * 删除增加的属性
		 * @param target 目标
		 */
		private RemoveAttribute(target, data): void {
			let attr = target.vo.attr as Attribute;
			let modfiy_id = attr.GetAttributeModfiyID(data[1]);

			let isPercent = attr.GetAttributeIsPer(modfiy_id);
			if (isPercent == 1) {
				attr.ModfiyAttributeValue(modfiy_id, eValueType.Percent, -data[2]);
			}
			else {
				attr.ModfiyAttributeValue(modfiy_id, eValueType.Fixed, -data[2]);
			}
		}


		public Destroy() {
			for (let k in this._target) {
				for (let i in this._Data) {
					this.RemoveAttribute(this._target[k], this._Data[i]);
				}
			}
		}

	}
}