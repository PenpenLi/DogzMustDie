module H52D_Framework {
    /**
     * 队长技能类
     * @author zhangyusong
     */
    export class CaptainSkill {
        public static CurCdTime: number = 0;
        public static DeputyCdTime: number = 0;
        private auto: boolean = false;
        private skill: MainSkillView;
        /** 技能CD特效 */
        private effectCd: Avatar;
        private _totalCdTime: number = 0;

        public constructor(skill: MainSkillView) {
            this.skill = skill;
            this.skill.autoIcon.visible = false;
            this.skill.captain_skill.on(Laya.Event.CLICK, this, () => {
                if (this.curCdTime > 0) {
                    TipsLogic.Instance.OpenTips("队长技能还在冷却中！");
                    return;
                } else {
                    this.curCdTime = 0;
                }
                //使用队长技能
                Event.DispatchEvent(EventDefine.CAPATIAN_SKILL);
            });
            this.skill.autoBtn.on(Laya.Event.CLICK, this, this.UseSkill);
            this.effectCd = new Avatar(this.skill.effect_bg)
            this.effectCd.Load(EffectDefine.jndz, 1, 0.8, 42, 42);
            this.UseSkill();
        }

        public set isAuto(value: boolean) {
            if (CustomsManager.Instance.CustomsType == Customs_Type.Customs) {
                ViewUILogic.Instance.isAuto = value;
                this.skill.autoIcon.visible = value;
            }
            else{
                this.auto = value;
                this.skill.autoIcon.visible = value;
            }
        }

        public get isAuto(): boolean {
            if (CustomsManager.Instance.CustomsType == Customs_Type.Customs) {
                return ViewUILogic.Instance.isAuto;
            }
            else {
                return this.auto;
            }
        }

        /** 清理队长技能 */
        public Destroy(){
            // this.isAuto = true;
            this.curCdTime = 0;
            this.UpdateSkillCd();
        }

        private get curCdTime(): number {
            if (CustomsManager.Instance.CustomsType == Customs_Type.Customs) {
                return CaptainSkill.CurCdTime;
            }
            else {
                return CaptainSkill.DeputyCdTime;
            }
        }

        private set curCdTime(value: number) {
            if (CustomsManager.Instance.CustomsType == Customs_Type.Customs) {
                CaptainSkill.CurCdTime = value;
            }
            else {
                CaptainSkill.DeputyCdTime = value;
            }
        }

        /** 释放队长技能 */
        private UseSkill() {
            // 自动释放技能
            this.isAuto = !this.isAuto;
            if (this.skill.autoIcon.visible && this.curCdTime <= 0) {
                //使用队长技能
                Event.DispatchEvent(EventDefine.CAPATIAN_SKILL);
            }
        }

        /**使用队长技能成功 */
        public UseCaptainSkill(cdTime: number) {
            this._totalCdTime = cdTime / 1000;
            this.curCdTime = cdTime / 1000;
            this.skill.captainSkillCD.visible = true;
            this.skill.captainSkillCDLabel.text = this.curCdTime.toString();
            this.skill.captainSkillCDSprite.graphics.clear();
            this.skill.captainSkillCDSprite.graphics.drawCircle(37, 37, 37, "#ff0000");
            Tick.Loop(100, this, this.UpdateSkillCd);
        }

        /**更新队长技能cd时间 */
        private UpdateSkillCd(): void {
            this.curCdTime -= 0.1;
            this.skill.captainSkillCDLabel.text = String((this.curCdTime + 1) >> 0);
            let value = (this._totalCdTime - this.curCdTime) / this._totalCdTime;
            this.skill.captainSkillCDSprite.graphics.clear();
            this.skill.captainSkillCDSprite.graphics.drawPie(37, 37, 37, -90 + 360 * value, 270, "#000000");
            if (this.curCdTime <= 0) {
                Tick.Clear(this, this.UpdateSkillCd);
                this.skill.captainSkillCDLabel.text = "";
                this.skill.captainSkillCD.visible = false;
                //如果当前处于自动释放技能状态则继续使用技能
                if (this.skill.autoIcon.visible) {
                    //使用队长 技能 
                    Event.DispatchEvent(EventDefine.CAPATIAN_SKILL);
                }
                //释放特效
                this.effectCd.PlayOnce();
            }
        }

    }
}