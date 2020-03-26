/**Created by the LayaAirIDE*/
module H52D_Framework {

	AddViewResource("WroldBossView",
		[
			{ url: "res/ui/ui_pet.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_wroldboss.atlas", type: Laya.Loader.ATLAS },			
			{ url: "res/ui/ui_scene01.atlas", type: Laya.Loader.ATLAS },
		]);
	/**世界boss入口 */
	export class WroldBossView extends ui.action.boss.WroldBossViewUI {
		constructor() {
			super();
			this.titlebg.height = 39 + wxsclae
			this.Btn_Rank.y = this.titlebg.height + 20
			this.Btn_reward.y = this.titlebg.height + 20
			this.hurt_bg.y = this.titlebg.height + 40
			this.ViewInit();
		}

		private _monsterAin: Avatar = null;

		private ViewInit() {
			this.Addevent();
			this.ViewInfo();
		}

		private Addevent() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.Btn_Rank.on(Laya.Event.CLICK, this, this.Btn_clickrank);
			this.Btn_Challenge.on(Laya.Event.CLICK, this, this.Btn_clickchallenge);
			this.Btn_Close.on(Laya.Event.CLICK, this, this.Btn_clickclose);
			this.Btn_reward.on(Laya.Event.CLICK, this, this.Btn_clickreward);
		}

		private ViewInfo() {
			WroldBossBuffView.once = 0;
			this.Boss_say.text = GetInfoAttr.Instance.GetText(7114);
			this.tatil.text = GetInfoAttr.Instance.GetText(5014);
			let monstor = MonstorConfig[99998];
			this._monsterAin = new Avatar( this.Boss_Icon )
			this._monsterAin.Load( monstor.strModelId, 1, monstor.modelScale * 1.5, 200, 550,
				Laya.Handler.create(this, (monsterAins) => {
					monsterAins.Play(1, true, true, () => {
					}, true)
				}));
			this.Boss_Name.text = GetInfoAttr.Instance.GetText(monstor.NameId);
			this.Hurt_max.text = "最高伤害:" + MasterPlayer.Instance.GetEventDayProByType(EventProEnum.NowBossRank);
			this.hurt_bg.width = (this.Hurt_max.width) * 1.1;
		}

		/**关闭界面 */
		private Btn_clickclose() {
			UIManager.Instance.DestroyUI("WroldBossView", [ViewUpRoot]);
			Event.DispatchEvent("OnPanelClick", [E_OpenGrade.ACTION]);
		}
		/**打开排行榜 */
		private Btn_clickrank() {
			UIManager.Instance.CreateUI("RankView", [ViewUpRoot, 3, 9]);
		}

		private Btn_clickreward(){
			UIManager.Instance.CreateUI("WroldBossRewardView", [ViewUpRoot]);
		}

		/**挑战按钮的点击事件 */
		private Btn_clickchallenge() {
			WroldBossLogic.Instance.Fight();
		}

		private Destroy() {
			if (this._monsterAin) {
				this._monsterAin.Destroy();
				this._monsterAin = null;
			}
				this.offAll();
		}
	}
}