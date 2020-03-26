/*
* 主界面背景
* 通关推图
*/
module H52D_Framework {
    AddViewResource("MainView",
        [
            { url: "res/ui/ui_stareffect.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_wroldboss.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
        ]);

    import Sprite = Laya.Sprite;
    export class MainView extends ui.main.MainViewUI {
        /** 点击面板 */
        private click: MainClickView;
        /** 控制按钮 */
        private control: MainControlView;
        /** 关卡血条 */
        private customs: MainCustomsView;
        /** Dsp视图 */
        private dps: MainDpsView;
        /** 技能视图 */
        private skill: MainSkillView;
        /** 气泡视图 */
        private bubble: MainBubbleView;
        /** 列表视图 */
        private list: MainListView;
        /** Boss视图 */
        private boss: MainBossView;
        /** 小天使 */
        private angle: MainAngleView;
        /** 副本视图 */
        private deputy: MainDeputyView;

        private fightType: string = "";

        constructor() {
            super();
            if (window['wx']) {
                wxsclae = G_StageHeight / Laya.Browser.clientHeight * 62
            }
            this.name = "MainView";
            this.InitView();
            this.InitEvent();
        }

        private InitView(): void {
            this.visible = false;
            laya.events.MouseManager.multiTouchEnabled = false;//关闭多点触控
            this.click = new MainClickView();
            this.click.top = wxsclae
            this.click.bottom = this.click.centerX = 0;
            this.addChild(this.click);

            let str = "亲爱的玩家朋友们，自上线以来，在你们的陪伴下，我们一起度过了无数个快乐时光，由于各种原因，我们不得不做出一个万分艰难的决定：《神兽必须死》将于2019年11月1日起正式停止运营"
            let context = "相聚有时，离别亦有时。对一直以来支持《神兽必须死》的玩家朋友致以深深的歉意再次感谢大家的一路陪伴，最后再次感谢所有玩家的爱护与帮助，对于由此给您造成的不便，我们表示诚挚的歉意，敬请谅解。"
            UIManager.Instance.CreateUI("TipsActionView", [ViewToppestRoot, "通知", str + context]);
            //curl -d '{ "content":"hello world!" }
            let a = "";
            // window['qq'].request({
            //     url: "https://api.q.qq.com/api/getToken",
            //     data: {
            //         appid: "1109243849",
            //         secret: "g7Z9RFv1KtzlxrIA",
            //         grant_type: "client_credential"
            //     },
            //     success(res) {
            //         a = res.data.access_token;
            //     }
            // })
            // window['qq'].request({
            //     url: 'https://api.q.qq.com/api/json/security/MsgSecCheck',
            //     data: {
            //         access_token: a,
            //         appid: "1109243849",
            //         content: str + context
            //     },
            //     success(res) {
            //         console.log(res.data)
            //     }
            // })         
            this.control = new MainControlView();
            this.control.top = wxsclae
            this.control.bottom = this.control.left = this.control.right = 0
            this.addChild(this.control);

            this.customs = new MainCustomsView();
            this.customs.top = wxsclae
            this.customs.centerX = 0;
            this.addChild(this.customs);

            this.dps = new MainDpsView();
            this.dps.centerX = 0;
            this.dps.bottom = 258;
            this.addChild(this.dps);

            this.skill = new MainSkillView();
            this.skill.centerX = 0;
            this.skill.bottom = 59;
            this.addChild(this.skill);

            this.bubble = new MainBubbleView();
            this.bubble.bottom = this.bubble.centerX = 0;
            this.addChild(this.bubble);

            this.angle = new MainAngleView();
            this.angle.top = wxsclae
            this.angle.bottom = this.angle.left = this.angle.right = 0;
            this.addChild(this.angle);

            this.list = new MainListView();
            this.list.top = wxsclae
            this.list.bottom = this.list.centerX = 0;
            this.addChild(this.list);

            this.boss = new MainBossView();
            this.boss.top = 355 + wxsclae;
            this.boss.centerX = 0;
            this.addChild(this.boss);

            this.deputy = new MainDeputyView();
            this.deputy.visible = false;
            this.deputy.top = wxsclae;
            this.deputy.centerX = 0;
            this.addChild(this.deputy);
        }

        private InitEvent(): void {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            Event.RegistEvent("ClearMainView", Laya.Handler.create(this, this.Clear));
            Event.RegistEvent("ShowMainView", Laya.Handler.create(this, this.showPanel));
            Event.RegistEvent("FightType", Laya.Handler.create(this, this.FightType));
            Event.RegistEvent("ShowDeputy", Laya.Handler.create(this, this.ShowDeputy));

            // this.stage.on(Laya.Event.KEY_DOWN, this, this.OnKeyHander);
        }

        private Clear() {
        }

        private FightType(type: string) {
            this.fightType = type;
        }

        /** 显示副本 */
        private ShowDeputy() {
            //主场景
            if (CustomsManager.Instance.CustomsType == Customs_Type.Customs) {
                this.click.mouseEnabled = true; //点击面板
                this.control.visible = true;    //控制面板
                this.customs.visible = true;    //关卡面板
                this.dps.visible = true;        //dps面板
                this.skill.visible = true;      //技能面板
                this.bubble.visible = true;     //气泡面板
                this.angle.visible = true;      //小天使
                this.list.visible = true;       //列表面板
                this.boss.visible = true;       //Boss弹窗
                this.deputy.visible = false;    //副本面板
            }
            else {
                this.click.mouseEnabled = false;//点击面板
                this.control.visible = false;   //控制面板
                this.customs.visible = false;   //关卡面板
                this.bubble.visible = false;    //气泡面板
                this.angle.visible = false;     //小天使
                this.list.visible = false;      //列表面板
                this.boss.visible = false;      //Boss弹窗
                this.deputy.visible = true;     //副本面板
            }
            if (CustomsManager.Instance.CustomsType == Customs_Type.Boss) {
                this.click.mouseEnabled = true; //点击面板
            }
            if (CustomsManager.Instance.CustomsType == Customs_Type.MatchElection
                || CustomsManager.Instance.CustomsType == Customs_Type.MatchChampion) {
                this.click.mouseEnabled = true; //点击面板
            }
            if (CustomsManager.Instance.CustomsType == Customs_Type.MatchChampion && !MatchLogic.Instance.IsPlayerInPk()) {
                // this.skill.visible = false;
                // this.dps.visible = false;
            }
            this.skill.SkillUpdate();
        }

        private showPanel() {
            this.visible = true;
        }

        private Destroy(): void {
            Event.RemoveEvent("ClearMainView", Laya.Handler.create(this, this.Clear));
            Event.RemoveEvent("ShowMainView", Laya.Handler.create(this, this.showPanel));
            this.click.Destroy();
            this.control.Destroy();
            this.customs.Destroy();
            this.dps.Destroy();
            this.skill.Destroy();
            this.bubble.Destroy();
            this.list.Destroy();
            this.boss.Destroy();
        }

        private OnKeyHander(event: Laya.Event) {
            switch (event.keyCode) {
                case Laya.Keyboard.A:
                    break;
            }
        }

    }
}