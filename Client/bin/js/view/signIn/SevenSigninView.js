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
/**七日登入页面*/
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("SevenSigninView", [
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_sign.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
    ]);
    var SevenSigninView = /** @class */ (function (_super) {
        __extends(SevenSigninView, _super);
        function SevenSigninView() {
            var _this = _super.call(this) || this;
            _this._effectList = {};
            _this.Init();
            _this.AddEvent();
            return _this;
        }
        SevenSigninView.prototype.Init = function () {
            if (H52D_Framework.IsNotBaiDuSdk()) {
                this.baibuImg.visible = false;
                this.sevenSignInList.y = 560;
                this.sevenday.y = 190;
            }
            if (!H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes) {
                var str = H52D_Framework.GetInfoAttr.Instance.GetSystemText(30077);
                this.weekqqadw.text = str;
                this.weekqqadw.visible = true;
            }
            else {
                this.weekqqadw.visible = false;
            }
            this.UpDateList();
            this.type.text = H52D_Framework.GetInfoAttr.Instance.GetText(5307);
            this.textVip.text = H52D_Framework.Format(H52D_Framework.GetInfoAttr.Instance.GetText(7119), H52D_Framework.GameParamConfig.TotalLoadDay);
        };
        /**添加事件 */
        SevenSigninView.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.OnDestroy);
            this.close.on(Laya.Event.CLICK, this, this.CloseUI);
            H52D_Framework.Event.RegistEvent('UpDateSevenList', Laya.Handler.create(this, this.UpDateList));
            H52D_Framework.Event.RegistEvent('changelabelText', Laya.Handler.create(this, this.Changetext));
        };
        SevenSigninView.prototype.Changetext = function () {
            if (window["wx"]) {
                this.weekqqadw.visible = H52D_Framework.SignInLogic.Instance.WeekText;
                if (H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes) {
                    if (H52D_Framework.SignInLogic.Instance.ReceiveTimes > 1) {
                        var str = H52D_Framework.GetInfoAttr.Instance.GetSystemText(7158, H52D_Framework.SignInLogic.Instance.ReceiveTimes);
                        this.weekqqadw.text = str;
                        this.weekqqadw.visible = true;
                    }
                }
                else {
                    this.weekqqadw.text = H52D_Framework.GetInfoAttr.Instance.GetSystemText(7159);
                }
            }
            else {
                this.weekqqadw.visible = false;
            }
        };
        /**销毁按钮侦听器 */
        SevenSigninView.prototype.OnDestroy = function () {
            for (var idx in this._effectList) {
                var eff = this._effectList[idx];
                eff.Destroy();
            }
            this._effectList = {};
            this.offAll();
        };
        /**关闭UI */
        SevenSigninView.prototype.CloseUI = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("SevenSigninView", [H52D_Framework.ViewUpRoot]);
        };
        SevenSigninView.prototype.AddList = function () {
            var arr = [];
            var sevenListData = H52D_Framework.SignInLogic.Instance.SevenListData;
            for (var dayNum in sevenListData) {
                arr.push(Number(dayNum));
            }
            this.sevenSignInList.array = arr;
        };
        SevenSigninView.prototype.UpDateList = function () {
            this.AddList();
            this.sevenSignInList.renderHandler = new Laya.Handler(this, this.SetSignInList);
        };
        /**
         * 设置每日奖励list样式
         * @param item 单个box
         * @param index 索引
        */
        SevenSigninView.prototype.SetSignInList = function (item, index) {
            var _this = this;
            var arr = this.sevenSignInList.array;
            var toDayNum = arr[index];
            var signInData = H52D_Framework.SignInLogic.Instance.SevenListData[toDayNum];
            if (window["wx"]) {
                if ((7 <= H52D_Framework.SignInLogic.Instance.ReceiveTimes) && (H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes)) {
                    item.visible = false;
                    toDayNum = H52D_Framework.SignInLogic.Instance.ReceiveTimes;
                    if (signInData.itemType == H52D_Framework.BaseDefine.ItemTypePro) {
                        var tItem = H52D_Framework.ItemConfig[signInData.itemId];
                        this.sevenBg.skin = H52D_Framework.BaseDefine.QualityList[tItem.dwItemQuality];
                        this.sevenIcon.skin = "ui_icon/" + tItem.strIconID_B;
                        this.sevenNum.visible = signInData.itemNum != 1;
                        this.sevenNum.text = "x" + signInData.itemNum + "";
                        this.sevenName.text = H52D_Framework.GetInfoAttr.Instance.GetText(tItem.dwItemName);
                        if (this._effectList[7] != null) {
                            this._effectList[7].Destroy();
                        }
                        if (toDayNum <= H52D_Framework.SignInLogic.Instance.ToDayNumSeven) {
                            this.sevenday.alpha = 1;
                        }
                        else {
                            this.sevenday.alpha = 0.7;
                        }
                        if ((toDayNum == 7)) {
                            this._effectList[toDayNum] = new H52D_Framework.Avatar(this.sevenBg);
                            this._effectList[toDayNum].Load("res/effect/effect_ui_daoju2/effect_ui_daoju2.sk", 1, 5, 72, 72, Laya.Handler.create(this, function () {
                                _this._effectList[toDayNum].Play("effect_ui_daoju2", true, true, function () {
                                });
                            }));
                        }
                        this.sevenAlready.visible = signInData.bAlready;
                    }
                    this.clickSevenBtn.on(Laya.Event.CLICK, this, this.ClickOkBtn, [toDayNum, 6]);
                    return;
                }
            }
            if (toDayNum >= 7) {
                item.visible = false;
                if (signInData.itemType == H52D_Framework.BaseDefine.ItemTypePro) {
                    var tItem = H52D_Framework.ItemConfig[signInData.itemId];
                    this.sevenBg.skin = H52D_Framework.BaseDefine.QualityList[tItem.dwItemQuality];
                    this.sevenIcon.skin = "ui_icon/" + tItem.strIconID_B;
                    this.sevenNum.visible = signInData.itemNum != 1;
                    this.sevenNum.text = "x" + signInData.itemNum + "";
                    this.sevenName.text = H52D_Framework.GetInfoAttr.Instance.GetText(tItem.dwItemName);
                    if (this._effectList[toDayNum] != null) {
                        this._effectList[toDayNum].Destroy();
                    }
                    if (toDayNum <= H52D_Framework.SignInLogic.Instance.ToDayNumSeven) {
                        this.sevenday.alpha = 1;
                    }
                    else {
                        this.sevenday.alpha = 0.7;
                    }
                    if ((toDayNum == H52D_Framework.SignInLogic.Instance.ToDayNumSeven) && (!H52D_Framework.SignInLogic.Instance.toDayAlrSeven)) {
                        this._effectList[toDayNum] = new H52D_Framework.Avatar(this.sevenBg);
                        this._effectList[toDayNum].Load("res/effect/effect_ui_daoju2/effect_ui_daoju2.sk", 1, 5, 72, 72, Laya.Handler.create(this, function () {
                            _this._effectList[toDayNum].Play("effect_ui_daoju2", true, true, function () {
                            });
                        }));
                    }
                    this.sevenAlready.visible = signInData.bAlready;
                }
                this.clickSevenBtn.on(Laya.Event.CLICK, this, this.ClickOkBtn, [toDayNum]);
                return;
            }
            var name = item.getChildByName("name");
            var itemBg = item.getChildByName("itemBg");
            var dayNum = item.getChildByName("dayNum");
            var already = item.getChildByName("already");
            var itemIcon = item.getChildByName("itemIcon");
            var clickBtn = item.getChildByName("clickBtn");
            var num = item.getChildByName("num");
            if (this._effectList[toDayNum] != null) {
                this._effectList[toDayNum].Destroy();
            }
            if (window["wx"]) {
                if ((toDayNum == H52D_Framework.SignInLogic.Instance.ReceiveTimes) && (H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes)) {
                    this._effectList[H52D_Framework.SignInLogic.Instance.ReceiveTimes] = new H52D_Framework.Avatar(itemBg);
                    this._effectList[H52D_Framework.SignInLogic.Instance.ReceiveTimes].Load("res/effect/effect_ui_daoju2/effect_ui_daoju2.sk", 1, 2, 50, 50, Laya.Handler.create(this, function () {
                        _this._effectList[H52D_Framework.SignInLogic.Instance.ReceiveTimes].Play("effect_ui_daoju2", true, true, function () {
                        });
                    }));
                }
                if (toDayNum <= H52D_Framework.SignInLogic.Instance.ReceiveTimes) {
                    item.alpha = 1;
                }
                else {
                    item.alpha = 0.7;
                }
            }
            else {
                if ((toDayNum == H52D_Framework.SignInLogic.Instance.ToDayNumSeven) && (!H52D_Framework.SignInLogic.Instance.toDayAlrSeven)) {
                    this._effectList[toDayNum] = new H52D_Framework.Avatar(itemBg);
                    this._effectList[toDayNum].Load("res/effect/effect_ui_daoju2/effect_ui_daoju2.sk", 1, 2, 50, 50, Laya.Handler.create(this, function () {
                        _this._effectList[toDayNum].Play("effect_ui_daoju2", true, true, function () {
                        });
                    }));
                }
                if (toDayNum <= H52D_Framework.SignInLogic.Instance.ToDayNumSeven) {
                    item.alpha = 1;
                }
                else {
                    item.alpha = 0.7;
                }
            }
            num.visible = signInData.itemNum != 1;
            num.text = "x" + signInData.itemNum + "";
            dayNum.text = "第" + arr[index] + "天";
            if (signInData.itemType == H52D_Framework.BaseDefine.ItemTypePro) {
                var tItem = H52D_Framework.ItemConfig[signInData.itemId];
                name.text = H52D_Framework.GetInfoAttr.Instance.GetText(tItem.dwItemName);
                itemBg.skin = H52D_Framework.BaseDefine.QualityList[tItem.dwItemQuality];
                already.visible = signInData.bAlready;
                itemIcon.skin = "ui_icon/" + tItem.strIconID_B;
            }
            clickBtn.on(Laya.Event.CLICK, this, this.ClickOkBtn, [toDayNum, index]);
        };
        /** 点击领取*/
        SevenSigninView.prototype.ClickOkBtn = function (toDayNum, nDay) {
            H52D_Framework.SignInLogic.Instance.WeekIndx = nDay;
            if (window["wx"]) {
                if (H52D_Framework.SignInLogic.Instance.ReceiveTimes <= toDayNum) {
                    if (H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes) { //有观看广告次数
                        if (H52D_Framework.SignInLogic.Instance.ReceiveTimes >= toDayNum) {
                            H52D_Framework.UIManager.Instance.CreateUI("AdvertisementView", [H52D_Framework.ViewUpRoot, AdvertisementType.weekLogin, toDayNum]);
                        }
                        else {
                            var str = H52D_Framework.GetInfoAttr.Instance.GetSystemText(30076);
                            H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
                        }
                    }
                    else { //没有广告次数
                        var str = H52D_Framework.GetInfoAttr.Instance.GetSystemText(30077);
                        this.weekqqadw.text = str;
                        this.weekqqadw.visible = true;
                        if (this._effectList[toDayNum] != null) {
                            this._effectList[toDayNum].Destroy();
                        }
                    }
                    this.weekqqadw.text = H52D_Framework.GetInfoAttr.Instance.GetSystemText(7159);
                }
                else {
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips("您今天已经领取过奖励了");
                }
            }
            else {
                if (toDayNum == H52D_Framework.SignInLogic.Instance.ToDayNumSeven) {
                    if (H52D_Framework.SignInLogic.Instance.toDayAlrSeven) {
                        H52D_Framework.TipsLogic.Instance.OpenSystemTips("您今天已经领取过奖励了");
                        return;
                    }
                    H52D_Framework.SignInLogic.Instance.SendReqSevenSignIn();
                }
                else if (toDayNum > H52D_Framework.SignInLogic.Instance.ToDayNumSeven) {
                    var str = H52D_Framework.Format(H52D_Framework.SysPromptConfig[30041].strPromptInfo, toDayNum);
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
                }
                else if (toDayNum < H52D_Framework.SignInLogic.Instance.ToDayNumSeven) {
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips("您已经领取过该奖励！");
                }
            }
        };
        return SevenSigninView;
    }(ui.signIn.SevenSigninViewUI));
    H52D_Framework.SevenSigninView = SevenSigninView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=SevenSigninView.js.map