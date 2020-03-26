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
    H52D_Framework.AddViewResource("CampRankView", [
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
    ]);
    var CampRankView = /** @class */ (function (_super) {
        __extends(CampRankView, _super);
        function CampRankView() {
            var _this = _super.call(this) || this;
            _this.Init();
            return _this;
        }
        CampRankView.prototype.Init = function () {
            H52D_Framework.CampManager.Instance.camp_Info = [];
            H52D_Framework.CampManager.Instance.Camp_sort();
            this.Addevent();
            this.Updatelist();
        };
        CampRankView.prototype.Addevent = function () {
            this.btn_close.on(Laya.Event.CLICK, this, this.btn_click);
            this.Other.on(Laya.Event.CLICK, this, this.btn_click);
            this.on(Laya.Event.REMOVED, this, this.Destroy);
        };
        CampRankView.prototype.Updatelist = function () {
            this.camp_list.vScrollBarSkin = "";
            H52D_Framework.CampManager.Instance.SortCamp(H52D_Framework.CampManager.Instance.camp_Info);
            this.camp_list.array = H52D_Framework.CampManager.Instance.camp_Info;
            //this.camp_list.repeatY = CampManager.Instance.CampId.length;
            this.camp_list.renderHandler = new Laya.Handler(this, this.Camp_handler);
        };
        CampRankView.prototype.Camp_handler = function (item, index) {
            var Idx = H52D_Framework.CampManager.Instance.camp_Info[index][1];
            var n_camp = H52D_Framework.CampManager.Instance.nCamp(Idx);
            var n_tcfg = H52D_Framework.GangConfig[Idx];
            var rank_bg = item.getChildByName("Rank_Num");
            var camp_name = item.getChildByName("Camp_Name"); //rankNum
            var camp_lv = item.getChildByName("camp_lv");
            var rank = item.getChildByName("rankNum");
            var camp_playnum = item.getChildByName("Camp_play_num");
            camp_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(n_tcfg.nameId);
            camp_lv.text = n_camp[3] + "";
            H52D_Framework.SetHtmlStyle(camp_playnum, 20, "#feff79", "center");
            var Indx = index + 1;
            if (Indx <= 3) {
                rank_bg.visible = true;
                rank_bg.skin = "ui_rank/img-" + Indx + "-paiming.png";
                rank.visible = false;
            }
            else {
                rank.visible = true;
                rank_bg.visible = false;
                rank.text = Indx + "";
            }
            camp_playnum.innerHTML = n_camp[2] + H52D_Framework.GetHtmlStrByColor("/" + H52D_Framework.GangLevelUpConfig[n_camp[3]].Membership, "#fefeff");
            if (H52D_Framework.MasterPlayer.Instance.player.CampID == Idx) { //设置自己阵营的信息
                this.my_campname.text = camp_name.text;
                H52D_Framework.SetHtmlStyle(this.camp_num, 20, "#feff79", "center");
                this.camp_num.innerHTML = n_camp[2] + H52D_Framework.GetHtmlStrByColor("/" + H52D_Framework.GangLevelUpConfig[n_camp[3]].Membership, "#fefeff");
                ;
                this.camp_rank.text = Indx + "";
                this.camp_lv.text = n_camp[3];
            }
            item.on(Laya.Event.CLICK, this, this.Openview, [Idx]);
        };
        CampRankView.prototype.Openview = function (id) {
            H52D_Framework.UIManager.Instance.CreateUI("CampInfoView", [H52D_Framework.ViewUpRoot, id, false]);
        };
        CampRankView.prototype.btn_click = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("CampRankView", [H52D_Framework.ViewUpRoot]);
            H52D_Framework.CampManager.Instance.camp_Info = [];
        };
        CampRankView.prototype.Destroy = function () {
            this.offAll();
        };
        return CampRankView;
    }(ui.camp.CampRankViewUI));
    H52D_Framework.CampRankView = CampRankView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=CampRankView.js.map