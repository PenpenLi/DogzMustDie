module H52D_Framework {
	export class MemoryLineView extends ui.action.memory.MemoryLineViewUI {
		/** 被封的出口 0下, 1左, 2上, 3右*/
		private _into:number = 0;

		constructor() {
			super();
			this.ViewInit();
		}

		private ViewInit() {
			this.hor.visible = false;
			this.ver.visible = false;
			this.corner_lt.visible = false;
			this.corner_lb.visible = false;
			this.corner_rt.visible = false;
			this.corner_rb.visible = false;

			this.hor_light.visible = false;
			this.ver_light.visible = false;
			this.lt_light.visible = false;
			this.lb_light.visible = false;
			this.rt_light.visible = false;
			this.rb_light.visible = false;
		}

		public get into(){
			return this._into;
		}
		public set into(value){
			this._into = value;
		}

		/**
		 * 选择路线
		 * @param p 路线类型：1左上，2上左，3右上，4上右
		 */
		public ChoosePath(end:{"x":number, "y":number}){
			this.hor.visible = this.x != end.x;
			if(this.hor.visible){
				this.hor.width = Math.abs(this.x - end.x) - 32;
			}
			this.ver.visible = this.y != end.y;
			if(this.ver.visible){
				this.ver.height = Math.abs(this.y - end.y) - 32;
			}
			if(this.y > end.y){
				if(this.x < end.x){
					//右侧封堵
					if(this.into == 3){
						this.hor.x = 16;
						this.hor.y = end.y - this.y;
						this.ver.x = 0;
						this.ver.y = end.y - this.y + 16;
						this.corner_lt.x = 0;
						this.corner_lt.y = end.y - this.y;
						this.corner_lt.visible = true;
						this.into = 1;
					}
					else{
						this.hor.x = 16;
						this.hor.y = 0;
						this.ver.x = end.x - this.x;
						this.ver.y = end.y - this.y + 16;
						this.corner_rb.x = end.x - this.x;
						this.corner_rb.y = 0;
						this.corner_rb.visible = true;
						this.into = 0;
					}
				}
				else if(this.x > end.x){
					//左侧封堵,从上面走
					if(this.into == 1){
						this.hor.x = end.x - this.x + 16;
						this.hor.y = end.y - this.y;
						this.ver.x = 0;
						this.ver.y = end.y - this.y + 16;
						this.corner_rt.x = 0;
						this.corner_rt.y = end.y - this.y;
						this.corner_rt.visible = true;
						this.into = 3;
					}
					else{
						this.hor.x = end.x - this.x + 16;
						this.hor.y = 0;
						this.ver.x = end.x - this.x;
						this.ver.y = end.y - this.y + 16;
						this.corner_lb.x = end.x - this.x;
						this.corner_lb.y = 0;
						this.corner_lb.visible = true;
						this.into = 0;
					}
				}
				else if(this.x == end.x){
					if(this.y > end.y){
						this.ver.x = 0;
						this.ver.y = end.y - this.y + 16;
						this.into = 0;
					}
				}
			}
			else if(this.y <= end.y){
				if(this.x < end.x){
					this.hor.x = 16;
					this.hor.y = 0;
					this.into = 1;
				}
				else if(this.x > end.x){
					this.hor.x = end.x - this.x + 16;
					this.hor.y = 0;
					this.into = 3;
				}
				this.ver.visible = false;
			}
		}

		/** 完成 */
		public Complete(doing:boolean){
			if(this.hor.visible){
				this.hor_light.width = this.hor.width;
				this.hor_light.visible = doing;
			}
			if(this.ver.visible){
				this.ver_light.height = this.ver.height;
				this.ver_light.visible = doing;
			}
			if(this.corner_lt.visible) this.lt_light.visible = doing;
			if(this.corner_lb.visible) this.lb_light.visible = doing;
			if(this.corner_rt.visible) this.rt_light.visible = doing;
			if(this.corner_rb.visible) this.rb_light.visible = doing;
		}

	}
}