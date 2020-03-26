var H52D_Framework;
(function (H52D_Framework) {
    var MemoryType;
    (function (MemoryType) {
        MemoryType[MemoryType["equip"] = 1] = "equip";
    })(MemoryType = H52D_Framework.MemoryType || (H52D_Framework.MemoryType = {}));
    /**
     * @class：时段记忆管理类
     * @author：zhangyusong
     */
    var MemoryLogic = /** @class */ (function () {
        function MemoryLogic() {
            this.challengeData = null;
            this.fireData = null;
            /** 记录当前到达哪关 */
            this.tCurDungeonIdx = {};
            /** 副本的星星 */
            this.tDungeonStar = {};
            /** 通关次数 */
            this.tDungeonClearedTimes = {};
            /** 已购买挑战次数 */
            this.tBuyDungeonTimes = {};
            /** 附加次數(不清除的) */
            this.tAdditionDungeonTimes = {};
            /** 体力 */
            this.nPower = 0;
            /** 剩余时间 */
            this.nSurplusTime = 0;
            /** 体力刷新时间戳 */
            this.nRecoverTime = 0;
            /** 购买体力次数 */
            this.nBuyPowerTimes = 0;
            /** 记录上一场战斗之前的星星 */
            this.tLastDungeonStar = {};
            /**FB通用的布阵信息 */
            this._memorywar = {};
            this._HeroWar = {};
            this._PositionWar = {};
            this._bChange = false;
            /**FB通用神兽信息 */
            this._cutPetID = {};
        }
        Object.defineProperty(MemoryLogic, "Instance", {
            get: function () {
                if (this.instance == null) {
                    this.instance = new MemoryLogic();
                }
                return this.instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MemoryLogic.prototype, "Power", {
            /** 体力 */
            get: function () {
                return this.nPower;
            },
            /** 体力 */
            set: function (nPower) {
                this.nPower = nPower;
                H52D_Framework.Event.DispatchEvent("PowerFrush");
            },
            enumerable: true,
            configurable: true
        });
        /** 体力恢复 */
        MemoryLogic.prototype.PowerUpdate = function () {
            if (this.Power >= H52D_Framework.GameParamConfig["PowerMax"]) {
                this.RecoverTime = H52D_Framework.Time.serverSecodes;
                return;
            }
            var hasTimes = H52D_Framework.Time.serverSecodes - this.RecoverTime;
            var powerSpeed = Number(H52D_Framework.GameParamConfig["PowerSpeed"]);
            if (hasTimes >= powerSpeed) {
                var nTimes = Math.floor(hasTimes / powerSpeed);
                this.RecoverTime = H52D_Framework.Time.serverSecodes;
                // 恢复体力1点
                this.Power += nTimes;
                if (this.Power > H52D_Framework.GameParamConfig.PowerMax) {
                    this.Power = H52D_Framework.GameParamConfig.PowerMax;
                }
            }
            this.surplusTime = powerSpeed - (hasTimes % powerSpeed);
        };
        Object.defineProperty(MemoryLogic.prototype, "bChange", {
            get: function () {
                return this._bChange;
            },
            set: function (value) {
                this._bChange = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MemoryLogic.prototype, "RecoverTime", {
            /** 刷新time */
            get: function () {
                if (this.nRecoverTime == 0) {
                    this.nRecoverTime = H52D_Framework.Time.serverSecodes;
                }
                return this.nRecoverTime;
            },
            /** 刷新time */
            set: function (nRecoverTime) {
                this.nRecoverTime = nRecoverTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MemoryLogic.prototype, "BuyPowerTimes", {
            /** 购买体力次数 */
            get: function () {
                return this.nBuyPowerTimes;
            },
            /** 购买体力次数 */
            set: function (nBuyPowerTimes) {
                this.nBuyPowerTimes = nBuyPowerTimes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MemoryLogic.prototype, "war", {
            get: function () {
                return this._memorywar;
            },
            set: function (value) {
                this._memorywar = value;
            },
            enumerable: true,
            configurable: true
        });
        /**获取神兽ID */
        MemoryLogic.prototype.GetPetID = function (type) {
            return this._cutPetID[type] || 0;
        };
        Object.defineProperty(MemoryLogic.prototype, "surplusTime", {
            get: function () {
                return this.nSurplusTime;
            },
            /** 剩余时间 */
            set: function (value) {
                this.nSurplusTime = value;
            },
            enumerable: true,
            configurable: true
        });
        /** 是否拥有下一关 */
        MemoryLogic.prototype.hasNextCustoms = function () {
            //当前关卡ID
            var currentId = MemoryLogic.Instance.GetCurDungeonIdx(MemoryType.equip);
            //解锁最后关卡ID
            var lastId = 0;
            var dataList = H52D_Framework.CopyConfig[MemoryType.equip];
            for (var i in dataList) {
                var vo = H52D_Framework.CustomsManager.Instance.CustomsVo;
                if (vo != null &&
                    dataList[i].CustomsNum <= H52D_Framework.CustomsManager.Instance.CustomsVo.customsOrder &&
                    lastId < dataList[i].CopyId) {
                    lastId = dataList[i].CopyId;
                }
            }
            //当前关之后还有解锁关卡
            return currentId < lastId;
        };
        /** 初始化 */
        MemoryLogic.prototype.Initialize = function () {
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_SendMaterialsDungeonInfo", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqPassDungeon", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqBuyDungeonTimes", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_SaveCopyBattleArray", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_RepGetBattleArray", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqCopyUsePet", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqGetCopyUsePet", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqBuyPower", this);
        };
        /** 每日更新 */
        MemoryLogic.prototype.OnDay = function () {
            this.tDungeonClearedTimes = {};
            this.tBuyDungeonTimes = {};
            H52D_Framework.Event.DispatchEvent("ChallengeFrush");
        };
        MemoryLogic.prototype.OpenChallenge = function () {
            if (this.challengeData) {
                H52D_Framework.UIManager.Instance.CreateUI("MemoryChallengeView", [H52D_Framework.ViewDownRoot]);
            }
        };
        /** 购买体力回调 */
        MemoryLogic.prototype.C_ReqBuyPower = function (value) {
            this.BuyPowerTimes = value[0];
            this.Power = value[1];
            H52D_Framework.Event.DispatchEvent("MemoryFrush");
            H52D_Framework.Event.DispatchEvent("ReqBuyPower");
        };
        /**保存阵容 回掉 */
        MemoryLogic.prototype.C_SaveCopyBattleArray = function (buf) {
            var data = buf[0];
            H52D_Framework.TipsLogic.Instance.OpenSystemTips("保存成功！");
        };
        /** 上线同步 */
        MemoryLogic.prototype.C_SendMaterialsDungeonInfo = function (buf) {
            this.tCurDungeonIdx = buf[0];
            this.tDungeonStar = buf[1];
            this.tDungeonClearedTimes = buf[2];
            this.tBuyDungeonTimes = buf[3];
            this.tAdditionDungeonTimes = buf[4];
        };
        /** 战斗 */
        MemoryLogic.prototype.Fighting = function () {
            if (H52D_Framework.UIManager.Instance.IsHave("StrongerView", H52D_Framework.ViewDownRoot)) {
                H52D_Framework.UIManager.Instance.DestroyUI("StrongerView", [H52D_Framework.ViewDownRoot]);
            }
            H52D_Framework.UIManager.Instance.DestroyUI("MemoryView", [H52D_Framework.ViewDownRoot]);
            H52D_Framework.UIManager.Instance.DestroyUI("MemoryChallengeView", [H52D_Framework.ViewDownRoot]);
            H52D_Framework.BattleManager.Instance.copyid = this.challengeData.CopyId;
            H52D_Framework.CustomsManager.Instance.EnterCustoms(this.challengeData.CustomsId);
            H52D_Framework.DropManager.Instance.Destroy();
            H52D_Framework.Event.DispatchEvent("ShowDeputy");
        };
        /** 通过副本回调 */
        MemoryLogic.prototype.C_ReqPassDungeon = function (buf) {
            var nType = buf[0];
            var nCopyId = buf[1];
            var nWin = buf[2];
            var tStar = buf[3];
            var tAllAward = buf[4];
            // 胜利
            if (nWin == 1) {
                // 更新体力
                this.Power -= this.challengeData.NeedPower;
                //先扣除附加次数，
                if (this.GetAdditionDungeonTimes(nType, nCopyId) > 0) {
                    // 附加次数-1
                    if (this.tAdditionDungeonTimes[nType] == null) {
                        this.tAdditionDungeonTimes[nType] = {};
                    }
                    this.tAdditionDungeonTimes[nType][nCopyId] = this.GetAdditionDungeonTimes(nType, nCopyId) - 1;
                }
                else {
                    // 更新通关次数
                    if (this.tDungeonClearedTimes[nType] == null) {
                        this.tDungeonClearedTimes[nType] = {};
                    }
                    if (this.tDungeonClearedTimes[nType][nCopyId] == null) {
                        this.tDungeonClearedTimes[nType][nCopyId] = 1;
                    }
                    else {
                        this.tDungeonClearedTimes[nType][nCopyId] += 1;
                    }
                }
                if (H52D_Framework.CustomsManager.Instance.CustomsVo.customsType == Customs_Type.Customs) {
                    H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(tAllAward);
                    H52D_Framework.Event.DispatchEvent("ChallengeFrush");
                }
                else if (H52D_Framework.CustomsManager.Instance.CustomsVo.customsType == Customs_Type.Memory) {
                    // 更新当前关卡
                    if (this.tCurDungeonIdx[nType] == null) {
                        this.tCurDungeonIdx[nType] = nCopyId;
                    }
                    else {
                        if (nCopyId > this.tCurDungeonIdx[nType]) {
                            this.tCurDungeonIdx[nType] = nCopyId;
                        }
                    }
                    this.tLastDungeonStar = {};
                    // 更新当前星星
                    if (this.tDungeonStar[nType] == null) {
                        this.tDungeonStar[nType] = {};
                    }
                    if (this.tDungeonStar[nType][nCopyId] == null) {
                        this.tDungeonStar[nType][nCopyId] = tStar;
                    }
                    else {
                        for (var idx in tStar) {
                            var nOldStar = 0;
                            if (!!this.tDungeonStar[nType][nCopyId][idx]) {
                                nOldStar = this.tDungeonStar[nType][nCopyId][idx];
                            }
                            this.tLastDungeonStar[idx] = nOldStar;
                            this.tDungeonStar[nType][nCopyId][idx] = tStar[idx];
                        }
                    }
                    H52D_Framework.UIManager.Instance.CreateUI("MemoryResultView", [H52D_Framework.ViewUpRoot, nType, nCopyId, nWin, tAllAward]);
                }
            }
            else {
                H52D_Framework.UIManager.Instance.CreateUI("MemoryResultView", [H52D_Framework.ViewUpRoot, nType, nCopyId, nWin, tAllAward]);
            }
        };
        /** 购买挑战次数回调 */
        MemoryLogic.prototype.C_ReqBuyDungeonTimes = function (buf) {
            var nType = buf[0];
            var nCopyId = buf[1];
            var nTimes = buf[2];
            if (this.tBuyDungeonTimes[nType] == null) {
                this.tBuyDungeonTimes[nType] = {};
            }
            if (this.tAdditionDungeonTimes[nType] == null) {
                this.tAdditionDungeonTimes[nType] = {};
            }
            this.tBuyDungeonTimes[nType][nCopyId] = this.GetBuyDungeonTimes(nType, nCopyId) + nTimes;
            this.tAdditionDungeonTimes[nType][nCopyId] = this.GetAdditionDungeonTimes(nType, nCopyId) + nTimes;
            H52D_Framework.Event.DispatchEvent("ChallengeFrush");
        };
        /**回掉 获取布阵的类型信息 */
        MemoryLogic.prototype.C_RepGetBattleArray = function (buf) {
            var ntype = buf[0];
            this._memorywar = buf[1];
            if (buf[1] == null) {
                this._memorywar = {};
            }
        };
        /**请求副本上阵神兽 */
        MemoryLogic.prototype.C_ReqCopyUsePet = function (buf) {
            var ntype = buf[0];
            this._cutPetID[ntype] = buf[1];
            H52D_Framework.Event.DispatchEvent("UpdatePetView");
        };
        /**请求获取副本上阵神兽 */
        MemoryLogic.prototype.C_ReqGetCopyUsePet = function (buf) {
            var ntype = buf[0];
            this._cutPetID[ntype] = buf[1];
        };
        /** 请求通关副本 */
        MemoryLogic.prototype.ReqPassDungeon = function (nType, nCopyId, nWin, tStar) {
            H52D_Framework.RemoteCall.Instance.Send('K_ReqPassDungeon', nType, nCopyId, nWin, tStar);
        };
        /** 请求购买挑战次数 */
        MemoryLogic.prototype.K_ReqBuyDungeonTimes = function (nType, nCopyId, nBuyTimes) {
            H52D_Framework.RemoteCall.Instance.Send('K_ReqBuyDungeonTimes', nType, nCopyId, nBuyTimes);
        };
        /**请求保存阵容  FB */
        MemoryLogic.prototype.K_SaveCopyBattleArray = function (Type, savewar) {
            H52D_Framework.RemoteCall.Instance.Send("K_SaveCopyBattleArray", Type, savewar);
        };
        /**请求FB 布阵信息 */
        MemoryLogic.prototype.K_RepGetBattleArray = function (Type) {
            H52D_Framework.RemoteCall.Instance.Send("K_RepGetBattleArray", Type);
        };
        /**请求FB 上阵副本神兽 */
        MemoryLogic.prototype.K_ReqCopyUsePet = function (Type, nPetID) {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqCopyUsePet", Type, nPetID);
        };
        /**请求FB 获取上阵副本神兽 */
        MemoryLogic.prototype.K_ReqGetCopyUsePet = function (Type) {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqGetCopyUsePet", Type);
        };
        /** 打开时段记忆UI */
        MemoryLogic.prototype.ActivityInfo = function () {
            this.K_RepGetBattleArray(H52D_Framework.ActionType.memory);
            this.K_ReqGetCopyUsePet(H52D_Framework.ActionType.memory);
            H52D_Framework.UIManager.Instance.CreateUI("MemoryView", [H52D_Framework.ViewDownRoot]);
        };
        /** 进入挑战战场 */
        MemoryLogic.prototype.EnterChallenge = function () {
            if (H52D_Framework.GetTabLength(this.war) == 0) {
                //请先进行英雄布阵
                H52D_Framework.TipsLogic.Instance.OpenMessageBox(30063, Laya.Handler.create(this, function () {
                    H52D_Framework.Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_14);
                }));
            }
            else {
                if (this.ChallengeCondition()) {
                    H52D_Framework.UIManager.Instance.DestroyUI("MemoryChallengeView", [H52D_Framework.ViewDownRoot]);
                    this.Fighting();
                }
            }
        };
        /** 挑战条件判断 */
        MemoryLogic.prototype.ChallengeCondition = function () {
            //判断体力值是否足够
            if (this.Power >= this.challengeData.NeedPower) {
                //判断当前关卡剩余挑战次数是否足够
                if (this.challengeNum > 0) {
                    return true;
                }
                else {
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips(30065);
                    var my_num = H52D_Framework.GameParamConfig.CopyBuyMaxNum - MemoryLogic.Instance.GetBuyDungeonTimes(MemoryType.equip, this.challengeData.CopyId);
                    if (my_num > 0) {
                        H52D_Framework.UIManager.Instance.CreateUI("BuyMemoryTimesView", [H52D_Framework.ViewDownRoot]);
                    }
                }
            }
            else {
                //判断是否有剩余购买次数
                if (this.BuyPowerTimes > 0) {
                    H52D_Framework.UIManager.Instance.CreateUI("BuyMemoryPowerView", [H52D_Framework.ViewDownRoot]);
                }
                else {
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips(30064);
                }
            }
            return false;
        };
        /** 获取当前打到哪关 */
        MemoryLogic.prototype.GetCurDungeonIdx = function (nType) {
            if (!this.tCurDungeonIdx || !this.tCurDungeonIdx[nType]) {
                return 0;
            }
            return this.tCurDungeonIdx[nType];
        };
        /** 获取副本星星 */
        MemoryLogic.prototype.GetDungeonStar = function (nType, nCopyId) {
            var _a;
            var tStar = (_a = {}, _a[1] = 0, _a[2] = 0, _a[3] = 0, _a);
            if (this.tDungeonStar[nType] != null && this.tDungeonStar[nType][nCopyId] != null) {
                var dungeonStar = this.tDungeonStar[nType][nCopyId];
                for (var i = 1; i <= 3; i++) {
                    if (dungeonStar[i]) {
                        tStar[i] = dungeonStar[i];
                    }
                }
            }
            return tStar;
        };
        /** 获取上一场战斗之前的星星 */
        MemoryLogic.prototype.GetLastDungeonStar = function () {
            var tStar = {};
            for (var i = 1; i <= 3; i++) {
                if (!this.tLastDungeonStar[i]) {
                    tStar[i] = 0;
                }
                else {
                    tStar[i] = this.tLastDungeonStar[i];
                }
            }
            return tStar;
        };
        Object.defineProperty(MemoryLogic.prototype, "challengeNum", {
            get: function () {
                var cnum = this.challengeData.DailyFreeNum +
                    this.GetAdditionDungeonTimes(MemoryType.equip, this.challengeData.CopyId) -
                    this.GetDungeonClearedTimes(MemoryType.equip, this.challengeData.CopyId);
                if (cnum < 0) {
                    cnum = 0;
                }
                return cnum;
            },
            enumerable: true,
            configurable: true
        });
        /** 获取今天通关次数 */
        MemoryLogic.prototype.GetDungeonClearedTimes = function (nType, nCopyId) {
            if (this.tDungeonClearedTimes == null) {
                return 0;
            }
            if (this.tDungeonClearedTimes[nType] == null) {
                return 0;
            }
            if (this.tDungeonClearedTimes[nType][nCopyId] == null) {
                return 0;
            }
            return this.tDungeonClearedTimes[nType][nCopyId];
        };
        /** 获取今天购买挑战次数 */
        MemoryLogic.prototype.GetBuyDungeonTimes = function (nType, nCopyId) {
            if (!this.tBuyDungeonTimes || this.tBuyDungeonTimes[nType] == null || this.tBuyDungeonTimes[nType][nCopyId] == null) {
                return 0;
            }
            return this.tBuyDungeonTimes[nType][nCopyId];
        };
        /** 获取附加挑战次数 */
        MemoryLogic.prototype.GetAdditionDungeonTimes = function (nType, nCopyId) {
            if (!this.tAdditionDungeonTimes[nType]) {
                return 0;
            }
            return this.tAdditionDungeonTimes[nType][nCopyId] || 0;
        };
        Object.defineProperty(MemoryLogic.prototype, "HeroWar", {
            /** 当前布阵英雄位置信息 */
            get: function () {
                return this._HeroWar;
            },
            enumerable: true,
            configurable: true
        });
        /** 放置英雄 */
        MemoryLogic.prototype.PutHero = function (nPos, nHeroID) {
            // 目标位置当前英雄ID
            var nLastHeroID = this._memorywar[nPos];
            // 目标英雄上一个位置
            var nLastPos = this._HeroWar[nHeroID];
            if (nLastHeroID != null) {
                this._HeroWar[nLastHeroID] = nLastPos;
                this._bChange = true;
            }
            if (nLastPos != null) {
                this._memorywar[nLastPos] = nLastHeroID;
                this._bChange = true;
            }
            this._memorywar[nPos] = nHeroID;
            this._HeroWar[nHeroID] = nPos;
        };
        /** 判断是否在阵容上 */
        MemoryLogic.prototype.IsInWar = function (nHeroID) {
            return this._HeroWar[nHeroID] != null;
        };
        MemoryLogic.prototype.getwar = function () {
            for (var key in this._memorywar) {
                var nId = this._memorywar[key];
                if (!nId) {
                    delete this._memorywar[key];
                }
            }
            return this._memorywar;
        };
        /**判断是否在保存的阵容上 */
        MemoryLogic.prototype.IsInSaveWar = function (pos, nHeroID) {
            var war = H52D_Framework.MasterPlayer.Instance.player.HeroWarList;
            for (var nIdx in war) {
                if (war[nIdx] == nHeroID) {
                    return true;
                }
            }
            return false;
        };
        /** 初始化阵容信息 */
        MemoryLogic.prototype.InitPosInfo = function () {
            this._PositionWar = {};
            this._HeroWar = {};
            var HeroWarList = this._memorywar;
            for (var pos in HeroWarList) {
                var nHeroID = HeroWarList[pos];
                this.PutHero(pos, nHeroID);
            }
            this._bChange = false;
        };
        return MemoryLogic;
    }());
    H52D_Framework.MemoryLogic = MemoryLogic;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MemoryLogic.js.map