/*
* 临时特效模型类;
*/
module H52D_Framework
{
    /**模型类 */
    export class EffectModel extends Laya.Sprite
    {
        constructor()
        {
            super()
            this.graphics.drawRect(0,0,10,3,"#ff0000");
            this.visible = false;
            EffectRoot.addChild(this);
        }

        public Play(url:string, b:boolean):void
        {
            this.visible = true;
        }

        public Rotate(value: number): void
        {
            this.rotation = value;
        }

        public get PosX():number
        {
            return this.x;
        }
        public set PosX(value:number)
        {
            this.x = value;
        }
        
        public get PosY():number
        {
            return this.y;
        }
        public set PosY(value:number)
        {
            this.y = value;
        }
    }
}