/*
* name;
*/
module H52D_Framework {
    AddViewResource("Scene02",
        [
            { url: "res/ui/ui_scene02.atlas", type: Laya.Loader.ATLAS }
        ]);
    export class Scene02 extends ui.scene.Scene02UI {
        private animationList: Array<Avatar> = []
        constructor() {
            super();
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            InitSceneAnim(this, "Scene02");
        }

        private Destroy() {
            ClearViewResource(this.name);
            this.removeChildren();
        }
    }
}
