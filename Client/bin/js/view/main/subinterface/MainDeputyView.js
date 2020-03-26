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
var H52D_Framework;
(function (H52D_Framework) {
    /**
     * @class：副本页面
     * @author：zhangyusong
     */
    var MainDeputyView = /** @class */ (function (_super) {
        __extends(MainDeputyView, _super);
        function MainDeputyView() {
            var _this = _super.call(this) || this;
            _this.COUNTDOWN = "倒计时:xS";
            _this.ViewInit();
            _this.EventInit();
            return _this;
        }
        Object.defineProperty(MainDeputyView.prototype, "fireCountdown", {
            get: function () {
                return this._fireCountdown;
            },
            set: function (value) {
                this._fireCountdown = value;
                this.txt_countdown.text = this.COUNTDOWN.replace("x", String(this._fireCountdown));
            },
            enumerable: true,
            configurable: true
        });
        MainDeputyView.prototype.Destroy = function () {
            this.Quit_boss();
        };
        MainDeputyView.prototype.ViewInit = function () {
            this.countdown = new H52D_Framework.Countdwon(false);
            this.countdown.centerX = 0;
            this.countdown.centerY = 0;
            this.addChild(this.countdown);
            this.Btn_buff.visible = false;
            this.btn_memory.visible = false;
        };
        MainDeputyView.prototype.EventInit = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_close.on(Laya.Event.CLICK, this, this.OnCloseHander);
            H52D_Framework.Event.RegistEvent("ShowDeputy", Laya.Handler.create(this, this.ShowDeputy));
            H52D_Framework.Event.RegistEvent("DeputyFireStart", Laya.Handler.create(this, this.DeputyStart));
            H52D_Framework.Event.RegistEvent("DeputyClose", Laya.Handler.create(this, this.DeputyClose));
        };
        MainDeputyView.prototype.ShowDeputy = function () {
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Kicking) {
                this.tatil.text = H52D_Framework.GetInfoAttr.Instance.GetTitle(E_OpenGrade.KICKING);
            }
            else if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Ladder) {
                this.tatil.text = H52D_Framework.GetInfoAttr.Instance.GetTitle(E_OpenGrade.LADDER);
            }
            else if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Boss) {
                this.tatil.text = H52D_Framework.GetInfoAttr.Instance.GetTitle(E_OpenGrade.BOSS);
                //this.Btn_buff.visible = true;
                this._fireCountdown = H52D_Framework.CustomsManager.Instance.CustomsVo.waveTime;
                this.Btn_buff.on(Laya.Event.CLICK, this, this.OpenView, ["WroldBossBuffView"]);
            }
            else if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                this.tatil.text = H52D_Framework.GetInfoAttr.Instance.GetTitle(E_OpenGrade.MEMORY);
                //this.btn_memory.visible = true;                
                this.btn_memory.on(Laya.Event.CLICK, this, this.OpenView, ["MemoryTargetView"]);
            }
            else if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                //this.tatil.text = GetInfoAttr.Instance.GetTitle(E_OpenGrade.PKMATCH);
                this.tatil.text = "海选大赛";
            }
            else if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.MatchChampion) {
                this.tatil.text = H52D_Framework.GetInfoAttr.Instance.GetTitle(E_OpenGrade.PKMATCH);
            }
            this.Btn_buff.visible = H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Boss;
            this.btn_memory.visible = H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Memory;
        };
        MainDeputyView.prototype.OnCloseHander = function () {
            var _this = this;
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Kicking ||
                H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Memory ||
                H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Ladder) {
                H52D_Framework.UIManager.Instance.CreateUI("KickingPromptView", [H52D_Framework.ViewUpRoot, H52D_Framework.CustomsManager.Instance.CustomsType, function () { _this.DeputyClose(); }]);
            }
            else if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Boss) {
                this.DeputyClose();
            }
            else if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                this.DeputyClose();
            }
            else if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.MatchChampion) {
                this.DeputyClose();
            }
        };
        MainDeputyView.prototype.DeputyClose = function () {
            if (H52D_Framework.UIManager.Instance.IsHave("KickingPromptView", H52D_Framework.ViewUpRoot)) {
                H52D_Framework.KickingLogic.Instance.PvpCombatEnd(0, 2, false);
                H52D_Framework.UIManager.Instance.DestroyUI("KickingPromptView", [H52D_Framework.ViewUpRoot]);
            }
            this.countdown.Destroy();
            H52D_Framework.Tick.Clear(this, this.FireCountdown);
            //退出王者约战
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Kicking) {
                H52D_Framework.UIManager.Instance.CreateUI("KickingChooseView", [H52D_Framework.ViewUpRoot]);
            }
            //退出世界Boss
            else if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Boss) {
                H52D_Framework.WroldBossLogic.Instance.Buff_Del();
                H52D_Framework.WroldBossLogic.Instance.SendHrut();
                if (H52D_Framework.UIManager.Instance.IsHave("WroldBossBuffView", H52D_Framework.ViewUpRoot)) {
                    H52D_Framework.UIManager.Instance.DestroyUI("WroldBossBuffView", [H52D_Framework.ViewUpRoot]);
                }
                H52D_Framework.Event.DispatchEvent("BossThrough");
                this.Quit_boss();
            }
            //退出天梯竞技
            else if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Ladder) {
                H52D_Framework.UIManager.Instance.CreateUI("LadderView", [H52D_Framework.ViewDownRoot]);
                H52D_Framework.LadderManager.Instance.IsMatching = false;
            }
            //退出时段记忆
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                if (H52D_Framework.UIManager.Instance.IsHave("MemoryTargetView", H52D_Framework.ViewUpRoot)) {
                    H52D_Framework.UIManager.Instance.DestroyUI("MemoryTargetView", [H52D_Framework.ViewUpRoot]);
                }
                H52D_Framework.MemoryLogic.Instance.ActivityInfo();
            }
            //退出Pk联赛海选
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                //发送伤害
                H52D_Framework.MatchLogic.Instance.SendHurt();
                //上傳pk陣容
                H52D_Framework.DataManager.Instance.PackData_m();
                //上传阵容dps伤害和血量
                H52D_Framework.DataManager.Instance.SendCapacityData();
                //清理倒计时数据
                H52D_Framework.Event.DispatchEvent("BossThrough");
                H52D_Framework.Event.DispatchEvent("StopClick", [true]);
                H52D_Framework.Event.DispatchEvent("SkillMouseEnable");
            }
            //退出PK联赛决赛
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.MatchChampion) {
                if (H52D_Framework.MatchLogic.Instance.curMatchStage == H52D_Framework.MacthType.eLeagueWar1) {
                    H52D_Framework.UIManager.Instance.CreateUI("ChampionPraiseView", [H52D_Framework.ViewUpRoot]);
                }
                H52D_Framework.Event.DispatchEvent("StopClick", [true]);
                H52D_Framework.Event.DispatchEvent("SkillMouseEnable");
            }
            //回主场景
            H52D_Framework.BattlefieldManager.Instance.Destroy();
            H52D_Framework.CustomsManager.Instance.LeaveCustomsManager();
            H52D_Framework.BattleManager.Instance.OpenBattle();
            H52D_Framework.Event.DispatchEvent("ShowDeputy");
        };
        MainDeputyView.prototype.DeputyStart = function () {
            var _this = this;
            this.fireCountdown = H52D_Framework.CustomsManager.Instance.CustomsVo.waveTime;
            this.countdown.time = 3;
            H52D_Framework.Tick.Once(600, this, function () {
                _this.countdown.Start(Laya.Handler.create(_this, _this.Start));
            });
        };
        MainDeputyView.prototype.Start = function () {
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Kicking ||
                H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Ladder) {
                this.PvpStart();
            }
            else if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                this.MemoryStart();
            }
            else if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Boss) {
                this.BossStart();
            }
            else if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                this.MatchBossStart();
            }
            else if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.MatchChampion) {
                this.MatchChampionStart();
            }
        };
        /**Pvp开始回调 */
        MainDeputyView.prototype.PvpStart = function () {
            this.PlayFightCharacter();
            H52D_Framework.BattlefieldManager.Instance.OnFire();
            this.fireCountdown = this.fireCountdown;
            H52D_Framework.Tick.Loop(1000, this, this.FireCountdown);
            H52D_Framework.BattleManager.Instance.StopBattle();
            H52D_Framework.Event.DispatchEvent("SkillMouseEnable");
        };
        MainDeputyView.prototype.BossStart = function () {
            this.fireCountdown = this.fireCountdown;
            H52D_Framework.Tick.Loop(1000, this, this.FireCountdown);
            H52D_Framework.Event.DispatchEvent("StopClick", [true]);
            H52D_Framework.CaptainSkill.CurCdTime = 0;
            H52D_Framework.BattleManager.Instance.OpenBattle();
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.BEGIN_FIRE);
            H52D_Framework.Event.DispatchEvent("SkillMouseEnable");
        };
        MainDeputyView.prototype.MatchBossStart = function () {
            this.fireCountdown = this.fireCountdown;
            H52D_Framework.Tick.Loop(1000, this, this.FireCountdown);
            //不容许点击
            H52D_Framework.Event.DispatchEvent("StopClick", [false]);
            H52D_Framework.CaptainSkill.CurCdTime = 0;
            H52D_Framework.BattleManager.Instance.OpenBattle();
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.BEGIN_FIRE);
            //开启技能
            //Event.DispatchEvent("SkillMouseEnable");
        };
        MainDeputyView.prototype.MatchChampionStart = function () {
            this.PlayFightCharacter();
            H52D_Framework.BattlefieldManager.Instance.OnFire();
            this.fireCountdown = this.fireCountdown;
            H52D_Framework.Tick.Loop(1000, this, this.FireCountdown);
            H52D_Framework.BattleManager.Instance.StopBattle();
            //不容许点击
            H52D_Framework.Event.DispatchEvent("StopClick", [false]);
        };
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
        MainDeputyView.prototype.MemoryStart = function () {
            this.PlayFightCharacter();
            this.fireCountdown = this.fireCountdown;
            H52D_Framework.Tick.Loop(1000, this, this.FireCountdown);
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.BEGIN_FIRE);
            H52D_Framework.Event.DispatchEvent("SkillMouseEnable");
        };
        MainDeputyView.prototype.FireCountdown = function () {
            if (--this.fireCountdown > 0) {
                if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Kicking ||
                    H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Ladder) {
                    if (H52D_Framework.BattlefieldManager.Instance.end) {
                        H52D_Framework.Tick.Clear(this, this.FireCountdown);
                        H52D_Framework.BattleManager.Instance.OpenBattle();
                    }
                }
                else if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                    if (H52D_Framework.BattleManager.Instance.bOver) {
                        H52D_Framework.Tick.Clear(this, this.FireCountdown);
                        H52D_Framework.MemoryLogic.Instance.surplusTime = H52D_Framework.CustomsManager.Instance.CustomsVo.waveTime - this.fireCountdown;
                        H52D_Framework.BattleManager.Instance.MemeryEnd();
                    }
                }
                else if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.MatchChampion) {
                    if (H52D_Framework.BattlefieldManager.Instance.end) {
                        H52D_Framework.Tick.Clear(this, this.FireCountdown);
                    }
                }
            }
            else {
                H52D_Framework.Tick.Clear(this, this.FireCountdown);
                if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Kicking ||
                    H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Ladder) {
                    H52D_Framework.BattlefieldManager.Instance.Dispone();
                    H52D_Framework.BattlefieldManager.Instance.Destroy();
                    H52D_Framework.BattleManager.Instance.OpenBattle();
                }
                else if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                    H52D_Framework.MemoryLogic.Instance.surplusTime = H52D_Framework.CustomsManager.Instance.CustomsVo.waveTime - this.fireCountdown;
                    H52D_Framework.BattleManager.Instance.MemeryEnd();
                }
            }
        };
        //开始战斗文字
        MainDeputyView.prototype.PlayFightCharacter = function () {
            var _this = this;
            this.play.visible = true;
            this.play.scaleX = 1.2;
            this.play.scaleY = 1.2;
            this.play.alpha = 1;
            var completeFunc = function () {
                _this.play.visible = false;
            };
            var t = Laya.Tween.to(this.play, { scaleX: 1, scaleY: 1, alpha: 0 }, 400, Laya.Ease.linearInOut, Laya.Handler.create(this, completeFunc));
            H52D_Framework.Tick.Once(400, this, completeFunc);
        };
        MainDeputyView.prototype.OpenView = function (name) {
            H52D_Framework.UIManager.Instance.CreateUI(name, [H52D_Framework.ViewUpRoot]);
        };
        MainDeputyView.prototype.Quit_boss = function () {
            H52D_Framework.CustomsManager.Instance.LeaveCustomsManager();
            H52D_Framework.WroldBossLogic.Instance.Buff_Del();
            H52D_Framework.WroldBossLogic.Instance.SendHrut();
            if (H52D_Framework.UIManager.Instance.IsHave("WroldBossBuffView", H52D_Framework.ViewUpRoot)) {
                H52D_Framework.UIManager.Instance.DestroyUI("WroldBossBuffView", [H52D_Framework.ViewUpRoot]);
            }
            H52D_Framework.Event.DispatchEvent("BossThrough");
            H52D_Framework.Event.DispatchEvent("StopClick", [true]);
            H52D_Framework.Event.DispatchEvent("SkillMouseEnable");
        };
        return MainDeputyView;
    }(ui.main.subinterface.MainDeputyViewUI));
    H52D_Framework.MainDeputyView = MainDeputyView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MainDeputyView.js.map