/*
* 邮件模板类;
*/
var H52D_Framework;
(function (H52D_Framework) {
    var MailItem = /** @class */ (function () {
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
        function MailItem(instId, mailType, dueTime, tAffix, isNew, bAward, contentInfo) {
            this.rankTypeName = {
                1: "战力榜",
                2: "等级榜",
                3: "杀戮榜"
            };
            this._instId = instId;
            this._mailType = mailType;
            this._tAffix = tAffix ? tAffix : {};
            this._isNew = (isNew == 0);
            this._bAward = (bAward == 1);
            this._lastTime = dueTime - new Date().getTime() / 1000;
            this._dueTime = dueTime;
            this._contentInfo = this.AnaContInfo(contentInfo);
            this._keepTime = H52D_Framework.ConfigSystem.Inst.GetGameParmas('MailStorageMaxTime') * 86400;
            this._reciveTime = dueTime - this._keepTime;
        }
        // 解析附件文本内容
        MailItem.prototype.AnaContInfo = function (contInfo) {
            if (!contInfo) {
                return [];
            }
            return contInfo;
        };
        // 时间日期格式化
        MailItem.prototype.DateFormate = function (dd, fmt) {
            var date = new Date(dd);
            var o = {
                'M+': date.getMonth() + 1,
                'D+': date.getDate(),
                'h+': date.getHours(),
                'm+': date.getMinutes(),
                's+': date.getSeconds()
            };
            if (/(Y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(('' + o[k]).length)));
                }
            }
            return fmt;
        };
        Object.defineProperty(MailItem.prototype, "dueTime", {
            // 获取邮件到期时间
            get: function () {
                return this._dueTime;
            },
            // 设置邮件到期时间
            set: function (val) {
                this._dueTime = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailItem.prototype, "instId", {
            // 获取到邮件ID
            get: function () {
                return this._instId;
            },
            // 设置邮件ID
            set: function (val) {
                this._instId = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailItem.prototype, "mailType", {
            // 获取到邮件类型，根据此字段加载邮件标题等
            get: function () {
                return this._mailType;
            },
            // 设置邮件type
            set: function (val) {
                this._mailType = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailItem.prototype, "lastTime", {
            // 获取邮件剩余保存时间秒数
            get: function () {
                return this._lastTime;
            },
            // 设置保存时间
            set: function (val) {
                this._lastTime = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailItem.prototype, "mailTitle", {
            // 获取到邮件标题
            get: function () {
                var mailTitle = '';
                mailTitle = H52D_Framework.ConfigSystem.Inst.GetMailTitle(this._mailType) || '这个类型的邮件标题我还没配' + this._mailType;
                var strCont = mailTitle;
                var text;
                if (this._mailType == 13) {
                    if (this._contentInfo[1] == H52D_Framework.MacthType.eLeagueBet16) {
                        text = "16";
                    }
                    else if (this._contentInfo[1] == H52D_Framework.MacthType.eLeagueBet8) {
                        text = "8";
                    }
                    else if (this._contentInfo[1] == H52D_Framework.MacthType.eLeagueBet4) {
                        text = "4";
                    }
                    else if (this._contentInfo[1] == H52D_Framework.MacthType.eLeagueBet2) {
                        text = "2";
                    }
                    strCont = H52D_Framework.Format(mailTitle, text);
                }
                mailTitle = strCont;
                return mailTitle;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailItem.prototype, "srcContent", {
            // 获取邮件正文列表(Array)
            get: function () {
                return this._contentInfo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailItem.prototype, "mailContent", {
            // TODO 获取到邮件正文字符串(string)
            get: function () {
                if (!this._strContentInfo) {
                    var str = H52D_Framework.ConfigSystem.Inst.GetMailContent(this._mailType) || '这个类型的邮件内容我也么有配' + this._mailType;
                    var strCont = str;
                    var TypeStr = "";
                    if (this._mailType == 1) {
                        if (this._contentInfo[1] == 1) {
                            strCont = H52D_Framework.Format(str, "赞同");
                        }
                        else if (this._contentInfo[1] == 2) {
                            strCont = H52D_Framework.Format(str, "反对");
                        }
                    }
                    else if (this._mailType == 3) {
                        var presId = Number(this._contentInfo[3]);
                        var num = Number(this._contentInfo[4]) - H52D_Framework.PresentConfig[presId].charm;
                        var original = num + "";
                        strCont = H52D_Framework.Format(str, this._contentInfo[1], original, this._contentInfo[4]);
                    }
                    else if (this._mailType == 11) {
                        strCont = H52D_Framework.Format(str, this._contentInfo[1]);
                    }
                    else if (this._mailType == 12) { //PK联赛海选邮件
                        strCont = H52D_Framework.Format(str, this._contentInfo[1], this._contentInfo[2]);
                    }
                    else if (this._mailType == 13) { //2-16强决赛邮件
                        var nMyResult = Number(this._contentInfo[2]);
                        var tBetResult = this._contentInfo[3];
                        var text_Result = "未参加";
                        var text_MyBet = "";
                        if (nMyResult == 1) {
                            text_Result = "胜利";
                        }
                        else if (nMyResult == 2) {
                            text_Result = "失败";
                        }
                        strCont = H52D_Framework.Format(str, text_Result);
                        for (var index in tBetResult) {
                            var result = tBetResult[index][1] + (tBetResult[index][3] == 0 ? "败" : "胜");
                            var nOdds = tBetResult[index][2] / 100;
                            text_MyBet += H52D_Framework.GetInfoAttr.Instance.GetSystemText(5320, result, nOdds, tBetResult[index][3]);
                        }
                        if (H52D_Framework.GetTabLength(tBetResult) == 0) {
                            text_MyBet = "  无";
                        }
                        strCont = strCont + text_MyBet;
                    }
                    else if (this._mailType == 14) { //PK联赛冠军决赛
                        var tBetResult = this._contentInfo[3];
                        var text_MyBet = "";
                        var sOneName = this._contentInfo[4];
                        strCont = H52D_Framework.Format(str, sOneName);
                        var result = "";
                        var nOdds = void 0;
                        var nAward = void 0;
                        //其实就一条 冠军特殊
                        for (var index in tBetResult) {
                            result = tBetResult[index][1] + (tBetResult[index][3] == 0 ? "败" : "胜");
                            nOdds = tBetResult[index][2] / 100;
                            text_MyBet += H52D_Framework.GetInfoAttr.Instance.GetSystemText(5320, result, nOdds, tBetResult[index][3]);
                        }
                        if (H52D_Framework.GetTabLength(tBetResult) == 0) {
                            text_MyBet = "  无";
                        }
                        strCont = strCont + text_MyBet;
                    }
                    this._strContentInfo = strCont;
                }
                return this._strContentInfo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailItem.prototype, "keepTime", {
            // 获取到邮件保存时间
            get: function () {
                return this._keepTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailItem.prototype, "tAffixData", {
            /**
             * @_tAffix [配置ID， 数量]
             * {"1": {"1": "130070", "2": 1, s"3": 1, "4": 0, "5": 0}, "2": {"1": "130070", "2": 4, "3": 1, "4": 0, "5": 0}}
             */
            // 获取附件奖励数据
            get: function () {
                var tAffixData = [];
                for (var i in this._tAffix) {
                    var key = Number(i);
                    var data = void 0;
                    var id = this._tAffix[key][2];
                    var type = this._tAffix[key][1];
                    if (!this._tAffix[key][2]) {
                        return;
                    }
                    data = new H52D_Framework.ItemData(id, type);
                    data.num = this._tAffix[key][3];
                    tAffixData.push(data);
                }
                return tAffixData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailItem.prototype, "tAffix", {
            // 获取附件信息
            get: function () {
                return this._tAffix;
            },
            // 设置附件信息
            set: function (val) {
                this._tAffix = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailItem.prototype, "isNew", {
            // 获取到新邮件标记
            get: function () {
                return this._isNew;
            },
            // 设置新邮件标记
            set: function (val) {
                this._isNew = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailItem.prototype, "bAward", {
            // 获取到邮件领取状态
            get: function () {
                return this._bAward;
            },
            // 设置邮件领取状态
            set: function (val) {
                this._bAward = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailItem.prototype, "contentInfo", {
            // 设置正文文本
            set: function (val) {
                this._contentInfo = this.AnaContInfo(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailItem.prototype, "reciveTime", {
            // 获取接收邮件的时间
            get: function () {
                return this._reciveTime;
            },
            // 设置接收邮件的时间
            set: function (val) {
                this._reciveTime = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailItem.prototype, "reciveTimeToStr", {
            // 获取接收邮件时间 转换格式 2018-03-20 10:20:05
            get: function () {
                return this.DateFormate(this._reciveTime * 1000, "YYYY-MM-DD ");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MailItem.prototype, "getAffixContent", {
            //显示邮件正文前15个字
            get: function () {
                var content = this.mailContent.split("<br/>")[0];
                content = content + "," + this.mailContent.split("<br/>")[1];
                var rtnContent = '';
                if (content && content != '') {
                    rtnContent = content.substring(0, 15) + '.........';
                }
                return rtnContent;
            },
            enumerable: true,
            configurable: true
        });
        // 读取邮件操作
        MailItem.prototype.ReadMail = function () {
            if (this._isNew) {
                return true;
            }
            else {
                return false;
            }
        };
        return MailItem;
    }());
    H52D_Framework.MailItem = MailItem;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MailItem.js.map