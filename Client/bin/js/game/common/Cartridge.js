/*
* name;
*/
var H52D_Framework;
(function (H52D_Framework) {
    var Cartridge = /** @class */ (function () {
        function Cartridge() {
            this._Flag = [];
        }
        /** 添加一个方法 */
        Cartridge.prototype.AddFunc = function (handler) {
            this._Flag.push(handler);
        };
        /** 添加一个延迟 */
        Cartridge.prototype.AddDelay = function (time) {
            this._Flag.push(time);
        };
        /** 清除 */
        Cartridge.prototype.Clear = function () {
            this._Flag = [];
            H52D_Framework.Tick.ClearAll(this);
        };
        /** 执行 */
        Cartridge.prototype.Do = function () {
            var _this = this;
            var obg = this._Flag.shift();
            while (obg != null) {
                if (typeof (obg) == "number") {
                    H52D_Framework.Tick.Once(obg, this, function () {
                        _this.Do();
                    });
                    return;
                }
                else {
                    obg.run();
                }
                obg = this._Flag.shift();
            }
        };
        Cartridge.prototype.RemoveNum = function () {
            for (var key in this._Flag) {
                var obg = this._Flag[key];
                if (typeof (obg) == "number") {
                    this._Flag[key] = 10;
                }
            }
        };
        return Cartridge;
    }());
    H52D_Framework.Cartridge = Cartridge;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Cartridge.js.map