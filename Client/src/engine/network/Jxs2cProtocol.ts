module H52D_Framework {
    export class JXS2C_PROTOCOL_HEADER {
        public protocolID: string; //消息名称 
        public data: any;  //消息数据

        public GetData(i_Args: any): void {
            this.data = i_Args;
            this.protocolID = i_Args[0];
        }
    }

    export class JXS2CL_RESPONE extends JXS2C_PROTOCOL_HEADER {
        public GetData(i_Args: any): void {
            super.GetData(i_Args);
        }
    }
}