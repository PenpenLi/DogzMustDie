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
    var ChatLineView = /** @class */ (function (_super) {
        __extends(ChatLineView, _super);
        function ChatLineView() {
            var _this = _super.call(this) || this;
            _this.on(Laya.Event.REMOVED, _this, _this.Destroy);
            return _this;
        }
        ChatLineView.prototype.Init = function (data) {
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
                var headId = data.headId;
                if (headId == 0) {
                    this.headImage.skin = "ui_head/icon_ui_01.png";
                }
                else {
                    this.headImage.skin = "ui_icon/" + H52D_Framework.HeroConfig[headId].strIcon;
                }
                this.headImage.on(Laya.Event.CLICK, this, function () {
                    if (data.roleID != H52D_Framework.MasterPlayer.Instance.player.ID) {
                        H52D_Framework.UIManager.Instance.CreateUI("InteractView", [H52D_Framework.ViewUpRoot, data.roleID, data.strName]);
                    }
                });
            }
            else {
                this.headImage.skin = "ui_chat/img-font-xitong.png";
                this.timeLabel.visible = false;
                this.channelLabel.visible = false;
                this.textfieldUp.visible = false;
            }
            // 频道名称
            this.channelLabel.text = ChateNameColor[data.smallChannel][0];
            this.channelLabel.color = ChateNameColor[data.smallChannel][1];
            H52D_Framework.SetHtmlStyle(this.textfieldUp, 20, ChateNameColor[data.smallChannel][1], "middle", true);
            H52D_Framework.SetHtmlStyle(this.textfieldDown, 20, ChateNameColor[data.smallChannel][1], "middle");
            //聊天时间
            this.timeLabel.text = data.time;
            var vipIcon = "";
            if (H52D_Framework.MasterPlayer.Instance.player.ID == data.roleID) {
                H52D_Framework.SetHtmlStyle(this.textfieldUp, 20, "#ffffff", "left", true);
            }
            else {
                H52D_Framework.SetHtmlStyle(this.textfieldUp, 20, "#5a456a", "left", true);
            }
            if (H52D_Framework.MasterPlayer.Instance.player.ID == data.roleID) {
                if (H52D_Framework.MasterPlayer.Instance.player.IsVip) {
                    vipIcon = "<img src= 'ui_camp/icn-vip-jiemian-tongyong.png' width='42px' height='22px'></img>";
                }
                this.textfieldUp.innerHTML = vipIcon + " 我";
                this.downBg.skin = "ui_chat/img-zijiduihuakuang-liaotian.png";
            }
            else {
                if (H52D_Framework.MasterPlayer.Instance.player.getIsVip(data.vipLevel)) {
                    vipIcon = "<img src= 'ui_camp/icn-vip-jiemian-tongyong.png' width='42px' height='22px'></img>";
                }
                this.textfieldUp.innerHTML = vipIcon + data.strName;
                this.downBg.skin = "ui_chat/img-duihuakuang-liaotian.png";
            }
            var msg = data.msg;
            if (msg.search("1~%") != -1) {
                msg = msg.replace("1~%", "");
                var tempArr = msg.split("~");
                var nime = H52D_Framework.GetHtmlStrByColor("【" + H52D_Framework.GetInfoAttr.Instance.GetText(H52D_Framework.ItemConfig[tempArr[2]].dwItemName) + "】", H52D_Framework.BaseDefine.LabelColor1[H52D_Framework.ItemConfig[tempArr[2]].dwItemQuality]);
                var nime1 = H52D_Framework.GetHtmlStrByColor(tempArr[1], H52D_Framework.BaseDefine.LabelColor1[H52D_Framework.ItemConfig[tempArr[2]].dwItemQuality]);
                this.textfieldDown.innerHTML = "赠送" + nime + "给" + nime1;
            }
            else {
                this.textfieldDown.innerHTML = H52D_Framework.ChatLogic.Inst.OnGetChatInfo(data.msg);
            }
        };
        /** 销毁 **/
        ChatLineView.prototype.dispose = function () {
            this.removeSelf();
        };
        ChatLineView.prototype.Destroy = function () {
            this.offAll();
        };
        return ChatLineView;
    }(ui.Chat.ChatLineViewUI));
    H52D_Framework.ChatLineView = ChatLineView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=ChatLineView.js.map