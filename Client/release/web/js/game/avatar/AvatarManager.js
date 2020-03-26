/**
* name
*/
var H52D_Framework;
(function (H52D_Framework) {
    var AvatarManager = /** @class */ (function () {
        function AvatarManager() {
            /** 模型管理类 */
            this._factoryObj = {};
            /** 加载延迟 */
            this._factoryLoadList = {};
            /** 加载标记 */
            this._factoryLoadMapping = {};
        }
        Object.defineProperty(AvatarManager, "Instance", {
            get: function () {
                if (this._instance == null) {
                    this._instance = new AvatarManager();
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        /** 获取模型 */
        AvatarManager.prototype.GetFactoryTemplet = function (path, callBack) {
            var _this = this;
            var oTemplet = this._factoryObj[path];
            if (!oTemplet) {
                oTemplet = new Laya.Templet();
                oTemplet.loadAni(path);
                oTemplet.on(Laya.Event.COMPLETE, this, function () {
                    _this._factoryLoadMapping[path] = true;
                    oTemplet.offAll();
                    if (_this._factoryLoadList[path] != null) {
                        for (var _i = 0, _a = _this._factoryLoadList[path]; _i < _a.length; _i++) {
                            var fun = _a[_i];
                            fun.runWith(oTemplet);
                        }
                    }
                    callBack.runWith(oTemplet);
                    _this._factoryLoadList[path] = null;
                });
                this._factoryObj[path] = oTemplet;
            }
            else {
                if (this._factoryLoadMapping[path] != true) {
                    if (this._factoryLoadList[path] == null) {
                        this._factoryLoadList[path] = [];
                    }
                    this._factoryLoadList[path].push(callBack);
                    return;
                }
                callBack.runWith(oTemplet);
            }
        };
        AvatarManager._instance = null;
        return AvatarManager;
    }());
    H52D_Framework.AvatarManager = AvatarManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=AvatarManager.js.map