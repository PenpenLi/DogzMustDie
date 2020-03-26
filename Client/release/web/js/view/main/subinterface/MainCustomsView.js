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
    var Sprite = Laya.Sprite;
    var path = "ui_icon/";
    /**
     * @class：
     * @author：zhangyusong
     */
    var MainCustomsView = /** @class */ (function (_super) {
        __extends(MainCustomsView, _super);
        function MainCustomsView() {
            var _this = _super.call(this) || this;
            _this.comein = true;
            _this.fromauto = true;
            _this.totleWave = 0;
            _this.bossStartY = 0;
            _this.bossEndY = 0;
            _this.followOpen = false;
            _this.InitView();
            _this.InitEvent();
            return _this;
        }
        MainCustomsView.prototype.Destroy = function () {
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.CunstomCurrent));
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.WroldBossTime));
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.CUSTOMS_BASEINFOR, Laya.Handler.create(this, this.BaseInfor));
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.CUSTOMS_DROP_BLOOD, Laya.Handler.create(this, this.DropBlood));
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.BOSSHANDER, Laya.Handler.create(this, this.BossHander));
            H52D_Framework.Event.RemoveEvent("CustomsClear", Laya.Handler.create(this, this.CustomsClear));
            H52D_Framework.Event.RemoveEvent("BossThrough", Laya.Handler.create(this, this.BossThrough));
            H52D_Framework.Event.RemoveEvent("CunstomsModel", Laya.Handler.create(this, this.ShowModel));
            H52D_Framework.Event.RemoveEvent('UpdateBtnList', Laya.Handler.create(this, this.bossEndControl));
            this.custom_wave_boss.off(Laya.Event.CLICK, this, this.BossHander);
            H52D_Framework.Tick.ClearAll(this);
            if (this.customEff) {
                this.customEff.Destroy();
                this.customEff = null;
            }
            if (this.bossEff) {
                this.bossEff.Destroy();
                this.bossEff = null;
            }
            if (this.fightEff) {
                this.fightEff.Destroy();
                this.fightEff = null;
            }
            if (this.headEff) {
                this.headEff.Destroy();
                this.headEff = null;
            }
        };
        MainCustomsView.prototype.InitView = function () {
            var _this = this;
            this.bossStartY = this.custom_wave_boss.y;
            this.bossEndY = -wxsclae - 40;
            this.bloodMask = new Sprite();
            var bw = this.blood_list.width;
            this.bloodMask.graphics.drawPoly(0, 0, [0, 0, bw, 0, bw, 16, bw - 8, 24, 0, 24], 0x000000);
            this.blood_list.mask = this.bloodMask;
            this.blood_follow.x = 0;
            this.blood.visible = false;
            H52D_Framework.Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_7, this.custom_wave_boss);
            this.custom_wave_boss.y = this.bossEndY;
            this.bloodTimeWidth = this.blood_time.width;
            this.customsIcon = new CustomsIcon(this, this.effect_customs);
            this.custom_wave_boss.mouseEnabled = false;
            //----特效表现----
            this.customEff = new H52D_Framework.Avatar(this.effect_customs);
            this.customEff.Load(H52D_Framework.EffectDefine.tubiao, 1, 0.44, 35, 37, Laya.Handler.create(this, function () {
                H52D_Framework.Tick.Loop(3000, _this, function () { _this.customEff.PlayOnce(); });
            }));
            this.bossEff = new H52D_Framework.Avatar(this.effect_boss);
            this.bossEff.Load(H52D_Framework.EffectDefine.anniu, 1, 2.3, 64, 26, Laya.Handler.create(this, function () {
                _this.bossEff.Play();
            }));
            this.fightEff = new H52D_Framework.Avatar(this.effect_fight);
            this.fightEff.Load(H52D_Framework.EffectDefine.guanqia, 1, 1, 0, 22, Laya.Handler.create(this, function () {
                _this.fightEff.Play();
            }));
            this.headEff = new H52D_Framework.Avatar(this.effect_head);
            this.headEff.Load(H52D_Framework.EffectDefine.touxiang, 1, 1, 42, 50, Laya.Handler.create(this, function () {
                _this.headEff.Play("idle");
            }));
            //------end-----
            H52D_Framework.ViewUILogic.Instance.customWave = this.custom_wave_boss;
        };
        MainCustomsView.prototype.InitEvent = function () {
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.CunstomCurrent));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.WroldBossTime));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.CUSTOMS_BASEINFOR, Laya.Handler.create(this, this.BaseInfor));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.CUSTOMS_DROP_BLOOD, Laya.Handler.create(this, this.DropBlood));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.BOSSHANDER, Laya.Handler.create(this, this.BossHander));
            H52D_Framework.Event.RegistEvent("CustomsClear", Laya.Handler.create(this, this.CustomsClear));
            H52D_Framework.Event.RegistEvent("BossThrough", Laya.Handler.create(this, this.BossThrough));
            H52D_Framework.Event.RegistEvent("CunstomsModel", Laya.Handler.create(this, this.ShowModel));
            H52D_Framework.Event.RegistEvent('UpdateBtnList', Laya.Handler.create(this, this.bossEndControl));
            this.custom_wave_boss.on(Laya.Event.CLICK, this, this.BossHander);
        };
        MainCustomsView.prototype.WroldBossTime = function () {
            var _this = this;
            this.Boss_time.text = "倒计时:" + H52D_Framework.CustomsManager.Instance.CustomsVo.waveTime;
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Customs) {
                this.fight_time.visible = false;
                this.CunstomCurrent();
            }
            else {
                if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Boss) {
                    H52D_Framework.Tick.Clear(this, this.TimeFrame);
                    this.fight_time.visible = true;
                    H52D_Framework.BattleManager.Instance.TheWordBossDamage = 0;
                    this.waveTime = H52D_Framework.CustomsManager.Instance.CustomsVo.waveTime;
                    this.Boss_time.text = "倒计时:" + H52D_Framework.CustomsManager.Instance.CustomsVo.waveTime;
                    this.Btn_control();
                    if (H52D_Framework.WroldBossLogic.Instance.StopFight) {
                        H52D_Framework.OneTimer(3500, function () {
                            _this.WroldBoss();
                            H52D_Framework.WroldBossLogic.Instance.StopFight = false;
                        });
                    }
                }
                else if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                    H52D_Framework.Tick.Clear(this, this.TimeFrame);
                    this.fight_time.visible = true;
                    H52D_Framework.BattleManager.Instance.TheMatchBossDamage = 0;
                    this.waveTime = H52D_Framework.CustomsManager.Instance.CustomsVo.waveTime;
                    this.Boss_time.text = "倒计时:" + H52D_Framework.CustomsManager.Instance.CustomsVo.waveTime;
                    H52D_Framework.OneTimer(4000, function () {
                        _this.WroldBoss();
                    });
                }
            }
        };
        /** 关卡图标清理 */
        MainCustomsView.prototype.CustomsClear = function () {
            this.blood.visible = false;
        };
        /** 场景小图标 */
        MainCustomsView.prototype.CunstomCurrent = function () {
            var _this = this;
            //顶部小图标
            this.customsIcon.setIcon();
            if (H52D_Framework.CustomsManager.Instance.customsMode == Customs_Mode.Auto) { //自动战斗模式
                if (H52D_Framework.CustomsManager.Instance.bBoss) {
                    if (this.fromauto) { //来自自动模式，渐变出现
                        this.custom_wave_boss.y = this.bossEndY;
                        H52D_Framework.TweenList.to(this, this.custom_wave_boss, { y: this.bossStartY + 10 }, 200, function () {
                            _this.custom_wave_boss.y = _this.bossStartY + 10;
                        });
                        H52D_Framework.TweenList.to(this, this.custom_wave_boss, { y: this.bossStartY }, 80, function () {
                            _this.custom_wave_boss.y = _this.bossStartY;
                            H52D_Framework.Tick.Once(600, _this, function () {
                                _this.custom_wave_boss.mouseEnabled = true;
                            });
                        }, 200);
                        H52D_Framework.EffectManager.Instance.StartShock(250);
                    }
                    this.waveTime = H52D_Framework.CustomsManager.Instance.CustomsVo.waveTime;
                    this.OpenBoss();
                }
                else { //不是Boss，渐变消失
                    if (this.custom_wave_boss.y >= this.bossStartY - 2) {
                        this.custom_wave_boss.y = this.bossStartY;
                        H52D_Framework.TweenList.to(this, this.custom_wave_boss, { y: this.bossEndY }, 300, function () {
                            _this.custom_wave_boss.y = _this.bossEndY;
                        });
                    }
                    this.fromauto = true;
                    this.boss_time.visible = false;
                }
                this.bg_bossicon.visible = H52D_Framework.CustomsManager.Instance.bBoss;
                this.effect_boss.visible = false;
                this.tx_num_boss.text = H52D_Framework.CustomsManager.Instance.LEAVE;
            }
            else if (H52D_Framework.CustomsManager.Instance.customsMode == Customs_Mode.Loop) { //循环战斗模式
                this.bg_bossicon.visible = false;
                this.effect_boss.visible = true;
                this.tx_num_boss.text = H52D_Framework.CustomsManager.Instance.CHALLENGE;
                this.boss_time.visible = false;
            }
            this.TotleProgress(H52D_Framework.CustomsManager.Instance.CustomsVo.waveNum);
            this.CurrProgress(H52D_Framework.CustomsManager.Instance.CustomsVo.waveOrder - 1);
            this.Btn_control();
            H52D_Framework.Event.DispatchEvent("ClearOneBubble", [E_BubbleType.eMonster]);
        };
        /** 开启Boss模式 */
        MainCustomsView.prototype.OpenBoss = function () {
            this.boss_time.visible = true;
            this.waveTimeCurrent = this.waveTime;
            this.blood_time.width = this.bloodTimeWidth;
            H52D_Framework.Tick.Loop(100, this, this.TimeFrame);
            H52D_Framework.Event.DispatchEvent("BossCome", [true]);
        };
        MainCustomsView.prototype.WroldBoss = function () {
            this.waveTimeCurrent = H52D_Framework.CustomsManager.Instance.CustomsVo.waveTime;
            H52D_Framework.Tick.Clear(this, this.TimeFrame);
            H52D_Framework.Tick.Loop(100, this, this.TimeFrame);
        };
        /** 计时帧函数 */
        MainCustomsView.prototype.TimeFrame = function () {
            this.waveTimeCurrent -= 0.1;
            var bWorldBoss = false;
            this.fight_time.visible = false;
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Boss
                || H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                this.Boss_time.text = "倒计时:" + Math.floor(this.waveTimeCurrent) + "";
                this.fight_time.visible = true;
                bWorldBoss = true;
                this.Num_show();
            }
            this.bg_hurt.width = (this.Boss_hurt.width) * 1.1;
            if (this.waveTimeCurrent > 0) {
                this.blood_time.width = this.bloodTimeWidth * this.waveTimeCurrent / this.waveTime;
                this.time_boss.text = this.waveTimeCurrent.toFixed(1) + "S";
            }
            else {
                this.BossThrough(true);
                this.boss_time.visible = false;
                H52D_Framework.Event.DispatchEvent("ChallengeBossFail");
                if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Ladder) {
                    H52D_Framework.Event.DispatchEvent("Ladderfightover");
                }
            }
        };
        MainCustomsView.prototype.BossHander = function () {
            var _this = this;
            if (this.comein) {
                this.comein = false;
                H52D_Framework.Tick.Once(600, this, function () {
                    _this.comein = true;
                });
                this.BossThrough(false);
                //循环模式切换
                if (H52D_Framework.CustomsManager.Instance.customsMode == Customs_Mode.Auto) {
                    H52D_Framework.CustomsManager.Instance.CustomsModelChange(Customs_Mode.Loop);
                    //引导
                    H52D_Framework.Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_7);
                }
                else if (H52D_Framework.CustomsManager.Instance.customsMode == Customs_Mode.Loop) {
                    this.fromauto = false;
                    H52D_Framework.CustomsManager.Instance.CustomsModelChange(Customs_Mode.Auto);
                }
            }
        };
        MainCustomsView.prototype.BaseInfor = function (info) {
            this.monster_name.text = info["monster_name"];
            this.surplusBlood = this.totleBlood = info["blood"];
            this.blood_num.text = info["blood"] + " HP";
            this.blood.visible = true;
            this.bloodMask.graphics.clear();
            var bw = this.blood_list.width;
            this.bloodMask.graphics.drawPoly(0, 0, [0, 0, bw, 0, bw, 16, bw - 8, 24, 0, 24], 0x000000);
            this.blood_follow.x = 0;
        };
        MainCustomsView.prototype.ShowModel = function (m) {
            this.tx_num_boss.text = m;
        };
        /** 掉血 */
        MainCustomsView.prototype.DropBlood = function (blood) {
            var _this = this;
            if (this.surplusBlood == 0) {
                return;
            }
            this.surplusBlood -= blood;
            this.surplusBlood = this.surplusBlood < 0 ? 0 : this.surplusBlood;
            this.blood_num.text = this.surplusBlood + " HP";
            var blood_width = (this.blood_list.width * this.surplusBlood / this.totleBlood) >> 0;
            this.bloodMask.graphics.clear();
            if (blood_width > 8) { //5边型
                this.bloodMask.graphics.drawPoly(0, 0, [0, 0, blood_width, 0, blood_width, 16, blood_width - 7, 24, 0, 24], 0x000000);
            }
            else { //4边型=梯形
                var point_y = 24 - (8 - blood_width); //∠45°宽高相同
                this.bloodMask.graphics.drawPoly(0, 0, [0, 0, blood_width, 0, blood_width, 16, 0, point_y], 0x000000);
            }
            if (this.tween) {
                Laya.Tween.clear(this.tween);
            }
            this.followOpen = true;
            this.tween = Laya.Tween.to(this.blood_follow, { "x": blood_width - this.blood_list.width - 1 }, 600, Laya.Ease.linearInOut, Laya.Handler.create(this, function () {
                _this.followOpen = false;
                _this.FollowComplete();
            }));
            if (this.followOpen) {
                H52D_Framework.Tick.Clear(this, this.FollowComplete);
                H52D_Framework.Tick.Clear(this, this.FollowProgram);
                H52D_Framework.Tick.Once(700, this, this.FollowProgram);
            }
            // this.Num_show();
        };
        MainCustomsView.prototype.FollowProgram = function () {
            if (this.followOpen) {
                this.FollowComplete();
            }
        };
        MainCustomsView.prototype.FollowComplete = function () {
            this.blood_follow.x = this.blood_list.width * (this.surplusBlood / this.totleBlood - 1) - 1;
            if (this.surplusBlood < 0) {
                this.surplusBlood = 0;
                this.blood.visible = false;
            }
            Laya.Tween.clear(this.tween);
        };
        MainCustomsView.prototype.TotleProgress = function (totle) {
            if (this.totleWave == totle) {
                return;
            }
            this.totleWave = totle;
            var separation = 56;
            for (var i = 0; i < 5; i++) {
                this["sign_" + i].x = separation * i + separation / 2 * (5 - totle);
                this["sign_" + i].visible = i < totle;
            }
            this.progress_bg.x = 30 + separation / 2 * (5 - totle);
            this.progress_bg.width = separation * (totle - 1);
            if (!this.custom_wave_loop.visible) {
                this.custom_wave_loop.visible = true;
            }
        };
        MainCustomsView.prototype.CurrProgress = function (currSign) {
            for (var i = 0; i < this.totleWave; i++) {
                //未开启
                var wkq = this["sign_" + i].getChildByName("weikaiqi");
                //攻击中
                var gjz = this["sign_" + i].getChildByName("gongjizhong");
                //已打完
                var ydw = this["sign_" + i].getChildByName("yidawan");
                //Boss
                var bossWeida = this["sign_" + i].getChildByName("boss_weida");
                var bossKaida = this["sign_" + i].getChildByName("boss_kaida");
                ydw.visible = i < currSign;
                gjz.visible = i == currSign;
                wkq.visible = i > currSign && i < this.totleWave - 1;
                if (i == this.totleWave - 1) {
                    bossKaida.visible = currSign == this.totleWave - 1;
                    bossWeida.visible = !bossKaida.visible;
                }
                else {
                    bossKaida.visible = bossWeida.visible = false;
                }
            }
            this.effect_fight.x = this["sign_" + currSign].x + 22;
        };
        /**
         * 挑战Boss完成
         * 清理倒计时数据
         */
        MainCustomsView.prototype.BossThrough = function (win) {
            this.custom_wave_boss.mouseEnabled = !win;
            H52D_Framework.Tick.Clear(this, this.TimeFrame);
        };
        MainCustomsView.prototype.Clear = function () {
            this.bloodMask.graphics.drawRect(0, 0, this.blood_list.width, this.blood_list.height, 0x000000);
            this.blood.visible = false;
            this.customsIcon.Clear();
        };
        MainCustomsView.prototype.Btn_control = function () {
            var bool = H52D_Framework.WroldBossLogic.Instance.View_Control();
            this.bg.visible = bool;
            this.bg_num.visible = !bool;
            this.Num_show();
        };
        MainCustomsView.prototype.bossEndControl = function () {
            var bool = H52D_Framework.WroldBossLogic.Instance.View_Control();
            this.bg_num.visible = !bool && H52D_Framework.WroldBossLogic.Instance.Show;
        };
        MainCustomsView.prototype.Num_show = function () {
            this.Boss_hurt.text = "伤害:" + H52D_Framework.BattleManager.Instance.TheWordBossDamage + "";
        };
        return MainCustomsView;
    }(ui.main.subinterface.MainCustomsViewUI));
    H52D_Framework.MainCustomsView = MainCustomsView;
    var CustomsIcon = /** @class */ (function () {
        function CustomsIcon(mainView, customBox) {
            this.proportion = 0.63;
            this.time = 250;
            this.customsOrder = 0;
            this.custems = mainView;
            this.customBox = customBox;
        }
        CustomsIcon.prototype.setIcon = function () {
            var _this = this;
            var urls = H52D_Framework.CustomsManager.Instance.CustomsVo;
            var currIcon = urls.strCustomsIcon;
            var prevIcon = null;
            if (H52D_Framework.CustomspassConfig.hasOwnProperty(urls.customsId - 1)) {
                prevIcon = H52D_Framework.CustomspassConfig[urls.customsId - 1]["strCustomsIcon"];
            }
            var nextIcon = null;
            if (H52D_Framework.CustomspassConfig.hasOwnProperty(urls.customsId + 1)) {
                nextIcon = H52D_Framework.CustomspassConfig[urls.customsId + 1]["strCustomsIcon"];
            }
            if (this.customsOrder == urls.customsOrder) {
                return;
            }
            this.customsOrder = urls.customsOrder;
            Laya.Tween.clearAll(this);
            if (H52D_Framework.CustomsManager.Instance.CustomsVo.customsOrder == 1) {
                this.custems.middle_customs_panel.visible = false;
                this.custems.behind_customs_panel.visible = false;
                //没有最前场景,不移动
                this.custems.img_link_left.visible = !!prevIcon;
                this.custems.prev_customs_panel.visible = !!prevIcon;
                if (!!prevIcon) {
                    this.custems.prev_customs.skin = path + prevIcon + ".png";
                    this.custems.prev_num.text = String(urls.customsOrder - 1);
                }
                this.custems.curr_customs.skin = path + currIcon + ".png";
                this.custems.curr_num.text = String(urls.customsOrder) + "关";
                this.custems.next_customs.skin = path + nextIcon + ".png";
                this.custems.next_num.text = String(urls.customsOrder + 1);
                this.custems.icon.visible = true;
                return;
            }
            //容错
            H52D_Framework.Tick.Once(this.time + 200, this, this.MoveComplete);
            //没有最前场景,不移动
            if (prevIcon == null) {
                this.custems.img_link_left.visible = false;
                this.custems.middle_customs_panel.visible = false;
                this.custems.behind_customs_panel.visible = false;
                this.custems.prev_customs_panel.visible = false;
                this.custems.curr_customs.skin = path + currIcon + ".png";
                this.custems.curr_num.text = String(urls.customsOrder) + "关";
                this.custems.next_customs.skin = path + nextIcon + ".png";
                this.custems.next_num.text = String(urls.customsOrder + 1);
            }
            else {
                this.custems.img_link_left.visible = true;
                this.custems.middle_customs.skin = path + prevIcon + ".png";
                if (urls.customsOrder - 1 <= H52D_Framework.ShareLogic.Instance.ShareMax && H52D_Framework.ShareLogic.Instance.isOpenShare) {
                    for (var i = 0; i < H52D_Framework.ShareLogic.Instance.shareCustems.length; i++) {
                        var custemsNum = H52D_Framework.ShareLogic.Instance.shareCustems[i];
                        if ((urls.customsOrder - 1) == custemsNum) {
                            if (Number(this.custems.middle_num) != urls.customsOrder - 1) {
                                H52D_Framework.UIManager.Instance.CreateUI("ShareCustomsView", [H52D_Framework.ViewToppestRoot, urls.customsOrder - 1]);
                                break;
                            }
                        }
                    }
                }
                this.custems.middle_num.text = String(urls.customsOrder - 1);
                this.custems.behind_customs.skin = path + currIcon + ".png";
                this.custems.behind_num.text = String(urls.customsOrder) + "关";
                this.custems.next_customs.skin = path + nextIcon + ".png";
                this.custems.next_num.text = String(urls.customsOrder + 1);
                this.custems.prev_customs_panel.alpha = 1;
                this.custems.prev_customs_panel.scaleX = this.custems.prev_customs_panel.scaleY = 1;
                this.custems.middle_customs_panel.centerX = this.custems.curr_customs_panel.centerX;
                this.custems.middle_customs_panel.y = this.custems.curr_customs_panel.y;
                this.custems.middle_customs_panel.scaleX = this.custems.middle_customs_panel.scaleY = 1;
                this.custems.middle_customs_panel.visible = true;
                this.custems.curr_customs_panel.visible = false;
                this.custems.curr_num.text = String(urls.customsOrder) + "关";
                if (!!nextIcon) {
                    this.custems.img_link_right.visible = true;
                    this.custems.next_customs_panel.visible = true;
                    this.custems.behind_customs_panel.centerX = this.custems.next_customs_panel.centerX;
                    this.custems.behind_customs_panel.y = this.custems.next_customs_panel.y;
                    this.custems.behind_customs_panel.scaleX = this.custems.behind_customs_panel.scaleY = this.proportion;
                    this.custems.behind_customs_panel.alpha = 1;
                    this.custems.behind_customs_panel.visible = true;
                    this.custems.next_customs_panel.alpha = 0;
                    this.custems.next_customs_panel.scaleX = this.custems.next_customs_panel.scaleY = 0;
                }
                else {
                    this.custems.behind_customs_panel.visible = false;
                    this.custems.img_link_right.visible = false;
                }
                this.customBox.visible = false;
                this.num = 4;
                H52D_Framework.TweenList.to(this, this.custems.middle_customs_panel, {
                    centerX: this.custems.prev_customs_panel.centerX,
                    scaleX: this.proportion,
                    scaleY: this.proportion,
                }, this.time, function () {
                    _this.custems.middle_customs_panel.centerX = _this.custems.prev_customs_panel.centerX;
                    _this.custems.middle_customs_panel.scaleX = _this.proportion;
                    _this.custems.middle_customs_panel.scaleY = _this.proportion;
                    _this.MoveComplete();
                });
                H52D_Framework.TweenList.to(this, this.custems.behind_customs_panel, {
                    centerX: this.custems.curr_customs_panel.centerX,
                    scaleX: 1,
                    scaleY: 1,
                }, this.time, function () {
                    _this.custems.behind_customs_panel.centerX = _this.custems.curr_customs_panel.centerX;
                    _this.custems.behind_customs_panel.scaleX = 1;
                    _this.custems.behind_customs_panel.scaleY = 1;
                    _this.MoveComplete();
                });
                H52D_Framework.TweenList.to(this, this.custems.prev_customs_panel, {
                    alpha: 0,
                    scaleX: 0,
                    scaleY: 0,
                }, this.time, function () {
                    _this.custems.prev_customs_panel.alpha = 0;
                    _this.custems.prev_customs_panel.scaleX = 0;
                    _this.custems.prev_customs_panel.scaleY = 0;
                    _this.MoveComplete();
                });
                H52D_Framework.TweenList.to(this, this.custems.next_customs_panel, {
                    alpha: 1,
                    scaleX: 1,
                    scaleY: 1,
                }, this.time, function () {
                    _this.custems.next_customs_panel.alpha = 1;
                    _this.custems.next_customs_panel.scaleX = 1;
                    _this.custems.next_customs_panel.scaleY = 1;
                    _this.MoveComplete();
                });
            }
        };
        CustomsIcon.prototype.MoveComplete = function () {
            if (--this.num <= 0) {
                Laya.Tween.clearAll(this);
                this.custems.prev_customs.skin = this.custems.middle_customs.skin;
                this.custems.curr_customs.skin = this.custems.behind_customs.skin;
                this.custems.prev_num.text = this.custems.middle_num.text;
                this.custems.middle_customs_panel.visible = false;
                this.custems.middle_customs_panel.centerX = this.custems.prev_customs_panel.centerX;
                this.custems.middle_customs_panel.scaleX = this.proportion;
                this.custems.middle_customs_panel.scaleY = this.proportion;
                this.custems.behind_customs_panel.visible = false;
                this.custems.behind_customs_panel.centerX = this.custems.curr_customs_panel.centerX;
                this.custems.behind_customs_panel.scaleX = 1;
                this.custems.behind_customs_panel.scaleY = 1;
                this.custems.prev_customs_panel.scaleX = 1;
                this.custems.prev_customs_panel.scaleY = 1;
                this.custems.prev_customs_panel.alpha = 1;
                this.custems.prev_customs_panel.visible = true;
                this.custems.next_customs_panel.alpha = 1;
                this.custems.next_customs_panel.scaleX = 1;
                this.custems.next_customs_panel.scaleY = 1;
                this.custems.curr_customs_panel.visible = true;
                this.customBox.visible = true;
            }
        };
        CustomsIcon.prototype.Clear = function () {
            this.num = 0;
            this.MoveComplete();
        };
        return CustomsIcon;
    }());
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MainCustomsView.js.map