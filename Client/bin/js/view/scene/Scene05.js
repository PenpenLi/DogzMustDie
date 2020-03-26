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
/*
* name;
*/
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("Scene05", [
        { url: "res/ui/ui_scene05.atlas", type: Laya.Loader.ATLAS }
    ]);
    var Scene05 = /** @class */ (function (_super) {
        __extends(Scene05, _super);
        function Scene05() {
            var _this = _super.call(this) || this;
            _this.animationList = [];
            _this.on(Laya.Event.REMOVED, _this, _this.Destroy);
            H52D_Framework.InitSceneAnim(_this, "Scene05");
            if (H52D_Framework.IsNotBaiDuSdk()) {
                _this.baiduskd1.visible = true;
            }
            return _this;
        }
        Scene05.prototype.Destroy = function () {
            H52D_Framework.ClearViewResource(this.name);
            this.removeChildren();
        };
        return Scene05;
    }(ui.scene.Scene05UI));
    H52D_Framework.Scene05 = Scene05;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Scene05.js.map