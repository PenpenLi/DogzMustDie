var H52D_Framework;
(function (H52D_Framework) {
    var CopyCond = /** @class */ (function () {
        function CopyCond(id, index, value) {
            /**第几颗星 */
            this._id = -1;
            /**类型 */
            this._index = 0;
            /**通关值 */
            this._value = 0;
            /**防止多次添加 */
            this._once = false;
            this._id = id;
            this._index = index;
            this._value = value;
        }
        Object.defineProperty(CopyCond.prototype, "Type", {
            get: function () { return this._index; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CopyCond.prototype, "herolist", {
            get: function () { return H52D_Framework.BattleManager.Instance.HeroCardMgr.CHeroList; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CopyCond.prototype, "MonsterList", {
            get: function () { return H52D_Framework.MonsterManager.Instance.monsterList; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CopyCond.prototype, "curTime", {
            get: function () { return H52D_Framework.BattleManager.Instance.curtime; },
            enumerable: true,
            configurable: true
        });
        CopyCond.prototype.OnEffect = function () {
            var id = this._index - 1;
            switch (id) {
                case 0:
                    this.BeatFail();
                    break;
                case 1:
                    this.LifeTime();
                    break;
                case 2:
                    this.OwnerDieNumber();
                    break;
                case 3:
                    this.TimeNotOwnerDie();
                    break;
                case 4:
                    this.TakeTypeHeroV();
                    break;
                case 5:
                    this.TimeDamage();
                    break;
                case 6:
                    this.HitNumber();
                    break;
            }
        };
        /**击败所有敌方 */
        CopyCond.prototype.BeatFail = function () {
            if (this.curTime <= this._value * 1000 && this.bEnemyDie() && !this._once) {
                this._once = true;
                this.AddList(1);
            }
        };
        /**生存时间 */
        CopyCond.prototype.LifeTime = function () {
            if (this.curTime >= this._value * 1000 && this.bOwnerDie() && !this._once) {
                this._once = true;
                this.AddList(1);
            }
        };
        /**我放阵亡数量 */
        CopyCond.prototype.OwnerDieNumber = function () {
            if (H52D_Framework.BattleManager.Instance.nWin == 1) {
                if (H52D_Framework.BattleManager.hDienumber <= this._value && !this._once) {
                    this.AddList(1);
                    this._once = true;
                }
            }
        };
        /**规定时间没有阵亡 */
        CopyCond.prototype.TimeNotOwnerDie = function () {
            if (this.curTime >= this._value * 1000 && H52D_Framework.BattleManager.hDienumber < 1 && !this._once) {
                this.AddList(1);
                this._once = true;
            }
        };
        /**携带指定类型英雄通关 */
        CopyCond.prototype.TakeTypeHeroV = function () {
            if (H52D_Framework.BattleManager.Instance.nWin == 1) {
                var index = 0;
                for (var k in this.herolist) {
                    if (this.herolist[k] && this.herolist[k].type == eCharacter_TYPE.DHERO) {
                        index++;
                    }
                }
                if (index >= this._value && !this._once) {
                    this.AddList(1);
                    this._once = true;
                }
            }
        };
        /**规定时间造成伤害 */
        CopyCond.prototype.TimeDamage = function () {
            if (this.curTime <= 10 * 1000 && H52D_Framework.BattleManager.damageAll >= this._value && !this._once) {
                this.AddList(1);
                this._once = true;
            }
        };
        /**被击数 */
        CopyCond.prototype.HitNumber = function () {
            if (H52D_Framework.BattleManager.Instance.nWin == 1 && H52D_Framework.BattleManager.hitNum <= this._value && !this._once) {
                this.AddList(1);
                this._once = true;
            }
        };
        CopyCond.prototype.AddList = function (obj) {
            var list = H52D_Framework.BattleManager.Instance.StarList;
            list[this._id] = obj;
        };
        CopyCond.prototype.bEnemyDie = function () {
            for (var k in this.MonsterList) {
                if (this.MonsterList[k] && this.MonsterList[k].IsDie != true) {
                    return false;
                }
            }
            return true;
        };
        CopyCond.prototype.bOwnerDie = function () {
            for (var k in this.herolist) {
                if (this.herolist[k] && this.herolist[k].IsDie == true) {
                    return false;
                }
            }
            return true;
        };
        return CopyCond;
    }());
    H52D_Framework.CopyCond = CopyCond;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=CopyCond.js.map