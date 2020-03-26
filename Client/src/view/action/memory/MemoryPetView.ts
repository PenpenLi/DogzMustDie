/**副本神兽页面*/
module H52D_Framework {

	AddViewResource("MemoryPetView",
		[
			{ url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_pet.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_sign.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS }
		]);
	export class MemoryPetView extends ui.action.memory.MemoryPetViewUI {
		//副本类型
		private _type: number;
		constructor(buf) {
			super();
			this._type = buf[1]
			this.UpdateList();
			this.SetCurrentPetInfo();
			this.SetTopPetHit();
			this.AddEvent();
		}

		private AddEvent() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.btn_close.on(Laya.Event.CLICK, this, this.CloseHander);
			Event.RegistEvent('UpdatePetView', Laya.Handler.create(this, this.UpdateList));
		}

		// 移除事件监听
		public Destroy(): void {
			this.offAll();
			//Event.RemoveEvent('UpdatePetView', Laya.Handler.create(this, this.UpdateList));
		}

		private CloseHander() {
			UIManager.Instance.DestroyUI(this.name, [ViewToppestRoot]);
		}

		private UpdatePetView() {
			this.UpdateList();
			PetManager.Instance.SendShowPet(MemoryLogic.Instance.GetPetID(this._type));
			this.SetTopPetHit();
		}
		/**设置神兽总伤害加成 */
		private SetTopPetHit() {
			this.info.on(Laya.Event.CLICK, this, this.PetPlayMethod);
			let petId = MemoryLogic.Instance.GetPetID(this._type);

			if (petId == 0) {
				this.petHit.text = "0  神兽伤害";
				this.info.x = 0;
				this.info.x += this.petHit.text.length * 22 * G_StageWidthScale;
				return;
			}
			let OwnPetList = PetManager.Instance.OwnPetList;
			let pet = OwnPetList[petId] as BPetVo;
			let hitValue = pet.GetDamage() * pet.ratio >> 0;
			if (hitValue >= 10000) {
				let str = (hitValue / 10000).toFixed(0);
				this.petHit.text = str + "W  神兽伤害";
			} else {
				this.petHit.text = hitValue.toFixed(0) + "  神兽伤害";
			}
			this.info.x = 0;
			this.info.x += this.petHit.text.length * 22 * G_StageWidthScale;
		}

		/**设置当前上阵神兽信息 */
		private SetCurrentPetInfo() {

			let currentId = MemoryLogic.Instance.GetPetID(this._type);
			if (currentId == 0) {
				return;
			}
			let pet_tcfg = PetConfig[currentId];
			let pet = PetManager.Instance.GetPet_Instance(currentId);
			if (pet) {
				let pet_PrimeStr = GetInfoAttr.Instance.GetText(QualityValue[pet.currentAttribute[1][1]].dwName);
				let pet_AuxiliaryStr = GetInfoAttr.Instance.GetText(QualityValue[pet.currentAttribute[2][1]].dwName);

				let primeIsper = QualityValue[pet.currentAttribute[1][1]].isper;
				let auxiliaryIsper = QualityValue[pet.currentAttribute[2][1]].isper;

				let pet_PrimeValue = pet.currentAttribute[1][2];
				let pet_AuxiliaryValue = pet.currentAttribute[2][2];

				if (pet.currentAttribute[1][1] == 4 && pet_PrimeValue > 10000) {
					pet_PrimeValue = 10000;
				}
				if (pet.currentAttribute[2][1] == 4 && pet_AuxiliaryValue > 10000) {
					pet_AuxiliaryValue = 10000;
				}
				let addPethurt = pet_PrimeValue + pet.addCurrentAttribute_1;
				let addHerohurt = pet_AuxiliaryValue + pet.addCurrentAttribute_2;
			}
		}

		
		/**神兽List赋值 */
		private UpdateList() {
			let arr: Array<number> = [];			
			for (let id in PetManager.Instance.OwnPetList) {
				arr.push(Number(id));
			}
			for (let i = 0; i < arr.length; i++) {
				for (let j = i + 1; j < arr.length; j++) {
					let qu;
					if (PetManager.Instance.OwnPetList[arr[i]].petColor > PetManager.Instance.OwnPetList[arr[j]].petColor) {
						qu =arr[i];
						arr[i] = arr[j];
						arr[j] = qu;
					}
				}
			}
			for (let i = 0; i < arr.length; i++) {
				for (let j = i + 1; j < arr.length; j++) {
					let lv;
					if (PetManager.Instance.OwnPetList[arr[i]].Level < PetManager.Instance.OwnPetList[arr[j]].Level &&
						PetManager.Instance.OwnPetList[arr[i]].petColor == PetManager.Instance.OwnPetList[arr[j]].petColor) {
						lv = arr[i];
						arr[i] = arr[j];
						arr[j] = lv;
					}
				}
			}
			this.Pet_list.array = arr;
			this.Pet_list.vScrollBarSkin = "";			
			this.Pet_list.renderHandler = new Laya.Handler(this, this.Pethandle);
		}		

