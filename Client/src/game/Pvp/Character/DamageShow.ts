/**
* name 
*/
module H52D_Framework {
	export class DamageShow {
		private LogUI: TextNameView = null;
		constructor() {
			this.LogUI = new TextNameView()
			ViewToppestRoot.addChild(this.LogUI);
			this.LogUI.visible = false;
			Laya.stage.on(Laya.Event.KEY_DOWN,this,this.KeyDownHander);
		}

		private static instance: DamageShow = null;

		public static get Instance() {
			if (this.instance == null) {
				this.instance = new DamageShow();
			}
			return this.instance;
		}

		public SetText(parame) {
			this.LogUI.SetLog(parame);
		}

		public _Cler() {
			this.LogUI._Cler();
		}

		private KeyDownHander(key: Laya.Event) {
			switch (key.keyCode) {
				case Laya.Keyboard.P:
					this.LogUI.visible = !this.LogUI.visible;
					BattlefieldManager.Instance.GMTools_AttrShow();
					break;
			}
		}

	}
}