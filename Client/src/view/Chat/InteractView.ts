/**Created by the LayaAirIDE*/
module H52D_Framework {
	AddViewResource("InteractView",
		[
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_head.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_interact.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_sign.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
		]);
	export class InteractView extends ui.Chat.InteractViewUI {
		private _presentCfg: Array<any> = [];
		private _giveObj: any = 0;
		private _roleID: number = 0;
		private _roleName: string = "";
		private _image: Laya.Image = null;
		private _pageNum: number = 0;
		private _offX: number = 0;
		private _selected: boolean = false;
		private _time: number = 0;
		constructor(buf: any) {
			super();
			this._image = null
			this._giveObj = null
			this._roleID = buf[1];
			this._roleName = buf[2];
			this.Init();
			this.InitEvent();
		}

		private Init(): void {
			this.giveto.text = this._roleName;

			//list
			this._presentCfg = InteractLogic.Inst.presentCfg;
			this.list.hScrollBarSkin = "";
			this.list.array = this._presentCfg;
			this.list.renderHandler = new Laya.Handler(this, this.RenderHandler);

			for (var index = 1; index < 6; index++) {
				this["image" + index].visible = false;
			}
			for (var index = 1; index < this._presentCfg.length + 1; index++) {
				this["image" + index].visible = true;
			}

			this["image" + 1].skin = "ui_interact/img-huaye1.png";

		}
		private _mouseDown: boolean = false;
		private InitEvent(): void {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.giveBtn.on(Laya.Event.CLICK, this, this.OnGive);
			this.close.on(Laya.Event.CLICK, this, () => {
				UIManager.Instance.DestroyUI("InteractView", [ViewUpRoot]);
			});
			Event.RegistEvent("RefreshInteractViewList", Laya.Handler.create(this, this.RefreshInteractViewList));
			this.on(Laya.Event.MOUSE_DOWN, this, () => {
				this._mouseDown = true;
				this._offX = Laya.MouseManager.instance.mouseX;
			});
			this.on(Laya.Event.MOUSE_UP, this, () => {
				Debugger.Log("MOUSE_UP");
				if (!this._mouseDown) return;
				this._mouseDown = false;
				//向左画
				if (this._offX - Laya.MouseManager.instance.mouseX > 150) {
					if (this._pageNum < this._presentCfg.length - 1) {
						this._pageNum++;
					}
				} else if (Laya.MouseManager.instance.mouseX - this._offX > 150) {
					if (this._pageNum > 0) {
						this._pageNum--;
					}
				}

				this.list.tweenTo(this._pageNum, 2.0, new Laya.Handler(this, () => {
					this.list.scrollBar.stopScroll()
					this._image.visible = true;
					this._selected = true;

					for (var index = 1; index < this._presentCfg.length + 1; index++) {
						this["image" + index].skin = "ui_interact/img-huaye2.png";
					}
					let i: number = this._pageNum + 1;
					this["image" + i].skin = "ui_interact/img-huaye1.png";

				}));
			});
			this.on(Laya.Event.MOUSE_OUT, this, () => {
				Debugger.Log("MOUSE_OUT");
				if (!this._mouseDown) return;
				this._mouseDown = false;
				//向左画
				if (this._offX - Laya.MouseManager.instance.mouseX > 150) {
					if (this._pageNum < this._presentCfg.length - 1) {
						this._pageNum++;
					}
				} else if (Laya.MouseManager.instance.mouseX - this._offX > 150) {
					if (this._pageNum > 0) {
						this._pageNum--;
					}
				}

				this.list.tweenTo(this._pageNum, 2.0, new Laya.Handler(this, () => {
					this.list.scrollBar.stopScroll()
					this._image.visible = true;
					this._selected = true;

					for (var index = 1; index < this._presentCfg.length + 1; index++) {
						this["image" + index].skin = "ui_interact/img-huaye2.png";
					}
					let i: number = this._pageNum + 1;
					this["image" + i].skin = "ui_interact/img-huaye1.png";

				}));
			});
		}

