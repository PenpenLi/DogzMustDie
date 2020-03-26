/*
* 战斗管理类;
*/
var H52D_Framework;
(function (H52D_Framework) {
    var BattleManager = /** @class */ (function () {
        /**初始化 */
        function BattleManager() {
            this._dieIndex = 0;
            this._monsterFormation = null;
            this._isBorth = false;
            // 点击次数
            this.clickNum = 0;
            // 英雄攻击次数
            this.heroAttackNum = 0;
            // 宠物攻击次数
            this.petAttackNum = 0;
            // 点击暴击次数
            this.clickCritNum = 0;
            this.bStopBattle = false;
            this._isOnce = false;
            /**给服务器传的点击数 */
            this._IndexNumber = 0;
            /**当前点击数 */
            this._TapIndex = 0;
            /**记录点击的时间 */
            this._tapTime = 0;
            /**记录上一次点击时间 */
            this._lasttapTime = 0;
            /**开启DPS刷新 */
            this._isOpen = false;
            this.TriggerBubblNum = 0;
            this.tirgegrBubblJudge = false;
            /**战斗开启 */
            this._isOpenB = false;
            /**队长技能 状态*/
            this._SAutoState = false;
            // 当前累积伤害
            this.TheWordBossDamage = 0;
            this.bWordBoss = false;
            this.TheMatchBossDamage = 0;
            /**是否立即通关 */
            this._bdirct = false;
            this._matchEnd = true;
            this.cdNumber = 1000 / H52D_Framework.GameParamConfig["ClickMaxEffectiveNumPerSecond"];
            this.cd = 0;
            this.oClick = false;
            /**记忆副本———————————————————————————————————————————————————— */
            /**当前时间 */
            this._curTime = 0;
            /**1为胜利 2为失败 */
            this._nWin = 2;
            /**三星结果 */
            this.StarList = [0, 0, 0];
            /**三星条件 */
            this._nStarCond = [];
            /**通关类型 */
            this._PassType = 0;
            /**通关值 */
            this._PassValue = 30;
            /**三星值 */
            this._StarValue = [];
            /**副本id */
            this.copyid = 0;
            this._ccod = [];
            this._bOver = false;
            /**保证结果只返回一次 */
            this._ReslustOnce = false;
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.BEGIN_FIRE, Laya.Handler.create(this, this.OnFire));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.MAIN_VIEW_CLICK, Laya.Handler.create(this, this.OnClick));
            H52D_Framework.Event.RegistEvent("ChallengeBossFail", Laya.Handler.create(this, this.BattleFail));
            H52D_Framework.Event.RegistEvent("StopBubbleMonster", Laya.Handler.create(this, this.StopBubbleMonster));
            H52D_Framework.Event.RegistEvent("AchievenAttackNum", Laya.Handler.create(this, this.AchievenAttackNum));
            this._aIOperation = new H52D_Framework.AIOperation();
            this._stateOperation = new H52D_Framework.StateOperation();
            H52D_Framework.Tick.Loop(100, this, this.Update);
            H52D_Framework.Tick.Loop(10, this, this.cdUpdate);
            H52D_Framework.Tick.Once(200, this, function () {
                /**图鉴属性 */
                H52D_Framework.MHAManager.Instance.Init();
            });
            //临时改bug
            this._monsterFormation = null;
            this._monsterFormation = new H52D_Framework.Formation();
        }
        Object.defineProperty(BattleManager, "Instance", {
            get: function () {
                if (BattleManager._inst == null) {
                    BattleManager._inst = new BattleManager();
                }
                return BattleManager._inst;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BattleManager.prototype, "HeroCardMgr", {
            get: function () { return H52D_Framework.HeroCardManager.Instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BattleManager.prototype, "MonsterFormation", {
            get: function () { return this._monsterFormation; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BattleManager.prototype, "IsBorth", {
            /**判断怪物是否已经生成,
             * true 生成
             * false 没有生成
             */
            get: function () {
                return this._isBorth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BattleManager.prototype, "aIOperation", {
            get: function () {
                return this._aIOperation;
            },
            enumerable: true,
            configurable: true
        });
        BattleManager.prototype.Initialize = function (callBack) {
            this._aIOperation = new H52D_Framework.AIOperation();
            this._stateOperation = new H52D_Framework.StateOperation();
            /**执行英雄初始化,加载资源 */
            this.HeroCardMgr.AvatarInit(callBack);
            this._monsterFormation = null;
            this._monsterFormation = new H52D_Framework.Formation();
            H52D_Framework.PlaySkill.Init.SetSkillIDList();
        };
        /**进入战斗 */
        BattleManager.prototype.OnFire = function () {
            this._bdirct = false;
            this.TheWordBossDamage = 0;
            this.TheMatchBossDamage = 0;
            if (!this.HeroCardMgr && !this.HeroCardMgr.CHeroList && H52D_Framework.ObjIsEmpty(this.HeroCardMgr.CHeroList))
                return;
            this.Select();
            this.HeroCardMgr.HeroAttack();
            this.HeroCardMgr.OnEffectPassive();
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                this.MemoryInit();
                this.Selectmonster();
                H52D_Framework.MonsterManager.Instance.MonsterAttack();
                H52D_Framework.CaptainSkill.CurCdTime = 0;
            }
            this._matchEnd = false;
            /** 如果当前勾选了技能则自动释放 */
            if (H52D_Framework.ViewUILogic.Instance.isAuto && H52D_Framework.CaptainSkill.CurCdTime <= 0) {
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.CAPATIAN_SKILL);
            }
            this._isBorth = true;
        };
        /**选择目标 */
        BattleManager.prototype.Select = function () {
            var monster = H52D_Framework.MonsterManager.Instance.monsterList;
            if (monster) {
                this._monsterFormation.GetFormatInfo(monster);
            }
            if (this.HeroCardMgr.CHeroList) {
                for (var i = 0; i < H52D_Framework.GetTabLength(this.HeroCardMgr.CHeroList); i++) {
                    var hc = this.HeroCardMgr.CHeroList[i];
                    if (hc && this._monsterFormation) {
                        hc.Target = [];
                        hc.Close = true;
                        //if (this._monsterFormation) {
                        hc.Target.push(this._monsterFormation.GetFrontobject[0]);
                        //}
                    }
                }
            }
            if (H52D_Framework.BPetManager.Instance.PetIns) {
                H52D_Framework.BPetManager.Instance.SetTarget(this._monsterFormation.GetFrontobject[0]);
            }
            if (H52D_Framework.BCampManager.Instance.Camp) {
                H52D_Framework.BCampManager.Instance.SetTarget(this._monsterFormation.GetFrontobject[0]);
            }
        };
        BattleManager.prototype.Selectmonster = function () {
            var monsterList = H52D_Framework.MonsterManager.Instance.monsterList;
            var heroList = this.HeroCardMgr.CHeroList;
            if (monsterList) {
                for (var i = 0; i < H52D_Framework.GetTabLength(monsterList); i++) {
                    var m = monsterList[i];
                    if (m) {
                        m.Target = [];
                        m.Close = true;
                    }
                }
            }
            var index = 0;
            /**给英雄赋值攻击目标 */
            for (var i = 0; i < H52D_Framework.GetTabLength(monsterList); i++) {
                var m = monsterList[i];
                if (index >= 3 && index < 6) {
                    index -= 3;
                }
                else if (index >= 6) {
                    index -= 6;
                }
                if (heroList[index]) {
                    m.Target = [];
                    m.Target.push(heroList[index]);
                    index += 1;
                }
                else {
                    if (index > 0)
                        index -= 1;
                    var target = heroList[index];
                    m.Target = [];
                    m.Target.push(target);
                }
            }
        };
        /**更新函数 */
        BattleManager.prototype.Update = function () {
            H52D_Framework.PlaySkill.Init.OnUpdate();
            if (this._isOpenB)
                return;
            this.EntityUpdate();
            if (!this._isBorth)
                return;
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                if (!this.bOver)
                    this.MemoryUpdate();
            }
            else {
                this.MainCopyUpdate();
            }
        };
        /**主线副本更新 */
        BattleManager.prototype.MainCopyUpdate = function () {
            this.LastMosterLocation = this.LastMosterLocationF();
            this.BattleSuccess();
            this.MonsterDieLogic();
        };
        /**怪物切换目标 */
        BattleManager.prototype.MonsterSetOneTarget = function () {
            for (var k in this.MonsterFormation.Getobject) {
                if (this.MonsterFormation.Getobject[k]) {
                    if (this.MonsterFormation.Getobject[k].Target[0] == null || this.MonsterFormation.Getobject[k].Target[0].IsDie) {
                        this.MonsterFormation.Getobject[k].Target = [];
                        this.MonsterFormation.Getobject[k].Target.push(this.SelectHeroSort());
                    }
                }
            }
        };
        BattleManager.prototype.SelectHeroSort = function () {
            var MinHero = null;
            var index = 0;
            for (var i = 0; i < this.HeroCardMgr.CHeroList.length; i++) {
                if (this.HeroCardMgr.CHeroList[index]) {
                    MinHero = this.HeroCardMgr.CHeroList[index];
                }
                else {
                    index += 1;
                }
            }
            return MinHero;
        };
        BattleManager.prototype.EntityUpdate = function () {
            if (this.HeroCardMgr && this.HeroCardMgr.CHeroList) {
                for (var k in this.HeroCardMgr.CHeroList) {
                    if (this.HeroCardMgr.CHeroList[k])
                        this.HeroCardMgr.CHeroList[k].OnUpdate();
                }
            }
            if (H52D_Framework.BPetManager.Instance.PetIns) {
                H52D_Framework.BPetManager.Instance.PetIns.OnUpdate();
            }
            if (H52D_Framework.BCampManager.Instance.Camp) {
                H52D_Framework.BCampManager.Instance.Camp.OnUpdate();
            }
        };
        /**获得最后一个英雄的位置信息 */
        BattleManager.prototype.LastMosterLocationF = function () {
            var location = new Laya.Point(0, 0);
            var monster;
            var monstersList = this._monsterFormation ? this._monsterFormation.Getobject : null;
            if (monstersList) {
                var Len = H52D_Framework.GetTabLength(monstersList);
                if (Len <= 0) {
                    monster = null;
                }
                else if (Len == 1) {
                    monster = monstersList[0];
                }
                else {
                    var index = 0;
                    for (var i = 0; i < Len; i++) {
                        if (monstersList[i] == null) {
                            index += 1;
                        }
                        var num = Len - index;
                        if (num == 1) {
                            for (var j = 0; j < Len; j++) {
                                if (monstersList[j]) {
                                    monster = monstersList[j];
                                }
                            }
                        }
                    }
                }
            }
            if (monster && monster.avatar != null) {
                location.x = H52D_Framework.MonsterLocal[monster.vo.location][0] * G_StageWidthScale;
                location.y = H52D_Framework.MonsterLocal[monster.vo.location][1] - monster.avatar.height;
            }
            return location;
        };
        /**
         * 集体切换目标
         */
        BattleManager.prototype.GroupChangeTarget = function () {
            if (this.IsChangeTarget()) {
                this._dieIndex += 3;
                for (var i = 0; i < 9; i++) {
                    var index = i;
                    switch (this._dieIndex) {
                        case 3:
                            if (index < 3) {
                                index += 3;
                            }
                            else if (index >= 6) {
                                index -= 3;
                            }
                            break;
                        case 6:
                            if (index < 3) {
                                index += 6;
                            }
                            else if (index >= 3 && index < 6) {
                                index += 3;
                            }
                            break;
                    }
                    if (this._monsterFormation.Getobject[index]) {
                        this.HeroCardMgr.CHeroList[i].Target = this._monsterFormation.Getobject[index];
                    }
                }
            }
        };
        /**
         * 是否切换目标
         * 当前排或者中间3个没了，就切换 目标
         * 1vs1 2vs2 3vs3
         */
        BattleManager.prototype.IsChangeTarget = function () {
            for (var m = 0; m < 3; m++) {
                var count = m + this._dieIndex;
                if (this._monsterFormation.Getobject[count]) {
                    return false;
                }
            }
            return true;
        };
        /**设置一个目标
         * 当前排少了一个，空目标的英雄会去选择最小数字的那个怪物
         * 如 0 1 2 2死  就切换去打0
         */
        BattleManager.prototype.SetOnceTarget = function () {
            if (this.HeroCardMgr && this.HeroCardMgr.CHeroList) {
                for (var i = 0; i < H52D_Framework.GetTabLength(this.HeroCardMgr.CHeroList); i++) {
                    if (this.HeroCardMgr.CHeroList[i]) {
                        if (!this.HeroCardMgr.CHeroList[i].Target) {
                            this.HeroCardMgr.CHeroList[i].Target = [];
                            for (var j = 0; j < H52D_Framework.GetTabLength(this._monsterFormation.Getobject); j++) {
                                if (this._monsterFormation.Getobject[j]) {
                                    this.HeroCardMgr.CHeroList[i].Target = this._monsterFormation.Getobject[j];
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        };
        /*** 怪物死亡刷新逻辑*/
        BattleManager.prototype.MonsterDieLogic = function () {
            for (var i = 0; i < H52D_Framework.GetTabLength(this._monsterFormation.Getobject); i++) {
                if (this._monsterFormation.Getobject[i] != null) {
                    if (this._monsterFormation.Getobject[i].afterDie == true) {
                        this._monsterFormation.Getobject[i] = null;
                    }
                }
            }
        };
        /**英雄死亡逻辑 */
        BattleManager.prototype.HeroDieLogic = function () {
            for (var i = 0; i < this.HeroCardMgr.CHeroList.length; i++) {
                if (this.HeroCardMgr.CHeroList[i] != null) {
                    if (this.HeroCardMgr.CHeroList[i].isDown == true) {
                        this.HeroCardMgr.CHeroList[i] = null;
                    }
                }
            }
        };
        /**判断是不是过关成功 */
        BattleManager.prototype.isSuccess = function () {
            if (!this._monsterFormation.Getobject) {
                return 0;
            }
            for (var i = 0; i < H52D_Framework.GetTabLength(this._monsterFormation.Getobject); i++) {
                if (this._monsterFormation.Getobject[i]) {
                    if (this._monsterFormation.Getobject[i].afterDie) {
                        this._monsterFormation.Getobject[i].afterDie = false;
                        if (H52D_Framework.CustomsManager.Instance.bBoss) {
                            H52D_Framework.Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_2);
                            H52D_Framework.Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_4);
                            H52D_Framework.Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_10);
                            H52D_Framework.Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_12);
                            H52D_Framework.Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_13);
                        }
                        return 2;
                    }
                    if (this._monsterFormation.Getobject[i].beforDie) {
                        this._monsterFormation.Getobject[i].beforDie = false;
                        return 1;
                    }
                }
            }
            return 0;
        };
        /** 是否有活着第目标 */
        BattleManager.prototype.IsHasAliveTarget = function () {
            if (!this._monsterFormation) {
                return false;
            }
            if (!this._monsterFormation.Getobject) {
                return false;
            }
            for (var i = 0; i < H52D_Framework.GetTabLength(this._monsterFormation.Getobject); i++) {
                if (this._monsterFormation.Getobject[i]) {
                    if (this._monsterFormation.Getobject[i].currentHp > 0) {
                        return true;
                    }
                }
            }
            return false;
        };
        BattleManager.prototype.AchievenAttackNum = function () {
            //英雄攻击次数
            H52D_Framework.MasterPlayer.Instance.ReqOnEvent(EventProEnum.HeroAttack, this.heroAttackNum);
            this.heroAttackNum = 0;
            //神兽攻击次数
            H52D_Framework.MasterPlayer.Instance.ReqOnEvent(EventProEnum.PetAttack, this.petAttackNum);
            this.petAttackNum = 0;
            //点击暴击次数
            H52D_Framework.MasterPlayer.Instance.ReqOnEvent(EventProEnum.GetClickCritNum, this.clickCritNum);
            this.clickCritNum = 0;
            //点击次数
            H52D_Framework.RemoteCall.Instance.Send("K_ReqClickTimes", this.clickNum);
            this.clickNum = 0;
            //刷新成就页面
            H52D_Framework.Event.DispatchEvent("UpdateAchievenDate");
        };
        /**即可通关 */
        BattleManager.prototype.bdirct = function () {
            this._bdirct = true;
            for (var k in this._monsterFormation.Getobject) {
                if (this._monsterFormation.Getobject[k]) {
                    this._monsterFormation.Getobject[k].setHp();
                }
            }
            this._monsterFormation.Destroy();
            this._bdirct = true;
            H52D_Framework.Event.DispatchEvent("Destroy_s");
        };
        /**战斗胜利 */
        BattleManager.prototype.BattleSuccess = function () {
            var success = this._bdirct ? 1 : this.isSuccess();
            if (success > 0 && this._isBorth) {
                if (success == 1) {
                    if (this._bdirct)
                        this._isBorth = false;
                    H52D_Framework.Event.DispatchEvent("CUSTOMS_RESULT", [true]);
                }
                else if (success == 2) {
                    this._isBorth = false;
                    this._monsterFormation.Destroy();
                    H52D_Framework.Event.DispatchEvent("Destroy_s");
                    H52D_Framework.CustomsManager.Instance.FightUpdate();
                }
            }
        };
        Object.defineProperty(BattleManager.prototype, "MathcEnd", {
            get: function () { return this._matchEnd; },
            enumerable: true,
            configurable: true
        });
        /**战斗失败 */
        BattleManager.prototype.BattleFail = function () {
            /**buff为-1的销毁 */
            H52D_Framework.Event.DispatchEvent("Destroy_s");
            //提示没在指定时间内打败，进入循环打小怪模式
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Boss) {
                BattleManager.Instance.StopBattle();
                H52D_Framework.WroldBossLogic.Instance.Buff_Del();
                H52D_Framework.UIManager.Instance.CreateUI("WroldBossEndView", [H52D_Framework.ViewUpRoot]);
                if (H52D_Framework.UIManager.Instance.IsHave("WroldBossBuffView", H52D_Framework.ViewUpRoot)) {
                    H52D_Framework.UIManager.Instance.DestroyUI("WroldBossBuffView", [H52D_Framework.ViewUpRoot]);
                }
            }
            //如果是Pk联赛海选阶段
            else if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                BattleManager.Instance.StopBattle();
                H52D_Framework.UIManager.Instance.CreateUI("MatchBossEndView", [H52D_Framework.ViewUpRoot]);
                this._matchEnd = true;
            }
            else {
                H52D_Framework.Event.DispatchEvent("CUSTOMS_RESULT", [false]);
            }
        };
        /**暂停战斗 */
        BattleManager.prototype.StopBattle = function () {
            this.bStopBattle = true;
            this._isOpenB = true;
        };
        /**开启战斗 */
        BattleManager.prototype.OpenBattle = function () {
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                H52D_Framework.PlaySkill.Init.bclose = true;
            }
            if (H52D_Framework.ViewUILogic.Instance.isAuto && H52D_Framework.CaptainSkill.CurCdTime <= 0) {
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.CAPATIAN_SKILL);
            }
            this.bStopBattle = false;
            this._isOpenB = false;
        };
        BattleManager.prototype.cdUpdate = function () {
            if (this.cd > 0)
                this.cd -= 10;
        };
        /**接收到点击事件 */
        BattleManager.prototype.OnClick = function (strEvent) {
            if (!this.IsHasAliveTarget() || this.oClick || this.cd > 0) {
                return;
            }
            this.cd = this.cdNumber;
            if (H52D_Framework.BubbleManager.Instance.bMonsterFirst) {
                var startTime = H52D_Framework.GameParamConfig.MonsterHidden[1] * 1000;
                H52D_Framework.Tick.Once(startTime, this, this.StartBubbleFirst, [], false);
                this.TriggerBubblNum += 1;
            }
            this.clickNum++;
            var params = this._aIOperation.Do();
            this._stateOperation.Do(params, strEvent);
            this.TapTarget();
            this.DPSshow(params[1]);
        };
        BattleManager.prototype.TapTarget = function () {
            var index = 0;
            var num = H52D_Framework.GetTabLength(this._monsterFormation.Getobject);
            for (var j = 0; j < num; j++) {
                if (this._monsterFormation.Getobject[j] != null) {
                    this.RememberNumber();
                    this._IndexNumber += 1;
                    index = j;
                    return;
                }
            }
        };
        BattleManager.prototype.StartBubbleFirst = function () {
            var clickNum = H52D_Framework.GameParamConfig.MonsterHidden[2];
            if (this.TriggerBubblNum >= clickNum) {
                this.TriggerBubblNum = 0;
                if (H52D_Framework.BubbleManager.Instance.bMonsterBubble) {
                    H52D_Framework.Tick.Once(2000, this, this.StartBubbleMonster, [], false);
                }
            }
        };
        BattleManager.prototype.StartBubbleMonster = function () {
            H52D_Framework.Event.DispatchEvent("StartBubbleMonster", [E_BubbleType.eMonster, 1, 20000, false, false]);
        };
        BattleManager.prototype.StopBubbleMonster = function () {
            H52D_Framework.Tick.Clear(this, this.StartBubbleFirst);
            H52D_Framework.Tick.Clear(this, this.StartBubbleMonster);
            this.TriggerBubblNum = 0;
        };
        /**记每6S的点击次数，给服务器 */
        BattleManager.prototype.RememberNumber = function () {
            var _this = this;
            if (this._IndexNumber != 0) {
                if (!this._isOnce) {
                    H52D_Framework.Tick.Once(60000, this, function () {
                        _this._isOnce = false;
                        H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.TAP_NUMBER, [_this._IndexNumber]);
                        _this._IndexNumber = 0;
                    });
                }
                this._isOnce = true;
            }
        };
        /**总DPS小面板 */
        BattleManager.prototype.DPSshow = function (damage) {
            var _this = this;
            var DpsCountingInterval = H52D_Framework.GameParamConfig["DpsCountingInterval"] + 10;
            var DpsPurgeInterval = H52D_Framework.GameParamConfig["DpsPurgeInterval"];
            this._TapIndex += 1;
            if (!this._isOpen && this._aIOperation) {
                this._isOpen = true;
                H52D_Framework.Tick.Loop(DpsCountingInterval, this, function () {
                    if (_this._tapTime >= DpsPurgeInterval && _this._lasttapTime > 1000) {
                        _this._tapTime = 0;
                        _this._TapIndex = 0;
                        if (!_this._aIOperation)
                            return;
                        H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.ALL_DPS, [_this.aIOperation.AllDps]);
                        return;
                    }
                    _this._lasttapTime = _this._tapTime - _this._lasttapTime;
                    _this._tapTime += DpsCountingInterval;
                    var currentTime = _this._tapTime / 1000;
                    if (!_this._aIOperation)
                        return;
                    var heroDps = _this.aIOperation.AllDps;
                    var idamage = 0;
                    if (currentTime >= 1) {
                        idamage = (_this._TapIndex * damage / currentTime) + heroDps >> 0;
                    }
                    else {
                        idamage = _this._TapIndex * damage + heroDps >> 0;
                    }
                    H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.ALL_DPS, [idamage.toString()]);
                });
            }
        };
        /**切换Boss用 */
        BattleManager.prototype.DestroyMonster = function () {
            H52D_Framework.Event.DispatchEvent("Destroy_s");
            for (var i = 0; i < this._monsterFormation.Getobject.length; i++) {
                if (this._monsterFormation.Getobject[i])
                    this._monsterFormation.Getobject[i].IsDie = true;
            }
            H52D_Framework.MonsterManager.Instance.Destroy();
            this._monsterFormation.Destroy();
            if (this.HeroCardMgr && this.HeroCardMgr.CHeroList) {
                for (var i = 0; i < H52D_Framework.GetTabLength(this.HeroCardMgr.CHeroList); i++) {
                    var hc = this.HeroCardMgr.CHeroList[i];
                    if (hc)
                        hc.ClearTarget();
                }
            }
        };
        Object.defineProperty(BattleManager.prototype, "curtime", {
            /**当前时间 */
            get: function () { return this._curTime; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BattleManager.prototype, "nWin", {
            get: function () { return this._nWin; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BattleManager.prototype, "PassType", {
            get: function () { return this._PassType; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BattleManager.prototype, "bOver", {
            /**记忆副本是否结束 */
            get: function () { return this._bOver; },
            enumerable: true,
            configurable: true
        });
        /**初始化记忆副本属性 */
        BattleManager.prototype.MemoryInit = function () {
            BattleManager.hitNum = 0;
            BattleManager.damageAll = 0;
            BattleManager.hDienumber = 0;
            BattleManager.mDieNumber = 0;
            this._ReslustOnce = true;
            this._curTime = 0;
            this._nStarCond = [];
            this._bOver = false;
            this._nWin = 2;
            this.StarList = [0, 0, 0];
            this.GetVectorCond();
        };
        /**初始化胜利 星级条件 */
        BattleManager.prototype.GetVectorCond = function () {
            this._StarValue = [];
            this._nStarCond = [];
            this._ccod = [];
            var cfg = H52D_Framework.CopyConfig[H52D_Framework.MemoryType.equip][this.copyid];
            var starCfg = cfg["StarConditon"];
            var starvalue = cfg["StarValue"];
            for (var k in starCfg) {
                this._nStarCond.push(starCfg[k]);
            }
            for (var k in starvalue) {
                this._StarValue.push(starvalue[k]["1"]);
            }
            this._PassType = cfg["PassType"];
            this._PassValue = cfg["PassValue"];
            for (var i = 0; i < this._nStarCond.length; i++) {
                var copy = new H52D_Framework.CopyCond(i, this._nStarCond[i], this._StarValue[i]);
                this._ccod[i] = copy;
            }
        };
        /**星级判断  战斗结束后判断*/
        BattleManager.prototype.SelectVertor_End = function () {
            for (var k in this._ccod) {
                if (this._ccod[k]) {
                    this._ccod[k].OnEffect();
                }
            }
        };
        /**星级判断 战斗中判断*/
        BattleManager.prototype.SelectVertor_Loop = function () {
            for (var k in this._ccod) {
                if (this._ccod[k]) {
                    if (this._ccod[k].Type == 6 || this._ccod[k].Type == 4) {
                        this._ccod[k].OnEffect();
                    }
                }
            }
        };
        /**记忆副本 胜利或者失败 */
        BattleManager.prototype.isMemorySuccsec = function () {
            if (this._curTime >= 30 * 1000 || this._PassType == 1 && this._nWin == 1 || this.bEnemyDie()) {
                this._bOver = true;
            }
            else if (!this.bOwnerDie()) {
                this._bOver = true;
            }
        };
        /**通关条件 */
        BattleManager.prototype.EndCond = function (index, i, value) {
            switch (index - 1) {
                case 0:
                    this.EnemyAllDie(i, value);
                    break;
                case 1:
                    this.LifeTime(i, value);
                    break;
            }
        };
        /**怪物死亡即为胜利 */
        BattleManager.prototype.EnemyAllDie = function (i, value) {
            var v = value * 1000;
            if (this._curTime <= v && this.bEnemyDie()) {
                this._nWin = 1;
            }
        };
        /**生存时间到了 即为胜利 */
        BattleManager.prototype.LifeTime = function (i, value) {
            var v = value * 1000;
            if (this._curTime >= v && this.bOwnerDie()) {
                this._nWin = 1;
            }
        };
        /**敌人是否全部死亡  true为死亡 */
        BattleManager.prototype.bEnemyDie = function () {
            for (var k in this._monsterFormation.Getobject) {
                if (this._monsterFormation.Getobject[k]) {
                    return false;
                }
            }
            return true;
        };
        /**英雄是否全部死亡  false为死亡 */
        BattleManager.prototype.bOwnerDie = function () {
            for (var k in this.HeroCardMgr.CHeroList) {
                if (this.HeroCardMgr.CHeroList[k]) {
                    return true;
                }
            }
            return false;
        };
        /**记忆副本更新 */
        BattleManager.prototype.MemoryUpdate = function () {
            this._curTime += 100;
            this.isMemorySuccsec();
            this.EndCond(this._PassType, 0, this._PassValue);
            this.HeroDieLogic();
            this.MonsterDieLogic();
            this.MonsterSetOneTarget();
            this.SelectVertor_Loop();
            if (this.bOver && !this._ReslustOnce) {
                this._ReslustOnce = true;
                this.MemeryEnd();
            }
        };
        /**记忆副本结束 */
        BattleManager.prototype.MemeryEnd = function () {
            this.SelectVertor_End();
            H52D_Framework.MemoryLogic.Instance.ReqPassDungeon(H52D_Framework.MemoryType.equip, this.copyid, this.nWin, this.StarList);
            this.Destroy();
        };
        /** ---------------------------------------------------------------------------------*/
        /**销毁 */
        BattleManager.prototype.Destroy = function () {
            H52D_Framework.Event.DispatchEvent("Destroy_s");
            this._isOpen = false;
            this._isBorth = false;
            this._bOver = false;
            if (this._aIOperation) {
                this._aIOperation.Destroy();
                this._aIOperation = null;
            }
            if (this._stateOperation) {
                this._stateOperation.Destroy();
                this._stateOperation = null;
            }
            if (this.HeroCardMgr) {
                this.HeroCardMgr.Destroy();
            }
            H52D_Framework.PlaySkill.Init.bclose = false;
            H52D_Framework.BPetManager.Instance.Destroy();
            H52D_Framework.BCampManager.Instance.Destroy();
            H52D_Framework.MonsterManager.Instance.Destroy();
            if (this._monsterFormation)
                this._monsterFormation.Destroy();
        };
        /**被击数 */
        BattleManager.hitNum = 0;
        /**总伤害量 */
        BattleManager.damageAll = 0;
        BattleManager.mDieNumber = 0;
        BattleManager.hDienumber = 0;
        return BattleManager;
    }());
    H52D_Framework.BattleManager = BattleManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=BattleManager.js.map