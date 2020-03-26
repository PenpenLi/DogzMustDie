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
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("SkillNameView", [
        { url: "res/ui/ui_skillname.atlas", type: Laya.Loader.ATLAS }
    ]);
    var SkillNameView = /** @class */ (function (_super) {
        __extends(SkillNameView, _super);
        function SkillNameView(params) {
            var _this = _super.call(this) || this;
            _this.width = G_StageWidth;
            _this.height = G_StageHeight;
            var name = params[1];
            _this.SName.x = params[2];
            _this.SName.y = params[3];
            var x = name.length;
            switch (x) {
                case 6:
                    _this.SName.width = 76;
                    break;
                case 7:
                    _this.SName.width = 107;
                    break;
                case 8:
                    _this.SName.width = 136;
                    break;
            }
            _this.SName.skin = "ui_skillname/" + name;
            _this.SName.visible = true;
            _this.SName.alpha = 1;
            H52D_Framework.TweenList.to(_this, _this.SName, { alpha: 1 }, 200, function () {
                H52D_Framework.Tick.Once(700, _this, function () {
                    H52D_Framework.TweenList.to(_this, _this.SName, { alpha: 0 }, 200, function () {
                        _this.Destroy();
                    });
                });
            });
            return _this;
        }
        SkillNameView.prototype.Destroy = function () {
            this.SName.alpha = 0;
            Laya.Tween.clearAll(this);
            H52D_Framework.UIManager.Instance.DestroyUI(this, [H52D_Framework.ViewDownRoot]);
        };
        return SkillNameView;
    }(ui.common.SkillNameUI));
    H52D_Framework.SkillNameView = SkillNameView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=SkillNameView.js.map