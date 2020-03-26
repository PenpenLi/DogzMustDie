/**Created by the LayaAirIDE*/
module H52D_Framework {
	AddViewResource("MostHandBookView", [
		{ url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
		{ url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
		{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
	]);
	export class MostHandBookView extends ui.heroList.HeroHandBook.MostHandBookViewUI {
		constructor() {
			super();
			this.ViewInit();
		}

		private ViewInit() {
			this.mosthanbook.vScrollBarSkin = "";
			this.ViewEvet();
			this.SetMostHandbook_list();
			this.ChangeListHigth();
		}

		private ViewEvet() {
			Event.RegistEvent("Rest_handbook_most", Laya.Handler.create(this, this.SetMostHandbook_list));
			Event.RegistEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
		}

		private ChangeListHigth(): void {
			if (ViewUILogic.Instance.halfPanel) {
				if (this.destroyed) return;
				this.mosthanbook.height = 160 * G_StageHeightScale;
			}
			else {
				this.mosthanbook.height = (960 - wxsclae) * G_StageHeightScale;
			}
		}

		private SetMostHandbook_list() {
			this.mosthanbook.array = HeroHandbookManager.Instance.MostHandBook();			
			this.mosthanbook.renderHandler = new Laya.Handler(this, this.MostHandbook_line);
		}

		private MostHandbook_line(item, index: number) {
			let Team_Id = this.mosthanbook.array[index];
			let Team_cfg = HandbookTeamConfig[Team_Id];
			let n_active = HeroHandbookManager.Instance.HandBookMoste_IsActive(Team_Id);
			let lv = HeroHandbookManager.Instance.GetHandTeambook_lv(Team_Id)
			let Teamhand_name: Laya.Label = item.getChildByName("mosthand_name");
			let Teamhand_lock: Laya.Label = item.getChildByName("mosthand_lock");
			let Btn_active: Laya.Button = item.getChildByName("Btn_lvup");
			let now: Laya.Label = item.getChildByName("mostbase_now");
			let next: Laya.Label = item.getChildByName("mostbase_next");
			let jiantou: Laya.Label = item.getChildByName("jiantou");
			let lv_max: Laya.Label = item.getChildByName("lv_max");
			let img_4: Laya.Image = item.getChildByName("mosthand_4");
			let img_5: Laya.Image = item.getChildByName("mosthand_5");

			img_4.visible = img_5.visible = false
			lv = lv == null ? 1 : lv;
			Teamhand_name.text = GetInfoAttr.Instance.GetText(Team_cfg.SuitName);
			let war_pos = Team_cfg.AttackStation;
			let posInfo = "";
			if (GetTabLength(war_pos) > 1) {
				posInfo = war_pos[1] + "号、" + war_pos[2] + "号";
				jiantou.x = 328;
			} else {
				posInfo = war_pos[1] + "号";
				jiantou.x = 298;
			}
			let a = posInfo + "阵位英雄";
			let bool = HeroHandbookManager.Instance.HandTeam_IsTrue(Team_Id);
			if (n_active) {
				Teamhand_lock.text = GetInfoAttr.Instance.GetSystemText(7145, lv + 1);
				Btn_active.label = "升级";
				for (let key in Team_cfg.Attritue) {
					let Attritue_now: Laya.Label = now.getChildByName("Attritue_" + key) as Laya.Label;
					let Attritue_next: Laya.Label = next.getChildByName("Attritue_" + key) as Laya.Label;
					let Attritue_arr_now = HeroHandbookManager.Instance.HandTeamLvUp(Team_Id, lv);
					let Attritue_arr_next = HeroHandbookManager.Instance.HandTeamLvUp(Team_Id, lv + 1);
					let new_info = a + GetInfoAttr.Instance.GetText(Attritue_arr_now["war"][key][1]);
					let war_base = Attritue_arr_now["base"][0] - 100;
					Attritue_now.text = new_info + ":" + war_base / 100 + "%";
					Attritue_next.text = (Attritue_arr_next["base"][0] / 100) - 1 + "%";
					if (lv_max.visible || HeroHandbookManager.Instance.HandLvMax() <= lv) {
						Attritue_next.text = "";
					}				
				}
			} else {
				Btn_active.label = "激活";
				Teamhand_lock.text = GetInfoAttr.Instance.GetSystemText(7144, 1);
				for (let key in Team_cfg.Attritue) {
					let Attritue_now: Laya.Label = now.getChildByName("Attritue_" + key) as Laya.Label;
					let Attritue_next: Laya.Label = next.getChildByName("Attritue_" + key) as Laya.Label;
					let Attritue_arr_now = HeroHandbookManager.Instance.HandTeamLvUp(Team_Id, lv);
					let Attritue_arr_next = HeroHandbookManager.Instance.HandTeamLvUp(Team_Id, 1);
					let new_info = a + GetInfoAttr.Instance.GetText(Attritue_arr_now["war"][key][1]);
					Attritue_now.text = new_info + ":" + 0 + "%";
					Attritue_next.text = Attritue_arr_next["war"][key][2] / 100 + "%";
				}
			}
			// 组合图鉴中 单个图鉴的信息
			for (let key in Team_cfg.HandbookTeam) {
				let mosthand: Laya.Image = item.getChildByName("mosthand_" + key);
				mosthand.visible = true;
				let hand_name: Laya.Label = mosthand.getChildByName("hand_name") as Laya.Label;
				let hand_lv: Laya.HTMLDivElement = mosthand.getChildByName("hand_lv") as Laya.HTMLDivElement;
				let icon: Laya.Image = mosthand.getChildByName("hand_icon") as Laya.Image;

				let hand_Id = Team_cfg.HandbookTeam[key];
				let single_active = HeroHandbookManager.Instance.HandBookSingle_IsActive(hand_Id);
				let Item_cfg = ItemConfig[hand_Id];
				let hand_Lv = HeroHandbookManager.Instance.GetHandBook_Lv(hand_Id);
				let hand_nameId = RelationConfig[hand_Id].HandbookName;
				hand_name.text = GetInfoAttr.Instance.GetText(hand_nameId);
				hand_name.color = BaseDefine.LabelColor[Item_cfg.dwItemQuality];
				SetHtmlStyle(hand_lv, 22, "#9be589", "left");
				hand_lv.innerHTML = "Lv:" + GetHtmlStrByColor(hand_Lv + "", "#f4ff79");
				if (!single_active) {
					hand_lv.innerHTML = "Lv:" + GetHtmlStrByColor(0 + "", "#f4ff79");
				}
				icon.skin = "ui_icon/" + RelationConfig[hand_Id].strHandbookIcon;
				icon.gray = !single_active;
				mosthand.skin = BaseDefine.QualityList[Item_cfg.dwItemQuality];
				hand_name.on(Laya.Event.CLICK, this, this.GoMade_Item, [Item_cfg.Line[1]])
			}
			if (HeroHandbookManager.Instance.HandLvMax() <= lv) {
				lv_max.visible = true;
				Btn_active.visible = false;
				Teamhand_lock.visible = false;
			}else{
				lv_max.visible = false;
				Btn_active.visible = true;
				Teamhand_lock.visible =true;
			}
			Btn_active.gray = !bool;
			Btn_active.mouseEnabled = bool;
			HeroHandbookManager.Instance.HandMostShow = !bool;
			Btn_active.on(Laya.Event.CLICK, this, this.Btnclick_TeamHand, [Team_Id]);
		}

		private GoMade_Item(Item_Id: number) {
			HeroHandbookManager.Instance.GoView(Item_Id);
		}

		private Btnclick_TeamHand(Item_Id: number) {
			let bool = HeroHandbookManager.Instance.HandTeam_IsTrue(Item_Id);
			if (!bool) {
				TipsLogic.Instance.OpenSystemTips("等级不足");
			}
			HeroHandbookManager.Instance.K_ReqUpgeadeSuitHandbook(Item_Id);
		}

		private OnDestroy() {
			this.offAll();
			Event.RemoveEvent("Rest_handbook_most", Laya.Handler.create(this, this.SetMostHandbook_list));
			Event.RemoveEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
		}
	}
}