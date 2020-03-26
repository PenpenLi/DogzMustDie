module H52D_Framework {
    import MainBossViewUI = ui.main.subinterface.MainBossViewUI;
    const path: string = "ui_icon/";

    /**
     * @class：
     * @author：zhangyusong
     */
    export class MainBossView extends MainBossViewUI implements IViewPanel  {
        public constructor()  {
            super();
            this.InitView();
            this.InitEvent();
        }

        public Destroy(): void  {
            Event.RemoveEvent('BossCome', Laya.Handler.create(this, this.BossCome));
            Event.RemoveEvent(EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.Btn_control));
        }

        /** 视图清理 */
        public Clear()  {
            this.BossClear();
        }

        private InitView(): void  {
            this.tips_boss.alpha = 0;
            // this.SetShopPetVisible(PetManager.Instance.HasTimes > 0);
        }

        private InitEvent(): void  {
            Event.RegistEvent('BossCome', Laya.Handler.create(this, this.BossCome,[true]));
            Event.RegistEvent('ChallengeBossFail', Laya.Handler.create(this, this.BossCome,[false]));
            Event.RegistEvent(EventDefine.CUSTOMS_CURRENT, Laya.Handler.create(this, this.Btn_control));
        }
         
          private Btn_control() {
            let bool = WroldBossLogic.Instance.View_Control();    
            this.tips_boss.visible=bool;
        }

        /** boss来袭 */
        private BossCome(success: boolean): void  {
            this.tips_boss.alpha = 0;
            this.challenge_boss.visible = success;
            this.fail_boss.visible = !success;
            this.tween1 = Laya.Tween.to(this.tips_boss, { alpha: 1 }, 600, Laya.Ease.linearIn, Laya.Handler.create(this, () =>  {
                Tick.Once(1000, this, () =>  {
                    this.tween2 = Laya.Tween.to(this.tips_boss, { alpha: 0 }, 1000, Laya.Ease.linearIn, Laya.Handler.create(this, () =>  {
                        this.BossClear();
                    }));
                });
            }));
            Tick.Once(3000, this, () =>  {
                this.BossClear();
            });
            if(success){
                SoundManager.Instance.OnPlaySound("res/sound/boss_appear.mp3");
            }
        }

        private tween1: laya.utils.Tween;
        private tween2: laya.utils.Tween;

        private BossClear()  {
            this.tips_boss.alpha = 0;
            if (this.tween1)
                Laya.Tween.clear(this.tween1);
            if (this.tween2)
                Laya.Tween.clear(this.tween2);
        }

    }
}