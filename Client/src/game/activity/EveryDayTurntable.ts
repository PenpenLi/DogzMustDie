/*
* 充值转盘;
*/
module H52D_Framework {
    export class EveryDayTurntable {
        private tableAngle: number = 0;         // 储存的角度
        private turnData: any;                  // 当前返回的所有数据
        private awardArr: any[] = [];           // 道具奖励信息
        private functionID: string;             // 功能id
        private giftData: any;                  // 礼包领取信息
        private startTime: number = 0;          // 开始时间
        private endTime: number = 0;            // 结束时间
        private timerNum: number = 0;           // 剩余时间 
        private freeNum: number = 0;
        private canFreeNum: number = 0;         // 可用免费次数
        private endNum: number = 0;             // 累计使用次数
        private giftTypeData: any;              // 礼包领取状态
        private indexItemData: any;             // 返回抽到的物品列表
        private functionName: string = "";      // 功能名字

        //=================================================
        private historyData: any;                        // 中奖历史信息
        private discount: number;                        //折扣
        private onePrice: number = 0;                    // 一次的价钱
        private tenPrice: number = 0;                    // 十次的价钱

        private static _inst: EveryDayTurntable;
        public static get Instance() { //单例模式
            if (EveryDayTurntable._inst == null)
                EveryDayTurntable._inst = new EveryDayTurntable();
            return EveryDayTurntable._inst;
        }

