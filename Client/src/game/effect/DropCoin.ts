/** 掉落金币类 */
module H52D_Framework {

    // 金币状态
    enum DropCoinState {
        none = -1,       // 无效状态
        down = 0,        // 下落
        stop = 1,        // 静止
        flyback = 2,     // 飞回
    };

    // 金币飞回的贝塞尔方向
    enum DropCoinFlyDir {
        left = 0,
        right = 1,
    }

    export class DropCoin {

        /** 金币停留时间 */
        private readonly RESIDENCE: number = 8000;

        private _nMoney: number;            // 金币含量

        private _coinImage: Laya.Image;     // 金币图片
        private _ImgH: number;              // 图片高度

        private _eState: DropCoinState;     // 金币状态

        private _PosX: number;              // 金币位置
        private _PosY: number;

        private _SpeedX: number;            // 金币速度
        private _SpeedY: number;

        private _AccSpdY: number = 1800;    // 重力加速度

        private _stopTime: number;          // 计算禁止时间
        private _floor: number;             // 地板高度

        // 飞回需要的参数
        private _FlySpdY: number;           // 飞回的速度（向上的垂直方向）
        private _FlybackTime: number;       // 飞回时间
        private _FlyDir: DropCoinFlyDir;     // 金币飞回的贝塞尔方向
        private _FlyRandA: number;          // 随机贝塞尔幅度
        private _FlyBesarXSpeed: number;    // 贝塞尔横向偏移速度
        private _FlyBesarX: number;         // 贝塞尔横向偏移量


        /** 创建金币
        * @param nX 位置
        * @param nY 位置
        * @param nMoney  金币卸载量
        * @param callback 金币消失回调
        */
        constructor(nX: number, nY: number, nMoney: number, speed_x: number) {
            // 初始化状态
            this._nMoney = nMoney;
            this._eState = DropCoinState.down;

            this._coinImage = new Laya.Image();
            this._coinImage.skin = "ui_common/icon-jinbi.png";
            this._coinImage.anchorX = this._coinImage.anchorY = 0.5;
            this._coinImage.scaleX = this._coinImage.scaleY = 0.6;
            this._ImgH = this._coinImage.displayHeight;
            // 居中显示
            this._coinImage.x = this._PosX = nX;
            this._coinImage.y = this._PosY = nY;
            Event.DispatchEvent(EventDefine.DROP_ADD_CHILD, [this._coinImage]);

            // 初始化初速度
            this._SpeedX = (Math.random() - 0.5) * speed_x;
            this._SpeedY = -Math.random() * 1000;
            //飞回的速度
            this._FlySpdY = 400 + (300 * Math.random() >> 0);

            if (this._SpeedX > 0) {
                this._FlyDir = DropCoinFlyDir.right;
            } else {
                this._FlyDir = DropCoinFlyDir.left;
            }
            // 落到地上了
            this._floor = FloorHeight();
            Tick.FrameLoop(1, this, this.Update);
        }

        private OnClick() {
            // 鼠标点击即飞回
            if (this._eState == DropCoinState.stop) {
                if (!BattleManager.Instance.bStopBattle) {
                    SoundManager.Instance.OnPlaySound("res/sound/gold_sound.mp3");
                }
                this.BeginFlyBack();
                // 让周围的金币也飞回
                DropManager.Instance.SearchCoinFlyback(this._PosX, this._PosY);
            }
        }

        public IsCanFlyback() {
            return (this._eState == DropCoinState.stop);
        }
        public GetPosX() {
            return this._PosX;
        }
        public GetPosY() {
            return this._PosY;
        }

        public Update(): void {
            // 下落
            if (this._eState == DropCoinState.down) {
                let t = Time.deltaTime / 1000;
                // s = v * t
                let s_x: number = this._SpeedX * t;
                // s = v * t + a * t^2 * 0.5
                let s_y: number = this._SpeedY * t + this._AccSpdY * t * t * 0.5;

                // v = v + a * t
                this._SpeedY = this._SpeedY + this._AccSpdY * t;

                this._coinImage.x = this._PosX = this._PosX + s_x;
                this._coinImage.y = this._PosY = this._PosY + s_y;
                this._coinImage.rotation += this._SpeedX * 0.1;
                
                if (this._PosY + this._ImgH > this._floor) {
                    this._coinImage.y = this._PosY = this._floor - this._ImgH;

                    // 反弹，如果速度不够，就切换成静止状态
                    this._SpeedY = -this._SpeedY * 0.25;
                    this._SpeedX = this._SpeedX * 0.5;
                    if (this._SpeedY > -10) {
                        this._SpeedY = 0;
                        this._stopTime = 0;
                        this._eState = DropCoinState.stop;
                    }
                    if (!BattleManager.Instance.bStopBattle) {
                        SoundManager.Instance.OnPlaySound("res/sound/gold_sound.mp3");
                    }
                }
            }
            // 停止状态
            else if (this._eState == DropCoinState.stop) {
                this._stopTime += Time.deltaTime;
                if (this._stopTime > this.RESIDENCE) {   // 时间到了，要飞回
                    this.BeginFlyBack();
                }
            }
            // 飞回，简化模拟一阶贝塞尔曲线
            else if (this._eState == DropCoinState.flyback) {
                let t = Time.deltaTime / 1000;

                this._FlybackTime = this._FlybackTime - t;
                if (this._FlybackTime < 0) {
                    // 完成回调
                    this.Complete();
                    // 删除
                    DropManager.Instance.DeleteCoin(this);
                }
                else {
                    // 向上移动
                    let s_y = this._FlySpdY * t;
                    // 水平移动
                    let s_x = this._SpeedX * t;
                    // 贝塞尔偏移
                    // f(x) = a * sin( sqrt( x ) )     ( 0 < x < PI/b )
                    let b: number = 1;
                    this._FlyBesarX = this._FlyBesarX + this._FlyBesarXSpeed * t;

                    this._PosX = this._PosX - s_x;
                    this._coinImage.x = this._PosX + this._FlyRandA * Math.sin(b * this._FlyBesarX * this._FlyBesarX);
                    this._coinImage.y = this._PosY = this._PosY - s_y;
                }
            }
        }

        // 启动飞回
        public BeginFlyBack(): void {
            if (!BattleManager.Instance.bStopBattle) {
                SoundManager.Instance.OnPlaySound("res/sound/gold_sound.mp3");
            }
            Floating.DamageText(this._nMoney.toString(), SkinEnum.RewardCoin, this.GetPosX(), this.GetPosY() - (10 + Math.random() * 20 >> 0), false, 120);

            // 切换飞回状态
            this._eState = DropCoinState.flyback;
            let pos = CoinFlyBackPos;
            // 计算简化模拟一阶贝塞尔曲线所需要的参数
            this._FlybackTime = (this._PosY - CoinFlyBackPos[1]) / this._FlySpdY;
            // X轴的标准速度
            this._SpeedX = (this._PosX - CoinFlyBackPos[0]) / this._FlybackTime;

            // 求贝塞尔参数
            // f(x) = a * sin( sqrt( x ) )     ( 0 < x < PI/b )
            this._FlyRandA = (Math.random() * 290 >> 0) + 10;
            let b: number = 1;
            if (this._FlyDir == DropCoinFlyDir.left) {
                this._FlyRandA = - this._FlyRandA;
            }
            this._FlyBesarX = 0;
            this._FlyBesarXSpeed = Math.sqrt(Math.PI / b) / this._FlybackTime;
        }

        private Complete() {
            Event.DispatchEvent(EventDefine.ADD_GOLD, this._nMoney);
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