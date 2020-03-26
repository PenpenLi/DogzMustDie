/**
 * 加载、播放图集动画
 */
var H52D_Framework;
(function (H52D_Framework) {
    var Animation = /** @class */ (function () {
        /**
         * 创建图集动画
         * @param ui 父对象
         * @param url 图集路径
         * @param bLoop 是否循环
         * @param posX x偏移
         * @param posY y偏移
         * @param scaleX x大小
         * @param scaleY y大小
         * @param interval 播放间隔时间（毫秒）
         * @param callBack 回调
         */
        function Animation(ui, url, bLoop, posX, posY, scaleX, scaleY, interval, callBack) {
            var _this = this;
            if (posX === void 0) { posX = 0; }
            if (posY === void 0) { posY = 0; }
            if (scaleX === void 0) { scaleX = 1; }
            if (scaleY === void 0) { scaleY = 1; }
            if (interval === void 0) { interval = 33; }
            this._ani = new Laya.Animation();
            // 加载图集动画
            H52D_Framework.ResourceManager.Instance.loadAtlas(this._ani, url, Laya.Handler.create(this, function () {
                if (!ui || !_this._ani || !ui._bitmap) {
                    if (callBack) {
                        callBack.run();
                    }
                    _this.Destroy();
                    return;
                }
                // 设置播放间隔（单位：毫秒）
                _this._ani.interval = interval;
                // 播放图集动画
                _this._ani.play(null, bLoop);
                var bounds = _this._ani.frames[0].getBounds();
                _this._ani.pivot(bounds.width / 2, bounds.height / 2);
                _this._ani.pos(ui.width / 2, ui.height / 2);
                _this._ani.pos(_this._ani.x + posX, _this._ani.y + posY);
                _this._ani.scale(scaleX, scaleY);
                ui.addChild(_this._ani);
                if (callBack) {
                    callBack.run();
                }
                // 非循环的自动销毁
                if (!bLoop) {
                    _this._ani.on(Laya.Event.COMPLETE, _this, function () {
                        this.Destroy();
                    });
                }
            }));
        }
        /**
         * 销毁图集特效
         */
        Animation.prototype.Destroy = function () {
            if (this._ani) {
                this._ani.offAll();
                this._ani.destroy(true);
                this._ani = null;
            }
        };
        return Animation;
    }());
    H52D_Framework.Animation = Animation;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Animation.js.map