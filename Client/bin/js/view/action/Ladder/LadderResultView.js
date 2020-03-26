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
    H52D_Framework.AddViewResource("LadderResultView", [
        { url: "res/ui/ui_ladder.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_icon.atlas", type: Laya.Loader.ATLAS },
    ]);
    var LadderResultView = /** @class */ (function (_super) {
        __extends(LadderResultView, _super);
        function LadderResultView(buf) {
            var _this = _super.call(this) || this;
            _this._time = 10;
            _this.start_Num = buf[1];
            _this._result = buf[2];
            _this._resu_item = buf[3];
            _this.ViewInit();
            return _this;
        }
        LadderResultView.prototype.ViewInit = function () {
            this.IsWin(this._result);
            this.ViewEvent();
            this.Setladdresult_list();
            H52D_Framework.Tick.Loop(1000, this, this.CountDown);
        };
        LadderResultView.prototype.IsWin = function (Id) {
            var star_nx = 4 - this.start_Num;
            star_nx = star_nx == 3 ? 1 : star_nx;
            var mins = H52D_Framework.GameParamConfig.LadderStarData[star_nx][3];
            var min_num = H52D_Framework.GameParamConfig.VictoryBasicIntegral * mins;
            if (Id == 0) {
                this.result_logo_icon.skin = "ui_kicking/img-pingju-pvp.png";
                this.start_num.text = "我方评星:" + this.start_Num + "星";
                this.min_num.text = "积分:0";
            }
            if (Id == 1) {
                this.result_logo_icon.skin = "ui_kicking/img-shengli-pvp.png";
                this.win.visible = true;
                this.StartShow(1, this.start_Num);
                this.start_num.text = "我方评星:" + this.start_Num + "星";
                this.min_num.text = "+" + min_num;
            }
            if (Id == 2) {
                this.result_logo_icon.skin = "ui_kicking/img-shibai-pvp.png";
                this.bg.gray = true;
                this.bg_icon.gray = true;
                this.min_num.text = "-" + min_num;
                ;
                this.start_num.text = "对方评星:" + this.start_Num + "星";
            }
        };
        LadderResultView.prototype.ViewEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_receive.on(Laya.Event.CLICK, this, this.Btnclick_close);
        };
        LadderResultView.prototype.Setladdresult_list = function () {
            this.result_list.array = [];
            for (var key in this._resu_item[1]) {
                this.result_list.array.push(key);
            }
            this.result_list.renderHandler = new Laya.Handler(this, this.laddresult_list);
        };
        LadderResultView.prototype.laddresult_list = function (item, index) {
            var Id = this.result_list.array[index];
            var ntcfg = H52D_Framework.ItemConfig[Id];
            var item_bg = item.getChildByName("item_bg");
            var item_name = item.getChildByName("item_name");
            var item_num = item.getChildByName("item_num");
            var item_icon = item.getChildByName("item_icon");
            var bg_img = item.getChildByName("bg-img");
            item_num.text = this._resu_item[1][Id];
            if (this._resu_item[1][Id] == 1) {
                item_num.text = " ";
            }
            item_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(ntcfg.dwItemName);
            item_name.color = H52D_Framework.BaseDefine.LabelColor[ntcfg.dwItemQuality];
            item_bg.bgColor = H52D_Framework.BaseDefine.ItemBgColor[ntcfg.dwItemQuality];
            item_icon.skin = "ui_icon/" + ntcfg.strIconID_B;
        };
        LadderResultView.prototype.StartShow = function (start, num) {
            var _this = this;
            var key = start;
            this["start_" + key].skin = "ui_kicking/img-shengli-xingxing-pvp.png";
            this["start_" + key].scale(3, 3);
            Laya.Tween.to(this["start_" + key], { scaleX: 1, scaleY: 1 }, 200, null, Laya.Handler.create(this, function () {
                key++;
                if (key <= num) {
                    _this.StartShow(key, num);
                }
            }));
        };
        LadderResultView.prototype.Btnclick_close = function () {
            H52D_Framework.CustomsManager.Instance.LeaveCustomsManager();
            H52D_Framework.BattlefieldManager.Instance.Destroy();
            H52D_Framework.UIManager.Instance.DestroyUI("LadderResultView", [H52D_Framework.ViewUpRoot]);
            H52D_Framework.UIManager.Instance.CreateUI("LadderView", [H52D_Framework.ViewDownRoot]);
            H52D_Framework.Event.DispatchEvent("DeputyClose");
            H52D_Framework.LadderManager.Instance.IsMatching = false;
            H52D_Framework.LadderManager.Instance.Close_quitView();
            H52D_Framework.LadderManager.Instance.LadderLvUp_player();
            H52D_Framework.LadderManager.Instance.Win_alawys();
        };
        LadderResultView.prototype.CountDown = function () {
            this._time--;
            var str = "(" + this._time + "s后自动退出)";
            this.fight_quittime.text = str;
            if (this._time == 0) {
                this.Btnclick_close();
                H52D_Framework.Tick.Clear(this, this.CountDown);
            }
        };
        LadderResultView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Tick.Clear(this, this.CountDown);
        };
        return LadderResultView;
    }(ui.action.Ladder.LadderResultViewUI));
    H52D_Framework.LadderResultView = LadderResultView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=LadderResultView.js.map