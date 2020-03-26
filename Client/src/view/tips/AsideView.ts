module H52D_Framework {
	AddViewResource("AsideView", [
		{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
		{ url: "res/ui/ui_consumer.atlas", type: Laya.Loader.ATLAS },
		{ url: "res/ui/ui_guid.atlas", type: Laya.Loader.ATLAS }
	]);
	export class AsideView extends ui.tips.AsideViewUI {
		private readonly character: string[] = ["<br>", "&nbsp;", "&lt;", "&gt;", "&amp;", "&quot;", "&apos;"];
		//模型位置
		private AY: number;
		private ASX: number;
		private AEX: number;
		//文本位置
		private CSY: number;
		private CEY: number;
		/** 数据列表 */
		private list: Object[];
		/** 当前索引 */
		private index: number;
		/** 人物模型 */
		private avatar: Avatar;
		/** 加载路径 */
		private path: string;
		/** 写字当前索引 */
		private writeIndex: number;
		/** 可以点击 */
		private canClick: boolean;
		/** 当前文本 */
		private currentContent: Laya.HTMLDivElement;
		/** 出场方式 */
		private position: number;
		/** 回调函数 */
		private callBack: Laya.Handler;
		/** 对话上一个是不是队长 */
		private captain:boolean = false;

		constructor(buf: any) {
			super();
			let id: number = buf[1];
			this.callBack = buf[2];
			let cfg: Object = AsideConfig[id];
			if (cfg == null) {
				this.Exit();
			}
			else {
				this.list = [];
				for (let i in cfg) {
					this.list.push(cfg[i]);
				}
				this.index = 0;
				this.position = this.list[this.index]["position"];
				this.hero.visible = this.position == 1 || this.position == 2;
				this.black.visible = this.position == 0;

				if (this.position == 0) {
					//没有英雄，则显示黑屏
					this.currentContent = this.tx_black;
					SetHtmlStyle(this.currentContent, 38, "#ffffff", "left");
					this.ContentWrite();
				}
				else {
					this.Location(this.position);
					this.currentContent = this.tx_hero;
					SetHtmlStyle(this.currentContent, 28, "#16184a", "left");
					this.canClick = false;
					this.path = "";
					this.Action();
				}
				this.InitEvent();
			}
		}

		private InitEvent() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.on(Laya.Event.CLICK, this, this.ClickHander);
		}

		private Destroy() {
			if (this.callBack) {
				this.callBack.run();
			}
			this.offAll();
			Tick.ClearAll(this);
			if (this.avatar) {
				this.avatar.Destroy();
				this.avatar = null;
			}
		}

		/** 点击事件 */
		private ClickHander() {
			if (this.canClick && this.index < this.list.length) {
				//字没有写完，让写字瞬间完成
				if (this.writeIndex < this.list[this.index]["strtext"].length) {
					this.writeIndex = this.list[this.index]["strtext"].length;
					this.Write();
				}
				//字写完了，条到下一步
				else {
					this.NextStep();
				}
				SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
			}
		}

		/** 下一步动作 */
		private NextStep() {
			Tick.Clear(this, this.NextStep);
			//下一步有内容，跳转到下一步内容
			if (typeof (this.index) == "number" && ++this.index < this.list.length) {
				this.Action();
			}
			//最后一步，退出
			else {
				this.Exit();
			}
		}

		/** 退出 */
		private Exit() {
			this.canClick = false;
			Laya.Tween.to(this.avart_bg, { x: this.ASX }, 200, Laya.Ease.linearInOut);
			Laya.Tween.to(this.text_bg, { y: this.CSY }, 200, Laya.Ease.linearInOut);
			Laya.Tween.to(this, { alpha: 0 }, 300, Laya.Ease.linearInOut, null, 200);
			OneTimer(500, () => {
				UIManager.Instance.DestroyUI(this.name, [ViewStoryRoot]);
			});
		}

		/** 模型的动作 */
		private Action() {
			let path: string = this.list[this.index]["strmodel"];
			if (path == "0") {
				if (this.avatar != null) {
					this.avatar.Destroy();
				}
				this.path = path;
				this.tx_name.text = GetInfoAttr.Instance.GetText(this.list[this.index]["name"]);
				this.Location(this.list[this.index]["position"]);
				this.ContentWrite();
			}
			else if (this.path != path && (path != "-1" || !this.captain)) {
				//特殊处理，使用队长头像及姓名
				if(path == "-1"){
					let list = HeroManager.Instance.Herolist
					for(let heroid in list){
						if(list[heroid].location == 4){
							this.path = list[heroid].ModlePath;
							this.tx_name.text = GetInfoAttr.Instance.GetText(list[heroid].heroCfg.name);
							this.captain = true;
							break;
						}
					}
				}
				else{
					this.path = path;
					this.tx_name.text = GetInfoAttr.Instance.GetText(this.list[this.index]["name"]);
					this.captain = false;
				}
				this.Location(this.list[this.index]["position"]);
				let direction: AvatarDirection = this.list[this.index]["direction"] == 1 ? AvatarDirection.right : AvatarDirection.left;
				let scale = this.list[this.index]["scaling"];
				if (this.avatar) {
					this.avatar.Destroy();
				}
				//有英雄，显示带英雄面板
				this.avatar = new Avatar(this.avart_bg)
				this.avatar.Load(this.path, direction, scale, 0, 0, Laya.Handler.create(this, this.Complete));
			}
			else {
				this.AvatarPlay();		//说话
				this.ContentWrite();	//写字
			}
		}

		/** 动作加载完成 */
		private Complete() {
			if (this.list[this.index] == null) {
				return;
			}
			if (this.avatar) {
				this.avatar.Play(this.list[this.index]["tole"]);
			}
			Laya.Tween.to(this.avart_bg, { x: this.AEX }, 200);
			Laya.Tween.to(this.text_bg, { y: this.CEY }, 200);
			OneTimer(200, () => {
				this.AvatarPlay();
				this.ContentWrite();
			})
		}

		/** 人物说话动作 */
		private AvatarPlay() {
			this.avart_bg.x = this.AEX;
			this.canClick = false;
			if (this.list && this.index < this.list.length && this.avatar) {
				this.avatar.Play(this.list[this.index]["speak"], false, true, () => {
					if (this.avatar && this.list && this.index < this.list.length) {
						this.avatar.Play(this.list[this.index]["tole"]);
						this.canClick = true;
					}
					this.canClick = true;
				});
				SoundManager.Instance.OnPlaySound(this.list[this.index]["strsound"]);
			}
			else {
				this.canClick = true;
			}
		}

		/** 内容页写字 */
		private ContentWrite() {
			this.text_bg.y = this.CEY;
			this.canClick = true;
			this.writeIndex = 0;
			this.Write();
			Tick.Loop(60, this, this.Write);
		}

		/** 写字动作 */
		private Write() {
			if (this.index < this.list.length) {
				let content: string = this.list[this.index]["strtext"];
				for (let i in this.character) {
					let char: string = this.character[i];
					if (content.slice(this.writeIndex, this.writeIndex + char.length) == char) {
						this.writeIndex += char.length;
					}
				}
				this.currentContent.innerHTML = content.slice(0, this.writeIndex) + "_";
				this.writeIndex++;
				// 写字完成
				if (this.writeIndex >= content.length) {
					this.currentContent.innerHTML = content;
					Tick.Clear(this, this.Write);
					/** 等待下一步 */
					Tick.Once(5000, this, this.NextStep);
				}
			}
			else {
				Tick.Clear(this, this.Write);
				Tick.Once(5000, this, this.NextStep);
			}
		}

		/** 位置 */
		private Location(pos: number) {
			if (pos == 1) {
				this.AY = 900;
				this.ASX = -200;
				this.AEX = 120;
				this.CEY = 800;
			}
			else if (pos == 2) {
				this.AY = 700;
				this.ASX = 950;
				this.AEX = 600;
				this.CEY = 600;
			}
			this.CSY = 1500;
			this.avart_bg.y = this.AY;
			this.avart_bg.x = this.ASX;
			this.text_bg.y = this.CSY;
		}

	}
}