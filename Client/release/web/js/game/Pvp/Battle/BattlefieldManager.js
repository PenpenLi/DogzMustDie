var H52D_Framework;
(function (H52D_Framework) {
    /**PVP战场管理 */
    var BattlefieldManager = /** @class */ (function () {
        function BattlefieldManager() {
            this._btype = [1, -1];
            this.end = false;
            this._bort = false;
            this._characterList = [];
            /**DPS显示 */
            this._paiOperation = null;
            this._costTime = 0;
            this._BTime = 0;
            /**星级 0星是我方失败*/
            this._starNum = -1;
            /**1 胜利  2失败 0平局 */
            this._nWin = -1;
            this._TwoStarCost = 60 * 1000; // GameParamConfig["StarData"][1][1] * 1000;
            this._ThreeStarCost = 30 * 1000; // GameParamConfig["StarData"][2][1] * 1000;
            this._ThreePersonNum = H52D_Framework.GameParamConfig["StarData"][1][2];
            this._TwoPersonNum = H52D_Framework.GameParamConfig["StarData"][2][2];
            this._dieIndex = 0;
            this._dieIndex_e = 0;
            /**星级 0星是我方失败*/
            this._starNum_C = -1;
            this._paiOperation = new H52D_Framework.PAIOperation();
        }
        Object.defineProperty(BattlefieldManager, "Instance", {
            get: function () {
                if (this._instance == null) {
                    this._instance = new BattlefieldManager();
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BattlefieldManager.prototype, "Characterlist", {
            get: function () { return this._characterList; },
            enumerable: true,
            configurable: true
        });
        BattlefieldManager.prototype.LoadBattle = function () {
            H52D_Framework.DamageShow.Instance._Cler();
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                this._BTime = (120 * 1000) - 300;
            }
            else {
                this._BTime = (60 * 1000) - 300;
            }
            this._costTime = 0;
            H52D_Framework.DataManager.Instance.Init();
            this._characterList = [];
            for (var k in this._btype) {
                this._characterList.push(new H52D_Framework.PvPCharacter(this._btype[k]));
            }
            for (var k in this._characterList) {
                this._characterList[k].Load();
            }
            for (var k in this._characterList) {
                if (this._characterList[k] && this._characterList[k].petMgr) {
                    this._characterList[k].petMgr.SetDamage();
                }
            }
            if (this._characterList[1] && this._characterList[1].campMgr) {
                var d = this._characterList[1].campMgr.Camp.vo.attr.GetAttributeValue(2);
                if (d <= 1)
                    this._characterList[1].campMgr.SetDamage();
            }
            for (var k in this._characterList) {
                for (var i in this._characterList[k].HeroList) {
                    if (this._characterList[k].HeroList[i]) {
                        this._characterList[k].HeroList[i].OnEffectPassive();
                    }
                }
            }
            this.WinBuff(H52D_Framework.MatchLogic.Instance.winnerIndexInGroup);
            this._paiOperation.Dps();
            this.GMTools_AttrShow();
        };
        BattlefieldManager.prototype.WinBuff = function (type) {
            var id = type == 1 ? 0 : 1;
            var herolist = this._characterList[id].HeroList;
            for (var k in herolist) {
                if (herolist[k]) {
                    herolist[k].vo.attr.ModfiyAttributeValue(1, H52D_Framework.eValueType.Percent, 3500);
                }
            }
        };
        /**测试数据工具 */
        BattlefieldManager.prototype.GMTools_AttrShow = function () {
            if (!this.Characterlist[0])
                return;
            this.Characterlist[0].Heromanager.show();
            this.Characterlist[1].Heromanager.show();
            if (this.Characterlist[0].petMgr)
                this.Characterlist[0].petMgr.PetIns.ImValue();
            if (this.Characterlist[1].petMgr)
                this.Characterlist[1].petMgr.PetIns.ImValue();
            if (this.Characterlist[0].campMgr)
                this.Characterlist[0].campMgr.Camp.ImValue();
            if (this.Characterlist[1].campMgr)
                this.Characterlist[1].campMgr.Camp.ImValue();
            this.Characterlist[0].player.ImValue();
            this.Characterlist[1].player.ImValue();
        };
        BattlefieldManager.prototype.OnFire = function () {
            this._bort = true;
            this.end = false;
            this.EntitySetTarget();
            H52D_Framework.Tick.Loop(100, this, this.OnUpdate);
        };
        BattlefieldManager.prototype.CaptainTarget = function (oid, eid) {
            for (var k in this._characterList[oid].HeroList) {
                if (this._characterList[oid].HeroList[k].bCaptain) {
                    this._characterList[oid].HeroList[k].CaptainTarget = this._characterList[eid].HeroList;
                }
            }
        };
        BattlefieldManager.prototype.setTarget = function (list1, list2) {
            var index = 0;
            /**给英雄赋值攻击目标 */
            for (var k in list1) {
                if (list1[k]) {
                    var hc = list1[k];
                    if (index >= 3 && index < 6) {
                        index -= 3;
                    }
                    else if (index >= 6) {
                        index -= 6;
                    }
                    if (list1[index]) {
                        hc.Target = [];
                        hc.Target.push(list2[index]);
                        index += 1;
                    }
                    else {
                        if (index > 0)
                            index -= 1;
                        hc.Target = [];
                        hc.Target.push(list2[index]);
                    }
                }
            }
        };
        BattlefieldManager.prototype.OnEffectPassive = function (list1) {
            for (var k in list1.HeroList) {
                if (list1.HeroList) {
                    list1.HeroList[k].OnEffectPassive();
                }
            }
        };
        BattlefieldManager.prototype.ResetT = function () {
            this.setTarget(this._characterList[0].HeroList, this._characterList[1].HeroList);
            this.setTarget(this._characterList[1].HeroList, this._characterList[0].HeroList);
        };
        BattlefieldManager.prototype.EntitySetTarget = function () {
            // if (!this._bstart) {
            //     this._bstart = true;
            if (this.Characterlist.length <= 0)
                return;
            this.Characterlist[0].Heromanager.HeroAttack();
            this.Characterlist[1].Heromanager.HeroAttack();
            /**普攻目标 */
            this.setTarget(this._characterList[0].HeroList, this._characterList[1].HeroList);
            this.setTarget(this._characterList[1].HeroList, this._characterList[0].HeroList);
            /**队长目标 */
            this.CaptainTarget(0, 1);
            this.CaptainTarget(1, 0);
            /**阵营 */
            if (this.Characterlist[0].campMgr)
                this.Characterlist[0].campMgr.SetTarget(this._characterList[1].HeroList);
            if (this.Characterlist[1].campMgr)
                this.Characterlist[1].campMgr.SetTarget(this._characterList[0].HeroList);
            /**宠物 */
            if (this.Characterlist[0].petMgr)
                this.Characterlist[0].petMgr.SetTarget(this._characterList[1].HeroList);
            if (this.Characterlist[1].petMgr)
                this.Characterlist[1].petMgr.SetTarget(this._characterList[0].HeroList);
            /**主角 */
            this.Characterlist[0].player.target_D = this._characterList[1].HeroList;
            this.Characterlist[1].player.target_D = this._characterList[0].HeroList;
            this.Characterlist[0].player.Target_B = this._characterList[0].HeroList;
            this.Characterlist[1].player.Target_B = this._characterList[1].HeroList;
            this.Characterlist[0].player.bclose = true;
            this.Characterlist[1].player.bclose = true;
            if (H52D_Framework.ViewUILogic.Instance.isAuto && H52D_Framework.CaptainSkill.DeputyCdTime <= 0) {
                H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.CAPATIAN_SKILL);
            }
        };
        BattlefieldManager.prototype.OnUpdate = function () {
            for (var k in this._characterList) {
                if (this._characterList[k])
                    this._characterList[k].OnUpdate();
            }
            if (this._bort) {
                this._BTime -= 100;
                this._costTime += 100;
                if (this.Characterlist && this.Characterlist.length > 0) {
                    this.GroupChangeTarget();
                    this.GroupChangeTarget_E();
                    this.BattleComBat();
                    this.BattleComBat_C();
                }
                if (this._BTime <= 0) {
                    H52D_Framework.Event.DispatchEvent("Ladderfightover");
                }
                if (this._starNum != -1) {
                    H52D_Framework.Tick.ClearAll(this);
                    this.end = true;
                    if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Ladder) {
                        if (this._nWin == 2) {
                            H52D_Framework.LadderManager.Instance.K_ReqLadderCombatEnd(this._starNum_C, this._nWin);
                        }
                        else {
                            H52D_Framework.LadderManager.Instance.K_ReqLadderCombatEnd(this._starNum, this._nWin);
                        }
                    }
                    else if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.MatchChampion) {
                        H52D_Framework.UIManager.Instance.CreateUI("MatchPKEndView", [H52D_Framework.ViewUpRoot]);
                    }
                    else {
                        H52D_Framework.KickingLogic.Instance.PvpCombatEnd(this._starNum, this._nWin);
                    }
                    H52D_Framework.UIManager.Instance.DestroyUI("FloatView", [H52D_Framework.AvatarEffectRoot]);
                }
            }
        };
        /**英雄循环攻击 */
        BattlefieldManager.prototype.HeroAttack = function (id1) {
            var hf = this.Characterlist[id1].HeroList;
            if (!hf)
                return;
            var len = hf.length - 1;
            var _loop_1 = function (i) {
                var hc = hf[i];
                if (!hc)
                    return { value: void 0 };
                var time = 0;
                /**第一位出手英雄 */
                var X = H52D_Framework.GameParamConfig["FastestHeroFirstAttackTime"];
                /**其他英雄出手 */
                var Y = H52D_Framework.GameParamConfig["OtherHeroFirstAttackTimeRatio"];
                if (i == len) {
                    time = X;
                }
                else {
                    var firstHero = hf[len];
                    var F = firstHero.vo.ToSpeed;
                    time = X + (F - hc.vo.ToSpeed) * Y;
                }
                H52D_Framework.Tick.Once(time, this_1, function () {
                    hc.BClose = false;
                });
            };
            var this_1 = this;
            for (var i = len; i >= 0; i--) {
                var state_1 = _loop_1(i);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        };
        /**
        * 是否切换目标
        * 当前排或者中间3个没了，就切换 目标
        * 1vs1 2vs2 3vs3
        */
        BattlefieldManager.prototype.IsChangeTarget = function () {
            for (var m = 0; m < 3; m++) {
                var count = m + this._dieIndex;
                if (this.Characterlist[1].HeroList[count]) {
                    return false;
                }
            }
            return true;
        };
        /**
        * 集体切换目标
        */
        BattlefieldManager.prototype.GroupChangeTarget = function () {
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
                    if (this.Characterlist[1].HeroList[index]) {
                        if (this.Characterlist[0].HeroList[i]) {
                            this.Characterlist[0].HeroList[i].Target = [];
                            this.Characterlist[0].HeroList[i].Target.push(this.Characterlist[1].HeroList[index]);
                        }
                    }
                    else {
                        if (this.Characterlist[0].HeroList[i]) {
                            var t = this.NullTargetSelect(1);
                            this.Characterlist[0].HeroList[i].Target = [];
                            this.Characterlist[0].HeroList[i].Target.push(t);
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < 9; i++) {
                    if (this.Characterlist[0].HeroList[i] && this.Characterlist[0].HeroList[i].Target.length == 0) {
                        for (var m = 0; m < 3; m++) {
                            var count = m + this._dieIndex;
                            if (this.Characterlist[1].HeroList[count]) {
                                this.Characterlist[0].HeroList[i].Target.push(this.Characterlist[1].HeroList[count]);
                            }
                        }
                        if (this.Characterlist[0].HeroList[i].Target.length == 0) {
                            if (this.Characterlist[0].HeroList[i]) {
                                var t = this.NullTargetSelect(1);
                                this.Characterlist[0].HeroList[i].Target = [];
                                this.Characterlist[0].HeroList[i].Target.push(t);
                            }
                        }
                    }
                }
            }
        };
        BattlefieldManager.prototype.NullTargetSelect = function (id) {
            for (var k in this.Characterlist[id].HeroList) {
                if (this.Characterlist[id].HeroList[k]) {
                    return this.Characterlist[id].HeroList[k];
                }
            }
        };
        BattlefieldManager.prototype.IsChangeTarget_E = function () {
            for (var m = 0; m < 3; m++) {
                var count = m + this._dieIndex_e;
                if (this.Characterlist[0].HeroList[count]) {
                    return false;
                }
            }
            return true;
        };
        /**
        * 集体切换目标
        */
        BattlefieldManager.prototype.GroupChangeTarget_E = function () {
            if (this.IsChangeTarget_E()) {
                this._dieIndex_e += 3;
                for (var i = 0; i < 9; i++) {
                    var index = i;
                    switch (this._dieIndex_e) {
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
                    if (this.Characterlist[0].HeroList[index]) {
                        if (this.Characterlist[1].HeroList[i]) {
                            this.Characterlist[1].HeroList[i].Target = [];
                            this.Characterlist[1].HeroList[i].Target.push(this.Characterlist[0].HeroList[index]);
                        }
                    }
                    else {
                        if (this.Characterlist[1].HeroList[i]) {
                            var t = this.NullTargetSelect(0);
                            this.Characterlist[1].HeroList[i].Target = [];
                            this.Characterlist[1].HeroList[i].Target.push(t);
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < 9; i++) {
                    if (this.Characterlist[1].HeroList[i] && this.Characterlist[1].HeroList[i].Target.length == 0) {
                        for (var m = 0; m < 3; m++) {
                            var count = m + this._dieIndex_e;
                            if (this.Characterlist[0].HeroList[count]) {
                                this.Characterlist[1].HeroList[i].Target.push(this.Characterlist[0].HeroList[count]);
                            }
                        }
                        if (this.Characterlist[1].HeroList[i].Target.length == 0) {
                            var t = this.NullTargetSelect(0);
                            this.Characterlist[1].HeroList[i].Target = [];
                            this.Characterlist[1].HeroList[i].Target.push(t);
                        }
                    }
                }
            }
        };
        /** 中断平局*/
        BattlefieldManager.prototype.Dispone = function () {
            this._starNum = 0;
            this._nWin = 0;
            this.end = true;
            H52D_Framework.KickingLogic.Instance.PvpCombatEnd(this._starNum, this._nWin);
            H52D_Framework.Tick.ClearAll(this);
            H52D_Framework.UIManager.Instance.DestroyUI("FloatView", [H52D_Framework.AvatarEffectRoot]);
        };
        BattlefieldManager.prototype.BattleComBat = function () {
            if (this._costTime <= this._ThreeStarCost && this.getHeroNum(0) >= this._ThreePersonNum && this.getHeroNum(1) <= 0) {
                this._starNum = 3;
                this._nWin = 1;
                return;
            }
            else if (this._costTime <= this._TwoStarCost && this.getHeroNum(0) >= this._TwoPersonNum && this.getHeroNum(1) <= 0) {
                this._starNum = 2;
                this._nWin = 1;
                return;
            }
            else if (this._BTime > this._TwoStarCost && this.getHeroNum(0) > 0 && this.getHeroNum(1) <= 0) {
                this._starNum = 1;
                this._nWin = 1;
                return;
            }
            else if (this._BTime > this._TwoStarCost && this.getHeroNum(0) <= 0 && this.getHeroNum(1) > 0) {
                this._starNum = 0;
                this._nWin = 2;
                return;
            }
            else if (this._BTime <= 0) {
                if (this.getHeroNum(0) > this.getHeroNum(1)) {
                    this._starNum = 1;
                    this._nWin = 1;
                }
                else if (this.getHeroNum(0) <= 0 && this.getHeroNum(1) <= 0) {
                    this._starNum = 0;
                    this._nWin = 0;
                }
                else if (this.getHeroNum(0) == this.getHeroNum(1)) {
                    this._starNum = 0;
                    this._nWin = 0;
                }
                else {
                    this._starNum = 0;
                    this._nWin = 2;
                }
                return;
            }
            else if (this._BTime >= 0) {
                if (this.getHeroNum(0) <= 0 && this.getHeroNum(1) <= 0) {
                    this._starNum = 0;
                    this._nWin = 0;
                }
                else if (this.getHeroNum(0) > 0 && this.getHeroNum(1) <= 0) {
                    this._starNum = 1;
                    this._nWin = 1;
                }
                else if (this.getHeroNum(0) <= 0 && this.getHeroNum(1) > 0) {
                    this._starNum = 0;
                    this._nWin = 2;
                }
                return;
            }
        };
        BattlefieldManager.prototype.BattleComBat_C = function () {
            if (this._costTime <= this._ThreeStarCost && this.getHeroNum(1) >= this._ThreePersonNum && this.getHeroNum(0) <= 0) {
                this._starNum_C = 3;
                return;
            }
            else if (this._costTime <= this._TwoStarCost && this.getHeroNum(1) >= this._TwoPersonNum && this.getHeroNum(0) <= 0) {
                this._starNum_C = 2;
                return;
            }
            else if (this._costTime > this._TwoStarCost && this.getHeroNum(1) > 0 && this.getHeroNum(0) <= 0) {
                this._starNum_C = 1;
                return;
            }
            else if (this._BTime <= 0) {
                if (this.getHeroNum(1) > this.getHeroNum(0)) {
                    this._starNum_C = 1;
                }
                return;
            }
            else if (this._BTime >= 0) {
                if (this.getHeroNum(1) > 0 && this.getHeroNum(0) <= 0) {
                    this._starNum_C = 1;
                }
                return;
            }
        };
        /**获取存活英雄数量 */
        BattlefieldManager.prototype.getHeroNum = function (id) {
            var index = 0;
            for (var k in this._characterList[id].HeroList) {
                if (this._characterList[id].HeroList[k]) {
                    index += 1;
                }
            }
            return index;
        };
        BattlefieldManager.prototype.Destroy = function () {
            // this._bstart = false;
            this._bort = false;
            this._starNum = -1;
            this._nWin = -1;
            // Tick.Clear(this,this.OnUpdate);
            H52D_Framework.Tick.ClearAll(this);
            for (var k in this._characterList) {
                if (this._characterList[k]) {
                    this._characterList[k].Destroy();
                    this._characterList[k] = null;
                }
            }
            this._characterList = [];
        };
        BattlefieldManager._instance = null;
        return BattlefieldManager;
    }());
    H52D_Framework.BattlefieldManager = BattlefieldManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=BattlefieldManager.js.map