module H52D_Framework {

	export class ChatLineView extends ui.Chat.ChatLineViewUI {
		private _data: ChatData;

		constructor() {
			super();
			this.on(Laya.Event.REMOVED, this, this.Destroy);
		}


		public Init(data: ChatData): void {
			this.pos(0, 0);

			this._data = data;

			switch (data.smallChannel) {
				case E_ChatChannel.C_WORLD:
					this.downBg.skin = "ui_chat/img-duihuakuang-liaotian.png";
					break;
				case E_ChatChannel.C_CAMP:
					this.downBg.skin = "ui_chat/img-zijiduihuakuang-liaotian.png";
					break;
				default:
					break;
			}

			//角色头像
			if (data.smallChannel != E_ChatChannel.C_SYSTEM) {
				let headId = data.headId;
				if (headId == 0) {
					this.headImage.skin = "ui_head/icon_ui_01.png";
				}
				else {				
					this.headImage.skin = "ui_icon/" + HeroConfig[headId].strIcon;				
				}
				this.headImage.on(Laya.Event.CLICK, this, () => {
					if (data.roleID != MasterPlayer.Instance.player.ID) {
						UIManager.Instance.CreateUI("InteractView", [ViewUpRoot, data.roleID, data.strName]);
					}
				})
			} else {
				this.headImage.skin = "ui_chat/img-font-xitong.png";
				this.timeLabel.visible = false;
				this.channelLabel.visible = false;
				this.textfieldUp.visible = false;
			}

			// 频道名称
			this.channelLabel.text = ChateNameColor[data.smallChannel][0];
			this.channelLabel.color = ChateNameColor[data.smallChannel][1];

			SetHtmlStyle(this.textfieldUp, 20, ChateNameColor[data.smallChannel][1], "middle", true);
			SetHtmlStyle(this.textfieldDown, 20, ChateNameColor[data.smallChannel][1], "middle");

			//聊天时间
			this.timeLabel.text = data.time;
			let vipIcon = "";
			if (MasterPlayer.Instance.player.ID == data.roleID) {
				SetHtmlStyle(this.textfieldUp, 20, "#ffffff", "left", true);
			} else {
				SetHtmlStyle(this.textfieldUp, 20, "#5a456a", "left", true);
			}
			if (MasterPlayer.Instance.player.ID == data.roleID) {
				if (MasterPlayer.Instance.player.IsVip) {
					vipIcon = "<img src= 'ui_camp/icn-vip-jiemian-tongyong.png' width='42px' height='22px'></img>";
				}
				this.textfieldUp.innerHTML = vipIcon + " 我";
				this.downBg.skin = "ui_chat/img-zijiduihuakuang-liaotian.png"
			} else {
				if (MasterPlayer.Instance.player.getIsVip(data.vipLevel)) {
					vipIcon = "<img src= 'ui_camp/icn-vip-jiemian-tongyong.png' width='42px' height='22px'></img>";
				}
				this.textfieldUp.innerHTML = vipIcon + data.strName;
				this.downBg.skin = "ui_chat/img-duihuakuang-liaotian.png"
			}
			let msg: string = data.msg;
			if (msg.search("1~%") != -1) {
				msg = msg.replace("1~%", "");
				let tempArr = msg.split("~");
				let nime: string = GetHtmlStrByColor("【" + GetInfoAttr.Instance.GetText(ItemConfig[tempArr[2]].dwItemName) + "】", BaseDefine.LabelColor1[ItemConfig[tempArr[2]].dwItemQuality]);
				let nime1: string = GetHtmlStrByColor(tempArr[1], BaseDefine.LabelColor1[ItemConfig[tempArr[2]].dwItemQuality]);
				this.textfieldDown.innerHTML = "赠送" + nime + "给" + nime1;
			} else {
				this.textfieldDown.innerHTML = ChatLogic.Inst.OnGetChatInfo(data.msg);
			}
		}

		/** 销毁 **/
		public dispose(): void {
			this.removeSelf();
		}

		private Destroy(): void {
			this.offAll();
		}
	}

}

