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
    H52D_Framework.AddViewResource("ShareHeroView", [
        { url: "res/ui/ui_share.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS }
    ]);
    /**
     * @class 分享英雄页面
     * @author zhangyusong
     **/
    var ShareHeroView = /** @class */ (function (_super) {
        __extends(ShareHeroView, _super);
        function ShareHeroView(buf) {
            var _this = _super.call(this) || this;
            _this.heroAni = null;
            _this.heroId = buf[1];
            _this.ViewInit();
            _this.EventInit();
            return _this;
        }
        ShareHeroView.prototype.ViewInit = function () {
            this.tx_levelup.text = H52D_Framework.GetInfoAttr.Instance.GetText(6024);
            this.nameTex.text = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.HeroConfig[this.heroId].name);
            var tcfg_hero = H52D_Framework.HeroConfig[this.heroId];
            var pos = tcfg_hero.position;
            var model = H52D_Framework.HeroConfig[this.heroId].strFacadeModel;
            this.heroAni = new H52D_Framework.Avatar(this.exhero);
            this.heroAni.Load(tcfg_hero.strFacadeModel, 1, tcfg_hero.modelScale * 2.6, pos[1], pos[2], Laya.Handler.create(this, function (heroAins) {
                heroAins.Play(1, true, true, function () {
                }, true);
            }));
        };
        ShareHeroView.prototype.EventInit = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_close.on(Laya.Event.CLICK, this, this.OnClosePanel);
            this.btn_share.on(Laya.Event.CLICK, this, this.OnSharePanel);
        };
        ShareHeroView.prototype.Destroy = function () {
            this.offAll();
            if (this.heroAni) {
                this.heroAni.Destroy();
                this.heroAni = null;
            }
        };
        ShareHeroView.prototype.OnClosePanel = function () {
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [H52D_Framework.ViewToppestRoot]);
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
        };
        /** 分享 */
        ShareHeroView.prototype.OnSharePanel = function () {
            var _a;
            H52D_Framework.CallShare(H52D_Framework.ShareType.hero, (_a = {}, _a["id"] = this.heroId, _a));
            this.OnClosePanel();
        };
        return ShareHeroView;
    }(ui.share.ShareHeroViewUI));
    H52D_Framework.ShareHeroView = ShareHeroView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ShareHeroView.js.map