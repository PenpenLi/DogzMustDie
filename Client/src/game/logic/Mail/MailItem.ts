/*
* 邮件模板类;
*/
module H52D_Framework {
    export class MailItem {
        private _instId: string;          //邮件实例ID
        private _mailType: number;        //邮件类型
        private _tAffix: Object;     //附件
        private _isNew: boolean;       //新邮件标记
        private _bAward: boolean;      //是否领取
        private _contentInfo: Array<Object>;    //邮件正文信息
        private _strContentInfo: string;        //邮件正文字符串

        // private _mailCfg: any;          //邮件配置表
        // private _stringCfg: any;        //中文对照配置表
        // private _gameParamCfg: any;     //游戏参数表

        // private _mailAccessoryTime: number;     //有附件邮件的保存时间(s)
        // private _mailTextTime: number;      //无附件邮件的保存时间(s)
        private _keepTime: number;       //邮件保存时间(s)
        private _reciveTime: number;     //接收邮件时间(s)
        private _lastTime: number;       //剩余时间(s)
        private _dueTime: number;       //到期时间(s)



        private rankTypeName =
        {
            1: "战力榜",
            2: "等级榜",
            3: "杀戮榜"
        };

        /**
         * 
         * @param instId        邮件ID
         * @param mailType      邮件类型
         * @param dueTime       到期时间
         * @param tAffix        附件
         * @param isNew         新邮件标记 
         * @param bAward        是否被领取
         * @param contentInfo   邮件正文文本
         */
        constructor(instId?: any, mailType?: any, dueTime?: number, tAffix?: any, isNew?: any, bAward?: any, contentInfo?: any) {
            this._instId = instId;
            this._mailType = mailType;
            this._tAffix = tAffix ? tAffix : {};
            this._isNew = (isNew == 0);
            this._bAward = (bAward == 1);
            this._lastTime = dueTime - new Date().getTime() / 1000;
            this._dueTime = dueTime;
            this._contentInfo = this.AnaContInfo(contentInfo);
            this._keepTime = ConfigSystem.Inst.GetGameParmas('MailStorageMaxTime') * 86400;
            this._reciveTime = dueTime - this._keepTime;
        }

        // 解析附件文本内容
        private AnaContInfo(contInfo): Array<Object> {
            if (!contInfo) {
                return [];
            }
            return contInfo;
        }

        // 时间日期格式化
        public DateFormate(dd: number, fmt: any): string {
            let date = new Date(dd);
            let o = {
                'M+': date.getMonth() + 1,
                'D+': date.getDate(),
                'h+': date.getHours(),
                'm+': date.getMinutes(),
                's+': date.getSeconds()
            };

            if (/(Y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
            }

            for (let k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(('' + o[k]).length)));
                }
            }

