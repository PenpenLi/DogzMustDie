var H52D_Framework;
(function (H52D_Framework) {
    /**非子弹类 */
    var SkillNone = /** @class */ (function () {
        function SkillNone(owner, data, view, to, btype) {
            if (btype === void 0) { btype = 1; }
            /**朝向 */
            this._dir = 1;
            this._order = 0;
            this._posX = 0;
            this._posY = 1;
            /**特效列表 */
            this._avtarTab = [];
            /**被击特效列表*/
            this._hitAvatarTab = [];
            this.isDie = false;
            this._bcomplete = false;
            this._btype = 0;
            this._skillData = data;
            this._owner = owner;
            this._order = 0;
            this._ViewRoot = view;
            this._avtarTab = [];
            this._hitAvatarTab = [];
            this._belongs = to;
            this._btype = btype;
            this._dir = btype == 1 ? 1 : -1;
        }
        Object.defineProperty(SkillNone.prototype, "BComplete", {
            get: function () { return this._bcomplete; },
            set: function (value) { this._bcomplete = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillNone.prototype, "_path", {
            /**特效路径 */
            get: function () { return this._skillData.actionEffect[3]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillNone.prototype, "_scla", {
            /**特效大小 */
            get: function () { return this._skillData.actionEffect[5]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillNone.prototype, "_PointId", {
            /**特效挂点ID */
            get: function () { return this._skillData.actionEffect[1]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillNone.prototype, "_delayTime", {
            /**延迟时间 */
            get: function () { return this._skillData.actionEffect[2]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillNone.prototype, "_name", {
            /**特效动画名字 */
            get: function () { return this._skillData.actionEffect[4]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillNone.prototype, "_hitPath", {
            /**被击特效路径 */
            get: function () { return this._skillData.hitEffect[1]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillNone.prototype, "_hitName", {
            /**被击特效动画名 */
            get: function () { return this._skillData.hitEffect[2]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkillNone.prototype, "_hitScla", {
            /**被击特效大小 */
            get: function () { return this._skillData.hitEffect[3]; },
            enumerable: true,
            configurable: true
        });
        /**释放技能 */
        SkillNone.prototype.SpellSkill = function (target, _belongs) {
            var _this = this;
            this._avtarTab = [];
            this._hitAvatarTab = [];
            this._target = [];
            this._bcomplete = false;
            if (this._skillData.special == 1) {
                /**设置目标 */
                for (var i = 0; i < target.length; i++) {
                    this._target.push(target[i]);
                }
            }
            else {
                for (var i = 0; i < target.length; i++) {
                    if ((target[i])) {
                        this._target.push(target[i]);
                        break;
                    }
                }
            }
            /**攻击特效 */
            for (var i = 0; i < this._target.length; i++) {
                this.DoPlayEffect(this._delayTime, this._target[i]);
            }
            /**有人物模型的 */
            if (this._owner.avatar) {
                H52D_Framework.Tick.Once(200, this, function () {
                    _this.AttackOnComplete();
                });
            }
            else {
                this.AttackOnComplete();
            }
        };
        /**攻击回调 */
        SkillNone.prototype.AttackOnComplete = function () {
            this.DoHitEffect();
            this._bcomplete = true;
            if (this._callBack) {
                this._callBack.run();
            }
        };
        SkillNone.prototype.OnUpdate = function () {
        };
        /**近战技能特效 */
        SkillNone.prototype.DoPlayEffect = function (time, target) {
            var _this = this;
            H52D_Framework.Tick.Once(time, this, function () {
                _this.PlaySkillEffect(target);
            });
        };
        SkillNone.prototype.PlaySkillEffect = function (target) {
            if (this.CheckDestroy())
                return;
            var avatar = new H52D_Framework.Avatar(this._ViewRoot);
            if (this._skillData.special == 2) {
                this.MoveX(avatar, target);
            }
            else if (this._skillData.hitEnemyMode == 5) {
                this.FixedPosition(avatar, target);
            }
            else {
                this.CopyEffect(avatar, target);
            }
            if (this._avtarTab) {
                this._avtarTab.push(avatar);
            }
            avatar.SetOrder(this._owner.Order);
        };
        /**水平移动技能特效 */
        SkillNone.prototype.MoveX = function (avatar, target) {
            var _this = this;
            avatar.Load(this._path, this._dir, this._scla, 0, 0, Laya.Handler.create(this, function () {
                _this.SkillPoint(avatar, target);
                avatar.Play(_this._name, true, true, function () {
                });
                var moveX = _this._btype == 1 ? 1000 : -10;
                H52D_Framework.TweenList.to(_this, avatar, { PosX: moveX }, 1000, function () {
                    avatar.PosX = moveX;
                    avatar.Destroy();
                });
            }));
        };
        /**固定位置技能特效 */
        SkillNone.prototype.FixedPosition = function (avatar, target) {
            var _this = this;
            avatar.Load(this._path, this._dir, this._scla, 0, 0, Laya.Handler.create(this, function (avatars) {
                var point = !H52D_Framework.ObjIsEmpty(_this._skillData.point) ? [_this._skillData.point[1], _this._skillData.point[2]] : [0, 0];
                if (_this._btype == 1) {
                    avatars.PosX = 540 + point[0];
                    avatars.PosY = 730 + point[1];
                }
                else {
                    avatars.PosX = 190 - point[0];
                    avatars.PosY = 730 + point[1];
                }
                avatars.Play(_this._name, false, false, function () {
                    avatars.Destroy();
                });
            }));
        };
        /**默认技能特效 */
        SkillNone.prototype.CopyEffect = function (avatar, target) {
            var _this = this;
            avatar.Load(this._path, this._dir, this._scla, 0, 0, Laya.Handler.create(this, function () {
                _this.SkillPoint(avatar, target);
                avatar.Play(_this._name, false, true, function () {
                    avatar.Destroy();
                });
            }));
        };
        /**技能挂点 */
        SkillNone.prototype.SkillPoint = function (avatar, target) {
            if (!target)
                return;
            if (this._owner.avatar && this._belongs == eBELONGS_TO.ATTACK) {
                if (this._owner.avatar.Armature) {
                    var point = this._btype == 1 ? H52D_Framework.Pvp_Point_O[this._PointId - 1] : H52D_Framework.Pvp_Point_E[this._PointId - 1];
                    if (this._btype == 1 || this._belongs == eBELONGS_TO.ATTACK) {
                        avatar.PosX = this._owner.avatar.PosX + point[0];
                        avatar.PosY = this._owner.avatar.PosY + point[1];
                    }
                    else {
                        avatar.PosX = this._owner.avatar.PosX - point[0];
                        avatar.PosY = this._owner.avatar.PosY + point[1];
                    }
                }
            }
            else {
                var point = !H52D_Framework.ObjIsEmpty(this._skillData.point) ? [this._skillData.point[1], this._skillData.point[2]] : [0, 0];
                if (this._btype == 1 || this._belongs == eBELONGS_TO.ATTACK) {
                    avatar.PosX = target.PosX + point[0];
                    avatar.PosY = target.PosY + point[1];
                }
                else {
                    avatar.PosX = target.PosX - point[0];
                    avatar.PosY = target.PosY + point[1];
                }
            }
        };
        SkillNone.prototype.DoHitEffect = function () {
            if (!H52D_Framework.ObjIsEmpty(this._skillData.hitEffect)) {
                for (var i = 0; i < this._target.length; i++) {
                    if (this._target[i]) {
                        if (this._target[i].avatar) {
                            var h = 50 + Math.random() * 200; //this._target[i].avatar.height * 0.5;
                            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                                h = 50;
                            }
                            var newPos = new Laya.Point(this._target[i].PosX, this._target[i].PosY - h);
                            newPos.x += Math.random() * 40 - 20;
                            newPos.y += Math.random() * 40 - 20;
                            /**受伤特效 */
                            this.PlayHitEffect(newPos.x, newPos.y);
                        }
                    }
                }
            }
        };
        SkillNone.prototype.PlayHitEffect = function (x, y) {
            var _this = this;
            var hitAvatar = new H52D_Framework.Avatar(H52D_Framework.AvatarEffectRoot);
            hitAvatar.Load(this._hitPath, this._dir, this._hitScla, x, y, Laya.Handler.create(this, function (avatar) {
                if (_this._skillData.hitSound[1] != null) {
                    H52D_Framework.SoundManager.Instance.OnPlaySound(_this._skillData.hitSound[1]);
                }
                if (!avatar) {
                    return;
                }
                if (!avatar.Play) {
                    return;
                }
                avatar.Play(_this._hitName, false, true, function () {
                    avatar.Destroy();
                    avatar = null;
                    _this.isDie = true;
                });
                avatar.PosX = x;
                avatar.PosY = y;
            }));
            if (this._hitAvatarTab) {
                this._hitAvatarTab.push(hitAvatar);
            }
        };
        SkillNone.prototype.CheckDestroy = function () {
            if (!this._owner || H52D_Framework.GetTabLength(this._target) == 0) {
                this.HitTabDestroy();
                return true;
            }
            return false;
        };
        SkillNone.prototype.HitTabDestroy = function () {
            for (var k in this._hitAvatarTab) {
                if (this._hitAvatarTab[k]) {
                    if (this._hitAvatarTab[k].Armature) {
                        this._hitAvatarTab[k].visible = false;
                    }
                    this._hitAvatarTab[k].Destroy();
                    this._hitAvatarTab[k] = null;
                }
            }
            this._hitAvatarTab = [];
        };
        SkillNone.prototype.AvatarTabDestroy = function () {
            for (var k in this._avtarTab) {
                if (this._avtarTab[k]) {
                    if (this._avtarTab[k].Armature) {
                        this._avtarTab[k].visible = false;
                    }
                    this._avtarTab[k].Destroy();
                    this._avtarTab[k] = null;
                }
            }
            this._avtarTab = [];
        };
        SkillNone.prototype.Destroy = function () {
            this.AvatarTabDestroy();
            this.HitTabDestroy();
        };
        return SkillNone;
    }());
    H52D_Framework.SkillNone = SkillNone;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=SkillNone.js.map