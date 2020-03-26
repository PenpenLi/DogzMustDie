module H52D_Framework
{
     export class ProcessInfo
    {
        public protocolId : string;
        private handlerList : Array<Laya.Handler> = new Array<Laya.Handler>();
        public protoBuf : JXS2CL_RESPONE;

        constructor(protocolId : string)
        {
            this.protocolId = protocolId;
            this.protoBuf = new JXS2CL_RESPONE();
        }

        public AddHandler(handler : Laya.Handler) : void
        {
            if (handler != null)
            {
                this.handlerList.push(handler);
            }
        }

        public DelHandler(handler : Laya.Handler) : void
        {
            for(let i : number = 0; i < this.handlerList.length; i++)
            {
                if(handler.caller == this.handlerList[i].caller && handler.method == this.handlerList[i].method)
                {
                    this.handlerList[i].recover();
                    this.handlerList.splice(i, 1);
                    handler.recover();
                    return;
                }
            }
        }

        public Dispatch() : void
        {
            (this.protoBuf as JXS2CL_RESPONE).data.shift();
            for(let i : number = 0; i < this.handlerList.length; i++)
            {
                let handler : Laya.Handler = this.handlerList[i];
                if(handler != null)
                {
                    handler.setTo(handler.caller, handler.method, [(this.protoBuf as JXS2CL_RESPONE).data], false);
                    handler.run();
                }
            }
        }
    }

    export class ProtocolMap
    {
        private _processInfoDict : Object;

        constructor()
        {
            this._processInfoDict = {};
        }

        public AddProtocolHandler(protocolId : string, handler : Laya.Handler) : void
        {
            let info : ProcessInfo = this._processInfoDict[protocolId];
            if (info == null)
            {
                info = new ProcessInfo(protocolId);
                this._processInfoDict[protocolId] = info;
            }
            info.AddHandler(handler);
        }

        public DelProtocolHandler(protocolId : string, handler : Laya.Handler) : void
        {
            let info : ProcessInfo = this._processInfoDict[protocolId];
            if (info != null && handler != null)
            {
                info.DelHandler(handler);
            }
        }

        public GetProcessInfo(protocolId : string) : ProcessInfo
        {
            return this._processInfoDict[protocolId];
        }
    }
}
