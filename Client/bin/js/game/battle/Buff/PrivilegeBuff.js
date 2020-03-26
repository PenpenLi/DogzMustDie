/**
* 特权Buff类
*/
var H52D_Framework;
(function (H52D_Framework) {
    var PrivilegeBuff = /** @class */ (function () {
        function PrivilegeBuff() {
            this._isStart = false;
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.PRIVILEGE, Laya.Handler.create(this, this.AddBuff));
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.PRIVILEGE_DELETE, Laya.Handler.create(this, this.Destroy));
        }
        Object.defineProperty(PrivilegeBuff, "Instance", {
            get: function () {
                if (PrivilegeBuff._instance == null) {
                    PrivilegeBuff._instance = new PrivilegeBuff();
                }
                return PrivilegeBuff._instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrivilegeBuff.prototype, "IsStart", {
            get: function () { return this._isStart; },
            enumerable: true,
            configurable: true
        });
        /**添加Buff*/
        PrivilegeBuff.prototype.AddBuff = function (id) {
            var buffid = H52D_Framework.PrivilegeConfig[id]["parameter"][1];
            switch (id) {
                case 1:
                    this._isStart = true;
                    break;
                case 2:
                    this.AllDamageBuff(buffid);
                    break;
                case 3:
                    this.MpRely(buffid);
                    break;
            }
        };
        /**法力值回复 */
        PrivilegeBuff.prototype.MpRely = function (buffid) {
            this._mbuff = new H52D_Framework.Buff(buffid, this);
            this._mbuff.Do();
        };
        /**增加所有伤害BUff */
        PrivilegeBuff.prototype.AllDamageBuff = function (buffid) {
            this._dbuff = new H52D_Framework.Buff(buffid, this);
            this._dbuff.Do();
        };
        /**销毁 */
        PrivilegeBuff.prototype.Destroy = function (id) {
            if (id == 1) {
                this._isStart = true;
            }
            else if (id == 2) {
                this._dbuff.Destroy();
                this._dbuff = null;
            }
            else if (id == 3) {
                this._mbuff.Destroy();
                this._mbuff = null;
            }
        };
        return PrivilegeBuff;
    }());
    H52D_Framework.PrivilegeBuff = PrivilegeBuff;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PrivilegeBuff.js.map