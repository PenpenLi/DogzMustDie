var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("ShareBaseView", [
        { url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_share.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
    ]);
    var Type;
    (function (Type) {
        Type[Type["share"] = 0] = "share";
        Type[Type["invitation"] = 1] = "invitation";
    })(Type || (Type = {}));
    /**
     * @class 分享邀请页面
     * @author zhangyusong
     **/
    var ShareBaseView = /** @class */ (function (_super) {
        __extends(ShareBaseView, _super);
        function ShareBaseView() {
            var _this = _super.call(this) || this;
            _this.skin_1_up = "ui_rank/img-lan-xuan.png";
            _this.skin_1_down = "ui_rank/img-zi-xuan.png";
            _this.skin_2_up = "ui_rank/img-lan-weixuan.png";
            _this.skin_2_down = "ui_rank/img-zi-weixuan.png";
            _this.piclist = [
                "ui_icon/icon-tequan-hjzl.png",
                "ui_icon/icon-tequan-ssxjs.png",
                "ui_icon/icon-tequan-flhf.png",
                "ui_icon/icon-tequan-tjjy.png",
                "ui_icon/icon-tequan-jyjc.png",
            ];
            _this.SHARE_INFOR_ID = 6026;
            _this.SHARE_NOTICE_ID = 6027;
            _this.IMMEDIATELY_ID = 6030;
            _this.EVERY_DAY_ID = 6031;
            /** 邀请、领奖按钮类型 */
            _this.receiveType = 0;
            H52D_Framework.PfLog.Inst.SendClientLog(3000, 0);
            _this.ShareInit();
            _this.InvitationInit();
            _this.ChoosePage(Type.share);
            _this.EventInit();
            //屏蔽充值版
            if (H52D_Framework.IsShieldRecharge() && !H52D_Framework.IsAD()) {
                _this.imagebg2.y = 10;
                _this.imagebg2.height = 593;
                _this.imagebg1.visible = false;
            }
            //广告版
            if (H52D_Framework.IsAD()) {
                _this.btn_receive.visible = false;
                _this.tx_receive.visible = false;
                _this.tx_time.x = 388;
                _this.tx_time.y = 82;
            }
            return _this;
        }
        ShareBaseView.prototype.EventInit = function () {
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            H52D_Framework.Event.RegistEvent("InviteTodayNum", Laya.Handler.create(this, this.InvitationNum));
            H52D_Framework.Event.RegistEvent("ShareInit", Laya.Handler.create(this, this.ShareInit));
            H52D_Framework.Event.RegistEvent("InviteAwardFrush", Laya.Handler.create(this, this.InvitationFrushList));
            H52D_Framework.Event.RegistEvent("FrushVipTime", Laya.Handler.create(this, this.FrushVipTime));
            H52D_Framework.Event.RegistEvent("ZeroRefresh", Laya.Handler.create(this, this.ZeroRefresh));
            this.btn_close.on(Laya.Event.CLICK, this, this.OnClosePanel);
            this.btnlist_share.on(Laya.Event.CLICK, this, this.ChoosePage, [Type.share]);
            this.btnlist_invitation.on(Laya.Event.CLICK, this, this.ChoosePage, [Type.invitation]);
            this.btn_receive.on(Laya.Event.CLICK, this, this.OnInvitationReceive);
            //邀请也是分享
            this.btn_immediate.on(Laya.Event.CLICK, this, this.OnSharePanel);
            this.btn_share.on(Laya.Event.CLICK, this, this.OnSharePanel);
        };
        ShareBaseView.prototype.Destroy = function () {
            this.offAll();
            H52D_Framework.Tick.ClearAll(this);
            H52D_Framework.Event.RemoveEvent("FrushVipTime", Laya.Handler.create(this, this.FrushVipTime));
            H52D_Framework.Event.RemoveEvent("ZeroRefresh", Laya.Handler.create(this, this.ZeroRefresh));
            H52D_Framework.Event.RemoveEvent("InviteTodayNum", Laya.Handler.create(this, this.InvitationNum));
            H52D_Framework.Event.RemoveEvent("ShareInit", Laya.Handler.create(this, this.ShareInit));
        };
        ShareBaseView.prototype.OnClosePanel = function () {
            H52D_Framework.UIManager.Instance.DestroyUI(this.name, [H52D_Framework.ViewUpRoot]);
        };
        ShareBaseView.prototype.ChoosePage = function (t) {
            this.btnlist_share.skin = t == Type.share ? this.skin_1_down : this.skin_1_up;
            this.btnlist_invitation.skin = t == Type.invitation ? this.skin_2_down : this.skin_2_up;
            this.btnlist_share.labelColors = t == Type.share ? "#eff8bb" : "#bebbf8";
            this.btnlist_invitation.labelColors = t == Type.invitation ? "#eff8bb" : "#bebbf8";
            this.panel_share.visible = t == Type.share;
            this.panel_invitation.visible = t == Type.invitation;
        };
        ShareBaseView.prototype.OnSharePanel = function () {
            H52D_Framework.CallShare(H52D_Framework.ShareType.base);
        };
        /** 零点刷新 */
        ShareBaseView.prototype.ZeroRefresh = function () {
            this.InvitationFrush();
        };
        /*********************** 分享 ***********************/
        ShareBaseView.prototype.ShareInit = function () {
            var _this = this;
            H52D_Framework.SetHtmlStyle(this.tx_tequan, 20, "#b7abb9", "right", true);
            H52D_Framework.SetHtmlStyle(this.tx_content, 18, "#b7abb9", "left");
            H52D_Framework.SetHtmlStyle(this.tx_author, 22, "#5c545d", "right", true);
            this.tx_content.innerHTML = H52D_Framework.GetInfoAttr.Instance.GetText(this.SHARE_INFOR_ID);
            this.tx_author.innerHTML = H52D_Framework.GetInfoAttr.Instance.GetText(this.SHARE_NOTICE_ID);
            this.SharePrivilege();
            // 每一个特权次数
            this.shareRewardList = [];
            for (var i = 0; i < 5; i++) {
                var vo = new H52D_Framework.ShareRewardVo();
                this.shareRewardList.push(vo);
                this.shareRewardList[i].pic = this.piclist[i];
                this.shareRewardList[i].name = H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.PrivilegeConfig[i + 1].name);
                this.shareRewardList[i].num = H52D_Framework.MasterPlayer.Instance.getFreeUseNum(i + 1) || 0;
            }
            this.list_tequan.renderHandler = new Laya.Handler(this, function (item, index) {
                item.getChildByName("pic")["skin"] = _this.shareRewardList[index].pic;
                item.getChildByName("name")["text"] = _this.shareRewardList[index].name;
                item.getChildByName("num")["text"] = _this.shareRewardList[index].num;
            });
            this.list_tequan.array = this.shareRewardList;
        };
        /**
         * 免费特权次数
         * @param prv 特权次数
         * @param totle 总次数
         */
        ShareBaseView.prototype.SharePrivilege = function () {
            var totle = H52D_Framework.GameParamConfig["ShareDialyGetFreePrivilegeNum"];
            var prv = H52D_Framework.MasterPlayer.Instance.GetEventDayProByType(EventProEnum.ShareNum);
            if (prv > totle) {
                prv = totle;
            }
            this.tx_tequan.innerHTML = "今日已获得特权次数：<font color='#8edd7a'>" + prv + "</font>\/" + totle + "次";
        };
        /*********************** 邀请 ***********************/
        ShareBaseView.prototype.InvitationInit = function () {
            var _this = this;
            H52D_Framework.SetHtmlStyle(this.tx_invitation_today, 20, "#d8d9e2", "right");
            H52D_Framework.SetHtmlStyle(this.tx_invitation_totle, 20, "#d8d9e2", "right");
            this.tx_everyday.text = H52D_Framework.GetInfoAttr.Instance.GetSystemText(this.EVERY_DAY_ID, H52D_Framework.IsAD() ? 2 : 1);
            this.tx_immediately.text = H52D_Framework.GetInfoAttr.Instance.GetSystemText(this.IMMEDIATELY_ID);
            this.InvitationFrush();
            this.list_invitation.renderHandler = new Laya.Handler(this, function (item, index) {
                item.getChildByName("rankNum")["text"] = _this.invitationList[index].num;
                var itemList = _this.invitationList[index].list;
                var nFlag = 0;
                for (var i in itemList) {
                    var item_i = item.getChildByName("item_" + i);
                    item_i.getChildByName("itemIcon")["skin"] = H52D_Framework.GetIcon(itemList[i].strIconID_B);
                    item_i.getChildByName("itemName")["text"] = itemList[i].itemStrName;
                    item_i.getChildByName("itemNum")["text"] = itemList[i].itemNumber > 1 ? itemList[i].itemNumber : "";
                    item_i.getChildByName("itemName")["color"] = H52D_Framework.BaseDefine.LabelColor[itemList[i].dwItemQuality];
                    item_i.getChildByName("item_quaity")["bgColor"] = H52D_Framework.BaseDefine.ItemBgColor[itemList[i].dwItemQuality];
                    item_i.visible = true;
                    nFlag = Number(i) + 1;
                }
                for (var n = nFlag; n < 3; n++) {
                    var item_i = item.getChildByName("item_" + n);
                    item_i.visible = false;
                }
                var content = item.getChildByName("tx_invitation_content");
                var showBtn = _this.invitationList[index].num <= H52D_Framework.MasterPlayer.Instance.newInviteNum;
                content.visible = !showBtn;
                if (content.visible) {
                    content.text = _this.invitationList[index].content;
                }
                var btnReward = item.getChildByName("btn_reward");
                btnReward.visible = showBtn;
                btnReward.label = _this.invitationList[index].recive == 0 ? "领取" : "已领取";
                btnReward.mouseEnabled = _this.invitationList[index].recive == 0;
                btnReward.gray = _this.invitationList[index].recive != 0;
                btnReward.on(Laya.Event.CLICK, _this, _this.OnInvitationReward, [_this.invitationList[index].num]);
            });
            this.InvitationFrushList();
            this.red_invitation.visible = H52D_Framework.ShareLogic.Instance.ShowRed();
            //设置列表位置
            var reciveIndex = -1;
            var index = 0;
            for (; index < this.invitationList.length; index++) {
                var vo = this.invitationList[index];
                if (vo.num <= H52D_Framework.MasterPlayer.Instance.newInviteNum) {
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
        };
        /** 邀请、领奖按钮事件 */
        ShareBaseView.prototype.OnInvitationReceive = function () {
            if (this.receiveType == 1) { //邀请
                H52D_Framework.CallShare(H52D_Framework.ShareType.base);
            }
            else if (this.receiveType == 2) { //领取
                H52D_Framework.RemoteCall.Instance.Send("K_ReqGetInviteVip", H52D_Framework.IsAD());
            }
        };
        /** 领奖列表按钮事件 */
        ShareBaseView.prototype.OnInvitationReward = function (rewardID) {
            H52D_Framework.RemoteCall.Instance.Send("K_ReqGetInviteAward", rewardID);
        };
        /** 邀请-刷新 */
        ShareBaseView.prototype.InvitationFrush = function () {
            this.InvitationNum();
            this.FrushVipTime();
        };
        /** 邀请人数 */
        ShareBaseView.prototype.InvitationNum = function () {
            var daynum = H52D_Framework.MasterPlayer.Instance.GetEventDayProByType(EventProEnum.InvitationNum);
            if (H52D_Framework.IsAD()) {
                this.tx_invitation_today.innerHTML = "当日邀请人数：<font color='#8edd7a'>" + daynum + "</font>" + "人";
            }
            else {
                this.tx_invitation_today.innerHTML = "当日邀请人数：<font color='#8edd7a'>" + daynum + "</font>/" + H52D_Framework.GameParamConfig["VipNeedPlayerNum"] + "人";
            }
            var totlenum = H52D_Framework.MasterPlayer.Instance.newInviteNum;
            this.tx_invitation_totle.innerHTML = "已累计邀请：<font color='#8edd7a'>" + totlenum + "</font>人";
        };
        /** 刷新VIP时间 */
        ShareBaseView.prototype.FrushVipTime = function () {
            //永久VIP
            if (H52D_Framework.MasterPlayer.Instance.player.ExpirationTime == -1) {
                this.tx_time.text = "永久";
                this.btn_receive.gray = true;
                this.btn_receive.visible = false;
            }
            else {
                if (H52D_Framework.MasterPlayer.Instance.invitaVipTimes >= 5) {
                    this.btn_receive.label = "已达上限";
                    this.btn_receive.gray = true;
                    this.btn_receive.mouseEnabled = false;
                }
                else {
                    if (H52D_Framework.MasterPlayer.Instance.invitaVipFlag == 0) {
                        var canReceive = H52D_Framework.MasterPlayer.Instance.GetEventDayProByType(EventProEnum.InvitationNum) < H52D_Framework.GameParamConfig["VipNeedPlayerNum"];
                        this.receiveType = canReceive ? 1 : 2;
                        this.btn_receive.label = canReceive ? "邀请" : "领取";
                        this.btn_receive.gray = false;
                        this.btn_receive.mouseEnabled = true;
                    }
                    else { //倒计时
                        this.btn_receive.label = "今日已领取";
                        this.btn_receive.gray = true;
                        this.btn_receive.mouseEnabled = false;
                    }
                }
                this.countdown = 0;
                if (H52D_Framework.MasterPlayer.Instance.player.ExpirationTime > H52D_Framework.Time.serverSecodes) {
                    this.countdown = H52D_Framework.MasterPlayer.Instance.player.ExpirationTime - H52D_Framework.Time.serverSecodes;
                }
                if (this.countdown > 0) {
                    H52D_Framework.Tick.Loop(1000, this, this.ShowTime);
                }
                else {
                    this.tx_time.text = H52D_Framework.GetFormatNumTime(this.countdown);
                }
            }
        };
        ShareBaseView.prototype.ShowTime = function () {
            if (--this.countdown >= 0) {
                this.tx_time.text = H52D_Framework.GetFormatNumTime(this.countdown);
            }
            if (this.countdown <= 0) {
                H52D_Framework.Tick.Clear(this, this.ShowTime);
            }
        };
        /** 刷新界面，领取奖励-回调 */
        ShareBaseView.prototype.InvitationFrushList = function () {
            this.invitationList = [];
            for (var c in H52D_Framework.InvitationConfig) {
                var vo = new H52D_Framework.InvitationVo();
                vo.num = Number(c);
                vo.content = "邀请满" + c + "人可领取";
                var reward = H52D_Framework.RewardConfig[H52D_Framework.InvitationConfig[c]["rewardID"]];
                var rewardlist = reward["reWrad"];
                vo.list = [];
                for (var r in rewardlist) {
                    //道具奖励
                    if (rewardlist[r][1] == H52D_Framework.RewardType.Item) {
                        vo.list.push(new H52D_Framework.ItemVo(rewardlist[r][2], rewardlist[r][3]));
                    }
                }
                vo.recive = H52D_Framework.MasterPlayer.Instance.getInvitation(Number(c));
                this.invitationList.push(vo);
            }
            this.list_invitation.array = this.invitationList;
            this.red_invitation.visible = H52D_Framework.ShareLogic.Instance.ShowRed();
        };
        return ShareBaseView;
    }(ui.share.ShareBaseViewUI));
    H52D_Framework.ShareBaseView = ShareBaseView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ShareBaseView.js.map