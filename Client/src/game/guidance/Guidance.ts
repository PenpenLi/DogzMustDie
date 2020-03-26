/*
* 新手引导
*/
module H52D_Framework {
    export class Guidance {
        private static _inst: Guidance;
        public static get Instance() {
            if (Guidance._inst == null)
                Guidance._inst = new Guidance();
            return Guidance._inst;
        }

        //新手引导步骤
        private _guidanceStep: E_GuidanceStep;
        public get guidanceStep() {
            return this._guidanceStep;
        }
        public SetGuidanceStep(type: E_GuidanceStep) {
            this._guidanceStep = type;
        }

        //引导按钮列表
        private _guidanceButtonList: { [guidanceStep: number]: any } = {};
        public GetGuidanceButton(type: E_GuidanceStep): any {
            return this._guidanceButtonList[type]
        }
        public SetGuidanceButton(type: E_GuidanceStep, button: any) {
            this._guidanceButtonList[type] = button
        }

        //是否在引导中
        public _bProceeding: boolean;
        //是否在布阵页面
        public _bHeroWar: boolean;


        //剧情数据
        private _storyData: { [id: number]: any } = {};
        public get storyData() {
            return this._storyData;
        }

        constructor() {
            this._bProceeding = false;
            this._guidanceStep = E_GuidanceStep.E_Guidance_1;
            //获取剧情数据
            for (let id in StoryConfig) {
                this._storyData[Number(id)] = StoryConfig[id];
            }
        }


        /***********************************************************/
        /** 初始化*/
        public Initialize(): void {
            //剧情
            RemoteCall.Instance.RegistJXS2CProtocol('C_NewPlayerInit', this);
        }

        /**新人登入播放剧情 */
        private C_NewPlayerInit() {
            UIManager.Instance.CreateUI("GuidanceView", [NewGuidRoot], Laya.Handler.create(this, () => {
                Event.DispatchEvent("ShowStory");
                Event.DispatchEvent("PanelClose");
            }));
        }

        /**播放剧情 */
        public PlayStory(customsOrder: number) {
            if (this._storyData[customsOrder] == null) return;
            BattleManager.Instance.StopBattle();
            CacheManager.Instance.setDerailByType(CacheTypeEnum.story, customsOrder, true);
            UIManager.Instance.CreateUI("StoryView", [ViewStoryRoot, this._storyData[customsOrder]]);
        }

        /***********************************************************/
        /**开始引导 */
        public StartGuidance(guidanceStep: E_GuidanceStep = E_GuidanceStep.E_Empty) {

            PfLog.Inst.SendClientLog(2000 + guidanceStep, 0);
            this._bProceeding = true;
            this.SetGuidanceStep(guidanceStep);
            if (UIManager.Instance.IsHave("GuidanceView", NewGuidRoot)) {
                UIManager.Instance.DestroyUI("GuidanceView", [NewGuidRoot])
            }
            UIManager.Instance.CreateUI("GuidanceView", [NewGuidRoot], Laya.Handler.create(this, () => {
                Event.DispatchEvent("PanelClose");
                if (guidanceStep == E_GuidanceStep.E_Empty) {
                    Event.DispatchEvent("StartGuidance", [this._guidanceStep]);
                } else {
                    Event.DispatchEvent("StartGuidance", [guidanceStep]);
                }
            }
            ));
        }
        /**触发新手引导 */
        public TriggerGuidance(guidanceStep: E_GuidanceStep) {
            //屏蔽引导
            // let b = true;
            // if (b) {
            //     return true;
            // }

            //引导中 、 打开天梯页面中 、 在布阵当中
            if (this._bProceeding
                || LadderManager.Instance._isOpenLadder
                || HeroPosition.Instance._bHeroWar) {
                return;
            }
            let bTrigger: boolean;
            let customsOrder: number = MasterPlayer.Instance.player.CunstLevel
            let goldNum: number = BagManager.Instance.getItemNumber(BaseDefine.ItemIdGold);
            let needGoldNum: number = 0;
            //关闭挑战失败
            if(guidanceStep != E_GuidanceStep.E_Guidance_11){
                if (UIManager.Instance.IsHave("StrongerView", ViewDownRoot)) {
                    UIManager.Instance.DestroyUI("StrongerView", [ViewDownRoot])
                }
            }
            switch (guidanceStep) {
                case E_GuidanceStep.E_Guidance_2:
                    bTrigger = CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_2);
                    needGoldNum = HeroManager.Instance.GetheroUpMoney(0);
                    //钱够不够
                    if (!needGoldNum || needGoldNum > goldNum) {
                        return;
                    }
                    if (!bTrigger) {
                        CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_2, true)
                        this.StartGuidance(E_GuidanceStep.E_Guidance_2);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_3:
                    bTrigger = CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_3);
                    if (HeroManager.Instance.ActiveHeroNum >= 1 && !bTrigger) {
                        bTrigger = true;
                        CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_3, true)
                        this.StartGuidance(E_GuidanceStep.E_Guidance_3);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_4:
                    bTrigger = CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_4);

