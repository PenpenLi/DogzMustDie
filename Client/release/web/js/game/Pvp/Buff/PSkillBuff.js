var H52D_Framework;
(function (H52D_Framework) {
    var PSkillBuff = /** @class */ (function () {
        function PSkillBuff(data, owner, btype, belongs) {
            this._buff = [];
            this._bHave = false;
            this.belongs = eBELONGS_TO.ATTACK;
            this._data = data;
            this._owner = owner;
            this.belongs = belongs;
            if (!H52D_Framework.ObjIsEmpty(this._data)) {
                this._bHave = true;
                for (var k in this._data) {
                    var id = this._data[k][3];
                    this._buff.push(new H52D_Framework.PBuff(id, btype, this._owner));
                }
            }
        }
        /**数据表里有BUFF就增加 */
        PSkillBuff.prototype.SetBuffasHave = function (ratio) {
            this._ratio = ratio;
            if (this._bHave) {
                var num = Math.random() * 10000;
                var odds = this._data[1][2];
                var type = this._data[1][1];
                if (num <= odds && type != 2) {
                    for (var k in this._buff) {
                        this.AddBuff(k);
                    }
                }
            }
        };
        /**暴击增加BUFF */
        PSkillBuff.prototype.SetBuffasCrit = function (ratio) {
            this._ratio = ratio;
            if (this._bHave) {
                var num = Math.random() * 10000;
                var odds = this._data[1][2];
                var type = this._data[1][1];
                if (num <= odds && type == 2) {
                    for (var k in this._buff) {
                        this.AddBuff(k);
                    }
                }
            }
        };
        PSkillBuff.prototype.AddBuff = function (i) {
            var stype = H52D_Framework.StatusConfig[this._buff[i].id]["statusType"];
            if (this._ratio > 0) {
                if (stype == 2) {
                    this._buff[i].Do(this.belongs, this._ratio);
                }
                else {
                    this._buff[i].Do(this.belongs);
                }
            }
            else {
                this._buff[i].Do(this.belongs);
            }
        };
        PSkillBuff.prototype.OnUpdate = function () {
            for (var k in this._buff) {
                this._buff[k].OnUpdate();
            }
        };
        PSkillBuff.prototype.Destroy = function () {
            for (var k in this._buff) {
                this._buff[k].Destroy();
            }
            this._buff = [];
        };
        return PSkillBuff;
    }());
    H52D_Framework.PSkillBuff = PSkillBuff;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=PSkillBuff.js.map