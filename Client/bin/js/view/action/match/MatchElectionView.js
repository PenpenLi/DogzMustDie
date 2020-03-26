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
    H52D_Framework.AddViewResource("MatchElectionView", [
        { url: "res/ui/ui_pet.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_wroldboss.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_scene01.atlas", type: Laya.Loader.ATLAS },
    ]);
    /** 海选界面： */
    var MatchElectionView = /** @class */ (function (_super) {
        __extends(MatchElectionView, _super);
        function MatchElectionView() {
            var _this = _super.call(this) || this;
            _this._monsterAin = null;
            _this.ViewInit();
            return _this;
        }
        MatchElectionView.prototype.ViewInit = function () {
            this.ViewInfo();
            this.Addevent();
            //Tick.Loop(50, this, this.ChangeAlpha);
        };
        MatchElectionView.prototype.Addevent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.Btn_Rank.on(Laya.Event.CLICK, this, this.Btn_clickrank);
            this.Btn_war.on(Laya.Event.CLICK, this, this.Btn_OpenWar);
            this.Btn_Challenge.on(Laya.Event.CLICK, this, this.Btn_clickchallenge);
            this.Btn_Close.on(Laya.Event.CLICK, this, this.Btn_clickclose);
            this.Btn_pet.on(Laya.Event.CLICK, this, this.Btn_OpenPet);
        };
        MatchElectionView.prototype.ViewInfo = function () {
            //this.tatil.text = GetInfoAttr.Instance.GetText(5014);
            var monstor = H52D_Framework.MonstorConfig[99997];
            this.Boss_Name.text = H52D_Framework.GetInfoAttr.Instance.GetText(monstor.NameId);
            this._monsterAin = new H52D_Framework.Avatar(this.Boss_Icon);
            this._monsterAin.Load(monstor.strModelId, 1, monstor.modelScale * 1.5, 200, 550, Laya.Handler.create(this, function (monsterAins) {
                monsterAins.Play(1, true, true, function () {
                }, true);
            }));
            this.Btn_Rank.visible = true;
            //this.Boss_say.text = GetInfoAttr.Instance.GetText(7114);
            this.Boss_say.text = "每天不限次数挑战boss，伤害最高的一次参与排名";
            //RankLogic.Instance.K_RankDataReq(RankEnum.NowBossRank, 1, 100);
            if (H52D_Framework.MainActionLogic.Instance.hasMatch) {
                this.BtnText.text = "再次挑战";
            }
            else {
                this.Btn_Rank.visible = false;
            }
            //倒计时
            this.ShowTime();
            H52D_Framework.Tick.Loop(1000, this, this.ShowTime);
        };
        MatchElectionView.prototype.ChangeAlpha = function () {
            this.rootLabel.alpha += 0.15;
            if (this.rootLabel.alpha >= 1) {
                this.rootLabel.alpha = 1;
                H52D_Framework.Tick.Clear(this, this.ChangeAlpha);
            }
        };
        MatchElectionView.prototype.ShowTime = function () {
            var dayOfTheWeek = H52D_Framework.Time.serverTime.getDay();
            var dayAllSeconds = 86400;
            var todaySeconds = (H52D_Framework.Time.serverSecodes + 8 * 3600) % dayAllSeconds; //加上8小时时区差
            this.surplusSecond = (6 - dayOfTheWeek) * dayAllSeconds + (19.5 * 60 * 60) - todaySeconds;
            if (this.surplusSecond <= 0 && !H52D_Framework.MatchLogic.Instance.isAllredaySendOpen) {
                this.surplusSecond = 0;
                H52D_Framework.MatchLogic.Instance.isAllredaySendOpen = true;
                H52D_Framework.Tick.Once(1000, this, function () {
                    H52D_Framework.MatchLogic.Instance.OpenMatchUI();
                });
            }
            this.Time.text = H52D_Framework.GetFormatTime(this.surplusSecond) + "进入16强点赞";
        };
        /**关闭界面 */
        MatchElectionView.prototype.Btn_clickclose = function () {
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [this.parent]);
        };
        /**打开排行榜 */
        MatchElectionView.prototype.Btn_clickrank = function () {
            //MatchLogic.Instance.K_ReqLeagueHitRank();
            H52D_Framework.RankLogic.Instance.K_RankDataReq(RankEnum.PKLeagueHit, 1, 100);
        };
        /**挑战按钮的点击事件 */
        MatchElectionView.prototype.Btn_clickchallenge = function () {
            H52D_Framework.MatchLogic.Instance.BossFight();
        };
        /**打开布阵 */
        MatchElectionView.prototype.Btn_OpenWar = function () {
            H52D_Framework.UIManager.Instance.CreateUI("MatchWarView", [H52D_Framework.ViewUpRoot, H52D_Framework.ActionType.match]);
        };
        /**打开宠物布阵 */
        MatchElectionView.prototype.Btn_OpenPet = function () {
            H52D_Framework.UIManager.Instance.CreateUI("KickingPetView", [H52D_Framework.ViewUpRoot, H52D_Framework.ActionType.match]);
        };
        MatchElectionView.prototype.Destroy = function () {
            if (this._monsterAin) {
                this._monsterAin.Destroy();
                this._monsterAin = null;
            }
            this.offAll();
            H52D_Framework.Tick.ClearAll(this);
        };
        return MatchElectionView;
    }(ui.action.match.MatchElectionViewUI));
    H52D_Framework.MatchElectionView = MatchElectionView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MatchElectionView.js.map