module H52D_Framework {
	AddViewResource("ChatView",
		[
			{ url: "res/ui/ui_chat.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_head.atlas", type: Laya.Loader.ATLAS },
		]);
	export class ChatView extends ui.Chat.ChatViewUI {
		/**表情容器UI **/
		private _chatFaceResUI: ChatFaceResView;
		/** 窗口显示是否在运动中 **/
		private _isFaceMove: boolean;
		/**聊天内容条目UI存放容器 **/
		private _chatLineViewArr: Object = {};
		/**聊天内容上限设置（默认最多30条） **/
		private _chatLimitInt: Object = {};
		/**聊天内容条目总高度 **/
		private _chatMsgTotalHeight: Object = {};
		private _curChannel: E_ChatChannel;
		constructor() {
			super();
			this.chatbg.top = wxsclae - 64
			this.Init();
			this.InitEvent();
		}

		private Update() {
			let length: number = this.chatInfo.text.length;
			if (length >= ChatLogic.Inst.GetLetterNumLimit()) {
				this.chatInfo.text = this.chatInfo.text.substr(0, 25);
			}
			if (ChatLogic.Inst.GetNewMsgOrder()[E_ChatChannel.C_WORLD] > 0) {
				this.worldpoint.visible = true;
			} else {
				this.worldpoint.visible = false;
			}
			if (ChatLogic.Inst.GetNewMsgOrder()[E_ChatChannel.C_CAMP] > 0) {
				this.camppoint.visible = true;
			} else {
				this.camppoint.visible = false;
			}
			if (this.chatInfo.focus) {
				this.onSelectFaceClick1()
			}

			if (this.chatInfo.focus) {
				if (this.chatInfo.text == "请输入聊天内容") {
					this.chatInfo.text = "";
				}
			} else {
				if (this.chatInfo.text == "") {
					this.chatInfo.text = "请输入聊天内容";
				}
			}

			if (this.selectFaceClip.name == "show" && this.chatInfo.text == "请输入聊天内容") {
				this.chatInfo.text = "";
			}
		}

		private OnCloseBtnClick(): void {
			ChatLogic.Inst.SaveChannelChatMsg(this._curChannel, this.chatInfo.text);
			UIManager.Instance.DestroyUI("ChatView", [ViewUpRoot]);
		}

		/** 初始化聊天内容 **/
		public Init(): void {
			for (let index = 0; index < E_ChatChannel.C_CNUM - 1; index++) {
				this._chatLineViewArr[index] = [];
				this._chatLimitInt[index] = ChatLogic.Inst.GetChatLineNum(index);//配置表
				this._chatMsgTotalHeight[index] = 0;

				this["chatPanel" + index].vScrollBarSkin = "";//滚动条隐藏
				this["chatPanel" + index].vScrollBar.isVertical = true;//滚动条的方向为垂直滚动
				this["chatPanel" + index].vScrollBar.elasticBackTime = 600;//设置橡皮筋回弹时间
				this["chatPanel" + index].vScrollBar.elasticDistance = 200;//设置橡皮筋回弹距离

				this["panelBgImage" + index].visible = false;
			}
			this._curChannel = ChatLogic.Inst.GetCurChannel();
			ChatLogic.Inst.SetNewMsgOrder(this._curChannel);
			ChatLogic.Inst.SetCurChannel(this._curChannel);
			this["panelBgImage" + this._curChannel].visible = true;
			//从对象池创建表情UI面板
			this._chatFaceResUI = Laya.Pool.getItemByClass("chatFaceResView", ChatFaceResView);
			//初始化回调
			this._chatFaceResUI.init(new Laya.Handler(this, this.onGetFaceType));
			this._chatFaceResUI.bottom = 70
			//表情UI面板位置设置
			// if (this._chatFaceResUI) {
			// 	let num: number = G_StageHeight / Laya.Browser.clientHeight;
			// 	this._chatFaceResUI.width = Laya.Browser.clientWidth * num;
			// 	this._chatFaceResUI.backGround.centerX = 0;
			// }
			//表情UI面板添加到聊天室面板
			this.addChild(this._chatFaceResUI);
			//表情UI面板默认为不可访问状态
			this._chatFaceResUI.visible = false;//隐藏显示

			this.btn0.skin = "ui_rank/img-lan-xuan.png";
			this.btn1.skin = "ui_rank/img-lan-weixuan.png";
			if (this._curChannel == E_ChatChannel.C_WORLD) {
				this.btn0.skin = "ui_rank/img-zi-xuan.png";
			} else if (this._curChannel == E_ChatChannel.C_CAMP) {
				this.btn1.skin = "ui_rank/img-zi-weixuan.png";
			}

			this.InitPannel();
			this.changePanel();

			Tick.FrameLoop(1, this, this.Update);
		}

