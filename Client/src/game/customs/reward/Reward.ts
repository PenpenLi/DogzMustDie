module H52D_Framework {

    //奖励类型
    export enum RewardType {
        Item = 1,   //道具
        Equip = 2,  //装备
        Hero = 3,   //英雄
        Pet = 4     //神兽
    }
    
    /**
     * 奖励处理类
     * @author zhangyusong
     */
    export class Reward {

        public data: { [key: number]: any };
        private readonly coinlist: Array<number> = [1, 2, 3, 4];

        constructor() {
        }

        /**
         * 奖励物品分拣站，物品归类处理
         * @param list 奖励列表
         * --服务器返回的原始数据
         */
        public RewardSorting(list: Object): void {
            for (let t in list) {
                let data = list[t];
                switch (Number(t)) {
                    case RewardType.Item:
                        for (let itemId in data) {
                            if (Number(itemId) == 1 || Number(itemId) == 3) {    //这是货币
                                EffectManager.Instance.AddItem(Number(itemId), data[itemId]);
                            }
                            else {   //不是货币就装进宝箱,碎片
                                EffectManager.Instance.AddBox(Number(t), Number(itemId), data[itemId]);
                            }
                        }
                        //箱子装满，发送出去
                        EffectManager.Instance.SendBox();
                        break;
                    case RewardType.Equip:
                        for (let itemId in data) {
                            EffectManager.Instance.AddBox(Number(t), Number(itemId), data[itemId]);
                        }
                        //箱子装满，发送出去
                        EffectManager.Instance.SendBox();
                        break;
                    case RewardType.Hero:

                        break;
                    case RewardType.Pet:
                        
                        break;
                    default:
                        break;
                }
            }
        }

        public getData(type: RewardType, list: Object): void {

        }

    }
}