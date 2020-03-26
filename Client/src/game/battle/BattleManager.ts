/*
* 战斗管理类;
*/
module H52D_Framework {
    export class BattleManager {
        private static _inst: BattleManager;

        public static get Instance() {
            if (BattleManager._inst == null) {
                BattleManager._inst = new BattleManager();
            }
            return BattleManager._inst;
        }

        private _dieIndex: number = 0;
        private _monsterFormation: Formation = null;

        private _isBorth: boolean = false;
        // 点击次数
        public clickNum: number = 0;
        // 英雄攻击次数
        public heroAttackNum: number = 0;
        // 宠物攻击次数
        public petAttackNum: number = 0;
        // 点击暴击次数
        public clickCritNum: number = 0;
        public bStopBattle: boolean = false;

        public get HeroCardMgr() { return HeroCardManager.Instance; }
        public get MonsterFormation() { return this._monsterFormation; }

        /**判断怪物是否已经生成,
         * true 生成
         * false 没有生成
         */
        public get IsBorth() {
            return this._isBorth;
        }

        private _isOnce: boolean = false;
        /**AI计算 */
        private _aIOperation: AIOperation;
        public get aIOperation() {
            return this._aIOperation;
        }

        /**指令状态机 */
        private _stateOperation: StateOperation;
        /**给服务器传的点击数 */
        private _IndexNumber: number = 0;
        /**当前点击数 */
        private _TapIndex: number = 0;
        /**记录点击的时间 */
        private _tapTime: number = 0;
        /**记录上一次点击时间 */
        private _lasttapTime: number = 0;
        /**开启DPS刷新 */
        private _isOpen: boolean = false;
        private TriggerBubblNum: number = 0;
        private tirgegrBubblJudge: boolean = false;
        /**战斗开启 */
        private _isOpenB: boolean = false;
        /**队长技能 状态*/
        private _SAutoState: boolean = false;



        /**初始化 */
        constructor() {
            Event.RegistEvent(EventDefine.BEGIN_FIRE, Laya.Handler.create(this, this.OnFire));
            Event.RegistEvent(EventDefine.MAIN_VIEW_CLICK, Laya.Handler.create(this, this.OnClick));
            Event.RegistEvent("ChallengeBossFail", Laya.Handler.create(this, this.BattleFail));
            Event.RegistEvent("StopBubbleMonster", Laya.Handler.create(this, this.StopBubbleMonster));
            Event.RegistEvent("AchievenAttackNum", Laya.Handler.create(this, this.AchievenAttackNum));
            this._aIOperation = new AIOperation();
            this._stateOperation = new StateOperation();
            Tick.Loop(100, this, this.Update);
            Tick.Loop(10, this, this.cdUpdate);
            Tick.Once(200, this, () => {
                /**图鉴属性 */
                MHAManager.Instance.Init();
            });
            //临时改bug
            this._monsterFormation = null;
            this._monsterFormation = new Formation();
        }

        public Initialize(callBack): void {
            this._aIOperation = new AIOperation();
            this._stateOperation = new StateOperation();
            /**执行英雄初始化,加载资源 */
            this.HeroCardMgr.AvatarInit(callBack);
            this._monsterFormation = null;
            this._monsterFormation = new Formation();
            PlaySkill.Init.SetSkillIDList();
        }

        /**进入战斗 */
        private OnFire(): void {
            this._bdirct = false;
            this.TheWordBossDamage = 0;
            this.TheMatchBossDamage = 0;
            if (!this.HeroCardMgr && !this.HeroCardMgr.CHeroList && ObjIsEmpty(this.HeroCardMgr.CHeroList)) return;
            this.Select();
            this.HeroCardMgr.HeroAttack();
            this.HeroCardMgr.OnEffectPassive();
            if (CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                this.MemoryInit();
                this.Selectmonster();
                MonsterManager.Instance.MonsterAttack();
                CaptainSkill.CurCdTime = 0;
            }
            this._matchEnd = false;
            /** 如果当前勾选了技能则自动释放 */
            if (ViewUILogic.Instance.isAuto && CaptainSkill.CurCdTime <= 0) {
                Event.DispatchEvent(EventDefine.CAPATIAN_SKILL);
            }
            this._isBorth = true;
        }


