/**
* 特权Buff类
*/
module H52D_Framework {
	export class PrivilegeBuff {

		private static _instance: PrivilegeBuff;
		public static get Instance() {
			if (PrivilegeBuff._instance == null) {
				PrivilegeBuff._instance = new PrivilegeBuff();
			}
			return PrivilegeBuff._instance;
		}

		private constructor() {
			Event.RegistEvent(EventDefine.PRIVILEGE, Laya.Handler.create(this, this.AddBuff));
			Event.RegistEvent(EventDefine.PRIVILEGE_DELETE, Laya.Handler.create(this, this.Destroy));
		}

		private _isStart: boolean = false;
		public get IsStart() { return this._isStart; }

		private _dbuff:Buff;
		private _mbuff:Buff;
		
		/**添加Buff*/
		private AddBuff(id: number): void {
			let buffid = PrivilegeConfig[id]["parameter"][1];
			switch (id) {
				case 1:
					this._isStart = true;
					break;
				case 2:
					this.AllDamageBuff(buffid);
					break;
				case 3:
					this.MpRely(buffid);
					break;
			}
		}

		/**法力值回复 */
		private MpRely(buffid: number): void {
			this._mbuff = new Buff(buffid, this);
			this._mbuff.Do();
		}
		
		/**增加所有伤害BUff */
		private AllDamageBuff(buffid: number): void {
			this._dbuff = new Buff(buffid, this);
			this._dbuff.Do();
		}

		/**销毁 */
		private Destroy(id: number): void {
			if (id == 1) {
				this._isStart = true;
			}
			else if (id == 2) {
				this._dbuff.Destroy();
				this._dbuff = null;
			}
			else if (id == 3) {
				this._mbuff.Destroy();
				this._mbuff = null;
			}
		}

	}
}