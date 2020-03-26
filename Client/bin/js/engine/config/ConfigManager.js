/**
 * json配置文件管理器
 */
var H52D_Framework;
(function (H52D_Framework) {
    var ConfigManager = /** @class */ (function () {
        function ConfigManager(callBack) {
            var _this = this;
            // 中文encode过的文件，解码后存到一个table里
            this._configDecode = {};
            // 加载到第几个压缩包
            this._configIndex = 0;
            // 加载文字
            this._configTxt = {
                "1": "正在下载游戏资源，请稍后",
                "2": "正在下载游戏资源，请稍后",
                "3": "正在下载游戏资源，请稍后",
                "4": "正在下载游戏资源，请稍后",
                "5": "正在下载游戏资源，请稍后",
                "6": "正在下载游戏资源，请稍后",
                "7": "正在下载游戏资源，请稍后",
                "8": "正在下载游戏资源，请稍后",
                "9": "正在下载游戏资源，请稍后",
                "10": "正在下载游戏资源，请稍后"
            };
            this.Initialize(Laya.Handler.create(this, function () {
                _this._gameConfig = new H52D_Framework.GameConfig(_this);
                callBack.run();
            }));
        }
        ConfigManager.prototype.do = function (includeData, callBack) {
            ++this._configIndex;
            var res = Laya.loader.getRes("res/config/config" + this._configIndex + ".zip");
            var inflate = new Zlib.Inflate(new Uint8Array(res));
            var inbuffer = inflate.decompress();
            var bufLen = inbuffer.byteLength;
            var layaBuf = new Laya.Byte(inbuffer.buffer);
            layaBuf.pos = 0;
            for (var k in includeData["filesize" + this._configIndex]) {
                // 截取文件名
                var fileName = k.replace("res/config/", "");
                var begin = includeData["filesize" + this._configIndex][k][0];
                var end = includeData["filesize" + this._configIndex][k][1];
                var cfg = layaBuf.getUTFBytes(end - begin + 1);
                this._configDecode[k] = JSON.parse(cfg);
                layaBuf.pos = end + 1;
            }
            // 每次解压进度前进6%
            var str = H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.UPDATE_LOADING_SLIDER_VALUE, [0.2 + this._configIndex / 10 * 0.3, this._configTxt[this._configIndex]]);
            if (this._configIndex < 10) {
                Laya.timer.frameOnce(1, this, this.do, [includeData, callBack]);
            }
            else {
                this.Loaded();
                if (callBack != null) {
                    callBack.runWith(this);
                }
            }
        };
        ConfigManager.prototype.Initialize = function (callBack) {
            var _this = this;
            // 检查数据表压缩包是否存在（打包情况下使用）
            if (Laya.ResourceVersion.manifest && Laya.ResourceVersion.manifest["res/config/config1.zip"]) {
                var oData = [
                    "res/config/include.json",
                    "res/config/config1.zip",
                    "res/config/config2.zip",
                    "res/config/config3.zip",
                    "res/config/config4.zip",
                    "res/config/config5.zip",
                    "res/config/config6.zip",
                    "res/config/config7.zip",
                    "res/config/config8.zip",
                    "res/config/config9.zip",
                    "res/config/config10.zip",
                ];
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.UPDATE_LOADING_SLIDER_VALUE, [0.1, this._configTxt[1]]);
                Laya.loader.load(oData, Laya.Handler.create(this, function () {
                    // 先读include.json
                    var includeRes = Laya.loader.getRes("res/config/include.json");
                    var includeBuf = new Laya.Byte(includeRes);
                    includeBuf.pos = 0;
                    var includeData = JSON.parse(includeBuf.getUTFBytes());
                    H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.UPDATE_LOADING_SLIDER_VALUE, [0.2]);
                    // 解压config.zip
                    _this.do(includeData, callBack);
                }), null, Laya.Loader.BUFFER);
            }
            else {
                Laya.loader.load("res/config/include.json", Laya.Handler.create(this, function () {
                    //解析配置
                    var res = Laya.loader.getRes("res/config/include.json");
                    if (!res || res.data.length == 0) {
                        return;
                    }
                    // 判断加载模式
                    Laya.loader.load(res.data, Laya.Handler.create(_this, function () {
                        _this.Loaded();
                        if (callBack != null) {
                            callBack.runWith(_this);
                        }
                    }));
                }));
            }
        };
        //加载其他配置表文件
        ConfigManager.prototype.Loaded = function () {
            this._configIndex = 0;
            // 解码json中的encode过的json文件（微信小游戏打包时试用）
            // if (includedata.EncodeFile) {
            //     for (let i = 0; i < includedata.EncodeFile.length; i++) {
            //         let res = Laya.loader.getRes(includedata.EncodeFile[i]);
            //         let strJson: string = decodeURIComponent(res);
            //         let strFileName: string = includedata.EncodeFile[i];
            //         strFileName = strFileName.replace(".txt", ".json");
            //         this._configDecode[strFileName] = JSON.parse(strJson);
            //     }
            // }
        };
        /**
         * 获取某一配置文件json格式对象
         * @param key 配置文件名
         * @return json对象
         */
        ConfigManager.prototype.Get = function (key, i_bNoc) {
            if (i_bNoc === void 0) { i_bNoc = false; }
            if (!key) {
                return null;
            }
            var cfgName = "res/config/" + key + "_C.json";
            if (i_bNoc) {
                cfgName = "res/config/" + key + ".json";
            }
            // 检查decode表里是否存在
            if (this._configDecode[cfgName]) {
                return this._configDecode[cfgName];
            }
            var res = Laya.loader.getRes(cfgName);
            return res;
        };
        /**
        * 获取某一配置文件json格式对象中的一个字段值
        * @param key 配置文件名
        * @param prop 字段名
        * @return 字段值
        */
        ConfigManager.prototype.GetValue = function (key, prop) {
            if (!key) {
                return null;
            }
            if (!prop) {
                return null;
            }
            var con = this.Get(key);
            if (!con) {
                return null;
            }
            return con[prop];
        };
        /**
         * 获取某一个配置文件（json格式对象）中多个字段值
         * @param key
         * @param ...args
         * @return 如果可变参数为1个，则返回字段对应的值；若为多个，则返回一个object对象。key为字段，value：字段值
         */
        ConfigManager.prototype.GetValues = function (key) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (!key) {
                return null;
            }
            ;
            var con = this.Get(key);
            if (!con) {
                return null;
            }
            ;
            if (!args) {
                return null;
            }
            ;
            var l = args.length;
            if (l == 1) {
                return con[args[0]];
            }
            var o = {};
            var prop;
            for (var i = 0; i < l; i++) {
                prop = args[i];
                o[prop] = con[prop];
            }
            return o;
        };
        return ConfigManager;
    }());
    H52D_Framework.ConfigManager = ConfigManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ConfigManager.js.map