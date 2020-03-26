/**
* 阵容系统
* @张振明 
*/
module H52D_Framework {

	export class Formation {
		//上阵英雄的列表
		private _objectList: Array<any> = [];
		//前排英雄列表           	
		private _frontobjectList: Array<any> = [];
		//后排英雄列表           
		private _backobjectList: Array<any> = [];
		//横排英雄列表
		private _horizontalobjectList: Array<Array<any>> = [];
		//队长
		private _captain: any;
		//阵容最大人数
		private _maxNum: number = 9;
		// private _owner: any;

		//获取队长
		public get GetCaptain() { return this._captain; }
		/**
		 * 获取阵容英雄列表
		 */
		public get Getobject() { return this._objectList; }

		public GetobjectByID(id: number) {
			if (this.Getobject[id] != null) {
				return this.Getobject[id];
			}
			return null;
		}

		/**
		 * 获取前排英雄列表
		 */
		public get GetFrontobject() { 
			return this._frontobjectList; 
		}
		/**
		 * 获取前排列表中指定id英雄
		 * @param id 英雄id
		 */
		public GetFrontobjectById(id: number): any {
			if (this.GetFrontobject[id] != null)
				return this.GetFrontobject[id];
			return null;
		}
		/**
		 * 获取后排英雄列表
		 */
		public get GetBackobject() { return this._backobjectList; }
		/**
		 * 获取后排英雄列表中指定id英雄
		 * @param id 英雄id
		 */
		public GetBackobjectById(id: number): any {
			if (this.GetBackobject[id] != null)
				return this.GetBackobject[id];
			return null;
		}
		/**
		 * 获取横排英雄字典
		 */
		public get GetHorizontalobject() { return this._horizontalobjectList; }
		/**
		 * 根据id获取指定某排英雄列表
		 * @param id 横排id
		 */
		public GetHorizontalobjectListById(id: number): Array<any> {
			if (this.GetHorizontalobject[id] != null)
				return this.GetHorizontalobject[id];
			return null;
		}
		/**
		 * 获取横排字典中指定id横排中指定id英雄
		 * @param listID 横排id
		 * @param id     英雄id
		 */
		public GetHorizontalobjectById(listID: number, id: number): any {
			let objectList = this.GetHorizontalobjectListById(listID);
			if (objectList[id] != null) {
				return objectList[id];
			}
		}

		
		constructor() {
		}

		/**
		 * 位置信息写在这 暂时空缺
		 */
		private InitPositionList(): void {

		}

		/**
		 * 前排的数量，最大为3，最小为1
		 */
		public FrontNum(): number {
			return GetTabLength(this._frontobjectList);
		}
		/**
		 * 后排的数量,最大为6，最小为0
		 */
		public BackNum(): number {
			return GetTabLength(this._backobjectList);
		}
		/**给敌人表 */
		public GetFormatInfo(objectTab: { [key: number]: any }): void {
			let key = [];
			for (let k in objectTab) {
				key.push(k);
			}
			for (let i = 0; i < GetTabLength(objectTab); i++) {
				if (objectTab[key[i]]) {
					this._objectList.push(objectTab[key[i]]);
				}
			}
			this.SetFrontobject();
			this.Backobject();
			this.Horizontalobject();
		}
		/**给敌人表 */
		public GetFormatInfoArry(objectTab: Array<any>): void {
			this.Destroy();
			this._objectList = objectTab.concat();
			this.SetFrontobject();
			this.Backobject();
			this.Horizontalobject();
		}

		/**
		 * 添加到前排英雄列表
		 */
		public SetFrontobject(): void {
			for (let i = 0; i < this._objectList.length; i++) {
				let hc = this._objectList[i];
				if (this._objectList[i]) {
					if (hc.vo.location == 0 || hc.vo.location == 1 || hc.vo.location == 2) {
						this._frontobjectList.push(this._objectList[i]);
					}
				}
			}
			if (this._frontobjectList.length <= 0) {
				for (let i = 0; i < this._objectList.length; i++) {
					let hc = this._objectList[i];
					if (this._objectList[i]) {
						if (hc.vo.location == 3 || hc.vo.location == 4 || hc.vo.location == 5) {
							this._frontobjectList.push(this._objectList[i]);
						}
					}
				}
			}
			if (this._frontobjectList.length <= 0) {
				for (let i = 0; i < this._objectList.length; i++) {
					let hc = this._objectList[i];
					if (this._objectList[i]) {
						if (hc.vo.location == 6 || hc.vo.location == 7 || hc.vo.location == 8) {
							this._frontobjectList.push(this._objectList[i]);
						}
					}
				}
			}
		}
		/**
		 * 添加到后排英雄列表
		 */
		private Backobject(): void {
			for (let i = 0; i < this._objectList.length; i++) {
				if (this._objectList[i]) {
					if (this._objectList[i].vo.location > 5) {
						this._backobjectList.push(this._objectList[i]);
					}
				}
			}
			if (this._backobjectList.length == 0) {
				for (let i = 0; i < this._objectList.length; i++) {
					if (this._objectList[i]) {
						if (this._objectList[i].vo.location == 3 || this._objectList[i].vo.location == 4 ||
							this._objectList[i].vo.location == 5) {
							this._backobjectList.push(this._objectList[i]);
						}
					}
				}
			}
		}

