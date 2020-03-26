var H52D_Framework;
(function (H52D_Framework) {
    var GameApplication = /** @class */ (function () {
        function GameApplication() {
        }
        Object.defineProperty(GameApplication.prototype, "ConfigManager", {
            get: function () {
                return this._configManager;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameApplication, "Inst", {
            get: function () {
                if (GameApplication._inst == null) {
                    GameApplication._inst = new GameApplication();
                }
                return GameApplication._inst;
            },
            enumerable: true,
            configurable: true
        });
        GameApplication.prototype.Startup = function () {
            var _this = this;
            //初始化层级属性
            H52D_Framework.SceneRoot = this.CreateUIRoot("SceneRoot");
            H52D_Framework.EffectRoot = this.CreateUIRoot("EffectRoot");
            H52D_Framework.ViewDownRoot = this.CreateUIRoot("ViewDownRoot");
            H52D_Framework.ViewDownRoot.on(Laya.Event.CLICK, this, this.OnClickEvent);
            H52D_Framework.NewGuidRoot = this.CreateUIRoot("NewGuidRoot");
            H52D_Framework.ViewUpRoot = this.CreateUIRoot("ViewUpRoot");
            H52D_Framework.ViewUpRoot.on(Laya.Event.CLICK, this, this.OnClickEvent);
            H52D_Framework.ViewToppestRoot = this.CreateUIRoot("ViewToppestRoot");
            H52D_Framework.ViewToppestRoot.on(Laya.Event.CLICK, this, this.OnClickEvent);
            H52D_Framework.ViewTipRoot = this.CreateUIRoot("ViewTipRoot");
            H52D_Framework.ViewStoryRoot = this.CreateUIRoot("ViewStoryRoot");
            H52D_Framework.PfLog.Inst.SendClientLog(700, 1);
            H52D_Framework.UIManager.Instance.CreateUI("LoadingView", [H52D_Framework.ViewUpRoot], Laya.Handler.create(this, function () {
                //读取配置信息
                _this._configManager = new H52D_Framework.ConfigManager(Laya.Handler.create(_this, function () {
                    //初始化资源管理、并预加载一些资源
                    H52D_Framework.ResourceManager.Instance.Initialize(Laya.Handler.create(_this, function () {
                        //所有系统功能初始化
                        _this.Initialize();
                        H52D_Framework.UIManager.Instance.DestroyUI("LoadingView", [H52D_Framework.ViewUpRoot], null, true);
                        H52D_Framework.PfLog.Inst.SendClientLog(800, 1);
                    }));
                }));
            }));
        };
        /**创建uiRoot */
        GameApplication.prototype.CreateUIRoot = function (viewName) {
            var view = new Laya.View();
            view.name = viewName;
            view.width = G_StageWidth;
            view.height = G_StageHeight;
            view.centerX = 0;
            view.centerY = 0;
            view.mouseThrough = true;
            Laya.stage.addChild(view);
            var masksp = new Laya.Sprite();
            masksp.graphics.drawRect(0, 0, G_StageWidth, G_StageHeight, "#000000");
            view.mask = masksp;
            return view;
        };
        /**所有按钮的点击事件 */
        GameApplication.prototype.OnClickEvent = function (params) {
            var events = params.target._events;
            if (events && events.click) {
                //按钮点击效果
                if (events.click.length == undefined || events.click.length < 2 || !events.click[0])
                    return;
                var btn_1 = events.click[0].caller;
                //只对按钮生效
                if (!btn_1["stateNum"])
                    return;
                H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
                btn_1.scaleX = 1;
                btn_1.scaleY = 1;
                Laya.Tween.to(btn_1, { scaleX: 0.9, scaleY: 0.9 }, 100, Laya.Ease.linearIn, Laya.Handler.create(this, function () {
                    Laya.Tween.to(btn_1, { scaleX: 1, scaleY: 1 }, 100, Laya.Ease.linearIn);
                }));
            }
        };
        /**所有系统功能初始化 */
        GameApplication.prototype.Initialize = function () {
            H52D_Framework.GameLink.Instance.Initialize();
            H52D_Framework.SDKManager.Instance.Initialize();
            H52D_Framework.LoginLogic.Instance.Initialize();
            H52D_Framework.MasterPlayer.Instance.Initialize();
            H52D_Framework.TipsLogic.Instance.Initialize();
            /** 特效 */
            H52D_Framework.EffectManager.Instance.Initialize();
            /** 道具背包 */
            H52D_Framework.BagManager.Instance.Initialize();
            /**商城数据加载 */
            H52D_Framework.ShopLogic.Instance.Initialize();
            /**英雄数据加载 */
            H52D_Framework.HeroManager.Instance.Initialize();
            H52D_Framework.MainRoleLogic.Instance.Initialize();
            H52D_Framework.MainActionLogic.Instance.Initialize();
            H52D_Framework.ViewUILogic.Instance.Initialize();
            /**排行榜数据加载 */
            H52D_Framework.RankLogic.Instance.Initialize();
            /**签到数据加载 */
            H52D_Framework.SignInLogic.Instance.Initialize();
            H52D_Framework.ChatLogic.Inst.Initialize();
            H52D_Framework.ShareLogic.Instance.Initialize();
            /** 基金加载 */
            H52D_Framework.FundLogic.Instance.Initialize();
            /**阵营数据加载 */
            H52D_Framework.CampManager.Instance.Initialize();
            H52D_Framework.MailLogic.Inst.Initialize();
            H52D_Framework.PrivilegeBuff.Instance;
            //赠送
            H52D_Framework.InteractLogic.Inst.Initialize();
            H52D_Framework.NoticeLogic.Inst.Initialize();
            /**新手内容加载*/
            H52D_Framework.Guidance.Instance.Initialize();
            /**离线收益 */
            H52D_Framework.ProfManager.Instance.Initialize();
            /**神兽数据加载 */
            H52D_Framework.PetManager.Instance.Initialize();
            /**时空法器数据加载 */
            H52D_Framework.EquipManager.Instance.Initialize();
            /**运营活动数据加载 */
            H52D_Framework.OActivityLogic.Instance.Initialize();
            /**世界boss 数据加载 */
            H52D_Framework.WroldBossLogic.Instance.Initialize();
            /**天梯数据加载 */
            H52D_Framework.LadderManager.Instance.Initialize();
            /**英雄图鉴数据加载 */
            H52D_Framework.HeroHandbookManager.Instance.Initialize();
            /**广告管理器加载 */
            H52D_Framework.AdvertisingManager.Instance.Initialize();
            /**PK联赛管理器加载 */
            H52D_Framework.MatchLogic.Instance.Initialize();
        };
        return GameApplication;
    }());
    H52D_Framework.GameApplication = GameApplication;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=GameApplication.js.map