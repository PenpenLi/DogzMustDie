var H52D_Framework;
(function (H52D_Framework) {
    /**数据打包 */
    var DataPack = /** @class */ (function () {
        function DataPack() {
            this.Info = {};
            this.EInfo = {};
            this.heroInfo = {};
            this.petInfo = {};
            this.campInfo = {};
            this.Playerinfo = {};
            this.AttributeInfo = {};
            this.TypeArray = ["Hero", "Pet", "Camp", "Player", "Attribute"];
        }
        Object.defineProperty(DataPack, "Instance", {
            get: function () {
                if (this._instance == null) {
                    this._instance = new DataPack();
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        DataPack.prototype.PackHeroInfo = function (info) {
            for (var k in info) {
                this.heroInfo[Number(k)] = {
                    id: info[k].nHeroID,
                    level: info[k].Level,
                    star: info[k].Star,
                    location: info[k].location
                };
            }
        };
        DataPack.prototype.PackPetInfo = function (info) {
            if (!H52D_Framework.ObjIsEmpty(info)) {
                this.petInfo[0] = { id: info.ID, level: info.Level };
            }
            else {
                this.petInfo[0] = info;
            }
        };
        DataPack.prototype.PackCampInfo = function (info) {
            if (!H52D_Framework.ObjIsEmpty(info)) {
                this.campInfo[0] = { level: info.Level, Base: info.attr.GetAttributeTypeValue(2, H52D_Framework.eValueType.Base) };
            }
            else {
                this.campInfo[0] = info;
            }
        };
        DataPack.prototype.PackPlayerInfo = function () {
            var info = H52D_Framework.MasterPlayer.Instance.player;
            this.Playerinfo[0] = {
                level: info.Level,
                MpMax: info.vo.attr.GetAttributeValue(51),
                MpRec: info.vo.attr.GetAttributeValue(53),
                Cmp: info.Mp,
                isVip: info.IsVip,
                sList: info.SkillList
            };
        };
        DataPack.prototype.PackAttribute = function () {
            var objs = [];
            this.AttributeInfo = [];
            var hero = H52D_Framework.HeroManager.Instance.Herolist;
            for (var k in hero) {
                var heroi = hero[k];
                var pass = heroi.attributeID;
                for (var i in pass) {
                    var p = H52D_Framework.PassiveSkillConfig[pass[i]];
                    objs.push(p["scriptParam"]);
                }
            }
            var petL = H52D_Framework.PetManager.Instance.OwnPetList;
            for (var k in petL) {
                if (petL[k]) {
                    var s = petL[k].currentAttribute;
                    objs.push(s[1]);
                    objs.push(s[2]);
                }
            }
            var eqa = H52D_Framework.EquipManager.Instance.CurrentAttrributeList;
            for (var k in eqa) {
                if (eqa[k]) {
                    for (var i in eqa[k]) {
                        if (eqa[k][i]) {
                            objs.push(eqa[k][i].getData);
                        }
                    }
                }
            }
            var eqs = H52D_Framework.EquipManager.Instance.CurrentAttrributeList;
            for (var k in eqs) {
                if (eqs[k]) {
                    for (var i in eqs[k]) {
                        if (eqs[k][i]) {
                            objs.push(eqs[k][i].getData);
                        }
                    }
                }
            }
            for (var i = objs.length - 1; i >= 0; i--) {
                if (objs[i][1] == 9 || objs[i][1] == 10) {
                    objs.splice(i, 1);
                }
            }
            this.AttributeInfo = objs.concat();
        };
        DataPack.prototype.Pack = function () {
            this.Info[this.TypeArray[0]] = this.heroInfo;
            this.Info[this.TypeArray[1]] = this.petInfo;
            this.Info[this.TypeArray[2]] = this.campInfo;
            this.Info[this.TypeArray[3]] = this.Playerinfo;
            this.Info[this.TypeArray[4]] = this.AttributeInfo;
        };
        DataPack.prototype.Destroy = function () {
            this.Info = {};
            this.EInfo = {};
            this.AttributeInfo = [];
            this.Playerinfo = {};
            this.petInfo = {};
            this.campInfo = {};
            this.heroInfo = {};
        };
        DataPack._instance = null;
        return DataPack;
    }());
    H52D_Framework.DataPack = DataPack;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=DataPack.js.map