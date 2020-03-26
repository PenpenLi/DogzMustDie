/** 容器模块 */
module H52D_Framework {
	export class PackModule {
		// 空间
		private _list
		// 计数
		private _count
		// 列表脏位
		private _dirty
		// 数组列表
		private _array: Array<any>
		// 排序规则
		private _sort

		constructor(sortFunc?) {
			this._list = {}
			this._count = 0
			this._dirty = false
			this._array = []
			this._sort = sortFunc
		}

		/** 添加 */
		public Add(key, val) {
			if (this._list[key] == null) {
				this._count++
			}
			this._list[key] = val
			this._dirty = true
		}

		/** 移除 */
		public Remove(key) {
			if (this._list[key] == null) {
				return
			}
			delete this._list[key]
			this._count--
			this._dirty = true
		}

		/** 获取容器 */
		public get list() {
			return this._list
		}

		/** 获取值 */
		public getVal(key) {
			return this._list[key]
		}

		/** 获取数量 */
		public get count() {
			return this._count
		}

		/** 获取脏位 */
		public get dirty() {
			return this._dirty
		}

		/** 获取数组列表 */
		public get array() {
			if (this._dirty) {
				this._array = []
				for (let key in this._list) {
					let val = this._list[key]
					this._array.push(val)
				}
				if (this._sort != null) {
					this._array.sort(this._sort)
				}
				this._dirty = false
			}
			return this._array
		}
	}
}