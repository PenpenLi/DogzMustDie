var H52D_Framework;
(function (H52D_Framework) {
    var NoticeLogic = /** @class */ (function () {
        function NoticeLogic() {
            //公告信息容器
            this._noticeMsgArr = [];
        }
        Object.defineProperty(NoticeLogic, "Inst", {
            get: function () {
                if (NoticeLogic._inst == null)
                    NoticeLogic._inst = new NoticeLogic();
                return NoticeLogic._inst;
            },
            enumerable: true,
            configurable: true
        });
        NoticeLogic.prototype.Initialize = function () {
            H52D_Framework.Event.RegistEvent("NoticeEvent", Laya.Handler.create(this, this.NoticeEvent));
        };
        NoticeLogic.prototype.NoticeEvent = function (buf) {
            //系统聊天
            if (buf != "" && buf) {
                // ChatLogic.Inst.SaveMsg(4, -1, buf, "", 1, 0, "", 1);
                H52D_Framework.Event.DispatchEvent("UpdateAllPannelEvent", 7);
                H52D_Framework.Event.DispatchEvent("ChatMsgEvent", [{ 1: 4, 2: "", 3: buf, 4: -1, 5: 0 }]);
            }
            if (buf.search("100181") != -1 || buf.search("100235") != -1) {
                buf = buf.replace("100181", "");
                buf = buf.replace("100235", "");
            }
            buf = buf.split("~")[0];
            this._noticeMsgArr.unshift(buf);
        };
        NoticeLogic.prototype.GetNoticeMsg = function () {
            if (this._noticeMsgArr == null || this._noticeMsgArr.length == 0) {
                return "";
            }
            var msg = this._noticeMsgArr.pop();
            return msg || "";
        };
        return NoticeLogic;
    }());
    H52D_Framework.NoticeLogic = NoticeLogic;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=NoticeLogic.js.map