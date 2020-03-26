module H52D_Framework {
    AddViewResource("JoinMatchTipView",
        [
            { url: "res/ui/ui_common.atlas", type: Laya.Loader.ATLAS },
        ]);
    export class JoinMatchTipView extends ui.action.match.JoinMatchTipViewUI {
        constructor(buf:any) {
            super();
            this.ViewInfo();
            this.AddEvent();
            this._stage=buf[1];
            this._group=buf[2];
            this._playerName1=buf[3];
            this._playerName2=buf[4];
        }
        private _time: number = 10;
        private _stage;
        private _group;
        private _playerName1;
        private _playerName2;

        private AddEvent() {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.Btn_close.on(Laya.Event.CLICK, this, this.Btn_clickclose);
            this.Btn_cancel.on(Laya.Event.CLICK, this, this.Btn_clickclose);
            this.Btn_sure.on(Laya.Event.CLICK, this, this.WatchMatch);
        }

        private Destroy() {
            this.offAll();
            Tick.Clear(this, this.TimeFrame);
        }
        private ViewInfo() {
            this.say.text = "是否参加" + MatchLogic.Instance.currentTypeNum + "强决赛";
            Tick.Loop(100, this, this.TimeFrame);
        }

        private TimeFrame(time: number) {
            this._time -= 0.1;
            this.Quit_time.text = "自动退出倒计时(" + Math.floor(this._time) + ")";
            if (this._time <= 0) {
                this.Btn_clickclose();
            }
        }

        private WatchMatch() {
            MatchLogic.Instance.K_ReqWatchLeague(this._stage, this._group, this._playerName1, this._playerName2);
            this.Btn_clickclose();
        }

        private Btn_clickclose() {
            UIManager.Instance.DestroyUI(this.name, [this.parent]);
        }
    }
}