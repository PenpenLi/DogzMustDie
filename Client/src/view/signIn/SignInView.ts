/**签到*/
module H52D_Framework {
	AddViewResource("SignInView",
		[
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_sign.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
		]);

	export class SignInView extends ui.signIn.SignInViewUI {

		private currentOpt: number;	//当前选中的

		constructor() {
			super();
			this.Init();
			this.AddEvent();
		}

		private Init() {
			this.UpDateList();
			let typeStr = GetInfoAttr.Instance.GetText(7007);
			let explainStr = GetInfoAttr.Instance.GetText(7008);
			this.type.text = typeStr;
			this.explain.text = explainStr;
		}

		/**添加事件 */
		private AddEvent() {
			this.on(Laya.Event.REMOVED, this, this.OnDestroy);
			this.close.on(Laya.Event.CLICK, this, this.CloseUI);
			Event.RegistEvent('UpDateList', Laya.Handler.create(this, this.UpDateList));
		}

		/**销毁按钮侦听器 */
		private OnDestroy(): void {
			this.offAll();
			Event.RemoveEvent('UpDateList', Laya.Handler.create(this, this.UpDateList));
		}

		/**关闭UI */
		private CloseUI() {
			UIManager.Instance.DestroyUI("SignInView", [ViewUpRoot]);
			//播放按钮音效
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
		}

		private AddList() {
			let signIn_data: any = SignInLogic.Instance.ListData;
			let list_data: any = [];
			for (let i in signIn_data) {
				list_data[Number(i)] = [];
				list_data[Number(i)] = signIn_data[i];
			}
			this.signInList.array = list_data;
		}
		private UpDateList() {
			//this.signInList.array[SignInLogic.Instance.ToDayNum].bAlready = true;
			this.AddList();
			this.signInList.renderHandler = new Laya.Handler(this, this.SetSignInList);

			this.okBtn.on(Laya.Event.CLICK, this, this.ClickOkBtn);
			if (SignInLogic.Instance.ToDayAlr) {
				this.txt.text = "已领取";
				this.okBtn.gray = true;
				this.okBtn.off(Laya.Event.CLICK, this, this.ClickOkBtn);
			}
			else {
				this.txt.text = "领取";
				this.okBtn.gray = false;
			}
			this.ClickBtn(SignInLogic.Instance.ToDayNum);

		}
		/** 
		 * 设置每日奖励list样式
         * @param item 单个box
         * @param index 索引
		*/
		private SetSignInList(item, index: number): void {
			let bj: Laya.Image = item.getChildByName("bj");
			let vip: Laya.Image = item.getChildByName("vip");
			let opt: Laya.Image = item.getChildByName("opt");
			let hui: Laya.Label = item.getChildByName("hui");
			let name: Laya.Label = item.getChildByName("name");
			let dayNum: Laya.Label = item.getChildByName("dayNum");
			let already: Laya.Image = item.getChildByName("already");
			let itemIcon: Laya.Image = item.getChildByName("itemIcon");
			let clickBtn: Laya.Button = item.getChildByName("clickBtn");

			let dayId = index + 1;
			let list_data: any = this.signInList.array[dayId];

			dayNum.text = dayId.toString();

			opt.visible = false;
			name.color = "#ffffff";
			dayNum.color = "#eceac8";
			bj.skin = "ui_sign/btn-yeqian-weiling.png";
			hui.visible = false;
			list_data.bOpt == true ? opt.visible = true : opt.visible = false;

			list_data.bAlready == true ? already.visible = true : already.visible = false;

			if (list_data.btToDay) {
				//name.color = "#fffffc";
				dayNum.color = "#b7aabc";
				bj.skin = "ui_sign/btn-yeqian-danri.png";
			}

			if ((list_data.bOverdue && !list_data.btToDay) || list_data.bAlready) {
				bj.skin = "ui_sign/btn-yeqian-yiling.png";
				hui.visible = true;
			}
			if (list_data.itemType == BaseDefine.ItemTypePro) {
				let itemCfg = ItemConfig[list_data.itemId];
				let iconUrl = itemCfg.strIconID_B;
				let nameString = GetInfoAttr.Instance.GetText(itemCfg.dwItemName)
				list_data.itemNum == 1 ? name.text = nameString : name.text = "x" + list_data.itemNum;
				name.color = BaseDefine.LabelColor[itemCfg.dwItemQuality];
				itemIcon.skin = "ui_icon/" + iconUrl;
			}
			clickBtn.on(Laya.Event.CLICK, this, this.ClickBtn, [dayId]);

			vip.visible = SignConfig[dayId].isVipDouble == 1;
		}
		/**点击触发 */
		private ClickBtn(index: number) {
			let signIn_data: any = SignInLogic.Instance.ListData;
			this.currentOpt = index;
			for (let i in signIn_data) {
				signIn_data[i].bOpt = false;
			}
			if (index < 1) return;
			signIn_data[index].bOpt = true;
			//signIn_data[SignInLogic.Instance.ToDayNum].bOpt = true;
			this.AddList();
			this.signInList.renderHandler = new Laya.Handler(this, this.SetSignInList);
		}

		/** 点击领取*/
		private ClickOkBtn() {
			if (IsAD()) {
				let times = AdvertisingManager.Instance.bnWXAdertisingTimes;
				if (times) {
					UIManager.Instance.CreateUI("AdvertisementView", [ViewUpRoot, AdvertisementType.signIn]);
				}else{
					SignInLogic.Instance.SendReqSignIn();//普通签到
				}
			} else {
				SignInLogic.Instance.SendReqSignIn();//普通签到
			}
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3");

		}
	}
}