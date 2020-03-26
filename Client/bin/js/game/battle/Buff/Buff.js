/*
* buff类;
*/
var H52D_Framework;
(function (H52D_Framework) {
    var Buff = /** @class */ (function () {
        /**初始化 */
        function Buff(id, owner, btype) {
            if (btype === void 0) { btype = 1; }
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
            this._btype = 1;
            this._buffData = new H52D_Framework.BuffData(id);
            this._id = id;
            this._owner = owner;
            this._btype = btype;
        }
        Object.defineProperty(Buff.prototype, "id", {
            get: function () { return this._id; },
            enumerable: true,
            configurable: true
        });
        /**Buff产生效果 */
        Buff.prototype.Do = function (ratio) {
            if (!this._buffData)
                return;
            H52D_Framework.Event.RegistEvent("Destroy_s", Laya.Handler.create(this, this.Destroy_S));
            if (this._bCD) {
                this._bSpell = true;
                this._currentCd = this._buffData.inlayCd;
                this._bCD = false;
                if (ratio)
                    this._ratio = ratio;
                else
                    this._ratio = 0;
                this._effect = new H52D_Framework.BuffEffect(this._buffData, this._owner, this._ratio, this._btype);
                if (this._buffData.effectPath)
                    this._avatar = new H52D_Framework.BuffAvatar(this._buffData, this._owner, this._btype);
            }
        };
        /**替换规则 */
        Buff.prototype.RepeatBuff = function () {
        };
        Buff.prototype.OnUpdate = function () {
            if (this._buffData) {
                if (this._buffData.existTime != -1 && this._buffData.id != 1 && this._bSpell) {
                    this._currenttime += 100;
                    if (this._currenttime >= this._buffData.existTime) {
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
        };
        Buff.prototype.Destroy_S = function () {
            if (this._buffData.existTime == -1) {
                this.Destroy();
            }
        };
        /**
         * DsetroyEvent
         */
        Buff.prototype.DsetroyEvent = function () {
        };
        /**销毁 */
        Buff.prototype.Destroy = function () {
            if (this._effect) {
                this._effect.Destroy();
                this._effect = null;
            }
            //删除buff表现效果
            if (this._avatar) {
                this._avatar.Destroy();
                this._avatar = null;
            }
            H52D_Framework.Event.RemoveEvent("Destroy_s", Laya.Handler.create(this, this.Destroy_S));
        };
        return Buff;
    }());
    H52D_Framework.Buff = Buff;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Buff.js.map