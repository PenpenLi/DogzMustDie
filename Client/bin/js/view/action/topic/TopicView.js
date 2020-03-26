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
     * @class：话题先锋面板
     * @author：zhangyusong
     */
    var TopicView = /** @class */ (function (_super) {
        __extends(TopicView, _super);
        function TopicView(id) {
            var _this = _super.call(this) || this;
            // 出生点
            _this.BRITH_X = 360;
            _this.BRITH_Y = 480;
            _this.SKILL_CLICK = 100;
            _this.LOCAL_WIN = [112, 592, 352];
            _this.countdownTime = 3;
            _this._hurt = 0;
            _this.bgImg.skin = "res/ui/ui_noPack/img-daguanchangjing-huantixiangfeng.png";
            _this.id = id;
            _this.ViewInit();
            _this.EventInit();
            _this.wxbg.y = wxsclae;
            return _this;
        }
        TopicView.prototype.ViewInit = function () {
            this.actionVo = H52D_Framework.TopicLogic.Instance.CurrVo;
            this.attack_name.text = this.actionVo.name;
            this.attack_point.text = this.actionVo.attackPoint;
            H52D_Framework.SetHtmlStyle(this.attack_instruction, 20, "#fef3ce", "left");
            this.attack_instruction.innerHTML = this.actionVo.attackInstruction;
            this.countdown = new H52D_Framework.Countdwon();
            this.countdown.centerX = 0;
            this.countdown.centerY = 0;
            this.fighting.addChild(this.countdown);
            this.pic_point_click.alpha = 0;
            this.pic_start_click.visible = false;
            this.pic_end_click.visible = false;
            this.icon_win.visible = false;
            this.btn_against.gray = false;
            this.btn_support.gray = false;
            this._showPointTime = 0;
            this.tx_reward.text = "";
            this.actionEffect = H52D_Framework.ActiveSkillConfig[this.SKILL_CLICK]["actionEffect"];
            this.contributeNumber = this.actionVo.contribution;
            this.AddMonster();
            //胜利方为空，说明正在游戏中
            if (this.actionVo.win == H52D_Framework.ViewPoint.empty) {
                //游戏未开启，游戏开始
                if (this.actionVo.stamp == 0) {
                    this.fightCountdownNumber = this.actionVo.countdown;
                    this.GameStart();
                }
                //游戏已开启，判断是否过时
                else {
                    var time = H52D_Framework.Time.serverSecodes - this.actionVo.stamp;
                    //未过时，游戏刷新
                    if (time < this.actionVo.countdown + 3) {
                        this.fightCountdownNumber = this.actionVo.countdown + 3 - time;
                        this.GameUpdate();
                    }
                    //已过时，游戏结束
                    else {
                        this.fightCountdownNumber = 0;
                        this.GameOver();
                    }
                }
            }
            //有胜利方，游戏结算
            else {
                this.GameBalance();
            }
        };
        TopicView.prototype.EventInit = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_close.on(Laya.Event.CLICK, this, this.ClosePanel);
            this.target.on(Laya.Event.MOUSE_DOWN, this, this.GameFight);
            H52D_Framework.Event.RegistEvent("TopicInit", Laya.Handler.create(this, this.ViewInit));
            H52D_Framework.Event.RegistEvent("Action_sett", Laya.Handler.create(this, this.GameOver));
        };
        TopicView.prototype.Destroy = function () {
            H52D_Framework.Event.RemoveEvent("TopicInit", Laya.Handler.create(this, this.ViewInit));
            H52D_Framework.Event.RemoveEvent("Action_sett", Laya.Handler.create(this, this.GameOver));
            H52D_Framework.Tick.ClearAll(this);
            if (this.tapAvatar) {
                this.tapAvatar.Destroy();
                this.tapAvatar = null;
            }
        };
        TopicView.prototype.ClosePanel = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("TopicView", [H52D_Framework.ViewToppestRoot]);
        };
        /** 游戏开始 */
        TopicView.prototype.GameStart = function () {
            this.target.mouseEnabled = false;
            this.btn_against.mouseEnabled = true;
            this.btn_support.mouseEnabled = true;
            this.btn_support.on(Laya.Event.CLICK, this, this.ChooseViewPoint, [H52D_Framework.ViewPoint.support]);
            this.btn_against.on(Laya.Event.CLICK, this, this.ChooseViewPoint, [H52D_Framework.ViewPoint.against]);
        };
        /** 游戏刷新 */
        TopicView.prototype.GameUpdate = function () {
            this.viewpoint = this.actionVo.viewPoint;
            this.target.mouseEnabled = true;
            H52D_Framework.Tick.Loop(1000, this, this.GameCountdown);
            H52D_Framework.Tick.Loop(3000, this, this.GameShowPic);
        };
        /** 游戏结算 */
        TopicView.prototype.GameBalance = function () {
            H52D_Framework.Tick.ClearAll(this);
            this.GameOver();
            this.icon_win.visible = true;
            if (this.actionVo.viewPoint == this.actionVo.win) {
                this.win_txt.text = "胜利";
            }
            else {
                this.win_txt.text = this.actionVo.win == H52D_Framework.ViewPoint.draw ? "平局" : "失败";
            }
            var index = Number(this.actionVo.win) - 1;
            this.icon_win.x = this.LOCAL_WIN[index];
            this.btn_support.label = this.actionVo.supportNum + "\n支持";
            this.btn_against.label = this.actionVo.againstNum + "\n反对";
            if (this.actionVo.viewPoint == H52D_Framework.ViewPoint.support) {
                this.btn_against.gray = true;
            }
            else if (this.actionVo.viewPoint == H52D_Framework.ViewPoint.against) {
                this.btn_support.gray = true;
            }
        };
        Object.defineProperty(TopicView.prototype, "fightCountdownNumber", {
            get: function () {
                return this._fightCountdownNumber;
            },
            set: function (value) {
                this._fightCountdownNumber = value;
                this.txt_countdown.text = "倒计时x秒".replace("x", String(this._fightCountdownNumber));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TopicView.prototype, "contributeNumber", {
            get: function () {
                return this._contributeNumber;
            },
            set: function (value) {
                this._contributeNumber = value;
                this.attack_contribution.text = "贡献值:" +
                    (this._contributeNumber > 1000000 ? (this._contributeNumber / 10000 >> 0) + "W" : this._contributeNumber);
            },
            enumerable: true,
            configurable: true
        });
        TopicView.prototype.AddMonster = function () {
            var mid = this.actionVo.monsterId;
            this.target.removeChildAt(0);
            this.CreateMonster(mid, this.target);
        };
        /**
         * 选择观点：同意还是反对
         * @param point 观点
         */
        TopicView.prototype.ChooseViewPoint = function (point) {
            this.viewpoint = point;
            H52D_Framework.RemoteCall.Instance.Send("K_ReqTopicStarVote", point);
            H52D_Framework.Event.DispatchEvent("ActionCheck", [this.id]);
            this.countdown.time = this.countdownTime;
            this.countdown.Start(Laya.Handler.create(this, this.ReadyCountdown));
        };
        Object.defineProperty(TopicView.prototype, "viewpoint", {
            set: function (point) {
                if (!(this.actionVo.win == H52D_Framework.ViewPoint.empty)) {
                    return;
                }
                if (point == H52D_Framework.ViewPoint.support) { //支持
                    this.btn_support.label = "已支持";
                    this.btn_against.gray = true;
                }
                else if (point == H52D_Framework.ViewPoint.against) { //反对
                    this.btn_against.label = "已反对";
                    this.btn_support.gray = true;
                }
                this.btn_against.mouseEnabled = false;
                this.btn_support.mouseEnabled = false;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 战斗准备倒计时
         * @constructor
         */
        TopicView.prototype.ReadyCountdown = function () {
            var _this = this;
            if (this.monster != null) {
                this.target.mouseEnabled = true;
            }
            this.pic_start_click.visible = true;
            H52D_Framework.TweenList.to(this, this.pic_start_click, { "alpha": 0 }, 1500, function () {
                _this.pic_start_click.visible = false;
                _this.pic_start_click.alpha = 1;
            });
            H52D_Framework.Tick.Loop(1000, this, this.GameCountdown);
            H52D_Framework.Tick.Loop(3000, this, this.GameShowPic);
        };
        /**
         * 游戏倒计时
         * @constructor
         */
        TopicView.prototype.GameCountdown = function () {
            if (--this.fightCountdownNumber <= 0) {
                H52D_Framework.Tick.Clear(this, this.GameCountdown);
                H52D_Framework.Tick.Clear(this, this.GameShowPic);
                // this.GameOver();
                this.Elastic();
            }
        };
        /**
         * 游戏显示图标
         * @constructor
         */
        TopicView.prototype.GameShowPic = function () {
            var _this = this;
            var tween;
            tween = Laya.Tween.to(this.pic_point_click, { alpha: 1 }, 500, Laya.Ease.linearIn, Laya.Handler.create(this, function () {
                Laya.Tween.clear(tween);
                tween = Laya.Tween.to(_this.pic_point_click, { alpha: 0 }, 1200, Laya.Ease.linearIn, Laya.Handler.create(_this, function () {
                    Laya.Tween.clear(tween);
                }));
            }));
        };
        /**
         * 开始点击伤害
         */
        TopicView.prototype.GameFight = function () {
            this.TapSkill();
            var damage = H52D_Framework.MasterPlayer.Instance.player.damage;
            this.contributeNumber += damage;
            this.monster.OnHurt(damage, SkinEnum.SkinTap, false, SPECIAL_TYPE.ACTION, this.target);
            this._hurt = damage;
            H52D_Framework.RemoteCall.Instance.Send("K_ReqTopicVote", damage);
        };
        /** 游戏结束弹框 */
        TopicView.prototype.Elastic = function () {
            // let contribute:string = SysPromptConfig[30047].strPromptInfo.replace("%s",
            // this._contributeNumber > 1000000 ? (this._contributeNumber/10000>>0)+"W" : this._contributeNumber)
            // TipsLogic.Instance.OpenMessageBox(contribute,
            // Laya.Handler.create(this,this.GameOver),
            // Laya.Handler.create(this,this.GameOver));
            H52D_Framework.UIManager.Instance.CreateUI("AcitonSettView", [H52D_Framework.ViewTipRoot, this.contributeNumber]);
        };
        /**
         * 游戏结束
         * @constructor
         */
        TopicView.prototype.GameOver = function () {
            var min = this.actionVo.timeEnd.getMinutes();
            var endtime = this.actionVo.timeEnd.getHours() + "点" + (min < 10 ? "0" + min : min) + "分";
            this.tx_reward.text = H52D_Framework.GetInfoAttr.Instance.GetText(7116).replace("%s", endtime);
            this.viewpoint = this.actionVo.viewPoint;
            this.fightCountdownNumber = 0;
            this.pic_end_click.visible = true;
            this.target.mouseEnabled = false;
        };
        /**
         * 创建怪物
         * @param id 怪物ID
         **/
        TopicView.prototype.CreateMonster = function (id, viewRoot) {
            var vo = new H52D_Framework.MonsterVo(id);
            if (this.monster == null) {
                this.monster = new H52D_Framework.Monster(vo, viewRoot);
                var scale = vo.modelScale;
                var shadow = 3;
                this.monster.LoadMonster(AvatarDirection.right, scale, this.BRITH_X, this.BRITH_Y, shadow, vo.location);
            }
        };
        /**点击技能 */
        TopicView.prototype.TapSkill = function () {
            var _this = this;
            if (this.tapAvatar == null) {
                this.tapAvatar = new H52D_Framework.Avatar(this.target);
                this.tapAvatar.Load(this.actionEffect["3"], 1, this.actionEffect["5"], 0, 0, Laya.Handler.create(this, function () {
                    _this.PlayTapEffect();
                }));
            }
            else {
                this.PlayTapEffect();
            }
        };
        /** 点击特效 */
        TopicView.prototype.PlayTapEffect = function () {
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/tap_sound.mp3");
            var x = Laya.MouseManager.instance.mouseX;
            var y = Laya.MouseManager.instance.mouseY;
            var point = this.target.globalToLocal(new Laya.Point(x, y));
            this.tapAvatar.PosX = point.x;
            this.tapAvatar.PosY = point.y;
            this.tapAvatar.Play(this.actionEffect["4"], false);
        };
        return TopicView;
    }(ui.action.topic.TopicViewUI));
    H52D_Framework.TopicView = TopicView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=TopicView.js.map