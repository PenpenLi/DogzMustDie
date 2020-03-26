
module H52D_Framework {
	/***/
	export class PSkillObject {
		/**技能物体 */
		private _Object: Avatar;
		/**技能数据 */
		private _data: Object = {};
		private _skillData: SkillData;
		public isdestroy: boolean = false;
		/**目标 */
		private _owner: any;
		/** 抛物线开口参数：a */
		private a: number = 0.003;
		public get A(): number {
			return this.a;
		}
		public set A(v: number) {
			this.a = v;
		}
		/** 速度 */
		private speed: number;

		public get Speed(): number {
			return this.speed;
		}
		public set Speed(v: number) {
			this.a = v;
		}
		/** 纠正_起点 */
		private correct_start_point: Laya.Point;
		/** 纠正_终点 */
		private correct_end_x: number;
		private correct_end_y: number;
		/** 区域直径 */
		private area: number;
		/** 纠正_角度：角度值 */
		private correct_angle: number;
		/** 起点 */
		private start_x: number;
		private start_y: number;
		/** 终点 */
		private end_x: number;
		private end_y: number;
		// /** 步阶_X */
		private step_x: number;
		/** 步阶_Y */
		private step_y: number;
		/** 步阶_角度：角度值 */
		private step_angle: number;

		private _ViewRoot: Laya.Box;
		/**
		 * 1 抛物线
		 * 2 直线
		 */
		private _flyType: number = 0;
		/**被击特效播放 */
		private _hitAvatar: Avatar = null;
		/**目标终点 */
		private _EndX: number = 0;
		/**所属类型 */
		private _belongs: eBELONGS_TO;
		/**目标起点X */
		private _TPosX: number = 0;
		/**目标起点Y */
		private _TPosY: number = 0;

		private _btype: number = 0;
		/** 什么鬼 没有报错 有疑问 问李成立 */
		private _target
		/**
		 * 飞行曲线的参数调整
		 * @param a 抛物线
		 * @param speed 速度
		 * @param start_point 子弹起点位置调节
		 * @param end_x 子弹终点位置调节
		 * @param end_y 子弹终点位置调节
		 * @param area 子弹随机区域宽高
		 * @param start_angle 初始角度调整s
		 */
		private Bullet(a: number = 3, speed: number = 4, start_point: Laya.Point,
			end_x: number = 0, end_y: number = -100, area: number = 100, start_angle: number = 0): void {
			this.a = a * 0.001;
			this.speed = speed * 0.01;
			this.correct_start_point = start_point;
			this.correct_end_x = end_x;
			this.correct_end_y = end_y;
			this.area = area;
			this.correct_angle = start_angle;
		}

		private _dir: number = 1;
		constructor(owner: any, data: any, view: Laya.Box, btype: number, to: eBELONGS_TO) {
			this.isdestroy = false;
			this._bcomplete = false;
			this._skillData = data;
			this._ViewRoot = view;
			this._dir = btype;
			this._owner = owner;
			this._flyType = this._skillData.flyEffect[2];
			this._btype = btype;
			this._belongs = to;
		}

		private _bcomplete: boolean = false;
		public get BComplete() { return this._bcomplete; }
		public set BComplete(value: boolean) { this._bcomplete = value; }

		public OnUpdate() {

		}

		/**释放技能*/
		public Spell(target: any): void {
			this._target = null;
			this._target = target;
			this.isdestroy = false;
			this._bcomplete = false;
			this.LoadSkillEffect();
		}

		private LoadSkillEffect() {
			if (this._Object) {
				this.PlaySkillEffect();
			}
			else {
				this._Object = new Avatar(this._ViewRoot)
				this._Object.Load( this._skillData.flyEffect[3],
					this._dir, this._skillData.flyEffect["6"],
					0, 0, Laya.Handler.create(this, () => { this.PlaySkillEffect(); }));
			}
		}

		/**飞行特效*/
		private PlaySkillEffect() {
			if (this.CheckIsDestroy()) {
				return;
			}
			if (this._owner.type == eCharacter_TYPE.CAMP && this._belongs == eBELONGS_TO.ATTACK) {
				this._EndX = this._btype == 1 ? 540 : 190;
				this._TPosX = this._EndX;
				this._TPosY = 730;
			}
			else {
				this._EndX = this._target.PosX;
				this._TPosX = this._target.PosX;
				this._TPosY = this._target.PosY;
			}
			//攻击动作开始后的延迟时间点上播放子弹特效
			let time = this._skillData.flyEffect["7"];
			let pointID = this._skillData.flyEffect["1"];
			let pointArr = this._btype == 1 ? OSkillPoint[pointID - 1] : POSkillPoint[pointID - 1];
			let point = new Laya.Point(pointArr[0], pointArr[1]);
			switch (this._flyType) {
				case 1:
					this.Bullet(3, this._skillData.flyEffect["5"], point, 0, -50, 0, 0);
					break;
				case 2:
					this.Bullet(0, this._skillData.flyEffect["5"], point, 0, -50, 0, 0);
					break;
			}
			Tick.Once(time, this, this.palyEffect);
		}

