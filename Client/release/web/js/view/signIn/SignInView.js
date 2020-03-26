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
/**签到*/
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("SignInView", [
        { url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_sign.atlas", type: Laya.Loader.ATLAS },
        { url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
    ]);
    var SignInView = /** @class */ (function (_super) {
        __extends(SignInView, _super);
        function SignInView() {
            var _this = _super.call(this) || this;
            _this.Init();
            _this.AddEvent();
            return _this;
        }
        SignInView.prototype.Init = function () {
            this.UpDateList();
            var typeStr = H52D_Framework.GetInfoAttr.Instance.GetText(7007);
            var explainStr = H52D_Framework.GetInfoAttr.Instance.GetText(7008);
            this.type.text = typeStr;
            this.explain.text = explainStr;
        };
        /**添加事件 */
        SignInView.prototype.AddEvent = function () {
            this.on(Laya.Event.REMOVED, this, this.OnDestroy);
            this.close.on(Laya.Event.CLICK, this, this.CloseUI);
            H52D_Framework.Event.RegistEvent('UpDateList', Laya.Handler.create(this, this.UpDateList));
        };
        /**销毁按钮侦听器 */
        SignInView.prototype.OnDestroy = function () {
            this.offAll();
            H52D_Framework.Event.RemoveEvent('UpDateList', Laya.Handler.create(this, this.UpDateList));
        };
        /**关闭UI */
        SignInView.prototype.CloseUI = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("SignInView", [H52D_Framework.ViewUpRoot]);
            //播放按钮音效
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
        };
        SignInView.prototype.AddList = function () {
            var signIn_data = H52D_Framework.SignInLogic.Instance.ListData;
            var list_data = [];
            for (var i in signIn_data) {
                list_data[Number(i)] = [];
                list_data[Number(i)] = signIn_data[i];
            }
            this.signInList.array = list_data;
        };
        SignInView.prototype.UpDateList = function () {
            //this.signInList.array[SignInLogic.Instance.ToDayNum].bAlready = true;
            this.AddList();
            this.signInList.renderHandler = new Laya.Handler(this, this.SetSignInList);
            this.okBtn.on(Laya.Event.CLICK, this, this.ClickOkBtn);
            if (H52D_Framework.SignInLogic.Instance.ToDayAlr) {
                this.txt.text = "已领取";
                this.okBtn.gray = true;
                this.okBtn.off(Laya.Event.CLICK, this, this.ClickOkBtn);
            }
            else {
                this.txt.text = "领取";
                this.okBtn.gray = false;
            }
            this.ClickBtn(H52D_Framework.SignInLogic.Instance.ToDayNum);
        };
        /**
         * 设置每日奖励list样式
         * @param item 单个box
         * @param index 索引
        */
        SignInView.prototype.SetSignInList = function (item, index) {
            var bj = item.getChildByName("bj");
            var vip = item.getChildByName("vip");
            var opt = item.getChildByName("opt");
            var hui = item.getChildByName("hui");
            var name = item.getChildByName("name");
            var dayNum = item.getChildByName("dayNum");
            var already = item.getChildByName("already");
            var itemIcon = item.getChildByName("itemIcon");
            var clickBtn = item.getChildByName("clickBtn");
            var dayId = index + 1;
            var list_data = this.signInList.array[dayId];
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
            if (list_data.itemType == H52D_Framework.BaseDefine.ItemTypePro) {
                var itemCfg = H52D_Framework.ItemConfig[list_data.itemId];
                var iconUrl = itemCfg.strIconID_B;
                var nameString = H52D_Framework.GetInfoAttr.Instance.GetText(itemCfg.dwItemName);
                list_data.itemNum == 1 ? name.text = nameString : name.text = "x" + list_data.itemNum;
                name.color = H52D_Framework.BaseDefine.LabelColor[itemCfg.dwItemQuality];
                itemIcon.skin = "ui_icon/" + iconUrl;
            }
            clickBtn.on(Laya.Event.CLICK, this, this.ClickBtn, [dayId]);
            vip.visible = H52D_Framework.SignConfig[dayId].isVipDouble == 1;
        };
        /**点击触发 */
        SignInView.prototype.ClickBtn = function (index) {
            var signIn_data = H52D_Framework.SignInLogic.Instance.ListData;
            this.currentOpt = index;
            for (var i in signIn_data) {
                signIn_data[i].bOpt = false;
            }
            if (index < 1)
                return;
            signIn_data[index].bOpt = true;
            //signIn_data[SignInLogic.Instance.ToDayNum].bOpt = true;
            this.AddList();
            this.signInList.renderHandler = new Laya.Handler(this, this.SetSignInList);
        };
        /** 点击领取*/
        SignInView.prototype.ClickOkBtn = function () {
            if (H52D_Framework.IsAD()) {
                var times = H52D_Framework.AdvertisingManager.Instance.bnWXAdertisingTimes;
                if (times) {
                    H52D_Framework.UIManager.Instance.CreateUI("AdvertisementView", [H52D_Framework.ViewUpRoot, AdvertisementType.signIn]);
                }
                else {
                    H52D_Framework.SignInLogic.Instance.SendReqSignIn(); //普通签到
                }
            }
            else {
                H52D_Framework.SignInLogic.Instance.SendReqSignIn(); //普通签到
            }
            H52D_Framework.SoundManager.Instance.OnPlaySound("res/sound/check.mp3");
        };
        return SignInView;
    }(ui.signIn.SignInViewUI));
    H52D_Framework.SignInView = SignInView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=SignInView.js.map