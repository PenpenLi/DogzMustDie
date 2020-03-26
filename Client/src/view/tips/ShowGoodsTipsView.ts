/**获得物品统一界面*/


module H52D_Framework {
	AddViewResource("ShowGoodsTipsView",
		[
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_sign.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_pet.atlas", type: Laya.Loader.ATLAS }
		]);

	export class ShowGoodsTipsView extends ui.tips.ShowGoodsTipsViewUI {
		/**Item列表 */
		private ItemPos = {
			0: { Item: this.Item_1, type: this.ItemTpye_1, name: this.ItemName_1, icon: this.icon_1, info: this.info_1 },
			1: { Item: this.Item_2, type: this.ItemTpye_2, name: this.ItemName_2, icon: this.icon_2, info: this.info_2 },
			2: { Item: this.Item_3, type: this.ItemTpye_3, name: this.ItemName_3, icon: this.icon_3, info: this.info_3 },
			3: { Item: this.Item_4, type: this.ItemTpye_4, name: this.ItemName_4, icon: this.icon_4, info: this.info_4 },
			4: { Item: this.Item_5, type: this.ItemTpye_5, name: this.ItemName_5, icon: this.icon_5, info: this.info_5 },
		}

		private ContentList: Array<any> = [];
		private aimArr: Array<Avatar> = [];
		private info: Object;
		private _cartridge = new Cartridge();
		private _showItem = new Cartridge();
		private _timeinterval: number;
		private _showItemInterval: number;

		/**
		 * @param params 传入数组 {1：[1：道具类型 2：道具ID 3：道具数量],2:[].....}
		 */
		constructor(params: any) {
			super();
			this._timeinterval = 1500;
			this._showItemInterval = 150;
			this.ContentList = new Array<any>();
			this.info = params[1];
			// bMore 目前只有十连抽奖会用到 策划鬼才
			let bMore = params[2];
			let itemType: number;
			let itemId: number;
			let itemNum: number;
			let dataInfo: any;
			if (bMore) {
				for (let nIdx in this.info) {
					let obj = this.info[nIdx]
					for (let type in obj) {
						itemType = Number(type);
						let data = obj[type];
						for (let id in data) {
							itemId = Number(id);
							itemNum = data[id];
							if (itemNum > 0) {
								dataInfo = [];
								dataInfo.push(itemType);
								dataInfo.push(itemId);
								dataInfo.push(itemNum);
								this.ContentList.push(dataInfo);
							}
						}
					}
				}
			} else {
				for (let type in this.info) {
					itemType = Number(type);
					let data = this.info[type];
					for (let id in data) {
						itemId = Number(id);
						itemNum = data[id];
						if (itemNum > 0) {
							dataInfo = [];
							dataInfo.push(itemType);
							dataInfo.push(itemId);
							dataInfo.push(itemNum);
							this.ContentList.push(dataInfo);
						}
					}
				}
			}
			this.Init();
			this.AddEvent();
			this.Showaside();
		}

		private Init() {
			this.closeTime.visible = false;
			this.SetItem();
		}

		/**添加按钮侦听器 */
		private AddEvent(): void {
			this.on(Laya.Event.REMOVED, this, this.OnDestroy);
		}

		/**移除事件监听 */
		private OnDestroy(): void {
			Tick.ClearAll(this);
			this.offAll();
			this._cartridge.Clear();
			this._showItem.Clear();
			for (let nkey in this._bjEffect) {
				this._bjEffect[nkey].Destroy();
			}
			for (let nkey in this.aimArr) {
				if (this.aimArr[nkey] != null) {
					this.aimArr[nkey].Destroy();
				}
			}

			//查看是否还有有奖励打开
			if (TipsLogic.Instance._showGoodsList.length > 0) {
				let award = TipsLogic.Instance._showGoodsList[0]
				TipsLogic.Instance.OpenGoodsProTips(award)
				TipsLogic.Instance._showGoodsList.splice(0);
			}
		}
		private Showaside() {
			let asideId: number = 0;
			for (let i in this.info) {
				for (let cardId in this.info[i]) {
					if (ItemConfig[cardId] && ItemConfig[cardId]["dwItemTypes"] == 21) {
						let heroId: number = ItemConfig[cardId]["heroId"];
						asideId = HeroConfig[heroId]["aside"];
						//判断英雄有没有解锁
						let heroList: Object = HeroManager.Instance.Herolist;
						for (let hid in heroList) {
							if (heroId == Number(hid)) {
								asideId = 0;
								break;
							}
						}
						//判断背包有没有卡牌
						let list = BagManager.Instance.GetItemList();
						for (let iid in list) {
							if (list[iid].dwItemTypes == 21 &&   //子类型是英雄类型
								heroId == ItemConfig[iid]["heroId"] &&  //该英雄是当前获得的英雄
								BagManager.Instance.getItemNumber(Number(iid)) > 1) { //英雄碎片不能只有当前这一个
								asideId = 0;
								break;
							}
						}
					}
					break;
				}
				if (!asideId) {
					break;
				}
			}
			if (asideId != 0) {
				Tick.Clear(this, this.Countones);
				CustomsManager.Instance.OpenAside(asideId, () => {
					Tick.Once(this._timeinterval, this, this.Countones, [this.ContentList.length]);
				});
			}
		}

