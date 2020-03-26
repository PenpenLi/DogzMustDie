/*
* name;
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
    export class MailLineView extends ui.Mail.MailLineViewUI {
        private _mailData: MailItem;
        private _timeOut: number;
        constructor(buf: any) {
            super();
            this._mailData = buf;
            this.AddEvent();
            this.Init();
        }

        private AddEvent() {
            this.btn.on(Laya.Event.CLICK, this, this.MailClick);
            this.on(Laya.Event.REMOVED, this, this.Destroy);
        }

        private Destroy(): void {
            this.offAll();
            Tick.ClearAll(this);
        }

        private Init() {
            this.MailRecTime();
            this.InitStateLab();
            this.InitTitleText();
            this.SetAward();
        }

        private MailClick() {
            if (this._mailData.ReadMail()) {
                MailLogic.Inst.ReadMail(this._mailData.instId,this._mailData.mailType);
            }
            UIManager.Instance.CreateUI("MailTipView", [ViewUpRoot, this._mailData]);
        }

        private InitStateLab() {
            if (this._mailData.isNew) {
                this.notRead.text = '未读';
                this.notRead.color = '#377b51'
            } else {
                this.notRead.text = '已读';
                this.notRead.color = '#435586';
            }
        }

        private SetAward() {
            if (this._mailData.tAffixData.length) {
                if (!this._mailData.bAward) {
                    this.itemImg.visible = true;
                } else {
                    this.itemImg.visible = false;
                }
            } else {
                this.itemImg.visible = false;
            }
        }

        private InitTitleText() {
            this.mailTitle.text = this._mailData.mailTitle;
            this.mailContent.text = this._mailData.getAffixContent;
        }

        private MailRecTime() {
            let lastTotalTime = this._mailData.dueTime - new Date().getTime() / 1000;
            let lastDay = Math.ceil(lastTotalTime / 86400);
            this.mailReciveTime.text = this._mailData.reciveTimeToStr
            if (lastTotalTime <= 1) {
                if (this._mailData.tAffixData.length) {
                    if (!this._mailData.bAward) {
                        MailLogic.Inst.GetMailAffix(this._mailData.instId,this._mailData.mailType);
                        MailLogic.Inst.DelMailsReq1(this._mailData.instId,this._mailData.mailType);
                    } else {
                        MailLogic.Inst.DelMailsReq1(this._mailData.instId,this._mailData.mailType);
                    }
                } else {
                    MailLogic.Inst.DelMailsReq1(this._mailData.instId,this._mailData.mailType);
                }
                return;
            }
            this.lastTime.text = '有效期: ' + lastDay + '天';
            if (lastDay < 3) {
                this.lastTime.color = '#ff0000';
                if (lastDay <= 1) {
                    // TODO 倒计时显示剩余时间 02:30:40
                    if (!this._timeOut || this._timeOut != Math.ceil(lastTotalTime)) {
                        this._timeOut = Math.ceil(lastTotalTime);
                    }
                    this.lastTime.text = GetFormatNumTime(this._timeOut);
                    this.lastTime.color = '#ff0000';
                    Tick.Loop(1000, this, this.SetTimeOut, [this._mailData])
                }
            }
        }

        private SetTimeOut(data: any) {
            if (this._timeOut <= 1) {
                Tick.Clear(this, this.SetTimeOut);
                // 到期邮件直接删除
                if (this._mailData.tAffixData.length) {
                    if (!this._mailData.bAward) {
                        MailLogic.Inst.GetMailAffix(this._mailData.instId,this._mailData.mailType);
                        MailLogic.Inst.DelMailsReq1(this._mailData.instId,this._mailData.mailType);
                    } else {
                        MailLogic.Inst.DelMailsReq1(this._mailData.instId,this._mailData.mailType);
                    }
                } else {
                    MailLogic.Inst.DelMailsReq1(this._mailData.instId,this._mailData.mailType);
                }
            } else {
                let time = Math.ceil((--this._timeOut));
                this.lastTime.text = GetFormatNumTime(time);
            }
        }
    }
}