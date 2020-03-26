/**
* 排行榜逻辑类;
*/
// 排行榜类型
var RankTypeEnum;
(function (RankTypeEnum) {
    RankTypeEnum[RankTypeEnum["ePer"] = 1] = "ePer";
    RankTypeEnum[RankTypeEnum["Charm"] = 2] = "Charm";
    RankTypeEnum[RankTypeEnum["Boss"] = 3] = "Boss";
    //ecul,			//养成榜
})(RankTypeEnum || (RankTypeEnum = {}));
// 排行榜类型
var RankEnum;
(function (RankEnum) {
    RankEnum[RankEnum["eNull"] = 0] = "eNull";
    RankEnum[RankEnum["ePerStrength"] = 1] = "ePerStrength";
    RankEnum[RankEnum["ePerHreo"] = 5] = "ePerHreo";
    RankEnum[RankEnum["ePerClick"] = 3] = "ePerClick";
    RankEnum[RankEnum["ePerTreasure"] = 2] = "ePerTreasure";
    RankEnum[RankEnum["ePerRich"] = 4] = "ePerRich";
    RankEnum[RankEnum["CharmAll"] = 6] = "CharmAll";
    RankEnum[RankEnum["CharmWeek"] = 7] = "CharmWeek";
    RankEnum[RankEnum["CharmLastWeek"] = 8] = "CharmLastWeek";
    RankEnum[RankEnum["NowBossRank"] = 9] = "NowBossRank";
    RankEnum[RankEnum["LastBossRank"] = 10] = "LastBossRank";
    RankEnum[RankEnum["PKLeagueHit"] = 11] = "PKLeagueHit";
    //eCampHeat, 		//阵营热度榜
    //eCampStrength, 	//阵营实力榜
    //eCulHreo,			//养成英雄榜
    //eCulSuit,			//养成套装榜
})(RankEnum || (RankEnum = {}));
// 排行榜类型
var OtherInfoEnum;
(function (OtherInfoEnum) {
    OtherInfoEnum[OtherInfoEnum["RDRoleId"] = 1] = "RDRoleId";
    OtherInfoEnum[OtherInfoEnum["RDName"] = 2] = "RDName";
    OtherInfoEnum[OtherInfoEnum["RDLevel"] = 3] = "RDLevel";
    OtherInfoEnum[OtherInfoEnum["RDProf"] = 4] = "RDProf";
    OtherInfoEnum[OtherInfoEnum["RDVipLv"] = 5] = "RDVipLv";
    OtherInfoEnum[OtherInfoEnum["RDHead"] = 6] = "RDHead";
    OtherInfoEnum[OtherInfoEnum["RDCamp"] = 7] = "RDCamp";
})(OtherInfoEnum || (OtherInfoEnum = {}));
var H52D_Framework;
(function (H52D_Framework) {
    var RankLogic = /** @class */ (function () {
        function RankLogic() {
            //排行榜数据
            this._rankAllArray = {};
            this._otherInfoArray = {};
        }
        Object.defineProperty(RankLogic, "Instance", {
            get: function () {
                if (RankLogic._inst == null)
                    RankLogic._inst = new RankLogic();
                return RankLogic._inst;
            },
            enumerable: true,
            configurable: true
        });
        RankLogic.prototype.Initialize = function () {
            //请求更新排行榜
            H52D_Framework.RemoteCall.Instance.RegistJXS2CProtocol('C_RankData', this);
            H52D_Framework.Event.RegistEvent(H52D_Framework.EventDefine.TAP_NUMBER, Laya.Handler.create(this, this.K_ReqClickTimes));
        };
        /**请求排行榜数据
         * @param type 排行榜类型
         */
        RankLogic.prototype.K_RankDataReq = function (type, startIndex, endIndex) {
            var params = [OtherInfoEnum.RDHead, OtherInfoEnum.RDVipLv, OtherInfoEnum.RDCamp];
            H52D_Framework.RemoteCall.Instance.Send("K_RankDataReq", type, startIndex, endIndex, params);
        };
        /**
         * 接收排行榜数据
         * @param buf
         */
        RankLogic.prototype.C_RankData = function (buf) {
            var rankType = buf[0]; //排行版类型
            var tData = buf[1]; //排行榜数据
            var tProData = buf[2]; //排行榜属性数据
            var tOnline = buf[3]; //是否在线数据
            var nRanking = buf[4]; //自身排名数据
            //初始化
            this._rankAllArray[rankType] = [];
            this._otherInfoArray[rankType] = [];
            //0号位置是自己的排名
            this._rankAllArray[rankType][0] = nRanking;
            //1-100是上榜玩家的排名
            for (var rank in tData) {
                var cls = tData[rank];
                this._rankAllArray[rankType][Number(rank)] = cls;
                this._otherInfoArray[rankType][Number(rank)] = tProData[Number(rank)];
            }
            //如果是PK联赛打开界面
            if (rankType == RankEnum.PKLeagueHit) {
                H52D_Framework.UIManager.Instance.CreateUI("MatchRankView", [H52D_Framework.ViewUpRoot]);
                return;
            }
            H52D_Framework.Event.DispatchEvent('UpdateRankList', rankType);
        };
        /** 获取排行榜数据 */
        RankLogic.prototype.GetDataByType = function (type) {
            return this._rankAllArray[type];
        };
        /** 获取排行榜额外数据 */
        RankLogic.prototype.GetOtherInfoByType = function (type) {
            return this._otherInfoArray[type];
        };
        Object.defineProperty(RankLogic.prototype, "SetClickNum", {
            set: function (value) {
                this._clickNum = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RankLogic.prototype, "ClickNum", {
            get: function () {
                return this._clickNum;
            },
            enumerable: true,
            configurable: true
        });
        RankLogic.prototype.K_ReqClickTimes = function (value) {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqClickTimes", value);
        };
        return RankLogic;
    }());
    H52D_Framework.RankLogic = RankLogic;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=RankLogic.js.map