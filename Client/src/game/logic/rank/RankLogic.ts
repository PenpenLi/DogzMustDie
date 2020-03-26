/**
* 排行榜逻辑类;
*/

// 排行榜类型
enum RankTypeEnum {
	ePer = 1,		//个人榜
	Charm = 2, 		//礼物榜
	Boss = 3
	//ecul,			//养成榜
}
// 排行榜类型
enum RankEnum {
	eNull = 0,
	ePerStrength = 1,	//个人实力榜
	ePerHreo = 5,		//个人英雄榜
	ePerClick = 3,		//个人点击榜
	ePerTreasure = 2,	//个人财富榜
	ePerRich = 4,		//个人富豪榜
	CharmAll = 6,		//魅力总榜
	CharmWeek = 7,		//魅力周榜
	CharmLastWeek = 8,	//魅力上周榜
	NowBossRank = 9,	//世界boss今日榜
	LastBossRank = 10,  //世界boss昨日榜
	PKLeagueHit = 11,     //pK联赛

	//eCampHeat, 		//阵营热度榜
	//eCampStrength, 	//阵营实力榜
	//eCulHreo,			//养成英雄榜
	//eCulSuit,			//养成套装榜
}


// 排行榜类型
enum OtherInfoEnum {
	RDRoleId = 1, 	// roleid
	RDName = 2,		// rolename
	RDLevel = 3,	// 等级
	RDProf = 4, 	// 职业
	RDVipLv = 5, 	// vip
	RDHead = 6, 	// 头像ID
	RDCamp = 7, 	// 阵营ID
}

module H52D_Framework {
	export class RankLogic {
		private static _inst: RankLogic;
		public static get Instance() {
			if (RankLogic._inst == null)
				RankLogic._inst = new RankLogic();
			return RankLogic._inst;
		}
		//排行榜数据
		private _rankAllArray: { [index: number]: Object[] } = {};
		private _otherInfoArray: { [index: number]: Object[] } = {};
		//点击次数
		private _clickNum: number;

		constructor() {

		}
		public Initialize() {
			//请求更新排行榜
			RemoteCall.Instance.RegistJXS2CProtocol('C_RankData', this);
			Event.RegistEvent(EventDefine.TAP_NUMBER, Laya.Handler.create(this, this.K_ReqClickTimes));
		}

		/**请求排行榜数据 
		 * @param type 排行榜类型
		 */
		public K_RankDataReq(type: RankEnum, startIndex: number, endIndex: number) {
			let params: Array<number> = [OtherInfoEnum.RDHead, OtherInfoEnum.RDVipLv, OtherInfoEnum.RDCamp];
			RemoteCall.Instance.Send("K_RankDataReq", type, startIndex, endIndex, params);
		}

		/**
         * 接收排行榜数据
         * @param buf 
         */
		private C_RankData(buf: any) {
			let rankType = buf[0];          //排行版类型
			let tData = buf[1];             //排行榜数据
			let tProData = buf[2];          //排行榜属性数据
			let tOnline = buf[3];           //是否在线数据
			let nRanking = buf[4];          //自身排名数据

			//初始化
			this._rankAllArray[rankType] = [];
			this._otherInfoArray[rankType] = [];

			//0号位置是自己的排名
			this._rankAllArray[rankType][0] = nRanking;
			//1-100是上榜玩家的排名
			for (let rank in tData) {
				let cls = tData[rank];
				this._rankAllArray[rankType][Number(rank)] = cls;
				this._otherInfoArray[rankType][Number(rank)] = tProData[Number(rank)]
			}
			//如果是PK联赛打开界面
			if (rankType == RankEnum.PKLeagueHit) {
				UIManager.Instance.CreateUI("MatchRankView", [ViewUpRoot]);
				return;
			}
			Event.DispatchEvent('UpdateRankList', rankType);
		}

		/** 获取排行榜数据 */
		public GetDataByType(type: RankEnum) {
			return this._rankAllArray[type];
		}

		/** 获取排行榜额外数据 */
		public GetOtherInfoByType(type: RankEnum) {
			return this._otherInfoArray[type];
		}

		public set SetClickNum(value: number) {
			this._clickNum = value;
		}

		public get ClickNum(): number {
			return this._clickNum;
		}

		public K_ReqClickTimes(value: number) {
			RemoteCall.Instance.Send("K_ReqClickTimes", value);
		}
	}
}