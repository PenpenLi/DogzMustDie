/*
* 模型类;
*/
var H52D_Framework;
(function (H52D_Framework) {
    /**模型类 */
    var Avatar = /** @class */ (function () {
        function Avatar(viewRoot) {
            this._posx = 0;
            this._posy = 0;
            this._curAniName = "";
            this._shadow = null;
            this._factory = null;
            this._armature = null;
            /** 闪光亮度 */
            this._lightVal = 0;
            this._lighterFactory = null;
            this._lighterArmature = null;
            /** 是否在最底层 */
            this._Orlop = null;
            this.IsUse = false;
            /**大小 */
            this._scale = 1;
            /**移动速度 */
            this._speed = 100;
            /**方向 */
            this._direction = AvatarDirection.right;
            /**是否加载完成 */
            this._loaded = false;
            this._shadow = new Laya.Image();
            this._shadow.anchorX = 0.5;
            this._shadow.anchorY = 0.5;
            this.viewRoot = viewRoot;
        }
        Object.defineProperty(Avatar.prototype, "Armature", {
            get: function () {
                return this._armature;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Avatar.prototype, "width", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Avatar.prototype, "height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Avatar.prototype, "IsDestroyed", {
            /** 是否销毁 */
            get: function () {
                return this._armature == null || this._armature.destroyed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Avatar.prototype, "scale", {
            get: function () {
                return this._scale;
            },
            set: function (value) {
                if (this._armature == null || this._armature.destroyed)
                    return;
                this._scale = value;
                this._armature.scale(this._scale * this._direction, this._scale);
                if (this._lighterArmature) {
                    this._lighterArmature.scale(this._scale * this._direction, this._scale);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Avatar.prototype, "scale_y", {
            set: function (value) {
                if (this._armature == null || this._armature.destroyed)
                    return;
                this._armature.scale(this._scale * this._direction, value);
                if (this._lighterArmature) {
                    this._lighterArmature.scale(this._scale * this._direction, value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Avatar.prototype, "rotation", {
            set: function (value) {
                if (this._armature == null || this._armature.destroyed)
                    return;
                this._armature.rotation = value;
                if (this._lighterArmature) {
                    this._lighterArmature.rotation = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Avatar.prototype, "PosX", {
            get: function () {
                return this._posx;
            },
            /**x坐标 */
            set: function (value) {
                this._posx = value;
                if (this._armature) {
                    this._armature.x = this._posx;
                    if (this._lighterArmature) {
                        this._lighterArmature.x = this._posx;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Avatar.prototype, "PosY", {
            get: function () {
                return this._posy;
            },
            /**y坐标 */
            set: function (value) {
                this._posy = value;
                if (this._armature) {
                    this._armature.y = this._posy;
                    if (this._lighterArmature) {
                        this._lighterArmature.y = this._posy;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Avatar.prototype, "visible", {
            get: function () {
                return this._armature.visible;
            },
            /** 显示隐藏 */
            set: function (value) {
                if (this._armature) {
                    this._armature.visible = value;
                }
                if (this._lighterArmature) {
                    this._lighterArmature.visible = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Avatar.prototype, "speed", {
            get: function () {
                return this._speed;
            },
            set: function (value) {
                this._speed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Avatar.prototype, "direction", {
            get: function () {
                return this._direction;
            },
            set: function (value) {
                if (!this._armature || this._armature.destroyed)
                    return;
                this._direction = value;
                this._armature.scale(this._scale * this._direction, this._scale);
                if (this._lighterArmature) {
                    this._lighterArmature.scale(this._scale * this._direction, this._scale);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Avatar.prototype, "loaded", {
            get: function () {
                return this._loaded;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Avatar.prototype, "Path", {
            /** 获取路径 */
            get: function () {
                return this._path;
            },
            enumerable: true,
            configurable: true
        });
        /** 更新模型 */
        Avatar.prototype.UpdateAvatar = function (viewRoot, direction, scale, x, y, callBack, lightVal, bOrlop) {
            if (direction === void 0) { direction = 1; }
            if (scale === void 0) { scale = 1; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (lightVal === void 0) { lightVal = 0; }
            this.viewRoot = viewRoot;
            this._posx = x;
            this._posy = y;
            this._scale = scale;
            this._direction = direction;
            this._lightVal = lightVal;
            this._Orlop = bOrlop;
            this.LoadComplete(callBack);
        };
        /**
         * 加载模型
         * @param path 路径
         * @param direction 方向（右：1，左：-1）
         * @param scale 出生大小
         * @param x 出生点坐标x
         * @param y 出生点坐标y
         * @param callBack 回调函数
         * @param bUseLight 是否发光
         */
        Avatar.prototype.Load = function (path, direction, scale, x, y, callBack, lightVal, bOrlop) {
            var _this = this;
            if (direction === void 0) { direction = 1; }
            if (scale === void 0) { scale = 1; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (lightVal === void 0) { lightVal = 0; }
            if (H52D_Framework.StringIsEmpty(path)) {
                return;
            }
            if (path.indexOf(".sk") == -1) {
                H52D_Framework.Debugger.LogError(path + ":不是sk动画！");
                return;
            }
            if (this._loaded) {
                this.Destroy();
            }
            this._path = path;
            this._posx = x;
            this._posy = y;
            this._scale = scale;
            this._direction = direction;
            this._lightVal = lightVal;
            this._Orlop = bOrlop;
            //加载常规模型
            H52D_Framework.AvatarManager.Instance.GetFactoryTemplet(path, Laya.Handler.create(this, function (factory) {
                if (!factory.buildArmature)
                    return;
                _this._factory = factory;
                _this.LoadComplete(callBack);
            }));
        };
        /**
         * 加载完成
         * @param callBack 回调函数
         */
        Avatar.prototype.LoadComplete = function (callBack) {
            if (this._armature == null) {
                if (this._factory == null) {
                    return;
                }
                this._armature = this._factory.buildArmature(0);
                this._armature.name = this._path;
            }
            if (this.viewRoot) {
                if (this._Orlop) {
                    this.viewRoot.addChildAt(this._armature, 0);
                }
                else {
                    this.viewRoot.addChild(this._armature);
                }
                this._armature.visible = true;
            }
            this._armature.scale(this._scale * this._direction, this._scale);
            this._armature.x = this._posx;
            this._armature.y = this._posy;
            if (this._lightVal > 0) {
                this.LoadLighterAvatar(callBack);
            }
            else {
                if (this._lighterArmature != null) {
                    this._lighterArmature.visible = false;
                }
                H52D_Framework.Tick.Clear(this, this.LighterArmatureTimer);
                this._loaded = true;
                if (callBack) {
                    callBack.runWith(this);
                }
            }
        };
        /**加载发光模型 */
        Avatar.prototype.LoadLighterAvatar = function (callBack) {
            var _this = this;
            if (this._lighterFactory == null) {
                H52D_Framework.AvatarManager.Instance.GetFactoryTemplet(this._path, Laya.Handler.create(this, function (factory) {
                    if (!factory.buildArmature)
                        return;
                    _this._lighterFactory = factory;
                    _this.LighterComplete(callBack);
                }));
            }
            else {
                this.LighterComplete(callBack);
            }
        };
        /**加载完成 */
        Avatar.prototype.LighterComplete = function (callBack) {
            if (this._lighterArmature == null) {
                this._lighterArmature = this._factory.buildArmature(0);
            }
            if (this.viewRoot) {
                this.viewRoot.addChild(this._lighterArmature);
                this._lighterArmature.visible = true;
            }
            this._lighterArmature.scale(this._scale * this._direction, this._scale);
            this._lighterArmature.x = this._posx;
            this._lighterArmature.y = this._posy;
            this._lighterArmature.blendMode = "lighter";
            H52D_Framework.Tick.FrameLoop(1, this, this.LighterArmatureTimer);
            this._loaded = true;
            if (callBack) {
                callBack.runWith(this);
            }
        };
        /** 散光 */
        Avatar.prototype.LighterArmatureTimer = function () {
            var value = Math.abs(Math.sin(H52D_Framework.Time.time / 1000)) * 0.5;
            this._lighterArmature.alpha = value * this._lightVal;
        };
        /**
         * 加载阴影
         *
         **/
        Avatar.prototype.Shadow = function (scale, bMonster) {
            if (bMonster === void 0) { bMonster = false; }
            if (!this.viewRoot)
                return;
            H52D_Framework.Tick.FrameLoop(1, this, this.FrameLoopShadow, [scale, bMonster]);
        };
        Avatar.prototype.FrameLoopShadow = function (scale, bMonster) {
            if (!this._armature || this._armature.destroyed)
                return;
            var ret = this._armature.getBounds();
            if (ret.width > 0 || ret.height > 0) {
                this._width = ret.width;
                this._height = ret.height;
                this._shadow.skin = "ui_common/img-yingzi.png";
                this._shadow.scale(scale, scale);
                if (bMonster) {
                    this._shadow.pos(this._posx, this._posy);
                }
                else {
                    this._shadow.pos(ret.x + ret.width * 0.5, ret.y + ret.height - 5);
                }
                this.viewRoot.addChildAt(this._shadow, 0);
                this._shadow.visible = true;
                H52D_Framework.Tick.Clear(this, this.FrameLoopShadow);
                return;
            }
        };
        /**设置层级顺序 */
        Avatar.prototype.SetOrder = function (order) {
            if (this._armature) {
                this._armature.zOrder = order;
                this._armature.updateZOrder();
            }
            if (this._lighterArmature) {
                this._lighterArmature.zOrder = order;
                this._lighterArmature.updateZOrder();
            }
        };
        /**获取骨骼点位置信息 */
        Avatar.prototype.GetBoneTransform = function (boneName) {
            var ret = new Laya.Point();
            var arr = this._factory.mBoneArr;
            if (arr) {
                var bone = this._factory.boneSlotDic[boneName];
                if (bone) {
                    var tran = bone.currDisplayData.transform;
                    ret.x = tran.x;
                    ret.y = tran.y;
                }
            }
            return ret;
        };
        /**
         * 播放一次，播放后隐藏
         */
        Avatar.prototype.PlayOnce = function (nameOrIndex) {
            var _this = this;
            if (nameOrIndex === void 0) { nameOrIndex = null; }
            if (!nameOrIndex) {
                var start = this._path.lastIndexOf("/") + 1;
                var end = this._path.indexOf(".sk");
                nameOrIndex = this._path.substring(start, end);
            }
            if (this.Armature) {
                this.Armature.visible = true;
                this.Play(nameOrIndex, false, true, function () {
                    _this.Armature.visible = false;
                });
            }
        };
        /**
         * 播放动画
         * @param nameOrIndex 动画名字或者索引,默认动画名称
         * @param loop 是否循环播放
         * @param force false,如果要播的动画跟上一个相同就不生效,true,强制生效
         * @param callBack 播放完成回调
         * @param ones 只播放第一帧
         */
        Avatar.prototype.Play = function (nameOrIndex, loop, force, callBack, ones) {
            var _this = this;
            if (nameOrIndex === void 0) { nameOrIndex = null; }
            if (loop === void 0) { loop = true; }
            if (force === void 0) { force = true; }
            if (!this._armature || this._armature.destroyed)
                return;
            // 强制播放  因为有现在有缓存池
            force = true;
            if (!nameOrIndex) {
                var start = this._path.lastIndexOf("/") + 1;
                var end = this._path.indexOf(".sk");
                nameOrIndex = this._path.substring(start, end);
            }
            //只播放第一帧
            if (ones) {
                this._armature.play(nameOrIndex, loop, force, 1, 1);
                if (this._lighterArmature) {
                    this._lighterArmature.play(nameOrIndex, loop, force, 1, 1);
                }
                return;
            }
            //如果是hit动作则不从头播放直接播放后半部分动画
            if (nameOrIndex == this._curAniName && nameOrIndex == AnimationName.hit) {
                var index = this._armature["_currAniIndex"];
                var duration = this._factory.getAniDuration(index);
                this._armature.play(nameOrIndex, loop, force, duration / 2);
                if (this._lighterArmature) {
                    this._lighterArmature.play(nameOrIndex, loop, force, duration / 2);
                }
            }
            else {
                this._armature.play(nameOrIndex, loop, force);
                if (this._lighterArmature) {
                    this._lighterArmature.play(nameOrIndex, loop, force);
                }
            }
            this._curAniName = nameOrIndex;
            //动画播放完成
            this._armature.offAll();
            this._armature.on(Laya.Event.STOPPED, this, function () {
                if (callBack != null) {
                    callBack();
                }
                if (_this._armature) {
                    _this._armature.offAll();
                }
            });
            if (this._lighterArmature) {
                this._lighterArmature.offAll();
                this._lighterArmature.on(Laya.Event.STOPPED, this, function () {
                    if (_this._lighterArmature) {
                        _this._lighterArmature.offAll();
                    }
                });
            }
        };
        /**获取动画时间 */
        Avatar.prototype.GetAniDuration = function () {
            if (!this._armature || !this._factory)
                return;
            var index = this._armature["_currAniIndex"];
            var duration = this._factory.getAniDuration(index);
            return duration;
        };
        /**停止播放动画 */
        Avatar.prototype.Stop = function () {
            this._armature.stop();
            this._armature.offAll();
            if (this._lighterArmature) {
                this._lighterArmature.stop();
                this._lighterArmature.offAll();
            }
        };
        Avatar.prototype.Rotate = function (value) {
            if (!this._armature || this._armature.destroyed)
                return;
            this._armature.rotation = value;
            if (this._lighterArmature) {
                this._lighterArmature.rotation = value;
            }
        };
        Avatar.prototype.Destroy = function () {
            H52D_Framework.Tick.ClearAll(this);
            if (this._shadow) {
                this._shadow.destroy(true);
                this._shadow = null;
            }
            if (this._armature) {
                this._armature.offAll();
                this._armature.destroy(true);
                this._armature = null;
            }
            if (this._lighterArmature) {
                this._lighterArmature.offAll();
                this._lighterArmature.destroy(true);
                this._lighterArmature = null;
            }
            this._loaded = false;
        };
        Avatar.instMsg = new H52D_Framework.InstMsg();
        return Avatar;
    }());
    H52D_Framework.Avatar = Avatar;
    /**动画名称类 */
    var AnimationName = /** @class */ (function () {
        function AnimationName() {
        }
        /**待机动作 */
        AnimationName.idle = "idle";
        /**受伤（被击）动作 */
        AnimationName.hit = "hit";
        /**攻击动作 */
        AnimationName.attack = "attack";
        /**死亡动作 */
        AnimationName.die = "dead";
        return AnimationName;
    }());
    H52D_Framework.AnimationName = AnimationName;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Avatar.js.map