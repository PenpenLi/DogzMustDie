var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var H52D_Framework;
(function (H52D_Framework) {
    /**
     * @class：倒计时
     * @author：zhangyusong
     */
    var Countdwon = /** @class */ (function (_super) {
        __extends(Countdwon, _super);
        function Countdwon(canDestroy) {
            if (canDestroy === void 0) { canDestroy = true; }
            var _this = _super.call(this) || this;
            _this.canDestroy = false;
            _this.visible = false;
            _this.canDestroy = canDestroy;
            return _this;
        }
        Object.defineProperty(Countdwon.prototype, "time", {
            set: function (value) {
                this.readNumber = value % 10;
            },
            enumerable: true,
            configurable: true
        });
        Countdwon.prototype.Start = function (callBackHander) {
            this.callBackHander = callBackHander;
            this.TweenCountdown();
            //播放倒计时音效(先播放一次要不然要等待1秒)
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/timer.mp3");
            H52D_Framework.Tick.Loop(1000, this, this.ReadyCountdown);
            this.visible = true;
        };
        Countdwon.prototype.Destroy = function () {
            Laya.Tween.clearAll(this.model);
            H52D_Framework.Tick.Clear(this, this.ReadyCountdown);
            this.visible = false;
            if (this.canDestroy) {
                this.destroy();
            }
        };
        /**
         * 战斗准备倒计时
         * @constructor
         */
        Countdwon.prototype.ReadyCountdown = function () {
            if (--this.readNumber > 0) {
                //播放倒计时音效
                H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/timer.mp3");
                this.TweenCountdown();
            }
            else {
                H52D_Framework.Tick.Clear(this, this.ReadyCountdown);
                this.Destroy();
                this.callBackHander.run();
            }
        };
        Countdwon.prototype.TweenCountdown = function () {
            this.model.index = this.readNumber;
            this.model.scaleX = 3.5;
            this.model.scaleY = 3.5;
            var t = Laya.Tween.to(this.model, { scaleX: 2, scaleY: 2 }, 400, Laya.Ease.linearInOut, Laya.Handler.create(this, function () {
                Laya.Tween.clear(t);
            }));
        };
        return Countdwon;
    }(ui.action.topic.CountdownViewUI));
    H52D_Framework.Countdwon = Countdwon;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Countdwon.js.map