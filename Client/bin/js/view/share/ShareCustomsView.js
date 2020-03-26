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
    H52D_Framework.AddViewResource("ShareCustomsView", [
        { url: "res/ui/ui_share.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS }
    ]);
    /**
     * @class 分享邀请页面
     * @author zhangyusong
     **/
    var ShareCustomsView = /** @class */ (function (_super) {
        __extends(ShareCustomsView, _super);
        function ShareCustomsView(buf) {
            var _this = _super.call(this) || this;
            _this.order = buf[1];
            _this.ViewInit();
            _this.EventInit();
            return _this;
        }
        ShareCustomsView.prototype.ViewInit = function () {
            this.tx_title.text = "恭喜突破" + this.order.toString() + "关";
            var customsList = H52D_Framework.GameParamConfig.ShareRelationCustoms;
            var rewardList = H52D_Framework.GameParamConfig.ShareRelationCustomsReward;
            this.reward = 0;
            for (var i in customsList) {
                if (customsList[i] == this.order) {
                    this.reward = rewardList[i];
                    break;
                }
            }
            this.tx_reward.text = String(this.reward);
            this.strTex.text = H52D_Framework.GetInfoAttr.Instance.GetText(6034);
        };
        ShareCustomsView.prototype.EventInit = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_close.on(Laya.Event.CLICK, this, this.OnClosePanel);
            this.btn_share.on(Laya.Event.CLICK, this, this.OnSharePanel);
        };
        ShareCustomsView.prototype.Destroy = function () {
            this.offAll();
        };
        ShareCustomsView.prototype.OnClosePanel = function () {
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [H52D_Framework.ViewToppestRoot]);
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
        };
        /** 分享 */
        ShareCustomsView.prototype.OnSharePanel = function () {
            var _a;
            H52D_Framework.CallShare(H52D_Framework.ShareType.customs, (_a = {}, _a["id"] = this.order, _a));
            this.OnClosePanel();
        };
        return ShareCustomsView;
    }(ui.share.ShareCustomsViewUI));
    H52D_Framework.ShareCustomsView = ShareCustomsView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ShareCustomsView.js.map