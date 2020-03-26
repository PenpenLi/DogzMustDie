var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var H52D_Framework;
(function (H52D_Framework) {
    var JXS2C_PROTOCOL_HEADER = /** @class */ (function () {
        function JXS2C_PROTOCOL_HEADER() {
        }
        JXS2C_PROTOCOL_HEADER.prototype.GetData = function (i_Args) {
            this.data = i_Args;
            this.protocolID = i_Args[0];
        };
        return JXS2C_PROTOCOL_HEADER;
    }());
    H52D_Framework.JXS2C_PROTOCOL_HEADER = JXS2C_PROTOCOL_HEADER;
    var JXS2CL_RESPONE = /** @class */ (function (_super) {
        __extends(JXS2CL_RESPONE, _super);
        function JXS2CL_RESPONE() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        JXS2CL_RESPONE.prototype.GetData = function (i_Args) {
            _super.prototype.GetData.call(this, i_Args);
        };
        return JXS2CL_RESPONE;
    }(JXS2C_PROTOCOL_HEADER));
    H52D_Framework.JXS2CL_RESPONE = JXS2CL_RESPONE;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Jxs2cProtocol.js.map