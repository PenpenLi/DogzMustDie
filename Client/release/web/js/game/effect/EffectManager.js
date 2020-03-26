/** 特效管理类 */
var H52D_Framework;
(function (H52D_Framework) {
    var EffectManager = /** @class */ (function () {
        function EffectManager() {
            //打开掉落函数，多出调用，静态私有
            // private static _droping: boolean;
            //一个金币多少钱
            this.min = 1;
            this.max = 9;
            this.box = null;
            this.RootList = [];
            //-----------------------------------------屏幕震动效果-----------------------------------------
            this._shockTime = 0;
            this._shockTotalTime = 0;
            this.nShakeTime = 0;
        }
        Object.defineProperty(EffectManager, "Instance", {
            get: function () {
                if (EffectManager._inst == null) {
                    EffectManager._inst = new EffectManager();
                }
                return EffectManager._inst;
            },
            enumerable: true,
            configurable: true
        });
        EffectManager.prototype.Initialize = function () {
            this.RootList.push(H52D_Framework.SceneRoot);
        };
        /** 增加物品 */
        EffectManager.prototype.AddItem = function (itemId, itemNum) {
            if (itemId == H52D_Framework.BaseDefine.ItemIdGold) { //金币
                // EffectManager._droping = true;
                var location_1 = H52D_Framework.BattleManager.Instance.LastMosterLocation;
                if (!location_1.x)
                    return;
                // 设定多少个金币
                var howMoney = this.min + Math.floor(Math.random() * (this.max - this.min + 1));
                var cost = Math.round(itemNum / howMoney);
                var lastCost = itemNum % cost;
                if (lastCost < (cost >> 1)) {
                    lastCost += cost;
                }
                else {
                    howMoney++;
                }
                for (var i = 0; i < howMoney; i++) {
                    H52D_Framework.DropManager.Instance.AddDropCoin(location_1.x, 500, i ? cost : lastCost, 400);
                }
            }
            if (itemId == H52D_Framework.BaseDefine.ItemIdDiamonds) { //钻石
                this.ShowDiamonds(itemNum);
            }
            if (itemId == H52D_Framework.BaseDefine.ItemIdExperience) { //经验
                this.ShowExp(itemNum);
            }
        };
        /** 增加宝箱 */
        EffectManager.prototype.AddBox = function (type, itemId, itemNum) {
            if (this.box == null) {
                this.box = {};
            }
            if (this.box[type] == null) {
                this.box[type] = {};
            }
            this.box[type][itemId] = itemNum;
        };
        EffectManager.prototype.SendBox = function () {
            if (this.box == null)
                return;
            var location = H52D_Framework.BattleManager.Instance.LastMosterLocation;
            H52D_Framework.DropManager.Instance.AddDropBox(location.x, location.y - 120, this.box);
            this.box = null;
        };
        EffectManager.prototype.ShowGold = function (goldNum) {
        };
        EffectManager.prototype.ShowDiamonds = function (diamondsNum) {
            H52D_Framework.Tick.Once(3000, this, function () {
            });
        };
        EffectManager.prototype.ShowExp = function (expNum) {
            H52D_Framework.Tick.Once(3000, this, function () {
            });
        };
        /**
         * 屏幕震动
         * @param time 震动时间
         * @param bNew 新手引导特殊震动
         * @param nShakeTime 震动次数
         */
        EffectManager.prototype.StartShock = function (time, bNew, nShakeTime) {
            H52D_Framework.Tick.Clear(this, this.UpdateShock);
            if (!nShakeTime) {
                this.nShakeTime = 3;
            }
            else {
                this.nShakeTime = nShakeTime;
            }
            H52D_Framework.Tick.FrameLoop(1, this, this.UpdateShock, [bNew]);
            this._shockTotalTime = this._shockTime = (time / 1000) || 0.3;
        };
        /**处理震屏效果 */
        EffectManager.prototype.UpdateShock = function (bNew) {
            if (this._shockTime > 0) {
                // 震动次数
                //let nShakeTime: number = 3;
                var nRate = 1 - this._shockTime / this._shockTotalTime;
                // 求震动偏移
                // y = ( 1 - t ) * sin( t * shockTime * x * 2PI )
                var nOffX = nRate * this.nShakeTime * Math.PI * 2;
                var nOffset_1 = (1 - nRate) * Math.sin(nOffX);
                // 屏幕震动最大偏移量
                nOffset_1 = nOffset_1 * 10;
                if (bNew == true) {
                    H52D_Framework.NewGuidRoot.centerX = nOffset_1;
                    H52D_Framework.NewGuidRoot.centerY = nOffset_1;
                    H52D_Framework.ViewStoryRoot.centerX = nOffset_1;
                    H52D_Framework.ViewStoryRoot.centerY = nOffset_1;
                }
                else {
                    this.RootList.forEach(function (element) {
                        element.centerX = nOffset_1;
                        element.centerY = nOffset_1;
                    });
                }
                this._shockTime -= H52D_Framework.Time.deltaTime / 1000;
            }
            else {
                this._shockTime = 0;
                if (bNew == true) {
                    H52D_Framework.NewGuidRoot.centerX = 0;
                    H52D_Framework.NewGuidRoot.centerY = 0;
                }
                else {
                    this.RootList.forEach(function (element) {
                        element.centerX = 0;
                        element.centerY = 0;
                    });
                }
                H52D_Framework.Tick.Clear(this, this.UpdateShock);
            }
        };
        /**
          * 屏幕震动
          * @param time 震动时间
          * @param bNew 新手引导特殊震动
          */
        EffectManager.prototype.PStartShock = function (time, nShakeTime) {
            H52D_Framework.Tick.Clear(this, this.UpdateShock);
            if (!nShakeTime) {
                this.nShakeTime = 3;
            }
            else {
                this.nShakeTime = nShakeTime;
            }
            H52D_Framework.Tick.FrameLoop(1, this, this.PUpdateShock);
            this._shockTotalTime = this._shockTime = (time / 1000) || 0.3;
        };
        // private nShakeTime:number = 0;
        /**处理震屏效果 */
        EffectManager.prototype.PUpdateShock = function () {
            if (this._shockTime > 0) {
                // 震动次数
                //let nShakeTime: number = 3;
                var nRate = 1 - this._shockTime / this._shockTotalTime;
                // 求震动偏移
                // y = ( 1 - t ) * sin( t * shockTime * x * 2PI )
                var nOffX = nRate * this.nShakeTime * Math.PI * 2;
                var nOffset_2 = (1 - nRate) * Math.sin(nOffX);
                // 屏幕震动最大偏移量
                nOffset_2 = nOffset_2 * 10;
                this.RootList.forEach(function (element) {
                    element.centerX = nOffset_2;
                    element.centerY = nOffset_2;
                });
                this._shockTime -= H52D_Framework.Time.deltaTime / 1000;
            }
            else {
                this._shockTime = 0;
                this.RootList.forEach(function (element) {
                    element.centerX = 0;
                    element.centerY = 0;
                });
                H52D_Framework.Tick.Clear(this, this.UpdateShock);
            }
        };
        return EffectManager;
    }());
    H52D_Framework.EffectManager = EffectManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=EffectManager.js.map