/**Created by the LayaAirIDE*/
module H52D_Framework {
	AddViewResource("MakeEquipView",
		[
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
		]);

	export class MakeEquipView extends ui.Equep.MakeEquipViewUI {
		constructor() {
			super();

			this.AddEvent();
			this.InitView();
		}

		private InitView() {
			this.E_suitList.vScrollBarSkin = "";
			this.Info();
			this.Btn_click(MakeEquipView.Indx);
		}


		private static Indx: number = 3;
		private AddEvent() {
			this.btn_1.on(Laya.Event.CLICK, this, this.Btn_click, [3]);
			this.btn_2.on(Laya.Event.CLICK, this, this.Btn_click, [4]);
			this.btn_3.on(Laya.Event.CLICK, this, this.Btn_click, [5]);
			this.btn_close.on(Laya.Event.CLICK, this, this.Btn_closeclick);
			this.Other.on(Laya.Event.CLICK, this, this.Btn_closeclick);
			this.M_help.on(Laya.Event.CLICK, this, this.Btn_help);
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			Event.RegistEvent("updatelist_equip", Laya.Handler.create(this, this.Btn_Resh));
			Event.RegistEvent("DeleShow", Laya.Handler.create(this, this.Btn_Resh));
		}

		private Info() {
			SetHtmlStyle(this.my_num, 26, "#c0eb9f", "left");
			let path = "<img src= 'ui_icon/icon_prop_016.png' width='35px' height='35px'></img>";
			let item_num = BagManager.Instance.getItemNumber(2201);
			this.my_num.innerHTML = "拥有:" + path + GetHtmlStrByColor(item_num + "", "#fafa85");;
		}

		private UpdateList(type: number) {
			MakeEquipView.Indx = type;

			this.E_suitList.array = EquipManager.Instance.GetSuitCfgListByType(type);
			this.E_suitList.renderHandler = new Laya.Handler(this, this.E_Handler);
		}

		private E_Handler(item, index: number) {
			let nIdx = this.E_suitList.array[index];
			let suit_tcfg = SuitConfig[nIdx];
			let equipnum = suit_tcfg.equipGroupId
			let suit_name: Laya.HTMLDivElement = item.getChildByName("Equip_name");
			let suit_base1: Laya.HTMLDivElement = item.getChildByName("suit_base1");
			let suit_base2: Laya.HTMLDivElement = item.getChildByName("suit_base2");
			let suit_base3: Laya.HTMLDivElement = item.getChildByName("suit_base3");
			suit_base1.innerHTML = "";
			suit_base2.innerHTML = "";
			suit_base3.innerHTML = "";
			SetHtmlStyle(suit_name, 22, BaseDefine.EquipQualityColor[suit_tcfg.suitColor], "left");
			let base_info = suit_tcfg.suitAttribute;
			for (let key in base_info) {
				let path = "<img src= 'ui_camp/img-dian-tongyong.png' width='24px' height='24px'></img>";
				let suit_base: Laya.HTMLDivElement = item.getChildByName("suit_base" + key);
				SetHtmlStyle(suit_base, 22, "#dde2f2", "left");
				let id = base_info[key][1];
				let name_id = QualityValue[id];
				let name_text = GetInfoAttr.Instance.GetText(name_id.dwName);
				if (EquipManager.Instance.IsSuitActivate(nIdx)) {
					SetHtmlStyle(suit_base, 22, "#9be589", "left");
				}
				suit_base.innerHTML = path + name_text + GetHtmlStrByColor(base_info[key][2], "#f4ff79");
				if (name_id.isper == 1) {
					suit_base.innerHTML = path + name_text + GetHtmlStrByColor((base_info[key][2] / 100).toString(), "#f4ff79") + "%";
				}
			}
			let name = GetInfoAttr.Instance.GetText(suit_tcfg.suitName)
			let num = EquipManager.Instance.GetSuitOnceActivateNum(nIdx);
			suit_name.innerHTML = name + GetHtmlStrByColor("(" + num + "/5)", "#bebbf8");

			for (let key in equipnum) {
				let l_n = item.getChildByName(key);//
				let suit_bg: Laya.Image = l_n.getChildByName("E_pinzhi" + key) as Laya.Image;
				let suit_icon: Laya.Image = l_n.getChildByName("E_icon" + key) as Laya.Image;
				let suit_name: Laya.Label = l_n.getChildByName("E_name" + key) as Laya.Label;
				let suit_base1: Laya.Label = l_n.getChildByName("E_base" + key) as Laya.Label;
				let suit_lv: Laya.HTMLDivElement = l_n.getChildByName("E_lv" + key) as Laya.HTMLDivElement;
				let make_num: Laya.HTMLDivElement = l_n.getChildByName("E_makenum" + key) as Laya.HTMLDivElement;
				let btn: Laya.Button = l_n.getChildByName("E_make" + key) as Laya.Button;
				let suit_lock: Laya.Label = l_n.getChildByName("E_lock") as Laya.Label;
				SetHtmlStyle(make_num, 20, "#fafa85", "center");
				let group_id = equipnum[key];
				let equip_id = EquipManager.Instance.GetEquipIdBySuitId(group_id);
				if (equip_id == null) { return }
				let e_info = EquipConfig[equip_id];
				let type = e_info.equipType
				let bool = EquipManager.Instance.IsSuitOnceActivate(group_id);
				suit_icon.gray = !bool;
				suit_lock.visible = !bool;
				btn.gray = bool;
				let base = e_info.baseAttribute;
				SetHtmlStyle(suit_lv, 20, "#9be589", "left");
				suit_lv.innerHTML = "LV:" + GetHtmlStrByColor(e_info.equipLevel, "#f4ff79");
				suit_name.text = GetInfoAttr.Instance.GetText(e_info.equipName);
				suit_name.color = BaseDefine.EquipQualityColor[e_info.equipColor];
				suit_bg.skin = BaseDefine.EquipBgColor[e_info.equipColor];
				suit_icon.skin = "ui_icon/" + e_info.equipIcon;
				let base_ID = base[1][1];
				let base_value = base[1][2];
				let base_tcfg = QualityValue[base_ID];
				suit_base1.text = GetInfoAttr.Instance.GetText(base_tcfg.dwName) + base_value;
				if (base_tcfg.isper == 1) {
					suit_base1.text = GetInfoAttr.Instance.GetText(base_tcfg.dwName) + Math.floor(base_value / 100) + "%";
				}
				let item_num = BagManager.Instance.getItemNumber(2201);
				let path = "<img src= 'ui_icon/icon_prop_016.png' width='25px' height='25px'></img>";
				make_num.innerHTML = path + e_info.composeNeedNum;
				suit_base1.color = "#d7e6ff";
				btn.gray = item_num < e_info.composeNeedNum ? true : false;
				btn.mouseEnabled = !btn.gray;
				if (item_num < e_info.composeNeedNum) {
					btn.gray = true;
				}
				else {
					btn.gray = false;
				}
				btn.on(Laya.Event.CLICK, this, this.Btn_makeequip, [group_id]);
			}
		}

