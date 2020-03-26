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
    H52D_Framework.AddViewResource("InvitationCustemsView", [
        { url: "res/ui/ui_chat.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_share.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS },
    ]);
    /**
     * @class 分享邀请页面
     * @author zhangyusong
     **/
    var InvitationCustomsView = /** @class */ (function (_super) {
        __extends(InvitationCustomsView, _super);
        function InvitationCustomsView(buf) {
            var _this = _super.call(this) || this;
            //奥特鳗
            _this.heroId = 119;
            _this.type = buf[1];
            _this.ViewInit();
            _this.EventInit();
            return _this;
        }
        InvitationCustomsView.prototype.ViewInit = function () {
            var _this = this;
            H52D_Framework.SetHtmlStyle(this.tx_num, 20, "#491a0b", "right", true);
            H52D_Framework.SetHtmlStyle(this.tx_content, 20, "#491a0b", "left", true);
            this.tx_title.text = this.type == 0 ? "助力通关" : "助力邀请";
            this.btn_customs.label = this.type == 0 ? "即刻通关" : "即刻邀请";
            var daynum = H52D_Framework.MasterPlayer.Instance.dayInviteNum;
            var totlenum = H52D_Framework.GameParamConfig["HelpPassNeedPlayerNum"];
            this.tx_num.innerHTML = "今日已成功邀请人数：<font color='#4e9d3a'>" + daynum + "</font>/" + totlenum + "人";
            this.tx_content.innerHTML = H52D_Framework.GetInfoAttr.Instance.GetText(this.type == 0 ? 6029 : 6028);
            this.heroModle = new H52D_Framework.Avatar(this.hero_icon);
            this.heroModle.Load(H52D_Framework.HeroConfig[this.heroId].strFacadeModel, 1, 0.21, 48, 168, Laya.Handler.create(this, function () { _this.heroModle.Play(1, true, true, null, true); }));
        };
        InvitationCustomsView.prototype.EventInit = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_close.on(Laya.Event.CLICK, this, this.OnClosePanel);
            this.btn_customs.on(Laya.Event.CLICK, this, this.OnCustomsHander);
        };
        InvitationCustomsView.prototype.Destroy = function () {
            this.offAll();
            if (this.heroModle) {
                this.heroModle.Destroy();
                this.heroModle = null;
            }
        };
        InvitationCustomsView.prototype.OnClosePanel = function () {
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [H52D_Framework.ViewToppestRoot]);
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
        };
        /** 即可通关事件 */
        InvitationCustomsView.prototype.OnCustomsHander = function () {
            if (this.type == 0) {
                //使用过直通特权
                H52D_Framework.MasterPlayer.Instance.invitadunFlag++;
                H52D_Framework.TipsLogic.Instance.OpenSystemTips(30039);
                H52D_Framework.CustomsManager.Instance.CustomsThrough();
            }
            this.OnClosePanel();
        };
        return InvitationCustomsView;
    }(ui.share.InvitationCustomsViewUI));
    H52D_Framework.InvitationCustomsView = InvitationCustomsView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=InvitationCustomsView.js.map