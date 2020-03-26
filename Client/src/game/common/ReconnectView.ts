/*
* 断线重连;
*/
module H52D_Framework {
    AddViewResource("ReConnectView",
        [
            { url: "res/ui/ui_reconnect.atlas", type: Laya.Loader.ATLAS }
        ]);

    export class ReConnectView extends ui.common.ReConnectViewUI {
        constructor() {
            super();
            this.ReConnectStart();
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            Event.RegistEvent("Event_ReConnectEnd", Laya.Handler.create(this, this.Event_ReConnectEnd));
        }

        /**
         * 重连显示
         * @param num 重连次数
         */
        private ReConnectStart() {
            Tick.Loop(1000, this, () => {
                if (this.desc.text.indexOf("...") != -1) {
                    this.desc.text = "断线重连中.";
                }
                else if (this.desc.text.indexOf("..") != -1) {
                    this.desc.text = "断线重连中...";
                }
                else if (this.desc.text.indexOf(".") != -1) {
                    this.desc.text = "断线重连中..";
                }
            })
        }

        private Event_ReConnectEnd(bSuccess: boolean) {
            Tick.ClearAll(this);
            Event.RemoveEvent("Event_ReConnectEnd", Laya.Handler.create(this, this.Event_ReConnectEnd));
            UIManager.Instance.DestroyUI("ReConnectView", [ViewUpRoot]);
            if (!bSuccess) {
                TipsLogic.Instance.OpenMessageBox("重连失败，请重新登陆！", Laya.Handler.create(this, () => {
                    location.reload();
                }));
            }
        }

        private Destroy() {
            Event.RemoveEvent("Event_ReConnectEnd", Laya.Handler.create(this, this.Event_ReConnectEnd));
        }
    }
}