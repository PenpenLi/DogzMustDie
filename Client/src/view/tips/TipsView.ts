module H52D_Framework {
    export class TipsView extends ui.tips.TipsViewUI {
        private _posY: number;//初始位置
        private _time = 1;
        constructor(params: any) {
            super();

            SetHtmlStyle(this.msgLabel, 25, "#ffffff", "center", true);
            this.msgLabel.style.wordWrap = false;

            let object: Object = params[1];
            this._time = object[2] ? object[2] : 1
            if (!object) {
                this.OnDestroy();
                return;
            }
            this.msgLabel.innerHTML = object[1];
            this.msgLabel.width = this.msgLabel.contextWidth;
            this.imageBg.width = this.msgLabel.contextWidth + 100;
            this.imageBg.visible = true;
            this.TweenFade(this.imageBg);
        }

        private TweenFade(image: any): void {
            this._posY = image.y;
            TweenList.to(this, image, { y: this._posY - 200 }, 1500 * this._time, () => { image.y = this._posY - 200 });
            TweenList.to(this, image, { alpha: 0 }, 800 * this._time, () => { image.alpha = 0 }, 700 * this._time);
            Tick.Once(1510 * this._time, this, this.OnDestroy)
        }

        private OnDestroy(): void {
            this.offAll();
            Tick.ClearAll(this);
            Laya.Tween.clearAll(this);
            UIManager.Instance.DestroyUI(this, [ViewToppestRoot]);
        }
    }
}