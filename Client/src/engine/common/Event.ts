module H52D_Framework {
    class TEvent {
        private _handerList: Array<Laya.Handler>;

        constructor() {
            this._handerList = new Array<Laya.Handler>();
        }

        public Add(handler: Laya.Handler): void {
            this._handerList.push(handler);
        }

        public Remove(handler: Laya.Handler): void {
            for (let i: number = 0; i < this._handerList.length; i++) {
                if (handler.caller == this._handerList[i].caller && handler.method == this._handerList[i].method) {
                    this._handerList[i].recover();
                    this._handerList.splice(i, 1);
                    handler.recover();
                    return;
                }
            }
        }

        public Exec(args?: Array<any>): void {
            for (let i: number = 0; i < this._handerList.length; i++) {
                let handler: Laya.Handler = this._handerList[i];
                if (handler != null) {
                    handler.setTo(handler.caller, handler.method, args, false);
                    handler.run();
                }
            }
        }
    }

    const MAX_STACK_DEEP: number = 8;
    export class Event {
        private static _eventList: Object = {};
        private static _stackDeep: number;

        public static DispatchEvent(type: string, args?: any): void {
            if (!(args instanceof Array))
                args = [args];

            let ev: TEvent = this._eventList[type];
            if (ev != null) {
                try {
                    this._stackDeep++;
                    if (this._stackDeep > MAX_STACK_DEEP)
                        throw new Error("Event stack overflow");
                    ev.Exec(args);
                }
                catch (e) {
                    Debugger.LogError(e);
                }
                finally {
                    this._stackDeep--;
                }
            }
        }

        public static RegistEvent(type: string, handler: Laya.Handler): void {
            let ev: TEvent = this._eventList[type];
            if (ev == null) {
                ev = new TEvent()
                this._eventList[type] = ev;
            }
            ev.Add(handler);
        }

        public static RemoveEvent(type: string, handler: Laya.Handler): void {
            let ev: TEvent = this._eventList[type];
            if (ev != null && handler != null) {
                ev.Remove(handler);
            }
        }
    }
}