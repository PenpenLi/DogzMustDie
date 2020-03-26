module H52D_Framework {
	AddViewResource("ShareBaseView", [
		{ url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
		{ url: "res/ui/ui_share.atlas", type: Laya.Loader.ATLAS },
		{ url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
		{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
		{ url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
	]);

	enum Type {
		share,
		invitation
	}
	/**
	 * @class 分享邀请页面
	 * @author zhangyusong 
	 **/
	export class ShareBaseView extends ui.share.ShareBaseViewUI {
		private readonly skin_1_up: string = "ui_rank/img-lan-xuan.png";
		private readonly skin_1_down: string = "ui_rank/img-zi-xuan.png";
		private readonly skin_2_up: string = "ui_rank/img-lan-weixuan.png";
		private readonly skin_2_down: string = "ui_rank/img-zi-weixuan.png";
		private readonly piclist: Array<string> = [
			"ui_icon/icon-tequan-hjzl.png",
			"ui_icon/icon-tequan-ssxjs.png",
			"ui_icon/icon-tequan-flhf.png",
			"ui_icon/icon-tequan-tjjy.png",
			"ui_icon/icon-tequan-jyjc.png",
		];
		private readonly SHARE_INFOR_ID = 6026;
		private readonly SHARE_NOTICE_ID = 6027;
		private readonly IMMEDIATELY_ID = 6030;
		private readonly EVERY_DAY_ID = 6031;

		private shareRewardList: Array<ShareRewardVo>;
		/** 倒计时 */
		private countdown: number;
		/** 邀请、领奖按钮类型 */
		private receiveType: number = 0;
		/** 邀请列表 */
		private invitationList: Array<InvitationVo>;

		constructor() {
			super();
            PfLog.Inst.SendClientLog(3000, 0);
			this.ShareInit();
			this.InvitationInit();
			this.ChoosePage(Type.share);
			this.EventInit();
			//屏蔽充值版
			if(IsShieldRecharge( ) && !IsAD() ){
				this.imagebg2.y = 10;
				this.imagebg2.height = 593;
				this.imagebg1.visible = false;
			}
			//广告版
			if(IsAD()){
				this.btn_receive.visible = false;
				this.tx_receive.visible = false;
				this.tx_time.x = 388;
				this.tx_time.y = 82;
			}
		}

		private EventInit() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			Event.RegistEvent("InviteTodayNum", Laya.Handler.create(this, this.InvitationNum));
			Event.RegistEvent("ShareInit", Laya.Handler.create(this, this.ShareInit));
			Event.RegistEvent("InviteAwardFrush", Laya.Handler.create(this, this.InvitationFrushList));
			Event.RegistEvent("FrushVipTime", Laya.Handler.create(this, this.FrushVipTime));
			Event.RegistEvent("ZeroRefresh", Laya.Handler.create(this, this.ZeroRefresh));
			this.btn_close.on(Laya.Event.CLICK, this, this.OnClosePanel);
			this.btnlist_share.on(Laya.Event.CLICK, this, this.ChoosePage, [Type.share]);
			this.btnlist_invitation.on(Laya.Event.CLICK, this, this.ChoosePage, [Type.invitation]);
			this.btn_receive.on(Laya.Event.CLICK, this, this.OnInvitationReceive);
			//邀请也是分享
			this.btn_immediate.on(Laya.Event.CLICK, this, this.OnSharePanel);
			this.btn_share.on(Laya.Event.CLICK, this, this.OnSharePanel);
		}

		private Destroy() {
			this.offAll();
			Tick.ClearAll(this);
			Event.RemoveEvent("FrushVipTime", Laya.Handler.create(this, this.FrushVipTime));
			Event.RemoveEvent("ZeroRefresh", Laya.Handler.create(this, this.ZeroRefresh));
			Event.RemoveEvent("InviteTodayNum", Laya.Handler.create(this, this.InvitationNum));
			Event.RemoveEvent("ShareInit", Laya.Handler.create(this, this.ShareInit));
		}

		private OnClosePanel() {
			UIManager.Instance.DestroyUI(this.name, [ViewUpRoot]);
		}

		private ChoosePage(t: Type) {
			this.btnlist_share.skin = t == Type.share ? this.skin_1_down : this.skin_1_up;
			this.btnlist_invitation.skin = t == Type.invitation ? this.skin_2_down : this.skin_2_up;
			this.btnlist_share.labelColors = t == Type.share ? "#eff8bb" : "#bebbf8";
			this.btnlist_invitation.labelColors = t == Type.invitation ? "#eff8bb" : "#bebbf8";
			this.panel_share.visible = t == Type.share;
			this.panel_invitation.visible = t == Type.invitation;
		}

		private OnSharePanel() {
			CallShare(ShareType.base);
		}

		/** 零点刷新 */
		private ZeroRefresh(){
			this.InvitationFrush();
		}

		/*********************** 分享 ***********************/
		private ShareInit() {
			SetHtmlStyle(this.tx_tequan, 20, "#b7abb9", "right", true);
			SetHtmlStyle(this.tx_content, 18, "#b7abb9", "left");
			SetHtmlStyle(this.tx_author, 22, "#5c545d", "right", true);
			this.tx_content.innerHTML = GetInfoAttr.Instance.GetText(this.SHARE_INFOR_ID);
			this.tx_author.innerHTML = GetInfoAttr.Instance.GetText(this.SHARE_NOTICE_ID);
			this.SharePrivilege();
			// 每一个特权次数
			this.shareRewardList = [];
			for (let i: number = 0; i < 5; i++) {
				let vo: ShareRewardVo = new ShareRewardVo();
				this.shareRewardList.push(vo);
				this.shareRewardList[i].pic = this.piclist[i];
				this.shareRewardList[i].name = GetInfoAttr.Instance.GetText(PrivilegeConfig[i + 1].name)
				this.shareRewardList[i].num = MasterPlayer.Instance.getFreeUseNum(i + 1) || 0;
			}
			this.list_tequan.renderHandler = new Laya.Handler(this, (item: Laya.Node, index: number) => {
				item.getChildByName("pic")["skin"] = this.shareRewardList[index].pic;
				item.getChildByName("name")["text"] = this.shareRewardList[index].name;
				item.getChildByName("num")["text"] = this.shareRewardList[index].num;
			});
			this.list_tequan.array = this.shareRewardList;
		}

		/**
		 * 免费特权次数
		 * @param prv 特权次数
		 * @param totle 总次数
		 */
		private SharePrivilege() {
			let totle: number = GameParamConfig["ShareDialyGetFreePrivilegeNum"];
			let prv: number = MasterPlayer.Instance.GetEventDayProByType(EventProEnum.ShareNum);
			if (prv > totle) {
				prv = totle;
			}
			this.tx_tequan.innerHTML = "今日已获得特权次数：<font color='#8edd7a'>" + prv + "</font>\/" + totle + "次";
		}

		/*********************** 邀请 ***********************/
		private InvitationInit() {
			SetHtmlStyle(this.tx_invitation_today, 20, "#d8d9e2", "right");
			SetHtmlStyle(this.tx_invitation_totle, 20, "#d8d9e2", "right");
			this.tx_everyday.text = GetInfoAttr.Instance.GetSystemText(this.EVERY_DAY_ID,IsAD()?2:1);
			this.tx_immediately.text = GetInfoAttr.Instance.GetSystemText(this.IMMEDIATELY_ID);

			this.InvitationFrush();

			this.list_invitation.renderHandler = new Laya.Handler(this, (item: Laya.Node, index: number) => {
				item.getChildByName("rankNum")["text"] = this.invitationList[index].num;
				let itemList: Array<ItemVo> = this.invitationList[index].list;
				let nFlag = 0;
				for (let i in itemList) {
					let item_i: Laya.Image = item.getChildByName("item_" + i) as Laya.Image;
					item_i.getChildByName("itemIcon")["skin"] = GetIcon(itemList[i].strIconID_B);
					item_i.getChildByName("itemName")["text"] = itemList[i].itemStrName;
					item_i.getChildByName("itemNum")["text"] = itemList[i].itemNumber>1?itemList[i].itemNumber:"";
					item_i.getChildByName("itemName")["color"] = BaseDefine.LabelColor[itemList[i].dwItemQuality];
					item_i.getChildByName("item_quaity")["bgColor"] = BaseDefine.ItemBgColor[itemList[i].dwItemQuality];
					item_i.visible = true;
					nFlag = Number(i) + 1;
				}
				for (let n = nFlag; n < 3; n++) {
					let item_i: Laya.Image = item.getChildByName("item_" + n) as Laya.Image;
					item_i.visible = false;
				}
				let content = item.getChildByName("tx_invitation_content") as Laya.Text;
				let showBtn: boolean = this.invitationList[index].num <= MasterPlayer.Instance.newInviteNum;
				content.visible = !showBtn;
				if (content.visible) {
					content.text = this.invitationList[index].content;
				}
				let btnReward: Laya.Button = item.getChildByName("btn_reward") as Laya.Button;
				btnReward.visible = showBtn;
				btnReward.label = this.invitationList[index].recive == 0 ? "领取" : "已领取";
				btnReward.mouseEnabled = this.invitationList[index].recive == 0;
				btnReward.gray = this.invitationList[index].recive != 0;
				btnReward.on(Laya.Event.CLICK, this, this.OnInvitationReward, [this.invitationList[index].num]);
			});
			this.InvitationFrushList();
			this.red_invitation.visible = ShareLogic.Instance.ShowRed();
			//设置列表位置
			let reciveIndex: number = -1;
			let index: number = 0;
			for (; index < this.invitationList.length; index++) {
				let vo: InvitationVo = this.invitationList[index] as InvitationVo;
				if (vo.num <= MasterPlayer.Instance.newInviteNum) {
					if (reciveIndex == -1 && vo.recive == 0) {
						reciveIndex = index;
						break;
					}
				}
			}
			if (reciveIndex == -1) {
				reciveIndex = 0;
			}
			else if (this.invitationList.length - reciveIndex < 2) {
				reciveIndex = this.invitationList.length - 2;
			}
			this.list_invitation.tweenTo(reciveIndex);
		}

		/** 邀请、领奖按钮事件 */
		private OnInvitationReceive() {
			if (this.receiveType == 1) {//邀请
				CallShare(ShareType.base);
			}
			else if (this.receiveType == 2) {//领取
				RemoteCall.Instance.Send("K_ReqGetInviteVip",IsAD());
			}
		}

		/** 领奖列表按钮事件 */
		private OnInvitationReward(rewardID: number) {
			RemoteCall.Instance.Send("K_ReqGetInviteAward", rewardID);
		}

		/** 邀请-刷新 */
		private InvitationFrush(){
			this.InvitationNum();
			this.FrushVipTime();
		}

		/** 邀请人数 */
		private InvitationNum() {
			let daynum: number = MasterPlayer.Instance.GetEventDayProByType( EventProEnum.InvitationNum )	
			if(IsAD()){
				this.tx_invitation_today.innerHTML = "当日邀请人数：<font color='#8edd7a'>" + daynum + "</font>"+ "人";
			}
			else{
				this.tx_invitation_today.innerHTML = "当日邀请人数：<font color='#8edd7a'>" + daynum + "</font>/" + GameParamConfig["VipNeedPlayerNum"] + "人";
			}
			let totlenum: number = MasterPlayer.Instance.newInviteNum;
			this.tx_invitation_totle.innerHTML = "已累计邀请：<font color='#8edd7a'>" + totlenum + "</font>人";
		}

		/** 刷新VIP时间 */
		private FrushVipTime() {
			//永久VIP
			if (MasterPlayer.Instance.player.ExpirationTime == -1) {
				this.tx_time.text = "永久";
				this.btn_receive.gray = true;
				this.btn_receive.visible = false;
			}
			else{
				if(MasterPlayer.Instance.invitaVipTimes >= 5){
					this.btn_receive.label = "已达上限";
					this.btn_receive.gray = true;
					this.btn_receive.mouseEnabled = false;
				}
				else{
					if (MasterPlayer.Instance.invitaVipFlag == 0) {
						let canReceive: boolean = MasterPlayer.Instance.GetEventDayProByType( EventProEnum.InvitationNum ) < GameParamConfig["VipNeedPlayerNum"];
						this.receiveType = canReceive ? 1 : 2;
						this.btn_receive.label = canReceive ? "邀请" : "领取";
						this.btn_receive.gray = false;
						this.btn_receive.mouseEnabled = true;
					}
					else{ //倒计时
						this.btn_receive.label = "今日已领取";
						this.btn_receive.gray = true;
						this.btn_receive.mouseEnabled = false;
					}
				}
				this.countdown = 0;
				if (MasterPlayer.Instance.player.ExpirationTime > Time.serverSecodes) {
					this.countdown = MasterPlayer.Instance.player.ExpirationTime - Time.serverSecodes;
				}
				if(this.countdown > 0){
					Tick.Loop(1000, this, this.ShowTime);
				}
				else{
					this.tx_time.text = GetFormatNumTime(this.countdown);
				}
			}
		}

		private ShowTime() {
			if (--this.countdown >= 0) {
				this.tx_time.text = GetFormatNumTime(this.countdown);
			}
			if (this.countdown <= 0) {
				Tick.Clear(this, this.ShowTime);
			}
		}

		/** 刷新界面，领取奖励-回调 */
		private InvitationFrushList() {
			this.invitationList = [];
			for (let c in InvitationConfig) {
				let vo: InvitationVo = new InvitationVo();
				vo.num = Number(c);
				vo.content = "邀请满" + c + "人可领取";
				let reward = RewardConfig[InvitationConfig[c]["rewardID"]];
				let rewardlist = reward["reWrad"];
				vo.list = [];
				for (let r in rewardlist) {
					//道具奖励
					if (rewardlist[r][1] == RewardType.Item) {
						vo.list.push(new ItemVo(rewardlist[r][2], rewardlist[r][3]));
					}
				}
				vo.recive = MasterPlayer.Instance.getInvitation(Number(c));
				this.invitationList.push(vo);
			}
			this.list_invitation.array = this.invitationList;
			this.red_invitation.visible = ShareLogic.Instance.ShowRed();
		}

	}
}