        /**选择目标 */
        private Select() {
            let monster = MonsterManager.Instance.monsterList;
            if (monster) {
                this._monsterFormation.GetFormatInfo(monster);
            }
            if (this.HeroCardMgr.CHeroList) {
                for (let i = 0; i < GetTabLength(this.HeroCardMgr.CHeroList); i++) {
                    let hc = this.HeroCardMgr.CHeroList[i];
                    if (hc && this._monsterFormation) {
                        hc.Target = [];
                        hc.Close = true;
                        //if (this._monsterFormation) {
                            hc.Target.push(this._monsterFormation.GetFrontobject[0]);
                        //}
                    }
                }
            }

            if (BPetManager.Instance.PetIns) {
                BPetManager.Instance.SetTarget(this._monsterFormation.GetFrontobject[0]);
            }
            if (BCampManager.Instance.Camp) {
                BCampManager.Instance.SetTarget(this._monsterFormation.GetFrontobject[0]);
            }
        }


        private Selectmonster() {
            let monsterList = MonsterManager.Instance.monsterList;
            let heroList = this.HeroCardMgr.CHeroList
            if (monsterList) {
                for (let i = 0; i < GetTabLength(monsterList); i++) {
                    let m = monsterList[i];
                    if (m) {
                        m.Target = [];
                        m.Close = true;
                    }
                }
            }
            let index = 0;
            /**给英雄赋值攻击目标 */
            for (let i = 0; i < GetTabLength(monsterList); i++) {
                let m = monsterList[i];
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
                    let target = heroList[index];
                    m.Target = [];
                    m.Target.push(target);
                }
            }
        }

        /**更新函数 */
        private Update(): void {
            PlaySkill.Init.OnUpdate();
            if (this._isOpenB) return;
            this.EntityUpdate();
            if (!this._isBorth) return;
            if (CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                if (!this.bOver)
                    this.MemoryUpdate();
            }
            else {
                this.MainCopyUpdate();
            }
        }
        /**主线副本更新 */
        private MainCopyUpdate() {
            this.LastMosterLocation = this.LastMosterLocationF();
            this.BattleSuccess();
            this.MonsterDieLogic();
        }



        /**怪物切换目标 */
        private MonsterSetOneTarget() {
            for (let k in this.MonsterFormation.Getobject) {
                if (this.MonsterFormation.Getobject[k]) {
                    if (this.MonsterFormation.Getobject[k].Target[0] == null || this.MonsterFormation.Getobject[k].Target[0].IsDie) {
                        this.MonsterFormation.Getobject[k].Target = [];
                        this.MonsterFormation.Getobject[k].Target.push(this.SelectHeroSort());
                    }
                }
            }
        }

        private SelectHeroSort() {
            let MinHero = null;
            let index = 0;
            for (let i = 0; i < this.HeroCardMgr.CHeroList.length; i++) {
                if (this.HeroCardMgr.CHeroList[index]) {
                    MinHero = this.HeroCardMgr.CHeroList[index];
                }
                else {
                    index += 1;
                }
            }
            return MinHero;
        }

        private EntityUpdate() {
            if (this.HeroCardMgr && this.HeroCardMgr.CHeroList) {
                for (let k in this.HeroCardMgr.CHeroList) {
                    if (this.HeroCardMgr.CHeroList[k])
                        this.HeroCardMgr.CHeroList[k].OnUpdate();
                }
            }
            if (BPetManager.Instance.PetIns) {
                BPetManager.Instance.PetIns.OnUpdate();
            }
            if (BCampManager.Instance.Camp) {
                BCampManager.Instance.Camp.OnUpdate();
            }
        }



        /**The Last Monster for Location  */
        public LastMosterLocation: Laya.Point;

