/*
* 模型类;
*/
module H52D_Framework {
    /**模型类 */
    export class Avatar {
        private static instMsg: InstMsg = new InstMsg()
        private viewRoot: Laya.Box;
        private _path: string;
        private _posx: number = 0;
        private _posy: number = 0;
        private _curAniName: string = "";
        private _shadow: Laya.Image = null;
        private _width: number;
        private _height: number;

        private _factory: Laya.Templet = null;
        private _armature: Laya.Skeleton = null;

        /** 闪光亮度 */
        private _lightVal: number = 0
        private _lighterFactory: Laya.Templet = null;
        private _lighterArmature: Laya.Skeleton = null;

        /** 是否在最底层 */
        private _Orlop = null

        public IsUse = false

        public get Armature() {
            return this._armature;
        }

        constructor(viewRoot: Laya.Box) {
            this._shadow = new Laya.Image();
            this._shadow.anchorX = 0.5;
            this._shadow.anchorY = 0.5;
            this.viewRoot = viewRoot;
        }

        public get width(): number {
            return this._width;
        }

        public get height(): number {
            return this._height;
        }

        /** 是否销毁 */
        public get IsDestroyed() {
            return this._armature == null || this._armature.destroyed
        }

        /**大小 */
        private _scale: number = 1;
        public set scale(value: number) {
            if (this._armature == null || this._armature.destroyed) return;
            this._scale = value;
            this._armature.scale(this._scale * this._direction, this._scale);
            if (this._lighterArmature) {
                this._lighterArmature.scale(this._scale * this._direction, this._scale);
            }
        }

        public set scale_y(value: number) {
            if (this._armature == null || this._armature.destroyed) return;
            this._armature.scale(this._scale * this._direction, value);
            if (this._lighterArmature) {
                this._lighterArmature.scale(this._scale * this._direction, value);
            }
        }

        public get scale(): number {
            return this._scale;
        }

        public set rotation(value: number) {
            if (this._armature == null || this._armature.destroyed) return;
            this._armature.rotation = value;
            if (this._lighterArmature) {
                this._lighterArmature.rotation = value;
            }
        }

        /**x坐标 */
        public set PosX(value: number) {
            this._posx = value;
            if (this._armature) {
                this._armature.x = this._posx;
                if (this._lighterArmature) {
                    this._lighterArmature.x = this._posx;
                }
            }
        }

        public get PosX(): number {
            return this._posx;
        }

        /**y坐标 */
        public set PosY(value: number) {
            this._posy = value;
            if (this._armature) {
                this._armature.y = this._posy;
                if (this._lighterArmature) {
                    this._lighterArmature.y = this._posy;
                }
            }
        }

        public get PosY(): number {
            return this._posy;
        }

        /** 显示隐藏 */
        public set visible(value: boolean) {
            if (this._armature) {
                this._armature.visible = value;
            }
            if (this._lighterArmature) {
                this._lighterArmature.visible = value;
            }
        }

        public get visible(): boolean {
            return this._armature.visible;
        }

        /**移动速度 */
        private _speed: number = 100;
        public set speed(value: number) {
            this._speed = value;
        }

        public get speed(): number {
            return this._speed;
        }

        /**方向 */
        private _direction: AvatarDirection = AvatarDirection.right;
        public set direction(value: AvatarDirection) {
            if (!this._armature || this._armature.destroyed) return;
            this._direction = value;
            this._armature.scale(this._scale * this._direction, this._scale);
            if (this._lighterArmature) {
                this._lighterArmature.scale(this._scale * this._direction, this._scale);
            }
        }

        public get direction(): AvatarDirection {
            return this._direction;
        }

        /**是否加载完成 */
        private _loaded: boolean = false;
        public get loaded(): boolean {
            return this._loaded;
        }

        /** 获取路径 */
        public get Path(): string {
            return this._path
        }

