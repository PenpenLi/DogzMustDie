var H52D_Framework;
(function (H52D_Framework) {
    /**
     * 副本逻辑类
     * @author zhangyusong
     */
    var CustomsManager = /** @class */ (function () {
        function CustomsManager() {
            this.LEAVE = "离开\n战斗";
            this.CHALLENGE = "挑战\nBOSS";
            /** 累计消灭怪物*/
            this.monsterDieNum = 0;
            this.first = true;
            /** 关卡旁白，只有战斗胜利了开启，在切换战斗模式时不开启 */
            this.canaside = false;
            /** 由奖励界面进入场景 */
            this.rewardIntoScene = false;
            /** 是不是Boss关 */
            this.boss = false;
            /** 强制通关 */
            this.through = false;
            /** 上一个场景 */
            this.prevCustoms = 0;
            this.failNum = 0;
            /** 直通特权次数 */
            this.privilegeNum = 1;
        }
        Object.defineProperty(CustomsManager.prototype, "bBoss", {
            get: function () {
                return this.boss;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CustomsManager, "Instance", {
            get: function () {
                if (CustomsManager._inst == null) {
                    CustomsManager._inst = new CustomsManager();
                }
                return CustomsManager._inst;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CustomsManager.prototype, "CustomsVo", {
            /** 获取当前副本数据 */
            get: function () {
                return this.customsVo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CustomsManager.prototype, "CustomsType", {
            /** 获取当前副本类型 */
            get: function () {
                return this.customsVo ? this.customsVo.customsType : Customs_Type.Customs;
            },
            enumerable: true,
            configurable: true
        });
        /**切换战斗模式 */
        CustomsManager.prototype.CustomsModelChange = function (mode) {
            //循环模式进入
            if (mode == Customs_Mode.Loop) {
                this.rewardIntoScene = true;
                H52D_Framework.RemoteCall.Instance.Send("K_WinDungeons", false);
                H52D_Framework.Event.DispatchEvent("CunstomsModel", [this.CHALLENGE]);
            }
            //循环模式退出
            else if (mode == Customs_Mode.Auto) {
                H52D_Framework.RemoteCall.Instance.Send("K_GotoDungeons");
                H52D_Framework.Event.DispatchEvent("CunstomsModel", [this.LEAVE]);
            }
            this.canaside = false;
            H52D_Framework.BattleManager.Instance.DestroyMonster();
        };
        /** 通关 */
        CustomsManager.prototype.CustomsThrough = function () {
            this.boss = true;
            this.through = true;
            this.CustomsModelChange(Customs_Mode.Auto);
            H52D_Framework.BattleManager.Instance.bdirct();
        };
        CustomsManager.prototype.Initialize = function () {
            var _this = this;
            this.customsMode = H52D_Framework.MasterPlayer.Instance.player.CustomsMode;
            this.prevSceneId = 0;
            this.reward = new H52D_Framework.Reward();
            // 副本数据初始化
            var customsId = H52D_Framework.MasterPlayer.Instance.player.CustomsId;
            var waveOrder = H52D_Framework.MasterPlayer.Instance.player.WaveOrder;
            this.customsVo = new H52D_Framework.CustomsVo(customsId, waveOrder);
            // 事件注册
            this.EventInit();
            this.canaside = false;
            H52D_Framework.ViewUILogic.Instance.AngleTimeInit();
            //加载关卡场景
            H52D_Framework.UIManager.Instance.CreateUI("ChangeSceneView", [H52D_Framework.ViewDownRoot], Laya.Handler.create(this, function () {
                //第一关，第一波，做特殊处理
                if (_this.customsVo.customsOrder == 1 && _this.customsVo.waveOrder == 1) {
                    // this.canaside = true;
                    // this.OpenAside(this.CustomsVo.asideB, () => {
                    //     this.canaside = false;
                    //     Event.DispatchEvent("ShowMainView");
                    //     Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Aide)
                    //     this.SceneUpdate();
                    // });
                    H52D_Framework.Event.DispatchEvent("ShowMainView");
                    H52D_Framework.Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Aide);
                    _this.SceneUpdate();
                }
                else {
                    H52D_Framework.Event.DispatchEvent("ShowMainView");
                    H52D_Framework.Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Aide);
                    //创建场景
                    _this.SceneUpdate();
                }
            }));
        };
        /**
         * 场景创建或更新
         */
        CustomsManager.prototype.SceneUpdate = function () {
            var _this = this;
            this.boss = this.customsVo.waveOrder == this.customsVo.waveNum;
            // 初始化副本怪物
            H52D_Framework.MonsterManager.Instance.DataInit(this.customsVo.monstorPosition[this.customsVo.waveOrder]);
            this.prevCustoms = this.customsVo.customsType;
            // 主线关卡
            if (this.customsVo.customsType == Customs_Type.Customs) {
                if (this.customsVo.sceneID == this.prevSceneId) {
                    //Boss的旁白对话
                    if (this.boss) {
                        var bossId = 0;
                        var position = this.customsVo.monstorPosition[this.customsVo.waveOrder];
                        for (var b in position) {
                            if (position[b] == "5") {
                                bossId = Number(b);
                                break;
                            }
                        }
                        if (H52D_Framework.MonstorConfig[bossId]) {
                            var asideId = H52D_Framework.MonstorConfig[bossId]["aside"];
                            this.OpenAside(asideId, function () { H52D_Framework.SceneManager.Instance.Update(); });
                        }
                        else {
                            H52D_Framework.SceneManager.Instance.Update();
                        }
                    }
                    else { //自动模式第一波，展示旁白
                        if (this.customsMode == Customs_Mode.Auto && this.customsVo.waveOrder == 1) {
                            this.OpenAside(this.customsVo.aside, function () {
                                //通关分享，在旁白之后
                                var prevCustoms = 0;
                                for (var i in H52D_Framework.GameParamConfig["ShareRelationCustoms"]) {
                                    var currCustoms = H52D_Framework.GameParamConfig["ShareRelationCustoms"][i];
                                    if (_this.customsVo.customsOrder - 1 == currCustoms) {
                                        prevCustoms = _this.customsVo.customsOrder - 1;
                                        break;
                                    }
                                }
                                if (prevCustoms > 0) {
                                    H52D_Framework.ShareLogic.Instance.ShareCustoms(prevCustoms);
                                }
                                H52D_Framework.SceneManager.Instance.Update();
                                //百度小贴士
                                if (CustomsManager.Instance.CustomsVo.tie[1] || H52D_Framework.CastingConfig[H52D_Framework.LoginLogic.Instance.profid]["tips_" + CustomsManager.Instance.CustomsVo.customsId]) {
                                    H52D_Framework.Event.DispatchEvent("BaiDuXiaoTieShi");
                                }
                            });
                        }
                        else {
                            H52D_Framework.SceneManager.Instance.Update();
                        }
                    }
                }
                else { //场景ID更换，需要创建场景
                    this.prevSceneId = this.customsVo.sceneID;
                    H52D_Framework.SceneManager.Instance.Create(this.customsVo.sceneID);
                    //小天使继续
                    H52D_Framework.Event.DispatchEvent("AngleContinue");
                }
            }
            else {
                //小天使暂停
                H52D_Framework.Event.DispatchEvent("AngleSuspend");
                // 如果切换回来则必须要切换场景
                this.prevSceneId = 0;
                H52D_Framework.SceneManager.Instance.Create(this.customsVo.sceneID);
            }
            //关于关卡的红点儿，基金
            H52D_Framework.Event.DispatchEvent("ShowControlRedPoint", E_OpenGrade.FUND);
        };
        CustomsManager.prototype.EventInit = function () {
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_WinDungeons', this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_GotoDungeons', this);
            H52D_Framework.Event.RegistEvent("CUSTOMS_RESULT", Laya.Handler.create(this, this.FightResult));
            H52D_Framework.Event.RegistEvent("CUSTOMS_UPDATE", Laya.Handler.create(this, this.FightUpdate));
        };
        /**
         * 跳转波数
         * @param waveOrder
         */
        CustomsManager.prototype.C_GotoDungeons = function (buf) {
            var waveOrder = buf[0];
            this.customsVo.waveOrder = waveOrder;
            H52D_Framework.MasterPlayer.Instance.player.WaveOrder = waveOrder;
            this.customsMode = Customs_Mode.Auto;
            // 创建场景
            if (!this.through) {
                this.SceneUpdate();
            }
        };
        CustomsManager.prototype.FightResult = function (win) {
            switch (this.customsVo.customsType) {
                // 主线副本
                case Customs_Type.Customs:
                    //Boss清除倒计时
                    if (this.customsVo.waveOrder == this.customsVo.waveNum) {
                        H52D_Framework.Event.DispatchEvent("BossThrough", [win]);
                    }
                    if (win) {
                        if (this.boss) {
                            //击杀Boss数量
                            H52D_Framework.MasterPlayer.Instance.ReqOnEvent(EventProEnum.KillBoss, 1);
                            //Boss也是怪物，所以要清掉
                            this.monsterDieNum = 0;
                            H52D_Framework.MasterPlayer.Instance.ReqOnEvent(EventProEnum.WinCustoms, 1);
                            if (this.customsVo.customsOrder >= H52D_Framework.GameParamConfig["ValueOffNumber"]) {
                                H52D_Framework.DataManager.Instance.PackData();
                            }
                        }
                        else {
                            //累计消灭怪物
                            H52D_Framework.MasterPlayer.Instance.ReqOnEvent(EventProEnum.KillMonster, this.monsterDieNum);
                            this.monsterDieNum = 0;
                        }
                        H52D_Framework.Event.DispatchEvent("CustomsClear");
                        this.rewardIntoScene = false;
                        H52D_Framework.RemoteCall.Instance.Send("K_WinDungeons", true);
                        this.failNum = 0;
                    }
                    else {
                        if (this.boss) {
                            H52D_Framework.Event.DispatchEvent("BossCome", [false]);
                            //助理通关，特权有没有使用过
                            if (H52D_Framework.MasterPlayer.Instance.invitadunFlag == 0) {
                                //邀请人数是否够使用特权次数
                                if (H52D_Framework.MasterPlayer.Instance.dayInviteNum >= H52D_Framework.GameParamConfig["HelpPassNeedPlayerNum"]) {
                                    H52D_Framework.ShareLogic.Instance.AssistanceCustems();
                                } //失败>1次
                                else if (++this.failNum > 1) {
                                    H52D_Framework.ShareLogic.Instance.AssistanceInvitation();
                                }
                            }
                            //我要变强 引导特殊处理 bTrigger_1 bTrigger_2
                            var bTrigger_1 = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_11);
                            var bTrigger_2 = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_7_3);
                            if (CustomsManager.Instance.CustomsType == Customs_Type.Customs) {
                                if (!bTrigger_1) {
                                    H52D_Framework.UIManager.Instance.CreateUI("StrongerView", [H52D_Framework.ViewDownRoot], Laya.Handler.create(this, function () {
                                        //引导
                                        H52D_Framework.Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_11);
                                    }));
                                }
                                else if (!bTrigger_2) {
                                    H52D_Framework.Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_7);
                                }
                                else {
                                    H52D_Framework.UIManager.Instance.CreateUI("StrongerView", [H52D_Framework.ViewDownRoot], Laya.Handler.create(this, function () {
                                    }));
                                }
                            }
                            if (this.customsMode == Customs_Mode.Auto) {
                                this.CustomsModelChange(Customs_Mode.Loop);
                            }
                        }
                    }
                    break;
                case Customs_Type.Boss: // 世界boss
                    if (win) {
                        // 几乎不可能 肯定开挂了  
                    }
                    else {
                    }
                    // 获取累计伤害
                    var nDamage = H52D_Framework.BattleManager.Instance.TheWordBossDamage;
                    H52D_Framework.Event.DispatchEvent("WroldBoss_hurt", [nDamage]);
                    // 上传伤害
                    H52D_Framework.RemoteCall.Instance.Send('K_ReqSendChallengeHarm', nDamage);
                    this.LeaveCustomsManager();
                    break;
                case Customs_Type.MatchElection: //PK海选阶段                   
                    // 上传伤害
                    H52D_Framework.MatchLogic.Instance.SendHurt();
                    //上傳PK陣容
                    H52D_Framework.DataManager.Instance.PackData_m();
                    //上传阵容dps伤害和血量
                    H52D_Framework.DataManager.Instance.SendCapacityData();
                    //开启点击
                    H52D_Framework.Event.DispatchEvent("StopClick", [true]);
                    H52D_Framework.Event.DispatchEvent("SkillMouseEnable");
                    this.LeaveCustomsManager();
                    break;
                default:
                    break;
            }
        };
        /**
         * 胜利结算
         * @param buf 数组
         *  [0]是否是循环模式
         *  [1]准备切换的副本ID
         *  [2]切换到该副本中的第几波
         *  [3]奖励列表
         **/
        CustomsManager.prototype.C_WinDungeons = function (buf) {
            var win = buf[0];
            var customsId = buf[1];
            var waveOrder = buf[2];
            var award = buf[3];
            var oldCudtomsId = H52D_Framework.MasterPlayer.Instance.player.CustomsId;
            // 更新本地关卡
            H52D_Framework.MasterPlayer.Instance.player.CustomsId = customsId;
            H52D_Framework.MasterPlayer.Instance.player.WaveOrder = waveOrder;
            this.customsVo.customsId = customsId;
            this.customsVo.waveOrder = waveOrder;
            H52D_Framework.CampManager.Instance.Add_camp();
            if (win) { //赢了有奖励
                this.reward.RewardSorting(award);
                this.canaside = true;
                if (this.customsVo.customsOrder == H52D_Framework.OpenGradeConfig[E_OpenGrade.ANGLE].Checkpoint && waveOrder == 1) {
                    H52D_Framework.ViewUILogic.Instance.AngleStart();
                }
                if ((oldCudtomsId != customsId) && H52D_Framework.CustomspassConfig[oldCudtomsId]) {
                    H52D_Framework.PfLog.Inst.SendClientLog(5000 + H52D_Framework.CustomspassConfig[oldCudtomsId].customsOrder, 0);
                }
            }
            else {
                this.customsMode = Customs_Mode.Loop;
                this.canaside = false;
            }
            if (this.rewardIntoScene || this.through) {
                this.SceneUpdate();
                this.through = false;
            }
        };
        /** 战斗刷新，更新场景 */
        CustomsManager.prototype.FightUpdate = function () {
            if (this.customsVo) {
                this.SceneUpdate();
            }
        };
        /** 进入副本 */
        CustomsManager.prototype.EnterCustoms = function (nCustomsID, nWaveOrder) {
            var cfg = H52D_Framework.CustomspassConfig[nCustomsID];
            if (cfg == null) {
                return;
            }
            if (cfg.dunType == 1) {
                return;
            }
            this.customsVo.customsId = nCustomsID;
            this.customsVo.waveOrder = nWaveOrder || 1;
            this.SceneUpdate();
        };
        /** 离开副本 回到当前主线关卡 */
        CustomsManager.prototype.LeaveCustomsManager = function () {
            var cfg = H52D_Framework.CustomspassConfig[this.customsVo.customsId];
            if (cfg.dunType == 1) {
                return;
            }
            this.customsVo.customsId = H52D_Framework.MasterPlayer.Instance.player.CustomsId;
            this.customsVo.waveOrder = H52D_Framework.MasterPlayer.Instance.player.WaveOrder;
            this.SceneUpdate();
        };
        CustomsManager.prototype.OpenAside = function (id, callBack) {
            var _this = this;
            if (!this.canaside || id == 0) {
                if (callBack) {
                    callBack.call(this);
                }
            }
            else {
                H52D_Framework.Event.DispatchEvent("LoseFocus");
                //暂停战斗
                H52D_Framework.BattleManager.Instance.StopBattle();
                //暂停宝箱
                H52D_Framework.DropManager.Instance.openBox = false;
                if (H52D_Framework.UIManager.Instance.IsHave("AsideView", H52D_Framework.ViewStoryRoot)) {
                    H52D_Framework.UIManager.Instance.DestroyUI("AsideView", [H52D_Framework.ViewStoryRoot]);
                }
                H52D_Framework.UIManager.Instance.CreateUI("AsideView", [H52D_Framework.ViewStoryRoot, id, Laya.Handler.create(this, function () {
                        //开始战斗
                        H52D_Framework.BattleManager.Instance.OpenBattle();
                        H52D_Framework.DropManager.Instance.openBox = true;
                        if (callBack) {
                            callBack.call(_this);
                        }
                    })]);
            }
        };
        return CustomsManager;
    }());
    H52D_Framework.CustomsManager = CustomsManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=CustomsManager.js.map