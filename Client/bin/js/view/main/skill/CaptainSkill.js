var H52D_Framework;
(function (H52D_Framework) {
    /**
     * 队长技能类
     * @author zhangyusong
     */
    var CaptainSkill = /** @class */ (function () {
        function CaptainSkill(skill) {
            var _this = this;
            this.auto = false;
            this._totalCdTime = 0;
            this.skill = skill;
            this.skill.autoIcon.visible = false;
            this.skill.captain_skill.on(Laya.Event.CLICK, this, function () {
                if (_this.curCdTime > 0) {
                    H52D_Framework.TipsLogic.Instance.OpenTips("队长技能还在冷却中！");
                    return;
                }
                else {
                    _this.curCdTime = 0;
                }
                //使用队长技能
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.CAPATIAN_SKILL);
            });
            this.skill.autoBtn.on(Laya.Event.CLICK, this, this.UseSkill);
            this.effectCd = new H52D_Framework.Avatar(this.skill.effect_bg);
            this.effectCd.Load(H52D_Framework.EffectDefine.jndz, 1, 0.8, 42, 42);
            this.UseSkill();
        }
        Object.defineProperty(CaptainSkill.prototype, "isAuto", {
            get: function () {
                if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Customs) {
                    return H52D_Framework.ViewUILogic.Instance.isAuto;
                }
                else {
                    return this.auto;
                }
            },
            set: function (value) {
                if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Customs) {
                    H52D_Framework.ViewUILogic.Instance.isAuto = value;
                    this.skill.autoIcon.visible = value;
                }
                else {
                    this.auto = value;
                    this.skill.autoIcon.visible = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        /** 清理队长技能 */
        CaptainSkill.prototype.Destroy = function () {
            // this.isAuto = true;
            this.curCdTime = 0;
            this.UpdateSkillCd();
        };
        Object.defineProperty(CaptainSkill.prototype, "curCdTime", {
            get: function () {
                if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Customs) {
                    return CaptainSkill.CurCdTime;
                }
                else {
                    return CaptainSkill.DeputyCdTime;
                }
            },
            set: function (value) {
                if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Customs) {
                    CaptainSkill.CurCdTime = value;
                }
                else {
                    CaptainSkill.DeputyCdTime = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        /** 释放队长技能 */
        CaptainSkill.prototype.UseSkill = function () {
            // 自动释放技能
            this.isAuto = !this.isAuto;
            if (this.skill.autoIcon.visible && this.curCdTime <= 0) {
                //使用队长技能
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.CAPATIAN_SKILL);
            }
        };
        /**使用队长技能成功 */
        CaptainSkill.prototype.UseCaptainSkill = function (cdTime) {
            this._totalCdTime = cdTime / 1000;
            this.curCdTime = cdTime / 1000;
            this.skill.captainSkillCD.visible = true;
            this.skill.captainSkillCDLabel.text = this.curCdTime.toString();
            this.skill.captainSkillCDSprite.graphics.clear();
            this.skill.captainSkillCDSprite.graphics.drawCircle(37, 37, 37, "#ff0000");
            H52D_Framework.Tick.Loop(100, this, this.UpdateSkillCd);
        };
        /**更新队长技能cd时间 */
        CaptainSkill.prototype.UpdateSkillCd = function () {
            this.curCdTime -= 0.1;
            this.skill.captainSkillCDLabel.text = String((this.curCdTime + 1) >> 0);
            var value = (this._totalCdTime - this.curCdTime) / this._totalCdTime;
            this.skill.captainSkillCDSprite.graphics.clear();
            this.skill.captainSkillCDSprite.graphics.drawPie(37, 37, 37, -90 + 360 * value, 270, "#000000");
            if (this.curCdTime <= 0) {
                H52D_Framework.Tick.Clear(this, this.UpdateSkillCd);
                this.skill.captainSkillCDLabel.text = "";
                this.skill.captainSkillCD.visible = false;
                //如果当前处于自动释放技能状态则继续使用技能
                if (this.skill.autoIcon.visible) {
                    //使用队长 技能 
                    H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.CAPATIAN_SKILL);
                }
                //释放特效
                this.effectCd.PlayOnce();
            }
        };
        CaptainSkill.CurCdTime = 0;
        CaptainSkill.DeputyCdTime = 0;
        return CaptainSkill;
    }());
    H52D_Framework.CaptainSkill = CaptainSkill;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=CaptainSkill.js.map