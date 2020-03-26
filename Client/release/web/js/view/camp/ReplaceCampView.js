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
    H52D_Framework.AddViewResource("ReplaceCampView", [
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
    ]);
    /**更换阵营界面 */
    var ReplaceCampView = /** @class */ (function (_super) {
        __extends(ReplaceCampView, _super);
        function ReplaceCampView() {
            var _this = _super.call(this) || this;
            _this._camplist = [];
            H52D_Framework.CampManager.Instance.camp_Info = [];
            H52D_Framework.CampManager.Instance.Camp_sort();
            _this._camplist = [];
            for (var key in H52D_Framework.CampManager.Instance.CampList) {
                var Indx = Number(key);
                _this._camplist.push(Indx);
            }
            _this.AddEvent();
            _this.UpdaList();
            return _this;
        }
        ReplaceCampView.prototype.AddEvent = function () {
            H52D_Framework.Event.RegistEvent('C_ReqGuildList', Laya.Handler.create(this, this.UpdaList));
            this.Btn_Close.on(Laya.Event.CLICK, this, this.Btn_CloseClick);
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.Other.on(Laya.Event.CLICK, this, this.Btn_CloseClick);
        };
        ReplaceCampView.prototype.UpdaList = function () {
            H52D_Framework.CampManager.Instance.SortCamp(H52D_Framework.CampManager.Instance.camp_Info);
            this.Camp_List.array = this._camplist;
            this.Camp_List.vScrollBarSkin = "";
            //this.Camp_List.repeatY=this._camplist.length;
            this.Camp_List.renderHandler = new Laya.Handler(this, this.Render);
        };
        ReplaceCampView.prototype.Render = function (item, index) {
            var Idx = H52D_Framework.CampManager.Instance.camp_Info[index][1];
            var campInfo = H52D_Framework.CampManager.Instance.CampList[Idx];
            var campname = item.getChildByName("Camp_Name");
            var camp_playnum = item.getChildByName("Camp_play_num");
            var img = item.getChildByName("Rank_Num");
            var _text = item.getChildByName("rankNum"); //Btn_Change
            var btn_change = item.getChildByName("Btn_Change");
            campname.text = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.GangConfig[campInfo[1]].nameId);
            H52D_Framework.SetHtmlStyle(camp_playnum, 22, "#feff79", "center");
            var n_campplaynum = H52D_Framework.GangLevelUpConfig[campInfo[3]].Membership;
            camp_playnum.innerHTML = campInfo[2] + H52D_Framework.GetHtmlStrByColor("/" + n_campplaynum, "#fefeff");
            var Indx = index + 1;
            if (Indx <= 3) {
                img.visible = true;
                img.skin = "ui_rank/img-" + Indx + "-paiming.png";
                _text.visible = false;
            }
            else {
                _text.visible = true;
                img.visible = false;
                _text.text = Indx + "";
            }
            btn_change.label = "更换";
            btn_change.gray = false;
            btn_change.mouseEnabled = true;
            if (Idx == H52D_Framework.MasterPlayer.Instance.player.CampID) {
                btn_change.label = "已加入";
                btn_change.gray = true;
                btn_change.mouseEnabled = false;
                this.camp_Name.text = campname.text;
                this.rankNum.text = Indx + "";
                H52D_Framework.SetHtmlStyle(this.camp_num, 22, "#feff79", "center");
                this.camp_num.innerHTML = campInfo[2] + H52D_Framework.GetHtmlStrByColor("/" + n_campplaynum, "#fefeff");
            }
            btn_change.on(Laya.Event.CLICK, this, this.OpenView, [Idx]);
        };
        ReplaceCampView.prototype.OpenView = function (id) {
            H52D_Framework.UIManager.Instance.CreateUI("ReplaceTipView", [H52D_Framework.ViewUpRoot, id]);
        };
        ReplaceCampView.prototype.Btn_CloseClick = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("ReplaceCampView", [H52D_Framework.ViewUpRoot]);
            H52D_Framework.CampManager.Instance.camp_Info = [];
        };
        ReplaceCampView.prototype.Destroy = function () {
            this.offAll();
        };
        return ReplaceCampView;
    }(ui.camp.ReplaceCampViewUI));
    H52D_Framework.ReplaceCampView = ReplaceCampView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ReplaceCampView.js.map