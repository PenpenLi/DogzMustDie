module H52D_Framework {
	AddViewResource("SettingView",[
			{ url: "res/ui/ui_setting.atlas", type: Laya.Loader.ATLAS },
		]);
	/**
	 * @class 设置页面
	 * @author zhangyusong 
	 **/
	export class SettingNameView extends ui.setting.SettingNameViewUI {
		/** 性别 */
		private _genderEnum: GenderEnum = 1;
		private startName: string;
		private cost: number;

		constructor() {
			super();
			this.ViewInit();
			this.EventInit();
		}

		private ViewInit() {
			this.startName = MasterPlayer.Instance.player.Name;
			this.username = this.startName;
			let changeNum: number = MasterPlayer.Instance.GetEventProByType(EventProEnum.ChangeName);
			this.ChangeNameCost(!changeNum);
		}

		private EventInit() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			Event.RegistEvent("LoseFocus",Laya.Handler.create(this,this.InputBlur));
			this.btn_close.on(Laya.Event.CLICK, this, this.OnBtnClick, ["btn_close"]);
			this.btn_random.on(Laya.Event.CLICK, this, this.OnBtnClick, ["btn_random"]);
			this.btn_ok.on(Laya.Event.CLICK, this, this.OnBtnClick, ["btn_ok"]);
			this.input.on(Laya.Event.FOCUS, this, this.OnBtnClick, ["input_focus"]);
		}

		private OnBtnClick(btnName: string) {
			switch (btnName) {
				case "btn_random"://骰子
					this.username = GetRandName(this._genderEnum);
					break;
				case "input_focus":
					this.username = "";
					break;
				case "btn_ok"://确定
					this.OnLoginBtn();
					break;
				case "btn_close"://关闭
					UIManager.Instance.DestroyUI("SettingNameView", [ViewUpRoot]);
					break;
			}
		}

		/** 强制失去焦点 */
		private InputBlur(){
			this.username = this.input.text;
			this.input.focus = false;
		}

		private _username: string;
		private get username(): string {
			return this._username;
		}
		private set username(value: string) {
			this._username = value;
			this.input.text = this.username;
		}

		/** 更名消费 */
		private ChangeNameCost(free: boolean) {
			this.cost = free?0:GameParamConfig["ReNameExpend"];
			this.img_diamonds.visible = !free;
			this.txt_cost.visible = !free;
			this.txt_freed.visible = free;
			this.txt_cost.text = String(this.cost);
		}

		private OnLoginBtn() {
			this.username = this.input.text;
			if (this.startName == this.username) {
				TipsLogic.Instance.OpenMessageBox("角色名没有修改!");
				return;
			}
			if (StringIsEmpty(this.username)) {
				TipsLogic.Instance.OpenMessageBox("角色名不能为空!");
				return;
			}
			if(this.username != SensitiveWord.Instance.Replace(this.username)){
				this.input.text = "";
				TipsLogic.Instance.OpenMessageBox("少侠，您创建的角色名称中含有非法字符，请重新输入");
				return;
			}
			let diamonds: number = BagManager.Instance.getItemNumber(BaseDefine.ItemIdDiamonds);
			if (this.cost > diamonds) {
				if (IsShieldRecharge()) {
					TipsLogic.Instance.OpenMessageBox("钻石不足!");
				} else {
					TipsLogic.Instance.OpenMessageBox("钻石不足，是否前往购买", Laya.Handler.create(this, this.BuyDiamonds));
				}
				return;
			}
			let nLength = 0;
			for (var index = 0; index < this.username.length; index++) {
				if (this.username.charCodeAt(index) > 255) {
					nLength += 2;
				} else {
					nLength++;
				}
			}
			if (nLength > 12) {
				TipsLogic.Instance.OpenMessageBox("角色名过长，请重新输入！");
				return;
			}
			RemoteCall.Instance.Send("K_RoleRenameReq", this.username);
		}

		/** 购买钻石 */
		private BuyDiamonds(){
			UIManager.Instance.DestroyUI("SettingNameView", [ViewUpRoot]);
			UIManager.Instance.DestroyUI("SettingView", [ViewUpRoot]);
			Event.DispatchEvent(EventDefine.BOTTOM_SET_PANEL, [false,Laya.Handler.create(this,()=>{
				Event.DispatchEvent("OnPanelClick",[E_OpenGrade.SHOP]);
			})]);
		}

		private Destroy() {
			Tick.ClearAll(this);
			this.offAll();
			Event.RemoveEvent("LoseFocus",Laya.Handler.create(this,this.InputBlur));
		}

	}
}