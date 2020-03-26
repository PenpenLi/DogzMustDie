var H52D_Framework;
(function (H52D_Framework) {
    /**
     * PVP战斗数据类
     * @author zhang zhenming
     */
    var CharacterData = /** @class */ (function () {
        function CharacterData() {
            this._Info = [];
        }
        Object.defineProperty(CharacterData.prototype, "Info", {
            get: function () { return this._Info; },
            enumerable: true,
            configurable: true
        });
        CharacterData.prototype.GetData = function (war, petid) {
            this._Info = [];
            var h = this.GetHeroInfo(war);
            var p = this.GetPetInfo(petid);
            var c = this.GetCampInfo();
            this._Info.push(h);
            this._Info.push(p);
            this._Info.push(c);
            return this._Info;
        };
        CharacterData.prototype.GetHeroInfo = function (War) {
            var info = [];
            for (var _id in War) {
                var vo = H52D_Framework.HeroManager.Instance.GetHero(War[_id]);
                if (!vo) {
                    continue;
                }
                vo.location = Number(_id);
                info.push(vo);
            }
            return info;
        };
        CharacterData.prototype.GetPetInfo = function (id) {
            var info = {};
            if (id > 0) {
                info = H52D_Framework.BPetManager.Instance.LoadBPetinfo(id);
            }
            return info;
        };
        CharacterData.prototype.GetCampInfo = function () {
            var info = {};
            if (H52D_Framework.MasterPlayer.Instance.player.CampID > 0)
                info = H52D_Framework.BCampManager.Instance.vo;
            return info;
        };
        return CharacterData;
    }());
    H52D_Framework.CharacterData = CharacterData;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=CharacterData.js.map