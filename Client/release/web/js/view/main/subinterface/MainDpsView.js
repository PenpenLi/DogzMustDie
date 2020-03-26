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
    var MainDpsViewUI = ui.main.subinterface.MainDpsViewUI;
    var path = "ui_icon/";
    /**
     * @class：
     * @author：zhangyusong
     */
    var MainDpsView = /** @class */ (function (_super) {
        __extends(MainDpsView, _super);
        function MainDpsView(type) {
            if (type === void 0) { type = ""; }
            var _this = _super.call(this) || this;
            _this.type = type;
            _this.InitEvent();
            return _this;
        }
        MainDpsView.prototype.Destroy = function () {
            H52D_Framework.Event.RemoveEvent('UpdateBtnList', Laya.Handler.create(this, this.Show_Control));
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.ALL_DPS, Laya.Handler.create(this, this.ShowTotlesDps));
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.HERO_DPS, Laya.Handler.create(this, this.ShowHeroDps));
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.PET_DPS, Laya.Handler.create(this, this.ShowPetDps));
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.CAMP_DPS, Laya.Handler.create(this, this.ShowCampDps));
            this.destroy();
        };
        MainDpsView.prototype.InitEvent = function () {
            H52D_Framework.Event.RegistEvent('UpdateBtnList', Laya.Handler.create(this, this.Show_Control));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.ALL_DPS, Laya.Handler.create(this, this.ShowTotlesDps));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.HERO_DPS, Laya.Handler.create(this, this.ShowHeroDps));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.PET_DPS, Laya.Handler.create(this, this.ShowPetDps));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.CAMP_DPS, Laya.Handler.create(this, this.ShowCampDps));
        };
        MainDpsView.prototype.ShowTotlesDps = function (totles) {
            this.dsp_totles.text = H52D_Framework.Abbreviation(Number(totles));
        };
        MainDpsView.prototype.ShowHeroDps = function (hero) {
            this.dsp_hero.text = H52D_Framework.Abbreviation(Number(hero));
        };
        MainDpsView.prototype.ShowPetDps = function (pet) {
            this.dsp_pet.text = H52D_Framework.Abbreviation(Number(pet));
        };
        MainDpsView.prototype.ShowCampDps = function (camp) {
            this.dsp_camp.text = H52D_Framework.Abbreviation(Number(camp));
        };
        MainDpsView.prototype.Show_Control = function () {
            this.bg.visible = H52D_Framework.WroldBossLogic.Instance.Show;
        };
        return MainDpsView;
    }(MainDpsViewUI));
    H52D_Framework.MainDpsView = MainDpsView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MainDpsView.js.map