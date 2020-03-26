var H52D_Framework;
(function (H52D_Framework) {
    var ChatLogic = /** @class */ (function () {
        function ChatLogic() {
            //频道消息记录
            this._chatViewLines = {};
            //各频道消息条数限制
            this._chatLinesLimit = {};
            //读取各频道的发言CD
            this._chatTimeCD = {};
            //各频道最新的发言时间
            this._chatTime = {};
            //切换频道时记录输入的内容
            this._channelChatMsg = {};
            //当前选中的频道
            this._curChannel = E_ChatChannel.C_WORLD;
            //记录各频道是否有新消息，有：1 无：0
            this._newMsgOrder = {};
            //发言字数限制
            this._letterNumLimit = 0;
            //红点
            this._worldChat = false;
            this._campChat = false;
            /** 表情列表 */
            this.FaceList = [];
        }
        Object.defineProperty(ChatLogic, "Inst", {
            get: function () {
                if (ChatLogic._inst == null)
                    ChatLogic._inst = new ChatLogic();
                return ChatLogic._inst;
            },
            enumerable: true,
            configurable: true
        });
        ChatLogic.prototype.Initialize = function () {
            //接收服务器返回的好友信息            
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_SendChatMsg", this);
            this.FaceList = [[]];
            var flag = 0;
            var num = 50;
            if (H52D_Framework.IsNotBaiDuSdk()) {
                num = 23;
            }
            for (var idx = 1; idx <= num; idx++) {
                if (this.FaceList[flag].length == 30) {
                    flag += 1;
                    this.FaceList[flag] = [];
                }
                this.FaceList[flag].push(idx);
            }
            //初始化各频道 限制条数 限制时间 最新发言时间
            for (var index = 0; index < E_ChatChannel.C_CNUM - 1; index++) {
                //初始为0，各频道都没有新消息
                this._newMsgOrder[index] = 0;
                //频道消息记录
                this._chatViewLines[index] = [];
                //切换频道时记录输入的内容
                this._channelChatMsg[index] = "";
                //各频道消息条数限制
                this._chatLinesLimit[index] = 20; //配置表
                //读取各频道的发言CD
                this._chatTimeCD[index] = H52D_Framework.GameParamConfig["worldchanneltime"]; //配置表
                //各频道最新的发言时间
                this._chatTime[index] = 0;
            }
            this._letterNumLimit = 25; //配置表
        };
        ChatLogic.prototype.C_SendChatMsg = function (buf) {
            if (H52D_Framework.MasterPlayer.Instance.player.CunstLevel <= H52D_Framework.OpenGradeConfig[8].Checkpoint) {
                return;
            }
            if (buf[1][3] != H52D_Framework.MasterPlayer.Instance.player.ID) {
                if (H52D_Framework.UIManager.Instance.IsHave("ChatView", H52D_Framework.ViewUpRoot) && this._curChannel == buf[0]) {
                }
                else {
                    this._newMsgOrder[buf[0]] = 1;
                }
            }
            this._curChannel = buf[0];
            this.SaveMsg(buf);
            H52D_Framework.Event.DispatchEvent("UpdateAllPannelEvent", buf[0]);
        };
        Object.defineProperty(ChatLogic.prototype, "newMsg", {
            get: function () {
                for (var index = 0; index < E_ChatChannel.C_CNUM - 1; index++) {
                    if (this._newMsgOrder[index] > 0) {
                        return true;
                    }
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        ChatLogic.prototype.GetNewMsgOrder = function () {
            return this._newMsgOrder;
        };
        Object.defineProperty(ChatLogic.prototype, "factionChat", {
            get: function () {
                return this._worldChat;
            },
            set: function (val) {
                this._worldChat = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChatLogic.prototype, "privateChat", {
            get: function () {
                return this._campChat;
            },
            set: function (val) {
                this._campChat = val;
            },
            enumerable: true,
            configurable: true
        });
        ChatLogic.prototype.GetChatLineNum = function (channel) {
            return this._chatLinesLimit[channel];
        };
        ChatLogic.prototype.SaveMsg = function (buf) {
            if (buf[0] == E_ChatChannel.C_WORLD) {
                var arr = this._chatViewLines[buf[0]];
                var data = new H52D_Framework.ChatData();
                data.channel = buf[0];
                data.smallChannel = buf[0];
                data.roleID = buf[1][3];
                data.msg = buf[1][2];
                data.time = H52D_Framework.FormatTime();
                data.headId = buf[1][5];
                data.strName = buf[1][1];
                data.campID = buf[1][4];
                data.vipLevel = buf[1][6];
                if (arr.length >= this._chatLinesLimit[data.channel]) {
                    arr.shift();
                }
                //根据 频道 存信息，每一条信息是一个obj，obj中对应发言人ID
                arr.push(data);
            }
            else if (buf[0] == E_ChatChannel.C_CAMP) {
                //存到阵营频道
                var arr = this._chatViewLines[buf[0]];
                var data = new H52D_Framework.ChatData();
                data.channel = buf[0];
                data.smallChannel = buf[0];
                data.roleID = buf[1][3];
                data.msg = buf[1][2];
                data.time = H52D_Framework.FormatTime();
                data.headId = buf[1][5];
                data.strName = buf[1][1];
                data.campID = buf[1][4];
                data.vipLevel = buf[1][6];
                if (arr.length >= this._chatLinesLimit[data.channel]) {
                    arr.shift();
                }
                //根据 频道 存信息，每一条信息是一个obj，obj中对应发言人ID
                arr.push(data);
                //也存到世界频道
                var arr1 = this._chatViewLines[E_ChatChannel.C_WORLD];
                var data1 = new H52D_Framework.ChatData();
                data1.channel = E_ChatChannel.C_WORLD;
                data1.smallChannel = buf[0];
                data1.roleID = buf[1][3];
                data1.msg = buf[1][2];
                data1.time = H52D_Framework.FormatTime();
                data1.headId = buf[1][5];
                data1.strName = buf[1][1];
                data1.campID = buf[1][4];
                data1.vipLevel = buf[1][6];
                if (arr1.length >= this._chatLinesLimit[data1.channel]) {
                    arr1.shift();
                }
                //根据 频道 存信息，每一条信息是一个obj，obj中对应发言人ID
                arr1.push(data1);
            }
            else if (buf[0] == E_ChatChannel.C_SYSTEM) {
                //存到世界频道
                var arr1 = this._chatViewLines[E_ChatChannel.C_WORLD];
                var data1 = new H52D_Framework.ChatData();
                data1.channel = E_ChatChannel.C_WORLD;
                data1.smallChannel = E_ChatChannel.C_SYSTEM;
                data1.roleID = buf[1][3];
                data1.msg = buf[1][2];
                data1.time = H52D_Framework.FormatTime();
                data1.headId = buf[1][5];
                data1.strName = buf[1][1];
                data1.campID = buf[1][4];
                data1.vipLevel = buf[1][6];
                if (arr1.length >= this._chatLinesLimit[data1.channel]) {
                    arr1.shift();
                }
                //根据 频道 存信息，每一条信息是一个obj，obj中对应发言人ID
                arr1.push(data1);
            }
        };
        ChatLogic.prototype.GetChatMsg = function (channel) {
            return this._chatViewLines[channel];
        };
        ChatLogic.prototype.SetCurChannel = function (channel) {
            this._curChannel = channel;
        };
        ChatLogic.prototype.GetCurChannel = function () {
            if (this._newMsgOrder[E_ChatChannel.C_WORLD] == 1 && this._newMsgOrder[E_ChatChannel.C_CAMP] == 1) {
                this._curChannel = E_ChatChannel.C_WORLD;
                return this._curChannel;
            }
            if (this._newMsgOrder[E_ChatChannel.C_WORLD] == 0 && this._newMsgOrder[E_ChatChannel.C_CAMP] == 0) {
                this._curChannel = E_ChatChannel.C_WORLD;
                return this._curChannel;
            }
            if (this._newMsgOrder[E_ChatChannel.C_WORLD] == 1) {
                this._curChannel = E_ChatChannel.C_WORLD;
                return this._curChannel;
            }
            if (this._newMsgOrder[E_ChatChannel.C_CAMP] == 1) {
                this._curChannel = E_ChatChannel.C_CAMP;
                return this._curChannel;
            }
            this._curChannel = E_ChatChannel.C_WORLD;
            return this._curChannel;
        };
        //点击Tab后，此页签新消息清0
        ChatLogic.prototype.SetNewMsgOrder = function (channel) {
            this._newMsgOrder[channel] = 0;
        };
        //保存频道最新的发言时间
        ChatLogic.prototype.SaveChatTime = function (channel) {
            var nowDate = new Date();
            var timeSeconds = (nowDate.getDate() * 24 * 60 + nowDate.getHours() * 60 + nowDate.getMinutes()) * 60 + nowDate.getSeconds();
            this._chatTime[channel] = timeSeconds;
        };
        ChatLogic.prototype.GetChatTime = function (channel) {
            return this._chatTime[channel];
        };
        ChatLogic.prototype.GetLetterNumLimit = function () {
            return this._letterNumLimit;
        };
        ChatLogic.prototype.SaveChannelChatMsg = function (channel, msg) {
            this._channelChatMsg[channel] = msg;
        };
        ChatLogic.prototype.GetChannelChatMsg = function (channel) {
            return this._channelChatMsg[channel];
        };
        /** 获取匹配后的聊天内容 **/
        ChatLogic.prototype.OnGetChatInfo = function (chatInfo) {
            //获取输入文本框(聊天单条内容)的文本内容
            var chatStr = chatInfo;
            var icon = "i_f";
            var num = 50;
            if (H52D_Framework.IsNotBaiDuSdk()) {
                icon = "face";
                num = 23;
            }
            if (!chatInfo)
                return "";
            //为聊天内容进行图片匹配：全局搜索图片类型字符串，替换为img标签  
            for (var idx = 1; idx <= num; idx++) {
                var flag = new RegExp("@" + idx + "@", "g");
                chatStr = chatStr.replace(flag, "<img src='ui_chat/" + icon + idx + ".png' width='45px' height='45px'></img>");
            }
            //返回匹配后的聊天内容
            return chatStr.toString();
        };
        ChatLogic.prototype.GMCommondMsg = function (chatStr) {
            var tabMsg = this.CheckGMCmd(chatStr);
            if (tabMsg && tabMsg.length > 0) {
                H52D_Framework.RemoteCall.Instance.Send("K_GMCommondMsg", tabMsg);
                return;
            }
        };
        //判断当前是否是GM命令
        ChatLogic.prototype.CheckGMCmd = function (strText) {
            var gmMsg = [];
            if (strText.length > 2) {
                var x = strText.search("@"); //0
                var arg = strText.split(" ");
                for (var index = 1; index < 10000; index++) {
                    var buf = H52D_Framework.GmConfig[index];
                    if (buf == null)
                        return;
                    if ("@" + buf.cmd != arg[0] && index == 999)
                        return;
                    if ("@" + buf.cmd != arg[0])
                        continue;
                    var arg1 = arg[0].substring(1, arg[0].length).toLocaleLowerCase();
                    if (arg1 == buf.cmd) {
                        gmMsg.push(Number(buf.id));
                        break;
                    }
                }
                for (var i = 1; i < arg.length; i++) {
                    gmMsg.push(Number(arg[i]));
                }
            }
            return gmMsg;
        };
        return ChatLogic;
    }());
    H52D_Framework.ChatLogic = ChatLogic;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ChatLogic.js.map