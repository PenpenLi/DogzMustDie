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
    H52D_Framework.AddViewResource("CampInfoView", [
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
    ]);
    var CampInfoView = /** @class */ (function (_super) {
        __extends(CampInfoView, _super);
        function CampInfoView(buf) {
            var _this = _super.call(this) || this;
            _this.camp_ID = buf[1];
            _this.bool = buf[2];
            _this.Info();
            _this.AddEvent();
            return _this;
        }
        CampInfoView.prototype.AddEvent = function () {
            this.camp_Btn_join.visible = false;
            this.Look_member.on(Laya.Event.CLICK, this, this.Btn_look);
            this.camp_Btn_join.on(Laya.Event.CLICK, this, this.Btn_Add);
            this.Btn_close.on(Laya.Event.CLICK, this, this.Btn_Clickclose);
            this.Other.on(Laya.Event.CLICK, this, this.Btn_Clickclose);
            this.on(Laya.Event.REMOVED, this, this.Destory);
        };
        CampInfoView.prototype.Info = function () {
            var camplist = H52D_Framework.CampManager.Instance.CampList;
            var nIdx = this.camp_ID;
            var campinfo = H52D_Framework.CampManager.Instance.nCamp(nIdx);
            var camp = H52D_Framework.GangConfig[nIdx];
            this.Camp_icon.skin = "ui_icon/" + camp.stricon;
            this.Camp_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(camp.nameId);
            this.Camp_Level.text = campinfo[3] + "/" + H52D_Framework.CampManager.Instance.Camp_LvMax();
            this.Camp_MemberNum.text = campinfo[2] + "/" + H52D_Framework.GangLevelUpConfig[campinfo[3]].Membership; //阵营人数
            //阵营代码
            if (nIdx == H52D_Framework.MasterPlayer.Instance.player.CampID) {
                this.camp_Btn_join.visible = false;
            }
            if (H52D_Framework.MasterPlayer.Instance.player.CampID == 0) {
                this.camp_Btn_join.label = "加入阵营";
            }
            else {
                this.camp_Btn_join.label = "更换阵营";
            }
            //this.Camp_Level.text=(campinfo.CampLevel).toString();
        };
        /** 查看成员按钮事件 */
        CampInfoView.prototype.Btn_look = function () {
            H52D_Framework.UIManager.Instance.CreateUI("CampMemberView", [H52D_Framework.ViewUpRoot, this.camp_ID]);
            H52D_Framework.CampManager.Instance.GetCampPlayInfo(this.camp_ID);
        };
        /**加入阵营   更换阵营 */
        CampInfoView.prototype.Btn_Add = function () {
            var camp_id = H52D_Framework.MasterPlayer.Instance.player.CampID;
            var iten_num = H52D_Framework.BagManager.Instance.getItemNumber(2);
            if (camp_id == this.camp_ID) {
                this.camp_Btn_join.label = "已加入";
                this.camp_Btn_join.mouseEnabled = false;
            }
            if (camp_id == 0) {
                this.camp_Btn_join.label = "加入阵营";
                H52D_Framework.CampManager.Instance.Camp_Jion(this.camp_ID);
            }
            else {
                this.camp_Btn_join.label = "更换阵营";
                var n_camp = H52D_Framework.CampManager.Instance.nCamp(camp_id);
                var campMaxNum = n_camp[3] * H52D_Framework.GangLevelUpConfig.hip;
                if (campMaxNum > n_camp[2]) {
                    if ("身上的钱满足") {
                        H52D_Framework.CampManager.Instance.Camp_Jion(this.camp_ID);
                    }
                    else {
                        H52D_Framework.TipsLogic.Instance.OpenSystemTips("钻石不足");
                    }
                }
                else {
                    //弹出人数上限 换个阵营					
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips(H52D_Framework.SysPromptConfig[10015].strPromptInfo);
                }
            }
        };
        /**关闭面板 */
        CampInfoView.prototype.Btn_Clickclose = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("CampInfoView", [H52D_Framework.ViewUpRoot]);
        };
        CampInfoView.prototype.Destory = function () {
            this.offAll();
        };
        return CampInfoView;
    }(ui.camp.CampInfoViewUI));
    H52D_Framework.CampInfoView = CampInfoView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=CampInfoView.js.map