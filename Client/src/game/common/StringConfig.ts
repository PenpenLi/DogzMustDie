module H52D_Framework {
    /**
     * 国际化配置表信息类
     */
    export class CStrValueConfig {
        private static _inst: CStrValueConfig;
        public static get Inst(): CStrValueConfig {
            if (!this._inst) {
                this._inst = new CStrValueConfig();
            }
            return this._inst;
        }

        /**获取国际化文字 */
        public GetText(id: number, ...args): string {
            if (!GetInfoAttr.Instance.GetText(id)) {
                Debugger.LogError("错误的国际化ID --> " + id);
                return "";
            }
            let str = GetInfoAttr.Instance.GetText(id);
            if (args.length > 0) {
                str = Format(str, ...args);
            }
            return str;
        }

        /**获取系统提示文字 */
        public GetSysText(id: number): string {
            if (!SysPromptConfig[id]) {
                Debugger.LogError("错误的系统提示ID --> " + id);
                return "";
            }
            return SysPromptConfig[id].strPromptInfo;
        }
    }
}