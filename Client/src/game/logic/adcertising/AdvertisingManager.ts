/** 广告管理 */
module H52D_Framework {

	export const AdvertisingId = {
		//QQ小程序广告ID
		//观看广告产出钻石的固定入口
		"diamonds":"c38a51190d1d200711173e648a3ac50c",
		//小仙女看广告功能
		"angle" : "79921ae3c00d06044c0b17c410949e1c",
		//看广告恢复能量
		"skill" : "670154d680dfbb5739c1b6fab0cfc80d",
		//世界BOSS，观看广告获得全属性加成
		"boss" : "b8b2375be1dc767181180a73d518e0ab",
		//观看广告获得王者约战次数
		"kicking" : "b1dc355c5b291a6709574466c54c7a82",
		//观看广告获得天梯竞技次数
		"ladder" : "2cdea4141292412aa44fc34d0b45b832",
		//每日签到看广告可三倍奖励
		"sign" : "92e3bf73f5af55ddef47e5cc14e0efcd",
		//看广告可刷新购买限购礼包次数（每日一次）
		"gift" : "bea7d095a348459ef94e2433fae07830",
		// 七日登录看广告
		"weeklogin":"9052dfa074abe68dd78faf325e4ce6d8",
		// 离线收益 看广告
		"profitView" : "ff0684f7bfe463ed62da58ad0bcade07",
		// 成就广告
		"achevement":"75db450e4ce9841c439792e726c7c48f",
		//** 商城免费抽奖广告 */
		"freeluckdraw":"51d944dea6f33f9dcb9ba0028c4379a7",
		//微信广告ID
		// //观看广告产出钻石的固定入口
		// "diamonds":"adunit-2f5e204a09231c6b",
		// //小仙女看广告功能
		// "angle" : "adunit-6715cd6396bdd2d6",
		// //看广告恢复能量
		// "skill" : "adunit-a0348e8d270b3d36",
		// //世界BOSS，观看广告获得全属性加成
		// "boss" : "adunit-809c38a9fa233d43",
		// //观看广告获得王者约战次数
		// "kicking" : "adunit-8fb3ba6366d71feb",
		// //观看广告获得天梯竞技次数
		// "ladder" : "adunit-a6d75c1d8c73625e",
		// //每日签到看广告可三倍奖励
		// "sign" : "adunit-8c123bd7e516ae63",
		// //看广告可刷新购买限购礼包次数（每日一次）
		// "gift" : "adunit-80875fe1e197eb8c",
		
	}

	export class AdvertisingManager {
		private static _inst: AdvertisingManager;
		public static get Instance() {
			if (AdvertisingManager._inst == null)
				AdvertisingManager._inst = new AdvertisingManager();
			return AdvertisingManager._inst;
		}

		//微信临时广告发放次数
		public nWXAdertisingTimes: number = 10;
		// /** 看广告返回结果 */
		// public adertisingBack: boolean;

		private _itemId: number = 0;
		//看广告次数 [nType]=次数
		private _tAdvertisingTimes: any = {};
		public set tAdvertisingTimes(tAdvertisingTimes) {
			this._tAdvertisingTimes = tAdvertisingTimes
		}

		constructor() {

		}

		public Initialize() {
			//广告奖励
			RemoteCall.Instance.RegistJXS2CProtocol("C_ReqAdvertising", this);
		}
		/*******************************************/
		/** 获取今日看广告的总次数 */
		public GetAllAdvertisingTimes() {
			return MasterPlayer.Instance.GetEventDayProByType(EventProEnum.AdDoneNum);
			// return 10;
		}

		/** 获取今日看该类型广告的次数 */
		public GetAdvertisingTimes(nType) {
			return this._tAdvertisingTimes[nType] || 0
		}

		/** 添加今日看该类型广告的次数 */
		public AddAdvertisingTimes(nType) {
			if (!this._tAdvertisingTimes[nType]) {
				this._tAdvertisingTimes[nType] = 0
			}
			this._tAdvertisingTimes[nType]++
		}

		/** 是否有看广告的次数 */
		public get bnWXAdertisingTimes() {
			return this.GetAllAdvertisingTimes() < this.nWXAdertisingTimes;
		}

		/** 是否有小仙女看广告的次数 */
        public get hasAngleTimes(){
			let adDoneNum:number = this.GetAdvertisingTimes(AdvertisementType.angelBeats);
			return this.bnWXAdertisingTimes && adDoneNum < GameParamConfig["advertisementDailyDiamondNum"];
		}

		/** 看广告成功，向服务器请求奖励 */
		public K_ReqAdvertising(nType, nAngelBeatsType?, nId?) {
			this._itemId = nAngelBeatsType;
			RemoteCall.Instance.Send("K_ReqAdvertising", nType, nAngelBeatsType, nId);
		}
		
		public IsBuyBossBuff:boolean = false;
		/** 广告领奖返回 */
		private C_ReqAdvertising(value) {
			let nType = value[0];
			let tAllAward = value[1];
			this.AddAdvertisingTimes(nType);
			//有特殊处理在这里写
			switch (nType) {
				case AdvertisementType.angelBeats:
					break;
				case AdvertisementType.diamond:
					ViewUILogic.Instance.adTimeStamp = Number(value[2]);
					break;
				case AdvertisementType.heroPeck:
					HeroManager.Instance.Peck_Ad[this._itemId] = 1;
					break;
				case AdvertisementType.ladder:
					Event.DispatchEvent("ReshView_ladder");
					let str = GetInfoAttr.Instance.GetSystemText(30072);
					TipsLogic.Instance.OpenSystemTips(str);
					break;
				case AdvertisementType.mpRecover:
					Event.DispatchEvent("MpFull");
					break;
				case AdvertisementType.pvp:
					KickingLogic.Instance.AddSurplus(1);
					break;
				case AdvertisementType.signIn:
					SignInLogic.Instance.SendReqSignIn(true);
					break;
				case AdvertisementType.wroldBoss:
					WroldBossLogic.Instance.ReqBuyBuff(3, 1);
					WroldBossLogic.Instance.ReqBuyBuff(3, 2);
					WroldBossLogic.Instance.ReqBuyBuff(3, 3);
					Event.DispatchEvent("BackBackGround");
					this.IsBuyBossBuff = true;
					break;			
			}

			if (tAllAward && GetTabLength(tAllAward) != 0) {
				TipsLogic.Instance.OpenGoodsProTips(tAllAward)
			}
			Event.DispatchEvent("AdUpdate");
			Event.DispatchEvent("UpdateBtnList");
		}
	}
}