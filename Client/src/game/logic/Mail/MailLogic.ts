/*
* 邮件系统数据类;
*/
module H52D_Framework {
    export class MailLogic {
        private static _inst: MailLogic;

        public static get Inst() { //单例模式
            if (MailLogic._inst == null)
                MailLogic._inst = new MailLogic();
            return MailLogic._inst;
        }

        // 所有邮件数据
        private _tList: Array<MailItem> = [];
        // 邮件数量
        private _mailCount: number;
        // 保存排序之后的邮件信息
        private _tSortList: Array<MailItem> = [];
        // 正在领取的邮件ID
        private _sendingMailId: Array<any> = [];
        // 是否已经打开
        private _hadOpen: boolean = false;
        private _attachAward: Array<any> = [];
        // 参数表数据
        private _gameParam: any;
        // 系统提示配置表数据
        private _sysPromptCfg: any;

        private _worldMailAccessoryTime: number = 0;
        public Initialize(): void {
            // 开始同步玩家的个人邮件信息
            RemoteCall.Instance.RegistJXS2CProtocol('C_MailListStar', this);
            // 同步玩家的个人邮件信息
            RemoteCall.Instance.RegistJXS2CProtocol('C_MailList', this);
            // 同步玩家个人邮件信息结束
            RemoteCall.Instance.RegistJXS2CProtocol('C_MailListEnd', this);
            // 新增个人邮件
            RemoteCall.Instance.RegistJXS2CProtocol('C_AddMail', this);
            // 删除邮件结果消息
            RemoteCall.Instance.RegistJXS2CProtocol('C_DelMailsRes', this);
            // 服务器返回读取或领取的结果
            RemoteCall.Instance.RegistJXS2CProtocol('C_MailState', this);
            // 邮件附件领取结果
            RemoteCall.Instance.RegistJXS2CProtocol('C_GetMailAffixRes', this);

            // 同步玩家的运营邮件信息
            RemoteCall.Instance.RegistJXS2CProtocol('C_WorldMailList', this);
            // 同步玩家运营邮件信息结束
            RemoteCall.Instance.RegistJXS2CProtocol('C_WorldMailListEnd', this);
            // 新增运营邮件
            RemoteCall.Instance.RegistJXS2CProtocol('C_AddWorldMail', this);
            this._gameParam = GameParamConfig;
            this._sysPromptCfg = SysPromptConfig;
            this._worldMailAccessoryTime = this._gameParam['MailStorageMaxTime'] * 86400;
            // 登录时如果有未读邮件
            if (MailLogic.Inst.haveNotReadMail) {
                // 注册消息通知主界面入口提示特效
                Event.DispatchEvent('UpdateEntrance');
            }
        }
        // 私有方法begin。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
        // 邮件排序
        private sortMailList(): void {
            // 排序前先清空
            this._tSortList = [];
            for (let i in this._tList) {
                let index = Number(i);
                let data = this._tList[index];
                this._tSortList.push(data);
            }
            // 对邮件根据获取时间进行排序
            function sortMail(a, b) {
                return b.isNew - a.isNew;
            }
            this._tSortList.sort(sortMail);
            // 刷新界面消息 
            Event.DispatchEvent('UpdateMailView');
            Event.DispatchEvent('UpdateMailList');
        }
        // 接收服务器发送到客户端的消息begin。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。

        // 同步个人邮件信息
        private C_MailListStar(): void {
            this._tList = []
            this._tSortList = []
        }

        // 同步个人邮件信息
        private C_MailList(buf: any): void {
            for (let i in buf[0]) {
                let key = Number(i);
                let data: MailItem = new MailItem(buf[0][key][1], buf[0][key][2], buf[0][key][3], buf[0][key][4], buf[0][key][5], buf[0][key][6], buf[0][key][7]);
                this._tList.push(data);
            }
        }

        // 同步个人邮件信息结束
        private C_MailListEnd(buf: any): void {
            // 接受邮件结束，对邮件进行排序
            for (let i in buf[0]) {
                let key = Number(i);
                let data: MailItem = new MailItem(buf[0][key][1], buf[0][key][2], buf[0][key][3], buf[0][key][4], buf[0][key][5], buf[0][key][6], buf[0][key][7]);
                this._tList.push(data);
            }
            this.sortMailList();
        }

