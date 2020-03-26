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
    H52D_Framework.AddViewResource("InitialHeroView", [
        { url: "res/ui/ui_login.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_noPack/ui-daguo-bgziyuanfuben.png", type: Laya.Loader.IMAGE },
    ]);
    var InitialHeroView = /** @class */ (function (_super) {
        __extends(InitialHeroView, _super);
        function InitialHeroView(buff) {
            var _this = _super.call(this) || this;
            _this.localList = [[142, 666], [376, 696], [610, 666]];
            _this.castingTime = 0;
            _this.surplus = 0;
            _this.heroNum = -1;
            _this.txtSurplus = "进入游戏：xs";
            _this.callback = buff[1];
            _this.ViewInit();
            _this.EventInit();
            return _this;
        }
        InitialHeroView.prototype.ViewInit = function () {
            // Wx.aldSendEvent("选择英雄");
            this.surplus = this.castingTime = Number(H52D_Framework.GameParamConfig["CastingTime"]);
            this.heroList = [];
            for (var profid in H52D_Framework.CastingConfig) {
                this.heroList.push(Number(profid));
            }
            this.bg.skin = "res/ui/ui_noPack/ui-daguo-bgziyuanfuben.png";
            this.txt_information.text = H52D_Framework.GetInfoAttr.Instance.GetText(7156);
            this.LoadHero(0);
            this.LoadHero(1);
            this.LoadHero(2);
            this.OnChooseHero(1);
            this.SurplusTime();
            H52D_Framework.Tick.Loop(1000, this, this.SurplusTime);
        };
        InitialHeroView.prototype.SurplusTime = function () {
            if (this.surplus > 0) {
                this.txt_time.text = this.txtSurplus.replace("x", this.surplus.toString());
                this.surplus--;
            }
            else {
                H52D_Framework.Tick.Clear(this, this.SurplusTime);
                this.OnDefineHero();
            }
        };
        InitialHeroView.prototype.LoadHero = function (num) {
            var panel = this["hero_" + num].getChildByName("img_bg");
            var tcfg_hero = H52D_Framework.HeroConfig[this.heroList[num]];
            var pos = tcfg_hero.position;
            var modle = new H52D_Framework.Avatar(panel);
            modle.Load(tcfg_hero.strFacadeModel, 1, tcfg_hero.modelScale * 2.0, pos[1] - 60, pos[2] - 120, Laya.Handler.create(this, function () {
                modle.Play(H52D_Framework.AnimationName.idle, true, true, function () {
                }, true);
            }));
        };
        InitialHeroView.prototype.EventInit = function () {
            this.hero_0.on(Laya.Event.CLICK, this, this.OnChooseHero, [0]);
            this.hero_1.on(Laya.Event.CLICK, this, this.OnChooseHero, [1]);
            this.hero_2.on(Laya.Event.CLICK, this, this.OnChooseHero, [2]);
            this.btn_define.on(Laya.Event.CLICK, this, this.OnDefineHero);
        };
        InitialHeroView.prototype.OnChooseHero = function (num) {
            if (this.heroNum == num) {
                return;
            }
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/ui_buzhen02.mp3");
            this.surplus = this.castingTime;
            this.SurplusTime();
            if (this["hero_" + this.heroNum]) {
                this["hero_" + this.heroNum].scaleX = 1.0;
                this["hero_" + this.heroNum].scaleY = 1.0;
            }
            var left = 0;
            var right = 0;
            if (num == 0) {
                left = 2;
                right = 1;
            }
            else if (num == 1) {
                left = 0;
                right = 2;
            }
            else if (num == 2) {
                left = 1;
                right = 0;
            }
            Laya.Tween.to(this["hero_" + num], { scaleX: 1.6, scaleY: 1.6, x: this.localList[1][0], y: this.localList[1][1] }, 200);
            Laya.Tween.to(this["hero_" + left], { scaleX: 1, scaleY: 1, x: this.localList[0][0], y: this.localList[0][1] }, 200);
            Laya.Tween.to(this["hero_" + right], { scaleX: 1, scaleY: 1, x: this.localList[2][0], y: this.localList[2][1] }, 200);
            this.txt_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.HeroConfig[this.heroList[num]].name);
            this.txt_introduce.text = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.HeroConfig[this.heroList[num]].heroOrigin);
            this.txt_introduce.alpha = 0;
            this.txt_introduce.y = 880;
            Laya.Tween.to(this.txt_introduce, { y: 850, alpha: 1 }, 100);
            this.heroNum = num;
        };
        /** 选定英雄，关闭窗口 */
        InitialHeroView.prototype.OnDefineHero = function () {
            var _this = this;
            this.callback(this.heroList[this.heroNum]);
            // Wx.aldSendEvent("选择英雄成功（注册成功）");
            H52D_Framework.Tick.Once(500, this, function () {
                Laya.Tween.to(_this, { "alpha": 0 }, 400, Laya.Ease.linearInOut, Laya.Handler.create(_this, function () {
                    H52D_Framework.UIManager.Instance.DestroyUI(_this.name, [_this.parent]);
                }));
            });
        };
        return InitialHeroView;
    }(ui.login.InitialHeroViewUI));
    H52D_Framework.InitialHeroView = InitialHeroView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=InitialHeroView.js.map