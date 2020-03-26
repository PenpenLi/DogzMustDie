var H52D_Framework;
(function (H52D_Framework) {
    var SHORT_SIZE = 2;
    var RemoteCall = /** @class */ (function () {
        function RemoteCall() {
            //---------------------------------------------------------断线重连------------------------------------------------------------
            /**断线重连次数 */
            this._reConnectNum = 0;
            /**断线重连最大次数 */
            this._reConnectMaxNum = 5;
            /**断线重连第一次重连间隔(毫秒)  */
            this._firstReConnectIntervalTime = 2000;
            /**断线重连间隔时间(毫秒) */
            this._reConnectIntervalTime = 5000;
            /**心跳包超时(毫秒) */
            this._heartBeatOverTime = 14000;
            /**心跳包延时(毫秒) */
            this._heartBeatDelayed = 5000;
            /**重连缓冲时间 */
            this._bufferTime = 1000;
            /**是否正在重连 */
            this._bReConnecting = false;
            this.network = new H52D_Framework.Network();
            this.RegistJXS2CProtocol("C_HeartBeat", this);
        }
        Object.defineProperty(RemoteCall, "Instance", {
            get: function () {
                if (RemoteCall._inst == null)
                    RemoteCall._inst = new RemoteCall();
                return RemoteCall._inst;
            },
            enumerable: true,
            configurable: true
        });
        RemoteCall.prototype.Connect = function (host, port, endian) {
            if (endian == null)
                endian = Laya.Byte.getSystemEndian();
            this.network.Connect(host, port, endian);
        };
        RemoteCall.prototype.Close = function () {
            this.network.Close();
        };
        RemoteCall.prototype.IsConnected = function () {
            return this.network.IsConnected();
        };
        RemoteCall.prototype.RegistJXS2CProtocol = function (protocolId, cls) {
            this.network.RegisterProtocol(protocolId, Laya.Handler.create(cls, cls[protocolId]));
        };
        RemoteCall.prototype.Send = function (i_strMsg) {
            var _a;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            (_a = this.network).Send.apply(_a, [i_strMsg].concat(args));
        };
        //---------------------------------------------------------------
        RemoteCall.prototype.UnPackUpTable = function (reader, tabSize) {
            if (tabSize === void 0) { tabSize = 0; }
            if (tabSize == 0) { //ushort
                tabSize = reader.getUint16();
            }
            var tabEnd = reader.pos + tabSize; //uint
            var luaTab = {};
            while (reader.pos < tabEnd) {
                var tabKV = new Array();
                this.UnPackUp(reader, tabKV);
                this.UnPackUp(reader, tabKV);
                luaTab[tabKV[0]] = tabKV[1];
            }
            return luaTab;
        };
        RemoteCall.prototype.UnPackUpString = function (reader) {
            //读取长度描述为一个字符的string.
            var length = reader.getUint8(); //byte
            var str = "";
            if (length > 0)
                str = reader.readUTFBytes(length); //byte[]
            reader.getUint8(); //byte
            return str;
        };
        RemoteCall.prototype.UnPackUpBigString = function (reader) {
            //读取长度描述为两个字符的string.
            var length = reader.getUint16(); //ushort
            var str = "";
            if (length > 0) {
                str = reader.readUTFBytes(length); //byte[]
            }
            reader.getUint8(); //byte
            return str;
        };
        RemoteCall.prototype.UnPackUp = function (reader, values) {
            var eRet = reader.getByte();
            switch (eRet) {
                case RemoteObjectType.Bool:
                    values.push(reader.getByte());
                    break;
                case RemoteObjectType.UInt8:
                    values.push(reader.getUint8());
                    break;
                case RemoteObjectType.UInt16:
                    values.push(reader.getUint16());
                    break;
                case RemoteObjectType.UInt32:
                    values.push(reader.getUint32());
                    break;
                case RemoteObjectType.Int8:
                    values.push(reader.getByte());
                    break;
                case RemoteObjectType.Int16:
                    values.push(reader.getInt16());
                    break;
                case RemoteObjectType.Int32:
                    values.push(reader.getInt32());
                    break;
                case RemoteObjectType.Float:
                    values.push(reader.getFloat32());
                    break;
                case RemoteObjectType.Double:
                    values.push(reader.getFloat64());
                    break;
                case RemoteObjectType.String:
                    values.push(this.UnPackUpString(reader));
                    break;
                case RemoteObjectType.BigString:
                    values.push(this.UnPackUpBigString(reader));
                    break;
                case RemoteObjectType.UInt64:
                    values.push(reader.getUint32());
                    reader.getUint32();
                    break;
                case RemoteObjectType.DataStream:
                    values.push(this.UnPackUpTable(reader));
                    break;
                case RemoteObjectType.Null:
                    values.push(null);
                    break;
                default:
                    H52D_Framework.Debugger.LogError("RemoteCall UnPackUp Error, type  unsupported, type:" + eRet);
                    eRet = RemoteObjectType.Invalid;
                    break;
            }
        };
        RemoteCall.prototype.UnPackUpAll = function (data) {
            var values = new Array();
            var reader = new Laya.Byte(data);
            reader.endian = Laya.Byte.getSystemEndian();
            while (reader.pos != reader.length) {
                this.UnPackUp(reader, values);
            }
            return values;
        };
        RemoteCall.prototype.PackString = function (writer, src) {
            if (src.length < 256) {
                writer.writeByte(RemoteObjectType.String);
                writer.writeByte(src.length);
                writer.writeUTFBytes(src);
                writer.writeByte(0);
            }
            else if (src.length < 1024) {
                writer.writeByte(RemoteObjectType.BigString);
                writer.writeUTFString(src);
                writer.writeByte(0);
            }
            else {
                return false;
            }
            return true;
        };
        RemoteCall.prototype.PackTable = function (writer, src) {
            var packSize = 0; //ushort
            writer.writeByte(RemoteObjectType.DataStream);
            var beignPos = writer.pos; //long
            writer.writeUint16(packSize);
            var ret = false;
            for (var key in src) {
                if (!this.PackUp(writer, key)) {
                    H52D_Framework.Debugger.LogError("Table WritePack error, WriteKey error");
                    return false;
                }
                if (!this.PackUp(writer, src[key])) {
                    H52D_Framework.Debugger.LogError("Table WritePack error, WriteValue error");
                    return false;
                }
            }
            var endPos = writer.pos; //long
            packSize = endPos - beignPos - SHORT_SIZE; //long
            if (packSize < 0 || packSize >= 0xFFFF) {
                H52D_Framework.Debugger.LogError("RemoteTable WritePack error, pack size error, length:" + packSize);
                return false;
            }
            writer.pos = beignPos;
            writer.writeUint16(packSize);
            writer.pos = endPos;
            return true;
        };
        RemoteCall.prototype.PackUp = function (writer, value) {
            if ("number" == typeof (value)) {
                writer.writeByte(RemoteObjectType.Double);
                writer.writeFloat64(value);
            }
            else if ("string" == typeof (value)) {
                this.PackString(writer, value);
            }
            else if ("boolean" == typeof (value)) {
                H52D_Framework.Debugger.LogError("发送服务端参数不能有bool值,请使用0,1代替");
                writer.writeByte(RemoteObjectType.Bool);
                if (value == true)
                    writer.writeByte(1);
                else
                    writer.writeByte(0);
            }
            else if ("object" == typeof (value)) {
                this.PackTable(writer, value);
            }
            else {
                H52D_Framework.Debugger.LogError("Call Script Has UnSuport Type");
                return false;
            }
            return true;
        };
        RemoteCall.prototype.PackUpAll = function (writer, strFunc, params) {
            //写入remotecall 包头
            var hashCode = GetBKDRHash(strFunc);
            writer.writeByte(RemoteObjectType.UInt32);
            writer.writeUint32(hashCode);
            if (params != null) {
                for (var i = 0; i < params.length; i++) {
                    if (!this.PackUp(writer, params[i]))
                        return false;
                }
            }
            return true;
        };
        RemoteCall.prototype.SendDirect = function (i_SendBuffer) {
            this.network.SendDirect(i_SendBuffer);
        };
        Object.defineProperty(RemoteCall.prototype, "bReConnecting", {
            get: function () {
                return this._bReConnecting;
            },
            enumerable: true,
            configurable: true
        });
        /**开启断线重连 */
        RemoteCall.prototype.OpenReConnect = function () {
            if (!H52D_Framework.MasterPlayer.Instance.bInGame)
                return;
            this.K_HeartBeat();
        };
        /**关闭断线重连、直接踢下线 */
        RemoteCall.prototype.CloseReConnect = function () {
            this._bReConnecting = false;
            H52D_Framework.Tick.Clear(this, this.K_HeartBeat);
            H52D_Framework.Tick.Clear(this, this.OnReConnectBuffer);
            H52D_Framework.Tick.Clear(this, this.OnReConnectStart);
            H52D_Framework.Tick.Clear(this, this.OnReConnectWait);
            // 关闭当前连接
            RemoteCall.Instance.Close();
        };
        /**发送心跳包 */
        RemoteCall.prototype.K_HeartBeat = function () {
            if (this._bReConnecting)
                return;
            RemoteCall.Instance.Send("K_HeartBeat");
            H52D_Framework.Tick.Once(this._heartBeatOverTime, this, this.OnReConnectBuffer);
        };
        /**接收心跳包 */
        RemoteCall.prototype.C_HeartBeat = function () {
            if (this._bReConnecting)
                return;
            H52D_Framework.Tick.Clear(this, this.OnReConnectBuffer);
            H52D_Framework.Tick.Clear(this, this.OnReConnectStart);
            H52D_Framework.Tick.Once(this._heartBeatDelayed, this, this.K_HeartBeat);
        };
        /**重连缓冲 */
        RemoteCall.prototype.OnReConnectBuffer = function () {
            if (this._bReConnecting)
                return;
            H52D_Framework.Tick.Once(this._bufferTime, this, this.OnReConnectStart);
        };
        /**断线重连开始 */
        RemoteCall.prototype.OnReConnectStart = function () {
            var _this = this;
            // 如果当前在loading则不走断线重连，尝试继续发送心跳包
            if (H52D_Framework.UIManager.Instance.IsHave("LoadingView", H52D_Framework.ViewUpRoot)) {
                this.K_HeartBeat();
                return;
            }
            if (this._bReConnecting)
                return;
            this._bReConnecting = true;
            // 关闭当前连接
            RemoteCall.Instance.Close();
            H52D_Framework.UIManager.Instance.CreateUI("ReConnectView", [H52D_Framework.ViewUpRoot]);
            H52D_Framework.Tick.Once(this._firstReConnectIntervalTime, this, function () {
                _this.OnReConnectWait();
                H52D_Framework.Tick.Loop(_this._reConnectIntervalTime, _this, _this.OnReConnectWait);
            });
        };
        /**尝试重连等待 */
        RemoteCall.prototype.OnReConnectWait = function () {
            this._reConnectNum++;
            if (this._reConnectNum > this._reConnectMaxNum) {
                this.OnReConnecEnd(false);
            }
            else {
                H52D_Framework.LoginLogic.Instance.OnReConnect();
            }
        };
        /**断线重连结束 */
        RemoteCall.prototype.OnReConnecEnd = function (bSuccess) {
            this._bReConnecting = false;
            this.OpenReConnect();
            this._reConnectNum = 0;
            H52D_Framework.Tick.Clear(this, this.OnReConnectWait);
            H52D_Framework.Event.DispatchEvent("Event_ReConnectEnd", [bSuccess]);
        };
        return RemoteCall;
    }());
    H52D_Framework.RemoteCall = RemoteCall;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=RemoteCall.js.map