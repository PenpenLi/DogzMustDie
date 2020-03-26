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
    var NoticeView = /** @class */ (function (_super) {
        __extends(NoticeView, _super);
        function NoticeView() {
            var _this = _super.call(this) || this;
            _this._msg = "";
            H52D_Framework.SetHtmlStyle(_this.noticeLabel, 30, "#ffffff", "left", true);
            _this.noticeLabel.style.wordWrap = false;
            _this.noticeLabel.style.stroke = 2;
            _this.noticeLabel.style.strokeColor = "#000000";
            // Tick.Loop(1000, this, this.Update);
            Laya.timer.loop(1, _this, _this.NewUpdate);
            _this.on(Laya.Event.REMOVED, _this, _this.Destroy);
            _this.noticeLabel.x = -10000000;
            return _this;
        }
        NoticeView.prototype.Destroy = function () {
            this.offAll();
            // Tick.ClearAll(this);
            // Laya.Tween.clearAll(this);
        };
        NoticeView.prototype.NewUpdate = function () {
            this.noticeLabel.x -= 5;
            var targetX = this.noticeLabel.x + this.noticeLabel.contextWidth + 10;
            if (targetX < 0) {
                this._msg = H52D_Framework.NoticeLogic.Inst.GetNoticeMsg();
                if (this._msg != "") {
                    this.noticeLabel.innerHTML = this._msg;
                    if (this.noticeLabel._childs.length > 0 && this.noticeLabel.contextWidth > 5) {
                        this.noticeLabel.x = 760;
                        this.noticeLabel.visible = true;
                        this.htmlBg.visible = true;
                    }
                    else {
                        this.noticeLabel.visible = false;
                        this.htmlBg.visible = false;
                    }
                }
                else {
                    this.noticeLabel.visible = false;
                    this.htmlBg.visible = false;
                }
            }
        };
        return NoticeView;
    }(ui.main.subinterface.NoticeViewUI));
    H52D_Framework.NoticeView = NoticeView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=NoticeView.js.map