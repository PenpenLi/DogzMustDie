/**
* name 
*/
module H52D_Framework {
	export class SelectTarget {
		constructor() { }
		/**设置作用目标 -- 被动  属性 选择目标 */
		public static ImpactTarget(id: number, owner: any): Array<any> {
			let target = [];
			let key = [];
			let attr = new Attribute();
			let target_id = attr.GetAttributeTargetID(id);
			let Ahero = HeroManager.Instance.Herolist;
			let pet = PetManager.Instance.OwnPetList;
			for (let k in Ahero) {
				key.push(k);
			}
			switch (target_id) {
				case 0:
					target.push(owner);
					break;
				case 1:
					target.push(MasterPlayer.Instance.player.vo);
					break;
				case 2:
					for (let i = 0; i < GetTabLength(Ahero); i++) {
						let heroinfo = Ahero[key[i]] as HeroInfo;
						if (heroinfo.HeroType == 1) {
							target.push(heroinfo);
						}
					}
					break;
				case 3:
					for (let i = 0; i < GetTabLength(Ahero); i++) {
						let heroinfo = Ahero[key[i]] as HeroInfo;
						if (heroinfo.HeroType == 2) {
							target.push(heroinfo);
						}
					}
					break;
				case 4:
					for (let i = 0; i < GetTabLength(Ahero); i++) {
						let heroinfo = Ahero[key[i]] as HeroInfo;
						target.push(heroinfo);
					}
					break;
				case 5:
					target.push(PetManager.Instance.GetPet_Instance(PetManager.Instance.CurrentpetID));
					break;
				case 6:
					target.push(BCampManager.Instance.vo)
					break;
				case 7:
					for (let i = 0; i < GetTabLength(Ahero); i++) {
						let heroinfo = Ahero[key[i]] as HeroInfo;
						target.push(heroinfo);
					}
					target.push(MasterPlayer.Instance.player.vo);
					for (let k in pet) {
						if (pet[k]) {
							target.push(pet[k]);
						}
					}
					target.push(BCampManager.Instance.vo);
					break;
			}
			return target;
		}

		public static PImpactTarget(id: number, data): Array<any> {
			let player = data["player"];
			let heroList = data["heroList"];
			let pet = data["pet"][0];
			let camp = data["camp"];
			let attr = new Attribute();
			let target_id = attr.GetAttributeTargetID(id);
			let target = [];
			switch (target_id) {
				case 1:
					target.push(player);
					break;
				case 2:
					for (let k in heroList) {
						if (heroList[k] && heroList[k].hero_Type == 1) {
							target.push(heroList[k])
						}
					}
					break;
				case 3:
					for (let k in heroList) {
						if (heroList[k] && heroList[k].hero_Type == 2) {
							target.push(heroList[k])
						}
					}
					break;
				case 4:
					for (let k in heroList) {
						if (heroList[k]) {
							target.push(heroList[k])
						}
					}
					break
				case 5:
					target.push(pet);
					break;
				case 6:
					target.push(camp);
					break;
				case 7:
					for (let k in heroList) {
						if (heroList[k]) {
							target.push(heroList[k])
						}
					}
					target.push(camp)
					target.push(pet);
					break;
			}
			return target;
		}

		public static BuffTarget(buffdata: BuffData, statusTarget: number, owner: any,btype = 1): Array<any> {
			let target = [];
			let monster;
			let Harr;
			if (btype == 1) {
				if (BattleManager.Instance.HeroCardMgr.CHeroList) {
					Harr = BattleManager.Instance.HeroCardMgr.CHeroList;
				}
				if (BattleManager.Instance.MonsterFormation) {
					monster = BattleManager.Instance.MonsterFormation.Getobject;
				}
			}
			else {
				if (BattleManager.Instance.HeroCardMgr.CHeroList) {
					monster = BattleManager.Instance.HeroCardMgr.CHeroList;
				}
				if (BattleManager.Instance.MonsterFormation) {
					Harr = BattleManager.Instance.MonsterFormation.Getobject;
				}
			}
			switch (statusTarget) {
				/**自己 */
				case 1:
					target.push(owner);
					break;
				/**敌人 */
				case 2:
					if (owner && owner.Target && owner.type != eCharacter_TYPE.MONSTER) {
						target = owner.Target.concat();
					}
					else if (owner.type == eCharacter_TYPE.MONSTER) {
						target = owner.CCTarget.concat();
					}
					break;
				/**我方队长 */
				case 3:
					for (let i = 0; i < Harr.length; i++) {
						if (Harr[i]) {
							if (Harr[i].vo.location == 4) {
								target.push(Harr[i]);
							}
						}
					}
					break;
				/**敌方队长 */
				case 4:
					for (let k in monster) {
						let m = monster[k];
						if (m && m.vo.location == 4) {
							target.push(m);
						}
					}
					break;
				/**同排英雄 */
				case 5:
					for (let i = 0; i < Harr.length; i++) {
						if (Harr[i]) {
							let rowNum = owner.vo.rowNum;
							if (Harr[i].vo.rowNum == rowNum && owner.ID != Harr[i].ID) {
								target.push(Harr[i]);
							}
						}
					}
					break;
				/**同列英雄 */
				case 6:
					for (let i = 0; i < Harr.length; i++) {
						if (Harr[i]) {
							let colNum = owner.vo.colNum;
							if (Harr[i].vo.colNum == colNum && owner.ID != Harr[i].ID) {
								target.push(Harr[i]);
							}
						}
					}
					break;
				/**与队长范围内一格的英雄 */
				case 7:
					for (let i = 0; i < Harr.length; i++) {
						if (Harr[i]) {
							let location = Harr[i].vo.location;
							if (location == 1
								|| location == 3
								|| location == 5
								|| location == 7) {
								target.push(Harr[i]);
							}
						}
					}
					break;
				/**所有出战但未激活的英雄 */
				case 8:
					let hclist = HeroManager.Instance.NHero();
					for (let i = 0; i < hclist.length; i++) {
						let hcdata = HeroManager.Instance.GetHero(hclist[i]);
						let hc = new HeroCard(hcdata);
						target.push(hc);
					}
					break;
				/**所有出战的英雄 */
				case 9:
					target = Harr.concat();
					break;
			}
			let id = buffdata.attributeId;
			if (!statusTarget || statusTarget == 0) {
				target = Harr.concat();
				if (id == 17 || id == 27 || id == 37 || id == 47) {
					target.push(MasterPlayer.Instance.player);
					target.push(BPetManager.Instance.PetIns);
					target.push(BCampManager.Instance.Camp);
				}
			}
			return target;
		}

