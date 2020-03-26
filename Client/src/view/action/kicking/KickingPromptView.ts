module H52D_Framework {
    /**
     * @class：踢馆提示
     * @author：zhangyusong
     */
    export class KickingPromptView extends ui.action.kicking.KickingPromptViewUI {

        private method:Function;
        private args:any;
        private type:Customs_Type;

        public constructor(buf: any) {
            super();
            this.type = buf[1];
            this.method = buf[2];
            this.args = buf[3];
            this.ViewInit();
            this.EventInit();
        }

        private ViewInit() {
            if(this.type == Customs_Type.Kicking){
                this.tx_content.text = SysPromptConfig[30056].strPromptInfo;
            }
            else if(this.type == Customs_Type.Ladder){
                this.tx_content.text = SysPromptConfig[30056].strPromptInfo;
            }
            else if(this.type == Customs_Type.Memory){
                this.tx_content.text = "确定放弃本次挑战？";
            }
        }

        private EventInit() {
            this.btn_close.on(Laya.Event.CLICK, this, this.onCloseHander);
            this.btn_back.on(Laya.Event.CLICK, this, this.onCloseHander);
            this.btn_confirm.on(Laya.Event.CLICK, this, this.onConfirmHander);
        }

        private Destroy() {
        }

        /** 倒计时表现类 */
        private countdown: Countdwon;
        private onCloseHander() {
            UIManager.Instance.DestroyUI("KickingPromptView", [ViewUpRoot]);
        }

        /** 确定事件 */
        private onConfirmHander(){
            this.method(...this.args);
            UIManager.Instance.DestroyUI("KickingPromptView", [ViewUpRoot]);
        }

    }
}