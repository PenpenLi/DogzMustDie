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
/*
* name;
*/
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("MailView", [
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_head.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_mail.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_shop.atlas", type: Laya.Loader.ATLAS },
    ]);
    var MailLineView = /** @class */ (function (_super) {
        __extends(MailLineView, _super);
        function MailLineView(buf) {
            var _this = _super.call(this) || this;
            _this._mailData = buf;
            _this.AddEvent();
            _this.Init();
            return _this;
        }
        MailLineView.prototype.AddEvent = function () {
            this.btn.on(Laya.Event.CLICK, this, this.MailClick);
            this.on(Laya.Event.REMOVED, this, this.Destroy);
        };
        MailLineView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Tick.ClearAll(this);
        };
        MailLineView.prototype.Init = function () {
            this.MailRecTime();
            this.InitStateLab();
            this.InitTitleText();
            this.SetAward();
        };
        MailLineView.prototype.MailClick = function () {
            if (this._mailData.ReadMail()) {
                H52D_Framework.MailLogic.Inst.ReadMail(this._mailData.instId, this._mailData.mailType);
            }
            H52D_Framework.UIManager.Instance.CreateUI("MailTipView", [H52D_Framework.ViewUpRoot, this._mailData]);
        };
        MailLineView.prototype.InitStateLab = function () {
            if (this._mailData.isNew) {
                this.notRead.text = '未读';
                this.notRead.color = '#377b51';
            }
            else {
                this.notRead.text = '已读';
                this.notRead.color = '#435586';
            }
        };
        MailLineView.prototype.SetAward = function () {
            if (this._mailData.tAffixData.length) {
                if (!this._mailData.bAward) {
                    this.itemImg.visible = true;
                }
                else {
                    this.itemImg.visible = false;
                }
            }
            else {
                this.itemImg.visible = false;
            }
        };
        MailLineView.prototype.InitTitleText = function () {
            this.mailTitle.text = this._mailData.mailTitle;
            this.mailContent.text = this._mailData.getAffixContent;
        };
        MailLineView.prototype.MailRecTime = function () {
            var lastTotalTime = this._mailData.dueTime - new Date().getTime() / 1000;
            var lastDay = Math.ceil(lastTotalTime / 86400);
            this.mailReciveTime.text = this._mailData.reciveTimeToStr;
            if (lastTotalTime <= 1) {
                if (this._mailData.tAffixData.length) {
                    if (!this._mailData.bAward) {
                        H52D_Framework.MailLogic.Inst.GetMailAffix(this._mailData.instId, this._mailData.mailType);
                        H52D_Framework.MailLogic.Inst.DelMailsReq1(this._mailData.instId, this._mailData.mailType);
                    }
                    else {
                        H52D_Framework.MailLogic.Inst.DelMailsReq1(this._mailData.instId, this._mailData.mailType);
                    }
                }
                else {
                    H52D_Framework.MailLogic.Inst.DelMailsReq1(this._mailData.instId, this._mailData.mailType);
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
                    this.lastTime.text = H52D_Framework.GetFormatNumTime(this._timeOut);
                    this.lastTime.color = '#ff0000';
                    H52D_Framework.Tick.Loop(1000, this, this.SetTimeOut, [this._mailData]);
                }
            }
        };
        MailLineView.prototype.SetTimeOut = function (data) {
            if (this._timeOut <= 1) {
                H52D_Framework.Tick.Clear(this, this.SetTimeOut);
                // 到期邮件直接删除
                if (this._mailData.tAffixData.length) {
                    if (!this._mailData.bAward) {
                        H52D_Framework.MailLogic.Inst.GetMailAffix(this._mailData.instId, this._mailData.mailType);
                        H52D_Framework.MailLogic.Inst.DelMailsReq1(this._mailData.instId, this._mailData.mailType);
                    }
                    else {
                        H52D_Framework.MailLogic.Inst.DelMailsReq1(this._mailData.instId, this._mailData.mailType);
                    }
                }
                else {
                    H52D_Framework.MailLogic.Inst.DelMailsReq1(this._mailData.instId, this._mailData.mailType);
                }
            }
            else {
                var time = Math.ceil((--this._timeOut));
                this.lastTime.text = H52D_Framework.GetFormatNumTime(time);
            }
        };
        return MailLineView;
    }(ui.Mail.MailLineViewUI));
    H52D_Framework.MailLineView = MailLineView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MailLineView.js.map