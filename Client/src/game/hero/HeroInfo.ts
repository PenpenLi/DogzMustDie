
module H52D_Framework {
	/** 英雄类型*/
	export enum HeroType {//英雄类型
	}
	/** 英雄技能*/
	enum HeroSkill {
	}
	/**英雄信息  常万 */
	export class HeroInfo {
		/**英雄ID */
		private _id: number;
		/** 英雄等级*/
		private _level: number;
		/**英雄星級 */
		private _star: number;

		private _cfg: any;

		constructor() {

		}

		/** 解析服务器数据 */
		public unpackData(tData) {
			this.nHeroID = tData[1]
			this._level = tData[2]
			this._star = tData[3]
			this.Init();
			Event.RegistEvent(EventDefine.MODIFYATTR, Laya.Handler.create(this, this.LevelComplete));
		}

		/** 配置ID */
		public set nHeroID(id) {
			this._cfg = HeroConfig[id]
			this._id = id
		}

		public get nHeroID(): number {
			return this._id
		}

		public get heroCfg() {
			return this._cfg;
		}

		/** 英雄等级 */
		public get Level() {
			return this._level
		}

		/** 英雄等级 */
		public set Level(level) {
			this._level = level
		}

		/***英雄星级 */
		public get Star(): number {
			return this._star
		}
		public set Star(value: number) {
			this._star = value;
		}

		/**普攻大招id */
		public skillid: Array<number> = [];
		/**站位  -1 为上阵 */
		public location: number = -1;
		/**列*/
		public colNum: number;
		/**排*/
		public rowNum: number;
		/**解锁技能id */
		private onPassiveID: Array<number> = [];
		public get OnPassiveID() { return this.onPassiveID; }
		/**属性被动技能id */
		public attributeID: Array<number> = [];
		/**条件被动技能id */
		public conditionsID: Array<number> = [];
		/**表  所有被动技能id列表 */
		private passiveId: Array<number> = [];
		/**表  英雄解锁被动技能的等级列表*/
		private passiveOnLevel: Array<number> = [];
		/**基础属性表 */
		private _attr: Attribute;
		/**基础属性表 */
		public get attr() { return this._attr; }
		/** 英雄头像 */
		public get HeadIcon() {
			return "ui_icon/" + this._cfg.strIcon
		}
		public allDamgeReduction = -1;
		public ToSpeed: number = 0;
		public get HeroType() { return this._cfg.type }

		/***获取英雄属性 */
		public GetHeroInfo(heroid: number): any {
			let hero = HeroConfig[heroid];
			let info = HeroManager.Instance.GetHero(heroid);
			let base = HeroUpgrateConfig[hero.type][info.Level]["Attr"];
			return base;
		}

		public get ModlePath(): string { return this._cfg["strFacadeModel"]; }
		private LevelComplete(id: number): void {
			if (id == this.nHeroID) {
				this.Update();
				this.UpdatePassiveskill();
				// AttributePassiveManager.Instance.Update();
			}
		}
		public onlockpassive: Laya.Handler;
		/**升级表*/
		private get Upgrate() { return HeroUpgrateConfig[this.HeroType]; }
		/**进阶表*/
		private get Advance() { return HeroAdvanceConfig[this._id] }
		/**固定属性表*/
		private get stationaryAttribute() { return HeroConfig[this._id]["stationaryAttribute"]; }
		/**升级属性表 */
		private get Level_attr() { return this.Upgrate[this._level]["Attr"] }
		/**进阶属性表 */
		private get Start_attr() { return this.Advance[this._star]["Attr"]; }
		/**英雄系数 */
		public get heroRatio() { return this._cfg.heroRatio; }


