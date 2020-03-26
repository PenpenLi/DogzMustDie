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
    H52D_Framework.AddViewResource("LadderReward", [
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_icon.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_ladder.atlas", type: Laya.Loader.ATLAS },
    ]);
    var LadderReward = /** @class */ (function (_super) {
        __extends(LadderReward, _super);
        function LadderReward(buf) {
            var _this = _super.call(this) || this;
            _this._list_arr = [];
            _this._play_Id = H52D_Framework.LadderManager.Instance.PlayId = buf[1];
            _this._list_arr = [];
            _this.ViewInit();
            return _this;
        }
        LadderReward.prototype.ViewInit = function () {
            this.panel.vScrollBarSkin = "";
            this.ViewEVent();
            this.SetLadder_list();
        };
        LadderReward.prototype.ViewEVent = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.Btn_close.on(Laya.Event.CLICK, this, this.Btnclick_close);
            H52D_Framework.Event.RegistEvent("update_ladderreward", Laya.Handler.create(this, this.SetLadder_list));
        };
        /**初始化 奖励预览界面 */
        LadderReward.prototype.SetLadder_list = function () {
            this.panel.destroyChildren();
            this.panel.vScrollBar.isVertical = true; //滚动条的方向为垂直滚动
            this.panel.vScrollBar.elasticBackTime = 600; //设置橡皮筋回弹时间
            this.panel.vScrollBar.elasticDistance = 200; //设置橡皮筋回弹距离
            this._list_arr = H52D_Framework.LadderManager.Instance.getLadderLv();
            H52D_Framework.LadderManager.Instance.Sort_ladderlist(this._list_arr, this._play_Id);
            this._list_arr = H52D_Framework.LadderManager.Instance.Ladderreward_arr;
            var firstView = null;
            for (var index = 0; index < this._list_arr.length; index++) {
                var n_reward = new H52D_Framework.LadderLvRewardLineView(this, index);
                if (index == 0) {
                    firstView = n_reward;
                }
                this.panel.addChild(n_reward);
                n_reward.y = n_reward.height * index;
                n_reward.x = 0;
            }
            firstView.Ladderline_list();
        };
        LadderReward.prototype.Btnclick_close = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("LadderReward", [H52D_Framework.ViewToppestRoot]);
        };
        LadderReward.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent("update_ladderreward", Laya.Handler.create(this, this.SetLadder_list));
        };
        return LadderReward;
    }(ui.action.Ladder.LadderRewardUI));
    H52D_Framework.LadderReward = LadderReward;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=LadderReward.js.map