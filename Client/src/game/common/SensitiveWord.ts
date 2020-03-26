/*
* 敏感词系统;
*/
module H52D_Framework {
    export class SensitiveWord {
        private static _inst: SensitiveWord;
        public static get Instance() {
            if (SensitiveWord._inst == null)
                SensitiveWord._inst = new SensitiveWord();
            return SensitiveWord._inst;
        }

        /**
         * 检测参数字符串是否存在敏感词
         * @param strText 字符串
         */
        public Check(strText: string): boolean {
            for (let i in SensitiveWords) {
                if (strText.indexOf(SensitiveWords[i]) != -1) {
                    return true;
                }
            }
            return false;
        }

        /**
         * 替换参数有字符串中的所有敏感词，并返回替换后的字符串和字符串中包含的敏感词数量
         * @param strText 字符串
         * @param replaceText 替换的字符
         */
        public Replace(strText: string, replaceText?: string): string {
            let retText = strText;
            let replace = replaceText || "*";
            for (let i in SensitiveWords) {
                let str = SensitiveWords[i]
                if (retText.indexOf(str) != -1) {
                    retText = retText.replace(str, replace);
                }
            }
            return retText;
        }
    }
}