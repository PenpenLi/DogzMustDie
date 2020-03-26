var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var H52D_Framework;
(function (H52D_Framework) {
    var MainSkillViewUI = ui.main.subinterface.MainSkillViewUI;
    /**
     * @class：技能视图类
     * @author：zhangyusong
     */
    var MainSkillView = /** @class */ (function (_super) {
        __extends(MainSkillView, _super);
        function MainSkillView() {
            var _this = _super.call(this) || this;
            /** 自动释放技能 */
            _this.isAuto = false;
            _this.recovery = "(恢复:x/分钟)";
            _this.mpListWidth = 0;
            _this.skillNum = 0;
            /** 法力池 */
            _this._mpPool = 0;
            /** 法力值 */
            _this._mpValue = 0;
            /** 法力回复速度 */
            _this._mpRecoveryRate = 0;
            /** 正在初始化 */
            _this._isInit = true;
            /** 法力条正在增长 */
            _this._isMoveing = false;
            /** 法力条恢复缓动时间 */
            _this._moveTime = 0;
            /** 法力条目标位置 */
            _this._targetLocal = 0;
            _this.bGuidanceButton = true;
            _this.InitView();
            _this.InitEvent();
            return _this;
        }
        MainSkillView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent("UpdateBtnList", Laya.Handler.create(this, this.ShowControl));
            H52D_Framework.Event.RemoveEvent("SkillUpdate", Laya.Handler.create(this, this.SkillUpdate));
            H52D_Framework.Event.RemoveEvent("MpPoolChange", Laya.Handler.create(this, this.MpPoolChange));
            H52D_Framework.Event.RemoveEvent("MpValueChange", Laya.Handler.create(this, this.MpValueChange));
            H52D_Framework.Event.RemoveEvent("MpRecoveryRateChange", Laya.Handler.create(this, this.MpRecoveryRateChange));
            H52D_Framework.Event.RemoveEvent("OnSkillClick", Laya.Handler.create(this, this.OnSkillClick));
            H52D_Framework.Event.RemoveEvent("CaptainCd", Laya.Handler.create(this, this.UseCaptainSkill));
            H52D_Framework.Event.RemoveEvent("SkillMouseEnable", Laya.Handler.create(this, this.SkillMouseEnable));
            H52D_Framework.Event.RemoveEvent("ShowDeputy", Laya.Handler.create(this, this.ShowDeputy));
            H52D_Framework.Event.RemoveEvent("MpFull", Laya.Handler.create(this, this.MpFull));
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.CAPATIAN_SKILL_AUTO, Laya.Handler.create(this, this.CaptainSkillAuto));
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.CustomCurrent));
            H52D_Framework.Tick.Clear(this, this.Frame);
            this.skillModelList.forEach(function (model) { model.Destroy(); });
            this.captainSkill.Destroy();
            this.destroy();
        };
        /** 当前关卡 */
        MainSkillView.prototype.CustomCurrent = function () {
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Boss) {
                this.mouseEnabled = false;
            }
        };
        Object.defineProperty(MainSkillView.prototype, "mpPool", {
            get: function () {
                return this._mpPool;
            },
            /** 法力上限 */
            set: function (value) {
                this._mpPool = value;
                this.ShowMpNum();
                //刷新法力条
                if (this.mpValue > 0) {
                    this.mpValue = this.mpValue;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainSkillView.prototype, "mpValue", {
            get: function () {
                return this._mpValue;
            },
            /** 法力值 */
            set: function (value) {
                var _this = this;
                this._mpValue = value < 0 ? 0 : value;
                if (H52D_Framework.ViewUILogic.Instance.mpValueFull = this._mpValue > H52D_Framework.GameParamConfig["MaxMp"]) {
                    this._mpValue = H52D_Framework.GameParamConfig["MaxMp"];
                }
                H52D_Framework.MasterPlayer.Instance.player.Mp = this._mpValue;
                //法力值发送到服务器
                H52D_Framework.OneTimer(1000, function () {
                    H52D_Framework.RemoteCall.Instance.Send("K_SetMP", _this._mpValue);
                }, "SendSetMp");
                this.ShowMpNum();
                if ((H52D_Framework.CustomsManager.Instance.CustomsVo == null || H52D_Framework.CustomsManager.Instance.CustomsVo.customsType == Customs_Type.Customs)
                    && H52D_Framework.IsAD() && H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes) {
                    this.btn_recovery.visible = this._mpValue <= this.mpPool * 0.7;
                }
                else {
                    this.btn_recovery.visible = false;
                }
                //法力条变化
                this.MpListChange();
            },
            enumerable: true,
            configurable: true
        });
        /** 更新法力条 */
        MainSkillView.prototype.MpListChange = function () {
            var _this = this;
            var nMp = this.mpValue < this.mpPool ? this.mpValue : this.mpPool;
            //位移
            this._targetLocal = (-this.mpListWidth * (1 - nMp / this.mpPool)) >> 0;
            //全长1000毫秒
            this._moveTime = Math.abs(this._targetLocal - this.mp_list.x) / this.mp_list.width * 1000 >> 0;
            //跳过自增长
            if (this._moveTime > 0) {
                if (this._isInit) {
                    this.mp_list.x = this._targetLocal;
                }
                else {
                    if (this._moveTime > 10) {
                        this._isMoveing = true;
                    }
                    Laya.Tween.to(this.mp_list, { x: this._targetLocal }, this._moveTime, Laya.Ease.linearInOut, Laya.Handler.create(this, function () {
                        _this._isMoveing = false;
                    }));
                }
            }
            //容错
            if (this._isMoveing) {
                H52D_Framework.Tick.Once(this._moveTime + 100, this, function () {
                    _this.mp_list.x = _this._targetLocal;
                    _this._isMoveing = false;
                });
            }
        };
        Object.defineProperty(MainSkillView.prototype, "mpRecoveryRate", {
            get: function () {
                return this._mpRecoveryRate;
            },
            /** 法力回升速度 */
            set: function (value) {
                this._mpRecoveryRate = value;
                this.ShowMpNum();
            },
            enumerable: true,
            configurable: true
        });
        MainSkillView.prototype.InitView = function () {
            //法力条初始化
            this.mpListWidth = this.mp_list.width;
            this.ShowControl();
            this.SkillInit(this.Skill);
            this.MpPoolChange();
            this.MpValueChange(H52D_Framework.MasterPlayer.Instance.player.Mp);
            this.MpRecoveryRateChange();
            this._isInit = false;
        };
        MainSkillView.prototype.InitEvent = function () {
            H52D_Framework.Event.RegistEvent("UpdateBtnList", Laya.Handler.create(this, this.ShowControl));
            H52D_Framework.Event.RegistEvent("CaptainSkillInit", Laya.Handler.create(this, this.CaptainSkillIcon));
            H52D_Framework.Event.RegistEvent("SkillUpdate", Laya.Handler.create(this, this.SkillUpdate));
            H52D_Framework.Event.RegistEvent("SkillLeveUp", Laya.Handler.create(this, this.SkillLeveUp));
            H52D_Framework.Event.RegistEvent("MpPoolChange", Laya.Handler.create(this, this.MpPoolChange));
            H52D_Framework.Event.RegistEvent("MpValueChange", Laya.Handler.create(this, this.MpValueChange));
            H52D_Framework.Event.RegistEvent("MpRecoveryRateChange", Laya.Handler.create(this, this.MpRecoveryRateChange));
            H52D_Framework.Event.RegistEvent("OnSkillClick", Laya.Handler.create(this, this.OnSkillClick));
            H52D_Framework.Event.RegistEvent("CaptainCd", Laya.Handler.create(this, this.UseCaptainSkill));
            H52D_Framework.Event.RegistEvent("SkillMouseEnable", Laya.Handler.create(this, this.SkillMouseEnable));
            H52D_Framework.Event.RegistEvent("ShowDeputy", Laya.Handler.create(this, this.ShowDeputy));
            H52D_Framework.Event.RegistEvent("MpFull", Laya.Handler.create(this, this.MpFull));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.CAPATIAN_SKILL_AUTO, Laya.Handler.create(this, this.CaptainSkillAuto));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.CustomCurrent));
            H52D_Framework.Tick.Loop(100, this, this.Frame);
            this.btn_recovery.on(Laya.Event.CLICK, this, this.OnRecovery);
        };
        /** 法力回满 */
        MainSkillView.prototype.MpFull = function () {
            if (this.mpValue < this.mpPool) {
                this.mpValue = this.mpPool;
            }
        };
        /** 一键恢复，打开广告页 */
        MainSkillView.prototype.OnRecovery = function () {
            H52D_Framework.UIManager.Instance.CreateUI("AdvertisementView", [H52D_Framework.ViewUpRoot, AdvertisementType.mpRecover]);
        };
        /**
         * 技能初始化
         * @param value
         */
        MainSkillView.prototype.SkillInit = function (value) {
            var _this = this;
            this.skill = value;
            this.skillModelList = [];
            //基础数据初始化
            var roleSkill = H52D_Framework.MainRoleLogic.Instance.roleSkill;
            this.skillNum = H52D_Framework.MainRoleLogic.Instance.roleSkill.length;
            for (var i = 0; i < this.skillNum; i++) {
                var model = new H52D_Framework.SkillModel();
                this.skillModelList.push(model);
            }
            this.skill.array = roleSkill;
            this.skill.renderHandler = new Laya.Handler(this, function (item, index) {
                var model = _this.skillModelList[index];
                model.SetData(item, index);
                model.UpdateMp(_this.mpValue);
                model.view.on(Laya.Event.CLICK, _this, _this.OnSkillClick, [index]);
                if (index == 0 && _this.bGuidanceButton) {
                    H52D_Framework.Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_6 + 1000, model.view);
                    _this.bGuidanceButton = false;
                }
                if (--_this.skillNum <= 0) {
                    _this.SkillUpdate();
                    H52D_Framework.MasterPlayer.Instance.player.SetSkillList();
                    for (var k in _this.skillModelList) {
                        if (!_this.skillModelList[k].lock) {
                            H52D_Framework.MasterPlayer.Instance.player.SetSkillList(_this.skillModelList[k].index, _this.skillModelList[k].vo.id);
                        }
                    }
                    _this.skillNum = H52D_Framework.MainRoleLogic.Instance.roleSkill.length;
                }
            });
            //队长技能初始化
            this.captainSkill = new H52D_Framework.CaptainSkill(this);
            this.CaptainSkillAuto(true);
        };
        /** 显示副本页，用来刷新技能面板 */
        MainSkillView.prototype.ShowDeputy = function () {
            this.skillModelList.forEach(function (model) { model.Destroy(); });
            this.captainSkill.Destroy();
        };
        MainSkillView.prototype.CaptainSkillAuto = function (auto) {
            this.captainSkill.isAuto = auto;
        };
        /** 更新法力池 */
        MainSkillView.prototype.MpPoolChange = function () {
            this.mpPool = H52D_Framework.MasterPlayer.Instance.player.vo.attr.GetAttributeValue(51);
        };
        /** 更新法力增加值 */
        MainSkillView.prototype.MpValueChange = function (value) {
            this.mpValue += value;
        };
        /** 更新法力恢复速度 */
        MainSkillView.prototype.MpRecoveryRateChange = function () {
            this.mpRecoveryRate = H52D_Framework.MasterPlayer.Instance.player.vo.attr.GetAttributeValue(53);
        };
        MainSkillView.prototype.CaptainSkillIcon = function (icon) {
            this.captainSkillIcon.skin = icon;
        };
        /** 技能更新 */
        MainSkillView.prototype.SkillUpdate = function () {
            if (H52D_Framework.CustomsManager.Instance.CustomsType != Customs_Type.Customs) {
                this.mouseEnabled = false;
            }
            this.MpPoolChange();
            //基础数据初始化
            var roleSkill = H52D_Framework.MainRoleLogic.Instance.roleSkill;
            for (var i = 0; i < roleSkill.length; i++) {
                var model = this.skillModelList[i];
                model.level = roleSkill[i].lv;
                //副本场景cd是零
                model.UpdateCd(roleSkill[i].cd);
                model.UpdateMp(this.mpValue);
            }
        };
        /** 技能升级 */
        MainSkillView.prototype.SkillLeveUp = function () {
            var roleSkill = H52D_Framework.MainRoleLogic.Instance.roleSkill;
            for (var i = 0; i < roleSkill.length; i++) {
                var model = this.skillModelList[i];
                model.level = roleSkill[i].lv;
                model.UpdateMp(this.mpValue);
            }
        };
        /**
         * 使用技能
         * @param index:0-5
         * @param excess:额外的技能，释放时不消耗法力值只有持续时间没有冷却时间
         */
        MainSkillView.prototype.OnSkillClick = function (index, excess) {
            if (typeof excess != "boolean") {
                excess = false;
            }
            var monsterList = H52D_Framework.MonsterManager.Instance.monsterList;
            if (monsterList == {}) {
                return;
            }
            else {
                for (var k in monsterList) {
                    if (monsterList[k].IsDie) {
                        return;
                    }
                }
            }
            var model = this.skillModelList[index];
            if (!excess) {
                if (this.mpValue >= model.vo.conMp) {
                    this.mpValue -= model.vo.conMp;
                    model.UpdateMp(this.mpValue);
                }
                else {
                    // TipsLogic.Instance.OpenSystemTips("当前法力值不足");
                    return;
                }
            }
            model.StartUse(excess);
            //主线技能记录释放时间戳，额外技能不记录
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Customs && !excess) {
                H52D_Framework.RemoteCall.Instance.Send("K_ReqSkillCD", index + 1);
                H52D_Framework.MainRoleLogic.Instance.SetSkillCdTime(index, H52D_Framework.Time.serverSecodes);
            }
            //使用技能数量
            H52D_Framework.MasterPlayer.Instance.ReqOnEvent(EventProEnum.UsePlayerSkill, 1);
        };
        /** 帧函数，执行法力值自增长和技能刷新 */
        MainSkillView.prototype.Frame = function () {
            if (this.mpValue < this.mpPool) {
                //在大幅变化过程中，中断自增长
                if (!this._isMoveing) {
                    this.mpValue += this.mpRecoveryRate / 600;
                }
            }
            if (this.skillModelList.length == 6) {
                //更新技能
                for (var i = 0; i < 6; i++) {
                    this.skillModelList[i].UpdateMp(this.mpValue);
                }
            }
        };
        /** 显示法力值数据 */
        MainSkillView.prototype.ShowMpNum = function () {
            this.tx_skill_num.text = (this._mpValue >> 0) + "/" + (this._mpPool >> 0);
            this.tx_skill_num.width = this.tx_skill_num.textWidth;
            this.tx_skill_time.text = this.recovery.replace("x", String(this.mpRecoveryRate));
            this.tx_skill_time.x = this.tx_skill_num.x + this.tx_skill_num.textWidth + 10;
        };
        /** 使用队长技能 */
        MainSkillView.prototype.UseCaptainSkill = function (cdTime) {
            this.captainSkill.UseCaptainSkill(cdTime);
        };
        /** 隐藏自己，用于副本页面 */
        MainSkillView.prototype.ShowControl = function () {
            this.bg.visible = H52D_Framework.WroldBossLogic.Instance.Show;
        };
        /** 技能可点击，用于副本页面 */
        MainSkillView.prototype.SkillMouseEnable = function () {
            this.mouseEnabled = true;
        };
        return MainSkillView;
    }(MainSkillViewUI));
    H52D_Framework.MainSkillView = MainSkillView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MainSkillView.js.map