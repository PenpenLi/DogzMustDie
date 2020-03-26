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
    var TipsView = /** @class */ (function (_super) {
        __extends(TipsView, _super);
        function TipsView(params) {
            var _this = _super.call(this) || this;
            _this._time = 1;
            H52D_Framework.SetHtmlStyle(_this.msgLabel, 25, "#ffffff", "center", true);
            _this.msgLabel.style.wordWrap = false;
            var object = params[1];
            _this._time = object[2] ? object[2] : 1;
            if (!object) {
                _this.OnDestroy();
                return _this;
            }
            _this.msgLabel.innerHTML = object[1];
            _this.msgLabel.width = _this.msgLabel.contextWidth;
            _this.imageBg.width = _this.msgLabel.contextWidth + 100;
            _this.imageBg.visible = true;
            _this.TweenFade(_this.imageBg);
            return _this;
        }
        TipsView.prototype.TweenFade = function (image) {
            var _this = this;
            this._posY = image.y;
            H52D_Framework.TweenList.to(this, image, { y: this._posY - 200 }, 1500 * this._time, function () { image.y = _this._posY - 200; });
            H52D_Framework.TweenList.to(this, image, { alpha: 0 }, 800 * this._time, function () { image.alpha = 0; }, 700 * this._time);
            H52D_Framework.Tick.Once(1510 * this._time, this, this.OnDestroy);
        };
        TipsView.prototype.OnDestroy = function () {
            this.offAll();
            H52D_Framework.Tick.ClearAll(this);
            Laya.Tween.clearAll(this);
            H52D_Framework.UIManager.Instance.DestroyUI(this, [H52D_Framework.ViewToppestRoot]);
        };
        return TipsView;
    }(ui.tips.TipsViewUI));
    H52D_Framework.TipsView = TipsView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=TipsView.js.map