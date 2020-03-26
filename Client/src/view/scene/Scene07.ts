/*
* name;
*/
module H52D_Framework {
    AddViewResource("Scene07",
        [
            { url: "res/ui/ui_scene07.atlas", type: Laya.Loader.ATLAS }
        ]);
    export class Scene07 extends ui.scene.Scene07UI {
        private animationList: Array<Avatar> = []
        constructor() {
            super();
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            InitSceneAnim(this, "Scene07");
        }

        private Destroy() {
            ClearViewResource(this.name);
            this.removeChildren();
        }
    }
}
