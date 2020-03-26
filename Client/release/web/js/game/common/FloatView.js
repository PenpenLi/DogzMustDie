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
    // 战斗伤害飘字
    var FloatView = /** @class */ (function (_super) {
        __extends(FloatView, _super);
        function FloatView(params) {
            var _this = _super.call(this) || this;
            _this.MOVE_TIME = 1100;
            _this.isCrit = false;
            _this.birthY = 0;
            _this.width = G_StageWidth;
            _this.height = G_StageHeight;
            var value = params[1];
            var dmgDegree = params[2];
            _this.hBox.x = params[3];
            _this.hBox.y = params[4];
            _this.isCrit = params[5];
            _this.birthY = params[6];
            _this.hBox.destroyChildren();
            _this.SetNumberClip(dmgDegree, value);
            _this.TweenMoveByCenter(dmgDegree);
            return _this;
        }
        FloatView.prototype.SetNumberClip = function (dmgDegree, value) {
            if (value <= 0) {
                return;
            }
            var damageMaxValue = 99999999999;
            if (value > damageMaxValue) {
                value = damageMaxValue;
            }
            var imagePath = "";
            if (dmgDegree == SkinEnum.SkinTap) {
                imagePath = "ui_common/img-dianji-shanghai.png";
            }
            else if (dmgDegree == SkinEnum.SkinHero) {
                imagePath = "ui_common/img-yingxiong-shanghai.png";
            }
            else if (dmgDegree == SkinEnum.SkinPet) {
                imagePath = "ui_common/img-chongwu-shanghai.png";
            }
            else if (dmgDegree == SkinEnum.SkinCamp) {
                imagePath = "ui_common/img-dachuan-shanghai.png";
            }
            else if (dmgDegree == SkinEnum.RewardCoin) {
                imagePath = "ui_common/img-jinbi-shanghai.png";
            }
            else if (dmgDegree == SkinEnum.SkinHP) {
                imagePath = "ui_common/img-xixue-shanghai.png";
            }
            var str = value.toString();
            for (var i = 0; i < str.length; i++) {
                var clip = this["clip" + i];
                clip.index = Number(str[i]);
                clip.visible = true;
                clip.skin = imagePath;
                this.hBox.addChild(clip);
                clip.x = this.hBox._childs.length;
            }
        };
        // 缓动
        FloatView.prototype.TweenMoveByCenter = function (dmgDegree) {
            var _this = this;
            if (!this.isCrit && dmgDegree != SkinEnum.RewardCoin) {
                this.hBox.scale(0.7, 0.7);
            }
            if (dmgDegree == SkinEnum.RewardCoin) {
                this.hBox.scale(0.6, 0.6);
            }
            var random_x = Math.random() * 20 - 5 >> 0;
            this.hBox.x += random_x;
            var random_y = Math.random() * this.birthY >> 0;
            this.hBox.y -= random_y;
            H52D_Framework.TweenList.to(this, this.hBox, { y: this.hBox.y - 250 }, this.MOVE_TIME, function () {
                _this.hBox.y = _this.hBox.y - 250;
                _this.TweenComplete();
            });
            H52D_Framework.TweenList.to(this, this.hBox, { alpha: 0 }, 500, function () { _this.hBox.alpha = 0; }, this.MOVE_TIME - 500);
            H52D_Framework.Tick.Once(10, this, function () {
                if (_this.hBox.y > _this.hBox.y - 5) {
                    H52D_Framework.TweenList.to(_this, _this.hBox, { y: _this.hBox.y - 250 }, _this.MOVE_TIME, function () {
                        _this.hBox.y = _this.hBox.y - 250;
                        _this.TweenComplete();
                    });
                }
            });
        };
        FloatView.prototype.TweenComplete = function () {
            this.hBox.alpha = 0;
            Laya.Tween.clearAll(this);
            H52D_Framework.UIManager.Instance.DestroyUI(this, [H52D_Framework.ViewDownRoot]);
        };
        return FloatView;
    }(ui.common.FloatViewUI));
    H52D_Framework.FloatView = FloatView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=FloatView.js.map