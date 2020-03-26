module H52D_Framework {
    /**
     * @class：pvp房间模型
     * @author：zhangyusong
     */
    export class PvpRoomVo{
        /** 类型 */
        public type:number;
        /** 编号 */
        public id:number;
        /** 房间图标 */
        public roomIcon:string;
        /** 房间名称 */
        public rname:number;
        /** 花费 */
        public money:number;
        /** 皮肤 */
        public skin:string;
        /** 场景ID */
        public customsId:number;
        /** 选中 */
        public select:boolean;
    }
}