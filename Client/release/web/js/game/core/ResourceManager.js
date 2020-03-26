/*
* 资源管理类;
*/
var H52D_Framework;
(function (H52D_Framework) {
    var ResourceManager = /** @class */ (function () {
        function ResourceManager() {
            this._cacheResList = [];
            //ui特效图集资源
            this._uiAtlasRes = [];
        }
        Object.defineProperty(ResourceManager, "Instance", {
            get: function () {
                if (ResourceManager._inst == null)
                    ResourceManager._inst = new ResourceManager();
                return ResourceManager._inst;
            },
            enumerable: true,
            configurable: true
        });
        ResourceManager.prototype.Initialize = function (callBack) {
            var _this = this;
            //全局缓存资源不销毁
            this._cacheResList.push("res/ui/ui_common.atlas");
            this._cacheResList.push("res/ui/ui_icon.atlas");
            this._cacheResList.push("res/ui/ui_main.atlas");
            //预加载，首次进入游戏达到流畅
            this._cacheResList.push("res/ui/ui_sign.atlas");
            this._cacheResList.push("res/ui/ui_hero.atlas");
            this._cacheResList.push("res/ui/ui_action.atlas");
            this._cacheResList.push("res/ui/ui_camp.atlas");
            this._cacheResList.push("res/ui/ui_equip.atlas");
            this._cacheResList.push("res/ui/ui_shop.atlas");
            this._cacheResList.push("res/ui/ui_pet.atlas");
            this._cacheResList.push("res/ui/ui_head.atlas");
            this._cacheResList.push("res/ui/ui_setting.atlas");
            //加载缓存资源
            var loadedNum = 0;
            for (var i in this._cacheResList) {
                Laya.loader.load(this._cacheResList[i], Laya.Handler.create(this, function () {
                    loadedNum++;
                    // 检查数据表压缩包是否存在（打包情况下使用）
                    if (Laya.ResourceVersion.manifest && Laya.ResourceVersion.manifest["res/config/config1.zip"]) {
                        H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.UPDATE_LOADING_SLIDER_VALUE, [0.5 + loadedNum / _this._cacheResList.length * 0.5, "正在解压游戏配置信息，请稍后"]);
                    }
                    else {
                        H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.UPDATE_LOADING_SLIDER_VALUE, [loadedNum / _this._cacheResList.length, "加载中，请稍后"]);
                    }
                    if (loadedNum == _this._cacheResList.length) {
                        callBack.run();
                        //播放背景音效
                        H52D_Framework.SoundManager.Instance.OnPlayMusic("res/sound/background_sound.mp3");
                    }
                }));
            }
            H52D_Framework.Tick.Loop(1000 * 30, this, this.Dispose);
        };
        Object.defineProperty(ResourceManager.prototype, "uiAtlasData", {
            set: function (value) {
                if (this._uiAtlasRes.indexOf(value) == -1) {
                    this._uiAtlasRes.push(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 加载图集动画
         * @param ani 动画对象
         * @param url 图集路径
         * @param loaded 完成回调
         */
        ResourceManager.prototype.loadAtlas = function (ani, url, loaded) {
            this.uiAtlasData = url;
            ani.loadAtlas(url, Laya.Handler.create(this, function () {
                if (loaded) {
                    loaded.run();
                }
            }));
        };
        //释放资源
        ResourceManager.prototype.Dispose = function () {
            //当前内存大于G_CurrentMemoryMaxSize的时候清理资源
            var currentMemorySize = Laya.Stat.currentMemorySize / 1024 / 1024;
            if (currentMemorySize < G_CurrentMemoryMaxSize) {
                return;
            }
            //销毁散图资源
            for (var i = 0; i < this._uiAtlasRes.length; i++) {
                Laya.loader.clearTextureRes(this._uiAtlasRes[i]);
            }
            this._uiAtlasRes = [];
            //销毁缓存文件
            var total = Laya.ResourceManager.currentResourceManager.getResourcesLength();
            for (var i = total - 1; i >= 0; i--) {
                var res = Laya.ResourceManager.currentResourceManager.getResourceByIndex(i);
                if (!res || !res["constructor"] || res["constructor"]["name"] != "WebGLImage") {
                    continue;
                }
                if (res && this._cacheResList.indexOf(res.url) < 0) {
                    Laya.ResourceManager.currentResourceManager.removeResource(res);
                }
            }
        };
        return ResourceManager;
    }());
    H52D_Framework.ResourceManager = ResourceManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ResourceManager.js.map