                    if (HeroManager.Instance.GetHeroNum() >= 2 && !bTrigger) {
                        CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_4, true)
                        this.StartGuidance(E_GuidanceStep.E_Guidance_4);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_5:
                    bTrigger = CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_5);
                    if (HeroManager.Instance.StarHeroNum >= 1 && !bTrigger) {
                        CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_5, true)
                        this.StartGuidance(E_GuidanceStep.E_Guidance_5);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_6:
                    bTrigger = CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_6);
                    let killLv: number = Number(RoleSkillUpConfig[1][1].needRoleLevel);
                    needGoldNum = RoleSkillUpConfig[1][1].needGoldNum;
                    if (MasterPlayer.Instance.player.Level >= killLv && !bTrigger && goldNum >= needGoldNum) {
                        CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_6, true)
                        this.StartGuidance(E_GuidanceStep.E_Guidance_6);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_7:
                    if (UIManager.Instance.IsHave("InvitationCustomsView", ViewToppestRoot)) {
                        UIManager.Instance.DestroyUI("InvitationCustomsView", [ViewToppestRoot])
                    }
                    let bTrigger_1 = CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_7_1);
                    let bTrigger_2 = CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_7_2);
                    let bTrigger_3 = CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_7_3);
                    if (!bTrigger_1 || !bTrigger_2 || !bTrigger_3) {
                        if (!bTrigger_1) {
                            CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_7_1, true)
                        } else if (!bTrigger_2) {
                            CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_7_2, true)
                        } else if (!bTrigger_3) {
                            CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_7_3, true)
                        }
                        this.StartGuidance(E_GuidanceStep.E_Guidance_7);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_8:
                    bTrigger = CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_8);
                    if (HeroManager.Instance.GetHeroNum() >= 10 && !bTrigger) {
                        CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_8, true)
                        this.StartGuidance(E_GuidanceStep.E_Guidance_8);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_9:
                    bTrigger = CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_9);
                    let bOrder_9 = OpenCondition(E_OpenGrade.PET, false)
                    let petnum = PetManager.Instance.OwnPetNum;
                    if (bOrder_9 && !bTrigger && petnum >= 1) {
                        CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_9, true)
                        this.StartGuidance(E_GuidanceStep.E_Guidance_9);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_10:
                    bTrigger = CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_10);

                    if (customsOrder >= 5 && !bTrigger) {
                        CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_10, true)
                        this.StartGuidance(E_GuidanceStep.E_Guidance_10);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_11:
                    bTrigger = CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_11);

                    if (!bTrigger) {
                        CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_11, true)
                        this.StartGuidance(E_GuidanceStep.E_Guidance_11);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_12:
                    bTrigger = CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_12);
                    let bOrder_12 = OpenCondition(E_OpenGrade.LADDER, false)
                    if (!bTrigger && bOrder_12) {
                        CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_12, true)
                        this.StartGuidance(E_GuidanceStep.E_Guidance_12);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_13:
                    bTrigger = CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_13);
                    needGoldNum = HeroManager.Instance.GetheroUpMoney(1);
                    //钱够不够
                    if (!needGoldNum || needGoldNum > goldNum) {
                        return;
                    }
                    if (!bTrigger && customsOrder >= 8) {
                        CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_13, true)
                        this.StartGuidance(E_GuidanceStep.E_Guidance_13);
                    }
                    break;
                case E_GuidanceStep.E_Guidance_14:
                    bTrigger = CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_14);
                    if (!bTrigger) {
                        CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_14, true)
                        this.StartGuidance(E_GuidanceStep.E_Guidance_14);
                    }
                    break;
                case E_GuidanceStep.E_Aide:
                    if (MasterPlayer.Instance.bNewbie) {
                        Guidance.Instance.StartGuidance(E_GuidanceStep.E_Aide);
                    }
                    break;
            }
        }

        /**保存布阵 */
        public Trigger_SaveWar() {
            let bTrigger_1 = CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_war_1);
            let bTrigger_2 = CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_war_2);

            if (!bTrigger_1 && Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_4) {
                CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_war_1, true)
                UIManager.Instance.CreateUI("GuidanceView", [NewGuidRoot], Laya.Handler.create(this, () => { Event.DispatchEvent("EventSaveWar") }));
            }
            if (!bTrigger_2 && Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_8) {
                CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_war_2, true)
                UIManager.Instance.CreateUI("GuidanceView", [NewGuidRoot], Laya.Handler.create(this, () => { Event.DispatchEvent("EventSaveWar") }));
            }
        }

        /**需要引导后再次检测的引导步骤 */
        private _triggerArr = [
            E_GuidanceStep.E_Guidance_3,
            E_GuidanceStep.E_Guidance_4,
            E_GuidanceStep.E_Guidance_5,
            E_GuidanceStep.E_Guidance_6,
            E_GuidanceStep.E_Guidance_8,
            E_GuidanceStep.E_Guidance_9,
            E_GuidanceStep.E_Guidance_10,
            E_GuidanceStep.E_Guidance_12
        ]

        /**引导后检测是否有引导满足 */
        public TriggerAll() {
            for (let i in this._triggerArr) {
                this.TriggerGuidance(this._triggerArr[i])
            }
        }
    }
}