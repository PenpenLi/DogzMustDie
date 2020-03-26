module H52D_Framework {
    /**
     * 背包类,存放物品
     * @author zhangyusong
     */
    export class BagData {

        /** 道具 */
        private data: { [id: number]: ItemVo };
        

        public constructor() {

        }

        /** 获取道具列表 */
        public GetList() {
            return this.data
        }

        /** 初始化 */
        public Init(): void {
            this.data = {};
        }

        /** 道具放入背包 */
        public Push(vo: ItemVo): void {
            this.data[vo.id] = vo;
        }

        /**
         * 获取物品 
         * @param itemType:道具类型,
         * @param id:道具ID,没有id返回整个列表
         */
        public getItem(id: number): ItemVo {
            return this.data[id] as ItemVo;
        }

        /**
         * 获取物品数量 
         * @param itemType:道具类型,
         * @param id:道具ID,没有id返回整个列表
         */
        public getItemNum(id: number): number {
            let oItem = this.data[id];
            if (!oItem) {
                return 0;
            }
            return oItem.itemNumber;
        }

        /** 道具数量更新 */
        public UpdateItem(id: number, num: number): void {
            let item: ItemVo = this.data[id];
            if (!item) {
                item = new ItemVo(id, num);
                this.data[id] = item;
            }
            else {
                item.itemNumber = num;
            }
            // 派发金币事件
            if (id == BaseDefine.ItemIdGold) {
                Event.DispatchEvent("ChangeMoeny");
            }
           
               
            

            //新手引导
            // if (Guidance.Instance.bNewbie == true &&
            //     item.dwItemTypes == 21 &&
            //     HeroManager.Instance.HeroIstrue(item.heroId) == true) {
            //     Guidance.Instance.SecondGuidance();
            // }
        }
    }
}