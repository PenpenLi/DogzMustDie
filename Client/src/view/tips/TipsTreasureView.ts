/**Created by the LayaAirIDE*/

/**商城类型枚举 */
enum OpenType {
	/** 空*/
	eEmpty,
	eBox,
	ePro,
	eHero,
	ePet,
}
module H52D_Framework {
	AddViewResource("TipsTreasureView",
		[
			{ url: "res/ui/ui_sign.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_mail.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_pet.atlas", type: Laya.Loader.ATLAS }
		]);
	export class TipsTreasureView extends ui.tips.TipsTreasureViewUI {

		/** 宝箱内容列表*/
		private boxContentList: Array<any> = [];
		/** 宝箱*/
		//private box: Array<any> = [];
		/** 宝箱价格*/
		private boxsPrice: number;
		/** 宝箱ID*/
		private boxsID: number;
		/** 商城类型 */
		private boxType: number;
		/** 宝箱数量 */
		private ProNum: number;
		/** 商品ID */
		private conId: number;

		private heroAin: Avatar;
		private petAin: Avatar;
		
		constructor(info: any) {
			super();
			this.Init(info[1], info[2], info[3], info[4], info[5], info[6], info[7], info[8], info[9]);
			this.AddEvent();
		}

		/**添加按钮侦听器 */
		private AddEvent(): void {
			this.on(Laya.Event.REMOVED, this, this.OnDestroy);
			this.close.on(Laya.Event.CLICK, this, this.OnClickCloseBtn);
			this.boxList.renderHandler = new Laya.Handler(this, this.ShowContentList);
			this.boxList.array = this.boxContentList;
			this.boxBuy.on(Laya.Event.CLICK, this, this.BuyItems);
		}
		/**移除事件监听 */
		private OnDestroy(): void {
			this.offAll();
			if(this.heroAin)
			{
				this.heroAin.Destroy();
				this.heroAin=null;
			}
			if(this.petAin)
			{
				this.petAin.Destroy();
				this.petAin=null;
			}
		}

