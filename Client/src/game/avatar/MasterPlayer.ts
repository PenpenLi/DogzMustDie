/*
* 主玩家类;
*/
module H52D_Framework {
    export class MasterPlayer {
        private static _inst: MasterPlayer;
        public static get Instance() {
            if (MasterPlayer._inst == null)
                MasterPlayer._inst = new MasterPlayer();
            return MasterPlayer._inst;
        }

        constructor() {
            this._player = new Player();
            this._player.isMaster = true;
        }

        /**是否在游戏中 */
        private _bInGame: boolean = false;
        public get bInGame() {
            return this._bInGame;
        }

        /**主玩家对象 */
        private _player: Player;
        public get player(): Player {
            return this._player;
        }


        /** 开服第几天 */
        private _days: number
        public get days(): number {
            return this._days;
        }

        /**是否是新玩家 */
        private _bNewbie: boolean = false;
        public get bNewbie() {
            return this._bNewbie;
        }
        public set bNewbie(value: boolean) {
            this._bNewbie = value;
        }

        private _fundBuy: boolean = false;
        public get fundBuy() {
            return this._fundBuy;
        }
        public set fundBuy(value: boolean) {
            this._fundBuy = value;
        }

        private fundReceive: Object;
        public getFundReceive(id: number) {
            return this.fundReceive[id] || 0;
        }
        public setFundReceive(id: number, value: number) {
            this.fundReceive[id] = value;
        }

        /** 特权免费使用次数 */
        private freeUseNum: any = {};
        /** 特权免费使用总次数 */
        public _FreeSum: number = 0;
        /** 特权免费使用次数 */
        public getFreeUseNum(nPrivilege) {
            return this.freeUseNum[nPrivilege] || 0;
        }
        /** 特权免费使用次数 */
        public setFreeUseNum(nPrivilege, nFreeUseNum) {
            this.freeUseNum[nPrivilege] = nFreeUseNum;
        }

        /** 获取已拥有特权免费使用总次数 */
        public getFreeUseSum() {
            let NumSum: number = 0;
            for (let nPrivilege in this.freeUseNum) {
                NumSum += this.freeUseNum[nPrivilege]
            }
            return NumSum;
        }
        /**事件属性*/
        private eventPro: { [index: number]: any } = {};
        /**事件每日属性*/
        private eventDayPro: { [index: number]: any } = {};

        /** 通过类型获取事件属性 */
        public GetEventProByType(type: EventProEnum): any {
            return this.eventPro[type] || 0;
        }

        /** 通过类型获取事件每日属性 */
        public GetEventDayProByType(type: EventProEnum): any {
            return this.eventDayPro[type] || 0;
        }

        private _cacheValue: { [key: number]: number } = {};
        public get cacheValue(): { [key: number]: number } {
            return this._cacheValue;
        }

        /** 获取邀请的总人数 */
        public get newInviteNum() {
            return this.GetEventProByType(EventProEnum.InvitationNum)
        }

        private _dayInviteNum = 0;
        /** 当日邀请的人数 */
        public set dayInviteNum(num: number) {
            this._dayInviteNum = num;
        }
        public get dayInviteNum() {
            return this._dayInviteNum;
        }

        private invitation;
        /** 领取奖励标记 */
        public getInvitation(key: number) {
            return this.invitation[key] || 0;
        }
        public setInvitation(key: number, value: any) {
            this.invitation[key] = value;
        }
        /** 跳关标记，助力通关使用次数 */
        private _invitadunFlag;
        public get invitadunFlag() {
            return this._invitadunFlag;
        }
        public set invitadunFlag(value: number) {
            this._invitadunFlag = value;
        }
        /** 领取vip标记 */
        private _invitaVipFlag;
        public get invitaVipFlag() {
            return this._invitaVipFlag;
        }
        public set invitaVipFlag(value: number) {
            this._invitaVipFlag = value;
        }
        /** 领取vip次数 */
        private _invitaVipTimes;
        public get invitaVipTimes() {
            return this._invitaVipTimes;
        }
        public set invitaVipTimes(value: number) {
            this._invitaVipTimes = value;
        }

        /**
         * 发送累计数据
         * @param pro:EventProEnum
         * @param nun 数量
         */
        public ReqOnEvent(pro: EventProEnum, nun: number) {
            RemoteCall.Instance.Send("K_ReqOnEvent", pro, nun);
        }

