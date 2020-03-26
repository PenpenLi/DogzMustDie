var H52D_Framework;
(function (H52D_Framework) {
    var Base = /** @class */ (function () {
        function Base() {
            this._id = (Base.__defaultID += 1);
        }
        Base.prototype.Dispose = function () {
            this._id = 0;
        };
        Base.prototype.IsDisposed = function () {
            return this._id == 0;
        };
        Base.__defaultID = 1000000;
        return Base;
    }());
    H52D_Framework.Base = Base;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Base.js.map