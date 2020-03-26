/**
* Buff数据类 
*/
module H52D_Framework{
	export class BuffData{
		/**状态ID */
		public id:number;
		/**名称ID */
		public get nameId():number{return StatusConfig[this.id].nameId}
		/**描述ID */
		public get descId():number{return StatusConfig[this.id].descId}
		/**图标名称 */
		public get strIcon():number {return StatusConfig[this.id].strIcon}
		/**状态特效 */
		//public spcEftId:any;

		/**挂点ID */
		public get pointID():number{return StatusConfig[this.id].spcEftId[1]};
		/**效果路径 */
		public get effectPath():string {return StatusConfig[this.id].spcEftId[2]};
		/**动画名字 */
		public get effectName():string {return StatusConfig[this.id].spcEftId[3]};
		/**特效大小 */
		public get effectScla():number {return StatusConfig[this.id].spcEftId[4]};

		/**位置X */
		public PosX:number;
		/**位置Y */
		public PosY:number;
		/**朝向 */
		public Dir:number;


		/**状态等级 */
		public get level():number{return StatusConfig[this.id].level}
		/**替换规则 */
		public get repeatType():number{return StatusConfig[this.id].repeatType}
		/**是否增益 */
		public get isGoodStatus():number{return StatusConfig[this.id].isGoodStatus}
		/**状态持续类型 */
		public get continueType():number{return StatusConfig[this.id].continueType}


		/**状态周期 */
		//public periodEffect:any;
		/**第一次出现的时间 */
		public firstTime:number;
		/**循环的时间 */
		public LoopTime:number;
		/**总共存在的时间 */
		public existTime:number;
		/**内置冷却时间 */
		public inlayCd:number;
		/**状态类型 */
		public statusType:number;
		/**属性id */
		public attributeId:number;
		/**属性万分比 */
		public attributePer:number;
		/**状态取值目标 */
		public statusBirthTarget:number;
		/**状态作用目标 */
		public statusActionTarget:number;
		/**死亡是否消失 */
		public get isDieRemove():number{return StatusConfig[this.id].isDieRemove};
		/**离线处理 */
		public get offlineDispose() {return StatusConfig[this.id].offlineDispose};
		public get hierarchy():number {return StatusConfig[this.id].hierarchy};

		constructor(id: number) {
			this.id = id;
			this.firstTime = StatusConfig[id].periodEffect["1"];
			this.LoopTime = StatusConfig[id].periodEffect["2"];
			this.existTime = StatusConfig[id].periodEffect["3"];
			this.inlayCd = StatusConfig[id].inlayCd;
			this.statusType = StatusConfig[id].statusType;
			this.attributeId = StatusConfig[id].effectList["1"];
			this.attributePer = StatusConfig[id].effectList["2"];
			this.statusBirthTarget = StatusConfig[id].statusBirthTarget;
			this.statusActionTarget = StatusConfig[id].statusActionTarget;
			this.PosX = 0;
			this.PosY = 0;
			this.Dir = 1;
			this.DataDispose();
		}

		private DataDispose() {
			if (this.statusType == 2 ||  this.statusType == 6) {
				this.attributePer = this.attributeId;
				this.attributeId = 2;
			}
			else if(this.statusType == 3)
			{
				this.attributePer = this.attributeId;
				this.attributeId = 1;
			}
			switch (this.statusActionTarget) {
				case 1:
					if (this.statusBirthTarget == 0) {
						this.statusBirthTarget = 1;
					}
					break;
				case 5:
					if (this.statusBirthTarget == 0) {
						this.statusBirthTarget = 5;
					}
					break;
				case 6:
					if (this.statusBirthTarget == 0) {
						this.statusBirthTarget = 6;
					}
					break;
				case 7:
					if (this.statusBirthTarget == 0) {
						this.statusBirthTarget = 7;
					}
					break;
			}
		}


	}

}