		/**
		 * 
		 * @param nType 商城类型
		 * @param nId 物品ID
		 * @param nPrice 物品价格
		 * @param nPriceType 价格类型
		 * @param nConId 商品ID
		 * @param nName tip标题
		 * @param openType 商城类型枚举
		 * @param nIcon 图标
		 * @param num 数量
		 */
		private Init(nType: number, nId: number, nPrice: number, nPriceType: number, nConId?: number, nName?: string, openType?: OpenType, nIcon?: any, num?: number) {
			this.tipName.changeText(nName);
			this.boxsPrice = nPrice;
			this.Boxprice.changeText(this.boxsPrice.toString());
			this.boxType = nType;
			this.boxsID = nId;
			this.conId = nConId;
			//售价字体颜色判断
			if (nPriceType == BaseDefine.ItemIdGold) {

				this.boxsPrice > ShopLogic.Instance.goldNum ? this.Boxprice.color = "#ff0028" : this.Boxprice.color = "#27af3d";
				this.prictIcon.skin = "ui_icon/icon_prop_012.png";
			} else {

				this.boxsPrice > ShopLogic.Instance.gemNum ? this.Boxprice.color = "#ff0028" : this.Boxprice.color = "#27af3d";
				this.prictIcon.skin = "ui_icon/icon_prop_013.png";
			}
			this.proBox.visible = false;
			this.boxBox.visible = false;
			this.heroBox.visible = false;
			this.bj.height = 426 * G_StageHeightScale;
			this.bj_2.visible = true;
			// this.bj_2.height = 282 * G_StageHeightScale;
			this.boxBuy.y = 350 * G_StageHeightScale;
			switch (openType) {
				case OpenType.ePro:
					this.proBox.visible = true;
					let cfg = ItemConfig[nId];
					this.proImg.skin = "ui_icon/" + nIcon;
					this.proName.changeText(GetInfoAttr.Instance.GetText(cfg.dwItemName));
					this.proName.color = BaseDefine.LabelColor[cfg.dwItemQuality];
					this.proBgIcon.skin = BaseDefine.QualityList[cfg.dwItemQuality];
					this.proNum.changeText("数量：" + num.toString());
					this.proContent.changeText("描述：" + GetInfoAttr.Instance.GetText(cfg.dwItemAState));
					break;
				case OpenType.eBox:
					this.boxBox.visible = true;
					this.describe.text = GetInfoAttr.Instance.GetText(7122)
					this.bj.height = 525 * G_StageHeightScale;
					this.boxBuy.y = 440 * G_StageHeightScale;
					//this.ProNum = nNum;
					let tCfg = ItemConfig[nId];
					//判断道具类型
					this.boxContentList = [];
					if (tCfg.dwItemType == 3) {
						let dwUseArr = tCfg.dwUseEffect;
						for (let info in dwUseArr) {
							let rCfg = RewardConfig[dwUseArr[info]];
							for (let r_info in rCfg.reWrad) {
								this.boxContentList.push(rCfg.reWrad[r_info]);
							}
						}
					} else {
						//this.boxContentList.push({ 1: nType, 2: nId, 3: nNum });
					}
					break;
				case OpenType.eHero:
					this.heroBox.visible = true;
					this.boxBuy.y = 506 * G_StageHeightScale;
					this.bj.height = 584 * G_StageHeightScale;
					// this.bj_2.height = 409 * G_StageHeightScale;
					this.bj_2.visible = false;
					let lv = this.heroBox.getChildByName("lv") as Laya.Label;
					let hp = this.heroBox.getChildByName("hp") as Laya.Label;
					let hit = this.heroBox.getChildByName("hit") as Laya.Label;
					let type = this.heroBox.getChildByName("type") as Laya.Label;
					let name = this.heroBox.getChildByName("name") as Laya.Label;
					let icon = this.heroBox.getChildByName("icon") as Laya.Image;
					let crit = this.heroBox.getChildByName("crit") as Laya.Label;
					let quality = this.heroBox.getChildByName("quality") as Laya.Label;
					let earlier = this.heroBox.getChildByName("earlier") as Laya.Label;
					let critRatio = this.heroBox.getChildByName("critRatio") as Laya.Label;
					let desc = this.heroBox.getChildByName("desc") as Laya.HTMLDivElement;
					let typeIcon = this.heroBox.getChildByName("typeIcon") as Laya.Image;
					let heroCfg = ItemConfig[nId];
					let hero = HeroConfig[heroCfg.heroId];
					let pos = hero.position

					let hp_txt = HeroUpgrateConfig[hero.type][1].Attr[1][2] * hero.heroRatio + "";
					let hit_txt = HeroUpgrateConfig[hero.type][1].Attr[2][2] * hero.heroRatio + "";
					let kill_str = GetInfoAttr.Instance.GetText(ActiveSkillConfig[hero.heroBigSkill].descId);
					//获取动画帧数成图片
					this.heroAin= new Avatar( icon )
					this.heroAin.Load( hero.strFacadeModel, 1, hero.modelScale * 1.7, pos[1] - 52, pos[2] - 112,
						Laya.Handler.create(this, () => {
							this.heroAin.Play(1, true, true, () => {
							}, true)
						}));

					lv.text = "1";
					hp.text = hp_txt + "";
					hit.text = hit_txt + "";
					earlier.text = hero.stationaryAttribute[1][2];
					type.text = BaseDefine.HeroTypeStr[hero.type];
					name.text = GetInfoAttr.Instance.GetText(heroCfg.dwItemName);
					typeIcon.skin = BaseDefine.HeroTypeIcon[hero.type];
					crit.text = hero.stationaryAttribute[2][2] / 100 + "%";
					critRatio.text = hero.stationaryAttribute[3][2] / 100 + "%";
					quality.text = BaseDefine.Hero_Rare[heroCfg.dwItemQuality];

					name.color = BaseDefine.LabelColor[heroCfg.dwItemQuality];
					quality.color = BaseDefine.LabelColor[heroCfg.dwItemQuality];

					icon.skin = BaseDefine.HeroAllinfo_bg[heroCfg.dwItemQuality];
					SetHtmlStyle(desc, 18, "#d6d7dd", "left")
					desc.innerHTML = kill_str;
					break;
				case OpenType.ePet:
					let pet;
					if (nType != 0) {
						pet = new BPetVo(nId);
						pet.Level = 1;
					} else {
						pet = PetManager.Instance.OwnPetList[nId];

					}
					this.petBox.visible = true;
					this.boxBuy.visible = false;
					this.bj.height = 530 * G_StageHeightScale;
					this.bj_2.visible = false;

					let pet_lv = this.petBox.getChildByName("lv") as Laya.Label;
					let pet_name = this.petBox.getChildByName("name") as Laya.Label;
					let pet_icon = this.petBox.getChildByName("icon") as Laya.Image;
					let pet_type = this.petBox.getChildByName("type") as Laya.Image;
					let pet_color = this.petBox.getChildByName("color") as Laya.Label;
					let pet_phyle = this.petBox.getChildByName("phyle") as Laya.Label;
					let pet_desc = this.petBox.getChildByName("desc") as Laya.HTMLDivElement;
					let pet_prime = this.petBox.getChildByName("prime") as Laya.Image;
					let pet_auxiliary = this.petBox.getChildByName("auxiliary") as Laya.Image;
					let pet_prime_1 = pet_prime.getChildByName("prime_1") as Laya.Label;
					let pet_prime_2 = pet_prime.getChildByName("prime_2") as Laya.Label;
					let pet_txt_1 = pet_prime.getChildByName("txt_1") as Laya.Label;
					let pet_txt_2 = pet_auxiliary.getChildByName("txt_2") as Laya.Label;
					let pet_auxiliary_1 = pet_auxiliary.getChildByName("auxiliary_1") as Laya.Label;
					let pet_auxiliary_2 = pet_auxiliary.getChildByName("auxiliary_2") as Laya.Label;
					let zs = this.petBox.getChildByName("zs") as Laya.Label;
					zs.visible = false;
					pet_type.visible = false;
					pet_name.text = pet.petName;
					pet_phyle.text = pet.petPhyle;
					SetHtmlStyle(pet_desc, 18, "#d6d7dd", "left")
					pet_desc.innerHTML = pet.petStory;
					pet_lv.text = pet.Level + "";
					pet_icon.skin = BaseDefine.PetColor_img[pet.petColor];
					pet_color.text = BaseDefine.Hero_Rare[pet.petColor];
					pet_name.color = pet_color.color = BaseDefine.PetColor_label[pet.petColor];
					//获取动画帧数成图片
					let pet_pos = pet.position;
					this.petAin = new Avatar( pet_icon )
					this.petAin.Load( pet.Path, 1, pet.Scla * pet_pos[1], pet_pos[2], pet_pos[3],
						Laya.Handler.create(this, () => {
							this.petAin.Play(1, true, true, () => {
							}, true)
						}));

					let pet_PrimeStr = GetInfoAttr.Instance.GetText(QualityValue[pet.currentAttribute[1][1]].dwName);
					let pet_AuxiliaryStr = GetInfoAttr.Instance.GetText(QualityValue[pet.currentAttribute[2][1]].dwName);

					let primeIsper = QualityValue[pet.currentAttribute[1][1]].isper;
					let auxiliaryIsper = QualityValue[pet.currentAttribute[2][1]].isper;

					let prime_1 = pet.AllMainAttribute[1][2];
					let prime_2 = pet.AllMainAttribute[2][2];

					let auxiliary_1 = pet.AllAuxAttribute[1][2];
					let auxiliary_2 = pet.AllAuxAttribute[2][2];

					if (pet.AllMainAttribute[1][1] == 4 && prime_1 > 10000) {
						prime_1 = 10000;
					}
					if (pet.AllMainAttribute[2][1] == 4 && prime_2 > 10000) {
						prime_2 = 10000;
					}
					if (pet.AllAuxAttribute[1][1] == 4 && auxiliary_1 > 10000) {
						auxiliary_1 = 10000;
					}
					if (pet.AllAuxAttribute[2][1] == 4 && auxiliary_2 > 10000) {
						auxiliary_2 = 10000;
					}

					pet_prime_1.text = primeIsper == 0 ? "+" + prime_1 + pet_PrimeStr : "x" + prime_1 / 100 + "%" + pet_PrimeStr;
					pet_prime_2.text = auxiliaryIsper == 0 ? "+" + prime_2 + pet_AuxiliaryStr : "x" + prime_2 / 100 + "%" + pet_AuxiliaryStr;

					pet_auxiliary_1.text = primeIsper == 0 ? "+" + auxiliary_1 + pet_PrimeStr : "x" + auxiliary_1 / 100 + "%" + pet_PrimeStr;
					pet_auxiliary_2.text = auxiliaryIsper == 0 ? "+" + auxiliary_2 + pet_AuxiliaryStr : "x" + auxiliary_2 / 100 + "%" + pet_AuxiliaryStr;


					if (pet.ID != PetManager.Instance.CurrentpetID) {
						pet_prime.skin = "ui_pet/btn-weixuanzhong-shenshou.png";
						pet_auxiliary.skin = "ui_pet/btn-xuanzhong-shenshou.png";
						pet_txt_1.color = pet_prime_1.color = pet_prime_2.color = "#7f8aaa"
						pet_txt_2.color = pet_auxiliary_1.color = pet_auxiliary_2.color = "#491a22"
					} else {
						pet_prime.skin = "ui_pet/btn-xuanzhong-shenshou.png";
						pet_auxiliary.skin = "ui_pet/btn-weixuanzhong-shenshou.png";
						pet_txt_1.color = pet_prime_1.color = pet_prime_2.color = "#491a22"
						pet_txt_2.color = pet_auxiliary_1.color = pet_auxiliary_2.color = "#7f8aaa"
					}

					if (nType != 0) {
						this.bj.height = 650;
						this.boxBuy.y = 585;
						this.boxBuy.visible = true;
						zs.visible = true;
						pet_txt_2.color = pet_auxiliary_1.color = pet_auxiliary_2.color = pet_txt_1.color = pet_prime_1.color = pet_prime_2.color = "#d6d7dd"
						pet_prime.skin = pet_auxiliary.skin = ""
					}
					break;
			}
		}

