var H52D_Framework;
(function (H52D_Framework) {
    var Time = /** @class */ (function () {
        function Time() {
        }
        Time.SetServerTime = function (serverTime) {
            var serverDateTime = new Date(serverTime * 1000);
            Time._diffTime = serverDateTime.getTime() - Date.now() + this.TimeSplus;
        };
        Object.defineProperty(Time, "serverTime", {
            get: function () {
                var date = new Date(Date.now() + Time._diffTime);
                return date;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Time, "serverMilliSecodes", {
            get: function () {
                return Date.now() + Time._diffTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Time, "serverSecodes", {
            get: function () {
                return Math.floor((Date.now() + Time._diffTime) / 1000);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Time, "deltaTime", {
            get: function () {
                return Laya.timer.delta;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Time, "time", {
            get: function () {
                return Laya.timer.currTimer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Time, "timeScale", {
            get: function () {
                return Laya.timer.scale;
            },
            set: function (scale) {
                Laya.timer.scale = scale;
            },
            enumerable: true,
            configurable: true
        });
        Time._diffTime = 0;
        //时区差(8小时)
        Time.TimeSplus = 0 * 3600 * 1000;
        return Time;
    }());
    H52D_Framework.Time = Time;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Time.js.map