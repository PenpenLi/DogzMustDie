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
    H52D_Framework.AddViewResource("StrongerView", [
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_head.atlas", type: Laya.Loader.ATLAS },
    ]);
    var StrongerType;
    (function (StrongerType) {
        StrongerType[StrongerType["Money"] = 1] = "Money";
        StrongerType[StrongerType["Speed"] = 2] = "Speed";
        StrongerType[StrongerType["Reward"] = 3] = "Reward"; //抽奖
    })(StrongerType || (StrongerType = {}));
    /*
    * 挑战失败，我要变强类
    */
    var StrongerView = /** @class */ (function (_super) {
        __extends(StrongerView, _super);
        function StrongerView() {
            var _this = _super.call(this) || this;
            _this.bGuidanceButton = true;
            _this.ViewInit();
            _this.EventInit();
            return _this;
        }
        StrongerView.prototype.ViewInit = function () {
            this.data = [];
            for (var i in H52D_Framework.StrongerConfig) {
                this.data.push(H52D_Framework.StrongerConfig[i]);
            }
            this.suit_list.vScrollBarSkin = "";
            this.suit_list.renderHandler = new Laya.Handler(this, this.RenderHandler);
            this.suit_list.array = this.data;
        };
        StrongerView.prototype.EventInit = function () {
            H52D_Framework.Event.RegistEvent('onGotoHander', Laya.Handler.create(this, this.onGotoHander));
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_close.on(Laya.Event.CLICK, this, this.OnCloseHander);
        };
        StrongerView.prototype.Destroy = function () {
            H52D_Framework.Event.RemoveEvent('onGotoHander', Laya.Handler.create(this, this.onGotoHander));
            this.offAll();
        };
        StrongerView.prototype.OnCloseHander = function () {
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [this.parent]);
        };
        StrongerView.prototype.RenderHandler = function (item, index) {
            item.getChildByName("img_icon").skin = "ui_icon/" + this.data[index].icon;
            item.getChildByName("tx_name").text = H52D_Framework.GetInfoAttr.Instance.GetSystemText(this.data[index].name);
            item.getChildByName("tx_destribe").text = H52D_Framework.GetInfoAttr.Instance.GetSystemText(this.data[index].description);
            //引导获取按钮
            var goto = item.getChildByName("btn_goto");
            goto.offAll();
            goto.on(Laya.Event.CLICK, this, this.onGotoHander, [index, null]);
            if (index == 1 && this.bGuidanceButton) {
                H52D_Framework.Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_11, goto);
                this.bGuidanceButton = false;
            }
        };
        StrongerView.prototype.onGotoHander = function (index) {
            switch (this.data[index].link) {
                case StrongerType.Money: //天降钱雨
                    H52D_Framework.Event.DispatchEvent("OnPanelClick", [E_OpenGrade.ROLE, true]);
                    H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.BOTTOM_SET_PANEL);
                    H52D_Framework.OneTimer(250, function () {
                        H52D_Framework.Event.DispatchEvent("RolePrivilege", [2]);
                    });
                    break;
                case StrongerType.Speed: //肾上腺加速
                    H52D_Framework.Event.DispatchEvent("OnPanelClick", [E_OpenGrade.ROLE, true]);
                    H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.BOTTOM_SET_PANEL);
                    H52D_Framework.OneTimer(250, function () {
                        H52D_Framework.Event.DispatchEvent("RolePrivilege", [1]);
                    });
                    break;
                case StrongerType.Reward:
                    H52D_Framework.Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP, true]);
                    H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.BOTTOM_SET_PANEL);
                    H52D_Framework.OneTimer(250, function () {
                        H52D_Framework.Event.DispatchEvent("ToLotteryShop");
                    });
                    break;
            }
            this.OnCloseHander();
        };
        return StrongerView;
    }(ui.stronger.StrongerViewUI));
    H52D_Framework.StrongerView = StrongerView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=StrongerView.js.map