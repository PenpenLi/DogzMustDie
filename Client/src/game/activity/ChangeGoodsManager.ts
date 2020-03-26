/*
* name;
*/
/**物品兑换 数据管理 */
module H52D_Framework {
    export class ChangeGoodsManager {
        constructor() {
            this.Initialize();

        }

        private static _init: ChangeGoodsManager;

        private _play_ChangeTimes: { [Item_id: number]: number } = {};
        public static get Instance() {
            if (ChangeGoodsManager._init == null) {
                ChangeGoodsManager._init = new ChangeGoodsManager();
            }
            return ChangeGoodsManager._init
        }

        /**道具领取记录 */
        private _lingqu: { [money: number]: number } = {};
        /**活动数据 */
        private activon_arr: Array<number> = [];

        /**兑换道具需要的 道具数量 */
        private _changeItem_needs: { [Item_Id: number]: { [Item_Id: number]: number } } = {};

        public Initialize(): void {

            RemoteCall.Instance.RegistJXS2CProtocol("C_ConversionInfo", this);// 兑换次数
            RemoteCall.Instance.RegistJXS2CProtocol("C_ConversionGetAward", this);
        }

        private _actionDate: any;

        /**活动开始 */
        public Start(cls: OActivityData) {
            this.ActionData = cls.data;
        }

        /**活动结束 */
        public OnDestroy(_type: any) {
            Event.DispatchEvent("CloseOActivityView", _type);
        }

        /**活动数据 */
        public get ActionData() {
            return this._actionDate;
        }

        public set ActionData(view: any) {
            this._actionDate = view;
        }

        /**玩家兑换此道具的次数 */
        public get PlayChangeTimes() {
            return this._play_ChangeTimes;
        }

        /**  */
        public get Lingqu() {
            return this._lingqu;
        }

        /**兑换道具 所需要的道具 */
        public get ChangeItemNeeds() {
            return this._changeItem_needs;
        }

        public set ChangeItemNeeds(value) {
            this._changeItem_needs = value;
        }

        /**获取活动的数组 */
        public GetArr() {
            if (this._actionDate == null) return this.activon_arr;
            this.activon_arr = [];
            for (let key in this._actionDate.award) {
                this.activon_arr.push(Number(key));
            }
            return this.activon_arr;
        }     

        public red_contr(){
            return false;
        }

        /**能否兑换道具 */
        public IsChangeItem(needItem: {}): boolean {
            let _Idx: number = 0;

            for (let key in needItem) {
                let Item_Id = needItem[key][2];
                let Item_num = needItem[key][3];
                let playItem_num = BagManager.Instance.getItemNumber(Number(Item_Id));
                if (playItem_num < Item_num) {
                    _Idx++;
                }
            }

            let bool = _Idx == 0 ? true : false;
            return bool;
        }

        /**请求兑换道具 */
        public ChangeItem(type: number, Item_Id: number) {
            OActivityLogic.Instance.K_GetActivityAwardReq(type, Item_Id);
        }

        /*************************************** */

        /**兑换次数 */
        private C_ConversionInfo(buf) {
            this._play_ChangeTimes = buf[0];
        }

        /**物品兑换回调 */
        private C_ConversionGetAward(buf) {
            this._play_ChangeTimes = buf[0];
            let _item = buf[1];
            TipsLogic.Instance.OpenGoodsProTips(buf[1])
            Event.DispatchEvent("resh_goods");
            Event.DispatchEvent("UpdateBtnList_activebg");
            
        }

    }
}

