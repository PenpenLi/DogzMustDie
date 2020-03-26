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
    H52D_Framework.AddViewResource("HeroStarPeckView", [
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_wroldboss.atlas", type: Laya.Loader.ATLAS },
    ]);
    var HeroStarPeckView = /** @class */ (function (_super) {
        __extends(HeroStarPeckView, _super);
        function HeroStarPeckView() {
            var _this = _super.call(this) || this;
            _this.tTimeUseInfo = {};
            _this._tAvatarHeromodList = {};
            _this._tAvatarHeroAinList = {};
            //HeroStarPeckView._ishavetimes = AdvertisingManager.Instance.bnWXAdertisingTimes;
            _this.tTimeUseInfo = {};
            H52D_Framework.Tick.Loop(1000, _this, _this.TimerViewUpdate);
            _this.ViewInit();
            // 微信适配
            _this.Btn_close.y = wxsclae;
            _this.tipsicon.y = wxsclae;
            _this.List_peck.y = wxsclae + 84;
            _this.List_peck.height = _this.List_peck.height - wxsclae;
            _this.List_peck_.y = wxsclae + 84;
            _this.List_peck_.height = _this.List_peck_.height - wxsclae;
            _this.ListPeck_noM.y = wxsclae + 84;
            _this.ListPeck_noM.height = _this.ListPeck_noM.height - wxsclae;
            return _this;
        }
        HeroStarPeckView.prototype.ViewInit = function () {
            this.ViewEvent();
            this.Update_View();
        };
        HeroStarPeckView.prototype.ViewEvent = function () {
            this.Btn_close.on(Laya.Event.CLICK, this, this.Btnclick_close);
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            H52D_Framework.Event.RegistEvent("AdUpdate", Laya.Handler.create(this, this.Update_View));
            H52D_Framework.Event.RegistEvent("update_heropeck", Laya.Handler.create(this, this.Update_View));
        };
        HeroStarPeckView.prototype.ARR = function () {
            this.List_peck.array = [];
            this.List_peck_.array = [];
            this.ListPeck_noM.array = [];
            H52D_Framework.HeroManager.Instance.PeckBuyed = [];
            for (var key in H52D_Framework.HeroManager.Instance.HeroPeck) {
                var nID = H52D_Framework.HeroManager.Instance.HeroPeck[key];
                var bool = H52D_Framework.HeroManager.Instance.IsActive(nID);
                var time = H52D_Framework.Time.serverSecodes - H52D_Framework.HeroManager.Instance.GetHeroPecktime(nID);
                var bool_s = time > 0 ? true : false;
                var peck_cfg = H52D_Framework.HeroPeckConfig[nID];
                var bool_S = H52D_Framework.ShopLogic.Instance.isFristCharge(5, peck_cfg.chargeId);
                var Buy_times = H52D_Framework.ShopLogic.Instance.GetBuyTimes(4, peck_cfg.shopId);
                if (bool && !bool_s && time) {
                    if (H52D_Framework.IsAD()) {
                        var a = H52D_Framework.HeroManager.Instance.Peck_Ad;
                        if (H52D_Framework.GetTabLength(a) >= 0) {
                            if (Buy_times < 2 || a[nID] == null) {
                                this.List_peck_.array.push(nID);
                                H52D_Framework.HeroManager.Instance.HeroPeck_arr = this.List_peck_.array;
                            }
                            else {
                                H52D_Framework.HeroManager.Instance.PeckBuyed.push(nID);
                            }
                        }
                    }
                    else {
                        if (!H52D_Framework.IsNotBaiDuSdk()) {
                            if (H52D_Framework.IsShieldRecharge()) {
                                if (Buy_times == 0) {
                                    this.ListPeck_noM.array.push(nID);
                                    H52D_Framework.HeroManager.Instance.HeroPeck_arr = this.ListPeck_noM.array;
                                }
                                else {
                                    H52D_Framework.HeroManager.Instance.PeckBuyed.push(nID);
                                }
                            }
                            else {
                                if (bool_S || Buy_times == 0) {
                                    this.List_peck.array.push(nID);
                                    H52D_Framework.HeroManager.Instance.HeroPeck_arr = this.List_peck.array;
                                }
                                else {
                                    H52D_Framework.HeroManager.Instance.PeckBuyed.push(nID);
                                }
                            }
                        }
                        else {
                            if (bool_S || Buy_times == 0) {
                                this.List_peck.array.push(nID);
                                H52D_Framework.HeroManager.Instance.HeroPeck_arr = this.List_peck.array;
                            }
                            else {
                                H52D_Framework.HeroManager.Instance.PeckBuyed.push(nID);
                            }
                        }
                    }
                }
                else {
                    if (H52D_Framework.MasterPlayer.Instance.player.Hero_pecktime[nID]) {
                        delete H52D_Framework.MasterPlayer.Instance.player.Hero_pecktime[nID];
                    }
                }
            }
            if (this.List_peck.array.length > 0 || this.List_peck_.array.length > 0 ||
                this.ListPeck_noM.length > 0) {
                H52D_Framework.Event.DispatchEvent("UpdateBtnList");
            }
            else {
                H52D_Framework.HeroManager.Instance.PeckIcon = false;
                this.Btnclick_close();
            }
        };
        HeroStarPeckView.prototype.Sort_heroPeck = function (arr) {
            function tsort(left, right) {
                var left_time = H52D_Framework.HeroManager.Instance.GetHeroPecktime(left);
                var right_time = H52D_Framework.HeroManager.Instance.GetHeroPecktime(right);
                return left_time - right_time;
            }
            arr.sort(tsort);
        };
        HeroStarPeckView.prototype.Update_View = function () {
            this.ARR();
            if (!H52D_Framework.IsNotBaiDuSdk()) {
                if (!H52D_Framework.IsShieldRecharge()) {
                    this.List_peck.visible = true; //贴吧 安卓版
                    this.List_peck.vScrollBarSkin = "";
                    this.List_handle();
                }
                else {
                    this.ListPeck_noM.visible = true; //贴吧 苹果版
                    this.ListPeck_noM.vScrollBarSkin = "";
                    this.list_noMoney_handle();
                }
            }
            else {
                if (H52D_Framework.IsAD()) {
                    this.List_peck_.visible = true; //广告版
                    this.List_peck_.vScrollBarSkin = "";
                    this.list_handle_();
                }
                else {
                    this.List_peck.visible = true; //贴吧 安卓版
                    this.List_peck.vScrollBarSkin = "";
                    this.List_handle();
                }
            }
        };
        HeroStarPeckView.prototype.List_handle = function () {
            this.DesAvatar();
            this.Sort_heroPeck(this.List_peck.array);
            this.tTimeUseInfo = {};
            this.List_peck.renderHandler = new Laya.Handler(this, this.Handle);
        };
        HeroStarPeckView.prototype.list_handle_ = function () {
            this.DesAvatar();
            this.Sort_heroPeck(this.List_peck_.array);
            this.tTimeUseInfo = {};
            this.List_peck_.renderHandler = new Laya.Handler(this, this.herostar_handle);
        };
        HeroStarPeckView.prototype.list_noMoney_handle = function () {
            this.DesAvatar();
            this.Sort_heroPeck(this.ListPeck_noM.array);
            this.tTimeUseInfo = {};
            this.ListPeck_noM.renderHandler = new Laya.Handler(this, this.herostar_noMoney_handle);
        };
        HeroStarPeckView.prototype.Handle = function (item, index) {
            var nId = this.List_peck.array[index];
            var peck_cfg = H52D_Framework.HeroPeckConfig[nId];
            var time = item.getChildByName("Shop_time");
            var hero_modle_d = item.getChildByName("hero_d");
            var hero_name_d = hero_modle_d.getChildByName("hero_name");
            var hero_pin_d = hero_modle_d.getChildByName("hero_pinzhi"); //品质色
            var hero_icon_d = hero_modle_d.getChildByName("hero_icon_d"); //模型
            var hero_num_d = hero_modle_d.getChildByName("hero_num_D"); //数量
            var discount_d = hero_modle_d.getChildByName("discount"); //打折数
            var hero_btn_d = hero_modle_d.getChildByName("Btn_buy"); //购买按钮  //
            var price_d_new = hero_btn_d.getChildByName("new_price");
            var price_d_old = hero_modle_d.getChildByName("old_price");
            var line_d = hero_modle_d.getChildByName("line");
            var hero_modle_m = item.getChildByName("hero_m");
            var hero_name_m = hero_modle_m.getChildByName("hero_name");
            var hero_pin_m = hero_modle_m.getChildByName("hero_pinzhi"); //品质色
            var hero_icon_m = hero_modle_m.getChildByName("hero_icon_d"); //模型
            var hero_num_m = hero_modle_m.getChildByName("hero_num_M");
            var discount_m = hero_modle_m.getChildByName("discount"); //打折数
            var hero_btn_m = hero_modle_m.getChildByName("Btn_buy"); //购买按钮
            var price_m = hero_modle_m.getChildByName("new_price");
            var line_m = hero_modle_m.getChildByName("line");
            var tcfg_hero = H52D_Framework.HeroConfig[nId];
            hero_name_d.text = hero_name_m.text = H52D_Framework.GetInfoAttr.Instance.GetText(tcfg_hero.name);
            var pos = tcfg_hero.position;
            hero_pin_d.skin = hero_pin_m.skin = H52D_Framework.BaseDefine.HeroAllinfo_bg[tcfg_hero.quality];
            if (this._tAvatarHeroAinList[nId] != null) {
                this._tAvatarHeroAinList[nId].Destroy();
                this._tAvatarHeroAinList[nId] = null;
            }
            if (this._tAvatarHeromodList[nId] != null) {
                this._tAvatarHeromodList[nId].Destroy();
                this._tAvatarHeromodList[nId] = null;
            }
            hero_icon_d.destroyChildren();
            hero_icon_m.destroyChildren();
            var heroAin = new H52D_Framework.Avatar(hero_icon_d);
            heroAin.Load(tcfg_hero.strFacadeModel, 1, tcfg_hero.modelScale * 2.6, pos[1], pos[2], Laya.Handler.create(this, function (heroAins) {
                heroAins.Play(1, true, true, function () {
                }, true);
            }));
            this._tAvatarHeroAinList[nId] = heroAin;
            var heromod = new H52D_Framework.Avatar(hero_icon_m);
            heromod.Load(tcfg_hero.strFacadeModel, 1, tcfg_hero.modelScale * 2.6, pos[1], pos[2], Laya.Handler.create(this, function (heromods) {
                heromods.Play(1, true, true, function () {
                }, true);
            }));
            this._tAvatarHeromodList[nId] = heromod;
            this.tTimeUseInfo[index] = [nId, time];
            var Buy_times = H52D_Framework.ShopLogic.Instance.GetBuyTimes(4, peck_cfg.shopId);
            var bool_d = Buy_times == 0 ? true : false;
            //line_d.visible = bool_d;
            var Item_Info_d = H52D_Framework.MarketConfig[4][peck_cfg.shopId];
            var Shop_Info_d = Item_Info_d.sellContent;
            var preic = Item_Info_d.Price; //
            var old_m = preic[2] * Item_Info_d.Discount / 10;
            var Item_cfg = H52D_Framework.ItemConfig[Shop_Info_d[2]];
            hero_num_d.text = "X" + Shop_Info_d[3];
            hero_num_d.color = H52D_Framework.BaseDefine.LabelColor1[tcfg_hero.quality];
            var path = "<img src= 'ui_icon/icon_prop_013.png' width='30px' height='20px'></img>";
            H52D_Framework.SetHtmlStyle(price_d_new, 25, "#fdcbad", "center");
            H52D_Framework.SetHtmlStyle(price_d_old, 25, "#fdcbad", "center");
            price_d_old.innerHTML = path + preic[2];
            price_d_new.innerHTML = path + old_m + "   ";
            discount_d.text = Item_Info_d.Discount + "折";
            if (!bool_d) {
                price_d_new.innerHTML = "已购买";
            }
            //********************************* 人民币↓
            var bool_m = H52D_Framework.ShopLogic.Instance.isFristCharge(5, peck_cfg.chargeId); //
            //hero_modle_m.visible = bool;
            var Item_Info_m = H52D_Framework.ChargeConfig[5][peck_cfg.chargeId];
            var rew_cfg = H52D_Framework.RewardConfig[Item_Info_m.chargeReward].reWrad[1];
            var Shop_Info_m = H52D_Framework.ItemConfig[rew_cfg[2]];
            hero_num_m.text = "X" + rew_cfg[3];
            hero_num_m.color = H52D_Framework.BaseDefine.LabelColor1[tcfg_hero.quality];
            var item_name = H52D_Framework.GetInfoAttr.Instance.GetText(Shop_Info_m.dwItemName) + "X " + rew_cfg[3];
            H52D_Framework.SetHtmlStyle(price_m, 25, "#fdcbad", "center");
            price_m.innerHTML = Item_Info_m.Money + "元 ";
            hero_btn_m.label = Item_Info_m.Price + "元";
            discount_m.text = (Item_Info_m.Price / Item_Info_m.Money) * 10 + "折";
            if (!bool_m) {
                hero_btn_m.label = "已购买";
            }
            //line_m.visible = bool_m;
            if (!bool_d && !bool_m) {
                this.Update_View();
            }
            hero_icon_d.on(Laya.Event.CLICK, this, this.OPenView, [nId]);
            hero_icon_m.on(Laya.Event.CLICK, this, this.OPenView, [nId]);
            hero_btn_m.on(Laya.Event.CLICK, this, this.Btnclick_Mbuy, [5, peck_cfg.chargeId, item_name, bool_m]);
            hero_btn_d.on(Laya.Event.CLICK, this, this.Btnclick_Dbuy, [nId, 4, peck_cfg.shopId, 1, old_m, preic[1], bool_d]);
        };
        HeroStarPeckView.prototype.herostar_handle = function (item, index) {
            var nId = this.List_peck_.array[index];
            var peck_cfg = H52D_Framework.HeroPeckConfig[nId];
            var time = item.getChildByName("Shop_time");
            var hero_modle_d = item.getChildByName("hero_d");
            var buyend = item.getChildByName("buyend");
            var hero_name_d = hero_modle_d.getChildByName("hero_name");
            var hero_pin_d = hero_modle_d.getChildByName("hero_pinzhi"); //品质色
            var hero_icon_d = hero_modle_d.getChildByName("hero_icon_d"); //模型
            var hero_num_d = hero_modle_d.getChildByName("hero_num_D"); //数量
            var discount_d = hero_modle_d.getChildByName("discount"); //打折数
            var hero_btn_d = hero_modle_d.getChildByName("Btn_buy"); //购买按钮  //
            var price_d_new = hero_btn_d.getChildByName("new_price");
            var price_d_old = hero_modle_d.getChildByName("old_price");
            var line_d = hero_modle_d.getChildByName("line");
            var tcfg_hero = H52D_Framework.HeroConfig[nId];
            hero_name_d.text = H52D_Framework.GetInfoAttr.Instance.GetText(tcfg_hero.name);
            var pos = tcfg_hero.position;
            hero_pin_d.skin = H52D_Framework.BaseDefine.HeroAllinfo_bg[tcfg_hero.quality];
            if (this._tAvatarHeroAinList[nId] != null) {
                this._tAvatarHeroAinList[nId].Destroy();
                this._tAvatarHeroAinList[nId] = null;
            }
            if (this._tAvatarHeromodList[nId] != null) {
                this._tAvatarHeromodList[nId].Destroy();
                this._tAvatarHeromodList[nId] = null;
            }
            hero_icon_d.destroyChildren();
            var heroAin = new H52D_Framework.Avatar(hero_icon_d);
            heroAin.Load(tcfg_hero.strFacadeModel, 1, tcfg_hero.modelScale * 2.6, pos[1], pos[2], Laya.Handler.create(this, function (heroAins) {
                heroAins.Play(1, true, true, function () {
                }, true);
            }));
            this._tAvatarHeroAinList[nId] = heroAin;
            this.tTimeUseInfo[index] = [nId, time];
            var Buy_times = H52D_Framework.ShopLogic.Instance.GetBuyTimes(4, peck_cfg.shopId);
            var bool_d = Buy_times == 0 ? true : false;
            //line_d.visible = bool_d;
            var Item_Info_d = H52D_Framework.MarketConfig[4][peck_cfg.shopId];
            var Shop_Info_d = Item_Info_d.sellContent;
            var preic = Item_Info_d.Price; //
            var old_m = preic[2] * Item_Info_d.Discount / 10;
            var Item_cfg = H52D_Framework.ItemConfig[Shop_Info_d[2]];
            hero_num_d.text = "X" + Shop_Info_d[3];
            hero_num_d.color = H52D_Framework.BaseDefine.LabelColor1[tcfg_hero.quality];
            var path = "<img src= 'ui_icon/icon_prop_013.png' width='30px' height='20px'></img>";
            H52D_Framework.SetHtmlStyle(price_d_new, 25, "#fdcbad", "center");
            H52D_Framework.SetHtmlStyle(price_d_old, 25, "#fdcbad", "center");
            price_d_old.innerHTML = path + preic[2];
            price_d_new.innerHTML = path + old_m + "   ";
            discount_d.text = Item_Info_d.Discount + "折";
            buyend.visible = false;
            if (!bool_d) {
                price_d_new.innerHTML = "已购买";
                if (H52D_Framework.HeroManager.Instance.Peck_Ad[nId] == null) {
                    buyend.visible = true;
                    price_d_old.innerHTML = H52D_Framework.GetInfoAttr.Instance.GetText(7147);
                    H52D_Framework.SetHtmlStyle(price_d_new, 25, "#fefeff", "center");
                    price_d_new.innerHTML = "广告";
                    line_d.visible = false;
                }
                else if (H52D_Framework.HeroManager.Instance.Peck_Ad[nId] == 1 && Buy_times < 2) {
                    price_d_old.innerHTML = path + preic[2];
                    price_d_new.innerHTML = path + old_m + "   ";
                    discount_d.text = Item_Info_d.Discount + "折";
                    buyend.visible = false;
                    line_d.visible = true;
                    bool_d = true;
                }
                else {
                    buyend.visible = false;
                    price_d_new.innerHTML = "已购买";
                }
            }
            hero_btn_d.disabled = false;
            if (Buy_times == 1) {
                hero_btn_d.disabled = HeroStarPeckView._ishavetimes;
            }
            hero_icon_d.on(Laya.Event.CLICK, this, this.OPenView, [nId]);
            hero_btn_d.on(Laya.Event.CLICK, this, this.Btnclick_Dbuy, [nId, 4, peck_cfg.shopId, 1, old_m, preic[1], bool_d, hero_btn_d]);
        };
        HeroStarPeckView.prototype.herostar_noMoney_handle = function (item, index) {
            var nId = this.ListPeck_noM.array[index];
            var peck_cfg = H52D_Framework.HeroPeckConfig[nId];
            var time = item.getChildByName("Shop_time");
            var hero_modle_d = item.getChildByName("hero_d");
            var buyend = item.getChildByName("buyend");
            var hero_name_d = hero_modle_d.getChildByName("hero_name");
            var hero_pin_d = hero_modle_d.getChildByName("hero_pinzhi"); //品质色
            var hero_icon_d = hero_modle_d.getChildByName("hero_icon_d"); //模型
            var hero_num_d = hero_modle_d.getChildByName("hero_num_D"); //数量
            var discount_d = hero_modle_d.getChildByName("discount"); //打折数
            var hero_btn_d = hero_modle_d.getChildByName("Btn_buy"); //购买按钮  //
            var price_d_new = hero_btn_d.getChildByName("new_price");
            var price_d_old = hero_modle_d.getChildByName("old_price");
            var line_d = hero_modle_d.getChildByName("line");
            var tcfg_hero = H52D_Framework.HeroConfig[nId];
            hero_name_d.text = H52D_Framework.GetInfoAttr.Instance.GetText(tcfg_hero.name);
            var pos = tcfg_hero.position;
            hero_pin_d.skin = H52D_Framework.BaseDefine.HeroAllinfo_bg[tcfg_hero.quality];
            if (this._tAvatarHeroAinList[nId] != null) {
                this._tAvatarHeroAinList[nId].Destroy();
                this._tAvatarHeroAinList[nId] = null;
            }
            if (this._tAvatarHeromodList[nId] != null) {
                this._tAvatarHeromodList[nId].Destroy();
                this._tAvatarHeromodList[nId] = null;
            }
            hero_icon_d.destroyChildren();
            var heroAin = new H52D_Framework.Avatar(hero_icon_d);
            heroAin.Load(tcfg_hero.strFacadeModel, 1, tcfg_hero.modelScale * 2.6, pos[1], pos[2], Laya.Handler.create(this, function (heroAins) {
                heroAins.Play(1, true, true, function () {
                }, true);
            }));
            this._tAvatarHeroAinList[nId] = heroAin;
            this.tTimeUseInfo[index] = [nId, time];
            var Buy_times = H52D_Framework.ShopLogic.Instance.GetBuyTimes(4, peck_cfg.shopId);
            var bool_d = Buy_times == 0 ? true : false;
            //line_d.visible = bool_d;
            var Item_Info_d = H52D_Framework.MarketConfig[4][peck_cfg.shopId];
            var Shop_Info_d = Item_Info_d.sellContent;
            var preic = Item_Info_d.Price; //
            var old_m = preic[2] * Item_Info_d.Discount / 10;
            var Item_cfg = H52D_Framework.ItemConfig[Shop_Info_d[2]];
            hero_num_d.text = "X" + Shop_Info_d[3];
            hero_num_d.color = H52D_Framework.BaseDefine.LabelColor1[tcfg_hero.quality];
            var path = "<img src= 'ui_icon/icon_prop_013.png' width='30px' height='20px'></img>";
            H52D_Framework.SetHtmlStyle(price_d_new, 25, "#fdcbad", "center");
            H52D_Framework.SetHtmlStyle(price_d_old, 25, "#fdcbad", "center");
            price_d_old.innerHTML = path + preic[2];
            price_d_new.innerHTML = path + old_m + "   ";
            discount_d.text = Item_Info_d.Discount + "折";
            if (!bool_d) {
                price_d_new.innerHTML = "已购买";
            }
            hero_btn_d.disabled = false;
            if (Buy_times == 1) {
                hero_btn_d.disabled = HeroStarPeckView._ishavetimes;
            }
            hero_icon_d.on(Laya.Event.CLICK, this, this.OPenView, [nId]);
            hero_btn_d.on(Laya.Event.CLICK, this, this.Btnclick_Dbuy, [nId, 4, peck_cfg.shopId, 1, old_m, preic[1], bool_d, hero_btn_d]);
        };
        HeroStarPeckView.prototype.TimerViewUpdate = function () {
            for (var index in this.tTimeUseInfo) {
                var info = this.tTimeUseInfo[index];
                if (info == null)
                    return;
                var nId = info[0];
                var time = info[1];
                var _time = H52D_Framework.HeroManager.Instance.GetHeroPecktime(nId) - H52D_Framework.Time.serverSecodes;
                if (_time <= 0) {
                    this.Update_View();
                }
                time.text = H52D_Framework.GetFormatTime(_time) + "后到期，请及时购买";
            }
        };
        HeroStarPeckView.prototype.Btnclick_Mbuy = function (type, item_id, item_des, bool) {
            if (bool) {
                H52D_Framework.BaiDuSDK.Instance.ToRecharge(type, item_id, item_des);
            }
            else {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("已购买");
            }
        };
        HeroStarPeckView.prototype.Btnclick_Dbuy = function (nid, type, item_id, item_num, price, item_type, bool, btn_look) {
            if (bool) {
                var price_num = H52D_Framework.BagManager.Instance.getItemNumber(item_type);
                if (price_num < price) {
                    if (H52D_Framework.IsShieldRecharge()) {
                        var str = H52D_Framework.SysPromptConfig[30060].strPromptInfo;
                        H52D_Framework.TipsLogic.Instance.OpenMessageBox(str, Laya.Handler.create(this, function () {
                        }));
                        return;
                    }
                    else {
                        var str = H52D_Framework.SysPromptConfig[10014].strPromptInfo;
                        H52D_Framework.TipsLogic.Instance.OpenMessageBox(str, Laya.Handler.create(this, function () {
                            H52D_Framework.Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP]);
                            H52D_Framework.OneTimer(500, function () {
                                H52D_Framework.Event.DispatchEvent("toGemShop");
                            });
                            H52D_Framework.UIManager.Instance.DestroyUI("MessageBoxView", [H52D_Framework.ViewToppestRoot]);
                            H52D_Framework.UIManager.Instance.DestroyUI("HeroStarPeckView", [H52D_Framework.ViewUpRoot]);
                        }), Laya.Handler.create(this, function () {
                            H52D_Framework.UIManager.Instance.DestroyUI("MessageBoxView", [H52D_Framework.ViewToppestRoot]);
                        }));
                        return;
                    }
                }
                if (H52D_Framework.HeroManager.Instance.Peck_Ad[nid] == 1) {
                    H52D_Framework.ShopLogic.Instance.SendBuyMsg(type, item_id, item_num, true);
                }
                else {
                    H52D_Framework.ShopLogic.Instance.SendBuyMsg(type, item_id, item_num);
                }
            }
            else {
                if (H52D_Framework.HeroManager.Instance.Peck_Ad[nid] == null) {
                    if (H52D_Framework.IsAD()) {
                        var times = H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes;
                        if (times) {
                            H52D_Framework.UIManager.Instance.CreateUI("AdvertisementView", [H52D_Framework.ViewUpRoot, AdvertisementType.heroPeck, nid]);
                        }
                        else {
                            btn_look.disabled = true;
                            HeroStarPeckView._ishavetimes = true;
                            var str = H52D_Framework.SysPromptConfig[30071].strPromptInfo;
                            H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
                        }
                    }
                    else {
                        H52D_Framework.TipsLogic.Instance.OpenSystemTips("已购买");
                    }
                }
            }
        };
        HeroStarPeckView.prototype.OPenView = function (nHeroId) {
            H52D_Framework.HeroManager.Instance.OpenView(nHeroId);
        };
        HeroStarPeckView.prototype.Btnclick_close = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("HeroStarPeckView", [H52D_Framework.ViewUpRoot]);
            H52D_Framework.HeroManager.Instance.PeckShow = false;
            H52D_Framework.Event.DispatchEvent("UpdateBtnList");
            H52D_Framework.Event.DispatchEvent("ChangeMoeny");
        };
        HeroStarPeckView.prototype.DesAvatar = function () {
            for (var nId in this._tAvatarHeroAinList) {
                var oAvatar = this._tAvatarHeroAinList[nId];
                oAvatar.Destroy();
            }
            this._tAvatarHeroAinList = {};
            for (var nId in this._tAvatarHeromodList) {
                var oAvatar = this._tAvatarHeromodList[nId];
                oAvatar.Destroy();
            }
            this._tAvatarHeromodList = {};
        };
        HeroStarPeckView.prototype.Destroy = function () {
            this.tTimeUseInfo = {};
            H52D_Framework.Tick.ClearAll(this);
            this.DesAvatar();
            this.offAll();
            H52D_Framework.Event.RemoveEvent("update_heropeck", Laya.Handler.create(this, this.Update_View));
            H52D_Framework.Event.RemoveEvent("AdUpdate", Laya.Handler.create(this, this.Update_View));
        };
        HeroStarPeckView._ishavetimes = false;
        return HeroStarPeckView;
    }(ui.consumer.HeroStarPeckViewUI));
    H52D_Framework.HeroStarPeckView = HeroStarPeckView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=HeroStarPeckView.js.map