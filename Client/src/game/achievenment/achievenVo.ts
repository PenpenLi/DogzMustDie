/**
* 成就模板
*/
module H52D_Framework {
	export class AchievenVo {
		/**事件ID */
		private _eventId: EventProEnum;
		/**成就类型 */
		private _achievenType: E_AchievenType;
		/**达成条件值 */
		private _aimValue: number;
		/**已达成条件值 */
		private _yetValue: number;
		/**达成奖励 */
		private _reward: number;
		/**达成奖励类型 */
		private _rewardType: number;
		/**类型排序 */
		private _order: number;
		/**第几星 */
		private _star: number;
		/**最大星星数 */
		private _maxStar: number;
		/**成就描述 */
		private _info: string;
		/**成就图片路径 */
		private _strPic: string;

		/**事件ID */
		public get eventId() {
			return this._eventId;
		}
		/**成就类型 */
		public get achievenType() {
			return this._achievenType;
		}

		/**达成条件值 */
		public get aimvalue() {
			return this._aimValue;
		}
		/**已达成条件值 */
		public get yetvalue() {
			return this._yetValue;
		}
		public set yetvalue(value: number) {
			this._yetValue = value;
		}
		/**达成奖励 */
		public get reward() {
			return this._reward;
		}
		/**达成奖励类型 */
		public get rewardType() {
			return this._rewardType;
		}
		/**类型排序 */
		public get order() {
			return this._order;
		}
		/**第几星 */
		public get star() {
			return this._star;
		}
		public set star(num: number) {
			this._star = num;
		}
		/**最大星星数 */
		public get maxStar() {
			return this._maxStar;
		}

		/**成就描述 */
		public get info() {
			return this._info;
		}
		/**成就图片路径 */
		public get strPic() {
			return this._strPic;
		}

		/**
		 * 
		 * @param eventId 事件ID
		 * @param achievenType 成就类型 
		 */
		constructor(eventId: EventProEnum, achievenType: E_AchievenType) {
			this._star = 1;
			this._eventId = eventId;
			this._achievenType = achievenType;
			this.Init();

		}
		public Init() {
			let star;
			let achieve;
			if (this._achievenType == E_AchievenType.eDay) {
				this._maxStar = GetTabLength(DayAchieveConfig[this._eventId]);
				star = this._star > this._maxStar ? this._maxStar : this._star;
				achieve = DayAchieveConfig[this._eventId][star];
				this._yetValue = MasterPlayer.Instance.GetEventDayProByType(this._eventId);

			} else if (this._achievenType == E_AchievenType.eAchieven) {
				this._maxStar = GetTabLength(AchieveConfig[this._eventId]);
				star = this._star > this._maxStar ? this._maxStar : this._star;
				achieve = AchieveConfig[this._eventId][star];
				this._yetValue = MasterPlayer.Instance.GetEventProByType(this._eventId);
			}

			this._aimValue = achieve.Value;

			achieve.Reward[1] == 0 ? this._reward = achieve.Reward[2] : this._reward = achieve.Reward[1];
			achieve.Reward[1] != 0 ? this._rewardType = BaseDefine.ItemIdGold : this._rewardType = BaseDefine.ItemIdDiamonds;
			this._order = achieve.order;
			this._info = GetInfoAttr.Instance.GetText(achieve.info);
			this._strPic = achieve.strPic;
		}

		public SetYetValue() {
			this._yetValue = MasterPlayer.Instance.GetEventProByType(this._eventId);
		}
	}
}