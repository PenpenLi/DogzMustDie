module H52D_Framework {
    import Sprite = Laya.Sprite;

    /**
     * 场景管理类;
     * @author zhangyusong
     */
    export class SceneManager {
        private firstId: number = 10001;
        private firstSound: boolean = false;
        private datavo: SceneVo;
        private currentScene: string;

        private static _instance: SceneManager;
        public static get Instance(): SceneManager {
            if (this._instance == null) {
                this._instance = new SceneManager();
            }
            return this._instance;
        }

        public get sceneId(): number {
            return this.datavo.sceneId;
        }

        public get Datavo() {
            return this.datavo;
        }

        public constructor() {
            Event.RegistEvent("PET", Laya.Handler.create(this, this.LoadPet));
            Event.RegistEvent("PlayMusic", Laya.Handler.create(this, this.PlaySound));
            Event.RegistEvent("StoryEvent", Laya.Handler.create(this, this.SceneLoad));
        }

        private _scene: Laya.View = null;
        public get scene(): Laya.View {
            return this._scene;
        }

        /**
         * 场景创建
         * @param sceneId 场景ID
         */
        public Create(sceneId: number) {
            //先销毁       
            this.Destroy(Laya.Handler.create(this, () => {
                this.firstSound = this.firstId == sceneId;
                this.PlaySound();
                this.datavo = new SceneVo(sceneId);
                //加载场景Loading
                let customsOrder: number = -1;
                if (CustomsManager.Instance.CustomsVo) {
                    customsOrder = CustomsManager.Instance.CustomsVo.customsOrder;
                }
                let b = CacheManager.Instance.getDerailByType(CacheTypeEnum.story, customsOrder);
                if (CustomsManager.Instance.CustomsVo.customsType == Customs_Type.Customs && Guidance.Instance.storyData[customsOrder] && !b) {
                    Guidance.Instance.PlayStory(customsOrder);
                } else {
                    CustomsManager.Instance.OpenAside(CustomsManager.Instance.CustomsVo.asideB, () => {
                        this.SceneLoad();
                    });
                }
            }));
        }

        private SceneLoad() {
            if (CustomsManager.Instance.first) {    //开始不加载
                CustomsManager.Instance.first = false;
            }
            else {
                Event.DispatchEvent(EventDefine.SHOW_SCENE, [this.datavo]);
                //延迟容错
                Tick.Once(3000, this, () => {
                    Event.DispatchEvent(EventDefine.CLOSE_SCENE);
                });
            }
            // 通知刷新UI层
            Event.DispatchEvent(EventDefine.CUSTOMS_CURRENT);
            this.currentScene = this.datavo.strSceneFileName;
            UIManager.Instance.CreateUI(this.currentScene, [SceneRoot], Laya.Handler.create(this, this.CreateComplete));
        }

        private _lastMusic: number;
        private PlaySound() {
            if (MasterPlayer.Instance.player.Music) {
                let index: number = 0;
                if (this.firstSound) {
                    index = 0;
                    this._lastMusic = index;
                }
                else {
                    do {
                        index = (Math.random() * 3 >> 0);
                    } while (this._lastMusic == index)

                    this._lastMusic = index;
                }
                SoundManager.Instance.OnPlayMusic(soundScene[index]);
            }
            else {
                SoundManager.Instance.OnStopMusic();
            }
        }

        private CreateComplete(view: any) {
            this._scene = view;
            //将角色层赋 值
            AvatarRoot = this._scene.getChildByName("avatarRoot") as Laya.View;
            AvatarEffectRoot = this._scene.getChildByName("effectRoot") as Laya.View;
            switch (CustomsManager.Instance.CustomsType) {
                case Customs_Type.Customs:
                    this.LoadCustoms();
                    break;
                case Customs_Type.Boss:
                    this.LoadWroldBoss();
                    break;
                case Customs_Type.Memory:
                    this.LoadMermoy();
                    break;
                case Customs_Type.Kicking:
                    this.LoadLadderAndKicKing();
                    break;
                case Customs_Type.Ladder:
                    this.LoadLadderAndKicKing();
                    break;
                case Customs_Type.MatchElection:
                    this.LoadMatchElection();
                    break;
                case Customs_Type.MatchChampion:
                    this.LoadMatchChampion();
                    break;
            }
        }

        /**加载主线关卡 */
        private LoadCustoms() {
            this.LoadHero(() => {
                this.LoadMonster(() => {
                    this.LoadPet();
                    this.LoadCamp();
                    this.LoadComplete();
                });
            });
        }

        /**加载世界Boss */
        private LoadWroldBoss() {
            this.LoadHero(() => {
                this.LoadMonster(() => {
                    this.LoadPet();
                    this.LoadCamp();
                    this.LoadComplete();
                    AdvertisingManager.Instance.IsBuyBossBuff = false;
                    Tick.Once(1000, this, () => {
                        UIManager.Instance.CreateUI("WroldBossBuffView", [ViewUpRoot]);
                    });
                });
            });
        }

        /**加载记忆副本 */
        private LoadMermoy() {
            this.LoadHero(() => {
                this.LoadMonster(() => {
                    this.LoadPet();
                    this.LoadCamp();
                    // this.LoadComplete();
                });
            });
            Tick.Once(200, this, () => {
                Event.DispatchEvent(EventDefine.CLOSE_SCENE);
                Event.DispatchEvent("DeputyFireStart");
            });
        }

        /**加载天梯  王者 */
        private LoadLadderAndKicKing() {
            BattlefieldManager.Instance.LoadBattle();
            Tick.Once(200, this, () => {
                Event.DispatchEvent(EventDefine.CLOSE_SCENE);
                Event.DispatchEvent("DeputyFireStart");
            });
        }

        /**加载PK联赛海选现场 */
        private LoadMatchElection() {
            this.LoadHero(() => {
                this.LoadMonster(() => {
                    this.LoadPet();
                    //this.LoadCamp();
                    this.LoadComplete();
                });
            });
            Tick.Once(200, this, () => {
                Event.DispatchEvent(EventDefine.CLOSE_SCENE);
                Event.DispatchEvent("DeputyFireStart");
            });
        }

        /**加载Pk联赛决赛 */
        private LoadMatchChampion() {
            BattlefieldManager.Instance.LoadBattle();
            Tick.Once(200, this, () => {
                Event.DispatchEvent(EventDefine.CLOSE_SCENE);
                Event.DispatchEvent("DeputyFireStart");
            });
        }


        /**
         * 场景更新
         */
        public Update(): void {
            this.LoadMonster(() => {
                // 通知刷新UI层
                Event.DispatchEvent(EventDefine.CUSTOMS_CURRENT);
                Event.DispatchEvent(EventDefine.BEGIN_FIRE);
            });
        }

        /** 战斗初始化,加载英雄 */
        private LoadHero(callBack: Function) {
            BattleManager.Instance.Initialize(Laya.Handler.create(this, callBack));
        }

        /** 战斗初始化,加载怪物  */
        private LoadMonster(callBack: Function, boss: boolean = false) {
            MonsterManager.Instance.Initialize(Laya.Handler.create(this, callBack));
        }

        /** 战斗初始化,加载宠物  */
        private LoadPet() {
            let id = 0;
            if (CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                id = MemoryLogic.Instance.GetPetID(Customs_Type.Memory);
            }
            else if (CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                //使用和PVP相同的
                id = KickingLogic.Instance.petId;
            }
            else {
                id = PetManager.Instance.CurrentpetID;
            }
            if (id > 0) {
                BPetManager.Instance.LoadBPet(id, this.datavo.sceneId);
            }
        }

        /** 战斗初始化,加载大船  */
        private LoadCamp() {
            if (MasterPlayer.Instance.player.CampID > 0) {
                BCampManager.Instance.LoadBCamp();
            }
        }

        /**加载完成，触发战斗流程 */
        private LoadComplete() {
            this.PlaySound();
            BattleManager.Instance.aIOperation.Dps();
            //先关闭场景加载页面，再加载旁白，再打开百度小贴士，最后发起战斗
            Event.DispatchEvent(EventDefine.CLOSE_SCENE, () => {
                CustomsManager.Instance.OpenAside(CustomsManager.Instance.CustomsVo.aside, () => {
                    //开始战斗
                    if (CustomsManager.Instance.CustomsType != Customs_Type.Boss ) {
                        if (CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                            return;
                        }
                        //百度小贴士
                        if (CustomsManager.Instance.CustomsVo.tie[1] || CastingConfig[LoginLogic.Instance.profid]["tips_"+CustomsManager.Instance.CustomsVo.customsId]) {
                            Event.DispatchEvent("BaiDuXiaoTieShi");
                        }
                        Event.DispatchEvent(EventDefine.BEGIN_FIRE);
                    }     
                });
            });
        }

        /**销毁场景 */
        public Destroy(callBack: Laya.Handler) {
            Event.DispatchEvent("ClearBubble");
            Event.DispatchEvent("StopBubbleMonster");
            if (this.currentScene) {
                UIManager.Instance.DestroyUI(this.currentScene, [SceneRoot], Laya.Handler.create(this, () => {
                    this.ClearRoot(AvatarRoot);
                    this.ClearRoot(AvatarEffectRoot);
                    this.ClearRoot(EffectRoot);
                    this.ClearRoot(SceneRoot);
                    if (callBack) {
                        callBack.run();
                    }
                }));
            }
            else {
                callBack.run();
            }
            ViewUILogic.Instance.Destroy();
            BattleManager.Instance.Destroy();
            MonsterManager.Instance.Destroy();
        }

        private ClearRoot(root: Laya.View) {
            if (root) {
                let childList = root._childs
                for (let i in childList) {
                    let _childs = childList[i]
                    if (_childs._emitter == null) {
                        _childs.destroy(true)
                    }
                }
                root.destroyChildren();
            }
        }

    }
}