module H52D_Framework {
    export class BagManager {
        private bagData: BagData = new BagData();;

        private static _instance: BagManager;

        public static get Instance(): BagManager {
            if (this._instance == null) {
                this._instance = new BagManager();
            }
            return this._instance;
        }

        public Initialize(): void {
            //开始同步通知
            RemoteCall.Instance.RegistJXS2CProtocol("C_SendItemBeginMsg", this);
            //同步物品
            RemoteCall.Instance.RegistJXS2CProtocol("C_SendGroupItemMsg", this);
            //同步物品结束
            RemoteCall.Instance.RegistJXS2CProtocol("C_SendItemEndMsg", this);
            //更新物品数量
            RemoteCall.Instance.RegistJXS2CProtocol("C_UpdateItemCount", this);

            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqExchangeItem", this);
        }

        /**
         * 道具开始准备工作
         */
        private C_SendItemBeginMsg(): void {
            this.bagData.Init()
        }

        /**
         * 物品收货，最大50个
         * @param tGroup
         */
        private C_SendGroupItemMsg(tGroup: Object): void {
            for (let key in tGroup[0]) {
                let data: Object = tGroup[0][key];
                this.bagData.Push(new ItemVo(data[1], data[2]));
            }
        }

        /**
         * 物品结束，最大50个
         * @param tGroup
         */
        private C_SendItemEndMsg(tGroup: any): void {
            for (let key in tGroup[0]) {
                let data: Object = tGroup[0][key];
                this.bagData.Push(new ItemVo(data[1], data[2]));
            }
            Event.DispatchEvent(EventDefine.ADD_DIAMONDS);
        }

        /**
         * 物品更新
         * @param tGroup
         */
        private C_UpdateItemCount(itemInfo: any): void {
            this.bagData.UpdateItem(itemInfo[0], itemInfo[1]);
            OneTimer(500, () => {
                Event.DispatchEvent(EventDefine.ADD_DIAMONDS);
                Event.DispatchEvent("PackRef");
            });

            Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_6);
        }

        private _isShow: boolean = false;

        public get IsShow() {
            return this._isShow;
        }

        public set IsShow(value) {
            this._isShow = value;
        }

        private data = 0;
        /**请求兑换道具 的回掉 */
        private C_ReqExchangeItem(buf) {
            TipsLogic.Instance.OpenGoodsProTips(buf[1])
            if (UIManager.Instance.IsHave("GiftBag2YuanView", ViewUpRoot)) {
                Event.DispatchEvent("closeview_twodoller");
            }
            this.data = this.getItemNumber(buf[0]);
            Event.DispatchEvent("UpdateBtnList");
        }
        public get Data() {
            return this.data;
        }

        public getItemNumber(id: number): number {
            return this.bagData.getItemNum(id);
        }

        /** 获取道具列表 */
        public GetItemList() {
            return this.bagData.GetList()
        }

        /**发送请求 兑换道具 */
        public K_ReqExchangeItem(item_Id: number) {
            RemoteCall.Instance.Send('K_ReqExchangeItem', item_Id)
            this.getItemNumber(item_Id);
        }

    }
}