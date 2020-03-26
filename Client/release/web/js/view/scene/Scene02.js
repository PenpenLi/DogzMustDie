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
    H52D_Framework.AddViewResource("Scene02", [
        { url: "res/ui/ui_scene02.atlas", type: Laya.Loader.ATLAS }
    ]);
    var Scene02 = /** @class */ (function (_super) {
        __extends(Scene02, _super);
        function Scene02() {
            var _this = _super.call(this) || this;
            _this.animationList = [];
            _this.on(Laya.Event.REMOVED, _this, _this.Destroy);
            H52D_Framework.InitSceneAnim(_this, "Scene02");
            return _this;
        }
        Scene02.prototype.Destroy = function () {
            H52D_Framework.ClearViewResource(this.name);
            this.removeChildren();
        };
        return Scene02;
    }(ui.scene.Scene02UI));
    H52D_Framework.Scene02 = Scene02;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Scene02.js.map