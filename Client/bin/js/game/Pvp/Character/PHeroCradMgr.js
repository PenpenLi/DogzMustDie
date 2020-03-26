var H52D_Framework;
(function (H52D_Framework) {
    /**PVP数据管理 */
    var PHeroCradMgr = /** @class */ (function () {
        /**初始化 */
        function PHeroCradMgr(type) {
            this._type = 0;
            this._index = 0;
            this.Info = [];
            this.TospeedList = [];
            this._type = type;
            this._CHeroList = [];
        }
        Object.defineProperty(PHeroCradMgr.prototype, "CHeroList", {
            get: function () { return this._CHeroList; },
            enumerable: true,
            configurable: true
        });
        PHeroCradMgr.prototype.GetHeroCardByid = function (id) {
            for (var k in this._CHeroList) {
                if (this._CHeroList[k]) {
                    if (this._CHeroList[k].vo.id == id) {
                        return this._CHeroList[k];
                    }
                }
            }
        };
        PHeroCradMgr.prototype.OnUpdate = function () {
            for (var k in this._CHeroList) {
                if (this._CHeroList[k]) {
                    this._CHeroList[k].OnUpdate();
                }
            }
            for (var i = this._CHeroList.length; i >= 0; i--) {
                if (this._CHeroList[i] && this._CHeroList[i].IsDie) {
                    this._CHeroList[i] = null;
                }
            }
        };
        PHeroCradMgr.prototype.AvatarInit = function (callBack, info) {
            this.loadComplete = callBack;
            this.Info = info;
            this._CHeroList = [];
            this._index = 0;
            //加载英雄
            this.loadHero();
        };
        PHeroCradMgr.prototype.loadHero = function () {
            var _this = this;
            for (var key = 0; key < this.Info.length; key++) {
                var hero = new H52D_Framework.PHeroCrad(this.Info[key], this._type);
                var dir = 1;
                var id = this.Info[key].id;
                var scale = H52D_Framework.HeroConfig[id]["modelScale"];
                var x = 0;
                var y = 0;
                var location_1 = hero.vo.location;
                if (this._type == 1) {
                    x = H52D_Framework.HeroLocal[location_1][0] * G_StageWidthScale;
                    y = H52D_Framework.HeroLocal[location_1][1];
                    dir = 1;
                }
                else {
                    x = H52D_Framework.MonsterLocal[location_1][0] * G_StageWidthScale;
                    y = H52D_Framework.MonsterLocal[location_1][1];
                    dir = -1;
                }
                this._CHeroList.push(hero);
                hero.LoadMoudle(id, dir, scale, x, y, 0, Laya.Handler.create(this, function () {
                    _this._index++;
                    if (_this._index >= _this.Info.length) {
                        _this.HeroLoadComplete();
                    }
                }));
            }
        };
        PHeroCradMgr.prototype.HeroLoadComplete = function () {
            this.SortTospeed();
            if (this.loadComplete) {
                this.loadComplete.run();
            }
        };
        PHeroCradMgr.prototype.SortTospeed = function () {
            this.TospeedList = this._CHeroList.concat();
            /**英雄表长度 */
            var Length = this.TospeedList.length;
            /**用先手速度排序 最慢的是0 */
            for (var i = 0; i < Length; i++) {
                for (var j = i + 1; j < Length; j++) {
                    if (this.TospeedList[i] && this.TospeedList[j]) {
                        if (this.TospeedList[i].vo.ToSpeed > this.TospeedList[j].vo.ToSpeed) {
                            var current = this.TospeedList[i];
                            this.TospeedList[i] = this.TospeedList[j];
                            this.TospeedList[j] = current;
                        }
                    }
                }
            }
        };
        PHeroCradMgr.prototype.HeroAttack = function () {
            var hf = this.TospeedList;
            if (!hf)
                return;
            var len = hf.length - 1;
            var _loop_1 = function (i) {
                var hc = hf[i];
                if (!hc)
                    return { value: void 0 };
                var time = 0;
                /**第一位出手英雄 */
                var X = H52D_Framework.GameParamConfig["FastestHeroFirstAttackTime"];
                /**其他英雄出手 */
                var Y = H52D_Framework.GameParamConfig["OtherHeroFirstAttackTimeRatio"];
                if (i == len) {
                    time = X;
                }
                else {
                    var firstHero = hf[len];
                    var F = firstHero.vo.ToSpeed;
                    time = X + (F - hc.vo.ToSpeed) * Y;
                }
                // hc.InitTimer(time, Laya.Handler.create(this, () => {
                //     hc.BClose = false;
                // }));
                H52D_Framework.Tick.Once(time, this_1, function () {
                    hc.BClose = false;
                });
            };
            var this_1 = this;
            for (var i = len; i >= 0; i--) {
                var state_1 = _loop_1(i);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
            // this._OpenTimer = true;
        };
        /**销毁 */
        PHeroCradMgr.prototype.Destroy = function () {
            if (this._CHeroList) {
                for (var i = 0; i < H52D_Framework.GetTabLength(this._CHeroList); i++) {
                    if (this._CHeroList[i]) {
                        this._CHeroList[i].Destroy();
                        this._CHeroList[i] = null;
                    }
                }
                this._CHeroList = [];
            }
            this.TospeedList = [];
        };
        PHeroCradMgr.prototype.show = function () {
            if (this._CHeroList) {
                for (var i = 0; i < H52D_Framework.GetTabLength(this._CHeroList); i++) {
                    if (this._CHeroList[i]) {
                        this._CHeroList[i].ImValue();
                    }
                }
            }
        };
        return PHeroCradMgr;
    }());
    H52D_Framework.PHeroCradMgr = PHeroCradMgr;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PHeroCradMgr.js.map