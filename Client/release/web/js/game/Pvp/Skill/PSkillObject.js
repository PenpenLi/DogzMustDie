var H52D_Framework;
(function (H52D_Framework) {
    /***/
    var PSkillObject = /** @class */ (function () {
        function PSkillObject(owner, data, view, btype, to) {
            /**技能数据 */
            this._data = {};
            this.isdestroy = false;
            /** 抛物线开口参数：a */
            this.a = 0.003;
            /**
             * 1 抛物线
             * 2 直线
             */
            this._flyType = 0;
            /**被击特效播放 */
            this._hitAvatar = null;
            /**目标终点 */
            this._EndX = 0;
            /**目标起点X */
            this._TPosX = 0;
            /**目标起点Y */
            this._TPosY = 0;
            this._btype = 0;
            this._dir = 1;
            this._bcomplete = false;
            this.isdestroy = false;
            this._bcomplete = false;
            this._skillData = data;
            this._ViewRoot = view;
            this._dir = btype;
            this._owner = owner;
            this._flyType = this._skillData.flyEffect[2];
            this._btype = btype;
            this._belongs = to;
        }
        Object.defineProperty(PSkillObject.prototype, "A", {
            get: function () {
                return this.a;
            },
            set: function (v) {
                this.a = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PSkillObject.prototype, "Speed", {
            get: function () {
                return this.speed;
            },
            set: function (v) {
                this.a = v;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 飞行曲线的参数调整
         * @param a 抛物线
         * @param speed 速度
         * @param start_point 子弹起点位置调节
         * @param end_x 子弹终点位置调节
         * @param end_y 子弹终点位置调节
         * @param area 子弹随机区域宽高
         * @param start_angle 初始角度调整s
         */
        PSkillObject.prototype.Bullet = function (a, speed, start_point, end_x, end_y, area, start_angle) {
            if (a === void 0) { a = 3; }
            if (speed === void 0) { speed = 4; }
            if (end_x === void 0) { end_x = 0; }
            if (end_y === void 0) { end_y = -100; }
            if (area === void 0) { area = 100; }
            if (start_angle === void 0) { start_angle = 0; }
            this.a = a * 0.001;
            this.speed = speed * 0.01;
            this.correct_start_point = start_point;
            this.correct_end_x = end_x;
            this.correct_end_y = end_y;
            this.area = area;
            this.correct_angle = start_angle;
        };
        Object.defineProperty(PSkillObject.prototype, "BComplete", {
            get: function () { return this._bcomplete; },
            set: function (value) { this._bcomplete = value; },
            enumerable: true,
            configurable: true
        });
        PSkillObject.prototype.OnUpdate = function () {
        };
        /**释放技能*/
        PSkillObject.prototype.Spell = function (target) {
            this._target = null;
            this._target = target;
            this.isdestroy = false;
            this._bcomplete = false;
            this.LoadSkillEffect();
        };
        PSkillObject.prototype.LoadSkillEffect = function () {
            var _this = this;
            if (this._Object) {
                this.PlaySkillEffect();
            }
            else {
                this._Object = new H52D_Framework.Avatar(this._ViewRoot);
                this._Object.Load(this._skillData.flyEffect[3], this._dir, this._skillData.flyEffect["6"], 0, 0, Laya.Handler.create(this, function () { _this.PlaySkillEffect(); }));
            }
        };
        /**飞行特效*/
        PSkillObject.prototype.PlaySkillEffect = function () {
            if (this.CheckIsDestroy()) {
                return;
            }
            if (this._owner.type == eCharacter_TYPE.CAMP && this._belongs == eBELONGS_TO.ATTACK) {
                this._EndX = this._btype == 1 ? 540 : 190;
                this._TPosX = this._EndX;
                this._TPosY = 730;
            }
            else {
                this._EndX = this._target.PosX;
                this._TPosX = this._target.PosX;
                this._TPosY = this._target.PosY;
            }
            //攻击动作开始后的延迟时间点上播放子弹特效
            var time = this._skillData.flyEffect["7"];
            var pointID = this._skillData.flyEffect["1"];
            var pointArr = this._btype == 1 ? H52D_Framework.OSkillPoint[pointID - 1] : H52D_Framework.POSkillPoint[pointID - 1];
            var point = new Laya.Point(pointArr[0], pointArr[1]);
            switch (this._flyType) {
                case 1:
                    this.Bullet(3, this._skillData.flyEffect["5"], point, 0, -50, 0, 0);
                    break;
                case 2:
                    this.Bullet(0, this._skillData.flyEffect["5"], point, 0, -50, 0, 0);
                    break;
            }
            H52D_Framework.Tick.Once(time, this, this.palyEffect);
        };
        /**攻击特效 */
        PSkillObject.prototype.palyEffect = function () {
            if (this._Object) {
                this._Object.visible = true;
                this._Object.Play(this._skillData.flyEffect[4], true);
                //起点绝对位置
                this.start_x = this._owner.avatar.PosX + this.correct_start_point.x;
                this.start_y = this._owner.avatar.PosY + this.correct_start_point.y;
                var t = this._TPosX;
                //终点相对位置,随机区域范围
                this.end_x = this._TPosX - this.start_x + this.correct_end_x + (Math.random() - 0.5) * this.area;
                this.end_y = this._TPosY - this.start_y + this.correct_end_y + (Math.random() - 0.5) * this.area;
                this._Object.PosX = this.start_x;
                this._Object.PosY = this.start_y;
                //步阶
                this.step_x = this.speed;
                if (this._Object) {
                    H52D_Framework.Tick.FrameLoop(1, this, this.FrameHander);
                }
            }
            else {
                this.isdestroy = true;
            }
        };
        /**更新逻辑 */
        PSkillObject.prototype.FrameHander = function () {
            if (this._Object) {
                if (this._btype == 1) {
                    this._Object.PosX += (this.speed / 6) * H52D_Framework.Time.deltaTime;
                }
                else {
                    this._Object.PosX -= (this.speed / 6) * H52D_Framework.Time.deltaTime;
                }
                // y = a*x*x + b*x; b = -a*m + n/m; 推算公式：m、n分别是终点的x、y 400,160
                var x = this._Object.PosX - this.start_x;
                var b = (-this.a * this.end_x + this.end_y / this.end_x);
                this.step_y = this.a * x * x + b * x;
                this._Object.PosY = this.start_y + this.step_y;
                //旋转角度，求导 tan& = 2 * a * x + b;
                this.step_angle = Math.atan(2 * this.a * x + b) * 180 / Math.PI;
                this._Object.Rotate(this.correct_angle + this.step_angle);
                if (this._btype == 1) {
                    if (this._Object.PosX >= this._EndX) {
                        this.OnComplete();
                    }
                }
                else {
                    if (this._Object.PosX <= this._EndX) {
                        this.OnComplete();
                    }
                }
            }
            else {
                this.isdestroy = true;
            }
        };
        /**远程特效到达目标点的回调 */
        PSkillObject.prototype.OnComplete = function () {
            this.Hidden();
            this._bcomplete = true;
            // if (this.CheckIsDestroy()) {
            // 	return;
            // }
            /**播放被击特效 */
            var x = this._Object.PosX;
            var y = this._Object.PosY;
            if (!H52D_Framework.ObjIsEmpty(this._skillData.hitEffect)) {
                this.LoadHitEffect(x, y);
            }
        };
        PSkillObject.prototype.LoadHitEffect = function (x, y) {
            var _this = this;
            if (this._hitAvatar) {
                this.PlayHitEffect(x, y);
            }
            else {
                this._hitAvatar = new H52D_Framework.Avatar(this._ViewRoot);
                this._hitAvatar.Load(this._skillData.hitEffect[1], this._dir, this._skillData.hitEffect[3], x, y, Laya.Handler.create(this, function () { _this.PlayHitEffect(x, y); }));
            }
        };
        PSkillObject.prototype.PlayHitEffect = function (x, y) {
            var _this = this;
            if (this.CheckIsDestroy()) {
                return;
            }
            H52D_Framework.SoundManager.Instance.OnPlaySound(this._skillData.hitSound[1]);
            if (this._hitAvatar.Armature) {
                this._hitAvatar.visible = true;
                this._hitAvatar.PosX = x;
                this._hitAvatar.PosY = y;
                this._hitAvatar.Play(this._skillData.hitEffect[2], false, true, function () {
                    _this.isdestroy = true;
                });
            }
        };
        /**检查是否需要销毁 */
        PSkillObject.prototype.CheckIsDestroy = function () {
            if (!this._target || this._target.IsDie || !this._owner || !this._owner.avatar) {
                this.isdestroy = true;
                return true;
            }
            return false;
        };
        PSkillObject.prototype.Hidden = function () {
            this.isdestroy = true;
            if (this._Object && this._Object.Armature) {
                this._Object.visible = false;
            }
            H52D_Framework.Tick.Clear(this, this.FrameHander);
        };
        PSkillObject.prototype.Destroy = function () {
            if (this._Object) {
                this._Object.Destroy();
                this._Object = null;
            }
            if (this._hitAvatar) {
                this._hitAvatar.Destroy();
                this._hitAvatar = null;
            }
        };
        PSkillObject.prototype.Claer = function () {
            this._target = [];
            this._owner = null;
            this._data = null;
        };
        return PSkillObject;
    }());
    H52D_Framework.PSkillObject = PSkillObject;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PSkillObject.js.map