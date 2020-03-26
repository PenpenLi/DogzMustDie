/**
* 时空法器套装管理器 
*/
module H52D_Framework {
	export class EquipSuitManager {
		private static _init: EquipSuitManager;
		public static get Instance(): EquipSuitManager {
			if (EquipSuitManager._init == null) {
				EquipSuitManager._init = new EquipSuitManager();
			}
			return EquipSuitManager._init;
		}
		
		constructor() {

		}
	}
}