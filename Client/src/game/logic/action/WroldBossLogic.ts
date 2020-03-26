/*
* name;
*/

module H52D_Framework {

    /**世界boss 数据管理 */
    export class WroldBossLogic {
        constructor() {

        }
        //{ [EquipType: number]: Array<AttrributeEquipment> }
        private buff_arr: Array<Buff> = [];

        private _buff_list: Array<number> = [];

        private _reward_list: Array<number> = [];
        private _buff_buy: { [ID: number]: number } = {};

        private _stop:boolean=false;
        private _show: boolean = true;
        private static _init: WroldBossLogic;

        public static get Instance(): WroldBossLogic {
            if (WroldBossLogic._init == null) {
                WroldBossLogic._init = new WroldBossLogic();
            }
            return WroldBossLogic._init;
        }

        public Initialize(): void {
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqChallengeBoss", this);//战斗回掉           
        }

        public set StopFight(value){
            this._stop=value;
        }

        public get StopFight(){
            return this._stop
        }



        /**发送请求 购买buff */
        public Buff_buy(type: number, shop_ID: number, item_num: number) {
            RemoteCall.Instance.Send("K_MarketBuyReq", type, shop_ID, item_num);
        }
        /**请求战斗 */
        public Fight() {
            RemoteCall.Instance.Send("K_ReqChallengeBoss");
        }

        /**发送 战斗伤害 */
        public SendHrut() {
            let nDamage = BattleManager.Instance.TheWordBossDamage;
            RemoteCall.Instance.Send('K_ReqSendChallengeHarm', nDamage);
        }



        //-------------------------服务器消息--------------------//


        /**请求战斗回掉 */
        private C_ReqChallengeBoss(buf) {
            let data = buf[0];
            CustomsManager.Instance.EnterCustoms(30001);
            BattleManager.Instance.StopBattle();
            DropManager.Instance.Destroy();
            BattleManager.Instance.DestroyMonster();
            Event.DispatchEvent("StopClick", [false]);
            Event.DispatchEvent("ShowDeputy");
            UIManager.Instance.DestroyUI("WroldBossView", [ViewUpRoot]);
            if (UIManager.Instance.IsHave("GuidanceView", NewGuidRoot)) {
                UIManager.Instance.DestroyUI("GuidanceView", [NewGuidRoot])
            }
        }

        /**购买buff回调 */
        public ReqBuyBuff(type:number,id:number) {//               0是成功 1是false            
            let buff_shop = MarketConfig[type][id];
            let Item_Id = buff_shop.sellContent[2];
            this._buff_buy[Item_Id] = 1;
            let Skill_Id = ItemConfig[Item_Id].dwUseEffect[1];
            let skill_Info = StatusConfig[Skill_Id].effectList;
            this.Buff_add(Skill_Id);
            //TipsLogic.Instance.OpenMessageBox("购买成功!");
            TipsLogic.Instance.OpenSystemTips("购买成功!");
            Event.DispatchEvent("Update_bossbuffView");
        }



        /********************************************************* */


        public Reward_labelcolor = {
            2: "#ffe562",
            3: "#d8d9e2",
        }

        public get Show() {
            return this._show;
        }

        public set Show(value) {
            this._show = value;
        }


        public get Buff_List() {
            return this._buff_list;
        }
        public set Buff_List(value) {
            this._buff_list = value;
        }

        public get Buff_Buy() {
            return this._buff_buy;
        }

        public set Reward_List(value) {
            this._reward_list = value;
        }


        /**buff列表数量 */
        public Buff_num() {
            let buff_list = MarketConfig[3];
            for (let key in buff_list) {
                let buff_id = Number(key)
                this._buff_list.push(buff_id);
            }
            return this._buff_list;
        }

        /**奖励列表数量 */
        public Reward_num() {
            let a = GameParamConfig.WorldBossReward
            for (let key in GameParamConfig.WorldBossReward) {
                this._reward_list.push(Number(key));
            }
            return this._reward_list;
        }

        /**增加购买的buff相关属性 */
        public Buff_add(buf) {
            let buff_base = new Buff(buf, this);
            buff_base.Do();
            this.buff_arr.push(buff_base);
            if (BattleManager.Instance.aIOperation) {
                BattleManager.Instance.aIOperation.Dps();
            }
        }

        /**卸载buff属性 */
        public Buff_Del() {
            for (let key = 0; key < this.buff_arr.length; key++) {
                let buff_base = new Buff(this.buff_arr[key].id, this);
                buff_base.Destroy();
            }
            this._buff_buy = []
            this.buff_arr = [];
            if (BattleManager.Instance.aIOperation) {
                BattleManager.Instance.aIOperation.Dps();
            }
        }

        /**获取需要的道具图片 */
        public Item_Info(type, item_Id) {
            let path_Icon;
            let path_Icon_bg;
            let item_quality;
            let item_name;
            let name_color;
            switch (type) {
                case 1:
                    path_Icon = "ui_icon/" + ItemConfig[item_Id].strIconID_B
                    item_quality = ItemConfig[item_Id].dwItemQuality;
                    item_name = GetInfoAttr.Instance.GetText(ItemConfig[item_Id].dwItemName);
                    path_Icon_bg = BaseDefine.QualityList[item_quality];
                    name_color = BaseDefine.LabelColor[item_quality]
                    break;
                case 2:
                    path_Icon = "ui_icon/" + EquipConfig[item_Id].equipIcon;
                    item_quality = EquipConfig[item_Id].equipColor;
                    item_name = GetInfoAttr.Instance.GetText(EquipConfig[item_Id].equipName);
                    path_Icon_bg = BaseDefine.QualityList[item_quality];
                    name_color = BaseDefine.LabelColor[item_quality]
                    break;
                case 3:
                    path_Icon = "ui_icon/" + HeroConfig[item_Id].strIcon;
                    item_quality = HeroConfig[item_Id].quality;
                    item_name = GetInfoAttr.Instance.GetText(HeroConfig[item_Id].name);
                    path_Icon_bg = BaseDefine.QualityList[item_quality];
                    name_color = BaseDefine.LabelColor[item_quality]
                    break;
                case 4:
                    path_Icon = "ui_icon/" + PetConfig[item_Id].strPetIcon;
                    item_quality = PetConfig[item_Id].petColor;
                    path_Icon_bg = BaseDefine.QualityList[item_quality];
                    item_name = GetInfoAttr.Instance.GetText(PetConfig[item_Id].petName);
                    name_color = BaseDefine.LabelColor[item_quality]
                    break;
            }
            return [path_Icon, path_Icon_bg, item_name, name_color];

        }

        public View_Control() {
            if (CustomsManager.Instance.CustomsType == Customs_Type.Boss && this._show) {
                return false;
            }
            else if (CustomsManager.Instance.CustomsType == Customs_Type.Customs) {
                return true;
            }
        }

        public OpenView() {
            UIManager.Instance.CreateUI("WroldBossView", [ViewUpRoot]);
        }

        public ShowPrint():boolean {
            if (MasterPlayer.Instance.player.CunstLevel >= OpenGradeConfig[E_OpenGrade.BOSS].Checkpoint) {
                if (MasterPlayer.Instance.GetEventProByType(EventProEnum.NowBossRank) == 0 ||
                    MasterPlayer.Instance.GetEventProByType(EventProEnum.NowBossRank) == null) {
                    return true;
                }
            }
            return false;

        }

    }
}
