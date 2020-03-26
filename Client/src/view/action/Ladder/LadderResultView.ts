/**Created by the LayaAirIDE*/
module H52D_Framework {

	AddViewResource("LadderResultView", [
		{ url: "res/ui/ui_ladder.atlas", type: Laya.Loader.ATLAS },
		{ url: "res/ui/ui_icon.atlas", type: Laya.Loader.ATLAS },
	]);
	export class LadderResultView extends ui.action.Ladder.LadderResultViewUI {
		constructor(buf) {
			super();

			this.start_Num = buf[1]
			this._result = buf[2]
			this._resu_item = buf[3]
			this.ViewInit();
		}

		private _result: number;

		private start_Num: number;

		private _resu_item
		private _time: number = 10;
		private ViewInit() {
			this.IsWin(this._result);
			this.ViewEvent();
			this.Setladdresult_list();
			Tick.Loop(1000, this, this.CountDown)
		}

		private IsWin(Id: number) {
			let star_nx = 4 - this.start_Num;
			star_nx = star_nx == 3 ? 1 : star_nx;
			let mins = GameParamConfig.LadderStarData[star_nx][3];
			let min_num = GameParamConfig.VictoryBasicIntegral * mins
			if (Id == 0) {
				this.result_logo_icon.skin = "ui_kicking/img-pingju-pvp.png";
				this.start_num.text = "我方评星:" + this.start_Num + "星";
				this.min_num.text = "积分:0";
			}
			if (Id == 1) {
				this.result_logo_icon.skin = "ui_kicking/img-shengli-pvp.png";
				this.win.visible = true;
				this.StartShow(1, this.start_Num);
				this.start_num.text = "我方评星:" + this.start_Num + "星";
				this.min_num.text = "+" + min_num;
			}
			if (Id == 2) {
				this.result_logo_icon.skin = "ui_kicking/img-shibai-pvp.png";
				this.bg.gray = true;
				this.bg_icon.gray = true;
				this.min_num.text = "-" + min_num;;
				this.start_num.text = "对方评星:" + this.start_Num + "星";
			}

		}

		private ViewEvent() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.btn_receive.on(Laya.Event.CLICK, this, this.Btnclick_close);
		}

		private Setladdresult_list() {
			this.result_list.array = [];

			for (let key in this._resu_item[1]) {
				this.result_list.array.push(key);
			}
			this.result_list.renderHandler = new Laya.Handler(this, this.laddresult_list)
		}

		private laddresult_list(item, index: number) {
			let Id = this.result_list.array[index];
			let ntcfg = ItemConfig[Id]
			let item_bg: Laya.Label = item.getChildByName("item_bg");
			let item_name: Laya.Label = item.getChildByName("item_name")
			let item_num: Laya.Label = item.getChildByName("item_num");
			let item_icon: Laya.Image = item.getChildByName("item_icon");
			let bg_img: Laya.Image = item.getChildByName("bg-img");

			item_num.text = this._resu_item[1][Id];
			if(this._resu_item[1][Id]==1){
				item_num.text= " ";
			}
			item_name.text = GetInfoAttr.Instance.GetText(ntcfg.dwItemName);
			item_name.color = BaseDefine.LabelColor[ntcfg.dwItemQuality];
			item_bg.bgColor = BaseDefine.ItemBgColor[ntcfg.dwItemQuality];
			item_icon.skin = "ui_icon/" + ntcfg.strIconID_B;
		}


		private StartShow(start: number, num: number) {
			let key: number = start;
			this["start_" + key].skin = "ui_kicking/img-shengli-xingxing-pvp.png";
			this["start_" + key].scale(3, 3);
			Laya.Tween.to(this["start_" + key], { scaleX: 1, scaleY: 1 }, 200, null, Laya.Handler.create(this, () => {
				key++;
				if (key <= num) {
					this.StartShow(key, num);
				}
			}))
		}

		private Btnclick_close() {
			CustomsManager.Instance.LeaveCustomsManager();
			BattlefieldManager.Instance.Destroy();
			UIManager.Instance.DestroyUI("LadderResultView", [ViewUpRoot])
			UIManager.Instance.CreateUI("LadderView", [ViewDownRoot]);			
			Event.DispatchEvent("DeputyClose");
			LadderManager.Instance.IsMatching=false;
			LadderManager.Instance.Close_quitView();
			LadderManager.Instance.LadderLvUp_player();
			LadderManager.Instance.Win_alawys();			
		}

		private CountDown() {
			this._time--;
			let str: string = "(" + this._time + "s后自动退出)";
			this.fight_quittime.text = str;
			if (this._time == 0) {
				this.Btnclick_close();
				Tick.Clear(this, this.CountDown);
			}
		}

		private Destroy() {
			this.offAll();
			Tick.Clear(this, this.CountDown);

		}


	}
}