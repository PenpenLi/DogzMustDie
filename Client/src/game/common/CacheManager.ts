
module H52D_Framework {
    /**
     * @class 缓存管理类
     * @author zhangyusong
     */
    export class CacheManager {
        private static _inst: CacheManager;
        public static get Instance() {
            if (CacheManager._inst == null) {
                CacheManager._inst = new CacheManager();
            }
            return CacheManager._inst;
        }

        private _derailData: number;

        /** 获取开关信息 */
        public getDerailByType(cls: CacheTypeEnum, type: number): boolean {
            let local: number = type;
            let cacheValue = MasterPlayer.Instance.cacheValue;
            this._derailData = cacheValue[Number(cls)];
            // this._derailData = MasterPlayer.Instance.cacheValue[cls];
            let open: boolean = !!(this._derailData & (1 << local));
            return open;
        }

        /**
         * 设置某个类型的开关
         */
        public setDerailByType(cls: CacheTypeEnum, type: number, open: boolean) {
            let local: number = type;
            this._derailData = MasterPlayer.Instance.cacheValue[cls];
            if (open) {
                this._derailData |= (1 << local);
            }
            else {
                this._derailData &= ~(1 << local);
            }
            MasterPlayer.Instance.cacheValue[cls] = this._derailData;
            RemoteCall.Instance.Send("K_ChgCliendInfo", cls, this._derailData);
        }


    }
}