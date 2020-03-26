var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("Hero_AlInfo", [
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
    ]);
    var Hero_AlInfo = /** @class */ (function (_super) {
        __extends(Hero_AlInfo, _super);
        function Hero_AlInfo(buf) {
            var _this = _super.call(this) || this;
            _this._bool = false;
            _this.listInfo = [];
            _this._HeroID = buf[1];
            _this.skill_panel.vScrollBarSkin = "";
            var cfg = H52D_Framework.HeroConfig[_this._HeroID].heroPassiveSkill;
            _this.listInfo = [];
            for (var idx in cfg) {
                var info = cfg[idx];
                _this.listInfo.push(info);
            }
            _this.Info();
            _this.UpdateList();
            _this.ViewEvent();
            _this.GetHeroMolde();
            return _this;
        }
        Hero_AlInfo.prototype.ViewEvent = function () {
            this.hero_peck.on(Laya.Event.CLICK, this, this.Btnclick_openview);
            this.close.on(Laya.Event.CLICK, this, this.BtnClick);
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.REFFIXEDATTR, Laya.Handler.create(this, this.Info));
            this.on(Laya.Event.REMOVED, this, this.OnDestroy);
        };
        Hero_AlInfo.prototype.UpdateList = function () {
            this.skill_List.array = this.listInfo;
            //this.skill_List.repeatY = this.skill_List.array.length;
            this.skill_List.height = this.listInfo.length * 104;
            this.skill_List.renderHandler = new Laya.Handler(this, this.OtherSkill);
        };
        Hero_AlInfo.prototype.OtherSkill = function (item, index) {
            var nHeroID = this._HeroID;
            var hero = H52D_Framework.HeroManager.Instance.GetHero(nHeroID);
            var lv = hero ? hero.Level : 1;
            var info = this.listInfo[index];
            var SkillID = info[1];
            // 解锁技能等级
            var a = this.skill_List.array.length;
            var SKillFlag = info[2];
            var tSkillCfg = H52D_Framework.PassiveSkillConfig[SkillID];
            var skillNameID = tSkillCfg.nameId;
            var icon = item.getChildByName("skill_Icon");
            var skillOrigin = item.getChildByName("skill_Base");
            var skillLock = item.getChildByName("SkillLock");
            var skilllv = item.getChildByName("SkillLv");
            var openlock = item.getChildByName("openlock");
            skilllv.text = "lv." + SKillFlag.toString();
            H52D_Framework.SetHtmlStyle(skillOrigin, 20, "#d7e6ff", "left");
            skillOrigin.innerHTML = H52D_Framework.GetInfoAttr.Instance.GetText(tSkillCfg.descId);
            icon.skin = "ui_icon/" + tSkillCfg.strIcon;
            var name = item.getChildByName("skill_Name");
            name.text = H52D_Framework.GetInfoAttr.Instance.GetText(skillNameID);
            skillLock.visible = true;
            if (SKillFlag <= lv) {
                skillLock.visible = false;
                skilllv.visible = false;
                openlock.visible = false;
            }
        };
        Hero_AlInfo.prototype.Info = function () {
            var tcfg_hero = H52D_Framework.HeroConfig[this._HeroID];
            var pos = tcfg_hero.position;
            var ntype = tcfg_hero.type;
            this.heroIcon_bg.skin = H52D_Framework.BaseDefine.HeroAllinfo_bg[tcfg_hero.quality];
            var hero = H52D_Framework.HeroManager.Instance.GetHero(this._HeroID);
            var nActive = H52D_Framework.HeroManager.Instance.IsActive(this._HeroID);
            var buyed = H52D_Framework.HeroManager.Instance.Heropeck_IsBuy(this._HeroID);
            var peck_icon = H52D_Framework.HeroManager.Instance.PeckIcon;
            var is_inpeck = H52D_Framework.HeroManager.Instance.HeroIsHave_peck(this._HeroID);
            this.hero_peck.visible = is_inpeck && nActive && peck_icon && buyed;
            var star = hero ? hero.Star : 1;
            if (H52D_Framework.IsAD() && !H52D_Framework.IsShieldRecharge() && H52D_Framework.IsNotBaiDuSdk()) {
                this.hero_peck.visible = H52D_Framework.IsAD();
            }
            var _add;
            if (!H52D_Framework.HeroManager.Instance.Heropeck_IsBuy(this._HeroID)) {
                this.hero_peck.visible = false;
            }
            if (hero) {
                if (hero.Star == 0) {
                    star = 1;
                    _add = 0;
                }
                else {
                    star = hero.Star;
                    _add = H52D_Framework.HeroAdvanceConfig[this._HeroID][star].Attr[1][2] / 10000;
                }
            }
            else {
                _add = 0;
            }
            this.herolevel;
            var base = H52D_Framework.HeroAdvanceConfig[this._HeroID][star].Attr;
            var lv = hero ? hero.Level : 1;
            var info = H52D_Framework.HeroConfig[this._HeroID];
            var nx = info.heroRatio;
            var heroinfos = info.stationaryAttribute;
            var list = info.heroBigSkill;
            var herobase = H52D_Framework.HeroUpgrateConfig[info.type][lv].Attr;
            this.herolevel.text = hero != null ? hero.Level + "级" : "1级";
            if (hero) {
                if (hero.Star != 0) {
                    this.herolevel.text = hero.Star + "阶" + hero.Level + "级";
                }
            }
            this.heroName.text = H52D_Framework.GetInfoAttr.Instance.GetText(info.name);
            this.heroName.color = H52D_Framework.BaseDefine.LabelColor[tcfg_hero.quality];
            this.heroOrigin.text = H52D_Framework.GetInfoAttr.Instance.GetText(info.heroOrigin);
            var tData = H52D_Framework.ActiveSkillConfig[info.heroBigSkill];
            this.Teamskill_Icon.skin = "ui_icon/" + tData.strIcon;
            this.skill_Name.text = H52D_Framework.GetInfoAttr.Instance.GetText(tData.nameId) + "(作为队长时候才能生效)";
            H52D_Framework.SetHtmlStyle(this.skill_Origin, 18, "#d7e6ff", "left");
            this.skill_Origin.innerHTML = H52D_Framework.GetInfoAttr.Instance.GetText(tData.descId);
            H52D_Framework.Tick.Loop(60000, this, this.GetHeroMolde);
            // 设置升级属性
            for (var nIdx = 1; nIdx <= 2; nIdx++) {
                var attNameLable = this["heroattl" + nIdx];
                var valLable = this["val" + nIdx];
                var attrInfo = herobase[nIdx];
                var nAttrID = attrInfo[1];
                var nAttrVal = Math.floor((attrInfo[2] * nx) * (1 + _add)).toString();
                var nName = H52D_Framework.QualityValue[nAttrID].dwName;
                var isper = H52D_Framework.QualityValue[nAttrID].isper;
                attNameLable.text = H52D_Framework.GetInfoAttr.Instance.GetText(nName) + "：";
                if (isper == 1) {
                    //nAttrVal = nAttrVal / 10000 + "%"
                }
                valLable.text = nAttrVal;
                if (hero) {
                    valLable.text = hero.attr.GetAttributeValue(nIdx);
                }
            }
            //基础属性
            for (var nIdx = 3; nIdx <= 5; nIdx++) {
                var attNameLable = this["heroattl" + nIdx];
                var valLable = this["val" + nIdx];
                var atteInfo = heroinfos[(nIdx - 2)];
                var nattrID = atteInfo[1];
                var nattrval = atteInfo[2];
                var nName = H52D_Framework.QualityValue[nattrID].dwName;
                var isper = H52D_Framework.QualityValue[nattrID].isper;
                attNameLable.text = H52D_Framework.GetInfoAttr.Instance.GetText(nName) + "：";
                valLable.text = nattrval.toString();
                if (isper == 1) {
                    nattrval = nattrval / 100 + "%";
                    if (hero) {
                        var value = hero.attr.GetAttributeValue(nIdx);
                        if (nIdx == 4 && value > 10000) {
                            value = 10000;
                        }
                        valLable.text = value / 100 + "%";
                    }
                    else {
                        valLable.text = nattrval.toString();
                    }
                }
                else {
                    if (hero) {
                        valLable.text = hero.attr.GetAttributeValue(nIdx) + "";
                    }
                }
            }
            this.SetHeropeck_red();
            var a = H52D_Framework.HeroManager.Instance.GetHeroPecktime(this._HeroID);
            this._time = a - H52D_Framework.Time.serverSecodes;
            if (this.hero_peck.visible) {
                H52D_Framework.Tick.Loop(100, this, this.nHero_time);
            }
        };
        Hero_AlInfo.prototype.SetHeropeck_red = function () {
            var bool = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.hero, this._HeroID);
            var bools = H52D_Framework.HeroManager.Instance.Heropeck_IsBuy(this._HeroID);
            this.heropeck_red.visible = !bool && bools;
        };
        Hero_AlInfo.prototype.nHero_time = function () {
            this.peck_time.text = H52D_Framework.GetFormatTime(this._time) + "";
            this._time -= 0.1;
        };
        Hero_AlInfo.prototype.GetHeroMolde = function () {
            var _this = this;
            if (this.heroModle) {
                this.heroModle.Destroy();
            }
            var tcfg_hero = H52D_Framework.HeroConfig[this._HeroID];
            var pos = tcfg_hero.position;
            this.heroModle = new H52D_Framework.Avatar(this.heroIcon);
            this.heroModle.Load(tcfg_hero.strFacadeModel, 1, tcfg_hero.modelScale * 2.6, pos[1], pos[2], Laya.Handler.create(this, function () {
                // this.heroModle.Play(1, true, true, () => {
                // }, true)
                _this.heroModle.Play(H52D_Framework.AnimationName.idle);
            }));
        };
        Hero_AlInfo.prototype.BtnClick = function (buf) {
            H52D_Framework.UIManager.Instance.DestroyUI(this, [H52D_Framework.ViewToppestRoot]);
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.REFFIXEDATTR, Laya.Handler.create(this, this.Info));
        };
        Hero_AlInfo.prototype.Btnclick_openview = function () {
            H52D_Framework.CacheManager.Instance.setDerailByType(CacheTypeEnum.hero, this._HeroID, true);
            if (H52D_Framework.UIManager.Instance.IsHave("HeroStarPeckView", H52D_Framework.ViewUpRoot)) {
                H52D_Framework.UIManager.Instance.DestroyUI("HeroStarPeckView", [H52D_Framework.ViewUpRoot]);
            }
            H52D_Framework.UIManager.Instance.CreateUI("HeroStarPeckView", [H52D_Framework.ViewUpRoot]);
            H52D_Framework.UIManager.Instance.DestroyUI("Hero_AlInfo", [H52D_Framework.ViewToppestRoot]);
        };
        Hero_AlInfo.prototype.OnDestroy = function () {
            if (this.heroModle) {
                this.heroModle.Destroy();
                this.heroModle = null;
            }
            this.offAll();
        };
        return Hero_AlInfo;
    }(ui.heroList.Hero_AlInfoUI));
    H52D_Framework.Hero_AlInfo = Hero_AlInfo;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Hero_AlInfo.js.map