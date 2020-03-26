var H52D_Framework;
(function (H52D_Framework) {
    /**
     * 技能数据类
     * @author zhangyusong
     */
    var SkillVo = /** @class */ (function () {
        function SkillVo(id) {
            this.id = id;
            if (id == 0)
                return;
            var data = H52D_Framework.ActiveSkillConfig[id];
            this.conMp = data["conMp"];
            this.cdTime = data["skillCD"] * 0.001;
            this.continuousTime = 0;
            var status = data["statusList"][1];
            if (!!status) {
                this.continuousTime = H52D_Framework.StatusConfig[status[3]]["periodEffect"][3];
                this.continuousTime *= 0.001;
            }
            this.strIcon = "ui_icon/" + data["strIcon"];
        }
        return SkillVo;
    }());
    H52D_Framework.SkillVo = SkillVo;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=SkillVo.js.map