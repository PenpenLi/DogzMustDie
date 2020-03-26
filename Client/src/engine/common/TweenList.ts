module H52D_Framework {
    export class TweenList {
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
        public static to(clazz: any, target: any, props: any, duration: number, complete: Function, delay: number = 0, ease: any = Laya.Ease.linearNone) {
            let comp: boolean = true;
            Laya.Tween.to(target, props, duration, ease, Laya.Handler.create(clazz, () => {
                comp = false;
                if (complete) {
                    complete.apply(clazz);
                }
            }), delay, false, true);

            Tick.Once(duration + delay, clazz, () => {
                if (comp && complete) {
                    complete.apply(clazz);
                }
            }
            );
        }
    }
}