		private InitPannel(): void {
			for (let index = 0; index < E_ChatChannel.C_CNUM - 1; index++) {
				//清除所有Line
				this["chatPanel" + index].destroyChildren();
				this._chatMsgTotalHeight[index] = 0;
				// this.chatInfo.text = ChatLogic.Inst.GetChannelChatMsg(this._curChannel);
				let arr: Array<ChatData> = ChatLogic.Inst.GetChatMsg(index);
				if (arr == null || arr.length == 0) {
					continue;
				}
				for (let i = 0; i < arr.length; i++) {
					let chatLineUI: ChatLineView = Laya.Pool.getItemByClass("chatLineView", ChatLineView);
					chatLineUI.Init(arr[i]);
					chatLineUI.alpha = 1;
					this["chatPanel" + index].addChild(chatLineUI);
					chatLineUI.y = this._chatMsgTotalHeight[index];
					this._chatLineViewArr[index].push(chatLineUI);
					this._chatMsgTotalHeight[index] += chatLineUI.height;
					this["chatPanel" + index].vScrollBar.max = this["chatPanel" + index].contentHeight;
					this["chatPanel" + index].vScrollBar.value = this["chatPanel" + index].vScrollBar.max;
				}
			}
		}

		/** 事件添加  **/
		private InitEvent(): void {
			this.selectFaceClip.on(Laya.Event.CLICK, this, this.onSelectFaceClick);
			this.sendMsgBtn.on(Laya.Event.CLICK, this, this.OnSendClick);
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.on(Laya.Event.CLICK, this, this.onSelectFaceClick1);
			this.chatInfo.on(Laya.Event.CLICK, this, this.onSelectFaceClick1);
			this.closeBtn.on(Laya.Event.CLICK, this, this.OnCloseBtnClick);
			this.btn0.on(Laya.Event.CLICK, this, this.OnChannelTabClick, [E_ChatChannel.C_WORLD]);
			this.btn1.on(Laya.Event.CLICK, this, this.OnChannelTabClick, [E_ChatChannel.C_CAMP]);

			Event.RegistEvent("UpdateAllPannelEvent", Laya.Handler.create(this, this.UpdateAllPannelEvent));
			Event.RegistEvent("RefreshList", Laya.Handler.create(this, this.RefreshList));
		}

		private UpdateAllPannelEvent(buf: any): void {
			this._curChannel = buf;
			this.InitPannel();
		}

		private OnChannelTabClick(index: number): void {
			//播放按钮音效
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
			if (index == E_ChatChannel.C_CAMP) {
				if (MasterPlayer.Instance.player.CampID == 0 || !MasterPlayer.Instance.player.CampID) {
					TipsLogic.Instance.OpenSystemTips(10017);
					return;
				}
			}
			this._curChannel = index;
			//记录上一个频道输入框中的信息
			ChatLogic.Inst.SaveChannelChatMsg(this._curChannel, this.chatInfo.text);
			ChatLogic.Inst.SetNewMsgOrder(this._curChannel);
			ChatLogic.Inst.SetCurChannel(this._curChannel);
			this.changePanel();

			this.btn0.skin = "ui_rank/img-lan-xuan.png";
			this.btn1.skin = "ui_rank/img-lan-weixuan.png";
			if (index == E_ChatChannel.C_WORLD) {
				this.btn0.skin = "ui_rank/img-zi-xuan.png";
			} else if (index == E_ChatChannel.C_CAMP) {
				this.btn1.skin = "ui_rank/img-zi-weixuan.png";
			}
		}

