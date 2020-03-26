/**
 * 加载、播放图集动画
 */
module H52D_Framework {
    export class Animation {
        private _ani: Laya.Animation;

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
        constructor(ui: any, url: string, bLoop: boolean, posX: number = 0, posY: number = 0, scaleX: number = 1, scaleY: number = 1, interval: number = 33, callBack?: Laya.Handler) {
            this._ani = new Laya.Animation();
            // 加载图集动画
            ResourceManager.Instance.loadAtlas(this._ani, url, Laya.Handler.create(this, () => {
                if (!ui || !this._ani || !ui._bitmap) {
                    if (callBack) {
                        callBack.run();
                    }
                    this.Destroy();
                    return;
                }
                // 设置播放间隔（单位：毫秒）
                this._ani.interval = interval;
                // 播放图集动画
                this._ani.play(null, bLoop);
                let bounds: Laya.Rectangle = this._ani.frames[0].getBounds();
                this._ani.pivot(bounds.width / 2, bounds.height / 2);
                this._ani.pos(ui.width / 2, ui.height / 2);
                this._ani.pos(this._ani.x + posX, this._ani.y + posY);
                this._ani.scale(scaleX, scaleY);
                ui.addChild(this._ani);
                if (callBack) {
                    callBack.run();
                }
                // 非循环的自动销毁
                if (!bLoop) {
                    this._ani.on(Laya.Event.COMPLETE, this, function () {
                        this.Destroy();
                    });
                }
            }));
        }

        /**
         * 销毁图集特效
         */
        public Destroy() {
            if (this._ani) {
                this._ani.offAll();
                this._ani.destroy(true);
                this._ani = null;
            }
        }
    }
}