		private time: number = 10;
		/**倒计时
		 * @param length 物品个数
		 */
		private CountDownTime(length: number) {
			this.time = 10;
			let str: string = "点击任意位置获得奖品(" + this.time.toString() + "s)";
			this.closeTime.text = str;
			this.closeTime.visible = false;
			Tick.Clear(this, this.Countones);
			Tick.Once(this._timeinterval, this, this.Countones, [length]);
		}

		private Countones(length: number) {
			Tick.Clear(this, this.CountDown);
			this.closeTime.visible = true;
			Tick.Loop(1000, this, this.CountDown, [length]);
		}

		private CountDown(length: number) {
			this.time--;
			let str: string = "点击任意位置获得奖品(" + this.time.toString() + "s)";
			this.closeTime.text = str;
			if (this.time <= 0) {
				length <= 5 ? this.OnClickOkBtn() : this.SetItem(true);
				this.closeTime.visible = false;
				Tick.Clear(this, this.CountDown);
			}
		}


		private scaleDelta: number = 0;
		/**物品渐变出现
		 * @param item 物品
		 */
		private SetItemScale(item: any, length: number) {
			let aelta = this.scaleDelta;
			Tick.Clear(this, SetScale);

			Tick.Loop(10, this, SetScale);

			function SetScale() {
				length == 1 ? aelta += 0.1 : aelta += 0.05
				if (aelta >= 1) {
					item.scale(1, 1);
					Tick.Clear(this, SetScale);
					return;
				}
				item.scale(aelta, aelta);
			}
		}

		/** 设置物品
		 * b 是否有下一页
		*/
		private SetItem(b: boolean = false) {
			this.close.off(Laya.Event.CLICK, this, this.OnClickOkBtn);
			this.close.off(Laya.Event.CLICK, this, this.SetItem);
			if (b) {
				this.PlayClaseEffect(Laya.Handler.create(this, () => {
					for (let i in this.ItemPos) {
						this.ItemPos[i].Item.visible = false;
					}
					if (this.ContentList == null) return;

					let leng = this.ContentList.length;
					if (leng > 5) {
						OneTimer(this._timeinterval, () => {
							this.close.on(Laya.Event.CLICK, this, this.SetItem, [true]);
						});
						let data = this.ContentList.splice(0, 5);
						this.SetItemContent(5, data);
					}
					else if (leng <= 5) {
						OneTimer(this._timeinterval, () => {
							this.close.on(Laya.Event.CLICK, this, this.OnClickOkBtn);
						});

						this.SetItemContent(leng, this.ContentList);
						this.SetItemPos(leng);
					}
					this.CountDownTime(leng);
				}));
				return;
			}
			for (let i in this.ItemPos) {
				this.ItemPos[i].Item.visible = false;
			}
			if (this.ContentList == null) return;

			let leng = this.ContentList.length;
			if (leng > 5) {
				OneTimer(this._timeinterval, () => {
					this.close.on(Laya.Event.CLICK, this, this.SetItem, [true]);
				});
				let data = this.ContentList.splice(0, 5);
				this.SetItemContent(5, data);
			}
			else if (leng <= 5) {
				OneTimer(this._timeinterval, () => {
					this.close.on(Laya.Event.CLICK, this, this.OnClickOkBtn);
				});

				this.SetItemContent(leng, this.ContentList);
				this.SetItemPos(leng);
			}
			this.CountDownTime(leng);
		}

