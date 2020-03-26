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
    H52D_Framework.AddViewResource("SkillInfoView", [
        { url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS },
    ]);
    var SkillInfoView = /** @class */ (function (_super) {
        __extends(SkillInfoView, _super);
        function SkillInfoView(info) {
            var _this = _super.call(this) || this;
            _this._index = 0;
            _this._index = info[1];
            _this.Init();
            _this.AddEvent();
            return _this;
        }
        /**添加按钮侦听器 */
        SkillInfoView.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.OnDestroy);
            this.close.on(Laya.Event.CLICK, this, this.OnClickCloseBtn);
        };
        /**移除事件监听 */
        SkillInfoView.prototype.OnDestroy = function () {
            this.offAll();
        };
        SkillInfoView.prototype.Init = function () {
            var roleSkill = H52D_Framework.MainRoleLogic.Instance.roleSkill;
            var roleSkillCfg = H52D_Framework.MainRoleLogic.Instance.roleSkillCfg;
            var skilllv = roleSkill[this._index].lv;
            if (skilllv == 0) {
                skilllv = skilllv + 1;
            }
            var roleSkillId = roleSkillCfg[this._index][skilllv].roleSkillId;
            this.skillicon.skin = H52D_Framework.GetIcon(H52D_Framework.ActiveSkillConfig[roleSkillId].strIcon);
            this.skillname.text = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.ActiveSkillConfig[roleSkillId].nameId);
            var skilltime = H52D_Framework.ActiveSkillConfig[roleSkillId].skillCD / 1000;
            var skilltimestr = skilltime + "";
            this.consume.text = H52D_Framework.ActiveSkillConfig[roleSkillId].conMp;
            this.skilllvlabel.text = skilllv + "";
            H52D_Framework.SetHtmlStyle(this.desc, 18, "#d6d7dd", "left");
            this.desc.innerHTML = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.ActiveSkillConfig[roleSkillId].skillFrom);
            var str = "冷却时间:" + H52D_Framework.GetHtmlStrByColor(skilltimestr + "秒", "#f4ff79", 18);
            H52D_Framework.SetHtmlStyle(this.desceffect, 18, "#9be589", "left");
            this.desceffect.innerHTML = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.ActiveSkillConfig[roleSkillId].descId);
            H52D_Framework.SetHtmlStyle(this.nextffect, 18, "#f4ff79", "left");
            if (H52D_Framework.MainRoleLogic.Instance.IsSkillUnlocked(this._index) && !H52D_Framework.MainRoleLogic.Instance.IsMaxLv(this._index)) {
                this.nextffect.innerHTML = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.ActiveSkillConfig[roleSkillId + 1].descId);
            }
            else if (!H52D_Framework.MainRoleLogic.Instance.IsMaxLv(this._index)) {
                this.nextffect.innerHTML = H52D_Framework.GetInfoAttr.Instance.GetText(7003);
            }
            else {
                this.nextffect.innerHTML = "已达最大等级";
            }
        };
        /**关闭 */
        SkillInfoView.prototype.OnClickCloseBtn = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("SkillInfoView", [H52D_Framework.ViewUpRoot]);
        };
        return SkillInfoView;
    }(ui.tips.SkillInfoViewUI));
    H52D_Framework.SkillInfoView = SkillInfoView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=SkillInfoView.js.map