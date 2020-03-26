module H52D_Framework {
    /**
     * 技能数据类
     * @author zhangyusong
     */
    export class SkillVo {
        /** 技能ID */
        public id: number;
        /** 技能解锁 */
        public unlock: boolean;
        /** 法力消耗 */
        public conMp: number;
        /** 技能持续时间 */
        public continuousTime: number;
        /** 技能冷却时间 */
        public cdTime: number;
        /** 技能图标 */
        public strIcon: string;

        public constructor(id: number) {
            this.id = id;
            if (id == 0) return;
            let data: any = ActiveSkillConfig[id];
            this.conMp = data["conMp"];
            this.cdTime = data["skillCD"] * 0.001;
            this.continuousTime = 0;
            let status = data["statusList"][1];
            if (!!status)  {
                this.continuousTime = StatusConfig[status[3]]["periodEffect"][3];
                this.continuousTime *= 0.001;
            }
            this.strIcon = "ui_icon/" + data["strIcon"];
        }
    }
}