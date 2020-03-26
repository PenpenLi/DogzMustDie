var H52D_Framework;
(function (H52D_Framework) {
    /**技能BUff @author zhangzhenming*/
    var SkillBuff = /** @class */ (function () {
        function SkillBuff(data, owner, btype) {
            this._bHave = false;
            this._btype = 1;
            this._data = data;
            this._owner = owner;
            this._btype = btype;
            if (!H52D_Framework.ObjIsEmpty(this._data)) {
                this._bHave = true;
                var id = this._data[1][3];
                this._buff = new H52D_Framework.Buff(id, this._owner, btype);
            }
        }
        /**数据表里有BUFF就增加 */
        SkillBuff.prototype.SetBuffasHave = function (ratio) {
            this._ratio = ratio;
            if (this._bHave) {
                var num = Math.random() * 10000;
                var odds = this._data[1][2];
                var type = this._data[1][1];
                if (num <= odds && type != 2) {
                    this.AddBuff();
                }
            }
        };
        /**暴击增加BUFF */
        SkillBuff.prototype.SetBuffasCrit = function (ratio) {
            this._ratio = ratio;
            if (this._bHave) {
                var num = Math.random() * 10000;
                var odds = this._data[1][2];
                var type = this._data[1][1];
                if (num <= odds && type == 2) {
                    this.AddBuff();
                }
            }
        };
        SkillBuff.prototype.AddBuff = function () {
            var stype = H52D_Framework.StatusConfig[this._buff.id]["statusType"];
            if (this._ratio > 0) {
                if (stype == 2) {
                    this._buff.Do(this._ratio);
                }
                else {
                    this._buff.Do();
                }
            }
            else {
                this._buff.Do();
            }
        };
        SkillBuff.prototype.OnUpdate = function () {
            this._buff.OnUpdate();
        };
        SkillBuff.prototype.Destroy = function () {
            if (this._buff) {
                this._buff.Destroy();
                this._buff = null;
            }
        };
        return SkillBuff;
    }());
    H52D_Framework.SkillBuff = SkillBuff;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=SkillBuff.js.map