/**
* name
*/
var H52D_Framework;
(function (H52D_Framework) {
    var MHAManager = /** @class */ (function () {
        function MHAManager() {
            this._Map = [];
            this._SMap = [];
        }
        Object.defineProperty(MHAManager, "Instance", {
            get: function () {
                if (!MHAManager._instance) {
                    MHAManager._instance = new MHAManager();
                }
                return MHAManager._instance;
            },
            enumerable: true,
            configurable: true
        });
        MHAManager.prototype.Init = function () {
            var arr = H52D_Framework.HeroHandbookManager.Instance.Active_HandBook();
            for (var k in arr) {
                var id = H52D_Framework.RelationConfig[Number(k)].HeroId;
                var attr = H52D_Framework.HandbookUpConfig[arr[k]].AddAttribute;
                this.Add(id, attr);
            }
        };
        MHAManager.prototype.InitS = function () {
            var arr = H52D_Framework.HeroHandbookManager.Instance.MostHandbookInfo();
            for (var k in arr) {
                this.HandBookMoreAttribute(k, arr[k]);
            }
        };
        MHAManager.prototype.HandBookMoreAttribute = function (id, level) {
            var Loc = H52D_Framework.HandbookTeamConfig[id].AttackStation;
            var attr = H52D_Framework.HandbookTeamConfig[id].Attritue;
            var upattr = H52D_Framework.HandbookTeamConfig[id].UpAttritue;
            var Sum = attr;
            if (level >= 2) {
                var up = this.AddUpdateAttribute(level - 1, upattr);
                Sum = this.AttributeAdd(attr, up);
            }
            this.AddArrary(Loc, Sum, id);
        };
        MHAManager.prototype.AddUpdateAttribute = function (index, UpAttr) {
            if (index <= 0)
                return UpAttr;
            var Odd = new Object();
            for (var k in UpAttr) {
                var modfiy = UpAttr[k][2] * index;
                Odd[k] = { 1: UpAttr[k][1], 2: modfiy };
            }
            return Odd;
        };
        MHAManager.prototype.AttributeAdd = function (first, second) {
            var Odd = new Object();
            for (var k in second) {
                var sAttr = second[k];
                var fAttr = first[k];
                var id = sAttr[1];
                var svalue = sAttr[2];
                var fvalue = fAttr[2];
                var modfiy = svalue + fvalue;
                Odd[k] = { 1: id, 2: modfiy };
            }
            return Odd;
        };
        /**添加属性 */
        MHAManager.prototype.Add = function (id, attr) {
            for (var k in this._Map) {
                if (this._Map[k] && this._Map[k].HeroId == id) {
                    this.Update(this._Map[k], attr);
                    return;
                }
            }
            var map = new H52D_Framework.MapHeroAttribute(id, attr);
            map.OnEffect();
            this._Map.push(map);
        };
        MHAManager.prototype.AddArrary = function (loction, attr, id) {
            for (var k in this._SMap) {
                if (this._SMap[k] && this._SMap[k].mid == id) {
                    this.SUpdate(this._SMap[k], loction, attr);
                    return;
                }
            }
            var map = new H52D_Framework.MapAttrbute(loction, attr, id);
            map.OnEffect();
            this._SMap.push(map);
        };
        MHAManager.prototype.Update = function (attr, data) {
            attr.OnUpdate(data);
        };
        MHAManager.prototype.SUpdate = function (attr, location, data) {
            attr.OnUpdate(location, data);
        };
        MHAManager.prototype.LUpdate = function () {
            for (var k in this._SMap) {
                if (this._SMap[k]) {
                    this._SMap[k].Update();
                }
            }
        };
        MHAManager.prototype.OnRest = function () {
            for (var k in this._Map) {
                if (this._Map[k]) {
                    this._Map[k].OnEffect();
                }
            }
            for (var k in this._SMap) {
                if (this._SMap[k]) {
                    this._SMap[k].OnEffect();
                }
            }
        };
        MHAManager._instance = null;
        return MHAManager;
    }());
    H52D_Framework.MHAManager = MHAManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MHAManager.js.map