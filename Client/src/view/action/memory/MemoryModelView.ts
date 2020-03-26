module H52D_Framework {

	export class MemoryModelView extends ui.action.memory.MemoryModelViewUI {
		private data:any;
		/** 挑战状态：1未挑战 2挑战中 3已挑战 */
		private state:number=0;
		private isBig:boolean = false;
		private _unLock:boolean = false;

		constructor(data:any) {
			super();
			this.data = data;
			this.ViewInit();
			this.EventInit();
		}

		public get CustomsNum(){
			return this.data.CustomsNum;
		}
		public get CopyId(){
			return this.data.CopyId;
		}

		/** 当前关卡 */
		public CurrentCustoms(){
			if(this.isBig){
				this.Light(this.head_light_move);
				let monstorId = CustomspassConfig[this.data.CustomsId].monstorPosition[1][1][1];
				this.head_bg.skin = "ui_icon/"+MonstorConfig[monstorId].strHeadIcon;
			}
			else{
				this.icon_light.visible = false;
				this.icon_red.visible = true;
				this.Light(this.icon_red_move);
			}
		}

		/** 解锁关卡 */
		public set unLock(value:boolean){
			this._unLock = value;
			if(this.isBig){
				this.head_bg.gray = !value;
				this.head_light.gray = !value;
				this.head_lock.visible = !value;
			}
			else{
				this.icon_red.visible = false;
				this.icon_light.gray = !value;
				this.label_bg.width = value ? 176 : this.tx_name.textWidth+20;
			}
			this.img_star.visible = value;
			this.tx_name.x = value ? -52 :0;
		}

		private Light(page:Laya.Image){
			page.visible = true;
			Tick.Loop(800,this, this.Big, [page]);
		}

		private Big(page:Laya.Image){
			Laya.Tween.to(page, { scaleX: 1.4, scaleY: 1.4 , alpha: 0}, 600, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                    page.scaleX = page.scaleY = 1;
					page.alpha = 0.8;
                }));
		}
		
		private ViewInit() {
			this.head_light_move.visible = false;
			this.icon_red_move.visible = false;
			this.isBig = this.data.isBig == 1;
			this.page_head.visible = this.isBig;
			this.page_icon.visible = !this.isBig;
			this.head_lock.visible = false;
			this.tx_name.text = GetInfoAttr.Instance.GetText(this.data.CopyName);
			this.star = MemoryLogic.Instance.GetDungeonStar(MemoryType.equip, this.data.CopyId);

			if(this.isBig){
				let monstorId = CustomspassConfig[this.data.CustomsId].monstorPosition[1][1][1];
				this.head_bg.skin = "ui_icon/"+MonstorConfig[monstorId].strHeadIcon;
			}
			this.unLock = false;
		}

		/** 亮星1-3 */
		private set star(value:Object){
			for(let i:number = 1; i<=3; i++){
				this["star_red_"+i].visible = value[i] != 0;
				this["star_gray_"+i].visible = value[i] == 0;
			}
		}

		private EventInit(){
			this.on(Laya.Event.REMOVED, this, this.OnDistroy)
			this.on(Laya.Event.CLICK, this, this.OnLineHandler);
		}

		private OnLineHandler(){
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
			if(this.data.CustomsNum <= CustomsManager.Instance.CustomsVo.customsOrder){
				if(this._unLock){
					MemoryLogic.Instance.challengeData = this.data;
					MemoryLogic.Instance.OpenChallenge();
				}
				else{
					//请先通过前一关
					TipsLogic.Instance.OpenSystemTips(30062);
				}
			}
			else{
				//主线%s关后开启
				TipsLogic.Instance.OpenSystemTips(30061,this.data.CustomsNum);
			}
		}

		private OnDistroy(){
			this.offAll();
		}

	}
}