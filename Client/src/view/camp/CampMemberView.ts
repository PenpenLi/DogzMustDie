/**Created by the LayaAirIDE*/
module H52D_Framework {
	AddViewResource("CampMemberView",
		[
			{ url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
		]);

	/**成员列表 */
	export class CampMemberView extends ui.camp.CampMemberViewUI {
		private camp_ID;
		constructor(buf) {
			super();
			this.camp_ID = buf[1];
			this.AddEvent();
			this.Init();
			this.arrow_up.visible = false;
			this.arrow_down.visible = false;
		}

		private Camp_play: Array<number> = [];
		private Camp_playInfo: { [id: number]: Player } = {};

		private AddEvent() {
			//Event.RegistEvent("GetplayInfo", Laya.Handler.create(this, this.SetPlayInfo));
			this.Btn_close.on(Laya.Event.CLICK, this, this.Btn_CloseClick);
			this.background_label.on(Laya.Event.CLICK, this, this.Btn_CloseClick);
			this.arrow_down.on(Laya.Event.CLICK, this, this.Move_List, [10]);
			this.arrow_up.on(Laya.Event.CLICK, this, this.Move_List, [-10]);
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.Refresh();
		}

		private Init() {
			this.SetPlayInfo();
			//this.Updatelist();
		}

		/** */
		private SetPlayInfo() {
			for (let nIdx in CampManager.Instance.Camp_PlayInfO) {
				this.Camp_play.push(Number(nIdx));
			}
			this.Camp_playInfo = CampManager.Instance.Camp_PlayInfO;
			this.Updatelist();
		}

		private Destroy() {
			this.offAll();
			//Event.RemoveEvent("GetplayInfo", Laya.Handler.create(this, this.SetPlayInfo));			
		}

		private Updatelist() {
			this.arrow_down.visible = false;
			if (this.Camp_play.length > 8) {
				this.arrow_down.visible = true;
				this.Camp_playlist.vScrollBarSkin = "";
			}
			//this.Camp_playlist.repeatY = this.Camp_play.length;					
			this.Camp_playlist.array = this.Camp_play;
			this.Camp_playlist.renderHandler = new Laya.Handler(this, this.Camp_PlayList);
		}

		private Camp_PlayList(item, index: number) {
			if (index < this.Camp_play.length) {
				index += 1;
			}
			//this.Camp_playlist.scrollBar.stopScroll();
			let play = this.Camp_playInfo[index];
			//需要从这个阵营信息中拿到所有玩家信息  然后按照索引 id取出玩家
			let rank_num: Laya.Image = item.getChildByName("Rank_Num");//rankNum
			let play_name: Laya.Label = item.getChildByName("play_Name");
			let ranknum: Laya.Label = item.getChildByName("rankNum");
			let play_donate: Laya.Label = item.getChildByName("play_Donate");//捐献   
			let play_customs: Laya.Label = item.getChildByName("play_Customs");//关卡    background_img
			let play_info: Laya.Label = item.getChildByName("background_label");
			if (index <= 3) {
				rank_num.skin = "ui_rank/img-" + index + "-paiming.png"
				ranknum.visible = false;
				rank_num.visible = true
			}
			else {
				ranknum.text = index + "";
				ranknum.visible = true;
				rank_num.visible = false;
			}
			play_name.text = play[3];
			if (play[4] > 10000) {
				play_customs.text = play[4] - 10000 + "";
			}
			else {
				play_customs.text = play[4]
			}
			play_donate.text = play[5];//捐献
			this.camp_name.text = MasterPlayer.Instance.player.Name;
			if (play[3] == MasterPlayer.Instance.player.Name) {
				this.my_rank.text = index + "名";
				this.play_Donate.text = play[5];
				this.play_su.text = play_customs.text
			}
			if (this.camp_ID != MasterPlayer.Instance.player.CampID) {
				this.my_rank.text = "未加入";
				this.play_Donate.text = "";
				this.play_su.text = "";
			}
			play_info.on(Laya.Event.CLICK, this, this.OpenView, [play[1]]);
		}

		private Move_List(dis: number) {
			this.Camp_playlist.scrollBar.value += dis * 8.8;;
		}
		/**箭头的显示 隐藏 */
		private Refresh() {
			Tick.FrameLoop(1, this, () => {
				if (!this.Camp_playlist.scrollBar) {
					return
				}
				this.Camp_playlist.scrollBar.changeHandler = Laya.Handler.create(this, (value) => {
					if (value < 10) {
						this.arrow_up.visible = false;
					}
					else {
						this.arrow_up.visible = true;
					}
					if (value > 780) {
						this.arrow_down.visible = false;
					}
					else {
						this.arrow_down.visible = true;
					}
				});
			})
		}

		private Btn_CloseClick() {
			UIManager.Instance.DestroyUI("CampMemberView", [ViewUpRoot]);
		}

		/**打开视图 */
		private OpenView(play_id: number) {
			CampManager.Instance.n_Play(play_id);
			UIManager.Instance.CreateUI("CampPlayInfo", [ViewUpRoot, play_id]);
		}
	}
}