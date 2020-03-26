/*
* name;
*/
module H52D_Framework {
    export class MailTipView extends ui.Mail.MailTipViewUI {
        constructor(paramsData: any) {
            super();

            // 缓存数据
            this._mailItemData = paramsData[1];

            this.AddEvent();
            this.Init(paramsData[1]);
        }

        private _type: number = 0;//操作类型标记 0:删除 1领取
        // 邮件数据
        private _mailItemData: MailItem;
        // 倒计时时间
        private _timeOut: number;
        private _dataSourceObj: { [cfgId: number]: number } = {};
        private _dataSourceArr: Array<ItemData> = [];

        private AddEvent(): void {
            this.closeBtn.on(Laya.Event.CLICK, this, this.CloseFunc);
            this.returnImg.on(Laya.Event.CLICK, this, this.CloseFunc);
            this.operationBtn.on(Laya.Event.CLICK, this, this.OperationFunc);
            this.list.renderHandler = new Laya.Handler(this, this.AffixItemClick);
            this.on(Laya.Event.REMOVED, this, this.Destroy);

            // 注册消息，邮件删除后关闭对应的详情页
            Event.RegistEvent('CloseMailTips', Laya.Handler.create(this, this.CloseFunc));
            // 刷新邮件tips界面
            Event.RegistEvent('UpdateMailTipView', Laya.Handler.create(this, this.Init));
        }

        private Destroy(): void {
            this.offAll();
            Event.RemoveEvent('CloseMailTips', Laya.Handler.create(this, this.CloseFunc));
            Event.RemoveEvent('UpdateMailTipView', Laya.Handler.create(this, this.Init));
        }

        private Init(data: MailItem): void {
            SetHtmlStyle(this.mailContent, 18, "#49495b", "left")
            // 界面初始化
            this.mailTitle.text = data.mailTitle;
            this.mailContent.innerHTML = data.mailContent;
            this.mailReciveTime.text = data.reciveTimeToStr;//格式2018-03-21 10:21:20


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

                } else {
                    // 按钮显示领取
                    this.operationBtn.disabled = true;
                    this.btnLab.text = "已领取";
                    this._type = 1;
                }
                // TODO 初始化list数据展示
                this.SetDataToList(data.tAffixData);
            } else {
                this.aFFixBox.visible = false;
                this.operationBtn.visible = false;
            }
        }

        private CloseFunc(): void {
            UIManager.Instance.DestroyUI('MailTipView', [ViewUpRoot]);
        }

        // 邮件操作
        private OperationFunc(): void {
            let tAffix = this._mailItemData.tAffix
            // let num = tAffix[1][3];
            let bSucess: { [Id: number]: number } = {}
            for (var key in tAffix) {
                bSucess[key] = tAffix[1][3]
                let cutNum = EquipManager.Instance.GetEquipNum();
                let maxNum = GameParamConfig.EquipMaxNum;
                if (cutNum >= maxNum) {
                    let str = SysPromptConfig[30040].strPromptInfo;
                    TipsLogic.Instance.OpenSystemTips(str);
                    return;
                }
            }

            MailLogic.Inst.GetMailAffix(this._mailItemData.instId,this._mailItemData.mailType);
            this.operationBtn.disabled = true;
        }

        // 向list添加渲染数据
        private SetDataToList(data: Array<ItemData>): void {
            let arr: Array<any> = [];
            this._dataSourceObj = {};
            this._dataSourceArr = [];

            for (let i: number = 0; i < data.length; i++) {
                let cfgId: number = data[i].cfgId;
                let type = data[i].type;
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
        }
        // list自适应居中
        private SetListCenter(): void {
            this.list.repeatX = this._dataSourceArr.length;
            this.list.spaceX = 17;
            if (this._dataSourceArr.length > 3) {
                this.list.spaceX = 0;
            }
            this.list.width = 80 * this.list.repeatX + 17 * (this.list.repeatX - 1);
            if (this.list.width >= 466 * G_StageWidthScale) {
                this.list.width = 466 * G_StageWidthScale;
            }
        }
        // 附件点击事件
        private AffixItemClick(item, index: number): void {
            let btn = item.getChildByName('btn');
            let name = item.getChildByName('name');
            let num = item.getChildByName('num');
            let itemData: ItemData = this.list.array[index];
            let colorQua = itemData.color;
            let quaUrl: string = "ui_icon/" + itemData.icon;
            //let bgColor: string = BaseDefine.ItemBgColor[colorQua];
            let bgColor: string =itemData.GetColorStr();
            let bgUrl: string = BaseDefine.PubBgUrl[colorQua];
            let bgImg = item.getChildByName('bgImg');
            let quaImg = item.getChildByName('quaImg');
            let img = item.getChildByName('img');
            num.visible=itemData.num>1?true:false;
            name.color = bgColor;
            name.text = itemData.name;
            bgImg.bgColor = bgColor;
            quaImg.skin = bgUrl;
            img.skin = quaUrl;
        }
    }
}