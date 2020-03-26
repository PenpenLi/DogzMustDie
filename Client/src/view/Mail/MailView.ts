/*
* 邮件系统UI类;
*/
module H52D_Framework {
    AddViewResource("MailView",
        [
            { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_head.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_mail.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
            { url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS },
        ]);
    export class MailView extends ui.Mail.MailViewUI {
        constructor() {
            super();
            this.AddEvent();
            this.Init();
        }
        private AddEvent(): void {
            this.closeBtn.on(Laya.Event.CLICK, this, this.CloseFunc);
            this.delAll.on(Laya.Event.CLICK, this, this.DelAllMail);
            this.getAll.on(Laya.Event.CLICK, this, this.GetAllAffix);
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            // 刷新界面消息
            Event.RegistEvent('UpdateMailView', Laya.Handler.create(this, this.Init));
            Event.RegistEvent('UpdateMailList', Laya.Handler.create(this, this.Init));
        }

        private Destroy(): void {
            this.offAll();
            Tick.ClearAll(this);
            Event.RemoveEvent('UpdateMailView', Laya.Handler.create(this, this.Init));
            Event.RemoveEvent('UpdateMailList', Laya.Handler.create(this, this.Init));
        }

        private Init(): void {
            this.closeBtn.visible = true;
            if (MailLogic.Inst.sortList.length) {
                this.mailBox.visible = true;
                this.noMailLab.visible = false;
            } else {
                this.mailBox.visible = false;
                this.noMailLab.visible = true;
                this.MailLab.text = GetInfoAttr.Instance.GetText(7006);
            }
            MailLogic.Inst.SortData();
            this.mailPanel.vScrollBarSkin = '';
            this.mailPanel.vScrollBar.isVertical = true;//滚动条的方向为垂直滚动
            this.mailPanel.vScrollBar.elasticBackTime = 600;//设置橡皮筋回弹时间
            this.mailPanel.vScrollBar.elasticDistance = 100;//设置橡皮筋回弹距离
            this.InitBtn();
            this.InitPanel();
        }

        private InitBtn() {
            if (MailLogic.Inst.sortList.length) {
                if (MailLogic.Inst.canAwardId.length <= 0) {
                    this.getAll.disabled = true;
                } else {
                    this.getAll.disabled = false;
                }
                if (MailLogic.Inst.canDelId.length <= 0) {
                    this.delAll.disabled = true;
                } else {
                    this.delAll.disabled = false;
                }
            } else {
                this.getAll.disabled = true;
                this.delAll.disabled = true;
            }
        }

        private DelAllMail(): void {
            // 判断是否存在符合条件的邮件，没有的话进行提示
            if (MailLogic.Inst.canDelId.length) {
                // 删除接口的参数就是一个ID集合
                MailLogic.Inst.DelMailsReq(MailLogic.Inst.canDelId);
            } else {
                TipsLogic.Instance.OpenMessageBox("当前无可删除的邮件");
            }
        }
        /**
         * 获取背包容量
         */
        private _cutNum = EquipManager.Instance.GetEquipNum();
        private GetAllAffix(): void {
            let aWardMailId: Array<any> = MailLogic.Inst.canAwardId;
            let maxNum = GameParamConfig.EquipMaxNum;
            if (!aWardMailId.length) {
                TipsLogic.Instance.OpenSystemTips("当前无可领取的邮件");
                return;
            }
            while (aWardMailId.length > 0) {
                let sendMailId = aWardMailId.shift();
                let itemType = MailLogic.Inst.GetMailById(sendMailId).tAffix[1];
                switch (itemType[1]) {
                    case BaseDefine.ItemTypeEquip:
                        this._cutNum++;
                        if (this._cutNum <= maxNum) {
                            MailLogic.Inst.GetMailAffix(sendMailId,MailLogic.Inst.GetMailById(sendMailId).mailType);
                        } else {
                            if (this._cutNum <= (GameParamConfig.EquipMaxNum + 1)) {
                                let str = SysPromptConfig[30040].strPromptInfo;
                                TipsLogic.Instance.OpenSystemTips(str)
                            }
                        }
                        break;
                    default:
                        MailLogic.Inst.GetMailAffix(sendMailId,MailLogic.Inst.GetMailById(sendMailId).mailType);
                        break;
                }
            }
            this._cutNum = EquipManager.Instance.GetEquipNum();
        }
        private CloseFunc(): void {
            UIManager.Instance.DestroyUI("MailView", [ViewUpRoot]);
        }
        private DeleteMail(index: number) {
            if (!MailLogic.Inst.sortList[index].bAward) {
                MailLogic.Inst.GetMailAffix(MailLogic.Inst.sortList[index].instId,MailLogic.Inst.sortList[index].mailType);
                OneTimer(200, () => {
                    MailLogic.Inst.DelMailsReq1(MailLogic.Inst.sortList[index].instId,MailLogic.Inst.sortList[index].mailType);
                }, "DeleteMail")
            } else {
                MailLogic.Inst.DelMailsReq1(MailLogic.Inst.sortList[index].instId,MailLogic.Inst.sortList[index].mailType);
            }
        }

        private InitPanel(): void {
            this.mailPanel.destroyChildren();
            let index: number = 0;
            for (let i: number = 0; i < MailLogic.Inst.listData.length; i++) {
                let node: MailLineView = new MailLineView(MailLogic.Inst.listData[i]);
                node.y = node.height * index;
                this.mailPanel.addChild(node);
                index++;
            }
        }
    }
}