var H52D_Framework;
(function (H52D_Framework) {
    var TweenList = /** @class */ (function () {
        function TweenList() {
        }
        /**
         * 缓动对象的props属性到目标值。
         * @param	clazz 目标类(即将更改属性值的对象)。
         * @param	target 目标对象(即将更改属性值的对象)。
         * @param	props 变化的属性列表，比如
         * @param	duration 花费的时间，单位毫秒。
         * @param	complete 结束回调函数。
         * @param	delay 延迟执行时间。
         * @param	ease Laya.Ease类型。
         */
        TweenList.to = function (clazz, target, props, duration, complete, delay, ease) {
            if (delay === void 0) { delay = 0; }
            if (ease === void 0) { ease = Laya.Ease.linearNone; }
            var comp = true;
            Laya.Tween.to(target, props, duration, ease, Laya.Handler.create(clazz, function () {
                comp = false;
                if (complete) {
                    complete.apply(clazz);
                }
            }), delay, false, true);
            H52D_Framework.Tick.Once(duration + delay, clazz, function () {
                if (comp && complete) {
                    complete.apply(clazz);
                }
            });
        };
        return TweenList;
    }());
    H52D_Framework.TweenList = TweenList;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=TweenList.js.map