        // 同步运营邮件信息
        private C_WorldMailList(buf: any): void {
            for (let i in buf[0]) {
                let key = Number(i);
                ConfigSystem.Inst.SetNewMail(key, buf[0][key][1], buf[0][key][2])
                let data: MailItem = new MailItem(key, key + 10000, buf[0][key][3], buf[0][key][4], buf[0][key][5], buf[0][key][6]);
                let isID: boolean = false;
                for (var index = 0; index < this._tList.length; index++) {
                    if (data.instId == this._tList[index].instId) {
                        isID = true;
                        break
                    }
                }
                if (!isID) {
                    this._tList.push(data);
                }
            }
        }

        // 同步运营邮件信息结束
        private C_WorldMailListEnd(buf: any): void {
            // 接受运营邮件结束，对邮件进行排序
            for (let i in buf[0]) {
                let key = Number(i);
                ConfigSystem.Inst.SetNewMail(key, buf[0][key][1], buf[0][key][2])
                let data: MailItem = new MailItem(key, key + 10000, buf[0][key][3], buf[0][key][4], buf[0][key][5], buf[0][key][6]);
                let isID: boolean = false;
                for (var index = 0; index < this._tList.length; index++) {
                    if (data.instId == this._tList[index].instId) {
                        isID = true;
                        break
                    }
                }
                if (!isID) {
                    this._tList.push(data);
                }
            }
            this.sortMailList();
        }

        // 新增运营邮件
        private C_AddWorldMail(buf: any): void {
            let mailId = buf[0][1];
            let mailAffix = buf[0][4];
            let content = buf[0][3];
            let title = buf[0][2];
            // 向邮件列表中添加一条邮件信息，然后重新排序
            ConfigSystem.Inst.SetNewMail(Number(mailId), title, content);
            let mailData: MailItem = new MailItem();
            mailData.instId = mailId;
            mailData.mailType = Number(mailId) + 10000;
            mailData.reciveTime = (new Date().getTime() / 1000);
            mailData.tAffix = Array(mailAffix).length ? mailAffix : [];
            mailData.lastTime = this._worldMailAccessoryTime;
            mailData.dueTime = (new Date().getTime() / 1000) + this._worldMailAccessoryTime;
            mailData.isNew = true;
            mailData.bAward = false;

            let isID: boolean = false;
            for (var index = 0; index < this._tList.length; index++) {
                if (mailData.instId == this._tList[index].instId) {
                    isID = true;
                    break
                }
            }
            if (!isID) {
                this._tList.push(mailData);
            }
            this.sortMailList();
            // 刷新界面消息
            Event.DispatchEvent('UpdateMailView');
            // 新邮件提示,刷新入口图标
            Event.DispatchEvent('UpdateEntrance');
        }
        // 新增个人邮件
        private C_AddMail(buf: any): void {
            // 向邮件列表中添加一条邮件信息，然后重新排序
            let mailData: MailItem = new MailItem();
            mailData.instId = buf[0];
            mailData.mailType = buf[1];
            mailData.tAffix = buf[2];
            mailData.lastTime = this._worldMailAccessoryTime;
            mailData.isNew = true;
            mailData.bAward = false;
            mailData.contentInfo = buf[3];
            mailData.reciveTime = (new Date().getTime() / 1000);
            mailData.dueTime = (new Date().getTime() / 1000) + this._worldMailAccessoryTime;
            this._tList.push(mailData);
            this.sortMailList();
            // 刷新界面消息
            Event.DispatchEvent('UpdateMailView');
            // 新邮件提示,刷新入口图标
            Event.DispatchEvent('UpdateEntrance');
            Event.DispatchEvent('UpdateMailList');
        }
        /**
         * 删除邮件的消息
         * @param buf 删除的邮件的ID数组
         */
        private C_DelMailsRes(buf: any): void {
            // 删除对应的邮件，重新排序，注册消息刷新UI
            for (let i in buf[0]) {
                for (let k in this._tList) {
                    let index = Number(k);
                    if (this._tList[index].instId == buf[0][i]) {
                        this._tList.splice(index, 1);
                        break;
                    }
                }
            }
            this.sortMailList();
            // 刷新界面消息
            Event.DispatchEvent('UpdateMailView');
            // 关闭打开的邮件详情页
            Event.DispatchEvent('CloseMailTips');
            Event.DispatchEvent('UpdateMailList');
        }
        /**
         * 读取或者领取邮件的消息
         * @param para1 mailId
         * @param parm2 type(为1时已读邮件，为2时已经取附件)
         */
        private C_MailState(buf: any): void {
            let para1 = buf[0];
            let parm2 = buf[1];
            let mailData: MailItem;
            for (let i in this._tList) {
                let index = Number(i);
                if (this._tList[i].instId == para1) {

                    if (parm2 == 0) {

                    } else if (parm2 == 1) {
                        // 读取邮件
                        this._tList[i].isNew = false;
                        // 更新列表数据源
                        this.sortMailList();
                    } else if (parm2 == 2) {
                        // 领取附件
                        this._tList[i].isNew = false;
                        this._tList[i].bAward = true;
                        // 更新列表数据源
                        this.sortMailList();
                        // 刷新邮件tips界面
                        Event.DispatchEvent('UpdateMailTipView', [this._tList[i]]);
                    }
                    mailData = this._tList[i];
                    break;
                }
            }
            // 刷新UI界面
            Event.DispatchEvent('UpdateMailView');
            Event.DispatchEvent('UpdateMailList');
        }

