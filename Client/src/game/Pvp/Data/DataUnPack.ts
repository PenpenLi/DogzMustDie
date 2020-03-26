
module H52D_Framework {
	/**数据解包 */
	export class DataUnPack {
		public HeroList: Array<PheroInfo> = [];
		public PetList: Array<PPetInfo> = [];
		public Camp: PCampInfo = null;
		public Playinfo: PPlayerInfo = null;
		public AttributeInfo: Array<PAttribute> = [];
		private TypeArray: Array<string> = ["Hero", "Pet", "Camp", "Player", "Attribute"];
		public Info: any = {};

		constructor(data) {
			this.UnHeroData(data[this.TypeArray[0]]);
			this.UnPetData(data[this.TypeArray[1]]);
			this.UnCampData(data[this.TypeArray[2]]);
			this.UnPlayerData(data[this.TypeArray[3]]);
			this.UnAttribute(data[this.TypeArray[4]]);
			this.Info = {
				player: this.Playinfo,
				heroList: this.HeroList, 
				pet: this.PetList,
				camp: this.Camp
			}
		}

		private UnHeroData(data) {
			for (let k in data) {
				let info = new PheroInfo(data[k]);
				this.HeroList.push(info);
			}
		}

		private UnPetData(data) {
			for (let k in data) {
				if (!ObjIsEmpty(data[k])) {
					let info = new PPetInfo(data[k]);
					this.PetList.push(info);
				}
			}
		}

		private UnCampData(data) {
			for (let k in data) {
				if (!ObjIsEmpty(data[k])) {
					let info = new PCampInfo(data[k]);
					this.Camp = info;
				}
			}
		}

		private UnPlayerData(data) {
			for (let k in data) {
				let info = new PPlayerInfo(data[k]);
				this.Playinfo = info;
			}
		}

		private UnAttribute(data) {
			if (!ObjIsEmpty(data)) {
				for (let k in data) {
					let p = new PAttribute(data[k]);
					this.AttributeInfo.push(p);
				}
			}
		}
		
	}
}