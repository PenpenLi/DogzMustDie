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
* 邮件系统UI类;
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
    var MailView = /** @class */ (function (_super) {
        __extends(MailView, _super);
        function MailView() {
            var _this = _super.call(this) || this;
            /**
             * 获取背包容量
             */
            _this._cutNum = H52D_Framework.EquipManager.Instance.GetEquipNum();
            _this.AddEvent();
            _this.Init();
            return _this;
        }
        MailView.prototype.AddEvent = function () {
            this.closeBtn.on(Laya.Event.CLICK, this, this.CloseFunc);
            this.delAll.on(Laya.Event.CLICK, this, this.DelAllMail);
            this.getAll.on(Laya.Event.CLICK, this, this.GetAllAffix);
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            // 刷新界面消息
            H52D_Framework.Event.RegistEvent('UpdateMailView', Laya.Handler.create(this, this.Init));
            H52D_Framework.Event.RegistEvent('UpdateMailList', Laya.Handler.create(this, this.Init));
        };
        MailView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Tick.ClearAll(this);
            H52D_Framework.Event.RemoveEvent('UpdateMailView', Laya.Handler.create(this, this.Init));
            H52D_Framework.Event.RemoveEvent('UpdateMailList', Laya.Handler.create(this, this.Init));
        };
        MailView.prototype.Init = function () {
            this.closeBtn.visible = true;
            if (H52D_Framework.MailLogic.Inst.sortList.length) {
                this.mailBox.visible = true;
                this.noMailLab.visible = false;
            }
            else {
                this.mailBox.visible = false;
                this.noMailLab.visible = true;
                this.MailLab.text = H52D_Framework.GetInfoAttr.Instance.GetText(7006);
            }
            H52D_Framework.MailLogic.Inst.SortData();
            this.mailPanel.vScrollBarSkin = '';
            this.mailPanel.vScrollBar.isVertical = true; //滚动条的方向为垂直滚动
            this.mailPanel.vScrollBar.elasticBackTime = 600; //设置橡皮筋回弹时间
            this.mailPanel.vScrollBar.elasticDistance = 100; //设置橡皮筋回弹距离
            this.InitBtn();
            this.InitPanel();
        };
        MailView.prototype.InitBtn = function () {
            if (H52D_Framework.MailLogic.Inst.sortList.length) {
                if (H52D_Framework.MailLogic.Inst.canAwardId.length <= 0) {
                    this.getAll.disabled = true;
                }
                else {
                    this.getAll.disabled = false;
                }
                if (H52D_Framework.MailLogic.Inst.canDelId.length <= 0) {
                    this.delAll.disabled = true;
                }
                else {
                    this.delAll.disabled = false;
                }
            }
            else {
                this.getAll.disabled = true;
                this.delAll.disabled = true;
            }
        };
        MailView.prototype.DelAllMail = function () {
            // 判断是否存在符合条件的邮件，没有的话进行提示
            if (H52D_Framework.MailLogic.Inst.canDelId.length) {
                // 删除接口的参数就是一个ID集合
                H52D_Framework.MailLogic.Inst.DelMailsReq(H52D_Framework.MailLogic.Inst.canDelId);
            }
            else {
                H52D_Framework.TipsLogic.Instance.OpenMessageBox("当前无可删除的邮件");
            }
        };
        MailView.prototype.GetAllAffix = function () {
            var aWardMailId = H52D_Framework.MailLogic.Inst.canAwardId;
            var maxNum = H52D_Framework.GameParamConfig.EquipMaxNum;
            if (!aWardMailId.length) {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("当前无可领取的邮件");
                return;
            }
            while (aWardMailId.length > 0) {
                var sendMailId = aWardMailId.shift();
                var itemType = H52D_Framework.MailLogic.Inst.GetMailById(sendMailId).tAffix[1];
                switch (itemType[1]) {
                    case H52D_Framework.BaseDefine.ItemTypeEquip:
                        this._cutNum++;
                        if (this._cutNum <= maxNum) {
                            H52D_Framework.MailLogic.Inst.GetMailAffix(sendMailId, H52D_Framework.MailLogic.Inst.GetMailById(sendMailId).mailType);
                        }
                        else {
                            if (this._cutNum <= (H52D_Framework.GameParamConfig.EquipMaxNum + 1)) {
                                var str = H52D_Framework.SysPromptConfig[30040].strPromptInfo;
                                H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
                            }
                        }
                        break;
                    default:
                        H52D_Framework.MailLogic.Inst.GetMailAffix(sendMailId, H52D_Framework.MailLogic.Inst.GetMailById(sendMailId).mailType);
                        break;
                }
            }
            this._cutNum = H52D_Framework.EquipManager.Instance.GetEquipNum();
        };
        MailView.prototype.CloseFunc = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("MailView", [H52D_Framework.ViewUpRoot]);
        };
        MailView.prototype.DeleteMail = function (index) {
            if (!H52D_Framework.MailLogic.Inst.sortList[index].bAward) {
                H52D_Framework.MailLogic.Inst.GetMailAffix(H52D_Framework.MailLogic.Inst.sortList[index].instId, H52D_Framework.MailLogic.Inst.sortList[index].mailType);
                H52D_Framework.OneTimer(200, function () {
                    H52D_Framework.MailLogic.Inst.DelMailsReq1(H52D_Framework.MailLogic.Inst.sortList[index].instId, H52D_Framework.MailLogic.Inst.sortList[index].mailType);
                }, "DeleteMail");
            }
            else {
                H52D_Framework.MailLogic.Inst.DelMailsReq1(H52D_Framework.MailLogic.Inst.sortList[index].instId, H52D_Framework.MailLogic.Inst.sortList[index].mailType);
            }
        };
        MailView.prototype.InitPanel = function () {
            this.mailPanel.destroyChildren();
            var index = 0;
            for (var i = 0; i < H52D_Framework.MailLogic.Inst.listData.length; i++) {
                var node = new H52D_Framework.MailLineView(H52D_Framework.MailLogic.Inst.listData[i]);
                node.y = node.height * index;
                this.mailPanel.addChild(node);
                index++;
            }
        };
        return MailView;
    }(ui.Mail.MailViewUI));
    H52D_Framework.MailView = MailView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MailView.js.map