		/**设置Item初始位置 */
		private SetItemPos(len: number) {
			switch (len) {
				case 2:
					this.ItemPos[0].Item.centerX = -150 * G_StageWidthScale;
					this.ItemPos[1].Item.centerX = 150 * G_StageWidthScale;

					this.ItemPos[0].info.centerX = -150 * G_StageWidthScale;
					this.ItemPos[1].info.centerX = 150 * G_StageWidthScale;
					break;
				case 3:
					this.ItemPos[0].Item.centerX = -150 * G_StageWidthScale;
					this.ItemPos[0].Item.centerY = 130 * G_StageHeightScale;
					this.ItemPos[1].Item.centerX = 150 * G_StageWidthScale;
					this.ItemPos[1].Item.centerY = 130 * G_StageHeightScale;
					this.ItemPos[2].Item.centerX = 0 * G_StageWidthScale;
					this.ItemPos[2].Item.centerY = -200 * G_StageHeightScale;

					this.ItemPos[0].info.centerX = -150 * G_StageWidthScale;
					this.ItemPos[0].info.centerY = 100 * G_StageHeightScale;
					this.ItemPos[1].info.centerX = 150 * G_StageWidthScale;
					this.ItemPos[1].info.centerY = 100 * G_StageHeightScale;
					this.ItemPos[2].info.centerX = 0 * G_StageWidthScale;
					this.ItemPos[2].info.centerY = -270 * G_StageHeightScale;
					break;
				case 4:
					this.ItemPos[0].Item.centerX = -150 * G_StageWidthScale;
					this.ItemPos[0].Item.centerY = 130 * G_StageHeightScale;
					this.ItemPos[1].Item.centerX = 150 * G_StageWidthScale;
					this.ItemPos[1].Item.centerY = 130 * G_StageHeightScale;
					this.ItemPos[2].Item.centerX = 150 * G_StageWidthScale;
					this.ItemPos[2].Item.centerY = -200 * G_StageHeightScale;
					this.ItemPos[3].Item.centerX = -150 * G_StageWidthScale;
					this.ItemPos[3].Item.centerY = -200 * G_StageHeightScale;

					this.ItemPos[0].info.centerX = -150 * G_StageWidthScale;
					this.ItemPos[0].info.centerY = 100 * G_StageHeightScale;
					this.ItemPos[1].info.centerX = 150 * G_StageWidthScale;
					this.ItemPos[1].info.centerY = 100 * G_StageHeightScale;
					this.ItemPos[2].info.centerX = 150 * G_StageWidthScale;
					this.ItemPos[2].info.centerY = -270 * G_StageHeightScale;
					this.ItemPos[3].info.centerX = -150 * G_StageWidthScale;
					this.ItemPos[3].info.centerY = -270 * G_StageHeightScale;
					break;
			}
		}

