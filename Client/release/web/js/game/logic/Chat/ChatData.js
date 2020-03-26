/**
 * 聊天数据结构
 */
var H52D_Framework;
(function (H52D_Framework) {
    var ChatData = /** @class */ (function () {
        function ChatData() {
        }
        Object.defineProperty(ChatData.prototype, "channel", {
            get: function () {
                return this._channel;
            },
            set: function (val) {
                this._channel = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChatData.prototype, "smallChannel", {
            get: function () {
                return this._smallChannel;
            },
            set: function (val) {
                this._smallChannel = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChatData.prototype, "roleID", {
            get: function () {
                return this._roleID;
            },
            set: function (val) {
                this._roleID = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChatData.prototype, "headId", {
            get: function () {
                return this._headId;
            },
            set: function (val) {
                this._headId = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChatData.prototype, "strName", {
            get: function () {
                return this._strName;
            },
            set: function (val) {
                this._strName = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChatData.prototype, "msg", {
            get: function () {
                return this._msg;
            },
            set: function (val) {
                this._msg = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChatData.prototype, "campID", {
            get: function () {
                return this._campID;
            },
            set: function (val) {
                this._campID = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChatData.prototype, "time", {
            get: function () {
                return this._time;
            },
            set: function (val) {
                this._time = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChatData.prototype, "vipLevel", {
            get: function () {
                return this._vipLevel;
            },
            set: function (val) {
                this._vipLevel = val;
            },
            enumerable: true,
            configurable: true
        });
        return ChatData;
    }());
    H52D_Framework.ChatData = ChatData;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ChatData.js.map