		private Pethandle(item, index) {
			let ID = Number(this.Pet_list.array[index]);
			let pet = PetManager.Instance.OwnPetList[ID];

			let pet_name: Laya.Label = item.getChildByName("Pet_name");
			let pet_lv: Laya.Label = item.getChildByName("Pet_lv");
			let pet_icon: Laya.Image = item.getChildByName("Pet_icon");
			let pet_icon_bg: Laya.Image = item.getChildByName("pet_icon_bg");
			let pet_info: Laya.Image = pet_icon.getChildByName("Pet_info") as Laya.Image;
			let pet_hurt: Laya.Label = item.getChildByName("pet_hurt");
			let hero_hurt: Laya.Label = item.getChildByName("hero_hurt");
			let choice: Laya.Image = item.getChildByName("choice");
			let click: Laya.Button = item.getChildByName("click");
			let point: Laya.Image = item.getChildByName("point");
			pet_name.text = pet.petName;
			pet_name.color = BaseDefine.PetColor_label[pet.petColor];
			pet_lv.text = pet.Level + "";
			pet_icon.skin = "ui_icon/" + pet.strPetIcon;
			pet_icon_bg.skin = BaseDefine.QualityList[pet.petColor];

			let pet_PrimeStr = GetInfoAttr.Instance.GetText(QualityValue[pet.currentAttribute[1][1]].dwName);
			let pet_AuxiliaryStr = GetInfoAttr.Instance.GetText(QualityValue[pet.currentAttribute[2][1]].dwName);
			let primeIsper = QualityValue[pet.currentAttribute[1][1]].isper;
			let auxiliaryIsper = QualityValue[pet.currentAttribute[2][1]].isper;
			let pet_PrimeValue = pet.currentAttribute[1][2];
			let pet_AuxiliaryValue = pet.currentAttribute[2][2];
			if (pet.currentAttribute[1][1] == 4 && pet_PrimeValue > 10000) {
				pet_PrimeValue = 10000;
			}
			if (pet.currentAttribute[2][1] == 4 && pet_AuxiliaryValue > 10000) {
				pet_AuxiliaryValue = 10000;
			}

			pet_hurt.text = primeIsper = 0 ? "+" + pet_PrimeValue + pet_PrimeStr : "x" + pet_PrimeValue / 100 + "%" + pet_PrimeStr;
			hero_hurt.text = auxiliaryIsper = 0 ? "+" + pet_AuxiliaryValue + pet_AuxiliaryStr : "x" + pet_AuxiliaryValue / 100 + "%" + pet_AuxiliaryStr;

			choice.visible = MemoryLogic.Instance.GetPetID(this._type) == pet.ID;
			click.on(Laya.Event.CLICK, this, this.ChoiceCurrentPet, [ID]);
			point.visible = PetManager.Instance.IsNewPet(ID);
			pet_icon.on(Laya.Event.CLICK, this, this.OpenInfoView, [ID]);
		}

		private ChoiceCurrentPet(id: number) {
			if (MemoryLogic.Instance.GetPetID(this._type) != 0)
				PetManager.Instance.OwnPetList[MemoryLogic.Instance.GetPetID(this._type)].CurrentState = 0;

			PetManager.Instance.OwnPetList[id].CurrentState = 1;
			if (MemoryLogic.Instance.GetPetID(this._type) != id) {
				this.SetCurrentPetInfo();
				MemoryLogic.Instance.K_ReqCopyUsePet(this._type, id)
			}
		}

		private PetPlayMethod() {
			let title: string = "神兽";
			let content: string = GetInfoAttr.Instance.GetText(5000);
			UIManager.Instance.CreateUI("TipsActionView", [ViewToppestRoot, title, content]);
		}

		/**
		 * 打开神兽tips
		 */
		private OpenInfoView(nID: number): void {
			PetManager.Instance.SendShowPet(nID);
			UIManager.Instance.CreateUI("TipsTreasureView", [ViewToppestRoot, 0, nID, 0, 0, 0, "神兽详情", OpenType.ePet]);
		}

		private ClickPetUp() {
			let len: number = this.Pet_list.array.length;
			if (len < 1) return;
			let pet_id = this.Pet_list.array[0];
			this.ChoiceCurrentPet(pet_id);
			PetManager.Instance.K_ReqUsePet(pet_id);
		}
	}
}