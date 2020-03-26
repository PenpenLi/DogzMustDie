var H52D_Framework;
(function (H52D_Framework) {
    /**神兽管理 */
    var PetManager = /** @class */ (function () {
        function PetManager() {
            /**已有神兽列表 */
            this._ownPetList = {};
            /**当前上阵的神兽ID */
            this._currentpetID = 0;
            /**神兽配置表 */
            this._Petlist = [];
            /** 红点列表 */
            this._NewList = {};
            for (var key in H52D_Framework.PetConfig) {
                var nIdx = Number(key);
                this._Petlist.push(nIdx);
            }
        }
        Object.defineProperty(PetManager.prototype, "PetList", {
            /**获取配置表中的所有神兽 */
            get: function () {
                return this._Petlist;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PetManager.prototype, "OwnPetList", {
            /**获取已有的神兽 */
            get: function () {
                return this._ownPetList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PetManager.prototype, "OwnPetNum", {
            /**获取已有的神兽数量 */
            get: function () {
                return H52D_Framework.GetTabLength(this._ownPetList);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PetManager.prototype, "HasTimes", {
            /**拥有的孵化次数 */
            get: function () {
                return this._hasTimes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PetManager.prototype, "NextUpdateTime", {
            /**距离下次孵化的时间 */
            get: function () {
                return this._nextUpdatetime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PetManager.prototype, "CurrentpetID", {
            /**获取当前上阵的神兽 */
            get: function () {
                return this._currentpetID;
            },
            /**设置当前上阵的神兽 */
            set: function (id) {
                this._currentpetID = id;
            },
            enumerable: true,
            configurable: true
        });
        /**获取宠物实例 */
        PetManager.prototype.GetPet_Instance = function (nPetID) {
            return this._ownPetList[nPetID];
        };
        PetManager.prototype.OnResetAttr = function () {
            for (var k in this._ownPetList) {
                this._ownPetList[k].OnReset();
            }
        };
        /** 主界面是否显示红点 */
        PetManager.prototype.IsMainShowRed = function () {
            var needOrder = H52D_Framework.OpenGradeConfig[E_OpenGrade.PET]["Checkpoint"];
            var customsOrder = H52D_Framework.MasterPlayer.Instance.player.CunstLevel;
            if (customsOrder + 1 < needOrder) {
                return false;
            }
            for (var flag in this._NewList) {
                return true;
            }
            return false;
        };
        /** 判断这个宠物是否是新获得的 */
        PetManager.prototype.IsNewPet = function (nPetID) {
            return this._NewList[nPetID] == 1;
        };
        Object.defineProperty(PetManager, "Instance", {
            get: function () {
                if (PetManager._init == null) {
                    PetManager._init = new PetManager();
                }
                return PetManager._init;
            },
            enumerable: true,
            configurable: true
        });
        PetManager.prototype.Initialize = function () {
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_SendPetInfo", this); //上线同步
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_PetUpdateTimes", this); //更新次数和时间
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_AddPet", this); //添加宠物
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqGetPet", this); //领取宠物通知
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqUsePet", this); //请求上阵通知
        };
        /**上线同步 */
        PetManager.prototype.C_SendPetInfo = function (buf) {
            var PetList = buf[0];
            for (var nPetID in PetList) {
                var Level = PetList[nPetID];
                var npet = new H52D_Framework.BPetVo(Number(nPetID));
                npet.Level = Level;
                npet.Level > H52D_Framework.GameParamConfig.PetMaxLevel ? H52D_Framework.GameParamConfig.PetMaxLevel : npet.Level;
                this._ownPetList[npet.ID] = npet;
            }
            this._hasTimes = buf[1];
            this._nextUpdatetime = buf[2];
            this._currentpetID = buf[3];
            this._NewList = buf[4];
        };
        /**更新次数和时间 */
        PetManager.prototype.C_PetUpdateTimes = function (buf) {
            this._hasTimes = buf[0];
            this._nextUpdatetime = buf[1];
            H52D_Framework.Event.DispatchEvent('PetInit');
            this.SetShopPetVisible();
        };
        /**添加宠物 */
        PetManager.prototype.C_AddPet = function (buf) {
            var tId = buf[0];
            var tNum = buf[1];
            if (this._ownPetList[tId] == null) {
                var npet = new H52D_Framework.BPetVo(tId);
                this._ownPetList[npet.ID] = npet;
                // npet.bNet = true;
                // this.SetPetPoint(npet.bNet);
                this._NewList[tId] = 1;
                this.SetPetPoint(this.IsMainShowRed());
            }
            this._ownPetList[tId].Level = tNum;
            this._ownPetList[tId].Level > H52D_Framework.GameParamConfig.PetMaxLevel ? H52D_Framework.GameParamConfig.PetMaxLevel : this._ownPetList[tId].Level;
            H52D_Framework.Event.DispatchEvent('PetInit');
            H52D_Framework.Event.DispatchEvent('ShowRedPoint', [E_OpenGrade.PET]);
        };
        /** 请求查看宠物 */
        PetManager.prototype.SendShowPet = function (nPetID) {
            if (this._NewList[nPetID] == 1) {
                delete this._NewList[nPetID];
            }
            H52D_Framework.RemoteCall.Instance.Send("K_ReqLookPet", nPetID);
            this.SetPetPoint(this.IsMainShowRed());
        };
        /**请求领取宠物 */
        PetManager.prototype.GetPet = function () {
            if (this._hasTimes < 1)
                return;
            H52D_Framework.RemoteCall.Instance.Send("K_ReqGetPet", this._hasTimes);
        };
        /**领取宠物通知 */
        PetManager.prototype.C_ReqGetPet = function (buf) {
            var pet_info = buf[0];
            this._hasTimes = buf[1];
            this._nextUpdatetime = buf[2];
            H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(pet_info);
            H52D_Framework.Event.DispatchEvent('PetInit');
            this.SetShopPetVisible();
        };
        /** 请求上阵通知 */
        PetManager.prototype.C_ReqUsePet = function (buf) {
            var nPetID = buf[0];
            this._currentpetID = nPetID;
            H52D_Framework.Event.DispatchEvent("PET", [nPetID]);
            H52D_Framework.Event.DispatchEvent('PetInit');
            H52D_Framework.Event.DispatchEvent("ClearOneBubble", [E_BubbleType.ePet]);
        };
        /**宠物上阵请求 */
        PetManager.prototype.K_ReqUsePet = function (ID) {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqUsePet", ID);
        };
        /**控制主界面的神兽按钮 */
        PetManager.prototype.SetShopPetVisible = function () {
            if (this._hasTimes > 0) {
                H52D_Framework.Event.DispatchEvent("SetShopPetVisible", [true]);
            }
            else {
                H52D_Framework.Event.DispatchEvent("SetShopPetVisible", [false]);
            }
        };
        /**控制主界面的神兽红点 */
        PetManager.prototype.SetPetPoint = function (bvisible) {
            H52D_Framework.Event.DispatchEvent("ShowRedPoint", [E_OpenGrade.PET, bvisible]);
        };
        return PetManager;
    }());
    H52D_Framework.PetManager = PetManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PetManager.js.map