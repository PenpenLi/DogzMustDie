module H52D_Framework {
    // 战斗伤害飘字
    export class FloatView extends ui.common.FloatViewUI {

        private readonly MOVE_TIME: number = 1100;

        constructor(params: Array<any>) {
            super();
            this.width = G_StageWidth;
            this.height = G_StageHeight;
            let value = params[1];
            let dmgDegree = params[2];
            this.hBox.x = params[3];
            this.hBox.y = params[4];
            this.isCrit = params[5];
            this.birthY = params[6];
            this.hBox.destroyChildren();
            this.SetNumberClip(dmgDegree, value);
            this.TweenMoveByCenter(dmgDegree);
        }

        private isCrit: boolean = false;
        private birthY: number = 0;
        private SetNumberClip(dmgDegree: number, value: number) {
            if (value <= 0) {
                return;
            }
            let damageMaxValue = 99999999999;
            if (value > damageMaxValue) {
                value = damageMaxValue;
            }

            let imagePath = "";
            if (dmgDegree == SkinEnum.SkinTap) {
                imagePath = "ui_common/img-dianji-shanghai.png";
            }
            else if (dmgDegree == SkinEnum.SkinHero) {
                imagePath = "ui_common/img-yingxiong-shanghai.png";
            }
            else if (dmgDegree == SkinEnum.SkinPet) {
                imagePath = "ui_common/img-chongwu-shanghai.png";
            }
            else if (dmgDegree == SkinEnum.SkinCamp) {
                imagePath = "ui_common/img-dachuan-shanghai.png";
            }
            else if (dmgDegree == SkinEnum.RewardCoin) {
                imagePath = "ui_common/img-jinbi-shanghai.png";
            }
            else if (dmgDegree == SkinEnum.SkinHP) {
                imagePath = "ui_common/img-xixue-shanghai.png";
            }

            let str = value.toString();
            for (let i: number = 0; i < str.length; i++) {
                let clip = this["clip" + i];
                clip.index = Number(str[i]);
                clip.visible = true;
                clip.skin = imagePath;
                this.hBox.addChild(clip);
                clip.x = this.hBox._childs.length;
            }
        }

        // 缓动
        private TweenMoveByCenter(dmgDegree: number) {
            if (!this.isCrit && dmgDegree != SkinEnum.RewardCoin) {
                this.hBox.scale(0.7, 0.7);
            }
            if(dmgDegree == SkinEnum.RewardCoin)
            {
                 this.hBox.scale(0.6, 0.6);
            }
            let random_x = Math.random() * 20 - 5 >> 0;
            this.hBox.x += random_x;
            let random_y = Math.random() * this.birthY >> 0;
            this.hBox.y -= random_y;

            TweenList.to(this, this.hBox, { y: this.hBox.y - 250 }, this.MOVE_TIME, () => {
                this.hBox.y = this.hBox.y - 250;
                this.TweenComplete();
            });
            TweenList.to(this, this.hBox, { alpha: 0 }, 500, () => { this.hBox.alpha = 0 }, this.MOVE_TIME - 500);

            Tick.Once(10, this, () => {
                if (this.hBox.y > this.hBox.y - 5) {
                    TweenList.to(this, this.hBox, { y: this.hBox.y - 250 }, this.MOVE_TIME, () => {
                    this.hBox.y = this.hBox.y - 250;
                    this.TweenComplete();
                });
                }
            });
        }

        private TweenComplete() {
            this.hBox.alpha = 0;
            Laya.Tween.clearAll(this);
            UIManager.Instance.DestroyUI(this, [ViewDownRoot]);
        }
    }
}