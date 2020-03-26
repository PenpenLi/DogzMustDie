/** 掉落宝箱类 */
module H52D_Framework {
    // 宝箱状态
    enum DropBoxState {
        down = 0,        // 下落
        stop = 1,        // 静止
    };
    // 宝箱飞回的贝塞尔方向
    enum DropBoxFlyDir {
        left = 0,
        right = 1,
    }
    export class DropBox {
        private _nbox: Object;              // 宝箱物品
        private _callBack: Function;        // 完成回调
        private _coinImage: Laya.Image;     // 金币图片
        private _ImgH: number;              // 图片高度
        private _eState: DropBoxState;     // 金币状态
        private _PosX: number;              // 金币位置
        private _PosY: number;
        private _SpeedX: number;            // 金币速度
        private _SpeedY: number;
        private _AccSpdY: number = 1800;     // 重力加速度
        private _stopTime: number;           // 计算禁止时间
        ////////////////////////////////////////////////////////
        // 飞回需要的参数
        private _FlySpdY: number = 600;     // 飞回的速度（向上的垂直方向）
        private _FlybackTime: number;        // 飞回时间
        private _FlyDir: DropBoxFlyDir;     // 金币飞回的贝塞尔方向
        private _FlyRandA: number;           // 随机贝塞尔幅度
        private _FlyBesarXSpeed: number;     // 贝塞尔横向偏移速度
        private _FlyBesarX: number;          // 贝塞尔横向偏移量
        ////////////////////////////////////////////////////////

        /** 创建金币
        * @param nX 位置
        * @param nY 位置
        * @param nid  金币卸载量
        * @param callback 金币消失回调
        */
        public constructor(nX: number, nY: number, nbox: Object, callback?: Function) {
            // 初始化状态
            this._nbox = nbox;
            this._callBack = callback;
            this._eState = DropBoxState.down;

            this._coinImage = new Laya.Image();
            this._coinImage.skin = "ui_common/icon_baoxiang.png";
            this._coinImage.scaleX = this._coinImage.scaleY = 1;
            this._ImgH = this._coinImage.displayHeight;
            this._coinImage.on(Laya.Event.CLICK, this, this.OnClick);

            // 居中显示
            this._coinImage.x = this._PosX = nX - this._coinImage.displayWidth * 0.5 >> 0;
            this._coinImage.y = this._PosY = nY - this._coinImage.displayHeight * 0.5 >> 0;
            Event.DispatchEvent(EventDefine.DROP_ADD_CHILD, [this._coinImage]);

            // 初始化初速度
            this._SpeedX = (Math.random() - 0.5) * 200;
            this._SpeedY = -Math.random() * 500;

            if (this._SpeedX > 0) {
                this._FlyDir = DropBoxFlyDir.right;
            } else {
                this._FlyDir = DropBoxFlyDir.left;
            }
            SoundManager.Instance.OnPlaySound("res/sound/drop_baoxiang.mp3");
            Tick.FrameLoop(1, this, this.Update);
        }

        private OnClick() {
            // 鼠标点击即飞回
            if (this._eState == DropBoxState.stop) {
                DropManager.Instance.DeleteBox(this);
                TipsLogic.Instance.OpenGoodsProTips(this._nbox)
            }
        }

        public IsCanFlyback() {
            return (this._eState == DropBoxState.stop);
        }
        public GetPosX() {
            return this._PosX;
        }
        public GetPosY() {
            return this._PosY;
        }

        public Update(): void {
            // 下落
            if (this._eState == DropBoxState.down) {
                let t = Time.deltaTime / 1000;
                // s = v * t
                let s_x: number = this._SpeedX * t;
                // s = v * t + a * t^2 * 0.5
                let s_y: number = this._SpeedY * t + this._AccSpdY * t * t * 0.5;

                // v = v + a * t
                this._SpeedY = this._SpeedY + this._AccSpdY * t;

                this._coinImage.x = this._PosX = this._PosX + s_x;
                this._coinImage.y = this._PosY = this._PosY + s_y;

                // 落到地上了
                if (this._PosY + this._ImgH > FloorHeight()) {
                    this._coinImage.y = this._PosY = FloorHeight() - this._ImgH;

                    // 反弹，如果速度不够，就切换成静止状态
                    this._SpeedY = -this._SpeedY * 0.25;
                    this._SpeedX = this._SpeedX * 0.5;
                    if (this._SpeedY > -10) {
                        this._SpeedY = 0;
                        this._stopTime = 0;
                        this._eState = DropBoxState.stop;
                    }
                }
            }
            // 停止状态
            else if (this._eState == DropBoxState.stop) {
                this._stopTime += Time.deltaTime;
                if (BattleManager.Instance.bStopBattle) {
                    this._stopTime = 0;
                }
                if (DropManager.Instance.openBox && this._stopTime > 2000) {
                    // 时间到了，要飞回
                    DropManager.Instance.DeleteBox(this);
                    TipsLogic.Instance.OpenGoodsProTips(this._nbox)
                }
            }
        }

        public Destroy() {
            this._coinImage.offAll();
            Tick.ClearAll(this);
            if (this._coinImage) {
                this._coinImage.destroy(true);
                this._coinImage = null;
            }
        }
    }
}