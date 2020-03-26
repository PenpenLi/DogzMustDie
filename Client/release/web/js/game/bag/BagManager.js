var H52D_Framework;
(function (H52D_Framework) {
    var BagManager = /** @class */ (function () {
        function BagManager() {
            this.bagData = new H52D_Framework.BagData();
            this._isShow = false;
            this.data = 0;
        }
        ;
        Object.defineProperty(BagManager, "Instance", {
            get: function () {
                if (this._instance == null) {
                    this._instance = new BagManager();
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        BagManager.prototype.Initialize = function () {
            //开始同步通知
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_SendItemBeginMsg", this);
            //同步物品
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_SendGroupItemMsg", this);
            //同步物品结束
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_SendItemEndMsg", this);
            //更新物品数量
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_UpdateItemCount", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqExchangeItem", this);
        };
        /**
         * 道具开始准备工作
         */
        BagManager.prototype.C_SendItemBeginMsg = function () {
            this.bagData.Init();
        };
        /**
         * 物品收货，最大50个
         * @param tGroup
         */
        BagManager.prototype.C_SendGroupItemMsg = function (tGroup) {
            for (var key in tGroup[0]) {
                var data = tGroup[0][key];
                this.bagData.Push(new H52D_Framework.ItemVo(data[1], data[2]));
            }
        };
        /**
         * 物品结束，最大50个
         * @param tGroup
         */
        BagManager.prototype.C_SendItemEndMsg = function (tGroup) {
            for (var key in tGroup[0]) {
                var data = tGroup[0][key];
                this.bagData.Push(new H52D_Framework.ItemVo(data[1], data[2]));
            }
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.ADD_DIAMONDS);
        };
        /**
         * 物品更新
         * @param tGroup
         */
        BagManager.prototype.C_UpdateItemCount = function (itemInfo) {
            this.bagData.UpdateItem(itemInfo[0], itemInfo[1]);
            H52D_Framework.OneTimer(500, function () {
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.ADD_DIAMONDS);
                H52D_Framework.Event.DispatchEvent("PackRef");
            });
            H52D_Framework.Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_6);
        };
        Object.defineProperty(BagManager.prototype, "IsShow", {
            get: function () {
                return this._isShow;
            },
            set: function (value) {
                this._isShow = value;
            },
            enumerable: true,
            configurable: true
        });
        /**请求兑换道具 的回掉 */
        BagManager.prototype.C_ReqExchangeItem = function (buf) {
            H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(buf[1]);
            if (H52D_Framework.UIManager.Instance.IsHave("GiftBag2YuanView", H52D_Framework.ViewUpRoot)) {
                H52D_Framework.Event.DispatchEvent("closeview_twodoller");
            }
            this.data = this.getItemNumber(buf[0]);
            H52D_Framework.Event.DispatchEvent("UpdateBtnList");
        };
        Object.defineProperty(BagManager.prototype, "Data", {
            get: function () {
                return this.data;
            },
            enumerable: true,
            configurable: true
        });
        BagManager.prototype.getItemNumber = function (id) {
            return this.bagData.getItemNum(id);
        };
        /** 获取道具列表 */
        BagManager.prototype.GetItemList = function () {
            return this.bagData.GetList();
        };
        /**发送请求 兑换道具 */
        BagManager.prototype.K_ReqExchangeItem = function (item_Id) {
            H52D_Framework.RemoteCall.Instance.Send('K_ReqExchangeItem', item_Id);
            this.getItemNumber(item_Id);
        };
        return BagManager;
    }());
    H52D_Framework.BagManager = BagManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=BagManager.js.map