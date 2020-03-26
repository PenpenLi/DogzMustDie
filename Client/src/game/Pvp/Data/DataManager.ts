
module H52D_Framework {
    /**PVP数据管理 */
    export class DataManager {
        private constructor() { }
        private static _instance: DataManager = null;
        public static get Instance() {
            if (this._instance == null) {
                this._instance = new DataManager();
            }
            return this._instance;
        }
        
        /**自身信息类 */
        private _OwnerData: CharacterData;
        /**打包类 */
        public get packdata(): DataPack { return DataPack.Instance; }
        /**自身数据包 */
        public UnOPack: DataUnPack = null;
        /**敌方数据包 */
        public UnEPack: DataUnPack = null;

        private _allDps = 0;
        private _allHp = 0;

        public Init() {
            if (CustomsManager.Instance.CustomsType != Customs_Type.MatchChampion) {
                this.PackData();
                this.Pars();
            }
        }

        public PackData() {
            /**获取自身数据 */
            this._OwnerData = new CharacterData();
            // let x = KickingLogic.Instance.war;
            // let y = KickingLogic.Instance.petId;
            // let x1 = MasterPlayer.Instance.player.HeroWarList;
            // let xy = KickingLogic.Instance.petId;
            if(!KickingLogic.Instance.petId) KickingLogic.Instance.petId = 0;
            if (!ObjIsEmpty(KickingLogic.Instance.war) && KickingLogic.Instance.petId > 0) {
                this._OwnerData.GetData(KickingLogic.Instance.war, KickingLogic.Instance.petId);
            }
            else if (!ObjIsEmpty(KickingLogic.Instance.war) && KickingLogic.Instance.petId <= 0) {
                this._OwnerData.GetData(KickingLogic.Instance.war, PetManager.Instance.CurrentpetID);
            }
            else if (ObjIsEmpty(KickingLogic.Instance.war) && KickingLogic.Instance.petId > 0) {
                this._OwnerData.GetData(MasterPlayer.Instance.player.HeroWarList, KickingLogic.Instance.petId);
            }
            else if (ObjIsEmpty(KickingLogic.Instance.war) && KickingLogic.Instance.petId <= 0) {
                this._OwnerData.GetData(MasterPlayer.Instance.player.HeroWarList, PetManager.Instance.CurrentpetID);
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
        }
        /**天梯 */
        public PackData_c() {
            /**获取自身数据 */
            this._OwnerData = new CharacterData();
            if(!KickingLogic.Instance.petId) KickingLogic.Instance.petId = 0;
            if (!ObjIsEmpty(KickingLogic.Instance.war) && KickingLogic.Instance.petId > 0) {
                this._OwnerData.GetData(KickingLogic.Instance.war, KickingLogic.Instance.petId);
            }
            else if (!ObjIsEmpty(KickingLogic.Instance.war) && KickingLogic.Instance.petId <= 0) {
                this._OwnerData.GetData(KickingLogic.Instance.war, PetManager.Instance.CurrentpetID);
            }
            else if (ObjIsEmpty(KickingLogic.Instance.war) && KickingLogic.Instance.petId > 0) {
                this._OwnerData.GetData(MasterPlayer.Instance.player.HeroWarList, KickingLogic.Instance.petId);
            }
            else if (ObjIsEmpty(KickingLogic.Instance.war) && KickingLogic.Instance.petId <= 0) {
                this._OwnerData.GetData(MasterPlayer.Instance.player.HeroWarList, PetManager.Instance.CurrentpetID);
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
        }
        /**PK联赛用 */
        public PackData_m() {
            /**获取自身数据 */
            this._OwnerData = new CharacterData();
            if(!KickingLogic.Instance.petId) KickingLogic.Instance.petId = 0;
            if (!ObjIsEmpty(MatchLogic.Instance.war) && KickingLogic.Instance.petId > 0) {
                this._OwnerData.GetData(MatchLogic.Instance.war, KickingLogic.Instance.petId);
            }
            else if (!ObjIsEmpty(MatchLogic.Instance.war) && KickingLogic.Instance.petId <= 0) {
                this._OwnerData.GetData(MatchLogic.Instance.war, PetManager.Instance.CurrentpetID);
            }
            else if (ObjIsEmpty(MatchLogic.Instance.war) && KickingLogic.Instance.petId > 0) {
                this._OwnerData.GetData(MasterPlayer.Instance.player.HeroWarList, KickingLogic.Instance.petId);
            }
            else if (ObjIsEmpty(MatchLogic.Instance.war) && KickingLogic.Instance.petId <= 0) {
                this._OwnerData.GetData(MasterPlayer.Instance.player.HeroWarList, PetManager.Instance.CurrentpetID);
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
        }

        /**服务器用 */
        public MainPackData(bNotSendServer?) {
            /**获取自身数据 */
            this._OwnerData = new CharacterData();
            this._OwnerData.GetData(MasterPlayer.Instance.player.HeroWarList, PetManager.Instance.CurrentpetID);
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
        }

        /**解包 自身与敌方的数据 */
        public Pars() {
            this.UnOPack = new DataUnPack(this.packdata.Info);
        }

        public SendData(data) {
            if (GetTabLength(data["Hero"]) == 0) {
                return
            }
            //发送数据消息
            RemoteCall.Instance.Send("K_ReqUpdateCombatInfo", data);
        }

        public SendCapacityData() {
            this.GetComBat()
            //发送数据消息
            RemoteCall.Instance.Send("K_ReqCapacityList", this._allHp, this._allDps);
        }

        /**计算所有dps与总生命值 */
        private GetComBat() {
            let Pack:DataUnPack = new DataUnPack(this.packdata.Info);
            this._allHp = 0;
            this._allDps = 0;
            let _petDps = 0;
            let _heroDps = 0;
            let _campDps = 0;
            for (let k in Pack.HeroList) {
                let heroC: PheroInfo = Pack.HeroList[k];
                if (heroC) {
                    if (heroC.skillid[0]) {
                        let attackSkill = new SkillData(heroC.skillid[0]);
                        let cd = (attackSkill.skillCD) / 1000;
                        let dps = heroC.attr.GetAttributeValue(2) / cd;
                        if (Number(k) == 4) {
                            let sp = new SkillData(heroC.skillid[1]);
                            let scd = (sp.skillCD) / 1000;
                            let bl = 0
                            if (GetTabLength(sp.damageList) > 0)
                                bl = sp.damageList[1][2] / 10000;
                            let Num = sp.hitEnemyNum;
                            let damage = (heroC.attr.GetAttributeValue(2) * bl) / cd;
                            let endDamage = damage * Num;
                            dps += endDamage;
                        }
                        _heroDps += dps >> 0;
                    }
                    if (GetTabLength(Pack.PetList) > 0)
                        _petDps += heroC.attr.GetAttributeValue(2) >> 0;
                    this._allHp += heroC.attr.GetAttributeValue(1);
                }
            }
            this._allDps = _heroDps >> 0;
            for (let k in Pack.PetList) {
                let info = Pack.PetList[k];
                if (info) {
                    _petDps = _petDps * info.ratio;
                    _petDps = _petDps / info.CD;
                }
            }
            this._allDps =( _petDps + _heroDps) >> 0; 
            if (!ObjIsEmpty(Pack.Camp)) {
                let dps = 0
                for (let k in HeroManager.Instance.Herolist) {
                    let heroC = HeroManager.Instance.Herolist[k];
                    if (heroC) {
                        dps += heroC.attr.GetAttributeValue(2);
                    }
                }
                dps = dps * Pack.Camp.ratio;
                dps = dps / Pack.Camp.CD;
                _campDps = dps >> 0;
            }
            this._allDps = (_petDps + _campDps + _heroDps) >> 0;
        }

        public ReciveLookPack(buf, buf1) {
            this.UnOPack = new DataUnPack(buf);;
            this.UnEPack = new DataUnPack(buf1);;
        }

        public ReciveData(edata) {
            this.UnEPack = new DataUnPack(edata);
        }

    }
}