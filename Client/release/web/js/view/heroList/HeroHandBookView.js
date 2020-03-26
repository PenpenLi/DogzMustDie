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
    var HeroHandBookView = /** @class */ (function (_super) {
        __extends(HeroHandBookView, _super);
        function HeroHandBookView(buf) {
            var _this = _super.call(this) || this;
            _this.ViewInit();
            return _this;
        }
        HeroHandBookView.prototype.ViewInit = function () {
            this.ViewEvent();
            this.single_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(5025);
            this.most_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(5026);
            this.UpdateRedPoint();
            H52D_Framework.Tick.Loop(100, this, this.UpdateRedPoint);
            H52D_Framework.HeroHandbookManager.Instance.IsTrue = true;
        };
        HeroHandBookView.prototype.ViewEvent = function () {
            this.HeroHand_single.on(Laya.Event.CLICK, this, this.Btnclick_hand, [H52D_Framework.HeroHandbookManager.Instance.ViewName[1]]);
            this.HeroHand_most.on(Laya.Event.CLICK, this, this.Btnclick_hand, [H52D_Framework.HeroHandbookManager.Instance.ViewName[2]]);
            this.Btnclick_hand(H52D_Framework.HeroHandbookManager.Instance.ViewName[1]);
            H52D_Framework.Event.RegistEvent("reshhandviewred", Laya.Handler.create(this, this.UpdateRedPoint));
            H52D_Framework.Event.DispatchEvent("ShowMaxBtn", [true]);
        };
        HeroHandBookView.prototype.Btnclick_hand = function (child) {
            var _this = this;
            this._child = child;
            var ShowView = Laya.Handler.create(this, function () {
                if (child == H52D_Framework.HeroHandbookManager.Instance.ViewName[1]) {
                    _this.single_bg.bgColor = "#4f445c";
                    _this.single_name.color = "#ced0d6";
                    _this.most_bg.bgColor = "#443e4c";
                    _this.most_name.color = "#a9b3cd";
                }
                else {
                    _this.single_bg.bgColor = "#443e4c";
                    _this.single_name.color = "#a9b3cd";
                    _this.most_bg.bgColor = "#4f445c";
                    _this.most_name.color = "#ced0d6";
                }
                H52D_Framework.UIManager.Instance.CreateUI(child, [_this, _this], Laya.Handler.create(_this, function (view) {
                    if (_this.destroyed) {
                        view.destroy(true);
                    }
                    else {
                        if (_this.ChildBox._childs[0]) {
                            _this.ChildBox._childs[0].OnDestroy();
                        }
                        _this.ChildBox.destroyChildren();
                        _this.ChildBox.addChild(view);
                    }
                }));
            });
            ShowView.run();
        };
        HeroHandBookView.prototype.UpdateRedPoint = function () {
            H52D_Framework.HeroHandbookManager.Instance.Red_Show();
            this.Single_red.visible = H52D_Framework.HeroHandbookManager.Instance.HandSingleShow;
            this.Most_red.visible = H52D_Framework.HeroHandbookManager.Instance.HandMostShow;
        };
        HeroHandBookView.prototype.OnDestroy = function () {
            this.offAll();
            if (this.ChildBox._childs[0]) {
                this.ChildBox._childs[0].OnDestroy();
            }
            this.ChildBox.destroyChildren();
            H52D_Framework.Event.RemoveEvent("reshhandviewred", Laya.Handler.create(this, this.UpdateRedPoint));
        };
        return HeroHandBookView;
    }(ui.heroList.HeroHandBookViewUI));
    H52D_Framework.HeroHandBookView = HeroHandBookView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=HeroHandBookView.js.map