		/**
		 * 添加到横排英雄列表
		 */
		private Horizontalobject(): void {
			let horizontal_1: Array<any> = [];
			let horizontal_2: Array<any> = [];
			let horizontal_3: Array<any> = [];
			for (let i = 0; i < this._objectList.length; i++) {
				let hc = this._objectList[i];
				if (this._objectList[i]) {
					if (hc.vo.location == 0 || hc.vo.location == 3 || hc.vo.location == 6) {
						horizontal_1.push(this._objectList[i]);
					}
				}
			}
			for (let i = 0; i < this._objectList.length; i++) {
				let hc = this._objectList[i];
				if (this._objectList[i]) {
					if (hc.vo.location == 1 || hc.vo.location == 4 || hc.vo.location == 7) {
						horizontal_2.push(this._objectList[i]);
					}
				}
			}
			for (let i = 0; i < this._objectList.length; i++) {
				let hc = this._objectList[i];
				if (this._objectList[i]) {
					if (hc.vo.location == 2 || hc.vo.location == 5 || hc.vo.location == 8) {
						horizontal_3.push(this._objectList[i]);
					}
				}
			}
			this._horizontalobjectList.push(horizontal_1);
			this._horizontalobjectList.push(horizontal_2);
			this._horizontalobjectList.push(horizontal_3);
		}

		/**设置竖排目标 */
		private SetHTarget() {
			let id = 0;
			for (let k in this.GetHorizontalobject) {
				if (this.GetHorizontalobject[k].length > 0) {
					id = Number(k);
				}
			}
			let h = this.GetHorizontalobject[id];
			return h;
		}

		/**设置横排目标 */
		private SetForntTatget(num) {
			let tar = [];
			let fornt = this.GetFrontobject;
			let index = 0;
			for (let k in fornt) {
				if (index <= num) {
					tar.push(fornt[k]);
				}
				index++;
			}
			return tar;
		}

		/**设置后排目标 */
		private SetBackTatget(num) {
			let tar = [];
			let back = this.GetBackobject;
			let index = 0;
			for (let k in back) {
				if (index < num) {
					tar.push(back[k]);
				}
				index++;
			}
			return tar;
		}

		/**设置队长目标 */
		private SetCapTarget() {
			let tar = [];
			let obj = this.Getobject;
			for (let k in obj) {
				if (obj[k] && obj[k].vo.location == 4) {
					tar.push(obj[k]);
					break;
				}
			}
			if (tar.length <= 0) {
				for (let k in obj) {
					if (obj[k]) {
						tar.push(obj[k]);
						break;
					}
				}
			}
			return tar;
		}
		
		public SetrandomTarget(tar_arr) {
			let tar = [];
			for (let k = 0; k < tar_arr.length; k++) {
				if (tar_arr[k] && !tar_arr[k].IsDie) {
					tar.push(tar_arr[k]);
					break;
				}
			}
			return tar;
		}

		/**设置目标 */
		public SetTarget(tar_arr, mode, num) {
			this.GetFormatInfoArry(tar_arr);
			let tar = null;
			switch (mode) {
				case 0:
					tar = tar_arr.concat();
					break;
				case 1:
					tar = this.SetForntTatget(num);
					break;
				case 2:
					tar = this.SetHTarget();
					break;
				case 3:
					tar = this.SetBackTatget(num);
					break;
				case 4:
					tar = this.SetCapTarget();
					break;
				case 5:
					tar = this.Getobject.concat();
					break;
			}
			return tar;
		}


		public getHeroByLoc(loc) {
			for (let k in this.Getobject) {
				if (this.Getobject[k] && this.Getobject[k].vo.location == loc) {
					return this.Getobject[k];
				}
			}
		}

		public Destroy() {
			this._objectList = [];
			this._frontobjectList = [];
			this._backobjectList = [];
			this._horizontalobjectList = [];
		}

	}
}