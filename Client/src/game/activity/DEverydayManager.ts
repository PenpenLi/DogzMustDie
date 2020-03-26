/*
* name;
*/
module H52D_Framework {

    /***消耗钻石  数据管理 */
    export class DEverydayManager {

        constructor() {

            this.Initialize();
        }

        private static _init: DEverydayManager;

        private _bool: boolean;
        private _lingqu: { [id: number]: number } = {};
        private action_arr: Array<number> = [];
        private d_num;
        public static get Instance(): DEverydayManager {
            if (DEverydayManager._init == null) {
                DEverydayManager._init = new DEverydayManager();
            }
            return DEverydayManager._init
        }

        public Initialize(): void {
            RemoteCall.Instance.RegistJXS2CProtocol("C_DayConsumeInfo", this)// 花费了多少钻石
            RemoteCall.Instance.RegistJXS2CProtocol("C_DayConsumeGetAward", this)
            this._bool = true;
        }

        private _actionDate: any;



        public get ShowEff() {
            return this._bool;
        }

        public set ShowEff(value) {
            this._bool = value;
        }
        // 活动开启
        public Start(cls: OActivityData) {
            this.ActionData = cls.data;
        }


        //活动结束
        public OnDestroy(_type: any) {
            Event.DispatchEvent("CloseOActivityView", _type);
        }

        /** 消耗的钻石数 */
        public get Dnum() {
            return this.d_num;
        }


        /**当前的数据信息 */
        public get ActionData() {
            return this._actionDate;
        }


        public set ActionData(view: any) {
            this._actionDate = view;
        }

        public get ActionArr() {
            return this.action_arr;
        }

        public set ActionArr(value) {
            this.action_arr = value;
        }

        public get LingQu() {
            return this._lingqu;
        }

        public GetInfoArr() {
            this.action_arr = [];
            if (this._actionDate == null) return this.action_arr;
            for (let key in this._actionDate.award) {
                this.action_arr.push(Number(key));
            }
            return this.action_arr;
        }

        /**控制特效显示 */
        public eff_Contr() {
            if (this._actionDate == null) return false
            for (let key in this._actionDate.award) {
                let info = this._actionDate.award[key];
                let bool = info.value > this.d_num ? false : true;
                if (this._lingqu[key] != 1 && !bool) {
                    return true;
                }
            }
            return false
        }

        public red_contr() {
            if (this._actionDate == null) return false
            for (let key in this._actionDate.award) {
                let info = this._actionDate.award[key];
                let bool = info.value > this.d_num ? false : true;
                if (this._lingqu[key] != 1 && bool) {
                    return true;
                }
            }
            return false;
        }

        /**************************** */

        /** 消耗了多少钻石 */
        public C_DayConsumeInfo(buf) {
            this.d_num = buf[0];
            this._lingqu = buf[1];

        }

        /**请求领取奖励成功 */
        public C_DayConsumeGetAward(buf) {
            let item_id = buf[0];
            TipsLogic.Instance.OpenGoodsProTips(buf[1])
            this._lingqu[item_id] = 1;
            Event.DispatchEvent("resh_diamond");
            Event.DispatchEvent("UpdateOActivitysEntrance");
            Event.DispatchEvent("UpdateBtnList");
            Event.DispatchEvent("UpdateBtnList_activebg");
        }
    }
}
