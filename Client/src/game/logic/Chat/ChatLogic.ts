module H52D_Framework {

    export class ChatLogic {
        private static _inst: ChatLogic;
        //频道消息记录
        private _chatViewLines: { [index: number]: Array<ChatData> } = {};
        //各频道消息条数限制
        private _chatLinesLimit: { [index: number]: number } = {};
        //读取各频道的发言CD
        private _chatTimeCD: { [index: number]: number } = {};
        //各频道最新的发言时间
        private _chatTime: { [index: number]: number } = {};
        //切换频道时记录输入的内容
        private _channelChatMsg: { [index: number]: string } = {};
        //当前选中的频道
        private _curChannel: number = E_ChatChannel.C_WORLD;
        //记录各频道是否有新消息，有：1 无：0
        private _newMsgOrder: { [index: number]: number } = {};
        //发言字数限制
        private _letterNumLimit: number = 0;
        //红点
        private _worldChat: boolean = false;
        private _campChat: boolean = false;
        /** 表情列表 */
        public FaceList = []

        public static get Inst() { //单例模式
            if (ChatLogic._inst == null)
                ChatLogic._inst = new ChatLogic();
            return ChatLogic._inst;
        }

        public Initialize(): void {
            //接收服务器返回的好友信息            
            RemoteCall.Instance.RegistJXS2CProtocol("C_SendChatMsg", this);

            this.FaceList = [[]]
            let flag = 0
            let num = 50
            if (IsNotBaiDuSdk()) {
                num = 23
            }
            for (let idx = 1; idx <= num; idx++) {
                if (this.FaceList[flag].length == 30) {
                    flag += 1
                    this.FaceList[flag] = []
                }
                this.FaceList[flag].push(idx)
            }

            //初始化各频道 限制条数 限制时间 最新发言时间
            for (let index = 0; index < E_ChatChannel.C_CNUM - 1; index++) {
                //初始为0，各频道都没有新消息
                this._newMsgOrder[index] = 0;
                //频道消息记录
                this._chatViewLines[index] = [];
                //切换频道时记录输入的内容
                this._channelChatMsg[index] = "";
                //各频道消息条数限制
                this._chatLinesLimit[index] = 20;//配置表
                //读取各频道的发言CD
                this._chatTimeCD[index] = GameParamConfig["worldchanneltime"];//配置表
                //各频道最新的发言时间
                this._chatTime[index] = 0;
            }
            this._letterNumLimit = 25;//配置表
        }

        private C_SendChatMsg(buf: any): void {

            if (MasterPlayer.Instance.player.CunstLevel <= OpenGradeConfig[8].Checkpoint) {
                return;
            }

            if (buf[1][3] != MasterPlayer.Instance.player.ID) {
                if (UIManager.Instance.IsHave("ChatView", ViewUpRoot) && this._curChannel == buf[0]) {

                } else {
                    this._newMsgOrder[buf[0]] = 1;
                }
            }
            this._curChannel = buf[0];
            this.SaveMsg(buf);
            Event.DispatchEvent("UpdateAllPannelEvent", buf[0]);
        }

        public get newMsg() {
            for (var index = 0; index < E_ChatChannel.C_CNUM - 1; index++) {
                if (this._newMsgOrder[index] > 0) {
                    return true;
                }
            }
            return false;
        }

        public GetNewMsgOrder(): any {
            return this._newMsgOrder;
        }

        public set factionChat(val: boolean) {
            this._worldChat = val;
        }
        public set privateChat(val: boolean) {
            this._campChat = val;
        }
        public get factionChat(): boolean {
            return this._worldChat;
        }
        public get privateChat(): boolean {
            return this._campChat;
        }

        public GetChatLineNum(channel: number): number {
            return this._chatLinesLimit[channel];
        }
        public SaveMsg(buf: any) {
            if (buf[0] == E_ChatChannel.C_WORLD) {
                let arr: Array<any> = this._chatViewLines[buf[0]];
                let data: ChatData = new ChatData();
                data.channel = buf[0];
                data.smallChannel = buf[0];
                data.roleID = buf[1][3];
                data.msg = buf[1][2];
                data.time = FormatTime();
                data.headId = buf[1][5];
                data.strName = buf[1][1];
                data.campID = buf[1][4];
                data.vipLevel = buf[1][6];
                if (arr.length >= this._chatLinesLimit[data.channel]) {
                    arr.shift();
                }
                //根据 频道 存信息，每一条信息是一个obj，obj中对应发言人ID
                arr.push(data);
            } else if (buf[0] == E_ChatChannel.C_CAMP) {
                //存到阵营频道
                let arr: Array<any> = this._chatViewLines[buf[0]];
                let data: ChatData = new ChatData();
                data.channel = buf[0];
                data.smallChannel = buf[0];
                data.roleID = buf[1][3];
                data.msg = buf[1][2];
                data.time = FormatTime();
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
                let arr1: Array<any> = this._chatViewLines[E_ChatChannel.C_WORLD];
                let data1: ChatData = new ChatData();
                data1.channel = E_ChatChannel.C_WORLD;
                data1.smallChannel = buf[0];
                data1.roleID = buf[1][3];
                data1.msg = buf[1][2];
                data1.time = FormatTime();
                data1.headId = buf[1][5];
                data1.strName = buf[1][1];
                data1.campID = buf[1][4];
                data1.vipLevel = buf[1][6];
                if (arr1.length >= this._chatLinesLimit[data1.channel]) {
                    arr1.shift();
                }
                //根据 频道 存信息，每一条信息是一个obj，obj中对应发言人ID
                arr1.push(data1);
            } else if (buf[0] == E_ChatChannel.C_SYSTEM) {
                //存到世界频道
                let arr1: Array<any> = this._chatViewLines[E_ChatChannel.C_WORLD];
                let data1: ChatData = new ChatData();
                data1.channel = E_ChatChannel.C_WORLD;
                data1.smallChannel = E_ChatChannel.C_SYSTEM;
                data1.roleID = buf[1][3];
                data1.msg = buf[1][2];
                data1.time = FormatTime();
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
        }
        public GetChatMsg(channel: number): Array<any> {
            return this._chatViewLines[channel];
        }


        public SetCurChannel(channel: number): void {
            this._curChannel = channel;
        }
        public GetCurChannel(): number {
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
        }
        //点击Tab后，此页签新消息清0
        public SetNewMsgOrder(channel: number): void {
            this._newMsgOrder[channel] = 0;
        }
        //保存频道最新的发言时间
        public SaveChatTime(channel: number): void {
            let nowDate: Date = new Date();
            let timeSeconds: number = (nowDate.getDate() * 24 * 60 + nowDate.getHours() * 60 + nowDate.getMinutes()) * 60 + nowDate.getSeconds();
            this._chatTime[channel] = timeSeconds;
        }
        public GetChatTime(channel: number): number {
            return this._chatTime[channel];
        }

        public GetLetterNumLimit(): number {
            return this._letterNumLimit;
        }

        public SaveChannelChatMsg(channel: number, msg: string): void {
            this._channelChatMsg[channel] = msg;
        }
        public GetChannelChatMsg(channel: number): string {
            return this._channelChatMsg[channel];
        }

        /** 获取匹配后的聊天内容 **/
        public OnGetChatInfo(chatInfo: string): string {
            //获取输入文本框(聊天单条内容)的文本内容
            let chatStr: string = chatInfo;
            let icon = "i_f"
            let num = 50
            if (IsNotBaiDuSdk()) {
                icon = "face"
                num = 23
            }
            if (!chatInfo) return "";
            //为聊天内容进行图片匹配：全局搜索图片类型字符串，替换为img标签  
            for (let idx = 1; idx <= num; idx++) {
                let flag = new RegExp("@" + idx + "@", "g")
                chatStr = chatStr.replace(flag, "<img src='ui_chat/" + icon + idx + ".png' width='45px' height='45px'></img>")
            }
            //返回匹配后的聊天内容
            return chatStr.toString();
        }

        public GMCommondMsg(chatStr: string): void {
            let tabMsg = this.CheckGMCmd(chatStr);
            if (tabMsg && tabMsg.length > 0) {
                RemoteCall.Instance.Send("K_GMCommondMsg", tabMsg);
                return;
            }
        }

        //判断当前是否是GM命令
        private CheckGMCmd(strText: string): Array<any> {
            let gmMsg: Array<any> = [];
            if (strText.length > 2) {
                let x = strText.search("@");//0
                let arg = strText.split(" ");
                for (let index = 1; index < 10000; index++) {
                    let buf: any = GmConfig[index];
                    if (buf == null) return;
                    if ("@" + buf.cmd != arg[0] && index == 999) return;
                    if ("@" + buf.cmd != arg[0]) continue;
                    let arg1 = arg[0].substring(1, arg[0].length).toLocaleLowerCase();
                    if (arg1 == buf.cmd) {
                        gmMsg.push(Number(buf.id));
                        break;
                    }
                }
                for (let i = 1; i < arg.length; i++) {
                    gmMsg.push(Number(arg[i]));
                }
            }
            return gmMsg;
        }


    }
}