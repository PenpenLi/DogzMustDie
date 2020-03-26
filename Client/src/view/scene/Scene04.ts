/*
* name;
*/
module H52D_Framework {
    AddViewResource("Scene04",
        [
            { url: "res/ui/ui_scene04.atlas", type: Laya.Loader.ATLAS }
        ]);
    export class Scene04 extends ui.scene.Scene04UI {
        private animationList: Array<Avatar> = []
        constructor() {
            super();
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            InitSceneAnim(this, "Scene04");
            if( IsNotBaiDuSdk() ){
                this.baiduskd1.visible = true
            }
        }

        private Destroy() {
            ClearViewResource(this.name);
            this.removeChildren();
        }
    }
}