        // 接收服务器消息
        constructor() {
            RemoteCall.Instance.RegistJXS2CProtocol("C_DayDialInfo", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_DayDialAward", this);
        }

        /**
         * 上线同步数据
         */
        private C_DayDialInfo(buf: any): void {
            this.canFreeNum = this.freeNum - buf[0][1];
            this.endNum = buf[0][2];
            this.giftTypeData = buf[0][3];
            this.historyData = buf[0][4];
            let _historyData: Object = new Object();
            let _index = 1;
            for (let h = GetTabLength(this.historyData); h > 0; h--) {
                _historyData[_index] = this.historyData[h];
                _index++;
            }
            this.historyData = _historyData;
            Event.DispatchEvent("updataTurnTable");
            Event.DispatchEvent('RefTurnTable');
            Event.DispatchEvent("UpdateBtnList_activebg");
        }

        /**
         * 转转盘
         */
        public K_BuyChargeAward(num: number): void {
            RemoteCall.Instance.Send('K_BuyChargeAward', this.functionID, num);
        }

        /**
         * 转盘回调
         */
        private C_DayDialAward(buf: any): void {
            this.indexItemData = buf[0];
            Event.DispatchEvent("TurnTableYAOYIYAO");
        }

        /**
         * 领取奖励
         */
        public K_GetActivityAwardReq(num): void {
            RemoteCall.Instance.Send('K_GetActivityAwardReq', this.functionID, num);
        }

        // 活动开启
        public Start(cls: OActivityData) {
            this.ActionData = cls.data;
        }

        //活动结束
        public OnDestroy(type: any) {
            Event.DispatchEvent("CloseOActivityView", type);
            this.tableAngle = 0;
            this.turnData = null;
            this.awardArr = [];
            this.functionID = null;
            this.giftData = null;
            this.startTime = 0;
            this.endTime = 0;
            this.timerNum = 0;
            this.canFreeNum = 0;
            this.freeNum = 0;
            this.endNum = 0;
            this.giftTypeData = null;
            this.indexItemData = null;
            this.functionName = "";
            this.historyData = null;
            this.onePrice = 0;
            this.tenPrice = 0;
        }

        /**当前的数据信息 */
        public get ActionData() {
            return this.turnData;
        }
        public set ActionData(buf: any) {
            this.turnData = buf;                    // 所有信息
            this.awardArr = [];                     // 道具信息
            this.functionID = buf["id"];    // 功能id
            this.giftData = buf["cost"];            // 达成礼包信息
            this.startTime = Number(buf["svst"]);   // 开始时间
            this.endTime = Number(buf["svot"]);     // 结束时间
            this.tableAngle = 0;
            if (buf["award"]) {
                this.freeNum = buf["award"][0]['freenum'];//免费次数
                this.discount = buf["award"][0]['rebate'] / 10 == 0 ? 1 : buf["award"][0]['rebate'] / 10;//折扣
                this.onePrice = buf["award"][0]["onecost"];
                this.tenPrice = buf["award"][0]["tencost"];
                // for (let i in buf["award"]) {
                //     this.awardArr.push(buf.award[String(i)]);
                // }
                for (let i = 1; i <= 10; i++) {
                    this.awardArr.push(buf.award[String(i)]);
                }
            }
            this.functionName = buf["name"];
        }

        /**
         * 获取当前剩余时间
         */
        public get TimerNum(): number {
            return this.timerNum;
        }

        /**
         * 记录转盘角度
         */
        public get TableAngle(): number {
            return this.tableAngle;
        }

        public set TableAngle(angle: number) {
            this.tableAngle = angle;
        }

        /**
         * 道具列表
         */
        public get AwardData(): any[] {
            return this.awardArr;
        }

        /**
         * 功能id
         */
        public get FunctionID(): string {
            return this.functionID;
        }

        /**
         * 达成礼包信息
         */
        public get GiftData(): any {
            return this.giftData;
        }

        /**
         * 功能名字 
         */
        public get FunctionName(): string {
            return this.functionName;
        }

        /**
         * 累计使用次数
         */
        public get EndNum(): number {
            return this.endNum;
        }

        /**
         * 免费次数
         */
        public get FreeNum(): number {
            return this.canFreeNum;
        }

        /**
         * 礼包领取状态
         */
        public get GiftTypeData(): any {
            return this.giftTypeData;
        }

        /**
         * 开始时间
         */
        public get StartTime(): number {
            return this.startTime;
        }

        /**
         * 结束时间
         */
        public get EndTime(): number {
            return this.endTime;
        }

        /**
         * 后台返回抽到几个物品
         */
        public GetIndexGift(): number {
            let num: number = 0;
            for (let i in this.indexItemData) {
                num++;
            }
            return num;
        }

        /**
         * 返回摇到的物品
         */
        public get GiftItemData(): any {
            return this.indexItemData;
        }

        /**展示的物品list(1抽) */
        public get ShowGift() {
            let _itemArr0: Object = new Object();
            let _itemArr: Object = new Object();
            for (let i in this.indexItemData) {
                _itemArr[this.indexItemData[i][2]] = this.indexItemData[i][3];
                let _itemType = this.awardArr[this.indexItemData[i][1] - 1]["Type"];
                _itemArr0[_itemType] = _itemArr;
            }
            return _itemArr0;
        }
        /**展示的物品list(10抽) */
        public get ShowGiftMore() {
            let _itemArr0: Object = new Object();
            let _itemArrType: Object = new Object();
            let _itemArr: Object = new Object();
            for (let i in this.indexItemData) {
                _itemArr = new Object();
                _itemArrType = new Object();
                _itemArr[this.indexItemData[i][2]] = this.indexItemData[i][3];
                let _itemType = this.awardArr[this.indexItemData[i][1] - 1]["Type"];
                _itemArrType[_itemType] = _itemArr;
                _itemArr0[i] = _itemArrType;
            }
            return _itemArr0;
        }

        /**
         * 中奖历史记录
         */
        public get HistoryData(): any {
            return this.historyData;
        }

        /**抽奖次数 */
        public get GetTurnNum() {
            return this._turnNum;
        }

        /**折扣 */
        public get Discount() {
            return this.discount;
        }

        /**
         * 一次的价钱
         */
        public get OneCost(): number {
            return Number(this.onePrice);
        }

        /**
         * 十次的价钱
         */
        public get TenCost(): number {
            return Number(this.tenPrice);
        }

        //====================================================
        private _turnNum: number;                //抽奖次数
        private _turnNumObjAll: Object = [5, 10, 50, 70, 100];

        /**点击额外宝箱奖励 */
        public OnClickOpenBox(id: number) {
            if (this._turnNum >= this._turnNumObjAll[id]) {
                if (this.giftTypeData[id] != 1) {
                    //可领取
                }
            }
            else {
                //打开详情
            }
        }

        /**红点 */
        public red_contr() {
            if (this.canFreeNum > 0) {
                return true;
            } return false;
        }
    }
}