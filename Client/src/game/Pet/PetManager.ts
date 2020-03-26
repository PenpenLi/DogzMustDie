
module H52D_Framework {

    /**神兽管理 */
    export class PetManager {
        /**已有神兽列表 */
        private _ownPetList: { [id: number]: BPetVo } = {};

        private static _init: PetManager;

        /**拥有的孵化次数 */
        private _hasTimes: number;

        /**距离下次孵化的时间 */
        private _nextUpdatetime: number;

        /**已有的神兽数量 */
        private _petNum: number;

        /**当前上阵的神兽ID */
        private _currentpetID: number = 0;

        /**神兽配置表 */
        private _Petlist: Array<number> = [];

        /** 红点列表 */
        private _NewList = {}

        constructor() {
            for (let key in PetConfig) {
                let nIdx = Number(key);
                this._Petlist.push(nIdx);
            }
        }

        /**获取配置表中的所有神兽 */
        public get PetList() {
            return this._Petlist;
        }

        /**获取已有的神兽 */
        public get OwnPetList() {
            return this._ownPetList;
        }

        /**获取已有的神兽数量 */
        public get OwnPetNum(): number {
            return GetTabLength(this._ownPetList);
        }

        /**拥有的孵化次数 */
        public get HasTimes() {
            return this._hasTimes;
        }

        /**距离下次孵化的时间 */
        public get NextUpdateTime() {
            return this._nextUpdatetime;
        }

        /**获取当前上阵的神兽 */
        public get CurrentpetID() {
            return this._currentpetID;
        }

        /**设置当前上阵的神兽 */
        public set CurrentpetID(id: number) {
            this._currentpetID = id;
        }

        /**获取宠物实例 */
        public GetPet_Instance(nPetID): BPetVo {
            return this._ownPetList[nPetID];
        }

        public OnResetAttr()  {
            for (let k in this._ownPetList)  {
                this._ownPetList[k].OnReset();
            }
        }

        /** 主界面是否显示红点 */
        public IsMainShowRed() {
            let needOrder: number = OpenGradeConfig[E_OpenGrade.PET]["Checkpoint"]
            let customsOrder: number = MasterPlayer.Instance.player.CunstLevel;
            if (customsOrder+1 < needOrder) {
                return false
            }
            for (let flag in this._NewList) {
                return true
            }
            return false
        }

        /** 判断这个宠物是否是新获得的 */
        public IsNewPet(nPetID) {
            return this._NewList[nPetID] == 1
        }

        public static get Instance(): PetManager {
            if (PetManager._init == null) {
                PetManager._init = new PetManager();
            }
            return PetManager._init
        }

        public Initialize() {
            RemoteCall.Instance.RegistJXS2CProtocol("C_SendPetInfo", this);//上线同步
            RemoteCall.Instance.RegistJXS2CProtocol("C_PetUpdateTimes", this);//更新次数和时间
            RemoteCall.Instance.RegistJXS2CProtocol("C_AddPet", this);//添加宠物
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqGetPet", this);//领取宠物通知
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqUsePet", this);//请求上阵通知
        }

        /**上线同步 */
        private C_SendPetInfo(buf) {
            let PetList = buf[0];
            for (let nPetID in PetList) {
                let Level = PetList[nPetID]
                let npet = new BPetVo(Number(nPetID));
                npet.Level = Level;
                npet.Level > GameParamConfig.PetMaxLevel ? GameParamConfig.PetMaxLevel : npet.Level;
                this._ownPetList[npet.ID] = npet;
            }
            this._hasTimes = buf[1];
            this._nextUpdatetime = buf[2];
            this._currentpetID = buf[3];
            this._NewList = buf[4]
        }

        /**更新次数和时间 */
        private C_PetUpdateTimes(buf) {
            this._hasTimes = buf[0];
            this._nextUpdatetime = buf[1];

            Event.DispatchEvent('PetInit');

            this.SetShopPetVisible();
        }

        /**添加宠物 */
        private C_AddPet(buf) {
            let tId = buf[0];
            let tNum = buf[1];
            if (this._ownPetList[tId] == null) {
                let npet = new BPetVo(tId);
                this._ownPetList[npet.ID] = npet;
                // npet.bNet = true;
                // this.SetPetPoint(npet.bNet);
                this._NewList[tId] = 1
                this.SetPetPoint(this.IsMainShowRed());
            }
            this._ownPetList[tId].Level = tNum;
            this._ownPetList[tId].Level > GameParamConfig.PetMaxLevel ? GameParamConfig.PetMaxLevel : this._ownPetList[tId].Level;
            Event.DispatchEvent('PetInit');
            Event.DispatchEvent('ShowRedPoint', [E_OpenGrade.PET]);
        }

        /** 请求查看宠物 */
        public SendShowPet(nPetID) {
            if (this._NewList[nPetID] == 1) {
                delete this._NewList[nPetID]
            }
            RemoteCall.Instance.Send("K_ReqLookPet", nPetID);
            this.SetPetPoint(this.IsMainShowRed());
        }

        /**请求领取宠物 */
        public GetPet() {
            if (this._hasTimes < 1) return;
            RemoteCall.Instance.Send("K_ReqGetPet", this._hasTimes);
        }

        /**领取宠物通知 */
        private C_ReqGetPet(buf) {
            let pet_info = buf[0];
            this._hasTimes = buf[1];
            this._nextUpdatetime = buf[2];
            TipsLogic.Instance.OpenGoodsProTips(pet_info)
            Event.DispatchEvent('PetInit');
            this.SetShopPetVisible();
        }

        /** 请求上阵通知 */
        private C_ReqUsePet(buf) {
            let nPetID = buf[0];
            this._currentpetID = nPetID
            Event.DispatchEvent("PET", [nPetID]);
            Event.DispatchEvent('PetInit');
            Event.DispatchEvent("ClearOneBubble", [E_BubbleType.ePet]);
        }

        /**宠物上阵请求 */
        public K_ReqUsePet(ID: number) {
            RemoteCall.Instance.Send("K_ReqUsePet", ID);
        }

        /**控制主界面的神兽按钮 */
        public SetShopPetVisible() {
            if (this._hasTimes > 0) {
                Event.DispatchEvent("SetShopPetVisible", [true]);
            } else {
                Event.DispatchEvent("SetShopPetVisible", [false]);
            }
        }

        /**控制主界面的神兽红点 */
        public SetPetPoint(bvisible: boolean) {
            Event.DispatchEvent("ShowRedPoint", [E_OpenGrade.PET, bvisible]);
        }
    }
}
