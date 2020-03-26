module H52D_Framework {
    AddViewResource("MemoryResultView", [
        { url: "res/ui/ui_memory.atlas", type: Laya.Loader.ATLAS },
    ]);
    export class MemoryResultView extends ui.action.memory.MemoryResultViewUI {
        private type: MemoryType;
        private copyId: number;
        private win: number;
        private award: Object = {};
        private time: number = 10;

        constructor(buff: any) {
            super();
            this.type = buff[1];
            this.copyId = buff[2];
            this.win = buff[3];

            if(buff[4] && buff[4][BaseDefine.ItemTypePro]){
                this.award = buff[4][BaseDefine.ItemTypePro];
            }
            
            if (this.win == 1) {
                SoundManager.Instance.OnPlaySound("res/sound/succese.mp3");
                this.panel_win.visible = true;
                this.panel_lose.visible = false;
                this.WinInit();
            }
            else {
                SoundManager.Instance.OnPlaySound("res/sound/fail.mp3");
                this.panel_win.visible = false;
                this.panel_lose.visible = true;
                this.LoseInit();
            }
        }

        /** 挑战胜利 */
        private WinInit() {
            let data = CopyConfig[this.type][this.copyId];
            let winid: number = data.PassType == 1 ? 14007 : 14008;
            this.tx_win_condition.text = "胜利条件：" + GetInfoAttr.Instance.GetSystemText(winid, data.PassValue);

            let condition = data.StarConditon;
            let starNow: Object = MemoryLogic.Instance.GetDungeonStar(MemoryType.equip, data.CopyId);
            let starLast: Object = MemoryLogic.Instance.GetLastDungeonStar();
            let starNum: number = 0;
            for (let i: number = 1; i <= 3; i++) {
                (this["target_" + i].getChildByName("tx_through") as Laya.Text).text = this.GetCondition(condition[i], data.StarValue[i]);
                //上次已完成
                let lastComplete: boolean = starLast[i] == 1;
                //本次已完成
                let nowComplete: boolean = starNow[i] == 1;
                (this["target_" + i].getChildByName("tx_cannot_complete") as Laya.Text).text = lastComplete ? "已完成" : "未完成";
                if (lastComplete) {
                    (this["target_" + i].getChildByName("img_star") as Laya.Image).gray = false;
                    (this["target_" + i].getChildByName("img_diamonds") as Laya.Image).visible = false;
                    (this["target_" + i].getChildByName("tx_diamonds") as Laya.Text).visible = false;
                    (this["target_" + i].getChildByName("tx_cannot_complete") as Laya.Text).visible = true;
                    starNum++;
                }
                else {
                    (this["target_" + i].getChildByName("img_star") as Laya.Image).gray = !nowComplete;
                    (this["target_" + i].getChildByName("img_diamonds") as Laya.Image).visible = nowComplete;
                    (this["target_" + i].getChildByName("tx_diamonds") as Laya.Text).visible = nowComplete;
                    (this["target_" + i].getChildByName("tx_cannot_complete") as Laya.Text).visible = !nowComplete;
                    (this["target_" + i].getChildByName("tx_diamonds") as Laya.Text).text = "+" + data.FirstGetDiamond[i];
                    if (nowComplete) {
                        starNum++;
                    }
                }
            }
            for (let i: number = 1; i <= 3; i++) {
                i <= starNum;
                this["img_star_" + i].gray = i > starNum;
                this["img_star_" + i].visible = i > starNum;
            }

            let i:number = 0;
            for (let k in this.award) {
                let reward: RewardView = new RewardView(k);
                reward.itemNum = this.award[k];
                reward.x = 90 * i + 60;
                reward.y = 50;
                this.img_reward.addChild(reward);
                i++;
            }

            let secs: number = MemoryLogic.Instance.surplusTime;
            let min: number = Math.floor(secs / 60);
            let sec: number = secs % 60;
            this.tx_time.text = (min >= 10 ? min : '0' + min) + ':' + (sec >= 10 ? sec : '0' + sec);
            this.tx_challenge_num.text = MemoryLogic.Instance.challengeNum + "/" + data.DailyFreeNum;
            this.Start_Color(1, starNum);

            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_close.on(Laya.Event.CLICK, this, this.OnCloseHander);
            this.btn_win_back.on(Laya.Event.CLICK, this, this.OnCloseHander);
            this.btn_win_agin.on(Laya.Event.CLICK, this, this.OnAginHander);
            Event.RegistEvent("ChallengeFrush", Laya.Handler.create(this, this.ChallengeFrush));
        }

        private Start_Color(key: number, totle: number) {
            if(key <= totle){
                this["img_star_" + key].scale(3, 3);
                this["img_star_" + key].visible = true;
                Laya.Tween.to(this["img_star_" + key], { scaleX: 1, scaleY: 1 }, 200, null, Laya.Handler.create(this, () => {
                    key++;
                    if (key <= totle) {
                        this.Start_Color(key, totle);
                    }
                }))
            }
        }

        private ChallengeFrush() {
            let data = CopyConfig[this.type][this.copyId];
            this.tx_challenge_num.text = MemoryLogic.Instance.challengeNum + "/" + data.DailyFreeNum;
        }

        /** 挑战失败 */
        private LoseInit() {
            let data = CopyConfig[this.type][this.copyId];
            let winid: number = data.PassType == 1 ? 14007 : 14008;
            this.tx_lose_condition.text = "(胜利条件：" + GetInfoAttr.Instance.GetSystemText(winid, data.PassValue) + ")";

            this.btn_lose_back.on(Laya.Event.CLICK, this, this.OnCloseHander);
            this.btn_lose_agin.on(Laya.Event.CLICK, this, this.OnAginHander);
        }

        private GetCondition(value: number, fill: Object): string {
            let id = 14006 + Number(value);
            let sys: string = GetInfoAttr.Instance.GetText(id);
            return Format(sys, fill[1], fill[2]);
        }

        /** 关闭 */
        private OnCloseHander() {
            UIManager.Instance.DestroyUI(this.name, [this.parent]);
            Event.DispatchEvent("DeputyClose");
        }

        /** 再次挑战 */
        private OnAginHander() {
            // BattleManager.Instance.textStar = true;
            if (MemoryLogic.Instance.challengeNum > 0) {
                UIManager.Instance.DestroyUI(this.name, [this.parent]);
            }
            MemoryLogic.Instance.EnterChallenge();
        }

        private Destroy() {
            this.offAll();
            Event.RemoveEvent("ChallengeFrush", Laya.Handler.create(this, this.ChallengeFrush));
        }

    }
}
