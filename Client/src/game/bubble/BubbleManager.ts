/**
* 气泡对话
*/
module H52D_Framework {
	export class BubbleManager {
		private static _inst: BubbleManager;
		public static get Instance() {
			if (BubbleManager._inst == null)
				BubbleManager._inst = new BubbleManager();
			return BubbleManager._inst;
		}
		/** 对话组反向映射表 */
		private _tMappingList = {}
		/** 当前的可用的对话组ID */
		private _tBuffleList = []

		/**是否弹了第一个怪物气泡 */
		private _bMonsterBubble: boolean = false;
		private _bMonsterFirst: boolean = false;

		public get bMonsterBubble() {
			return this._bMonsterBubble;
		}
		public set bMonsterBubble(b: boolean) {
			this._bMonsterBubble = b;
		}
		public get bMonsterFirst() {
			return this._bMonsterFirst;
		}
		public set bMonsterFirst(b: boolean) {
			this._bMonsterFirst = b;
		}
		constructor() {
			// 制作反向映射表
			for (let nGroupID in GroupConfig) {
				let cfg = GroupConfig[nGroupID]
				let hero1 = cfg.hero1
				let hero2 = cfg.hero2
				if (this._tMappingList[hero1] == null) {
					this._tMappingList[hero1] = {}
				}
				if (this._tMappingList[hero2] == null) {
					this._tMappingList[hero2] = {}
				}
				this._tMappingList[hero1][hero2] = nGroupID
				this._tMappingList[hero2][hero1] = nGroupID
			}
		}

		/** 刷新缓存当前所有可能的对话ID */
		public UpdateAllBubbleID() {
			// 清空对话列表
			this._tBuffleList = []
			// 记录已有ID
			let tFlagBubbleID = {}
			//获取当前阵容ID
			let tHeroWarList = MasterPlayer.Instance.player.HeroWarList
			// 开始寻找聊天伙伴
			for (let nPos1 in tHeroWarList) {
				let nHero1ID = tHeroWarList[nPos1]
				if (this._tMappingList[nHero1ID] != null) {
					for (let nPos2 in tHeroWarList) {
						let nHero2ID = tHeroWarList[nPos2]
						// 检测是否有话题
						let nGroupID = this._tMappingList[nHero1ID][nHero2ID]
						if (nGroupID != null) {
							let cfg = GroupConfig[nGroupID]
							let tBubbleIdList = cfg.talkid
							for (let idx in tBubbleIdList) {
								let nBubbleID = tBubbleIdList[idx]
								if (tFlagBubbleID[nBubbleID] != true) {
									this._tBuffleList.push(nBubbleID)
									tFlagBubbleID[nBubbleID] = true
								}
							}
						}
					}
				}
			}
		}

		//** 随机一个对话ID */
		public RandomHeroBubbleID(): number {
			if (this._tBuffleList.length <= 0) {
				return null
			}
			let idx = Math.random() * this._tBuffleList.length >> 0
			return this._tBuffleList[idx];
		}
	}
}