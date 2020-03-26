var H52D_Framework;
(function (H52D_Framework) {
    var HttpService = /** @class */ (function () {
        // 构造
        function HttpService() {
            this.hCb = null;
        }
        /**
         * @brief 请求
         * @param i_strURL 请求地址
         * @param i_jParam 参数（Json）
         * @param i_strRequestFlag 需求参数("get", "post", "head")
         * @param i_strType Web 服务器的响应类型，可设置为 "text"、"json"、"xml"、"arraybuffer"。
         */
        HttpService.prototype.Request = function (i_strURL, i_jParam, i_strRequestFlag, i_strType, i_hCallBack) {
            this.hCb = i_hCallBack;
            var xhr = new Laya.HttpRequest();
            xhr.http.timeout = 10000; //设置超时时间；
            xhr.once(Laya.Event.COMPLETE, this, this.completeHandler);
            xhr.once(Laya.Event.ERROR, this, this.errorHandler);
            xhr.send(i_strURL, i_jParam, i_strRequestFlag, i_strType);
        };
        ;
        HttpService.prototype.processHandler = function (e) {
            console.log(e);
        };
        HttpService.prototype.errorHandler = function (e) {
            console.log(e);
        };
        HttpService.prototype.completeHandler = function (e) {
            if (this.hCb) {
                this.hCb(e);
            }
            console.log(e);
        };
        return HttpService;
    }());
    H52D_Framework.HttpService = HttpService;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=HttpService.js.map