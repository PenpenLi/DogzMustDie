/** 广告管理 */
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AdvertisingId = {
        //QQ小程序广告ID
        //观看广告产出钻石的固定入口
        "diamonds": "c38a51190d1d200711173e648a3ac50c",
        //小仙女看广告功能
        "angle": "79921ae3c00d06044c0b17c410949e1c",
        //看广告恢复能量
        "skill": "670154d680dfbb5739c1b6fab0cfc80d",
        //世界BOSS，观看广告获得全属性加成
        "boss": "b8b2375be1dc767181180a73d518e0ab",
        //观看广告获得王者约战次数
        "kicking": "b1dc355c5b291a6709574466c54c7a82",
        //观看广告获得天梯竞技次数
        "ladder": "2cdea4141292412aa44fc34d0b45b832",
        //每日签到看广告可三倍奖励
        "sign": "92e3bf73f5af55ddef47e5cc14e0efcd",
        //看广告可刷新购买限购礼包次数（每日一次）
        "gift": "bea7d095a348459ef94e2433fae07830",
        // 七日登录看广告
        "weeklogin": "9052dfa074abe68dd78faf325e4ce6d8",
        // 离线收益 看广告
        "profitView": "ff0684f7bfe463ed62da58ad0bcade07",
        // 成就广告
        "achevement": "75db450e4ce9841c439792e726c7c48f",
        //** 商城免费抽奖广告 */
        "freeluckdraw": "51d944dea6f33f9dcb9ba0028c4379a7",
    };
    var AdvertisingManager = /** @class */ (function () {
        function AdvertisingManager() {
            //微信临时广告发放次数
            this.nWXAdertisingTimes = 10;
            // /** 看广告返回结果 */
            // public adertisingBack: boolean;
            this._itemId = 0;
            //看广告次数 [nType]=次数
            this._tAdvertisingTimes = {};
            this.IsBuyBossBuff = false;
        }
        Object.defineProperty(AdvertisingManager, "Instance", {
            get: function () {
                if (AdvertisingManager._inst == null)
                    AdvertisingManager._inst = new AdvertisingManager();
                return AdvertisingManager._inst;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AdvertisingManager.prototype, "tAdvertisingTimes", {
            set: function (tAdvertisingTimes) {
                this._tAdvertisingTimes = tAdvertisingTimes;
            },
            enumerable: true,
            configurable: true
        });
        AdvertisingManager.prototype.Initialize = function () {
            //广告奖励
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol("C_ReqAdvertising", this);
        };
        /*******************************************/
        /** 获取今日看广告的总次数 */
        AdvertisingManager.prototype.GetAllAdvertisingTimes = function () {
            return H52D_Framework.MasterPlayer.Instance.GetEventDayProByType(EventProEnum.AdDoneNum);
            // return 10;
        };
        /** 获取今日看该类型广告的次数 */
        AdvertisingManager.prototype.GetAdvertisingTimes = function (nType) {
            return this._tAdvertisingTimes[nType] || 0;
        };
        /** 添加今日看该类型广告的次数 */
        AdvertisingManager.prototype.AddAdvertisingTimes = function (nType) {
            if (!this._tAdvertisingTimes[nType]) {
                this._tAdvertisingTimes[nType] = 0;
            }
            this._tAdvertisingTimes[nType]++;
        };
        Object.defineProperty(AdvertisingManager.prototype, "bnWXAdertisingTimes", {
            /** 是否有看广告的次数 */
            get: function () {
                return this.GetAllAdvertisingTimes() < this.nWXAdertisingTimes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AdvertisingManager.prototype, "hasAngleTimes", {
            /** 是否有小仙女看广告的次数 */
            get: function () {
                var adDoneNum = this.GetAdvertisingTimes(AdvertisementType.angelBeats);
                return this.bnWXAdertisingTimes && adDoneNum < H52D_Framework.GameParamConfig["advertisementDailyDiamondNum"];
            },
            enumerable: true,
            configurable: true
        });
        /** 看广告成功，向服务器请求奖励 */
        AdvertisingManager.prototype.K_ReqAdvertising = function (nType, nAngelBeatsType, nId) {
            this._itemId = nAngelBeatsType;
            H52D_Framework.RemoteCall.Instance.Send("K_ReqAdvertising", nType, nAngelBeatsType, nId);
        };
        /** 广告领奖返回 */
        AdvertisingManager.prototype.C_ReqAdvertising = function (value) {
            var nType = value[0];
            var tAllAward = value[1];
            this.AddAdvertisingTimes(nType);
            //有特殊处理在这里写
            switch (nType) {
                case AdvertisementType.angelBeats:
                    break;
                case AdvertisementType.diamond:
                    H52D_Framework.ViewUILogic.Instance.adTimeStamp = Number(value[2]);
                    break;
                case AdvertisementType.heroPeck:
                    H52D_Framework.HeroManager.Instance.Peck_Ad[this._itemId] = 1;
                    break;
                case AdvertisementType.ladder:
                    H52D_Framework.Event.DispatchEvent("ReshView_ladder");
                    var str = H52D_Framework.GetInfoAttr.Instance.GetSystemText(30072);
                    H52D_Framework.TipsLogic.Instance.OpenSystemTips(str);
                    break;
                case AdvertisementType.mpRecover:
                    H52D_Framework.Event.DispatchEvent("MpFull");
                    break;
                case AdvertisementType.pvp:
                    H52D_Framework.KickingLogic.Instance.AddSurplus(1);
                    break;
                case AdvertisementType.signIn:
                    H52D_Framework.SignInLogic.Instance.SendReqSignIn(true);
                    break;
                case AdvertisementType.wroldBoss:
                    H52D_Framework.WroldBossLogic.Instance.ReqBuyBuff(3, 1);
                    H52D_Framework.WroldBossLogic.Instance.ReqBuyBuff(3, 2);
                    H52D_Framework.WroldBossLogic.Instance.ReqBuyBuff(3, 3);
                    H52D_Framework.Event.DispatchEvent("BackBackGround");
                    this.IsBuyBossBuff = true;
                    break;
            }
            if (tAllAward && H52D_Framework.GetTabLength(tAllAward) != 0) {
                H52D_Framework.TipsLogic.Instance.OpenGoodsProTips(tAllAward);
            }
            H52D_Framework.Event.DispatchEvent("AdUpdate");
            H52D_Framework.Event.DispatchEvent("UpdateBtnList");
        };
        return AdvertisingManager;
    }());
    H52D_Framework.AdvertisingManager = AdvertisingManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=AdvertisingManager.js.map