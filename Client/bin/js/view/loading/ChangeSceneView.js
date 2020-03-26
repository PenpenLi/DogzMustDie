var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**Created by the LayaAirIDE*/
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("ChangeSceneView", [
        // { url: "res/ui/ui_scene01.atlas", type: Laya.Loader.ATLAS },
        // { url: "res/ui/ui_scene02.atlas", type: Laya.Loader.ATLAS },
        // { url: "res/ui/ui_scene03.atlas", type: Laya.Loader.ATLAS },
        // { url: "res/ui/ui_scene04.atlas", type: Laya.Loader.ATLAS },
        // { url: "res/ui/ui_scene05.atlas", type: Laya.Loader.ATLAS },
        // { url: "res/ui/ui_scene06.atlas", type: Laya.Loader.ATLAS },
        // { url: "res/ui/ui_scene07.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_login.atlas", type: Laya.Loader.ATLAS }
    ]);
    var ChangeSceneView = /** @class */ (function (_super) {
        __extends(ChangeSceneView, _super);
        function ChangeSceneView() {
            var _this = _super.call(this) || this;
            _this.path = "ui_icon/";
            _this.visible = false;
            // this.scenebg = new Laya.Image();
            // this.scenebg.bottom = 0;
            // this.img_bg.addChild(this.scenebg);
            // this.img_bg.width = G_StageWidth * G_StageWidthScale;
            // this.img_bg.height = G_StageHeight * G_StageHeightScale;
            _this.img_bg.skin = "res/ui/ui_noPack/login_background.png";
            _this.on(Laya.Event.REMOVED, _this, _this.Destroy);
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.SHOW_SCENE, Laya.Handler.create(_this, _this.ShowScene));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.CLOSE_SCENE, Laya.Handler.create(_this, _this.CloseScene));
            return _this;
        }
        ChangeSceneView.prototype.ShowScene = function (sceneVo) {
            this.scene_name.text = sceneVo.sceneName;
            // let sceneurl: string = "ui_scene" + sceneVo.strSceneFileName.substr(-2, 2);
            // this.scenebg.skin = sceneurl + "/02.png";
            // this.scenebg.height = G_StageWidth * G_StageWidthScale / this.scenebg.width * this.scenebg.height;
            // this.scenebg.width = G_StageWidth * G_StageWidthScale;
            // this.img_bg.skin = sceneurl + "/01.png";
            this.img_sign.skin = this.path + sceneVo.strSceneChange + ".png";
            this.alpha = 1;
            this.visible = true;
        };
        ChangeSceneView.prototype.CloseScene = function (callBack) {
            var _this = this;
            H52D_Framework.TweenList.to(this, this, { alpha: 0 }, 600, function () {
                _this.visible = false;
                if (callBack) {
                    callBack();
                }
                else {
                    // if (CustomsManager.Instance.CustomsType == Customs_Type.Boss) {
                    // 	Tick.Once(2500, this, () => {
                    // 		Event.DispatchEvent(EventDefine.BEGIN_FIRE);
                    // 		BattleManager.Instance.OpenBattle();
                    // 	});
                    // } else {
                    // 	Event.DispatchEvent(EventDefine.BEGIN_FIRE);
                    // 	BattleManager.Instance.OpenBattle();
                    // }
                }
            }, 800);
        };
        ChangeSceneView.prototype.Destroy = function () {
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [this.parent]);
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.SHOW_SCENE, Laya.Handler.create(this, this.ShowScene));
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.CLOSE_SCENE, Laya.Handler.create(this, this.CloseScene));
        };
        return ChangeSceneView;
    }(ui.loading.ChangeSceneViewUI));
    H52D_Framework.ChangeSceneView = ChangeSceneView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ChangeSceneView.js.map