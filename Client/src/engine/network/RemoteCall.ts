module H52D_Framework {
    const SHORT_SIZE: number = 2;
    export class RemoteCall {
        public network: Network;
        private static _inst: RemoteCall;
        public static get Instance() {
            if (RemoteCall._inst == null)
                RemoteCall._inst = new RemoteCall();
            return RemoteCall._inst;
        }

        constructor() {
            this.network = new Network();
            this.RegistJXS2CProtocol("C_HeartBeat", this);
        }

        public Connect(host: string, port: number, endian?: string): void {
            if (endian == null)
                endian = Laya.Byte.getSystemEndian();
            this.network.Connect(host, port, endian);
        }

        public Close(): void {
            this.network.Close();
        }

        public IsConnected(): boolean {
            return this.network.IsConnected();
        }

        public RegistJXS2CProtocol(protocolId: string, cls: any): void {
            this.network.RegisterProtocol(protocolId, Laya.Handler.create(cls, cls[protocolId]));
        }

        public Send(i_strMsg: any, ...args): void {
            this.network.Send(i_strMsg, ...args);
        }

        //---------------------------------------------------------------
        public UnPackUpTable(reader: Laya.Byte, tabSize: number = 0): Object {
            if (tabSize == 0) { //ushort
                tabSize = reader.getUint16();
            }

            let tabEnd: number = reader.pos + tabSize; //uint
            let luaTab: Object = {};

            while (reader.pos < tabEnd) {
                let tabKV: Array<any> = new Array<any>();
                this.UnPackUp(reader, tabKV);
                this.UnPackUp(reader, tabKV);
                luaTab[tabKV[0]] = tabKV[1];
            }
            return luaTab;
        }

        private UnPackUpString(reader: Laya.Byte): string {
            //读取长度描述为一个字符的string.
            let length: number = reader.getUint8(); //byte
            let str: string = "";
            if (length > 0)
                str = reader.readUTFBytes(length); //byte[]
            reader.getUint8(); //byte
            return str;
        }

        private UnPackUpBigString(reader: Laya.Byte): string {
            //读取长度描述为两个字符的string.
            let length: number = reader.getUint16(); //ushort
            let str: string = "";
            if (length > 0) {
                str = reader.readUTFBytes(length); //byte[]
            }
            reader.getUint8(); //byte
            return str;
        }

        private UnPackUp(reader: Laya.Byte, values: Array<any>): void {
            let eRet: RemoteObjectType = reader.getByte() as RemoteObjectType;
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
                    Debugger.LogError("RemoteCall UnPackUp Error, type  unsupported, type:" + eRet);
                    eRet = RemoteObjectType.Invalid;
                    break;
            }
        }

        public UnPackUpAll(data: Uint8Array): Array<any> {
            let values: Array<any> = new Array<any>();
            let reader: Laya.Byte = new Laya.Byte(data);
            reader.endian = Laya.Byte.getSystemEndian();
            while (reader.pos != reader.length) {
                this.UnPackUp(reader, values);
            }
            return values;
        }

        private PackString(writer: Laya.Byte, src: string): boolean {
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
        }

        private PackTable(writer: Laya.Byte, src: Object): boolean {
            let packSize: number = 0; //ushort
            writer.writeByte(RemoteObjectType.DataStream);
            let beignPos: number = writer.pos; //long
            writer.writeUint16(packSize);

            let ret: boolean = false;
            for (let key in src) {
                if (!this.PackUp(writer, key)) {
                    Debugger.LogError("Table WritePack error, WriteKey error");
                    return false;
                }
                if (!this.PackUp(writer, src[key])) {
                    Debugger.LogError("Table WritePack error, WriteValue error");
                    return false;
                }
            }

            let endPos: number = writer.pos; //long
            packSize = endPos - beignPos - SHORT_SIZE; //long
            if (packSize < 0 || packSize >= 0xFFFF) {
                Debugger.LogError("RemoteTable WritePack error, pack size error, length:" + packSize);
                return false;
            }
            writer.pos = beignPos;
            writer.writeUint16(packSize);
            writer.pos = endPos;

            return true;
        }

        private PackUp(writer: Laya.Byte, value: any): boolean {
            if ("number" == typeof (value)) {
                writer.writeByte(RemoteObjectType.Double);
                writer.writeFloat64(value);
            }
            else if ("string" == typeof (value)) {
                this.PackString(writer, value);
            }
            else if ("boolean" == typeof (value)) {
                Debugger.LogError("发送服务端参数不能有bool值,请使用0,1代替");
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
                Debugger.LogError("Call Script Has UnSuport Type");
                return false;
            }
            return true;
        }

        private PackUpAll(writer: Laya.Byte, strFunc: string, params?: Array<any>): boolean {
            //写入remotecall 包头
            let hashCode: number = GetBKDRHash(strFunc);
            writer.writeByte(RemoteObjectType.UInt32);
            writer.writeUint32(hashCode);
            if (params != null) {
                for (let i: number = 0; i < params.length; i++) {
                    if (!this.PackUp(writer, params[i]))
                        return false;
                }
            }
            return true;
        }

        public SendDirect(i_SendBuffer: ArrayBuffer) {
            this.network.SendDirect(i_SendBuffer);
        }

        //---------------------------------------------------------断线重连------------------------------------------------------------
        /**断线重连次数 */
        private _reConnectNum: number = 0;
        /**断线重连最大次数 */
        private _reConnectMaxNum: number = 5;
        /**断线重连第一次重连间隔(毫秒)  */
        private _firstReConnectIntervalTime: number = 2000;
        /**断线重连间隔时间(毫秒) */
        private _reConnectIntervalTime: number = 5000;
        /**心跳包超时(毫秒) */
        private _heartBeatOverTime: number = 14000;
        /**心跳包延时(毫秒) */
        private _heartBeatDelayed: number = 5000;
        /**重连缓冲时间 */
        private _bufferTime: number = 1000;
        /**是否正在重连 */
        private _bReConnecting: boolean = false;
        public get bReConnecting() {
            return this._bReConnecting;
        }

        /**开启断线重连 */
        public OpenReConnect() {
            if (!MasterPlayer.Instance.bInGame) return;
            this.K_HeartBeat();
        }

        /**关闭断线重连、直接踢下线 */
        public CloseReConnect() {
            this._bReConnecting = false;
            Tick.Clear(this, this.K_HeartBeat);
            Tick.Clear(this, this.OnReConnectBuffer);
            Tick.Clear(this, this.OnReConnectStart);
            Tick.Clear(this, this.OnReConnectWait);
            // 关闭当前连接
            RemoteCall.Instance.Close();
        }

        /**发送心跳包 */
        private K_HeartBeat() {
            if (this._bReConnecting) return;
            RemoteCall.Instance.Send("K_HeartBeat");
            Tick.Once(this._heartBeatOverTime, this, this.OnReConnectBuffer);
        }

        /**接收心跳包 */
        private C_HeartBeat() {
            if (this._bReConnecting) return;
            Tick.Clear(this, this.OnReConnectBuffer);
            Tick.Clear(this, this.OnReConnectStart);
            Tick.Once(this._heartBeatDelayed, this, this.K_HeartBeat);
        }

        /**重连缓冲 */
        private OnReConnectBuffer() {
            if (this._bReConnecting) return;
            Tick.Once(this._bufferTime, this, this.OnReConnectStart);
        }

        /**断线重连开始 */
        private OnReConnectStart() {
            // 如果当前在loading则不走断线重连，尝试继续发送心跳包
            if (UIManager.Instance.IsHave("LoadingView", ViewUpRoot)) {
                this.K_HeartBeat();
                return;
            }
            if (this._bReConnecting) return;
            this._bReConnecting = true;
            // 关闭当前连接
            RemoteCall.Instance.Close();
            UIManager.Instance.CreateUI("ReConnectView", [ViewUpRoot]);
            Tick.Once(this._firstReConnectIntervalTime, this, () => {
                this.OnReConnectWait();
                Tick.Loop(this._reConnectIntervalTime, this, this.OnReConnectWait);
            });
        }

        /**尝试重连等待 */
        private OnReConnectWait() {
            this._reConnectNum++;
            if (this._reConnectNum > this._reConnectMaxNum) {
                this.OnReConnecEnd(false);
            }
            else {
                LoginLogic.Instance.OnReConnect();
            }
        }

        /**断线重连结束 */
        public OnReConnecEnd(bSuccess: boolean) {
            this._bReConnecting = false;
            this.OpenReConnect();
            this._reConnectNum = 0;
            Tick.Clear(this, this.OnReConnectWait);
            Event.DispatchEvent("Event_ReConnectEnd", [bSuccess]);
        }
    }
}