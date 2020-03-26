var H52D_Framework;
(function (H52D_Framework) {
    /**数据解包 */
    var DataUnPack = /** @class */ (function () {
        function DataUnPack(data) {
            this.HeroList = [];
            this.PetList = [];
            this.Camp = null;
            this.Playinfo = null;
            this.AttributeInfo = [];
            this.TypeArray = ["Hero", "Pet", "Camp", "Player", "Attribute"];
            this.Info = {};
            this.UnHeroData(data[this.TypeArray[0]]);
            this.UnPetData(data[this.TypeArray[1]]);
            this.UnCampData(data[this.TypeArray[2]]);
            this.UnPlayerData(data[this.TypeArray[3]]);
            this.UnAttribute(data[this.TypeArray[4]]);
            this.Info = {
                player: this.Playinfo,
                heroList: this.HeroList,
                pet: this.PetList,
                camp: this.Camp
            };
        }
        DataUnPack.prototype.UnHeroData = function (data) {
            for (var k in data) {
                var info = new H52D_Framework.PheroInfo(data[k]);
                this.HeroList.push(info);
            }
        };
        DataUnPack.prototype.UnPetData = function (data) {
            for (var k in data) {
                if (!H52D_Framework.ObjIsEmpty(data[k])) {
                    var info = new H52D_Framework.PPetInfo(data[k]);
                    this.PetList.push(info);
                }
            }
        };
        DataUnPack.prototype.UnCampData = function (data) {
            for (var k in data) {
                if (!H52D_Framework.ObjIsEmpty(data[k])) {
                    var info = new H52D_Framework.PCampInfo(data[k]);
                    this.Camp = info;
                }
            }
        };
        DataUnPack.prototype.UnPlayerData = function (data) {
            for (var k in data) {
                var info = new H52D_Framework.PPlayerInfo(data[k]);
                this.Playinfo = info;
            }
        };
        DataUnPack.prototype.UnAttribute = function (data) {
            if (!H52D_Framework.ObjIsEmpty(data)) {
                for (var k in data) {
                    var p = new H52D_Framework.PAttribute(data[k]);
                    this.AttributeInfo.push(p);
                }
            }
        };
        return DataUnPack;
    }());
    H52D_Framework.DataUnPack = DataUnPack;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=DataUnPack.js.map