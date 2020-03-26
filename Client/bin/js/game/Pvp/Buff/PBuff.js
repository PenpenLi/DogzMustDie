var H52D_Framework;
(function (H52D_Framework) {
    var PBuff = /** @class */ (function () {
        /**初始化 */
        function PBuff(id, btype, owner) {
            this._owner = null;
            /** buff数据*/
            this._buffData = null;
            /**伤害系数 */
            this._ratio = 0;
            this._currentCd = 0;
            this._bCD = true;
            /**Buff表现 */
            this._avatar = null;
            /**Buff效果 */
            this._effect = null;
            this._id = 0;
            this._currenttime = 0;
            this._bSpell = false;
            this._btype = 0;
            this._buffData = new H52D_Framework.BuffData(id);
            this._id = id;
            this._btype = btype;
            this._owner = owner;
        }
        Object.defineProperty(PBuff.prototype, "id", {
            get: function () { return this._id; },
            enumerable: true,
            configurable: true
        });
        /**Buff产生效果 */
        PBuff.prototype.Do = function (belongs, ratio) {
            if (!this._buffData)
                return;
            if (this._bCD) {
                this._bSpell = true;
                this._currentCd = this._buffData.inlayCd;
                this._bCD = false;
                this._ratio = ratio;
                this._effect = new H52D_Framework.PBuffEffect(this._buffData, this._owner, this._ratio, this._btype, belongs);
                this._effect.Do();
                if (this._buffData.effectPath) {
                    this._avatar = new H52D_Framework.PBuffAvatar(this._buffData, this._owner, this._btype, belongs);
                    this._avatar.Do();
                }
            }
        };
        /**替换规则 */
        PBuff.prototype.RepeatBuff = function () {
        };
        PBuff.prototype.OnUpdate = function () {
            if (this._buffData) {
                if (this._buffData.existTime != -1 && this._buffData.id != 1 && this._bSpell) {
                    this._currenttime += 100;
                    if (this._currenttime + 100 >= this._buffData.existTime) {
                        this._currenttime = 0;
                        this._bSpell = false;
                        this.Destroy();
                    }
                }
                if (!this._buffData.existTime && this._buffData.continueType == 3 && this._bSpell) {
                    this._currenttime += 100;
                    if (this._currenttime >= 1000) {
                        this._currenttime = 0;
                        this._bSpell = false;
                        this.Destroy();
                    }
                }
            }
            if (this._effect)
                this._effect.OnUpdate();
            if (this._avatar)
                this._avatar.OnUpdate();
            if (this._currentCd > 0) {
                this._currentCd -= 100;
            }
            else if (this._currentCd <= 0) {
                this._bCD = true;
            }
            // if (!BattleManager.Instance.IsHasAliveTarget())  {
            //     this.Destroy_S();
            // }
        };
        PBuff.prototype.Destroy_S = function () {
            if (this._buffData.existTime == -1) {
                this.Destroy();
            }
        };
        /**销毁 */
        PBuff.prototype.Destroy = function () {
            // if (this._effect) {
            //     this._effect.Destroy();
            //     this._effect = null;
            // }
            //删除buff表现效果
            if (this._avatar) {
                this._avatar.Destroy();
                this._avatar = null;
            }
        };
        return PBuff;
    }());
    H52D_Framework.PBuff = PBuff;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PBuff.js.map