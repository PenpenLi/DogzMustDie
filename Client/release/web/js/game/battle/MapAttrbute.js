/**
* name
*/
var H52D_Framework;
(function (H52D_Framework) {
    var MapAttrbute = /** @class */ (function () {
        function MapAttrbute(location, Data, id) {
            this._target = [];
            this._Data = {};
            this._Location = {};
            this._mid = 0;
            this._Location = location;
            this._Data = Data;
            this._mid = id;
        }
        Object.defineProperty(MapAttrbute.prototype, "mid", {
            get: function () { return this._mid; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapAttrbute.prototype, "Herolist", {
            get: function () {
                return H52D_Framework.HeroCardManager.Instance.CHeroList;
            },
            enumerable: true,
            configurable: true
        });
        MapAttrbute.prototype.HeroTarget = function () {
            this._target = [];
            for (var k in this._Location) {
                for (var i in this.Herolist) {
                    var x = this._Location[k] - 1;
                    var y = this.Herolist[i].vo.location;
                    var id = this.Herolist[i].vo.id;
                    if (this.Herolist[i] && this.Herolist[i].vo.location == this._Location[k] - 1) {
                        this._target.push(this.Herolist[i]);
                    }
                }
            }
        };
        MapAttrbute.prototype.OnEffect = function () {
            this.HeroTarget();
            if (this._target.length <= 0)
                return;
            for (var k in this._target) {
                for (var i in this._Data) {
                    this.AddAttribute(this._target[k], this._Data[i]);
                }
            }
        };
        MapAttrbute.prototype.OnUpdate = function (location, data) {
            this.Destroy();
            this._Data = data;
            this._Location = location;
            this.OnEffect();
        };
        MapAttrbute.prototype.Update = function () {
            this.Destroy();
            this.OnEffect();
        };
        /**为单个目标 修改属性 */
        MapAttrbute.prototype.AddAttribute = function (target, data) {
            var attr = target.vo.attr;
            var modfiy_id = attr.GetAttributeModfiyID(data[1]);
            var isPercent = attr.GetAttributeIsPer(modfiy_id);
            if (isPercent == 1) {
                attr.ModfiyAttributeValue(modfiy_id, H52D_Framework.eValueType.Percent, data[2]);
            }
            else {
                attr.ModfiyAttributeValue(modfiy_id, H52D_Framework.eValueType.Fixed, data[2]);
            }
        };
        /**
         * 删除增加的属性
         * @param target 目标
         */
        MapAttrbute.prototype.RemoveAttribute = function (target, data) {
            var attr = target.vo.attr;
            var modfiy_id = attr.GetAttributeModfiyID(data[1]);
            var isPercent = attr.GetAttributeIsPer(modfiy_id);
            if (isPercent == 1) {
                attr.ModfiyAttributeValue(modfiy_id, H52D_Framework.eValueType.Percent, -data[2]);
            }
            else {
                attr.ModfiyAttributeValue(modfiy_id, H52D_Framework.eValueType.Fixed, -data[2]);
            }
        };
        MapAttrbute.prototype.Destroy = function () {
            for (var k in this._target) {
                for (var i in this._Data) {
                    this.RemoveAttribute(this._target[k], this._Data[i]);
                }
            }
        };
        return MapAttrbute;
    }());
    H52D_Framework.MapAttrbute = MapAttrbute;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MapAttrbute.js.map