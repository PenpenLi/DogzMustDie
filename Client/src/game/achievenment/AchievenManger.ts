/**
* 成就管理器
*/
module H52D_Framework {
	export class AchievenManger {
		private static _init: AchievenManger;
		public static get Instance(): AchievenManger {
			if (AchievenManger._init == null) {
				AchievenManger._init = new AchievenManger();
			}
			return AchievenManger._init
		}

		/**每日成就任务列表 */
		private _dayMission: { [id: number]: AchievenVo } = {};
		/**永久成就任务列表 */
		private _achievenMission: { [id: number]: AchievenVo } = {};
		/**当前页面类型 */
		private _achievenType: E_AchievenType = E_AchievenType.eDay;
		/**每日成就任务列表 */
		public get dayMission() {
			return this._dayMission;
		}
		/**永久成就任务列表 */
		public get achievenMission() {
			return this._achievenMission;
		}
		/**当前页面类型 */
		public get achievenType() {
			return this._achievenType;
		}
		/**设置当前页面类型 */
		public set achievenType(type: E_AchievenType) {
			this._achievenType = type;
		}
		constructor() {
			this.LoadDayMission();
			this.LoadAchievenMission();
			Tick.Loop(5000, this, () => {
				Event.DispatchEvent("AchievenAttackNum");
			});
		}

		public Initialize() {
			//开始同步通知
			RemoteCall.Instance.RegistJXS2CProtocol("C_AllAchieveOnLine", this);
			//请求领取成就奖励回调
			RemoteCall.Instance.RegistJXS2CProtocol("C_ReqAchievementAward", this);
			//请求领取每日成就回调
			RemoteCall.Instance.RegistJXS2CProtocol("C_ReqDayAchievementAward", this);
		}

		/**上线同步成就信息 */
		private C_AllAchieveOnLine(buf: any) {
			let m_tAwardRecord = buf[0];
			let m_tDayAwardRecord = buf[1];

			for (let id in m_tAwardRecord) {
				let eventId = Number(id);
				let star = m_tAwardRecord[id];
				this._achievenMission[eventId].star = star;
				this._achievenMission[eventId].Init();
			}

			for (let id in m_tDayAwardRecord) {
				let eventId = Number(id);
				let star = m_tDayAwardRecord[id];
				this._dayMission[eventId].star = star;
				this._dayMission[eventId].Init();
			}
		}

		/**请求领取成就奖励回调 */
		private C_ReqAchievementAward(buf: any) {
			let nEventType = buf[0];
			let m_tAwardRecord = buf[1];
			let tAllAward = buf[2];
			let bShare = buf[3];

			let proType = BaseDefine.ItemShopTypePro;
			let reward = this._achievenMission[nEventType].reward;
			let rewardType = this._achievenMission[nEventType].rewardType;

			this._achievenMission[nEventType].star = m_tAwardRecord;
			this._achievenMission[nEventType].Init();

			if (bShare) {
				OneTimer(2000, () => {
					TipsLogic.Instance.OpenGoodsProTips(tAllAward)
					OneTimer(200, () => {
						Event.DispatchEvent("UpdateAchievenDate", [E_AchievenType.eAchieven]);
					});
				})
			} else {
				TipsLogic.Instance.OpenGoodsProTips(tAllAward)
				OneTimer(200, () => {
					Event.DispatchEvent("UpdateAchievenDate", [E_AchievenType.eAchieven]);
				});
			}
		}

		/**请求领取每日成就回调 */
		private C_ReqDayAchievementAward(buf: any) {
			let nEventType = buf[0];
			let m_tAwardRecord = buf[1];
			let tAllAward = buf[2];
			let bShare = buf[3];

			let proType = BaseDefine.ItemShopTypePro;
			let reward = this._dayMission[nEventType].reward;
			let rewardType = this._dayMission[nEventType].rewardType;

			this._dayMission[nEventType].star = m_tAwardRecord;
			this._dayMission[nEventType].Init();

			if (bShare) {
				OneTimer(2000, () => {
					TipsLogic.Instance.OpenGoodsProTips(tAllAward)
					OneTimer(200, () => {
						Event.DispatchEvent("UpdateAchievenDate", [E_AchievenType.eDay]);
					})
				})
			} else {
				TipsLogic.Instance.OpenGoodsProTips(tAllAward)
				OneTimer(200, () => {
					Event.DispatchEvent("UpdateAchievenDate", [E_AchievenType.eDay]);
				})
			}
		}

		/**请求领取成就奖励 */
		public K_ReqAchievementAward(nEventType: EventProEnum) {
			RemoteCall.Instance.Send('K_ReqAchievementAward', nEventType);
		}

		/**请求领取每日成就 */
		public K_ReqDayAchievementAward(nEventType: EventProEnum) {
			RemoteCall.Instance.Send('K_ReqDayAchievementAward', nEventType);
		}

		/**加载成就任务 */
		private LoadAchievenMission() {
			/**加载永久成就任务 */
			for (let id in AchieveConfig) {
				let eventId = Number(id);
				this._achievenMission[eventId] = new AchievenVo(eventId, E_AchievenType.eAchieven);
			}
			/**加载每日目标 */
		}
		public LoadDayMission() {
			this._dayMission = {};
			/**加载每日成就任务 */
			for (let id in DayAchieveConfig) {
				let eventId = Number(id);
				this._dayMission[eventId] = new AchievenVo(eventId, E_AchievenType.eDay);
			}
			if (UIManager.Instance.IsHave("AchievementView", ViewUpRoot)) {
				Event.DispatchEvent("UpdateAchievenDate", [E_AchievenType.eDay]);
			}
		}

		/**是否显示红点 */
		public showPoint(): boolean {
			let bShow: boolean = false;
			for (let id in this._achievenMission) {
				let achieve = this._achievenMission[id];
				achieve.Init();
				if (achieve.yetvalue >= achieve.aimvalue && achieve.star <= achieve.maxStar) {
					bShow = true;
				}
			}
			for (let id in this._dayMission) {
				let achieve = this._dayMission[id];
				achieve.Init();
				if (achieve.yetvalue >= achieve.aimvalue && achieve.star <= achieve.maxStar) {
					bShow = true;
				}
			}
			return bShow;
		}
		public showPointAchieven(): boolean {
			let bShow: boolean = false;
			for (let id in this._achievenMission) {
				let achieve = this._achievenMission[id];
				achieve.Init();
				if (achieve.yetvalue >= achieve.aimvalue && achieve.star <= achieve.maxStar) {
					bShow = true;
				}
			}
			return bShow;
		}

		public showPointDay(): boolean {
			let bShow: boolean = false;
			for (let id in this._dayMission) {
				let achieve = this._dayMission[id];
				achieve.Init();
				if (achieve.yetvalue >= achieve.aimvalue && achieve.star <= achieve.maxStar) {
					bShow = true;
				}
			}
			return bShow;
		}

	}
}