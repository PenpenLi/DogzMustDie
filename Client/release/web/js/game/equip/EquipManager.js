/**
* 时空法器管理器
*/
var H52D_Framework;
(function (H52D_Framework) {
    var EquipManager = /** @class */ (function () {
        function EquipManager() {
            /**是否溢出 */
            this._IsOverflow = false;
            /**已拥有武器信息 */
            this._ownEquipList = {};
            /**已拥有武器库容器 */
            this._equipInstIdList = {};
            /**武器所属装备组ID映射表 */
            this._equipGroupList = {};
            /**当前佩戴的武器 */
            this._currentEquipList = {};
            /**当前佩戴的武器属性生效 */
            this._currentAttrributeList = {};
            /**当前套装属性生效列表 */
            this._suitAttrributeList = {};
            /**套装激活 */
            this._suitActivateList = {};
            /**套装配置type映射表 */
            this._suitCfgList = {};
            /**套装id、等级映射表*/
            this._suitMakeList = {};
            this.equip_onlyone = true;
            this.Init();
            /**初始化套装列表 */
            for (var suitId in H52D_Framework.SuitConfig) {
                var suit = H52D_Framework.SuitConfig[suitId];
                var suitColor = suit.suitColor;
                if (this._suitCfgList[suitColor] == null) {
                    this._suitCfgList[suitColor] = [];
                }
                this._suitCfgList[suitColor].push(Number(suitId));
            }
        }
        Object.defineProperty(EquipManager, "Instance", {
            get: function () {
                if (EquipManager._init == null) {
                    EquipManager._init = new EquipManager();
                }
                return EquipManager._init;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EquipManager.prototype, "CurrentAttrributeList", {
            get: function () { return this._currentAttrributeList; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EquipManager.prototype, "SuitAttrributeList", {
            get: function () { return this._suitAttrributeList; },
            enumerable: true,
            configurable: true
        });
        EquipManager.prototype.Initialize = function () {
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_AddEquip", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_DelEquip", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqUseEquip", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqLockEquip", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqSellEquip", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_SendEquipInfo", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqCompoundEquip", this);
        };
        EquipManager.prototype.Init = function () {
            var _a, _b;
            /**初始化已拥有武器信息 */
            this._ownEquipList = {};
            /**初始化武器库容器 */
            this._equipInstIdList = (_a = {},
                /** 手套背包 */
                _a[E_EquipType.eGlove] = new H52D_Framework.PackModule(),
                /** 星戒背包 */
                _a[E_EquipType.eRing] = new H52D_Framework.PackModule(),
                /** 卷轴背包 */
                _a[E_EquipType.eScroll] = new H52D_Framework.PackModule(),
                /** 容器背包 */
                _a[E_EquipType.eContainer] = new H52D_Framework.PackModule(),
                /** 灵背包 */
                _a[E_EquipType.eSoul] = new H52D_Framework.PackModule(),
                _a);
            /**初始化当前佩戴的武器 */
            this._currentEquipList = (_b = {},
                /** 佩戴手套Id */
                _b[E_EquipType.eGlove] = 0,
                /** 佩戴星戒Id */
                _b[E_EquipType.eRing] = 0,
                /** 佩戴卷轴Id */
                _b[E_EquipType.eScroll] = 0,
                /** 佩戴容器Id */
                _b[E_EquipType.eContainer] = 0,
                /** 佩戴灵Id */
                _b[E_EquipType.eSoul] = 0,
                _b);
            /***********************************/
            for (var cfgId in H52D_Framework.EquipConfig) {
                var cfg = H52D_Framework.EquipConfig[cfgId];
                var equipGroup = cfg.equipGroup;
                var equipLevel = cfg.equipLevel;
                if (this._suitMakeList[equipGroup] == null) {
                    this._suitMakeList[equipGroup] = {};
                }
                this._suitMakeList[equipGroup][equipLevel] = Number(cfgId);
            }
        };
        /**上线同步回调 */
        EquipManager.prototype.C_SendEquipInfo = function (buf) {
            this.Init();
            //装备实例列表
            var tEquipList = buf[0];
            //装备穿戴信息
            var tUseList = buf[1];
            //同步客户端装备实例列表
            for (var Id in tEquipList) {
                var instId = Number(Id);
                var info = tEquipList[Id];
                var cfgId = info[1];
                var bLock = info[2];
                var bNew = info[3];
                var bUse = info[4];
                var equip = new H52D_Framework.EquipVo(cfgId);
                this._ownEquipList[instId] = equip;
                equip.unpackData([instId, bLock, bNew]);
                var equipType = equip.equipType;
                var equipGroup = equip.equipGroup;
                this._equipInstIdList[equipType].Add(instId, equip);
                if (this._equipGroupList[equipGroup] == null) {
                    this._equipGroupList[equipGroup] = new H52D_Framework.PackModule();
                }
                this._equipGroupList[equipGroup].Add(instId, equip);
                var suitId = equip.suitId;
                this.SuitOnceActivate(suitId, equipGroup, true);
                //同步客户端当前佩戴的武器
                if (bUse != null && bUse == 1) {
                    this._currentEquipList[equipType] = instId;
                    this.LoadAttribute(instId);
                }
            }
            this._IsOverflow = this.GetEquipNum() == H52D_Framework.GameParamConfig.EquipMaxNum;
        };
        /**添加装备回调 */
        EquipManager.prototype.C_AddEquip = function (buf) {
            //装备实例ID
            var instId = buf[0];
            //装备信息
            var tUseList = buf[1];
            //装备配置ID
            var cfgId = tUseList[1];
            //装备是否上锁			
            var bLock = tUseList[2];
            //装备是否new		
            var bNew = tUseList[3];
            var equip = new H52D_Framework.EquipVo(cfgId);
            equip.unpackData([instId, bLock, bNew]);
            this._IsOverflow = false;
            this._ownEquipList[instId] = equip;
            var equipType = equip.equipType;
            var equipGroup = equip.equipGroup;
            var suitId = equip.suitId;
            this._equipInstIdList[equipType].Add(instId, equip);
            if (this._equipGroupList[equipGroup] == null) {
                this._equipGroupList[equipGroup] = new H52D_Framework.PackModule();
            }
            this._equipGroupList[equipGroup].Add(instId, equip);
            this.SuitOnceActivate(suitId, equipGroup, true);
            var bool = this.GetEquip_one(instId, cfgId);
            if (bool) {
                H52D_Framework.Event.DispatchEvent("ShowRedPoint", E_OpenGrade.EQUIP);
            }
        };
        Object.defineProperty(EquipManager.prototype, "EquipOnlyone", {
            get: function () {
                return this.equip_onlyone;
            },
            enumerable: true,
            configurable: true
        });
        /**检测有没有相同的武器 */
        EquipManager.prototype.GetEquip_one = function (instId, cfg_Id) {
            var num = 0;
            for (var key in this._ownEquipList) {
                var equip_Info = this._ownEquipList[key];
                if (equip_Info.cfgId == cfg_Id) {
                    num++;
                    var bool_1 = num == 1 ? true : false;
                }
            }
            var bool = num == 1 ? true : false;
            this.equip_onlyone = bool;
            if (!bool) {
                this.K_ReqLookEquip(instId);
            }
            return bool;
        };
        /**删除装备回调 */
        EquipManager.prototype.C_DelEquip = function (buf) {
            //装备实例ID
            var instId = buf[0];
            var equip = this._ownEquipList[instId];
            var cfgId = equip.cfgId;
            var equipType = equip.equipType;
            var equipGroup = equip.equipGroup;
            var suitId = equip.suitId;
            //先卸载装备属性
            if (instId == this._currentEquipList[equipType]) {
                this.UnLoadAttribute(instId);
            }
            if (this.IsSuitActivate && this._equipGroupList[equipGroup].count == 1) {
                this.UnLoadSuitAttribute(suitId);
            }
            if (this._ownEquipList[instId] != null) {
                delete this._ownEquipList[instId];
            }
            this._equipInstIdList[equipType].Remove(instId);
            this._equipGroupList[equipGroup].Remove(instId);
            if (this._equipGroupList[equipGroup].count == 0) {
                this.SuitOnceActivate(suitId, equipGroup, false);
            }
            this._IsOverflow = true;
            H52D_Framework.Event.DispatchEvent("DeleShow");
        };
        /**出售装备获得奖励回调 */
        EquipManager.prototype.C_ReqSellEquip = function (buf) {
            //奖励
            var tAllAward = buf[0];
            H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(tAllAward);
        };
        /**请求穿戴装备回调 */
        EquipManager.prototype.C_ReqUseEquip = function (buf) {
            //装备类型
            var equipType = buf[0];
            //装备实例ID
            var instId = buf[1];
            //先卸载装备属性
            this.UnLoadAttribute(this._currentEquipList[equipType]);
            //再装载装备属性
            this._currentEquipList[equipType] = instId;
            this.LoadAttribute(instId);
            H52D_Framework.Event.DispatchEvent("Puton", [instId]);
            H52D_Framework.Event.DispatchEvent("ShowRedPoint", E_OpenGrade.EQUIP);
        };
        /**请求设置锁头回调 */
        EquipManager.prototype.C_ReqLockEquip = function (buf) {
            //装备实例ID
            var nInstID = buf[0];
            //是否锁定 0 or null = false : 1 = true
            var bLock = buf[1];
            this._ownEquipList[nInstID].bLock = bLock;
            H52D_Framework.Event.DispatchEvent("Setlock", [bLock]);
        };
        /**合成装备回调 */
        EquipManager.prototype.C_ReqCompoundEquip = function (buf) {
            var _a;
            var equipId = buf[0];
            var nameId = H52D_Framework.EquipConfig[equipId].equipName;
            var name = H52D_Framework.GetInfoAttr.Instance.GetText(nameId);
            var suitId = H52D_Framework.EquipConfig[equipId].suitId;
            var equipType = H52D_Framework.EquipConfig[equipId].equipType;
            var tAllAward = { 2: (_a = {}, _a[equipId] = 1, _a) };
            var equipGroup = H52D_Framework.EquipConfig[equipId].equipGroup;
            H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(tAllAward, false, Laya.Handler.create(this, function () {
                var str = H52D_Framework.Format(H52D_Framework.SysPromptConfig[30031].strPromptInfo, H52D_Framework.GetHtmlStrByColor(name, H52D_Framework.BaseDefine.EquipQualityColor[H52D_Framework.EquipConfig[equipId].equipColor]));
                H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
            }));
            //this.SuitOnceActivate(suitId, equipGroup, true);
            H52D_Framework.Event.DispatchEvent("updatelist_equip", [equipId]);
        };
        /*******************************************************/
        /**请求穿戴装备 */
        EquipManager.prototype.K_ReqUseEquip = function (instId) {
            H52D_Framework.RemoteCall.Instance.Send('K_ReqUseEquip', instId);
        };
        /**请求设置锁头 */
        EquipManager.prototype.K_ReqLockEquip = function (instId, bLock) {
            var b = bLock ? 1 : 0;
            H52D_Framework.RemoteCall.Instance.Send('K_ReqLockEquip', instId, b);
        };
        /**出售装备 */
        EquipManager.prototype.K_ReqSellEquip = function (instId) {
            H52D_Framework.RemoteCall.Instance.Send('K_ReqSellEquip', instId);
        };
        /**查看装备消除New */
        EquipManager.prototype.K_ReqLookEquip = function (instId) {
            H52D_Framework.RemoteCall.Instance.Send('K_ReqLookEquip', instId);
            this._ownEquipList[instId].bNew = false;
        };
        /**请求合成装备 */
        EquipManager.prototype.K_ReqCompoundEquip = function (equipGroup) {
            //let equipLevel: number = CustomsManager.Instance.CustomsVo.composeEquipLevel;
            this._IsOverflow = true;
            H52D_Framework.RemoteCall.Instance.Send('K_ReqCompoundEquip', equipGroup);
        };
        /*******************************************************/
        /**获取已拥有武器数量 */
        EquipManager.prototype.GetEquipNum = function () {
            return H52D_Framework.GetTabLength(this._ownEquipList);
        };
        /**获取已拥有武器信息 */
        EquipManager.prototype.GetEquipByInstId = function (instId) {
            return this._ownEquipList[instId];
        };
        /**获取武器库容器 */
        EquipManager.prototype.GetEquipByType = function (type) {
            return this._equipInstIdList[type];
        };
        /**获取当前佩戴的武器 */
        EquipManager.prototype.GetCurrentEquipByType = function (type) {
            return this._currentEquipList[type];
        };
        /**获取套装列表 */
        EquipManager.prototype.GetSuitCfgListByType = function (type) {
            return this._suitCfgList[type];
        };
        /**获取装备ID */
        EquipManager.prototype.GetEquipIdBySuitId = function (suitId) {
            var equipLevel = H52D_Framework.CustomsManager.Instance.CustomsVo.composeEquipLevel;
            return this._suitMakeList[suitId][equipLevel];
        };
        Object.defineProperty(EquipManager.prototype, "IsOverflow", {
            /**装备是否溢出 */
            get: function () {
                return this._IsOverflow;
            },
            enumerable: true,
            configurable: true
        });
        /**套装单个内容是否激活 */
        EquipManager.prototype.IsSuitOnceActivate = function (groupId) {
            if (this._equipGroupList[groupId] == null) {
                return false;
            }
            return this._equipGroupList[groupId].count != 0;
        };
        /**套装是否激活 */
        EquipManager.prototype.IsSuitActivate = function (suitId) {
            var suit = this._suitActivateList[suitId];
            if (suit == null) {
                return false;
            }
            for (var groupId in suit) {
                if (suit[groupId] == false) {
                    return false;
                }
            }
            return H52D_Framework.GetTabLength(suit) == 5;
        };
        /**套装单个激活 */
        EquipManager.prototype.SuitOnceActivate = function (suitId, groupId, bActivate) {
            if (suitId == 0)
                return;
            if (this._suitActivateList[suitId] == null) {
                this._suitActivateList[suitId] = {};
            }
            this._suitActivateList[suitId][groupId] = bActivate;
            if (this.IsSuitActivate(suitId) == true) {
                this.UnLoadSuitAttribute(suitId);
                this.LoadSuitAttribute(suitId);
            }
        };
        /**某套装单个激活件数 */
        EquipManager.prototype.GetSuitOnceActivateNum = function (suitId) {
            var suitActivate = this._suitActivateList[suitId];
            var num = 0;
            for (var key in suitActivate) {
                var b = suitActivate[key];
                if (b) {
                    num++;
                }
            }
            return num;
        };
        /**重新生成武器属性 */
        EquipManager.prototype.AnewLoadAttribute = function () {
            for (var type in this._currentAttrributeList) {
                var arr = this._currentAttrributeList[type];
                for (var i in arr) {
                    arr[i].OnEffect();
                }
            }
            for (var suitId in this._suitAttrributeList) {
                var arr = this._suitAttrributeList[suitId];
                for (var i in arr) {
                    arr[i].OnEffect();
                }
            }
        };
        /**装载装备属性到角色 */
        EquipManager.prototype.LoadAttribute = function (instId) {
            if (instId == 0)
                return;
            var equip = this._ownEquipList[instId];
            var equipType = equip.equipType;
            var baseAttribute = equip.baseAttribute;
            for (var baseId in baseAttribute) {
                var attribute = baseAttribute[baseId];
                var attrributeEquipment = new H52D_Framework.ModfiyAttribute(this, attribute);
                this._currentAttrributeList[equipType];
                if (this._currentAttrributeList[equipType] == null) {
                    this._currentAttrributeList[equipType] = [];
                }
                attrributeEquipment.OnEffect();
                this._currentAttrributeList[equipType].push(attrributeEquipment);
            }
        };
        /**卸载装备属性 */
        EquipManager.prototype.UnLoadAttribute = function (instId) {
            if (instId == 0)
                return;
            var equip = this._ownEquipList[instId];
            var equipType = equip.equipType;
            var attrributeList = this._currentAttrributeList[equipType];
            for (var id in attrributeList) {
                attrributeList[id].Destroy();
            }
            this._currentAttrributeList[equipType] = [];
        };
        /**装载套装属性到角色 */
        EquipManager.prototype.LoadSuitAttribute = function (suitId) {
            var suit = H52D_Framework.SuitConfig[suitId];
            var suitAttribute = suit.suitAttribute;
            for (var baseId in suitAttribute) {
                var attribute = suitAttribute[baseId];
                var attrributeEquipment = new H52D_Framework.ModfiyAttribute(this, attribute);
                this._suitAttrributeList[suitId];
                if (this._suitAttrributeList[suitId] == null) {
                    this._suitAttrributeList[suitId] = [];
                }
                attrributeEquipment.OnEffect();
                this._suitAttrributeList[suitId].push(attrributeEquipment);
            }
        };
        /**卸载套装属性 */
        EquipManager.prototype.UnLoadSuitAttribute = function (suitId) {
            // if (instId == 0) return;
            // let equip = this._ownEquipList[instId];
            // let suitId = equip.suitId;
            if (suitId == 0)
                return;
            var attrributeList = this._suitAttrributeList[suitId];
            if (attrributeList == [])
                return;
            for (var id in attrributeList) {
                attrributeList[id].Destroy();
            }
            this._suitAttrributeList[suitId] = [];
        };
        /**控制主界面红点` */
        EquipManager.prototype.IsMainShowRed = function () {
            for (var instId in this._ownEquipList) {
                var equip = this._ownEquipList[instId];
                if (equip.bNew) {
                    return true;
                }
            }
            return false;
        };
        EquipManager.prototype.SortE = function (E_id, bool) {
            function sort_E(left, right) {
                var left_info = EquipManager.Instance.GetEquipByInstId(left.instId);
                var right_Info = EquipManager.Instance.GetEquipByInstId(right.instId);
                if (left_info.bNew != right_Info.bNew) {
                    return left_info.bNew ? -1 : 1;
                }
                if (left_info.equipColor == right_Info.equipColor) {
                    if (left_info.equipLevel == right_Info.equipLevel) {
                        return left.instId > right.instId ? -1 : 1;
                    }
                    return left_info.equipLevel > right_Info.equipLevel ? -1 : 1;
                }
                else {
                    return left_info.equipColor > right_Info.equipColor ? -1 : 1;
                }
            }
            if (bool) {
                E_id.sort(sort_E);
            }
        };
        return EquipManager;
    }());
    H52D_Framework.EquipManager = EquipManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=EquipManager.js.map