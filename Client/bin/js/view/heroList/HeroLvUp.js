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
    var HeroLvUp = /** @class */ (function (_super) {
        __extends(HeroLvUp, _super);
        function HeroLvUp(buf) {
            var _this = _super.call(this) || this;
            _this._time = 0;
            //private _isclick=false;
            _this._Lveffect = null;
            _this._tabItemIndex = 0;
            _this._lock = false;
            _this.btn_label = {
                0: "升级",
                1: "升级X1",
                2: "升级X10",
                3: "升级最大",
            };
            _this.Btn_enum = {
                1: _this.Btn_shop,
                2: _this.Btn_shop1,
                3: _this.Btn_shop10,
                4: _this.Btn_shopMax,
            };
            _this.skill = [];
            _this.hero = [];
            _this.bGuidanceButton = true;
            _this._tabItemIndex = 0;
            _this.List_hero.vScrollBarSkin = "";
            _this.Btn_shop.visible = true;
            _this.Btn_shop.text = _this.btn_label[HeroLvUp.nIdex];
            _this.Btn_shop1.visible = false;
            _this.Btn_shop10.visible = false;
            _this.Btn_shopMax.visible = false;
            //this.BtnShop.selectedIndex=0;
            H52D_Framework.Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_13, _this.Btn_shop);
            H52D_Framework.Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_13 + 1000, _this.Btn_shopMax);
            H52D_Framework.HeroPosition.Instance.InitPosInfo();
            //this.UpdateList();
            _this.Refesh();
            _this.ChangeListHigth();
            _this.AddEvent();
            _this.Btn_OnClick();
            return _this;
        }
        HeroLvUp.prototype.Refesh = function () {
            //this.BtnShop.selectedIndex = HeroLvUp._Indx;
            this.hero = H52D_Framework.HeroManager.Instance.GetCfgHeroList();
            H52D_Framework.HeroManager.Instance.SortHero(this.hero, true);
            this.List_hero.array = this.hero;
            this.List_hero.renderHandler = new Laya.Handler(this, this.BtnList);
            //this.BtnShop.selectHandler = new Laya.Handler(this, this.BtnShopClick);
        };
        HeroLvUp.prototype.Btn_OnClick = function () {
            this.Btn_shop.on(Laya.Event.CLICK, this, this.Btn_shopclick, [1]);
            this.Btn_shop1.on(Laya.Event.CLICK, this, this.Btn_shopclick, [2]);
            this.Btn_shop10.on(Laya.Event.CLICK, this, this.Btn_shopclick, [3]);
            this.Btn_shopMax.on(Laya.Event.CLICK, this, this.Btn_shopclick, [4]);
        };
        HeroLvUp.prototype.AddEvent = function () {
            H52D_Framework.Event.RegistEvent('ClickActivate', Laya.Handler.create(this, this.NewTeach_Active));
            H52D_Framework.Event.RegistEvent('ChangeMoeny', Laya.Handler.create(this, this.ChangeMoney));
            H52D_Framework.Event.RegistEvent('ReqActivateHero', Laya.Handler.create(this, this.ReqActivateHero));
            H52D_Framework.Event.RegistEvent('ReqHeroLevelUp', Laya.Handler.create(this, this.ReqHeroLevelUp));
            H52D_Framework.Event.RegistEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
            H52D_Framework.Event.RegistEvent('ClickUpgrade', Laya.Handler.create(this, this.NewTeach_LvUp));
            H52D_Framework.Event.RegistEvent('TweenToOnesHero', Laya.Handler.create(this, this.TweenToOnesHero));
            // Event.RegistEvent('Btn_shopclick', Laya.Handler.create(this, this.BtnShopClick));
            H52D_Framework.Event.DispatchEvent("ShowMaxBtn", [true]);
            //this.BtnShop.on(Laya.Event.CLICK,this,this.BtnShopClick)
        };
        HeroLvUp.prototype.ChangeMoney = function () {
            this.UpdateList();
        };
        // 移除事件监听
        HeroLvUp.prototype.OnDestroy = function () {
            this.offAll();
            //this._Lveffect.Destroy();
            H52D_Framework.Event.RemoveEvent('ClickActivate', Laya.Handler.create(this, this.NewTeach_Active)); //激活按钮
            H52D_Framework.Event.RemoveEvent('ChangeMoeny', Laya.Handler.create(this, this.ChangeMoney));
            H52D_Framework.Event.RemoveEvent('ReqActivateHero', Laya.Handler.create(this, this.ReqActivateHero));
            H52D_Framework.Event.RemoveEvent('ReqHeroLevelUp', Laya.Handler.create(this, this.ReqHeroLevelUp));
            H52D_Framework.Event.RemoveEvent("changelisthigth", Laya.Handler.create(this, this.ChangeListHigth));
            H52D_Framework.Event.RemoveEvent('ClickUpgrade', Laya.Handler.create(this, this.NewTeach_LvUp));
            H52D_Framework.Event.RemoveEvent('TweenToOnesHero', Laya.Handler.create(this, this.TweenToOnesHero));
            // Event.RemoveEvent('Btn_shopclick', Laya.Handler.create(this, this.BtnShopClick));
        };
        HeroLvUp.prototype.ChangeListHigth = function () {
            if (H52D_Framework.ViewUILogic.Instance.halfPanel) {
                if (this.destroyed)
                    return;
                this.List_hero.height = 230 * G_StageHeightScale;
            }
            else {
                this.List_hero.height = (1028 - wxsclae) * G_StageHeightScale;
            }
        };
        /** 激活成功 */
        HeroLvUp.prototype.ReqActivateHero = function () {
            var _this = this;
            this.LvUpEffect();
            H52D_Framework.TipsLogic.Instance.OpenSystemTips("英雄激活成功！");
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/level_up.mp3");
            H52D_Framework.OneTimer(500, function () {
                _this.UpdateList(false);
            });
            H52D_Framework.Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_8);
        };
        /** 升级成功 */
        HeroLvUp.prototype.ReqHeroLevelUp = function () {
            var _this = this;
            H52D_Framework.TipsLogic.Instance.OpenSystemTips("英雄升级成功！");
            this.LvUpEffect();
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.ADD_GOLD);
            // this.UpdateList();
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/level_up.mp3");
            H52D_Framework.OneTimer(300, function () {
                _this.UpdateList();
            });
        };
        /***播放特效 */
        HeroLvUp.prototype.LvUpEffect = function () {
            var _this = this;
            this._Lveffect = new H52D_Framework.Avatar(this._icon);
            this._Lveffect.Load("res/effect/effect_ui_shengji/effect_ui_shengji.sk", 1, 2.0, 46, 46, Laya.Handler.create(this, function () {
                //this._Lveffect.visible=true;
                _this._Lveffect.Play("effect_ui_shengji", false, true, function () {
                    _this._Lveffect.Destroy();
                });
            }));
        };
        HeroLvUp.prototype.UpdateList = function (bool) {
            bool = false;
            this.hero = H52D_Framework.HeroManager.Instance.GetCfgHeroList();
            H52D_Framework.HeroManager.Instance.SortHero(this.hero, bool);
            this.List_hero.array = this.hero;
            this.List_hero.refresh();
            this.List_hero.renderHandler = new Laya.Handler(this, this.BtnList);
            H52D_Framework.Event.DispatchEvent("UpdateRedPoint");
        };
        /**新手指导 激活英雄 */
        HeroLvUp.prototype.NewTeach_Active = function () {
            var nHeroId = this.List_hero.array[0];
            H52D_Framework.HeroManager.Instance.OpenHero(nHeroId);
        };
        /**新手引导  升级 */
        HeroLvUp.prototype.NewTeach_LvUp = function (num) {
            if (num === void 0) { num = 1; }
            var tArr = this.List_hero.array;
            var nIndex;
            var nNum = 0;
            for (var index in tArr) {
                var id = tArr[index];
                if (H52D_Framework.HeroManager.Instance.IsActive(id)) {
                    nIndex = Number(index);
                    nNum++;
                }
                if (nNum >= num) {
                    nIndex = Number(index);
                    break;
                }
            }
            this.nHeroID = tArr[nIndex];
            var lv = H52D_Framework.HeroManager.Instance.MaxLvUp(this.nHeroID, H52D_Framework.MasterPlayer.Instance.player.Level);
            if (H52D_Framework.HeroManager.Instance.GetHero(this.nHeroID).Level >= lv) {
                return;
            }
            this.LvUpHero(this.nHeroID, H52D_Framework.HeroManager.Instance.GetHero(this.nHeroID).Level + 1);
        };
        HeroLvUp.prototype.TweenToOnesHero = function (num) {
            if (num === void 0) { num = 1; }
            var tArr = this.List_hero.array;
            var nIndex;
            for (var index in tArr) {
                var id = tArr[index];
                if (H52D_Framework.HeroManager.Instance.IsActive(id)) {
                    var heroId = void 0;
                    nIndex = Number(index);
                    if ((num - 1) == nIndex) {
                        return;
                    }
                    heroId = tArr[(num - 1)];
                    tArr[(num - 1)] = id;
                    tArr[nIndex] = heroId;
                    break;
                }
            }
            this.UpdateList(false);
        };
        HeroLvUp.prototype.BtnList = function (item, index) {
            var nHeroID = this.hero[index];
            var tCfg = H52D_Framework.HeroConfig[nHeroID];
            var Item_id = tCfg.needItem;
            var Item_tcfg = H52D_Framework.ItemConfig[Item_id].Line;
            var nx = tCfg.heroRatio;
            var nType = tCfg.type;
            // 是否激活
            var bActive = H52D_Framework.HeroManager.Instance.IsActive(nHeroID);
            var n_canActive = H52D_Framework.HeroManager.Instance.HeroIstrue(nHeroID); //检测英雄是否满足激活条件
            var herotype = item.getChildByName("HeroType");
            var level = item.getChildByName("HeroLevel"); //拿到人物等级信息
            var icon = item.getChildByName("HeadIcon");
            var hero_war = icon.getChildByName("War_img");
            var hero_warbg = icon.getChildByName("War_bg");
            var hero_point = icon.getChildByName("hero_point");
            var icon_bg = item.getChildByName("pinzhi_bg");
            var hero_name = item.getChildByName("HeroName");
            var hurt = item.getChildByName("HeroHurt");
            var hp = item.getChildByName("HeroHp");
            var btn_1 = item.getChildByName("Btn_1");
            var btn_label = btn_1.getChildByName("Btn_label");
            var money_html = btn_1.getChildByName("money");
            var nlock = btn_1.getChildByName("lvup_lock");
            var btn_img = btn_1.getChildByName("btn_img");
            var new_logo = btn_1.getChildByName("new_logo");
            var btn_2 = item.getChildByName("Btn_2");
            var skill = item.getChildByName("Btn_skill");
            var btn_labels = item.getChildByName("Btn_labels");
            var Addhurt = item.getChildByName("Add_Hurt");
            var Addhp = item.getChildByName("Add_hp");
            var icon1 = item.getChildByName("heroicon1");
            var get_name = item.getChildByName("get_LandName");
            var get_land1 = item.getChildByName("get_Land1");
            var get_land2 = item.getChildByName("get_Land2");
            var get_land3 = item.getChildByName("get_Land3");
            var img_max = item.getChildByName("lv_max");
            btn_1.gray = false;
            new_logo.visible = n_canActive;
            herotype.skin = H52D_Framework.BaseDefine.HeroTypeIcon[nType];
            btn_2.on(Laya.Event.CLICK, this, this.HeroAllInfo, [nHeroID]);
            hero_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(tCfg.name);
            hero_name.color = H52D_Framework.BaseDefine.LabelColor[tCfg.quality];
            icon.skin = "ui_icon/" + tCfg.strIcon;
            H52D_Framework.SetHtmlStyle(money_html, 20, "#c5ffa5", "center");
            var path = "<img src= 'ui_main/icon-jinbi.png' width='24px' height='24px'></img>";
            money_html.innerHTML = path;
            var my_money = H52D_Framework.BagManager.Instance.getItemNumber(1);
            var _playlv = H52D_Framework.MasterPlayer.Instance.player.Level;
            var myNum = H52D_Framework.BagManager.Instance.getItemNumber(tCfg.needItem);
            icon_bg.skin = H52D_Framework.BaseDefine.QualityList[tCfg.quality];
            btn_1.mouseEnabled = true;
            btn_labels.visible = false;
            hero_war.skin = "";
            nlock.visible = false;
            nlock.color = "#892020";
            hero_point.visible = false;
            btn_1.visible = true;
            money_html.visible = true;
            img_max.visible = false;
            //引导按钮
            if (index == 0 && this.bGuidanceButton) {
                H52D_Framework.Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_2, btn_1);
                H52D_Framework.Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_3, btn_1);
                H52D_Framework.Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_13 + 2000, btn_1);
                this.bGuidanceButton = false;
            }
            hero_warbg.visible = H52D_Framework.HeroPosition.Instance.IsInWar(nHeroID);
            if (bActive) {
                var bool = H52D_Framework.CacheManager.Instance.getDerailByType(CacheTypeEnum.hero, nHeroID);
                var _bool = H52D_Framework.HeroManager.Instance.HeroIsHave_peck(nHeroID);
                if (_bool && !bool) {
                    hero_point.visible = H52D_Framework.HeroManager.Instance.Heropeck_IsBuy(nHeroID);
                }
                else {
                    hero_point.visible = false;
                }
                var war = H52D_Framework.HeroPosition.Instance.HeroWar;
                if (H52D_Framework.HeroPosition.Instance.IsInWar(nHeroID)) {
                    if (war[nHeroID] == 4) {
                        hero_war.skin = H52D_Framework.BaseDefine.HeroWar_pos[1];
                    }
                    else {
                        hero_war.skin = H52D_Framework.BaseDefine.HeroWar_pos[2];
                    }
                }
                var hero = H52D_Framework.HeroManager.Instance.GetHero(nHeroID);
                icon.gray = false;
                btn_1.visible = true;
                Addhp.visible = true;
                Addhurt.visible = true;
                get_name.visible = get_land1.visible = get_land2.visible = get_land3.visible = false;
                money_html.innerHTML = path;
                var star = hero.Star == 0 ? 1 : hero.Star;
                var add_star = H52D_Framework.HeroAdvanceConfig[nHeroID][star].Attr[1][2] / 10000;
                if (hero.Star == 0) {
                    add_star = 0;
                }
                var base = H52D_Framework.HeroUpgrateConfig[nType][hero.Level];
                hp.text = H52D_Framework.GetInfoAttr.Instance.GetText(base.Attr[1][1]) + ":" + hero.attr.GetAttributeValue(1);
                hurt.text = H52D_Framework.GetInfoAttr.Instance.GetText(base.Attr[2][1]) + ":" + hero.attr.GetAttributeValue(2);
                level.text = hero.Level + "";
                var tSkillCfg = H52D_Framework.HeroConfig[nHeroID].heroPassiveSkill;
                var nSkillFlag = 0;
                for (var nIdx = 1; nIdx <= 10; nIdx++) { //设置技能图片
                    var tSkillInfo = tSkillCfg[nIdx];
                    var nSKillID = tSkillInfo[1];
                    var info = H52D_Framework.PassiveSkillConfig[nSKillID];
                    var nUseLevel = tSkillInfo[2];
                    var skillicon = item.getChildByName("skill_icon" + nIdx);
                    var iconlock = skillicon.getChildByName("skill_lock");
                    skillicon.visible = true;
                    //设置图片
                    skillicon.skin = "ui_icon/" + info.strIcon;
                    if (hero.Level >= nUseLevel) {
                        iconlock.visible = false;
                    }
                    else {
                        if (nSkillFlag < 1) {
                            nSkillFlag += 1;
                            // 至灰							
                            iconlock.visible = true;
                        }
                        else {
                            skillicon.visible = false;
                            iconlock.visible = true;
                        }
                    }
                }
                if (H52D_Framework.HeroManager.Instance.HeroMaxLv <= hero.Level) { //满级判断
                    Addhp.visible = false;
                    Addhurt.visible = false;
                    img_max.visible = true;
                    money_html.visible = false;
                    btn_1.visible = false;
                    btn_labels.visible = true;
                    return;
                }
                else {
                    var needs = H52D_Framework.GetInfoAttr.Instance.GetText(7001);
                    var up_lock_one = H52D_Framework.HeroUpgrateConfig[nType][hero.Level + 1].needPlayerLv;
                    nlock.text = "角色" + H52D_Framework.Format(needs, up_lock_one);
                    var nowmoney = H52D_Framework.HeroUpgrateConfig[nType][hero.Level].ConsumeGold;
                    var tUseList = H52D_Framework.HeroManager.Instance.GetHeroLvUpUse(nHeroID, HeroLvUp.nIdex);
                    var play_lv = H52D_Framework.MasterPlayer.Instance.player.Level;
                    var play_money = H52D_Framework.BagManager.Instance.getItemNumber(1);
                    var upnext_mongey = (H52D_Framework.HeroUpgrateConfig[nType][hero.Level + 1].ConsumeGold - nowmoney) * nx;
                    money_html.innerHTML = path + Math.floor(tUseList[1]);
                    var lvup_lock = H52D_Framework.HeroUpgrateConfig[nType][tUseList[0]].needPlayerLv;
                    var next_base = H52D_Framework.HeroUpgrateConfig[nType][tUseList[0]].Attr;
                    btn_img.gray = false;
                    var one_needInfo = H52D_Framework.HeroManager.Instance.Up_one(play_money, nType, hero.Level, nowmoney, nx);
                    if (play_money < upnext_mongey) {
                        money_html.innerHTML = path + one_needInfo;
                        btn_img.gray = true;
                        btn_1.mouseEnabled = !btn_img.gray;
                    }
                    if (play_lv < up_lock_one) {
                        btn_label.y = 14;
                        nlock.visible = true;
                        nlock.text = "角色" + H52D_Framework.Format(needs, up_lock_one);
                        if (tUseList[0] == hero.Level + 1) {
                            btn_img.gray = true;
                            btn_1.mouseEnabled = !btn_img.gray;
                        }
                    }
                    btn_label.text = "升级 X" + (tUseList[0] - hero.Level);
                    if (tUseList[0] <= hero.Level || lvup_lock - 10 > play_lv) {
                        next_base = H52D_Framework.HeroUpgrateConfig[nType][hero.Level + 1].Attr;
                        btn_label.text = "升级 X1";
                        btn_img.gray = true;
                        btn_1.mouseEnabled = !btn_img.gray;
                        money_html.innerHTML = path + one_needInfo;
                    }
                    var addhp = next_base[1][2] - base.Attr[1][2];
                    var addhurt = next_base[2][2] - base.Attr[2][2];
                    Addhp.text = "(↑" + (Math.floor((addhp * nx) * (add_star + 1))).toString() + ")";
                    Addhurt.text = "(↑" + (Math.floor((addhurt * nx) * (add_star + 1))).toString() + ")";
                    if (btn_img.gray) {
                        return;
                    }
                    btn_1.on(Laya.Event.CLICK, this, this.BtnClick, [nHeroID, icon1, btn_img, tUseList[0]]);
                    return;
                }
            }
            else {
                for (var nIdx = 1; nIdx <= 10; nIdx++) {
                    var skillicon = item.getChildByName("skill_icon" + nIdx);
                    var iconlock = skillicon.getChildByName("skill_lock");
                    skillicon.visible = iconlock.visible = false;
                }
                get_name.visible = get_land1.visible = get_land2.visible = get_land3.visible = true;
                if (Item_tcfg[2]) {
                    get_land2.text = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.LineConfig[Item_tcfg[2]].LineName);
                    if (H52D_Framework.LineConfig[Item_tcfg[2]].param != 0) {
                        get_land2.on(Laya.Event.CLICK, this, H52D_Framework.HeroManager.Instance.OpenShop, [H52D_Framework.LineConfig[Item_tcfg[2]].param]);
                    }
                    else {
                        get_land2.underline = false;
                    }
                }
                if (Item_tcfg[1]) {
                    get_land1.text = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.LineConfig[Item_tcfg[1]].LineName); //充奖获得的文本内容
                    if (H52D_Framework.LineConfig[Item_tcfg[1]].param != 0) {
                        get_land1.on(Laya.Event.CLICK, this, H52D_Framework.HeroManager.Instance.OpenShop, [H52D_Framework.LineConfig[Item_tcfg[1]].param]);
                    }
                    else {
                        get_land1.underline = false;
                    }
                }
                if (Item_tcfg[3]) {
                    get_land3.text = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.LineConfig[Item_tcfg[3]].LineName); //充奖获得的文本内容
                    if (H52D_Framework.LineConfig[Item_tcfg[3]].param != 0) {
                        get_land3.on(Laya.Event.CLICK, this, H52D_Framework.HeroManager.Instance.OpenShop, [H52D_Framework.LineConfig[Item_tcfg[3]].param]);
                    }
                    else {
                        get_land3.underline = false;
                    }
                }
                icon.gray = true;
                btn_img.gray = false;
                var base = H52D_Framework.HeroUpgrateConfig[nType][1]["Attr"];
                hp.text = "生命：" + Math.floor(base[1][2] * nx).toString();
                hurt.text = "伤害：" + Math.floor(base[2][2] * nx).toString();
                Addhp.text = "";
                Addhurt.text = "";
                btn_label.text = "激活";
                var num = myNum / tCfg.needNum;
                var money = myNum + "/" + tCfg.needNum;
                money_html.innerHTML = "<img src= " + "'ui_icon/" + tCfg.strIcon + "'" + " width='24px' height='24px'></img>" + money;
                level.text = "1";
                if (myNum < tCfg.needNum) {
                    btn_1.gray = true;
                    H52D_Framework.SetHtmlStyle(money_html, 20, "#c5ffa5", "center");
                    btn_1.mouseEnabled = !btn_img.gray;
                }
                else {
                    H52D_Framework.SetHtmlStyle(money_html, 20, "#c5ffa5", "center");
                    btn_1.gray = false;
                    btn_1.mouseEnabled = !btn_img.gray;
                }
                btn_1.on(Laya.Event.CLICK, this, this.BtnClick, [nHeroID, icon1, btn_img]);
            }
            //let bool = HeroManager.Instance.HeroIstrue(nHeroID);
        };
        /**按钮的点击时间 */
        HeroLvUp.prototype.BtnClick = function (nHeroID, icon, btn_img, lv) {
            this._icon = icon;
            this.nHeroID = nHeroID;
            this._btn = btn_img;
            this._lv = lv;
            var bActive = H52D_Framework.HeroManager.Instance.IsActive(nHeroID);
            var skillinfo = H52D_Framework.HeroConfig[nHeroID].heroPassiveSkill;
            var nowDate = new Date();
            var time = (nowDate.getDate() * 24 * 60 + nowDate.getHours() * 60 + nowDate.getMinutes()) * 60 + nowDate.getSeconds();
            if (this._time == 0 || time - this._time > 0.2) {
                this._time = time;
                if (bActive) {
                    if (lv == null) {
                        return;
                    }
                    this.LvUpHero(nHeroID, lv);
                }
                else {
                    H52D_Framework.HeroManager.Instance.OpenHero(nHeroID);
                }
                //播放按钮音效
                H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
            }
            else {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("0.2秒内只能点击一次");
            }
        };
        HeroLvUp.prototype.HeroAllInfo = function (nHeroID) {
            H52D_Framework.HeroManager.Instance.OpenView(nHeroID);
        };
        /**英雄升级 */
        HeroLvUp.prototype.LvUpHero = function (nHeroID, lv) {
            var tUseList = H52D_Framework.HeroManager.Instance.GetHeroLvUpUse(nHeroID, HeroLvUp._Indx);
            var hasMoney = H52D_Framework.BagManager.Instance.getItemNumber(1);
            var a = H52D_Framework.HeroManager.Instance.M_MaxLvup(nHeroID, hasMoney);
            var ntype = H52D_Framework.HeroConfig[nHeroID].type;
            var hero = H52D_Framework.HeroManager.Instance.GetHero(nHeroID);
            var lvup_lock = H52D_Framework.HeroUpgrateConfig[ntype][tUseList[0]].needPlayerLv;
            var _playlv = H52D_Framework.MasterPlayer.Instance.player.Level;
            var maxup = H52D_Framework.HeroManager.Instance.MaxLvUp(nHeroID, _playlv);
            if (_playlv < lvup_lock) {
                if (hero.Level < maxup) {
                    tUseList[0] = maxup;
                }
            }
            if (tUseList[1] > hasMoney) {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("金币不足！");
                this._btn.gray = true;
                return;
            }
            if (lvup_lock > _playlv) {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("等级不足！");
                return;
            }
            H52D_Framework.HeroManager.Instance.HeroLevlUp(nHeroID, lv);
        };
        // private BtnShopClick() {
        // 	HeroLvUp._Indx = this.BtnShop.selectedIndex;
        // 	this.UpdateList()
        // }
        /**控制购买按钮 */
        HeroLvUp.prototype.Btn_shopclick = function (btnIdnx) {
            if (btnIdnx == 1) {
                if (this.Btn_shop1.visible) {
                    this.Btn_shop1.visible = false;
                    this.Btn_shop10.visible = false;
                    this.Btn_shopMax.visible = false;
                    this.Btn_shop.bgColor = "#30303a";
                }
                else {
                    this.Btn_shop1.visible = true;
                    this.Btn_shop10.visible = true;
                    this.Btn_shopMax.visible = true;
                    this.Btn_shop.bgColor = "#474557"; //
                    if (HeroLvUp.nIdex == 1) {
                        this.Btn_shop1.color = "#b5b2c6";
                        this.Btn_shop10.color = "#89848a";
                        this.Btn_shopMax.color = "#89848a";
                    }
                    if (HeroLvUp.nIdex == 2) {
                        this.Btn_shop10.color = "#b5b2c6";
                        this.Btn_shopMax.color = "#89848a";
                        this.Btn_shop1.color = "#89848a";
                    }
                    if (HeroLvUp.nIdex == 3) {
                        this.Btn_shopMax.color = "#b5b2c6";
                        this.Btn_shop10.color = "#89848a";
                        this.Btn_shop1.color = "#89848a";
                    }
                }
            }
            if (btnIdnx == 2) {
                this.Btn_shop1.visible = false;
                this.Btn_shop10.visible = false;
                this.Btn_shopMax.visible = false;
                this.Btn_shop.text = "升级X1";
                this.Btn_shop.bgColor = "#30303a";
                HeroLvUp.nIdex = 1;
                this.UpdateList();
            }
            if (btnIdnx == 3) {
                this.Btn_shop1.visible = false;
                this.Btn_shop10.visible = false;
                this.Btn_shopMax.visible = false;
                this.Btn_shop.text = "升级X10";
                this.Btn_shop.bgColor = "#30303a";
                HeroLvUp.nIdex = 2;
                this.UpdateList();
            }
            if (btnIdnx == 4) {
                this.Btn_shop1.visible = false;
                this.Btn_shop10.visible = false;
                this.Btn_shopMax.visible = false;
                this.Btn_shop.text = "升级最大";
                this.Btn_shop.bgColor = "#30303a";
                HeroLvUp.nIdex = 3;
                this.UpdateList();
            }
        };
        HeroLvUp._Indx = 0;
        HeroLvUp.nIdex = 1;
        return HeroLvUp;
    }(ui.heroList.HeroLvUpUI));
    H52D_Framework.HeroLvUp = HeroLvUp;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=HeroLvUp.js.map