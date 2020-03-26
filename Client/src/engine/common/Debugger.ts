module H52D_Framework {
    export class Debugger {
        public static _logLevel: LogLevel;
        public static _onLog: Laya.Handler;
        public static _onLogWarning: Laya.Handler;
        public static _onLogError: Laya.Handler;
        public static _onLogException: Laya.Handler;
        public static _onAssert: Laya.Handler;

        public static Log(msg: string): void {
            if (this._logLevel >= LogLevel.eLog) {
                if (this._onLog != null) {
                    this._onLog.setTo(this._onLog.caller, this._onLog.method, [msg], false);
                    this._onLog.run();
                }
            }
        }

        public static LogWarning(msg: string): void {
            if (this._logLevel >= LogLevel.eWarning) {
                if (this._onLogWarning != null) {
                    this._onLogWarning.setTo(this._onLogWarning.caller, this._onLogWarning.method, [msg], false);
                    this._onLogWarning.run();
                }
            }
        }

        public static LogError(msg: string): void {
            if (this._logLevel >= LogLevel.eError) {
                if (this._onLogError != null) {
                    this._onLogError.setTo(this._onLogError.caller, this._onLogError.method, [msg], false);
                    this._onLogError.run();
                }
            }
        }

        public static Assert(condition: boolean, msg: string = ""): void {
            if (this._onAssert != null) {
                this._onLogError.setTo(this._onLogError.caller, this._onLogError.method, [condition, msg], false);
                this._onLogError.run();
            }
        }
    }
}