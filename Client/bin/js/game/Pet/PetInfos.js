var H52D_Framework;
(function (H52D_Framework) {
    /**神兽信息类 */
    var PetInfos = /** @class */ (function () {
        function PetInfos() {
        }
        /** 解析服务器数据 */
        PetInfos.prototype.unpackData = function (tData) {
            this._petID = tData[1];
            this._petLv = tData[2];
            //Event.RegistEvent(EventDefine.MODIFYATTR, Laya.Handler.create(this, this.LevelComplete)); 
        };
        Object.defineProperty(PetInfos.prototype, "PetID", {
            /**神兽ID */
            get: function () {
                return this._petID;
            },
            set: function (id) {
                this._petID = id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PetInfos.prototype, "PetLv", {
            /**神兽等级 */
            get: function () {
                return this._petLv;
            },
            set: function (lv) {
                this._petLv = lv;
            },
            enumerable: true,
            configurable: true
        });
        return PetInfos;
    }());
    H52D_Framework.PetInfos = PetInfos;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PetInfos.js.map