		/**初始化 */
		private Init() {
			this._attr = new Attribute();
			this.ReadAttr();
			this.InitPassiveID();
		}
		public get id(){ return  this.nHeroID;}
		/**读表属性*/
		private ReadAttr() {
			/**表HP */
			let TabHP = 0;
			/**表伤害 */
			let TabDamage = 0;
			/**有英雄星级 */
			if (this._star != 0) {
				/**HP转化比 */
				let HpPer = 1 + this.Start_attr[1][2] / 10000;
				/**伤害转化比 */
				let DamagePer = 1 + this.Start_attr[2][2] / 10000;
                /**
                 * 最终属性 =  等级属性 * 系数 + 等及属性*加成比
                 */
				TabHP = this.Level_attr[1][2] * this.heroRatio * HpPer;
				TabDamage = this.Level_attr[2][2] * this.heroRatio * DamagePer;
			}
			/**没有英雄星级 */
			else {
                /**
                 * 最终属性 =  等级属性 * 英雄系数
                 */
				TabHP = this.Level_attr[1][2] * this.heroRatio;
				TabDamage = this.Level_attr[2][2] * this.heroRatio;
			}
			this.skillid = [this._cfg["heroAtt"], this._cfg["heroBigSkill"]];
			/**设置HP */
			this.attr.SetAttributeValue(1, eValueType.Base, TabHP);
			/**设置伤害 */
			this.attr.SetAttributeValue(2, eValueType.Base, TabDamage);
			/**设置出手速度 */
			let speed: number = this.stationaryAttribute["1"]["2"];
			this.attr.SetAttributeValue(3, eValueType.Base, speed);
			/**设置暴击率 */
			let crit: number = this.stationaryAttribute["2"]["2"];
			this.attr.SetAttributeValue(4, eValueType.Base, crit);
			/**设置暴击倍率 */
			let ratio: number = this.stationaryAttribute["3"]["2"];
			this.attr.SetAttributeValue(5, eValueType.Base, ratio);
		}

		/**初始化被动技能id表 */
		public InitPassiveID(): void {
			for (let i = 1; i < GetTabLength(this._cfg.heroPassiveSkill); i++) {
				this.passiveId.push(this._cfg.heroPassiveSkill[i]["1"]);
				this.passiveOnLevel.push(this._cfg.heroPassiveSkill[i]["2"]);
			}
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
		}

		/**更新属性 */
		private Update() {
			this.ReadAttr();
			this.UpdatePassiveskill();
		}

		/**更新被动属性技能*/
		private UpdatePassiveskill() {
			for (let i = 0; i < this.passiveOnLevel.length; i++) {
				if (this._level >= this.passiveOnLevel[i]) {
					if (this.onPassiveID.length == 0) {
						let id = this.passiveId[0];
						AttributePassiveManager.Instance.OnLock(id, this.nHeroID);
						this.onPassiveID.push(id);
						this.attributeID.push(id);
						if (this.onlockpassive) {
							this.onlockpassive.run();
						}
						return;
					}
					let sid = this.passiveId[i];
					let oid = this.onPassiveID[i];
					if (sid != oid) {
						let id = this.passiveId[i];
						this.onPassiveID.push(id);
						this.attributeID.push(id);
						AttributePassiveManager.Instance.OnLock(id, this.nHeroID);
						if (this.onlockpassive) {
							this.onlockpassive.run();
						}
						return;
					}
				}
			}
		}

		private OnLock(): void {

		}

		/**加成属性设置为0 以便不重复加成 */
		public UpdateAttrbute() {
			for (let i = 1; i <= 5; i++) {
				this.attr.SetAttributeValue(i, eValueType.Percent, 0);
				this.attr.SetAttributeValue(i, eValueType.Fixed, 0);
			}
			for (let i = 21; i <= 27; i++) {
				this.attr.SetAttributeValue(i, eValueType.Percent, 0);
				this.attr.SetAttributeValue(i, eValueType.Fixed, 0);
			}
		}


		/**设置第几排第几列 */
		public SetColOrow() {
			if (this.location == 0 || this.location == 1 || this.location == 2) {
				this.rowNum = 1;
			}
			else if (this.location == 3 || this.location == 4 || this.location == 5) {
				this.rowNum = 2;
			}
			else if (this.location == 6 || this.location == 7 || this.location == 8) {
				this.rowNum = 3;
			}

			if (this.location == 0 || this.location == 3 || this.location == 6) {
				this.colNum = 1;
			}
			else if (this.location == 1 || this.location == 4 || this.location == 7) {
				this.colNum = 2;
			}
			else if (this.location == 2 || this.location == 5 || this.location == 8) {
				this.colNum = 3;
			}
		}

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