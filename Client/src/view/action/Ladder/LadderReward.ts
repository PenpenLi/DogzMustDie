/**Created by the LayaAirIDE*/
module H52D_Framework {
	AddViewResource("LadderReward", [
		{ url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
		{ url: "res/ui/ui_icon.atlas", type: Laya.Loader.ATLAS },
		{ url: "res/ui/ui_ladder.atlas", type: Laya.Loader.ATLAS },
	]);
	export class LadderReward extends ui.action.Ladder.LadderRewardUI {
		constructor(buf) {
			super();
			this._play_Id = LadderManager.Instance.PlayId = buf[1];
			this._list_arr = [];
			this.ViewInit();

		}

		private _play_Id;
		private _list_arr: Array<number> = [];
		private _list: Laya.Box;
		private _btn: Laya.Button;
		private _box: Laya.Box;
		private _box1: Laya.Box;
		private ViewInit() {
			this.panel.vScrollBarSkin = "";
			this.ViewEVent();
			this.SetLadder_list();
		}

		private ViewEVent() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.Btn_close.on(Laya.Event.CLICK, this, this.Btnclick_close);
			Event.RegistEvent("update_ladderreward", Laya.Handler.create(this, this.SetLadder_list))
		}

		/**初始化 奖励预览界面 */
		private SetLadder_list() {
			this.panel.destroyChildren();
			this.panel.vScrollBar.isVertical = true;//滚动条的方向为垂直滚动
			this.panel.vScrollBar.elasticBackTime = 600;//设置橡皮筋回弹时间
			this.panel.vScrollBar.elasticDistance = 200;//设置橡皮筋回弹距离
			this._list_arr = LadderManager.Instance.getLadderLv();
			LadderManager.Instance.Sort_ladderlist(this._list_arr, this._play_Id);
			this._list_arr = LadderManager.Instance.Ladderreward_arr;
			let firstView: LadderLvRewardLineView = null
			for (let index = 0; index < this._list_arr.length; index++) {
				let n_reward: LadderLvRewardLineView = new LadderLvRewardLineView(this, index);
				if (index == 0) {
					firstView = n_reward
				}
				this.panel.addChild(n_reward);
				n_reward.y = n_reward.height * index;
				n_reward.x = 0;
			}
			firstView.Ladderline_list( )
		}

		private Btnclick_close() {
			UIManager.Instance.DestroyUI("LadderReward", [ViewToppestRoot]);
		}

		private Destroy() {
			this.offAll();
			Event.RemoveEvent("update_ladderreward", Laya.Handler.create(this, this.SetLadder_list))
		}
	}
}
