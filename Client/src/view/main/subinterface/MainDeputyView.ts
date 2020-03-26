module H52D_Framework {

    /**
     * @class：副本页面
     * @author：zhangyusong
     */
    export class MainDeputyView extends ui.main.subinterface.MainDeputyViewUI implements IViewPanel {
        private readonly COUNTDOWN: string = "倒计时:xS";
        /** 倒计时表现类 */
        private countdown: Countdwon;
        /** 战斗倒计时 */
        private _fireCountdown: number;
        private set fireCountdown(value: number) {
            this._fireCountdown = value;
            this.txt_countdown.text = this.COUNTDOWN.replace("x", String(this._fireCountdown));
        }
        private get fireCountdown() {
            return this._fireCountdown;
        }

        public constructor() {
            super();
            this.ViewInit();
            this.EventInit();
        }

        public Destroy(): void {
            this.Quit_boss();
        }

        private ViewInit() {
            this.countdown = new Countdwon(false);
            this.countdown.centerX = 0;
            this.countdown.centerY = 0;
            this.addChild(this.countdown);
            this.Btn_buff.visible = false;
            this.btn_memory.visible = false;
        }

        private EventInit() {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_close.on(Laya.Event.CLICK, this, this.OnCloseHander);
            Event.RegistEvent("ShowDeputy", Laya.Handler.create(this, this.ShowDeputy));
            Event.RegistEvent("DeputyFireStart", Laya.Handler.create(this, this.DeputyStart));
            Event.RegistEvent("DeputyClose", Laya.Handler.create(this, this.DeputyClose));
        }

        private ShowDeputy() {
            if (CustomsManager.Instance.CustomsType == Customs_Type.Kicking) {
                this.tatil.text = GetInfoAttr.Instance.GetTitle(E_OpenGrade.KICKING);
            }
            else if (CustomsManager.Instance.CustomsType == Customs_Type.Ladder) {
                this.tatil.text = GetInfoAttr.Instance.GetTitle(E_OpenGrade.LADDER);
            }
            else if (CustomsManager.Instance.CustomsType == Customs_Type.Boss) {
                this.tatil.text = GetInfoAttr.Instance.GetTitle(E_OpenGrade.BOSS);
                //this.Btn_buff.visible = true;
                this._fireCountdown = CustomsManager.Instance.CustomsVo.waveTime
                this.Btn_buff.on(Laya.Event.CLICK, this, this.OpenView, ["WroldBossBuffView"]);
            }
            else if (CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                this.tatil.text = GetInfoAttr.Instance.GetTitle(E_OpenGrade.MEMORY);
                //this.btn_memory.visible = true;                
                this.btn_memory.on(Laya.Event.CLICK, this, this.OpenView, ["MemoryTargetView"]);
            }
            else if (CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                //this.tatil.text = GetInfoAttr.Instance.GetTitle(E_OpenGrade.PKMATCH);
                this.tatil.text = "海选大赛";
            } else if (CustomsManager.Instance.CustomsType == Customs_Type.MatchChampion) {
                this.tatil.text = GetInfoAttr.Instance.GetTitle(E_OpenGrade.PKMATCH);
            }
            this.Btn_buff.visible = CustomsManager.Instance.CustomsType == Customs_Type.Boss;
            this.btn_memory.visible = CustomsManager.Instance.CustomsType == Customs_Type.Memory;
        }

        private OnCloseHander() {
            if (CustomsManager.Instance.CustomsType == Customs_Type.Kicking ||
                CustomsManager.Instance.CustomsType == Customs_Type.Memory ||
                CustomsManager.Instance.CustomsType == Customs_Type.Ladder
            ) {
                UIManager.Instance.CreateUI("KickingPromptView", [ViewUpRoot, CustomsManager.Instance.CustomsType, () => { this.DeputyClose() }]);
            }
            else if (CustomsManager.Instance.CustomsType == Customs_Type.Boss) {
                this.DeputyClose();
            }
            else if (CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {

                this.DeputyClose();
            }
            else if (CustomsManager.Instance.CustomsType == Customs_Type.MatchChampion) {
                this.DeputyClose();
            }
        }

        private DeputyClose() {
            if (UIManager.Instance.IsHave("KickingPromptView", ViewUpRoot)) {
                KickingLogic.Instance.PvpCombatEnd(0, 2, false);
                UIManager.Instance.DestroyUI("KickingPromptView", [ViewUpRoot]);
            }
            this.countdown.Destroy();
            Tick.Clear(this, this.FireCountdown);
            //退出王者约战
            if (CustomsManager.Instance.CustomsType == Customs_Type.Kicking) {
                UIManager.Instance.CreateUI("KickingChooseView", [ViewUpRoot]);
            }
            //退出世界Boss
            else if (CustomsManager.Instance.CustomsType == Customs_Type.Boss) {
                WroldBossLogic.Instance.Buff_Del();
                WroldBossLogic.Instance.SendHrut();
                if (UIManager.Instance.IsHave("WroldBossBuffView", ViewUpRoot)) {
                    UIManager.Instance.DestroyUI("WroldBossBuffView", [ViewUpRoot])
                }
                Event.DispatchEvent("BossThrough");
                this.Quit_boss();
            }
            //退出天梯竞技
            else if (CustomsManager.Instance.CustomsType == Customs_Type.Ladder) {
                UIManager.Instance.CreateUI("LadderView", [ViewDownRoot]);
                LadderManager.Instance.IsMatching = false;
            }
            //退出时段记忆
            if (CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                if (UIManager.Instance.IsHave("MemoryTargetView", ViewUpRoot)) {
                    UIManager.Instance.DestroyUI("MemoryTargetView", [ViewUpRoot])
                }
                MemoryLogic.Instance.ActivityInfo();
            }
            //退出Pk联赛海选
            if (CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                //发送伤害
                MatchLogic.Instance.SendHurt();
                //上傳pk陣容
                DataManager.Instance.PackData_m();
                //上传阵容dps伤害和血量
                DataManager.Instance.SendCapacityData();

                //清理倒计时数据
                Event.DispatchEvent("BossThrough");

                Event.DispatchEvent("StopClick", [true])
                Event.DispatchEvent("SkillMouseEnable");
            }
            //退出PK联赛决赛
            if (CustomsManager.Instance.CustomsType == Customs_Type.MatchChampion) {
                if (MatchLogic.Instance.curMatchStage == MacthType.eLeagueWar1) {
                    UIManager.Instance.CreateUI("ChampionPraiseView", [ViewUpRoot]);
                }

                Event.DispatchEvent("StopClick", [true])
                Event.DispatchEvent("SkillMouseEnable");
            }
            //回主场景
            BattlefieldManager.Instance.Destroy();
            CustomsManager.Instance.LeaveCustomsManager();
            BattleManager.Instance.OpenBattle();
            Event.DispatchEvent("ShowDeputy");
        }

        private DeputyStart() {
            this.fireCountdown = CustomsManager.Instance.CustomsVo.waveTime;
            this.countdown.time = 3;
            Tick.Once(600, this, () => {
                this.countdown.Start(Laya.Handler.create(this, this.Start));
            });
        }

        private Start() {
            if (CustomsManager.Instance.CustomsType == Customs_Type.Kicking ||
                CustomsManager.Instance.CustomsType == Customs_Type.Ladder) {
                this.PvpStart();
            }
            else if (CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                this.MemoryStart();
            }
            else if (CustomsManager.Instance.CustomsType == Customs_Type.Boss) {
                this.BossStart();
            }
            else if (CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                this.MatchBossStart();
            }
            else if (CustomsManager.Instance.CustomsType == Customs_Type.MatchChampion) {
                this.MatchChampionStart();
            }
        }

        /**Pvp开始回调 */
        private PvpStart() {
            this.PlayFightCharacter();
            BattlefieldManager.Instance.OnFire();
            this.fireCountdown = this.fireCountdown;
            Tick.Loop(1000, this, this.FireCountdown);
            BattleManager.Instance.StopBattle();
            Event.DispatchEvent("SkillMouseEnable");
        }

        private BossStart() {
            this.fireCountdown = this.fireCountdown;
            Tick.Loop(1000, this, this.FireCountdown);
            Event.DispatchEvent("StopClick", [true]);
            CaptainSkill.CurCdTime = 0;
            BattleManager.Instance.OpenBattle();
            Event.DispatchEvent(EventDefine.BEGIN_FIRE);
            Event.DispatchEvent("SkillMouseEnable");
        }

        private MatchBossStart() {
            this.fireCountdown = this.fireCountdown;
            Tick.Loop(1000, this, this.FireCountdown);
            //不容许点击
            Event.DispatchEvent("StopClick", [false]);
            CaptainSkill.CurCdTime = 0;
            BattleManager.Instance.OpenBattle();
            Event.DispatchEvent(EventDefine.BEGIN_FIRE);
            //开启技能
            //Event.DispatchEvent("SkillMouseEnable");
        }

        private MatchChampionStart() {
            this.PlayFightCharacter();
            BattlefieldManager.Instance.OnFire();
            this.fireCountdown = this.fireCountdown;
            Tick.Loop(1000, this, this.FireCountdown);
            BattleManager.Instance.StopBattle();
            //不容许点击
            Event.DispatchEvent("StopClick", [false]);
        }

        // private FireCountDown()  {

        // }

        // /**主线关卡 开始回调 */
        // private MainStart() {
        //     this.PlayFightCharacter();
        //     this.fireCountdown = this.fireCountdown;
        //     Tick.Loop(1000, this, this.FireCountdown);
        //     Event.DispatchEvent(EventDefine.BEGIN_FIRE);
        //     Event.DispatchEvent("SkillMouseEnable");
        // }

        /**记忆副本 开始回调 */
        private MemoryStart() {
            this.PlayFightCharacter();
            this.fireCountdown = this.fireCountdown;
            Tick.Loop(1000, this, this.FireCountdown);
            Event.DispatchEvent(EventDefine.BEGIN_FIRE);
            Event.DispatchEvent("SkillMouseEnable");
        }

        private FireCountdown() {
            if (--this.fireCountdown > 0) {
                if (CustomsManager.Instance.CustomsType == Customs_Type.Kicking ||
                    CustomsManager.Instance.CustomsType == Customs_Type.Ladder) {
                    if (BattlefieldManager.Instance.end) {
                        Tick.Clear(this, this.FireCountdown);
                        BattleManager.Instance.OpenBattle();
                    }
                }
                else if (CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                    if (BattleManager.Instance.bOver) {
                        Tick.Clear(this, this.FireCountdown);
                        MemoryLogic.Instance.surplusTime = CustomsManager.Instance.CustomsVo.waveTime - this.fireCountdown;
                        BattleManager.Instance.MemeryEnd();
                    }
                }
                else if (CustomsManager.Instance.CustomsType == Customs_Type.MatchChampion) {
                    if (BattlefieldManager.Instance.end) {
                        Tick.Clear(this, this.FireCountdown);
                    }
                }
            }
            else {
                Tick.Clear(this, this.FireCountdown);
                if (CustomsManager.Instance.CustomsType == Customs_Type.Kicking ||
                    CustomsManager.Instance.CustomsType == Customs_Type.Ladder) {
                    BattlefieldManager.Instance.Dispone();
                    BattlefieldManager.Instance.Destroy();
                    BattleManager.Instance.OpenBattle();
                }
                else if (CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                    MemoryLogic.Instance.surplusTime = CustomsManager.Instance.CustomsVo.waveTime - this.fireCountdown;
                    BattleManager.Instance.MemeryEnd();
                }
            }
        }

        //开始战斗文字
        private PlayFightCharacter() {
            this.play.visible = true;
            this.play.scaleX = 1.2;
            this.play.scaleY = 1.2;
            this.play.alpha = 1;
            let completeFunc = () => {
                this.play.visible = false;
            }
            let t = Laya.Tween.to(this.play, { scaleX: 1, scaleY: 1, alpha: 0 }, 400, Laya.Ease.linearInOut,
                Laya.Handler.create(this, completeFunc));
            Tick.Once(400, this, completeFunc);
        }

        private OpenView(name: string) {
            UIManager.Instance.CreateUI(name, [ViewUpRoot]);
        }

        private Quit_boss() {
            CustomsManager.Instance.LeaveCustomsManager();
            WroldBossLogic.Instance.Buff_Del();
            WroldBossLogic.Instance.SendHrut();
            if (UIManager.Instance.IsHave("WroldBossBuffView", ViewUpRoot)) {
                UIManager.Instance.DestroyUI("WroldBossBuffView", [ViewUpRoot])
            }
            Event.DispatchEvent("BossThrough");
            Event.DispatchEvent("StopClick", [true]);
            Event.DispatchEvent("SkillMouseEnable");
        }

    }
}