		private changePanel(): void {
			this.sendBgImage.visible = true;
			for (let index = 0; index < E_ChatChannel.C_CNUM - 1; index++) {
				this["panelBgImage" + index].visible = false;
			}
			this["panelBgImage" + this._curChannel].visible = true;
			this.chatInfo.text = ChatLogic.Inst.GetChannelChatMsg(this._curChannel);
		}

		/** 事件移除，便于销毁调用**/
		private removeEvent(): void {
			//移除UI面板打开按钮的click事
			this.selectFaceClip.off(Laya.Event.CLICK, this, this.onSelectFaceClick);
			//移除发送消息按钮的click事件
			this.sendMsgBtn.off(Laya.Event.CLICK, this, this.OnSendClick);
		}

		/**发送消息 */
		private OnSendClick(evt: Event): void {
			//匹配表情后的字符串
			this.chatInfo.text = SensitiveWord.Instance.Replace(this.chatInfo.text);
			let chatStr: string = this.chatInfo.text;
			//检测内容是否为空
			if (chatStr == null || chatStr == "" || chatStr == "请输入聊天内容") {
				this.chatInfo.text = "";
				TipsLogic.Instance.OpenSystemTips("发送内容不能为空", 1);
				return;
			}

			//各频道发言间隔
			let nowDate: Date = new Date();
			let timeSeconds: number = (nowDate.getDate() * 24 * 60 + nowDate.getHours() * 60 + nowDate.getMinutes()) * 60 + nowDate.getSeconds();
			let timeInterval: number = timeSeconds - ChatLogic.Inst.GetChatTime(this._curChannel);
			let restTime: number;
			switch (this._curChannel) {
				case E_ChatChannel.C_WORLD:
					ChatLogic.Inst.GMCommondMsg(chatStr);
					// let level = OpenGrade_Cfg[233].Level;
					// if (KMainHero.Inst.hero.info.level < level) {
					// 	TipsLogic.Instance.OpenSystemTips(100007, level, "世界聊天");
					// 	return;
					// }
					// let restTime: number = GameParamConfig["worldchanneltime"] - timeInterval;  //nearbytime
					restTime = 5 - timeInterval;  //nearbytime
					// if (timeInterval < GameParamConfig["worldchanneltime"]) {
					if (timeInterval < 5) {
						TipsLogic.Instance.OpenSystemTips(10013, restTime);
						return;
					}
					break;
				case E_ChatChannel.C_CAMP:
					// if (KMainHero.Inst.hero.info.guildId <= 0 || !KMainHero.Inst.hero.info.guildId) {
					// 	TipsLogic.Instance.OpenSystemTips(100048);
					// 	return;
					// }
					// let restTime: number = GameParamConfig["worldchanneltime"] - timeInterval;  //nearbytime
					restTime = 5 - timeInterval;  //nearbytime
					// if (timeInterval < GameParamConfig["worldchanneltime"]) {
					if (timeInterval < 5) {
						TipsLogic.Instance.OpenSystemTips(10013, restTime);
						return;
					}
					break;
				default:
					break;
			}
			RemoteCall.Instance.Send("K_SendChatInfoMsg", this._curChannel, [0, chatStr, {}],
				GetSig(MasterPlayer.Instance.player.ID.toString(), chatStr));
			chatStr = ChatLogic.Inst.OnGetChatInfo(this.chatInfo.text);
			//保存最新的聊天时间
			ChatLogic.Inst.SaveChatTime(this._curChannel);
			this.chatInfo.text = "";
		}

