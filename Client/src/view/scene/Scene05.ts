/*
* name;
*/
module H52D_Framework {
    AddViewResource("Scene05",
        [
            { url: "res/ui/ui_scene05.atlas", type: Laya.Loader.ATLAS }
        ]);
    export class Scene05 extends ui.scene.Scene05UI {
        private animationList: Array<Avatar> = []
        constructor() {
            super();
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            InitSceneAnim(this, "Scene05");
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
