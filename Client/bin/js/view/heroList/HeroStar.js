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
/**Created by the LayaAirIDE*/
var H52D_Framework;
(function (H52D_Framework) {
    var HeroStar = /** @class */ (function (_super) {
        __extends(HeroStar, _super);
        function HeroStar(buf) {
            var _this = _super.call(this) || this;
            _this._once = false;
            _this.bool = false;
            _this.heroList = []; //存放英雄的id
            _this.bGuidanceButton = true;
            _this.AddEvent();
            _this.heroStar_List.vScrollBarSkin = "";
            _this.UpdateList();
            _this.ChangeListHigth();
            _this.Refesh();
            return _this;
        }
        HeroStar.prototype.AddEvent = function () {
            H52D_Framework.Event.RegistEvent('ReqHeroStartUps', Laya.Handler.create(this, this.ReqHeroStartUps)); //ClickBtnStar
            H52D_Framework.Event.RegistEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
            H52D_Framework.Event.RegistEvent('ClickBtnStar', Laya.Handler.create(this, this.NewTeach_Star));
            H52D_Framework.Event.DispatchEvent("ShowMaxBtn", [true]);
        };
        HeroStar.prototype.OnDestroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent('ReqHeroStartUps', Laya.Handler.create(this, this.ReqHeroStartUps));
            H52D_Framework.Event.RemoveEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
            H52D_Framework.Event.RemoveEvent('ClickBtnStar', Laya.Handler.create(this, this.NewTeach_Star));
        };
        HeroStar.prototype.ChangeListHigth = function () {
            if (H52D_Framework.ViewUILogic.Instance.halfPanel) {
                if (this.destroyed)
                    return;
                this.heroStar_List.height = 230 * G_StageHeightScale;
            }
            else {
                this.heroStar_List.height = (1040 - wxsclae) * G_StageHeightScale;
            }
        };
        /** 进阶成功 */
        HeroStar.prototype.ReqHeroStartUps = function () {
            H52D_Framework.TipsLogic.Instance.OpenSystemTips("英雄进阶成功！");
            //this.UpdateList();
            this.Refesh();
            this.LvUpEffect();
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.MODIFYATTR, [this.nHeroID]);
        };
        /***播放晋阶特效 */
        HeroStar.prototype.LvUpEffect = function () {
            var _this = this;
            this._Lveffect = new H52D_Framework.Avatar(this._icon);
            this._Lveffect.Load("res/effect/effect_ui_shengji/effect_ui_shengji.sk", 1, 2, 46, 46, Laya.Handler.create(this, function () {
                //this._Lveffect.visible=true;
                _this._Lveffect.Play("effect_ui_shengji", false, true, function () {
                    _this._Lveffect.Destroy();
                });
            }));
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/level_up.mp3");
        };
        HeroStar.prototype.UpdateList = function () {
            this.heroList = H52D_Framework.HeroManager.Instance.GetCfgHeroList();
            this.SortHero(true);
            this.heroStar_List.array = this.heroList;
            this.heroStar_List.renderHandler = new Laya.Handler(this, this.ListStar);
            //刷新红点
            H52D_Framework.Event.DispatchEvent("UpdateRedPoint");
        };
        HeroStar.prototype.Refesh = function () {
            this.heroList = H52D_Framework.HeroManager.Instance.GetCfgHeroList();
            this.heroStar_List.array = this.heroList;
            this.heroStar_List.renderHandler = new Laya.Handler(this, this.ListStar);
            //刷新红点
            H52D_Framework.Event.DispatchEvent("UpdateRedPoint");
            this.SortHero();
        };
        /**新手指导 激活英雄 */
        HeroStar.prototype.NewTeach_Star = function () {
            var nHeroId = this.heroList[0];
            this.BtnStatUp(nHeroId);
        };
        HeroStar.prototype.SortHero = function (bool) {
            function tsort(left, right) {
                var leftActive = H52D_Framework.HeroManager.Instance.IsActive(left);
                var leftCan = leftActive && H52D_Framework.HeroManager.Instance.HeroIsStar(left);
                var left_quality = H52D_Framework.HeroConfig[left].heroPosition;
                var rightActive = H52D_Framework.HeroManager.Instance.IsActive(right);
                var rightCan = rightActive && H52D_Framework.HeroManager.Instance.HeroIsStar(right);
                var right_quality = H52D_Framework.HeroConfig[right].heroPosition;
                if (leftCan != rightCan) {
                    return leftCan ? -1 : 1;
                }
                if (leftActive != rightActive) {
                    return leftActive ? -1 : 1;
                }
                if (left_quality && left_quality != right_quality) {
                    return left_quality < right_quality ? -1 : 1;
                }
                return left - right;
            }
            if (bool) {
                this.heroList.sort(tsort);
            }
        };
        /**对英雄列表赋值 */
        HeroStar.prototype.ListStar = function (item, index) {
            //let lock: Laya.Image = item.getChildByName("Lock");
            var icon = item.getChildByName("hero_Icon");
            var icon_bg = item.getChildByName("pinzhi_bg");
            var name = item.getChildByName("hero_Name");
            var hp = item.getChildByName("hero_Hp");
            var hurt = item.getChildByName("hero_Hurt");
            var starNum = item.getChildByName("hero_StarNum");
            var btn_starup = item.getChildByName("Btn_StarUp");
            var up_start = btn_starup.getChildByName("UP_Start");
            var type_icon = item.getChildByName("hero_TypeIcon");
            //let itemNum: Laya.Label = item.getChildByName("ItemNum");
            //let heropoker: Laya.Image = btn_starup.getChildByName("Hero_Poker") as Laya.Image;
            var Star_Max = item.getChildByName("Star_Max");
            var Star_Maximg = item.getChildByName("star_max");
            var changeBase = btn_starup.getChildByName("BaseChange");
            var item_num = btn_starup.getChildByName("ItemNum");
            var btnlock = item.getChildByName("Btn_lock");
            //引导按钮
            if (index == 0 && this.bGuidanceButton) {
                H52D_Framework.Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_5 + 1000, btn_starup);
                this.bGuidanceButton = false;
            }
            var max_star = H52D_Framework.HeroManager.Instance.HeroMaxStar;
            Star_Maximg.visible = Star_Max.visible;
            item_num.mouseThrough = true;
            var heroid = this.heroList[index];
            var info = H52D_Framework.HeroConfig[heroid];
            var hero = H52D_Framework.HeroManager.Instance.GetHero(heroid);
            icon_bg.skin = H52D_Framework.BaseDefine.QualityList[info.quality];
            var nActive = H52D_Framework.HeroManager.Instance.IsActive(heroid); //英雄是否激活
            Star_Max.visible = false;
            var path = "<img src= " + "'ui_icon/" + info.strIcon + "'" + " width='24px' height='24px'></img>";
            icon.gray = true;
            if (nActive) {
                btn_starup.visible = true;
                up_start.visible = true;
                icon.gray = false;
                var star = hero.Star == 0 ? 1 : hero.Star;
                if (hero.Star == 0) {
                    star = 1;
                }
                else {
                    star = hero.Star;
                }
                type_icon.skin = H52D_Framework.BaseDefine.HeroTypeIcon[hero.heroCfg.type];
                if (hero.Star == H52D_Framework.HeroManager.Instance.HeroMaxStar) {
                    item_num.visible = false;
                    changeBase.visible = false;
                    Star_Max.visible = true;
                    Star_Maximg.visible = Star_Max.visible;
                    btn_starup.visible = false;
                    var nstarc_Cfg = H52D_Framework.HeroAdvanceConfig[heroid][star];
                    for (var i = 1; i <= max_star; i++) {
                        var star_1 = item.getChildByName("Star_Icon" + i);
                        star_1.visible = true;
                    }
                    type_icon.visible = true;
                    icon.skin = hero.HeadIcon;
                    starNum.text = hero.Star.toString() + "阶"; //
                    item_num.innerHTML = path + nstarc_Cfg.Consume[1][2].toString();
                    var basename = nstarc_Cfg.Attr[1][1];
                    var basevalue = (nstarc_Cfg.Attr[1][2] / 100 + "%").toString();
                    hp.text = H52D_Framework.GetInfoAttr.Instance.GetText(basename) + "X" + basevalue;
                    hurt.text = H52D_Framework.GetInfoAttr.Instance.GetText(nstarc_Cfg.Attr[2][1]) + "X" + (nstarc_Cfg.Attr[2][2] / 100 + "%").toString();
                    var nFloor = Math.floor(hero.Star / max_star);
                    var nOpenStar = hero.Star % max_star;
                    for (var nIdx = 1; nIdx <= max_star; nIdx++) {
                        var Staricon_Num = item.getChildByName("Star_Icon" + nIdx);
                        Staricon_Num.visible = true;
                        if (nIdx <= nOpenStar) {
                            Staricon_Num.skin = H52D_Framework.HeroManager.Instance.StarColorurl[nFloor + 1];
                        }
                        else {
                            Staricon_Num.skin = H52D_Framework.HeroManager.Instance.StarColorurl[nFloor];
                        }
                    }
                }
                else {
                    var nstarc_Cfg = H52D_Framework.HeroAdvanceConfig[heroid][star];
                    for (var i = 1; i <= max_star; i++) {
                        var star_2 = item.getChildByName("Star_Icon" + i);
                        star_2.visible = true;
                    }
                    type_icon.visible = true;
                    icon.skin = hero.HeadIcon;
                    if (hero.Star < 1) {
                        hp.visible = false;
                        hurt.visible = false;
                    }
                    else {
                        hp.visible = true;
                        hurt.visible = true;
                    }
                    starNum.text = hero.Star.toString() + "阶";
                    var ItemID = nstarc_Cfg.Consume[1][1];
                    var ItemNum = H52D_Framework.BagManager.Instance.getItemNumber(ItemID);
                    if (ItemNum < H52D_Framework.HeroAdvanceConfig[heroid][hero.Star + 1].Consume[1][2]) {
                        H52D_Framework.SetHtmlStyle(item_num, 20, "#7f190b", "center");
                    }
                    else {
                        H52D_Framework.SetHtmlStyle(item_num, 20, "#2ae52a", "center");
                    }
                    changeBase.text = "属性加成" + (H52D_Framework.HeroAdvanceConfig[heroid][star + 1].Attr[2][2] / 100 + "%").toString();
                    if (hero.Star < 1) {
                        changeBase.text = "属性加成" + (H52D_Framework.HeroAdvanceConfig[heroid][1].Attr[2][2] / 100 + "%").toString();
                    }
                    item_num.innerHTML = path + ItemNum + "/" + H52D_Framework.HeroAdvanceConfig[heroid][hero.Star + 1].Consume[1][2];
                    var basename = nstarc_Cfg.Attr[1][1];
                    var basevalue = (nstarc_Cfg.Attr[1][2] / 100 + "%").toString();
                    hp.text = H52D_Framework.GetInfoAttr.Instance.GetText(basename) + "" + basevalue;
                    hurt.text = H52D_Framework.GetInfoAttr.Instance.GetText(nstarc_Cfg.Attr[2][1]) + "" + (nstarc_Cfg.Attr[2][2] / 100 + "%").toString();
                    if (H52D_Framework.HeroAdvanceConfig[heroid][hero.Star + 1].Consume[1][2] > ItemNum) {
                        btn_starup.gray = true;
                        btn_starup.mouseEnabled = false;
                    }
                    else {
                        btn_starup.mouseEnabled = true;
                        btn_starup.gray = false;
                    }
                    var nFloor = Math.floor(hero.Star / max_star);
                    var nOpenStar = hero.Star % max_star;
                    for (var nIdx = 1; nIdx <= max_star; nIdx++) {
                        var Staricon_Num = item.getChildByName("Star_Icon" + nIdx);
                        if (nIdx <= nOpenStar) {
                            Staricon_Num.skin = H52D_Framework.HeroManager.Instance.StarColorurl[nFloor + 1];
                        }
                        else {
                            Staricon_Num.skin = H52D_Framework.HeroManager.Instance.StarColorurl[nFloor];
                        }
                    }
                }
            }
            else {
                var hero_list = H52D_Framework.HeroManager.Instance.GetCfgHeroList();
                changeBase.visible = false;
                up_start.fontSize = 24;
                var star = 1;
                var nstarc_Cfg = H52D_Framework.HeroAdvanceConfig[heroid][star];
                var ItemID = nstarc_Cfg.Consume[1][1];
                var ItemNum = H52D_Framework.BagManager.Instance.getItemNumber(ItemID);
                H52D_Framework.SetHtmlStyle(item_num, 20, "#7f190b", "center");
                item_num.innerHTML = path + "0/" + nstarc_Cfg.Consume[1][2].toString();
                //icon.visible = true;
                type_icon.visible = false;
                btn_starup.gray = true;
            }
            name.color = H52D_Framework.BaseDefine.LabelColor[info.quality];
            name.text = H52D_Framework.GetInfoAttr.Instance.GetText(info.name);
            btn_starup.on(Laya.Event.CLICK, this, this.BtnStatUp, [heroid, icon]);
            icon.skin = "ui_icon/" + info["strIcon"];
            //heropoker.skin = "ui_icon/" + info["strIcon"];
            //改变money颜色，无视上边设置
            H52D_Framework.SetHtmlStyle(item_num, 20, "#c5ffa5", "center");
        };
        /**英雄进阶 */
        HeroStar.prototype.BtnStatUp = function (heroid, icon) {
            //播放按钮音效
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            this._icon = icon;
            var itemnum;
            this.nHeroID = heroid;
            var item, starnum;
            var hero = H52D_Framework.HeroManager.Instance.GetHero(heroid);
            if (!hero) {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("英雄未激活！");
            }
            else {
                starnum = hero.Star;
                if (starnum >= H52D_Framework.HeroManager.Instance.HeroMaxStar) {
                }
                else {
                    var iteminfo = H52D_Framework.HeroAdvanceConfig[heroid][starnum + 1].Consume;
                    item = iteminfo[1][1];
                    itemnum = iteminfo[1][2];
                    if (H52D_Framework.BagManager.Instance.getItemNumber(item) < itemnum) {
                        return;
                    }
                    H52D_Framework.HeroManager.Instance.HeroStartUp(heroid);
                }
            }
        };
        return HeroStar;
    }(ui.heroList.HeroStarUI));
    H52D_Framework.HeroStar = HeroStar;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=HeroStar.js.map