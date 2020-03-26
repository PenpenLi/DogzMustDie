module H52D_Framework {
    AddViewResource("LoadingView",
        [
            { url: "res/ui/ui_login.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_noPack/login_background.png", type: Laya.Loader.IMAGE }
        ]);
    export class LoadingView extends ui.loading.LoadingViewUI {
        constructor() {
            super();
            this.backGround.skin = "res/ui/ui_noPack/login_background.png";
            if( IsNotBaiDuSdk( ) ){
                this.logoicon.skin = "ui_login/login_name_fei.png"
            }else{
                this.logoicon.skin = "ui_login/login_name.png"
            }
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            Event.RegistEvent(EventDefine.UPDATE_LOADING_SLIDER_VALUE, Laya.Handler.create(this, this.UpdateLoadingSliderValue));
        }

        private Destroy(): void {
            Event.RemoveEvent(EventDefine.UPDATE_LOADING_SLIDER_VALUE, Laya.Handler.create(this, this.UpdateLoadingSliderValue));
        }

        //进度条长度
        private _progressLen = 596;
        private UpdateLoadingSliderValue(value: number, strInfo?: string): void {
            if (strInfo) {
                this.loadingtxt.text = strInfo;
            }
            this.sliderValue.width = value * this._progressLen;
        }
    }
}