        /** 更新模型 */
        public UpdateAvatar(viewRoot: Laya.Box, direction: AvatarDirection = 1, scale: number = 1, x: number = 0, y: number = 0, callBack?: Laya.Handler, lightVal: number = 0, bOrlop?: boolean) {
            this.viewRoot = viewRoot
            this._posx = x;
            this._posy = y;
            this._scale = scale;
            this._direction = direction;
            this._lightVal = lightVal
            this._Orlop = bOrlop
            this.LoadComplete(callBack)
        }

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
        public Load(path: string, direction: AvatarDirection = 1, scale: number = 1, x: number = 0, y: number = 0, callBack?: Laya.Handler, lightVal: number = 0, bOrlop?: boolean) {
            if (StringIsEmpty(path)) {
                return;
            }
            if (path.indexOf(".sk") == -1) {
                Debugger.LogError(path + ":不是sk动画！");
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
            this._lightVal = lightVal
            this._Orlop = bOrlop
            //加载常规模型
            AvatarManager.Instance.GetFactoryTemplet(path, Laya.Handler.create(this, (factory) => {
                if (!factory.buildArmature) return;
                this._factory = factory
                this.LoadComplete(callBack);
            }));
        }

        /**
         * 加载完成
         * @param callBack 回调函数
         */
        private LoadComplete(callBack: Laya.Handler) {
            if (this._armature == null) {
                if (this._factory == null) {
                    return;
                }
                this._armature = this._factory.buildArmature(0);
                this._armature.name = this._path;
            }
            if (this.viewRoot) {
                if (this._Orlop) {
                    this.viewRoot.addChildAt(this._armature, 0)
                }
                else {
                    this.viewRoot.addChild(this._armature);
                }
                this._armature.visible = true
            }
            this._armature.scale(this._scale * this._direction, this._scale);
            this._armature.x = this._posx;
            this._armature.y = this._posy;

            if (this._lightVal > 0) {
                this.LoadLighterAvatar(callBack);
            }
            else {
                if (this._lighterArmature != null) {
                    this._lighterArmature.visible = false
                }
                Tick.Clear(this, this.LighterArmatureTimer)
                this._loaded = true;
                if (callBack) {
                    callBack.runWith(this)
                }
            }
        }

        /**加载发光模型 */
        private LoadLighterAvatar(callBack: Laya.Handler) {
            if (this._lighterFactory == null) {
                AvatarManager.Instance.GetFactoryTemplet(this._path, Laya.Handler.create(this, (factory) => {
                    if (!factory.buildArmature) return;
                    this._lighterFactory = factory
                    this.LighterComplete(callBack);
                }));
            }
            else {
                this.LighterComplete(callBack)
            }
        }

        /**加载完成 */
        private LighterComplete(callBack: Laya.Handler) {
            if (this._lighterArmature == null) {
                this._lighterArmature = this._factory.buildArmature(0);
            }
            if (this.viewRoot) {
                this.viewRoot.addChild(this._lighterArmature);
                this._lighterArmature.visible = true
            }
            this._lighterArmature.scale(this._scale * this._direction, this._scale);
            this._lighterArmature.x = this._posx;
            this._lighterArmature.y = this._posy;
            this._lighterArmature.blendMode = "lighter";
            Tick.FrameLoop(1, this, this.LighterArmatureTimer);
            this._loaded = true;
            if (callBack) {
                callBack.runWith(this)
            }
        }

        /** 散光 */
        private LighterArmatureTimer() {
            let value = Math.abs(Math.sin(Time.time / 1000)) * 0.5;
            this._lighterArmature.alpha = value * this._lightVal;
        }

        /**
         * 加载阴影
         *
         **/
        public Shadow(scale: number, bMonster: boolean = false): void {
            if (!this.viewRoot) return;
            Tick.FrameLoop(1, this, this.FrameLoopShadow, [scale, bMonster]);
        }

        private FrameLoopShadow(scale, bMonster) {
            if (!this._armature || this._armature.destroyed) return;
            let ret = this._armature.getBounds();
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
                this._shadow.visible = true
                Tick.Clear(this, this.FrameLoopShadow);
                return;
            }
        }

