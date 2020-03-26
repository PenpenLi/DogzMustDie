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
    H52D_Framework.AddViewResource("GiftBag2YuanView", [
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
    ]);
    var GiftBag2YuanView = /** @class */ (function (_super) {
        __extends(GiftBag2YuanView, _super);
        function GiftBag2YuanView(params) {
            var _this = _super.call(this) || this;
            _this.heroAin = null;
            _this.bgImg.skin = "res/ui/ui_noPack/img-shouchong-bg.png";
            _this.InitView();
            _this.AddEvent();
            return _this;
        }
        GiftBag2YuanView.prototype.InitView = function () {
            this.ViewInfo();
            H52D_Framework.ShopLogic.Instance.EffShow = false;
        };
        GiftBag2YuanView.prototype.ViewInfo = function () {
            var shop_cfg = H52D_Framework.ChargeConfig[3][1];
            var m_num = shop_cfg.Price;
            var rew_cfg = H52D_Framework.RewardConfig[shop_cfg.chargeReward].reWrad;
            var item_cdg = rew_cfg[1];
            var iteminfo = H52D_Framework.ItemConfig[item_cdg[2]];
            var item_name = H52D_Framework.GetInfoAttr.Instance.GetText(iteminfo.dwItemName);
            var end_item = iteminfo.dwUseEffect;
            var rew_ncfg = H52D_Framework.RewardConfig[end_item[1]].reWrad[1];
            iteminfo = H52D_Framework.ItemConfig[rew_ncfg[2]];
            var hero_cfg = H52D_Framework.HeroConfig[iteminfo.heroId];
            this.hero_bg.skin = H52D_Framework.BaseDefine.HeroAllinfo_bg[hero_cfg.quality];
            this.heroAin = new H52D_Framework.Avatar(this.hero_icon);
            this.heroAin.Load(hero_cfg.strFacadeModel, 1, hero_cfg.modelScale * 2.5, 140, 335, Laya.Handler.create(this, function (heroAins) {
                heroAins.Play(1, true, true, function () {
                }, true);
            }));
            H52D_Framework.SetHtmlStyle(this.hero_bigskill, 20, "#614a6e", "left");
            var tData = H52D_Framework.ActiveSkillConfig[hero_cfg.heroBigSkill];
            this.hero_bigskill.innerHTML = "队长技能:" + H52D_Framework.GetInfoAttr.Instance.GetText(tData.descId);
            this.btn_buy.label = m_num + "元";
            var buy_num = H52D_Framework.BagManager.Instance.getItemNumber(item_cdg[2]);
            this.hero_icon.on(Laya.Event.CLICK, this, this.HeroInfos, [iteminfo.heroId]);
            if (buy_num > 0) {
                this.btn_buy.label = "领取";
            }
            this.btn_buy.on(Laya.Event.CLICK, this, this.GoShop, [3, item_cdg[1], H52D_Framework.GetInfoAttr.Instance.GetText(5308), item_cdg[2]]);
        };
        GiftBag2YuanView.prototype.AddEvent = function () {
            this.btn_close.on(Laya.Event.CLICK, this, this.Btn_close);
            H52D_Framework.Event.RegistEvent("closeview_twodoller", Laya.Handler.create(this, this.Btn_close));
            H52D_Framework.Event.RegistEvent("updataview_twoyuan", Laya.Handler.create(this, this.ViewInfo));
            this.on(Laya.Event.REMOVED, this, this.Destroy);
        };
        GiftBag2YuanView.prototype.Btn_close = function () {
            H52D_Framework.ShopLogic.Instance.EffShow = false;
            H52D_Framework.UIManager.Instance.DestroyUI("GiftBag2YuanView", [H52D_Framework.ViewUpRoot]);
            H52D_Framework.Event.DispatchEvent("UpdateBtnList");
        };
        GiftBag2YuanView.prototype.GoShop = function (type, id, str, item_id) {
            if (H52D_Framework.BagManager.Instance.getItemNumber(item_id) > 0) {
                H52D_Framework.BagManager.Instance.K_ReqExchangeItem(item_id);
            }
            else {
                H52D_Framework.BaiDuSDK.Instance.ToRecharge(type, id, str);
            }
        };
        GiftBag2YuanView.prototype.HeroInfos = function (nheroid) {
            H52D_Framework.HeroManager.Instance.OpenView(nheroid);
        };
        GiftBag2YuanView.prototype.Isbuy = function (i_nType, i_nID) {
            if (H52D_Framework.ShopLogic.Instance.tChargeTimes[i_nType] == null) {
                return true;
            }
            else if (H52D_Framework.ShopLogic.Instance.tChargeTimes[i_nType][i_nID] == null) {
                return true;
            }
            return H52D_Framework.ShopLogic.Instance.tChargeTimes[i_nType][i_nID] == 0;
        };
        GiftBag2YuanView.prototype.Destroy = function () {
            H52D_Framework.Event.RemoveEvent("closeview_twodoller", Laya.Handler.create(this, this.Btn_close));
            this.offAll();
            if (this.heroAin) {
                this.heroAin.Destroy();
                this.heroAin = null;
            }
        };
        return GiftBag2YuanView;
    }(ui.shop.GiftBag2YuanViewUI));
    H52D_Framework.GiftBag2YuanView = GiftBag2YuanView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=GiftBag2YuanView.js.map