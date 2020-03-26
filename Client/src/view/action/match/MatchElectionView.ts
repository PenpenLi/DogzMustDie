/**Created by the LayaAirIDE*/
module H52D_Framework {

    AddViewResource("MatchElectionView",
        [
            { url: "res/ui/ui_pet.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_wroldboss.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_scene01.atlas", type: Laya.Loader.ATLAS },
        ]);
    /** 海选界面： */
    export class MatchElectionView extends ui.action.match.MatchElectionViewUI {
        constructor() {
            super();
            this.ViewInit();
        }

        private _monsterAin: Avatar = null;

        private ViewInit() {
            this.ViewInfo();
            this.Addevent();
            //Tick.Loop(50, this, this.ChangeAlpha);
        }

        private Addevent() {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.Btn_Rank.on(Laya.Event.CLICK, this, this.Btn_clickrank);
            this.Btn_war.on(Laya.Event.CLICK, this, this.Btn_OpenWar);
            this.Btn_Challenge.on(Laya.Event.CLICK, this, this.Btn_clickchallenge);
            this.Btn_Close.on(Laya.Event.CLICK, this, this.Btn_clickclose);
            this.Btn_pet.on(Laya.Event.CLICK,this,this.Btn_OpenPet);
        }

        private ViewInfo() {
            //this.tatil.text = GetInfoAttr.Instance.GetText(5014);
            let monstor = MonstorConfig[99997];
            this.Boss_Name.text = GetInfoAttr.Instance.GetText(monstor.NameId);
            this._monsterAin = new Avatar(this.Boss_Icon)
            this._monsterAin.Load(monstor.strModelId, 1, monstor.modelScale * 1.5, 200, 550,
                Laya.Handler.create(this, (monsterAins) => {
                    monsterAins.Play(1, true, true, () => {
                    }, true)
                }));

            this.Btn_Rank.visible = true;
            //this.Boss_say.text = GetInfoAttr.Instance.GetText(7114);
            this.Boss_say.text = "每天不限次数挑战boss，伤害最高的一次参与排名";

            //RankLogic.Instance.K_RankDataReq(RankEnum.NowBossRank, 1, 100);
            
            if (MainActionLogic.Instance.hasMatch) {
                this.BtnText.text = "再次挑战";
            }
            else {
                this.Btn_Rank.visible = false;
            }

            //倒计时
            this.ShowTime();
            Tick.Loop(1000, this, this.ShowTime);
        }

        private ChangeAlpha(){
            this.rootLabel.alpha+=0.15;
            if(this.rootLabel.alpha>=1){
                this.rootLabel.alpha=1;
                Tick.Clear(this, this.ChangeAlpha);
            }
        }

        private surplusSecond: number;
        private ShowTime() {
            let dayOfTheWeek = Time.serverTime.getDay();
            let dayAllSeconds: number = 86400;
            let todaySeconds: number = (Time.serverSecodes + 8 * 3600) % dayAllSeconds;//加上8小时时区差
            this.surplusSecond = (6 - dayOfTheWeek) * dayAllSeconds + (19.5 * 60 * 60) - todaySeconds;
            
            if (this.surplusSecond <= 0&& !MatchLogic.Instance.isAllredaySendOpen) {
                this.surplusSecond = 0;
                 MatchLogic.Instance.isAllredaySendOpen = true;
                Tick.Once(1000, this, () => {
                    MatchLogic.Instance.OpenMatchUI();
                })
            }
            this.Time.text = GetFormatTime(this.surplusSecond) + "进入16强点赞";
        }

        /**关闭界面 */
        private Btn_clickclose() {
            UIManager.Instance.DestroyUI(this.name, [this.parent]);
        }
        /**打开排行榜 */
        private Btn_clickrank() {
            //MatchLogic.Instance.K_ReqLeagueHitRank();
            RankLogic.Instance.K_RankDataReq(RankEnum.PKLeagueHit,1,100);
        }

        /**挑战按钮的点击事件 */
        private Btn_clickchallenge() {
            MatchLogic.Instance.BossFight();
        }

        /**打开布阵 */
        private Btn_OpenWar() {
            UIManager.Instance.CreateUI("MatchWarView", [ViewUpRoot, ActionType.match]);
        }

        /**打开宠物布阵 */
        private Btn_OpenPet(){
            UIManager.Instance.CreateUI("KickingPetView",[ViewUpRoot, ActionType.match])
        }

        private Destroy() {
            if (this._monsterAin) {
                this._monsterAin.Destroy();
                this._monsterAin = null;
            }
            this.offAll();
            Tick.ClearAll(this);
        }
    }
}