		private Destroy(): void {
			this.offAll();
			Laya.timer.clearAll(this);
			Event.RemoveEvent("RefreshInteractViewList", Laya.Handler.create(this, this.RefreshInteractViewList));
		}
		private OnGive(): void {
			if (BagManager.Instance.getItemNumber(this._giveObj["itemId"]) > 0) {
				let nowDate: Date = new Date();
				let time: number = (nowDate.getDate() * 24 * 60 + nowDate.getHours() * 60 + nowDate.getMinutes()) * 60 + nowDate.getSeconds();;
				if (this._time == 0 || time - this._time > 1) {
					this._time = time;
					RemoteCall.Instance.Send("K_ReqGiveGifts", this._roleID, Number(this._giveObj["presentId"]));
				} else {
					TipsLogic.Instance.OpenSystemTips("一秒内只能赠送一次");
				}
			}
			else {
				if (BagManager.Instance.getItemNumber(this._giveObj["cost"][1]) > this._giveObj["cost"][2]) {
					let nowDate: Date = new Date();
					let time: number = (nowDate.getDate() * 24 * 60 + nowDate.getHours() * 60 + nowDate.getMinutes()) * 60 + nowDate.getSeconds();;
					if (this._time == 0 || time - this._time > 1) {
						this._time = time;
						RemoteCall.Instance.Send("K_ReqGiveGifts", this._roleID, Number(this._giveObj["presentId"]));
					} else {
						TipsLogic.Instance.OpenSystemTips("一秒内只能赠送一次");
					}
				} else {
					if (IsShieldRecharge()) {
						TipsLogic.Instance.OpenMessageBox("钻石不足!");
						return
					} else {
						TipsLogic.Instance.OpenMessageBox("前往充值", Laya.Handler.create(this, () => {
							UIManager.Instance.DestroyUI("InteractView", [ViewUpRoot]);
							UIManager.Instance.DestroyUI("RankView", [ViewUpRoot]);
							UIManager.Instance.DestroyUI("ChatView", [ViewUpRoot]);
							Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
							Event.DispatchEvent(EventDefine.BOTTOM_SET_PANEL);
							OneTimer(500, () => {
								Event.DispatchEvent("toGemShop");
							});
						}), Laya.Handler.create(this, () => {
						}))
					}
				}
			}
		}
		private RefreshInteractViewList(): void {
			// this._selected = false;
			this.list.refresh();
		}

		/**list */
		private RenderHandler(item: Laya.Box, index: number): void {
			let page: any = this._presentCfg[index];
			for (let m = 0; m < item._childs.length; m++) {
				item._childs[m].visible = false;
			}
			for (var key in page) {
				var obj = page[key];
				let box = item._childs[key];
				box.visible = true;
				//---------------------------------
				let selecticon: Laya.Image = box.getChildByName("selecticon") as Laya.Image;
				let giftname: Laya.Label = box.getChildByName("giftname") as Laya.Label;
				let gifticon: Laya.Image = box.getChildByName("gifticon") as Laya.Image;
				let giftnum: Laya.Label = box.getChildByName("giftnum") as Laya.Label;
				let charm: Laya.Label = box.getChildByName("charm") as Laya.Label;
				let gold: Laya.Image = box.getChildByName("gold") as Laya.Image;
				let goldnum: Laya.Label = box.getChildByName("goldnum") as Laya.Label;
				selecticon.visible = false;
				if ((index == 0 && Number(key) == 0) && (this._giveObj == null)) {
					this._image = selecticon;
					this._giveObj = obj;
				}
				let itemID: number = obj.itemId;
				giftname.text = GetInfoAttr.Instance.GetText(ItemConfig[itemID].dwItemName);
				giftname.color = BaseDefine.LabelColor[ItemConfig[itemID].dwItemQuality]
				gifticon.skin = GetIcon(ItemConfig[itemID].strIconID_B);
				giftnum.text = BagManager.Instance.getItemNumber(itemID) + "";
				// if ((this._giveObj != null) && (BagManager.Instance.getItemNumber(this._giveObj.itemId))) {
				// 	if( this._giveObj == obj ){
				// 		this._giveObj = obj;
				// 		this._image = selecticon;
				// 		selecticon.visible = true;
				// 		this._selected = true;
				// 	}
				// } else {
				if (BagManager.Instance.getItemNumber(itemID) > 0 && !this._selected) {
					this._giveObj = obj;
					this._image = selecticon;
					selecticon.visible = true;
					this._selected = true;
				}
				// }
				if (obj.charm >= 0) {
					charm.text = "魅力+" + obj.charm;
				} else {
					charm.text = "魅力" + obj.charm;
				}

				let cost: Object = obj.cost;
				gold.skin = GetIcon(ItemConfig[cost[1]].strIconID_B);
				goldnum.text = cost[2];

				box.on(Laya.Event.CLICK, this, this.OnGift, [{ 1: obj, 2: selecticon }]);

				if (index == this._presentCfg.length - 1 && Number(key) == (ObjLength(page) - 1)) {
					this._image.visible = true;
					this._selected = true;
				}
			}
		}

		/**
		 * 技能详情
		 */
		private OnGift(buf: any): void {
			if (this._image) {
				this._image.visible = false;
			}
			this._giveObj = buf[1];
			this._image = buf[2];
			if (buf[2]) {
				buf[2].visible = true;
			}
		}



	}
}