/**
* name
*/
var H52D_Framework;
(function (H52D_Framework) {
    var MapHeroAttribute = /** @class */ (function () {
        /**
         * 初始化
         * @param data 属性数据
         */
        function MapHeroAttribute(id, data) {
            /**作用目标 */
            this._target = null;
            this._data = {};
            this.heroid = 0;
            this._data = data;
            this.heroid = id;
        }
        Object.defineProperty(MapHeroAttribute.prototype, "getData", {
            get: function () { return this._data; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapHeroAttribute.prototype, "HeroId", {
            /**英雄id  唯一性 */
            get: function () { return this.heroid; },
            enumerable: true,
            configurable: true
        });
        MapHeroAttribute.prototype.OnUpdate = function (data) {
            this.Destroy();
            this._data = data;
            this.OnEffect();
        };
        MapHeroAttribute.prototype.OnRest = function () {
            this.Destroy();
            this.OnEffect();
        };
        /**产生效果 */
        MapHeroAttribute.prototype.OnEffect = function () {
            this._target = null;
            this._target = this.GetHeroId(this.heroid);
            if (!this._target)
                return;
            for (var k in this._data) {
                this.AddAttribute(this._data[k][1], this._data[k][2]);
            }
        };
        MapHeroAttribute.prototype.GetHeroId = function (id) {
            var heroList = H52D_Framework.HeroManager.Instance.Herolist;
            for (var k in heroList) {
                if (heroList[k].nHeroID == id) {
                    return heroList[k];
                }
            }
        };
        /**为单个目标 修改属性 */
        MapHeroAttribute.prototype.AddAttribute = function (id, value) {
            var attr = this._target.attr;
            var modfiy_id = attr.GetAttributeModfiyID(id);
            var isPercent = attr.GetAttributeIsPer(modfiy_id);
            if (isPercent == 1) {
                attr.ModfiyAttributeValue(modfiy_id, H52D_Framework.eValueType.Percent, value);
            }
            else {
                attr.ModfiyAttributeValue(modfiy_id, H52D_Framework.eValueType.Fixed, value);
            }
        };
        /*** 删除增加的属性*/
        MapHeroAttribute.prototype.RemoveAttribute = function (id, value) {
            if (!this._target)
                return;
            var attr = this._target.attr;
            var modfiy_id = attr.GetAttributeModfiyID(id);
            var isPercent = attr.GetAttributeIsPer(modfiy_id);
            if (isPercent == 1) {
                attr.ModfiyAttributeValue(modfiy_id, H52D_Framework.eValueType.Percent, -value);
            }
            else {
                attr.ModfiyAttributeValue(modfiy_id, H52D_Framework.eValueType.Fixed, -value);
            }
        };
        /**销毁 */
        MapHeroAttribute.prototype.Destroy = function () {
            for (var k in this._data) {
                this.RemoveAttribute(this._data[k][1], this._data[k][2]);
            }
        };
        return MapHeroAttribute;
    }());
    H52D_Framework.MapHeroAttribute = MapHeroAttribute;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MapHeroAttribute.js.map