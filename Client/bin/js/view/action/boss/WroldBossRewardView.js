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
    H52D_Framework.AddViewResource("WroldBossRewardView", [
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
    ]);
    var WroldBossRewardView = /** @class */ (function (_super) {
        __extends(WroldBossRewardView, _super);
        function WroldBossRewardView() {
            var _this = _super.call(this) || this;
            _this.Colors = {
                0: "#ffe67b",
                1: "#ffe67b"
            };
            _this.StrokColors = {
                0: "#ffe67b",
                1: "#de6115",
            };
            _this.ViewInit();
            return _this;
        }
        WroldBossRewardView.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.Btn_close.on(Laya.Event.CLICK, this, this.Btn_clickclose);
        };
        WroldBossRewardView.prototype.ViewInit = function () {
            this.AddEvent();
            this.ReshHandler();
            this.reward_list.vScrollBarSkin = "";
        };
        WroldBossRewardView.prototype.ReshHandler = function () {
            H52D_Framework.WroldBossLogic.Instance.Reward_List = [];
            this.reward_list.array = H52D_Framework.WroldBossLogic.Instance.Reward_num();
            this.reward_list.renderHandler = new Laya.Handler(this, this.Handler);
        };
        WroldBossRewardView.prototype.Handler = function (item, index) {
            var _Id = this.reward_list.array[index];
            var _Info = H52D_Framework.GameParamConfig.WorldBossReward[_Id];
            var reward = H52D_Framework.RewardConfig[_Info[2]].reWrad;
            var _next_Info = H52D_Framework.GameParamConfig.WorldBossReward[_Id + 1];
            var rank_num = item.getChildByName("rankNum");
            rank_num.strokeColor = this.StrokColors[index];
            rank_num.color = this.Colors[index];
            var str = "";
            if (!_next_Info) {
                str = _Info[1] + "及以后";
                rank_num.fontSize = 20;
            }
            else {
                str = (_Info[1] + "-" + (_next_Info[1] - 1));
                rank_num.fontSize = 26;
                if (_Id == 1) {
                    str = _Info[1];
                }
            }
            var bg = item.getChildByName("reward_bg"); //
            rank_num.changeText(str);
            for (var key in reward) {
                var icon_bg = item.getChildByName("reward_icon_bg" + key);
                var icon = icon_bg.getChildByName("reward_icon");
                var num = icon_bg.getChildByName("rew_num");
                var name_1 = icon_bg.getChildByName("rew_name");
                var Item_Info = reward[key];
                var path = H52D_Framework.WroldBossLogic.Instance.Item_Info(Item_Info[1], Item_Info[2]);
                num.text = Item_Info[3];
                icon_bg.skin = path[1];
                icon.skin = path[0];
                name_1.text = path[2];
                name_1.color = path[3];
                if (Item_Info[3] == 1) {
                    num.text = "";
                }
            }
        };
        WroldBossRewardView.prototype.Btn_clickclose = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("WroldBossRewardView", [H52D_Framework.ViewUpRoot]);
        };
        WroldBossRewardView.prototype.Destroy = function () {
            this.offAll();
        };
        return WroldBossRewardView;
    }(ui.action.boss.WroldBossRewardViewUI));
    H52D_Framework.WroldBossRewardView = WroldBossRewardView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=WroldBossRewardView.js.map