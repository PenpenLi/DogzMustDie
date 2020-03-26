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
/**VIP*/
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("VipView", [
        { url: "res/ui/ui_vip.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
    ]);
    var VipView = /** @class */ (function (_super) {
        __extends(VipView, _super);
        function VipView() {
            var _this = _super.call(this) || this;
            _this.VipChargeCfg = H52D_Framework.ChargeConfig[4][1];
            _this.Init();
            _this.AddEvent();
            _this.UpdatePlayerInfo();
            _this.AddList();
            return _this;
        }
        VipView.prototype.Init = function () {
            this.contentList.vScrollBarSkin = "";
            var nPrice = this.VipChargeCfg.Price;
            var nMoney = this.VipChargeCfg.Money;
            this.buytext.text = H52D_Framework.IsAD() ? "邀请" : nPrice + "元";
            if (window['wx']) {
                this.buytext.text = "邀请";
            }
            this.moneytext.text = "原价" + nMoney;
            this.buybun.getChildByName("text_2").text = H52D_Framework.IsAD() ? "获得2天VIP特权" : "获得永久VIP特权";
            this.buybun.getChildByName("point").visible = !H52D_Framework.IsAD();
            this.text_1.visible = this.text_2.visible = false;
            var VipDiamondDescription = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.GameParamConfig.VipDiamondDescription);
            this.boxDiamondDescription.visible = !H52D_Framework.IsAD();
            H52D_Framework.SetHtmlStyle(this.vipDiamondDescription, 24, "#fef5cd", "left");
            this.vipDiamondDescription.innerHTML = VipDiamondDescription;
            H52D_Framework.Event.DispatchEvent("SetMoneny", [false, "e_vip"]);
        };
        /**添加事件 */
        VipView.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.OnDestroy);
            this.close.on(Laya.Event.CLICK, this, this.CloseUI);
            this.buybun.on(Laya.Event.CLICK, this, this.Buy);
            // this.invitationbtn.on(Laya.Event.CLICK, this, this.Invitation);
            H52D_Framework.Event.RegistEvent('UpdateVipInfo', Laya.Handler.create(this, this.UpdatePlayerInfo));
        };
        VipView.prototype.UpdatePlayerInfo = function () {
            this.addNum.visible = !H52D_Framework.IsAD();
            this.addNum.text = "累计次数：" + H52D_Framework.MasterPlayer.Instance.invitaVipTimes + "/5次";
            var bIsVip = H52D_Framework.MasterPlayer.Instance.player.IsVip;
            // 是否是永久VIP
            if (H52D_Framework.MasterPlayer.Instance.player.ExpirationTime == -1) {
                this.validTime.text = "有效时间：永久激活";
                this.text_1.text = this.text_2.text = H52D_Framework.GetInfoAttr.Instance.GetText(7115);
                this.text_1.visible = this.text_2.visible = true;
                this.buybun.visible = this.moneytext.visible = false;
            }
            else {
                this.text_1.visible = this.text_2.visible = false;
                this.buybun.visible = true;
                this.moneytext.visible = !H52D_Framework.IsAD();
                this.countdown = 0;
                if (H52D_Framework.MasterPlayer.Instance.player.ExpirationTime > H52D_Framework.Time.serverSecodes) {
                    this.countdown = H52D_Framework.MasterPlayer.Instance.player.ExpirationTime - H52D_Framework.Time.serverSecodes;
                }
                this.validTime.text = "有效时间：" + H52D_Framework.GetFormatNumTime(this.countdown);
                if (this.countdown > 0) {
                    H52D_Framework.Tick.Loop(1000, this, this.ShowTime);
                }
            }
            this.buybun.disabled = H52D_Framework.MasterPlayer.Instance.player.IsPermanentVip;
            this.AddList();
            this.contentList.renderHandler = new Laya.Handler(this, this.SetContentList);
        };
        VipView.prototype.ShowTime = function () {
            if (--this.countdown > 0) {
                this.validTime.text = "有效时间：" + H52D_Framework.GetFormatNumTime(this.countdown);
            }
            else if (this.countdown <= 0) {
                this.countdown = 0;
                H52D_Framework.Tick.Clear(this, this.ShowTime);
            }
        };
        VipView.prototype.OnSharePanel = function () {
            H52D_Framework.CallShare(H52D_Framework.ShareType.base);
        };
        /**销毁按钮侦听器 */
        VipView.prototype.OnDestroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent('UpdateVipInfo', Laya.Handler.create(this, this.UpdatePlayerInfo));
        };
        /**关闭UI */
        VipView.prototype.CloseUI = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("VipView", [H52D_Framework.ViewUpRoot]);
            //添加按钮音效
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
        };
        VipView.prototype.Buy = function () {
            if (H52D_Framework.IsAD()) {
                // 邀请
                H52D_Framework.CallShare(H52D_Framework.ShareType.base);
            }
            // 购买 
            else {
                H52D_Framework.BaiDuSDK.Instance.ToRecharge(4, 1, "VIP");
            }
        };
        /**添加List数据 */
        VipView.prototype.AddList = function () {
            // vip特权国际化
            var VipContentDescription = H52D_Framework.GameParamConfig.VipContentDescription;
            var arr = [];
            for (var strId in VipContentDescription) {
                arr.push(VipContentDescription[strId]);
            }
            this.contentList.array = arr;
            this.contentList.renderHandler = new Laya.Handler(this, this.SetContentList);
        };
        /**
         * 设置每日奖励list样式
         * @param item 单个box
         * @param index 索引
        */
        VipView.prototype.SetContentList = function (item, index) {
            var contentStr = item.getChildByName("contentStr");
            var arr = this.contentList.array;
            var str = H52D_Framework.GetInfoAttr.Instance.GetText(arr[index]);
            H52D_Framework.SetHtmlStyle(contentStr, 20, "#fbe4e0", "left", true);
            contentStr.innerHTML = str;
        };
        return VipView;
    }(ui.vip.VipViewUI));
    H52D_Framework.VipView = VipView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=VipView.js.map