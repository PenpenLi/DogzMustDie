module H52D_Framework {
    /** 场景层 */
    export let SceneRoot: Laya.View;
    /** 模型层 */
    export let AvatarRoot: Laya.View;
    /** 模型特效层 */
    export let AvatarEffectRoot: Laya.View;
    /** 特效层 */
    export let EffectRoot: Laya.View;
    /** UI下层 */
    export let ViewDownRoot: Laya.View;
    /** 新手引导层 */
    export let NewGuidRoot: Laya.View;
    /** UI上层 */
    export let ViewUpRoot: Laya.View;
    /** UI最上层 */
    export let ViewToppestRoot: Laya.View;
    /** 飘字层 */
    export let ViewTipRoot: Laya.View;
    /** 剧情层 */
    export let ViewStoryRoot: Laya.View;


    export class GameApplication {
        /** 遮罩 */
        private maskSpr: Laya.View;
        /**配置表管理类 */
        private _configManager: ConfigManager;
        public get ConfigManager() {
            return this._configManager;
        }

        private static _inst: GameApplication;
        public static get Inst() {
            if (GameApplication._inst == null) {
                GameApplication._inst = new GameApplication();
            }
            return GameApplication._inst;
        }

        public Startup(): void {
            //初始化层级属性
            SceneRoot = this.CreateUIRoot("SceneRoot");
            EffectRoot = this.CreateUIRoot("EffectRoot");
            ViewDownRoot = this.CreateUIRoot("ViewDownRoot");
            ViewDownRoot.on(Laya.Event.CLICK, this, this.OnClickEvent);
            NewGuidRoot = this.CreateUIRoot("NewGuidRoot");
            ViewUpRoot = this.CreateUIRoot("ViewUpRoot");
            ViewUpRoot.on(Laya.Event.CLICK, this, this.OnClickEvent);
            ViewToppestRoot = this.CreateUIRoot("ViewToppestRoot");
            ViewToppestRoot.on(Laya.Event.CLICK, this, this.OnClickEvent);
            ViewTipRoot = this.CreateUIRoot("ViewTipRoot");
            ViewStoryRoot = this.CreateUIRoot("ViewStoryRoot");
            PfLog.Inst.SendClientLog(700, 1);
            UIManager.Instance.CreateUI("LoadingView", [ViewUpRoot], Laya.Handler.create(this, () => {
                //读取配置信息
                this._configManager = new ConfigManager(Laya.Handler.create(this, () => {
                    //初始化资源管理、并预加载一些资源
                    ResourceManager.Instance.Initialize(Laya.Handler.create(this, () => {
                        //所有系统功能初始化
                        this.Initialize();
                        UIManager.Instance.DestroyUI("LoadingView", [ViewUpRoot], null, true);
                        PfLog.Inst.SendClientLog(800, 1);
                    }));
                }));
            }));
        }

        /**创建uiRoot */
        private CreateUIRoot(viewName: string): View {
            let view: Laya.View = new Laya.View();
            view.name = viewName;
            view.width = G_StageWidth;
            view.height = G_StageHeight;
            view.centerX = 0;
            view.centerY = 0;
            view.mouseThrough = true;
            Laya.stage.addChild(view);
            let masksp: Laya.Sprite = new Laya.Sprite();
            masksp.graphics.drawRect(0, 0, G_StageWidth, G_StageHeight, "#000000");
            view.mask = masksp;
            return view;
        }

        /**所有按钮的点击事件 */
        private OnClickEvent(params) {
            let events = params.target._events;
            if (events && events.click) {
                //按钮点击效果
                if (events.click.length == undefined || events.click.length < 2 || !events.click[0]) return;
                let btn = events.click[0].caller;
                //只对按钮生效
                if (!btn["stateNum"]) return;
                SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
                btn.scaleX = 1;
                btn.scaleY = 1;
                Laya.Tween.to(btn, { scaleX: 0.9, scaleY: 0.9 }, 100, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                    Laya.Tween.to(btn, { scaleX: 1, scaleY: 1 }, 100, Laya.Ease.linearIn);
                }));
            }
        }

        /**所有系统功能初始化 */
        private Initialize() {
            GameLink.Instance.Initialize();
            SDKManager.Instance.Initialize();
            LoginLogic.Instance.Initialize();
            MasterPlayer.Instance.Initialize();
            TipsLogic.Instance.Initialize();
            /** 特效 */
            EffectManager.Instance.Initialize();
            /** 道具背包 */
            BagManager.Instance.Initialize();
            /**商城数据加载 */
            ShopLogic.Instance.Initialize();
            /**英雄数据加载 */
            HeroManager.Instance.Initialize();
            MainRoleLogic.Instance.Initialize();
            MainActionLogic.Instance.Initialize();
            ViewUILogic.Instance.Initialize();
            /**排行榜数据加载 */
            RankLogic.Instance.Initialize();
            /**签到数据加载 */
            SignInLogic.Instance.Initialize();
            ChatLogic.Inst.Initialize();
            ShareLogic.Instance.Initialize();
            /** 基金加载 */
            FundLogic.Instance.Initialize();
            /**阵营数据加载 */
            CampManager.Instance.Initialize();
            MailLogic.Inst.Initialize();
            PrivilegeBuff.Instance;
            //赠送
            InteractLogic.Inst.Initialize();
            NoticeLogic.Inst.Initialize();
            /**新手内容加载*/
            Guidance.Instance.Initialize();
            /**离线收益 */
            ProfManager.Instance.Initialize();
            /**神兽数据加载 */
            PetManager.Instance.Initialize();
            /**时空法器数据加载 */
            EquipManager.Instance.Initialize();
            /**运营活动数据加载 */
            OActivityLogic.Instance.Initialize();
            /**世界boss 数据加载 */
            WroldBossLogic.Instance.Initialize();
            /**天梯数据加载 */
            LadderManager.Instance.Initialize();
            /**英雄图鉴数据加载 */
            HeroHandbookManager.Instance.Initialize();
            /**广告管理器加载 */
            AdvertisingManager.Instance.Initialize();
            /**PK联赛管理器加载 */
            MatchLogic.Instance.Initialize();
        }
    }
}