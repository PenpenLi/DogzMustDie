var H52D_Framework;
(function (H52D_Framework) {
    /**PVP数据管理 */
    var PSkillNone = /** @class */ (function () {
        function PSkillNone(owner, data, view, btype, to) {
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
            this._dir = btype;
            this._ViewRoot = view;
            this._avtarTab = [];
            this._hitAvatarTab = [];
            this._btype = btype;
            this._belongs = to;
        }
        Object.defineProperty(PSkillNone.prototype, "BComplete", {
            get: function () { return this._bcomplete; },
            set: function (value) { this._bcomplete = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PSkillNone.prototype, "_path", {
            /**特效路径 */
            get: function () { return this._skillData.actionEffect[3]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PSkillNone.prototype, "_scla", {
            /**特效大小 */
            get: function () { return this._skillData.actionEffect[5]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PSkillNone.prototype, "_PointId", {
            /**特效挂点ID */
            get: function () { return this._skillData.actionEffect[1]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PSkillNone.prototype, "_delayTime", {
            /**延迟时间 */
            get: function () { return this._skillData.actionEffect[2]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PSkillNone.prototype, "_name", {
            /**特效动画名字 */
            get: function () { return this._skillData.actionEffect[4]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PSkillNone.prototype, "_hitPath", {
            /**被击特效路径 */
            get: function () { return this._skillData.hitEffect[1]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PSkillNone.prototype, "_hitName", {
            /**被击特效动画名 */
            get: function () { return this._skillData.hitEffect[2]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PSkillNone.prototype, "_hitScla", {
            /**被击特效大小 */
            get: function () { return this._skillData.hitEffect[3]; },
            enumerable: true,
            configurable: true
        });
        /**释放技能 */
        PSkillNone.prototype.SpellSkill = function (target) {
            var _this = this;
            this._avtarTab = [];
            this._hitAvatarTab = [];
            this._target = [];
            this._bcomplete = false;
            /**设置目标 */
            this.SetTarget(target);
            /**攻击特效 */
            for (var k in this._target) {
                this.DoPlayEffect(this._delayTime, this._target[k]);
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
        /**设置目标 */
        PSkillNone.prototype.SetTarget = function (target) {
            if (this._skillData.special == 1) {
                this._target = target.concat();
            }
            else {
                var Length = H52D_Framework.GetTabLength(target);
                var index = 0;
                if (Length == 1) {
                    for (var k in target) {
                        if (target[k]) {
                            this._target.push(target[k]);
                        }
                    }
                }
                else {
                    for (var k in target) {
                        if (target[k]) {
                            index += 1;
                            if (index == 2) {
                                this._target.push(target[k]);
                            }
                        }
                    }
                }
            }
        };
        /**攻击回调 */
        PSkillNone.prototype.AttackOnComplete = function () {
            this.DoHitEffect();
            this._bcomplete = true;
            if (this._callBack) {
                this._callBack.run();
            }
        };
        /**播放技能特效 */
        PSkillNone.prototype.DoPlayEffect = function (time, target) {
            var _this = this;
            H52D_Framework.Tick.Once(time, this, function () {
                _this.PlaySkillEffect(target);
            });
        };
        PSkillNone.prototype.PlaySkillEffect = function (target) {
            if (this.CheckDestroy())
                return;
            if (this._btype == 1 && this._belongs == eBELONGS_TO.BIG) {
                var x = 0;
            }
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
        PSkillNone.prototype.MoveX = function (avatar, target) {
            var _this = this;
            avatar.Load(this._path, this._dir, this._scla, 0, 0, Laya.Handler.create(this, function (avatars) {
                _this.SetPoint(avatars, target);
                avatars.Play(_this._name, true, false, function () {
                });
                var moveX = _this._btype == 1 ? 1000 : -10;
                H52D_Framework.TweenList.to(_this, avatars, { PosX: moveX }, 1000, function () {
                    avatars.PosX = moveX;
                    avatars.Destroy();
                });
            }));
        };
        /**固定位置技能特效 */
        PSkillNone.prototype.FixedPosition = function (avatar, target) {
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
        PSkillNone.prototype.CopyEffect = function (avatar, target) {
            var _this = this;
            avatar.Load(this._path, this._dir, this._scla, 0, 0, Laya.Handler.create(this, function (avatars) {
                _this.SetPoint(avatars, target);
                avatars.Play(_this._name, false, false, function () {
                    avatars.Destroy();
                });
            }));
        };
        /**设置技能挂点 */
        PSkillNone.prototype.SetPoint = function (avatar, target) {
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
        /**产生被击特效 */
        PSkillNone.prototype.DoHitEffect = function () {
            if (!H52D_Framework.ObjIsEmpty(this._skillData.hitEffect)) {
                for (var k in this._target) {
                    if (this._target[k]) {
                        if (this._target[k].avatar) {
                            var h = 10 + Math.random() * 50;
                            var PosX = this._target[k].PosX;
                            var PosY = this._target[k].PosY - h;
                            /**受伤特效 */
                            this.PlayHitEffect(PosX, PosY);
                        }
                    }
                }
            }
        };
        /**播放被击特效 */
        PSkillNone.prototype.PlayHitEffect = function (x, y) {
            var _this = this;
            var hitAvatar = new H52D_Framework.Avatar(H52D_Framework.AvatarEffectRoot);
            hitAvatar.Load(this._hitPath, this._dir, this._hitScla, x, y, Laya.Handler.create(this, function (hitAvatars) {
                H52D_Framework.SoundManager.Instance.OnPlaySound(_this._skillData.hitSound[1]);
                hitAvatars.Play(_this._hitName, false, false, function () {
                    hitAvatars.Destroy();
                    hitAvatars = null;
                    _this.isDie = true;
                });
                hitAvatars.PosX = x;
                hitAvatars.PosY = y;
            }));
            if (this._hitAvatarTab) {
                this._hitAvatarTab.push(hitAvatar);
            }
        };
        /**检查销毁 */
        PSkillNone.prototype.CheckDestroy = function () {
            if (!this._owner || H52D_Framework.GetTabLength(this._target) == 0) {
                this.HitTabDestroy();
                return true;
            }
            return false;
        };
        /**被击特效销毁 */
        PSkillNone.prototype.HitTabDestroy = function () {
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
        /**技能特效销毁 */
        PSkillNone.prototype.AvatarTabDestroy = function () {
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
        /**销毁 */
        PSkillNone.prototype.Destroy = function () {
            this.AvatarTabDestroy();
            this.HitTabDestroy();
        };
        /**清理 */
        PSkillNone.prototype.Clear = function () {
            this._target = [];
            this._owner = [];
            this._Data = [];
        };
        return PSkillNone;
    }());
    H52D_Framework.PSkillNone = PSkillNone;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PSkillNone.js.map