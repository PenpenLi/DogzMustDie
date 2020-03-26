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
    H52D_Framework.AddViewResource("CampView", [
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
    ]);
    /**阵营界面 */
    var CampView = /** @class */ (function (_super) {
        __extends(CampView, _super);
        function CampView() {
            var _this = _super.call(this) || this;
            _this._campId = [];
            if (window["wx"]) {
                _this.lclbg.bottom = 0;
            }
            else {
                _this.lclbg.centerY = 0;
            }
            H52D_Framework.CampManager.Instance.Camp_sort();
            _this.arrow_up.visible = false;
            _this.GetCampList();
            _this.nsys_cfg = H52D_Framework.SysPromptConfig;
            _this.AddEvent();
            return _this;
        }
        CampView.prototype.AddEvent = function () {
            this.Btn_Close.on(Laya.Event.CLICK, this, this.Btnclick);
            this.arrow_up.on(Laya.Event.CLICK, this, this.Move_List, [-10]);
            this.arrow_down.on(Laya.Event.CLICK, this, this.Move_List, [10]);
            this.Refresh();
            H52D_Framework.Event.RegistEvent('C_ReqAddCamp', Laya.Handler.create(this, this.JoinCamp));
            H52D_Framework.Event.RegistEvent('C_ReqGuildList', Laya.Handler.create(this, this.GetCamp));
            this.on(Laya.Event.REMOVED, this, this.Destory);
        };
        CampView.prototype.Destory = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent('C_ReqAddCamp', Laya.Handler.create(this, this.JoinCamp));
            H52D_Framework.Event.RemoveEvent('C_ReqGuildList', Laya.Handler.create(this, this.GetCamp));
        };
        CampView.prototype.UpdateList = function () {
            H52D_Framework.CampManager.Instance.SortCamp(H52D_Framework.CampManager.Instance.camp_Info);
            this.Camp_List.vScrollBarSkin = "";
            this._campId = H52D_Framework.CampManager.Instance.CampId;
            this.Camp_List.array = H52D_Framework.CampManager.Instance.camp_Info;
            //this.Camp_List.repeatY = this.Camp_List.length;
            this.Camp_List.renderHandler = new Laya.Handler(this, this.CampHander);
        };
        CampView.prototype.CampHander = function (item, index) {
            var ncampID = H52D_Framework.CampManager.Instance.camp_Info[index][1];
            var campinfo_cfg = H52D_Framework.GangConfig[ncampID];
            var camplist = H52D_Framework.CampManager.Instance.CampList;
            var camp_info = camplist[ncampID];
            var member_Num = H52D_Framework.GangLevelUpConfig[camp_info[3]].Membership;
            var paly_campId = H52D_Framework.MasterPlayer.Instance.player.CampID;
            var campname = item.getChildByName("Camp_Name");
            var Btn_join = item.getChildByName("Btn_join");
            var camp_Info = item.getChildByName("Camp_Info");
            var camp_Icon = item.getChildByName("Camp_Icon");
            var camp_playernum = item.getChildByName("Camp_PalyNum");
            H52D_Framework.SetHtmlStyle(camp_playernum, 24, "#f4ff79", "left");
            camp_playernum.innerHTML = camp_info[2] + H52D_Framework.GetHtmlStrByColor("/" + member_Num, "#fefeff");
            campname.text = H52D_Framework.GetInfoAttr.Instance.GetText(campinfo_cfg.nameId);
            camp_Icon.skin = "ui_icon/" + campinfo_cfg.stricon;
            Btn_join.on(Laya.Event.CLICK, this, this.AddCamp, [ncampID, Btn_join]);
            if (paly_campId == ncampID) {
                Btn_join.label = "已加入";
                Btn_join.mouseEnabled = false;
                Btn_join.skin = "ui_camp/btn-jiaruhui-tongyong-n.png";
            }
            var value = this.Camp_List.scrollBar.value;
            camp_Info.on(Laya.Event.CLICK, this, this.Btn_Info, [ncampID]);
        };
        CampView.prototype.Move_List = function (dis) {
            this.Camp_List.scrollBar.value += dis * 8.8;
            //this.Refresh(this.camp_list.scrollBar.value);			
        };
        CampView.prototype.Refresh = function () {
            var _this = this;
            H52D_Framework.Tick.FrameLoop(1, this, function () {
                if (_this.Camp_List && _this.Camp_List.scrollBar) {
                    _this.Camp_List.scrollBar.changeHandler = Laya.Handler.create(_this, function (value) {
                        if (value < 10) {
                            _this.arrow_up.visible = false;
                        }
                        else {
                            _this.arrow_up.visible = true;
                        }
                        if (value > 1700) {
                            _this.arrow_down.visible = false;
                        }
                        else {
                            _this.arrow_down.visible = true;
                        }
                    });
                }
            });
        };
        CampView.prototype.Btnclick = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("CampView", [H52D_Framework.ViewUpRoot]);
            H52D_Framework.CampManager.Instance.CampList = [];
            H52D_Framework.CampManager.Instance.BShowFlag = false;
            H52D_Framework.CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.camp, true);
        };
        /**阵营加入成功 */
        CampView.prototype.JoinCamp = function () {
            var ID = H52D_Framework.MasterPlayer.Instance.player.CampID;
            this._addBtn.skin = "ui_camp/btn-jiaruhui-tongyong-n.png";
            var tex = this.nsys_cfg[10016].strPromptInfo; //提示id  加入成功
            H52D_Framework.TipsLogic.Instance.OpenSystemTips(tex + H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.GangConfig[ID].nameId));
            H52D_Framework.UIManager.Instance.DestroyUI("CampView", [H52D_Framework.ViewUpRoot]);
            //UIManager.Instance.CreateUI("CampMainInfo", [ViewUpRoot]);
            //增加阵营大船的伤害
            this.UpdateList();
        };
        /**获取阵营列表信息 */
        CampView.prototype.GetCamp = function () {
            this.UpdateList();
        };
        CampView.prototype.AddCamp = function (id, btn) {
            this._addBtn = btn;
            var camp = H52D_Framework.CampManager.Instance.nCamp(id);
            var Maxnum = H52D_Framework.GangLevelUpConfig[camp[3]].Membership;
            var tex = this.nsys_cfg[10015].strPromptInfo; // 人数已满的提示id
            if (camp[2] == Maxnum) {
                //TipsLogic.Instance.OpenSystemTips("该阵营成员已达上限，换一个阵营加入吧！");
                H52D_Framework.TipsLogic.Instance.OpenSystemTips(tex);
                return;
            }
            H52D_Framework.CampManager.Instance.Camp_Jion(id);
        };
        CampView.prototype.GetCampList = function () {
            H52D_Framework.CampManager.Instance.GetCamp_List();
        };
        CampView.prototype.Btn_Info = function (id) {
            H52D_Framework.UIManager.Instance.CreateUI("CampInfoView", [H52D_Framework.ViewUpRoot, id, true]);
        };
        return CampView;
    }(ui.camp.CampViewUI));
    H52D_Framework.CampView = CampView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=CampView.js.map