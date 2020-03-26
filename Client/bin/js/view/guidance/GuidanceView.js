var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**新手引导*/
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("GuidanceView", [
        { url: "res/ui/ui_guid.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS }
    ]);
    var E_GuidanceType;
    (function (E_GuidanceType) {
        E_GuidanceType[E_GuidanceType["E_Strong"] = 0] = "E_Strong";
        E_GuidanceType[E_GuidanceType["E_Weak"] = 1] = "E_Weak"; //弱引导
    })(E_GuidanceType || (E_GuidanceType = {}));
    var GuidanceView = /** @class */ (function (_super) {
        __extends(GuidanceView, _super);
        function GuidanceView() {
            var _this = _super.call(this) || this;
            _this._oneTimer = 700;
            //****************************开场剧情************************** */
            /**剧情参数 */
            _this._StandingTime = 4000;
            _this._currentTime = 0;
            _this._timeTab = [];
            _this._aniTab = [];
            _this._index = 0;
            _this.bSetAniT = true;
            _this.AddEvent();
            _this.Init();
            return _this;
        }
        GuidanceView.prototype.Init = function () {
            //暂停游戏战斗
            H52D_Framework.OneTimer(1000, function () {
                H52D_Framework.BattleManager.Instance.StopBattle();
            });
            //开启点击
            H52D_Framework.BattleManager.Instance.oClick = false;
            //关闭所有气泡
            H52D_Framework.Event.DispatchEvent("ClearBubble");
            //暂停宝箱
            H52D_Framework.DropManager.Instance.openBox = false;
            this.spr_1.width = this.spr_2.width = this.shade.width = G_StageWidth; //* G_StageWidthScale;
            this.spr_1.height = this.spr_2.height = this.shade.height = G_StageHeight; //* G_StageHeightScale;
            H52D_Framework.Guidance.Instance._bProceeding = true;
            this._time = 10;
            this._clickNum = 0;
            if (H52D_Framework.Guidance.Instance.guidanceStep == E_GuidanceStep.E_Aide) {
                this._time = 7;
            }
            this.infoBg.visible = false;
            this.guidBj.visible = false;
            this.storyBj.visible = false;
            this.clickImg.visible = false;
            this._guidanceType = E_GuidanceType.E_Strong;
            this.time.text = "自动引导下一步（" + this._time + "s)";
            this.click.blendMode = "destination-out";
            this.SetEffectScale();
        };
        GuidanceView.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.over.on(Laya.Event.CLICK, this, this.StoryOver);
            this.storyBj.on(Laya.Event.CLICK, this, this.setAniT);
            // Event.RegistEvent('ShowStory', Laya.Handler.create(this, this.ShowStory));
            H52D_Framework.Event.RegistEvent('ShowStory', Laya.Handler.create(this, this.StoryOver));
            H52D_Framework.Event.RegistEvent('EventSaveWar', Laya.Handler.create(this, this.SaveWar));
            H52D_Framework.Event.RegistEvent('StartGuidance', Laya.Handler.create(this, this.StartGuidance));
        };
        GuidanceView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Tick.ClearAll(this);
            this.Close();
            if (this._storyImgMod != null) {
                this._storyImgMod.Destroy();
            }
            if (this._arrows != null) {
                this._arrows.Destroy();
            }
            if (this._aperture != null) {
                this._aperture.Destroy();
            }
            H52D_Framework.Event.RemoveEvent('ShowStory', Laya.Handler.create(this, this.ShowStory));
            H52D_Framework.Event.RemoveEvent('EventSaveWar', Laya.Handler.create(this, this.SaveWar));
            H52D_Framework.Event.RemoveEvent('StartGuidance', Laya.Handler.create(this, this.StartGuidance));
        };
        /**关闭UI */
        GuidanceView.prototype.CloseUI = function () {
            //恢复游戏战斗
            H52D_Framework.OneTimer(1000, function () {
                H52D_Framework.BattleManager.Instance.OpenBattle();
            });
            //开启宝箱
            H52D_Framework.DropManager.Instance.openBox = true;
            H52D_Framework.Guidance.Instance._bProceeding = false;
            this.infoBg.removeSelf();
            H52D_Framework.UIManager.Instance.DestroyUI("GuidanceView", [H52D_Framework.NewGuidRoot], Laya.Handler.create(this, function () {
                if (H52D_Framework.Guidance.Instance.guidanceStep != E_GuidanceStep.E_Guidance_14) {
                    H52D_Framework.Guidance.Instance.TriggerAll();
                }
            }));
            this.Destroy();
        };
        /**显示故事 */
        GuidanceView.prototype.ShowStory = function () {
            var _this = this;
            this._currentTime = 0;
            this._timeTab = [0, this._StandingTime, 400, this._StandingTime, 400, this._StandingTime, 700];
            this._aniTab = ["idle", "dead", "idle2", "dead2", "idle3", "dead3"];
            this._index = 0;
            this._storyImgMod = new H52D_Framework.Avatar(this.storyImg);
            var sRes = "res/player/juqing/juqing.sk";
            if (H52D_Framework.IsNotBaiDuSdk()) {
                sRes = "res/player/juqing_1/juqing.sk";
            }
            this._storyImgMod.Load(sRes, 1, 0.69, 0, 0, Laya.Handler.create(this, function () {
                _this._storyImgMod.visible = true;
                H52D_Framework.Tick.Loop(10, _this, function () {
                    _this.timec();
                });
            }));
            this.storyBj.visible = true;
            H52D_Framework.SoundManager.Instance.OnStopMusic();
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/story_sound.mp3");
        };
        GuidanceView.prototype.timec = function () {
            this._currentTime += 10;
            if (this._currentTime >= this._timeTab[this._index] &&
                this._index <= this._timeTab.length) {
                this._currentTime = 0;
                var list = this._timeTab.length - 1;
                H52D_Framework.Tick.Clear(this, playSound_1);
                H52D_Framework.Tick.Clear(this, playSound_2);
                this._StandingTime = 4000;
                switch (this._index) {
                    case 0:
                        H52D_Framework.Tick.Once(1000, this, playSound_1);
                        break;
                    case 1:
                        H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/menu_check.mp3");
                        break;
                    case 2:
                        H52D_Framework.Tick.Once(500, this, playSound_2);
                        break;
                    case 3:
                        H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/menu_check.mp3");
                        break;
                    case 4:
                        H52D_Framework.OneTimer(2000, function () {
                            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/story_shake.mp3");
                            H52D_Framework.EffectManager.Instance.StartShock(800, true);
                        });
                        break;
                    case 5:
                        break;
                    case list:
                        H52D_Framework.Tick.Clear(this, this.timec);
                        this.StoryOver();
                        return;
                }
                this._storyImgMod.Play(this._aniTab[this._index], false, null);
                this._index += 1;
            }
            function playSound_1() {
                H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/typewriting.mp3");
            }
            function playSound_2() {
                H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/phone.mp3");
            }
        };
        GuidanceView.prototype.setAniT = function () {
            var _this = this;
            if (this.bSetAniT) {
                H52D_Framework.SoundManager.Instance.OnStopSound("res/sound/phone.mp3");
                H52D_Framework.SoundManager.Instance.OnStopSound("res/sound/typewriting.mp3");
                H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/menu_check.mp3");
                this.bSetAniT = false;
                // this._index += 1;
                this._StandingTime = 10;
                this._currentTime = this._timeTab[this._index];
                H52D_Framework.OneTimer(1000, function () {
                    _this.bSetAniT = true;
                });
            }
        };
        /**跳过故事 */
        GuidanceView.prototype.StoryOver = function () {
            H52D_Framework.SoundManager.Instance.OnStopMusic();
            H52D_Framework.Event.DispatchEvent("LoadingGame");
            //加载主界面
            H52D_Framework.UIManager.Instance.CreateUI("MainView", [H52D_Framework.ViewDownRoot], Laya.Handler.create(this, function () {
                //加载关卡场景
                H52D_Framework.CustomsManager.Instance.Initialize();
            }));
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/story_end.mp3");
            H52D_Framework.SoundManager.Instance.OnStopSound("res/sound/story_sound.mp3");
            this.CloseUI();
            this.StartGuidance(E_GuidanceStep.E_Aide);
        };
        /****************************引导功能***************************/
        /**
         * 设置常规引导信息
         * @param guidanceType	引导类型
         * @param guidanceStep	引导步骤
         * @param listener 		点击函数
         * @param rotation 		箭头旋转弧度
         * @param x 			光圈、箭头 x轴
         * @param y 			光圈、箭头 y轴
         * @param excursion_x 	箭头x轴偏移
         * @param excursion_y 	箭头y轴偏移
         */
        GuidanceView.prototype.SetGuidanceInfo = function (guidanceType, guidanceStep, listener, args, rotation, x, y, excursion_x, excursion_y) {
            if (rotation === void 0) { rotation = 180; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (excursion_x === void 0) { excursion_x = 0; }
            if (excursion_y === void 0) { excursion_y = -100; }
            this.offAll();
            this.guidBj.visible = true;
            H52D_Framework.Guidance.Instance.SetGuidanceStep(guidanceStep);
            this.aperture.on(Laya.Event.CLICK, this, listener, args);
            this.GuidanceType(guidanceType);
            this.SetEffectPos(x, y, excursion_x, excursion_y);
            this.ApertureEffect(0, 3);
            this.ArrowsEffect(rotation, 1);
            this.GuidanceAuto(Laya.Handler.create(this, listener, args));
        };
        /**
         * 设置引导文本信息
         * @param bVisible 是否显示文本框
         * @param stringID 国际化ID
         */
        GuidanceView.prototype.SetintroduceInfo = function (bVisible, stringID) {
            this.infoBg.visible = bVisible;
            if (stringID) {
                this.introduce.text = H52D_Framework.GetInfoAttr.Instance.GetText(stringID);
            }
        };
        /**开始引导 */
        GuidanceView.prototype.StartGuidance = function (type) {
            var _this = this;
            var point;
            switch (type) {
                case E_GuidanceStep.E_Aide:
                    this.offAll();
                    this.guidBj.visible = true;
                    this.time.visible = true;
                    this._time = H52D_Framework.GameParamConfig.GuideTime;
                    this.storyBj.visible = false;
                    this.arrows.visible = false;
                    this.SetintroduceInfo(true, 7021);
                    this.infoBg.y -= 200; //* G_StageHeightScale;
                    this.guidBj.on(Laya.Event.CLICK, this, function () {
                        _this.CloseUI();
                        H52D_Framework.Guidance.Instance.StartGuidance(E_GuidanceStep.E_Guidance_1);
                    });
                    this.GuidanceAuto(Laya.Handler.create(this, function () {
                        _this.CloseUI();
                        H52D_Framework.Guidance.Instance.StartGuidance(E_GuidanceStep.E_Guidance_1);
                    }));
                    break;
                case E_GuidanceStep.E_Guidance_1:
                    this.offAll();
                    this.guidBj.visible = true;
                    this.clickImg.visible = true;
                    this.infoBg.top = 320;
                    this.SetintroduceInfo(true, 7009);
                    this.aperture.on(Laya.Event.CLICK, this, this.ClickAttack, [1]);
                    H52D_Framework.Tick.Loop(5000, this, this.GameShowPic);
                    this.GuidanceAuto(Laya.Handler.create(this, this.ClickAttack, [3]));
                    this.GuidanceType(E_GuidanceType.E_Strong);
                    this.SetEffectPos(H52D_Framework.MonsterLocal[4][0], H52D_Framework.MonsterLocal[4][1] - 50, 0, 0);
                    this.ApertureEffect(0, 3);
                    this.ArrowsSlide(H52D_Framework.MonsterLocal[4][0], H52D_Framework.MonsterLocal[4][1] - 150, H52D_Framework.MonsterLocal[4][0] + 40, H52D_Framework.MonsterLocal[4][1] - 200, 200);
                    this.clickImg.x = H52D_Framework.MonsterLocal[4][0];
                    this.clickImg.y = H52D_Framework.MonsterLocal[4][1] + 70;
                    break;
                case E_GuidanceStep.E_Guidance_2:
                    this.SetintroduceInfo(false, 7010);
                    point = this.GetButtonPoint(H52D_Framework.ViewUILogic.Instance.listView.GetMainBtn(E_OpenGrade.HERO), true);
                    this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_2, this.HeroActivate, [E_OpenGrade.HERO], 180, point.x, point.y);
                    break;
                case E_GuidanceStep.E_Guidance_3:
                    this.SetintroduceInfo(false, 7012);
                    point = this.GetButtonPoint(H52D_Framework.ViewUILogic.Instance.listView.GetMainBtn(E_OpenGrade.HERO), true);
                    this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_3, this.HeroActivate, [E_OpenGrade.HERO], 180, point.x, point.y);
                    break;
                case E_GuidanceStep.E_Guidance_4:
                    this.SetintroduceInfo(false, 7013);
                    point = this.GetButtonPoint(H52D_Framework.ViewUILogic.Instance.listView.GetMainBtn(E_OpenGrade.HERO), true);
                    this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_4, this.HeroActivate, [E_OpenGrade.HERO], 180, point.x, point.y);
                    break;
                case E_GuidanceStep.E_Guidance_5:
                    this.SetintroduceInfo(false, 7014);
                    point = this.GetButtonPoint(H52D_Framework.ViewUILogic.Instance.listView.GetMainBtn(E_OpenGrade.HERO), true);
                    this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_5, this.HeroActivate, [E_OpenGrade.HERO], 180, point.x, point.y);
                    break;
                case E_GuidanceStep.E_Guidance_6:
                    this.SetintroduceInfo(false, 7015);
                    point = this.GetButtonPoint(H52D_Framework.ViewUILogic.Instance.listView.GetMainBtn(E_OpenGrade.ROLE), true);
                    this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_6, this.HeroActivate, [E_OpenGrade.ROLE], 180, point.x, point.y);
                    break;
                case E_GuidanceStep.E_Guidance_7:
                    this.SetintroduceInfo(true, 7016);
                    point = this.GetButtonPoint(H52D_Framework.Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_7), true);
                    this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_7, this.ClickBtnEvent, [H52D_Framework.EventDefine.BOSSHANDER], 0, point.x, point.y, 0, 100);
                    break;
                case E_GuidanceStep.E_Guidance_8:
                    this.SetintroduceInfo(false, 7017);
                    point = this.GetButtonPoint(H52D_Framework.ViewUILogic.Instance.listView.GetMainBtn(E_OpenGrade.HERO), true);
                    this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_8, this.HeroActivate, [E_OpenGrade.HERO], 180, point.x, point.y);
                    break;
                case E_GuidanceStep.E_Guidance_9:
                    this.SetintroduceInfo(false, 7018);
                    point = this.GetButtonPoint(H52D_Framework.ViewUILogic.Instance.listView.GetMainBtn(E_OpenGrade.PET), true);
                    this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_9, this.HeroActivate, [E_OpenGrade.PET], 180, point.x, point.y);
                    break;
                case E_GuidanceStep.E_Guidance_10:
                    this.SetintroduceInfo(false, 7022);
                    this.infoBg.top = 320;
                    point = this.GetButtonPoint(H52D_Framework.ViewUILogic.Instance.listView.GetMainBtn(E_OpenGrade.SHOP), true);
                    this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_10, this.HeroActivate, [E_OpenGrade.SHOP], 180, point.x, point.y);
                    break;
                case E_GuidanceStep.E_Guidance_11:
                    this.SetintroduceInfo(false, 7023);
                    point = this.GetButtonPoint(H52D_Framework.Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_11), true);
                    this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_11, this.ClickBtnEvent, null, 0, point.x, point.y, 0, 100);
                    break;
                case E_GuidanceStep.E_Guidance_12:
                    this.SetintroduceInfo(false, 7024);
                    point = this.GetButtonPoint(H52D_Framework.ViewUILogic.Instance.listView.GetMainBtn(E_OpenGrade.ACTION), true);
                    this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_12, this.HeroActivate, [E_OpenGrade.ACTION], 180, point.x, point.y);
                    break;
                case E_GuidanceStep.E_Guidance_13:
                    this.SetintroduceInfo(false);
                    point = this.GetButtonPoint(H52D_Framework.ViewUILogic.Instance.listView.GetMainBtn(E_OpenGrade.HERO), true);
                    this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_13, this.HeroActivate, [E_OpenGrade.HERO], 180, point.x, point.y);
                    break;
                case E_GuidanceStep.E_Guidance_14:
                    this.SetintroduceInfo(true, 7025);
                    point = this.GetButtonPoint(H52D_Framework.Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_14), true);
                    this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_14, this.ClickBtnEvent, null, 0, point.x, point.y, 0, 100);
                    break;
                case E_GuidanceStep.E_Empty:
                    break;
            }
        };
        /**一级引导触发效果 */
        GuidanceView.prototype.HeroActivate = function (clickType) {
            var _this = this;
            this.visible = false;
            this.aperture.off(Laya.Event.CLICK, this, this.HeroActivate);
            this.GuidanceType(E_GuidanceType.E_Strong);
            //设置全屏开窗
            H52D_Framework.Event.DispatchEvent("SetHalfPanel", [false]);
            H52D_Framework.Event.DispatchEvent("OnPanelClick", [clickType, true, Laya.Handler.create(this, function () {
                    //需要文字的引导
                    if (H52D_Framework.Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_2 ||
                        H52D_Framework.Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_3 ||
                        H52D_Framework.Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_6 ||
                        H52D_Framework.Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_8 ||
                        H52D_Framework.Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_9 ||
                        H52D_Framework.Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_10) {
                        _this.SetintroduceInfo(true);
                    }
                    _this.aperture.on(Laya.Event.CLICK, _this, _this.ClickBtnEvent);
                    _this.GuidanceAuto(Laya.Handler.create(_this, _this.ClickBtnEvent));
                    //设置引导位置
                    _this.NewTeach();
                })]);
        };
        /**
         * 引导触发效果，派发点击按钮事件
         * @param EventStr 事件名
         * @param args 事件参数
         */
        GuidanceView.prototype.ClickBtnEvent = function (EventStr, args) {
            this.visible = false;
            //直接派发事件
            if (typeof (EventStr) == "string") {
                H52D_Framework.Event.DispatchEvent(EventStr, args);
                this.CloseUI();
            }
            //有多级引导
            else {
                //触发按钮事件
                this.ClickButton(H52D_Framework.Guidance.Instance.guidanceStep);
                switch (H52D_Framework.Guidance.Instance.guidanceStep) {
                    case E_GuidanceStep.E_Guidance_4:
                        this.ClickGoWarGuidance_4();
                        return;
                    case E_GuidanceStep.E_Guidance_5:
                        this.ClickGoStar();
                        break;
                    case E_GuidanceStep.E_Guidance_6:
                        this.ClickUpSkill();
                        break;
                    case E_GuidanceStep.E_Guidance_8:
                        this.ClickGoWarGuidance_8();
                        return;
                    case E_GuidanceStep.E_Guidance_11:
                        this.ClickStronger();
                        break;
                    case E_GuidanceStep.E_Guidance_12:
                        this.ClickLaddle();
                        break;
                    case E_GuidanceStep.E_Guidance_13:
                        this.ClickLv();
                        break;
                    default:
                        this.CloseUI();
                        break;
                }
            }
        };
        /**自动调整光圈位置 */
        GuidanceView.prototype.NewTeach = function () {
            var _this = this;
            var guidanceStep = H52D_Framework.Guidance.Instance.guidanceStep;
            H52D_Framework.OneTimer(this._oneTimer, function () {
                _this.visible = true;
                _this.ApertureEffect(0, 3);
                _this.ArrowsEffect(0, 1);
                //不需要转坐标的引导
                // if (guidanceStep == E_GuidanceStep.E_Guidance_13) {
                // 	this.SetEffectPos(Guidance.Instance.GetGuidanceButton(Guidance.Instance.guidanceStep).x, Guidance.Instance.GetGuidanceButton(guidanceStep).y + 50, 0, 100);
                // }
                // else {
                var point = _this.GetButtonPoint(H52D_Framework.Guidance.Instance.GetGuidanceButton(guidanceStep), true);
                _this.SetEffectPos(point.x, point.y, 0, 100);
                //}
            });
        };
        /**点击引导光圈攻击 */
        GuidanceView.prototype.ClickAttack = function (num) {
            this._clickNum += num;
            H52D_Framework.Event.DispatchEvent("OnSlideDown");
            if (this._clickNum >= 3) {
                this.CloseUI();
                H52D_Framework.Guidance.Instance.SetGuidanceStep(E_GuidanceStep.E_Guidance_2);
            }
        };
        /**点击我要变强 */
        GuidanceView.prototype.ClickStronger = function () {
            var _this = this;
            this.SetintroduceInfo(true);
            this.aperture.off(Laya.Event.CLICK, this, this.ClickBtnEvent);
            this.aperture.on(Laya.Event.CLICK, this, this.ClickPrivilege);
            this.GuidanceAuto(Laya.Handler.create(this, this.ClickPrivilege));
            H52D_Framework.OneTimer(this._oneTimer, function () {
                _this.visible = true;
                var point = _this.GetButtonPoint(H52D_Framework.Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_11), true);
                _this.SetEffectPos(point.x, point.y, 0, 100);
            });
        };
        /**点击我要变强 特权 */
        GuidanceView.prototype.ClickPrivilege = function () {
            this.ClickButton(E_GuidanceStep.E_Guidance_11);
            this.CloseUI();
            H52D_Framework.OneTimer(1000, function () {
                H52D_Framework.Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_7);
            });
        };
        /**点击升级*1 */
        GuidanceView.prototype.ClickLv = function () {
            this.visible = true;
            //触发按钮事
            // let btn: Laya.ComboBox = Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_13) as Laya.ComboBox;
            // btn.isOpen = true;
            var point = this.GetButtonPoint(H52D_Framework.Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_13 + 1000), true);
            this.SetEffectPos(point.x, point.y, 0, 100);
            this.aperture.off(Laya.Event.CLICK, this, this.ClickBtnEvent);
            this.aperture.on(Laya.Event.CLICK, this, this.ClickLvMax);
            this.GuidanceAuto(Laya.Handler.create(this, this.ClickLvMax));
        };
        /**点击升级*10 */
        GuidanceView.prototype.ClickLvMax = function () {
            this.ClickButton(E_GuidanceStep.E_Guidance_13 + 1000);
            var point = this.GetButtonPoint(H52D_Framework.Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_13 + 2000), true);
            this.SetEffectPos(point.x, point.y, 0, 100);
            // let btn: Laya.ComboBox = Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_13) as Laya.ComboBox;
            // btn.selectedIndex = 2;
            // Event.DispatchEvent("Btn_shopclick");
            this.aperture.off(Laya.Event.CLICK, this, this.ClickLvMax);
            this.aperture.on(Laya.Event.CLICK, this, this.ClickLvTwoHero);
            this.GuidanceAuto(Laya.Handler.create(this, this.ClickLvTwoHero));
        };
        /**点击升级第二个英雄 */
        GuidanceView.prototype.ClickLvTwoHero = function () {
            this.ClickButton(E_GuidanceStep.E_Guidance_13 + 2000);
            this.CloseUI();
        };
        /**点击布阵页面Guidance_4 */
        GuidanceView.prototype.ClickGoWarGuidance_4 = function () {
            var _this = this;
            this.SetintroduceInfo(true);
            this.Close();
            H52D_Framework.OneTimer(this._oneTimer, function () {
                _this.visible = true;
                var point_1 = _this.GetButtonPoint(H52D_Framework.Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_4 + 2000), true);
                var point_2 = _this.GetButtonPoint(H52D_Framework.Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_4 + 3000), true);
                _this.aperture.off(Laya.Event.CLICK, _this, _this.ClickBtnEvent);
                _this.aperture.on(Laya.Event.MOUSE_DOWN, _this, _this.ExchangePlace);
                _this.GuidanceAuto(Laya.Handler.create(_this, _this.AutoExchangePlace));
                _this._arrows.visible = false;
                _this.SetEffectPos(point_1.x, point_1.y, 0, 0);
                _this.ArrowsSlide(point_1.x, point_1.y - 100, point_2.x, point_2.y - 100, 2000, 0);
            });
        };
        /**点击布阵页面Guidance_8 */
        GuidanceView.prototype.ClickGoWarGuidance_8 = function () {
            var _this = this;
            this.SetintroduceInfo(true);
            this.Close();
            H52D_Framework.OneTimer(this._oneTimer, function () {
                _this.visible = true;
                var point_1 = _this.GetButtonPoint(H52D_Framework.Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_8 + 1000), true);
                var point_2 = _this.GetButtonPoint(H52D_Framework.Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_4 + 3000), true);
                _this.aperture.off(Laya.Event.CLICK, _this, _this.ClickBtnEvent);
                _this.aperture.on(Laya.Event.MOUSE_DOWN, _this, _this.ExchangePlace);
                _this.GuidanceAuto(Laya.Handler.create(_this, _this.AutoExchangePlace));
                _this.SetEffectPos(point_1.x, point_1.y, 0, 0);
                _this._arrows.visible = false;
                _this.ArrowsSlide(point_1.x, point_1.y - 100, point_2.x, point_2.y - 100, 3000, 0);
            });
        };
        /**点击进阶页面 */
        GuidanceView.prototype.ClickGoStar = function () {
            var _this = this;
            this.SetintroduceInfo(true);
            this.GuidanceType(E_GuidanceType.E_Strong);
            this.aperture.off(Laya.Event.CLICK, this, this.ClickBtnEvent);
            this.aperture.on(Laya.Event.CLICK, this, this.ClickBtnEvent, ["ClickBtnStar"]);
            this.GuidanceAuto(Laya.Handler.create(this, this.ClickBtnEvent, ["ClickBtnStar"]));
            H52D_Framework.OneTimer(this._oneTimer, function () {
                _this.visible = true;
                var point = _this.GetButtonPoint(H52D_Framework.Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_5 + 1000), true);
                _this.SetEffectPos(point.x, point.y, 0, 100);
            });
        };
        /**手动交换位置 */
        GuidanceView.prototype.ExchangePlace = function () {
            this.infoBg.visible = true;
            if (H52D_Framework.Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_4) {
                H52D_Framework.Event.DispatchEvent("ExchangePlace");
            }
            else if (H52D_Framework.Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_8) {
                H52D_Framework.Event.DispatchEvent("fsTen");
            }
            this.guidBj.visible = false;
            this.aperture.off(Laya.Event.MOUSE_DOWN, this, this.ExchangePlace);
            this.CloseUI();
        };
        /**自动交换位置 */
        GuidanceView.prototype.AutoExchangePlace = function () {
            this.aperture.off(Laya.Event.MOUSE_DOWN, this, this.ExchangePlace);
            if (H52D_Framework.Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_4) {
                H52D_Framework.Guidance.Instance.SetGuidanceStep(E_GuidanceStep.E_Guidance_4);
                var heroID = H52D_Framework.HeroPosition.Instance.PositionWar[0];
                H52D_Framework.Event.DispatchEvent("PutHero", [4, heroID]);
            }
            else if (H52D_Framework.Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_8) {
                H52D_Framework.Guidance.Instance.SetGuidanceStep(E_GuidanceStep.E_Guidance_8);
                var heroID = H52D_Framework.HeroManager.Instance.Hero_sort(9);
                H52D_Framework.Event.DispatchEvent("PutHero", [4, heroID]);
            }
            this.Close();
            this.SaveWar();
        };
        /**保存布阵 */
        GuidanceView.prototype.SaveWar = function () {
            this.visible = true;
            this.infoBg.visible = false;
            var point = this.GetButtonPoint(H52D_Framework.Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_4 + 1000), true);
            if (H52D_Framework.Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_4) {
                H52D_Framework.CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_war_1, true);
                this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_4, this.ClickBtnEvent, ["SaveWar"], 0, point.x, point.y, 0, 100);
            }
            else if (H52D_Framework.Guidance.Instance.guidanceStep == E_GuidanceStep.E_Guidance_8) {
                H52D_Framework.CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.Guidance_war_2, true);
                this.SetGuidanceInfo(E_GuidanceType.E_Strong, E_GuidanceStep.E_Guidance_8, this.ClickBtnEvent, ["SaveWar"], 0, point.x, point.y, 0, 100);
            }
        };
        /**解锁技能 */
        GuidanceView.prototype.ClickUpSkill = function () {
            var _this = this;
            this.SetintroduceInfo(true);
            H52D_Framework.Event.DispatchEvent("PanelClose");
            this.aperture.off(Laya.Event.CLICK, this, this.ClickBtnEvent);
            this.aperture.on(Laya.Event.CLICK, this, this.ClickOnSkill);
            this.GuidanceAuto(Laya.Handler.create(this, this.ClickOnSkill));
            H52D_Framework.OneTimer(this._oneTimer, function () {
                _this.visible = true;
                _this._arrows.rotation = 180;
                var point = _this.GetButtonPoint(H52D_Framework.Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_6 + 1000), true);
                _this.SetEffectPos(point.x, point.y, 0, -100);
            });
        };
        /**释放技能 */
        GuidanceView.prototype.ClickOnSkill = function () {
            this.ClickButton(E_GuidanceStep.E_Guidance_6 + 1000);
            this.CloseUI();
        };
        /**天梯匹配 */
        GuidanceView.prototype.ClickLaddle = function () {
            var _this = this;
            this.SetintroduceInfo(true);
            this.aperture.off(Laya.Event.CLICK, this, this.ClickBtnEvent);
            this.aperture.on(Laya.Event.CLICK, this, this.ClickBtnEvent, ["btnclick_challag"]);
            this.GuidanceAuto(Laya.Handler.create(this, this.ClickBtnEvent, ["btnclick_challag"]));
            H52D_Framework.OneTimer(this._oneTimer, function () {
                _this.visible = true;
                var point = _this.GetButtonPoint(H52D_Framework.Guidance.Instance.GetGuidanceButton(E_GuidanceStep.E_Guidance_12), true);
                _this.SetEffectPos(point.x, point.y, 0, 100);
            });
        };
        /**选择引导类型 */
        GuidanceView.prototype.GuidanceType = function (guidanceType) {
            this.storyBj.visible = false;
            this._guidanceType = guidanceType;
            this.spr_1.visible = this.time.visible = guidanceType == E_GuidanceType.E_Strong;
        };
        /**自动引导 */
        GuidanceView.prototype.GuidanceAuto = function (fun) {
            H52D_Framework.Tick.Clear(this, this.AutoTime);
            this._time = 10;
            if (H52D_Framework.Guidance.Instance.guidanceStep == E_GuidanceStep.E_Aide) {
                this._time = 7;
            }
            H52D_Framework.Tick.Loop(1000, this, this.AutoTime, [fun]);
        };
        GuidanceView.prototype.AutoTime = function (fun) {
            this._time--;
            this.time.text = "自动引导下一步（" + this._time + "s)";
            if (this._time <= 0) {
                fun.run();
            }
        };
        /*******************************特效功能*******************************/
        /**
         * 光圈特效加载
         * @param direction 旋转
         * @param scale 大小
         * @param Btn 附载框
         */
        GuidanceView.prototype.ApertureEffect = function (direction, scale, Btn) {
            var _this = this;
            if (this._aperture) {
                this._aperture.Destroy();
            }
            if (Btn) {
                this._aperture = new H52D_Framework.Avatar(Btn);
                this._aperture.Load("res/effect/effect_ui_guangquan/effect_ui_guangquan.sk", 1, scale, 50, 50, Laya.Handler.create(this, function () {
                    _this._aperture.Play("effect_ui_guangquan", true, true, function () {
                    });
                    _this._aperture.Armature.rotation = direction;
                }));
            }
            else {
                this._aperture = new H52D_Framework.Avatar(this.aperture);
                this._aperture.Load("res/effect/effect_ui_guangquan/effect_ui_guangquan.sk", 1, scale, 50, 50, Laya.Handler.create(this, function () {
                    _this._aperture.Play("effect_ui_guangquan", true, true, function () {
                    });
                    _this._aperture.Armature.rotation = direction;
                }));
            }
        };
        /**
         * 箭头特效加载
         * @param direction 旋转
         * @param scale 大小
         * @param Btn 附载框
         */
        GuidanceView.prototype.ArrowsEffect = function (direction, scale, Btn) {
            var _this = this;
            this.arrows.skin = "";
            if (this._arrows) {
                this._arrows.Destroy();
            }
            if (Btn) {
                this._arrows = new H52D_Framework.Avatar(Btn);
                this._arrows.Load("res/effect/effect_ui_jiantou/effect_ui_jiantou.sk", 1, scale, 0, 0, Laya.Handler.create(this, function () {
                    _this._arrows.Play("effect_ui_jiantou", true, true, function () {
                    });
                    _this._arrows.Armature.rotation = direction;
                }));
            }
            else {
                this._arrows = new H52D_Framework.Avatar(this.arrows);
                this._arrows.Load("res/effect/effect_ui_jiantou/effect_ui_jiantou.sk", 1, scale, 0, 0, Laya.Handler.create(this, function () {
                    _this._arrows.Play("effect_ui_jiantou", true, true, function () {
                    });
                    _this._arrows.Armature.rotation = direction;
                }));
            }
        };
        /**
         * 设置特效位置
         * @param x 光圈、箭头x轴
         * @param y 光圈、箭头y轴
         * @param excursion_x 箭头x轴偏移
         * @param excursion_y 箭头y轴偏移
         * @param Btn 附载框
         */
        GuidanceView.prototype.SetEffectPos = function (x, y, excursion_x, excursion_y, Btn) {
            var value_x = x; //* G_StageWidthScale;
            var value_y = y; //* G_StageHeightScale;
            var ax = value_x + excursion_x;
            var ay = value_y + excursion_y;
            this.aperture.x = value_x;
            this.aperture.y = value_y;
            this.arrows.x = ax;
            this.arrows.y = ay;
            this.click.x = value_x;
            this.click.y = value_y;
        };
        /**光圈呼吸效果 */
        GuidanceView.prototype.SetEffectScale = function () {
            var _this = this;
            var x = 1;
            H52D_Framework.Tick.FrameLoop(2, this, function () {
                if (!_this._aperture || !_this._aperture.loaded)
                    return;
                var scaleValue = Math.sin(x);
                scaleValue > 0 ? scaleValue += 4 : scaleValue -= 4;
                _this._aperture.scale = scaleValue / 2;
                _this.click.scale(scaleValue, scaleValue);
                x += 0.02;
            });
        };
        /**
         * 获取引导按钮的准确位置
         * @param button 引导下的按钮
         * @param bCentre 按钮的锚点是否在中心
         */
        GuidanceView.prototype.GetButtonPoint = function (button, bCentre) {
            if (button == null || button._destroyed) {
                return new laya.maths.Point(0, 0);
            }
            var x = bCentre ? button.width / 2 : 0;
            var y = bCentre ? button.height / 2 : 0;
            var point = button.localToGlobal(new laya.maths.Point(x, y));
            return H52D_Framework.NewGuidRoot.globalToLocal(point);
        };
        /**
         * 点击触发对应按钮
         * @param eGuidanceStep
         * @param bCentre
         */
        GuidanceView.prototype.ClickButton = function (eGuidanceStep) {
            var btn = H52D_Framework.Guidance.Instance.GetGuidanceButton(eGuidanceStep);
            btn.event(Laya.Event.CLICK, btn);
        };
        /** 点点点文字呼吸效果*/
        GuidanceView.prototype.GameShowPic = function () {
            var _this = this;
            var tween;
            tween = Laya.Tween.to(this.clickImg, { alpha: 0 }, 500, Laya.Ease.linearIn, Laya.Handler.create(this, function () {
                Laya.Tween.clear(tween);
                tween = Laya.Tween.to(_this.clickImg, { alpha: 1 }, 1200, Laya.Ease.linearIn, Laya.Handler.create(_this, function () {
                    Laya.Tween.clear(tween);
                }));
            }));
        };
        /**
         * 手指来回移动功能
         * @param start_x 起点x轴
         * @param start_y 起点y轴
         * @param end_x 终点x轴
         * @param end_y 终点y轴
         * @param time 移动总时间
         * @param rot 旋转
         */
        GuidanceView.prototype.ArrowsSlide = function (start_x, start_y, end_x, end_y, time, rot) {
            if (rot === void 0) { rot = 0; }
            this.arrows.visible = true;
            this.arrows.skin = "ui_guid/ui_shouzhi.png";
            this.arrows.rotation = rot;
            this.arrows.x = start_x; //* G_StageWidthScale;
            this.arrows.y = start_y; //* G_StageHeightScale;
            //this.Open(start_x * G_StageWidthScale, start_y * G_StageHeightScale, end_x * G_StageWidthScale, end_y * G_StageHeightScale, time);
            this.Open(start_x, start_y, end_x, end_y, time);
        };
        GuidanceView.prototype.Open = function (start_x, start_y, end_x, end_y, time) {
            this.loop = true;
            this.Come(start_x, start_y, end_x, end_y, time);
        };
        GuidanceView.prototype.Close = function () {
            if (this.comeTween == null || this.goTween == null)
                return;
            Laya.Tween.clear(this.comeTween);
            Laya.Tween.clear(this.goTween);
        };
        GuidanceView.prototype.Come = function (start_x, start_y, end_x, end_y, time) {
            var _this = this;
            this.comeTween = Laya.Tween.to(this.arrows, { x: end_x, y: end_y }, time, Laya.Ease.linearIn, Laya.Handler.create(this, function () {
                if (_this.loop) {
                    _this.Go(start_x, start_y, end_x, end_y, time);
                }
                else {
                    _this.Close();
                }
            }));
        };
        GuidanceView.prototype.Go = function (start_x, start_y, end_x, end_y, time) {
            var _this = this;
            this.goTween = Laya.Tween.to(this.arrows, { x: start_x, y: start_y }, time, Laya.Ease.linearIn, Laya.Handler.create(this, function () {
                if (_this.loop) {
                    _this.Come(start_x, start_y, end_x, end_y, time);
                }
                else {
                    _this.Close();
                }
            }));
        };
        return GuidanceView;
    }(ui.guidance.GuidanceViewUI));
    H52D_Framework.GuidanceView = GuidanceView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=GuidanceView.js.map