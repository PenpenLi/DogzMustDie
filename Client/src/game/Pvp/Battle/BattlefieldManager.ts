module H52D_Framework {
    /**PVP战场管理 */
    export class BattlefieldManager {
        private readonly _btype = [1, -1];
        private static _instance: BattlefieldManager = null;
        public static get Instance() {
            if (this._instance == null) {
                this._instance = new BattlefieldManager();
            }
            return this._instance;
        }

        public end: boolean = false;

        private _bort: boolean = false;
        private _characterList: Array<PvPCharacter> = [];
        /**DPS显示 */
        private _paiOperation: PAIOperation = null;
        private _costTime: number = 0;
        
        private _BTime: number = 0;
        /**星级 0星是我方失败*/
        private _starNum: number = -1;
        /**1 胜利  2失败 0平局 */
        private _nWin: number = -1;
        private _TwoStarCost = 60 * 1000;// GameParamConfig["StarData"][1][1] * 1000;
        private _ThreeStarCost = 30 * 1000;// GameParamConfig["StarData"][2][1] * 1000;
        private _ThreePersonNum = GameParamConfig["StarData"][1][2];
        private _TwoPersonNum = GameParamConfig["StarData"][2][2];

        constructor() { this._paiOperation = new PAIOperation(); }

        public get Characterlist() { return this._characterList; }

        public LoadBattle() {
            DamageShow.Instance._Cler();
            if (CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                this._BTime = (120 * 1000) - 300;
            }
            else {
                this._BTime = (60 * 1000) - 300;
            }
            this._costTime = 0;
            DataManager.Instance.Init();
            this._characterList = [];
            for (let k in this._btype) {
                this._characterList.push(new PvPCharacter(this._btype[k]));
            }
            for (let k in this._characterList) {
                this._characterList[k].Load();
            }
            for (let k in this._characterList) {
                if (this._characterList[k] && this._characterList[k].petMgr) {
                    this._characterList[k].petMgr.SetDamage();
                }
            }
            if (this._characterList[1] && this._characterList[1].campMgr) {
                let d = this._characterList[1].campMgr.Camp.vo.attr.GetAttributeValue(2);
                if (d <= 1)
                    this._characterList[1].campMgr.SetDamage();
            }
            for (let k in this._characterList) {
                for (let i in this._characterList[k].HeroList) {
                    if (this._characterList[k].HeroList[i]) {
                        this._characterList[k].HeroList[i].OnEffectPassive();
                    }
                }
            }
            this.WinBuff(MatchLogic.Instance.winnerIndexInGroup);
            this._paiOperation.Dps();
            this.GMTools_AttrShow();
        }

        private WinBuff(type) {
            let id = type == 1 ? 0 : 1;
            let herolist = this._characterList[id].HeroList;
            for (let k in herolist) {
                if (herolist[k]) {
                    herolist[k].vo.attr.ModfiyAttributeValue(1, eValueType.Percent, 3500);
                }
            }
        }

        /**测试数据工具 */
        public GMTools_AttrShow() {
            if(!this.Characterlist[0]) return;
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
        }

        public OnFire() {
            this._bort = true;
            this.end = false;
            this.EntitySetTarget();
            Tick.Loop(100, this, this.OnUpdate);
        }

        private CaptainTarget(oid, eid) {
            for (let k in this._characterList[oid].HeroList) {
                if (this._characterList[oid].HeroList[k].bCaptain) {
                    this._characterList[oid].HeroList[k].CaptainTarget = this._characterList[eid].HeroList;
                }
            }
        }

        private setTarget(list1, list2) {
            let index = 0;
            /**给英雄赋值攻击目标 */
            for (let k in list1) {
                if (list1[k]) {
                    let hc = list1[k] as PHeroCrad;
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
        }

        private OnEffectPassive(list1) {
            for (let k in list1.HeroList) {
                if (list1.HeroList) {
                    list1.HeroList[k].OnEffectPassive();
                }
            }
        }

        public ResetT() {
            this.setTarget(this._characterList[0].HeroList, this._characterList[1].HeroList);
            this.setTarget(this._characterList[1].HeroList, this._characterList[0].HeroList);
        }

        public EntitySetTarget()  {
            // if (!this._bstart) {
            //     this._bstart = true;
            if (this.Characterlist.length <= 0) return;
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
            if (ViewUILogic.Instance.isAuto && CaptainSkill.DeputyCdTime <= 0) {
                Event.DispatchEvent(EventDefine.CAPATIAN_SKILL);
            }
        }

        public OnUpdate() {
            for (let k in this._characterList) {
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
                    Event.DispatchEvent("Ladderfightover");
                }

                if (this._starNum != -1) {
                    Tick.ClearAll(this);
                    this.end = true;
                    if (CustomsManager.Instance.CustomsType == Customs_Type.Ladder) {
                        if (this._nWin == 2) {
                            LadderManager.Instance.K_ReqLadderCombatEnd(this._starNum_C, this._nWin);
                        }
                        else {
                            LadderManager.Instance.K_ReqLadderCombatEnd(this._starNum, this._nWin);
                        }
                    }
                    else if (CustomsManager.Instance.CustomsType == Customs_Type.MatchChampion)  {
                        UIManager.Instance.CreateUI("MatchPKEndView", [ViewUpRoot]);
                    }
                    else {
                        KickingLogic.Instance.PvpCombatEnd(this._starNum, this._nWin);
                    }
                    UIManager.Instance.DestroyUI("FloatView", [AvatarEffectRoot]);
                }
            }
        }

        /**英雄循环攻击 */
        private HeroAttack(id1: number): void {
            let hf = this.Characterlist[id1].HeroList;
            if (!hf) return;
            let len = hf.length - 1;
            for (let i: number = len; i >= 0; i--) {
                let hc = hf[i] as PHeroCrad;
                if (!hc) return;
                let time = 0;
                /**第一位出手英雄 */
                let X = GameParamConfig["FastestHeroFirstAttackTime"];
                /**其他英雄出手 */
                let Y = GameParamConfig["OtherHeroFirstAttackTimeRatio"];
                if (i == len) {
                    time = X;
                }
                else {
                    let firstHero = hf[len] as PHeroCrad;
                    let F = firstHero.vo.ToSpeed;
                    time = X + (F - hc.vo.ToSpeed) * Y;
                }
                Tick.Once(time, this, () => {
                    hc.BClose = false;
                });
            }
        }

        private _dieIndex: number = 0;
        /**
        * 是否切换目标
        * 当前排或者中间3个没了，就切换 目标
        * 1vs1 2vs2 3vs3
        */
        private IsChangeTarget(): boolean {
            for (let m = 0; m < 3; m++) {
                let count = m + this._dieIndex;
                if (this.Characterlist[1].HeroList[count]) {
                    return false;
                }
            }
            return true;
        }

        /**
        * 集体切换目标
        */
        private GroupChangeTarget(): void {
            if (this.IsChangeTarget()) {
                this._dieIndex += 3;
                for (let i = 0; i < 9; i++) {
                    let index = i;
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
                            let t = this.NullTargetSelect(1);
                            this.Characterlist[0].HeroList[i].Target = [];
                            this.Characterlist[0].HeroList[i].Target.push(t);
                        }
                    }
                }
            }
            else {
                for (let i = 0; i < 9; i++) {
                    if (this.Characterlist[0].HeroList[i] && this.Characterlist[0].HeroList[i].Target.length == 0) {
                        for (let m = 0; m < 3; m++) {
                            let count = m + this._dieIndex;
                            if (this.Characterlist[1].HeroList[count]) {
                                this.Characterlist[0].HeroList[i].Target.push(this.Characterlist[1].HeroList[count]);
                            }
                        }
                        if (this.Characterlist[0].HeroList[i].Target.length == 0) {
                            if (this.Characterlist[0].HeroList[i]) {
                                let t = this.NullTargetSelect(1);
                                this.Characterlist[0].HeroList[i].Target = [];
                                this.Characterlist[0].HeroList[i].Target.push(t);
                            }
                        }
                    }
                }
            }
        }


        private NullTargetSelect(id) {
            for (let k in this.Characterlist[id].HeroList) {
                if (this.Characterlist[id].HeroList[k]) {
                    return this.Characterlist[id].HeroList[k];
                }
            }
        }

        private _dieIndex_e: number = 0;
        private IsChangeTarget_E(): boolean {
            for (let m = 0; m < 3; m++) {
                let count = m + this._dieIndex_e;
                if (this.Characterlist[0].HeroList[count]) {
                    return false;
                }
            }
            return true;
        }

        /**
        * 集体切换目标
        */
        private GroupChangeTarget_E(): void {
            if (this.IsChangeTarget_E()) {
                this._dieIndex_e += 3;
                for (let i = 0; i < 9; i++) {
                    let index = i;
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
                            let t = this.NullTargetSelect(0);
                            this.Characterlist[1].HeroList[i].Target = [];
                            this.Characterlist[1].HeroList[i].Target.push(t);
                        }
                    }
                }
            }
            else {
                for (let i = 0; i < 9; i++) {
                    if (this.Characterlist[1].HeroList[i] && this.Characterlist[1].HeroList[i].Target.length == 0) {
                        for (let m = 0; m < 3; m++) {
                            let count = m + this._dieIndex_e;
                            if (this.Characterlist[0].HeroList[count]) {
                                this.Characterlist[1].HeroList[i].Target.push(this.Characterlist[0].HeroList[count]);
                            }
                        }
                        if (this.Characterlist[1].HeroList[i].Target.length == 0) {
                            let t = this.NullTargetSelect(0);
                            this.Characterlist[1].HeroList[i].Target = [];
                            this.Characterlist[1].HeroList[i].Target.push(t);
                        }
                    }
                }
            }
        }
        /** 中断平局*/
        public Dispone() {
            this._starNum = 0;
            this._nWin = 0;
            this.end = true;
            KickingLogic.Instance.PvpCombatEnd(this._starNum, this._nWin);
            Tick.ClearAll(this);
            UIManager.Instance.DestroyUI("FloatView", [AvatarEffectRoot]);
        }

        public BattleComBat() {
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
        }
        /**星级 0星是我方失败*/
        private _starNum_C: number = -1;

        public BattleComBat_C() {
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
        }
        /**获取存活英雄数量 */
        public getHeroNum(id) {
            let index = 0;
            for (let k in this._characterList[id].HeroList) {
                if (this._characterList[id].HeroList[k]) {
                    index += 1;
                }
            }
            return index;
        }

        public Destroy() {
            // this._bstart = false;
            this._bort = false;
            this._starNum = -1;
            this._nWin = -1;
            // Tick.Clear(this,this.OnUpdate);
            Tick.ClearAll(this);
            for (let k in this._characterList) {
                if (this._characterList[k]) {
                    this._characterList[k].Destroy();
                    this._characterList[k] = null;
                }
            }
            this._characterList = [];
        }

    }
}