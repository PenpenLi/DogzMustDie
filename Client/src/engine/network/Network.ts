module H52D_Framework {
    const MESSAGE_HEAD_LENGTH: number = 2;
    export class Network {
        private _host: string;
        private _port: number;
        private _protocolMap: ProtocolMap;
        private _sendBuffer: Laya.Byte;
        private _recvBuffer: Laya.Byte;
        private _socket: Laya.Socket = null;
        private _state: SocketState = SocketState.NONE;
        private _endian: string;
        private _sequence: number = 0;
        private _codeService: CodeService;

        constructor() {
            this._protocolMap = new ProtocolMap();
            this._sendBuffer = new Laya.Byte();
            this._recvBuffer = new Laya.Byte();
            this._codeService = new CodeService();
        }

        public Close(): void {
            if (this._socket == null) return;
            try {
                if (this._socket.connected == true) {
                    this._socket.cleanSocket();
                }
                this._socket.close();
            }
            catch (e) {
                Debugger.LogError(e);
            }
            finally {
                this._socket = null;
                this._sequence = 0;
                this.SetSocketState(SocketState.CLOSE);
            }
        }

        public IsConnected(): boolean {
            return this._state == SocketState.CONNECTED;
        }

        public RegisterProtocol(protocolId: string, handler: Laya.Handler): void {
            this._protocolMap.AddProtocolHandler(protocolId, handler);
        }

        public UnRegisterProtocol(protocolId: string, handler: Laya.Handler): void {
            this._protocolMap.DelProtocolHandler(protocolId, handler);
        }

        public Connect(host: string, port: number, endian: string): void {
            this._host = host;
            this._port = port;
            this._endian = endian;
            this._sendBuffer.endian = this._endian;
            this._recvBuffer.endian = this._endian;
            if (this._socket) {
                this.OnDisconnected();
            }
            this._socket = new Laya.Socket();
            this._socket.on(Laya.Event.OPEN, this, this.OnConnected);
            this._socket.on(Laya.Event.ERROR, this, this.OnConnectFail);
            this._socket.on(Laya.Event.CLOSE, this, this.OnDisconnected);
            this._socket.on(Laya.Event.MESSAGE, this, this.OnReceive);
            if (host.indexOf("ws://") != -1 || host.indexOf("wss://") != -1) {
                this._socket.connectByUrl(host + ":" + port);
            }
            else {
                this._socket.connect(host, port);
            }
            this.SetSocketState(SocketState.CONNECTING);
            Debugger.Log("开始连接到服务器!");
        }

        public Send(i_strMsg: string, ...args): void {
            if (this._socket == null || !this.IsConnected()) {
                return;
            }

            //消息编码
            let bt;
            if (i_strMsg.indexOf("G_") == 0) {
                bt = this._codeService.Encode("K_Ts", i_strMsg, ...args);
            }
            else {
                bt = this._codeService.Encode(i_strMsg, ...args);
            }
            bt.length = bt.pos;
            if (bt.length > this._codeService.GetMaxSendBufferSize()) {
                Debugger.LogError("消息长度超过" + this._codeService.GetMaxSendBufferSize());
                return;
            }

            //消息包
            this._sendBuffer.clear();
            this._sendBuffer.writeUint16(bt.length + 1);
            this._sendBuffer.writeUint8(this._sequence);
            this._sendBuffer.writeArrayBuffer(bt.buffer);

            //设置消息队列码
            if (++this._sequence >= 256) {
                this._sequence = 0;
            }

            //发送
            this._socket.send(this._sendBuffer.buffer);
        }

        private OnReceive(data: ArrayBuffer): void {

            if (!(data instanceof ArrayBuffer)) {
                Debugger.LogError("接收网络消息类型错误! 消息类型应为ArrayBuffer.");
                return;
            }
            this._recvBuffer.writeArrayBuffer(data);
            this._recvBuffer.pos = 0;

            let args = null, packageDataLen = 0;
            packageDataLen = this._recvBuffer.getInt16();
            if (packageDataLen <= 0) { Debugger.LogError("数据包长度<=0."); return; };

            if (packageDataLen + MESSAGE_HEAD_LENGTH > this._recvBuffer.length) {
                this._recvBuffer.pos = this._recvBuffer.length;
                return;
            }

            let _pos;
            while (true) {
                //解析数据并回调
                args = this._codeService.Decode(this._recvBuffer, packageDataLen);
                //获取消息信息
                let processInfo: ProcessInfo = this._protocolMap.GetProcessInfo(args[0]);
                if (processInfo == null) {
                    //Debugger.LogError("协议没解析, processInfo is null:" + [args].shift());
                    //return;
                }
                else {
                    //解析数据
                    processInfo.protoBuf.GetData(args);
                    //向游戏内分发消息事件
                    processInfo.Dispatch();
                }

                //判断是否可继续读取
                if (this._recvBuffer.pos + MESSAGE_HEAD_LENGTH >= this._recvBuffer.length) {
                    break;
                };
                _pos = this._recvBuffer.pos;
                packageDataLen = this._recvBuffer.getInt16();
                if (packageDataLen > this._recvBuffer.length - this._recvBuffer.pos) {
                    this._recvBuffer.pos = _pos;
                    break;
                }
            }

            if (!this._socket) {
                return;
            }
            //数据解析完毕，清理客户端数据缓冲区
            this._socket.input.clear();

            //解决本次收到的数据内容多出的部分进行缓存
            let buf = this._recvBuffer.buffer.slice(this._recvBuffer.pos, this._recvBuffer.length);
            this._recvBuffer.clear();
            this._recvBuffer.writeArrayBuffer(buf);
        }

        private OnConnected(): void {
            //这里有几率返回成功、但实际并未连接成功！
            if (this._socket && this._socket.connected) {
                Debugger.Log("连接服务器成功！");
                this.SetSocketState(SocketState.CONNECTED);
                LoginLogic.Instance.OnConnected();
                RemoteCall.Instance.OnReConnecEnd(true);
            }
            else {
                this.SetSocketState(SocketState.CLOSE);
            }
        }

        private OnConnectFail(): void {
            this.SetSocketState(SocketState.CONNECT_FAIL);
            LoginLogic.Instance.OnConnectFail();
        }

        private OnDisconnected(): void {
            this.SetSocketState(SocketState.CLOSE);
            LoginLogic.Instance.OnDisConnect();
            TipsLogic.Instance.OnDisConnect();
        }

        private SetSocketState(socketState: SocketState): void {
            let oldState: SocketState = this._state;
            this._state = socketState;
            if (oldState == SocketState.CONNECTED && socketState == SocketState.CLOSE) {
                this.Close();
            }
        }

        public SendDirect(i_SendBuffer: ArrayBuffer) {
            this._socket.send(i_SendBuffer);
        }
    }
}