
module H52D_Framework {
	/**阵营管理类 */
	export class PCampManager {
		constructor() {
		}
		private _Camp: PCamp = null;
		/**阵营 */
		public get Camp() { return this._Camp; }
		public get vo() { return this._Camp.vo; }

		/**加载阵营模型 */
		public LoadBCamp(btype: number, vo: any): void {
			this.Destroy();
			this._Camp = new PCamp(vo, btype);
			btype == 1 ? this._Camp.LoadMoudle(30, 300, 2) : this._Camp.LoadMoudle(710, 300, 2);
		}

		/**设置目标开启战斗 */
		public SetTarget(target: any): void {
			this._Camp.Target = target;
			this._Camp.BClose = false;
		}
		public SetDamage() {
			this._Camp.SetDamage();
		}
		
		public Destroy(): void {
			if (this._Camp) {
				this._Camp.Destroy();
				this._Camp = null;
			}
		}

	}
}