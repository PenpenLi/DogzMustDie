module H52D_Framework {
    export class NoticeLogic {
        private static _inst: NoticeLogic;
        public static get Inst() { //单例模式
            if (NoticeLogic._inst == null)
                NoticeLogic._inst = new NoticeLogic();
            return NoticeLogic._inst;
        }

        //公告信息容器
        private _noticeMsgArr: Array<any> = [];

        public Initialize(): void {
            Event.RegistEvent("NoticeEvent", Laya.Handler.create(this, this.NoticeEvent));
        }

        private NoticeEvent(buf: any): void {
            //系统聊天
            if (buf != "" && buf) {
                // ChatLogic.Inst.SaveMsg(4, -1, buf, "", 1, 0, "", 1);
                Event.DispatchEvent("UpdateAllPannelEvent", 7);
                Event.DispatchEvent("ChatMsgEvent", [{ 1: 4, 2: "", 3: buf, 4: -1, 5: 0 }]);
            }
            if (buf.search("100181") != -1 || buf.search("100235") != -1) {
				buf = buf.replace("100181", "");
				buf = buf.replace("100235", "");
            }
            buf = buf.split("~")[0];
            this._noticeMsgArr.unshift(buf);
        }

        public GetNoticeMsg(): string {
            if (this._noticeMsgArr == null || this._noticeMsgArr.length == 0) {
                return "";
            }
            let msg = this._noticeMsgArr.pop();
            return msg || "";
        }
    }
}