		/**
		 * 设置宝箱list样式
         * @param item 单个box
         * @param index 索引
		*/
		private ShowContentList(item, index: number): void {
			let boxProNum: Laya.Text = item.getChildByName("boxProNum");
			let boxProName: Laya.Text = item.getChildByName("boxProName");
			let boxProImg: Laya.Image = item.getChildByName("boxProImg");
			let bjIcon: Laya.Image = item.getChildByName("bjIcon");
			let info_Con = this.boxContentList[index];
			let info_Item = ItemConfig[info_Con[BaseDefine.ItemSellContentId]];
			let name: string = GetInfoAttr.Instance.GetText(info_Item.dwItemName);
			let num: string = "X" + info_Con[BaseDefine.ItemNumSellContent];
			bjIcon.skin = BaseDefine.QualityList[Number(info_Item.dwItemQuality)];
			boxProName.color = BaseDefine.LabelColor[Number(info_Item.dwItemQuality)];

			if (info_Item.dwItemTypes != 21) {
				boxProImg.scale(0.8, 0.8);
			}
			boxProNum.changeText(num);
			boxProName.changeText(name);
			boxProImg.skin = "ui_icon/" + info_Item.strIconID_B;
			boxProNum.visible = info_Con[BaseDefine.ItemNumSellContent] != 1;
		}


		private BuyItems(): void {
			ShopLogic.Instance.SendBuyMsg(this.boxType, this.conId, 1);
			this.OnClickCloseBtn();
			Event.DispatchEvent("ShowRedPoint", [E_OpenGrade.SHOP]);
		}

		/**关闭 */
		private OnClickCloseBtn() {
			UIManager.Instance.DestroyUI("TipsTreasureView", [ViewToppestRoot]);
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
		}
	}
}