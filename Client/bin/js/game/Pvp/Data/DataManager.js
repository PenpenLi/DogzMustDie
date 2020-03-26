var H52D_Framework;
(function (H52D_Framework) {
    /**PVP数据管理 */
    var DataManager = /** @class */ (function () {
        function DataManager() {
            /**自身数据包 */
            this.UnOPack = null;
            /**敌方数据包 */
            this.UnEPack = null;
            this._allDps = 0;
            this._allHp = 0;
        }
        Object.defineProperty(DataManager, "Instance", {
            get: function () {
                if (this._instance == null) {
                    this._instance = new DataManager();
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataManager.prototype, "packdata", {
            /**打包类 */
            get: function () { return H52D_Framework.DataPack.Instance; },
            enumerable: true,
            configurable: true
        });
        DataManager.prototype.Init = function () {
            if (H52D_Framework.CustomsManager.Instance.CustomsType != Customs_Type.MatchChampion) {
                this.PackData();
                this.Pars();
            }
        };
        DataManager.prototype.PackData = function () {
            /**获取自身数据 */
            this._OwnerData = new H52D_Framework.CharacterData();
            // let x = KickingLogic.Instance.war;
            // let y = KickingLogic.Instance.petId;
            // let x1 = MasterPlayer.Instance.player.HeroWarList;
            // let xy = KickingLogic.Instance.petId;
            if (!H52D_Framework.KickingLogic.Instance.petId)
                H52D_Framework.KickingLogic.Instance.petId = 0;
            if (!H52D_Framework.ObjIsEmpty(H52D_Framework.KickingLogic.Instance.war) && H52D_Framework.KickingLogic.Instance.petId > 0) {
                this._OwnerData.GetData(H52D_Framework.KickingLogic.Instance.war, H52D_Framework.KickingLogic.Instance.petId);
            }
            else if (!H52D_Framework.ObjIsEmpty(H52D_Framework.KickingLogic.Instance.war) && H52D_Framework.KickingLogic.Instance.petId <= 0) {
                this._OwnerData.GetData(H52D_Framework.KickingLogic.Instance.war, H52D_Framework.PetManager.Instance.CurrentpetID);
            }
            else if (H52D_Framework.ObjIsEmpty(H52D_Framework.KickingLogic.Instance.war) && H52D_Framework.KickingLogic.Instance.petId > 0) {
                this._OwnerData.GetData(H52D_Framework.MasterPlayer.Instance.player.HeroWarList, H52D_Framework.KickingLogic.Instance.petId);
            }
            else if (H52D_Framework.ObjIsEmpty(H52D_Framework.KickingLogic.Instance.war) && H52D_Framework.KickingLogic.Instance.petId <= 0) {
                this._OwnerData.GetData(H52D_Framework.MasterPlayer.Instance.player.HeroWarList, H52D_Framework.PetManager.Instance.CurrentpetID);
            }
            /**打包数据 */
            this.packdata.Destroy();
            this.packdata.PackHeroInfo(this._OwnerData.Info[0]);
            this.packdata.PackPetInfo(this._OwnerData.Info[1]);
            this.packdata.PackCampInfo(this._OwnerData.Info[2]);
            this.packdata.PackPlayerInfo();
            this.packdata.PackAttribute();
            this.packdata.Pack();
            this.GetComBat();
            /**发送数据消息 */
            this.SendData(this.packdata.Info);
        };
        /**天梯 */
        DataManager.prototype.PackData_c = function () {
            /**获取自身数据 */
            this._OwnerData = new H52D_Framework.CharacterData();
            if (!H52D_Framework.KickingLogic.Instance.petId)
                H52D_Framework.KickingLogic.Instance.petId = 0;
            if (!H52D_Framework.ObjIsEmpty(H52D_Framework.KickingLogic.Instance.war) && H52D_Framework.KickingLogic.Instance.petId > 0) {
                this._OwnerData.GetData(H52D_Framework.KickingLogic.Instance.war, H52D_Framework.KickingLogic.Instance.petId);
            }
            else if (!H52D_Framework.ObjIsEmpty(H52D_Framework.KickingLogic.Instance.war) && H52D_Framework.KickingLogic.Instance.petId <= 0) {
                this._OwnerData.GetData(H52D_Framework.KickingLogic.Instance.war, H52D_Framework.PetManager.Instance.CurrentpetID);
            }
            else if (H52D_Framework.ObjIsEmpty(H52D_Framework.KickingLogic.Instance.war) && H52D_Framework.KickingLogic.Instance.petId > 0) {
                this._OwnerData.GetData(H52D_Framework.MasterPlayer.Instance.player.HeroWarList, H52D_Framework.KickingLogic.Instance.petId);
            }
            else if (H52D_Framework.ObjIsEmpty(H52D_Framework.KickingLogic.Instance.war) && H52D_Framework.KickingLogic.Instance.petId <= 0) {
                this._OwnerData.GetData(H52D_Framework.MasterPlayer.Instance.player.HeroWarList, H52D_Framework.PetManager.Instance.CurrentpetID);
            }
            /**打包数据 */
            this.packdata.Destroy();
            this.packdata.PackHeroInfo(this._OwnerData.Info[0]);
            this.packdata.PackPetInfo(this._OwnerData.Info[1]);
            this.packdata.PackCampInfo(this._OwnerData.Info[2]);
            this.packdata.PackPlayerInfo();
            this.packdata.PackAttribute();
            this.packdata.Pack();
            return this.packdata.Info;
        };
        /**PK联赛用 */
        DataManager.prototype.PackData_m = function () {
            /**获取自身数据 */
            this._OwnerData = new H52D_Framework.CharacterData();
            if (!H52D_Framework.KickingLogic.Instance.petId)
                H52D_Framework.KickingLogic.Instance.petId = 0;
            if (!H52D_Framework.ObjIsEmpty(H52D_Framework.MatchLogic.Instance.war) && H52D_Framework.KickingLogic.Instance.petId > 0) {
                this._OwnerData.GetData(H52D_Framework.MatchLogic.Instance.war, H52D_Framework.KickingLogic.Instance.petId);
            }
            else if (!H52D_Framework.ObjIsEmpty(H52D_Framework.MatchLogic.Instance.war) && H52D_Framework.KickingLogic.Instance.petId <= 0) {
                this._OwnerData.GetData(H52D_Framework.MatchLogic.Instance.war, H52D_Framework.PetManager.Instance.CurrentpetID);
            }
            else if (H52D_Framework.ObjIsEmpty(H52D_Framework.MatchLogic.Instance.war) && H52D_Framework.KickingLogic.Instance.petId > 0) {
                this._OwnerData.GetData(H52D_Framework.MasterPlayer.Instance.player.HeroWarList, H52D_Framework.KickingLogic.Instance.petId);
            }
            else if (H52D_Framework.ObjIsEmpty(H52D_Framework.MatchLogic.Instance.war) && H52D_Framework.KickingLogic.Instance.petId <= 0) {
                this._OwnerData.GetData(H52D_Framework.MasterPlayer.Instance.player.HeroWarList, H52D_Framework.PetManager.Instance.CurrentpetID);
            }
            /**打包数据 */
            this.packdata.Destroy();
            this.packdata.PackHeroInfo(this._OwnerData.Info[0]);
            this.packdata.PackPetInfo(this._OwnerData.Info[1]);
            this.packdata.PackCampInfo(this._OwnerData.Info[2]);
            this.packdata.PackPlayerInfo();
            this.packdata.PackAttribute();
            this.packdata.Pack();
            /**发送数据消息 */
            this.SendData(this.packdata.Info);
        };
        /**服务器用 */
        DataManager.prototype.MainPackData = function (bNotSendServer) {
            /**获取自身数据 */
            this._OwnerData = new H52D_Framework.CharacterData();
            this._OwnerData.GetData(H52D_Framework.MasterPlayer.Instance.player.HeroWarList, H52D_Framework.PetManager.Instance.CurrentpetID);
            /**打包数据 */
            this.packdata.Destroy();
            this.packdata.PackHeroInfo(this._OwnerData.Info[0]);
            this.packdata.PackPetInfo(this._OwnerData.Info[1]);
            this.packdata.PackCampInfo(this._OwnerData.Info[2]);
            this.packdata.PackPlayerInfo();
            this.packdata.PackAttribute();
            this.packdata.Pack();
            /**发送数据消息 */
            if (!bNotSendServer) {
                this.SendData(this.packdata.Info);
                this.SendCapacityData();
            }
        };
        /**解包 自身与敌方的数据 */
        DataManager.prototype.Pars = function () {
            this.UnOPack = new H52D_Framework.DataUnPack(this.packdata.Info);
        };
        DataManager.prototype.SendData = function (data) {
            if (H52D_Framework.GetTabLength(data["Hero"]) == 0) {
                return;
            }
            //发送数据消息
            H52D_Framework.RemoteCall.Instance.Send("K_ReqUpdateCombatInfo", data);
        };
        DataManager.prototype.SendCapacityData = function () {
            this.GetComBat();
            //发送数据消息
            H52D_Framework.RemoteCall.Instance.Send("K_ReqCapacityList", this._allHp, this._allDps);
        };
        /**计算所有dps与总生命值 */
        DataManager.prototype.GetComBat = function () {
            var Pack = new H52D_Framework.DataUnPack(this.packdata.Info);
            this._allHp = 0;
            this._allDps = 0;
            var _petDps = 0;
            var _heroDps = 0;
            var _campDps = 0;
            for (var k in Pack.HeroList) {
                var heroC = Pack.HeroList[k];
                if (heroC) {
                    if (heroC.skillid[0]) {
                        var attackSkill = new H52D_Framework.SkillData(heroC.skillid[0]);
                        var cd = (attackSkill.skillCD) / 1000;
                        var dps = heroC.attr.GetAttributeValue(2) / cd;
                        if (Number(k) == 4) {
                            var sp = new H52D_Framework.SkillData(heroC.skillid[1]);
                            var scd = (sp.skillCD) / 1000;
                            var bl = 0;
                            if (H52D_Framework.GetTabLength(sp.damageList) > 0)
                                bl = sp.damageList[1][2] / 10000;
                            var Num = sp.hitEnemyNum;
                            var damage = (heroC.attr.GetAttributeValue(2) * bl) / cd;
                            var endDamage = damage * Num;
                            dps += endDamage;
                        }
                        _heroDps += dps >> 0;
                    }
                    if (H52D_Framework.GetTabLength(Pack.PetList) > 0)
                        _petDps += heroC.attr.GetAttributeValue(2) >> 0;
                    this._allHp += heroC.attr.GetAttributeValue(1);
                }
            }
            this._allDps = _heroDps >> 0;
            for (var k in Pack.PetList) {
                var info = Pack.PetList[k];
                if (info) {
                    _petDps = _petDps * info.ratio;
                    _petDps = _petDps / info.CD;
                }
            }
            this._allDps = (_petDps + _heroDps) >> 0;
            if (!H52D_Framework.ObjIsEmpty(Pack.Camp)) {
                var dps = 0;
                for (var k in H52D_Framework.HeroManager.Instance.Herolist) {
                    var heroC = H52D_Framework.HeroManager.Instance.Herolist[k];
                    if (heroC) {
                        dps += heroC.attr.GetAttributeValue(2);
                    }
                }
                dps = dps * Pack.Camp.ratio;
                dps = dps / Pack.Camp.CD;
                _campDps = dps >> 0;
            }
            this._allDps = (_petDps + _campDps + _heroDps) >> 0;
        };
        DataManager.prototype.ReciveLookPack = function (buf, buf1) {
            this.UnOPack = new H52D_Framework.DataUnPack(buf);
            ;
            this.UnEPack = new H52D_Framework.DataUnPack(buf1);
            ;
        };
        DataManager.prototype.ReciveData = function (edata) {
            this.UnEPack = new H52D_Framework.DataUnPack(edata);
        };
        DataManager._instance = null;
        return DataManager;
    }());
    H52D_Framework.DataManager = DataManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=DataManager.js.map