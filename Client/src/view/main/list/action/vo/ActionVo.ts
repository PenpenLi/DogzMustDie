module H52D_Framework {
    /**
     * @class 活动数据模型
     * @author zhangyusong
     */
    export class ActionVo {
        /** 编号 */
        public id:number;
        /** 活动类型 */
        public type:ActionType;
        /** 活动名称 */
        public name:string;
        /** 活动详情Id */
        public detailsId:number;
        /** 活动时间 */
        public actionTime:string;
        /** 活动时间显示 */
        public actionTimeShow:string;
        public timeStart:Date;
        public timeEnd:Date;
        /** 所处的时间段 */
        public timePoint:number;
        // /** 走马灯提醒时间 */
        // public ledTime:string;
        /** 奖品列表 */
        public reward:Array<ItemModel>;
        /** 剩余时间 */
        public remaning:number;

        /********** 话题先锋数据模型 **********/
        /** 话题点 */
        public attackPoint:string;
        /** 玩法说明 */
        public attackInstruction:string;
        /** 倒计时时长 */
        public countdown:number;
        /** 怪物id */
        public monsterId:number;
        /** 当前贡献分数*/
        public contribution:number;
    	/** 胜利一方是谁 */
        public win:ViewPoint;
    	/** 支持方观点 */
        public viewPoint:ViewPoint;
    	/** 支持时间戳 */ 
        public stamp:number = 0;
        /** 支持的人数 */
        public supportNum:number;
        /** 反对的人数 */
        public againstNum:number;
    }
}