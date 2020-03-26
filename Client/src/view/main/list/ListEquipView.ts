/**
 * 时空法器
 */
module H52D_Framework {
	AddViewResource("ListEquipView",
		[
			{ url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_equip.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
		]);

	export class ListEquipView extends ui.main.list.ListEquipViewUI implements IViewPanel {
		constructor() {
			super();

			this.AddEvent();
			this.InitView();
		}
		private _red:Laya.Image;
		private _btn: Laya.Button;

		private static Idx: number = 1;
		private InitView() {
			this.E_list.vScrollBarSkin = "";
			this.red_start();
			this.Btn_click(ListEquipView.Idx);
			this.ChangeListHigth();
			this.Put_Equip();
		}

		/**添加事件 */
		private AddEvent() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.btn_1.on(Laya.Event.CLICK, this, this.Btn_click, [1]);
			this.btn_2.on(Laya.Event.CLICK, this, this.Btn_click, [2]);
			this.btn_3.on(Laya.Event.CLICK, this, this.Btn_click, [3]);
			this.btn_4.on(Laya.Event.CLICK, this, this.Btn_click, [4]);
			this.btn_5.on(Laya.Event.CLICK, this, this.Btn_click, [5]);
			this.E_make.on(Laya.Event.CLICK, this, this.OpenView, ["MakeEquipView"]);
			Event.RegistEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
			Event.RegistEvent("Puton", Laya.Handler.create(this, this.Btn_puton));
			Event.RegistEvent("updatelist_equip", Laya.Handler.create(this, this.Btn_Resh));
			Event.RegistEvent("redshow", Laya.Handler.create(this, this.RedShow));//
			Event.RegistEvent("DeleShow", Laya.Handler.create(this, this.DeleShow));
		}

		private EquipMax_num() {
			let my_num = EquipManager.Instance.GetEquipNum();
			let number=GameParamConfig.EquipMaxNum;
			this.E_mynum.text = my_num + "/" + GameParamConfig.EquipMaxNum
			
		}

		private Resh_num(){
			let my_num = EquipManager.Instance.GetEquipNum();
			if (EquipManager.Instance.IsOverflow) {
				let str = SysPromptConfig[30030].strPromptInfo;
				TipsLogic.Instance.OpenSystemTips(str);
			}
		}

		private ChangeListHigth(): void {
			if (ViewUILogic.Instance.halfPanel) {
				if (this.destroyed) return;
				this.E_list.height = 175 * G_StageHeightScale;
			}
			else {
				this.E_list.height = (980 - wxsclae) * G_StageHeightScale;
			}
		}
		private Equiplist: Array<any> = [];

		private Equip_List(index: number, bool) {			
			this.EquipMax_num();
			let E_id = EquipManager.Instance.GetEquipByType(index);
			this.Equiplist = E_id.array;
			EquipManager.Instance.SortE(this.Equiplist, bool);
			this.E_list.array = this.Equiplist;
			this["red_" + ListEquipView.Idx].visible = false;
			this.E_list.renderHandler = new Laya.Handler(this, this.E_Handler);
		}

		private E_Handler(item, index: number) {
			let nIdx = this.E_list.array[index].instId;
			let e_Info = EquipManager.Instance.GetEquipByInstId(nIdx);
			let e_info_base = e_Info.baseAttribute;//
			let e_icon: Laya.Image = item.getChildByName("e_icon");
			let bg: Laya.Image = item.getChildByName("bg");
			let pinzhi: Laya.Image = item.getChildByName("E_pinzhi");
			let e_name: Laya.Label = item.getChildByName("e_name");
			let e_lv: Laya.HTMLDivElement = item.getChildByName("e_lv");
			let e_base: Laya.Label = item.getChildByName("e_base");
			let btn: Laya.Button = item.getChildByName("btn_use");
			let type_icon: Laya.Image = btn.getChildByName("type_icon") as Laya.Image;
			let bnew: Laya.Image = item.getChildByName("red");
			let used: Laya.Label = item.getChildByName("used");
			let use_id = EquipManager.Instance.GetCurrentEquipByType(ListEquipView.Idx);
			if (use_id == nIdx) {
				btn.visible = false;
				used.visible = true;
			}
			else {
				btn.visible = true;
				used.visible = false;
			}
			bnew.visible = e_Info.bNew;
			if (e_Info.bNew) {
				this["red_" + ListEquipView.Idx].visible = e_Info.bNew;
			}
			e_name.color = BaseDefine.EquipQualityColor[e_Info.equipColor];
			e_name.text = e_Info.equipName;
			e_icon.skin = "ui_icon/" + e_Info.equipIcon;
			SetHtmlStyle(e_lv, 18, "#c0eb9f", "left");
			e_lv.innerHTML = "LV:" + GetHtmlStrByColor(e_Info.equipLevel, "#ffff79");
			e_lv.mouseThrough=true;
			pinzhi.skin = BaseDefine.EquipBgColor[e_Info.equipColor];

			let base_ID = e_info_base[1][1];
			let base_value = e_info_base[1][2];
			let base_tcfg = QualityValue[base_ID];
			e_base.text = GetInfoAttr.Instance.GetText(base_tcfg.dwName) + base_value;
			if (base_tcfg.isper == 1) {
				let num=Math.floor(base_value / 100)
				e_base.text = GetInfoAttr.Instance.GetText(base_tcfg.dwName) +num + "%";
			}

			bg.on(Laya.Event.CLICK, this, this.OpenView, ["EquipTips", nIdx]);
			btn.on(Laya.Event.CLICK, this, this.Btn_use, [nIdx, btn]);
		}

		private Btn_click(index: number) {
			ListEquipView.Idx = index
			this.Equip_List(index, true);
			this.TitileShow(index);
		}

		private OpenView(name: string, id: number) {
			UIManager.Instance.CreateUI(name, [ViewUpRoot, id]);
		}

		private Btn_use( id: number, btn: Laya.Button) {			
			this._btn = btn;
			EquipManager.Instance.K_ReqUseEquip(id);
		}

		private Btn_puton(nIdx: number) {
			let e_Info = EquipManager.Instance.GetEquipByInstId(nIdx);
			this["E_" + [ListEquipView.Idx]].skin = "ui_icon/" + e_Info.equipIcon;
			e_Info.bNew=false;
			EquipManager.Instance.K_ReqLookEquip(nIdx);
			this.Equip_List(ListEquipView.Idx, false);	
			this["icon"+[ListEquipView.Idx]].visible=false;
			if (UIManager.Instance.IsHave("EquipTips", ViewUpRoot)) {
				UIManager.Instance.DestroyUI("EquipTips", [ViewUpRoot]);
			}
			this.Equip_List(ListEquipView.Idx, false);
		}

		private TitileShow(index: number) {
			switch (index) {
				case 1:
					this.o1.visible = true;
					this.o2.visible = false;
					this.o3.visible = false;
					this.o4.visible = false;
					this.o5.visible = false;
					this.name1.color="#d3c1aa";
					this.name2.color="#89848a";
					this.name3.color="#89848a";
					this.name4.color="#89848a";
					this.name5.color="#89848a";
					break;
				case 2:
					this.o1.visible = false;
					this.o2.visible = true;
					this.o3.visible = false
					this.o4.visible = false;
					this.o5.visible = false;
					this.name1.color="#89848a";
					this.name2.color="#d3c1aa";
					this.name3.color="#89848a";
					this.name4.color="#89848a";
					this.name5.color="#89848a";
					break;
				case 3:
					this.o1.visible = false;
					this.o2.visible = false;
					this.o3.visible = true;
					this.o4.visible = false;
					this.o5.visible = false;
					this.name1.color="#89848a";
					this.name2.color="#89848a";
					this.name3.color="#d3c1aa";
					this.name4.color="#89848a";
					this.name5.color="#89848a";					
					break;
				case 4:
					this.o1.visible = false;
					this.o2.visible = false;
					this.o3.visible = false
					this.o4.visible = true;
					this.o5.visible = false;
					this.name1.color="#89848a";
					this.name2.color="#89848a";
					this.name3.color="#89848a";
					this.name4.color="#d3c1aa";
					this.name5.color="#89848a";
					break;
				case 5:
					this.o1.visible = false;
					this.o2.visible = false;
					this.o3.visible = false;
					this.o4.visible = false;
					this.o5.visible = true;
					this.name1.color="#89848a";
					this.name2.color="#89848a";
					this.name3.color="#89848a";
					this.name4.color="#89848a";
					this.name5.color="#d3c1aa";
					break;
			}
		}

		private Put_Equip() {
			for (let type = 1; type <= 5; type++) {
				let E_id = EquipManager.Instance.GetCurrentEquipByType(type);
				let E_Info = EquipManager.Instance.GetEquipByInstId(E_id);
				if (!E_Info) {
					continue;
				}
				this["E_" + type].skin = "ui_icon/" + E_Info.equipIcon;
				this["icon"+type].visible=false;
			}
		}

		private Btn_Resh(id: number) {
			this.Equip_List(ListEquipView.Idx, true);			
			let e_Info = EquipConfig[id];
			e_Info.bNew = true;
			//EquipManager.Instance.GetEquip_one(id);
			let type = e_Info.equipType;			
			this["red_" + type].visible = e_Info.bNew&&EquipManager.Instance.EquipOnlyone;
			this.Resh_num();
		}

		/**增加装备 */
		private RedShow() {
			if (this["red_" + ListEquipView.Idx].visible) {
				this.Equip_List(ListEquipView.Idx, false);
			}
		}


		/**删除装备 */
		private DeleShow() {
			this.Equip_List(ListEquipView.Idx, true);
		}

		private red_start() {
			for (let type = 1; type <= 5; type++) {
				let all_equip = EquipManager.Instance.GetEquipByType(type);
				for (let key in all_equip.list) {
					let e_info = all_equip.list[key];
					if (e_info.bNew) {
						this["red_" + type].visible = e_info.bNew&&EquipManager.Instance.EquipOnlyone;
					}
				}
			}
		}

		// 移除事件监听
		public Destroy(): void {
			this.offAll();
			Event.RemoveEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
			Event.RemoveEvent("Puton", Laya.Handler.create(this, this.Btn_puton));
			Event.RemoveEvent("updatelist_equip", Laya.Handler.create(this, this.Btn_Resh));
			Event.RemoveEvent("redshow", Laya.Handler.create(this, this.RedShow));
			Event.RemoveEvent("DeleShow", Laya.Handler.create(this, this.DeleShow));
		}
	}
}