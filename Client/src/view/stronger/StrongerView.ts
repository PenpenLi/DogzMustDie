module H52D_Framework {
    AddViewResource("StrongerView", [
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_head.atlas", type: Laya.Loader.ATLAS },
    ]);
    enum StrongerType {
        Money = 1,    //天降钱雨
        Speed = 2,    //肾上腺加速
        Reward = 3     //抽奖
    }
    /*
    * 挑战失败，我要变强类
    */
    export class StrongerView extends ui.stronger.StrongerViewUI {

        private data: any[];

        public constructor() {
            super();
            this.ViewInit();
            this.EventInit();

        }

        private ViewInit() {
            this.data = [];
            for (let i in StrongerConfig) {
                this.data.push(StrongerConfig[i]);
            }
            this.suit_list.vScrollBarSkin = "";
            this.suit_list.renderHandler = new Laya.Handler(this, this.RenderHandler);
            this.suit_list.array = this.data;
        }

        private EventInit() {
            Event.RegistEvent('onGotoHander', Laya.Handler.create(this, this.onGotoHander));
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.btn_close.on(Laya.Event.CLICK, this, this.OnCloseHander);
        }

        private Destroy() {
            Event.RemoveEvent('onGotoHander', Laya.Handler.create(this, this.onGotoHander));
            this.offAll();
        }

        private OnCloseHander() {
            UIManager.Instance.DestroyUI(this.name, [this.parent]);
        }

        private bGuidanceButton = true;
        private RenderHandler(item, index: number) {
            item.getChildByName("img_icon").skin = "ui_icon/" + this.data[index].icon;
            item.getChildByName("tx_name").text = GetInfoAttr.Instance.GetSystemText(this.data[index].name);
            item.getChildByName("tx_destribe").text = GetInfoAttr.Instance.GetSystemText(this.data[index].description);
            //引导获取按钮
            let goto = item.getChildByName("btn_goto");
            goto.offAll();
            goto.on(Laya.Event.CLICK, this, this.onGotoHander, [index, null]);
            if (index == 1 && this.bGuidanceButton) {
                Guidance.Instance.SetGuidanceButton(E_GuidanceStep.E_Guidance_11, goto)
                this.bGuidanceButton = false;
            }
        }

        private onGotoHander(index: number) {
            switch (this.data[index].link) {
                case StrongerType.Money://天降钱雨
                    Event.DispatchEvent("OnPanelClick", [E_OpenGrade.ROLE, true]);
                    Event.DispatchEvent(EventDefine.BOTTOM_SET_PANEL);
                    OneTimer(250, () => {
                        Event.DispatchEvent("RolePrivilege", [2]);
                    });
                    break;
                case StrongerType.Speed://肾上腺加速
                    Event.DispatchEvent("OnPanelClick", [E_OpenGrade.ROLE, true]);
                    Event.DispatchEvent(EventDefine.BOTTOM_SET_PANEL);
                    OneTimer(250, () => {
                        Event.DispatchEvent("RolePrivilege", [1]);
                    });
                    break;
                case StrongerType.Reward:
                    Event.DispatchEvent("OnPanelClick", [E_OpenGrade.SHOP, true]);
                    Event.DispatchEvent(EventDefine.BOTTOM_SET_PANEL);
                    OneTimer(250, () => {
                        Event.DispatchEvent("ToLotteryShop");
                    });
                    break;
            }
            this.OnCloseHander();
        }
    }
}
