
module H52D_Framework {
	/**数据打包 */
	export class DataPack {
		
		private static _instance: DataPack = null;
		public static get Instance() {
			if (this._instance == null) {
				this._instance = new DataPack();
			}
			return this._instance;
		}

		private constructor() {

		}

		public Info: { [Type: string]: Object } = {};
		public EInfo: { [Type: string]: Object } = {};

		public heroInfo: { [key: number]: Object } = {}
		public petInfo: { [key: number]: Object } = {}
		public campInfo: { [key: number]: Object } = {}
		public Playerinfo: { [key: number]: Object } = {}
		public AttributeInfo: { [key: number]: Object } = {}

		public TypeArray: Array<string> = ["Hero", "Pet", "Camp", "Player", "Attribute"];

		public PackHeroInfo(info: Array<HeroInfo>) {
			for (let k in info) {
				this.heroInfo[Number(k)] = {
					id: info[k].nHeroID,
					level: info[k].Level,
					star: info[k].Star,
					location: info[k].location
				};
			}
		}

		public PackPetInfo(info: BPetVo) {
			if (!ObjIsEmpty(info)) {
				this.petInfo[0] = { id: info.ID, level: info.Level }
			}
			else {
				this.petInfo[0] = info;
			}
		}

		public PackCampInfo(info: BCampVo) {
			if (!ObjIsEmpty(info)) {
				this.campInfo[0] = { level: info.Level,Base:info.attr.GetAttributeTypeValue(2,eValueType.Base) }
			}
			else {
				this.campInfo[0] = info;
			}
		}

		public PackPlayerInfo() {
			let info = MasterPlayer.Instance.player;
			this.Playerinfo[0] = {
				level: info.Level,
				MpMax: info.vo.attr.GetAttributeValue(51),
				MpRec: info.vo.attr.GetAttributeValue(53),
				Cmp: info.Mp,
				isVip: info.IsVip,
				sList: info.SkillList
			}
		}

		public PackAttribute() {
			let objs = [];
			this.AttributeInfo = [];
			let hero = HeroManager.Instance.Herolist;
			for (let k in hero) {
				let heroi = hero[k] as HeroInfo;
				let pass = heroi.attributeID;
				for (let i in pass) {
					let p = PassiveSkillConfig[pass[i]];
					objs.push(p["scriptParam"]);
				}
			}
			let petL = PetManager.Instance.OwnPetList;
			for (let k in petL) {
				if (petL[k]) {
					let s = petL[k].currentAttribute;
					objs.push(s[1]);
					objs.push(s[2]);
				}
			}
			let eqa = EquipManager.Instance.CurrentAttrributeList;
			for (let k in eqa) {
				if (eqa[k]) {
					for (let i in eqa[k]) {
						if (eqa[k][i]) {
							objs.push(eqa[k][i].getData);
						}
					}
				}
			}
			let eqs = EquipManager.Instance.CurrentAttrributeList
			for (let k in eqs) {
			if (eqs[k]) {
					for (let i in eqs[k]) {
						if (eqs[k][i]) {
							objs.push(eqs[k][i].getData);
						}
					}
				} 
			}

			for (let i = objs.length - 1; i >= 0; i--) {
				if (objs[i][1] == 9 || objs[i][1] == 10) {
					objs.splice(i, 1);
				}
			}
			this.AttributeInfo = objs.concat();
		}

		public Pack() {
			this.Info[this.TypeArray[0]] = this.heroInfo;
			this.Info[this.TypeArray[1]] = this.petInfo;
			this.Info[this.TypeArray[2]] = this.campInfo;
			this.Info[this.TypeArray[3]] = this.Playerinfo;
			this.Info[this.TypeArray[4]] = this.AttributeInfo;
		}

		public Destroy() {
			this.Info = {}
			this.EInfo = {};
			this.AttributeInfo = [];
			this.Playerinfo = {};
			this.petInfo = {};
			this.campInfo = {};
			this.heroInfo = {};
		}


	}
} 