        /**获得最后一个英雄的位置信息 */
        private LastMosterLocationF(): Laya.Point {
            let location: Laya.Point = new Laya.Point(0, 0);
            let monster: Monster;
            let monstersList = this._monsterFormation ? this._monsterFormation.Getobject : null;

            if (monstersList) {
                let Len = GetTabLength(monstersList);
                if (Len <= 0) {
                    monster = null;
                }
                else if (Len == 1) {
                    monster = monstersList[0];
                }
                else {
                    let index = 0;
                    for (let i = 0; i < Len; i++) {
                        if (monstersList[i] == null) {
                            index += 1;
                        }
                        let num = Len - index;
                        if (num == 1) {
                            for (let j = 0; j < Len; j++) {
                                if (monstersList[j]) {
                                    monster = monstersList[j] as Monster;
                                }
                            }
                        }
                    }
                }
            }
            if (monster && monster.avatar != null) {
                location.x = MonsterLocal[monster.vo.location][0] * G_StageWidthScale;
                location.y = MonsterLocal[monster.vo.location][1] - monster.avatar.height;
            }
            return location;
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
                    if (this._monsterFormation.Getobject[index]) {
                        this.HeroCardMgr.CHeroList[i].Target = this._monsterFormation.Getobject[index];
                    }
                }
            }
        }

        /**
         * 是否切换目标
         * 当前排或者中间3个没了，就切换 目标
         * 1vs1 2vs2 3vs3
         */
        private IsChangeTarget(): boolean {
            for (let m = 0; m < 3; m++) {
                let count = m + this._dieIndex;
                if (this._monsterFormation.Getobject[count]) {
                    return false;
                }
            }
            return true;
        }

        /**设置一个目标
         * 当前排少了一个，空目标的英雄会去选择最小数字的那个怪物
         * 如 0 1 2 2死  就切换去打0
         */
        private SetOnceTarget(): void {
            if (this.HeroCardMgr && this.HeroCardMgr.CHeroList) {
                for (let i: number = 0; i < GetTabLength(this.HeroCardMgr.CHeroList); i++) {
                    if (this.HeroCardMgr.CHeroList[i]) {
                        if (!this.HeroCardMgr.CHeroList[i].Target) {
                            this.HeroCardMgr.CHeroList[i].Target = [];
                            for (let j = 0; j < GetTabLength(this._monsterFormation.Getobject); j++) {
                                if (this._monsterFormation.Getobject[j]) {
                                    this.HeroCardMgr.CHeroList[i].Target = this._monsterFormation.Getobject[j];
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }

        /*** 怪物死亡刷新逻辑*/
        private MonsterDieLogic(): void {
            for (let i = 0; i < GetTabLength(this._monsterFormation.Getobject); i++) {
                if (this._monsterFormation.Getobject[i] != null) {
                    if (this._monsterFormation.Getobject[i].afterDie == true) {
                        this._monsterFormation.Getobject[i] = null;
                    }
                }
            }
        }

        /**英雄死亡逻辑 */
        private HeroDieLogic(): void {
            for (let i = 0; i < this.HeroCardMgr.CHeroList.length; i++) {
                if (this.HeroCardMgr.CHeroList[i] != null) {
                    if (this.HeroCardMgr.CHeroList[i].isDown == true) {
                        this.HeroCardMgr.CHeroList[i] = null;
                    }
                }
            }
        }

        /**判断是不是过关成功 */
        private isSuccess(): number {
            if (!this._monsterFormation.Getobject) {
                return 0;
            }
            for (let i = 0; i < GetTabLength(this._monsterFormation.Getobject); i++) {
                if (this._monsterFormation.Getobject[i]) {
                    if (this._monsterFormation.Getobject[i].afterDie) {
                        this._monsterFormation.Getobject[i].afterDie = false;
                        if (CustomsManager.Instance.bBoss) {
                            Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_2);
                            Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_4);
                            Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_10);
                            Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_12);
                            Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_13);
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
        }

        /** 是否有活着第目标 */
        public IsHasAliveTarget() {
            if (!this._monsterFormation) {
                return false
            }
            if (!this._monsterFormation.Getobject) {
                return false;
            }
            for (let i = 0; i < GetTabLength(this._monsterFormation.Getobject); i++) {
                if (this._monsterFormation.Getobject[i]) {
                    if (this._monsterFormation.Getobject[i].currentHp > 0) {
                        return true;
                    }
                }
            }
            return false;
        }

        // 当前累积伤害
        public TheWordBossDamage: number = 0;
        private bWordBoss: boolean = false;
        public TheMatchBossDamage: number = 0;

        private AchievenAttackNum() {
            //英雄攻击次数
            MasterPlayer.Instance.ReqOnEvent(EventProEnum.HeroAttack, this.heroAttackNum);
            this.heroAttackNum = 0;
            //神兽攻击次数
            MasterPlayer.Instance.ReqOnEvent(EventProEnum.PetAttack, this.petAttackNum);
            this.petAttackNum = 0;
            //点击暴击次数
            MasterPlayer.Instance.ReqOnEvent(EventProEnum.GetClickCritNum, this.clickCritNum);
            this.clickCritNum = 0;
            //点击次数
            RemoteCall.Instance.Send("K_ReqClickTimes", this.clickNum);
            this.clickNum = 0;
            //刷新成就页面
            Event.DispatchEvent("UpdateAchievenDate");
        }

        /**即可通关 */
        public bdirct() {
            this._bdirct = true;
            for (let k in this._monsterFormation.Getobject) {
                if (this._monsterFormation.Getobject[k]) {
                    this._monsterFormation.Getobject[k].setHp();
                }
            }
            this._monsterFormation.Destroy();
            this._bdirct = true;
            Event.DispatchEvent("Destroy_s");
        }

        /**是否立即通关 */
        private _bdirct: boolean = false
        /**战斗胜利 */
        private BattleSuccess() {
            let success: number = this._bdirct ? 1 : this.isSuccess();
            if (success > 0 && this._isBorth) {
                if (success == 1) {
                    if (this._bdirct) this._isBorth = false;
                    Event.DispatchEvent("CUSTOMS_RESULT", [true]);
                }
                else if (success == 2) {
                    this._isBorth = false;
                    this._monsterFormation.Destroy();
                    Event.DispatchEvent("Destroy_s");
                    CustomsManager.Instance.FightUpdate();
                }
            }
        }
        private _matchEnd: boolean = true;
        public get MathcEnd() { return this._matchEnd; }
        /**战斗失败 */
        public BattleFail() {
            /**buff为-1的销毁 */
            Event.DispatchEvent("Destroy_s");
            //提示没在指定时间内打败，进入循环打小怪模式
            if (CustomsManager.Instance.CustomsType == Customs_Type.Boss) {
                BattleManager.Instance.StopBattle();
                WroldBossLogic.Instance.Buff_Del();
                UIManager.Instance.CreateUI("WroldBossEndView", [ViewUpRoot]);
                if (UIManager.Instance.IsHave("WroldBossBuffView", ViewUpRoot)) {
                    UIManager.Instance.DestroyUI("WroldBossBuffView", [ViewUpRoot])
                }
            }
            //如果是Pk联赛海选阶段
            else if (CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                BattleManager.Instance.StopBattle();
                UIManager.Instance.CreateUI("MatchBossEndView", [ViewUpRoot]);
                this._matchEnd = true;
            }
            else {
                Event.DispatchEvent("CUSTOMS_RESULT", [false]);
            }
        }

        /**暂停战斗 */
        public StopBattle() {
            this.bStopBattle = true;
            this._isOpenB = true;
        }

        /**开启战斗 */
        public OpenBattle() {
            if (CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                PlaySkill.Init.bclose = true;
            }
            if (ViewUILogic.Instance.isAuto && CaptainSkill.CurCdTime <= 0) {
                Event.DispatchEvent(EventDefine.CAPATIAN_SKILL);
            }
            this.bStopBattle = false;
            this._isOpenB = false;
        }

        private cdNumber = 1000 / GameParamConfig["ClickMaxEffectiveNumPerSecond"];
        private cd: number = 0;
        private cdUpdate() {
            if (this.cd > 0)
                this.cd -= 10;
        }

        public oClick: boolean = false;
        /**接收到点击事件 */
        public OnClick(strEvent?) {
            if (!this.IsHasAliveTarget() || this.oClick || this.cd > 0) {
                return
            }
            this.cd = this.cdNumber;

            if (BubbleManager.Instance.bMonsterFirst) {
                let startTime = GameParamConfig.MonsterHidden[1] * 1000;
                Tick.Once(startTime, this, this.StartBubbleFirst, [], false);
                this.TriggerBubblNum += 1;
            }

            this.clickNum++;
            let params = this._aIOperation.Do();
            this._stateOperation.Do(params, strEvent);
            this.TapTarget();
            this.DPSshow(params[1]);
        }

        private TapTarget(): void {
            let index: number = 0;
            let num = GetTabLength(this._monsterFormation.Getobject);
            for (let j = 0; j < num; j++) {
                if (this._monsterFormation.Getobject[j] != null) {
                    this.RememberNumber();
                    this._IndexNumber += 1;
                    index = j;
                    return;
                }
            }
        }

        private StartBubbleFirst() {
            let clickNum = GameParamConfig.MonsterHidden[2];
            if (this.TriggerBubblNum >= clickNum) {
                this.TriggerBubblNum = 0;
                if (BubbleManager.Instance.bMonsterBubble) {
                    Tick.Once(2000, this, this.StartBubbleMonster, [], false);
                }
            }
        }

        private StartBubbleMonster() {
            Event.DispatchEvent("StartBubbleMonster", [E_BubbleType.eMonster, 1, 20000, false, false])
        }

        private StopBubbleMonster() {
            Tick.Clear(this, this.StartBubbleFirst);
            Tick.Clear(this, this.StartBubbleMonster);
            this.TriggerBubblNum = 0;
        }

        /**记每6S的点击次数，给服务器 */
        private RememberNumber(): void {
            if (this._IndexNumber != 0) {
                if (!this._isOnce) {
                    Tick.Once(60000, this, () => {
                        this._isOnce = false;
                        Event.DispatchEvent(EventDefine.TAP_NUMBER, [this._IndexNumber]);
                        this._IndexNumber = 0;
                    });
                }
                this._isOnce = true;
            }
        }

        /**总DPS小面板 */
        private DPSshow(damage: number): void {
            let DpsCountingInterval: number = GameParamConfig["DpsCountingInterval"] + 10;
            let DpsPurgeInterval: number = GameParamConfig["DpsPurgeInterval"];
            this._TapIndex += 1;
            if (!this._isOpen && this._aIOperation) {
                this._isOpen = true;
                Tick.Loop(DpsCountingInterval, this, () => {
                    if (this._tapTime >= DpsPurgeInterval && this._lasttapTime > 1000) {
                        this._tapTime = 0;
                        this._TapIndex = 0;
                        if (!this._aIOperation) return;
                        Event.DispatchEvent(EventDefine.ALL_DPS, [this.aIOperation.AllDps]);
                        return;
                    }
                    this._lasttapTime = this._tapTime - this._lasttapTime;
                    this._tapTime += DpsCountingInterval;
                    let currentTime = this._tapTime / 1000;
                    if (!this._aIOperation) return;
                    let heroDps = this.aIOperation.AllDps;
                    let idamage = 0;
                    if (currentTime >= 1) {
                        idamage = (this._TapIndex * damage / currentTime) + heroDps >> 0;
                    }
                    else {
                        idamage = this._TapIndex * damage + heroDps >> 0;
                    }
                    Event.DispatchEvent(EventDefine.ALL_DPS, [idamage.toString()]);
                });
            }
        }

        /**切换Boss用 */
        public DestroyMonster(): void {
            Event.DispatchEvent("Destroy_s");
            for (let i = 0; i < this._monsterFormation.Getobject.length; i++) {
                if (this._monsterFormation.Getobject[i])
                    this._monsterFormation.Getobject[i].IsDie = true;
            }
            MonsterManager.Instance.Destroy();
            this._monsterFormation.Destroy();
            if (this.HeroCardMgr && this.HeroCardMgr.CHeroList) {
                for (let i = 0; i < GetTabLength(this.HeroCardMgr.CHeroList); i++) {
                    let hc = this.HeroCardMgr.CHeroList[i];
                    if (hc)
                        hc.ClearTarget();
                }
            }
        }

        /**记忆副本———————————————————————————————————————————————————— */
        /**当前时间 */
        private _curTime = 0;
        /**当前时间 */
        public get curtime() { return this._curTime; }
        /**被击数 */
        public static hitNum = 0;
        /**总伤害量 */
        public static damageAll = 0;
        /**1为胜利 2为失败 */
        private _nWin = 2;
        public get nWin() { return this._nWin; }
        /**三星结果 */
        public StarList = [0, 0, 0];
        /**三星条件 */
        private _nStarCond = [];
        /**通关类型 */
        private _PassType = 0;
        public get PassType() { return this._PassType; }
        /**通关值 */
        private _PassValue = 30;
        /**三星值 */
        private _StarValue = [];
        /**副本id */
        public copyid = 0;

        private _ccod: Array<CopyCond> = [];
        private _bOver = false;
        /**记忆副本是否结束 */
        public get bOver() { return this._bOver; }
        /**保证结果只返回一次 */
        private _ReslustOnce = false;
        public static mDieNumber = 0;
        public static hDienumber = 0;

        /**初始化记忆副本属性 */
        public MemoryInit() {
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
        }

        /**初始化胜利 星级条件 */
        private GetVectorCond() {
            this._StarValue = [];
            this._nStarCond = [];
            this._ccod = [];
            let cfg = CopyConfig[MemoryType.equip][this.copyid];
            let starCfg = cfg["StarConditon"];
            let starvalue = cfg["StarValue"];
            for (let k in starCfg) {
                this._nStarCond.push(starCfg[k]);
            }
            for (let k in starvalue) {
                this._StarValue.push(starvalue[k]["1"]);
            }
            this._PassType = cfg["PassType"];
            this._PassValue = cfg["PassValue"];
            for (let i = 0; i < this._nStarCond.length; i++) {
                let copy = new CopyCond(i, this._nStarCond[i], this._StarValue[i]);
                this._ccod[i] = copy;
            }
        }

        /**星级判断  战斗结束后判断*/
        private SelectVertor_End() {
            for (let k in this._ccod) {
                if (this._ccod[k]) {
                    this._ccod[k].OnEffect();
                }
            }
        }

        /**星级判断 战斗中判断*/
        private SelectVertor_Loop() {
            for (let k in this._ccod) {
                if (this._ccod[k]) {
                    if (this._ccod[k].Type == 6 || this._ccod[k].Type == 4) {
                        this._ccod[k].OnEffect();
                    }
                }
            }
        }

        /**记忆副本 胜利或者失败 */
        private isMemorySuccsec() {
            if (this._curTime >= 30 * 1000 || this._PassType == 1 && this._nWin == 1 || this.bEnemyDie()) {
                this._bOver = true;
            }
            else if (!this.bOwnerDie()) {
                this._bOver = true;
            }
        }

        /**通关条件 */
        private EndCond(index, i, value) {
            switch (index - 1) {
                case 0:
                    this.EnemyAllDie(i, value);
                    break;
                case 1:
                    this.LifeTime(i, value);
                    break;
            }
        }

        /**怪物死亡即为胜利 */
        private EnemyAllDie(i, value) {
            let v = value * 1000;
            if (this._curTime <= v && this.bEnemyDie()) {
                this._nWin = 1;
            }
        }

        /**生存时间到了 即为胜利 */
        private LifeTime(i, value) {
            let v = value * 1000;
            if (this._curTime >= v && this.bOwnerDie()) {
                this._nWin = 1;
            }
        }

        /**敌人是否全部死亡  true为死亡 */
        private bEnemyDie() {
            for (let k in this._monsterFormation.Getobject) {
                if (this._monsterFormation.Getobject[k]) {
                    return false;
                }
            }
            return true;
        }

        /**英雄是否全部死亡  false为死亡 */
        private bOwnerDie() {
            for (let k in this.HeroCardMgr.CHeroList) {
                if (this.HeroCardMgr.CHeroList[k]) {
                    return true;
                }
            }
            return false;
        }

        /**记忆副本更新 */
        private MemoryUpdate() {
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
        }

        /**记忆副本结束 */
        public MemeryEnd() {
            this.SelectVertor_End();
            MemoryLogic.Instance.ReqPassDungeon(MemoryType.equip, this.copyid, this.nWin, this.StarList);
            this.Destroy();
        }
        /** ---------------------------------------------------------------------------------*/

        /**销毁 */
        public Destroy() {
            Event.DispatchEvent("Destroy_s");
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
            PlaySkill.Init.bclose = false;
            BPetManager.Instance.Destroy();
            BCampManager.Instance.Destroy();
            MonsterManager.Instance.Destroy();
            if (this._monsterFormation)
                this._monsterFormation.Destroy();
        }


    }
} 