		public static PBuffTarget(buffdata: BuffData, statusTarget: number, owner: any, btype: number, belongs): Array<any> {
			let target = [];
			let Owner = [];
			let Enemy = [];
			let player = null;
			let pet = null;
			let camp = null;
			if (btype == 1) {
				Owner = BattlefieldManager.Instance.Characterlist[0].HeroList;
				Enemy = BattlefieldManager.Instance.Characterlist[1].HeroList;
				player = BattlefieldManager.Instance.Characterlist[0].player;
				if (BattlefieldManager.Instance.Characterlist[0].petMgr)
					pet = BattlefieldManager.Instance.Characterlist[0].petMgr.PetIns;
				if (BattlefieldManager.Instance.Characterlist[0].campMgr)
					camp = BattlefieldManager.Instance.Characterlist[0].campMgr.Camp;
			}
			else {
				Owner = BattlefieldManager.Instance.Characterlist[1].HeroList;
				Enemy = BattlefieldManager.Instance.Characterlist[0].HeroList;
				player = BattlefieldManager.Instance.Characterlist[1].player;
				if (BattlefieldManager.Instance.Characterlist[1].petMgr)
					pet = BattlefieldManager.Instance.Characterlist[1].petMgr.PetIns;
				if (BattlefieldManager.Instance.Characterlist[1].campMgr)
					camp = BattlefieldManager.Instance.Characterlist[1].campMgr.Camp;
			}
			switch (statusTarget) {
				/**自己 */
				case 1:
					target.push(owner);
					break;
				/**敌人 */
				case 2:
					if (belongs == eBELONGS_TO.BIG) {
						target = owner.CCTarget.concat();
					}
					else {
						if (owner || owner.Target) {
							target = owner.Target.concat();
						}
					}
					break;
				/**我方队长 */
				case 3:
					for (let i = 0; i < Owner.length; i++) {
						if (Owner[i]) {
							if (Owner[i].vo.location == 4) {
								target.push(Owner[i]);
							}
						}
					}
					break;
				/**敌方队长 */
				case 4:
					for (let k in Enemy) {
						let m = Enemy[k];
						if (m && m.vo.location == 4) {
							target.push(m);
						}
					}
					break;
				/**同排英雄 */
				case 5:
					for (let i = 0; i < Owner.length; i++) {
						if (Owner[i]) {
							let rowNum = owner.vo.rowNum;
							if (Owner[i].vo.rowNum == rowNum && owner.ID != Owner[i].ID) {
								target.push(Owner[i]);
							}
						}
					}
					break;
				/**同列英雄 */
				case 6:
					for (let i = 0; i < Owner.length; i++) {
						if (Owner[i]) {
							let colNum = owner.vo.colNum;
							if (Owner[i].vo.colNum == colNum && owner.ID != Owner[i].ID) {
								target.push(Owner[i]);
							}
						}
					}
					break;
				/**与队长范围内一格的英雄 */
				case 7:
					for (let i = 0; i < Owner.length; i++) {
						if (Owner[i]) {
							let location = Owner[i].vo.location;
							if (location == 1
								|| location == 3
								|| location == 5
								|| location == 7) {
								target.push(Owner[i]);
							}
						}
					}
					break;
				/**所有出战但未激活的英雄 */
				case 8:
					let hclist = HeroManager.Instance.NHero();
					for (let i = 0; i < hclist.length; i++) {
						let hcdata = HeroManager.Instance.GetHero(hclist[i]);
						let hc = new HeroCard(hcdata);
						target.push(hc);
					}
					break;
				/**所有出战的英雄 */
				case 9:
					target = Owner.concat();
					break;
			}
			let id = buffdata.attributeId;
			if (!statusTarget || statusTarget == 0) {
				target = Owner.concat();
				if (id == 17 || id == 27 || id == 37 || id == 47) {
					target.push(player);
					target.push(pet);
					target.push(camp);
				}
			}
			return target;
		}

	}
}