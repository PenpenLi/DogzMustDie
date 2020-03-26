var H52D_Framework;
(function (H52D_Framework) {
    var SettingLogic = /** @class */ (function () {
        function SettingLogic() {
        }
        Object.defineProperty(SettingLogic, "Instance", {
            get: function () {
                if (SettingLogic._inst == null) {
                    SettingLogic._inst = new SettingLogic();
                }
                return SettingLogic._inst;
            },
            enumerable: true,
            configurable: true
        });
        SettingLogic.prototype.Initialize = function () {
            this._defaultVo = new H52D_Framework.HeadVo();
            this.InitEvent();
        };
        SettingLogic.prototype.InitEvent = function () {
        };
        Object.defineProperty(SettingLogic.prototype, "defaultVo", {
            get: function () {
                this._defaultVo.headId = 0;
                this._defaultVo.headRes = "ui_head/icon_ui_01.png";
                this._defaultVo.headSelect = true;
                return this._defaultVo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingLogic.prototype, "headList", {
            get: function () {
                var list = new Array();
                this.heroHead = H52D_Framework.HeroManager.Instance.GetCfgHeroList();
                for (var i = 0; i < this.heroHead.length; i++) {
                    var nHeroID = this.heroHead[i];
                    var bActive = H52D_Framework.HeroManager.Instance.IsActive(nHeroID);
                    if (bActive) {
                        var hvo = new H52D_Framework.HeadVo();
                        hvo.headId = nHeroID;
                        hvo.headRes = "ui_icon/" + H52D_Framework.HeroConfig[nHeroID].strIcon;
                        hvo.headSelect = nHeroID == this._defaultVo.headId;
                        list.push(hvo);
                    }
                }
                list.unshift(this.defaultVo);
                return list;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingLogic.prototype, "cost", {
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        return SettingLogic;
    }());
    H52D_Framework.SettingLogic = SettingLogic;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=SettingLogic.js.map