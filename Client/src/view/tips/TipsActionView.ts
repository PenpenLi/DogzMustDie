/**Created by the LayaAirIDE*/
module H52D_Framework {
	AddViewResource("TipsActionView",[
			{ url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS }
		]);
	export class TipsActionView extends ui.tips.TipsActionViewUI {

		public constructor(info: any) {
			super();
			let tname = info[1];
			let content = info[2];
			this.txt_name.text = tname;

			let element:Laya.HTMLDivElement = CreateHTMLDivElement(492,305,50,64);
			SetHtmlStyle(element, 21, "#47474b", "left",true);
			element.innerHTML = content;
			this.contentbg.addChild(element);
			this.btn_close.on(Laya.Event.CLICK, this, this.ClickHander);
		}

		private ClickHander() {
			UIManager.Instance.DestroyUI("TipsActionView", [ViewToppestRoot]);
			//播放点击按钮音效
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
		}
	}
}