/*
* 主玩家类;
*/
var H52D_Framework;
(function (H52D_Framework) {
    var MasterPlayer = /** @class */ (function () {
        function MasterPlayer() {
            /**是否在游戏中 */
            this._bInGame = false;
            /**是否是新玩家 */
            this._bNewbie = false;
            this._fundBuy = false;
            /** 特权免费使用次数 */
            this.freeUseNum = {};
            /** 特权免费使用总次数 */
            this._FreeSum = 0;
            /**事件属性*/
            this.eventPro = {};
            /**事件每日属性*/
            this.eventDayPro = {};
            this._cacheValue = {};
            this._dayInviteNum = 0;
            this.Damage = 0;
            this._player = new H52D_Framework.Player();
            this._player.isMaster = true;
        }
        Object.defineProperty(MasterPlayer, "Instance", {
            get: function () {
                if (MasterPlayer._inst == null)
                    MasterPlayer._inst = new MasterPlayer();
                return MasterPlayer._inst;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MasterPlayer.prototype, "bInGame", {
            get: function () {
                return this._bInGame;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MasterPlayer.prototype, "player", {
            get: function () {
                return this._player;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MasterPlayer.prototype, "days", {
            get: function () {
                return this._days;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MasterPlayer.prototype, "bNewbie", {
            get: function () {
                return this._bNewbie;
            },
            set: function (value) {
                this._bNewbie = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MasterPlayer.prototype, "fundBuy", {
            get: function () {
                return this._fundBuy;
            },
            set: function (value) {
                this._fundBuy = value;
            },
            enumerable: true,
            configurable: true
        });
        MasterPlayer.prototype.getFundReceive = function (id) {
            return this.fundReceive[id] || 0;
        };
        MasterPlayer.prototype.setFundReceive = function (id, value) {
            this.fundReceive[id] = value;
        };
        /** 特权免费使用次数 */
        MasterPlayer.prototype.getFreeUseNum = function (nPrivilege) {
            return this.freeUseNum[nPrivilege] || 0;
        };
        /** 特权免费使用次数 */
        MasterPlayer.prototype.setFreeUseNum = function (nPrivilege, nFreeUseNum) {
            this.freeUseNum[nPrivilege] = nFreeUseNum;
        };
        /** 获取已拥有特权免费使用总次数 */
        MasterPlayer.prototype.getFreeUseSum = function () {
            var NumSum = 0;
            for (var nPrivilege in this.freeUseNum) {
                NumSum += this.freeUseNum[nPrivilege];
            }
            return NumSum;
        };
        /** 通过类型获取事件属性 */
        MasterPlayer.prototype.GetEventProByType = function (type) {
            return this.eventPro[type] || 0;
        };
        /** 通过类型获取事件每日属性 */
        MasterPlayer.prototype.GetEventDayProByType = function (type) {
            return this.eventDayPro[type] || 0;
        };
        Object.defineProperty(MasterPlayer.prototype, "cacheValue", {
            get: function () {
                return this._cacheValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MasterPlayer.prototype, "newInviteNum", {
            /** 获取邀请的总人数 */
            get: function () {
                return this.GetEventProByType(EventProEnum.InvitationNum);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MasterPlayer.prototype, "dayInviteNum", {
            get: function () {
                return this._dayInviteNum;
            },
            /** 当日邀请的人数 */
            set: function (num) {
                this._dayInviteNum = num;
            },
            enumerable: true,
            configurable: true
        });
        /** 领取奖励标记 */
        MasterPlayer.prototype.getInvitation = function (key) {
            return this.invitation[key] || 0;
        };
        MasterPlayer.prototype.setInvitation = function (key, value) {
            this.invitation[key] = value;
        };
        Object.defineProperty(MasterPlayer.prototype, "invitadunFlag", {
            get: function () {
                return this._invitadunFlag;
            },
            set: function (value) {
                this._invitadunFlag = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MasterPlayer.prototype, "invitaVipFlag", {
            get: function () {
                return this._invitaVipFlag;
            },
            set: function (value) {
                this._invitaVipFlag = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MasterPlayer.prototype, "invitaVipTimes", {
            get: function () {
                return this._invitaVipTimes;
            },
            set: function (value) {
                this._invitaVipTimes = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 发送累计数据
         * @param pro:EventProEnum
         * @param nun 数量
         */
        MasterPlayer.prototype.ReqOnEvent = function (pro, nun) {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqOnEvent", pro, nun);
        };
        MasterPlayer.prototype.Initialize = function () {
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ServerTime", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_SyncPlayerInfoMsg", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_EnterMap", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_OnLevelUp", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_OnChangeExp", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_AddMP", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_AddItemVIP", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_SendInitEventMsg', this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_SendEventMsg', this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_OnlineSyncEnd", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ClientInfo", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_Whosyourdaddy", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_DayRefreshMsg", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ChargeRes", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_VipInfo", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_AddVip", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_UpdatePrivilege", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_OnInvite", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_LadderScore", this);
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_Advertising", this);
            var tcfg = H52D_Framework.GameParamConfig.FreePrivilegeStorageMaxNum;
            for (var key in tcfg) {
                this._FreeSum += tcfg[key];
            }
        };
        /** 更新当天邀请的人数 */
        MasterPlayer.prototype.C_OnInvite = function (buf) {
            H52D_Framework.Event.DispatchEvent("InviteTodayNum");
            this.dayInviteNum = buf[0];
            var sNew = buf[1];
            var sName = buf[2];
            if (sName != null && sName != "") {
                if (sNew) {
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips(30054, sName);
                }
                else {
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips(30055, sName);
                }
            }
        };
        MasterPlayer.prototype.C_Whosyourdaddy = function () {
            this.Damage = 999999999;
        };
        /** 上线同步VIP */
        MasterPlayer.prototype.C_VipInfo = function (buf) {
            var nExpirationTime = buf[0];
            this._player.ExpirationTime = nExpirationTime;
            if (this._player.IsVip) {
                this._player.vo.setVip();
            }
        };
        /** 添加VIP */
        MasterPlayer.prototype.C_AddVip = function (buf) {
            var nExpirationTime = buf[0];
            this._player.ExpirationTime = nExpirationTime;
            this._player.vo.setVip();
        };
        /** 特权次数更新 */
        MasterPlayer.prototype.C_UpdatePrivilege = function (buf) {
            var nPrivilege = buf[0];
            var nCount = buf[1];
            this.freeUseNum[nPrivilege] = nCount;
        };
        MasterPlayer.prototype.C_LadderScore = function (buf) {
            MasterPlayer.Instance.player.Fraction = buf[0];
            MasterPlayer.Instance.player.LadderWinnNum = buf[1];
        };
        /** 充值成功通知 */
        MasterPlayer.prototype.C_ChargeRes = function (buf) {
            var nGold = buf[0];
            var nMoney = buf[1];
            H52D_Framework.TipsLogic.Instance.OpenSystemTips("充值" + nGold + "钻石成功！");
        };
        /**0:00服务器通知 */
        MasterPlayer.prototype.C_DayRefreshMsg = function () {
            this.eventDayPro = {};
            H52D_Framework.AdvertisingManager.Instance.tAdvertisingTimes = {};
            this._player.Donatetimes = {};
            H52D_Framework.AchievenManger.Instance.LoadDayMission();
            H52D_Framework.SignInLogic.Instance.EmptyData();
            H52D_Framework.ViewUILogic.Instance.OnDay();
            H52D_Framework.MemoryLogic.Instance.OnDay();
            H52D_Framework.Event.DispatchEvent("UpdateBtnList");
        };
        /** 玩家等级 */
        MasterPlayer.prototype.C_OnLevelUp = function (buf) {
            MasterPlayer.Instance.player.vo.UpdateBase();
            this._player.Level = buf[0];
            H52D_Framework.Event.DispatchEvent("RefreshList");
            H52D_Framework.Event.DispatchEvent("Role_lvup");
            //新手引导
            H52D_Framework.Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_6);
            H52D_Framework.Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_9);
        };
        /** 玩家经验 */
        MasterPlayer.prototype.C_OnChangeExp = function (buf) {
            this._player.Exp = buf[0];
            H52D_Framework.Event.DispatchEvent("RefreshList");
        };
        /** 所有同步结束 */
        MasterPlayer.prototype.C_OnlineSyncEnd = function () {
            H52D_Framework.BCampManager.Instance.initData();
            H52D_Framework.AttributePassiveManager.Instance.Init();
            /** 执行心跳函数 */
            H52D_Framework.ViewUILogic.Instance.FrameHander();
        };
        /** 玩家添加MP */
        MasterPlayer.prototype.C_AddMP = function (buf) {
            var nMP = buf[0];
            H52D_Framework.Event.DispatchEvent("MpValueChange", [nMP]);
            var bAdd = nMP >= 0;
            H52D_Framework.TipsLogic.Instance.OpenSystemTips(H52D_Framework.ViewUILogic.Instance.mpValueFull ?
                "法力池已满" : "法力值" + (bAdd ? " + " : " ") + nMP);
        };
        /** 玩家添加MP */
        MasterPlayer.prototype.C_AddItemVIP = function (buf) {
            var nAddTime = buf[0];
            if (nAddTime == -1) {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("获取永久VIP！");
            }
            else {
                H52D_Framework.TipsLogic.Instance.OpenSystemTips("获取VIP" + Math.floor(nAddTime / 3600) + "小时！");
            }
        };
        /** 玩家上线事件消息 */
        MasterPlayer.prototype.C_SendInitEventMsg = function (buf) {
            this.eventPro = buf[0];
            this.eventDayPro = buf[1];
            /**成就系统 */
            H52D_Framework.AchievenManger.Instance.Initialize();
        };
        /** 玩家事件消息 */
        MasterPlayer.prototype.C_SendEventMsg = function (buf) {
            var data = buf[0];
            var dataDay = buf[1];
            for (var eventKey in data) {
                this.eventPro[eventKey] = data[eventKey];
            }
            for (var eventKey in dataDay) {
                this.eventDayPro[eventKey] = dataDay[eventKey];
            }
        };
        /**服务器当前时间 */
        MasterPlayer.prototype.C_ServerTime = function (buf) {
            H52D_Framework.Time.SetServerTime(buf[0]);
            this._days = 10;
        };
        /**同步主玩家基本数据 */
        MasterPlayer.prototype.C_SyncPlayerInfoMsg = function (buf) {
            var info = buf[0];
            this._player.ID = info[1]; //角色ID
            this._player.Name = info[2]; //玩家名字
            this._player.CustomsId = info[3]; //当前关卡
            this._player.WaveOrder = info[4]; //当前波次
            this._player.HeroWarList = info[5]; //阵容信息
            this._player.Level = info[6]; //角色等级
            this._player.Exp = info[7]; //角色经验
            this._player.CustomsMode = info[8]; //关卡模式
            this._player.Mp = info[9]; //法力值
            this._player.CampID = info[10]; //阵营ID
            this._player.HeadId = info[11]; //头像ID
            this._player.Donatetimes = info[12]; //捐献次数
            H52D_Framework.ShopLogic.Instance.tChargeTimes = info[13];
            H52D_Framework.ShopLogic.Instance.MoneyBack = info[14];
            H52D_Framework.KickingLogic.Instance.ChallengeNum = info[15]; //王者约战挑战次数
            this.freeUseNum = info[17]; //免费特权次数
            this.invitation = info[18]; //领取奖励标记
            this.invitadunFlag = info[19]; //跳关标记
            this.invitaVipFlag = info[20]; //领取vip标记
            this.invitaVipTimes = info[21]; //领取vip次数
            this.bNewbie = info[23] || false; //是否是新玩家
            this.fundBuy = info[24] == 1; //购买基金标记0/1
            this.fundReceive = info[25]; //领取基金标记{"1":0/1}
            H52D_Framework.DiscountManager.Instance.tPrivilegeTims = info[26]; //特权打折
            H52D_Framework.DiscountManager.Instance.tBoxTims = info[27]; //宝箱打折
            this._player.Hero_pecktime = info[28]; //英雄礼包的倒计时
            H52D_Framework.ShopLogic.Instance.BuyTimes = info[29];
            H52D_Framework.MemoryLogic.Instance.RecoverTime = info[30]; //下次恢复体力时间
            H52D_Framework.MemoryLogic.Instance.Power = info[31]; //体力
            H52D_Framework.MemoryLogic.Instance.BuyPowerTimes = info[32]; //购买体力次数
            H52D_Framework.MemoryLogic.Instance.copyBattleArray = info[33]; //材料副本挑战次数组
            H52D_Framework.AdvertisingManager.Instance.tAdvertisingTimes = info[34]; //看广告次数
            H52D_Framework.HeroManager.Instance.Peck_Ad = info[35];
            H52D_Framework.MainActionLogic.Instance.hasMatch = Boolean(info[36]); //PK联赛是否已报名
            H52D_Framework.LoginLogic.Instance.profid = Number(info[37]); //角色Id
            H52D_Framework.ShopLogic.Instance.FreedrawTimes = Number(info[38]);
            H52D_Framework.ShopLogic.Instance.AdCoolTime = Number(info[39]);
            H52D_Framework.HeroManager.Instance.PeckIcon = this.ShowBool();
            H52D_Framework.HeroManager.Instance.Buyed_peck();
            this._player.vo = new H52D_Framework.PlayerVo(); //战斗数据        
            if (!H52D_Framework.GetLocalStorage("sound", true)) {
                H52D_Framework.SetLocalStorage("sound", "1", true);
                H52D_Framework.SetLocalStorage("music", "1", true);
            }
            this.player.Sound = !!Number(H52D_Framework.GetLocalStorage("sound", true));
            this.player.Music = !!Number(H52D_Framework.GetLocalStorage("music", true));
            // 同步完阵容信息后刷新对话列表
            H52D_Framework.BubbleManager.Instance.UpdateAllBubbleID();
        };
        /** 缓存数据同步 */
        MasterPlayer.prototype.C_ClientInfo = function (buff) {
            for (var i = 0; i < buff.length; i++) {
                for (var key in buff[i]) {
                    this._cacheValue[key] = buff[i][key];
                }
            }
        };
        /** 上线同步玩家广告奖励 */
        MasterPlayer.prototype.C_Advertising = function (data) {
            H52D_Framework.ViewUILogic.Instance.adTimeStamp = Number(data[0]);
        };
        /**英雄进阶LOGO的显示隐藏 */
        MasterPlayer.prototype.ShowBool = function () {
            var times = 0;
            for (var key in this._player.Hero_pecktime) {
                var nID = Number(key);
                var peck_cfg = H52D_Framework.HeroPeckConfig[nID];
                var Buy_times = H52D_Framework.ShopLogic.Instance.GetBuyTimes(4, peck_cfg.shopId);
                var bool_m = H52D_Framework.ShopLogic.Instance.isFristCharge(5, peck_cfg.chargeId);
                var bool_d = Buy_times == 0 ? true : false;
                if (H52D_Framework.IsAD()) {
                    if (Buy_times >= 2) {
                        H52D_Framework.HeroManager.Instance.PeckBuyed.push(nID);
                    }
                    if (bool_d) {
                        times++;
                        break;
                    }
                }
                else {
                    if (bool_d || bool_m) {
                        times++;
                        break;
                    }
                    else {
                        H52D_Framework.HeroManager.Instance.PeckBuyed.push(nID);
                    }
                }
            }
            var bool = times == 0 ? false : true;
            return bool;
        };
        /**主玩家进入地图 */
        MasterPlayer.prototype.C_EnterMap = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("CreateView", [H52D_Framework.ViewDownRoot]);
            H52D_Framework.UIManager.Instance.DestroyUI("LoginView", [H52D_Framework.ViewDownRoot]);
            //进入游戏状态
            this._bInGame = true;
            //开启断线重连
            H52D_Framework.RemoteCall.Instance.OpenReConnect();
            if (this.bNewbie == false) {
                if (!H52D_Framework.UIManager.Instance.IsHave("MainView", H52D_Framework.ViewDownRoot)) {
                    //加载主界面
                    H52D_Framework.UIManager.Instance.CreateUI("MainView", [H52D_Framework.ViewDownRoot], Laya.Handler.create(this, function () {
                        //加载关卡场景
                        H52D_Framework.CustomsManager.Instance.Initialize();
                    }));
                }
            }
        };
        return MasterPlayer;
    }());
    H52D_Framework.MasterPlayer = MasterPlayer;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MasterPlayer.js.map