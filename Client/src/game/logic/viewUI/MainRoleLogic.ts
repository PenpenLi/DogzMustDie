module H52D_Framework {
    export class MainRoleLogic {

        private _roleSkillCfg: Array<any> = [];
        //服务器返回的技能信息，index+1：技能，lv等级 cd时间戳
        private _roleSkill: Array<{ "lv": number, "cd": number }> = [];
        private _privList: Array<any> = [];//特权
        private _privListInfo: Object = new Object();//特权
        private _maxSkill: number = 0;
        private addGodNum: number = 0;

        private static _inst: MainRoleLogic;
        public static get Instance() {
            if (MainRoleLogic._inst == null) {
                MainRoleLogic._inst = new MainRoleLogic();
            }
            return MainRoleLogic._inst;
        }

        constructor() {
            this.SetPrivList();
        }

        public Initialize(): void {
            RemoteCall.Instance.RegistJXS2CProtocol("C_SyncSkillList", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqActivateSkill", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqSkillLevelUp", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_PrivilegeSystemInfo", this);//上线同步
            RemoteCall.Instance.RegistJXS2CProtocol("C_ReqAddPrivilege", this);//添加通知
            RemoteCall.Instance.RegistJXS2CProtocol("C_DelPrivilege", this);//到期删除通知

            let cfg = RoleSkillUpConfig;
            for (var key in cfg) {
                if (Number(key) != 0) {
                    let object = cfg[key];
                    this._roleSkillCfg.push(object);
                }
            }
        }

        /**特权上线同步 */
        private C_PrivilegeSystemInfo(buf: any) {
            this._privListInfo = buf[0];
            for (let i in this._privListInfo) {
                if (this.PrivIsBuy(Number(i))) {
                    this.SetBuffId(Number(i));
                }
            }
        }

        /**
         * 获取技能ID 0-5
         */
        public GetSkillID(index){
            let Cfg = RoleSkillUpConfig[index+1]
            let nlv = 1;
            if(this._roleSkill[index] && this._roleSkill[index].lv > 0){
                nlv = this._roleSkill[index].lv;
            }
            return Cfg[nlv].roleSkillId;
        }

        //解锁的技能
        private C_SyncSkillList(buf: any): void {
            this._roleSkill = [];
            let skillObj: Object = buf[0];
            let skillCd: Object = buf[1];
            for (var index = 0; index < this._roleSkillCfg.length; index++) {
                this._roleSkill[index] = { "lv": 0, "cd": 0 };
                let key = index + 1;
                if (skillObj[key]) {
                    this._roleSkill[index].lv = skillObj[key];
                }
                if (skillCd[key]) {
                    this._roleSkill[index].cd = skillCd[key];
                }
            }
            let roleSkill = this._roleSkill;
            let roleSkillCfg = this._roleSkillCfg;
            let addMp: number = 0;
            for (var index = 0; index < roleSkill.length; index++) {
                var lv = roleSkill[index].lv;
                if (lv > 0) {
                    addMp += roleSkillCfg[index][1].addMaxMp;
                }
            }
            MasterPlayer.Instance.player.vo.attr.SetAttributeValue(51, eValueType.Base, GameParamConfig["BaseMaxMp"] + addMp);
            MasterPlayer.Instance.player.vo.attr.SetAttributeValue(53, eValueType.Base, GameParamConfig["MpRecoveryRate"]);
            Event.DispatchEvent("SkillUpdate",[Customs_Type.Customs]);
        }

        //激活回掉
        private C_ReqActivateSkill(buf: any): void {
            var index = buf[0] - 1;
            this._roleSkill[index].lv = 1;
            let addMp: number = 0;
            for (var index = 0; index < this._roleSkill.length; index++) {
                var element = this._roleSkill[index].lv;
                if (element > 0) {
                    addMp += this._roleSkillCfg[index][1].addMaxMp;
                }
            }
            MasterPlayer.Instance.player.vo.attr.SetAttributeValue(51, eValueType.Base, GameParamConfig["BaseMaxMp"] + addMp);
            Event.DispatchEvent("RefreshList");
            Event.DispatchEvent("LvUpEffect");
            Event.DispatchEvent("SkillUpdate",[Customs_Type.Customs]);
            SoundManager.Instance.OnPlaySound("res/sound/level_up.mp3");
        }

        //升级回掉
        private C_ReqSkillLevelUp(buf: any): void {
            var element = buf[1];
            var index: number = buf[0] - 1;
            this._roleSkill[index].lv = element;
            Event.DispatchEvent("RefreshList");
            Event.DispatchEvent("LvUpEffect");
            Event.DispatchEvent("SkillLeveUp");
            SoundManager.Instance.OnPlaySound("res/sound/level_up.mp3");
        }

        /**添加特权回调 */
        private C_ReqAddPrivilege(buf: any) {
            let nPrivilege = buf[0];
            this._privListInfo[nPrivilege] = buf[1];
            //免费特权次数  nil为无次数
            let nFreeUseNum = buf[2];

            MasterPlayer.Instance.setFreeUseNum(nPrivilege, nFreeUseNum);

            this.SetBuffId(nPrivilege);
            this.SetPrivList();

            Event.DispatchEvent('privListTime');
            if (buf[0] == 4) {//金币特权
                this.addGodNum += 1;
                let timeNow = Date.now() / 1000;
                this._privListInfo[buf[0]] = timeNow + GameParamConfig.UseInterval;
                this.GoldDown();
                //this.PlayGoldDown();
            }
            SoundManager.Instance.OnPlaySound("res/sound/tequan.mp3");
        }

        /**特权到期删除通知 */
        private C_DelPrivilege(buf: any) {
            this._privListInfo[buf[0]] = -1;
            if (this.GetBuffTime(buf[0]) != -1)
            { this.DelBuffId(buf[0]); }
        }

        /**设置特权list */
        public SetPrivList() {
            this._privList = new Array<any>();
            for (let i in PrivilegeConfig) {
                let _name = GetInfoAttr.Instance.GetText(PrivilegeConfig[i].name);
                let _descri = GetInfoAttr.Instance.GetText(PrivilegeConfig[i].description);
                let _icon: string = 'ui_icon/' + PrivilegeConfig[i].stricon;
                let moneyTypeicon: string = PrivilegeConfig[i].PurchaseConsumption[1] == 2 ? '' : 'ui_common/icon-jinbi.png';
                let _diamonds: boolean = true;
                let _useNum: string = "<img src= 'ui_icon/icon_prop_013.png' width='20px' height='16px'></img>" + PrivilegeConfig[i].PurchaseConsumption[2] + '';
                let _bewrite: string = PrivilegeConfig[i].isActive == 1 ? '主动' : '被动';

                let free = MasterPlayer.Instance.getFreeUseNum(Number(i))
                let totle = GameParamConfig.FreePrivilegeStorageMaxNum[Number(i)]
                let _discount = -1;
                if (free > 0)//有可用次数
                {
                    _useNum = "免费次数" + free + "/" + totle;
                    _diamonds = false;
                } else if (DiscountManager.Instance.IsStartPrivilegeAction() && (DiscountManager.Instance.getPrivilegeTims(i) < DiscountManager.Instance.nPrivilegeMaxTims)) {
                    _useNum = "<img src= 'ui_icon/icon_prop_013.png' width='20px' height='16px'></img>" + DiscountManager.Instance.tPrivilegeMoney[i] + "(" + DiscountManager.Instance.getPrivilegeTims(i) + "/" + DiscountManager.Instance.nPrivilegeMaxTims + ")"
                    _discount = (DiscountManager.Instance.tPrivilegeMoney[i] / PrivilegeConfig[i].PurchaseConsumption[2] * 10) >> 0;
                }
                this._privList.push({
                    privIcon: _icon, privName: _name, useIcon: { skin: moneyTypeicon, visible: false },
                    useNum: { text: _useNum, diamonds: _diamonds }, bewrite: _bewrite,
                    discount: _discount
                });
            }
        }

        private FreeNum(free: number, totle: number): string {
            return "免费次数" + free + "/" + totle;
        }

        /**
         * 角色最大等级
         */
        public get roleMaxLv(): number {
            let roleMaxLv: number = 0;
            while (RoleLevelUpConfig[roleMaxLv + 1]) {
                roleMaxLv++;
            }
            return roleMaxLv;
        }
        /**
         * 技能配置表
         */
        public get roleSkillCfg(): Array<any> {
            return this._roleSkillCfg;
        }

        /**
         * 当前技能信息
         */
        public get roleSkill(): Array<{ "lv": number, "cd": number }> {
            return this._roleSkill;
        }

        /**
         * 设置技能CD时间戳
         */
        public SetSkillCdTime(index: number, cd: number ) {
            return this._roleSkill[index].cd = cd;
        }

        /**特权list */
        public get PrivList() {
            return this._privList;
        }

        /**特权时间信息  */
        public get PrivListInfo() {
            return this._privListInfo;
        }

        /**特权是否已购买*/
        public PrivIsBuy(id: number) {
            if (this._privListInfo[id]) {
                let _time = GetInfoAttr.Instance.GetCountDown(this._privListInfo[id], false);
                if (_time <= 0) {
                    return false;
                }
                return true;
            }
            return false;
        }

        /**需要倒计时的特权 */
        public SetToUpdatePriv() {
            let obj: Object = new Object();
            for (let i in this._privListInfo) {
                if (this.PrivIsBuy(Number(i))) {
                    obj[i] = this._privListInfo[i]
                }
                if (this.GetBuffTime(Number(i)) == -1) {
                    obj[i] = -1;
                }
            }
            return obj;
        }


        /**
         * 技能是否达到最高级
         */
        public IsMaxLv(index: number): boolean {
            let maxLv: number = 0;
            for (var key in this._roleSkillCfg[index]) {
                maxLv++;
            }
            this._maxSkill = maxLv;
            if (this._roleSkill[index].lv == maxLv) return true;
            return false;
        }
        /**
         * 是否解锁了技能
         */
        public IsSkillUnlocked(index: number): boolean {
            if (this._roleSkill[index].lv > 0) return true;
            return false;
        }

        /**
         * 获取技能的解锁需要的角色等级和需要的金币
         */
        public GetSkillUnlockCondition(index: number): Object {
            let obj: Object = {};
            let needRoleLevel: number = this._roleSkillCfg[index][1].needRoleLevel;
            let needGoldNum: number = this._roleSkillCfg[index][1].needGoldNum;
            obj[1] = needRoleLevel;
            obj[2] = needGoldNum;
            return obj;
        }

        /**
         * 是否能升级
         */
        public IsSkillCanLvUp(index: number): boolean {
            let skillLv: number = this._roleSkill[index].lv;
            let nextSkillLv: number = skillLv + 1;
            let needRoleLevel: number = this._roleSkillCfg[index][nextSkillLv].needRoleLevel;
            let needGoldNum: number = this._roleSkillCfg[index][nextSkillLv].needGoldNum;
            let money: number = BagManager.Instance.getItemNumber(BaseDefine.ItemIdGold);
            let rolelv: number = MasterPlayer.Instance.player.Level;
            if (rolelv >= needRoleLevel) {
                if (money >= needGoldNum) {
                    return true;
                }
            }
            return false;
        }

        /**
         * 获取技能的升级需要的角色等级和需要的金币
         */
        public GetSkillLvUpCondition(index: number): Object {
            let skillLv: number = this._roleSkill[index].lv;
            let nextSkillLv: number = skillLv + 1;
            let obj: Object = {};
            if (this.IsMaxLv(index)) {
                nextSkillLv = this._maxSkill;
            }
            let needRoleLevel: number = this._roleSkillCfg[index][nextSkillLv].needRoleLevel;
            let needGoldNum: number = this._roleSkillCfg[index][nextSkillLv].needGoldNum;
            obj[1] = needRoleLevel;
            obj[2] = needGoldNum;
            return obj;
        }

        /**buff持续时间 s */
        public GetBuffTime(id: number) {
            return PrivilegeConfig[id].continueTime;
        }

        /**请求设置buff */
        public SetBuff() {
            for (let i in this._privListInfo) {
                if (this.PrivIsBuy(Number(i))) {
                    this.SetBuffId(Number(i));
                }
            }
        }

        //=======================按钮点击==============================
        /**使用/购买buff */
        public UseBuff(index: number) {
            let useType = PrivilegeConfig[index].PurchaseConsumption[1];
            let useNum = PrivilegeConfig[index].PurchaseConsumption[2];
            if (DiscountManager.Instance.getPrivilegeTims(index) < DiscountManager.Instance.nPrivilegeMaxTims) {
                useNum = DiscountManager.Instance.tPrivilegeMoney[index];
            }
            let ownMoney: number;
            let _type: string;
            let freeUseNum = MasterPlayer.Instance.getFreeUseNum(index)

            if (freeUseNum < 1) {//如果没有免费次数/没有拥有
                if (useType == 1) {//金币
                    ownMoney = BagManager.Instance.getItemNumber(BaseDefine.ItemIdGold);
                    _type = '金币';
                } else {//钻石
                    ownMoney = BagManager.Instance.getItemNumber(BaseDefine.ItemIdDiamonds);
                    _type = '钻石';
                }
                if (ownMoney < useNum) {
                    TipsLogic.Instance.OpenSystemTips(_type + '不足');
                    return false;
                }
            }
            RemoteCall.Instance.Send("K_ReqAddPrivilege", index);//请求添加特权
            return true;
        }

        /**设置buffid */
        private SetBuffId(id: number) {
            Event.DispatchEvent(EventDefine.PRIVILEGE, [id]);
        }
        /**删除buff */
        private DelBuffId(id: number) {
            Event.DispatchEvent(EventDefine.PRIVILEGE_DELETE, [id]);
        }

        //=======================方法===============================
        private PlayGoldDown() {
            if (!GetInfoAttr.Instance.IsAllScreen) {
                for (let i = 1; i <= this.addGodNum; i++) {
                    //金币掉落
                    this.GoldDown();
                }
            }
        }
        /**金币掉落效果 */
        private GoldDown() {
            let goldNum = GetInfoAttr.Instance.GetThisOrderGoldNum();
            goldNum *= PrivilegeConfig[4].parameter[1];

            let nGold: number = (goldNum / 50) >> 0;
            for (let i = 0; i < 50; i++) {
                let x: number = Math.random() * 600 + 100;
                let y: number = Math.random() * 750;
                DropManager.Instance.AddDropCoin(x, y, nGold, 180);
            }
        }

    }
}