        /**设置层级顺序 */
        public SetOrder(order: number): void {
            if (this._armature) {
                this._armature.zOrder = order;
                this._armature.updateZOrder();
            }
            if (this._lighterArmature) {
                this._lighterArmature.zOrder = order;
                this._lighterArmature.updateZOrder();
            }
        }

        /**获取骨骼点位置信息 */
        public GetBoneTransform(boneName: string): Laya.Point {
            let ret = new Laya.Point();
            let arr = this._factory.mBoneArr;
            if (arr) {
                let bone = this._factory.boneSlotDic[boneName] as Laya.BoneSlot;
                if (bone) {
                    let tran = bone.currDisplayData.transform;
                    ret.x = tran.x;
                    ret.y = tran.y;
                }
            }
            return ret;
        }

        /**
         * 播放一次，播放后隐藏
         */
        public PlayOnce(nameOrIndex: any = null): void {
            if (!nameOrIndex) {
                let start: number = this._path.lastIndexOf("/") + 1;
                let end: number = this._path.indexOf(".sk");
                nameOrIndex = this._path.substring(start, end);
            }
            if (this.Armature) {
                this.Armature.visible = true;
                this.Play(nameOrIndex, false, true, () => {
                    this.Armature.visible = false;
                });
            }
        }

        /**
         * 播放动画
         * @param nameOrIndex 动画名字或者索引,默认动画名称
         * @param loop 是否循环播放
         * @param force false,如果要播的动画跟上一个相同就不生效,true,强制生效
         * @param callBack 播放完成回调
         * @param ones 只播放第一帧
         */
        public Play(nameOrIndex: any = null, loop: boolean = true, force: boolean = true, callBack?: Function, ones?: boolean) {
            if (!this._armature || this._armature.destroyed) return;
            // 强制播放  因为有现在有缓存池
            force = true
            if (!nameOrIndex) {
                let start: number = this._path.lastIndexOf("/") + 1;
                let end: number = this._path.indexOf(".sk");
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
                let index = this._armature["_currAniIndex"];
                let duration = this._factory.getAniDuration(index);
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
            this._armature.on(Laya.Event.STOPPED, this, () => {
                if (callBack != null) {
                    callBack();
                }
                if (this._armature) {
                    this._armature.offAll();
                }
            });
            if (this._lighterArmature) {
                this._lighterArmature.offAll();
                this._lighterArmature.on(Laya.Event.STOPPED, this, () => {
                    if (this._lighterArmature) {
                        this._lighterArmature.offAll();
                    }
                });
            }
        }

        /**获取动画时间 */
        public GetAniDuration(): number {
            if (!this._armature || !this._factory) return;
            let index = this._armature["_currAniIndex"];
            let duration: number = this._factory.getAniDuration(index);
            return duration;
        }

        /**停止播放动画 */
        public Stop() {
            this._armature.stop();
            this._armature.offAll();
            if (this._lighterArmature) {
                this._lighterArmature.stop();
                this._lighterArmature.offAll();
            }
        }

        public Rotate(value: number): void {
            if (!this._armature || this._armature.destroyed) return;
            this._armature.rotation = value;
            if (this._lighterArmature) {
                this._lighterArmature.rotation = value;
            }
        }

        public Destroy() {
            Tick.ClearAll(this);
            if (this._shadow) {
                this._shadow.destroy(true);
                this._shadow = null;
            }
            if (this._armature) {
                this._armature.offAll();
                this._armature.destroy(true)
                this._armature = null;
            }
            if (this._lighterArmature) {
                this._lighterArmature.offAll();
                this._lighterArmature.destroy(true)
                this._lighterArmature = null;
            }
            this._loaded = false;
        }
    }

    /**动画名称类 */
    export class AnimationName {
        /**待机动作 */
        public static idle: string = "idle";
        /**受伤（被击）动作 */
        public static hit: string = "hit";
        /**攻击动作 */
        public static attack: string = "attack";
        /**死亡动作 */
        public static die: string = "dead";
    }
}