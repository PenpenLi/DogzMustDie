/*
* name;
*/
module H52D_Framework {
    AddViewResource("Scene01",
        [
            { url: "res/ui/ui_scene01.atlas", type: Laya.Loader.ATLAS }
        ]);
    export class Scene01 extends ui.scene.Scene01UI {
        private animationList: Array<Avatar> = []
        constructor() {
            super();
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            InitSceneAnim(this, "Scene01");
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
