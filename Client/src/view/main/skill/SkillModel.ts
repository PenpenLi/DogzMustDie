module H52D_Framework {
    /**
     * 技能模型类
     * @author zhangyusong
     */
    export class SkillModel {
        /** 技能序列 */
        public index: number;
        /** 数据模型*/
        private list: Array<SkillVo>;
        /** 当前数据模型*/
        private currVo: SkillVo;
        /** 视图*/
        private item: Laya.Box;
        /** 遮罩*/
        private maski: Laya.Sprite;
        /** 技能图 */
        private cdPic: Laya.Image;
        /** 技能CD特效 */
        private effectCd: Avatar;
        /** 在冷却时间内 */
        private cd: boolean;
        /** 冷却时间戳 */
        private timeSplus: number;
        /** 正在倒计时 */
        private countdown: boolean;
        /** 持续时间表现 */
        private continuousTimeNode: Laya.Node;
        /** 持续时间当前时间*/
        private continuousTimeCurrent: number;
        /** 冷却时间当前时间*/
        private cdTimeCurrent: number;
        /** 剩余法力视图 */
        private conMpNode: Laya.Label;
        /** 剩余法力 */
        private mpvalue: number;
        /** 等级 */
        private _level: number;
        /** 锁 */
        private _lock: boolean;
        /** 可使用 */
        private _available: boolean;
        /** 播放特效 */
        private _canplay: boolean;

        /**
         * 技能
         * @param item
         * @param index
         **/
        public constructor() {
        }
        /**
         * 设置技能
         * @param item 技能面板
         * @param index 技能索引1-6
         */
        public SetData(item: Laya.Box, index: number) {
            this.index = index;
            let roleSkillUp = RoleSkillUpConfig[this.index + 1];
            this.list = [];
            for (let roletype in roleSkillUp) {
                let vo: SkillVo = new SkillVo(roleSkillUp[roletype]["roleSkillId"]);
                vo.unlock = false;
                this.list.push(vo);
            }
            this.currVo = this.list[0];

            this.item = item;
            this.maski = new Laya.Sprite();
            this.cdPic = this.item.getChildByName("cd_pic") as Laya.Image;
            (this.item.getChildByName("cd_circle") as Laya.Image).mask = this.maski;
            this.effectCd = new Avatar(this.item.getChildByName("effect_bg") as Laya.Box)
            this.effectCd.Load(EffectDefine.jncd, 1, 1, 46, 44);
            this.continuousTimeNode = this.item.getChildByName("cd_time");
            this.continuousTimeNode["text"] = "";
            this.conMpNode = this.item.getChildByName("conMp") as Laya.Label;
            this.cdTimeCurrent = 0;
            this.continuousTimeCurrent = 0;
            this.mpvalue = 0;
            this.countdown = false;
            this.level = 0;
            this._canplay = false;
        }

        public get view(): Laya.Box {
            return this.item;
        }

        public get vo(): SkillVo {
            return this.currVo;
        }

        public set level(value: number) {
            this._level = value;
            this.currVo = this.list[value == 0 ? 0 : value - 1];
            this.cdPic.skin = this.currVo.strIcon;
            this.conMpNode.text = this.currVo.conMp.toString();
            this.lock = value == 0;
        }

        /** 更新法力值,影响开启状态 */
        public UpdateMp(mp: number) {
            if (this.lock) return;
            if ((!this.currVo) || (!this.currVo.conMp)) {
                return
            }
            this.mpvalue = mp;
            if (!this.countdown) {
                this.available = this.mpvalue >= this.currVo.conMp;
                if (this._canplay) {
                    if (this.mpvalue >= this.currVo.conMp) {
                        this._canplay = false;
                        this.effectCd.PlayOnce();
                    }
                }
            }
            this.conMpNode.color = this.mpvalue >= this.currVo.conMp ? "#2dbcff" : "#ff2d2c";
        }

        /** 更新冷却时间,影响冷却状态 */
        public UpdateCd(cd: number) {
            if (this.lock) return;
            //主线
            if (CustomsManager.Instance.CustomsType == Customs_Type.Customs) {
                this.timeSplus = cd;
                //获得当前时间
                let currTime = Time.serverSecodes - this.timeSplus >> 0;
                //持续释放技能
                if (currTime < this.currVo.continuousTime) {
                    this.continuousTimeCurrent = this.currVo.continuousTime - currTime;
                    this.StartUse();
                }
                //冷却技能
                else if (currTime < this.currVo.cdTime) {
                    this.currVo.continuousTime = 0;
                    this.cdTimeCurrent = this.currVo.cdTime - (currTime - this.currVo.continuousTime);
                    this.StartUse();
                }
            }
            //副本，清零
            else {
                this.continuousTimeCurrent = 0;
                this.cdTimeCurrent = 0;
                this.FrameContinuousTime();
            }
        }

        /** 锁定状态 */
        public set lock(value: boolean) {
            this._lock = value;
            this.item.getChildByName("cd_lock")["visible"] = value;
            if (this.countdown) {
                this.item.getChildByName("cd_mask")["visible"] = true;
            }
            else {
                this.item.getChildByName("cd_mask")["visible"] = value;
            }
            if (value) {
                this.item.mouseEnabled = false;
                this.conMpNode.color = "#ff2d2c";
                this.drawSector(0, true);
            }
            else {
                this.conMpNode.text = this.currVo.conMp.toString();
            }
        }

        public get lock(): boolean {
            return this._lock;
        }

        public Destroy() {
            this.continuousTimeCurrent = 0;
            this.cdTimeCurrent = 0;
            this.FrameContinuousTime();
        }

        /** 可使用状态 */
        private set available(value: boolean) {
            this._available = value;
            this.item.mouseEnabled = value;
            this.item.getChildByName("cd_mask")["visible"] = !value;
            //开启状态
            this.drawSector(value ? 1 : 0, true);
        }

        private get available(): boolean {
            return this._available;
        }

        /** 开启使用，持续时间内释放技能 */
        public StartUse(excess: boolean = false) {
            if(this.lock){
                return;
            }
            Event.DispatchEvent(EventDefine.SPELL_SKILL, [this.index]);
            this.countdown = true;
            this._canplay = true;
            this.available = false;
            this.cd = true;
            this.item.getChildByName("cd_mask")["visible"] = false;
            this.continuousTimeNode["text"] = this.currVo.continuousTime > 0 ? this.currVo.continuousTime.toString() : "";
            // 额外技能,保留剩余CD时间
            if (excess) {
                //在持续时间内
                if(this.continuousTimeCurrent > 0){
                    this.cdTimeCurrent = this.currVo.cdTime - (this.currVo.continuousTime - this.continuousTimeCurrent);
                }
                else{
                    this.cdTimeCurrent = this.cdTimeCurrent - this.currVo.continuousTime;
                }
                if(this.cdTimeCurrent<0){
                    this.cdTimeCurrent = 0;
                }
                this.continuousTimeCurrent = this.currVo.continuousTime;
                this.FirstcdTime();
            }
            else {
                if (this.continuousTimeCurrent == 0) {
                    this.continuousTimeCurrent = this.currVo.continuousTime;
                }
                if (this.cdTimeCurrent == 0) {
                    this.cdTimeCurrent = this.currVo.cdTime;
                    this.FirstcdTime();
                }
            }
            Tick.Clear(this, this.FrameContinuousTime);
            Tick.Loop(100, this, this.FrameContinuousTime);
        }

        /** 持续倒计时帧函数，0.1秒 */
        private FrameContinuousTime() {
            this.continuousTimeCurrent -= 0.1;
            if (this.continuousTimeCurrent > 0) {
                this.ShowTimeText(this.continuousTimeCurrent);
                this.drawSector((this.currVo.continuousTime - this.continuousTimeCurrent) / this.currVo.continuousTime, false);
            }
            else {
                this.continuousTimeCurrent = 0;
                this.item.getChildByName("cd_mask")["visible"] = true;
                this.drawSector(1, false);
                this.FrameCdTime();
            }
        }

        /** 冷却倒计时*/
        private FrameCdTime() {
            this.cdTimeCurrent -= 0.1;
            if (this.cdTimeCurrent > 0) {
                this.ShowTimeText(this.cdTimeCurrent);
                this.drawSector((this.currVo.cdTime - this.cdTimeCurrent) / this.currVo.cdTime, true);
                this.FirstcdTime();
            } else {
                this.cdTimeCurrent = 0;
                this.countdown = false;
                this.continuousTimeNode["text"] = "";
                this.drawSector(0, true);
                this.UpdateMp(this.mpvalue);
                this.FirstcdTime();
                Tick.Clear(this, this.FrameContinuousTime);
                if (this.mpvalue >= this.currVo.conMp) {
                    this.effectCd.PlayOnce();
                }
            }
        }

        /** 显示时间文字 */
        private ShowTimeText(time: number) {
            let surplustime: number = Math.ceil(time);
            if (surplustime > 0) {
                if (surplustime < 60) {
                    this.continuousTimeNode["text"] = surplustime;
                }
                else {
                    let t: string;
                    if (surplustime < 60) {
                        t = surplustime < 10 ? "0" + surplustime : String(surplustime);
                    }
                    else {
                        this.continuousTimeNode["text"] = (surplustime / 60 >> 0) + ":" + surplustime % 60;
                        let m: string = (surplustime / 60 >> 0) < 10 ? "0" + (surplustime / 60 >> 0) : String(surplustime / 60 >> 0);
                        let s: string = surplustime % 60 < 10 ? "0" + surplustime % 60 : String(surplustime % 60);
                        t = m + ":" + s;
                    }
                    this.continuousTimeNode["text"] = t;
                }
            }
        }

        /** 画扇形,即为露出的部分 */
        private drawSector(percentage: number, dir: boolean) {
            this.maski.graphics.clear();
            if (percentage > 0 && percentage < 1) {
                if (dir) {
                    this.maski.graphics.drawPie(52, 52, 74, -90, -90 + 360 * percentage, '#0');
                }
                else {
                    this.maski.graphics.drawPie(52, 52, 74, -90 + 360 * percentage, 270, '#0');
                }
            }
            else if (percentage >= 1) {
                this.maski.graphics.drawCircle(52, 52, 74, '#0');
            }
        }

        private FirstcdTime() {
            if (this.index == 1) {
                ViewUILogic.Instance.FirstSkillCd = this.cdTimeCurrent;
            }
        }

    }
}