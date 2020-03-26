/*
* name;
*/
module H52D_Framework {

    /**每日累充 数据管理 */
    export class mEverydayManager {
        constructor() {


            this.Initialize();

        }

        private static _init: mEverydayManager;
        private activon_arr: Array<any> = [];

        private _lingqu: { [money: number]: number } = {};

        private _mymoney: number;
        public static get Instance(): mEverydayManager {
            if (mEverydayManager._init == null) {
                mEverydayManager._init = new mEverydayManager();
            }
            return mEverydayManager._init
        }


        public Initialize(): void {
            RemoteCall.Instance.RegistJXS2CProtocol("C_DayTotalChargeInfo", this)//上线同步 
            RemoteCall.Instance.RegistJXS2CProtocol("C_DayTotalChargeGetAward", this)
            //this.GetArr();
        }

        private _actionDate: any;
        private _isOpen:boolean=false;

        // 活动开启
        public Start(cls: OActivityData) {
            this.ActionData = cls.data;
        }

        public get IsOpen(){
            return this._isOpen;
        }
        public set IsOpen(value){
            this._isOpen=value;
        }


        //活动结束
        public OnDestroy(_type: any) {
            Event.DispatchEvent("CloseOActivityView", _type);
        }


        /**当前的数据信息 */
        public get ActionData() {
            return this._actionDate;
        }


        public set ActionData(view: any) {
            this._actionDate = view;
        }

        /**活动里面的数组 */
        public get Activonarr() {
            return this.activon_arr;
        }

        public set Activonarr(view: any) {
            this.activon_arr = view;
        }

        public get MyMoney() {
            return this._mymoney;
        }

        public get Lingqu() {
            return this._lingqu;
        }

        /**获取活动的数组 */
        public GetArr() {
            if (this._actionDate == null) return this.activon_arr;
            this.activon_arr=[];
            for (let key in this._actionDate.award) {
                this.activon_arr.push(Number(key));
            }
            return this.activon_arr;
        }

        public red_contr() {
            if (this._actionDate == null) return false
            if (MasterPlayer.Instance.player.Level < 3) return false;
            for (let key in this._actionDate.award) {
                let info = this._actionDate.award[key];
                let bool = info.value > this._mymoney ? false : true;
                if (this._lingqu[key] != 1 && bool) {
                    return true;
                }
            }
            return false;
        }

        /**控制特效显示 */
        public eff_Contr() {
            if (this._actionDate == null) return false
            for (let key in this._actionDate.award) {
                let info = this._actionDate.award[key];
                let bool = info.value > this._mymoney ? false : true;
                if (!this._lingqu[key] && !bool) {
                    return true;
                }
            }
            return false
        }


        //********************************* */
        /**上线同步数据 */
        public C_DayTotalChargeInfo(buf) {
            this._mymoney = buf[0];
            this._lingqu = buf[1];
        }

        /**请求领取奖励成功 */
        public C_DayTotalChargeGetAward(buf) {
            let data = buf[0];
            TipsLogic.Instance.OpenGoodsProTips(buf[1])
            this._lingqu[data] = 1;
            Event.DispatchEvent("UpdateView_everydaymoney");
            Event.DispatchEvent("UpdateBtnList");
            Event.DispatchEvent("UpdateOActivitysEntrance");
            Event.DispatchEvent("UpdateBtnList_activebg");
        }

        public Red_print(){
            for(let key in  this._lingqu){
                let itemInfo = mEverydayManager.Instance.ActionData.award[key];
                let bool = mEverydayManager.Instance.MyMoney >= itemInfo.value ? true : false;
                if(bool&&this._lingqu[key]!=1){
                    return true;
                }                
            }
            return false;
        }
    }
}
