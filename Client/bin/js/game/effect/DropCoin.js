/** 掉落金币类 */
var H52D_Framework;
(function (H52D_Framework) {
    // 金币状态
    var DropCoinState;
    (function (DropCoinState) {
        DropCoinState[DropCoinState["none"] = -1] = "none";
        DropCoinState[DropCoinState["down"] = 0] = "down";
        DropCoinState[DropCoinState["stop"] = 1] = "stop";
        DropCoinState[DropCoinState["flyback"] = 2] = "flyback";
    })(DropCoinState || (DropCoinState = {}));
    ;
    // 金币飞回的贝塞尔方向
    var DropCoinFlyDir;
    (function (DropCoinFlyDir) {
        DropCoinFlyDir[DropCoinFlyDir["left"] = 0] = "left";
        DropCoinFlyDir[DropCoinFlyDir["right"] = 1] = "right";
    })(DropCoinFlyDir || (DropCoinFlyDir = {}));
    var DropCoin = /** @class */ (function () {
        /** 创建金币
        * @param nX 位置
        * @param nY 位置
        * @param nMoney  金币卸载量
        * @param callback 金币消失回调
        */
        function DropCoin(nX, nY, nMoney, speed_x) {
            /** 金币停留时间 */
            this.RESIDENCE = 8000;
            this._AccSpdY = 1800; // 重力加速度
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
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.DROP_ADD_CHILD, [this._coinImage]);
            // 初始化初速度
            this._SpeedX = (Math.random() - 0.5) * speed_x;
            this._SpeedY = -Math.random() * 1000;
            //飞回的速度
            this._FlySpdY = 400 + (300 * Math.random() >> 0);
            if (this._SpeedX > 0) {
                this._FlyDir = DropCoinFlyDir.right;
            }
            else {
                this._FlyDir = DropCoinFlyDir.left;
            }
            // 落到地上了
            this._floor = H52D_Framework.FloorHeight();
            H52D_Framework.Tick.FrameLoop(1, this, this.Update);
        }
        DropCoin.prototype.OnClick = function () {
            // 鼠标点击即飞回
            if (this._eState == DropCoinState.stop) {
                if (!H52D_Framework.BattleManager.Instance.bStopBattle) {
                    H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/gold_sound.mp3");
                }
                this.BeginFlyBack();
                // 让周围的金币也飞回
                H52D_Framework.DropManager.Instance.SearchCoinFlyback(this._PosX, this._PosY);
            }
        };
        DropCoin.prototype.IsCanFlyback = function () {
            return (this._eState == DropCoinState.stop);
        };
        DropCoin.prototype.GetPosX = function () {
            return this._PosX;
        };
        DropCoin.prototype.GetPosY = function () {
            return this._PosY;
        };
        DropCoin.prototype.Update = function () {
            // 下落
            if (this._eState == DropCoinState.down) {
                var t = H52D_Framework.Time.deltaTime / 1000;
                // s = v * t
                var s_x = this._SpeedX * t;
                // s = v * t + a * t^2 * 0.5
                var s_y = this._SpeedY * t + this._AccSpdY * t * t * 0.5;
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
                    if (!H52D_Framework.BattleManager.Instance.bStopBattle) {
                        H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/gold_sound.mp3");
                    }
                }
            }
            // 停止状态
            else if (this._eState == DropCoinState.stop) {
                this._stopTime += H52D_Framework.Time.deltaTime;
                if (this._stopTime > this.RESIDENCE) { // 时间到了，要飞回
                    this.BeginFlyBack();
                }
            }
            // 飞回，简化模拟一阶贝塞尔曲线
            else if (this._eState == DropCoinState.flyback) {
                var t = H52D_Framework.Time.deltaTime / 1000;
                this._FlybackTime = this._FlybackTime - t;
                if (this._FlybackTime < 0) {
                    // 完成回调
                    this.Complete();
                    // 删除
                    H52D_Framework.DropManager.Instance.DeleteCoin(this);
                }
                else {
                    // 向上移动
                    var s_y = this._FlySpdY * t;
                    // 水平移动
                    var s_x = this._SpeedX * t;
                    // 贝塞尔偏移
                    // f(x) = a * sin( sqrt( x ) )     ( 0 < x < PI/b )
                    var b = 1;
                    this._FlyBesarX = this._FlyBesarX + this._FlyBesarXSpeed * t;
                    this._PosX = this._PosX - s_x;
                    this._coinImage.x = this._PosX + this._FlyRandA * Math.sin(b * this._FlyBesarX * this._FlyBesarX);
                    this._coinImage.y = this._PosY = this._PosY - s_y;
                }
            }
        };
        // 启动飞回
        DropCoin.prototype.BeginFlyBack = function () {
            if (!H52D_Framework.BattleManager.Instance.bStopBattle) {
                H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/gold_sound.mp3");
            }
            H52D_Framework.Floating.DamageText(this._nMoney.toString(), SkinEnum.RewardCoin, this.GetPosX(), this.GetPosY() - (10 + Math.random() * 20 >> 0), false, 120);
            // 切换飞回状态
            this._eState = DropCoinState.flyback;
            var pos = H52D_Framework.CoinFlyBackPos;
            // 计算简化模拟一阶贝塞尔曲线所需要的参数
            this._FlybackTime = (this._PosY - H52D_Framework.CoinFlyBackPos[1]) / this._FlySpdY;
            // X轴的标准速度
            this._SpeedX = (this._PosX - H52D_Framework.CoinFlyBackPos[0]) / this._FlybackTime;
            // 求贝塞尔参数
            // f(x) = a * sin( sqrt( x ) )     ( 0 < x < PI/b )
            this._FlyRandA = (Math.random() * 290 >> 0) + 10;
            var b = 1;
            if (this._FlyDir == DropCoinFlyDir.left) {
                this._FlyRandA = -this._FlyRandA;
            }
            this._FlyBesarX = 0;
            this._FlyBesarXSpeed = Math.sqrt(Math.PI / b) / this._FlybackTime;
        };
        DropCoin.prototype.Complete = function () {
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.ADD_GOLD, this._nMoney);
        };
        DropCoin.prototype.Destroy = function () {
            this._coinImage.offAll();
            H52D_Framework.Tick.ClearAll(this);
            if (this._coinImage) {
                this._coinImage.destroy(true);
                this._coinImage = null;
            }
        };
        return DropCoin;
    }());
    H52D_Framework.DropCoin = DropCoin;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=DropCoin.js.map