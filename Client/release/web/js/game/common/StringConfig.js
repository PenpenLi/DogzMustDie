var H52D_Framework;
(function (H52D_Framework) {
    /**
     * 国际化配置表信息类
     */
    var CStrValueConfig = /** @class */ (function () {
        function CStrValueConfig() {
        }
        Object.defineProperty(CStrValueConfig, "Inst", {
            get: function () {
                if (!this._inst) {
                    this._inst = new CStrValueConfig();
                }
                return this._inst;
            },
            enumerable: true,
            configurable: true
        });
        /**获取国际化文字 */
        CStrValueConfig.prototype.GetText = function (id) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (!H52D_Framework.GetInfoAttr.Instance.GetText(id)) {
                H52D_Framework.Debugger.LogError("错误的国际化ID --> " + id);
                return "";
            }
            var str = H52D_Framework.GetInfoAttr.Instance.GetText(id);
            if (args.length > 0) {
                str = H52D_Framework.Format.apply(void 0, [str].concat(args));
            }
            return str;
        };
        /**获取系统提示文字 */
        CStrValueConfig.prototype.GetSysText = function (id) {
            if (!H52D_Framework.SysPromptConfig[id]) {
                H52D_Framework.Debugger.LogError("错误的系统提示ID --> " + id);
                return "";
            }
            return H52D_Framework.SysPromptConfig[id].strPromptInfo;
        };
        return CStrValueConfig;
    }());
    H52D_Framework.CStrValueConfig = CStrValueConfig;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=StringConfig.js.map