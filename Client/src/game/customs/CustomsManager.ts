module H52D_Framework {
    /**
     * 副本逻辑类
     * @author zhangyusong
     */
    export class CustomsManager {

        public readonly LEAVE: string = "离开\n战斗";
        public readonly CHALLENGE: string = "挑战\nBOSS";

        /** 关卡模式 */
        public customsMode: Customs_Mode;
        /** 累计消灭怪物*/
        public monsterDieNum: number = 0;
        public first: boolean = true;
        /** 关卡旁白，只有战斗胜利了开启，在切换战斗模式时不开启 */
        public canaside: boolean = false;
        /** 上一级副本场景ID */
        private prevSceneId: number;
        /** 副本数据 */
        private customsVo: CustomsVo;
        /** 奖励结算 */
        private reward: Reward;
        /** 由奖励界面进入场景 */
        private rewardIntoScene: boolean = false;
        /** 是不是Boss关 */
        private boss: boolean = false;
        /** 强制通关 */
        private through: boolean = false;
        /** 上一个场景 */
        private prevCustoms: Customs_Type = 0;

        public get bBoss() {
            return this.boss;
        }

        private static _inst: CustomsManager;
        public static get Instance() {
            if (CustomsManager._inst == null) {
                CustomsManager._inst = new CustomsManager();
            }
            return CustomsManager._inst;
        }

        /** 获取当前副本数据 */
        public get CustomsVo(): CustomsVo {
            return this.customsVo;
        }

        /** 获取当前副本类型 */
        public get CustomsType(): Customs_Type {
            return this.customsVo ? this.customsVo.customsType : Customs_Type.Customs;
        }

        /**切换战斗模式 */
        public CustomsModelChange(mode: Customs_Mode): void {
            //循环模式进入
            if (mode == Customs_Mode.Loop) {
                this.rewardIntoScene = true;
                RemoteCall.Instance.Send("K_WinDungeons", false);
                Event.DispatchEvent("CunstomsModel", [this.CHALLENGE]);
            }
            //循环模式退出
            else if (mode == Customs_Mode.Auto) {
                RemoteCall.Instance.Send("K_GotoDungeons");
                Event.DispatchEvent("CunstomsModel", [this.LEAVE]);
            }
            this.canaside = false;
            BattleManager.Instance.DestroyMonster();
        }

        /** 通关 */
        public CustomsThrough() {
            this.boss = true;
            this.through = true;
            this.CustomsModelChange(Customs_Mode.Auto);
            BattleManager.Instance.bdirct();
        }

        public Initialize(): void {
            this.customsMode = MasterPlayer.Instance.player.CustomsMode;
            this.prevSceneId = 0;
            this.reward = new Reward();
            // 副本数据初始化
            let customsId: number = MasterPlayer.Instance.player.CustomsId;
            let waveOrder: number = MasterPlayer.Instance.player.WaveOrder;
            this.customsVo = new CustomsVo(customsId, waveOrder);
            // 事件注册
            this.EventInit();
            this.canaside = false;
            ViewUILogic.Instance.AngleTimeInit();
            //加载关卡场景
            UIManager.Instance.CreateUI("ChangeSceneView", [ViewDownRoot], Laya.Handler.create(this, () => {
                //第一关，第一波，做特殊处理
                if (this.customsVo.customsOrder == 1 && this.customsVo.waveOrder == 1) {
                    // this.canaside = true;
                    // this.OpenAside(this.CustomsVo.asideB, () => {
                    //     this.canaside = false;
                    //     Event.DispatchEvent("ShowMainView");
                    //     Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Aide)
                    //     this.SceneUpdate();
                    // });
                    Event.DispatchEvent("ShowMainView");
                    Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Aide)
                    this.SceneUpdate();
                }
                else {
                    Event.DispatchEvent("ShowMainView");
                    Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Aide)
                    //创建场景
                    this.SceneUpdate();
                }
            }));
        }

        /**
         * 场景创建或更新
         */
        private SceneUpdate(): void {
            this.boss = this.customsVo.waveOrder == this.customsVo.waveNum;
            // 初始化副本怪物
            MonsterManager.Instance.DataInit(this.customsVo.monstorPosition[this.customsVo.waveOrder]);

            this.prevCustoms = this.customsVo.customsType;
            // 主线关卡
            if (this.customsVo.customsType == Customs_Type.Customs) {
                if (this.customsVo.sceneID == this.prevSceneId) {
                    //Boss的旁白对话
                    if (this.boss) {
                        let bossId: number = 0;
                        let position: Object = this.customsVo.monstorPosition[this.customsVo.waveOrder];
                        for (let b in position) {
                            if (position[b] == "5") {
                                bossId = Number(b);
                                break;
                            }
                        }
                        if (MonstorConfig[bossId]) {
                            let asideId: number = MonstorConfig[bossId]["aside"];
                            this.OpenAside(asideId, () => { SceneManager.Instance.Update(); });
                        }
                        else {
                            SceneManager.Instance.Update();
                        }
                    }
                    else {   //自动模式第一波，展示旁白
                        if (this.customsMode == Customs_Mode.Auto && this.customsVo.waveOrder == 1) {
                            this.OpenAside(this.customsVo.aside, () => {
                                //通关分享，在旁白之后
                                let prevCustoms: number = 0;
                                for (let i in GameParamConfig["ShareRelationCustoms"]) {
                                    let currCustoms: number = GameParamConfig["ShareRelationCustoms"][i];
                                    if (this.customsVo.customsOrder - 1 == currCustoms) {
                                        prevCustoms = this.customsVo.customsOrder - 1;
                                        break;
                                    }
                                }
                                if (prevCustoms > 0) {
                                    ShareLogic.Instance.ShareCustoms(prevCustoms);
                                }
                                SceneManager.Instance.Update();
                                //百度小贴士
                                if (CustomsManager.Instance.CustomsVo.tie[1] || CastingConfig[LoginLogic.Instance.profid]["tips_"+CustomsManager.Instance.CustomsVo.customsId]) {
                                    Event.DispatchEvent("BaiDuXiaoTieShi");
                                }
                            });
                        }
                        else {
                            SceneManager.Instance.Update();
                        }
                    }
                }
                else {  //场景ID更换，需要创建场景
                    this.prevSceneId = this.customsVo.sceneID;
                    SceneManager.Instance.Create(this.customsVo.sceneID);
                    //小天使继续
                    Event.DispatchEvent("AngleContinue");
                }
            } else {
                //小天使暂停
                Event.DispatchEvent("AngleSuspend");
                // 如果切换回来则必须要切换场景
                this.prevSceneId = 0;
                SceneManager.Instance.Create(this.customsVo.sceneID);
            }
            //关于关卡的红点儿，基金
            Event.DispatchEvent("ShowControlRedPoint", E_OpenGrade.FUND);
        }

        private EventInit(): void {
            RemoteCall.Instance.RegistJXS2CProtocol('C_WinDungeons', this);
            RemoteCall.Instance.RegistJXS2CProtocol('C_GotoDungeons', this);
            Event.RegistEvent("CUSTOMS_RESULT", Laya.Handler.create(this, this.FightResult));
            Event.RegistEvent("CUSTOMS_UPDATE", Laya.Handler.create(this, this.FightUpdate));
        }

        /**
         * 跳转波数
         * @param waveOrder
         */
        private C_GotoDungeons(buf: any): void {
            let waveOrder = buf[0];
            this.customsVo.waveOrder = waveOrder;
            MasterPlayer.Instance.player.WaveOrder = waveOrder;
            this.customsMode = Customs_Mode.Auto;
            // 创建场景
            if (!this.through) {
                this.SceneUpdate();
            }
        }

        private FightResult(win: boolean) {
            switch (this.customsVo.customsType) {
                // 主线副本
                case Customs_Type.Customs:
                    //Boss清除倒计时
                    if (this.customsVo.waveOrder == this.customsVo.waveNum) {
                        Event.DispatchEvent("BossThrough", [win]);
                    }
                    if (win) {
                        if (this.boss) {
                            //击杀Boss数量
                            MasterPlayer.Instance.ReqOnEvent(EventProEnum.KillBoss, 1);
                            //Boss也是怪物，所以要清掉
                            this.monsterDieNum = 0;
                            MasterPlayer.Instance.ReqOnEvent(EventProEnum.WinCustoms, 1);
                            if (this.customsVo.customsOrder >= GameParamConfig["ValueOffNumber"]) {
                                DataManager.Instance.PackData();
                            }
                        }
                        else {
                            //累计消灭怪物
                            MasterPlayer.Instance.ReqOnEvent(EventProEnum.KillMonster, this.monsterDieNum);
                            this.monsterDieNum = 0;
                        }
                        Event.DispatchEvent("CustomsClear");
                        this.rewardIntoScene = false;
                        RemoteCall.Instance.Send("K_WinDungeons", true);
                        this.failNum = 0;
                    }
                    else {
                        if (this.boss) {
                            Event.DispatchEvent("BossCome", [false]);
                            //助理通关，特权有没有使用过
                            if (MasterPlayer.Instance.invitadunFlag == 0) {
                                //邀请人数是否够使用特权次数
                                if (MasterPlayer.Instance.dayInviteNum >= GameParamConfig["HelpPassNeedPlayerNum"]) {
                                    ShareLogic.Instance.AssistanceCustems();
                                }//失败>1次
                                else if (++this.failNum > 1) {
                                    ShareLogic.Instance.AssistanceInvitation();
                                }
                            }

                            //我要变强 引导特殊处理 bTrigger_1 bTrigger_2
                            let bTrigger_1 = CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_11)
                            let bTrigger_2 = CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_7_3);
                            if (CustomsManager.Instance.CustomsType == Customs_Type.Customs) {
                                if (!bTrigger_1) {
                                    UIManager.Instance.CreateUI("StrongerView", [ViewDownRoot], Laya.Handler.create(this, () => {
                                        //引导
                                        Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_11);
                                    }));
                                } else if (!bTrigger_2) {
                                    Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_7);
                                } else {
                                    UIManager.Instance.CreateUI("StrongerView", [ViewDownRoot], Laya.Handler.create(this, () => {
                                    }));
                                }
                            }

                            if (this.customsMode == Customs_Mode.Auto) {
                                this.CustomsModelChange(Customs_Mode.Loop);
                            }
                        }
                    }
                    break;
                case Customs_Type.Boss:// 世界boss
                    if (win) {
                        // 几乎不可能 肯定开挂了  
                    } else {

                    }
                    // 获取累计伤害
                    let nDamage = BattleManager.Instance.TheWordBossDamage;
                    Event.DispatchEvent("WroldBoss_hurt", [nDamage]);
                    // 上传伤害
                    RemoteCall.Instance.Send('K_ReqSendChallengeHarm', nDamage);
                    this.LeaveCustomsManager();
                    break;
                case Customs_Type.MatchElection://PK海选阶段                   
                    // 上传伤害
                    MatchLogic.Instance.SendHurt();
                    //上傳PK陣容
                    DataManager.Instance.PackData_m();
                    //上传阵容dps伤害和血量
                    DataManager.Instance.SendCapacityData();
                    //开启点击
                    Event.DispatchEvent("StopClick", [true])
                    Event.DispatchEvent("SkillMouseEnable");
                    this.LeaveCustomsManager();
                    break;
                default:
                    break;
            }
        }

        private failNum: number = 0;
        /** 直通特权次数 */
        private privilegeNum: number = 1;

        /**
         * 胜利结算
         * @param buf 数组
         *  [0]是否是循环模式
         *  [1]准备切换的副本ID
         *  [2]切换到该副本中的第几波
         *  [3]奖励列表
         **/
        private C_WinDungeons(buf: any): void {
            let win = buf[0];
            let customsId = buf[1];
            let waveOrder = buf[2];
            let award = buf[3];
            let oldCudtomsId = MasterPlayer.Instance.player.CustomsId
            // 更新本地关卡
            MasterPlayer.Instance.player.CustomsId = customsId;
            MasterPlayer.Instance.player.WaveOrder = waveOrder;
            this.customsVo.customsId = customsId;
            this.customsVo.waveOrder = waveOrder;
            CampManager.Instance.Add_camp();
            if (win) { //赢了有奖励
                this.reward.RewardSorting(award);
                this.canaside = true;
                if (this.customsVo.customsOrder == OpenGradeConfig[E_OpenGrade.ANGLE].Checkpoint && waveOrder == 1) {
                    ViewUILogic.Instance.AngleStart();
                }
                if ((oldCudtomsId != customsId) && CustomspassConfig[oldCudtomsId]) {
                    PfLog.Inst.SendClientLog(5000 + CustomspassConfig[oldCudtomsId].customsOrder, 0);
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
        }

        /** 战斗刷新，更新场景 */
        public FightUpdate() {
            if (this.customsVo) {
                this.SceneUpdate();
            }
        }

        /** 进入副本 */
        public EnterCustoms(nCustomsID, nWaveOrder?) {
            let cfg = CustomspassConfig[nCustomsID];
            if (cfg == null) {
                return;
            }
            if (cfg.dunType == 1) {
                return;
            }
            this.customsVo.customsId = nCustomsID;
            this.customsVo.waveOrder = nWaveOrder || 1;
            this.SceneUpdate();
        }

        /** 离开副本 回到当前主线关卡 */
        public LeaveCustomsManager() {
            let cfg = CustomspassConfig[this.customsVo.customsId];
            if (cfg.dunType == 1) {
                return
            }
            this.customsVo.customsId = MasterPlayer.Instance.player.CustomsId;
            this.customsVo.waveOrder = MasterPlayer.Instance.player.WaveOrder;
            this.SceneUpdate();
        }

        public OpenAside(id: number, callBack?: Function) {
            if (!this.canaside || id == 0) {
                if (callBack) {
                    callBack.call(this);
                }
            }
            else {
                Event.DispatchEvent("LoseFocus");
                //暂停战斗
                BattleManager.Instance.StopBattle();
                //暂停宝箱
                DropManager.Instance.openBox = false;
                if (UIManager.Instance.IsHave("AsideView", ViewStoryRoot)) {
                    UIManager.Instance.DestroyUI("AsideView", [ViewStoryRoot]);
                }
                UIManager.Instance.CreateUI("AsideView", [ViewStoryRoot, id, Laya.Handler.create(this, () => {
                    //开始战斗
                    BattleManager.Instance.OpenBattle();
                    DropManager.Instance.openBox = true;
                    if (callBack) {
                        callBack.call(this);
                    }
                })]);
            }
        }

    }
}