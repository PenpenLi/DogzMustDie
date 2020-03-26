/*
* name;
*/
module H52D_Framework {
    AddViewResource("Scene03",
        [
            { url: "res/ui/ui_scene03.atlas", type: Laya.Loader.ATLAS }
        ]);
    export class Scene03 extends ui.scene.Scene03UI {
        private animationList: Array<Avatar> = []
        constructor() {
            super();
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            InitSceneAnim(this, "Scene03");
        }

        private Destroy() {
            ClearViewResource(this.name);
            this.removeChildren();
        }
    }
}
