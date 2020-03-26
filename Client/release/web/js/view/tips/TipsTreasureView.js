/**Created by the LayaAirIDE*/
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
/**商城类型枚举 */
var OpenType;
(function (OpenType) {
    /** 空*/
    OpenType[OpenType["eEmpty"] = 0] = "eEmpty";
    OpenType[OpenType["eBox"] = 1] = "eBox";
    OpenType[OpenType["ePro"] = 2] = "ePro";
    OpenType[OpenType["eHero"] = 3] = "eHero";
    OpenType[OpenType["ePet"] = 4] = "ePet";
})(OpenType || (OpenType = {}));
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("TipsTreasureView", [
        { url: "res/ui/ui_sign.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_mail.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_pet.atlas", type: Laya.Loader.ATLAS }
    ]);
    var TipsTreasureView = /** @class */ (function (_super) {
        __extends(TipsTreasureView, _super);
        function TipsTreasureView(info) {
            var _this = _super.call(this) || this;
            /** 宝箱内容列表*/
            _this.boxContentList = [];
            _this.Init(info[1], info[2], info[3], info[4], info[5], info[6], info[7], info[8], info[9]);
            _this.AddEvent();
            return _this;
        }
        /**添加按钮侦听器 */
        TipsTreasureView.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.OnDestroy);
            this.close.on(Laya.Event.CLICK, this, this.OnClickCloseBtn);
            this.boxList.renderHandler = new Laya.Handler(this, this.ShowContentList);
            this.boxList.array = this.boxContentList;
            this.boxBuy.on(Laya.Event.CLICK, this, this.BuyItems);
        };
        /**移除事件监听 */
        TipsTreasureView.prototype.OnDestroy = function () {
            this.offAll();
            if (this.heroAin) {
                this.heroAin.Destroy();
                this.heroAin = null;
            }
            if (this.petAin) {
                this.petAin.Destroy();
                this.petAin = null;
            }
        };
        /**
         *
         * @param nType 商城类型
         * @param nId 物品ID
         * @param nPrice 物品价格
         * @param nPriceType 价格类型
         * @param nConId 商品ID
         * @param nName tip标题
         * @param openType 商城类型枚举
         * @param nIcon 图标
         * @param num 数量
         */
        TipsTreasureView.prototype.Init = function (nType, nId, nPrice, nPriceType, nConId, nName, openType, nIcon, num) {
            var _this = this;
            this.tipName.changeText(nName);
            this.boxsPrice = nPrice;
            this.Boxprice.changeText(this.boxsPrice.toString());
            this.boxType = nType;
            this.boxsID = nId;
            this.conId = nConId;
            //售价字体颜色判断
            if (nPriceType == H52D_Framework.BaseDefine.ItemIdGold) {
                this.boxsPrice > H52D_Framework.ShopLogic.Instance.goldNum ? this.Boxprice.color = "#ff0028" : this.Boxprice.color = "#27af3d";
                this.prictIcon.skin = "ui_icon/icon_prop_012.png";
            }
            else {
                this.boxsPrice > H52D_Framework.ShopLogic.Instance.gemNum ? this.Boxprice.color = "#ff0028" : this.Boxprice.color = "#27af3d";
                this.prictIcon.skin = "ui_icon/icon_prop_013.png";
            }
            this.proBox.visible = false;
            this.boxBox.visible = false;
            this.heroBox.visible = false;
            this.bj.height = 426 * G_StageHeightScale;
            this.bj_2.visible = true;
            // this.bj_2.height = 282 * G_StageHeightScale;
            this.boxBuy.y = 350 * G_StageHeightScale;
            switch (openType) {
                case OpenType.ePro:
                    this.proBox.visible = true;
                    var cfg = H52D_Framework.ItemConfig[nId];
                    this.proImg.skin = "ui_icon/" + nIcon;
                    this.proName.changeText(H52D_Framework.GetInfoAttr.Instance.GetText(cfg.dwItemName));
                    this.proName.color = H52D_Framework.BaseDefine.LabelColor[cfg.dwItemQuality];
                    this.proBgIcon.skin = H52D_Framework.BaseDefine.QualityList[cfg.dwItemQuality];
                    this.proNum.changeText("数量：" + num.toString());
                    this.proContent.changeText("描述：" + H52D_Framework.GetInfoAttr.Instance.GetText(cfg.dwItemAState));
                    break;
                case OpenType.eBox:
                    this.boxBox.visible = true;
                    this.describe.text = H52D_Framework.GetInfoAttr.Instance.GetText(7122);
                    this.bj.height = 525 * G_StageHeightScale;
                    this.boxBuy.y = 440 * G_StageHeightScale;
                    //this.ProNum = nNum;
                    var tCfg = H52D_Framework.ItemConfig[nId];
                    //判断道具类型
                    this.boxContentList = [];
                    if (tCfg.dwItemType == 3) {
                        var dwUseArr = tCfg.dwUseEffect;
                        for (var info in dwUseArr) {
                            var rCfg = H52D_Framework.RewardConfig[dwUseArr[info]];
                            for (var r_info in rCfg.reWrad) {
                                this.boxContentList.push(rCfg.reWrad[r_info]);
                            }
                        }
                    }
                    else {
                        //this.boxContentList.push({ 1: nType, 2: nId, 3: nNum });
                    }
                    break;
                case OpenType.eHero:
                    this.heroBox.visible = true;
                    this.boxBuy.y = 506 * G_StageHeightScale;
                    this.bj.height = 584 * G_StageHeightScale;
                    // this.bj_2.height = 409 * G_StageHeightScale;
                    this.bj_2.visible = false;
                    var lv = this.heroBox.getChildByName("lv");
                    var hp = this.heroBox.getChildByName("hp");
                    var hit = this.heroBox.getChildByName("hit");
                    var type = this.heroBox.getChildByName("type");
                    var name_1 = this.heroBox.getChildByName("name");
                    var icon = this.heroBox.getChildByName("icon");
                    var crit = this.heroBox.getChildByName("crit");
                    var quality = this.heroBox.getChildByName("quality");
                    var earlier = this.heroBox.getChildByName("earlier");
                    var critRatio = this.heroBox.getChildByName("critRatio");
                    var desc = this.heroBox.getChildByName("desc");
                    var typeIcon = this.heroBox.getChildByName("typeIcon");
                    var heroCfg = H52D_Framework.ItemConfig[nId];
                    var hero = H52D_Framework.HeroConfig[heroCfg.heroId];
                    var pos = hero.position;
                    var hp_txt = H52D_Framework.HeroUpgrateConfig[hero.type][1].Attr[1][2] * hero.heroRatio + "";
                    var hit_txt = H52D_Framework.HeroUpgrateConfig[hero.type][1].Attr[2][2] * hero.heroRatio + "";
                    var kill_str = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.ActiveSkillConfig[hero.heroBigSkill].descId);
                    //获取动画帧数成图片
                    this.heroAin = new H52D_Framework.Avatar(icon);
                    this.heroAin.Load(hero.strFacadeModel, 1, hero.modelScale * 1.7, pos[1] - 52, pos[2] - 112, Laya.Handler.create(this, function () {
                        _this.heroAin.Play(1, true, true, function () {
                        }, true);
                    }));
                    lv.text = "1";
                    hp.text = hp_txt + "";
                    hit.text = hit_txt + "";
                    earlier.text = hero.stationaryAttribute[1][2];
                    type.text = H52D_Framework.BaseDefine.HeroTypeStr[hero.type];
                    name_1.text = H52D_Framework.GetInfoAttr.Instance.GetText(heroCfg.dwItemName);
                    typeIcon.skin = H52D_Framework.BaseDefine.HeroTypeIcon[hero.type];
                    crit.text = hero.stationaryAttribute[2][2] / 100 + "%";
                    critRatio.text = hero.stationaryAttribute[3][2] / 100 + "%";
                    quality.text = H52D_Framework.BaseDefine.Hero_Rare[heroCfg.dwItemQuality];
                    name_1.color = H52D_Framework.BaseDefine.LabelColor[heroCfg.dwItemQuality];
                    quality.color = H52D_Framework.BaseDefine.LabelColor[heroCfg.dwItemQuality];
                    icon.skin = H52D_Framework.BaseDefine.HeroAllinfo_bg[heroCfg.dwItemQuality];
                    H52D_Framework.SetHtmlStyle(desc, 18, "#d6d7dd", "left");
                    desc.innerHTML = kill_str;
                    break;
                case OpenType.ePet:
                    var pet = void 0;
                    if (nType != 0) {
                        pet = new H52D_Framework.BPetVo(nId);
                        pet.Level = 1;
                    }
                    else {
                        pet = H52D_Framework.PetManager.Instance.OwnPetList[nId];
                    }
                    this.petBox.visible = true;
                    this.boxBuy.visible = false;
                    this.bj.height = 530 * G_StageHeightScale;
                    this.bj_2.visible = false;
                    var pet_lv = this.petBox.getChildByName("lv");
                    var pet_name = this.petBox.getChildByName("name");
                    var pet_icon = this.petBox.getChildByName("icon");
                    var pet_type = this.petBox.getChildByName("type");
                    var pet_color = this.petBox.getChildByName("color");
                    var pet_phyle = this.petBox.getChildByName("phyle");
                    var pet_desc = this.petBox.getChildByName("desc");
                    var pet_prime = this.petBox.getChildByName("prime");
                    var pet_auxiliary = this.petBox.getChildByName("auxiliary");
                    var pet_prime_1 = pet_prime.getChildByName("prime_1");
                    var pet_prime_2 = pet_prime.getChildByName("prime_2");
                    var pet_txt_1 = pet_prime.getChildByName("txt_1");
                    var pet_txt_2 = pet_auxiliary.getChildByName("txt_2");
                    var pet_auxiliary_1 = pet_auxiliary.getChildByName("auxiliary_1");
                    var pet_auxiliary_2 = pet_auxiliary.getChildByName("auxiliary_2");
                    var zs = this.petBox.getChildByName("zs");
                    zs.visible = false;
                    pet_type.visible = false;
                    pet_name.text = pet.petName;
                    pet_phyle.text = pet.petPhyle;
                    H52D_Framework.SetHtmlStyle(pet_desc, 18, "#d6d7dd", "left");
                    pet_desc.innerHTML = pet.petStory;
                    pet_lv.text = pet.Level + "";
                    pet_icon.skin = H52D_Framework.BaseDefine.PetColor_img[pet.petColor];
                    pet_color.text = H52D_Framework.BaseDefine.Hero_Rare[pet.petColor];
                    pet_name.color = pet_color.color = H52D_Framework.BaseDefine.PetColor_label[pet.petColor];
                    //获取动画帧数成图片
                    var pet_pos = pet.position;
                    this.petAin = new H52D_Framework.Avatar(pet_icon);
                    this.petAin.Load(pet.Path, 1, pet.Scla * pet_pos[1], pet_pos[2], pet_pos[3], Laya.Handler.create(this, function () {
                        _this.petAin.Play(1, true, true, function () {
                        }, true);
                    }));
                    var pet_PrimeStr = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.QualityValue[pet.currentAttribute[1][1]].dwName);
                    var pet_AuxiliaryStr = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.QualityValue[pet.currentAttribute[2][1]].dwName);
                    var primeIsper = H52D_Framework.QualityValue[pet.currentAttribute[1][1]].isper;
                    var auxiliaryIsper = H52D_Framework.QualityValue[pet.currentAttribute[2][1]].isper;
                    var prime_1 = pet.AllMainAttribute[1][2];
                    var prime_2 = pet.AllMainAttribute[2][2];
                    var auxiliary_1 = pet.AllAuxAttribute[1][2];
                    var auxiliary_2 = pet.AllAuxAttribute[2][2];
                    if (pet.AllMainAttribute[1][1] == 4 && prime_1 > 10000) {
                        prime_1 = 10000;
                    }
                    if (pet.AllMainAttribute[2][1] == 4 && prime_2 > 10000) {
                        prime_2 = 10000;
                    }
                    if (pet.AllAuxAttribute[1][1] == 4 && auxiliary_1 > 10000) {
                        auxiliary_1 = 10000;
                    }
                    if (pet.AllAuxAttribute[2][1] == 4 && auxiliary_2 > 10000) {
                        auxiliary_2 = 10000;
                    }
                    pet_prime_1.text = primeIsper == 0 ? "+" + prime_1 + pet_PrimeStr : "x" + prime_1 / 100 + "%" + pet_PrimeStr;
                    pet_prime_2.text = auxiliaryIsper == 0 ? "+" + prime_2 + pet_AuxiliaryStr : "x" + prime_2 / 100 + "%" + pet_AuxiliaryStr;
                    pet_auxiliary_1.text = primeIsper == 0 ? "+" + auxiliary_1 + pet_PrimeStr : "x" + auxiliary_1 / 100 + "%" + pet_PrimeStr;
                    pet_auxiliary_2.text = auxiliaryIsper == 0 ? "+" + auxiliary_2 + pet_AuxiliaryStr : "x" + auxiliary_2 / 100 + "%" + pet_AuxiliaryStr;
                    if (pet.ID != H52D_Framework.PetManager.Instance.CurrentpetID) {
                        pet_prime.skin = "ui_pet/btn-weixuanzhong-shenshou.png";
                        pet_auxiliary.skin = "ui_pet/btn-xuanzhong-shenshou.png";
                        pet_txt_1.color = pet_prime_1.color = pet_prime_2.color = "#7f8aaa";
                        pet_txt_2.color = pet_auxiliary_1.color = pet_auxiliary_2.color = "#491a22";
                    }
                    else {
                        pet_prime.skin = "ui_pet/btn-xuanzhong-shenshou.png";
                        pet_auxiliary.skin = "ui_pet/btn-weixuanzhong-shenshou.png";
                        pet_txt_1.color = pet_prime_1.color = pet_prime_2.color = "#491a22";
                        pet_txt_2.color = pet_auxiliary_1.color = pet_auxiliary_2.color = "#7f8aaa";
                    }
                    if (nType != 0) {
                        this.bj.height = 650;
                        this.boxBuy.y = 585;
                        this.boxBuy.visible = true;
                        zs.visible = true;
                        pet_txt_2.color = pet_auxiliary_1.color = pet_auxiliary_2.color = pet_txt_1.color = pet_prime_1.color = pet_prime_2.color = "#d6d7dd";
                        pet_prime.skin = pet_auxiliary.skin = "";
                    }
                    break;
            }
        };
        /**
         * 设置宝箱list样式
         * @param item 单个box
         * @param index 索引
        */
        TipsTreasureView.prototype.ShowContentList = function (item, index) {
            var boxProNum = item.getChildByName("boxProNum");
            var boxProName = item.getChildByName("boxProName");
            var boxProImg = item.getChildByName("boxProImg");
            var bjIcon = item.getChildByName("bjIcon");
            var info_Con = this.boxContentList[index];
            var info_Item = H52D_Framework.ItemConfig[info_Con[H52D_Framework.BaseDefine.ItemSellContentId]];
            var name = H52D_Framework.GetInfoAttr.Instance.GetText(info_Item.dwItemName);
            var num = "X" + info_Con[H52D_Framework.BaseDefine.ItemNumSellContent];
            bjIcon.skin = H52D_Framework.BaseDefine.QualityList[Number(info_Item.dwItemQuality)];
            boxProName.color = H52D_Framework.BaseDefine.LabelColor[Number(info_Item.dwItemQuality)];
            if (info_Item.dwItemTypes != 21) {
                boxProImg.scale(0.8, 0.8);
            }
            boxProNum.changeText(num);
            boxProName.changeText(name);
            boxProImg.skin = "ui_icon/" + info_Item.strIconID_B;
            boxProNum.visible = info_Con[H52D_Framework.BaseDefine.ItemNumSellContent] != 1;
        };
        TipsTreasureView.prototype.BuyItems = function () {
            H52D_Framework.ShopLogic.Instance.SendBuyMsg(this.boxType, this.conId, 1);
            this.OnClickCloseBtn();
            H52D_Framework.Event.DispatchEvent("ShowRedPoint", [E_OpenGrade.SHOP]);
        };
        /**关闭 */
        TipsTreasureView.prototype.OnClickCloseBtn = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("TipsTreasureView", [H52D_Framework.ViewToppestRoot]);
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
        };
        return TipsTreasureView;
    }(ui.tips.TipsTreasureViewUI));
    H52D_Framework.TipsTreasureView = TipsTreasureView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=TipsTreasureView.js.map