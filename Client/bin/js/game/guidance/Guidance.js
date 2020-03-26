/*
* 新手引导
*/
var H52D_Framework;
(function (H52D_Framework) {
    var Guidance = /** @class */ (function () {
        function Guidance() {
            //引导按钮列表
            this._guidanceButtonList = {};
            //剧情数据
            this._storyData = {};
            /**需要引导后再次检测的引导步骤 */
            this._triggerArr = [
                E_GuidanceStep.E_Guidance_3,
                E_GuidanceStep.E_Guidance_4,
                E_GuidanceStep.E_Guidance_5,
                E_GuidanceStep.E_Guidance_6,
                E_GuidanceStep.E_Guidance_8,
                E_GuidanceStep.E_Guidance_9,
                E_GuidanceStep.E_Guidance_10,
                E_GuidanceStep.E_Guidance_12
            ];
            this._bProceeding = false;
            this._guidanceStep = E_GuidanceStep.E_Guidance_1;
            //获取剧情数据
            for (var id in H52D_Framework.StoryConfig) {
                this._storyData[Number(id)] = H52D_Framework.StoryConfig[id];
            }
        }
        Object.defineProperty(Guidance, "Instance", {
            get: function () {
                if (Guidance._inst == null)
                    Guidance._inst = new Guidance();
                return Guidance._inst;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Guidance.prototype, "guidanceStep", {
            get: function () {
                return this._guidanceStep;
            },
            enumerable: true,
            configurable: true
        });
        Guidance.prototype.SetGuidanceStep = function (type) {
            this._guidanceStep = type;
        };
        Guidance.prototype.GetGuidanceButton = function (type) {
            return this._guidanceButtonList[type];
        };
        Guidance.prototype.SetGuidanceButton = function (type, button) {
            this._guidanceButtonList[type] = button;
        };
        Object.defineProperty(Guidance.prototype, "storyData", {
            get: function () {
                return this._storyData;
            },
            enumerable: true,
            configurable: true
        });
        /***********************************************************/
        /** 初始化*/
        Guidance.prototype.Initialize = function () {
            //剧情
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_NewPlayerInit', this);
        };
        /**新人登入播放剧情 */
        Guidance.prototype.C_NewPlayerInit = function () {
            H52D_Framework.UIManager.Instance.CreateUI("GuidanceView", [H52D_Framework.NewGuidRoot], Laya.Handler.create(this, function () {
                H52D_Framework.Event.DispatchEvent("ShowStory");
                H52D_Framework.Event.DispatchEvent("PanelClose");
            }));
        };
        /**播放剧情 */
        Guidance.prototype.PlayStory = function (customsOrder) {
            if (this._storyData[customsOrder] == null)
                return;
            H52D_Framework.BattleManager.Instance.StopBattle();
            H52D_Framework.CacheManager.Instance.setDerailByType(CacheTypeEnum.story, customsOrder, true);
            H52D_Framework.UIManager.Instance.CreateUI("StoryView", [H52D_Framework.ViewStoryRoot, this._storyData[customsOrder]]);
        };
        /***********************************************************/
        /**开始引导 */
        Guidance.prototype.StartGuidance = function (guidanceStep) {
            var _this = this;
            if (guidanceStep === void 0) { guidanceStep = E_GuidanceStep.E_Empty; }
            H52D_Framework.PfLog.Inst.SendClientLog(2000 + guidanceStep, 0);
            this._bProceeding = true;
            this.SetGuidanceStep(guidanceStep);
            if (H52D_Framework.UIManager.Instance.IsHave("GuidanceView", H52D_Framework.NewGuidRoot)) {
                H52D_Framework.UIManager.Instance.DestroyUI("GuidanceView", [H52D_Framework.NewGuidRoot]);
            }
            H52D_Framework.UIManager.Instance.CreateUI("GuidanceView", [H52D_Framework.NewGuidRoot], Laya.Handler.create(this, function () {
                H52D_Framework.Event.DispatchEvent("PanelClose");
                if (guidanceStep == E_GuidanceStep.E_Empty) {
                    H52D_Framework.Event.DispatchEvent("StartGuidance", [_this._guidanceStep]);
                }
                else {
                    H52D_Framework.Event.DispatchEvent("StartGuidance", [guidanceStep]);
                }
            }));
        };
        /**触发新手引导 */
        Guidance.prototype.TriggerGuidance = function (guidanceStep) {
            //屏蔽引导
            // let b = true;
            // if (b) {
            //     return true;
            // }
            //引导中 、 打开天梯页面中 、 在布阵当中
            if (this._bProceeding
                || H52D_Framework.LadderManager.Instance._isOpenLadder
                || H52D_Framework.HeroPosition.Instance._bHeroWar) {
                return;
            }
            var bTrigger;
            var customsOrder = H52D_Framework.MasterPlayer.Instance.player.CunstLevel;
            var goldNum = H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdGold);
            var needGoldNum = 0;
            //关闭挑战失败
            if (guidanceStep != E_GuidanceStep.E_Guidance_11) {
                if (H52D_Framework.UIManager.Instance.IsHave("StrongerView", H52D_Framework.ViewDownRoot)) {
                    H52D_Framework.UIManager.Instance.DestroyUI("StrongerView", [H52D_Framework.ViewDownRoot]);
                }
            }
            switch (guidanceStep) {
                case E_GuidanceStep.E_Guidance_2:
                    bTrigger = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_2);
                    needGoldNum = H52D_Framework.HeroManager.Instance.GetheroUpMoney(0);
                    //钱够不够
                    if (!needGoldNum || needGoldNum > goldNum) {
                        return;
                    }
                    if (!bTrigger) {
                        H52D_Framework.CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_2, true);
                        this.StartGuidance(E_GuidanceStep.E_Guidance_2);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_3:
                    bTrigger = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_3);
                    if (H52D_Framework.HeroManager.Instance.ActiveHeroNum >= 1 && !bTrigger) {
                        bTrigger = true;
                        H52D_Framework.CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_3, true);
                        this.StartGuidance(E_GuidanceStep.E_Guidance_3);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_4:
                    bTrigger = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_4);
                    if (H52D_Framework.HeroManager.Instance.GetHeroNum() >= 2 && !bTrigger) {
                        H52D_Framework.CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_4, true);
                        this.StartGuidance(E_GuidanceStep.E_Guidance_4);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_5:
                    bTrigger = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_5);
                    if (H52D_Framework.HeroManager.Instance.StarHeroNum >= 1 && !bTrigger) {
                        H52D_Framework.CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_5, true);
                        this.StartGuidance(E_GuidanceStep.E_Guidance_5);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_6:
                    bTrigger = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_6);
                    var killLv = Number(H52D_Framework.RoleSkillUpConfig[1][1].needRoleLevel);
                    needGoldNum = H52D_Framework.RoleSkillUpConfig[1][1].needGoldNum;
                    if (H52D_Framework.MasterPlayer.Instance.player.Level >= killLv && !bTrigger && goldNum >= needGoldNum) {
                        H52D_Framework.CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_6, true);
                        this.StartGuidance(E_GuidanceStep.E_Guidance_6);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_7:
                    if (H52D_Framework.UIManager.Instance.IsHave("InvitationCustomsView", H52D_Framework.ViewToppestRoot)) {
                        H52D_Framework.UIManager.Instance.DestroyUI("InvitationCustomsView", [H52D_Framework.ViewToppestRoot]);
                    }
                    var bTrigger_1 = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_7_1);
                    var bTrigger_2 = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_7_2);
                    var bTrigger_3 = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_7_3);
                    if (!bTrigger_1 || !bTrigger_2 || !bTrigger_3) {
                        if (!bTrigger_1) {
                            H52D_Framework.CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_7_1, true);
                        }
                        else if (!bTrigger_2) {
                            H52D_Framework.CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_7_2, true);
                        }
                        else if (!bTrigger_3) {
                            H52D_Framework.CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_7_3, true);
                        }
                        this.StartGuidance(E_GuidanceStep.E_Guidance_7);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_8:
                    bTrigger = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_8);
                    if (H52D_Framework.HeroManager.Instance.GetHeroNum() >= 10 && !bTrigger) {
                        H52D_Framework.CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_8, true);
                        this.StartGuidance(E_GuidanceStep.E_Guidance_8);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_9:
                    bTrigger = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_9);
                    var bOrder_9 = H52D_Framework.OpenCondition(E_OpenGrade.PET, false);
                    var petnum = H52D_Framework.PetManager.Instance.OwnPetNum;
                    if (bOrder_9 && !bTrigger && petnum >= 1) {
                        H52D_Framework.CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_9, true);
                        this.StartGuidance(E_GuidanceStep.E_Guidance_9);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_10:
                    bTrigger = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_10);
                    if (customsOrder >= 5 && !bTrigger) {
                        H52D_Framework.CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_10, true);
                        this.StartGuidance(E_GuidanceStep.E_Guidance_10);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_11:
                    bTrigger = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_11);
                    if (!bTrigger) {
                        H52D_Framework.CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_11, true);
                        this.StartGuidance(E_GuidanceStep.E_Guidance_11);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_12:
                    bTrigger = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_12);
                    var bOrder_12 = H52D_Framework.OpenCondition(E_OpenGrade.LADDER, false);
                    if (!bTrigger && bOrder_12) {
                        H52D_Framework.CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_12, true);
                        this.StartGuidance(E_GuidanceStep.E_Guidance_12);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_13:
                    bTrigger = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_13);
                    needGoldNum = H52D_Framework.HeroManager.Instance.GetheroUpMoney(1);
                    //钱够不够
                    if (!needGoldNum || needGoldNum > goldNum) {
                        return;
                    }
                    if (!bTrigger && customsOrder >= 8) {
                        H52D_Framework.CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_13, true);
                        this.StartGuidance(E_GuidanceStep.E_Guidance_13);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_14:
                    bTrigger = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_14);
                    if (!bTrigger) {
                        H52D_Framework.CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_14, true);
                        this.StartGuidance(E_GuidanceStep.E_Guidance_14);
                    }
                    break;
                case E_GuidanceStep.E_Aide:
                    if (H52D_Framework.MasterPlayer.Instance.bNewbie) {
                        Guidance.Instance.StartGuidance(E_GuidanceStep.E_Aide);
                    }
                    break;
            }
        };
        /**保存布阵 */
        Guidance.prototype.Trigger_SaveWar = function () {
            var bTrigger_1 = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_war_1);
            var bTrigger_2 = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_war_2);
            if (!bTrigger_1 && Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_4) {
                H52D_Framework.CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_war_1, true);
                H52D_Framework.UIManager.Instance.CreateUI("GuidanceView", [H52D_Framework.NewGuidRoot], Laya.Handler.create(this, function () { H52D_Framework.Event.DispatchEvent("EventSaveWar"); }));
            }
            if (!bTrigger_2 && Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_8) {
                H52D_Framework.CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_war_2, true);
                H52D_Framework.UIManager.Instance.CreateUI("GuidanceView", [H52D_Framework.NewGuidRoot], Laya.Handler.create(this, function () { H52D_Framework.Event.DispatchEvent("EventSaveWar"); }));
            }
        };
        /**引导后检测是否有引导满足 */
        Guidance.prototype.TriggerAll = function () {
            for (var i in this._triggerArr) {
                this.TriggerGuidance(this._triggerArr[i]);
            }
        };
        return Guidance;
    }());
    H52D_Framework.Guidance = Guidance;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Guidance.js.map