		/** 重置chatlineUI的所有位置 **/
		private onReChatLinePos(): void {
			this._chatMsgTotalHeight[this._curChannel] = 0;
			let chatLineUI: ChatLineView
			for (let i: number = 0, sz: number = this._chatLineViewArr[this._curChannel].length; i < sz; i++) {
				chatLineUI = this._chatLineViewArr[this._curChannel][i] as ChatLineView;
				chatLineUI.y = this._chatMsgTotalHeight[this._curChannel];
				this._chatMsgTotalHeight[this._curChannel] += chatLineUI.height;
			}
		}

		private onSelectFaceClick1(): void {
			if (Laya.MouseManager.instance.mouseY > 876 && Laya.MouseManager.instance.mouseY < 1122) {
				return;
			}
			//如果表情面板为运动状态，则停止onSelectFaceClick方法的执行
			if (this._isFaceMove)
				return;
			//如果UI面板打开按钮的name为show，表示面板为打开状态，点击UI面板打开按钮，将其隐藏
			if (this.selectFaceClip.name == "show") {
				//点击UI面板打开按钮，触发缓动，则面板状态为运动中
				this._isFaceMove = true;
				this.selectFaceClip.name = "hide";
				//设置缓动初始值alpha为1
				this._chatFaceResUI.alpha = 1;
				//缓动：alpha从1开始，经过200毫秒缓动到0，即隐藏状态
				Laya.Tween.to(this._chatFaceResUI, { alpha: 0 }, 200, Laya.Ease.backIn, Laya.Handler.create(this, this.onOperateFaceUI, [false]));
			}
		}

		/** 显示表情选择框 **/
		private onSelectFaceClick(evt: Laya.Event): void {
			//如果表情面板为运动状态，则停止onSelectFaceClick方法的执行
			//this._isFaceMove = !this._isFaceMove;
			if (this._isFaceMove)
				return;
			//点击UI面板打开按钮，触发缓动，则面板状态为运动中
			this._isFaceMove = true;
			//如果UI面板打开按钮的name为show，表示面板为打开状态，点击UI面板打开按钮，将其隐藏
			if (this.selectFaceClip.name == "show") {
				this.selectFaceClip.name = "hide";
				//设置缓动初始值alpha为1
				this.chatInfo.text = "请输入聊天内容"
				this._chatFaceResUI.alpha = 1;
				//缓动：alpha从1开始，经过200毫秒缓动到0，即隐藏状态
				Laya.Tween.to(this._chatFaceResUI, { alpha: 0 }, 200, Laya.Ease.backIn, Laya.Handler.create(this, this.onOperateFaceUI, [false]));
			}
			//如果UI面板的name不为show，表示面板为关闭状态，点击UI面板打开按钮，将其显示
			else {
				this.selectFaceClip.name = "show";
				//设置缓动初始值alpha为0
				this._chatFaceResUI.alpha = 0;
				this.chatInfo.text = ""
				//缓动：alpha从0开始，经过200毫秒缓动到1，即显示状态
				Laya.Tween.to(this._chatFaceResUI, { alpha: 1 }, 200, Laya.Ease.backOut, Laya.Handler.create(this, this.onOperateFaceUI, [true]));
			}
		}

		/** 缓动完成回调**/
		private onOperateFaceUI(type: boolean): void {
			//根据面板显示/隐藏状态，设置面板是否可访问
			this._chatFaceResUI.visible = type;
			//缓动完成，面板运动结束
			this._isFaceMove = false;
		}

		/** 获取点击的表情图片类型 **/
		private onGetFaceType(type: string): void {
			this.chatInfo.text += type;//将图片类型以字符串的形式显示到输入文本框
		}

		private RefreshList(): void {
		}

		private Destroy(): void {
			this.offAll();
			Event.RemoveEvent("UpdateAllPannelEvent", Laya.Handler.create(this, this.UpdateAllPannelEvent));
			Event.RemoveEvent("RefreshList", Laya.Handler.create(this, this.RefreshList));
			ChatLogic.Inst.SaveChannelChatMsg(this._curChannel, this.chatInfo.text);
		}
	}
}
