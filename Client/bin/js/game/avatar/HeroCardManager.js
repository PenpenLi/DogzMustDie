/**玩家英雄类 */
var H52D_Framework;
(function (H52D_Framework) {
    var HeroCardManager = /** @class */ (function () {
        /**初始化 */
        function HeroCardManager() {
            this.data = [];
            // private _index = 0;
            this._loadone = false;
            this.TospeedList = [];
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_HeartBeat", this);
            this._CHeroList = [];
        }
        Object.defineProperty(HeroCardManager, "Instance", {
            get: function () {
                if (HeroCardManager._init == null) {
                    HeroCardManager._init = new HeroCardManager();
                }
                return HeroCardManager._init;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroCardManager.prototype, "AscriptionId", {
            get: function () {
                return this._ascriptionId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeroCardManager.prototype, "CHeroList", {
            get: function () {
                return this._CHeroList;
            },
            enumerable: true,
            configurable: true
        });
        HeroCardManager.prototype.GetHeroCardByid = function (id) {
            for (var k in this._CHeroList) {
                if (this._CHeroList[k]) {
                    if (this._CHeroList[k].vo.nHeroID == id) {
                        return this._CHeroList[k];
                    }
                }
            }
        };
        HeroCardManager.prototype.DataInit = function (Obj) {
            HeroCardManager._IndexE += 0.1;
            this.data = new Array();
            for (var _id in Obj) {
                var vo = H52D_Framework.HeroManager.Instance.GetHero(Obj[_id]);
                vo.location = Number(_id);
                this.data.push(vo);
            }
            if (this.data.length == 9) {
                HeroCardManager._MaxI += 0.1;
            }
        };
        HeroCardManager.prototype.AvatarInit = function (callBack) {
            this.loadComplete = callBack;
            var Len = H52D_Framework.GetTabLength(this.CHeroList);
            if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.Memory) {
                this.DataInit(H52D_Framework.MemoryLogic.Instance.war);
            }
            else if (H52D_Framework.CustomsManager.Instance.CustomsType == Customs_Type.MatchElection) {
                if (H52D_Framework.GetTabLength(H52D_Framework.MatchLogic.Instance.war) != 0) {
                    this.DataInit(H52D_Framework.MatchLogic.Instance.war);
                }
                else {
                    this.DataInit(H52D_Framework.MasterPlayer.Instance.player.HeroWarList);
                }
            }
            else {
                this.DataInit(H52D_Framework.MasterPlayer.Instance.player.HeroWarList);
            }
            if (Len < 9 && Len > 0) {
                HeroCardManager._index = Len + 1;
            }
            if (Len > 0) {
                for (var i = Len - 1; i >= 0; i--) {
                    if (this.CHeroList[i]) {
                        this.CHeroList[i].Destroy();
                        this.CHeroList[i] = null;
                    }
                }
            }
            HeroCardManager.index = 0;
            //加载英雄
            this.loadHero();
            H52D_Framework.MHAManager.Instance.LUpdate();
        };
        HeroCardManager.prototype.loadHero = function () {
            for (var i = 0; i < this.data.length; i++) {
                var hero = new H52D_Framework.HeroCard(this.data[i]);
                var dir = 1;
                var id = this.data[i].nHeroID;
                var scale = H52D_Framework.HeroConfig[id]["modelScale"];
                var x = H52D_Framework.HeroLocal[this.data[i]["location"]][0] * G_StageWidthScale;
                var y = H52D_Framework.HeroLocal[this.data[i]["location"]][1];
                this._CHeroList[i] = hero;
                hero.LoadMoudle(dir, scale, x, y, 0, false);
            }
            H52D_Framework.Tick.Loop(100, this, this.LoadUpdate);
        };
        HeroCardManager.prototype.LoadUpdate = function () {
            for (var k in this._CHeroList) {
                if (this._CHeroList[k].avatar) {
                    this._CHeroList[k].bLoadDown = true;
                }
            }
            if (this.isLoad && !this._loadone) {
                this._loadone = true;
                H52D_Framework.Tick.Clear(this, this.LoadUpdate);
                if (HeroCardManager._MaxI > 0.1 || HeroCardManager._IndexE > 0.2 && HeroCardManager._MaxI == 0.1 ||
                    HeroCardManager._IndexE > 0.2 && HeroCardManager._MaxI == 0) {
                    if (this._CHeroList && this._CHeroList.length > 0) {
                        if (this._CHeroList.length <= 5 && this._CHeroList.length > 1) {
                            this._CHeroList[this._CHeroList.length - 2].ChangeEffect();
                        }
                        else {
                            this._CHeroList[this._CHeroList.length - 1].ChangeEffect();
                        }
                    }
                }
                if (HeroCardManager._IndexE <= 0.2) {
                    H52D_Framework.MHAManager.Instance.InitS();
                }
                else {
                    H52D_Framework.MHAManager.Instance.LUpdate();
                }
                this.HeroLoadComplete();
            }
        };
        Object.defineProperty(HeroCardManager.prototype, "isLoad", {
            get: function () {
                for (var k in this._CHeroList) {
                    if (!this._CHeroList[k].bLoadDown) {
                        return false;
                    }
                }
                return true;
            },
            enumerable: true,
            configurable: true
        });
        HeroCardManager.prototype.HeroLoadComplete = function () {
            this.SortTospeed();
            /**所有英雄伤害之和 */
            if (H52D_Framework.BattleManager.Instance.aIOperation)
                H52D_Framework.BattleManager.Instance.aIOperation.Dps();
            this.loadComplete.run();
            this._loadone = false;
        };
        HeroCardManager.prototype.OnEffectPassive = function () {
            for (var k in this.CHeroList) {
                if (this.CHeroList[k]) {
                    this.CHeroList[k].OnEffectPassive();
                }
            }
        };
        HeroCardManager.prototype.SortTospeed = function () {
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
        HeroCardManager.prototype.HeroAttack = function () {
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
                H52D_Framework.Tick.Once(time, this_1, function () {
                    hc.Close = false;
                });
            };
            var this_1 = this;
            for (var i = len; i >= 0; i--) {
                var state_1 = _loop_1(i);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        };
        /**销毁 */
        HeroCardManager.prototype.Destroy = function () {
            if (this._CHeroList) {
                for (var i = 0; i < H52D_Framework.GetTabLength(this._CHeroList); i++) {
                    if (this._CHeroList[i]) {
                        this._CHeroList[i].Destroy();
                        this._CHeroList[i] = null;
                    }
                }
                this._CHeroList = [];
            }
        };
        HeroCardManager._MaxI = 0;
        HeroCardManager._isonce = false;
        HeroCardManager._IndexE = 0.1;
        HeroCardManager._index = 0;
        return HeroCardManager;
    }());
    H52D_Framework.HeroCardManager = HeroCardManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=HeroCardManager.js.map