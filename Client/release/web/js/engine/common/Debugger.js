var H52D_Framework;
(function (H52D_Framework) {
    var Debugger = /** @class */ (function () {
        function Debugger() {
        }
        Debugger.Log = function (msg) {
            if (this._logLevel >= LogLevel.eLog) {
                if (this._onLog != null) {
                    this._onLog.setTo(this._onLog.caller, this._onLog.method, [msg], false);
                    this._onLog.run();
                }
            }
        };
        Debugger.LogWarning = function (msg) {
            if (this._logLevel >= LogLevel.eWarning) {
                if (this._onLogWarning != null) {
                    this._onLogWarning.setTo(this._onLogWarning.caller, this._onLogWarning.method, [msg], false);
                    this._onLogWarning.run();
                }
            }
        };
        Debugger.LogError = function (msg) {
            if (this._logLevel >= LogLevel.eError) {
                if (this._onLogError != null) {
                    this._onLogError.setTo(this._onLogError.caller, this._onLogError.method, [msg], false);
                    this._onLogError.run();
                }
            }
        };
        Debugger.Assert = function (condition, msg) {
            if (msg === void 0) { msg = ""; }
            if (this._onAssert != null) {
                this._onLogError.setTo(this._onLogError.caller, this._onLogError.method, [condition, msg], false);
                this._onLogError.run();
            }
        };
        return Debugger;
    }());
    H52D_Framework.Debugger = Debugger;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Debugger.js.map