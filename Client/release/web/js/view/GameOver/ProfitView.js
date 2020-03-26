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
    H52D_Framework.AddViewResource("ProfitView", [
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_over.atlas", type: Laya.Loader.ATLAS },
    ]);
    /**离线收益 */
    var ProfitView = /** @class */ (function (_super) {
        __extends(ProfitView, _super);
        function ProfitView() {
            var _this = _super.call(this) || this;
            _this.Btn_sure.on(Laya.Event.CLICK, _this, _this.Btnclick_lookAd);
            _this.Btn_close.on(Laya.Event.CLICK, _this, _this.Btn_click);
            _this.on(Laya.Event.REMOVED, _this, _this.OnDestroy);
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.WATCH_ADVERTISMENT, Laya.Handler.create(_this, _this.WathchADBack));
            _this.CampInfo();
            return _this;
        }
        /**设置文本信息 */
        ProfitView.prototype.CampInfo = function () {
            H52D_Framework.SetHtmlStyle(this.sys_Info, 20, "#49495b", "left", true);
            this.sys_Info.innerHTML = H52D_Framework.GetInfoAttr.Instance.GetText(7050);
            if (window["wx"]) {
                this.Btn_sure.label = "观看领取";
            }
            else {
                this.Btn_sure.label = "确定";
            }
            var ward = H52D_Framework.ProfManager.Instance.AddReward;
            var time = H52D_Framework.ProfManager.Instance.Time;
            var x = ward[1][1];
            var y = x.toFixed(2);
            this.Money_Num.text = ward[1][1];
            if (ward[1][1] > 1000000) {
                ward[1][1] = ward[1][1] / 10000;
                var y_1 = ward[1][1].toFixed(2);
                this.Money_Num.text = y_1 + "W";
            }
            this.exp_num.text = ward[1][3];
            this.Off_time.text = "离线时间：" + H52D_Framework.GetFormatTime(time);
        };
        /**关闭按钮事件 */
        ProfitView.prototype.Btnclick_lookAd = function () {
            if (window["wx"]) {
                //this.WathchADBack();
                H52D_Framework.WatchAD(H52D_Framework.AdvertisingId.profitView);
            }
            else {
                this.Btn_click();
            }
        };
        ProfitView.prototype.OnDestroy = function () {
            this.offAll();
            this.on(Laya.Event.REMOVED, this, this.OnDestroy);
            H52D_Framework.Event.RemoveEvent(H52D_Framework.EventDefine.WATCH_ADVERTISMENT, Laya.Handler.create(this, this.WathchADBack));
        };
        /**关闭按钮事件 */
        ProfitView.prototype.Btn_click = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("ProfitView", [H52D_Framework.ViewUpRoot]);
        };
        /** 看广告回调 */
        ProfitView.prototype.WathchADBack = function () {
            H52D_Framework.AdvertisingManager.Instance.K_ReqAdvertising(AdvertisementType.LeaveAward);
        };
        return ProfitView;
    }(ui.GameOver.ProfitViewUI));
    H52D_Framework.ProfitView = ProfitView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ProfitView.js.map