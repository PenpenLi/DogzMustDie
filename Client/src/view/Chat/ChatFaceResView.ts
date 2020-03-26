module H52D_Framework {
	export class ChatFaceResView extends ui.Chat.ChatFaceResViewUI {
		/** 回调方法 **/
		private _callBack: Laya.Handler;
		private _pageNum: number = 0;
		private _offX: number = 0;

		constructor() {
			super();
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			this.list.hScrollBarSkin = "";
			this.list.array = ChatLogic.Inst.FaceList
			//this.list.repeatX = ChatLogic.Inst.FaceList.length
			this.list.renderHandler = new Laya.Handler(this, this.RenderHandler);
			this.on(Laya.Event.MOUSE_DOWN, this, () => {
				this._offX = Laya.MouseManager.instance.mouseX;
			});
			this.rights.visible = true
			this.lefts.visible = false
			this.on(Laya.Event.MOUSE_UP, this, () => {
				//向左画
				if (this._offX - Laya.MouseManager.instance.mouseX > 150) {
					if (this._pageNum < ChatLogic.Inst.FaceList.length - 1) {
						this._pageNum++;
					}
				} else if (Laya.MouseManager.instance.mouseX - this._offX > 150) {
					if (this._pageNum > 0) {
						this._pageNum--;
					}
				}
				this.list.tweenTo(this._pageNum, 2.0, new Laya.Handler(this, () => {
					this.list.scrollBar.stopScroll()
					this.UpdateLeftRight()
				}));
			});

			this.lefts.on(Laya.Event.CLICK, this, () => {
				if (this._pageNum > 0) {
					this._pageNum--;
					this.list.tweenTo(this._pageNum, 2.0, new Laya.Handler(this, () => {
						this.list.scrollBar.stopScroll()
						this.UpdateLeftRight()
					}));
				}
			})

			this.rights.on(Laya.Event.CLICK, this, () => {
				if (this._pageNum < ChatLogic.Inst.FaceList.length - 1) {
					this._pageNum++
					this.list.tweenTo(this._pageNum, 2.0, new Laya.Handler(this, () => {
						this.list.scrollBar.stopScroll()
						this.UpdateLeftRight()
					}));
				}
			})
		}

		/** 刷新左右按钮 */
		private UpdateLeftRight() {
			this.rights.visible = true
			this.lefts.visible = true
			if (this._pageNum == 0) {
				this.lefts.visible = false
			} else if (this._pageNum == ChatLogic.Inst.FaceList.length - 1) {
				this.rights.visible = false
			}
		}


		/**  @param callBack:初始化回调(点击表情回调通知点击的图片类型) **/
		public init(callBack: Laya.Handler): void {
			this._callBack = callBack;
			this.initEvent();
		}

		/** click事件添加**/
		private initEvent(): void {
		}


		/** click事件移除,便于销毁调用**/
		private removeEvent(): void {
		}

		/**list */
		private RenderHandler(item: Laya.Box, index: number): void {
			let page = ChatLogic.Inst.FaceList[index];
			for (let idx = 0; idx < item._childs.length; idx++) {
				let id = page[idx]
				let itemChild: Laya.Image = item.getChildByName("item" + idx) as Laya.Image
				if (id != null) {
					itemChild.visible = true
					let icon = "i_f"
					if (IsNotBaiDuSdk()) {
						icon = "face"
					}
					itemChild.skin = "ui_chat/" + icon + id + ".png"
					itemChild.on(Laya.Event.CLICK, this, this.onFaceImgClick, [id]);
				} else {
					itemChild.visible = false
				}
			}
		}


		/** 表情图片点击注册事件  **/
		private onFaceImgClick(type: number, evt: Laya.Event): void {
			//runWith执行处理器，携带额外数据。"@" + type + "@"就是图片类型
			this._callBack != null && (this._callBack.runWith(["@" + type + "@"]));
		}
		/** 销毁 **/
		public dispose(): void {
			this.removeEvent();
			this.removeSelf();
		}

		private Destroy(): void {
			this.offAll();
		}

	}
}


