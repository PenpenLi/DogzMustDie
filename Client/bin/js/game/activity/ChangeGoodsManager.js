/*
* name;
*/
/**物品兑换 数据管理 */
var H52D_Framework;
(function (H52D_Framework) {
    var ChangeGoodsManager = /** @class */ (function () {
        function ChangeGoodsManager() {
            this._play_ChangeTimes = {};
            /**道具领取记录 */
            this._lingqu = {};
            /**活动数据 */
            this.activon_arr = [];
            /**兑换道具需要的 道具数量 */
            this._changeItem_needs = {};
            this.Initialize();
        }
        Object.defineProperty(ChangeGoodsManager, "Instance", {
            get: function () {
                if (ChangeGoodsManager._init == null) {
                    ChangeGoodsManager._init = new ChangeGoodsManager();
                }
                return ChangeGoodsManager._init;
            },
            enumerable: true,
            configurable: true
        });
        ChangeGoodsManager.prototype.Initialize = function () {
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ConversionInfo", this); // 兑换次数
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ConversionGetAward", this);
        };
        /**活动开始 */
        ChangeGoodsManager.prototype.Start = function (cls) {
            this.ActionData = cls.data;
        };
        /**活动结束 */
        ChangeGoodsManager.prototype.OnDestroy = function (_type) {
            H52D_Framework.Event.DispatchEvent("CloseOActivityView", _type);
        };
        Object.defineProperty(ChangeGoodsManager.prototype, "ActionData", {
            /**活动数据 */
            get: function () {
                return this._actionDate;
            },
            set: function (view) {
                this._actionDate = view;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChangeGoodsManager.prototype, "PlayChangeTimes", {
            /**玩家兑换此道具的次数 */
            get: function () {
                return this._play_ChangeTimes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChangeGoodsManager.prototype, "Lingqu", {
            /**  */
            get: function () {
                return this._lingqu;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChangeGoodsManager.prototype, "ChangeItemNeeds", {
            /**兑换道具 所需要的道具 */
            get: function () {
                return this._changeItem_needs;
            },
            set: function (value) {
                this._changeItem_needs = value;
            },
            enumerable: true,
            configurable: true
        });
        /**获取活动的数组 */
        ChangeGoodsManager.prototype.GetArr = function () {
            if (this._actionDate == null)
                return this.activon_arr;
            this.activon_arr = [];
            for (var key in this._actionDate.award) {
                this.activon_arr.push(Number(key));
            }
            return this.activon_arr;
        };
        ChangeGoodsManager.prototype.red_contr = function () {
            return false;
        };
        /**能否兑换道具 */
        ChangeGoodsManager.prototype.IsChangeItem = function (needItem) {
            var _Idx = 0;
            for (var key in needItem) {
                var Item_Id = needItem[key][2];
                var Item_num = needItem[key][3];
                var playItem_num = H52D_Framework.BagManager.Instance.getItemNumber(Number(Item_Id));
                if (playItem_num < Item_num) {
                    _Idx++;
                }
            }
            var bool = _Idx == 0 ? true : false;
            return bool;
        };
        /**请求兑换道具 */
        ChangeGoodsManager.prototype.ChangeItem = function (type, Item_Id) {
            H52D_Framework.OActivityLogic.Instance.K_GetActivityAwardReq(type, Item_Id);
        };
        /*************************************** */
        /**兑换次数 */
        ChangeGoodsManager.prototype.C_ConversionInfo = function (buf) {
            this._play_ChangeTimes = buf[0];
        };
        /**物品兑换回调 */
        ChangeGoodsManager.prototype.C_ConversionGetAward = function (buf) {
            this._play_ChangeTimes = buf[0];
            var _item = buf[1];
            H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(buf[1]);
            H52D_Framework.Event.DispatchEvent("resh_goods");
            H52D_Framework.Event.DispatchEvent("UpdateBtnList_activebg");
        };
        return ChangeGoodsManager;
    }());
    H52D_Framework.ChangeGoodsManager = ChangeGoodsManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ChangeGoodsManager.js.map