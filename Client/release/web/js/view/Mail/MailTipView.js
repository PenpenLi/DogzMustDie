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
    var MailTipView = /** @class */ (function (_super) {
        __extends(MailTipView, _super);
        function MailTipView(paramsData) {
            var _this = _super.call(this) || this;
            _this._type = 0; //操作类型标记 0:删除 1领取
            _this._dataSourceObj = {};
            _this._dataSourceArr = [];
            // 缓存数据
            _this._mailItemData = paramsData[1];
            _this.AddEvent();
            _this.Init(paramsData[1]);
            return _this;
        }
        MailTipView.prototype.AddEvent = function () {
            this.closeBtn.on(Laya.Event.CLICK, this, this.CloseFunc);
            this.returnImg.on(Laya.Event.CLICK, this, this.CloseFunc);
            this.operationBtn.on(Laya.Event.CLICK, this, this.OperationFunc);
            this.list.renderHandler = new Laya.Handler(this, this.AffixItemClick);
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            // 注册消息，邮件删除后关闭对应的详情页
            H52D_Framework.Event.RegistEvent('CloseMailTips', Laya.Handler.create(this, this.CloseFunc));
            // 刷新邮件tips界面
            H52D_Framework.Event.RegistEvent('UpdateMailTipView', Laya.Handler.create(this, this.Init));
        };
        MailTipView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent('CloseMailTips', Laya.Handler.create(this, this.CloseFunc));
            H52D_Framework.Event.RemoveEvent('UpdateMailTipView', Laya.Handler.create(this, this.Init));
        };
        MailTipView.prototype.Init = function (data) {
            H52D_Framework.SetHtmlStyle(this.mailContent, 18, "#49495b", "left");
            // 界面初始化
            this.mailTitle.text = data.mailTitle;
            this.mailContent.innerHTML = data.mailContent;
            this.mailReciveTime.text = data.reciveTimeToStr; //格式2018-03-21 10:21:20
            // 按钮初始化显示删除
            this.btnLab.text = "领取";
            this._type = 0;
            this.operationBtn.disabled = true;
            if (data.tAffixData.length) {
                this.aFFixBox.visible = true;
                if (!data.bAward) {
                    // 图标置灰
                    this.operationBtn.disabled = false;
                    this.btnLab.text = "领取";
                }
                else {
                    // 按钮显示领取
                    this.operationBtn.disabled = true;
                    this.btnLab.text = "已领取";
                    this._type = 1;
                }
                // TODO 初始化list数据展示
                this.SetDataToList(data.tAffixData);
            }
            else {
                this.aFFixBox.visible = false;
                this.operationBtn.visible = false;
            }
        };
        MailTipView.prototype.CloseFunc = function () {
            H52D_Framework.UIManager.Instance.DestroyUI('MailTipView', [H52D_Framework.ViewUpRoot]);
        };
        // 邮件操作
        MailTipView.prototype.OperationFunc = function () {
            var tAffix = this._mailItemData.tAffix;
            // let num = tAffix[1][3];
            var bSucess = {};
            for (var key in tAffix) {
                bSucess[key] = tAffix[1][3];
                var cutNum = H52D_Framework.EquipManager.Instance.GetEquipNum();
                var maxNum = H52D_Framework.GameParamConfig.EquipMaxNum;
                if (cutNum >= maxNum) {
                    var str = H52D_Framework.SysPromptConfig[30040].strPromptInfo;
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
                    return;
                }
            }
            H52D_Framework.MailLogic.Inst.GetMailAffix(this._mailItemData.instId, this._mailItemData.mailType);
            this.operationBtn.disabled = true;
        };
        // 向list添加渲染数据
        MailTipView.prototype.SetDataToList = function (data) {
            var arr = [];
            this._dataSourceObj = {};
            this._dataSourceArr = [];
            for (var i = 0; i < data.length; i++) {
                var cfgId = data[i].cfgId;
                var type = data[i].type;
                if (!this._dataSourceObj[cfgId]) {
                    this._dataSourceObj[cfgId] = 0;
                }
                if (data[i].num != 0) {
                    this._dataSourceObj[cfgId] += data[i].num;
                    this._dataSourceArr.push(data[i]);
                    arr.push(data[i]);
                }
            }
            this.list.array = arr;
            this.SetListCenter();
        };
        // list自适应居中
        MailTipView.prototype.SetListCenter = function () {
            this.list.repeatX = this._dataSourceArr.length;
            this.list.spaceX = 17;
            if (this._dataSourceArr.length > 3) {
                this.list.spaceX = 0;
            }
            this.list.width = 80 * this.list.repeatX + 17 * (this.list.repeatX - 1);
            if (this.list.width >= 466 * G_StageWidthScale) {
                this.list.width = 466 * G_StageWidthScale;
            }
        };
        // 附件点击事件
        MailTipView.prototype.AffixItemClick = function (item, index) {
            var btn = item.getChildByName('btn');
            var name = item.getChildByName('name');
            var num = item.getChildByName('num');
            var itemData = this.list.array[index];
            var colorQua = itemData.color;
            var quaUrl = "ui_icon/" + itemData.icon;
            //let bgColor: string = BaseDefine.ItemBgColor[colorQua];
            var bgColor = itemData.GetColorStr();
            var bgUrl = H52D_Framework.BaseDefine.PubBgUrl[colorQua];
            var bgImg = item.getChildByName('bgImg');
            var quaImg = item.getChildByName('quaImg');
            var img = item.getChildByName('img');
            num.visible = itemData.num > 1 ? true : false;
            name.color = bgColor;
            name.text = itemData.name;
            bgImg.bgColor = bgColor;
            quaImg.skin = bgUrl;
            img.skin = quaUrl;
        };
        return MailTipView;
    }(ui.Mail.MailTipViewUI));
    H52D_Framework.MailTipView = MailTipView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MailTipView.js.map