        /**
         * 领取邮件附件的回调
         * @param mailId 邮件ID
         * @param bSucess 是否领取成功
         */
        private _Award = {}
        private C_GetMailAffixRes(buf: any): void {
            let mailId = buf[0];
            let _Award = buf[1];
            let isExpire = buf[2];
            let bSucess: Array<any> = []
            for (let i in this._tList) {
                let index = Number(i);
                if (this._tList[i].instId == mailId) {
                    // 更新UI界面  
                    this._tList[i].bAward = true;
                }
            }
            //是否是一键领取
            if (!isExpire) {
                for (let type in _Award) {
                    let itemType = Number(type)
                    let data = _Award[itemType]
                    if (this._Award[itemType] == null) {
                        this._Award[itemType] = {}
                    }
                    let tAwardInfo = this._Award[itemType]
                    for (let id in data) {
                        let ID = Number(id)
                        let num = data[id]
                        if (tAwardInfo[ID] == null) {
                            tAwardInfo[ID] = num
                        } else {
                            tAwardInfo[ID] += num
                        }
                    }
                }
                OneTimer(500, () => {
                    TipsLogic.Instance.OpenGoodsProTips(this._Award)
                    this._Award = {}
                }, "C_GetMailAffixRes")
            }
            Event.DispatchEvent('UpdateMailView');
            Event.DispatchEvent('UpdateMailList');
        }

        // 读取邮件请求,个人和运营共用
        public ReadMail(mailId: number, mailTypa: any) {
            if (mailTypa < 10000) {
                // 个人邮件
                RemoteCall.Instance.Send("K_ReadPersonalMail", mailId);
            } else {
                // 运营邮件
                RemoteCall.Instance.Send("K_ReadWorldMail", mailId.toString());
            }
        }

        // 领取邮件附件请求，个人和运营共用
        public GetMailAffix(mailId: any, mailType: any) {
            if (mailType < 10000) {
                // 个人邮件
                RemoteCall.Instance.Send("K_GetMailAffix", mailId);
            } else {
                // 运营邮件
                RemoteCall.Instance.Send("K_GetWorldMailAffix", mailId.toString());
            }

        }

        // 删除邮件请求
        public DelMailsReq(delList: Array<any>) {
            // 区分个人邮件和运营邮件
            let delList0 = []; //个人邮件
            let delList1 = []; //运营邮件
            for (let i: number = 0; i < delList.length; i++) {
                if (MailLogic.Inst.GetMailById(delList[i]).mailType < 10000) {
                    delList0.push(delList[i]);
                } else {
                    delList1.push(delList[i].toString());
                }
            }

            if (delList0.length > 0) {
                RemoteCall.Instance.Send("K_DelMailsReq", delList0);
            }

            if (delList1.length > 0) {
                RemoteCall.Instance.Send("K_DelWorldMail", delList1);
            }
        }
        // 单封删除邮件请求
        public DelMailsReq1(delList: number, mailTypa: any) {
            if (mailTypa > 10000) {
                RemoteCall.Instance.Send("K_DelWorldMail", [delList]);
            } else {
                RemoteCall.Instance.Send("K_DelMailsReq", [delList]);
            }
        }

