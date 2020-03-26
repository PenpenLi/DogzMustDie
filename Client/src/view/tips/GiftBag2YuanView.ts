module H52D_Framework {
    AddViewResource("GiftBag2YuanView",
        [
            { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
        ]);

    export class GiftBag2YuanView extends ui.shop.GiftBag2YuanViewUI {
        constructor(params: any) {
            super();
            this.bgImg.skin = "res/ui/ui_noPack/img-shouchong-bg.png";
            this.InitView();
            this.AddEvent();
        }
        private heroAin: Avatar = null;

        private InitView() {
            this.ViewInfo();
            ShopLogic.Instance.EffShow = false;
        }

        private ViewInfo() {
            let shop_cfg = ChargeConfig[3][1];
            let m_num = shop_cfg.Price;
            let rew_cfg = RewardConfig[shop_cfg.chargeReward].reWrad;
            let item_cdg = rew_cfg[1];
            let iteminfo = ItemConfig[item_cdg[2]];
            let item_name = GetInfoAttr.Instance.GetText(iteminfo.dwItemName)
            let end_item = iteminfo.dwUseEffect;
            let rew_ncfg = RewardConfig[end_item[1]].reWrad[1];
            iteminfo = ItemConfig[rew_ncfg[2]];
            let hero_cfg = HeroConfig[iteminfo.heroId];
            this.hero_bg.skin = BaseDefine.HeroAllinfo_bg[hero_cfg.quality];
            this.heroAin = new Avatar(this.hero_icon)
            this.heroAin.Load(hero_cfg.strFacadeModel, 1, hero_cfg.modelScale * 2.5, 140, 335,
                Laya.Handler.create(this, (heroAins) => {
                    heroAins.Play(1, true, true, () => {
                    }, true)
                }));
            SetHtmlStyle(this.hero_bigskill, 20, "#614a6e", "left");
            let tData = ActiveSkillConfig[hero_cfg.heroBigSkill];
            this.hero_bigskill.innerHTML = "队长技能:" + GetInfoAttr.Instance.GetText(tData.descId);

            this.btn_buy.label = m_num + "元";
            let buy_num = BagManager.Instance.getItemNumber(item_cdg[2]);
            this.hero_icon.on(Laya.Event.CLICK, this, this.HeroInfos, [iteminfo.heroId]);
            if (buy_num > 0) {
                this.btn_buy.label = "领取";
            }
            this.btn_buy.on(Laya.Event.CLICK, this, this.GoShop, [3, item_cdg[1], GetInfoAttr.Instance.GetText(5308), item_cdg[2]]);
        }

        private AddEvent() {
            this.btn_close.on(Laya.Event.CLICK, this, this.Btn_close);
            Event.RegistEvent("closeview_twodoller", Laya.Handler.create(this, this.Btn_close));
            Event.RegistEvent("updataview_twoyuan", Laya.Handler.create(this, this.ViewInfo));
            this.on(Laya.Event.REMOVED, this, this.Destroy);
        }

        private Btn_close() {
            ShopLogic.Instance.EffShow = false;
            UIManager.Instance.DestroyUI("GiftBag2YuanView", [ViewUpRoot]);
            Event.DispatchEvent("UpdateBtnList");
        }

        private GoShop(type: number, id: number, str: string, item_id: number) {
            if (BagManager.Instance.getItemNumber(item_id) > 0) {
                BagManager.Instance.K_ReqExchangeItem(item_id);

            }
            else {
                BaiDuSDK.Instance.ToRecharge(type, id, str);
            }
        }
        private HeroInfos(nheroid: number) {
            HeroManager.Instance.OpenView(nheroid);
        }

        private Isbuy(i_nType: number, i_nID: number) {
            if (ShopLogic.Instance.tChargeTimes[i_nType] == null) {
                return true
            } else if (ShopLogic.Instance.tChargeTimes[i_nType][i_nID] == null) {
                return true
            }
            return ShopLogic.Instance.tChargeTimes[i_nType][i_nID] == 0
        }

        private Destroy() {
            Event.RemoveEvent("closeview_twodoller", Laya.Handler.create(this, this.Btn_close));
            this.offAll();
            if (this.heroAin) {
                this.heroAin.Destroy();
                this.heroAin = null;
            }
        }
    }
}