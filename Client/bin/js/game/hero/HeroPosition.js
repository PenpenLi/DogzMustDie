/*
* name;
*/
var H52D_Framework;
(function (H52D_Framework) {
    /**英雄站位  常万*/
    var HeroPosition = /** @class */ (function () {
        function HeroPosition() {
            /** 当前界面布阵信息 */
            this._PositionWar = {};
            this._HeroWar = {};
            this._bChange = false;
            this.bool = false;
            /**存放英雄的数组 */
            this._putHero = [];
            //引导需要的参数
            //是否在布阵页面
            this._bHeroWar = false;
            this.AddEvent();
        }
        HeroPosition.prototype.AddEvent = function () {
        };
        Object.defineProperty(HeroPosition, "Instance", {
            get: function () {
                if (HeroPosition._init == null) {
                    HeroPosition._init = new HeroPosition();
                }
                return HeroPosition._init;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroPosition.prototype, "bChange", {
            get: function () {
                return this._bChange;
            },
            set: function (value) {
                this._bChange = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroPosition.prototype, "Puthero", {
            set: function (value) {
                this._putHero = value;
            },
            enumerable: true,
            configurable: true
        });
        HeroPosition.prototype.Close = function () {
            this.bool = true;
        };
        /** 判断是否在阵容上 */
        HeroPosition.prototype.IsInWar = function (nHeroID) {
            return this._HeroWar[nHeroID] == null ? false : true;
        };
        /** 初始化阵容信息 */
        HeroPosition.prototype.InitPosInfo = function () {
            this._PositionWar = {};
            this._HeroWar = {};
            var HeroWarList = H52D_Framework.MasterPlayer.Instance.player.HeroWarList;
            for (var pos in HeroWarList) {
                var nHeroID = HeroWarList[pos];
                this.PutHero(pos, nHeroID);
            }
        };
        Object.defineProperty(HeroPosition.prototype, "PositionWar", {
            /** 当前布阵信息 */
            get: function () {
                return this._PositionWar;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroPosition.prototype, "HeroWar", {
            /** 当前英雄位置信息 */
            get: function () {
                return this._HeroWar;
            },
            enumerable: true,
            configurable: true
        });
        /**判断是否在保存的阵容上 */
        HeroPosition.prototype.IsInSaveWar = function (pos, nHeroID) {
            var InWar = false;
            var NoWar = false;
            var war = H52D_Framework.MasterPlayer.Instance.player.HeroWarList;
            for (var nIdx in war) {
                var a = war[nIdx];
                if (a == nHeroID) {
                    InWar = true;
                }
                else {
                    NoWar = false;
                }
            }
            return (InWar || NoWar) ? true : false;
        };
        /** 放置英雄 */
        HeroPosition.prototype.PutHero = function (nPos, nHeroID) {
            // 目标位置当前英雄ID
            var nLastHeroID = this._PositionWar[nPos];
            // 目标英雄上一个位置
            var nLastPos = this._HeroWar[nHeroID];
            if (nLastHeroID != null) {
                this._HeroWar[nLastHeroID] = nLastPos;
                this._bChange = true;
            }
            if (nLastPos != null) {
                this._PositionWar[nLastPos] = nLastHeroID;
                this._bChange = true;
            }
            this._PositionWar[nPos] = nHeroID;
            this._HeroWar[nHeroID] = nPos;
        };
        HeroPosition.prototype.HeroWar_Info = function () {
            for (var key in H52D_Framework.MasterPlayer.Instance.player.HeroWarList) {
                this._putHero.push(H52D_Framework.MasterPlayer.Instance.player.HeroWarList[key]);
            }
            return this._putHero;
        };
        return HeroPosition;
    }());
    H52D_Framework.HeroPosition = HeroPosition;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=HeroPosition.js.map