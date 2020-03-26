/*
* 邮件系统数据类;
*/
var H52D_Framework;
(function (H52D_Framework) {
    var MailLogic = /** @class */ (function () {
        function MailLogic() {
            // 所有邮件数据
            this._tList = [];
            // 保存排序之后的邮件信息
            this._tSortList = [];
            // 正在领取的邮件ID
            this._sendingMailId = [];
            // 是否已经打开
            this._hadOpen = false;
            this._attachAward = [];
            this._worldMailAccessoryTime = 0;
            /**
             * 领取邮件附件的回调
             * @param mailId 邮件ID
             * @param bSucess 是否领取成功
             */
            this._Award = {};
            this._listData = [];
        }
        Object.defineProperty(MailLogic, "Inst", {
            get: function () {
                if (MailLogic._inst == null)
                    MailLogic._inst = new MailLogic();
                return MailLogic._inst;
            },
            enumerable: true,
            configurable: true
        });
        MailLogic.prototype.Initialize = function () {
            // 开始同步玩家的个人邮件信息
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_MailListStar', this);
            // 同步玩家的个人邮件信息
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_MailList', this);
            // 同步玩家个人邮件信息结束
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_MailListEnd', this);
            // 新增个人邮件
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_AddMail', this);
            // 删除邮件结果消息
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_DelMailsRes', this);
            // 服务器返回读取或领取的结果
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_MailState', this);
            // 邮件附件领取结果
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_GetMailAffixRes', this);
            // 同步玩家的运营邮件信息
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_WorldMailList', this);
            // 同步玩家运营邮件信息结束
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_WorldMailListEnd', this);
            // 新增运营邮件
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_AddWorldMail', this);
            this._gameParam = H52D_Framework.GameParamConfig;
            this._sysPromptCfg = H52D_Framework.SysPromptConfig;
            this._worldMailAccessoryTime = this._gameParam['MailStorageMaxTime'] * 86400;
            // 登录时如果有未读邮件
            if (MailLogic.Inst.haveNotReadMail) {
                // 注册消息通知主界面入口提示特效
                H52D_Framework.Event.DispatchEvent('UpdateEntrance');
            }
        };
        // 私有方法begin。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
        // 邮件排序
        MailLogic.prototype.sortMailList = function () {
            // 排序前先清空
            this._tSortList = [];
            for (var i in this._tList) {
                var index = Number(i);
                var data = this._tList[index];
                this._tSortList.push(data);
            }
            // 对邮件根据获取时间进行排序
            function sortMail(a, b) {
                return b.isNew - a.isNew;
            }
            this._tSortList.sort(sortMail);
            // 刷新界面消息 
            H52D_Framework.Event.DispatchEvent('UpdateMailView');
            H52D_Framework.Event.DispatchEvent('UpdateMailList');
        };
        // 接收服务器发送到客户端的消息begin。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
        // 同步个人邮件信息
        MailLogic.prototype.C_MailListStar = function () {
            this._tList = [];
            this._tSortList = [];
        };
        // 同步个人邮件信息
        MailLogic.prototype.C_MailList = function (buf) {
            for (var i in buf[0]) {
                var key = Number(i);
                var data = new H52D_Framework.MailItem(buf[0][key][1], buf[0][key][2], buf[0][key][3], buf[0][key][4], buf[0][key][5], buf[0][key][6], buf[0][key][7]);
                this._tList.push(data);
            }
        };
        // 同步个人邮件信息结束
        MailLogic.prototype.C_MailListEnd = function (buf) {
            // 接受邮件结束，对邮件进行排序
            for (var i in buf[0]) {
                var key = Number(i);
                var data = new H52D_Framework.MailItem(buf[0][key][1], buf[0][key][2], buf[0][key][3], buf[0][key][4], buf[0][key][5], buf[0][key][6], buf[0][key][7]);
                this._tList.push(data);
            }
            this.sortMailList();
        };
        // 同步运营邮件信息
        MailLogic.prototype.C_WorldMailList = function (buf) {
            for (var i in buf[0]) {
                var key = Number(i);
                H52D_Framework.ConfigSystem.Inst.SetNewMail(key, buf[0][key][1], buf[0][key][2]);
                var data = new H52D_Framework.MailItem(key, key + 10000, buf[0][key][3], buf[0][key][4], buf[0][key][5], buf[0][key][6]);
                var isID = false;
                for (var index = 0; index < this._tList.length; index++) {
                    if (data.instId == this._tList[index].instId) {
                        isID = true;
                        break;
                    }
                }
                if (!isID) {
                    this._tList.push(data);
                }
            }
        };
        // 同步运营邮件信息结束
        MailLogic.prototype.C_WorldMailListEnd = function (buf) {
            // 接受运营邮件结束，对邮件进行排序
            for (var i in buf[0]) {
                var key = Number(i);
                H52D_Framework.ConfigSystem.Inst.SetNewMail(key, buf[0][key][1], buf[0][key][2]);
                var data = new H52D_Framework.MailItem(key, key + 10000, buf[0][key][3], buf[0][key][4], buf[0][key][5], buf[0][key][6]);
                var isID = false;
                for (var index = 0; index < this._tList.length; index++) {
                    if (data.instId == this._tList[index].instId) {
                        isID = true;
                        break;
                    }
                }
                if (!isID) {
                    this._tList.push(data);
                }
            }
            this.sortMailList();
        };
        // 新增运营邮件
        MailLogic.prototype.C_AddWorldMail = function (buf) {
            var mailId = buf[0][1];
            var mailAffix = buf[0][4];
            var content = buf[0][3];
            var title = buf[0][2];
            // 向邮件列表中添加一条邮件信息，然后重新排序
            H52D_Framework.ConfigSystem.Inst.SetNewMail(Number(mailId), title, content);
            var mailData = new H52D_Framework.MailItem();
            mailData.instId = mailId;
            mailData.mailType = Number(mailId) + 10000;
            mailData.reciveTime = (new Date().getTime() / 1000);
            mailData.tAffix = Array(mailAffix).length ? mailAffix : [];
            mailData.lastTime = this._worldMailAccessoryTime;
            mailData.dueTime = (new Date().getTime() / 1000) + this._worldMailAccessoryTime;
            mailData.isNew = true;
            mailData.bAward = false;
            var isID = false;
            for (var index = 0; index < this._tList.length; index++) {
                if (mailData.instId == this._tList[index].instId) {
                    isID = true;
                    break;
                }
            }
            if (!isID) {
                this._tList.push(mailData);
            }
            this.sortMailList();
            // 刷新界面消息
            H52D_Framework.Event.DispatchEvent('UpdateMailView');
            // 新邮件提示,刷新入口图标
            H52D_Framework.Event.DispatchEvent('UpdateEntrance');
        };
        // 新增个人邮件
        MailLogic.prototype.C_AddMail = function (buf) {
            // 向邮件列表中添加一条邮件信息，然后重新排序
            var mailData = new H52D_Framework.MailItem();
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
            H52D_Framework.Event.DispatchEvent('UpdateMailView');
            // 新邮件提示,刷新入口图标
            H52D_Framework.Event.DispatchEvent('UpdateEntrance');
            H52D_Framework.Event.DispatchEvent('UpdateMailList');
        };
        /**
         * 删除邮件的消息
         * @param buf 删除的邮件的ID数组
         */
        MailLogic.prototype.C_DelMailsRes = function (buf) {
            // 删除对应的邮件，重新排序，注册消息刷新UI
            for (var i in buf[0]) {
                for (var k in this._tList) {
                    var index = Number(k);
                    if (this._tList[index].instId == buf[0][i]) {
                        this._tList.splice(index, 1);
                        break;
                    }
                }
            }
            this.sortMailList();
            // 刷新界面消息
            H52D_Framework.Event.DispatchEvent('UpdateMailView');
            // 关闭打开的邮件详情页
            H52D_Framework.Event.DispatchEvent('CloseMailTips');
            H52D_Framework.Event.DispatchEvent('UpdateMailList');
        };
        /**
         * 读取或者领取邮件的消息
         * @param para1 mailId
         * @param parm2 type(为1时已读邮件，为2时已经取附件)
         */
        MailLogic.prototype.C_MailState = function (buf) {
            var para1 = buf[0];
            var parm2 = buf[1];
            var mailData;
            for (var i in this._tList) {
                var index = Number(i);
                if (this._tList[i].instId == para1) {
                    if (parm2 == 0) {
                    }
                    else if (parm2 == 1) {
                        // 读取邮件
                        this._tList[i].isNew = false;
                        // 更新列表数据源
                        this.sortMailList();
                    }
                    else if (parm2 == 2) {
                        // 领取附件
                        this._tList[i].isNew = false;
                        this._tList[i].bAward = true;
                        // 更新列表数据源
                        this.sortMailList();
                        // 刷新邮件tips界面
                        H52D_Framework.Event.DispatchEvent('UpdateMailTipView', [this._tList[i]]);
                    }
                    mailData = this._tList[i];
                    break;
                }
            }
            // 刷新UI界面
            H52D_Framework.Event.DispatchEvent('UpdateMailView');
            H52D_Framework.Event.DispatchEvent('UpdateMailList');
        };
        MailLogic.prototype.C_GetMailAffixRes = function (buf) {
            var _this = this;
            var mailId = buf[0];
            var _Award = buf[1];
            var isExpire = buf[2];
            var bSucess = [];
            for (var i in this._tList) {
                var index = Number(i);
                if (this._tList[i].instId == mailId) {
                    // 更新UI界面  
                    this._tList[i].bAward = true;
                }
            }
            //是否是一键领取
            if (!isExpire) {
                for (var type in _Award) {
                    var itemType = Number(type);
                    var data = _Award[itemType];
                    if (this._Award[itemType] == null) {
                        this._Award[itemType] = {};
                    }
                    var tAwardInfo = this._Award[itemType];
                    for (var id in data) {
                        var ID = Number(id);
                        var num = data[id];
                        if (tAwardInfo[ID] == null) {
                            tAwardInfo[ID] = num;
                        }
                        else {
                            tAwardInfo[ID] += num;
                        }
                    }
                }
                H52D_Framework.OneTimer(500, function () {
                    H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(_this._Award);
                    _this._Award = {};
                }, "C_GetMailAffixRes");
            }
            H52D_Framework.Event.DispatchEvent('UpdateMailView');
            H52D_Framework.Event.DispatchEvent('UpdateMailList');
        };
        // 读取邮件请求,个人和运营共用
        MailLogic.prototype.ReadMail = function (mailId, mailTypa) {
            if (mailTypa < 10000) {
                // 个人邮件
                H52D_Framework.RemoteCall.Instance.Send("K_ReadPersonalMail", mailId);
            }
            else {
                // 运营邮件
                H52D_Framework.RemoteCall.Instance.Send("K_ReadWorldMail", mailId.toString());
            }
        };
        // 领取邮件附件请求，个人和运营共用
        MailLogic.prototype.GetMailAffix = function (mailId, mailType) {
            if (mailType < 10000) {
                // 个人邮件
                H52D_Framework.RemoteCall.Instance.Send("K_GetMailAffix", mailId);
            }
            else {
                // 运营邮件
                H52D_Framework.RemoteCall.Instance.Send("K_GetWorldMailAffix", mailId.toString());
            }
        };
        // 删除邮件请求
        MailLogic.prototype.DelMailsReq = function (delList) {
            // 区分个人邮件和运营邮件
            var delList0 = []; //个人邮件
            var delList1 = []; //运营邮件
            for (var i = 0; i < delList.length; i++) {
                if (MailLogic.Inst.GetMailById(delList[i]).mailType < 10000) {
                    delList0.push(delList[i]);
                }
                else {
                    delList1.push(delList[i].toString());
                }
            }
            if (delList0.length > 0) {
                H52D_Framework.RemoteCall.Instance.Send("K_DelMailsReq", delList0);
            }
            if (delList1.length > 0) {
                H52D_Framework.RemoteCall.Instance.Send("K_DelWorldMail", delList1);
            }
        };
        // 单封删除邮件请求
        MailLogic.prototype.DelMailsReq1 = function (delList, mailTypa) {
            if (mailTypa > 10000) {
                H52D_Framework.RemoteCall.Instance.Send("K_DelWorldMail", [delList]);
            }
            else {
                H52D_Framework.RemoteCall.Instance.Send("K_DelMailsReq", [delList]);
            }
        };
        // 一键领取邮件附件并删除
        MailLogic.prototype.GetMailAffixAndDel = function (i_nType, i_tMailId) {
            // i_nType 为1是个人，为2是世界，为3是所有
            H52D_Framework.RemoteCall.Instance.Send("K_GetMailAffixAndDel", i_nType, i_tMailId);
        };
        // 领取邮件附件（从GS返回的消息,个人和运营共用此消息）
        MailLogic.prototype.GetMailAffixRes = function (i_sMailId, i_bSuc) {
            H52D_Framework.RemoteCall.Instance.Send("K_GetMailAffixRes", i_sMailId);
        };
        Object.defineProperty(MailLogic.prototype, "mailList", {
            // 所有的邮件数据
            get: function () {
                return this._tList;
            },
            enumerable: true,
            configurable: true
        });
        MailLogic.prototype.SortData = function () {
            this._listData = [];
            for (var key in this._tSortList) {
                this._listData.push(this._tSortList[key]);
            }
        };
        Object.defineProperty(MailLogic.prototype, "listData", {
            // 排序好的邮件数据
            get: function () {
                return this._listData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailLogic.prototype, "sortList", {
            // 排序好的邮件数据
            get: function () {
                return this._tSortList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailLogic.prototype, "mailCount", {
            // 当前邮件数量
            get: function () {
                return this._tSortList.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailLogic.prototype, "sysPromptCfg", {
            // 获取提示配置信息
            get: function () {
                return this._sysPromptCfg;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailLogic.prototype, "haveNotReadMail", {
            // 获取是否有未读邮件
            get: function () {
                var bool = false;
                for (var i in this._tList) {
                    var index = Number(i);
                    if (this._tList[i].isNew) {
                        bool = true;
                        break;
                    }
                }
                return bool;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailLogic.prototype, "haveNewAffix", {
            // 获取是否有附件未领取
            get: function () {
                var bool = false;
                for (var i in this._tList) {
                    var index = Number(i);
                    if (this._tList[i].tAffixData.length > 0 && !this._tList[i].bAward) {
                        bool = true;
                        break;
                    }
                }
                return bool;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailLogic.prototype, "checkShowRed", {
            /** 是否显示红点 */
            get: function () {
                for (var i in this._tList) {
                    var index = Number(i);
                    var mailItem = this._tList[i];
                    if (!mailItem.bAward && mailItem.tAffixData && mailItem.tAffixData.length > 0) {
                        return true;
                    }
                    if (mailItem.isNew) {
                        return true;
                    }
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailLogic.prototype, "canAwardId", {
            // 获取所有可以领取附件的邮件ID集合
            get: function () {
                var mailIdArr = [];
                for (var i in this._tList) {
                    var index = Number(i);
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
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailLogic.prototype, "canDelId", {
            // 获取所有可以被删除的邮件ID集合
            get: function () {
                // 无附件、已领取过附件、
                var mailIdArr = [];
                for (var i in this._tList) {
                    var index = Number(i);
                    if (!this._tList[index].tAffixData.length || this._tList[index].bAward || this._tList[index].lastTime < 0) {
                        mailIdArr.push(this._tList[index].instId);
                    }
                }
                return mailIdArr;
            },
            enumerable: true,
            configurable: true
        });
        // 通过ID获取到邮件数据
        MailLogic.prototype.GetMailById = function (mailId) {
            var mailData;
            for (var i in this._tList) {
                var index = Number(i);
                if (this._tList[index].instId == mailId) {
                    mailData = this._tList[index];
                    break;
                }
            }
            return mailData;
        };
        // 通过邮件ID获取到该邮件对应的附件物品信息
        MailLogic.prototype.GetAffixById = function (mailId) {
            return this.GetMailById(mailId).tAffix;
        };
        return MailLogic;
    }());
    H52D_Framework.MailLogic = MailLogic;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MailLogic.js.map