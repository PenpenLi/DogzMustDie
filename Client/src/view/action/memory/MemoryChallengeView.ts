module H52D_Framework {
	AddViewResource("MemoryChallengeView", [
		{ url: "res/ui/ui_memory.atlas", type: Laya.Loader.ATLAS },
		{ url: "res/ui/ui_kicking.atlas", type: Laya.Loader.ATLAS },
	]);
	export class MemoryChallengeView extends ui.action.memory.MemoryChallengeViewUI {
		private hero: Avatar;
		private data:any;

		constructor() {
			super();
			this.ViewInit();
			this.EventInit();
		}

		private ViewInit() {
			this.data = MemoryLogic.Instance.challengeData;
			this.tx_title.text = GetInfoAttr.Instance.GetText(14001);

			this.tx_surplus_num.text = MemoryLogic.Instance.challengeNum + "/" + this.data.DailyFreeNum;
			this.tx_hero_name.text = GetInfoAttr.Instance.GetText(this.data.CopyName);
			this.hero = new Avatar(this.box_avatar_bg);
			let monstorId = CustomspassConfig[this.data.CustomsId].monstorPosition[1][1][1];
			let monstor = MonstorConfig[monstorId];
			this.hero.Load(monstor.strModelId, AvatarDirection.left, monstor.modelScale * 3, 280, 340, Laya.Handler.create(this, () => {
				this.hero.Shadow(2, true);
				this.hero.Play(AnimationName.idle);
			}));
			let winid: number = this.data.PassType == 1 ? 14007 : 14008;
			this.tx_win.text = "胜利条件：" + GetInfoAttr.Instance.GetSystemText(winid, this.data.PassValue);
			this.tx_power.text = this.tx_power_raided.text = "消耗体力" + this.data.NeedPower;
			this.tx_raided.text = GetInfoAttr.Instance.GetText(14002);
			let condition = this.data.StarConditon;
			let star: Object = MemoryLogic.Instance.GetDungeonStar(MemoryType.equip, this.data.CopyId);
			let starNum:number = 0;
			for (let i: number = 1; i <= 3; i++) {
				(this["target_" + i].getChildByName("tx_through") as Laya.Text).text = this.GetCondition(condition[i], this.data.StarValue[i]);
				(this["target_" + i].getChildByName("img_star") as Laya.Image).gray = star[i] == 0;
				(this["target_" + i].getChildByName("img_diamonds") as Laya.Image).visible = star[i] == 0;
				let tx_diamonds:Laya.Text=(this["target_" + i].getChildByName("tx_diamonds") as Laya.Text);
				(this["target_" + i].getChildByName("tx_diamonds") as Laya.Text).visible = star[i] == 0;
				(this["target_" + i].getChildByName("tx_cannot_complete") as Laya.Text).visible = star[i] == 1;
				if(star[i] == 1){
					starNum++;
				}				
				tx_diamonds.text="+"+this.data.FirstGetDiamond[i];
			}
			let goldNum: number = 0;
            let waveRewardID = CustomsManager.Instance.CustomsVo.waveRewardID
            let reWrad = RewardConfig[waveRewardID].reWrad;
            let i = 1;
            while (reWrad[i]) {
                if (reWrad[i][2] == BaseDefine.ItemIdGold) {
                    goldNum = reWrad[i][3];
                    break;
                }
                i++;
            }
            let reward1 = new RewardView(BaseDefine.ItemIdGold);
            reward1.itemNum = goldNum * this.data.CopyDropGold;
            let rewardData = RewardConfig[this.data.CopyDropReward].reWrad[1];
            let reward2 = new RewardView(rewardData[2]);
            reward2.itemNum = rewardData[3];
            reward1.x = 60;
            reward2.x = 180;
            reward1.y = reward2.y = 50;
            this.img_reward.addChild(reward1);
            this.img_reward.addChild(reward2);
			this.btn_raided.gray = starNum < 3;
			this.btn_raided.mouseEnabled = starNum == 3;
			this.img_raided.visible = starNum == 3;
			Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_14, this.btn_front)
		}

		private GetCondition(value: number, fill: Object): string {
			let id = 14006 + Number(value);
			let sys: string = GetInfoAttr.Instance.GetText(id);
			return Format(sys, fill[1], fill[2]);
		}

		private EventInit() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.btn_add.on(Laya.Event.CLICK, this, this.OnBuyHander);
			this.btn_front.on(Laya.Event.CLICK, this, this.OnFrontHander);
			this.btn_pet.on(Laya.Event.CLICK, this, this.OnPetHander);
			this.btn_challenge.on(Laya.Event.CLICK, this, this.OnChallenge);
			this.btn_raided.on(Laya.Event.CLICK, this, this.OnRaidedHander);
			this.btn_close.on(Laya.Event.CLICK, this, this.OnCloseHander);
			Event.RegistEvent("ChallengeFrush",Laya.Handler.create(this,this.OnFrush));
		}

		private OnFrush(){
			this.tx_surplus_num.text = MemoryLogic.Instance.challengeNum + "/" + this.data.DailyFreeNum;
		}

		private OnCloseHander() {
			MemoryLogic.Instance.challengeData = null;
			UIManager.Instance.DestroyUI(this.name, [this.parent]);
		}

		private Destroy() {
			this.offAll();
			Event.RemoveEvent("ChallengeFrush",Laya.Handler.create(this,this.OnFrush));
		}

		/** 挑战 */
		private OnChallenge() {
			// BattleManager.Instance.textStar = false;
			MemoryLogic.Instance.EnterChallenge();
		}

		/** 扫荡 */
		private OnRaidedHander() {
			if(MemoryLogic.Instance.ChallengeCondition()){
				MemoryLogic.Instance.ReqPassDungeon(MemoryType.equip, this.data.CopyId, 1, {1:1, 2:1, 3:1});
			}
		}

		/** 购买挑战次数 */
		private OnBuyHander() {
			UIManager.Instance.CreateUI("BuyMemoryTimesView", [ViewDownRoot]);
		}

		/** 打开FB布阵界面 */
		private OnFrontHander() {
			UIManager.Instance.CreateUI("MemoryWarView", [ViewToppestRoot, ActionType.memory]);
		}

		/**  */
		private OnPetHander() {
			UIManager.Instance.CreateUI("MemoryPetView", [ViewToppestRoot, ActionType.memory]);
		}

	}
}