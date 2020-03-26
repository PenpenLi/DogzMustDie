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
    H52D_Framework.AddViewResource("MemoryChallengeView", [
        { url: "res/ui/ui_memory.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_kicking.atlas", type: Laya.Loader.ATLAS },
    ]);
    var MemoryChallengeView = /** @class */ (function (_super) {
        __extends(MemoryChallengeView, _super);
        function MemoryChallengeView() {
            var _this = _super.call(this) || this;
            _this.ViewInit();
            _this.EventInit();
            return _this;
        }
        MemoryChallengeView.prototype.ViewInit = function () {
            var _this = this;
            this.data = H52D_Framework.MemoryLogic.Instance.challengeData;
            this.tx_title.text = H52D_Framework.GetInfoAttr.Instance.GetText(14001);
            this.tx_surplus_num.text = H52D_Framework.MemoryLogic.Instance.challengeNum + "/" + this.data.DailyFreeNum;
            this.tx_hero_name.text = H52D_Framework.GetInfoAttr.Instance.GetText(this.data.CopyName);
            this.hero = new H52D_Framework.Avatar(this.box_avatar_bg);
            var monstorId = H52D_Framework.CustomspassConfig[this.data.CustomsId].monstorPosition[1][1][1];
            var monstor = H52D_Framework.MonstorConfig[monstorId];
            this.hero.Load(monstor.strModelId, AvatarDirection.left, monstor.modelScale * 3, 280, 340, Laya.Handler.create(this, function () {
                _this.hero.Shadow(2, true);
                _this.hero.Play(H52D_Framework.AnimationName.idle);
            }));
            var winid = this.data.PassType == 1 ? 14007 : 14008;
            this.tx_win.text = "胜利条件：" + H52D_Framework.GetInfoAttr.Instance.GetSystemText(winid, this.data.PassValue);
            this.tx_power.text = this.tx_power_raided.text = "消耗体力" + this.data.NeedPower;
            this.tx_raided.text = H52D_Framework.GetInfoAttr.Instance.GetText(14002);
            var condition = this.data.StarConditon;
            var star = H52D_Framework.MemoryLogic.Instance.GetDungeonStar(H52D_Framework.MemoryType.equip, this.data.CopyId);
            var starNum = 0;
            for (var i_1 = 1; i_1 <= 3; i_1++) {
                this["target_" + i_1].getChildByName("tx_through").text = this.GetCondition(condition[i_1], this.data.StarValue[i_1]);
                this["target_" + i_1].getChildByName("img_star").gray = star[i_1] == 0;
                this["target_" + i_1].getChildByName("img_diamonds").visible = star[i_1] == 0;
                var tx_diamonds = this["target_" + i_1].getChildByName("tx_diamonds");
                this["target_" + i_1].getChildByName("tx_diamonds").visible = star[i_1] == 0;
                this["target_" + i_1].getChildByName("tx_cannot_complete").visible = star[i_1] == 1;
                if (star[i_1] == 1) {
                    starNum++;
                }
                tx_diamonds.text = "+" + this.data.FirstGetDiamond[i_1];
            }
            var goldNum = 0;
            var waveRewardID = H52D_Framework.CustomsManager.Instance.CustomsVo.waveRewardID;
            var reWrad = H52D_Framework.RewardConfig[waveRewardID].reWrad;
            var i = 1;
            while (reWrad[i]) {
                if (reWrad[i][2] == H52D_Framework.BaseDefine.ItemIdGold) {
                    goldNum = reWrad[i][3];
                    break;
                }
                i++;
            }
            var reward1 = new H52D_Framework.RewardView(H52D_Framework.BaseDefine.ItemIdGold);
            reward1.itemNum = goldNum * this.data.CopyDropGold;
            var rewardData = H52D_Framework.RewardConfig[this.data.CopyDropReward].reWrad[1];
            var reward2 = new H52D_Framework.RewardView(rewardData[2]);
            reward2.itemNum = rewardData[3];
            reward1.x = 60;
            reward2.x = 180;
            reward1.y = reward2.y = 50;
            this.img_reward.addChild(reward1);
            this.img_reward.addChild(reward2);
            this.btn_raided.gray = starNum < 3;
            this.btn_raided.mouseEnabled = starNum == 3;
            this.img_raided.visible = starNum == 3;
            H52D_Framework.Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_14, this.btn_front);
        };
        MemoryChallengeView.prototype.GetCondition = function (value, fill) {
            var id = 14006 + Number(value);
            var sys = H52D_Framework.GetInfoAttr.Instance.GetText(id);
            return H52D_Framework.Format(sys, fill[1], fill[2]);
        };
        MemoryChallengeView.prototype.EventInit = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_add.on(Laya.Event.CLICK, this, this.OnBuyHander);
            this.btn_front.on(Laya.Event.CLICK, this, this.OnFrontHander);
            this.btn_pet.on(Laya.Event.CLICK, this, this.OnPetHander);
            this.btn_challenge.on(Laya.Event.CLICK, this, this.OnChallenge);
            this.btn_raided.on(Laya.Event.CLICK, this, this.OnRaidedHander);
            this.btn_close.on(Laya.Event.CLICK, this, this.OnCloseHander);
            H52D_Framework.Event.RegistEvent("ChallengeFrush", Laya.Handler.create(this, this.OnFrush));
        };
        MemoryChallengeView.prototype.OnFrush = function () {
            this.tx_surplus_num.text = H52D_Framework.MemoryLogic.Instance.challengeNum + "/" + this.data.DailyFreeNum;
        };
        MemoryChallengeView.prototype.OnCloseHander = function () {
            H52D_Framework.MemoryLogic.Instance.challengeData = null;
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [this.parent]);
        };
        MemoryChallengeView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent("ChallengeFrush", Laya.Handler.create(this, this.OnFrush));
        };
        /** 挑战 */
        MemoryChallengeView.prototype.OnChallenge = function () {
            // BattleManager.Instance.textStar = false;
            H52D_Framework.MemoryLogic.Instance.EnterChallenge();
        };
        /** 扫荡 */
        MemoryChallengeView.prototype.OnRaidedHander = function () {
            if (H52D_Framework.MemoryLogic.Instance.ChallengeCondition()) {
                H52D_Framework.MemoryLogic.Instance.ReqPassDungeon(H52D_Framework.MemoryType.equip, this.data.CopyId, 1, { 1: 1, 2: 1, 3: 1 });
            }
        };
        /** 购买挑战次数 */
        MemoryChallengeView.prototype.OnBuyHander = function () {
            H52D_Framework.UIManager.Instance.CreateUI("BuyMemoryTimesView", [H52D_Framework.ViewDownRoot]);
        };
        /** 打开FB布阵界面 */
        MemoryChallengeView.prototype.OnFrontHander = function () {
            H52D_Framework.UIManager.Instance.CreateUI("MemoryWarView", [H52D_Framework.ViewToppestRoot, H52D_Framework.ActionType.memory]);
        };
        /**  */
        MemoryChallengeView.prototype.OnPetHander = function () {
            H52D_Framework.UIManager.Instance.CreateUI("MemoryPetView", [H52D_Framework.ViewToppestRoot, H52D_Framework.ActionType.memory]);
        };
        return MemoryChallengeView;
    }(ui.action.memory.MemoryChallengeViewUI));
    H52D_Framework.MemoryChallengeView = MemoryChallengeView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MemoryChallengeView.js.map