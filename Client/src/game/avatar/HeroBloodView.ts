/**
 * 英雄血条
 * @author zhangyusong
 */
module H52D_Framework {
    export class HeroBloodView extends ui.action.kicking.HeroBloodViewUI {
        private maxWidth:number
        /**初始化 */
        constructor() {
            super();
            this.visible = true;
            this.img_blood.x = 0;
            this.maxWidth = this.img_blood.width;
        }

        public set proportion(value:number){
            if(value<=0){
                value = 0;
                this.visible = false;
                this.destroy();
            }
            else if(value>1){
                value = 1;
            }
            this.img_blood.x = -this.maxWidth*(1-value);
        }

    }
} 