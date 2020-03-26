/**Created by the LayaAirIDE*/
module H52D_Framework {
	AddViewResource("SingleHandBookView", [
		{ url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
		{ url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
		{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
	]);
	export class SingleHandBookView extends ui.heroList.HeroHandBook.SingleHandBookViewUI {
		constructor() {
			super();
			this.ViewInit();
		}
		private _arr: Array<number> = [];
		private ViewInit() {
			this.singlehandbook_list.vScrollBarSkin = "";
			this.ViewEvet();
			this.SetHandbook_list();
			this.play_say.text = GetInfoAttr.Instance.GetText(7143);
			this.ChangeListHigth();
			let a = HeroHandbookManager.Instance.MostHandbookInfo();
		}

		private ViewEvet() {
			Event.RegistEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
			Event.RegistEvent("Rest_handbook_single", Laya.Handler.create(this, this.Resh_view));
		}

		private ChangeListHigth(): void {
			if (ViewUILogic.Instance.halfPanel) {
				if (this.destroyed) return;
				this.singlehandbook_list.height = 100 * G_StageHeightScale;
			}
			else {
				this.singlehandbook_list.height = (910 - wxsclae) * G_StageHeightScale;
			}
		}

		private Resh_view() {
			this._arr = HeroHandbookManager.Instance.SinghandBook();
			this.singlehandbook_list.refresh();
			this.singlehandbook_list.renderHandler = new Laya.Handler(this, this.SetHandbook_line);
		}

		private SetHandbook_list() {
			this.singlehandbook_list.array = HeroHandbookManager.Instance.SinghandBook();
			HeroHandbookManager.Instance.SortHandbook(true, this.singlehandbook_list.array);
			this.singlehandbook_list.renderHandler = new Laya.Handler(this, this.SetHandbook_line);
		}

		private SetHandbook_line(item, index: number) {
			let hand_Id = this.singlehandbook_list.array[index];
			let n_active = HeroHandbookManager.Instance.HandBookSingle_IsActive(hand_Id);
			let n_tcfg = RelationConfig[hand_Id];
			let item_cfg = ItemConfig[hand_Id];
			let playItem_num = BagManager.Instance.getItemNumber(hand_Id);
			let lv;
			if (n_active) {
				lv = HeroHandbookManager.Instance.GetHandBook_Lv(hand_Id);
			} else {
				lv = 1;
			}
			let hand_pinzhi: Laya.Image = item.getChildByName("hand_pinzhi");
			let hand_icon: Laya.Image = item.getChildByName("hand_icon");
			let hand_name: Laya.Label = item.getChildByName("hand_name");
			let hand_lv: Laya.HTMLDivElement = item.getChildByName("hand_lv");
			let Btn_lvup: Laya.Button = item.getChildByName("Btn_lvup");
			let lv_max: Laya.Label = item.getChildByName("lv_max");
			let hand_num: Laya.HTMLDivElement = Btn_lvup.getChildByName("hand_num") as Laya.HTMLDivElement;
			let base_Now: Laya.Label = item.getChildByName("base_now");
			let base_Next: Laya.Label = item.getChildByName("base_next");
			let handup_cfg = HandbookUpConfig[lv];
			hand_name.text = GetInfoAttr.Instance.GetText(n_tcfg.HandbookName);
			hand_name.color = BaseDefine.LabelColor[item_cfg.dwItemQuality];
			hand_icon.skin = "ui_icon/" + n_tcfg.strHandbookIcon;
			hand_pinzhi.skin = BaseDefine.QualityList[item_cfg.dwItemQuality];
			hand_num.mouseThrough = true;

			let next_cfg;
			if (n_active) {
				item.alpha = 1;
				Btn_lvup.label = "升级";
				SetHtmlStyle(hand_lv, 22, "#9be589", "left");
				hand_lv.innerHTML = "Lv:" + GetHtmlStrByColor(lv + "", "#f4ff79");
				next_cfg = HandbookUpConfig[lv];
				if (lv < HeroHandbookManager.Instance.HandLvMax()) {
					next_cfg = HandbookUpConfig[lv + 1];
				}
				for (let key in handup_cfg.AddAttribute) {
					let base_key: Laya.Label = base_Now.getChildByName("base_now_" + key) as Laya.Label;
					base_key.visible = true;
					let base_info = handup_cfg.AddAttribute[key];
					base_key.text = GetInfoAttr.Instance.GetText(base_info[1]) + ":" + base_info[2] / 100 + "%";
				}
				if (next_cfg != null) {
					for (let key in next_cfg.AddAttribute) {
						let base_key: Laya.Label = base_Next.getChildByName("base_next_" + key) as Laya.Label;
						let base_info = next_cfg.AddAttribute[key];
						base_key.text = base_info[2] / 100 + "%";
						base_key.visible = true;
					}
				}
			} else {
				lv = 1;
				let bool = HeroHandbookManager.Instance.HandSingle_IsTrue(hand_Id)
				Btn_lvup.label = "激活";
				Btn_lvup.gray = !bool;
				item.alpha = 0.7;
				item.alpha = bool ? 1 : 0.7;
				for (let key in handup_cfg.AddAttribute) {
					let base_key: Laya.Label = base_Now.getChildByName("base_now_" + key) as Laya.Label;
					base_key.visible = true;
					let base_info = handup_cfg.AddAttribute[key];
					base_key.text = GetInfoAttr.Instance.GetText(base_info[1]) + ":" + 0 + "%";
					SetHtmlStyle(hand_lv, 22, "#9be589", "left");
					hand_lv.innerHTML = "Lv:" + GetHtmlStrByColor(0 + "", "#f4ff79");
				}
				next_cfg = HandbookUpConfig[1];
				for (let key in next_cfg.AddAttribute) {
					let base_key: Laya.Label = base_Next.getChildByName("base_next_" + key) as Laya.Label;
					let base_info = next_cfg.AddAttribute[key];
					base_key.text = base_info[2] / 100 + "%";
					base_key.visible = true;
				}
			}
			SetHtmlStyle(hand_num, 22, "#ffc58b", "center");
			hand_num.innerHTML = "图鉴: " + GetHtmlStrByColor(playItem_num + "", "#ffa5a7") + "/" + next_cfg.NeedItemNum;
			if (playItem_num >= next_cfg.NeedItemNum) {
				hand_num.innerHTML = "图鉴: " + GetHtmlStrByColor(playItem_num + "", "#75d888") + "/" + next_cfg.NeedItemNum;
			}

			if (HeroHandbookManager.Instance.HandLvMax() <= lv) {
				lv_max.visible = true;
				Btn_lvup.visible = false;
			} else {
				lv_max.visible = false;
				Btn_lvup.visible =true;
			}
			hand_name.on(Laya.Event.CLICK, this, this.GoMade_Item, [item_cfg.Line[1]]);
			Btn_lvup.on(Laya.Event.CLICK, this, this.BtnHand_click, [hand_Id]);
		}

		private GoMade_Item(Item_Id: number) {
			HeroHandbookManager.Instance.GoView(Item_Id);
		}

		private BtnHand_click(Item_Id: number) {
			HeroHandbookManager.Instance.K_ReqUpgeadeHandbook(Item_Id);
		}

		private OnDestroy() {
			this.offAll();
			Event.RemoveEvent("Rest_handbook_single", Laya.Handler.create(this, this.Resh_view));
			Event.RemoveEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
		}
	}
}