/*
* name;
*/
module H52D_Framework {
    /**离线收益 管理 */
    export class ProfManager {
        private _reward;
        private _time;
        private static _instance: ProfManager;
        constructor() {

        }

        public Initialize() {
            RemoteCall.Instance.RegistJXS2CProtocol("C_AddLeaveAward", this);

            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqLeaveAward", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_AddLeaveAwardAd", this);
        }
        public static get Instance(): ProfManager {
            if (this._instance == null) {
                this._instance = new ProfManager();
            }
            return this._instance;
        }
        /**接收 离线收益 */
        private C_AddLeaveAward(buf: any) {
            this._time = buf[0];
            this._reward = buf[1];
        }

        private C_AddLeaveAwardAd(buf: any) {
            this._time = buf[0];
            this._reward = buf[1];
            if (window["wx"]) {
                if (this._time > 60) {
                    if (AdvertisingManager.Instance.bnWXAdertisingTimes) {
                        UIManager.Instance.CreateUI("ProfitView", [ViewUpRoot])
                    } else {
                        let str = GetInfoAttr.Instance.GetSystemText(30071);
                        TipsLogic.Instance.OpenSystemTips(str);
                    }
                }
            }
        }

        private C_ReqLeaveAward(buf: any) {
            if (window["wx"]) {
                let str = "恭喜获得："
                str = str + "金币" + this._reward[1][1]
                TipsLogic.Instance.OpenSystemTips(str);
                str = "获得：经验" + this._reward[1][3]
                TipsLogic.Instance.OpenSystemTips(str);
            }
            if (UIManager.Instance.IsHave("ProfitView", ViewUpRoot)) {
                UIManager.Instance.DestroyUI("ProfitView", [ViewUpRoot]);
            }
        }

        /**创建离线收益面板 */
        public Add_Prof() {
            if (AdvertisingManager.Instance.bnWXAdertisingTimes && this._time > 60) {
                UIManager.Instance.CreateUI("ProfitView", [ViewUpRoot])
            }
        }

        public get Time() {
            return this._time
        }

        public get AddReward() {
            return this._reward;
        }
    }
}
