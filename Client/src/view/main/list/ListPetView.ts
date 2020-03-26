/**神兽页面*/
module H52D_Framework {

	AddViewResource("ListPetView",
		[
			{ url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_pet.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_sign.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS }
		]);

	export class ListPetView extends ui.main.list.ListPetViewUI implements IViewPanel {
		//private pet: { [id: number]: BPetVo } = {};
		/**当前神兽ID */
		private _currentPetID: number = 0;
		private time = 0

		constructor() {
			super();
			this.Init();
			this.AddEvent();
			this.ChangeListHigth();
		}

		private Init() {

			this.UpdateList();
			this.SetAgeTime();
			this.SetCurrentPetInfo();
			this.SetTopPetHit();
		}

		private AddEvent() {

			Event.RegistEvent('SetAgeTime', Laya.Handler.create(this, this.SetAgeTime));
			Event.RegistEvent('PetInit', Laya.Handler.create(this, this.Init));
			Event.RegistEvent('ClickPetUp', Laya.Handler.create(this, this.ClickPetUp));
			Event.RegistEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));

		}

		// 移除事件监听
		public Destroy(): void {
			this.offAll();
			Event.RemoveEvent('SetAgeTime', Laya.Handler.create(this, this.SetAgeTime));
			Event.RemoveEvent('PetInit', Laya.Handler.create(this, this.Init));
			Event.RemoveEvent('ClickPetUp', Laya.Handler.create(this, this.ClickPetUp));
			Event.RemoveEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));

		}

		private ChangeListHigth(): void {
			if (ViewUILogic.Instance.halfPanel) {
				this.Pet_list.height = 170 * G_StageHeightScale;
			} else {
				this.Pet_list.height = (932 - wxsclae) * G_StageHeightScale;
			}
		}

		/**设置神兽总伤害加成 */
		private SetTopPetHit() {
			this.info.on(Laya.Event.CLICK, this, this.PetPlayMethod);
			if (PetManager.Instance.CurrentpetID == 0) {
				this.petHit.text = "神兽伤害  0"
				this.info.x = 0;
				this.info.x += this.petHit.text.length * 22 * G_StageWidthScale;
				return
			}

			let OwnPetList = PetManager.Instance.OwnPetList;
			let pet = OwnPetList[PetManager.Instance.CurrentpetID] as BPetVo;
			let hitValue = pet.attr.GetAttributeValue(2) * pet.ratio >> 0;
			if (hitValue >= 10000) {
				let str = (hitValue / 10000).toFixed(0);
				this.petHit.text = "神兽伤害  " + str + "W";
			} else {
				this.petHit.text = "神兽伤害  " + hitValue.toFixed(0);
			}
			this.info.x = this.petHit.textWidth + 30;
		}

		/**设置孵化 时间及次数 */
		private SetAgeTime() {
			this.time = PetManager.Instance.NextUpdateTime - Time.serverSecodes;

			let tims = PetManager.Instance.HasTimes;
			let maxTims: number = GameParamConfig['HatchMaxNum'];
			Tick.Clear(this, this.SetTime);
			if (this.time <= 0) {
				this.time = 0;
			}
			this.Has_num.text = "X" + tims;
			this.UpdateTime.text = "孵化时间：" + GetFormatNumTime(this.time);
			Tick.Loop(1000, this, this.SetTime)
			if (tims == maxTims) {
				Tick.Clear(this, this.SetTime);
				this.UpdateTime.text = "次数已上限";
				return;
			}
		}

		private SetTime() {
			this.time--;
			if (this.time <= 0) {
				this.time = 0;
				Tick.Clear(this, this.SetTime);
			}
			this.UpdateTime.text = "孵化时间：" + GetFormatNumTime(this.time);
		}

		/**设置当前上阵神兽信息 */
		private SetCurrentPetInfo() {
			let currentId = PetManager.Instance.CurrentpetID;
			if (currentId == 0) {
				this.Pet_iconbg.visible = false;
				return;
			}

			this.Pet_iconbg.visible = true;
			let pet_tcfg = PetConfig[currentId];
			let pet = PetManager.Instance.GetPet_Instance(currentId);
			if (pet) {
				this.Pet_name.text = pet.petName;
				this.Pet_name.color = BaseDefine.PetColor_label[pet.petColor];
				this.Pet_lv.text = pet.Level + "";
				this.Pet_icon.skin = "ui_icon/" + pet.strPetIcon;
				this.Pet_iconbg.skin = BaseDefine.QualityList[pet.petColor];
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

				this.add_pethurt.text = primeIsper == 0 ? "+" + pet_PrimeValue + pet_PrimeStr : "x" + pet_PrimeValue / 100 + "%" + pet_PrimeStr;
				this.add_herohurt.text = auxiliaryIsper == 0 ? "+" + pet_AuxiliaryValue + pet_AuxiliaryStr : "x" + pet_AuxiliaryValue / 100 + "%" + pet_AuxiliaryStr;

				this.add_nexthurt_pet.text = primeIsper == 0 ? "+" + addPethurt + pet_PrimeStr : "x" + addPethurt / 100 + "%" + pet_PrimeStr;
				this.add_nexthurt_hero.text = auxiliaryIsper == 0 ? "+" + addHerohurt + pet_AuxiliaryStr : "x" + addHerohurt / 100 + "%" + pet_AuxiliaryStr;
			}
		}

		/**神兽List赋值 */
		private UpdateList() {
			//this.pet = PetManager.Instance.OwnPetList;
			let arr: Array<number> = [];
			for (let id in PetManager.Instance.OwnPetList) {
				arr.push(Number(id));
			}

			for (let i = 0; i < arr.length; i++) {
				for (let j = i + 1; j < arr.length; j++) {
					let qu;
					if (PetManager.Instance.OwnPetList[arr[i]].petColor > PetManager.Instance.OwnPetList[arr[j]].petColor) {
						qu = arr[i];
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
		private bGuidanceButton = true;
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


			pet_hurt.text = primeIsper == 0 ? "+" + pet_PrimeValue + pet_PrimeStr : "x" + pet_PrimeValue / 100 + "%" + pet_PrimeStr;
			hero_hurt.text = auxiliaryIsper == 0 ? "+" + pet_AuxiliaryValue + pet_AuxiliaryStr : "x" + pet_AuxiliaryValue / 100 + "%" + pet_AuxiliaryStr;


			choice.visible = PetManager.Instance.CurrentpetID == pet.ID;
			click.on(Laya.Event.CLICK, this, this.ChoiceCurrentPet, [ID]);

			point.visible = PetManager.Instance.IsNewPet(ID);

			pet_icon.on(Laya.Event.CLICK, this, this.OpenInfoView, [ID]);

			//引导按钮
			if (index == 0 && this.bGuidanceButton) {
				Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_9, click)
				this.bGuidanceButton = false;
			}
		}

		private Close() {
			UIManager.Instance.DestroyUI("MainPetView", [ViewUpRoot]);
		}

		private ChoiceCurrentPet(id: number) {
			if (PetManager.Instance.CurrentpetID != 0)
				PetManager.Instance.OwnPetList[PetManager.Instance.CurrentpetID].CurrentState = 0;

			PetManager.Instance.OwnPetList[id].CurrentState = 1;
			if (PetManager.Instance.CurrentpetID != id) {
				this.SetCurrentPetInfo();
				PetManager.Instance.K_ReqUsePet(id);
			}
			PetManager.Instance.CurrentpetID = id;
			this.UpdateList();
			PetManager.Instance.SendShowPet(id);
		}

		private PetPlayMethod() {
			let title: string = "神兽";
			let content: string = GetInfoAttr.Instance.GetText(5000);
			UIManager.Instance.CreateUI("TipsActionView", [ViewToppestRoot, title, content]);
			//点击按钮音效
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
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