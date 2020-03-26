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
    H52D_Framework.AddViewResource("KickingResultView", [
        { url: "res/ui/ui_kicking.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
    ]);
    var KickingResultView = /** @class */ (function (_super) {
        __extends(KickingResultView, _super);
        function KickingResultView(buff) {
            var _this = _super.call(this) || this;
            _this.txResult_w = "本局胜利";
            _this.txResult_l = "本局失败";
            _this.txResult_r = "本局平局";
            _this.time = 10;
            _this.star = buff[1];
            _this.win = buff[2];
            _this.type = buff[3];
            _this.money = buff[4];
            _this.InitView();
            _this.InitEvent();
            return _this;
        }
        KickingResultView.prototype.InitView = function () {
            if (this.win == 2) { //失败
                this.fight_logo.skin = "ui_kicking/img-shibai-pvp.png";
                this.fight_bg.gray = true; //橙色背景板
                this.fight_bg_icon.gray = true; //背景板下的图案
                this.fight_result.text = this.txResult_l;
                this.item_num.text = "-" + this.money;
                this.item_result.text = H52D_Framework.GetInfoAttr.Instance.GetText(7062);
            }
            else {
                if (this.win == 1) { //胜利
                    var Item_rew = H52D_Framework.GameParamConfig.StarData;
                    this.fight_logo.skin = "ui_kicking/img-shengli-pvp.png";
                    if (this.star > 1) {
                        this.fight_result.text = this.star + "星，获得" + Item_rew[4 - this.star][3] + "倍奖励";
                    }
                    else {
                        this.fight_result.text = this.star + "星，获得基础奖励";
                    }
                    this.item_num.text = "+" + this.money;
                    this.item_result.text = String(H52D_Framework.GetInfoAttr.Instance.GetText(7061)).replace("%s", 10 + "%");
                    this.fight_win.visible = true;
                }
                else if (this.win == 0) { //平局
                    this.fight_logo.skin = "ui_kicking/img-pingju-pvp.png";
                    this.fight_result.text = this.txResult_r;
                    this.item_num.text = "无奖励";
                    this.item_result.text = H52D_Framework.GetInfoAttr.Instance.GetText(7063);
                }
                this.fight_bg.gray = false;
                this.fight_bg_icon.gray = false; //背景板下的图案
            }
            this.Start_Color(1, this.star);
            //战斗中获得的道具 名字
            this.item_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.ItemConfig[this.type].dwItemName);
            this.item_name.color = H52D_Framework.BaseDefine.LabelColor1[H52D_Framework.ItemConfig[this.type]["dwItemQuality"]];
            //战斗中获得的道具品质背景 
            this.item_pinzhi.skin = H52D_Framework.BaseDefine.HeroQualityList[H52D_Framework.ItemConfig[this.type].dwItemQuality];
            this.item_icon.skin = "ui_icon/" + H52D_Framework.ItemConfig[this.type].strIconID_B;
            this.fight_war.array = H52D_Framework.KickingLogic.Instance.GetwarInfo();
            this.fight_war.renderHandler = new Laya.Handler(this, this.Handler);
        };
        KickingResultView.prototype.Start_Color = function (start, num) {
            var _this = this;
            var key = start;
            this["start_" + key].skin = "ui_kicking/img-shengli-xingxing-pvp.png";
            this["start_" + key].scale(3, 3);
            Laya.Tween.to(this["start_" + key], { scaleX: 1, scaleY: 1 }, 200, null, Laya.Handler.create(this, function () {
                key++;
                if (key <= num) {
                    _this.Start_Color(key, num);
                }
            }));
        };
        KickingResultView.prototype.InitEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_receive.on(Laya.Event.CLICK, this, this.Btn_click_receive);
            H52D_Framework.Tick.Loop(1000, this, this.CountDown);
        };
        KickingResultView.prototype.Handler = function (item, index) {
            var nhero_Id = this.fight_war.array[index];
            var n_tcfg = H52D_Framework.HeroConfig[nhero_Id];
            var hero_bg = item.getChildByName("hero_bg");
            var hero_icon = item.getChildByName("hero_icon");
            hero_bg.skin = H52D_Framework.BaseDefine.QualityList[n_tcfg.quality];
            hero_icon.skin = "ui_icon/" + n_tcfg.strIcon;
        };
        KickingResultView.prototype.Btn_click_receive = function () {
            H52D_Framework.BattlefieldManager.Instance.Destroy();
            H52D_Framework.Event.DispatchEvent("DeputyClose");
            H52D_Framework.UIManager.Instance.DestroyUI("KickingResultView", [H52D_Framework.ViewToppestRoot]);
            H52D_Framework.KickingLogic.Instance.Win_alawys();
        };
        KickingResultView.prototype.CountDown = function () {
            this.time--;
            var str = "(" + this.time.toString() + "s后自动退出)";
            this.fight_quittime.text = str;
            if (this.time == 0) {
                this.Btn_click_receive();
                H52D_Framework.Tick.Clear(this, this.CountDown);
            }
        };
        KickingResultView.prototype.Destroy = function () {
            H52D_Framework.HeroPosition.Instance.Puthero = [];
            this.offAll();
            H52D_Framework.Tick.Clear(this, this.CountDown);
        };
        return KickingResultView;
    }(ui.action.kicking.KickingResultViewUI));
    H52D_Framework.KickingResultView = KickingResultView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=KickingResultView.js.map