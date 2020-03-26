module H52D_Framework {
    import Sprite = Laya.Sprite;
    import Image = Laya.Image;
    const path: string = "ui_icon/";

    /**
     * @class：
     * @author：zhangyusong
     */
    export class MainCustomsView extends ui.main.subinterface.MainCustomsViewUI implements IViewPanel {
        /** 血条遮罩 */
        private bloodMask: Sprite;
        private bloodTimeWidth: number;
        /** 总血量 */
        private totleBlood: number;
        /** 剩余血量 */
        private surplusBlood: number;
        /** Boss战斗时间 */
        private waveTime: number;
        private waveTimeCurrent: number;
        /** 关卡图标 */
        private customsIcon: CustomsIcon;
        /** 当前关卡图标特效 */
        private customEff: Avatar;
        /** 挑战boss按钮特效 */
        private bossEff: Avatar;
        /** 战斗图标特效 */
        private fightEff: Avatar;
        /** Boss头像特效 */
        private headEff: Avatar;
        private comein: boolean = true;
        private fromauto: boolean = true;
        private totleWave: number = 0;
        private bossStartY: number = 0;
        private bossEndY: number = 0;
        private followOpen: boolean = false;

        public constructor() {
            super();
            this.InitView();
            this.InitEvent();
        }

        public Destroy(): void {
            Event.RemoveEvent(EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.CunstomCurrent));
            Event.RemoveEvent(EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.WroldBossTime));
            Event.RemoveEvent(EventDefine.CUSTOMS_BASEINFOR, Laya.Handler.create(this, this.BaseInfor));
            Event.RemoveEvent(EventDefine.CUSTOMS_DROP_BLOOD, Laya.Handler.create(this, this.DropBlood));
            Event.RemoveEvent(EventDefine.BOSSHANDER, Laya.Handler.create(this, this.BossHander));
            Event.RemoveEvent("CustomsClear", Laya.Handler.create(this, this.CustomsClear));
            Event.RemoveEvent("BossThrough", Laya.Handler.create(this, this.BossThrough));
            Event.RemoveEvent("CunstomsModel", Laya.Handler.create(this, this.ShowModel));
            Event.RemoveEvent('UpdateBtnList', Laya.Handler.create(this, this.bossEndControl));
            this.custom_wave_boss.off(Laya.Event.CLICK, this, this.BossHander);
            Tick.ClearAll(this);

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
        }

        private InitView(): void {
            this.bossStartY = this.custom_wave_boss.y;
            this.bossEndY = - wxsclae - 40
            this.bloodMask = new Sprite();
            let bw: number = this.blood_list.width;
            this.bloodMask.graphics.drawPoly(0, 0, [0, 0, bw, 0, bw, 16, bw - 8, 24, 0, 24], 0x000000);
            this.blood_list.mask = this.bloodMask;
            this.blood_follow.x = 0;
            this.blood.visible = false;
            Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_7, this.custom_wave_boss)
            this.custom_wave_boss.y = this.bossEndY;
            this.bloodTimeWidth = this.blood_time.width;
            this.customsIcon = new CustomsIcon(this, this.effect_customs);
            this.custom_wave_boss.mouseEnabled = false;

            //----特效表现----
            this.customEff = new Avatar(this.effect_customs)
            this.customEff.Load(EffectDefine.tubiao, 1, 0.44, 35, 37, Laya.Handler.create(this, () => {
                Tick.Loop(3000, this, () => { this.customEff.PlayOnce() });
            }));
            this.bossEff = new Avatar(this.effect_boss)
            this.bossEff.Load(EffectDefine.anniu, 1, 2.3, 64, 26, Laya.Handler.create(this, () => {
                this.bossEff.Play();
            }));
            this.fightEff = new Avatar(this.effect_fight)
            this.fightEff.Load(EffectDefine.guanqia, 1, 1, 0, 22, Laya.Handler.create(this, () => {
                this.fightEff.Play();
            }));

            this.headEff = new Avatar(this.effect_head)
            this.headEff.Load(EffectDefine.touxiang, 1, 1, 42, 50, Laya.Handler.create(this, () => {
                this.headEff.Play("idle");
            }));
            //------end-----
            ViewUILogic.Instance.customWave = this.custom_wave_boss;
        }

        private InitEvent(): void {
            Event.RegistEvent(EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.CunstomCurrent));
            Event.RegistEvent(EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.WroldBossTime));
            Event.RegistEvent(EventDefine.CUSTOMS_BASEINFOR, Laya.Handler.create(this, this.BaseInfor));
            Event.RegistEvent(EventDefine.CUSTOMS_DROP_BLOOD, Laya.Handler.create(this, this.DropBlood));
            Event.RegistEvent(EventDefine.BOSSHANDER, Laya.Handler.create(this, this.BossHander));
            Event.RegistEvent("CustomsClear", Laya.Handler.create(this, this.CustomsClear));
            Event.RegistEvent("BossThrough", Laya.Handler.create(this, this.BossThrough));
            Event.RegistEvent("CunstomsModel", Laya.Handler.create(this, this.ShowModel));
            Event.RegistEvent('UpdateBtnList', Laya.Handler.create(this, this.bossEndControl));
            this.custom_wave_boss.on(Laya.Event.CLICK, this, this.BossHander);
        }

        private WroldBossTime() {
            this.Boss_time.text = "倒计时:" + CustomsManager.Instance.CustomsVo.waveTime;
            if (CustomsManager.Instance.CustomsType == Customs_Type.Customs) {
                this.fight_time.visible = false;
                this.CunstomCurrent();
            } else {
                if (CustomsManager.Instance.CustomsType == Customs_Type.Boss) {
                    Tick.Clear(this, this.TimeFrame);
                    this.fight_time.visible = true;
                    BattleManager.Instance.TheWordBossDamage = 0;
                    this.waveTime = CustomsManager.Instance.CustomsVo.waveTime;
                    this.Boss_time.text = "倒计时:" + CustomsManager.Instance.CustomsVo.waveTime;
                    this.Btn_control();
                    if (WroldBossLogic.Instance.StopFight) {
                        OneTimer(3500, () => {
                            this.WroldBoss();
                            WroldBossLogic.Instance.StopFight = false
                        });
                    }
                }
                else if (CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                    Tick.Clear(this, this.TimeFrame);
                    this.fight_time.visible = true;
                    BattleManager.Instance.TheMatchBossDamage = 0;
                    this.waveTime = CustomsManager.Instance.CustomsVo.waveTime;
                    this.Boss_time.text = "倒计时:" + CustomsManager.Instance.CustomsVo.waveTime;
                    OneTimer(4000, () => { 
                        this.WroldBoss();
                     });

                }
            }
        }

        /** 关卡图标清理 */
        private CustomsClear() {
            this.blood.visible = false;
        }

        /** 场景小图标 */
        private CunstomCurrent(): void {
            //顶部小图标
            this.customsIcon.setIcon();
            if (CustomsManager.Instance.customsMode == Customs_Mode.Auto) { //自动战斗模式
                if (CustomsManager.Instance.bBoss) {
                    if (this.fromauto) {  //来自自动模式，渐变出现
                        this.custom_wave_boss.y = this.bossEndY;
                        TweenList.to(this, this.custom_wave_boss, { y: this.bossStartY + 10 }, 200, () => {
                            this.custom_wave_boss.y = this.bossStartY + 10;
                        });
                        TweenList.to(this, this.custom_wave_boss, { y: this.bossStartY }, 80, () => {
                            this.custom_wave_boss.y = this.bossStartY;
                            Tick.Once(600, this, () => {
                                this.custom_wave_boss.mouseEnabled = true;
                            });
                        }, 200);
                        EffectManager.Instance.StartShock(250);
                    }
                    this.waveTime = CustomsManager.Instance.CustomsVo.waveTime;
                    this.OpenBoss();
                }
                else {   //不是Boss，渐变消失
                    if (this.custom_wave_boss.y >= this.bossStartY - 2) {
                        this.custom_wave_boss.y = this.bossStartY;
                        TweenList.to(this, this.custom_wave_boss, { y: this.bossEndY }, 300, () => {
                            this.custom_wave_boss.y = this.bossEndY;
                        });
                    }
                    this.fromauto = true;
                    this.boss_time.visible = false;
                }
                this.bg_bossicon.visible = CustomsManager.Instance.bBoss
                this.effect_boss.visible = false;
                this.tx_num_boss.text = CustomsManager.Instance.LEAVE;
            }
            else if (CustomsManager.Instance.customsMode == Customs_Mode.Loop) { //循环战斗模式
                this.bg_bossicon.visible = false;
                this.effect_boss.visible = true;
                this.tx_num_boss.text = CustomsManager.Instance.CHALLENGE;
                this.boss_time.visible = false;
            }
            this.TotleProgress(CustomsManager.Instance.CustomsVo.waveNum);
            this.CurrProgress(CustomsManager.Instance.CustomsVo.waveOrder - 1);
            this.Btn_control();
            Event.DispatchEvent("ClearOneBubble", [E_BubbleType.eMonster]);
        }

        /** 开启Boss模式 */
        private OpenBoss() {
            this.boss_time.visible = true;
            this.waveTimeCurrent = this.waveTime;
            this.blood_time.width = this.bloodTimeWidth;
            Tick.Loop(100, this, this.TimeFrame);
            Event.DispatchEvent("BossCome", [true]);
        }

        private WroldBoss() {
            this.waveTimeCurrent = CustomsManager.Instance.CustomsVo.waveTime;
            Tick.Clear(this, this.TimeFrame);
            Tick.Loop(100, this, this.TimeFrame);
        }


        /** 计时帧函数 */
        private TimeFrame() {
            this.waveTimeCurrent -= 0.1;
            let bWorldBoss = false;
            this.fight_time.visible = false;
            if (CustomsManager.Instance.CustomsType == Customs_Type.Boss
                || CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
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
                Event.DispatchEvent("ChallengeBossFail");
                if (CustomsManager.Instance.CustomsType == Customs_Type.Ladder) {
                    Event.DispatchEvent("Ladderfightover");
                }
            }
        }

        private BossHander(): void {
            if (this.comein) {
                this.comein = false;
                Tick.Once(600, this, () => {
                    this.comein = true;
                });
                this.BossThrough(false);
                //循环模式切换
                if (CustomsManager.Instance.customsMode == Customs_Mode.Auto) {
                    CustomsManager.Instance.CustomsModelChange(Customs_Mode.Loop);
                    //引导
                    Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_7);
                }
                else if (CustomsManager.Instance.customsMode == Customs_Mode.Loop) {
                    this.fromauto = false;
                    CustomsManager.Instance.CustomsModelChange(Customs_Mode.Auto);
                }
            }
        }

        private BaseInfor(info: Object): void {
            this.monster_name.text = info["monster_name"];
            this.surplusBlood = this.totleBlood = info["blood"];
            this.blood_num.text = info["blood"] + " HP";
            this.blood.visible = true;

            this.bloodMask.graphics.clear();
            let bw: number = this.blood_list.width;
            this.bloodMask.graphics.drawPoly(0, 0, [0, 0, bw, 0, bw, 16, bw - 8, 24, 0, 24], 0x000000);
            this.blood_follow.x = 0;
        }

        private ShowModel(m: string) {
            this.tx_num_boss.text = m;
        }

        /** 掉血 */
        private DropBlood(blood: number): void {
            if (this.surplusBlood == 0) {
                return;
            }
            this.surplusBlood -= blood;
            this.surplusBlood = this.surplusBlood < 0 ? 0 : this.surplusBlood;
            this.blood_num.text = this.surplusBlood + " HP";
            let blood_width: number = (this.blood_list.width * this.surplusBlood / this.totleBlood) >> 0;
            this.bloodMask.graphics.clear();
            if (blood_width > 8) {    //5边型
                this.bloodMask.graphics.drawPoly(0, 0, [0, 0, blood_width, 0, blood_width, 16, blood_width - 7, 24, 0, 24], 0x000000);
            }
            else {   //4边型=梯形
                let point_y: number = 24 - (8 - blood_width);//∠45°宽高相同
                this.bloodMask.graphics.drawPoly(0, 0, [0, 0, blood_width, 0, blood_width, 16, 0, point_y], 0x000000);
            }
            if (this.tween) {
                Laya.Tween.clear(this.tween);
            }
            this.followOpen = true;
            this.tween = Laya.Tween.to(this.blood_follow, { "x": blood_width - this.blood_list.width - 1 }, 600, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                this.followOpen = false;
                this.FollowComplete();
            }));
            if (this.followOpen) {
                Tick.Clear(this, this.FollowComplete);
                Tick.Clear(this, this.FollowProgram);
                Tick.Once(700, this, this.FollowProgram);
            }
            // this.Num_show();
        }

        private FollowProgram() {
            if (this.followOpen) {
                this.FollowComplete();
            }
        }

        private FollowComplete() {
            this.blood_follow.x = this.blood_list.width * (this.surplusBlood / this.totleBlood - 1) - 1;
            if (this.surplusBlood < 0) {
                this.surplusBlood = 0;
                this.blood.visible = false;
            }
            Laya.Tween.clear(this.tween);
        }

        private tween: laya.utils.Tween;
        private TotleProgress(totle: number) {
            if (this.totleWave == totle) {
                return;
            }
            this.totleWave = totle;
            let separation: number = 56;
            for (let i: number = 0; i < 5; i++) {
                this["sign_" + i].x = separation * i + separation / 2 * (5 - totle);
                this["sign_" + i].visible = i < totle;
            }
            this.progress_bg.x = 30 + separation / 2 * (5 - totle);
            this.progress_bg.width = separation * (totle - 1);
            if (!this.custom_wave_loop.visible) {
                this.custom_wave_loop.visible = true;
            }
        }

        private CurrProgress(currSign: number) {
            for (let i: number = 0; i < this.totleWave; i++) {
                //未开启
                let wkq: Image = this["sign_" + i].getChildByName("weikaiqi") as Image;
                //攻击中
                let gjz: Image = this["sign_" + i].getChildByName("gongjizhong") as Image;
                //已打完
                let ydw: Image = this["sign_" + i].getChildByName("yidawan") as Image;
                //Boss
                let bossWeida: Image = this["sign_" + i].getChildByName("boss_weida") as Image;
                let bossKaida: Image = this["sign_" + i].getChildByName("boss_kaida") as Image;

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
        }

        /**
         * 挑战Boss完成
         * 清理倒计时数据
         */
        private BossThrough(win: boolean) {
            this.custom_wave_boss.mouseEnabled = !win;
            Tick.Clear(this, this.TimeFrame);
        }

        public Clear() {
            this.bloodMask.graphics.drawRect(0, 0, this.blood_list.width, this.blood_list.height, 0x000000);
            this.blood.visible = false;
            this.customsIcon.Clear();
        }

        private Btn_control() {
            let bool = WroldBossLogic.Instance.View_Control();
            this.bg.visible = bool;
            this.bg_num.visible = !bool;
            this.Num_show();
        }
        private bossEndControl() {
            let bool = WroldBossLogic.Instance.View_Control();
            this.bg_num.visible = !bool && WroldBossLogic.Instance.Show;
        }

        private Num_show() {
            this.Boss_hurt.text = "伤害:" + BattleManager.Instance.TheWordBossDamage + "";
        }
    }

    class CustomsIcon {
        private readonly proportion: number = 0.63;
        private readonly time: number = 250;
        private custems: MainCustomsView;

        private customsOrder: number = 0;
        private customBox: Laya.Box;

        public constructor(mainView: MainCustomsView, customBox: Laya.Box) {
            this.custems = mainView;
            this.customBox = customBox;
        }

        public setIcon() {
            let urls = CustomsManager.Instance.CustomsVo;
            let currIcon = urls.strCustomsIcon
            let prevIcon = null
            if (CustomspassConfig.hasOwnProperty(urls.customsId - 1)) {
                prevIcon = CustomspassConfig[urls.customsId - 1]["strCustomsIcon"];
            }

            let nextIcon = null;
            if (CustomspassConfig.hasOwnProperty(urls.customsId + 1)) {
                nextIcon = CustomspassConfig[urls.customsId + 1]["strCustomsIcon"];
            }

            if (this.customsOrder == urls.customsOrder) {
                return;
            }
            this.customsOrder = urls.customsOrder;
            Laya.Tween.clearAll(this);
            if (CustomsManager.Instance.CustomsVo.customsOrder == 1) {
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
            Tick.Once(this.time + 200, this, this.MoveComplete);
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
                if (urls.customsOrder - 1 <= ShareLogic.Instance.ShareMax && ShareLogic.Instance.isOpenShare) {
                    for (let i = 0; i < ShareLogic.Instance.shareCustems.length; i++) {
                        let custemsNum = ShareLogic.Instance.shareCustems[i]
                        if ((urls.customsOrder - 1) == custemsNum) {
                            if (Number(this.custems.middle_num) != urls.customsOrder - 1) {
                                UIManager.Instance.CreateUI("ShareCustomsView", [ViewToppestRoot, urls.customsOrder - 1])
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
                TweenList.to(this, this.custems.middle_customs_panel,
                    {
                        centerX: this.custems.prev_customs_panel.centerX,
                        scaleX: this.proportion,
                        scaleY: this.proportion,
                    },
                    this.time, () => {
                        this.custems.middle_customs_panel.centerX = this.custems.prev_customs_panel.centerX;
                        this.custems.middle_customs_panel.scaleX = this.proportion;
                        this.custems.middle_customs_panel.scaleY = this.proportion;
                        this.MoveComplete();
                    });
                TweenList.to(this, this.custems.behind_customs_panel,
                    {
                        centerX: this.custems.curr_customs_panel.centerX,
                        scaleX: 1,
                        scaleY: 1,
                    },
                    this.time, () => {
                        this.custems.behind_customs_panel.centerX = this.custems.curr_customs_panel.centerX;
                        this.custems.behind_customs_panel.scaleX = 1;
                        this.custems.behind_customs_panel.scaleY = 1;
                        this.MoveComplete()
                    });
                TweenList.to(this, this.custems.prev_customs_panel,
                    {
                        alpha: 0,
                        scaleX: 0,
                        scaleY: 0,
                    },
                    this.time, () => {
                        this.custems.prev_customs_panel.alpha = 0;
                        this.custems.prev_customs_panel.scaleX = 0;
                        this.custems.prev_customs_panel.scaleY = 0;
                        this.MoveComplete();
                    });
                TweenList.to(this, this.custems.next_customs_panel,
                    {
                        alpha: 1,
                        scaleX: 1,
                        scaleY: 1,
                    },
                    this.time, () => {
                        this.custems.next_customs_panel.alpha = 1;
                        this.custems.next_customs_panel.scaleX = 1;
                        this.custems.next_customs_panel.scaleY = 1;
                        this.MoveComplete();
                    });
            }
        }

        private num: number;

        private MoveComplete() {
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
        }

        public Clear() {
            this.num = 0;
            this.MoveComplete();
        }

    }
}