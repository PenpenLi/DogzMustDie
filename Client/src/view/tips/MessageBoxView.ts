/**
 * 通用MessageBox
 */
module H52D_Framework {
    AddViewResource("MessageBoxView",
        [
            { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_sign.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS }

        ]);
    export class MessageBoxView extends ui.tips.MessageBoxViewUI {
        private _okCallBack: Laya.Handler = null;
        private _cancelCallBack: Laya.Handler = null;
        private _closeTime: number = 0;
        constructor(params: any) {
            super();
            let msg = params[1];
            this._okCallBack = params[2];
            this._cancelCallBack = params[3];
            this._closeTime = params[4] != null ? params[4] : 0
            let hight: number = this.msg.height;
            let h: number;
            SetHtmlStyle(this.msg, 35, "#ffffff", "center", true);
            this.OKBtn.on(Laya.Event.CLICK, this, this.OnOKBtnClick);
            this.OKCenterBtn.on(Laya.Event.CLICK, this, this.OnOKBtnClick);
            this.CancelBtn.on(Laya.Event.CLICK, this, this.OnCancelBtnClick);
            //this.close1.on(Laya.Event.CLICK, this, this.OnCancelBtnClick);
            this.closeBtn.on(Laya.Event.CLICK, this, this.OnCancelBtnClick);

            this.on(Laya.Event.REMOVED, this, this.Destroy);
            
            if (typeof (msg) == "string") {
                this.msg.innerHTML = msg;
            }
            else if (typeof (msg) == "number") {
                this.msg.innerHTML = SysPromptConfig[msg].strPromptInfo;
            }            
            h = this.msg.height - hight;
            this.bg.height += h;
            this.CancelBtn.y += h;
            this.OKBtn.y += h;
            this.OKCenterBtn.y += h;
            if (!this._cancelCallBack) {
                this.OKBtn.visible = false;
                this.CancelBtn.visible = false;
                this.OKCenterBtn.visible = true;
            }
            else {
                this.OKBtn.visible = true;
                this.CancelBtn.visible = true;
                this.OKCenterBtn.visible = false;
            }

            if (this._closeTime > 0) {
                this.UpdateTime()
                Tick.Loop(1000, this, this.UpdateTime);
            }
            else {
                this.OKCenterBtn.label = "确 定";
            }
        }

        public UpdateTime() {
            this.OKCenterBtn.label = "确 定" + this._closeTime + "秒"
            this._closeTime--
            if (this._closeTime < 0) {
                this.OnOKBtnClick()
                return
            }
        }

        private Destroy(): void {
            this.offAll();
            Tick.ClearAll(this)
        }

        private OnOKBtnClick(): void {
            SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            if (this._okCallBack) {
                this._okCallBack.run();
                this._okCallBack = null;
            }
            UIManager.Instance.DestroyUI("MessageBoxView", [ViewToppestRoot]);
        }

        private OnCancelBtnClick(): void {
            SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            if (this._cancelCallBack) {
                this._cancelCallBack.run();
                this._cancelCallBack = null;
            }
            UIManager.Instance.DestroyUI("MessageBoxView", [ViewToppestRoot]);
        }
    }
}