        // 一键领取邮件附件并删除
        public GetMailAffixAndDel(i_nType: number, i_tMailId: string) {
            // i_nType 为1是个人，为2是世界，为3是所有
            RemoteCall.Instance.Send("K_GetMailAffixAndDel", i_nType, i_tMailId);
        }

        // 领取邮件附件（从GS返回的消息,个人和运营共用此消息）
        public GetMailAffixRes(i_sMailId: string, i_bSuc: boolean) {
            RemoteCall.Instance.Send("K_GetMailAffixRes", i_sMailId);
        }

        // 所有的邮件数据
        public get mailList(): Array<MailItem> {
            return this._tList;
        }
        private _listData: Array<any> = [];
        public SortData(): void {
            this._listData = [];
            for (var key in this._tSortList) {
                this._listData.push(this._tSortList[key]);
            }
        }

        // 排序好的邮件数据
        public get listData(): Array<MailItem> {
            return this._listData;
        }
        // 排序好的邮件数据
        public get sortList(): Array<MailItem> {
            return this._tSortList;
        }

        // 当前邮件数量
        public get mailCount(): number {
            return this._tSortList.length;
        }

        // 获取提示配置信息
        public get sysPromptCfg(): any {
            return this._sysPromptCfg;
        }

        // 获取是否有未读邮件
        public get haveNotReadMail(): boolean {
            let bool: boolean = false;
            for (let i in this._tList) {
                let index = Number(i);
                if (this._tList[i].isNew) {
                    bool = true;
                    break;
                }
            }

            return bool;
        }

        // 获取是否有附件未领取
        public get haveNewAffix(): boolean {
            let bool: boolean = false;
            for (let i in this._tList) {
                let index = Number(i);
                if (this._tList[i].tAffixData.length > 0 && !this._tList[i].bAward) {
                    bool = true;
                    break;
                }
            }
            return bool;
        }

        /** 是否显示红点 */
        public get checkShowRed() {
            for (let i in this._tList) {
                let index = Number(i);
                let mailItem = this._tList[i];
                if (!mailItem.bAward && mailItem.tAffixData && mailItem.tAffixData.length > 0) {
                    return true;
                }
                if (mailItem.isNew) {
                    return true;
                }
            }
            return false;
        }
        // 获取所有可以领取附件的邮件ID集合
        public get canAwardId(): Array<any> {
            let mailIdArr: Array<any> = [];
            for (let i in this._tList) {
                let index = Number(i);
                // 有附件并且没有被领取
                for (var key in this._tList[index].tAffix) {
                    if (this._tList[index].tAffix[key]) {
                        if (this._tList[index].tAffixData.length && !this._tList[index].bAward && mailIdArr.indexOf(this._tList[index].instId) < 0) {
                            mailIdArr.push(this._tList[index].instId);
                        }
                    }
                }
            }
            return mailIdArr;
        }

        // 获取所有可以被删除的邮件ID集合
        public get canDelId(): Array<any> {
            // 无附件、已领取过附件、
            let mailIdArr: Array<any> = [];
            for (let i in this._tList) {
                let index = Number(i);
                if (!this._tList[index].tAffixData.length || this._tList[index].bAward || this._tList[index].lastTime < 0) {
                    mailIdArr.push(this._tList[index].instId);
                }
            }
            return mailIdArr;
        }
        // 通过ID获取到邮件数据
        public GetMailById(mailId: any): MailItem {
            let mailData: MailItem;
            for (let i in this._tList) {
                let index = Number(i);
                if (this._tList[index].instId == mailId) {
                    mailData = this._tList[index];
                    break;
                }
            }
            return mailData;
        }

        // 通过邮件ID获取到该邮件对应的附件物品信息
        public GetAffixById(mailId: any): Object {
            return this.GetMailById(mailId).tAffix;
        }

    }
}