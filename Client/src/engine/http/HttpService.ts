module H52D_Framework{
    export class HttpService{
        public hCb : any = null;
        
        // 构造
        constructor() {
        }

        /**
         * @brief 请求
         * @param i_strURL 请求地址
         * @param i_jParam 参数（Json）
         * @param i_strRequestFlag 需求参数("get", "post", "head")
         * @param i_strType Web 服务器的响应类型，可设置为 "text"、"json"、"xml"、"arraybuffer"。
         */
        public Request(i_strURL, i_jParam, i_strRequestFlag, i_strType, i_hCallBack) : void {
            this.hCb = i_hCallBack;
            var xhr = new Laya.HttpRequest();
            xhr.http.timeout = 10000; //设置超时时间；
            xhr.once(Laya.Event.COMPLETE, this, this.completeHandler);
            xhr.once(Laya.Event.ERROR, this, this.errorHandler);
            xhr.send(i_strURL, i_jParam, i_strRequestFlag, i_strType);
        
        };

        private processHandler(e) : void{
            console.log(e);
        }

        private errorHandler(e) : void{
            console.log(e);
        }

        private completeHandler(e) : void{
            if (this.hCb){
                this.hCb(e);
            }
            console.log(e);
        }             
    }
}