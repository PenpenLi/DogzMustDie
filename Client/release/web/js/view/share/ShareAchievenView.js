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
    H52D_Framework.AddViewResource("ShareAchievenView", [
        { url: "res/ui/ui_share.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
    ]);
    //领取方式
    var AchiDrawType;
    (function (AchiDrawType) {
        AchiDrawType[AchiDrawType["eShareDraw"] = 0] = "eShareDraw";
        AchiDrawType[AchiDrawType["eAchievementDraw"] = 1] = "eAchievementDraw";
    })(AchiDrawType = H52D_Framework.AchiDrawType || (H52D_Framework.AchiDrawType = {}));
    /**
     * @class 分享邀请页面
     * @author zhangyusong
     **/
    var ShareAchievenView = /** @class */ (function (_super) {
        __extends(ShareAchievenView, _super);
        function ShareAchievenView(buf) {
            var _this = _super.call(this) || this;
            _this.type = buf[1];
            _this.eventId = buf[2];
            _this.ViewInit();
            _this.EventInit();
            return _this;
        }
        ShareAchievenView.prototype.ViewInit = function () {
            var achieven = null;
            for (var key in H52D_Framework.AchievenManger.Instance.achievenMission) {
                if (H52D_Framework.AchievenManger.Instance.achievenMission[key].eventId == this.eventId) {
                    achieven = H52D_Framework.AchievenManger.Instance.achievenMission[key];
                }
            }
            this.tx_content.text = H52D_Framework.GetInfoAttr.Instance.GetText(6025);
            if (achieven) {
                this.tx_nosharenum.text = String(achieven.reward);
                this.tx_sharenum.text = String(achieven.reward * 2);
            }
        };
        ShareAchievenView.prototype.EventInit = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_close.on(Laya.Event.CLICK, this, this.OnClosePanel);
            //直接领取
            this.btn_receive.on(Laya.Event.CLICK, this, this.OnReceivePanel);
            //分享领取
            this.btn_share.on(Laya.Event.CLICK, this, this.OnSharePanel);
        };
        ShareAchievenView.prototype.Destroy = function () {
            this.offAll();
        };
        ShareAchievenView.prototype.OnClosePanel = function () {
            //播放点击音效
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [H52D_Framework.ViewToppestRoot]);
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
        };
        /** 直接领取 */
        ShareAchievenView.prototype.OnReceivePanel = function () {
            this.OnClosePanel();
            H52D_Framework.AchievenManger.Instance.K_ReqAchievementAward(this.eventId);
        };
        /** 分享领取 */
        ShareAchievenView.prototype.OnSharePanel = function () {
            var _a;
            H52D_Framework.CallShare(H52D_Framework.ShareType.achieven, (_a = {}, _a["id"] = this.type, _a["eventId"] = this.eventId, _a));
            this.OnClosePanel();
        };
        return ShareAchievenView;
    }(ui.share.ShareAchievenViewUI));
    H52D_Framework.ShareAchievenView = ShareAchievenView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ShareAchievenView.js.map