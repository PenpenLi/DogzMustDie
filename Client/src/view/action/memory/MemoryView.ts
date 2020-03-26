module H52D_Framework {
	AddViewResource("MemoryView",[
            { url: "res/ui/ui_memory.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_noPack/ui-daguo-bgziyuanfuben.png", type: Laya.Loader.IMAGE },
        ]);
	export class MemoryView extends ui.action.memory.MemoryViewUI {
		private arrangement:MemoryArrangement;

		constructor() {
			super();
			this.ViewInit();
			this.EventInit();
		}

		private ViewInit() {
			this.view_bg.skin = "res/ui/ui_noPack/ui-daguo-bgziyuanfuben.png";
			this.tx_power.text = MemoryLogic.Instance.Power+"/"+GameParamConfig["PowerMax"];
			this.tx_diamonds.text = String(BagManager.Instance.getItemNumber(BaseDefine.ItemIdDiamonds));
			let dataList:any = CopyConfig[MemoryType.equip];
			let _lastId = 0;
			for (let i in dataList) {
				if(Number(i) > _lastId){
					_lastId = Number(i);
				}
			}
			this.panel_bg.vScrollBarSkin = "";
			let maxheight:number = dataList[_lastId]["Position"][2]*50 + 100;
			this.img_icon.height = this.img_line.height = maxheight;
			this.panel_bg.vScrollBar.max = maxheight-this.panel_bg.height;
			this.arrangement = new MemoryArrangement(this.img_icon, this.img_line);
			let localY:number = 360;
			let targetY:number = 0;
			if(this.arrangement.dungeonLocalY < this.panel_bg.vScrollBar.max+localY){
				targetY = this.arrangement.dungeonLocalY-localY;
			}
			else{
				targetY = this.panel_bg.vScrollBar.max;
			}
			this.panel_bg.scrollTo(0, targetY);
			this.DragPanel(targetY);
			this.Breathing();
		}

		private EventInit() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.btn_close.on(Laya.Event.CLICK, this, this.OnCloseHander);
			this.btn_tujian.on(Laya.Event.CLICK, this, this.ShowTujianHander);			
			this.btn_add.on(Laya.Event.CLICK, this, this.BuyPower);
			this.panel_bg.vScrollBar.changeHandler = new Laya.Handler(this,this.DragPanel);
			Event.RegistEvent("PowerFrush",Laya.Handler.create(this,this.PowerFrush));
		}

		private DragPanel(value){
			this.img_arrow_up.visible = value > 0;
			this.img_arrow_down.visible = value < this.panel_bg.vScrollBar.max;
		}

		private Breathing(){
			Laya.Tween.to(this.img_arrow,{alpha:0},800,Laya.Ease.linearInOut,Laya.Handler.create(this,()=>{
			Laya.Tween.to(this.img_arrow,{alpha:1},1500,Laya.Ease.linearInOut,Laya.Handler.create(this,()=>{
				this.Breathing();
			}));	}));			
		}

		private OnCloseHander() {
			UIManager.Instance.DestroyUI(this.name, [this.parent]);
		}

		/** 查看图鉴 */
		private ShowTujianHander() {
			HeroHandbookManager.Instance.OpenHandBookView();
		}

		private BuyPower(){
			UIManager.Instance.CreateUI("BuyMemoryPowerView",[ViewDownRoot]);
		}
		/** 刷新体力 */
		private PowerFrush(){
			this.tx_power.text = MemoryLogic.Instance.Power+"/"+GameParamConfig["PowerMax"];			
		}

		private Destroy() {
			this.offAll();
			Laya.Tween.clearAll(this);
			Event.DispatchEvent("PowerFrush",Laya.Handler.create(this,this.PowerFrush));
		}

	}
}