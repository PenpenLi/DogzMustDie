module H52D_Framework {

    /**
     * @class：倒计时
     * @author：zhangyusong
     */
    export class Countdwon extends ui.action.topic.CountdownViewUI {
        /** 战斗准备3秒倒计时 */
        private readNumber: number;
        private callBackHander:Laya.Handler;
        private canDestroy:boolean = false;

        constructor(canDestroy:boolean = true){
            super();
            this.visible = false;
            this.canDestroy = canDestroy;
        }
        
        public set time(value:number){
            this.readNumber = value%10;
        }

        public Start(callBackHander:Laya.Handler){
            this.callBackHander = callBackHander;
            this.TweenCountdown();
             //播放倒计时音效(先播放一次要不然要等待1秒)
            SoundManager.Instance.OnPlaySound("res/sound/timer.mp3");
            Tick.Loop(1000, this, this.ReadyCountdown);
            this.visible = true;
        }

        public Destroy(){
            Laya.Tween.clearAll(this.model);
            Tick.Clear(this, this.ReadyCountdown);
            this.visible = false;
            if(this.canDestroy){
                this.destroy();
            }
        }

        /**
         * 战斗准备倒计时
         * @constructor
         */
        private ReadyCountdown() {
            if (--this.readNumber > 0) {
                //播放倒计时音效
                SoundManager.Instance.OnPlaySound("res/sound/timer.mp3");
                this.TweenCountdown();
            }
            else {
                Tick.Clear(this, this.ReadyCountdown);
                this.Destroy();
                this.callBackHander.run();
            }
        }

        private TweenCountdown() {
            this.model.index = this.readNumber;
            this.model.scaleX = 3.5;
            this.model.scaleY = 3.5;
            let t = Laya.Tween.to(this.model, { scaleX: 2, scaleY: 2 }, 400, Laya.Ease.linearInOut,
                Laya.Handler.create(this, () => {
                    Laya.Tween.clear(t);
                }));
        }
    }
}