		/**攻击特效 */
		private palyEffect(): void {
			if (this._Object) {
				this._Object.visible = true;
				this._Object.Play(this._skillData.flyEffect[4], true);
				//起点绝对位置
				this.start_x = this._owner.avatar.PosX + this.correct_start_point.x;
				this.start_y = this._owner.avatar.PosY + this.correct_start_point.y;
				let t = this._TPosX;
				//终点相对位置,随机区域范围
				this.end_x = this._TPosX - this.start_x + this.correct_end_x + (Math.random() - 0.5) * this.area;
				this.end_y = this._TPosY - this.start_y + this.correct_end_y + (Math.random() - 0.5) * this.area;
				this._Object.PosX = this.start_x;
				this._Object.PosY = this.start_y;
				//步阶
				this.step_x = this.speed;
				if (this._Object) {
					Tick.FrameLoop(1, this, this.FrameHander);
				}
			}
			else {
				this.isdestroy = true;
			}
		}

		/**更新逻辑 */
		private FrameHander(): void {
			if (this._Object) {
				if (this._btype == 1) {
					this._Object.PosX += (this.speed / 6) * Time.deltaTime;
				}
				else {
					this._Object.PosX -= (this.speed / 6) * Time.deltaTime;
				}
				// y = a*x*x + b*x; b = -a*m + n/m; 推算公式：m、n分别是终点的x、y 400,160
				let x: number = this._Object.PosX - this.start_x;
				let b = (-this.a * this.end_x + this.end_y / this.end_x);
				this.step_y = this.a * x * x + b * x;
				this._Object.PosY = this.start_y + this.step_y;
				//旋转角度，求导 tan& = 2 * a * x + b;
				this.step_angle = Math.atan(2 * this.a * x + b) * 180 / Math.PI;
				this._Object.Rotate(this.correct_angle + this.step_angle);
				if (this._btype == 1) {
					if (this._Object.PosX >= this._EndX) {
						this.OnComplete();
					}
				}
				else {
					if (this._Object.PosX <= this._EndX) {
						this.OnComplete();
					}
				}
			}
			else {
				this.isdestroy = true;
			}
		}

		/**远程特效到达目标点的回调 */
		private OnComplete(): void {
			this.Hidden();
			this._bcomplete = true;
			// if (this.CheckIsDestroy()) {
			// 	return;
			// }
			/**播放被击特效 */
			let x = this._Object.PosX;
			let y = this._Object.PosY;
			if (!ObjIsEmpty(this._skillData.hitEffect)) {
				this.LoadHitEffect(x, y);
			}
		}

		private LoadHitEffect(x: number, y: number) {
			if (this._hitAvatar) {
				this.PlayHitEffect(x, y);
			}
			else {
				this._hitAvatar = new Avatar( this._ViewRoot )
				this._hitAvatar.Load(this._skillData.hitEffect[1], this._dir, this._skillData.hitEffect[3],
					x, y, Laya.Handler.create(this, () => { this.PlayHitEffect(x, y); }));
			}
		}

		private PlayHitEffect(x: number, y: number) {
			if (this.CheckIsDestroy()) {
				return;
			}
			SoundManager.Instance.OnPlaySound(this._skillData.hitSound[1]);
			if (this._hitAvatar.Armature) {
				this._hitAvatar.visible = true;
				this._hitAvatar.PosX = x;
				this._hitAvatar.PosY = y;
				this._hitAvatar.Play(this._skillData.hitEffect[2], false, true, () => {
					this.isdestroy = true;
				});
			}
		}

		/**检查是否需要销毁 */
		private CheckIsDestroy() {
			if (!this._target || this._target.IsDie || !this._owner || !this._owner.avatar) {
				this.isdestroy = true;
				return true;
			}
			return false;
		}


		public Hidden(): void {
			this.isdestroy = true;
			if (this._Object && this._Object.Armature) {
				this._Object.visible = false;
			}
			Tick.Clear(this, this.FrameHander);
		}

		public Destroy(): void {
			if (this._Object) {
				this._Object.Destroy();
				this._Object = null;
			}
			if (this._hitAvatar) {
				this._hitAvatar.Destroy();
				this._hitAvatar = null;
			}
		}

		public Claer() {
			this._target = [];
			this._owner = null;
			this._data = null;
		}
	}
}