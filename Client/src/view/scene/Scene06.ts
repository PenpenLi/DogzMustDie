/*
* name;
*/
module H52D_Framework {
    AddViewResource("Scene06",
        [
            { url: "res/ui/ui_scene06.atlas", type: Laya.Loader.ATLAS }
        ]);
    export class Scene06 extends ui.scene.Scene06UI {
        private animationList: Array<Avatar> = []
        constructor() {
            super();
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            InitSceneAnim(this, "Scene06");
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
