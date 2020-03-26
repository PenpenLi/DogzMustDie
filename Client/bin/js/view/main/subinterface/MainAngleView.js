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
     * @class：主界面小仙女页面
     * @author：zhangyusong
     */
    var MainAngleView = /** @class */ (function (_super) {
        __extends(MainAngleView, _super);
        function MainAngleView() {
            var _this = _super.call(this) || this;
            _this.anglePath = "res/player/xiaoxiannv/xxn.sk";
            _this.angleScale = 0.10;
            _this.boxPath = "res/player/box/box.sk";
            _this.boxScale = 0.12;
            _this.effPath = "res/effect/effect_state_baoxiang/effect_state_baoxiang.sk";
            _this.effScale = 1;
            /** 天使状态，1入场 2飞行 3掉落 4离开 */
            _this.state = 0;
            /** 方向，借用Avatar */
            _this._direction = AvatarDirection.right;
            _this.rotationDirection = 1;
            _this.g = 0;
            _this.InitView();
            _this.InitEvent();
            return _this;
        }
        MainAngleView.prototype.InitView = function () {
            var _this = this;
            this.view.visible = false;
            this.view.x = 0;
            this.view.y = 0;
            this.angleModel = new H52D_Framework.Avatar(this.model);
            this.angleModel.Load(this.anglePath, AvatarDirection.left, this.angleScale, 35, 42, Laya.Handler.create(this, function () {
                _this.angleModel.Play(H52D_Framework.AnimationName.idle);
            }));
            this.img_box.visible = false;
            this.boxModel = new H52D_Framework.Avatar(this.box);
            this.boxModel.Load(this.boxPath, AvatarDirection.left, this.boxScale, 35, 0, Laya.Handler.create(this, function () {
                _this.boxModel.Play(H52D_Framework.AnimationName.idle);
            }));
            this.effModel = new H52D_Framework.Avatar(this.box);
            this.effModel.Load(this.effPath, AvatarDirection.left, this.effScale, 45, -10, Laya.Handler.create(this, function () {
            }));
        };
        MainAngleView.prototype.InitEvent = function () {
            H52D_Framework.Event.RegistEvent("AngleOpen", Laya.Handler.create(this, this.Start));
            H52D_Framework.Event.RegistEvent("AngleLeave", Laya.Handler.create(this, this.Leave));
            H52D_Framework.Event.RegistEvent("AngleSuspend", Laya.Handler.create(this, this.Suspend));
            H52D_Framework.Event.RegistEvent("AngleContinue", Laya.Handler.create(this, this.Continue));
        };
        MainAngleView.prototype.Destroy = function () {
            H52D_Framework.Tick.ClearAll(this);
        };
        Object.defineProperty(MainAngleView.prototype, "direction", {
            get: function () {
                return this._direction;
            },
            set: function (value) {
                this._direction = value;
                this.angleModel.direction = -value;
                this.boxModel.direction = -value;
                this.img_box.scaleX = -value;
            },
            enumerable: true,
            configurable: true
        });
        /** 小天使离开 */
        MainAngleView.prototype.Leave = function () {
            this.state = 4;
        };
        /** 暂停 */
        MainAngleView.prototype.Suspend = function (state) {
            H52D_Framework.ViewUILogic.Instance.angleRun = false;
            this.view.visible = false;
            H52D_Framework.Tick.Clear(this, this.FrameHander);
            if (this.state == 1) { //入场状态
                this.SetPoint(0, 0);
                this.state = 2;
            }
            else if (this.state == 2) { //飞行状态
            }
            else if (this.state == 3) { //掉落状态
                this.SetPoint(0, 0);
                this.g = 0;
                this.state = 2;
            }
            else if (this.state == 4) { //离开状态
                this.state = 1;
                this.SetPoint(-60, -160);
            }
        };
        /** 继续 */
        MainAngleView.prototype.Continue = function () {
            H52D_Framework.ViewUILogic.Instance.angleRun = true;
            if (this.state == 2) { //飞行状态
                H52D_Framework.Tick.Loop(10, this, this.FrameHander);
                this.view.visible = true;
            }
        };
        /** 开始 */
        MainAngleView.prototype.Start = function (id) {
            //入场播放音效
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/angel.mp3");
            this.angleId = id;
            this.frame = 0;
            this.state = 1;
            this.SetPoint(-60, -60);
            this.direction = AvatarDirection.right;
            this.img_box.visible = false;
            this.boxModel.visible = true;
            this.view.visible = true;
            H52D_Framework.Tick.Loop(10, this, this.FrameHander);
            this.model.on(Laya.Event.CLICK, this, this.OnPackHander);
        };
        MainAngleView.prototype.SetPoint = function (sx, sy) {
            this.model.x = sx;
            this.model.y = sy;
            this.box.x = this.model.x + 35;
            this.box.y = this.model.y + 48;
        };
        /** 拾取宝箱 */
        MainAngleView.prototype.OnPackHander = function () {
            //播放点击小仙女瞬间音效
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/tap_sound.mp3");
            this.frame = 0;
            this.state = 3;
            this.img_box.visible = true;
            this.boxModel.visible = false;
            H52D_Framework.ViewUILogic.Instance.AngleTimeInit();
        };
        MainAngleView.prototype.FrameHander = function () {
            if (this.state == 1) { //入场状态
                this.AdmissionState();
            }
            else if (this.state == 2) { //飞行状态
                this.FlyState();
            }
            else if (this.state == 3) { //掉落状态
                this.DropState();
            }
            else if (this.state == 4) { //离开状态
                this.LeaveState();
            }
        };
        /** 入场状态 */
        MainAngleView.prototype.AdmissionState = function () {
            //天使飞走
            if (this.model.x < 0) {
                this.model.x += 1;
                this.model.y += 1;
                this.SetPoint(this.model.x, this.model.y);
            }
            else {
                this.SetPoint(0, 0);
                this.state = 2;
            }
        };
        /** 飞行状态 */
        MainAngleView.prototype.FlyState = function () {
            if (this.model.x < 0 || this.model.x > this.panel.width) {
                if (this.model.x < 0)
                    this.model.x = 0;
                if (this.model.x > this.panel.width)
                    this.model.x = this.panel.width;
                this.frame = 0;
                this.direction = -this.direction;
                this.model.x += this.direction * 1;
            }
            else {
                this.frame += this.direction * 0.03;
                var x = this.model.x;
                x += this.direction * 1.2;
                var y = Math.sin(this.frame) * 18;
                this.SetPoint(x, y);
            }
        };
        /** 掉落状态 */
        MainAngleView.prototype.DropState = function () {
            var _this = this;
            //天使飞走
            if (this.model.y > -320) {
                this.model.x += this.direction * 3;
                this.model.y -= 4;
            }
            //宝箱坠落
            if (this.box.y < this.panel.height) {
                this.g += 0.98;
                this.box.y += 0.3 * this.g;
                //宝箱旋转
                if (this.box.rotation >= 4) {
                    this.rotationDirection = -1;
                }
                else if (this.box.rotation <= -4) {
                    this.rotationDirection = 1;
                }
                this.box.rotation += this.rotationDirection * 0.4;
            }
            else {
                //延迟一下，打开宝箱
                H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/angel2.mp3");
                this.g = 0;
                this.box.rotation = 0;
                this.view.off(Laya.Event.CLICK, this, this.OnPackHander);
                this.effModel.PlayOnce("effect_state_baoxiang");
                H52D_Framework.Tick.ClearAll(this);
                H52D_Framework.Tick.Once(400, this, function () {
                    _this.view.visible = false;
                    _this.OpenReward();
                });
            }
        };
        /** 打开奖励 */
        MainAngleView.prototype.OpenReward = function () {
            var angleType = H52D_Framework.ViewUILogic.Instance.angleType;
            var type = H52D_Framework.FairyConfig[angleType][this.angleId]["fairyType"];
            if (type == 1) {
                H52D_Framework.ViewUILogic.Instance.AngleStop();
                H52D_Framework.UIManager.Instance.CreateUI("AngleView", [H52D_Framework.ViewUpRoot, this.angleId]);
            }
            else if (type == 2) {
                H52D_Framework.ViewUILogic.Instance.K_ReqAngelBeats(this.angleId, false);
            }
            else if (type == 3) {
                H52D_Framework.ViewUILogic.Instance.AngleStop();
                H52D_Framework.UIManager.Instance.CreateUI("AngleView", [H52D_Framework.ViewUpRoot, this.angleId]);
            }
        };
        /** 离开状态 */
        MainAngleView.prototype.LeaveState = function () {
            //天使飞走
            if (this.model.y > -300) {
                this.model.x += this.direction * 3;
                this.model.y -= 4;
                this.SetPoint(this.model.x, this.model.y);
            }
            else {
                H52D_Framework.Tick.ClearAll(this);
                this.view.visible = false;
            }
        };
        return MainAngleView;
    }(ui.main.subinterface.MainAngleViewUI));
    H52D_Framework.MainAngleView = MainAngleView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MainAngleView.js.map