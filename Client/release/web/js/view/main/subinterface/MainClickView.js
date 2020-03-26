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
    var Point = Laya.Point;
    /**
     * @class：主界面控制页面
     * @author：zhangyusong
     */
    var MainClickView = /** @class */ (function (_super) {
        __extends(MainClickView, _super);
        function MainClickView() {
            var _this = _super.call(this) || this;
            _this._first = null;
            _this._second = null;
            _this._timeLimit = true;
            _this._start = false;
            _this.totleCountdown = 8;
            _this.openCountdown = _this.totleCountdown;
            _this.InitView();
            _this.InitEvent();
            return _this;
        }
        MainClickView.prototype.InitView = function () {
            var _this = this;
            this.goldEndNum = H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdGold);
            this.WriteGold(this.goldEndNum);
            this.FrushDiamonds();
            H52D_Framework.EffectManager.Instance.RootList.push(this.clickBg);
            Laya.loader.load("res/ui/particle2D/StarEffect.part", Laya.Handler.create(this, function (settings) {
                _this.particle = new Laya.Particle2D(settings);
                _this.clickBg.addChild(_this.particle);
                _this.particle.emitter.stop();
                _this.particle.emitter.clear();
                _this.particle.autoPlay = false;
            }), null);
            H52D_Framework.CoinFlyBackPos[0] = this.control_box.x + this.gold_icon.x;
            H52D_Framework.CoinFlyBackPos[1] = (this.control_box.y + this.gold_icon.y); //+ (G_StageHeight - this.clickBg.height);
            this.goldSpeed = new GoldSpeed();
            this.goldSpeed.n = 0;
            this.goldEndNum = H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdGold);
            this.goldStartNum = this.goldMiddleNum = this.goldEndNum;
            this.effectCd = new H52D_Framework.Avatar(this.effect_bg);
            this.effectCd.Load(H52D_Framework.EffectDefine.jinbi, 1, 0.34, 30, 30);
        };
        MainClickView.prototype.InitEvent = function () {
            H52D_Framework.Event.RegistEvent("StopClick", Laya.Handler.create(this, this.UpdateView));
            H52D_Framework.Event.RegistEvent("PackRef", Laya.Handler.create(this, this.FrushGoldReduce));
            H52D_Framework.Event.RegistEvent("Role_lvup", Laya.Handler.create(this, this.OpenEffect));
            H52D_Framework.Event.RegistEvent("OnSlideDown", Laya.Handler.create(this, this.OnSlideDown));
            H52D_Framework.Event.RegistEvent("RemoveContinuity", Laya.Handler.create(this, this.OnSlideUp));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.DROP_ADD_CHILD, Laya.Handler.create(this, this.DropAddChild));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.Btn_control));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.ADD_GOLD, Laya.Handler.create(this, this.FrushGold));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.ADD_DIAMONDS, Laya.Handler.create(this, this.FrushDiamonds));
            this.clickBg.on(Laya.Event.MOUSE_DOWN, this, this.OnSlideDown);
        };
        MainClickView.prototype.Destroy = function () {
            H52D_Framework.Tick.ClearAll(this);
            H52D_Framework.Event.RemoveEvent("StopClick", Laya.Handler.create(this, this.UpdateView));
            H52D_Framework.Event.RemoveEvent("Role_lvup", Laya.Handler.create(this, this.OpenEffect));
            H52D_Framework.Event.RemoveEvent("PackRef", Laya.Handler.create(this, this.FrushGoldReduce));
            H52D_Framework.Event.RemoveEvent("OnSlideDown", Laya.Handler.create(this, this.OnSlideDown));
            H52D_Framework.Event.RemoveEvent("RemoveContinuity", Laya.Handler.create(this, this.OnSlideUp));
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.DROP_ADD_CHILD, Laya.Handler.create(this, this.DropAddChild));
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.ADD_GOLD, Laya.Handler.create(this, this.FrushGold));
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.Btn_control));
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.ADD_DIAMONDS, Laya.Handler.create(this, this.FrushDiamonds));
        };
        MainClickView.prototype.UpdateView = function (bool) {
            this.clickBg.mouseEnabled = bool;
        };
        MainClickView.prototype.Btn_control = function () {
            var bool = H52D_Framework.WroldBossLogic.Instance.View_Control(); //||LadderManager.Instance.View_Control();
            this.control_box.visible = bool;
            this.control_diond.visible = bool;
        };
        MainClickView.prototype.OnSlideDown = function () {
            //记录鼠标按下的位置 　　
            if (H52D_Framework.PrivilegeBuff.Instance.IsStart) {
                var mouseX = Laya.MouseManager.instance.mouseX;
                var mouseY = Laya.MouseManager.instance.mouseY;
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
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.MAIN_VIEW_CLICK, [1]);
            H52D_Framework.DropManager.Instance.SearchCoinFlyback(this.clickBg.mouseX, this.clickBg.mouseY);
        };
        MainClickView.prototype.OnSlideMove = function () {
            if (H52D_Framework.PrivilegeBuff.Instance.IsStart) {
                var tPos = this.clickBg.getMousePoint();
                this.particle.x = tPos.x;
                this.particle.y = tPos.y;
                if (this._start) {
                    this._start = false;
                    this.particle.emitter.start();
                }
                if (this._first) {
                    //记录鼠标拖动的位置
                    var x = Laya.MouseManager.instance.mouseX;
                    var y = Laya.MouseManager.instance.mouseY;
                    this._second = new Point(x, y);
                    if (this._second.x < this._first.x || this._second.x > this._first.x) {
                        H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.MAIN_VIEW_CLICK);
                        // this._timeLimit = false;
                        // Tick.Once(100, this, () => {
                        //     this._timeLimit = true;
                        // })
                    }
                    this._first = this._second;
                }
            }
        };
        MainClickView.prototype.OnSlideUp = function () {
            this.clickBg.off(Laya.Event.MOUSE_MOVE, this, this.OnSlideMove);
            this.clickBg.off(Laya.Event.MOUSE_UP, this, this.OnSlideUp);
            if (H52D_Framework.PrivilegeBuff.Instance.IsStart) {
                this._first = null;
                this._second = null;
                this._timeLimit = true;
                this.particle.emitter.stop();
            }
        };
        /** 刷新金币 */
        MainClickView.prototype.FrushGoldReduce = function () {
            var goldStr = H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdGold).toString();
            var gold = goldStr.substr(-1) == "W" ? Number(goldStr.substr(0, goldStr.length - 1)) * 10000 : Number(goldStr);
            if (gold > H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdGold)) {
                this.FrushGold();
            }
        };
        /** 刷新金币 */
        MainClickView.prototype.FrushGold = function (cost) {
            var _this = this;
            if (cost === void 0) { cost = 0; }
            this.openCountdown = 0;
            if (cost == 0) {
                this.goldEndNum = H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdGold);
            }
            else {
                this.IconZoom();
                this.goldEndNum += cost;
                if (this.goldEndNum >= H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdGold)) {
                    this.goldEndNum = H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdGold);
                    //释放特效
                    this.effectCd.PlayOnce();
                }
            }
            this.goldStartNum = Math.ceil(this.goldMiddleNum);
            H52D_Framework.Tick.FrameLoop(1, this, this.AddGold);
            this.turnTween = Laya.Tween.to(this.goldSpeed, { n: 100 }, 800, Laya.Ease.linearIn, Laya.Handler.create(this, function () {
                _this.TweenClear();
                _this.WriteGold(_this.goldEndNum);
            }));
        };
        /** 图标缩放 */
        MainClickView.prototype.IconZoom = function () {
            var _this = this;
            this.TweenClear();
            if (this.scaleTween) {
                Laya.Tween.clear(this.scaleTween);
            }
            this.scaleTween = Laya.Tween.to(this.gold_icon, { scaleX: 1.3, scaleY: 1.3 }, 200, Laya.Ease.linearIn, Laya.Handler.create(this, function () {
                Laya.Tween.clear(_this.scaleTween);
                _this.resetTween = Laya.Tween.to(_this.gold_icon, { scaleX: 1.0, scaleY: 1.0 }, 300, Laya.Ease.linearIn, Laya.Handler.create(_this, function () {
                    Laya.Tween.clear(_this.resetTween);
                }));
            }));
            //容错，防止Tween函数中断
            if (this.openCountdown >= this.totleCountdown) {
                H52D_Framework.Tick.Loop(100, this, this.ScaleEnd);
            }
        };
        MainClickView.prototype.ScaleEnd = function () {
            if (++this.openCountdown >= this.totleCountdown) {
                if (this.gold_icon.scaleX > 1.0) {
                    this.gold_icon.scaleX = this.gold_icon.scaleY = 1.0;
                    Laya.Tween.clear(this.scaleTween);
                    Laya.Tween.clear(this.resetTween);
                }
                H52D_Framework.Tick.Clear(this, this.ScaleEnd);
            }
        };
        MainClickView.prototype.TweenClear = function () {
            H52D_Framework.Tick.Clear(this, this.AddGold);
            if (this.turnTween) {
                Laya.Tween.clear(this.turnTween);
            }
            this.goldSpeed.n = 0;
        };
        MainClickView.prototype.AddGold = function () {
            var location = this.goldSpeed.n / 100;
            this.goldMiddleNum = this.goldStartNum + (this.goldEndNum - this.goldStartNum) * location;
            this.WriteGold(Number(this.goldMiddleNum.toFixed(0)));
        };
        MainClickView.prototype.WriteGold = function (gold) {
            if (gold < 1000000) {
                this.gold_num.text = gold.toString();
            }
            else {
                this.gold_num.text = Number(gold * 0.0001).toFixed(2).toString() + "W";
            }
        };
        MainClickView.prototype.FrushDiamonds = function () {
            var diamondsNum = H52D_Framework.BagManager.Instance.getItemNumber(H52D_Framework.BaseDefine.ItemIdDiamonds);
            if (diamondsNum < 1000000) {
                this.diond_num.text = diamondsNum.toString();
            }
            else {
                this.diond_num.text = Number(diamondsNum * 0.0001).toFixed(2).toString() + "W";
            }
        };
        /**将掉落物加入ClickBg下面 */
        MainClickView.prototype.DropAddChild = function (item) {
            this.clickBg.addChild(item);
        };
        MainClickView.prototype.OpenEffect = function () {
            this.Role_lvup_Effect(H52D_Framework.ViewUILogic.Instance.roleLvUp);
        };
        /**角色升级特效 */
        MainClickView.prototype.Role_lvup_Effect = function (pos) {
            var apos = new H52D_Framework.Avatar(pos);
            apos.Load(H52D_Framework.EffectDefine.shengji, 1, 3.3, 80, 68, Laya.Handler.create(this, function (aposs) {
                //this._Lveffect.visible=true;
                aposs.Play("effect_ui_shengji", false, true, function () {
                    aposs.Destroy();
                });
            }));
        };
        return MainClickView;
    }(ui.main.subinterface.MainClickViewUI));
    H52D_Framework.MainClickView = MainClickView;
    var GoldSpeed = /** @class */ (function () {
        function GoldSpeed() {
        }
        return GoldSpeed;
    }());
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MainClickView.js.map