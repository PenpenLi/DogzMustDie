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
    H52D_Framework.AddViewResource("MemoryResultView", [
        { url: "res/ui/ui_memory.atlas", type: Laya.Loader.ATLAS },
    ]);
    var MemoryResultView = /** @class */ (function (_super) {
        __extends(MemoryResultView, _super);
        function MemoryResultView(buff) {
            var _this = _super.call(this) || this;
            _this.award = {};
            _this.time = 10;
            _this.type = buff[1];
            _this.copyId = buff[2];
            _this.win = buff[3];
            if (buff[4] && buff[4][H52D_Framework.BaseDefine.ItemTypePro]) {
                _this.award = buff[4][H52D_Framework.BaseDefine.ItemTypePro];
            }
            if (_this.win == 1) {
                H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/succese.mp3");
                _this.panel_win.visible = true;
                _this.panel_lose.visible = false;
                _this.WinInit();
            }
            else {
                H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/fail.mp3");
                _this.panel_win.visible = false;
                _this.panel_lose.visible = true;
                _this.LoseInit();
            }
            return _this;
        }
        /** 挑战胜利 */
        MemoryResultView.prototype.WinInit = function () {
            var data = H52D_Framework.CopyConfig[this.type][this.copyId];
            var winid = data.PassType == 1 ? 14007 : 14008;
            this.tx_win_condition.text = "胜利条件：" + H52D_Framework.GetInfoAttr.Instance.GetSystemText(winid, data.PassValue);
            var condition = data.StarConditon;
            var starNow = H52D_Framework.MemoryLogic.Instance.GetDungeonStar(H52D_Framework.MemoryType.equip, data.CopyId);
            var starLast = H52D_Framework.MemoryLogic.Instance.GetLastDungeonStar();
            var starNum = 0;
            for (var i_1 = 1; i_1 <= 3; i_1++) {
                this["target_" + i_1].getChildByName("tx_through").text = this.GetCondition(condition[i_1], data.StarValue[i_1]);
                //上次已完成
                var lastComplete = starLast[i_1] == 1;
                //本次已完成
                var nowComplete = starNow[i_1] == 1;
                this["target_" + i_1].getChildByName("tx_cannot_complete").text = lastComplete ? "已完成" : "未完成";
                if (lastComplete) {
                    this["target_" + i_1].getChildByName("img_star").gray = false;
                    this["target_" + i_1].getChildByName("img_diamonds").visible = false;
                    this["target_" + i_1].getChildByName("tx_diamonds").visible = false;
                    this["target_" + i_1].getChildByName("tx_cannot_complete").visible = true;
                    starNum++;
                }
                else {
                    this["target_" + i_1].getChildByName("img_star").gray = !nowComplete;
                    this["target_" + i_1].getChildByName("img_diamonds").visible = nowComplete;
                    this["target_" + i_1].getChildByName("tx_diamonds").visible = nowComplete;
                    this["target_" + i_1].getChildByName("tx_cannot_complete").visible = !nowComplete;
                    this["target_" + i_1].getChildByName("tx_diamonds").text = "+" + data.FirstGetDiamond[i_1];
                    if (nowComplete) {
                        starNum++;
                    }
                }
            }
            for (var i_2 = 1; i_2 <= 3; i_2++) {
                i_2 <= starNum;
                this["img_star_" + i_2].gray = i_2 > starNum;
                this["img_star_" + i_2].visible = i_2 > starNum;
            }
            var i = 0;
            for (var k in this.award) {
                var reward = new H52D_Framework.RewardView(k);
                reward.itemNum = this.award[k];
                reward.x = 90 * i + 60;
                reward.y = 50;
                this.img_reward.addChild(reward);
                i++;
            }
            var secs = H52D_Framework.MemoryLogic.Instance.surplusTime;
            var min = Math.floor(secs / 60);
            var sec = secs % 60;
            this.tx_time.text = (min >= 10 ? min : '0' + min) + ':' + (sec >= 10 ? sec : '0' + sec);
            this.tx_challenge_num.text = H52D_Framework.MemoryLogic.Instance.challengeNum + "/" + data.DailyFreeNum;
            this.Start_Color(1, starNum);
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_close.on(Laya.Event.CLICK, this, this.OnCloseHander);
            this.btn_win_back.on(Laya.Event.CLICK, this, this.OnCloseHander);
            this.btn_win_agin.on(Laya.Event.CLICK, this, this.OnAginHander);
            H52D_Framework.Event.RegistEvent("ChallengeFrush", Laya.Handler.create(this, this.ChallengeFrush));
        };
        MemoryResultView.prototype.Start_Color = function (key, totle) {
            var _this = this;
            if (key <= totle) {
                this["img_star_" + key].scale(3, 3);
                this["img_star_" + key].visible = true;
                Laya.Tween.to(this["img_star_" + key], { scaleX: 1, scaleY: 1 }, 200, null, Laya.Handler.create(this, function () {
                    key++;
                    if (key <= totle) {
                        _this.Start_Color(key, totle);
                    }
                }));
            }
        };
        MemoryResultView.prototype.ChallengeFrush = function () {
            var data = H52D_Framework.CopyConfig[this.type][this.copyId];
            this.tx_challenge_num.text = H52D_Framework.MemoryLogic.Instance.challengeNum + "/" + data.DailyFreeNum;
        };
        /** 挑战失败 */
        MemoryResultView.prototype.LoseInit = function () {
            var data = H52D_Framework.CopyConfig[this.type][this.copyId];
            var winid = data.PassType == 1 ? 14007 : 14008;
            this.tx_lose_condition.text = "(胜利条件：" + H52D_Framework.GetInfoAttr.Instance.GetSystemText(winid, data.PassValue) + ")";
            this.btn_lose_back.on(Laya.Event.CLICK, this, this.OnCloseHander);
            this.btn_lose_agin.on(Laya.Event.CLICK, this, this.OnAginHander);
        };
        MemoryResultView.prototype.GetCondition = function (value, fill) {
            var id = 14006 + Number(value);
            var sys = H52D_Framework.GetInfoAttr.Instance.GetText(id);
            return H52D_Framework.Format(sys, fill[1], fill[2]);
        };
        /** 关闭 */
        MemoryResultView.prototype.OnCloseHander = function () {
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [this.parent]);
            H52D_Framework.Event.DispatchEvent("DeputyClose");
        };
        /** 再次挑战 */
        MemoryResultView.prototype.OnAginHander = function () {
            // BattleManager.Instance.textStar = true;
            if (H52D_Framework.MemoryLogic.Instance.challengeNum > 0) {
                H52D_Framework.UIManager.Instance.DestroyUI(this.name, [this.parent]);
            }
            H52D_Framework.MemoryLogic.Instance.EnterChallenge();
        };
        MemoryResultView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent("ChallengeFrush", Laya.Handler.create(this, this.ChallengeFrush));
        };
        return MemoryResultView;
    }(ui.action.memory.MemoryResultViewUI));
    H52D_Framework.MemoryResultView = MemoryResultView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MemoryResultView.js.map