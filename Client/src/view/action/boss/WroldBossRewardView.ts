/**Created by the LayaAirIDE*/
module H52D_Framework {
	AddViewResource("WroldBossRewardView",
		[
			{ url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },

		]);

	export class WroldBossRewardView extends ui.action.boss.WroldBossRewardViewUI {
		constructor() {
			super();

			this.ViewInit();
		}

		private AddEvent() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.Btn_close.on(Laya.Event.CLICK, this, this.Btn_clickclose);
		}

		private ViewInit() {
			this.AddEvent();
			this.ReshHandler();
			this.reward_list.vScrollBarSkin = "";
		}

		private Colors = {
			0: "#ffe67b",
			1: "#ffe67b"
		}

		private StrokColors = {
			0: "#ffe67b",
			1: "#de6115",
		}

		private ReshHandler() {
			WroldBossLogic.Instance.Reward_List = [];
			this.reward_list.array = WroldBossLogic.Instance.Reward_num();
			this.reward_list.renderHandler = new Laya.Handler(this, this.Handler);
		}

		private Handler(item, index: number) {
			let _Id = this.reward_list.array[index];
			let _Info = GameParamConfig.WorldBossReward[_Id];
			let reward = RewardConfig[_Info[2]].reWrad;
			let _next_Info = GameParamConfig.WorldBossReward[_Id + 1];
			let rank_num: Laya.Text = item.getChildByName("rankNum");
			rank_num.strokeColor = this.StrokColors[index];
			rank_num.color = this.Colors[index];
			let str = "";
			if (!_next_Info) {
				str = _Info[1] + "及以后";
				rank_num.fontSize = 20;
			} else {
				str = (_Info[1] + "-" + (_next_Info[1] - 1));
				rank_num.fontSize = 26;
				if (_Id == 1) {
					str = _Info[1];
				}
			}
			let bg: Laya.Image = item.getChildByName("reward_bg");//

			rank_num.changeText(str);
			for (let key in reward) {
				let icon_bg: Laya.Image = item.getChildByName("reward_icon_bg" + key);
				let icon: Laya.Image = icon_bg.getChildByName("reward_icon") as Laya.Image;
				let num: Laya.Label = icon_bg.getChildByName("rew_num") as Laya.Label;
				let name: Laya.Label = icon_bg.getChildByName("rew_name") as Laya.Label;
				let Item_Info = reward[key];
				let path = WroldBossLogic.Instance.Item_Info(Item_Info[1], Item_Info[2]);
				num.text = Item_Info[3];
				icon_bg.skin = path[1];
				icon.skin = path[0];
				name.text = path[2];
				name.color = path[3];
				if (Item_Info[3] == 1) {
					num.text = "";
				}
			}

		}

		private Btn_clickclose() {
			UIManager.Instance.DestroyUI("WroldBossRewardView", [ViewUpRoot]);
		}

		private Destroy() {
			this.offAll();
		}
	}
}