		private Btn_closeclick() {
			UIManager.Instance.DestroyUI("MakeEquipView", [ViewUpRoot]);
		}

		private Btn_click(index: number) {

			this.UpdateList(index);
			switch (index) {
				case 3:
					this.img1.skin = "ui_rank/img-zi-weixuan.png";
					this.left1.skin = "ui_rank/img-zi-xuan.png";
					this.img2.skin = "ui_rank/img-lan-weixuan.png";
					this.img3.skin = "ui_rank/img-lan-weixuan.png";
					this.btn_name1.color = "#eff8bb";
					this.btn_name2.color = "#bebbf8";
					this.btn_name3.color = "#bebbf8";
					break;
				case 4:
					this.img1.skin = "ui_rank/img-lan-weixuan.png";
					this.left1.skin = "ui_rank/img-lan-xuan.png";
					this.img2.skin = "ui_rank/img-zi-weixuan.png";
					this.img3.skin = "ui_rank/img-lan-weixuan.png";
					this.btn_name1.color = "#bebbf8";
					this.btn_name2.color = "#eff8bb";
					this.btn_name3.color = "#bebbf8";
					break;
				case 5:
					this.img1.skin = "ui_rank/img-lan-weixuan.png";
					this.left1.skin = "ui_rank/img-lan-xuan.png";
					this.img2.skin = "ui_rank/img-lan-weixuan.png";
					this.img3.skin = "ui_rank/img-zi-weixuan.png";
					this.btn_name1.color = "#bebbf8";
					this.btn_name2.color = "#bebbf8";
					this.btn_name3.color = "#eff8bb";
					break;
			}

		}

		private _sendlock = true;
		/**制作装备 */
		private Btn_makeequip(id: number) {
			if (this._sendlock == false) {
				return
			}
			this._sendlock = false;
			OneTimer(1000, () => {
				this._sendlock = true;
			})
			EquipManager.Instance.K_ReqCompoundEquip(id);
		}

		private Btn_help() {
			let title: string = "玩法说明";
			let content: string = GetInfoAttr.Instance.GetText(6005);
			UIManager.Instance.CreateUI("TipsActionView", [ViewToppestRoot, title, content]);
			//播放点击按钮音效
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
		}

		private Btn_Resh() {
			this.Info();
			this.UpdateList(MakeEquipView.Indx);
		}

		private Destroy() {
			this.offAll();
			Event.RemoveEvent("updatelist_equip", Laya.Handler.create(this, this.Btn_Resh));
			Event.RemoveEvent("DeleShow", Laya.Handler.create(this, this.Btn_Resh));
		}
	}
}