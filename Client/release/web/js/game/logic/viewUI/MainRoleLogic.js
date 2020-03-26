var H52D_Framework;
(function (H52D_Framework) {
    var MainRoleLogic = /** @class */ (function () {
        function MainRoleLogic() {
            this._roleSkillCfg = [];
            //服务器返回的技能信息，index+1：技能，lv等级 cd时间戳
            this._roleSkill = [];
            this._privList = []; //特权
            this._privListInfo = new Object(); //特权
            this._maxSkill = 0;
            this.addGodNum = 0;
            this.SetPrivList();
        }
        Object.defineProperty(MainRoleLogic, "Instance", {
            get: function () {
                if (MainRoleLogic._inst == null) {
                    MainRoleLogic._inst = new MainRoleLogic();
                }
                return MainRoleLogic._inst;
            },
            enumerable: true,
            configurable: true
        });
        MainRoleLogic.prototype.Initialize = function () {
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_SyncSkillList", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqActivateSkill", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqSkillLevelUp", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_PrivilegeSystemInfo", this); //上线同步
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqAddPrivilege", this); //添加通知
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_DelPrivilege", this); //到期删除通知
            var cfg = H52D_Framework.RoleSkillUpConfig;
            for (var key in cfg) {
                if (Number(key) != 0) {
                    var object = cfg[key];
                    this._roleSkillCfg.push(object);
                }
            }
        };
        /**特权上线同步 */
        MainRoleLogic.prototype.C_PrivilegeSystemInfo = function (buf) {
            this._privListInfo = buf[0];
            for (var i in this._privListInfo) {
                if (this.PrivIsBuy(Number(i))) {
                    this.SetBuffId(Number(i));
                }
            }
        };
        /**
         * 获取技能ID 0-5
         */
        MainRoleLogic.prototype.GetSkillID = function (index) {
            var Cfg = H52D_Framework.RoleSkillUpConfig[index + 1];
            var nlv = 1;
            if (this._roleSkill[index] && this._roleSkill[index].lv > 0) {
                nlv = this._roleSkill[index].lv;
            }
            return Cfg[nlv].roleSkillId;
        };
        //解锁的技能
        MainRoleLogic.prototype.C_SyncSkillList = function (buf) {
            this._roleSkill = [];
            var skillObj = buf[0];
            var skillCd = buf[1];
            for (var index = 0; index < this._roleSkillCfg.length; index++) {
                this._roleSkill[index] = { "lv": 0, "cd": 0 };
                var key = index + 1;
                if (skillObj[key]) {
                    this._roleSkill[index].lv = skillObj[key];
                }
                if (skillCd[key]) {
                    this._roleSkill[index].cd = skillCd[key];
                }
            }
            var roleSkill = this._roleSkill;
            var roleSkillCfg = this._roleSkillCfg;
            var addMp = 0;
            for (var index = 0; index < roleSkill.length; index++) {
                var lv = roleSkill[index].lv;
                if (lv > 0) {
                    addMp += roleSkillCfg[index][1].addMaxMp;
                }
            }
            H52D_Framework.MasterPlayer.Instance.player.vo.attr.SetAttributeValue(51, H52D_Framework.eValueType.Base, H52D_Framework.GameParamConfig["BaseMaxMp"] + addMp);
            H52D_Framework.MasterPlayer.Instance.player.vo.attr.SetAttributeValue(53, H52D_Framework.eValueType.Base, H52D_Framework.GameParamConfig["MpRecoveryRate"]);
            H52D_Framework.Event.DispatchEvent("SkillUpdate", [Customs_Type.Customs]);
        };
        //激活回掉
        MainRoleLogic.prototype.C_ReqActivateSkill = function (buf) {
            var index = buf[0] - 1;
            this._roleSkill[index].lv = 1;
            var addMp = 0;
            for (var index = 0; index < this._roleSkill.length; index++) {
                var element = this._roleSkill[index].lv;
                if (element > 0) {
                    addMp += this._roleSkillCfg[index][1].addMaxMp;
                }
            }
            H52D_Framework.MasterPlayer.Instance.player.vo.attr.SetAttributeValue(51, H52D_Framework.eValueType.Base, H52D_Framework.GameParamConfig["BaseMaxMp"] + addMp);
            H52D_Framework.Event.DispatchEvent("RefreshList");
            H52D_Framework.Event.DispatchEvent("LvUpEffect");
            H52D_Framework.Event.DispatchEvent("SkillUpdate", [Customs_Type.Customs]);
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/level_up.mp3");
        };
        //升级回掉
        MainRoleLogic.prototype.C_ReqSkillLevelUp = function (buf) {
            var element = buf[1];
            var index = buf[0] - 1;
            this._roleSkill[index].lv = element;
            H52D_Framework.Event.DispatchEvent("RefreshList");
            H52D_Framework.Event.DispatchEvent("LvUpEffect");
            H52D_Framework.Event.DispatchEvent("SkillLeveUp");
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/level_up.mp3");
        };
        /**添加特权回调 */
        MainRoleLogic.prototype.C_ReqAddPrivilege = function (buf) {
            var nPrivilege = buf[0];
            this._privListInfo[nPrivilege] = buf[1];
            //免费特权次数  nil为无次数
            var nFreeUseNum = buf[2];
            H52D_Framework.MasterPlayer.Instance.setFreeUseNum(nPrivilege, nFreeUseNum);
            this.SetBuffId(nPrivilege);
            this.SetPrivList();
            H52D_Framework.Event.DispatchEvent('privListTime');
            if (buf[0] == 4) { //金币特权
                this.addGodNum += 1;
                var timeNow = Date.now() / 1000;
                this._privListInfo[buf[0]] = timeNow + H52D_Framework.GameParamConfig.UseInterval;
                this.GoldDown();
                //this.PlayGoldDown();
            }
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/tequan.mp3");
        };
        /**特权到期删除通知 */
        MainRoleLogic.prototype.C_DelPrivilege = function (buf) {
            this._privListInfo[buf[0]] = -1;
            if (this.GetBuffTime(buf[0]) != -1) {
                this.DelBuffId(buf[0]);
            }
        };
        /**设置特权list */
        MainRoleLogic.prototype.SetPrivList = function () {
            this._privList = new Array();
            for (var i in H52D_Framework.PrivilegeConfig) {
                var _name = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.PrivilegeConfig[i].name);
                var _descri = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.PrivilegeConfig[i].description);
                var _icon = 'ui_icon/' + H52D_Framework.PrivilegeConfig[i].stricon;
                var moneyTypeicon = H52D_Framework.PrivilegeConfig[i].PurchaseConsumption[1] == 2 ? '' : 'ui_common/icon-jinbi.png';
                var _diamonds = true;
                var _useNum = "<img src= 'ui_icon/icon_prop_013.png' width='20px' height='16px'></img>" + H52D_Framework.PrivilegeConfig[i].PurchaseConsumption[2] + '';
                var _bewrite = H52D_Framework.PrivilegeConfig[i].isActive == 1 ? '主动' : '被动';
                var free = H52D_Framework.MasterPlayer.Instance.getFreeUseNum(Number(i));
                var totle = H52D_Framework.GameParamConfig.FreePrivilegeStorageMaxNum[Number(i)];
                var _discount = -1;
                if (free > 0) //有可用次数
                 {
                    _useNum = "免费次数" + free + "/" + totle;
                    _diamonds = false;
                }
                else if (H52D_Framework.DiscountManager.Instance.IsStartPrivilegeAction() && (H52D_Framework.DiscountManager.Instance.getPrivilegeTims(i) < H52D_Framework.DiscountManager.Instance.nPrivilegeMaxTims)) {
                    _useNum = "<img src= 'ui_icon/icon_prop_013.png' width='20px' height='16px'></img>" + H52D_Framework.DiscountManager.Instance.tPrivilegeMoney[i] + "(" + H52D_Framework.DiscountManager.Instance.getPrivilegeTims(i) + "/" + H52D_Framework.DiscountManager.Instance.nPrivilegeMaxTims + ")";
                    _discount = (H52D_Framework.DiscountManager.Instance.tPrivilegeMoney[i] / H52D_Framework.PrivilegeConfig[i].PurchaseConsumption[2] * 10) >> 0;
                }
                this._privList.push({
                    privIcon: _icon, privName: _name, useIcon: { skin: moneyTypeicon, visible: false },
                    useNum: { text: _useNum, diamonds: _diamonds }, bewrite: _bewrite,
                    discount: _discount
                });
            }
        };
        MainRoleLogic.prototype.FreeNum = function (free, totle) {
            return "免费次数" + free + "/" + totle;
        };
        Object.defineProperty(MainRoleLogic.prototype, "roleMaxLv", {
            /**
             * 角色最大等级
             */
            get: function () {
                var roleMaxLv = 0;
                while (H52D_Framework.RoleLevelUpConfig[roleMaxLv + 1]) {
                    roleMaxLv++;
                }
                return roleMaxLv;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainRoleLogic.prototype, "roleSkillCfg", {
            /**
             * 技能配置表
             */
            get: function () {
                return this._roleSkillCfg;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainRoleLogic.prototype, "roleSkill", {
            /**
             * 当前技能信息
             */
            get: function () {
                return this._roleSkill;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置技能CD时间戳
         */
        MainRoleLogic.prototype.SetSkillCdTime = function (index, cd) {
            return this._roleSkill[index].cd = cd;
        };
        Object.defineProperty(MainRoleLogic.prototype, "PrivList", {
            /**特权list */
            get: function () {
                return this._privList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainRoleLogic.prototype, "PrivListInfo", {
            /**特权时间信息  */
            get: function () {
                return this._privListInfo;
            },
            enumerable: true,
            configurable: true
        });
        /**特权是否已购买*/
        MainRoleLogic.prototype.PrivIsBuy = function (id) {
            if (this._privListInfo[id]) {
                var _time = H52D_Framework.GetInfoAttr.Instance.GetCountDown(this._privListInfo[id], false);
                if (_time <= 0) {
                    return false;
                }
                return true;
            }
            return false;
        };
        /**需要倒计时的特权 */
        MainRoleLogic.prototype.SetToUpdatePriv = function () {
            var obj = new Object();
            for (var i in this._privListInfo) {
                if (this.PrivIsBuy(Number(i))) {
                    obj[i] = this._privListInfo[i];
                }
                if (this.GetBuffTime(Number(i)) == -1) {
                    obj[i] = -1;
                }
            }
            return obj;
        };
        /**
         * 技能是否达到最高级
         */
        MainRoleLogic.prototype.IsMaxLv = function (index) {
            var maxLv = 0;
            for (var key in this._roleSkillCfg[index]) {
                maxLv++;
            }
            this._maxSkill = maxLv;
            if (this._roleSkill[index].lv == maxLv)
                return true;
            return false;
        };
        /**
         * 是否解锁了技能
         */
        MainRoleLogic.prototype.IsSkillUnlocked = function (index) {
            if (this._roleSkill[index].lv > 0)
                return true;
            return false;
        };
        /**
         * 获取技能的解锁需要的角色等级和需要的金币
         */
        MainRoleLogic.prototype.GetSkillUnlockCondition = function (index) {
            var obj = {};
            var needRoleLevel = this._roleSkillCfg[index][1].needRoleLevel;
            var needGoldNum = this._roleSkillCfg[index][1].needGoldNum;
            obj[1] = needRoleLevel;
            obj[2] = needGoldNum;
            return obj;
        };
        /**
         * 是否能升级
         */
        MainRoleLogic.prototype.IsSkillCanLvUp = function (index) {
            var skillLv = this._roleSkill[index].lv;
            var nextSkillLv = skillLv + 1;
            var needRoleLevel = this._roleSkillCfg[index][nextSkillLv].needRoleLevel;
            var needGoldNum = this._roleSkillCfg[index][nextSkillLv].needGoldNum;
            var money = H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdGold);
            var rolelv = H52D_Framework.MasterPlayer.Instance.player.Level;
            if (rolelv >= needRoleLevel) {
                if (money >= needGoldNum) {
                    return true;
                }
            }
            return false;
        };
        /**
         * 获取技能的升级需要的角色等级和需要的金币
         */
        MainRoleLogic.prototype.GetSkillLvUpCondition = function (index) {
            var skillLv = this._roleSkill[index].lv;
            var nextSkillLv = skillLv + 1;
            var obj = {};
            if (this.IsMaxLv(index)) {
                nextSkillLv = this._maxSkill;
            }
            var needRoleLevel = this._roleSkillCfg[index][nextSkillLv].needRoleLevel;
            var needGoldNum = this._roleSkillCfg[index][nextSkillLv].needGoldNum;
            obj[1] = needRoleLevel;
            obj[2] = needGoldNum;
            return obj;
        };
        /**buff持续时间 s */
        MainRoleLogic.prototype.GetBuffTime = function (id) {
            return H52D_Framework.PrivilegeConfig[id].continueTime;
        };
        /**请求设置buff */
        MainRoleLogic.prototype.SetBuff = function () {
            for (var i in this._privListInfo) {
                if (this.PrivIsBuy(Number(i))) {
                    this.SetBuffId(Number(i));
                }
            }
        };
        //=======================按钮点击==============================
        /**使用/购买buff */
        MainRoleLogic.prototype.UseBuff = function (index) {
            var useType = H52D_Framework.PrivilegeConfig[index].PurchaseConsumption[1];
            var useNum = H52D_Framework.PrivilegeConfig[index].PurchaseConsumption[2];
            if (H52D_Framework.DiscountManager.Instance.getPrivilegeTims(index) < H52D_Framework.DiscountManager.Instance.nPrivilegeMaxTims) {
                useNum = H52D_Framework.DiscountManager.Instance.tPrivilegeMoney[index];
            }
            var ownMoney;
            var _type;
            var freeUseNum = H52D_Framework.MasterPlayer.Instance.getFreeUseNum(index);
            if (freeUseNum < 1) { //如果没有免费次数/没有拥有
                if (useType == 1) { //金币
                    ownMoney = H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdGold);
                    _type = '金币';
                }
                else { //钻石
                    ownMoney = H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdDiamonds);
                    _type = '钻石';
                }
                if (ownMoney < useNum) {
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips(_type + '不足');
                    return false;
                }
            }
            H52D_Framework.RemoteCall.Instance.Send("K_ReqAddPrivilege", index); //请求添加特权
            return true;
        };
        /**设置buffid */
        MainRoleLogic.prototype.SetBuffId = function (id) {
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.PRIVILEGE, [id]);
        };
        /**删除buff */
        MainRoleLogic.prototype.DelBuffId = function (id) {
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.PRIVILEGE_DELETE, [id]);
        };
        //=======================方法===============================
        MainRoleLogic.prototype.PlayGoldDown = function () {
            if (!H52D_Framework.GetInfoAttr.Instance.IsAllScreen) {
                for (var i = 1; i <= this.addGodNum; i++) {
                    //金币掉落
                    this.GoldDown();
                }
            }
        };
        /**金币掉落效果 */
        MainRoleLogic.prototype.GoldDown = function () {
            var goldNum = H52D_Framework.GetInfoAttr.Instance.GetThisOrderGoldNum();
            goldNum *= H52D_Framework.PrivilegeConfig[4].parameter[1];
            var nGold = (goldNum / 50) >> 0;
            for (var i = 0; i < 50; i++) {
                var x = Math.random() * 600 + 100;
                var y = Math.random() * 750;
                H52D_Framework.DropManager.Instance.AddDropCoin(x, y, nGold, 180);
            }
        };
        return MainRoleLogic;
    }());
    H52D_Framework.MainRoleLogic = MainRoleLogic;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MainRoleLogic.js.map