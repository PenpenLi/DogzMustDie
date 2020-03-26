/**
* name 
*/
module H52D_Framework {
	export class AvatarManager {
		/** 模型管理类 */
		private _factoryObj = {}
		/** 加载延迟 */
		private _factoryLoadList = {}
		/** 加载标记 */
		private _factoryLoadMapping = {}
		private static _instance: AvatarManager = null;
		public static get Instance() {
			if (this._instance == null) {
				this._instance = new AvatarManager()
			}
			return this._instance;
		}

		/** 获取模型 */
		public GetFactoryTemplet(path: string, callBack: Laya.Handler) {
			let oTemplet: Laya.Templet = this._factoryObj[path]
			if (!oTemplet) {
				oTemplet = new Laya.Templet();
				oTemplet.loadAni(path);
				oTemplet.on(Laya.Event.COMPLETE, this, () => {
					this._factoryLoadMapping[path] = true
					oTemplet.offAll();
					if (this._factoryLoadList[path] != null) {
						for (let fun of this._factoryLoadList[path]) {
							fun.runWith(oTemplet)
						}
					}
					callBack.runWith(oTemplet);
					this._factoryLoadList[path] = null
				});
				this._factoryObj[path] = oTemplet
			}
			else {
				if (this._factoryLoadMapping[path] != true) {
					if (this._factoryLoadList[path] == null) {
						this._factoryLoadList[path] = []
					}
					this._factoryLoadList[path].push(callBack)
					return
				}
				callBack.runWith(oTemplet);
			}
		}
	}
}