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
    H52D_Framework.AddViewResource("CampMainInfo", [
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
    ]);
    /**阵营主界面 */
    var CampMainInfo = /** @class */ (function (_super) {
        __extends(CampMainInfo, _super);
        function CampMainInfo() {
            var _this = _super.call(this) || this;
            _this._Info = [];
            _this.Btn_name = {
                CampPlay: ["CampMemberView"],
                CampRank: ["CampRankView"],
                CampDonate: ["CampDonateView"],
                CampReplace: ["ReplaceCampView"],
            };
            _this.Init();
            _this.AddEvent();
            H52D_Framework.Tick.Loop(5000, _this, H52D_Framework.CampManager.Instance.Camp_Info);
            H52D_Framework.Tick.Loop(2500, _this, _this.UpdateShow);
            return _this;
        }
        CampMainInfo.prototype.Init = function () {
            this._camp_Id = H52D_Framework.MasterPlayer.Instance.player.CampID;
            this.CampInfo();
            this.SetCamp_Info();
            this.UpdateShow();
        };
        CampMainInfo.prototype.AddEvent = function () {
            H52D_Framework.Event.RegistEvent("chengehot", Laya.Handler.create(this, this.CampInfo));
            H52D_Framework.Event.RegistEvent("changetimes", Laya.Handler.create(this, this.CampInfo));
            H52D_Framework.Event.RegistEvent("updatecamplist", Laya.Handler.create(this, this.SetCamp_Info));
            this.Btn_Close.on(Laya.Event.CLICK, this, this.BtnClick_Close);
            this.Other.on(Laya.Event.CLICK, this, this.BtnClick_Close);
            this.Btn_CampPlay.on(Laya.Event.CLICK, this, this.GetPlayInfo);
            this.Btn_CampRank.on(Laya.Event.CLICK, this, this.Btn_Click, [this.Btn_name.CampRank]);
            this.Btn_CampDonate.on(Laya.Event.CLICK, this, this.Btn_Click, [this.Btn_name.CampDonate]);
            this.camp_help.on(Laya.Event.CLICK, this, this.OpenView);
            this.Btn_Change.on(Laya.Event.CLICK, this, this.Btn_Click, [this.Btn_name.CampReplace]);
            this.on(Laya.Event.REMOVED, this, this.Destory);
        };
        CampMainInfo.prototype.CampInfo = function () {
            if (this._camp_Id == 0)
                return;
            var ncamp = H52D_Framework.CampManager.Instance.nCamp(this._camp_Id);
            var camp_tcfg = H52D_Framework.GangConfig[this._camp_Id];
            this.camp_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(camp_tcfg.nameId);
            this.camp_icon.skin = "ui_icon/" + camp_tcfg.stricon;
            H52D_Framework.SetHtmlStyle(this.camp_lv, 20, "#9be589", "left");
            this.camp_lv.innerHTML = "阵营等级:" + H52D_Framework.GetHtmlStrByColor(ncamp[3], "#f4ff79");
            H52D_Framework.SetHtmlStyle(this.camp_hot, 20, "#9be589", "left");
            H52D_Framework.SetHtmlStyle(this.camp_hurt, 20, "#9be589", "left");
            var hurt = H52D_Framework.BCampManager.Instance.Camp.vo.attr.GetAttributeValue(2) * H52D_Framework.BCampManager.Instance.Camp.vo.ratio;
            this.camp_hurt.innerHTML = "大船伤害:" + H52D_Framework.GetHtmlStrByColor(Math.floor(hurt).toString(), "#f4ff79");
            var hot_num = H52D_Framework.CampManager.Instance.CampHot;
            if (!hot_num) {
                hot_num = ncamp[4];
            }
            var camp_lv = H52D_Framework.CampManager.Instance.Camp_LvMax();
            var str = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(6013), H52D_Framework.GetHtmlStrByColor(String(hot_num), "#f4ff79"), H52D_Framework.GangLevelUpConfig[ncamp[3]].GangExp);
            if (camp_lv <= ncamp[3]) {
                str = "已满级";
            }
            this.camp_hot.innerHTML = str;
            H52D_Framework.SetHtmlStyle(this.camp_num, 20, "#9be589", "left");
            this.camp_num.innerHTML = "阵营人数:" + H52D_Framework.GetHtmlStrByColor(ncamp[2], "#f4ff79") + "/" + H52D_Framework.GangLevelUpConfig[ncamp[3]].Membership;
        };
        /**设置阵营日志 */
        CampMainInfo.prototype.SetCamp_Info = function () {
            var infoList = H52D_Framework.CampManager.Instance.LogList;
            this.Camp_Panel.vScrollBarSkin = "";
            this.Camp_Info.height = 0;
            this.Camp_Panel.vScrollBar.value = 0;
            for (var key in infoList) {
                var info = infoList[key];
                var html = new Laya.HTMLDivElement();
                H52D_Framework.SetHtmlStyle(html, 22, H52D_Framework.BaseDefine.CampInfo_Color[info[0]], "left"); //
                html.style.wordWrap = true;
                html.x = 35;
                var Idx = Number(key);
                html.y = 10 + (Idx * 65);
                var str = H52D_Framework.CampManager.Instance.logInfo(info);
                var path = "<img src= 'ui_camp/img-dian-tongyong.png' width='24px' height='24px'></img>";
                html.innerHTML = path + str;
                html.width = 600;
                this.Camp_Info.addChild(html);
                this.Camp_Info.height = (Idx + 1) * 65;
                this.Camp_Panel.vScrollBar.value = html.y;
            }
        };
        CampMainInfo.prototype.BtnClick_Close = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("CampMainInfo", [H52D_Framework.ViewUpRoot]);
        };
        /** */
        CampMainInfo.prototype.Btn_Click = function (name) {
            H52D_Framework.UIManager.Instance.CreateUI(name, [H52D_Framework.ViewUpRoot]);
        };
        CampMainInfo.prototype.OpenView = function () {
            var title = "阵营说明";
            var content = H52D_Framework.GetInfoAttr.Instance.GetText(6010);
            H52D_Framework.UIManager.Instance.CreateUI("TipsActionView", [H52D_Framework.ViewToppestRoot, title, content]);
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
        };
        CampMainInfo.prototype.GetPlayInfo = function () {
            H52D_Framework.CampManager.Instance.GetCampPlayInfo(this._camp_Id);
            H52D_Framework.UIManager.Instance.CreateUI("CampMemberView", [H52D_Framework.ViewUpRoot, this._camp_Id]);
        };
        CampMainInfo.prototype.UpdateShow = function () {
            var bool = H52D_Framework.CampManager.Instance.ShowRed(this.D_red);
            this.D_red.visible = bool;
        };
        CampMainInfo.prototype.Destory = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent("chengehot", Laya.Handler.create(this, this.CampInfo));
            H52D_Framework.Event.RemoveEvent("updatecamplist", Laya.Handler.create(this, this.SetCamp_Info));
            H52D_Framework.Event.RemoveEvent("changetimes", Laya.Handler.create(this, this.CampInfo));
        };
        return CampMainInfo;
    }(ui.camp.CampMainInfoUI));
    H52D_Framework.CampMainInfo = CampMainInfo;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=CampMainInfo.js.map