/**
 * 聊天数据结构
 */
module H52D_Framework {

    export class ChatData {
        private _channel: E_ChatChannel;
        private _smallChannel: E_ChatChannel;
        private _roleID: number;
        private _headId: number;
        private _strName: string;
        private _msg: string;
        private _campID: number;
        private _time: string;
        private _vipLevel: number;

        constructor() {

        }

        public get channel() {
            return this._channel;
        }
        public set channel(val: E_ChatChannel) {
            this._channel = val;
        }
        public get smallChannel() {
            return this._smallChannel;
        }
        public set smallChannel(val: E_ChatChannel) {
            this._smallChannel = val;
        }
        public get roleID() {
            return this._roleID;
        }
        public set roleID(val: number) {
            this._roleID = val;
        }
        public get headId() {
            return this._headId
        }
        public set headId(val: number) {
            this._headId = val;
        }
        public get strName() {
            return this._strName
        }
        public set strName(val: string) {
            this._strName = val;
        }
        public get msg() {
            return this._msg
        }
        public set msg(val: string) {
            this._msg = val;
        }
        public get campID() {
            return this._campID;
        } public set campID(val: number) {
            this._campID = val;
        }
        public get time() {
            return this._time;
        } public set time(val: string) {
            this._time = val;
        }
        public get vipLevel() {
            return this._vipLevel;
        } public set vipLevel(val: number) {
            this._vipLevel = val;
        }

    }
}