
module H52D_Framework {
	export class PheroInfo {
		constructor(data) {
			this._id = data["id"]
			this._level = data["level"]
			this._star = data["star"]
			this._location = data["location"]
			this._cfg = HeroConfig[this._id];
			this.Init();
		}

		/**英雄ID */
		private _id: number;
		/** 英雄等级*/
		private _level: number;
		/**英雄星級 */
		private _star: number;

		private _cfg: any;

		public get id(): number { return this._id }
		public get heroCfg() { return this._cfg; }

		/** 英雄等级 */
		public get Level() { return this._level }
		/** 英雄等级 */
		public set Level(level) { this._level = level }
		/***英雄星级 */
		public get Star(): number { return this._star }
		public set Star(value: number) { this._star = value; }
		public get ModlePath(): string { return this._cfg["strFacadeModel"]; }
		public get name() { return GetInfoAttr.Instance.GetText(this._cfg.name); }
		/**普攻大招id */
		public skillid: Array<number> = [];
		/**解锁技能id */
		private onPassiveID: Array<number> = [];
		public get OnPassiveID() { return this.onPassiveID; }

		/**属性被动技能id */
		public attributeID: Array<number> = [];
		/**条件被动技能id */
		public conditionsID: Array<number> = [];

		/**表 被动技能id */
		private passiveId: Array<number> = [];
		/**表  英雄解锁被动技能的等级*/
		private passiveOnLevel: Array<number> = [];

		/**基础属性表 */
		private _attr: Attribute;
		/**基础属性表 */
		public get attr() { return this._attr; }

		public ToSpeed: number = 0;

		public get hero_Type(): number { return this._cfg.type; }

		/**站位  -1 为上阵 */
		private _location: number = -1;
		public get location() { return this._location; }
		/**列*/
		public colNum: number;
		/**排*/
		public rowNum: number;

		/***获取英雄属性 */
		public GetHeroInfo(heroid: number): any {
			let hero = HeroConfig[heroid];
			let info = HeroManager.Instance.GetHero(heroid);
			let base = HeroUpgrateConfig[hero.type][info.Level]["Attr"];
			return base;
		}

		/**初始化 */
		private Init() {
			this._attr = new Attribute();
			let s = this._cfg.heroPassiveSkill;
			for (let i = 1; i < GetTabLength(s); i++) {
				this.passiveId.push(s[i]["1"]);
				this.passiveOnLevel.push(s[i]["2"]);
			}
			/**升级表*/
			let Upgrate = HeroUpgrateConfig[this.hero_Type];
			/**进阶表*/
			let Advance = HeroAdvanceConfig[this._id];
			/**固定属性表*/
			let stationaryAttribute = HeroConfig[this._id]["stationaryAttribute"];
			/**英雄升级属性表*/
			let Level_attr = Upgrate[this._level]["Attr"];
			/**表HP */
			let TabHP = 0;
			/**表伤害 */
			let TabDamage = 0;
			/**英雄档次系数 */
			let heroRatio = this._cfg.heroRatio;
			/**有英雄星级 */
			if (this._star != 0) {
				/**进阶属性 */
				let adv = Advance[this._star]["Attr"];
				/**HP转化比 */
				let HpPer = 1 + adv[1][2] / 10000;
				/**伤害转化比 */
				let DamagePer = 1 + adv[2][2] / 10000;
                /**
                 * 最终属性 =  等级属性 * 系数 + 等及属性*加成比
                 */
				TabHP = Level_attr[1][2] * heroRatio * HpPer;
				TabDamage = Level_attr[2][2] * heroRatio * DamagePer;
			}
			/**没有英雄星级 */
			else {
                /**
                 * 最终属性 =  等级属性 * 英雄系数
                 */
				TabHP = Level_attr[1][2] * heroRatio;
				TabDamage = Level_attr[2][2] * heroRatio;
			}
			this.skillid = [this._cfg["heroAtt"], this._cfg["heroBigSkill"]];
			/**设置HP */
			this.attr.SetAttributeValue(1, eValueType.Base, TabHP >> 0);
			/**设置伤害 */
			this.attr.SetAttributeValue(2, eValueType.Base, TabDamage >> 0);
			/**设置出手速度 */
			let speed: number = stationaryAttribute["1"]["2"];
			this.attr.SetAttributeValue(3, eValueType.Base, speed >> 0);
			/**设置暴击率 */
			let crit: number = stationaryAttribute["2"]["2"];
			this.attr.SetAttributeValue(4, eValueType.Base, crit >> 0);
			/**设置暴击倍率 */
			let ratio: number = stationaryAttribute["3"]["2"];
			this.attr.SetAttributeValue(5, eValueType.Base, ratio >> 0);
			this.InitPassiveID();
		}

		/**初始化被动技能id表 */
		public InitPassiveID(): void {
			this.onPassiveID = [];
			this.attributeID = [];
			this.conditionsID = [];
			for (let i = 0; i < this.passiveOnLevel.length; i++) {
				if (this._level >= this.passiveOnLevel[i]) {
					this.onPassiveID.push(this.passiveId[i]);
				}
			}
			for (let i = 0; i < this.onPassiveID.length; i++) {
				let type_id = PassiveSkillConfig[this.onPassiveID[i]]["scriptID"];
				if (type_id == 1) {
					this.attributeID.push(this.onPassiveID[i]);
				}
				else {
					this.conditionsID.push(this.onPassiveID[i]);
				}
			}
			for (let k in this.attributeID) {
				if (this.attributeID[k]) {
					let pas = PassiveSkillConfig[this.attributeID[k]]["scriptParam"];
					if (pas[1] == 9 || pas[1] == 10) {
						let po = new POAttribute(this, pas);
						po.OnEffect();
					}
				}
			}
		}

		/**设置第几排第几列 */
		public SetColOrow() {
			if (this._location == 0 || this._location == 1 || this._location == 2) {
				this.rowNum = 1;
			}
			else if (this._location == 3 || this._location == 4 || this._location == 5) {
				this.rowNum = 2;
			}
			else if (this._location == 6 || this._location == 7 || this._location == 8) {
				this.rowNum = 3;
			}

			if (this._location == 0 || this._location == 3 || this._location == 6) {
				this.colNum = 1;
			}
			else if (this._location == 1 || this._location == 4 || this._location == 7) {
				this.colNum = 2;
			}
			else if (this._location == 2 || this._location == 5 || this._location == 8) {
				this.colNum = 3;
			}
		}


		/**设置先手速度 */
		public SetToSpeed() {
			/**先手速度浮动点 （0.95-1.05） */
			let speedoffect = (Math.random() * 11 + 95) >> 0;
			/**转化百分比为小数 */
			let speedfloat = speedoffect / 100;
			/**先手速度 = 先手速度*浮动点 */
			let speed = this.attr.GetAttributeValue(3);
			this.ToSpeed = speed * speedfloat;
		}

	}
}