		/**
		 * 设置Item内容
		 * @param length 物品个数
		 * @param dataArr 物品数组
		 */
		private SetItemContent(length: number, dataArr: any) {
			this._showItem.Clear();
			for (let info = 0; info < length; info++) {
				let i = info;
				let func = Laya.Handler.create(this, () => {
					SoundManager.Instance.OnPlaySound("res/sound/get_new_prop.mp3");
					let data = dataArr[i];
					let proType = data[0];
					let proId = data[1];
					let proNum = data[2];

					let bj = "bj_" + (i + 1);
					let tb = "tb_" + (i + 1);
					let hpValue = "hpValue_" + (i + 1);
					let hitValue = "hitValue_" + (i + 1);
					let heroType = "heroType_" + (i + 1);
					let hitname: Laya.Label = this.ItemPos[i].Item.getChildByName("hitname");
					let hpname: Laya.Label = this.ItemPos[i].Item.getChildByName("hpname");
					this.ItemPos[i].Item.scale(0, 0);
					if (proType == BaseDefine.ItemTypePro) {
						this.ItemPos[i].Item.visible = true;
						let cfg = ItemConfig[proId];
						let icon = cfg.strIconID_B;
						let name = GetInfoAttr.Instance.GetText(cfg.dwItemName);
						let colorNum = cfg.dwItemQuality;
						let content: string;
						content = "x" + proNum.toString();
						if (Number(proId) == BaseDefine.ItemIdGold) {
							Event.DispatchEvent(EventDefine.ADD_GOLD);
						}
						this.ItemPos[i].type.text = content;
						this.ItemPos[i].type.visible = proNum != 1;
						this.ItemPos[i].name.text = name.toString();
						this.ItemPos[i].name.color = BaseDefine.LabelColor[colorNum];
						this.SetItemScale(this.ItemPos[i].Item, length);
						if (cfg.dwItemTypes != BaseDefine.ItemSonTypeUesHero) {
							this.ItemPos[i].icon.skin = "ui_icon/" + icon;

							this.ItemPos[i].icon.y = 110 * G_StageHeightScale;
							hpname.visible = false;
							hitname.visible = false;
							this[bj].visible = false;
							this[tb].visible = false;
							this[hpValue].visible = false; 
							this[heroType].visible = false;
							this[hitValue].visible = false;

							this.aimArr.push(null);
							if (cfg.dwItemType == 1 ||
								Number(proId) == 2301 ||
								Number(proId) == 3201) {
								TipsLogic.Instance.OpenSystemTips(name + "+" + proNum);
							}
							
						}
						else {

							this[bj].skin = BaseDefine.HeroQualityList[cfg.dwItemQuality];
							this[heroType].skin = BaseDefine.HeroTypeIcon[1];
							hpname.visible = false;
							hitname.visible = false;
							this[bj].visible = false;
							this[tb].visible = false;
							this[hpValue].visible = false;
							this[heroType].visible = false;
							this[hitValue].visible = false;

							let hero = HeroConfig[cfg.heroId];

							this.ItemPos[i].icon.skin = "";
							this.ItemPos[i].icon.y = 86 * G_StageHeightScale;
							let pos = hero.position;
							//获取动画帧数成图片
							let heroAin = new Avatar(this.ItemPos[i].icon)
							heroAin.Load(hero.strFacadeModel, 1, hero.modelScale * 1.7, 0, 100,
								Laya.Handler.create(this, (heroAins) => {
									heroAins.Play(1, true, true, () => {
									}, true)
								}));
							this.aimArr.push(heroAin);
						}
					}
					else if (proType == BaseDefine.ItemTypeEquip) {
						this.ItemPos[i].Item.visible = true;
						let equip = EquipConfig[proId];
						let equipName = GetInfoAttr.Instance.GetText(equip.equipName);
						let equipIcon = "ui_icon/" + equip.equipIcon;
						let equipType = equip.equipType;
						let equipColor = equip.equipColor;
						let equipLevel = equip.equipLevel;
						this.ItemPos[i].icon.skin = equipIcon;
						this.ItemPos[i].icon.width = 140;
						this.ItemPos[i].icon.height = 140;
						this.ItemPos[i].type.text = "等级： " + equipLevel;
						this.ItemPos[i].name.text = equipName;
						this.ItemPos[i].name.color = BaseDefine.PetColor_label[equipColor];
						this.SetItemScale(this.ItemPos[i].Item, length);

						hpname.visible = false;
						hitname.visible = false;
						this[bj].visible = false;
						this[tb].visible = false;
						this[hpValue].visible = false;
						this[heroType].visible = false;
						this[hitValue].visible = false;
					}
					else if (proType == BaseDefine.ItemTypePet) {
						this.ItemPos[i].Item.visible = true;
						let pet = PetConfig[proId];
						let pet_name = GetInfoAttr.Instance.GetText(pet.petName)
						let pet_type = GetInfoAttr.Instance.GetText(pet.petPhyle)
						let pet_icon = pet.strPetIcon;
						let pet_color = pet.petColor;
						let pet_mainbase = pet.initialPrimeAttribute;
						let bool = this.ItemPos[i].icon.visible;
						this.ItemPos[i].icon.skin = "";
						this.ItemPos[i].type.text = "X " + proNum;
						this.ItemPos[i].name.text = pet_name;
						this.ItemPos[i].name.color = BaseDefine.PetColor_label[pet_color];
						this.SetItemScale(this.ItemPos[i].Item, length);


						hpname.visible = true;
						hitname.visible = false;
						this[tb].visible = true;
						this[bj].visible = false;
						this[hpValue].visible = true;
						this[hitValue].visible = true;
						this[heroType].visible = true;

						hitname.text = pet_type;
						hitname.x = hitname.x + 20;
						hitname.y = hitname.y + 10;
						hpname.visible = false;
						this[hpValue].visible = false;
						this[hitValue].visible = false;

						this[tb].skin = "";
						this[heroType].skin = "";

						this[bj].skin = BaseDefine.HeroQualityList[pet_color];

						//获取动画帧数成图片
						let petAin = new Avatar(this.ItemPos[i].icon)
						petAin.Load(pet.strPetModel, 1, pet.modelScale * 1.7, 0, 100,
							Laya.Handler.create(this, (heroAins) => {
								heroAins.Play(1, true, true, () => {
								}, true)
							}));
						this.aimArr.push(petAin);
					}
					let effect: Laya.Image = this.ItemPos[i].Item.getChildByName("effect");
					this.SetItemFloat(this.ItemPos[i].Item);
					this.ShowProEffect(this.ItemPos[i].Item, effect);
					this.CloseEffect(this.ItemPos[i].info);
				})
				this._showItem.AddFunc(func)
				this._showItem.AddDelay(this._showItemInterval)
			}
			this._showItem.Do();
		}
		private _bjEffect: Array<Avatar> = [];
		private _tShowEffect: Array<Avatar> = [];

