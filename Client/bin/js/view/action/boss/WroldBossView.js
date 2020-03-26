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
    H52D_Framework.AddViewResource("WroldBossView", [
        { url: "res/ui/ui_pet.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_wroldboss.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_scene01.atlas", type: Laya.Loader.ATLAS },
    ]);
    /**世界boss入口 */
    var WroldBossView = /** @class */ (function (_super) {
        __extends(WroldBossView, _super);
        function WroldBossView() {
            var _this = _super.call(this) || this;
            _this._monsterAin = null;
            _this.titlebg.height = 39 + wxsclae;
            _this.Btn_Rank.y = _this.titlebg.height + 20;
            _this.Btn_reward.y = _this.titlebg.height + 20;
            _this.hurt_bg.y = _this.titlebg.height + 40;
            _this.ViewInit();
            return _this;
        }
        WroldBossView.prototype.ViewInit = function () {
            this.Addevent();
            this.ViewInfo();
        };
        WroldBossView.prototype.Addevent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.Btn_Rank.on(Laya.Event.CLICK, this, this.Btn_clickrank);
            this.Btn_Challenge.on(Laya.Event.CLICK, this, this.Btn_clickchallenge);
            this.Btn_Close.on(Laya.Event.CLICK, this, this.Btn_clickclose);
            this.Btn_reward.on(Laya.Event.CLICK, this, this.Btn_clickreward);
        };
        WroldBossView.prototype.ViewInfo = function () {
            H52D_Framework.WroldBossBuffView.once = 0;
            this.Boss_say.text = H52D_Framework.GetInfoAttr.Instance.GetText(7114);
            this.tatil.text = H52D_Framework.GetInfoAttr.Instance.GetText(5014);
            var monstor = H52D_Framework.MonstorConfig[99998];
            this._monsterAin = new H52D_Framework.Avatar(this.Boss_Icon);
            this._monsterAin.Load(monstor.strModelId, 1, monstor.modelScale * 1.5, 200, 550, Laya.Handler.create(this, function (monsterAins) {
                monsterAins.Play(1, true, true, function () {
                }, true);
            }));
            this.Boss_Name.text = H52D_Framework.GetInfoAttr.Instance.GetText(monstor.NameId);
            this.Hurt_max.text = "最高伤害:" + H52D_Framework.MasterPlayer.Instance.GetEventDayProByType(EventProEnum.NowBossRank);
            this.hurt_bg.width = (this.Hurt_max.width) * 1.1;
        };
        /**关闭界面 */
        WroldBossView.prototype.Btn_clickclose = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("WroldBossView", [H52D_Framework.ViewUpRoot]);
            H52D_Framework.Event.DispatchEvent("OnPanelClick", [E_OpenGrade.ACTION]);
        };
        /**打开排行榜 */
        WroldBossView.prototype.Btn_clickrank = function () {
            H52D_Framework.UIManager.Instance.CreateUI("RankView", [H52D_Framework.ViewUpRoot, 3, 9]);
        };
        WroldBossView.prototype.Btn_clickreward = function () {
            H52D_Framework.UIManager.Instance.CreateUI("WroldBossRewardView", [H52D_Framework.ViewUpRoot]);
        };
        /**挑战按钮的点击事件 */
        WroldBossView.prototype.Btn_clickchallenge = function () {
            H52D_Framework.WroldBossLogic.Instance.Fight();
        };
        WroldBossView.prototype.Destroy = function () {
            if (this._monsterAin) {
                this._monsterAin.Destroy();
                this._monsterAin = null;
            }
            this.offAll();
        };
        return WroldBossView;
    }(ui.action.boss.WroldBossViewUI));
    H52D_Framework.WroldBossView = WroldBossView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=WroldBossView.js.map