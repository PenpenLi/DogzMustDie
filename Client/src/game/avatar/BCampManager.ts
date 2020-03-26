
module H52D_Framework {
	/**阵营管理类 */
	export class BCampManager {
		private constructor() {

		}

		private static _instance: BCampManager;
		public static get Instance() {
			if (!BCampManager._instance) {
				BCampManager._instance = new BCampManager();
			}
			return BCampManager._instance;
		}

		private _Camp: BCamp;
		/**阵营 */
		public get Camp() { return this._Camp; }
		private _CampVo: BCampVo;
		public get vo() { return this._CampVo; }

		public initData() {
			this._CampVo = new BCampVo();
		}


		/**加载阵营模型 */
		public LoadBCamp() {
			this.Destroy();
			this._Camp = new BCamp(this._CampVo);
			this._Camp.LoadMoudle(30, 300, 2, Laya.Handler.create(this, () => {
				if (BattleManager.Instance.aIOperation)
					BattleManager.Instance.aIOperation.Dps();
			}));
			return this._Camp;
		}

		/**设置目标开启战斗 */
		public SetTarget(target: any): void {
			this._Camp.Target = [];
			this._Camp.Target.push(target);
			this._Camp.Close = false;
		}

		public Destroy(): void {
			if (this._Camp) {
				this._Camp.Destroy();
				this._Camp = null;
			}
		}

	}
}