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
    var MainBossViewUI = ui.main.subinterface.MainBossViewUI;
    var path = "ui_icon/";
    /**
     * @class：
     * @author：zhangyusong
     */
    var MainBossView = /** @class */ (function (_super) {
        __extends(MainBossView, _super);
        function MainBossView() {
            var _this = _super.call(this) || this;
            _this.InitView();
            _this.InitEvent();
            return _this;
        }
        MainBossView.prototype.Destroy = function () {
            H52D_Framework.Event.RemoveEvent('BossCome', Laya.Handler.create(this, this.BossCome));
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.Btn_control));
        };
        /** 视图清理 */
        MainBossView.prototype.Clear = function () {
            this.BossClear();
        };
        MainBossView.prototype.InitView = function () {
            this.tips_boss.alpha = 0;
            // this.SetShopPetVisible(PetManager.Instance.HasTimes > 0);
        };
        MainBossView.prototype.InitEvent = function () {
            H52D_Framework.Event.RegistEvent('BossCome', Laya.Handler.create(this, this.BossCome, [true]));
            H52D_Framework.Event.RegistEvent('ChallengeBossFail', Laya.Handler.create(this, this.BossCome, [false]));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.Btn_control));
        };
        MainBossView.prototype.Btn_control = function () {
            var bool = H52D_Framework.WroldBossLogic.Instance.View_Control();
            this.tips_boss.visible = bool;
        };
        /** boss来袭 */
        MainBossView.prototype.BossCome = function (success) {
            var _this = this;
            this.tips_boss.alpha = 0;
            this.challenge_boss.visible = success;
            this.fail_boss.visible = !success;
            this.tween1 = Laya.Tween.to(this.tips_boss, { alpha: 1 }, 600, Laya.Ease.linearIn, Laya.Handler.create(this, function () {
                H52D_Framework.Tick.Once(1000, _this, function () {
                    _this.tween2 = Laya.Tween.to(_this.tips_boss, { alpha: 0 }, 1000, Laya.Ease.linearIn, Laya.Handler.create(_this, function () {
                        _this.BossClear();
                    }));
                });
            }));
            H52D_Framework.Tick.Once(3000, this, function () {
                _this.BossClear();
            });
            if (success) {
                H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/boss_appear.mp3");
            }
        };
        MainBossView.prototype.BossClear = function () {
            this.tips_boss.alpha = 0;
            if (this.tween1)
                Laya.Tween.clear(this.tween1);
            if (this.tween2)
                Laya.Tween.clear(this.tween2);
        };
        return MainBossView;
    }(MainBossViewUI));
    H52D_Framework.MainBossView = MainBossView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MainBossView.js.map