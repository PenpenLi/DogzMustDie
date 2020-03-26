/*
* 敏感词系统;
*/
var H52D_Framework;
(function (H52D_Framework) {
    var SensitiveWord = /** @class */ (function () {
        function SensitiveWord() {
        }
        Object.defineProperty(SensitiveWord, "Instance", {
            get: function () {
                if (SensitiveWord._inst == null)
                    SensitiveWord._inst = new SensitiveWord();
                return SensitiveWord._inst;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 检测参数字符串是否存在敏感词
         * @param strText 字符串
         */
        SensitiveWord.prototype.Check = function (strText) {
            for (var i in H52D_Framework.SensitiveWords) {
                if (strText.indexOf(H52D_Framework.SensitiveWords[i]) != -1) {
                    return true;
                }
            }
            return false;
        };
        /**
         * 替换参数有字符串中的所有敏感词，并返回替换后的字符串和字符串中包含的敏感词数量
         * @param strText 字符串
         * @param replaceText 替换的字符
         */
        SensitiveWord.prototype.Replace = function (strText, replaceText) {
            var retText = strText;
            var replace = replaceText || "*";
            for (var i in H52D_Framework.SensitiveWords) {
                var str = H52D_Framework.SensitiveWords[i];
                if (retText.indexOf(str) != -1) {
                    retText = retText.replace(str, replace);
                }
            }
            return retText;
        };
        return SensitiveWord;
    }());
    H52D_Framework.SensitiveWord = SensitiveWord;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=SensitiveWord.js.map