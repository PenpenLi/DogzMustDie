/**
* 微信获取用户授权界面 
*/
module H52D_Framework {
	AddViewResource("GetScopeView",
        [
            { url: "res/ui/ui_login.atlas", type: Laya.Loader.ATLAS }
        ]);
	export class GetScopeView extends ui.login.GetScopeViewUI {
		private _heromod: Avatar;
        private _stareffect: Avatar;
        private _suipianeffect: Avatar;
        private _xingxingmod: Avatar
		constructor() {
			super();
			this.AddEvent();
			this.backGround.skin = "res/ui/ui_noPack/login_background.png";
			if( IsNotBaiDuSdk( ) ){
                this.logoicon.skin = "ui_login/login_name_fei.png";
            }else{
                this.logoicon.skin = "ui_login/login_name.png";
            }

			let nScale = 0.5 
			this._heromod = new Avatar(this.heromod)
            this._heromod.Load("res/player/login_juese/juese.sk", 1, nScale, 0, 0, Laya.Handler.create(this, () => {
                this._heromod.Play("idle", true)
            }))
            this._stareffect = new Avatar(this.stareffect)
            this._stareffect.Load("res/player/login_huoxing/huoxing.sk", 1, nScale, 0, 0, Laya.Handler.create(this, () => {
                this._stareffect.Play("idle", true)
            }))
            this._suipianeffect = new Avatar(this.suipianeffect)
            this._suipianeffect.Load("res/player/login_suipian/suipian.sk", 1, 0.36, 0, 0, Laya.Handler.create(this, () => {
                this._suipianeffect.Play("idle", true)
            }))
            this._xingxingmod = new Avatar(this.xingxingmod)
            this._xingxingmod.Load("res/player/login_gly/login_gly.sk", 1, 0.7, 0, 0, Laya.Handler.create(this, () => {
                this._xingxingmod.Play("idle", true)
            }))
		}

		private AddEvent(): void {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
		}

		private Destroy(): void {
			this.offAll();
            if (this._heromod != null) {
                this._heromod.Destroy()
            }

            if (this._stareffect != null) {
                this._stareffect.Destroy()
            }

            if (this._suipianeffect != null) {
                this._suipianeffect.Destroy()
            }
            if (this._xingxingmod != null) {
                this._xingxingmod.Destroy()
            }
		}
	}
}