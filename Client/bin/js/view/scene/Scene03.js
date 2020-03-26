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
    H52D_Framework.AddViewResource("Scene03", [
        { url: "res/ui/ui_scene03.atlas", type: Laya.Loader.ATLAS }
    ]);
    var Scene03 = /** @class */ (function (_super) {
        __extends(Scene03, _super);
        function Scene03() {
            var _this = _super.call(this) || this;
            _this.animationList = [];
            _this.on(Laya.Event.REMOVED, _this, _this.Destroy);
            H52D_Framework.InitSceneAnim(_this, "Scene03");
            return _this;
        }
        Scene03.prototype.Destroy = function () {
            H52D_Framework.ClearViewResource(this.name);
            this.removeChildren();
        };
        return Scene03;
    }(ui.scene.Scene03UI));
    H52D_Framework.Scene03 = Scene03;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Scene03.js.map