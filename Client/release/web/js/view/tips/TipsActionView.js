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
    H52D_Framework.AddViewResource("TipsActionView", [
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS }
    ]);
    var TipsActionView = /** @class */ (function (_super) {
        __extends(TipsActionView, _super);
        function TipsActionView(info) {
            var _this = _super.call(this) || this;
            var tname = info[1];
            var content = info[2];
            _this.txt_name.text = tname;
            var element = H52D_Framework.CreateHTMLDivElement(492, 305, 50, 64);
            H52D_Framework.SetHtmlStyle(element, 21, "#47474b", "left", true);
            element.innerHTML = content;
            _this.contentbg.addChild(element);
            _this.btn_close.on(Laya.Event.CLICK, _this, _this.ClickHander);
            return _this;
        }
        TipsActionView.prototype.ClickHander = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("TipsActionView", [H52D_Framework.ViewToppestRoot]);
            //播放点击按钮音效
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
        };
        return TipsActionView;
    }(ui.tips.TipsActionViewUI));
    H52D_Framework.TipsActionView = TipsActionView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=TipsActionView.js.map