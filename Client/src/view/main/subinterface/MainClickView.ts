module H52D_Framework {
    import Point = Laya.Point;

    /**
     * @class：主界面控制页面
     * @author：zhangyusong
     */
    export class MainClickView extends ui.main.subinterface.MainClickViewUI implements IViewPanel {
        /** 技能CD特效 */
        private effectCd: Avatar;
        private turnTween: laya.utils.Tween;
        private scaleTween: laya.utils.Tween;
        private resetTween: laya.utils.Tween;
        private particle: Laya.Particle2D;
        private goldStartNum: number;
        private goldMiddleNum: number;
        private goldEndNum: number;
        private goldSpeed: GoldSpeed;

        public constructor() {
            super();
            this.InitView();
            this.InitEvent();
        }

        private InitView() {
            this.goldEndNum = BagManager.Instance.getItemNumber(BaseDefine.ItemIdGold);
            this.WriteGold(this.goldEndNum);
            this.FrushDiamonds();
            EffectManager.Instance.RootList.push(this.clickBg);
            Laya.loader.load("res/ui/particle2D/StarEffect.part",
                Laya.Handler.create(this, (settings: Laya.ParticleSetting) => {
                    this.particle = new Laya.Particle2D(settings);
                    this.clickBg.addChild(this.particle);
                    this.particle.emitter.stop();
                    this.particle.emitter.clear();
                    this.particle.autoPlay = false;
                }), null);
            CoinFlyBackPos[0] = this.control_box.x + this.gold_icon.x;
            CoinFlyBackPos[1] = (this.control_box.y + this.gold_icon.y) //+ (G_StageHeight - this.clickBg.height);
            this.goldSpeed = new GoldSpeed();
            this.goldSpeed.n = 0;
            this.goldEndNum = BagManager.Instance.getItemNumber(BaseDefine.ItemIdGold);
            this.goldStartNum = this.goldMiddleNum = this.goldEndNum;
            this.effectCd = new Avatar(this.effect_bg)
            this.effectCd.Load(EffectDefine.jinbi, 1, 0.34, 30, 30);
        }

        private InitEvent(): void {
            Event.RegistEvent("StopClick", Laya.Handler.create(this, this.UpdateView));
            Event.RegistEvent("PackRef", Laya.Handler.create(this, this.FrushGoldReduce));
            Event.RegistEvent("Role_lvup", Laya.Handler.create(this, this.OpenEffect));
            Event.RegistEvent("OnSlideDown", Laya.Handler.create(this, this.OnSlideDown));
            Event.RegistEvent("RemoveContinuity", Laya.Handler.create(this, this.OnSlideUp));
            Event.RegistEvent(EventDefine.DROP_ADD_CHILD, Laya.Handler.create(this, this.DropAddChild));
            Event.RegistEvent(EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.Btn_control));
            Event.RegistEvent(EventDefine.ADD_GOLD, Laya.Handler.create(this, this.FrushGold));
            Event.RegistEvent(EventDefine.ADD_DIAMONDS, Laya.Handler.create(this, this.FrushDiamonds));

            this.clickBg.on(Laya.Event.MOUSE_DOWN, this, this.OnSlideDown);
        }

        public Destroy(): void {
            Tick.ClearAll(this);
            Event.RemoveEvent("StopClick", Laya.Handler.create(this, this.UpdateView));
            Event.RemoveEvent("Role_lvup", Laya.Handler.create(this, this.OpenEffect));
            Event.RemoveEvent("PackRef", Laya.Handler.create(this, this.FrushGoldReduce));
            Event.RemoveEvent("OnSlideDown", Laya.Handler.create(this, this.OnSlideDown));
            Event.RemoveEvent("RemoveContinuity", Laya.Handler.create(this, this.OnSlideUp));
            Event.RemoveEvent(EventDefine.DROP_ADD_CHILD, Laya.Handler.create(this, this.DropAddChild));
            Event.RemoveEvent(EventDefine.ADD_GOLD, Laya.Handler.create(this, this.FrushGold));
            Event.RemoveEvent(EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.Btn_control));
            Event.RemoveEvent(EventDefine.ADD_DIAMONDS, Laya.Handler.create(this, this.FrushDiamonds));
        }

        private UpdateView(bool: boolean) {
            this.clickBg.mouseEnabled = bool;
        }

        private Btn_control() {
            let bool = WroldBossLogic.Instance.View_Control()//||LadderManager.Instance.View_Control();
            this.control_box.visible = bool;
            this.control_diond.visible = bool;
        }
        private _first: Point = null;
        private _second: Point = null;
        private _timeLimit: boolean = true;
        private _start: boolean = false;

        private OnSlideDown(): void {
            //记录鼠标按下的位置 　　
            if (PrivilegeBuff.Instance.IsStart) {
                let mouseX = Laya.MouseManager.instance.mouseX;
                let mouseY = Laya.MouseManager.instance.mouseY;
                this._first = new Point(mouseX, mouseY);
                this._start = true;
                this.clickBg.on(Laya.Event.MOUSE_MOVE, this, this.OnSlideMove);
                this.clickBg.on(Laya.Event.MOUSE_UP, this, this.OnSlideUp);
            }
            else {
                this._first = null;
                this._second = null;
                this._timeLimit = true;
                if (this.particle) {
                    this.particle.emitter.stop();
                }
            }
            Event.DispatchEvent(EventDefine.MAIN_VIEW_CLICK, [1]);
            DropManager.Instance.SearchCoinFlyback(this.clickBg.mouseX, this.clickBg.mouseY);
        }

        private OnSlideMove(): void {
            if (PrivilegeBuff.Instance.IsStart) {
                let tPos = this.clickBg.getMousePoint();
                this.particle.x = tPos.x;
                this.particle.y = tPos.y;
                if (this._start) {
                    this._start = false;
                    this.particle.emitter.start();
                }
                if (this._first) {
                    //记录鼠标拖动的位置
                    let x = Laya.MouseManager.instance.mouseX;
                    let y = Laya.MouseManager.instance.mouseY;
                    this._second = new Point(x, y);
                    if (this._second.x < this._first.x || this._second.x > this._first.x) {
                        Event.DispatchEvent(EventDefine.MAIN_VIEW_CLICK);
                        // this._timeLimit = false;
                        // Tick.Once(100, this, () => {
                        //     this._timeLimit = true;
                        // })
                    }
                    this._first = this._second;
                }
            }
        }

        private OnSlideUp(): void {
            this.clickBg.off(Laya.Event.MOUSE_MOVE, this, this.OnSlideMove);
            this.clickBg.off(Laya.Event.MOUSE_UP, this, this.OnSlideUp);
            if (PrivilegeBuff.Instance.IsStart) {
                this._first = null;
                this._second = null;
                this._timeLimit = true;
                this.particle.emitter.stop();
            }
        }

        /** 刷新金币 */
        private FrushGoldReduce(): void {
            let goldStr: string = BagManager.Instance.getItemNumber(BaseDefine.ItemIdGold).toString();
            let gold: number = goldStr.substr(-1) == "W" ? Number(goldStr.substr(0, goldStr.length - 1)) * 10000 : Number(goldStr);
            if (gold > BagManager.Instance.getItemNumber(BaseDefine.ItemIdGold)) {
                this.FrushGold();
            }
        }

        /** 刷新金币 */
        private FrushGold(cost: number = 0): void {
            this.openCountdown = 0;
            if (cost == 0) {
                this.goldEndNum = BagManager.Instance.getItemNumber(BaseDefine.ItemIdGold);
            }
            else {
                this.IconZoom();
                this.goldEndNum += cost;
                if (this.goldEndNum >= BagManager.Instance.getItemNumber(BaseDefine.ItemIdGold)) {
                    this.goldEndNum = BagManager.Instance.getItemNumber(BaseDefine.ItemIdGold);
                    //释放特效
                    this.effectCd.PlayOnce();
                }
            }
            this.goldStartNum = Math.ceil(this.goldMiddleNum);
            Tick.FrameLoop(1, this, this.AddGold);
            this.turnTween = Laya.Tween.to(this.goldSpeed, { n: 100 }, 800, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                this.TweenClear();
                this.WriteGold(this.goldEndNum);
            }));
        }

        /** 图标缩放 */
        private IconZoom() {
            this.TweenClear();
            if (this.scaleTween) {
                Laya.Tween.clear(this.scaleTween);
            }
            this.scaleTween = Laya.Tween.to(this.gold_icon, { scaleX: 1.3, scaleY: 1.3 }, 200, Laya.Ease.linearIn,
                Laya.Handler.create(this, () => {
                    Laya.Tween.clear(this.scaleTween);
                    this.resetTween = Laya.Tween.to(this.gold_icon, { scaleX: 1.0, scaleY: 1.0 }, 300, Laya.Ease.linearIn,
                        Laya.Handler.create(this, () => {
                            Laya.Tween.clear(this.resetTween);
                        })
                    );
                })
            );
            //容错，防止Tween函数中断
            if (this.openCountdown >= this.totleCountdown) {
                Tick.Loop(100, this, this.ScaleEnd);
            }
        }

        private readonly totleCountdown: number = 8;
        private openCountdown: number = this.totleCountdown;
        private ScaleEnd() {
            if (++this.openCountdown >= this.totleCountdown) {
                if (this.gold_icon.scaleX > 1.0) {
                    this.gold_icon.scaleX = this.gold_icon.scaleY = 1.0;
                    Laya.Tween.clear(this.scaleTween);
                    Laya.Tween.clear(this.resetTween);
                }
                Tick.Clear(this, this.ScaleEnd);
            }
        }

        private TweenClear() {
            Tick.Clear(this, this.AddGold);
            if (this.turnTween) {
                Laya.Tween.clear(this.turnTween);
            }
            this.goldSpeed.n = 0;
        }

        private AddGold(): void {
            let location: number = this.goldSpeed.n / 100;
            this.goldMiddleNum = this.goldStartNum + (this.goldEndNum - this.goldStartNum) * location;
            this.WriteGold(Number(this.goldMiddleNum.toFixed(0)));
        }

        private WriteGold(gold: number) {
            if (gold < 1000000) {
                this.gold_num.text = gold.toString();
            }
            else {
                this.gold_num.text = Number(gold * 0.0001).toFixed(2).toString() + "W";
            }
        }

        private FrushDiamonds() {
            let diamondsNum: number = BagManager.Instance.getItemNumber(BaseDefine.ItemIdDiamonds);
            if (diamondsNum < 1000000) {
                this.diond_num.text = diamondsNum.toString();
            }
            else {
                this.diond_num.text = Number(diamondsNum * 0.0001).toFixed(2).toString() + "W";
            }
        }

        /**将掉落物加入ClickBg下面 */
        private DropAddChild(item: Laya.Image) {
            this.clickBg.addChild(item);
        }

        private OpenEffect() {
            this.Role_lvup_Effect(ViewUILogic.Instance.roleLvUp);
        }


        /**角色升级特效 */
        private Role_lvup_Effect(pos) {
            let apos = new Avatar(pos)
            apos.Load(EffectDefine.shengji, 1, 3.3, 80, 68,
                Laya.Handler.create(this, (aposs) => {
                    //this._Lveffect.visible=true;
                    aposs.Play("effect_ui_shengji", false, true, () => {
                        aposs.Destroy();
                    })
                }));
        }
    }

    class GoldSpeed {
        public n: number;
    }

}