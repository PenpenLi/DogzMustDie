/**Created by the LayaAirIDE*/
module H52D_Framework {
	AddViewResource("SkillInfoView",
		[
			{ url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS },
		]);
	export class SkillInfoView extends ui.tips.SkillInfoViewUI {
		private _index: number = 0;
		constructor(info: any) {
			super();
			this._index = info[1];
			this.Init();
			this.AddEvent();
		}

		/**添加按钮侦听器 */
		private AddEvent(): void {
			this.on(Laya.Event.REMOVED, this, this.OnDestroy);
			this.close.on(Laya.Event.CLICK, this, this.OnClickCloseBtn);
		}
		/**移除事件监听 */
		private OnDestroy(): void {
			this.offAll();
		}

		private Init() {
			let roleSkill = MainRoleLogic.Instance.roleSkill;
			let roleSkillCfg = MainRoleLogic.Instance.roleSkillCfg;
			let skilllv: number = roleSkill[this._index].lv;
			if (skilllv == 0) {
				skilllv = skilllv + 1;
			}
			let roleSkillId: number = roleSkillCfg[this._index][skilllv].roleSkillId;

			this.skillicon.skin = GetIcon(ActiveSkillConfig[roleSkillId].strIcon);
			this.skillname.text = GetInfoAttr.Instance.GetText(ActiveSkillConfig[roleSkillId].nameId);
			let skilltime: number = ActiveSkillConfig[roleSkillId].skillCD / 1000;
			let skilltimestr=skilltime+"";
			this.consume.text = ActiveSkillConfig[roleSkillId].conMp;
			this.skilllvlabel.text=skilllv+""
			SetHtmlStyle(this.desc, 18, "#d6d7dd", "left");
			this.desc.innerHTML = GetInfoAttr.Instance.GetText(ActiveSkillConfig[roleSkillId].skillFrom);
			let str = "冷却时间:"+GetHtmlStrByColor(skilltimestr+"秒", "#f4ff79",18);
			SetHtmlStyle(this.desceffect, 18, "#9be589", "left");
			this.desceffect.innerHTML = GetInfoAttr.Instance.GetText(ActiveSkillConfig[roleSkillId].descId);
			SetHtmlStyle(this.nextffect, 18, "#f4ff79", "left");
			if (MainRoleLogic.Instance.IsSkillUnlocked(this._index) && !MainRoleLogic.Instance.IsMaxLv(this._index)) {
				this.nextffect.innerHTML = GetInfoAttr.Instance.GetText(ActiveSkillConfig[roleSkillId + 1].descId);
			} else if (!MainRoleLogic.Instance.IsMaxLv(this._index)) {
				this.nextffect.innerHTML = GetInfoAttr.Instance.GetText(7003);
			} else {
				this.nextffect.innerHTML = "已达最大等级";
			}
		}

		/**关闭 */
		private OnClickCloseBtn() {
			UIManager.Instance.DestroyUI("SkillInfoView", [ViewUpRoot]);
		}
	}
}