        public Initialize(): void {
            RemoteCall.Instance.RegistJXS2CProtocol("C_ServerTime", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_SyncPlayerInfoMsg", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_EnterMap", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_OnLevelUp", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_OnChangeExp", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_AddMP", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_AddItemVIP", this);
            RemoteCall.Instance.RegistJXS2CProtocol('C_SendInitEventMsg', this);
            RemoteCall.Instance.RegistJXS2CProtocol('C_SendEventMsg', this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_OnlineSyncEnd", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_ClientInfo", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_Whosyourdaddy", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_DayRefreshMsg", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_ChargeRes", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_VipInfo", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_AddVip", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_UpdatePrivilege", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_OnInvite", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_LadderScore", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_Advertising", this);
            let tcfg = GameParamConfig.FreePrivilegeStorageMaxNum;
            for (let key in tcfg) {
                this._FreeSum += tcfg[key];
            }
        }

        /** 更新当天邀请的人数 */
        public C_OnInvite(buf) {
            Event.DispatchEvent("InviteTodayNum");
            this.dayInviteNum = buf[0];
            let sNew = buf[1];
            let sName = buf[2];
            if (sName != null && sName != "") {
                if (sNew) {
                    TipsLogic.Instance.OpenSystemTips(30054, sName);
                }
                else {
                    TipsLogic.Instance.OpenSystemTips(30055, sName);
                }
            }
        }

        public Damage: number = 0;
        private C_Whosyourdaddy() {
            this.Damage = 999999999;
        }

        /** 上线同步VIP */
        private C_VipInfo(buf) {
            let nExpirationTime = buf[0];
            this._player.ExpirationTime = nExpirationTime;
            if (this._player.IsVip) {
                this._player.vo.setVip();
            }
        }

        /** 添加VIP */
        private C_AddVip(buf) {
            let nExpirationTime = buf[0];
            this._player.ExpirationTime = nExpirationTime;
            this._player.vo.setVip();
        }

        /** 特权次数更新 */
        private C_UpdatePrivilege(buf) {
            let nPrivilege = buf[0];
            let nCount = buf[1];
            this.freeUseNum[nPrivilege] = nCount;
        }

        private C_LadderScore(buf) {
            MasterPlayer.Instance.player.Fraction = buf[0];
            MasterPlayer.Instance.player.LadderWinnNum = buf[1];
        }

        /** 充值成功通知 */
        public C_ChargeRes(buf) {
            let nGold = buf[0];
            let nMoney = buf[1];
            TipsLogic.Instance.OpenSystemTips("充值" + nGold + "钻石成功！");
        }

        /**0:00服务器通知 */
        private C_DayRefreshMsg() {
            this.eventDayPro = {};
            AdvertisingManager.Instance.tAdvertisingTimes = {}
            this._player.Donatetimes = {};
            AchievenManger.Instance.LoadDayMission();
            SignInLogic.Instance.EmptyData();
            ViewUILogic.Instance.OnDay();
            MemoryLogic.Instance.OnDay();
            Event.DispatchEvent("UpdateBtnList");
        }

        /** 玩家等级 */
        private C_OnLevelUp(buf: any) {
            MasterPlayer.Instance.player.vo.UpdateBase();
            this._player.Level = buf[0];
            Event.DispatchEvent("RefreshList");
            Event.DispatchEvent("Role_lvup");
            //新手引导
            Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_6);
            Guidance.Instance.TriggerGuidance(E_GuidanceStep.E_Guidance_9);
        }

        /** 玩家经验 */
        private C_OnChangeExp(buf: any) {
            this._player.Exp = buf[0];
            Event.DispatchEvent("RefreshList");
        }

        /** 所有同步结束 */
        public C_OnlineSyncEnd() {
            BCampManager.Instance.initData();
            AttributePassiveManager.Instance.Init();
            /** 执行心跳函数 */
            ViewUILogic.Instance.FrameHander();
        }

        /** 玩家添加MP */
        private C_AddMP(buf: any) {
            let nMP = buf[0];
            Event.DispatchEvent("MpValueChange", [nMP]);
            let bAdd = nMP >= 0;
            TipsLogic.Instance.OpenSystemTips(ViewUILogic.Instance.mpValueFull ?
                "法力池已满" : "法力值" + (bAdd ? " + " : " ") + nMP);
        }

        /** 玩家添加MP */
        private C_AddItemVIP(buf: any) {
            let nAddTime = buf[0];
            if (nAddTime == -1) {
                TipsLogic.Instance.OpenSystemTips("获取永久VIP！")
            } else {
                TipsLogic.Instance.OpenSystemTips("获取VIP" + Math.floor(nAddTime / 3600) + "小时！")
            }
        }

        /** 玩家上线事件消息 */
        private C_SendInitEventMsg(buf: any) {
            this.eventPro = buf[0];
            this.eventDayPro = buf[1];
            /**成就系统 */
            AchievenManger.Instance.Initialize();
        }

        /** 玩家事件消息 */
        private C_SendEventMsg(buf: any) {
            let data = buf[0];
            let dataDay = buf[1];
            for (let eventKey in data) {
                this.eventPro[eventKey] = data[eventKey];
            }
            for (let eventKey in dataDay) {
                this.eventDayPro[eventKey] = dataDay[eventKey];
            }
        }

        /**服务器当前时间 */
        private C_ServerTime(buf: any) {
            Time.SetServerTime(buf[0]);
            this._days = 10;
        }

