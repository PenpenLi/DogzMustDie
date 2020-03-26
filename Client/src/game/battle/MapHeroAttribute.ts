/**
* name 
*/
module H52D_Framework {
	export class MapHeroAttribute {
		/**作用目标 */
		private _target = null;
		/**
		 * 初始化
		 * @param data 属性数据
		 */
		constructor(id: number, data: Object) {
			this._data = data;
			this.heroid = id;
		}

		private _data: Object = {};
		public get getData() { return this._data; }

		private heroid = 0;
		/**英雄id  唯一性 */
		public get HeroId() { return this.heroid; }

		public OnUpdate(data) {
			this.Destroy();
			this._data = data;
			this.OnEffect();
		}

		public OnRest() {
			this.Destroy();
			this.OnEffect();
		}

		/**产生效果 */
		public OnEffect(): void {
			this._target = null;
			this._target = this.GetHeroId(this.heroid);
			if (!this._target) return;
			for (let k in this._data) {
				this.AddAttribute(this._data[k][1], this._data[k][2]);
			}
		}

		private GetHeroId(id) {
			let heroList = HeroManager.Instance.Herolist;
			for (let k in heroList) {
				if (heroList[k].nHeroID == id) {
					return heroList[k];
				}
			}
		}

		/**为单个目标 修改属性 */
		private AddAttribute(id, value): void {
			let attr = this._target.attr as Attribute;
			let modfiy_id = attr.GetAttributeModfiyID(id);
			let isPercent = attr.GetAttributeIsPer(modfiy_id);
			if (isPercent == 1) {
				attr.ModfiyAttributeValue(modfiy_id, eValueType.Percent, value);
			}
			else {
				attr.ModfiyAttributeValue(modfiy_id, eValueType.Fixed, value);
			}
		}

		/*** 删除增加的属性*/
		private RemoveAttribute(id, value): void {
			if(!this._target) return;
			let attr = this._target.attr as Attribute;
			let modfiy_id = attr.GetAttributeModfiyID(id);

			let isPercent = attr.GetAttributeIsPer(modfiy_id);
			if (isPercent == 1) {
				attr.ModfiyAttributeValue(modfiy_id, eValueType.Percent, -value);
			}
			else {
				attr.ModfiyAttributeValue(modfiy_id, eValueType.Fixed, -value);
			}
		}

		/**销毁 */
		public Destroy(): void {
			for (let k in this._data) {
				this.RemoveAttribute(this._data[k][1], this._data[k][2]);
			}
		}



	}
}