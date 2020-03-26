var H52D_Framework;
(function (H52D_Framework) {
    var ProcessInfo = /** @class */ (function () {
        function ProcessInfo(protocolId) {
            this.handlerList = new Array();
            this.protocolId = protocolId;
            this.protoBuf = new H52D_Framework.JXS2CL_RESPONE();
        }
        ProcessInfo.prototype.AddHandler = function (handler) {
            if (handler != null) {
                this.handlerList.push(handler);
            }
        };
        ProcessInfo.prototype.DelHandler = function (handler) {
            for (var i = 0; i < this.handlerList.length; i++) {
                if (handler.caller == this.handlerList[i].caller && handler.method == this.handlerList[i].method) {
                    this.handlerList[i].recover();
                    this.handlerList.splice(i, 1);
                    handler.recover();
                    return;
                }
            }
        };
        ProcessInfo.prototype.Dispatch = function () {
            this.protoBuf.data.shift();
            for (var i = 0; i < this.handlerList.length; i++) {
                var handler = this.handlerList[i];
                if (handler != null) {
                    handler.setTo(handler.caller, handler.method, [this.protoBuf.data], false);
                    handler.run();
                }
            }
        };
        return ProcessInfo;
    }());
    H52D_Framework.ProcessInfo = ProcessInfo;
    var ProtocolMap = /** @class */ (function () {
        function ProtocolMap() {
            this._processInfoDict = {};
        }
        ProtocolMap.prototype.AddProtocolHandler = function (protocolId, handler) {
            var info = this._processInfoDict[protocolId];
            if (info == null) {
                info = new ProcessInfo(protocolId);
                this._processInfoDict[protocolId] = info;
            }
            info.AddHandler(handler);
        };
        ProtocolMap.prototype.DelProtocolHandler = function (protocolId, handler) {
            var info = this._processInfoDict[protocolId];
            if (info != null && handler != null) {
                info.DelHandler(handler);
            }
        };
        ProtocolMap.prototype.GetProcessInfo = function (protocolId) {
            return this._processInfoDict[protocolId];
        };
        return ProtocolMap;
    }());
    H52D_Framework.ProtocolMap = ProtocolMap;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ProtocolMap.js.map