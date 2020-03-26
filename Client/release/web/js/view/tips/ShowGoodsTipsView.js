/**获得物品统一界面*/
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
    H52D_Framework.AddViewResource("ShowGoodsTipsView", [
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_sign.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_pet.atlas", type: Laya.Loader.ATLAS }
    ]);
    var ShowGoodsTipsView = /** @class */ (function (_super) {
        __extends(ShowGoodsTipsView, _super);
        /**
         * @param params 传入数组 {1：[1：道具类型 2：道具ID 3：道具数量],2:[].....}
         */
        function ShowGoodsTipsView(params) {
            var _this = _super.call(this) || this;
            /**Item列表 */
            _this.ItemPos = {
                0: { Item: _this.Item_1, type: _this.ItemTpye_1, name: _this.ItemName_1, icon: _this.icon_1, info: _this.info_1 },
                1: { Item: _this.Item_2, type: _this.ItemTpye_2, name: _this.ItemName_2, icon: _this.icon_2, info: _this.info_2 },
                2: { Item: _this.Item_3, type: _this.ItemTpye_3, name: _this.ItemName_3, icon: _this.icon_3, info: _this.info_3 },
                3: { Item: _this.Item_4, type: _this.ItemTpye_4, name: _this.ItemName_4, icon: _this.icon_4, info: _this.info_4 },
                4: { Item: _this.Item_5, type: _this.ItemTpye_5, name: _this.ItemName_5, icon: _this.icon_5, info: _this.info_5 },
            };
            _this.ContentList = [];
            _this.aimArr = [];
            _this._cartridge = new H52D_Framework.Cartridge();
            _this._showItem = new H52D_Framework.Cartridge();
            _this.time = 10;
            _this.scaleDelta = 0;
            _this._bjEffect = [];
            _this._tShowEffect = [];
            _this._claseEffect = [];
            _this.bCloseFlag = false;
            _this._floatNum = 0;
            _this._timeinterval = 1500;
            _this._showItemInterval = 150;
            _this.ContentList = new Array();
            _this.info = params[1];
            // bMore 目前只有十连抽奖会用到 策划鬼才
            var bMore = params[2];
            var itemType;
            var itemId;
            var itemNum;
            var dataInfo;
            if (bMore) {
                for (var nIdx in _this.info) {
                    var obj = _this.info[nIdx];
                    for (var type in obj) {
                        itemType = Number(type);
                        var data = obj[type];
                        for (var id in data) {
                            itemId = Number(id);
                            itemNum = data[id];
                            if (itemNum > 0) {
                                dataInfo = [];
                                dataInfo.push(itemType);
                                dataInfo.push(itemId);
                                dataInfo.push(itemNum);
                                _this.ContentList.push(dataInfo);
                            }
                        }
                    }
                }
            }
            else {
                for (var type in _this.info) {
                    itemType = Number(type);
                    var data = _this.info[type];
                    for (var id in data) {
                        itemId = Number(id);
                        itemNum = data[id];
                        if (itemNum > 0) {
                            dataInfo = [];
                            dataInfo.push(itemType);
                            dataInfo.push(itemId);
                            dataInfo.push(itemNum);
                            _this.ContentList.push(dataInfo);
                        }
                    }
                }
            }
            _this.Init();
            _this.AddEvent();
            _this.Showaside();
            return _this;
        }
        ShowGoodsTipsView.prototype.Init = function () {
            this.closeTime.visible = false;
            this.SetItem();
        };
        /**添加按钮侦听器 */
        ShowGoodsTipsView.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.OnDestroy);
        };
        /**移除事件监听 */
        ShowGoodsTipsView.prototype.OnDestroy = function () {
            H52D_Framework.Tick.ClearAll(this);
            this.offAll();
            this._cartridge.Clear();
            this._showItem.Clear();
            for (var nkey in this._bjEffect) {
                this._bjEffect[nkey].Destroy();
            }
            for (var nkey in this.aimArr) {
                if (this.aimArr[nkey] != null) {
                    this.aimArr[nkey].Destroy();
                }
            }
            //查看是否还有有奖励打开
            if (H52D_Framework.TipsLogic.Instance._showGoodsList.length > 0) {
                var award = H52D_Framework.TipsLogic.Instance._showGoodsList[0];
                H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(award);
                H52D_Framework.TipsLogic.Instance._showGoodsList.splice(0);
            }
        };
        ShowGoodsTipsView.prototype.Showaside = function () {
            var _this = this;
            var asideId = 0;
            for (var i in this.info) {
                for (var cardId in this.info[i]) {
                    if (H52D_Framework.ItemConfig[cardId] && H52D_Framework.ItemConfig[cardId]["dwItemTypes"] == 21) {
                        var heroId = H52D_Framework.ItemConfig[cardId]["heroId"];
                        asideId = H52D_Framework.HeroConfig[heroId]["aside"];
                        //判断英雄有没有解锁
                        var heroList = H52D_Framework.HeroManager.Instance.Herolist;
                        for (var hid in heroList) {
                            if (heroId == Number(hid)) {
                                asideId = 0;
                                break;
                            }
                        }
                        //判断背包有没有卡牌
                        var list = H52D_Framework.BagManager.Instance.GetItemList();
                        for (var iid in list) {
                            if (list[iid].dwItemTypes == 21 && //子类型是英雄类型
                                heroId == H52D_Framework.ItemConfig[iid]["heroId"] && //该英雄是当前获得的英雄
                                H52D_Framework.BagManager.Instance.getItemNumber(Number(iid)) > 1) { //英雄碎片不能只有当前这一个
                                asideId = 0;
                                break;
                            }
                        }
                    }
                    break;
                }
                if (!asideId) {
                    break;
                }
            }
            if (asideId != 0) {
                H52D_Framework.Tick.Clear(this, this.Countones);
                H52D_Framework.CustomsManager.Instance.OpenAside(asideId, function () {
                    H52D_Framework.Tick.Once(_this._timeinterval, _this, _this.Countones, [_this.ContentList.length]);
                });
            }
        };
        /**倒计时
         * @param length 物品个数
         */
        ShowGoodsTipsView.prototype.CountDownTime = function (length) {
            this.time = 10;
            var str = "点击任意位置获得奖品(" + this.time.toString() + "s)";
            this.closeTime.text = str;
            this.closeTime.visible = false;
            H52D_Framework.Tick.Clear(this, this.Countones);
            H52D_Framework.Tick.Once(this._timeinterval, this, this.Countones, [length]);
        };
        ShowGoodsTipsView.prototype.Countones = function (length) {
            H52D_Framework.Tick.Clear(this, this.CountDown);
            this.closeTime.visible = true;
            H52D_Framework.Tick.Loop(1000, this, this.CountDown, [length]);
        };
        ShowGoodsTipsView.prototype.CountDown = function (length) {
            this.time--;
            var str = "点击任意位置获得奖品(" + this.time.toString() + "s)";
            this.closeTime.text = str;
            if (this.time <= 0) {
                length <= 5 ? this.OnClickOkBtn() : this.SetItem(true);
                this.closeTime.visible = false;
                H52D_Framework.Tick.Clear(this, this.CountDown);
            }
        };
        /**物品渐变出现
         * @param item 物品
         */
        ShowGoodsTipsView.prototype.SetItemScale = function (item, length) {
            var aelta = this.scaleDelta;
            H52D_Framework.Tick.Clear(this, SetScale);
            H52D_Framework.Tick.Loop(10, this, SetScale);
            function SetScale() {
                length == 1 ? aelta += 0.1 : aelta += 0.05;
                if (aelta >= 1) {
                    item.scale(1, 1);
                    H52D_Framework.Tick.Clear(this, SetScale);
                    return;
                }
                item.scale(aelta, aelta);
            }
        };
        /** 设置物品
         * b 是否有下一页
        */
        ShowGoodsTipsView.prototype.SetItem = function (b) {
            var _this = this;
            if (b === void 0) { b = false; }
            this.close.off(Laya.Event.CLICK, this, this.OnClickOkBtn);
            this.close.off(Laya.Event.CLICK, this, this.SetItem);
            if (b) {
                this.PlayClaseEffect(Laya.Handler.create(this, function () {
                    for (var i in _this.ItemPos) {
                        _this.ItemPos[i].Item.visible = false;
                    }
                    if (_this.ContentList == null)
                        return;
                    var leng = _this.ContentList.length;
                    if (leng > 5) {
                        H52D_Framework.OneTimer(_this._timeinterval, function () {
                            _this.close.on(Laya.Event.CLICK, _this, _this.SetItem, [true]);
                        });
                        var data = _this.ContentList.splice(0, 5);
                        _this.SetItemContent(5, data);
                    }
                    else if (leng <= 5) {
                        H52D_Framework.OneTimer(_this._timeinterval, function () {
                            _this.close.on(Laya.Event.CLICK, _this, _this.OnClickOkBtn);
                        });
                        _this.SetItemContent(leng, _this.ContentList);
                        _this.SetItemPos(leng);
                    }
                    _this.CountDownTime(leng);
                }));
                return;
            }
            for (var i in this.ItemPos) {
                this.ItemPos[i].Item.visible = false;
            }
            if (this.ContentList == null)
                return;
            var leng = this.ContentList.length;
            if (leng > 5) {
                H52D_Framework.OneTimer(this._timeinterval, function () {
                    _this.close.on(Laya.Event.CLICK, _this, _this.SetItem, [true]);
                });
                var data = this.ContentList.splice(0, 5);
                this.SetItemContent(5, data);
            }
            else if (leng <= 5) {
                H52D_Framework.OneTimer(this._timeinterval, function () {
                    _this.close.on(Laya.Event.CLICK, _this, _this.OnClickOkBtn);
                });
                this.SetItemContent(leng, this.ContentList);
                this.SetItemPos(leng);
            }
            this.CountDownTime(leng);
        };
        /**设置Item初始位置 */
        ShowGoodsTipsView.prototype.SetItemPos = function (len) {
            switch (len) {
                case 2:
                    this.ItemPos[0].Item.centerX = -150 * G_StageWidthScale;
                    this.ItemPos[1].Item.centerX = 150 * G_StageWidthScale;
                    this.ItemPos[0].info.centerX = -150 * G_StageWidthScale;
                    this.ItemPos[1].info.centerX = 150 * G_StageWidthScale;
                    break;
                case 3:
                    this.ItemPos[0].Item.centerX = -150 * G_StageWidthScale;
                    this.ItemPos[0].Item.centerY = 130 * G_StageHeightScale;
                    this.ItemPos[1].Item.centerX = 150 * G_StageWidthScale;
                    this.ItemPos[1].Item.centerY = 130 * G_StageHeightScale;
                    this.ItemPos[2].Item.centerX = 0 * G_StageWidthScale;
                    this.ItemPos[2].Item.centerY = -200 * G_StageHeightScale;
                    this.ItemPos[0].info.centerX = -150 * G_StageWidthScale;
                    this.ItemPos[0].info.centerY = 100 * G_StageHeightScale;
                    this.ItemPos[1].info.centerX = 150 * G_StageWidthScale;
                    this.ItemPos[1].info.centerY = 100 * G_StageHeightScale;
                    this.ItemPos[2].info.centerX = 0 * G_StageWidthScale;
                    this.ItemPos[2].info.centerY = -270 * G_StageHeightScale;
                    break;
                case 4:
                    this.ItemPos[0].Item.centerX = -150 * G_StageWidthScale;
                    this.ItemPos[0].Item.centerY = 130 * G_StageHeightScale;
                    this.ItemPos[1].Item.centerX = 150 * G_StageWidthScale;
                    this.ItemPos[1].Item.centerY = 130 * G_StageHeightScale;
                    this.ItemPos[2].Item.centerX = 150 * G_StageWidthScale;
                    this.ItemPos[2].Item.centerY = -200 * G_StageHeightScale;
                    this.ItemPos[3].Item.centerX = -150 * G_StageWidthScale;
                    this.ItemPos[3].Item.centerY = -200 * G_StageHeightScale;
                    this.ItemPos[0].info.centerX = -150 * G_StageWidthScale;
                    this.ItemPos[0].info.centerY = 100 * G_StageHeightScale;
                    this.ItemPos[1].info.centerX = 150 * G_StageWidthScale;
                    this.ItemPos[1].info.centerY = 100 * G_StageHeightScale;
                    this.ItemPos[2].info.centerX = 150 * G_StageWidthScale;
                    this.ItemPos[2].info.centerY = -270 * G_StageHeightScale;
                    this.ItemPos[3].info.centerX = -150 * G_StageWidthScale;
                    this.ItemPos[3].info.centerY = -270 * G_StageHeightScale;
                    break;
            }
        };
        /**
         * 设置Item内容
         * @param length 物品个数
         * @param dataArr 物品数组
         */
        ShowGoodsTipsView.prototype.SetItemContent = function (length, dataArr) {
            var _this = this;
            this._showItem.Clear();
            var _loop_1 = function (info) {
                var i = info;
                var func = Laya.Handler.create(this_1, function () {
                    H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/get_new_prop.mp3");
                    var data = dataArr[i];
                    var proType = data[0];
                    var proId = data[1];
                    var proNum = data[2];
                    var bj = "bj_" + (i + 1);
                    var tb = "tb_" + (i + 1);
                    var hpValue = "hpValue_" + (i + 1);
                    var hitValue = "hitValue_" + (i + 1);
                    var heroType = "heroType_" + (i + 1);
                    var hitname = _this.ItemPos[i].Item.getChildByName("hitname");
                    var hpname = _this.ItemPos[i].Item.getChildByName("hpname");
                    _this.ItemPos[i].Item.scale(0, 0);
                    if (proType == H52D_Framework.BaseDefine.ItemTypePro) {
                        _this.ItemPos[i].Item.visible = true;
                        var cfg = H52D_Framework.ItemConfig[proId];
                        var icon = cfg.strIconID_B;
                        var name_1 = H52D_Framework.GetInfoAttr.Instance.GetText(cfg.dwItemName);
                        var colorNum = cfg.dwItemQuality;
                        var content = void 0;
                        content = "x" + proNum.toString();
                        if (Number(proId) == H52D_Framework.BaseDefine.ItemIdGold) {
                            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.ADD_GOLD);
                        }
                        _this.ItemPos[i].type.text = content;
                        _this.ItemPos[i].type.visible = proNum != 1;
                        _this.ItemPos[i].name.text = name_1.toString();
                        _this.ItemPos[i].name.color = H52D_Framework.BaseDefine.LabelColor[colorNum];
                        _this.SetItemScale(_this.ItemPos[i].Item, length);
                        if (cfg.dwItemTypes != H52D_Framework.BaseDefine.ItemSonTypeUesHero) {
                            _this.ItemPos[i].icon.skin = "ui_icon/" + icon;
                            _this.ItemPos[i].icon.y = 110 * G_StageHeightScale;
                            hpname.visible = false;
                            hitname.visible = false;
                            _this[bj].visible = false;
                            _this[tb].visible = false;
                            _this[hpValue].visible = false;
                            _this[heroType].visible = false;
                            _this[hitValue].visible = false;
                            _this.aimArr.push(null);
                            if (cfg.dwItemType == 1 ||
                                Number(proId) == 2301 ||
                                Number(proId) == 3201) {
                                H52D_Framework.TipsLogic.Instance.OpenSystemTips(name_1 + "+" + proNum);
                            }
                        }
                        else {
                            _this[bj].skin = H52D_Framework.BaseDefine.HeroQualityList[cfg.dwItemQuality];
                            _this[heroType].skin = H52D_Framework.BaseDefine.HeroTypeIcon[1];
                            hpname.visible = false;
                            hitname.visible = false;
                            _this[bj].visible = false;
                            _this[tb].visible = false;
                            _this[hpValue].visible = false;
                            _this[heroType].visible = false;
                            _this[hitValue].visible = false;
                            var hero = H52D_Framework.HeroConfig[cfg.heroId];
                            _this.ItemPos[i].icon.skin = "";
                            _this.ItemPos[i].icon.y = 86 * G_StageHeightScale;
                            var pos = hero.position;
                            //获取动画帧数成图片
                            var heroAin = new H52D_Framework.Avatar(_this.ItemPos[i].icon);
                            heroAin.Load(hero.strFacadeModel, 1, hero.modelScale * 1.7, 0, 100, Laya.Handler.create(_this, function (heroAins) {
                                heroAins.Play(1, true, true, function () {
                                }, true);
                            }));
                            _this.aimArr.push(heroAin);
                        }
                    }
                    else if (proType == H52D_Framework.BaseDefine.ItemTypeEquip) {
                        _this.ItemPos[i].Item.visible = true;
                        var equip = H52D_Framework.EquipConfig[proId];
                        var equipName = H52D_Framework.GetInfoAttr.Instance.GetText(equip.equipName);
                        var equipIcon = "ui_icon/" + equip.equipIcon;
                        var equipType = equip.equipType;
                        var equipColor = equip.equipColor;
                        var equipLevel = equip.equipLevel;
                        _this.ItemPos[i].icon.skin = equipIcon;
                        _this.ItemPos[i].icon.width = 140;
                        _this.ItemPos[i].icon.height = 140;
                        _this.ItemPos[i].type.text = "等级： " + equipLevel;
                        _this.ItemPos[i].name.text = equipName;
                        _this.ItemPos[i].name.color = H52D_Framework.BaseDefine.PetColor_label[equipColor];
                        _this.SetItemScale(_this.ItemPos[i].Item, length);
                        hpname.visible = false;
                        hitname.visible = false;
                        _this[bj].visible = false;
                        _this[tb].visible = false;
                        _this[hpValue].visible = false;
                        _this[heroType].visible = false;
                        _this[hitValue].visible = false;
                    }
                    else if (proType == H52D_Framework.BaseDefine.ItemTypePet) {
                        _this.ItemPos[i].Item.visible = true;
                        var pet = H52D_Framework.PetConfig[proId];
                        var pet_name = H52D_Framework.GetInfoAttr.Instance.GetText(pet.petName);
                        var pet_type = H52D_Framework.GetInfoAttr.Instance.GetText(pet.petPhyle);
                        var pet_icon = pet.strPetIcon;
                        var pet_color = pet.petColor;
                        var pet_mainbase = pet.initialPrimeAttribute;
                        var bool = _this.ItemPos[i].icon.visible;
                        _this.ItemPos[i].icon.skin = "";
                        _this.ItemPos[i].type.text = "X " + proNum;
                        _this.ItemPos[i].name.text = pet_name;
                        _this.ItemPos[i].name.color = H52D_Framework.BaseDefine.PetColor_label[pet_color];
                        _this.SetItemScale(_this.ItemPos[i].Item, length);
                        hpname.visible = true;
                        hitname.visible = false;
                        _this[tb].visible = true;
                        _this[bj].visible = false;
                        _this[hpValue].visible = true;
                        _this[hitValue].visible = true;
                        _this[heroType].visible = true;
                        hitname.text = pet_type;
                        hitname.x = hitname.x + 20;
                        hitname.y = hitname.y + 10;
                        hpname.visible = false;
                        _this[hpValue].visible = false;
                        _this[hitValue].visible = false;
                        _this[tb].skin = "";
                        _this[heroType].skin = "";
                        _this[bj].skin = H52D_Framework.BaseDefine.HeroQualityList[pet_color];
                        //获取动画帧数成图片
                        var petAin = new H52D_Framework.Avatar(_this.ItemPos[i].icon);
                        petAin.Load(pet.strPetModel, 1, pet.modelScale * 1.7, 0, 100, Laya.Handler.create(_this, function (heroAins) {
                            heroAins.Play(1, true, true, function () {
                            }, true);
                        }));
                        _this.aimArr.push(petAin);
                    }
                    var effect = _this.ItemPos[i].Item.getChildByName("effect");
                    _this.SetItemFloat(_this.ItemPos[i].Item);
                    _this.ShowProEffect(_this.ItemPos[i].Item, effect);
                    _this.CloseEffect(_this.ItemPos[i].info);
                });
                this_1._showItem.AddFunc(func);
                this_1._showItem.AddDelay(this_1._showItemInterval);
            };
            var this_1 = this;
            for (var info = 0; info < length; info++) {
                _loop_1(info);
            }
            this._showItem.Do();
        };
        ShowGoodsTipsView.prototype.ShowProEffect = function (Item, effect) {
            var _showEffect = new H52D_Framework.Avatar(Item);
            _showEffect.Load("res/effect/effect_ui_daoju1/effect_ui_daoju1.sk", 1, 2, 100 * G_StageWidthScale, 135 * G_StageHeightScale, Laya.Handler.create(this, function (_showEffects) {
                _showEffects.visible = true;
                _showEffects.Play("effect_ui_daoju1", false, true, function () {
                });
            }));
            this._tShowEffect.push(_showEffect);
            var _showEffectBj = new H52D_Framework.Avatar(effect);
            _showEffectBj.Load("res/effect/effect_ui_daoju2/effect_ui_daoju2.sk", 1, 3, 100 * G_StageWidthScale, 135 * G_StageHeightScale, Laya.Handler.create(this, function (_showEffectBjs) {
                _showEffectBjs.visible = true;
                _showEffectBjs.Play("effect_ui_daoju2", true, true, function () {
                });
            }));
            this._bjEffect.push(_showEffectBj);
        };
        ShowGoodsTipsView.prototype.CloseEffect = function (effect) {
            var _showEffectBj = new H52D_Framework.Avatar(effect);
            _showEffectBj.Load("res/effect/effect_ui_daoju3/effect_ui_daoju3.sk", 1, 0.7, 100 * G_StageWidthScale, 145 * G_StageHeightScale, Laya.Handler.create(this, function () {
            }));
            this._claseEffect.push(_showEffectBj);
        };
        /**关闭特效运行 */
        ShowGoodsTipsView.prototype.PlayClaseEffect = function (fun) {
            var _this = this;
            this._cartridge.Clear();
            var _loop_2 = function (eff) {
                var idx = Number(eff);
                var func = Laya.Handler.create(this_2, function () {
                    H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/get_new_prop02.mp3");
                    _this.ItemPos[idx].Item.scale(0, 0);
                    if (_this.aimArr[idx]) {
                        _this.aimArr[idx].Destroy();
                    }
                    _this._claseEffect[idx].Play("effect_ui_daoju3", false, true, function () {
                    });
                    _this._bjEffect[idx].Destroy();
                    _this._tShowEffect[idx].Destroy();
                });
                this_2._cartridge.AddFunc(func);
                this_2._cartridge.AddDelay(this_2._showItemInterval);
            };
            var this_2 = this;
            for (var eff in this._claseEffect) {
                _loop_2(eff);
            }
            var funss = Laya.Handler.create(this, function () {
                for (var nkey in _this._claseEffect) {
                    _this._claseEffect[nkey].Destroy();
                }
                _this._claseEffect = [];
                _this.aimArr = [];
                _this._bjEffect = [];
                _this._tShowEffect = [];
                fun.run();
            });
            this._cartridge.AddFunc(funss);
            this._cartridge.AddDelay(500);
            this._cartridge.Do();
        };
        /**点击关闭 */
        ShowGoodsTipsView.prototype.OnClickOkBtn = function () {
            var _this = this;
            //this.close.off(Laya.Event.CLICK, this, this.OnClickOkBtn);
            if (this.bCloseFlag) {
                return;
            }
            this.bCloseFlag = true;
            this.PlayClaseEffect(Laya.Handler.create(this, function () {
                _this.bCloseFlag = false;
                H52D_Framework.UIManager.Instance.DestroyUI("ShowGoodsTipsView", [H52D_Framework.ViewToppestRoot]);
                H52D_Framework.Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_3);
                H52D_Framework.Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_5);
                H52D_Framework.Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_8);
                H52D_Framework.Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_9);
            }));
        };
        /**物品浮动 */
        ShowGoodsTipsView.prototype.SetItemFloat = function (item) {
            if (this._floatNum >= 5)
                return;
            this._floatNum++;
            var y = 0;
            H52D_Framework.Tick.Loop(10, this, function () {
                y += 0.05;
                item.centerY += Math.sin(y) * G_StageHeightScale;
            });
        };
        ShowGoodsTipsView.prototype.RemoveNum = function () {
            this._cartridge.RemoveNum();
            this._showItem.RemoveNum();
        };
        return ShowGoodsTipsView;
    }(ui.tips.ShowGoodsTipsViewUI));
    H52D_Framework.ShowGoodsTipsView = ShowGoodsTipsView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ShowGoodsTipsView.js.map