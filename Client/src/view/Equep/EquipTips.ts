/**Created by the LayaAirIDE*/
module H52D_Framework {
	AddViewResource("EquipTips",
		[
			{ url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_equip.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
		]);
	export class EquipTips extends ui.Equep.EquipTipsUI {
		constructor(buf) {
			super();
			this.equip_ID = buf[1];
			this.e_Info = EquipManager.Instance.GetEquipByInstId(this.equip_ID);
			this.ChangeLock(this.e_Info.bLock);
			this.InitView();
			this.AddEvent();
		}
		private equip_ID;
		private e_Info

		private InitView() {						
			this.Info();
			this.Isuse();
			this.Btn_puton();
			EquipManager.Instance.K_ReqLookEquip(this.equip_ID);
			Event.DispatchEvent("ShowRedPoint", E_OpenGrade.EQUIP);
		}

		private Info() {
			SetHtmlStyle(this.price_num, 18, "#fafa85", "center");
			this.price_num.innerHTML = "<img src= 'ui_icon/icon_prop_013.png' width='20px' height='20px'></img>" + this.e_Info.sellNum;
			SetHtmlStyle(this.E_lv, 18, "#9be589", "left");
			this.E_lv.innerHTML = "LV:" + GetHtmlStrByColor(this.e_Info.equipLevel, "#fafa85");
			SetHtmlStyle(this.E_base1, 20, "#d7e6ff", "left");
			//SetHtmlStyle(this.E_base2,18,"#d6d7dd","center");
			//this.E_base2.innerHTML=path;//属性
			let path = "<img src= 'ui_camp/img-dian-tongyong.png' width='24px' height='24px'></img>";
			this.E_icon.skin = "ui_icon/" + this.e_Info.equipIcon;//装备图片
			this.E_pinzhi.skin = BaseDefine.EquipBgColor[this.e_Info.equipColor];
			this.E_name.text = this.e_Info.equipName;
			this.E_name.color = BaseDefine.EquipQualityColor[this.e_Info.equipColor];
			let e_info_base = this.e_Info.baseAttribute;
			let base_ID = e_info_base[1][1];
			let base_value = Math.floor(e_info_base[1][2]);
			let base_tcfg = QualityValue[base_ID];
			this.E_base1.innerHTML = path + GetInfoAttr.Instance.GetText(base_tcfg.dwName) + base_value;
			if (base_tcfg.isper == 1) {
				this.E_base1.innerHTML = path + GetInfoAttr.Instance.GetText(base_tcfg.dwName) + Math.floor(base_value / 100) + "%";
			}
		}

		private AddEvent() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.btn_lock.on(Laya.Event.CLICK, this, this.Btn_lock);
			this.btn_price.on(Laya.Event.CLICK, this, this.Btn_price);
			this.btn_close.on(Laya.Event.CLICK, this, this.Btn_close);
			this.btn_use.on(Laya.Event.CLICK, this, this.Btn_use);
			this.Other.on(Laya.Event.CLICK, this, this.Btn_close);
			Event.RegistEvent("Setlock", Laya.Handler.create(this, this.ChangeLock));
			Event.RegistEvent("Puton", Laya.Handler.create(this, this.Btn_puton));
		}

		private Btn_lock() {

			if (this.e_Info.bLock) {
				EquipManager.Instance.K_ReqLockEquip(this.equip_ID, false);
			}
			else {
				EquipManager.Instance.K_ReqLockEquip(this.equip_ID, true);
			}
		}

		/**关闭页面 */
		private Btn_close() {
			UIManager.Instance.DestroyUI("EquipTips", [ViewUpRoot]);
			Event.DispatchEvent("redshow")
		}

		private Btn_puton(){
			let E_Info = EquipManager.Instance.GetEquipByInstId(this.equip_ID);
			let type =E_Info.equipType;
			let E_id = EquipManager.Instance.GetCurrentEquipByType(type);
			let bool=E_id==this.equip_ID?true:false;
			this.used.visible=bool
			this.btn_use.visible=!bool;
		}

		/**佩戴装备 */
		private Btn_use() {			
			EquipManager.Instance.K_ReqUseEquip(this.equip_ID);
		}
		/**出售装备 */
		private Btn_price() {
			if (this.e_Info.equipColor > 3) {								
				let str=Format(SysPromptConfig[30032].strPromptInfo,GetHtmlStrByColor(this.e_Info.equipName,BaseDefine.EquipQualityColor[this.e_Info.equipColor]))				
				TipsLogic.Instance.OpenMessageBox(str,
					Laya.Handler.create(this, () => {
					if (!this.e_Info.bLock) {
						EquipManager.Instance.K_ReqSellEquip(this.equip_ID);
						UIManager.Instance.DestroyUI("EquipTips", [ViewUpRoot]);
					}
					else {
						//飘字 或者啥
					}
				}));
			}
			else{
				EquipManager.Instance.K_ReqSellEquip(this.equip_ID);
				UIManager.Instance.DestroyUI("EquipTips", [ViewUpRoot]);
			}
		}

		private Isuse() {
			let tcfg = EquipManager.Instance.GetEquipByInstId(this.equip_ID);
			let use_id = EquipManager.Instance.GetCurrentEquipByType(tcfg.equipType);
			if (use_id == this.equip_ID) {				
				this.used.visible = true;
				this.btn_price.visible = false;
			}
		}

		private ChangeLock(bool: boolean) {
			let path_s = "ui_equip/btn-suoding-faqi.png";
			let path_w = "ui_equip/btn-weisuoding-faqi.png";  //true 锁上
			if (bool) {
				this.E_lock.skin = path_s;
			}
			else {
				this.E_lock.skin = path_w;
			}
			let tcfg = EquipManager.Instance.GetEquipByInstId(this.equip_ID);
			let use_id = EquipManager.Instance.GetCurrentEquipByType(tcfg.equipType);
			if (use_id == this.equip_ID) return;
			this.btn_price.gray = bool;
			this.btn_price.mouseEnabled = !bool;
		}

		private Destroy() {
			this.offAll();
			Event.RemoveEvent("Setlock", Laya.Handler.create(this, this.ChangeLock));
			Event.RemoveEvent("Puton", Laya.Handler.create(this, this.Btn_puton));
		}
	}
}