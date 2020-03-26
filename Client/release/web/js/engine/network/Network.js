var H52D_Framework;
(function (H52D_Framework) {
    var MESSAGE_HEAD_LENGTH = 2;
    var Network = /** @class */ (function () {
        function Network() {
            this._socket = null;
            this._state = SocketState.NONE;
            this._sequence = 0;
            this._protocolMap = new H52D_Framework.ProtocolMap();
            this._sendBuffer = new Laya.Byte();
            this._recvBuffer = new Laya.Byte();
            this._codeService = new H52D_Framework.CodeService();
        }
        Network.prototype.Close = function () {
            if (this._socket == null)
                return;
            try {
                if (this._socket.connected == true) {
                    this._socket.cleanSocket();
                }
                this._socket.close();
            }
            catch (e) {
                H52D_Framework.Debugger.LogError(e);
            }
            finally {
                this._socket = null;
                this._sequence = 0;
                this.SetSocketState(SocketState.CLOSE);
            }
        };
        Network.prototype.IsConnected = function () {
            return this._state == SocketState.CONNECTED;
        };
        Network.prototype.RegisterProtocol = function (protocolId, handler) {
            this._protocolMap.AddProtocolHandler(protocolId, handler);
        };
        Network.prototype.UnRegisterProtocol = function (protocolId, handler) {
            this._protocolMap.DelProtocolHandler(protocolId, handler);
        };
        Network.prototype.Connect = function (host, port, endian) {
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
            H52D_Framework.Debugger.Log("开始连接到服务器!");
        };
        Network.prototype.Send = function (i_strMsg) {
            var _a, _b;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this._socket == null || !this.IsConnected()) {
                return;
            }
            //消息编码
            var bt;
            if (i_strMsg.indexOf("G_") == 0) {
                bt = (_a = this._codeService).Encode.apply(_a, ["K_Ts", i_strMsg].concat(args));
            }
            else {
                bt = (_b = this._codeService).Encode.apply(_b, [i_strMsg].concat(args));
            }
            bt.length = bt.pos;
            if (bt.length > this._codeService.GetMaxSendBufferSize()) {
                H52D_Framework.Debugger.LogError("消息长度超过" + this._codeService.GetMaxSendBufferSize());
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
        };
        Network.prototype.OnReceive = function (data) {
            if (!(data instanceof ArrayBuffer)) {
                H52D_Framework.Debugger.LogError("接收网络消息类型错误! 消息类型应为ArrayBuffer.");
                return;
            }
            this._recvBuffer.writeArrayBuffer(data);
            this._recvBuffer.pos = 0;
            var args = null, packageDataLen = 0;
            packageDataLen = this._recvBuffer.getInt16();
            if (packageDataLen <= 0) {
                H52D_Framework.Debugger.LogError("数据包长度<=0.");
                return;
            }
            ;
            if (packageDataLen + MESSAGE_HEAD_LENGTH > this._recvBuffer.length) {
                this._recvBuffer.pos = this._recvBuffer.length;
                return;
            }
            var _pos;
            while (true) {
                //解析数据并回调
                args = this._codeService.Decode(this._recvBuffer, packageDataLen);
                //获取消息信息
                var processInfo = this._protocolMap.GetProcessInfo(args[0]);
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
                }
                ;
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
            var buf = this._recvBuffer.buffer.slice(this._recvBuffer.pos, this._recvBuffer.length);
            this._recvBuffer.clear();
            this._recvBuffer.writeArrayBuffer(buf);
        };
        Network.prototype.OnConnected = function () {
            //这里有几率返回成功、但实际并未连接成功！
            if (this._socket && this._socket.connected) {
                H52D_Framework.Debugger.Log("连接服务器成功！");
                this.SetSocketState(SocketState.CONNECTED);
                H52D_Framework.LoginLogic.Instance.OnConnected();
                H52D_Framework.RemoteCall.Instance.OnReConnecEnd(true);
            }
            else {
                this.SetSocketState(SocketState.CLOSE);
            }
        };
        Network.prototype.OnConnectFail = function () {
            this.SetSocketState(SocketState.CONNECT_FAIL);
            H52D_Framework.LoginLogic.Instance.OnConnectFail();
        };
        Network.prototype.OnDisconnected = function () {
            this.SetSocketState(SocketState.CLOSE);
            H52D_Framework.LoginLogic.Instance.OnDisConnect();
            H52D_Framework.TipsLogic.Instance.OnDisConnect();
        };
        Network.prototype.SetSocketState = function (socketState) {
            var oldState = this._state;
            this._state = socketState;
            if (oldState == SocketState.CONNECTED && socketState == SocketState.CLOSE) {
                this.Close();
            }
        };
        Network.prototype.SendDirect = function (i_SendBuffer) {
            this._socket.send(i_SendBuffer);
        };
        return Network;
    }());
    H52D_Framework.Network = Network;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Network.js.map