            return fmt;
        }

        // 获取邮件到期时间
        public get dueTime(): number {
            return this._dueTime;
        }

        // 设置邮件到期时间
        public set dueTime(val: number) {
            this._dueTime = val;
        }
        // 获取到邮件ID
        public get instId(): any {
            return this._instId;
        }
        // 设置邮件ID
        public set instId(val: any) {
            this._instId = val;
        }
        // 获取到邮件类型，根据此字段加载邮件标题等
        public get mailType(): any {
            return this._mailType;
        }
        // 获取邮件剩余保存时间秒数
        public get lastTime(): number {
            return this._lastTime;
        }

        // 设置保存时间
        public set lastTime(val: number) {
            this._lastTime = val;
        }
        // 设置邮件type
        public set mailType(val: any) {
            this._mailType = val;
        }

        // 获取到邮件标题
        public get mailTitle(): string {
            let mailTitle: string = '';
            mailTitle = ConfigSystem.Inst.GetMailTitle(this._mailType) || '这个类型的邮件标题我还没配' + this._mailType;
            let strCont: string = mailTitle
            let text: string
            if (this._mailType == 13) {
                if (this._contentInfo[1] == MacthType.eLeagueBet16) {
                    text = "16"
                } else if (this._contentInfo[1] == MacthType.eLeagueBet8) {
                    text = "8"
                } else if (this._contentInfo[1] == MacthType.eLeagueBet4) {
                    text = "4"
                } else if (this._contentInfo[1] == MacthType.eLeagueBet2) {
                    text = "2"
                }
                strCont = Format(mailTitle, text);
            }
            mailTitle = strCont;
            return mailTitle;
        }

        // 获取邮件正文列表(Array)
        public get srcContent(): Array<Object> {
            return this._contentInfo;
        }

        // TODO 获取到邮件正文字符串(string)
        public get mailContent(): any {
            if (!this._strContentInfo) {
                let str: string = ConfigSystem.Inst.GetMailContent(this._mailType) || '这个类型的邮件内容我也么有配' + this._mailType;
                let strCont: string = str
                let TypeStr: string = "";
                if (this._mailType == 1) {
                    if (this._contentInfo[1] == 1) {
                        strCont = Format(str, "赞同");
                    } else if (this._contentInfo[1] == 2) {
                        strCont = Format(str, "反对");
                    }
                } else if (this._mailType == 3) {
                    let presId: number = Number(this._contentInfo[3]);
                    let num: number = Number(this._contentInfo[4]) - PresentConfig[presId].charm;
                    let original = num + "";
                    strCont = Format(str, this._contentInfo[1], original, this._contentInfo[4]);
                } else if (this._mailType == 11) {
                    strCont = Format(str, this._contentInfo[1]);
                } else if (this._mailType == 12) {//PK联赛海选邮件
                    strCont = Format(str, this._contentInfo[1], this._contentInfo[2]);
                } else if (this._mailType == 13) {//2-16强决赛邮件


                    let nMyResult: number = Number(this._contentInfo[2]);
                    let tBetResult = this._contentInfo[3]
                    let text_Result = "未参加"
                    let text_MyBet: string = ""
                    if (nMyResult == 1) {
                        text_Result = "胜利"
                    } else if (nMyResult == 2) {
                        text_Result = "失败"
                    }

                    strCont = Format(str, text_Result);
                    for (let index in tBetResult) {
                        let result = tBetResult[index][1] + (tBetResult[index][3] == 0 ? "败" : "胜");
                        let nOdds = tBetResult[index][2] / 100
                        text_MyBet += GetInfoAttr.Instance.GetSystemText(5320, result, nOdds, tBetResult[index][3])
                    }
                    if (GetTabLength(tBetResult) == 0) {
                        text_MyBet = "  无"
                    }
                    strCont = strCont + text_MyBet
                } else if (this._mailType == 14) {//PK联赛冠军决赛
                    let tBetResult = this._contentInfo[3]
                    let text_MyBet: string = ""
                    let sOneName = this._contentInfo[4]
                    strCont = Format(str, sOneName);
                    let result: string = ""
                    let nOdds: number
                    let nAward: number
                    //其实就一条 冠军特殊
                    for (let index in tBetResult) {
                        result = tBetResult[index][1] + (tBetResult[index][3] == 0 ? "败" : "胜");
                        nOdds = tBetResult[index][2] / 100
                        text_MyBet += GetInfoAttr.Instance.GetSystemText(5320, result, nOdds, tBetResult[index][3])
                    }
                    if (GetTabLength(tBetResult) == 0) {
                        text_MyBet = "  无"
                    }
                    strCont = strCont + text_MyBet
                }
                this._strContentInfo = strCont;
            }
            return this._strContentInfo
        }

        // 获取到邮件保存时间
        public get keepTime(): number {
            return this._keepTime;
        }

        /**
         * @_tAffix [配置ID， 数量]
         * {"1": {"1": "130070", "2": 1, s"3": 1, "4": 0, "5": 0}, "2": {"1": "130070", "2": 4, "3": 1, "4": 0, "5": 0}}
         */
        // 获取附件奖励数据
        public get tAffixData(): Array<ItemData> {
            let tAffixData: Array<ItemData> = [];
            for (let i in this._tAffix) {
                let key = Number(i);
                let data: ItemData;
                let id = this._tAffix[key][2];
                let type = this._tAffix[key][1];
                if (!this._tAffix[key][2]) {
                    return;
                }

                data = new ItemData(id, type);
                data.num = this._tAffix[key][3];
                tAffixData.push(data);
            }
            return tAffixData;
        }

        // 获取附件信息
        public get tAffix(): Object {
            return this._tAffix;
        }

        // 设置附件信息
        public set tAffix(val: Object) {
            this._tAffix = val;
        }

        // 获取到新邮件标记
        public get isNew(): boolean {
            return this._isNew;
        }

        // 设置新邮件标记
        public set isNew(val: boolean) {
            this._isNew = val;
        }

        // 获取到邮件领取状态
        public get bAward(): boolean {
            return this._bAward;
        }

        // 设置邮件领取状态
        public set bAward(val: boolean) {
            this._bAward = val;
        }

        // 设置正文文本
        public set contentInfo(val: any) {
            this._contentInfo = this.AnaContInfo(val);
        }

        // 获取接收邮件的时间
        public get reciveTime(): number {
            return this._reciveTime;
        }

        // 设置接收邮件的时间
        public set reciveTime(val: number) {
            this._reciveTime = val;
        }

        // 获取接收邮件时间 转换格式 2018-03-20 10:20:05
        public get reciveTimeToStr(): string {
            return this.DateFormate(this._reciveTime * 1000, "YYYY-MM-DD ");
        }

        //显示邮件正文前15个字
        public get getAffixContent(): any {
            let content = this.mailContent.split("<br/>")[0];
            content = content + "," + this.mailContent.split("<br/>")[1];
            let rtnContent = '';

            if (content && content != '') {
                rtnContent = content.substring(0, 15) + '.........';
            }

            return rtnContent;
        }

        // 读取邮件操作
        public ReadMail(): boolean {
            if (this._isNew) {
                return true;
            } else {
                return false;
            }
        }


    }
}