		private ShowProEffect(Item: Laya.Image, effect: Laya.Image) {
			let _showEffect = new Avatar(Item)
			_showEffect.Load("res/effect/effect_ui_daoju1/effect_ui_daoju1.sk", 1, 2, 100 * G_StageWidthScale, 135 * G_StageHeightScale,
				Laya.Handler.create(this, (_showEffects) => {
					_showEffects.visible = true;
					_showEffects.Play("effect_ui_daoju1", false, true, () => {
					})
				}));
			this._tShowEffect.push(_showEffect);
			let _showEffectBj: Avatar = new Avatar(effect)
			_showEffectBj.Load("res/effect/effect_ui_daoju2/effect_ui_daoju2.sk", 1, 3, 100 * G_StageWidthScale, 135 * G_StageHeightScale,
				Laya.Handler.create(this, (_showEffectBjs) => {
					_showEffectBjs.visible = true;
					_showEffectBjs.Play("effect_ui_daoju2", true, true, () => {
					})
				}));
			this._bjEffect.push(_showEffectBj);
		}

		private _claseEffect: Array<Avatar> = [];
		private CloseEffect(effect: Laya.Image) {
			let _showEffectBj: Avatar = new Avatar(effect)
			_showEffectBj.Load("res/effect/effect_ui_daoju3/effect_ui_daoju3.sk", 1, 0.7, 100 * G_StageWidthScale, 145 * G_StageHeightScale,
				Laya.Handler.create(this, () => {
				}));
			this._claseEffect.push(_showEffectBj);
		}

		/**关闭特效运行 */
		private PlayClaseEffect(fun: Laya.Handler) {
			this._cartridge.Clear()
			for (let eff in this._claseEffect) {
				let idx = Number(eff);
				let func = Laya.Handler.create(this, () => {
					SoundManager.Instance.OnPlaySound("res/sound/get_new_prop02.mp3");
					this.ItemPos[idx].Item.scale(0, 0);
					if (this.aimArr[idx]) {
						this.aimArr[idx].Destroy()
					}
					this._claseEffect[idx].Play("effect_ui_daoju3", false, true, () => {

					})
					this._bjEffect[idx].Destroy();
					this._tShowEffect[idx].Destroy();
				})
				this._cartridge.AddFunc(func)
				this._cartridge.AddDelay(this._showItemInterval)
			}
			let funss = Laya.Handler.create(this, () => {
				for (let nkey in this._claseEffect) {
					this._claseEffect[nkey].Destroy();
				}
				this._claseEffect = [];
				this.aimArr = [];
				this._bjEffect = [];
				this._tShowEffect = [];
				fun.run();
			})
			this._cartridge.AddFunc(funss)
			this._cartridge.AddDelay(500)

			this._cartridge.Do()
		}

		private bCloseFlag = false

		/**点击关闭 */
		private OnClickOkBtn(): void {
			//this.close.off(Laya.Event.CLICK, this, this.OnClickOkBtn);
			if( this.bCloseFlag ){
				return
			}
			this.bCloseFlag = true
			this.PlayClaseEffect(Laya.Handler.create(this, () => {
				this.bCloseFlag = false
				UIManager.Instance.DestroyUI("ShowGoodsTipsView", [ViewToppestRoot]);
				Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_3);
				Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_5);
				Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_8);
				Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_9);
			}));
		}

		private _floatNum: number = 0;
		/**物品浮动 */
		private SetItemFloat(item: Laya.Image) {
			if (this._floatNum >= 5) return;
			this._floatNum++;
			let y = 0;
			Tick.Loop(10, this, () => {
				y += 0.05
				item.centerY += Math.sin(y) * G_StageHeightScale;
			})
		}

		private RemoveNum() {
			this._cartridge.RemoveNum();
			this._showItem.RemoveNum();
		}
	}
}