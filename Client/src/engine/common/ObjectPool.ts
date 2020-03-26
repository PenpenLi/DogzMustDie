/**
* 对象池
*/

module H52D_Framework {

	export class ObjectPool {

		constructor(size: number, type?: any) {
			this._poolType = type;
			this._maxIndex = size;
			this._minIndex = 1;
			this._noActivePool = [];
			this._ActicvePool = [];
		}

		/**可用的对象池 */
		private _noActivePool: Array<any> = [];
		/**取出来的对象 存放的池子 */
		private _ActicvePool: Array<any> = [];

		/**最大对象数 */
		private _maxIndex: number = 0;
		/**最大对象数 */
		public get MaxIndex() { return this._maxIndex; }
		/**最小对象数 */
		private _minIndex: number = 0;
		/**池类型 （暂时不用） */
		private _poolType: any;

		/**加入到可用的池子 */
		public AddNoActivePool(entity: any): void {
			if (this._noActivePool.length <= this._maxIndex) {
				this._noActivePool.push(entity);
			}
		}

		/**从可用池子里取东西 */
		public GetPoolElement(): any {
			if (this._noActivePool.length >= this._minIndex) {
				let tem = this._noActivePool.pop();
				if (this._ActicvePool.length <= this._maxIndex) {
					this._ActicvePool.push(tem);
				}
				return tem;
			}
			return null;
		}


		public get GetActivePool() {
			return this._ActicvePool;
		}

		public get GetNoActivePool() {
			return this._noActivePool;
		}

		public Destroy() {
			for (let i = 0; i < this.GetActivePool.length; i++) {
				if (this._ActicvePool[i]) {
					this._ActicvePool[i].Destroy();
					this._ActicvePool[i] = null;
				}
			}
			for (let i = 0; i < this.GetNoActivePool.length; i++) {
				if (this._noActivePool[i]) {
					this._noActivePool[i].Destroy();
					this._noActivePool[i] = null;
				}
			}
			this._noActivePool = [];
			this._ActicvePool = [];
		}

	}
}