module H52D_Framework {

    /**
     * @class：话题先锋面板
     * @author：zhangyusong
     */
    export class TopicView extends ui.action.topic.TopicViewUI {
        // 出生点
        private readonly BRITH_X: number = 360;
        private readonly BRITH_Y: number = 480;
        private readonly SKILL_CLICK: number = 100;
        private readonly LOCAL_WIN: Array<number> = [112, 592, 352];
        private readonly countdownTime: number = 3;

        private id: number;
        private actionVo: ActionVo;
        private monster: Monster;
        private tapAvatar: Avatar;
        private actionEffect: any;
        /** 倒计时表现类 */
        private countdown: Countdwon;
        /** 战斗倒计时60秒 */
        private _fightCountdownNumber: number;
        private _showPointTime: number;
        /** 贡献值 */
        private _contributeNumber: number;

        public constructor(id: number) {
            super();
            this.bgImg.skin = "res/ui/ui_noPack/img-daguanchangjing-huantixiangfeng.png";
            this.id = id;
            this.ViewInit();
            this.EventInit();

            this.wxbg.y = wxsclae
        }

        private ViewInit() {
            this.actionVo = TopicLogic.Instance.CurrVo;
            this.attack_name.text = this.actionVo.name;
            this.attack_point.text = this.actionVo.attackPoint;
            SetHtmlStyle(this.attack_instruction, 20, "#fef3ce", "left");
            this.attack_instruction.innerHTML = this.actionVo.attackInstruction;
            this.countdown = new Countdwon();
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

            this.actionEffect = ActiveSkillConfig[this.SKILL_CLICK]["actionEffect"];
            this.contributeNumber = this.actionVo.contribution;
            this.AddMonster();
            //胜利方为空，说明正在游戏中
            if (this.actionVo.win == ViewPoint.empty) {
                //游戏未开启，游戏开始
                if (this.actionVo.stamp == 0) {
                    this.fightCountdownNumber = this.actionVo.countdown;
                    this.GameStart();
                }
                //游戏已开启，判断是否过时
                else {
                    let time: number = Time.serverSecodes - this.actionVo.stamp;
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
        }

        private EventInit() {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_close.on(Laya.Event.CLICK, this, this.ClosePanel);
            this.target.on(Laya.Event.MOUSE_DOWN, this, this.GameFight);
            Event.RegistEvent("TopicInit", Laya.Handler.create(this, this.ViewInit));
            Event.RegistEvent("Action_sett", Laya.Handler.create(this, this.GameOver));
        }

        private Destroy() {
            Event.RemoveEvent("TopicInit", Laya.Handler.create(this, this.ViewInit));
            Event.RemoveEvent("Action_sett", Laya.Handler.create(this, this.GameOver));
            Tick.ClearAll(this);
            if (this.tapAvatar) {
                this.tapAvatar.Destroy();
                this.tapAvatar = null;
            }
        }

        private ClosePanel() {
            UIManager.Instance.DestroyUI("TopicView", [ViewToppestRoot]);
        }

        /** 游戏开始 */
        private GameStart() {
            this.target.mouseEnabled = false;
            this.btn_against.mouseEnabled = true;
            this.btn_support.mouseEnabled = true;
            this.btn_support.on(Laya.Event.CLICK, this, this.ChooseViewPoint, [ViewPoint.support]);
            this.btn_against.on(Laya.Event.CLICK, this, this.ChooseViewPoint, [ViewPoint.against]);
        }

        /** 游戏刷新 */
        private GameUpdate() {
            this.viewpoint = this.actionVo.viewPoint;
            this.target.mouseEnabled = true;
            Tick.Loop(1000, this, this.GameCountdown);
            Tick.Loop(3000, this, this.GameShowPic);
        }

        /** 游戏结算 */
        private GameBalance() {
            Tick.ClearAll(this);
            this.GameOver();
            this.icon_win.visible = true;

            if (this.actionVo.viewPoint == this.actionVo.win) {
                this.win_txt.text = "胜利";
            }
            else {
                this.win_txt.text = this.actionVo.win == ViewPoint.draw ? "平局" : "失败";
            }
            let index: number = Number(this.actionVo.win) - 1;
            this.icon_win.x = this.LOCAL_WIN[index];

            this.btn_support.label = this.actionVo.supportNum + "\n支持";
            this.btn_against.label = this.actionVo.againstNum + "\n反对";
            if (this.actionVo.viewPoint == ViewPoint.support) {
                this.btn_against.gray = true;
            }
            else if (this.actionVo.viewPoint == ViewPoint.against) {
                this.btn_support.gray = true;
            }
        }

        private set fightCountdownNumber(value: number) {
            this._fightCountdownNumber = value;
            this.txt_countdown.text = "倒计时x秒".replace("x", String(this._fightCountdownNumber));
        }

        private get fightCountdownNumber(): number {
            return this._fightCountdownNumber;
        }

        private set contributeNumber(value: number) {
            this._contributeNumber = value;
            this.attack_contribution.text = "贡献值:" +
                (this._contributeNumber > 1000000 ? (this._contributeNumber / 10000 >> 0) + "W" : this._contributeNumber);
        }

        private get contributeNumber(): number {
            return this._contributeNumber;
        }

        private AddMonster() {
            let mid: number = this.actionVo.monsterId;
            this.target.removeChildAt(0);
            this.CreateMonster(mid, this.target);
        }

        /**
         * 选择观点：同意还是反对
         * @param point 观点
         */
        private ChooseViewPoint(point: ViewPoint) {
            this.viewpoint = point;
            RemoteCall.Instance.Send("K_ReqTopicStarVote", point);
            Event.DispatchEvent("ActionCheck", [this.id]);
            this.countdown.time = this.countdownTime;
            this.countdown.Start(Laya.Handler.create(this, this.ReadyCountdown));
        }

        private set viewpoint(point: ViewPoint) {
            if (!(this.actionVo.win == ViewPoint.empty)) {
                return
            }
            if (point == ViewPoint.support) { //支持
                this.btn_support.label = "已支持";
                this.btn_against.gray = true;
            }
            else if (point == ViewPoint.against) { //反对
                this.btn_against.label = "已反对";
                this.btn_support.gray = true;
            }
            this.btn_against.mouseEnabled = false;
            this.btn_support.mouseEnabled = false;
        }

        /**
         * 战斗准备倒计时
         * @constructor
         */
        private ReadyCountdown() {
            if (this.monster != null) {
                this.target.mouseEnabled = true;
            }
            this.pic_start_click.visible = true;
            TweenList.to(this, this.pic_start_click, { "alpha": 0 }, 1500,
                () => {
                    this.pic_start_click.visible = false;
                    this.pic_start_click.alpha = 1;
                });
            Tick.Loop(1000, this, this.GameCountdown);
            Tick.Loop(3000, this, this.GameShowPic);
        }

        /**
         * 游戏倒计时
         * @constructor
         */
        private GameCountdown() {
            if (--this.fightCountdownNumber <= 0) {
                Tick.Clear(this, this.GameCountdown);
                Tick.Clear(this, this.GameShowPic);
                // this.GameOver();
                this.Elastic();
            }
        }

        /**
         * 游戏显示图标
         * @constructor
         */
        private GameShowPic() {
            let tween: laya.utils.Tween;
            tween = Laya.Tween.to(this.pic_point_click, { alpha: 1 }, 500, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                Laya.Tween.clear(tween);
                tween = Laya.Tween.to(this.pic_point_click, { alpha: 0 }, 1200, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                    Laya.Tween.clear(tween);
                }));
            }));
        }

        /**
         * 开始点击伤害
         */
        private GameFight() {
            this.TapSkill();
            let damage: number = MasterPlayer.Instance.player.damage;
            this.contributeNumber += damage;
            this.monster.OnHurt(damage, SkinEnum.SkinTap, false, SPECIAL_TYPE.ACTION, this.target);
            this._hurt = damage;
            RemoteCall.Instance.Send("K_ReqTopicVote", damage);
        }


        private _hurt: number = 0;
        /** 游戏结束弹框 */
        private Elastic() {
            // let contribute:string = SysPromptConfig[30047].strPromptInfo.replace("%s",
            // this._contributeNumber > 1000000 ? (this._contributeNumber/10000>>0)+"W" : this._contributeNumber)
            // TipsLogic.Instance.OpenMessageBox(contribute,
            // Laya.Handler.create(this,this.GameOver),
            // Laya.Handler.create(this,this.GameOver));
            UIManager.Instance.CreateUI("AcitonSettView", [ViewTipRoot, this.contributeNumber]);
        }

        /**
         * 游戏结束
         * @constructor
         */
        private GameOver() {
            let min: number = this.actionVo.timeEnd.getMinutes();
            let endtime: string = this.actionVo.timeEnd.getHours() + "点" + (min < 10 ? "0" + min : min) + "分";
            this.tx_reward.text = GetInfoAttr.Instance.GetText(7116).replace("%s", endtime);

            this.viewpoint = this.actionVo.viewPoint;
            this.fightCountdownNumber = 0;
            this.pic_end_click.visible = true;
            this.target.mouseEnabled = false;
        }

        /**
         * 创建怪物
         * @param id 怪物ID
         **/
        private CreateMonster(id: number, viewRoot: Laya.Box) {
            let vo: MonsterVo = new MonsterVo(id);
            if (this.monster == null) {
                this.monster = new Monster(vo, viewRoot);
                let scale: number = vo.modelScale;
                let shadow: number = 3;
                this.monster.LoadMonster(AvatarDirection.right, scale, this.BRITH_X, this.BRITH_Y, shadow, vo.location);
            }
        }

        /**点击技能 */
        private TapSkill(): void {
            if (this.tapAvatar == null) {
                this.tapAvatar = new Avatar(this.target)
                this.tapAvatar.Load(this.actionEffect["3"],
                    1, this.actionEffect["5"], 0, 0,
                    Laya.Handler.create(this, () => {
                        this.PlayTapEffect();
                    }));
            }
            else {
                this.PlayTapEffect();
            }
        }

        /** 点击特效 */
        private PlayTapEffect(): void {
            SoundManager.Instance.OnPlaySound("res/sound/tap_sound.mp3");
            let x = Laya.MouseManager.instance.mouseX;
            let y = Laya.MouseManager.instance.mouseY;
            let point = this.target.globalToLocal(new Laya.Point(x, y));
            this.tapAvatar.PosX = point.x;
            this.tapAvatar.PosY = point.y;
            this.tapAvatar.Play(this.actionEffect["4"], false);
        }
    }
}