/**
* name 
*/
module H52D_Framework {
	export class MHAManager {
		constructor() {
		}

		private static _instance: MHAManager = null;
		public static get Instance() {
			if (!MHAManager._instance) {
				MHAManager._instance = new MHAManager();
			}
			return MHAManager._instance;
		}

		public Init() {
			let arr = HeroHandbookManager.Instance.Active_HandBook();
			for (let k in arr) {
				let id = RelationConfig[Number(k)].HeroId;
				let attr = HandbookUpConfig[arr[k]].AddAttribute;
				this.Add(id, attr);
			}
		}


		public InitS() {
			let arr = HeroHandbookManager.Instance.MostHandbookInfo();
			for (let k in arr) {
				this.HandBookMoreAttribute(k, arr[k]);
			}
		}

		private HandBookMoreAttribute(id, level) {
			let Loc = HandbookTeamConfig[id].AttackStation;
			let attr = HandbookTeamConfig[id].Attritue;
			let upattr = HandbookTeamConfig[id].UpAttritue;
			let Sum = attr;
			if (level >= 2) {
				let up = this.AddUpdateAttribute(level - 1, upattr);
				Sum = this.AttributeAdd(attr, up);
			}
			this.AddArrary(Loc, Sum, id);
		}

		private AddUpdateAttribute(index, UpAttr) {
			if (index <= 0) return UpAttr;
			let Odd = new Object();
			for (let k in UpAttr) {
				let modfiy = UpAttr[k][2] * index;
				Odd[k] = { 1: UpAttr[k][1], 2: modfiy }
			}
			return Odd;
		}

		private AttributeAdd(first, second) {
			let Odd = new Object();
			for (let k in second) {
				let sAttr = second[k];
				let fAttr = first[k];
				let id = sAttr[1];
				let svalue = sAttr[2];
				let fvalue = fAttr[2];
				let modfiy = svalue + fvalue;
				Odd[k] = { 1: id, 2: modfiy }
			}
			return Odd;
		}

		private _Map: Array<MapHeroAttribute> = [];
		private _SMap: Array<MapAttrbute> = [];

		/**添加属性 */
		public Add(id, attr) {
			for (let k in this._Map) {
				if (this._Map[k] && this._Map[k].HeroId == id) {
					this.Update(this._Map[k], attr);
					return;
				}
			}
			let map = new MapHeroAttribute(id, attr);
			map.OnEffect();
			this._Map.push(map);
		}


		public AddArrary(loction, attr, id) {
			for (let k in this._SMap) {
				if (this._SMap[k] && this._SMap[k].mid == id) {
					this.SUpdate(this._SMap[k], loction, attr);
					return;
				}
			}
			let map = new MapAttrbute(loction, attr, id);
			map.OnEffect();
			this._SMap.push(map);
		}

		private Update(attr: MapHeroAttribute, data) {
			attr.OnUpdate(data);
		}

		private SUpdate(attr: MapAttrbute, location, data) {
			attr.OnUpdate(location, data);
		}


		public LUpdate() {
			for (let k in this._SMap) {
				if (this._SMap[k]) {
					this._SMap[k].Update();
				}
			}
		}

		public OnRest() {
			for (let k in this._Map) {
				if (this._Map[k]) {
					this._Map[k].OnEffect();
				}
			}
			for (let k in this._SMap) {
				if (this._SMap[k]) {
					this._SMap[k].OnEffect();
				}
			}
		}

	}
}