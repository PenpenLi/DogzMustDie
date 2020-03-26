var H52D_Framework;
(function (H52D_Framework) {
    //奖励类型
    var RewardType;
    (function (RewardType) {
        RewardType[RewardType["Item"] = 1] = "Item";
        RewardType[RewardType["Equip"] = 2] = "Equip";
        RewardType[RewardType["Hero"] = 3] = "Hero";
        RewardType[RewardType["Pet"] = 4] = "Pet"; //神兽
    })(RewardType = H52D_Framework.RewardType || (H52D_Framework.RewardType = {}));
    /**
     * 奖励处理类
     * @author zhangyusong
     */
    var Reward = /** @class */ (function () {
        function Reward() {
            this.coinlist = [1, 2, 3, 4];
        }
        /**
         * 奖励物品分拣站，物品归类处理
         * @param list 奖励列表
         * --服务器返回的原始数据
         */
        Reward.prototype.RewardSorting = function (list) {
            for (var t in list) {
                var data = list[t];
                switch (Number(t)) {
                    case RewardType.Item:
                        for (var itemId in data) {
                            if (Number(itemId) == 1 || Number(itemId) == 3) { //这是货币
                                H52D_Framework.EffectManager.Instance.AddItem(Number(itemId), data[itemId]);
                            }
                            else { //不是货币就装进宝箱,碎片
                                H52D_Framework.EffectManager.Instance.AddBox(Number(t), Number(itemId), data[itemId]);
                            }
                        }
                        //箱子装满，发送出去
                        H52D_Framework.EffectManager.Instance.SendBox();
                        break;
                    case RewardType.Equip:
                        for (var itemId in data) {
                            H52D_Framework.EffectManager.Instance.AddBox(Number(t), Number(itemId), data[itemId]);
                        }
                        //箱子装满，发送出去
                        H52D_Framework.EffectManager.Instance.SendBox();
                        break;
                    case RewardType.Hero:
                        break;
                    case RewardType.Pet:
                        break;
                    default:
                        break;
                }
            }
        };
        Reward.prototype.getData = function (type, list) {
        };
        return Reward;
    }());
    H52D_Framework.Reward = Reward;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Reward.js.map