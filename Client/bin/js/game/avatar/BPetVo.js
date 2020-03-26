var H52D_Framework;
(function (H52D_Framework) {
    /**神兽数据类 */
    var BPetVo = /** @class */ (function () {
        function BPetVo(id) {
            /**神兽ID */
            this.ID = 0;
            /**神兽模型的朝向 */
            /**神兽等级 */
            this._level = 0;
            this.Direction = -1;
            /**状态：0：未上阵 1：上阵 */
            this._currentState = 0;
            /**神兽系数 */
            this.ratio = 0;
            this.CD = 0;
            this._attributePassive = [];
            this.ID = id;
            this.bNet = false;
            this.currentAttribute = {};
            this.Direction = -1;
            this.Level = 0;
            this.attr = new H52D_Framework.Attribute();
            this.ratio = H52D_Framework.ActiveSkillConfig[this.SkillID]["damageList"]["1"]["2"] / 10000;
            if (H52D_Framework.BattleManager.Instance.aIOperation) {
                this.attr.SetAttributeValue(2, H52D_Framework.eValueType.Base, H52D_Framework.BattleManager.Instance.aIOperation.PetDps);
            }
            this.attr.SetAttributeValue(5, H52D_Framework.eValueType.Base, 15000);
            this.CurrentState = 0;
            this.ratio = H52D_Framework.ActiveSkillConfig[this.SkillID]["damageList"]["1"]["2"] / 10000;
            this.CD = H52D_Framework.ActiveSkillConfig[this.SkillID]["skillCD"] / 1000;
        }
        Object.defineProperty(BPetVo.prototype, "Path", {
            /**神兽模型路径 */
            get: function () { return H52D_Framework.PetConfig[this.ID].strPetModel; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BPetVo.prototype, "Scla", {
            /**神兽模型大小 */
            get: function () { return H52D_Framework.PetConfig[this.ID].modelScale; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BPetVo.prototype, "SkillID", {
            /**神兽普攻ID */
            get: function () { return H52D_Framework.PetConfig[this.ID].attackSkillID; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BPetVo.prototype, "Level", {
            get: function () {
                return this._level;
            },
            set: function (value) {
                this._level = value;
                if (value < 2) {
                    this.SetAttribute_I();
                }
                else {
                    this.SetAttribute_X();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BPetVo.prototype, "CurrentState", {
            get: function () {
                return this._currentState;
            },
            set: function (value) {
                this._currentState = value;
                if (value == 0) {
                    this.currentAttribute = this._AllAuxAttribute;
                }
                else {
                    this.currentAttribute = this._AllMainAttribute;
                }
                this.OnEffectAttribute();
                this.GetAddAttribute();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BPetVo.prototype, "petName", {
            /**神兽名字 */
            get: function () { return H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.PetConfig[this.ID]["petName"]); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BPetVo.prototype, "petPhyle", {
            /**神兽种族 */
            get: function () { return H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.PetConfig[this.ID]["petPhyle"]); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BPetVo.prototype, "petStory", {
            /**神兽背景 */
            get: function () { return H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.PetConfig[this.ID]["petStory"]); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BPetVo.prototype, "strPetIcon", {
            /**神兽图标 */
            get: function () { return H52D_Framework.PetConfig[this.ID].strPetIcon; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BPetVo.prototype, "petColor", {
            /**神兽品质 */
            get: function () { return H52D_Framework.PetConfig[this.ID].petColor; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BPetVo.prototype, "_initMainAttribute", {
            /**初始化主属性 */
            get: function () { return H52D_Framework.PetConfig[this.ID].initialPrimeAttribute; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BPetVo.prototype, "_initAuxAttribute", {
            /**初始化辅属性 */
            get: function () { return H52D_Framework.PetConfig[this.ID].initialAuxiliaryAttribute; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BPetVo.prototype, "AllMainAttribute", {
            get: function () { return this._AllMainAttribute; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BPetVo.prototype, "AllAuxAttribute", {
            get: function () { return this._AllAuxAttribute; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BPetVo.prototype, "_addMainAttr", {
            /**每X级增加的主属性*/
            get: function () { return H52D_Framework.PetConfig[this.ID].primeAttributeUp; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BPetVo.prototype, "_addAuxiliaryAttr", {
            /**每X级增加的辅属性*/
            get: function () { return H52D_Framework.PetConfig[this.ID].auxiliaryAttributeUp; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BPetVo.prototype, "position", {
            /**神兽tip坐标 */
            get: function () { return H52D_Framework.PetConfig[this.ID].position; },
            enumerable: true,
            configurable: true
        });
        /**获得增加的属性 */
        BPetVo.prototype.GetAddAttribute = function () {
            if (this._currentState == 0) {
                this.addCurrentAttribute_1 = this._addAuxiliaryAttr[1][2];
                this.addCurrentAttribute_2 = this._addAuxiliaryAttr[2][2];
            }
            else {
                this.addCurrentAttribute_1 = this._addMainAttr[1][2];
                this.addCurrentAttribute_2 = this._addMainAttr[2][2];
            }
        };
        /**属性加成效果 */
        BPetVo.prototype.OnEffectAttribute = function () {
            /*** 如果有先清理*/
            for (var i = 0; i < this._attributePassive.length; i++) {
                if (this._attributePassive[i]) {
                    this._attributePassive[i].Destroy();
                    this._attributePassive[i] = null;
                }
            }
            this._attributePassive = [];
            /**获取属性数据 */
            var data = [];
            for (var j = 0; j < H52D_Framework.GetTabLength(this.currentAttribute); j++) {
                data.push(this.currentAttribute[j + 1]);
            }
            /**初始化属性属性 */
            for (var i = 0; i < data.length; i++) {
                var p = new H52D_Framework.ModfiyAttribute(this, data[i]);
                this._attributePassive.push(p);
            }
            /**产生属性加成效果 */
            for (var i = 0; i < this._attributePassive.length; i++) {
                if (this._attributePassive[i]) {
                    this._attributePassive[i].OnEffect();
                }
            }
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.REFFIXEDATTR);
        };
        BPetVo.prototype.OnReset = function () {
            for (var i = 0; i < this._attributePassive.length; i++) {
                if (this._attributePassive[i]) {
                    this._attributePassive[i].OnEffect();
                }
            }
        };
        BPetVo.prototype.GetDamage = function () {
            return H52D_Framework.BattleManager.Instance.aIOperation.PetShoWDamage;
        };
        /**1-4级用初始化属性 */
        BPetVo.prototype.SetAttribute_I = function () {
            this._AllMainAttribute = this._initMainAttribute;
            this._AllAuxAttribute = this._initAuxAttribute;
        };
        /**5级以后，根据等级算出属性的加成 */
        BPetVo.prototype.SetAttribute_X = function () {
            var config = H52D_Framework.PetConfig[this.ID];
            var PrimeAttributeInterval = H52D_Framework.GameParamConfig["PrimeAttributeInterval"];
            var main = this.AddAttribute(this._addMainAttr, PrimeAttributeInterval);
            if (this._level <= 4) {
                this._AllAuxAttribute = this._initAuxAttribute;
            }
            else {
                var AuxiliaryAttributeInterval = H52D_Framework.GameParamConfig["AuxiliaryAttributeInterval"];
                var aux = this.AddAttribute(this._addAuxiliaryAttr, AuxiliaryAttributeInterval);
                this._AllAuxAttribute = this.AddAttributeX(aux, this._initAuxAttribute);
            }
            this._AllMainAttribute = this.AddAttributeX(main, this._initMainAttribute);
            if (this._currentState == 1) {
                this.currentAttribute = this._AllMainAttribute;
            }
            else {
                this.currentAttribute = this._AllAuxAttribute;
            }
            this.OnEffectAttribute();
        };
        /**每X等级加属性*/
        BPetVo.prototype.AddAttribute = function (O, I) {
            var index = 0;
            if (I == 5) {
                var Lv = this._level - 1;
                index = Math.floor(Lv / I);
            }
            else {
                index = Math.floor(this._level / I) - 1;
            }
            if (index <= 0)
                return O;
            var Odd = new Object();
            for (var idx in O) {
                var tAttr = O[idx];
                var id = tAttr[1];
                var value = tAttr[2];
                var modfiy = value * index;
                Odd[idx] = { 1: id, 2: modfiy };
            }
            return Odd;
        };
        /**每X等级加属性*/
        BPetVo.prototype.AddAttributeX = function (add, init) {
            var Odd = new Object();
            for (var idx in add) {
                var aAttr = add[idx];
                var iAttr = init[idx];
                var id = aAttr[1];
                var value = aAttr[2];
                var value2 = iAttr[2];
                var modfiy = value + value2;
                Odd[idx] = { 1: id, 2: modfiy };
            }
            return Odd;
        };
        BPetVo.prototype.UpdatePassiveAttribute = function () {
            for (var i = 1; i <= 5; i++) {
                this.attr.SetAttributeValue(i, H52D_Framework.eValueType.Percent, 0);
                this.attr.SetAttributeValue(i, H52D_Framework.eValueType.Fixed, 0);
            }
            for (var i = 21; i <= 27; i++) {
                this.attr.SetAttributeValue(i, H52D_Framework.eValueType.Percent, 0);
                this.attr.SetAttributeValue(i, H52D_Framework.eValueType.Fixed, 0);
            }
        };
        return BPetVo;
    }());
    H52D_Framework.BPetVo = BPetVo;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=BPetVo.js.map