        /**同步主玩家基本数据 */
        private C_SyncPlayerInfoMsg(buf: any) {
            let info = buf[0];
            this._player.ID = info[1];                  //角色ID
            this._player.Name = info[2];                //玩家名字
            this._player.CustomsId = info[3];           //当前关卡
            this._player.WaveOrder = info[4];           //当前波次
            this._player.HeroWarList = info[5];         //阵容信息
            this._player.Level = info[6];               //角色等级
            this._player.Exp = info[7];                 //角色经验
            this._player.CustomsMode = info[8];         //关卡模式
            this._player.Mp = info[9];                  //法力值
            this._player.CampID = info[10]              //阵营ID
            this._player.HeadId = info[11]              //头像ID
            this._player.Donatetimes = info[12];        //捐献次数
            ShopLogic.Instance.tChargeTimes = info[13];
            ShopLogic.Instance.MoneyBack = info[14];
            KickingLogic.Instance.ChallengeNum = info[15];//王者约战挑战次数
            this.freeUseNum = info[17];                //免费特权次数
            this.invitation = info[18];                //领取奖励标记
            this.invitadunFlag = info[19]               //跳关标记
            this.invitaVipFlag = info[20];              //领取vip标记
            this.invitaVipTimes = info[21];             //领取vip次数
            this.bNewbie = info[23] || false;          //是否是新玩家
            this.fundBuy = info[24] == 1;     //购买基金标记0/1
            this.fundReceive = info[25];     //领取基金标记{"1":0/1}
            DiscountManager.Instance.tPrivilegeTims = info[26]   //特权打折
            DiscountManager.Instance.tBoxTims = info[27]         //宝箱打折
            this._player.Hero_pecktime = info[28];        //英雄礼包的倒计时
            ShopLogic.Instance.BuyTimes = info[29];
            MemoryLogic.Instance.RecoverTime = info[30]//下次恢复体力时间
            MemoryLogic.Instance.Power = info[31];//体力
            MemoryLogic.Instance.BuyPowerTimes = info[32];//购买体力次数
            MemoryLogic.Instance.copyBattleArray = info[33];//材料副本挑战次数组
            AdvertisingManager.Instance.tAdvertisingTimes = info[34];//看广告次数
            HeroManager.Instance.Peck_Ad = info[35];
            MainActionLogic.Instance.hasMatch = Boolean(info[36]);    //PK联赛是否已报名
            LoginLogic.Instance.profid = Number(info[37]);          //角色Id
            ShopLogic.Instance.FreedrawTimes=Number(info[38]);
            ShopLogic.Instance.AdCoolTime =Number(info[39]);
            HeroManager.Instance.PeckIcon = this.ShowBool();
            HeroManager.Instance.Buyed_peck();
            this._player.vo = new PlayerVo();//战斗数据        
            if (!GetLocalStorage("sound", true)) {
                SetLocalStorage("sound", "1", true);
                SetLocalStorage("music", "1", true);
            }
            this.player.Sound = !!Number(GetLocalStorage("sound", true));
            this.player.Music = !!Number(GetLocalStorage("music", true));

            // 同步完阵容信息后刷新对话列表
            BubbleManager.Instance.UpdateAllBubbleID();         
        }

        /** 缓存数据同步 */
        private C_ClientInfo(buff: any) {
            for (let i: number = 0; i < buff.length; i++) {

                for (let key in buff[i]) {
                    this._cacheValue[key] = buff[i][key];
                }
            }
        }

        /** 上线同步玩家广告奖励 */
        private C_Advertising(data: any) {
            ViewUILogic.Instance.adTimeStamp = Number(data[0]);
        }

        /**英雄进阶LOGO的显示隐藏 */
        private ShowBool() {
            let times = 0;
            for (let key in this._player.Hero_pecktime) {
                let nID = Number(key);
                let peck_cfg = HeroPeckConfig[nID];
                let Buy_times = ShopLogic.Instance.GetBuyTimes(4, peck_cfg.shopId);
                let bool_m = ShopLogic.Instance.isFristCharge(5, peck_cfg.chargeId)
                let bool_d = Buy_times == 0 ? true : false;
                if (IsAD()) {
                    if (Buy_times >= 2) {
                        HeroManager.Instance.PeckBuyed.push(nID);
                    }
                    if (bool_d) {
                        times++;
                        break
                    }
                } else {
                    if (bool_d || bool_m) {
                        times++;
                        break
                    } else {
                        HeroManager.Instance.PeckBuyed.push(nID);
                    }
                }
            }
            let bool = times == 0 ? false : true
            return bool
        }

        /**主玩家进入地图 */
        private C_EnterMap(): void {
            UIManager.Instance.DestroyUI("CreateView", [ViewDownRoot]);
            UIManager.Instance.DestroyUI("LoginView", [ViewDownRoot]);
            //进入游戏状态
            this._bInGame = true;
            //开启断线重连
            RemoteCall.Instance.OpenReConnect();
            if (this.bNewbie == false) {
                if (!UIManager.Instance.IsHave("MainView", ViewDownRoot)) {
                    //加载主界面
                    UIManager.Instance.CreateUI("MainView", [ViewDownRoot], Laya.Handler.create(this, () => {
                        //加载关卡场景
                        CustomsManager.Instance.Initialize();
                    }));
                }
            }
        }

    }
}