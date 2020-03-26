/** 掉落宝箱类 */
var H52D_Framework;
(function (H52D_Framework) {
    // 宝箱状态
    var DropBoxState;
    (function (DropBoxState) {
        DropBoxState[DropBoxState["down"] = 0] = "down";
        DropBoxState[DropBoxState["stop"] = 1] = "stop";
    })(DropBoxState || (DropBoxState = {}));
    ;
    // 宝箱飞回的贝塞尔方向
    var DropBoxFlyDir;
    (function (DropBoxFlyDir) {
        DropBoxFlyDir[DropBoxFlyDir["left"] = 0] = "left";
        DropBoxFlyDir[DropBoxFlyDir["right"] = 1] = "right";
    })(DropBoxFlyDir || (DropBoxFlyDir = {}));
    var DropBox = /** @class */ (function () {
        ////////////////////////////////////////////////////////
        /** 创建金币
        * @param nX 位置
        * @param nY 位置
        * @param nid  金币卸载量
        * @param callback 金币消失回调
        */
        function DropBox(nX, nY, nbox, callback) {
            this._AccSpdY = 1800; // 重力加速度
            ////////////////////////////////////////////////////////
            // 飞回需要的参数
            this._FlySpdY = 600; // 飞回的速度（向上的垂直方向）
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
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.DROP_ADD_CHILD, [this._coinImage]);
            // 初始化初速度
            this._SpeedX = (Math.random() - 0.5) * 200;
            this._SpeedY = -Math.random() * 500;
            if (this._SpeedX > 0) {
                this._FlyDir = DropBoxFlyDir.right;
            }
            else {
                this._FlyDir = DropBoxFlyDir.left;
            }
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/drop_baoxiang.mp3");
            H52D_Framework.Tick.FrameLoop(1, this, this.Update);
        }
        DropBox.prototype.OnClick = function () {
            // 鼠标点击即飞回
            if (this._eState == DropBoxState.stop) {
                H52D_Framework.DropManager.Instance.DeleteBox(this);
                H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(this._nbox);
            }
        };
        DropBox.prototype.IsCanFlyback = function () {
            return (this._eState == DropBoxState.stop);
        };
        DropBox.prototype.GetPosX = function () {
            return this._PosX;
        };
        DropBox.prototype.GetPosY = function () {
            return this._PosY;
        };
        DropBox.prototype.Update = function () {
            // 下落
            if (this._eState == DropBoxState.down) {
                var t = H52D_Framework.Time.deltaTime / 1000;
                // s = v * t
                var s_x = this._SpeedX * t;
                // s = v * t + a * t^2 * 0.5
                var s_y = this._SpeedY * t + this._AccSpdY * t * t * 0.5;
                // v = v + a * t
                this._SpeedY = this._SpeedY + this._AccSpdY * t;
                this._coinImage.x = this._PosX = this._PosX + s_x;
                this._coinImage.y = this._PosY = this._PosY + s_y;
                // 落到地上了
                if (this._PosY + this._ImgH > H52D_Framework.FloorHeight()) {
                    this._coinImage.y = this._PosY = H52D_Framework.FloorHeight() - this._ImgH;
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
                this._stopTime += H52D_Framework.Time.deltaTime;
                if (H52D_Framework.BattleManager.Instance.bStopBattle) {
                    this._stopTime = 0;
                }
                if (H52D_Framework.DropManager.Instance.openBox && this._stopTime > 2000) {
                    // 时间到了，要飞回
                    H52D_Framework.DropManager.Instance.DeleteBox(this);
                    H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(this._nbox);
                }
            }
        };
        DropBox.prototype.Destroy = function () {
            this._coinImage.offAll();
            H52D_Framework.Tick.ClearAll(this);
            if (this._coinImage) {
                this._coinImage.destroy(true);
                this._coinImage = null;
            }
        };
        return DropBox;
    }());
    H52D_Framework.DropBox = DropBox;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=DropBox.js.map