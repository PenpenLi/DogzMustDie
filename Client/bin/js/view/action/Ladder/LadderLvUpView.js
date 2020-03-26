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
    var LadderLvUpView = /** @class */ (function (_super) {
        __extends(LadderLvUpView, _super);
        function LadderLvUpView(buf) {
            var _this = _super.call(this) || this;
            _this._tatilnum = 0;
            _this._saynum = 0;
            _this._newladderlv = 0; // 玩家天梯分数
            _this._rew = 0;
            _this._tatilnum = buf[1];
            _this._saynum = buf[2];
            _this._newladderlv = buf[3];
            _this._rew = buf[4];
            _this.ViewInit();
            return _this;
        }
        LadderLvUpView.prototype.ViewInit = function () {
            this.ViewEvent();
            this.ViewInfo();
        };
        LadderLvUpView.prototype.ViewEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_close.on(Laya.Event.CLICK, this, this.btnclick_close);
            this.Btn_share.on(Laya.Event.CLICK, this, this.btnclick_share);
        };
        LadderLvUpView.prototype.ViewInfo = function () {
            this.tx_tatil.text = H52D_Framework.GetInfoAttr.Instance.GetText(this._tatilnum);
            this.say.text = H52D_Framework.GetInfoAttr.Instance.GetText(this._saynum);
            var new_ladderlv = H52D_Framework.LadderManager.Instance.GetDuanInfo(this._newladderlv);
            var old_ladderlv = H52D_Framework.LadderManager.Instance.GetDuanInfo(H52D_Framework.LadderManager.Instance.Last_Ladderlv);
            var ntcfg_ladder = H52D_Framework.LadderConfig[new_ladderlv];
            var otcfg_ladder = H52D_Framework.LadderConfig[old_ladderlv];
            this.new_duan_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(ntcfg_ladder.DuanName);
            this.old_duan_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(otcfg_ladder.DuanName);
            this.new_duan_icon.skin = "ui_icon/" + ntcfg_ladder.DuanIcon;
            this.old_duan_icon.skin = "ui_icon/" + otcfg_ladder.DuanIcon;
            this.SetRankLV(ntcfg_ladder.DuanIconBs, "old");
            this.SetRankLV(otcfg_ladder.DuanIconBs, "new");
            this.rew.text = "积分+" + this._rew;
        };
        LadderLvUpView.prototype.btnclick_close = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("LadderLvUpView", [H52D_Framework.ViewUpRoot]);
        };
        LadderLvUpView.prototype.btnclick_share = function () {
            H52D_Framework.CallShare(H52D_Framework.ShareType.ladder_lvup);
            this.btnclick_close();
        };
        LadderLvUpView.prototype.SetRankLV = function (lv, name) {
            var maxlv = H52D_Framework.LadderManager.Instance.LadderLvMax();
            if (maxlv <= lv) {
                this[name + "_lv_2"] = this[name + "_lv_1"].visible = this[name + "_lv_3"].visible = false;
                return;
            }
            var str;
            switch (lv) {
                case 1:
                    str = "ui_icon/icon_duanwei_shuzi_yi.png";
                    this[name + "_lv_2"].skin = str;
                    this[name + "_lv_1"].visible = this[name + "_lv_3"].visible = false;
                    break;
                case 2:
                    str = "ui_icon/icon_duanwei_shuzi_yi.png";
                    this[name + "_lv_1"].skin = this[name + "_lv_3"].skin = str;
                    this[name + "_lv_2"].visible = false;
                    break;
                case 3:
                    str = "ui_icon/icon_duanwei_shuzi_yi.png";
                    this[name + "_lv_1"].skin = this[name + "_lv_3"].skin = this[name + "_lv_2"].skin = str;
                    break;
                case 4:
                    str = "ui_icon/icon_duanwei_shuzi_yi.png";
                    this[name + "_lv_1"].skin = str;
                    this[name + "_lv_3"].skin = "ui_icon/icon_duanwei_shuzi_si.png";
                    this[name + "_lv_2"].visible = false;
                    break;
                case 5:
                    str = "ui_icon/icon_duanwei_shuzi_si.png";
                    this[name + "_lv_2"].skin = str;
                    this[name + "_lv_1"].visible = this[name + "_lv_3"].visible = false;
                    break;
            }
        };
        LadderLvUpView.prototype.Destroy = function () {
            this.offAll();
        };
        return LadderLvUpView;
    }(ui.action.Ladder.LadderLvUpViewUI));
    H52D_Framework.LadderLvUpView = LadderLvUpView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=LadderLvUpView.js.map